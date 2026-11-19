const { test, expect } = require('@playwright/test');
const { abrir, jugar, esperarSinErrores } = require('./helpers');
const RUTA = '/juegos/pistacho-imperium/dist/index.html';
const GUIA = 'pistacho_tut';

// Juega hasta el final con el jugador automático (misma política que el robot) y devuelve el estado.
const partidaEntera = (page, nivel = 1, umbral = 1) => page.evaluate(([nivel, umbral]) => {
  const g = __game; g.setLevel(nivel); g.newGame(); let guard = 0;
  while (!g.state().over && guard++ < 100) { const s = g.state(); if (s.phase === 'plant' || s.phase === 'attack') g.autoTurn(umbral); let z = 0; while (g.state().phase === 'robot' && !g.state().over && z++ < 400) g.step(250); }
  g.step(2000); return g.state();
}, [nivel, umbral]);

test('arranca sin errores, en español y sin elegir equipo', async ({ page }) => {
  const errores = await abrir(page, RUTA, { guia: GUIA });
  const intro = await page.locator('#intro').innerText();
  expect(intro).toContain('Aquí el pistacho se cultiva, no se importa.');
  expect(intro).toContain('5 %');
  await expect(page.locator('[data-team]')).toHaveCount(0);
  esperarSinErrores(errores);
});

test('lleva el favicon de pistacho incrustado (sigue siendo un solo HTML)', async ({ page }) => {
  await abrir(page, RUTA, { guia: GUIA });
  const href = await page.locator('link[rel="icon"]').getAttribute('href');
  expect(href.startsWith('data:image/svg+xml,')).toBe(true);
  expect(decodeURIComponent(href)).toContain('#8DB255'); // el verde pistacho de la marca inventada
  const ok = await page.evaluate(href => new Promise(res => { const i = new Image(); i.onload = () => res(i.naturalWidth > 0); i.onerror = () => res(false); i.src = href; }), href);
  expect(ok).toBe(true);
});

test('el mapa tiene 19 territorios con las vecinas reales y 5 zonas', async ({ page }) => {
  await abrir(page, RUTA, { guia: GUIA });
  const m = await page.evaluate(() => ({ n: __game.N, vecinas: __game.NB.map(v => v.length) }));
  expect(m.n).toBe(19);
  expect(m.vecinas.reduce((a, b) => a + b, 0)).toBe(2 * 34); // 34 aristas distintas (fronteras terrestres y 5 enlaces por mar), cada vecina una sola vez
  expect(Math.min(...m.vecinas)).toBe(1); // Canarias, Ceuta y Melilla
});

test('la guía recorre sus 6 pasos y deja una partida nueva', async ({ page }) => {
  const errores = await abrir(page, RUTA);
  await jugar(page);
  const idx = () => page.evaluate(() => __game.coach.index);
  expect(await idx()).toBe(0);
  await page.evaluate(() => { while (__game.state().pool > 0) __game.plant(__game.state().own.indexOf(0)); __game.step(500); });
  expect(await idx()).toBe(1);
  await page.evaluate(() => {
    const g = __game, s = g.state(); let best = null;
    for (let i = 0; i < g.N; i++) { if (s.own[i] !== 0 || s.arm[i] < 2) continue; for (const j of g.NB[i]) if (s.own[j] === 1) { const sc = s.arm[i] - s.arm[j]; if (!best || sc > best.sc) best = { sc, i, j }; } }
    g.select(best.i); g.select(best.j); g.step(300);
  });
  expect(await idx()).toBe(2);
  await page.evaluate(() => { __game.attack(false); __game.step(300); }); expect(await idx()).toBe(3);
  await page.locator('#next').click(); expect(await idx()).toBe(4);
  await page.evaluate(() => { __game.startMove(); __game.step(200); }); expect(await idx()).toBe(5);
  await page.evaluate(() => { __game.cancel(); __game.endTurn(); __game.step(300); });
  const st = await page.evaluate(() => __game.state());
  expect(st.practice).toBe(false); expect(st.phase).toBe('plant'); expect(st.round).toBe(1); expect(st.mine).toBe(9);
  esperarSinErrores(errores);
});

