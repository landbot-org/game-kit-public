const { test, expect } = require('@playwright/test');
const { abrir, jugar, esperarSinErrores } = require('./helpers');
const RUTA = '/plantilla/dist/index.html';

test('la plantilla arranca sin errores y muestra el título', async ({ page }) => {
  const errores = await abrir(page, RUTA, { guia: 'kit_tut' });
  await expect(page.locator('#intro')).toBeVisible();
  await expect(page.locator('#go')).toBeVisible();
  esperarSinErrores(errores);
});

test('la guía recorre sus 4 pasos y deja una partida limpia', async ({ page }) => {
  const errores = await abrir(page, RUTA);
  await jugar(page);
  const idx = () => page.evaluate(() => __game.coach.index);
  expect(await idx()).toBe(0);
  await page.locator('#coachNext').click(); expect(await idx()).toBe(1);
  await page.evaluate(() => { __game.answer('1'); __game.step(1500); }); expect(await idx()).toBe(2);
  await page.locator('#next').click(); expect(await idx()).toBe(3);
  await page.locator('#coachNext').click();
  const st = await page.evaluate(() => __game.state());
  expect(st.practice).toBe(false); expect(st.idx).toBe(0); expect(st.hits).toBe(0);
  esperarSinErrores(errores);
});

test('una partida entera acaba con resultado y llamada a la acción', async ({ page }) => {
  const errores = await abrir(page, RUTA, { guia: 'kit_tut' });
  await jugar(page);
  for (let i = 0; i < 6; i++) {
    await page.evaluate(() => { __game.answer('1'); __game.step(2200); });
    await page.locator('#next').click();
  }
  await page.evaluate(() => __game.step(1500));
  await expect(page.locator('#end')).toBeVisible();
  await expect(page.locator('#end .cta')).toBeVisible();
  esperarSinErrores(errores);
});

test('el panel va abajo y centrado y no tapa las cartas', async ({ page }) => {
  await abrir(page, RUTA, { guia: 'kit_tut' });
  await jugar(page);
  const m = await page.evaluate(() => {
    const r = document.querySelector('#say').getBoundingClientRect();
    const cartas = __game.cardsOnScreen();
    return { centro: Math.round((r.left + r.right) / 2), vw: innerWidth, abajo: Math.round(r.bottom), vh: innerHeight, tapadas: cartas.filter(p => p[0] >= r.left && p[0] <= r.right && p[1] >= r.top && p[1] <= r.bottom).length };
  });
  expect(Math.abs(m.centro - m.vw / 2)).toBeLessThan(2);
  expect(m.abajo).toBe(m.vh);
  expect(m.tapadas).toBe(0);
});

test('el tema claro se activa solo con data-theme="light"', async ({ page }) => {
  await abrir(page, RUTA, { guia: 'kit_tut' });
  const antes = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  await page.evaluate(() => { document.documentElement.dataset.theme = 'light'; });
  const despues = await page.evaluate(() => ({ bg: getComputedStyle(document.body).backgroundColor, panel: getComputedStyle(document.querySelector('#say')).backgroundColor }));
  expect(antes).toBe('rgb(10, 10, 10)');
  expect(despues.bg).toBe('rgb(246, 246, 243)');
  expect(despues.panel).toBe('rgb(255, 255, 255)');
});
