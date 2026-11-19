/* Plantilla jugable: «¿Va o no va?». Seis cartas, una pregunta por carta, explicación tras cada
 * respuesta, final con resultado y llamada a la acción. Tiene todas las fases de docs/02-pantallas.md.
 * Para un juego nuevo: cambia CONFIG y el contenido; la mecánica se cambia en «Turnos».
 * El contenido de ejemplo (la paella valenciana) es solo para que la plantilla se pueda jugar. */
(function () {
  'use strict';
  const { $, esc, T, REDUCE, sound } = GK;

  // ── Configuración y contenido ───────────────────────────────────────────────
  const CONFIG = {
    brand: 'kit<b>.</b>',
    title: '¿Sabrías hacer una paella valenciana de verdad?',
    rules: ['Te enseñamos seis ingredientes, uno cada vez.', 'Decide si va o no va.', 'Con 4 aciertos, ganas.'],
    question: (it) => `¿${it.label} va en una paella valenciana?`,
    winAt: 4,
    cta: { text: 'Esto es una plantilla. Cambia el contenido y la llamada a la acción.', button: 'Ver el kit', url: 'https://github.com/' },
    storageKey: 'kit_tut',
    note: 'Plantilla del kit de juegos. Contenido de ejemplo.',
  };
  // ok: la respuesta correcta. why: la explicación que se enseña siempre, aciertes o no.
  const ITEMS = [
    { label: 'El pollo', ok: true, why: 'Es una de las carnes de la receta tradicional, junto al conejo.' },
    { label: 'El conejo', ok: true, why: 'Pollo y conejo son las dos carnes de la receta.' },
    { label: 'El garrofó', ok: true, why: 'Es la judía blanca grande que lleva la receta.' },
    { label: 'El chorizo', ok: false, why: 'No forma parte de la receta tradicional.' },
    { label: 'La cebolla', ok: false, why: 'No está en la lista de ingredientes de la receta tradicional.' },
    { label: 'La judía ferraura', ok: true, why: 'Es la judía verde plana de la receta.' },
  ];

  // ── Escena 3D ───────────────────────────────────────────────────────────────
  const canvas = $('#c');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2)); renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const css = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const BG = new THREE.Color(css('--bg') || '#0a0a0a'), ACCENT = new THREE.Color(css('--accent') || '#94dd45');
  const scene = new THREE.Scene(); scene.background = BG; scene.fog = new THREE.Fog(BG, 14, 28);
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 80);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x1b1e19, 0.7));
  const sun = new THREE.DirectionalLight(0xffffff, 0.85); sun.position.set(-3, 9, 7); sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6, near: 1, far: 24 }); sun.shadow.bias = -0.0005; scene.add(sun);
  const std = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.7, metalness: 0.05 }, o));
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), std(0x101210, { roughness: 1 })); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
  const step = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.4, 1.6), std(0x1b1e19)); step.position.set(0, 0.2, -0.2); step.receiveShadow = step.castShadow = true; scene.add(step);

  // Cara de cada carta: un lienzo con el texto grande. Para dibujos, ver drawFace en juegos/quien-es-quien.
  function face(it) {
    const cv = document.createElement('canvas'); cv.width = 256; cv.height = 336; const g = cv.getContext('2d');
    g.fillStyle = '#f4f4f5'; g.fillRect(0, 0, 256, 336);
    g.fillStyle = '#0a0a0a'; g.textAlign = 'center'; g.font = '700 34px "Space Grotesk", system-ui, sans-serif';
    const words = it.label.split(' '); words.forEach((w, i) => g.fillText(w, 128, 168 + (i - (words.length - 1) / 2) * 36));
    g.fillStyle = css('--accent') || '#94dd45'; g.fillRect(96, 286, 64, 8);
    return cv;
  }
  const COLS = 3, GAP = 1.3;
  let cards = [];
  function deal(items) {
    cards.forEach(x => scene.remove(x.pivot));
    cards = items.map((it, i) => {
      const x = GK.card({ front: face(it), back: ACCENT.getHex() });
      const r = Math.floor(i / COLS), k = i % COLS;
      x.baseY = r === 0 ? 0.405 : 0.005;           // fila de atrás sobre el escalón
      x.pivot.position.set((k - (COLS - 1) / 2) * GAP, x.baseY, r === 0 ? -0.6 : 1.1);
      x.item = it; x.lift = 0; x.liftTarget = 0;
      if (!REDUCE) { x.angle = GK.FLAT; x.delay = 0.2 + i * 0.07; } // reparto: se levantan en cascada
      scene.add(x.pivot); return x;
    });
  }

  const rig = GK.rig(camera, renderer, {
    desktop: { base: [0, 5.2, 6.6], look: [0, 0.8, 0.4], fov: 40, dx: 0 },
    portrait: { base: [0, 8.2, 7.2], look: [0, 0.5, 0.3], fov: 50, dy: 0.1 },
  });

  // ── Estado ─────────────────────────────────────────────────────────────────
  let st = null;
  const coach = GK.coach({
    storageKey: CONFIG.storageKey,
    steps: [
      { el: '.hud', text: 'Te enseñamos una carta cada vez. Aquí ves cuántas llevas y tus aciertos.', next: 'Vale' },
      { el: '.choices', text: 'Decide: ¿va o no va? En la práctica no cuenta.', wait: 'answer' },
      { el: '#ol', text: 'Siempre te explicamos por qué. Pulsa Siguiente.', wait: 'siguiente', whenVisible: true },
      { el: '.hud', text: 'Así con las seis. Fin de la práctica: ahora empieza la partida de verdad.', next: 'Empezar la partida' },
    ],
    onEnd() { GK.overlay.hide(); newGame(); GK.announce('Ahora, la partida de verdad', 'good'); },
  });

  function newGame() {
    GK.cancelAll(); GK.end('');
    const items = ITEMS.slice().sort(() => Math.random() - 0.5);
    st = { items, idx: 0, hits: 0, answers: [], phase: 'ask', over: null };
    deal(items); rig.dollyFrom(1.18); lift();
    document.querySelectorAll('.confetti').forEach(n => n.remove());
    render();
  }
  const current = () => cards[st.idx];
  function lift() { cards.forEach((x, i) => { x.liftTarget = i === st.idx && !st.over ? 1 : 0; }); }

  // ── Panel: turno, progreso y lo que puedes hacer ────────────────────────────
  function render() {
    const it = st.items[st.idx];
    const head = `<div class="hud">${coach.active ? '<span class="practice">Práctica</span>' : ''}<span class="turn">${st.over ? (st.over.win ? 'Has ganado' : 'Casi') : `Carta ${Math.min(st.idx + 1, st.items.length)} de ${st.items.length}`}</span>
      <span class="cnt"><b>${st.hits}</b> aciertos</span></div>`;
    let body = '';
    if (!st.over && st.phase === 'ask') body = `<p class="q">${esc(CONFIG.question(it))}</p>
      <div class="answers choices"><button class="btn primary big" data-ans="1">Va</button><button class="btn big" data-ans="0">No va</button></div>`;
    else if (!st.over) body = '<p class="q">Mira la explicación.</p>';
    const last = st.answers[st.answers.length - 1];
    $('#say').innerHTML = `${head}${body}${last ? `<ol class="log"><li class="${last.right ? 'me' : ''}">${esc(last.it.label)}: ${last.right ? 'acierto' : 'fallo'}</li></ol>` : ''}`;
  }

  // ── Turnos ──────────────────────────────────────────────────────────────────
  // Orden del feedback: marca sobre la carta → cae con golpe → tarjeta con la explicación.
  function answer(v) {
    if (!st || st.over || st.phase !== 'ask') return;
    const it = st.items[st.idx], right = (v === '1') === it.ok, x = current();
    st.phase = 'explain'; st.answers.push({ it, right }); if (right) st.hits++;
    GK.setMark(x, right ? 'yes' : 'no'); right ? sound.yes() : sound.no();
    GK.announce(right ? 'Bien' : 'No', right ? 'good' : 'bad', T(1000));   // se va antes de que salga la explicación
    render();
    GK.after(T(700), () => { x.target = GK.FLAT; x.liftTarget = 0; });
    GK.after(T(1150), () => {
      GK.overlay.show(`<p class="ol-k">Por qué</p><p class="ol-q">${esc(it.label)} ${it.ok ? 'sí va' : 'no va'}</p><p class="ol-m">${esc(it.why)}</p>
        <div class="answers center"><button class="btn primary" id="next">Siguiente</button></div>`);
      $('#next').focus({ preventScroll: true });
    });
    coach.event('answer');
  }
  function next() {
    if (!st || st.phase !== 'explain') return;
    GK.overlay.hide(); coach.event('siguiente');
    st.idx++; st.phase = 'ask';
    if (st.idx >= st.items.length) { finish(); return; }
    lift(); render();
  }
  function finish() {
    const win = st.hits >= CONFIG.winAt; st.over = { win }; st.phase = 'over'; lift();
    GK.announce(win ? '¡Has ganado!' : `${st.hits} de ${st.items.length}`, win ? 'good' : 'bad');
    if (win) { sound.win(); GK.confetti(); } else sound.lose();
    const misses = st.answers.filter(a => !a.right);
    GK.end(`<h2>${win ? 'Lo sabías' : 'Te faltó poco'}: ${st.hits} de ${st.items.length}</h2>
      ${misses.length ? `<div class="rv"><p class="who">Lo que se te escapó</p>${misses.map(a => `<p><b>${esc(a.it.label)}</b> ${a.it.ok ? 'sí va' : 'no va'}. ${esc(a.it.why)}</p>`).join('')}</div>` : ''}
      <div class="cta"><p>${esc(CONFIG.cta.text)}</p><a class="btn primary" href="${esc(CONFIG.cta.url)}" target="_blank" rel="noopener">${esc(CONFIG.cta.button)}</a></div>
      <div class="answers"><button class="btn" id="again">Jugar otra vez</button></div>`);
    render();
  }

  // ── Eventos ─────────────────────────────────────────────────────────────────
  document.addEventListener('click', (e) => {
    const an = e.target.closest('[data-ans]'); if (an) { answer(an.dataset.ans); return; }
    if (e.target.closest('#next')) { next(); return; }
    if (e.target.closest('#again')) { newGame(); return; }
    const mu = e.target.closest('#mute'); if (mu) { sound.muted = !sound.muted; mu.setAttribute('aria-pressed', String(sound.muted)); mu.textContent = sound.muted ? 'Sonido: no' : 'Sonido: sí'; return; }
    if (e.target.closest('#help')) { showIntro('Seguir'); return; }
  });
  addEventListener('keydown', (e) => { if (st && st.phase === 'ask' && !st.over) { if (e.key === 's' || e.key === 'ArrowLeft') answer('1'); if (e.key === 'n' || e.key === 'ArrowRight') answer('0'); } });
  function showIntro(button = 'Jugar') {
    GK.intro({ brand: CONFIG.brand, title: CONFIG.title, rules: CONFIG.rules, button, note: CONFIG.note, onGo() { if (!coach.done()) { coach.start(); render(); } } });
  }

  // ── Bucle ───────────────────────────────────────────────────────────────────
  GK.loop((dt) => {
    cards.forEach(x => {
      GK.spring(x, dt, () => rig.impact(0.35));
      x.lift += (x.liftTarget - x.lift) * (REDUCE ? 1 : Math.min(1, dt * 6));
      x.pivot.position.y = x.baseY + x.lift * 0.3; x.pivot.scale.setScalar(1 + x.lift * 0.12);
    });
    rig.update(dt);
    if (coach.active) coach.place();
  }, () => renderer.render(scene, camera));

  GK.expose({
    state: () => st && ({ idx: st.idx, total: st.items.length, hits: st.hits, phase: st.phase, over: st.over, card: st.items[st.idx] && st.items[st.idx].label, practice: coach.active }),
    answer, next, newGame, coach,
    // Dónde cae cada carta en pantalla (px): para comprobar que el tablero se ve entero y no lo tapa el panel.
    cardsOnScreen: () => cards.map(x => { const v = new THREE.Vector3(); x.body.getWorldPosition(v); v.project(camera); return [Math.round((v.x * 0.5 + 0.5) * innerWidth), Math.round((-v.y * 0.5 + 0.5) * innerHeight)]; }),
  });
  newGame(); showIntro();
})();
