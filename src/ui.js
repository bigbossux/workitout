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
    margin-bottom: 24px;
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

  .loading {
    text-align: center;
    padding: 48px 0;
    display: none;
  }
  .loading.active { display: block; }
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

  /* Workout overview */
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

  /* Exercise list */
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

  /* Timer screen */
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
  .timer-cycle {
    font-size: 0.9rem;
    color: var(--muted);
    margin-bottom: 8px;
  }
  .timer-progress-text {
    font-size: 0.85rem;
    color: var(--muted);
    margin-bottom: 20px;
  }
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
  .timer-form-guide .guide-img {
    width: 100%;
    max-height: 200px;
    object-fit: contain;
    border-radius: 8px;
    margin-bottom: 10px;
    background: var(--surface2);
  }

  /* Done screen */
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
  }
</style>
</head>
<body>
<div class="container">
  <header>
    <h1>workit<span>Out</span></h1>
    <p>Paste a URL or describe a workout — get a guided timer</p>
  </header>

  <div class="input-section" id="inputSection">
    <label>Instagram video URL, article link, or describe your workout</label>
    <div class="input-row">
      <input type="text" id="sourceInput" placeholder="https://instagram.com/p/... or '4 rounds: 20 pushups, 30s plank, 15 squats'" />
      <button id="parseBtn" onclick="parseWorkout()">Go</button>
    </div>
  </div>

  <div class="loading" id="loading">
    <div class="spinner"></div>
    <p>Analyzing workout...</p>
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
      <img class="guide-img" id="guideImg" alt="" style="display:none;" />
      <h4>Form Guide</h4>
      <p id="guideText"></p>
    </div>
  </div>

  <div class="done-screen" id="doneScreen">
    <h2>Workout Complete!</h2>
    <p>Great job — you crushed it.</p>
    <div class="done-stats" id="doneStats"></div>
    <button onclick="resetAll()">New Workout</button>
  </div>
</div>

<script>
  let workout = null;
  let timerInterval = null;
  let paused = false;
  let currentCycle = 0;
  let currentExIndex = 0;
  let currentPhase = 'work';
  let secondsLeft = 0;
  let totalDuration = 0;
  let startTime = 0;

  const CIRCUMFERENCE = 2 * Math.PI * 42;

  const $ = id => document.getElementById(id);

  async function parseWorkout() {
    const source = $('sourceInput').value.trim();
    if (!source) return;

    $('loading').classList.add('active');
    $('errorMsg').classList.remove('active');
    $('parseBtn').disabled = true;

    try {
      const res = await fetch('/api/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      workout = data;
      showOverview();
    } catch (e) {
      $('errorMsg').textContent = e.message;
      $('errorMsg').classList.add('active');
    } finally {
      $('loading').classList.remove('active');
      $('parseBtn').disabled = false;
    }
  }

  $('sourceInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') parseWorkout();
  });

  function showOverview() {
    $('inputSection').style.display = 'none';
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
    if (secondsLeft <= 0) {
      advance();
      return;
    }
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
      if (currentCycle >= cycles) {
        finishWorkout();
        return;
      }
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

    const total = workout.exercises.length;
    $('timerProgressText').textContent = 'Exercise ' + (currentExIndex + 1) + ' of ' + total;

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

    const img = $('guideImg');
    if (ex.imageQuery) {
      img.src = 'https://api.dicebear.com/9.x/shapes/svg?seed=' + encodeURIComponent(ex.name);
      img.alt = ex.name;
      img.style.display = 'block';
    } else {
      img.style.display = 'none';
    }
  }

  function highlightCurrent() {
    workout.exercises.forEach((_, i) => {
      const card = $('exCard' + i);
      if (!card) return;
      card.classList.remove('current', 'done');
      if (i < currentExIndex || (currentCycle > 0 && i < workout.exercises.length)) {
        card.classList.add('done');
      }
      if (i === currentExIndex) card.classList.add('current');
    });
  }

  function togglePause() {
    paused = !paused;
    $('pauseBtn').textContent = paused ? 'Resume' : 'Pause';
  }

  function skipExercise() {
    secondsLeft = 0;
    if (currentPhase === 'rest') advance();
    else advance();
  }

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
    clearInterval(timerInterval);
    ['overview', 'exerciseList', 'timerScreen', 'doneScreen', 'loading', 'errorMsg'].forEach(id => {
      $(id).classList.remove('active');
    });
    $('inputSection').style.display = '';
    $('sourceInput').value = '';
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
