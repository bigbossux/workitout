export function getHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>workitOut — Workout Timer</title>
<style>
  :root {
    --bg: #0a0a0f;
    --surface: #14141f;
    --surface2: #1e1e2e;
    --accent: #6366f1;
    --accent-glow: #818cf8;
    --green: #22c55e;
    --orange: #f59e0b;
    --red: #ef4444;
    --text: #e2e8f0;
    --muted: #64748b;
    --radius: 12px;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
  }
  .container { max-width: 640px; margin: 0 auto; padding: 24px 16px; }

  header { text-align: center; padding: 32px 0 24px; }
  header h1 { font-size: 2rem; font-weight: 800; letter-spacing: -0.5px; }
  header h1 span { color: var(--accent); }
  header p { color: var(--muted); margin-top: 4px; font-size: 0.9rem; }

  .input-section {
    background: var(--surface);
    border-radius: var(--radius);
    padding: 20px;
    margin-bottom: 16px;
  }
  .input-section label { font-size: 0.85rem; color: var(--muted); display: block; margin-bottom: 8px; }
  .input-row { display: flex; gap: 8px; }
  .input-row input {
    flex: 1;
    background: var(--surface2);
    border: 1px solid #2a2a3e;
    border-radius: 8px;
    padding: 12px 16px;
    color: var(--text);
    font-size: 1rem;
    outline: none;
    transition: border-color 0.2s;
  }
  .input-row input:focus { border-color: var(--accent); }
  .input-row input::placeholder { color: var(--muted); }
  button {
    background: var(--accent);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 12px 24px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
  }
  button:hover { background: var(--accent-glow); }
  button:disabled { opacity: 0.5; cursor: not-allowed; }
  .btn-sm { padding: 8px 16px; font-size: 0.85rem; }
  .btn-green { background: var(--green); }
  .btn-green:hover { background: #16a34a; }
  .btn-red { background: var(--red); }
  .btn-red:hover { background: #dc2626; }
  .btn-outline {
    background: transparent;
    border: 1px solid var(--muted);
    color: var(--muted);
  }
  .btn-outline:hover { border-color: var(--text); color: var(--text); }

  .divider {
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 16px; color: var(--muted); font-size: 0.8rem;
  }
  .divider::before, .divider::after {
    content: ''; flex: 1; height: 1px; background: #2a2a3e;
  }

  /* Upload section */
  .upload-section {
    background: var(--surface);
    border-radius: var(--radius);
    padding: 20px;
    margin-bottom: 24px;
  }
  .upload-section label { font-size: 0.85rem; color: var(--muted); display: block; margin-bottom: 12px; }
  .upload-methods { display: flex; gap: 8px; flex-wrap: wrap; }
  .upload-btn {
    flex: 1;
    min-width: 140px;
    background: var(--surface2);
    border: 2px dashed #2a2a3e;
    border-radius: 8px;
    padding: 20px 12px;
    color: var(--text);
    font-size: 0.85rem;
    cursor: pointer;
    text-align: center;
    transition: all 0.2s;
  }
  .upload-btn:hover { border-color: var(--accent); background: #1a1a2e; }
  .upload-btn .icon { font-size: 1.5rem; display: block; margin-bottom: 6px; }
  .upload-btn input { display: none; }

  /* Screen record */
  .record-section { display: none; margin-bottom: 16px; }
  .record-section.active { display: block; }
  .record-card {
    background: var(--surface);
    border-radius: var(--radius);
    padding: 20px;
    text-align: center;
  }
  .record-status { font-size: 0.9rem; color: var(--muted); margin-bottom: 12px; }
  .record-dot {
    display: inline-block;
    width: 10px; height: 10px;
    background: var(--red);
    border-radius: 50%;
    margin-right: 6px;
    animation: pulse 1s ease infinite;
  }
  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
  .record-timer { font-size: 2rem; font-weight: 800; font-variant-numeric: tabular-nums; margin-bottom: 16px; }
  .record-preview { margin-top: 12px; }
  .record-preview video {
    width: 100%; max-height: 300px;
    border-radius: 8px; background: #000;
  }

  /* Frame preview */
  .frames-preview { display: none; }
  .frames-preview.active { display: block; }
  .frames-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin: 12px 0;
  }
  .frames-grid img {
    width: 100%; aspect-ratio: 16/9;
    object-fit: cover;
    border-radius: 6px;
    border: 2px solid transparent;
  }
  .frame-count { font-size: 0.85rem; color: var(--muted); margin-bottom: 8px; }

  .loading {
    text-align: center;
    padding: 48px 0;
    display: none;
  }
  .loading.active { display: block; }
  .loading-text { color: var(--muted); font-size: 0.9rem; }
  .spinner {
    width: 40px; height: 40px;
    border: 3px solid var(--surface2);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: 0 auto 16px;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .error-msg {
    background: #1a0a0a;
    border: 1px solid var(--red);
    border-radius: 8px;
    padding: 12px 16px;
    color: var(--red);
    margin-bottom: 16px;
    display: none;
    font-size: 0.9rem;
  }
  .error-msg.active { display: block; }

  .workout-overview {
    background: var(--surface);
    border-radius: var(--radius);
    padding: 20px;
    margin-bottom: 16px;
    display: none;
  }
  .workout-overview.active { display: block; }
  .workout-overview h2 { font-size: 1.3rem; margin-bottom: 4px; }
  .workout-meta {
    display: flex; gap: 16px; margin-top: 12px; flex-wrap: wrap;
  }
  .meta-item {
    background: var(--surface2);
    border-radius: 8px;
    padding: 8px 14px;
    font-size: 0.85rem;
  }
  .meta-item strong { color: var(--accent-glow); }

  .exercise-list { display: none; margin-bottom: 16px; }
  .exercise-list.active { display: block; }
  .exercise-card {
    background: var(--surface);
    border-radius: var(--radius);
    padding: 16px;
    margin-bottom: 8px;
    display: flex;
    gap: 14px;
    align-items: flex-start;
    border-left: 3px solid var(--surface2);
    transition: border-color 0.2s;
  }
  .exercise-card.current { border-left-color: var(--accent); background: var(--surface2); }
  .exercise-card.done { opacity: 0.5; border-left-color: var(--green); }
  .ex-number {
    width: 28px; height: 28px;
    background: var(--surface2);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.8rem; font-weight: 700;
    flex-shrink: 0;
    color: var(--muted);
  }
  .exercise-card.current .ex-number { background: var(--accent); color: white; }
  .exercise-card.done .ex-number { background: var(--green); color: white; }
  .ex-info { flex: 1; }
  .ex-info h3 { font-size: 1rem; margin-bottom: 4px; }
  .ex-info .ex-desc { font-size: 0.8rem; color: var(--muted); line-height: 1.4; }
  .ex-info .ex-tags { margin-top: 6px; display: flex; gap: 4px; flex-wrap: wrap; }
  .ex-tag {
    background: var(--surface2);
    border-radius: 4px;
    padding: 2px 8px;
    font-size: 0.7rem;
    color: var(--accent-glow);
  }
  .ex-timing { text-align: right; font-size: 0.85rem; color: var(--muted); flex-shrink: 0; }
  .ex-timing strong { display: block; color: var(--text); font-size: 1rem; }

  .timer-screen {
    display: none;
    text-align: center;
    padding: 16px 0;
  }
  .timer-screen.active { display: block; }
  .timer-phase {
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 8px;
  }
  .timer-phase.work { color: var(--green); }
  .timer-phase.rest { color: var(--orange); }
  .timer-phase.ready { color: var(--accent); }
  .timer-exercise-name { font-size: 1.5rem; font-weight: 700; margin-bottom: 24px; }
  .timer-circle {
    position: relative;
    width: 220px; height: 220px;
    margin: 0 auto 24px;
  }
  .timer-circle svg { width: 100%; height: 100%; transform: rotate(-90deg); }
  .timer-circle .bg { fill: none; stroke: var(--surface2); stroke-width: 8; }
  .timer-circle .progress { fill: none; stroke-width: 8; stroke-linecap: round; transition: stroke-dashoffset 0.3s; }
  .timer-circle .progress.work { stroke: var(--green); }
  .timer-circle .progress.rest { stroke: var(--orange); }
  .timer-circle .progress.ready { stroke: var(--accent); }
  .timer-time {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    font-size: 3.5rem;
    font-weight: 800;
    font-variant-numeric: tabular-nums;
  }
  .timer-cycle { font-size: 0.9rem; color: var(--muted); margin-bottom: 8px; }
  .timer-progress-text { font-size: 0.85rem; color: var(--muted); margin-bottom: 20px; }
  .timer-controls { display: flex; gap: 8px; justify-content: center; margin-bottom: 20px; }
  .timer-form-guide {
    background: var(--surface);
    border-radius: var(--radius);
    padding: 16px;
    text-align: left;
    margin-top: 16px;
  }
  .timer-form-guide h4 { font-size: 0.85rem; color: var(--accent-glow); margin-bottom: 8px; }
  .timer-form-guide p { font-size: 0.85rem; color: var(--muted); line-height: 1.5; }

  .done-screen { display: none; text-align: center; padding: 48px 0; }
  .done-screen.active { display: block; }
  .done-screen h2 { font-size: 2rem; margin-bottom: 8px; }
  .done-screen p { color: var(--muted); }
  .done-stats {
    display: flex; gap: 16px; justify-content: center; margin: 24px 0; flex-wrap: wrap;
  }
  .done-stat {
    background: var(--surface);
    border-radius: var(--radius);
    padding: 16px 24px;
    text-align: center;
  }
  .done-stat .val { font-size: 1.5rem; font-weight: 800; color: var(--green); }
  .done-stat .label { font-size: 0.75rem; color: var(--muted); margin-top: 2px; }

  @media (max-width: 480px) {
    .timer-time { font-size: 2.8rem; }
    .timer-circle { width: 180px; height: 180px; }
    .upload-methods { flex-direction: column; }
  }
</style>
</head>
<body>
<div class="container">
  <header>
    <h1>workit<span>Out</span></h1>
    <p>Paste a link, upload a video, or describe your workout</p>
  </header>

  <div id="inputArea">
    <div class="input-section" id="inputSection">
      <label>Paste a URL or describe the workout</label>
      <div class="input-row">
        <input type="text" id="sourceInput" placeholder="Article URL or describe: '4 rounds: 20 pushups, 30s plank, 15 squats'" />
        <button id="parseBtn" onclick="parseWorkout()">Go</button>
      </div>
    </div>

    <div class="divider">or</div>

    <div class="upload-section" id="uploadSection">
      <label>Upload a workout video or screenshots for AI analysis</label>
      <div class="upload-methods">
        <label class="upload-btn" id="videoUploadBtn">
          <span class="icon">&#127909;</span>
          Upload Video
          <input type="file" id="videoInput" accept="video/*" onchange="handleVideoUpload(event)" />
        </label>
        <label class="upload-btn" id="imageUploadBtn">
          <span class="icon">&#128247;</span>
          Upload Screenshots
          <input type="file" id="imageInput" accept="image/*" multiple onchange="handleImageUpload(event)" />
        </label>
        <div class="upload-btn" id="screenRecordBtn" onclick="startScreenRecord()">
          <span class="icon">&#128308;</span>
          Record Screen
        </div>
      </div>
    </div>
  </div>

  <div class="record-section" id="recordSection">
    <div class="record-card">
      <div class="record-status"><span class="record-dot"></span>Recording screen...</div>
      <div class="record-timer" id="recordTimer">0:00</div>
      <p style="color:var(--muted);font-size:0.85rem;margin-bottom:16px;">Play the workout video on Instagram or any app, then stop when done.</p>
      <div style="display:flex;gap:8px;justify-content:center;">
        <button class="btn-red btn-sm" onclick="stopScreenRecord()">Stop Recording</button>
        <button class="btn-outline btn-sm" onclick="cancelScreenRecord()">Cancel</button>
      </div>
    </div>
  </div>

  <div class="frames-preview" id="framesPreview">
    <div class="record-card" style="background:var(--surface);border-radius:var(--radius);padding:20px;">
      <div class="frame-count" id="frameCount"></div>
      <div class="frames-grid" id="framesGrid"></div>
      <div style="display:flex;gap:8px;justify-content:center;margin-top:12px;">
        <button class="btn-green" id="analyzeBtn" onclick="analyzeFrames()">Analyze with AI</button>
        <button class="btn-outline btn-sm" onclick="resetAll()">Cancel</button>
      </div>
    </div>
  </div>

  <div class="loading" id="loading">
    <div class="spinner"></div>
    <p class="loading-text" id="loadingText">Analyzing workout...</p>
  </div>

  <div class="error-msg" id="errorMsg"></div>

  <div class="workout-overview" id="overview">
    <h2 id="workoutTitle"></h2>
    <p id="workoutDesc" style="color:var(--muted);font-size:0.9rem;"></p>
    <div class="workout-meta" id="workoutMeta"></div>
    <div style="margin-top:16px;display:flex;gap:8px;">
      <button class="btn-green" onclick="startWorkout()">Start Workout</button>
      <button class="btn-outline btn-sm" onclick="resetAll()">Change</button>
    </div>
  </div>

  <div class="exercise-list" id="exerciseList"></div>

  <div class="timer-screen" id="timerScreen">
    <div class="timer-cycle" id="timerCycle"></div>
    <div class="timer-phase ready" id="timerPhase">GET READY</div>
    <div class="timer-exercise-name" id="timerExName"></div>
    <div class="timer-circle">
      <svg viewBox="0 0 100 100">
        <circle class="bg" cx="50" cy="50" r="42" />
        <circle class="progress ready" id="timerProgress" cx="50" cy="50" r="42"
          stroke-dasharray="263.89" stroke-dashoffset="0" />
      </svg>
      <div class="timer-time" id="timerTime">0:00</div>
    </div>
    <div class="timer-progress-text" id="timerProgressText"></div>
    <div class="timer-controls">
      <button class="btn-sm" id="pauseBtn" onclick="togglePause()">Pause</button>
      <button class="btn-sm btn-outline" onclick="skipExercise()">Skip</button>
      <button class="btn-sm btn-red" onclick="stopWorkout()">Stop</button>
    </div>
    <div class="timer-form-guide" id="formGuide">
      <h4>Form Guide</h4>
      <p id="guideText"></p>
    </div>
  </div>

  <div class="done-screen" id="doneScreen">
    <h2>Workout Complete!</h2>
    <p>Great job.</p>
    <div class="done-stats" id="doneStats"></div>
    <button onclick="resetAll()">New Workout</button>
  </div>
</div>

<canvas id="frameCanvas" style="display:none;"></canvas>
<video id="hiddenVideo" style="display:none;"></video>

<script>
  let workout = null;
  let timerInterval = null;
  let paused = false;
  let currentCycle = 0;
  let currentExIndex = 0;
  let currentPhase = 'work';
  let secondsLeft = 0;
  let startTime = 0;
  let extractedFrames = [];

  let mediaRecorder = null;
  let recordedChunks = [];
  let recordStartTime = 0;
  let recordTimerInterval = null;

  const CIRCUMFERENCE = 2 * Math.PI * 42;
  const $ = id => document.getElementById(id);

  // --- URL / text parsing ---
  async function parseWorkout() {
    const source = $('sourceInput').value.trim();
    if (!source) return;

    showLoading('Analyzing workout...');
    $('parseBtn').disabled = true;

    try {
      const res = await fetch('/api/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      if (data.needsCaption) {
        hideLoading();
        $('parseBtn').disabled = false;
        showError('Instagram videos need to be recorded or uploaded. Use "Record Screen" to capture the video while playing it on Instagram, or upload a screen recording.');
        return;
      }
      workout = data;
      showOverview();
    } catch (e) {
      showError(e.message);
    } finally {
      hideLoading();
      $('parseBtn').disabled = false;
    }
  }

  $('sourceInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') parseWorkout();
  });

  // --- Video upload ---
  function handleVideoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    extractFramesFromFile(file);
  }

  function handleImageUpload(e) {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    extractedFrames = [];
    let loaded = 0;

    files.forEach((file, i) => {
      const reader = new FileReader();
      reader.onload = () => {
        extractedFrames.push(reader.result);
        loaded++;
        if (loaded === files.length) showFramesPreview();
      };
      reader.readAsDataURL(file);
    });
  }

  function extractFramesFromFile(file) {
    showLoading('Extracting frames from video...');
    hideInputArea();

    const video = $('hiddenVideo');
    const url = URL.createObjectURL(file);
    video.src = url;

    video.onloadedmetadata = () => {
      video.currentTime = 0;
    };

    video.onloadeddata = () => {
      const duration = video.duration;
      const frameCount = Math.min(6, Math.max(3, Math.floor(duration / 5)));
      const interval = duration / (frameCount + 1);
      const frames = [];
      let captured = 0;

      function captureFrame() {
        const canvas = $('frameCanvas');
        canvas.width = Math.min(video.videoWidth, 640);
        canvas.height = Math.min(video.videoHeight, 480);
        const scale = Math.min(canvas.width / video.videoWidth, canvas.height / video.videoHeight);
        const w = video.videoWidth * scale;
        const h = video.videoHeight * scale;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
        frames.push(canvas.toDataURL('image/jpeg', 0.8));
        captured++;

        if (captured < frameCount) {
          video.currentTime = interval * (captured + 1);
        } else {
          URL.revokeObjectURL(url);
          extractedFrames = frames;
          hideLoading();
          showFramesPreview();
        }
      }

      video.onseeked = captureFrame;
      video.currentTime = interval;
    };

    video.onerror = () => {
      URL.revokeObjectURL(url);
      hideLoading();
      showInputArea();
      showError('Could not read the video file. Try a different format or upload screenshots instead.');
    };
  }

  // --- Screen recording ---
  async function startScreenRecord() {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: 'screen' },
        audio: false,
      });

      recordedChunks = [];
      mediaRecorder = new MediaRecorder(stream, { mimeType: getSupportedMime() });

      mediaRecorder.ondataavailable = e => {
        if (e.data.size > 0) recordedChunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach(t => t.stop());
        clearInterval(recordTimerInterval);

        if (recordedChunks.length === 0) {
          showInputArea();
          return;
        }

        const blob = new Blob(recordedChunks, { type: recordedChunks[0].type });
        extractFramesFromFile(blob);
      };

      stream.getVideoTracks()[0].onended = () => {
        if (mediaRecorder.state === 'recording') mediaRecorder.stop();
      };

      mediaRecorder.start(1000);
      recordStartTime = Date.now();
      hideInputArea();
      $('recordSection').classList.add('active');
      updateRecordTimer();
      recordTimerInterval = setInterval(updateRecordTimer, 1000);

    } catch (e) {
      if (e.name !== 'NotAllowedError') {
        showError('Screen recording failed: ' + e.message);
      }
    }
  }

  function getSupportedMime() {
    const types = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm', 'video/mp4'];
    return types.find(t => MediaRecorder.isTypeSupported(t)) || '';
  }

  function updateRecordTimer() {
    const elapsed = Math.floor((Date.now() - recordStartTime) / 1000);
    const min = Math.floor(elapsed / 60);
    const sec = String(elapsed % 60).padStart(2, '0');
    $('recordTimer').textContent = min + ':' + sec;
  }

  function stopScreenRecord() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
    }
    $('recordSection').classList.remove('active');
  }

  function cancelScreenRecord() {
    recordedChunks = [];
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
    }
    clearInterval(recordTimerInterval);
    $('recordSection').classList.remove('active');
    showInputArea();
  }

  // --- Frame preview + analysis ---
  function showFramesPreview() {
    $('frameCount').textContent = extractedFrames.length + ' frames captured — ready for AI analysis';
    $('framesGrid').innerHTML = extractedFrames.map(
      f => '<img src="' + f + '" />'
    ).join('');
    $('framesPreview').classList.add('active');
  }

  async function analyzeFrames() {
    showLoading('AI is analyzing ' + extractedFrames.length + ' frames...');
    $('framesPreview').classList.remove('active');

    try {
      const res = await fetch('/api/analyze-frames', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ frames: extractedFrames }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      workout = data;
      showOverview();
    } catch (e) {
      showError(e.message);
      $('framesPreview').classList.add('active');
    } finally {
      hideLoading();
    }
  }

  // --- UI helpers ---
  function showLoading(text) {
    $('loadingText').textContent = text || 'Analyzing workout...';
    $('loading').classList.add('active');
    $('errorMsg').classList.remove('active');
  }
  function hideLoading() { $('loading').classList.remove('active'); }
  function showError(msg) {
    $('errorMsg').textContent = msg;
    $('errorMsg').classList.add('active');
  }
  function hideInputArea() { $('inputArea').style.display = 'none'; }
  function showInputArea() { $('inputArea').style.display = ''; }

  // --- Workout overview ---
  function showOverview() {
    if (!workout || !workout.exercises || !workout.exercises.length) {
      showError('Could not extract exercises. Try uploading a clearer video or more screenshots.');
      return;
    }
    hideInputArea();
    $('workoutTitle').textContent = workout.title || 'Workout';
    $('workoutDesc').textContent = workout.description || '';

    const totalWork = workout.exercises.reduce((s, e) => s + (e.duration || 0), 0);
    const totalRest = workout.exercises.reduce((s, e) => s + (e.rest || 0), 0);
    const cycles = workout.cycles || 1;
    const totalMin = Math.ceil((totalWork + totalRest) * cycles / 60);

    $('workoutMeta').innerHTML =
      '<div class="meta-item"><strong>' + workout.exercises.length + '</strong> exercises</div>' +
      '<div class="meta-item"><strong>' + cycles + '</strong> cycle' + (cycles > 1 ? 's' : '') + '</div>' +
      '<div class="meta-item"><strong>~' + totalMin + '</strong> min</div>';

    let listHTML = '';
    workout.exercises.forEach((ex, i) => {
      const tags = (ex.muscleGroups || []).map(m => '<span class="ex-tag">' + esc(m) + '</span>').join('');
      listHTML += '<div class="exercise-card" id="exCard' + i + '">' +
        '<div class="ex-number">' + (i + 1) + '</div>' +
        '<div class="ex-info"><h3>' + esc(ex.name) + '</h3>' +
        '<div class="ex-desc">' + esc(ex.description || '') + '</div>' +
        '<div class="ex-tags">' + tags + '</div></div>' +
        '<div class="ex-timing"><strong>' + ex.duration + 's</strong>' +
        (ex.rest ? ex.rest + 's rest' : '') +
        (ex.reps ? '<br>' + esc(ex.reps) : '') +
        '</div></div>';
    });

    $('exerciseList').innerHTML = listHTML;
    $('overview').classList.add('active');
    $('exerciseList').classList.add('active');
  }

  // --- Timer ---
  function startWorkout() {
    currentCycle = 0;
    currentExIndex = 0;
    currentPhase = 'ready';
    secondsLeft = 5;
    paused = false;
    startTime = Date.now();

    $('overview').classList.remove('active');
    $('exerciseList').classList.remove('active');
    $('timerScreen').classList.add('active');

    updateTimerDisplay();
    loadExerciseGuide();
    tick();
    timerInterval = setInterval(tick, 1000);
    beep(440, 100);
  }

  function tick() {
    if (paused) return;
    if (secondsLeft <= 0) { advance(); return; }
    secondsLeft--;
    updateTimerDisplay();
    if (secondsLeft <= 3 && secondsLeft > 0) beep(660, 80);
    if (secondsLeft === 0) beep(880, 200);
  }

  function advance() {
    const cycles = workout.cycles || 1;
    const exercises = workout.exercises;

    if (currentPhase === 'ready') {
      currentPhase = 'work';
      secondsLeft = exercises[0].duration;
      updateTimerDisplay();
      loadExerciseGuide();
      return;
    }

    if (currentPhase === 'work') {
      const rest = exercises[currentExIndex].rest || 0;
      if (rest > 0) {
        currentPhase = 'rest';
        secondsLeft = rest;
        updateTimerDisplay();
        return;
      }
    }

    currentExIndex++;
    if (currentExIndex >= exercises.length) {
      currentCycle++;
      if (currentCycle >= cycles) { finishWorkout(); return; }
      currentExIndex = 0;
    }

    currentPhase = 'work';
    secondsLeft = exercises[currentExIndex].duration;
    updateTimerDisplay();
    loadExerciseGuide();
    highlightCurrent();
  }

  function updateTimerDisplay() {
    const min = Math.floor(secondsLeft / 60);
    const sec = String(secondsLeft % 60).padStart(2, '0');
    $('timerTime').textContent = min + ':' + sec;

    const phase = $('timerPhase');
    phase.className = 'timer-phase ' + currentPhase;
    phase.textContent = currentPhase === 'ready' ? 'GET READY' : currentPhase === 'work' ? 'WORK' : 'REST';

    const ex = workout.exercises[currentExIndex];
    $('timerExName').textContent = currentPhase === 'ready' ? 'Starting soon...' : (ex ? ex.name : '');

    const cycles = workout.cycles || 1;
    $('timerCycle').textContent = 'Cycle ' + (currentCycle + 1) + ' / ' + cycles;
    $('timerProgressText').textContent = 'Exercise ' + (currentExIndex + 1) + ' of ' + workout.exercises.length;

    const maxTime = currentPhase === 'work' ? (ex ? ex.duration : 1) :
                    currentPhase === 'rest' ? (ex ? ex.rest : 1) : 5;
    const fraction = secondsLeft / maxTime;
    const offset = CIRCUMFERENCE * fraction;
    const prog = $('timerProgress');
    prog.setAttribute('stroke-dashoffset', String(CIRCUMFERENCE - offset));
    prog.className.baseVal = 'progress ' + currentPhase;
  }

  function loadExerciseGuide() {
    const ex = workout.exercises[currentExIndex];
    if (!ex) return;
    $('guideText').textContent = ex.description || 'Perform the exercise with controlled form.';
  }

  function highlightCurrent() {
    workout.exercises.forEach((_, i) => {
      const card = $('exCard' + i);
      if (!card) return;
      card.classList.remove('current', 'done');
      if (i < currentExIndex) card.classList.add('done');
      if (i === currentExIndex) card.classList.add('current');
    });
  }

  function togglePause() {
    paused = !paused;
    $('pauseBtn').textContent = paused ? 'Resume' : 'Pause';
  }

  function skipExercise() { secondsLeft = 0; advance(); }

  function stopWorkout() {
    clearInterval(timerInterval);
    $('timerScreen').classList.remove('active');
    $('overview').classList.add('active');
    $('exerciseList').classList.add('active');
  }

  function finishWorkout() {
    clearInterval(timerInterval);
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    const min = Math.floor(elapsed / 60);
    const cycles = workout.cycles || 1;
    const totalEx = workout.exercises.length * cycles;

    $('timerScreen').classList.remove('active');
    $('doneScreen').classList.add('active');
    $('doneStats').innerHTML =
      '<div class="done-stat"><div class="val">' + min + '</div><div class="label">minutes</div></div>' +
      '<div class="done-stat"><div class="val">' + totalEx + '</div><div class="label">exercises</div></div>' +
      '<div class="done-stat"><div class="val">' + cycles + '</div><div class="label">cycles</div></div>';

    beep(523, 150); setTimeout(() => beep(659, 150), 200); setTimeout(() => beep(784, 300), 400);
  }

  function resetAll() {
    workout = null;
    extractedFrames = [];
    clearInterval(timerInterval);
    ['overview', 'exerciseList', 'timerScreen', 'doneScreen', 'loading', 'errorMsg', 'framesPreview', 'recordSection'].forEach(id => {
      $(id).classList.remove('active');
    });
    showInputArea();
    $('sourceInput').value = '';
    $('videoInput').value = '';
    $('imageInput').value = '';
  }

  function esc(s) {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  let audioCtx;
  function beep(freq, ms) {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.connect(g); g.connect(audioCtx.destination);
      o.frequency.value = freq;
      g.gain.value = 0.15;
      o.start(); o.stop(audioCtx.currentTime + ms / 1000);
    } catch {}
  }
</script>
</body>
</html>`;
}
