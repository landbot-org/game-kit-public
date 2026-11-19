# El motor (`engine/`)

Un solo objeto global, `GK`, sin dependencias salvo Three.js r128. Lo usa `plantilla/game.js`, que es el mejor ejemplo de cada pieza.

| Archivo | Qué es |
|---|---|
| `core.js` | `GK` |
| `core.css` | Tokens de marca en `:root` y estilos de todas las piezas. Un juego cambia solo los tokens en su `game.css` |
| `fonts.css` | Space Grotesk y JetBrains Mono en base64 (`scripts/fonts.py`). Otra marca: `fonts.css` en la carpeta del juego |
| `three.r128.js` | Three.js r128, global `THREE` |

El HTML de cada juego (`shell.html`) necesita estos elementos: `#c` (canvas), `#say` (panel), `#banner`, `#bubble`, `#ol`, `#intro`, `#end`, `#coach` con `.spot` y `.tip`. Copiar el de la plantilla.

## API

| Pieza | Uso | Por qué existe |
|---|---|---|
| `GK.sound` | `unlock()` en el primer toque; `tick`, `yes`, `no`, `clac`, `robot`, `win`, `lose`, `tone(f, dur, tipo, vol, retraso)`; `muted` | Sonido sin archivos; el audio no puede arrancar sin un toque |
| `GK.after(ms, fn)`, `cancel(id)`, `cancelAll()` | Temporizadores en tiempo de juego. **Usar siempre en vez de `setTimeout`** | Se congelan al ocultar la pestaña y las pruebas los adelantan |
| `GK.T(ms)` | Espera que se acorta con movimiento reducido | |
| `GK.loop(update, render)` | `update(dt, t)` cada fotograma; se para con la pestaña oculta | Pausa, silencio y tiempo determinista |
| `GK.announce(texto, 'good'\|'bad', ms)` | Aviso grande: qué ha pasado | Canal 1 |
| `GK.say(texto)` | Bocadillo; `rig.follow(#bubble, objeto3D)` lo pega a un objeto | Canal 2: qué piensa el rival |
| `GK.overlay.show(html)`, `.answer(html, kind)`, `.hide()`, `.open` | Tarjeta central para el momento importante (con `.ol-k`, `.ol-q`, `.ol-m`, `.ol-a`) | Al abrirla, el bocadillo se calla: un solo foco |
| `GK.intro({ brand, title, rules, extra, button, note, onGo })` | Pantalla de título: gancho, 3 reglas, «Jugar». Desbloquea el sonido | |
| `GK.end(html)` | Panel de final y cierre; `''` lo oculta | |
| `GK.confetti(colores)` | 18 piezas; nada con movimiento reducido | Celebración máxima |
| `GK.coach({ steps, storageKey, onEnd })` | Guía con foco. Paso: `{ el, text, next }` o `{ el, text, wait: 'evento', whenVisible, tipSide }`. `el` es un selector, un elemento, un rectángulo `{ left, top, width, height }` o una **función** que devuelve uno (así se ilumina un canvas o un objeto 3D: la función calcula el rectángulo en pantalla). `tipSide` (`'above'` o `'below'`) fija de qué lado va la caja; sin él, va debajo si cabe y si no encima, siempre dentro de la pantalla. El juego llama a `coach.event('evento')`; en el bucle, `coach.place()` si `coach.active`. `onEnd` reinicia la partida | Enseñar haciendo sobre la partida real |
| `GK.rig(camera, renderer, { desktop, portrait })` | Vistas `{ base, look, fov, dx \| dy }`; `shake(n)`, `impact(n)` (golpe + sacudida, uno cada 0,4 s), `dollyFrom(1.18)`, `follow(el, obj)`, `update(dt)` | Encuadre vertical sin alejar la cámara; sacudida por trauma² que decae |
| `GK.card({ front, w, h, back })` | Carta con bisagra: `{ pivot, body, mark, angle, target, delay }` | |
| `GK.spring(carta, dt, onHit)` | Muelle k=70 c=9 hacia `target` (`GK.STAND` o `GK.FLAT`), rebote 28 % al tocar | Peso físico |
| `GK.setMark(carta, 'yes'\|'no'\|null)` | Marca con check o X blanca, que no depende del color | |
| `GK.expose({ state, ... })` | Crea `window.__game` (con `step(ms)`), `window.render_game_to_text()` y `window.advanceTime(ms)` | Contrato de prueba de develop-web-game y game-creator |

## Probar un juego por código

```js
localStorage.removeItem('<storageKey>');   // para ver la guía otra vez
document.querySelector('#go').click();
__game.step(1500);                         // adelanta 1,5 s de juego
render_game_to_text();                     // estado en JSON
```

Si el panel del navegador está oculto, la ventana mide 0 × 0: fijar un tamaño con `resize_window` antes de probar.

## Panel, tema y tokens (`core.css`)

Un solo diseño en móvil y en escritorio: **barra arriba** (superficie sólida, nunca botones sueltos sobre la escena), **escena en medio** y **panel abajo, pegado al borde y centrado** (`--panel-max`, 720 px como máximo). La pantalla final (`#end`) usa el mismo patrón. Las cámaras de `GK.rig` no necesitan `dx`: la escena va centrada.

- **Tokens** en `@layer kit-tokens`: los del `:root` de un juego (sin capa) los pisan siempre, así que un juego solo escribe lo suyo.
- **Tema claro:** `<html data-theme="light">` da una base clara con contrastes medidos (texto 16:1 sobre el fondo, foco oscuro, sombras suaves tintadas). El juego sigue cambiando solo sus colores de marca.
- Tokens nuevos: `--focus` (anillo de foco y del foco de la guía), `--on-red`, `--scrim` y `--scrim-soft` (fondos difuminados), `--elev`, `--elev-sm`, `--elev-lg` (sombras), `--panel-max`. Se quita `--panel-w`.
- Mínimos (de la auditoría del kit): letra de 13 px o más en etiquetas y de 14 px en cuerpo, objetivos táctiles de 44 px (también los botones pequeños de la guía), foco de 3 px.
- **Cambia respecto a antes:** el panel ya no es una columna a la izquierda en escritorio. Un juego que usara `dx` negativo en `GK.rig` para dejar sitio a esa columna debe ponerlo a 0 (la plantilla ya está cambiada).
