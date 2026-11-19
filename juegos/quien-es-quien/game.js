/* ¿Quién es quién en IA? Versión nothiring. Three.js r128 (global THREE).
 * Diseño: juegos/quien-es-quien/diseno/REPLANTEAMIENTO.md, sección 7 bis.
 * 12 caras, una por perfil. Los rasgos se ven en la cara como en el juego de mesa (portátil, casco,
 * maletín…) y el color de la camiseta dice qué hace sobre todo. Duelo contra un robot con su propio
 * tablero, que piensa en voz alta. Abatir las caras es gesto del jugador.
 * Prototipo no oficial: rasgos por perfil son hipótesis a validar. */
(function () {
  'use strict';

  // ── Perfiles y rasgos (matriz 06c resuelta; ver diseno/matriz.py) ───────────────────────
  const R = (o) => Object.assign({ CODE: 0, GENAI: 0, TRAIN: 0, EXT: 0, EMBED: 0, VENTA: 0, PIPE: 0, EVAL: 0 }, o);
  const ROLES = [
    { role: 'Product Engineer', name: 'Lucía', ...R({ CODE: 1, EXT: 1 }), HACE: 'construye', what: 'Escribe código de producto y responde del resultado: habla con usuarios y decide qué construir.' },
    { role: 'AI Product Engineer', name: 'Joel', ...R({ CODE: 1, GENAI: 1, EXT: 1, EVAL: 1 }), HACE: 'construye', what: 'Como un Product Engineer, pero su producto se apoya en un modelo de IA ajeno que integra y evalúa.' },
    { role: 'LLM Application Engineer', name: 'Irene', ...R({ CODE: 1, GENAI: 1, EVAL: 1 }), HACE: 'construye', what: 'Construye aplicaciones sobre modelos de otros: recuperación de datos, agentes y evaluación en producción.' },
    { role: 'AI Platform Engineer', name: 'Marc', ...R({ CODE: 1, EVAL: 1 }), HACE: 'opera', what: 'Monta las herramientas y la observabilidad que usan otros equipos que construyen IA.' },
    { role: 'ML Engineer', name: 'Sergio', ...R({ CODE: 1, TRAIN: 1, EVAL: 1 }), HACE: 'construye', what: 'Entrena, ajusta o evalúa modelos propios y los lleva a producción.' },
    { role: 'Forward Deployed Engineer', name: 'Marta', ...R({ CODE: 1, GENAI: 1, EXT: 1, EMBED: 1, EVAL: 1 }), HACE: 'construye', what: 'Trabaja dentro del cliente y lleva un prototipo a producción en semanas, respondiendo del resultado.' },
    { role: 'Solutions Engineer', name: 'Pablo', ...R({ EXT: 1, VENTA: 1 }), HACE: 'configura', what: 'Prepara demos, integraciones y pruebas de concepto para ayudar a cerrar la venta.' },
    { role: 'GTM Engineer no-code', name: 'Aitana', ...R({ EXT: 1, VENTA: 1, PIPE: 1 }), HACE: 'configura', what: 'Monta la prospección y el outbound con herramientas sin código y el CRM.' },
    { role: 'GTM Engineer con código', name: 'Raúl', ...R({ CODE: 1, GENAI: 1, VENTA: 1, PIPE: 1 }), HACE: 'construye', what: 'Despliega y vigila servicios y agentes para el equipo comercial, programando.' },
    { role: 'Conversation Designer', name: 'Noa', ...R({ GENAI: 1, EXT: 1, EVAL: 1 }), HACE: 'diseña', what: 'Diseña cómo habla un agente: intenciones, respuestas de recuperación, tono y paso a una persona.' },
    { role: 'AI Product Manager', name: 'Clara', ...R({ GENAI: 1, EXT: 1, EVAL: 1 }), HACE: 'prioriza', what: 'Decide qué se construye en un producto con IA y mide su impacto, sin programar.' },
    { role: 'Product Operations', name: 'Hugo', ...R({}), HACE: 'opera', what: 'Mejora cómo trabaja el equipo de producto: procesos, OKRs y lanzamientos.' },
  ];
  // Rasgo → objeto que lo delata en la cara. La pregunta es la del juego de mesa; debajo, lo que significa.
  const TRAITS = [
    { id: 'CODE',  thing: 'portátil',      q: '¿Lleva portátil?',      means: 'programa' },
    { id: 'GENAI', thing: 'chispa',        q: '¿Tiene una chispa en la camiseta?', means: 'trabaja con IA generativa' },
    { id: 'EXT',   thing: 'acreditación',  q: '¿Lleva acreditación colgada?', means: 'trabaja para clientes de fuera' },
    { id: 'EVAL',  thing: 'lupa',          q: '¿Lleva lupa?',          means: 'comprueba la calidad con pruebas' },
    { id: 'VENTA', thing: 'maletín',       q: '¿Lleva maletín?',       means: 'su trabajo está ligado a vender' },
    { id: 'PIPE',  thing: 'imán',          q: '¿Lleva un imán?',       means: 'consigue contactos de venta' },
    { id: 'EMBED', thing: 'casco',         q: '¿Lleva casco?',         means: 'trabaja dentro de la empresa del cliente' },
    { id: 'TRAIN', thing: 'matraz',        q: '¿Lleva un matraz?',     means: 'entrena modelos de IA' },
  ];
  const SHIRTS = [
    { v: 'construye', col: '#3b82f6', q: '¿Camiseta azul?', means: 'su tarea principal es construir' },
    { v: 'configura', col: '#a855f7', q: '¿Camiseta morada?', means: 'configura herramientas sin programar' },
    { v: 'diseña',    col: '#ec4899', q: '¿Camiseta rosa?', means: 'diseña' },
    { v: 'prioriza',  col: '#94dd45', q: '¿Camiseta verde?', means: 'decide qué se hace primero' },
    { v: 'opera',     col: '#f59e0b', q: '¿Camiseta naranja?', means: 'hace que procesos o sistemas funcionen' },
  ];
  const QS = TRAITS.map(t => ({ id: t.id, q: t.q, means: t.means, f: c => c[t.id] === 1 }))
    .concat(SHIRTS.map(s => ({ id: 'HACE=' + s.v, q: s.q, means: s.means, f: c => c.HACE === s.v })));
  const qById = Object.fromEntries(QS.map(q => [q.id, q]));
  const TRAIT_KEYS = ['CODE', 'GENAI', 'TRAIN', 'EXT', 'EMBED', 'VENTA', 'PIPE', 'EVAL', 'HACE'];
  function twin(c) { // el perfil más parecido y en qué se diferencia, para la revelación final
    let best = null;
    ROLES.forEach(o => { if (o === c) return; const d = TRAIT_KEYS.filter(k => o[k] !== c[k]); if (!best || d.length < best.d.length) best = { o, d }; });
    return best;
  }
  const traitWord = (k, c) => k === 'HACE' ? `camiseta (${c.HACE})` : (TRAITS.find(t => t.id === k) || {}).thing;

  const SND = (() => {
    let ctx = null, muted = false;
    const tone = (f, d, type = 'sine', g = 0.07, when = 0) => {
      if (muted || !ctx) return; const t0 = ctx.currentTime + when;
      const o = ctx.createOscillator(), v = ctx.createGain(); o.type = type; o.frequency.setValueAtTime(f, t0);
      v.gain.setValueAtTime(0.0001, t0); v.gain.exponentialRampToValueAtTime(g, t0 + 0.012); v.gain.exponentialRampToValueAtTime(0.0001, t0 + d);
      o.connect(v).connect(ctx.destination); o.start(t0); o.stop(t0 + d + 0.02);
    };
    const thud = () => { // «clac» de carta: ruido corto filtrado y un golpe grave
      if (muted || !ctx) return; const t0 = ctx.currentTime, n = ctx.createBuffer(1, ctx.sampleRate * 0.06, ctx.sampleRate), d = n.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length) ** 3;
      const src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), v = ctx.createGain(); src.buffer = n; f.type = 'lowpass'; f.frequency.value = 1400; v.gain.value = 0.22;
      src.connect(f).connect(v).connect(ctx.destination); src.start(t0); tone(130, 0.09, 'sine', 0.12);
    };
    return {
      unlock() { if (!ctx) { try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { ctx = null; } } if (ctx && ctx.state === 'suspended') ctx.resume(); },
      get muted() { return muted; }, set muted(v) { muted = v; },
      tick() { tone(1200, 0.04, 'triangle', 0.035); },
      yes() { tone(660, 0.09, 'sine', 0.06); tone(990, 0.12, 'sine', 0.05, 0.08); },
      no() { tone(240, 0.14, 'triangle', 0.06); },
      clac: thud,
      robot() { tone(320, 0.06, 'square', 0.025); tone(480, 0.06, 'square', 0.025, 0.07); },
      win() { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.18, 'triangle', 0.06, i * 0.1)); },
      lose() { [392, 330, 262].forEach((f, i) => tone(f, 0.22, 'triangle', 0.05, i * 0.15)); },
    };
  })();
  const REDUCE = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const rnd = (n) => Math.floor(Math.random() * n);
  const C = { bg: '#0a0a0a', panel: '#121311', panel2: '#161814', panel3: '#1b1e19', text: '#edefe7', dim: '#9aa093', lime: '#94dd45', red: '#e2625e' };

  // ── Caras dibujadas: los rasgos son objetos que se ven ───────────────────────
  const SKINS = ['#f2c9a0', '#d9a066', '#8d5a3b', '#f0b98d', '#c68642', '#e8b88a'];
  const HAIRS = ['#2a1b12', '#1b1b1b', '#6b3f1d', '#b5651d', '#3a2a1a', '#8a8a8a'];
  const faceCanvas = {};
  function drawThing(g, id, s = 1) {
    const L = (w) => { g.lineWidth = w * s; };
    g.save(); g.lineCap = 'round'; g.lineJoin = 'round';
    if (id === 'CODE') { // portátil delante
      g.fillStyle = '#c9cfd6'; g.fillRect(72, 236, 112, 10); g.fillStyle = '#2a2f36'; g.beginPath(); g.moveTo(84, 236); g.lineTo(172, 236); g.lineTo(164, 186); g.lineTo(92, 186); g.closePath(); g.fill();
      g.fillStyle = C.lime; g.font = '700 22px "JetBrains Mono", monospace'; g.textAlign = 'center'; g.fillText('</>', 128, 220);
    }
    if (id === 'GENAI') { g.fillStyle = '#ffe066'; g.beginPath(); const x = 160, y = 176, r = 15; g.moveTo(x, y - r); g.lineTo(x + 4, y - 4); g.lineTo(x + r, y); g.lineTo(x + 4, y + 4); g.lineTo(x, y + r); g.lineTo(x - 4, y + 4); g.lineTo(x - r, y); g.lineTo(x - 4, y - 4); g.closePath(); g.fill(); }
    if (id === 'EXT') { g.strokeStyle = '#e2625e'; L(4); g.beginPath(); g.moveTo(108, 150); g.lineTo(96, 196); g.moveTo(148, 150); g.lineTo(104, 196); g.stroke(); g.fillStyle = '#f4f4f5'; g.fillRect(84, 192, 30, 22); g.fillStyle = '#e2625e'; g.fillRect(84, 192, 30, 6); }
    if (id === 'EVAL') { g.strokeStyle = '#f4f4f5'; L(6); g.beginPath(); g.arc(214, 168, 16, 0, 7); g.stroke(); g.beginPath(); g.moveTo(203, 180); g.lineTo(190, 200); g.stroke(); g.fillStyle = 'rgba(180,220,255,.35)'; g.beginPath(); g.arc(214, 168, 13, 0, 7); g.fill(); }
    if (id === 'VENTA') { g.fillStyle = '#7a4b2a'; g.fillRect(194, 214, 44, 30); g.strokeStyle = '#5a361d'; L(4); g.beginPath(); g.moveTo(206, 214); g.lineTo(206, 206); g.lineTo(226, 206); g.lineTo(226, 214); g.stroke(); g.fillStyle = '#d4a017'; g.fillRect(212, 224, 8, 6); }
    if (id === 'PIPE') { g.strokeStyle = '#e2625e'; L(9); g.beginPath(); g.arc(214, 104, 14, Math.PI, 0); g.stroke(); g.fillStyle = '#f4f4f5'; g.fillRect(195, 101, 10, 9); g.fillRect(223, 101, 10, 9); }
    if (id === 'EMBED') { g.fillStyle = '#facc15'; g.beginPath(); g.arc(128, 98, 48, Math.PI, 0); g.fill(); g.fillRect(74, 94, 108, 10); g.fillStyle = '#eab308'; g.fillRect(122, 52, 12, 44); }
    if (id === 'TRAIN') { g.fillStyle = 'rgba(148,221,69,.85)'; g.beginPath(); g.moveTo(34, 210); g.lineTo(62, 210); g.lineTo(54, 186); g.lineTo(54, 168); g.lineTo(42, 168); g.lineTo(42, 186); g.closePath(); g.fill(); g.strokeStyle = '#f4f4f5'; L(3); g.stroke(); }
    g.restore();
  }
  function drawFace(c, idx, big = false) {
    const W = 256, H = 336, cv = document.createElement('canvas'); cv.width = W; cv.height = H; const g = cv.getContext('2d');
    const rect = (x, y, w, h, col, r = 0) => { g.fillStyle = col; g.beginPath(); g.roundRect ? g.roundRect(x, y, w, h, r) : g.rect(x, y, w, h); g.fill(); };
    const circle = (x, y, r, col) => { g.fillStyle = col; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); };
    rect(0, 0, W, H, '#f4f4f5', 10);
    rect(8, 8, W - 16, 266, C.panel3, 8);
    const shirt = SHIRTS.find(s => s.v === c.HACE);
    const sk = SKINS[(idx * 5) % SKINS.length], hr = HAIRS[(idx * 7 + 2) % HAIRS.length], st = idx % 4;
    // Cuerpo con camiseta del color de lo que hace, y la palabra escrita
    rect(48, 156, 160, 118, shirt.col, 46); rect(106, 136, 44, 26, sk, 10);
    g.fillStyle = 'rgba(0,0,0,.55)'; g.font = '700 15px "Space Grotesk", system-ui, sans-serif'; g.textAlign = 'center'; g.fillText(c.HACE.toUpperCase(), 128, 266);
    circle(128, 110, 40, sk);
    if (!c.EMBED) { g.fillStyle = hr; g.beginPath(); g.arc(128, 98, 42, Math.PI, 0); g.fill(); if (st === 0) rect(86, 98, 12, 44, hr, 6); if (st === 1) rect(158, 98, 12, 44, hr, 6); if (st === 2) { rect(86, 98, 12, 34, hr, 6); rect(158, 98, 12, 34, hr, 6); } }
    circle(115, 112, 4.5, '#14181c'); circle(141, 112, 4.5, '#14181c');
    g.strokeStyle = '#14181c'; g.lineWidth = 3; g.beginPath(); g.arc(128, 124, 11, 0.15 * Math.PI, 0.85 * Math.PI); g.stroke();
    TRAITS.forEach(t => { if (c[t.id]) drawThing(g, t.id); });
    // Nombre abajo, como en el juego de mesa
    rect(8, 280, W - 16, 48, C.bg, 8);
    g.fillStyle = C.text; g.font = '700 26px "Space Grotesk", system-ui, sans-serif'; g.textAlign = 'center'; g.fillText(c.name, W / 2, 313);
    if (!big) faceCanvas[c.name] = cv;
    return cv;
  }
  const iconCanvas = (id) => { // icono de rasgo para botones y leyenda: un recorte del dibujo
    const cv = document.createElement('canvas'); cv.width = cv.height = 64; const g = cv.getContext('2d');
    const regions = { CODE: [64, 176, 128, 76], GENAI: [138, 154, 46, 46], EXT: [76, 144, 76, 76], EVAL: [180, 140, 56, 66], VENTA: [186, 198, 60, 52], PIPE: [190, 84, 50, 34], EMBED: [70, 44, 116, 64], TRAIN: [26, 160, 46, 56] };
    const src = document.createElement('canvas'); src.width = 256; src.height = 336; const sg = src.getContext('2d'); sg.fillStyle = C.panel3; sg.fillRect(0, 0, 256, 336); drawThing(sg, id);
    const [x, y, w, h] = regions[id]; const sc = Math.min(56 / w, 56 / h);
    g.drawImage(src, x, y, w, h, 32 - w * sc / 2, 32 - h * sc / 2, w * sc, h * sc); return cv.toDataURL();
  };
  const ICON = {}; TRAITS.forEach(t => { ICON[t.id] = iconCanvas(t.id); });
  const qIcon = (q) => q.id.startsWith('HACE=') ? `<span class="swatch" style="background:${SHIRTS.find(s => 'HACE=' + s.v === q.id).col}"></span>` : `<img src="${ICON[q.id]}" alt="" width="32" height="32">`;

  // ── Escena 3D ────────────────────────────────────────────────────────────────
  const canvas = $('#c');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2)); renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x0a0a0a); scene.fog = new THREE.Fog(0x0a0a0a, 16, 30);
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 80);
  scene.add(new THREE.HemisphereLight(0xe7f5d8, 0x1b1e19, 0.7));
  const sun = new THREE.DirectionalLight(0xffffff, 0.85); sun.position.set(-3, 9, 7); sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6, near: 1, far: 24 }); sun.shadow.bias = -0.0005; scene.add(sun);
  const rim = new THREE.PointLight(0x94dd45, 0.5, 12); rim.position.set(0, 4, -6); scene.add(rim);
  const std = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.7, metalness: 0.05 }, o));
  function mesh(geo, mat, x, y, z, sh = true) { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); if (sh) { m.castShadow = true; m.receiveShadow = true; } return m; }

  const floor = mesh(new THREE.PlaneGeometry(40, 40), std(0x101210, { roughness: 1 }), 0, -0.01, 0, false); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
  function wallTex() {
    const c = document.createElement('canvas'); c.width = 1024; c.height = 512; const g = c.getContext('2d');
    g.fillStyle = '#0d0f0c'; g.fillRect(0, 0, 1024, 512);
    g.strokeStyle = 'rgba(148,221,69,.07)'; g.lineWidth = 1; for (let x = 0; x <= 1024; x += 32) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 512); g.stroke(); } for (let y = 0; y <= 512; y += 32) { g.beginPath(); g.moveTo(0, y); g.lineTo(1024, y); g.stroke(); }
    g.font = '600 64px "JetBrains Mono", monospace'; g.fillStyle = '#edefe7'; g.textAlign = 'center'; g.fillText('nothiring', 492, 150); g.fillStyle = '#94dd45'; g.fillText('.', 492 + g.measureText('nothiring').width / 2 + 18, 150);
    g.font = '500 22px "JetBrains Mono", monospace'; g.fillStyle = '#9aa093'; g.fillText('¿quién es quién en IA?', 512, 196);
    const t = new THREE.CanvasTexture(c); t.anisotropy = 4; return t;
  }
  scene.add(mesh(new THREE.PlaneGeometry(24, 12), new THREE.MeshStandardMaterial({ map: wallTex(), roughness: 1 }), 0, 6, -9, false));
  const table = mesh(new THREE.BoxGeometry(11, 0.4, 11), std(0x1b1e19, { roughness: 0.6 }), 0, -0.2, -1.2); scene.add(table);
  // Canto lima de la mesa: cuatro listones finos, no una lámina encima.
  const edgeM = std(0x94dd45, { emissive: 0x2f4a12, emissiveIntensity: 0.6 });
  [[0, 4.3, 11, 0.06], [0, -6.7, 11, 0.06], [5.5, -1.2, 0.06, 11], [-5.5, -1.2, 0.06, 11]].forEach(([x, z, w, d]) => scene.add(mesh(new THREE.BoxGeometry(w, 0.05, d), edgeM, x, 0.02, z, false)));

  // Tableros: el del jugador mira a la cámara; el del robot, al robot (vemos sus dorsos).
  const COLS = 4, ROWS = 3, CW = 1.02, CH = 1.34, GAPX = 1.22, TIER_Y = 0.38, TIER_Z = CH + 0.16;
  const STAND = -0.16, FLAT = Math.PI / 2 - 0.03;
  const stepMat = std(0x161814, { roughness: 0.5 }), lipMat = std(0x94dd45, { roughness: 0.4, emissive: 0x1a2a0a, emissiveIntensity: 0.5 });
  const backMat = std(0x94dd45, { roughness: 0.55 }), edgeMat = std(0xf4f4f5, { roughness: 0.6 });
  // Textura de la marca: marco rojo y una X blanca, para que «no encaja» no dependa del color.
  const MARK_TEX = (() => { const c = document.createElement('canvas'); c.width = 128; c.height = 168; const g = c.getContext('2d');
    g.fillStyle = 'rgba(226,98,94,.35)'; g.fillRect(0, 0, 128, 168); g.strokeStyle = '#e2625e'; g.lineWidth = 12; g.strokeRect(6, 6, 116, 156);
    g.strokeStyle = '#ffffff'; g.lineWidth = 10; g.lineCap = 'round'; g.beginPath(); g.moveTo(34, 54); g.lineTo(94, 114); g.moveTo(94, 54); g.lineTo(34, 114); g.stroke();
    return new THREE.CanvasTexture(c); })();
  function buildBoard(z0, facing, faces, scale = 1) {
    // El del robot va en alto para que se vean caer sus cartas.
    const g = new THREE.Group(); g.position.set(0, scale < 1 ? 0.9 : 0, z0); g.scale.setScalar(scale); if (facing < 0) g.rotation.y = Math.PI; scene.add(g);
    const boardW = COLS * GAPX + 0.4;
    for (let r = 0; r < ROWS; r++) {
      const h = 0.14 + r * TIER_Y;
      g.add(mesh(new THREE.BoxGeometry(boardW, h, TIER_Z), stepMat, 0, h / 2, -r * TIER_Z + TIER_Z / 2 - 0.08));
      g.add(mesh(new THREE.BoxGeometry(boardW, 0.05, 0.08), lipMat, 0, h + 0.025, -r * TIER_Z - 0.1));
    }
    return ROLES.map((c, i) => {
      const r = Math.floor(i / COLS), k = i % COLS;
      const pivot = new THREE.Group(); const baseY = 0.14 + r * TIER_Y + 0.005;
      pivot.position.set((k - (COLS - 1) / 2) * GAPX, baseY, -r * TIER_Z);
      const front = faces ? std(0xffffff, { map: new THREE.CanvasTexture(drawFace(c, i)), roughness: 0.55 }) : std(0x2a2f2a, { roughness: 0.6 });
      const body = new THREE.Mesh(new THREE.BoxGeometry(CW, CH, 0.06), [edgeMat, edgeMat, edgeMat, edgeMat, front, backMat]);
      if (front.map) front.map.anisotropy = 8;
      body.position.y = CH / 2; body.castShadow = true; body.receiveShadow = true; body.userData.name = c.name; pivot.add(body); g.add(pivot);
      // Marca de «no encaja»: un marco rojo que aparece antes de abatir
      const mark = new THREE.Mesh(new THREE.PlaneGeometry(CW + 0.1, CH + 0.1), new THREE.MeshBasicMaterial({ map: MARK_TEX, transparent: true, opacity: 0 }));
      mark.position.set(0, CH / 2, 0.04); pivot.add(mark);
      return { c, pivot, body, mark, baseY, angle: STAND, vel: 0, target: STAND, down: false, marked: false, lift: 0, liftTarget: 0, delay: 0 };
    });
  }
  const mine = buildBoard(1.9, 1, true);           // el tuyo
  const THUMB = Object.fromEntries(ROLES.map(c => [c.name, faceCanvas[c.name].toDataURL('image/png')]));
  const theirs = []; // su tablero se ve en el mini tablero del panel; en 3D era ruido
  const cardByName = Object.fromEntries(mine.map(x => [x.c.name, x]));

  // Robot
  const bot = new THREE.Group(); bot.position.set(0, 0, -6.2); scene.add(bot);
  const botMat = std(0x2a2f2a, { roughness: 0.35, metalness: 0.3 });
  const botHead = new THREE.Group(); botHead.position.set(0, 3.35, 0);
  const faceCv = document.createElement('canvas'); faceCv.width = 256; faceCv.height = 160; const faceTex = new THREE.CanvasTexture(faceCv);
  const ant = mesh(new THREE.SphereGeometry(0.12, 16, 12), std(0x94dd45, { emissive: 0x94dd45, emissiveIntensity: 0.6 }), 0, 1.3, 0);
  botHead.add(mesh(new THREE.BoxGeometry(2, 1.5, 1.3), botMat, 0, 0, 0), mesh(new THREE.PlaneGeometry(1.7, 1.06), new THREE.MeshBasicMaterial({ map: faceTex }), 0, 0, 0.66, false), mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.5, 8), std(0x9aa093), 0, 0.98, 0), ant);
  const armL = new THREE.Group(), armR = new THREE.Group(); armL.position.set(-1.35, 2.35, 0); armR.position.set(1.35, 2.35, 0);
  [armL, armR].forEach(a => a.add(mesh(new THREE.BoxGeometry(0.45, 1.5, 0.5), std(0x3a403a, { metalness: 0.3 }), 0, -0.7, 0)));
  bot.add(mesh(new THREE.BoxGeometry(2.2, 2.2, 1.2), botMat, 0, 1.5, 0), mesh(new THREE.BoxGeometry(1.2, 0.3, 0.05), std(0x94dd45, { emissive: 0x94dd45, emissiveIntensity: 0.5 }), 0, 1.6, 0.63), botHead, armL, armR);
  let mood = '';
  function face(m) {
    if (m === mood) return; mood = m; const g = faceCv.getContext('2d');
    g.fillStyle = '#060806'; g.fillRect(0, 0, 256, 160); g.fillStyle = C.lime; g.strokeStyle = C.lime; g.lineWidth = 10; g.lineCap = 'round';
    if (m === 'happy') { [76, 180].forEach(x => { g.beginPath(); g.arc(x, 76, 22, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); }); g.beginPath(); g.arc(128, 100, 34, 0.15 * Math.PI, 0.85 * Math.PI); g.stroke(); }
    else if (m === 'sad') { [76, 180].forEach(x => { g.beginPath(); g.arc(x, 76, 20, 0, 7); g.fill(); }); g.beginPath(); g.arc(128, 132, 30, Math.PI * 1.15, Math.PI * 1.85); g.stroke(); }
    else if (m === 'think') { g.beginPath(); g.arc(76, 70, 20, 0, 7); g.fill(); g.beginPath(); g.arc(180, 70, 14, 0, 7); g.fill(); g.beginPath(); g.moveTo(98, 122); g.lineTo(162, 112); g.stroke(); }
    else { g.beginPath(); g.arc(76, 72, 20, 0, 7); g.fill(); g.beginPath(); g.arc(180, 72, 20, 0, 7); g.fill(); g.beginPath(); g.moveTo(104, 118); g.lineTo(152, 118); g.stroke(); }
    faceTex.needsUpdate = true;
  }
  face('idle');

  const camBase = new THREE.Vector3(), camLook = new THREE.Vector3();
  let trauma = 0, dolly = 1, botJump = 0, shakeT = 0, lastClac = 0;
  function resize() {
    const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h;
    const portrait = camera.aspect < 0.9;
    camera.fov = portrait ? 50 : 40;
    camBase.set(0, portrait ? 10.5 : 8.8, portrait ? 8.6 : 11); camLook.set(0, portrait ? 0.4 : 1.9, portrait ? -0.3 : -2.2); camera.position.copy(camBase); camera.lookAt(camLook);
    camera.updateProjectionMatrix();
    let dx = 0, dy = 0; if (w > 900) dx = -170; else dy = Math.round(h * 0.17);   // en vertical el panel ocupa la parte de abajo
    if (dx || dy) camera.setViewOffset(w, h, dx, dy, w, h); else camera.clearViewOffset();
    camera.updateProjectionMatrix();
  }
  addEventListener('resize', resize);

  // ── Estado de la partida ─────────────────────────────────────────────────────
  let st = null, timer = null;
  const consistent = (ans) => ROLES.filter(c => ans.every(a => (a.q === '__no' ? c.name !== a.name : qById[a.q].f(c) === a.a)));
  const T = (ms) => REDUCE ? Math.min(ms, 500) : ms;
  function announce(text, kind = '') { const b = $('#banner'); b.textContent = text; b.className = 'show ' + kind; clearTimeout(announce.t); announce.t = setTimeout(() => { b.className = ''; }, REDUCE ? 1100 : 1700); }
  function botSays(t) { const b = $('#bubble'); b.textContent = t; b.hidden = !t; }
  function log(who, text) { st.log.push({ who, text }); }

  function newGame() {
    clearTimeout(timer);
    const a = rnd(12); let b; do { b = rnd(12); } while (b === a);
    st = { mineCard: ROLES[a], theirCard: ROLES[b], my: [], bot: [], askedMe: new Set(), askedBot: new Set(), turn: 'me', phase: 'ask', over: null, log: [], sel: null, guessing: false, pending: [] };
    // Reparto: todas empiezan tumbadas y se levantan en cascada.
    [...mine, ...theirs].forEach((x, i) => { x.down = false; x.marked = false; x.liftTarget = 0; x.target = STAND; if (!REDUCE) { x.angle = FLAT; x.vel = 0; x.delay = 0.25 + (i % 12) * 0.05 + (i >= 12 ? 0.3 : 0); } });
    dolly = REDUCE ? 1 : 1.18;
    $('#end').hidden = true; drawMine(); face('idle'); botSays('Ya tengo mi carta. Pregunta tú primero.'); document.querySelectorAll('.confetti').forEach(n => n.remove());
    render();
  }
  let mineThumb = '';
  function drawMine() { mineThumb = drawFace(st.mineCard, ROLES.indexOf(st.mineCard), true).toDataURL(); const t = $('#mineCv'); const g = t.getContext('2d'); g.clearRect(0, 0, t.width, t.height); g.drawImage(drawFace(st.mineCard, ROLES.indexOf(st.mineCard), true), 0, 0, t.width, t.height); $('#mineRole').textContent = st.mineCard.role; }

  // ── Paneles ──────────────────────────────────────────────────────────────────
  // Panel: arriba, siempre, de quién es el turno, cuántas quedan y cómo se gana. Las preguntas son
  // iconos compactos (el tablero sigue a la vista) y al elegir uno se ve la pregunta entera.
  function render() {
    const left = consistent(st.my), botLeft = consistent(st.bot);
    const myTurn = st.turn === 'me' && !st.over;
    const head = `<div class="hud">${tut >= 0 ? '<span class="practice">Práctica</span>' : ''}<span class="turn ${st.over ? (st.over.win ? 'ok' : 'ko') : (st.turn === 'me' ? '' : 'bot')}">${st.over ? (st.over.win ? 'Has ganado' : 'Gana el robot') : (st.turn === 'me' ? 'Tu turno' : 'Turno del robot')}</span>
      <span class="cnt"><b>${left.length}</b> tú</span><span class="cnt"><b>${botLeft.length}</b> robot</span>
      <button class="minebtn" id="seeMine" aria-label="Ver tu carta: ${esc(st.mineCard.name)}"><img src="${mineThumb}" alt="" width="28" height="36"><span>Tu carta</span></button></div>`;
    // Lo que el robot sabe de tu carta, a la vista: sus descartes tachados y tu carta marcada.
    const botSet = new Set(botLeft.map(c => c.name));
    const bb = `<div class="bb"><p class="bbl">El robot busca tu carta y duda entre <b>${botLeft.length}</b>:</p><div class="bbg">${ROLES.map(c => `<span class="bbc${botSet.has(c.name) ? '' : ' out'}${c === st.mineCard ? ' me' : ''}"><img src="${THUMB[c.name]}" alt="${esc(c.name)}${botSet.has(c.name) ? '' : ', descartada'}${c === st.mineCard ? ', tu carta' : ''}"></span>`).join('')}</div></div>`;
    let body = '';
    if (st.over) body = '';
    else if (st.turn === 'me' && st.phase === 'flip') {
      body = `<p class="q">Abate las ${st.pending.length} caras marcadas en rojo: no encajan con la respuesta.</p>
        <div class="answers"><button class="btn primary big" id="flipAll">Abatir las ${st.pending.length}</button></div>`;
    } else if (myTurn) {
      // Cómo se gana, a la vista: con pocas caras en pie, botones directos de «¿Es X?».
      const finals = left.length <= 3 ? `<p class="q">${left.length === 1 ? `Solo te queda ${esc(left[0].name)}. ¡Dilo y ganas!` : `Te quedan ${left.length}. Puedes arriesgar o preguntar otra vez.`}</p>
        <div class="answers">${left.map(c => `<button class="btn ${left.length === 1 ? 'primary big' : ''}" data-final="${esc(c.name)}">¿Es ${esc(c.name)}?</button>`).join('')}</div>${left.length > 1 ? '<p class="meta">Si fallas, pierdes el turno.</p>' : ''}` : '';
      const hint = st.askedMe.size < 1 ? bestFor(left, st.askedMe) : null;
      // Una pregunta que no tumbaría ninguna cara no se puede elegir: así se ve qué preguntas sirven.
      const useless = (q) => { const y = left.filter(q.f).length; return y === 0 || y === left.length; };
      const sel = st.qsel && !st.askedMe.has(st.qsel) ? qById[st.qsel] : null;
      body = `${finals || `<p class="q">${st.askedMe.size === 0 ? 'Adivina la cara secreta del robot antes que él la tuya. Elige qué preguntarle:' : 'Elige otra pregunta (las apagadas ya no descartan a nadie). Cuando te quede una cara, la dices y ganas.'}</p>`}
        ${left.length === 1 ? '' : `<div class="qicons">${QS.map(q => `<button class="qi${hint && hint.id === q.id ? ' hint' : ''}${sel && sel.id === q.id ? ' on' : ''}" data-pick="${q.id}"${st.askedMe.has(q.id) || useless(q) ? ' disabled' : ''} aria-label="${esc(q.q)} ${esc(q.means)}${useless(q) ? ', no descartaría ninguna' : ''}">${qIcon(q)}<span class="lbl">${esc(shortOf(q))}</span></button>`).join('')}</div>
        <div class="qdetail">${sel ? `<p><b>${esc(sel.q)}</b> <span>${esc(sel.means)}</span></p><button class="btn primary" data-ask="${sel.id}">Preguntar</button>` : `<p class="meta">${hint ? `Toca un icono. El marcado en lima es el que más caras descarta.` : 'Toca un icono para ver la pregunta.'}</p>`}</div>`}
        ${left.length > 3 ? `<div class="answers"><button class="btn small ${st.guessing ? 'primary' : ''}" id="guess">${st.guessing ? 'Toca en el tablero la cara que crees' : 'Arriesgar ya: decir una cara'}</button>${st.guessing ? '<button class="btn small" id="cancelGuess">Cancelar</button>' : ''}</div>${st.guessing ? '<p class="meta">Si fallas, pierdes el turno.</p>' : ''}` : ''}`;
    } else {
      body = st.botAsk ? `<p class="q">El robot te pregunta: responde Sí o No mirando tu carta.</p>` : `<p class="q">El robot está pensando su pregunta…</p>`;
    }
    $('#say').innerHTML = `${head}${bb}${body}<ol class="log" aria-label="Última jugada">${st.log.slice(-1).map(l => `<li class="${l.who}">${esc(l.text)}</li>`).join('')}</ol>`;
    renderInspect(); placeCoach();
  }
  const shortOf = (q) => q.id.startsWith('HACE=') ? q.q.replace(/^¿Camiseta (\w+)\?$/, 'camiseta $1') : (TRAITS.find(t => t.id === q.id) || {}).thing;
  function bestFor(pool, asked) {
    return QS.filter(q => !asked.has(q.id)).map(q => { const y = pool.filter(q.f).length; return { q, w: Math.max(y, pool.length - y), y }; })
      .filter(o => o.y > 0 && o.y < pool.length).sort((a, b) => a.w - b.w)[0]?.q;
  }
  function renderInspect() {
    const box = $('#inspect'); const c = st && st.sel ? ROLES.find(r => r.name === st.sel) : null;
    if (!c) { box.hidden = true; return; } box.hidden = false;
    const t = $('#inspCv'); const g = t.getContext('2d'); g.clearRect(0, 0, t.width, t.height); g.drawImage(faceCanvas[c.name], 0, 0, t.width, t.height);
    const has = TRAITS.filter(tr => c[tr.id]).map(tr => `${tr.thing}: ${tr.means}`);
    $('#inspText').innerHTML = `<b>${esc(c.name)}${c === st.mineCard ? ' (tu carta)' : ''}</b><br>${has.map(esc).join('<br>') || 'Sin objetos'}<br>Camiseta ${esc(c.HACE)}<br><button class="btn small" id="closeInsp">Cerrar</button>`;
  }

  // ── Turnos ───────────────────────────────────────────────────────────────────
  function playerAsk(id) {
    if (!st || st.over || st.turn !== 'me' || st.phase !== 'ask' || st.askedMe.has(id)) return;
    const q = qById[id], a = q.f(st.theirCard); st.askedMe.add(id); st.my.push({ q: id, a });
    const now = consistent(st.my); const pend = mine.filter(x => !x.down && !now.includes(x.c));
    pend.forEach(x => { x.marked = true; });
    st.pending = pend.map(x => x.c.name); st.phase = pend.length ? 'flip' : 'ask';
    log('me', `Tú: ${q.q} → ${a ? 'Sí' : 'No'}. ${pend.length ? `No encajan ${pend.length}.` : 'No descarta ninguna.'}`);
    botSays(`${a ? 'Sí' : 'No'}. Te toca abatir las que no encajan.`);
    announce(a ? 'Sí' : 'No', a ? 'good' : ''); a ? SND.yes() : SND.no();
    if (!pend.length) endMyTurn(); else render();
  }
  function flip(name) {
    const x = cardByName[name]; if (!x || x.down) return;
    if (st.phase === 'flip' && st.pending.includes(name)) {
      x.down = true; x.marked = false; x.target = FLAT; x.delay = 0; st.pending = st.pending.filter(n => n !== name);
      if (!st.pending.length) { tutEvent('flip'); endMyTurn(); } else render();
    }
  }
  function flipAll() { st.pending.forEach((n, i) => { const x = cardByName[n]; x.down = true; x.marked = false; x.target = FLAT; x.delay = REDUCE ? 0 : i * 0.06; }); st.pending = []; tutEvent('flip'); endMyTurn(); }
  function endMyTurn() { st.phase = 'ask'; st.turn = 'bot'; render(); timer = setTimeout(botThink, REDUCE ? 400 : 1500); }
  function playerGuess(name) {
    if (!st || st.over || st.turn !== 'me') return;
    st.guessing = false;
    if (name === st.theirCard.name) { finish(true); return; }
    st.my.push({ q: '__no', name }); const x = cardByName[name]; x.down = true; x.target = FLAT;
    log('me', `Tú: ¿Es ${name}? → No. Pierdes el turno.`); announce('No era', 'bad'); SND.no(); botSays(`No, no es ${name}.`);
    endMyTurn();
  }
  function botThink() {
    if (!st || st.over) return;
    const cand = consistent(st.bot), myN = consistent(st.my).length;
    face('think'); SND.robot(); render(); botSays('');
    if (cand.length === 1 || (cand.length === 2 && Math.random() < (myN < cand.length ? 0.5 : 0.25))) {
      const pick = cand[rnd(cand.length)];
      setTimeout(() => botSays(cand.length === 1 ? `Solo me queda ${pick.name}. Lo digo.` : `Dudo entre ${cand.map(c => c.name).join(' y ')}. Me la juego.`), T(600));
      timer = setTimeout(() => botAct({ bet: pick }), REDUCE ? 500 : 2000); return;
    }
    const ranked = QS.filter(q => !st.askedBot.has(q.id)).map(q => { const y = cand.filter(q.f).length; return { q, y, w: Math.max(y, cand.length - y) }; }).filter(o => o.y > 0 && o.y < cand.length).sort((a, b) => a.w - b.w);
    const pick = ranked[Math.random() < 0.55 && ranked.length > 1 ? 1 + rnd(Math.min(2, ranked.length - 1)) : 0] || { q: QS[0], y: 0 };
    setTimeout(() => botSays(`Me quedan ${cand.length}. Voy a preguntar «${pick.q.q}»: ${pick.y} sí y ${cand.length - pick.y} no.`), T(600));
    timer = setTimeout(() => botAct({ q: pick.q }), REDUCE ? 500 : 2100);
  }
  // El turno del robot se ve en grande: qué pregunta (con el objeto), qué responde tu carta y,
  // si apuesta, a qué cara apuesta. Después, sus descartes aparecen tachados en su mini tablero.
  function overlay(html) { botSays(''); const o = $('#ol'); o.innerHTML = html; o.hidden = false; }   // un solo foco: el bocadillo se oculta
  function overlayAnswer(html, kind) { const r = $('#ol .ol-a'); if (r) { r.innerHTML = html; r.className = 'ol-a show ' + kind; } }
  function hideOverlay() { $('#ol').hidden = true; }
  // El robot pregunta y el jugador responde mirando su carta. Si se equivoca, se le corrige con
  // la razón (qué objeto lleva o no) y vuelve a responder: nadie miente sin querer.
  function botAct({ bet, q }) {
    if (!st || st.over) return;
    const c = st.mineCard;
    const card = `<img class="ol-card" src="${THUMB[c.name]}" alt="Tu carta: ${esc(c.name)}">`;
    const truth = bet ? bet === c : q.f(c);
    st.botAsk = { bet, q, truth };
    const ask = bet
      ? `<p class="ol-k">El robot apuesta</p><div class="ol-row"><img class="ol-face" src="${THUMB[bet.name]}" alt="${esc(bet.name)}"><div><p class="ol-q">¿Tu carta es ${esc(bet.name)}?</p><p class="ol-m">Mira tu carta y responde.</p></div></div>`
      : `<p class="ol-k">El robot pregunta</p><div class="ol-row"><div class="ol-icon">${qIcon(q)}</div><div><p class="ol-q">${esc(q.q)}</p><p class="ol-m">${esc(q.means)}</p></div></div>`;
    overlay(`${ask}<div class="ol-you"><p class="ol-k">Tu carta</p>${card}</div>
      <div class="answers center"><button class="btn primary big" data-ans="1">Sí</button><button class="btn big" data-ans="0">No</button></div><p class="ol-a"></p>`);
    render(); tutEvent('robot'); const yes = $('#ol [data-ans="1"]'); if (yes) yes.focus({ preventScroll: true });
  }
  function answerBot(v) {
    const k = st && st.botAsk; if (!k || st.over) return;
    const c = st.mineCard, said = v === '1';
    if (said !== k.truth) {
      const why = k.bet ? `Tu carta es ${c.name}, no ${k.bet.name}.` : `${c.name} ${k.truth ? 'sí' : 'no'} lleva ${k.q.id.startsWith('HACE=') ? 'esa camiseta' : (TRAITS.find(t => t.id === k.q.id) || {}).thing}.`;
      overlayAnswer(`<span>Mira bien: ${esc(why)}</span>`, 'bad'); SND.no(); return;
    }
    $('#ol').querySelectorAll('[data-ans]').forEach(b => { b.disabled = true; });
    st.botAsk = null;
    if (k.bet) {
      if (k.truth) { overlayAnswer('<span>¡Ha acertado!</span>', 'bad'); botJump = 1; botSays(`¡Era ${c.name}!`); timer = setTimeout(() => { hideOverlay(); finish(false); }, T(1300)); return; }
      overlayAnswer(`<span>Falla y pierde el turno</span>`, 'good'); SND.yes(); face('sad');
      st.bot.push({ q: '__no', name: k.bet.name }); log('bot', `Robot: ¿Es ${k.bet.name}? → No. Pierde el turno.`);
      timer = setTimeout(afterBot, T(1300)); return;
    }
    tutEvent('answer');
    const before = consistent(st.bot).length; st.askedBot.add(k.q.id); st.bot.push({ q: k.q.id, a: k.truth });
    const after = consistent(st.bot).length;
    overlayAnswer(`<span>Respondiste ${k.truth ? 'SÍ' : 'NO'}. El robot descarta ${before - after}</span>`, k.truth ? 'good' : ''); k.truth ? SND.yes() : SND.no();
    log('bot', `Robot: ${k.q.q} → tú: ${k.truth ? 'Sí' : 'No'}. Descarta ${before - after}.`);
    timer = setTimeout(afterBot, T(1300));
  }
  function afterBot() {
    hideOverlay();
    const left = consistent(st.bot); theirs.forEach((x, i) => { const d = !left.includes(x.c); if (d !== x.down) { x.down = d; x.target = d ? FLAT : STAND; x.delay = REDUCE ? 0 : i * 0.05; } });
    face('idle'); st.turn = 'me'; render(); botSays(`Me quedan ${left.length}. Te toca.`);
    const f = document.querySelector('.qi:not([disabled])'); if (f && matchMedia('(min-width: 901px)').matches) f.focus({ preventScroll: true });
  }
  function finish(win) {
    st.over = { win }; face(win ? 'sad' : 'happy'); if (win) botSays(`Bien jugado: era ${st.theirCard.name}.`);
    announce(win ? '¡Has ganado!' : 'Gana el robot', win ? 'good' : 'bad'); win ? (SND.win(), confetti()) : (SND.lose(), botJump = 1);
    const shown = win ? st.theirCard : st.mineCard;
    mine.forEach(x => { x.liftTarget = x.c === st.theirCard ? 1 : 0; if (x.c !== st.theirCard && !x.down) { x.down = true; x.target = FLAT; } });
    const info = (c, who) => { const t = twin(c); return `<div class="rv"><p class="who">${who}</p><h3>${esc(c.name)} · ${esc(c.role)}</h3><p>${esc(c.what)}</p>
      <p class="meta">Se confunde con ${esc(t.o.role)}. Lo que los separa: ${esc(t.d.map(k => traitWord(k, c)).join(', '))}.</p></div>`; };
    const end = $('#end'); end.hidden = false;
    end.innerHTML = `<h2>${win ? 'Lo has adivinado' : 'El robot ha adivinado la tuya'}</h2>
      ${info(st.theirCard, 'La carta del robot')}${info(st.mineCard, 'Tu carta')}
      ${st.log.some(l => l.who === 'bot') ? `<div class="rv"><p class="who">Cómo buscaba el robot tu carta</p><ol class="log">${st.log.filter(l => l.who === 'bot').map(l => `<li class="bot">${esc(l.text.replace(/^Robot: /, ''))}</li>`).join('')}</ol></div>` : ''}
      <div class="cta"><p>Distinguir estos perfiles es lo difícil al contratar. Cuéntale al asistente de <b>nothiring</b> qué quieres conseguir y te dice qué perfil necesitas.</p>
        <button class="btn primary" id="openChat">¿Qué perfil necesito?</button></div>
      <div class="answers"><button class="btn" id="again">Jugar otra vez</button></div>`;
    render();
  }

  // Cierre: el chat de Landbot (asesor de perfiles) en una ventana encima del juego. El iframe se carga
  // solo al pedirlo, y se reutiliza si se cierra y se vuelve a abrir. Bot: juegos/quien-es-quien/landbot.
  // SUSTITUIR: URL de compartir (share) de TU bot de Landbot. Vacío = el cierre enseña un aviso en vez del chat.
  const CHAT_URL = '';
  function openChat() {
    const box = $('#lbchat'); box.hidden = false;
    if (!box.querySelector('iframe')) box.querySelector('.lbframe').innerHTML = CHAT_URL ? `<iframe src="${CHAT_URL}" title="Asistente de nothiring" allow="clipboard-write"></iframe>` : '<p class="lbwait">El chat de cierre no está configurado en este ejemplo: pon la URL de tu bot en CHAT_URL.</p>';
    $('#closeChat').focus({ preventScroll: true });
  }

  function confetti() {
    if (REDUCE) return;
    for (let i = 0; i < 18; i++) { const d = document.createElement('i'); d.className = 'confetti'; d.style.left = `${10 + Math.random() * 80}vw`; d.style.background = i % 3 ? '#94dd45' : '#edefe7';
      d.style.animationDelay = `${Math.random() * 0.25}s`; d.style.setProperty('--dx', `${(Math.random() - 0.5) * 120}px`); d.style.setProperty('--r', `${Math.random() * 720 - 360}deg`); document.body.appendChild(d); setTimeout(() => d.remove(), 2600); }
  }

  // ── Primer turno guiado ───────────────────────────────────────────────────────
  // Se enseña haciendo, sobre la partida real: un foco ilumina lo que toca y espera a que lo hagas.
  // Solo la primera vez (se recuerda en este navegador) y se puede saltar.
  const TUT = [
    { el: '#seeMine', text: 'Esta es tu carta. El robot intentará adivinarla haciéndote preguntas.', next: 'Vale' },
    { el: '.qi.hint', text: 'Tu turno. Toca el icono marcado: es la pregunta que más caras descarta ahora.', wait: 'pick' },
    { el: '.qdetail [data-ask]', text: 'Pulsa Preguntar. El robot responderá por su carta secreta.', wait: 'ask' },
    { el: '#flipAll', text: 'Las caras con una X no encajan con la respuesta. Abátelas.', wait: 'flip' },
    { el: '#ol', text: 'Ahora pregunta el robot. Mira tu carta y respóndele.', wait: 'answer', whenVisible: true },
    { el: '.bb', text: 'Aquí ves sus descartes. Seguid por turnos: cuando te quede una cara, la dices y ganas. Fin de la práctica.', next: 'Empezar la partida' },
  ];
  let tut = -1;
  const tutDone = () => { try { return localStorage.getItem('nh_tut') === '1'; } catch (e) { return false; } };
  function tutStart() { tut = 0; render(); }   // render pinta la etiqueta «Práctica» y coloca el foco
  function tutEnd() {
    tut = -1; try { localStorage.setItem('nh_tut', '1'); } catch (e) { /* sin almacenamiento: se repetirá */ } $('#coach').hidden = true;
    hideOverlay(); newGame(); announce('Ahora, la partida de verdad', 'good');
  }
  function tutEvent(ev) {
    if (tut < 0) return; const s = TUT[tut];
    if ((s.wait && s.wait === ev) || (s.next && ev === 'next')) { tut++; if (tut >= TUT.length) { tutEnd(); return; } }
    if (tut === TUT.length - 1) clearTimeout(timer);   // en el último paso la práctica se para
    placeCoach();
  }
  function placeCoach() {
    const c = $('#coach'); if (tut < 0) { c.hidden = true; return; }
    const s = TUT[tut], el = document.querySelector(s.el);
    if (!el || (s.whenVisible && el.hidden) || el.offsetParent === null && s.el !== '#ol') { c.hidden = true; return; }
    const r = el.getBoundingClientRect(); if (!r.width) { c.hidden = true; return; }
    c.hidden = false;
    const spot = c.querySelector('.spot'), tip = c.querySelector('.tip'), pad = 6;
    Object.assign(spot.style, { left: `${r.left - pad}px`, top: `${r.top - pad}px`, width: `${r.width + pad * 2}px`, height: `${r.height + pad * 2}px` });
    tip.innerHTML = `<p><span class="stepn">${tut + 1} de ${TUT.length}</span>${esc(s.text)}</p><div class="answers">${s.next ? `<button class="btn primary small" id="tutNext">${esc(s.next)}</button>` : ''}<button class="btn small" id="tutSkip">Saltar guía</button></div>`;
    const below = r.top < innerHeight / 2, tw = Math.min(300, innerWidth - 24);
    tip.style.width = `${tw}px`; tip.style.left = `${Math.max(12, Math.min(innerWidth - tw - 12, r.left + r.width / 2 - tw / 2))}px`;
    tip.style.top = below ? `${r.bottom + 14}px` : ''; tip.style.bottom = below ? '' : `${innerHeight - r.top + 14}px`;
  }

  // ── Intro corta: gancho y tres reglas, sin pantallas de reglas largas ─────────
  function intro() {
    const b = $('#intro'); b.hidden = false;
    b.innerHTML = `<div class="card-box" role="dialog" aria-modal="true" aria-labelledby="iT">
      <p class="brand">nothiring<b>.</b></p>
      <h2 id="iT">¿Sabrías distinguir a un AI Engineer de un Forward Deployed?</h2>
      <ol class="rules"><li>El robot esconde una cara y tú otra.</li><li>Preguntáis por turnos lo que se ve: «¿Lleva casco?».</li><li>Gana quien diga antes la cara del otro.</li></ol>
      <details class="legend-d"><summary>Qué significa cada objeto</summary><ul class="legend">${TRAITS.map(t => `<li><img src="${ICON[t.id]}" alt="" width="34" height="34"><span><b>${esc(t.thing)}</b> ${esc(t.means)}</span></li>`).join('')}
        <li class="wide">${SHIRTS.map(s => `<span class="swatch" style="background:${s.col}"></span>`).join('')}<span>El color de la camiseta dice qué hace sobre todo</span></li></ul></details>
      <div class="answers"><button class="btn primary" id="go">Jugar</button></div><p class="meta">Prototipo no oficial. Perfiles y rasgos son hipótesis.</p></div>`;
    $('#go').focus({ preventScroll: true });
  }

  // ── Eventos ──────────────────────────────────────────────────────────────────
  document.addEventListener('click', (e) => {
    if (e.target.closest('#go')) { SND.unlock(); $('#intro').hidden = true; if (!tutDone()) tutStart(); return; }
    if (e.target.closest('#tutNext')) { tutEvent('next'); return; }
    if (e.target.closest('#tutSkip')) { tutEnd(); return; }
    const mu = e.target.closest('#mute'); if (mu) { SND.muted = !SND.muted; mu.setAttribute('aria-pressed', String(SND.muted)); mu.textContent = SND.muted ? 'Sonido: no' : 'Sonido: sí'; return; }
    if (e.target.closest('#help')) { intro(); $('#go').textContent = 'Seguir'; return; }
    if (e.target.closest('#again')) { newGame(); return; }
    if (e.target.closest('#openChat')) { openChat(); return; }
    if (e.target.closest('#closeChat')) { $('#lbchat').hidden = true; return; }
    const an = e.target.closest('[data-ans]'); if (an) { answerBot(an.dataset.ans); return; }
    const pk = e.target.closest('[data-pick]'); if (pk) { SND.tick(); st.qsel = pk.dataset.pick; render(); tutEvent('pick'); return; }
    const fin = e.target.closest('[data-final]'); if (fin) { playerGuess(fin.dataset.final); return; }
    if (e.target.closest('#seeMine')) { st.sel = st.mineCard.name; renderInspect(); return; }
    if (e.target.closest('#closeInsp')) { st.sel = null; renderInspect(); return; }
    const a = e.target.closest('[data-ask]'); if (a) { st.qsel = null; playerAsk(a.dataset.ask); tutEvent('ask'); return; }
    if (e.target.closest('#flipAll')) { flipAll(); return; }
    if (e.target.closest('#guess')) { st.guessing = !st.guessing; render(); return; }
    if (e.target.closest('#cancelGuess')) { st.guessing = false; render(); return; }
  });
  const ray = new THREE.Raycaster(), ptr = new THREE.Vector2();
  function pick(ev) { const r = canvas.getBoundingClientRect(); ptr.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1); ray.setFromCamera(ptr, camera); const h = ray.intersectObjects(mine.map(x => x.body))[0]; return h ? h.object.userData.name : null; }
  canvas.addEventListener('pointermove', (ev) => { canvas.style.cursor = pick(ev) ? 'pointer' : 'default'; });
  canvas.addEventListener('pointerup', (ev) => {
    const n = pick(ev); if (!n || !st || st.over) return;
    if (st.turn === 'me' && st.phase === 'flip' && st.pending.includes(n)) { flip(n); return; }
    if (st.turn === 'me' && st.guessing && !cardByName[n].down) { playerGuess(n); return; }
    st.sel = st.sel === n ? null : n; renderInspect();
  });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && st) { st.sel = null; st.guessing = false; render(); } });
  document.addEventListener('visibilitychange', () => { if (document.hidden) clearTimeout(timer); else if (st && st.turn === 'bot' && !st.over && !st.botAsk && $('#ol').hidden) timer = setTimeout(botThink, 600); });

  // ── Animación ────────────────────────────────────────────────────────────────
  const clock = new THREE.Clock(); const hp = new THREE.Vector3();
  function step(x, dt, t) {
    if (x.delay > 0) { x.delay -= dt; } else if (REDUCE) { x.angle = x.target; } else {
      const k = 70, c = 9; x.vel += ((x.target - x.angle) * k - x.vel * c) * dt; x.angle += x.vel * dt;
      if (x.angle > FLAT) { if (x.vel > 2 && t - lastClac > 0.4) { lastClac = t; SND.clac(); trauma = Math.min(1, trauma + 0.35); } x.angle = FLAT; x.vel = -x.vel * 0.28; }
    }
    x.lift += (x.liftTarget - x.lift) * (REDUCE ? 1 : Math.min(1, dt * 6));
    x.pivot.rotation.x = x.angle; x.pivot.position.y = x.baseY + x.lift * 0.5;
    if (x.mark) x.mark.material.opacity = x.marked ? 0.55 + Math.sin(t * 8) * 0.25 : 0;
  }
  function tick() {
    const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime;
    mine.forEach(x => { step(x, dt, t); x.pivot.scale.setScalar(1 + x.lift * 0.15); }); theirs.forEach(x => step(x, dt, t));
    const th = mood === 'think', hpY = mood === 'happy';
    botHead.rotation.z = Math.sin(t * 1.4) * 0.04 + (th ? 0.12 : 0); botHead.position.y = 3.35 + Math.sin(t * 2) * 0.03;
    armR.rotation.z = th ? -2.6 : hpY ? -2.9 + Math.sin(t * 8) * 0.25 : Math.sin(t * 1.6) * 0.05; armL.rotation.z = hpY ? 2.9 - Math.sin(t * 8) * 0.25 : -Math.sin(t * 1.6) * 0.05;
    ant.material.emissiveIntensity = 0.5 + Math.sin(t * 4) * 0.3;
    const b = $('#bubble'); if (!b.hidden) { hp.setFromMatrixPosition(botHead.matrixWorld); hp.y += 1.1; hp.project(camera); const r = canvas.getBoundingClientRect(); // Sin salirse de la pantalla: en vertical la cabeza del robot queda arriba del todo.
      const half = b.offsetWidth / 2 + 8; b.style.left = `${Math.min(r.width - half, Math.max(half, (hp.x * 0.5 + 0.5) * r.width))}px`;
      b.style.top = `${Math.max(b.offsetHeight + 64, (-hp.y * 0.5 + 0.5) * r.height)}px`; }
    // Sacudida suave por «trauma» que decae (solo la cámara), y acercamiento al empezar.
    trauma = Math.max(0, trauma - dt * 2.2); dolly += (1 - dolly) * Math.min(1, dt * 2.2); shakeT += dt * 30;
    const sh = REDUCE ? 0 : trauma * trauma * 0.06;
    camera.position.copy(camBase).sub(camLook).multiplyScalar(dolly).add(camLook);
    camera.position.x += Math.sin(shakeT * 1.7) * sh; camera.position.y += Math.sin(shakeT * 2.3) * sh;
    camera.lookAt(camLook);
    botJump = Math.max(0, botJump - dt * 1.4); bot.position.y = REDUCE ? 0 : Math.abs(Math.sin(botJump * Math.PI * 3)) * botJump * 0.6;
    if (mood === 'sad') botHead.rotation.x = 0.25; else botHead.rotation.x = 0;
    if (tut >= 0 && TUT[tut].whenVisible) placeCoach();
    renderer.render(scene, camera); requestAnimationFrame(tick);
  }
  window.__nh = { ROLES, QS, consistent, get st() { return st; }, playerAsk, flipAll, playerGuess, newGame, camera, mine };
  resize(); newGame(); intro(); tick();
})();
