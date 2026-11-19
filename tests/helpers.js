// Ayudantes comunes. Cada juego con motor expone window.__game (GK.expose): state(), step(ms) y sus propios ganchos.
const { expect } = require('@playwright/test');

// Abre un juego recogiendo los errores de consola y de página. `guia`: clave de localStorage de la guía; si se pasa, la guía se da por vista.
async function abrir(page, ruta, { guia = null, ignorarErrores = [] } = {}) {
  const errores = [];
  page.on('pageerror', e => errores.push(`pageerror: ${e.message}`));
  page.on('console', m => { if (m.type() === 'error' && !ignorarErrores.some(re => re.test(m.text()))) errores.push(`console: ${m.text()}`); });
  await page.route('**/favicon.ico', r => r.fulfill({ status: 204 })); // el servidor local no tiene favicon: no es un error del juego
  if (guia) await page.addInitScript(k => { try { localStorage.setItem(k, '1'); } catch (e) { /* sin almacenamiento */ } }, guia);
  await page.goto(ruta);
  await page.waitForFunction(() => window.__game && window.GK);
  await page.evaluate(() => { GK.sound.muted = true; });
  return errores;
}
const jugar = async page => { await page.locator('#go').click(); await page.evaluate(() => __game.step(1500)); };
const esperarSinErrores = errores => expect(errores, errores.join('\n')).toEqual([]);

// Auditoría del estado actual de la pantalla: lo que `scripts/check.py` no ve (se necesita un navegador).
async function auditar(page) {
  await page.waitForTimeout(500); // que termine la animación de entrada de las tarjetas
  return page.evaluate(() => {
    const vis = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && !e.closest('[hidden]') && !e.closest('#kb'); };
    const botones = [...document.querySelectorAll('button, a.btn')].filter(vis).map(b => { const r = b.getBoundingClientRect(); return { t: (b.textContent || '').trim().slice(0, 24), w: Math.round(r.width), h: Math.round(r.height) }; });
    let minFont = 99, minEl = ''; const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n;
    while ((n = w.nextNode())) { const t = n.textContent.trim(); const e = n.parentElement; if (!t || !e || !vis(e) || e.closest('script,style')) continue; const fs = parseFloat(getComputedStyle(e).fontSize); if (fs < minFont) { minFont = fs; minEl = `${e.className || e.tagName}: ${t.slice(0, 18)}`; } }
    const fuera = ['#banner', '#bubble', '#ol', '#coach .tip', '#end', '#intro .card-box'].map(s => document.querySelector(s)).filter(e => e && vis(e)).map(e => { const r = e.getBoundingClientRect(); return { id: e.id || e.className, fuera: r.left < -1 || r.right > innerWidth + 1 || r.top < -1 || r.bottom > innerHeight + 1 }; }).filter(o => o.fuera);
    const say = document.querySelector('#say');
    return { hscroll: document.documentElement.scrollWidth > innerWidth, panelConScroll: !!say && say.scrollHeight > say.clientHeight + 1, pequenos: botones.filter(b => b.w < 44 || b.h < 44), minFont, minEl, fuera };
  });
}
module.exports = { abrir, jugar, esperarSinErrores, auditar };
