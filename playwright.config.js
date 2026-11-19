// Pruebas del kit: montan plantilla y juegos, los sirven en local y los recorren en móvil (390 x 844) y escritorio (1280 x 800).
// Usan el Chrome instalado (channel: 'chrome'): no descargan navegadores. Si no hay Chrome, ejecutar antes `npx playwright install chromium` y quitar la línea channel.
const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: 'tests',
  timeout: 90000,
  retries: 0,
  reporter: [['list']],
  globalSetup: './tests/montar.js',
  use: { baseURL: 'http://localhost:4399', channel: 'chrome', headless: true },
  webServer: { command: 'python3 -m http.server 4399', url: 'http://localhost:4399/README.md', reuseExistingServer: true, timeout: 20000 },
  projects: [
    { name: 'movil', use: { viewport: { width: 390, height: 844 }, hasTouch: true } },
    { name: 'escritorio', use: { viewport: { width: 1280, height: 800 } } },
  ],
});