test('las cajas de la guía quedan dentro de la pantalla y no tapan lo iluminado', async ({ page }) => {
  await abrir(page, RUTA);
  await jugar(page);
  const medir = () => page.evaluate(() => { const r = s => document.querySelector(s).getBoundingClientRect(); const t = r('#coach .tip'), f = r('#coach .spot');
    return { dentro: t.left >= 0 && t.right <= innerWidth && t.top >= 0 && t.bottom <= innerHeight, tapa: !(t.right <= f.left || f.right <= t.left || t.bottom <= f.top || f.bottom <= t.top) }; });
  expect(await medir()).toEqual({ dentro: true, tapa: false });
  await page.evaluate(() => { while (__game.state().pool > 0) __game.plant(__game.state().own.indexOf(0)); __game.step(500); });
  await page.waitForTimeout(300);
  expect(await medir()).toEqual({ dentro: true, tapa: false });
});

test('30 partidas seguidas acaban sin errores y el jugador es siempre el español', async ({ page }) => {
  const errores = await abrir(page, RUTA, { guia: GUIA });
  await jugar(page);
  const r = await page.evaluate(() => { let ok = 0; for (let k = 0; k < 30; k++) { __game.setLevel(1); __game.newGame(); let g = 0; while (!__game.state().over && g++ < 100) { const s = __game.state(); if (s.phase === 'plant' || s.phase === 'attack') __game.autoTurn(1); let z = 0; while (__game.state().phase === 'robot' && !__game.state().over && z++ < 400) __game.step(250); } if (__game.state().over && __game.state().me === 'es') ok++; } return ok; });
  expect(r).toBe(30);
  esperarSinErrores(errores);
});

test('reglas: los dados dan las probabilidades exactas y el JS reproduce la simulación', async ({ page }) => {
  await abrir(page, RUTA, { guia: GUIA });
  const r = await page.evaluate(() => ({ p42: __game.pwin(4, 2), p11: __game.pwin(1, 1), p81: __game.pwin(8, 1), espejo: __game.headless(1, 1, 3000), agrVsCauto: __game.headless(0, 2, 3000) }));
  expect(r.p42).toBeGreaterThan(0.77); expect(r.p42).toBeLessThan(0.81); // sim.py: 0,79
  expect(r.p11).toBeGreaterThan(0.40); expect(r.p11).toBeLessThan(0.44); // sim.py: 0,42
  expect(r.p81).toBeGreaterThan(0.99);
  expect(r.espejo.winsPlayer).toBeGreaterThan(0.43); expect(r.espejo.winsPlayer).toBeLessThan(0.57); // sim3.py: 0,49 a 0,50
  expect(r.espejo.ownTurns).toBeGreaterThan(5); expect(r.espejo.ownTurns).toBeLessThan(6.6);
  expect(r.agrVsCauto.winsPlayer).toBeGreaterThan(r.espejo.winsPlayer); // atacar pronto compensa
});

test('pasar plantas: un traslado por turno entre territorios propios pegados, y acaba el turno', async ({ page }) => {
  const errores = await abrir(page, RUTA, { guia: GUIA });
  await jugar(page);
  const r = await page.evaluate(() => {
    const g = __game; let s = g.state(); const src = s.own.findIndex((o, i) => o === 0 && g.NB[i].some(j => s.own[j] === 0));
    while (g.state().pool > 0) g.plant(src); g.step(2200); s = g.state();
    const dst = g.NB[src].find(j => s.own[j] === 0); g.startMove(); g.selectMove(src); g.selectMove(dst);
    const antes = [g.state().arm[src], g.state().arm[dst]]; const rival = s.own.findIndex(o => o === 1);
    g.doMove(1); const despues = [g.state().arm[src], g.state().arm[dst]]; const fase = g.state().phase; g.step(1500);
    return { antes, despues, fase, tras: g.state().phase, rival };
  });
  expect(r.despues[0]).toBe(r.antes[0] - 1); expect(r.despues[1]).toBe(r.antes[1] + 1);
  expect(r.fase).toBe('moved'); expect(r.tras).toBe('robot');
  esperarSinErrores(errores);
});

