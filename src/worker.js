import { getHTML } from './ui.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/parse' && request.method === 'POST') {
      return handleParse(request, env);
    }

    if (url.pathname === '/api/analyze-frames' && request.method === 'POST') {
      return handleAnalyzeFrames(request, env);
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders() });
    }

    return new Response(getHTML(), {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  },
};

async function handleParse(request, env) {
  try {
    const { source } = await request.json();
    if (!source || !source.trim()) {
      return json({ error: 'Please provide a URL or workout description' }, 400);
    }

    let content = source.trim();

    if (isURL(content)) {
      if (isInstagramURL(content)) {
        return json({ needsCaption: true, igUrl: content }, 200);
      }
      content = await fetchContent(content);
    }

    const workout = await extractWorkout(env.AI, content);
    return json(workout);
  } catch (e) {
    return json({ error: e.message || 'Failed to parse workout' }, 500);
  }
}

async function handleAnalyzeFrames(request, env) {
  try {
    const { frames, context } = await request.json();
    if (!frames || !frames.length) {
      return json({ error: 'No frames provided' }, 400);
    }

    const frameDescriptions = [];
    const visionModel = '@cf/meta/llama-3.2-11b-vision-instruct';

    const framesToAnalyze = frames.slice(0, 6);

    for (let i = 0; i < framesToAnalyze.length; i++) {
      const frame = framesToAnalyze[i];
      const base64 = frame.replace(/^data:image\/\w+;base64,/, '');
      const imageBytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));

      const response = await env.AI.run(visionModel, {
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'You are analyzing a frame from a workout video. Describe the exercise being performed in detail: exercise name, body position, movement phase (up/down/hold), which muscles are engaged, and any equipment used. Be specific and concise.'
              },
              {
                type: 'image',
                image: [...imageBytes],
              }
            ]
          }
        ],
        max_tokens: 300,
      });

      frameDescriptions.push({
        frameIndex: i,
        timestamp: framesToAnalyze[i].timestamp || i * 5,
        description: response.response || 'Could not analyze frame',
      });
    }

    const combinedAnalysis = frameDescriptions.map(
      (f, i) => `Frame ${i + 1} (${f.timestamp}s): ${f.description}`
    ).join('\n\n');

    const prompt = `Based on these video frame analyses from a workout video, create a structured workout plan.
${context ? 'Additional context: ' + context : ''}

Frame analyses:
${combinedAnalysis}

Identify all distinct exercises shown. For each exercise, determine proper form, duration/reps, and rest periods. If it looks like a circuit or HIIT workout, set appropriate cycles.`;

    const workout = await extractWorkout(env.AI, prompt);
    return json(workout);
  } catch (e) {
    return json({ error: e.message || 'Failed to analyze video frames' }, 500);
  }
}

function isURL(str) {
  try {
    const u = new URL(str);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

function isInstagramURL(str) {
  try {
    const host = new URL(str).hostname.replace('www.', '');
    return host === 'instagram.com' || host === 'instagr.am';
  } catch {
    return false;
  }
}

async function fetchContent(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
    },
    redirect: 'follow',
  });

  if (!res.ok) {
    if (res.status === 429 || res.status === 403) {
      throw new Error('This site blocks automated access. Please copy the workout text and paste it here directly.');
    }
    throw new Error(`Could not fetch URL (${res.status})`);
  }

  const html = await res.text();
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 8000);
}

async function extractWorkout(ai, content) {
  const response = await ai.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
    messages: [
      {
        role: 'system',
        content: `You extract structured workouts from text. Return ONLY valid JSON with this exact schema:
{
  "title": "string - workout name",
  "description": "string - brief description",
  "totalDuration": "string - e.g. 20 min",
  "cycles": number,
  "exercises": [
    {
      "name": "string",
      "duration": number (seconds),
      "rest": number (seconds, 0 if none),
      "reps": "string or null",
      "description": "string - how to do it properly, form cues",
      "muscleGroups": ["string"],
      "imageQuery": "string - a search term for finding an illustration of this exercise"
    }
  ]
}
If the content describes a circuit/HIIT, set cycles > 1. If no explicit timing, estimate reasonable defaults (30-45s work, 10-15s rest). Always include form cues in description.`
      },
      {
        role: 'user',
        content: `Extract the workout from this content:\n\n${content.slice(0, 6000)}`
      }
    ],
    max_tokens: 2000,
  });

  const text = response.response || '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Could not parse workout from content');

  const workout = JSON.parse(jsonMatch[0]);

  if (!workout.exercises || !workout.exercises.length) {
    throw new Error('No exercises found in the content');
  }

  return workout;
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
