# Ejemplo: Pistacho Imperium

- **Estado:** vivo (usa `engine/`, se monta con `scripts/build.py`).
- **Kit:** ver `KIT_VERSION` si existe; construido sobre `engine/` de octubre de 2026 y adaptado a la versión con panel centrado y tema claro.
- **Marca:** Vergel, **inventada** (el 12/11/2026 se retiró la marca real con la que nació este ejemplo, porque no había permiso). Sin logo, solo nombre en tipografía. Código de descuento de demostración, simulado.

## Qué demuestra
Juego de **territorios con dados** (Risk de bolsillo) contra un robot de tres niveles, sobre un **mapa esquemático real** (España, 19 piezas) con zonas, bonus, pasar plantas y un premio que cambia el cierre. Tiene la simulación que respalda las reglas y el cierre con Landbot (comprar o distribuir).

## Cuándo elegirlo como punto de partida
- Sí si: el cliente quiere un juego de **conquista o reparto sobre un mapa o grafo** (provincias, tiendas, sedes, rutas) con un premio al ganar.
- No si: necesita deducción, cartas o un quiz (mira `quien-es-quien` o la plantilla); o más de dos jugadores.

## Perillas: qué cambiar para otro cliente
| Perilla | Dónde vive | Qué hay que cambiar | Qué no tocar |
|---|---|---|---|
| Marca | `game.css` (`:root`: colores de Vergel), `fonts.css` (Jost y Montserrat), `shell.html` (`Vergel®`, título, etiqueta «demo de Landbot») | Paleta, tipografías, nombre, claims de `CONFIG` | `data-theme="light"` y el resto de tokens del motor |
| Mapa | bloque `MAPA` de `game.js`, generado por `investigacion/mapa_export.py` | Otro grafo: cambia `mapa.py` (contorno, semillas, vecinas, zonas) y vuelve a ejecutar `mapa_opt.py` y `mapa_export.py` | La lógica de reglas (funciones puras) |
| Reglas y dificultad | `game.js`: `ROUNDS`, `DIVISOR`, `ROBOT_EXTRA_TURNS`, bonus de zonas (`MAPA.zones`), `LEVELS` | Cualquier cambio **exige repetir** `investigacion/sim3.py` y comparar con `__game.headless` | El reparto inicial desigual (9 y 10) compensa que el jugador empieza |
| Contenido | `FACTS`, `TEAMS` (textos del robot), `CONFIG.rules`, `CONFIG.title` | Datos con fuente propia del cliente | La marca de «dato por confirmar» cuando no esté verificado |
| Premio y cierre | `CONFIG.prize`, `CONFIG.chat`, `landbot/` (flujo, estilo) | Código y enlace de descuento reales, bot de Landbot propio, calendario de reserva, estilo del chat | `customData.gano` (lo único que lee el chat) |
| Idioma | textos de `game.js` y `shell.html` | Traducir y repasar `CHAT_ES` (rótulos del widget) | |

## Piezas del kit que usa
`GK.rig`, `GK.coach` (con función de rectángulo para el mapa), `GK.overlay`, `GK.announce`, `GK.say`, `GK.after`, `GK.loop`, `GK.expose`, `GK.sound`; `scripts/fonts.py`, `build.py`, `check.py`. **Inventó:** selección por rayos con toque asistido, resaltado, fichas con pila, lista de territorios para teclado, el mapa y su generador, los simuladores, `headless`/`autoTurn`, el cierre con `Landbot.Container` y la traducción de rótulos (candidatos del backlog: `docs/09-backlog.md` 1, 3 y 4).

## Lo que hay que sustituir sí o sí al copiarlo
Los ids y enlaces de Landbot (`CONFIG.chat`), el enlace de reserva de ejemplo, `VERGEL5`, el nombre y los textos de Vergel, y los datos de `FACTS`.

## Medidas de referencia (26/10/2026, simulación y recorrido por código; sin personas)
Jugador medio contra robot medio: **49 a 50 %** de victorias; **5,4 a 5,9** turnos propios; **41 s** de turnos del robot por partida; toque en móvil acertado en el **98 %**. Detalle en `DISENO.md` (secciones 17 y 18) y `investigacion/`.

## Trampas de este ejemplo
En `landbot/README.md` (parámetros de URL que no llegan, `richText` en mensajes con variables, rótulos en inglés) y en `docs/09-backlog.md`, entrada 8 (sRGB en Three.js, `requestAnimationFrame` en el panel del navegador).
