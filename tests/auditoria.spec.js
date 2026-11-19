// Auditoría por estados (lo que check.py no puede ver): en cada pantalla, sin scroll horizontal, botones de 44 px, letra de 12 px o más y nada fuera de pantalla.
const { test, expect } = require('@playwright/test');
const { abrir, jugar, auditar } = require('./helpers');

function comprobar(a, estado) {
  expect(a.hscroll, `${estado}: scroll horizontal`).toBe(false);
  expect(a.pequenos, `${estado}: botones menores de 44 px`).toEqual([]);
  expect(a.minFont, `${estado}: letra más pequeña (${a.minEl})`).toBeGreaterThanOrEqual(12);
  expect(a.fuera, `${estado}: elementos fuera de la pantalla`).toEqual([]);
}

test('plantilla: título, pregunta y final', async ({ page }) => {
  await abrir(page, '/plantilla/dist/index.html', { guia: 'kit_tut' });
  comprobar(await auditar(page), 'título');
  await jugar(page);
  const a = await auditar(page); comprobar(a, 'pregunta'); expect(a.panelConScroll, 'pregunta: panel con scroll').toBe(false);
  for (let i = 0; i < 6; i++) { await page.evaluate(() => { __game.answer('1'); __game.step(2200); }); await page.locator('#next').click(); }
  await page.evaluate(() => __game.step(1500));
  comprobar(await auditar(page), 'final');
});

test('pistacho-imperium: título, plantar, atacar, dados, mover y final', async ({ page }) => {
  await abrir(page, '/juegos/pistacho-imperium/dist/index.html', { guia: 'pistacho_tut' });
  comprobar(await auditar(page), 'título');
  await jugar(page);
  let a = await auditar(page); comprobar(a, 'plantar'); expect(a.panelConScroll, 'plantar: panel con scroll').toBe(false);
  await page.evaluate(() => { const g = __game; while (g.state().pool > 0) { const s = g.state(); g.plant(s.own.findIndex((o, i) => o === 0 && g.NB[i].some(j => s.own[j] === 1))); } g.step(2200); });
  a = await auditar(page); comprobar(a, 'atacar'); expect(a.panelConScroll, 'atacar: panel con scroll').toBe(false);
  await page.evaluate(() => {
    const g = __game, s = g.state(); let best = null;
    for (let i = 0; i < g.N; i++) { if (s.own[i] !== 0 || s.arm[i] < 2) continue; for (const j of g.NB[i]) if (s.own[j] === 1) { const sc = s.arm[i] - 1 - s.arm[j]; if (!best || sc > best.sc) best = { sc, i, j }; } }
    g.select(best.i); g.select(best.j); g.step(300);
  });
  a = await auditar(page); comprobar(a, 'ataque listo');
  await page.evaluate(() => { __game.attack(false); __game.step(400); });
  comprobar(await auditar(page), 'dados');
  await page.locator('#next').click();
  await page.evaluate(() => { __game.startMove(); __game.step(300); });
  comprobar(await auditar(page), 'mover');
  await page.evaluate(() => { __game.cancel(); let g = 0; while (!__game.state().over && g++ < 100) { const s = __game.state(); if (s.phase === 'move') __game.endTurn(); else if (s.phase === 'plant' || s.phase === 'attack') __game.autoTurn(1); let z = 0; while (__game.state().phase === 'robot' && !__game.state().over && z++ < 400) __game.step(250); } __game.step(2000); });
  a = await auditar(page); comprobar(a, 'final');
  const cta = await page.locator('#openChat').boundingBox(); const vh = page.viewportSize().height;
  expect(cta.y + cta.height, 'final: «Ver mi premio» visible sin desplazarse').toBeLessThanOrEqual(vh);
});