test('el premio: ganar da el cupón del 5 % y perder lo explica; el botón es «Ver mi premio»', async ({ page }) => {
  const errores = await abrir(page, RUTA, { guia: GUIA });
  await jugar(page);
  let gana = false;
  for (let k = 0; k < 14 && !gana; k++) { const st = await partidaEntera(page, 0, 1); gana = st.over.win; }
  expect(gana).toBe(true);
  await expect(page.locator('#end .ticket')).toContainText('Has ganado un 5 % de descuento en Vergel');
  await expect(page.locator('#openChat')).toContainText('Ver mi premio');
  await expect(page.locator('#openChat')).toContainText('Y cómo hacer un juego así');
  let pierde = false;
  for (let k = 0; k < 14 && !pierde; k++) { const st = await partidaEntera(page, 2, 3); pierde = !st.over.win; }
  expect(pierde).toBe(true);
  await expect(page.locator('#end .ticket')).toContainText('Esta vez no hay descuento');
  esperarSinErrores(errores);
});

test('si el chat de Landbot no carga, el final enseña el enlace para reservar una llamada', async ({ page }) => {
  await page.route('**/cdn.landbot.io/**', r => r.abort());
  const errores = await abrir(page, RUTA, { guia: GUIA, ignorarErrores: [/Failed to load resource/, /landbot/i, /Failed to fetch dynamically imported module/] });
  await jugar(page);
  await partidaEntera(page);
  await page.locator('#openChat').click();
  await expect(page.locator('.lbfail')).toBeVisible();
  await expect(page.locator('.lbfail a')).toHaveCount(1);
  const hrefs = await page.locator('.lbfail a').evaluateAll(as => as.map(a => a.href));
  expect(hrefs.some(h => h.includes('example.com/reserva'))).toBe(true);
  esperarSinErrores(errores);
});

test('Reiniciar pide confirmar a mitad de partida y vuelve al principio', async ({ page }) => {
  await abrir(page, RUTA, { guia: GUIA });
  await jugar(page);
  const r = await page.evaluate(() => {
    const g = __game; g.plant(g.state().own.indexOf(0)); const b = document.querySelector('#reset'); b.click();
    const armado = [b.textContent, b.classList.contains('armed')]; b.click();
    return { armado, tras: b.textContent, st: g.state() };
  });
  expect(r.armado).toEqual(['¿Seguro?', true]); expect(r.tras).toBe('Reiniciar');
  expect(r.st.round).toBe(1); expect(r.st.phase).toBe('plant'); expect(r.st.level).toBe(0);
});

test('se puede jugar con teclado: hay un botón por territorio y plantar desde uno funciona', async ({ page }) => {
  await abrir(page, RUTA, { guia: GUIA });
  await jugar(page);
  expect(await page.locator('#kb button').count()).toBe(19);
  const r = await page.evaluate(() => { const g = __game, s = g.state(), i = s.own.indexOf(0), antes = s.arm[i]; document.querySelectorAll('#kb button')[i].click(); return [antes, g.state().arm[i]]; });
  expect(r[1]).toBe(r[0] + 1);
});

// ── Inglés (?lang=en): todo lo visible sale en inglés ───────────────────────────
const ESPANOL = /[áéíóúñ¿¡]|\b(tu turno|plantones|territorios|ronda|premio|dados|tirada|terminar|cancelar|reiniciar|sonido|robot juega|pasar plantas|gana)\b/i;
const visible = (page) => page.evaluate(() => [...document.querySelectorAll('#intro,#say,#end,#ol,#banner,.top,#coach,#lbchat')].filter(e => !e.hidden).map(e => e.innerText).join('\n').replace(/Español/g, '').toLowerCase());

