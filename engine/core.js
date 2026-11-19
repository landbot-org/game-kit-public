/* GK: motor mínimo para juegos de evento en un solo HTML. Three.js r128 (global THREE).
 * Sale de «¿Quién es quién en IA?» (juegos/quien-es-quien) y de Paella Police.
 * Lo que trae: sonido sintetizado, aviso grande, bocadillo que sigue a un objeto 3D, tarjeta central,
 * guía con foco sobre la partida real, confeti, cámara con encuadre vertical y sacudida, cartas con
 * bisagra y muelle, bucle con tiempo de juego que se congela al ocultar la pestaña, y ganchos de prueba.
 * API documentada en docs/04-motor.md. */
(function () {
  'use strict';
  const REDUCE = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const rnd = (n) => Math.floor(Math.random() * n);
  // Duración de una espera: con movimiento reducido, como mucho medio segundo.
  const T = (ms) => REDUCE ? Math.min(ms, 500) : ms;

  // ── Sonido sintetizado: sin archivos, arranca con el primer toque ─────────────
  const sound = (() => {
    let ctx = null, muted = false;
    const tone = (f, d, type = 'sine', g = 0.07, when = 0) => {
      if (muted || !ctx) return; const t0 = ctx.currentTime + when;
      const o = ctx.createOscillator(), v = ctx.createGain(); o.type = type; o.frequency.setValueAtTime(f, t0);
      v.gain.setValueAtTime(0.0001, t0); v.gain.exponentialRampToValueAtTime(g, t0 + 0.012); v.gain.exponentialRampToValueAtTime(0.0001, t0 + d);
      o.connect(v).connect(ctx.destination); o.start(t0); o.stop(t0 + d + 0.02);
    };
    const clac = () => { // golpe de carta: ruido corto filtrado y un grave
      if (muted || !ctx) return; const t0 = ctx.currentTime, n = ctx.createBuffer(1, ctx.sampleRate * 0.06, ctx.sampleRate), d = n.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length) ** 3;
      const src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), v = ctx.createGain(); src.buffer = n; f.type = 'lowpass'; f.frequency.value = 1400; v.gain.value = 0.22;
      src.connect(f).connect(v).connect(ctx.destination); src.start(t0); tone(130, 0.09, 'sine', 0.12);
    };
    return {
      unlock() { if (!ctx) { try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { ctx = null; } } if (ctx && ctx.state === 'suspended') ctx.resume(); },
      suspend(v) { if (ctx) v ? ctx.suspend() : ctx.resume(); },
      get muted() { return muted; }, set muted(v) { muted = v; },
      tone, clac,
      tick() { tone(1200, 0.04, 'triangle', 0.035); },
      yes() { tone(660, 0.09, 'sine', 0.06); tone(990, 0.12, 'sine', 0.05, 0.08); },
      no() { tone(240, 0.14, 'triangle', 0.06); },
      robot() { tone(320, 0.06, 'square', 0.025); tone(480, 0.06, 'square', 0.025, 0.07); },
      win() { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.18, 'triangle', 0.06, i * 0.1)); },
      lose() { [392, 330, 262].forEach((f, i) => tone(f, 0.22, 'triangle', 0.05, i * 0.15)); },
    };
  })();

  // ── Tiempo de juego: los temporizadores avanzan con el bucle, no con setTimeout ─
  // Así se congelan al ocultar la pestaña y las pruebas pueden adelantar el tiempo.
  let now = 0, seq = 0; const timers = new Map();
  function after(ms, fn) { const id = ++seq; timers.set(id, { at: now + ms / 1000, fn }); return id; }
  function cancel(id) { timers.delete(id); }
  function cancelAll() { timers.clear(); }
  function runTimers() { for (const [id, t] of [...timers]) if (t.at <= now && timers.has(id)) { timers.delete(id); t.fn(); } }

  let paused = false, onUpdate = null, onRender = null;
  function advance(dt) { now += dt; runTimers(); if (onUpdate) onUpdate(dt, now); }
  function loop(update, render) {
    onUpdate = update; onRender = render; let last = performance.now();
    function frame(t) { const dt = Math.min((t - last) / 1000, 0.05); last = t; if (!paused) advance(dt); if (onRender) onRender(); requestAnimationFrame(frame); }
    document.addEventListener('visibilitychange', () => { paused = document.hidden; last = performance.now(); sound.suspend(paused); });
    requestAnimationFrame(frame);
  }
  // Para pruebas: avanza el juego en pasos de 1/60 s y pinta una vez.
  function advanceTime(ms) { let left = ms / 1000; while (left > 0) { const d = Math.min(left, 1 / 60); advance(d); left -= d; } if (onRender) onRender(); }

  // ── Avisos, bocadillo y tarjeta central: una información por canal ──────────
  function announce(text, kind = '', ms) { const b = $('#banner'); b.textContent = text; b.className = 'show ' + kind; clearTimeout(announce.t); announce.t = setTimeout(() => { b.className = ''; }, ms || (REDUCE ? 1100 : 1700)); }
  function say(text) { const b = $('#bubble'); b.textContent = text || ''; b.hidden = !text; }
  const overlay = {
    show(html) { say(''); const o = $('#ol'); o.innerHTML = html; o.hidden = false; },   // un solo foco: el bocadillo se oculta
    answer(html, kind = '') { const r = $('#ol .ol-a'); if (r) { r.innerHTML = html; r.className = 'ol-a show ' + kind; } },
    hide() { $('#ol').hidden = true; },
    get open() { return !$('#ol').hidden; },
  };
  function intro({ brand = '', title, rules = [], extra = '', button = 'Jugar', note = '', onGo }) {
    const b = $('#intro'); b.hidden = false;
    b.innerHTML = `<div class="card-box" role="dialog" aria-modal="true" aria-labelledby="iT">
      ${brand ? `<p class="brand">${brand}</p>` : ''}<h2 id="iT">${esc(title)}</h2>
      <ol class="rules">${rules.map(r => `<li>${esc(r)}</li>`).join('')}</ol>${extra}
      <div class="answers"><button class="btn primary" id="go">${esc(button)}</button></div>${note ? `<p class="meta">${esc(note)}</p>` : ''}</div>`;
    $('#go').onclick = () => { sound.unlock(); b.hidden = true; onGo && onGo(); };
    $('#go').focus({ preventScroll: true });
  }
  function end(html) { const e = $('#end'); e.innerHTML = html; e.hidden = !html; }

  function confetti(colors = ['var(--accent)', 'var(--text)']) {
    if (REDUCE) return;
    for (let i = 0; i < 18; i++) { const d = document.createElement('i'); d.className = 'confetti'; d.style.left = `${10 + Math.random() * 80}vw`; d.style.background = colors[i % colors.length];
      d.style.animationDelay = `${Math.random() * 0.25}s`; d.style.setProperty('--dx', `${(Math.random() - 0.5) * 120}px`); d.style.setProperty('--r', `${Math.random() * 720 - 360}deg`); document.body.appendChild(d); setTimeout(() => d.remove(), 2600); }
  }

  // ── Guía sobre la partida real ───────────────────────────────────────────────
  // steps: [{ el, text, next: 'texto del botón' } | { el, text, wait: 'evento', whenVisible, tipSide }]
  // el: selector, elemento, rectángulo {left, top, width, height} o función que devuelve uno de los anteriores (para iluminar un canvas).
  // tipSide: 'above' | 'below'; sin ponerlo, la caja va debajo si cabe y si no encima.
  // El juego llama a coach.event('evento') cuando el jugador hace lo que se pide.
  function coach({ steps, storageKey = 'gk_tut', onEnd }) {
    const box = $('#coach'), spot = box.querySelector('.spot'), tip = box.querySelector('.tip');
    let i = -1, shown = -1;
    const api = {
      get active() { return i >= 0; }, get index() { return i; },
      done() { try { return localStorage.getItem(storageKey) === '1'; } catch (e) { return false; } },
      start() { i = 0; shown = -1; api.place(); },
      event(ev) {
        if (i < 0) return; const s = steps[i];
        if ((s.wait && s.wait === ev) || (s.next && ev === 'next')) { i++; if (i >= steps.length) { api.end(); return; } }
        api.place();
      },
      end() { i = -1; try { localStorage.setItem(storageKey, '1'); } catch (e) { /* sin almacenamiento: se repetirá */ } box.hidden = true; onEnd && onEnd(); },
      place() { // se llama en cada fotograma mientras la guía está activa: solo recoloca
        if (i < 0) { box.hidden = true; return; }
        const s = steps[i]; let el = typeof s.el === 'function' ? s.el() : s.el;
        if (typeof el === 'string') el = document.querySelector(el);
        if (!el || (s.whenVisible && el.hidden)) { box.hidden = true; return; }
        const r = typeof el.getBoundingClientRect === 'function' ? el.getBoundingClientRect()
          : { left: el.left, top: el.top, width: el.width, height: el.height, right: el.left + el.width, bottom: el.top + el.height };
        if (!r.width) { box.hidden = true; return; }
        box.hidden = false;
        if (shown !== i) { shown = i; tip.innerHTML = `<p><span class="stepn">${i + 1} de ${steps.length}</span>${esc(s.text)}</p><div class="answers">${s.next ? `<button class="btn primary small" id="coachNext">${esc(s.next)}</button>` : ''}<button class="btn small" id="coachSkip">Saltar guía</button></div>`; }
        const pad = 6; Object.assign(spot.style, { left: `${r.left - pad}px`, top: `${r.top - pad}px`, width: `${r.width + pad * 2}px`, height: `${r.height + pad * 2}px` });
        const tw = Math.min(300, innerWidth - 24), G = 14;
        tip.style.width = `${tw}px`; tip.style.left = `${Math.max(12, Math.min(innerWidth - tw - 12, r.left + r.width / 2 - tw / 2))}px`;
        // la caja va donde cabe: debajo si hay sitio, si no encima, y siempre dentro de la pantalla
        const th = tip.offsetHeight, roomBelow = innerHeight - r.bottom - G, roomAbove = r.top - G;
        const below = s.tipSide ? s.tipSide === 'below' : (roomBelow >= th || (roomAbove < th && roomBelow >= roomAbove));
        tip.style.bottom = ''; tip.style.top = `${Math.max(8, Math.min(innerHeight - th - 8, below ? r.bottom + G : r.top - G - th))}px`;
      },
    };
    box.addEventListener('click', (e) => { if (e.target.closest('#coachNext')) api.event('next'); else if (e.target.closest('#coachSkip')) api.end(); });
    return api;
  }

  // ── Cámara: encuadre por formato, acercamiento inicial y sacudida que decae ───
  // views: { desktop: { base:[x,y,z], look:[x,y,z], fov, dx }, portrait: { base, look, fov, dy } }
  // dx desplaza la escena a la derecha para dejar sitio al panel; dy (fracción del alto) la sube.
  function rig(camera, renderer, views, { breakpoint = 900 } = {}) {
    const base = new THREE.Vector3(), look = new THREE.Vector3(), hp = new THREE.Vector3();
    let trauma = 0, dolly = 1, shakeT = 0, lastHit = -1, follow = null;
    const r = {
      get portrait() { return innerWidth <= breakpoint; },
      resize() {
        const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h;
        const v = r.portrait ? views.portrait : views.desktop;
        camera.fov = v.fov || 45; base.set(...v.base); look.set(...v.look); camera.position.copy(base); camera.lookAt(look);
        const dx = r.portrait ? 0 : (v.dx || 0), dy = r.portrait ? Math.round(h * (v.dy || 0)) : 0;
        if (dx || dy) camera.setViewOffset(w, h, dx, dy, w, h); else camera.clearViewOffset();
        camera.updateProjectionMatrix();
      },
      shake(amount = 0.35) { trauma = Math.min(1, trauma + amount); },
      dollyFrom(v = 1.18) { dolly = REDUCE ? 1 : v; },
      // Golpe con peso: sonido y sacudida, como mucho uno cada 0,4 s aunque caigan varias cartas.
      impact(amount = 0.35) { if (now - lastHit < 0.4) return; lastHit = now; sound.clac(); r.shake(amount); },
      follow(el, obj, offsetY = 1.1, minTop = 64) { follow = { el, obj, offsetY, minTop }; },
      update(dt) {
        trauma = Math.max(0, trauma - dt * 2.2); dolly += (1 - dolly) * Math.min(1, dt * 2.2); shakeT += dt * 30;
        const sh = REDUCE ? 0 : trauma * trauma * 0.06;
        camera.position.copy(base).sub(look).multiplyScalar(dolly).add(look);
        camera.position.x += Math.sin(shakeT * 1.7) * sh; camera.position.y += Math.sin(shakeT * 2.3) * sh;
        camera.lookAt(look);
        if (follow && !follow.el.hidden) { // bocadillo pegado al objeto, sin salirse de la pantalla
          hp.setFromMatrixPosition(follow.obj.matrixWorld); hp.y += follow.offsetY; hp.project(camera);
          const b = follow.el, half = b.offsetWidth / 2 + 8;
          b.style.left = `${Math.min(innerWidth - half, Math.max(half, (hp.x * 0.5 + 0.5) * innerWidth))}px`;
          b.style.top = `${Math.max(b.offsetHeight + follow.minTop, (-hp.y * 0.5 + 0.5) * innerHeight)}px`;
        }
      },
    };
    addEventListener('resize', r.resize); r.resize();
    return r;
  }

  // ── Carta con bisagra: de pie o abatida, con muelle y rebote al tocar ────────
  const STAND = -0.16, FLAT = Math.PI / 2 - 0.03;
  function markTexture(kind = 'no') { // marca que no depende del color: X blanca o check
    const c = document.createElement('canvas'); c.width = 128; c.height = 168; const g = c.getContext('2d');
    const col = kind === 'no' ? '226,98,94' : '148,221,69';
    g.fillStyle = `rgba(${col},.35)`; g.fillRect(0, 0, 128, 168); g.strokeStyle = `rgb(${col})`; g.lineWidth = 12; g.strokeRect(6, 6, 116, 156);
    g.strokeStyle = '#ffffff'; g.lineWidth = 10; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath();
    if (kind === 'no') { g.moveTo(34, 54); g.lineTo(94, 114); g.moveTo(94, 54); g.lineTo(34, 114); } else { g.moveTo(32, 86); g.lineTo(56, 110); g.lineTo(98, 60); }
    g.stroke(); return new THREE.CanvasTexture(c);
  }
  // front: canvas de la cara. Devuelve el estado de la carta; pivot va en la base, la carta gira en x.
  function card({ front, w = 1.02, h = 1.34, back = 0x94dd45, edge = 0xf4f4f5 }) {
    const std = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.6 }, o));
    const frontM = std(0xffffff, { map: new THREE.CanvasTexture(front), roughness: 0.55 }); frontM.map.anisotropy = 8;
    const edgeM = std(edge), body = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.06), [edgeM, edgeM, edgeM, edgeM, frontM, std(back, { roughness: 0.55 })]);
    body.position.y = h / 2; body.castShadow = true; body.receiveShadow = true;
    const mark = new THREE.Mesh(new THREE.PlaneGeometry(w + 0.1, h + 0.1), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 }));
    mark.position.set(0, h / 2, 0.04);
    const pivot = new THREE.Group(); pivot.add(body, mark);
    return { pivot, body, mark, angle: STAND, vel: 0, target: STAND, delay: 0, marked: null };
  }
  // Muelle k=70, c=9: toca a los ~300 ms; al tocar rebota un 28 % y llama a onHit(velocidad).
  function spring(x, dt, onHit) {
    if (x.delay > 0) { x.delay -= dt; } else if (REDUCE) { x.angle = x.target; x.vel = 0; } else {
      x.vel += ((x.target - x.angle) * 70 - x.vel * 9) * dt; x.angle += x.vel * dt;
      if (x.angle > FLAT) { if (x.vel > 2 && onHit) onHit(x.vel); x.angle = FLAT; x.vel = -x.vel * 0.28; }
    }
    x.pivot.rotation.x = x.angle;
    if (x.mark) x.mark.material.opacity = x.marked ? 0.55 + Math.sin(now * 8) * 0.25 : 0;
  }
  const MARKS = {};
  function setMark(x, kind) { // kind: 'no' | 'yes' | null
    x.marked = kind; if (!kind) return;
    x.mark.material.map = MARKS[kind] || (MARKS[kind] = markTexture(kind)); x.mark.material.needsUpdate = true;
  }

  // ── Ganchos de prueba (contrato de develop-web-game y game-creator) ──────────
  // window.__game.state() y window.render_game_to_text() describen la partida; advanceTime(ms) la adelanta.
  function expose(api) {
    window.__game = Object.assign({ step: advanceTime }, api);
    window.render_game_to_text = () => JSON.stringify(api.state ? api.state() : {});
    window.advanceTime = advanceTime;
  }

  window.GK = { REDUCE, $, esc, rnd, T, sound, after, cancel, cancelAll, loop, advanceTime, get time() { return now; },
    announce, say, overlay, intro, end, confetti, coach, rig, card, spring, setMark, markTexture, STAND, FLAT, expose };
})();
