// quien-es-quien es anterior al motor: no tiene window.__game ni GK. Solo se comprueba que arranca y se ve.
const { test, expect } = require('@playwright/test');

test('arranca sin errores y dibuja el tablero 3D', async ({ page }) => {
  const errores = [];
  page.on('pageerror', e => errores.push(e.message));
  page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errores.push(m.text()); });
  await page.goto('/juegos/quien-es-quien/dist/index.html');
  await expect(page.locator('canvas').first()).toBeVisible();
  await page.waitForTimeout(1500);
  expect(errores, errores.join('\n')).toEqual([]);
});