test('en inglés: intro, panel, dados, guía y final sin texto en español', async ({ page }) => {
  const errores = await abrir(page, RUTA + '?lang=en');
  expect(await page.locator('html').getAttribute('lang')).toBe('en');
  const intro = await page.locator('#intro').innerText();
  expect(intro).toContain('Here pistachios are grown, not imported.');
  expect(intro).toContain('5% off at Vergel');
  expect(intro).toContain('Landbot demo');
  expect(await visible(page)).not.toMatch(ESPANOL);
  await jugar(page);
  const guia = await visible(page);
  expect(guia).toContain('1 of 6');
  expect(guia).toContain('skip guide');
  expect(guia).not.toMatch(ESPANOL);
  await page.locator('#coachSkip').click();
  await page.evaluate(() => { __game.step(500); const g = __game; while (g.state().pool > 0) g.plant(g.state().own.indexOf(0)); g.step(300); });
  expect(await visible(page)).toContain('your turn: attack');
  await page.evaluate(() => {
    const g = __game, s = g.state(); let best = null;
    for (let i = 0; i < g.N; i++) { if (s.own[i] !== 0 || s.arm[i] < 2) continue; for (const j of g.NB[i]) if (s.own[j] === 1) { const sc = s.arm[i] - s.arm[j]; if (!best || sc > best.sc) best = { sc, i, j }; } }
    g.select(best.i); g.select(best.j); g.step(300);
  });
  const antes = await visible(page); expect(antes).toContain('one roll'); expect(antes).not.toMatch(ESPANOL);
  await page.evaluate(() => { __game.attack(false); __game.step(300); });
  const dados = await visible(page); expect(dados).toContain('continue'); expect(dados).not.toMatch(ESPANOL);
  await page.locator('#next').click();
  await page.evaluate(() => { __game.endTurn(); __game.step(600); });
  expect(await visible(page)).not.toMatch(ESPANOL);
  await page.evaluate(() => { __game.step(4000); });
  expect(await visible(page)).not.toMatch(ESPANOL);
  const st = await partidaEntera(page, 1, 1);
  expect(st.over).toBeTruthy();
  const fin = await page.locator('#end').innerText();
  expect(fin).toMatch(/You won|The robot beat you/);
  expect(fin).toContain('Source:');
  expect(fin).not.toMatch(ESPANOL);
  await page.locator('#openChat').click();
  await page.waitForTimeout(300);
  const chat = await page.locator('#lbchat').innerText();
  expect(chat).toContain('Back to the game');
  expect(chat).not.toMatch(ESPANOL);
  esperarSinErrores(errores);
});

test('el selector de idioma cambia entre español e inglés y recuerda la elección', async ({ page }) => {
  const errores = await abrir(page, RUTA, { guia: GUIA });
  expect(await page.locator('html').getAttribute('lang')).toBe('es');
  await page.locator('#intro [data-lang="en"]').click();
  await page.waitForFunction(() => window.__game && window.GK && document.documentElement.lang === 'en');
  expect(await page.locator('#intro').innerText()).toContain('Here pistachios are grown');
  await page.reload({ waitUntil: 'load' }); // sin ?lang: la URL ya lo lleva; la elección también queda guardada
  await page.waitForFunction(() => window.__game && window.GK);
  expect(await page.locator('html').getAttribute('lang')).toBe('en');
  await page.evaluate(() => localStorage.removeItem('pistacho_lang'));
  await page.goto(RUTA); await page.waitForFunction(() => window.__game && window.GK);
  expect(await page.locator('html').getAttribute('lang')).toBe('es');
  expect(await page.locator('#intro').innerText()).toContain('Aquí el pistacho se cultiva, no se importa.');
  esperarSinErrores(errores);
});
