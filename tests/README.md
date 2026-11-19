# Pruebas (Playwright)

Montan la plantilla y cada juego de `juegos/`, los sirven en local (`python3 -m http.server`, puerto 4399) y los recorren en **móvil (390 × 844)** y **escritorio (1280 × 800)** con el Chrome instalado: no descargan navegadores.

```bash
npm install        # una vez: instala solo @playwright/test
npm test           # todo, en los dos tamaños
npm run test:movil # o test:escritorio
```

Hace falta Python 3 (para montar), Node 18 o más y Google Chrome. Sin Chrome: `npx playwright install chromium` y quitar `channel: 'chrome'` de `playwright.config.js`.

## Qué comprueban
| Archivo | Qué |
|---|---|
| `plantilla.spec.js` | Arranca sin errores; la guía recorre sus 4 pasos y deja una partida limpia; una partida entera acaba con resultado y llamada a la acción; el panel va abajo y centrado sin tapar las cartas; el tema claro se activa con `data-theme="light"`. |
| `pistacho.spec.js` | Mapa de 19 territorios con cada vecina una sola vez; guía de 6 pasos; las cajas de la guía quedan dentro de la pantalla y no tapan lo iluminado; 30 partidas seguidas sin errores; probabilidades de los dados y paridad con las simulaciones de `investigacion/`; pasar plantas; premio del 5 % y botón «Ver mi premio»; **respaldo con enlaces si el chat de Landbot no carga** (se bloquea su librería); reinicio con confirmación; juego con teclado. |
| `auditoria.spec.js` | **Auditoría por estados** (lo que `scripts/check.py` no ve): en cada pantalla, sin scroll horizontal, botones de 44 px o más, letra de 12 px o más y nada fuera de pantalla; el panel sin scroll; el botón final visible sin desplazarse. |
| `quien-es-quien.spec.js` | Solo que arranca sin errores y dibuja el tablero (es anterior al motor: no tiene `window.__game`). |

## Cómo escribir pruebas para un juego nuevo
1. Un juego con el motor expone `window.__game` con `GK.expose` (estado, `step(ms)` y los ganchos que necesite). Copia `plantilla.spec.js` o `pistacho.spec.js`.
2. Usa `abrir(page, ruta, { guia: '<storageKey>' })` de `helpers.js`: silencia el sonido, recoge errores de consola y da por vista la guía. Para probar la guía, no pases `guia`.
3. Avanza el juego por código (`__game.step(ms)`), no con esperas reales: el motor usa tiempo de juego.
4. Añade el juego a `auditoria.spec.js` para que pase la auditoría por estados.

## Lo que no cubren
El aspecto (no hay capturas de referencia), el sonido, un teléfono real, las llamadas a servicios externos (el chat de Landbot se prueba solo en su respaldo sin conexión) ni el contenido del cierre.
