# ¿Quién es quién en IA? (nothiring)

Ejemplo completo y en producción: https://quienesquienia.vercel.app

- `game.js` y `shell.html`: copia del proyecto original (fuera de este repositorio), del 26/10/2026. El motor (`engine/core.js`) se extrajo de aquí, así que este juego **no usa el motor**: lleva su propia copia de cada pieza. Si se retoma, migrarlo a `GK` es el primer paso.
- La única diferencia con el original: las fuentes ya van dentro del HTML (`<!--@@FONTS@@-->`).
- `diseno/`: cómo se llegó aquí.
  - `REPLANTEAMIENTO.md`, sección 7 bis: el diseño elegido.
  - `DISENO-duelo.md`: diseño con medidas (simulación de partidas del robot).
  - `matriz.py` y `cartas.json`: el script que comprueba que las 12 cartas se distinguen y cuántas preguntas hacen falta.
  - `AUDITORIA-buen-videojuego.md`: la auditoría rellena (modelo para `templates/AUDITORIA.md`).

Montar: `python3 scripts/build.py juegos/quien-es-quien` → `dist/index.html`.

Ganchos de prueba: `window.__nh` (anterior al contrato `window.__game` del motor).

**Desde el 26/10/2026 la fuente es esta carpeta**, no el proyecto original. Para publicar: `python3 scripts/build.py juegos/quien-es-quien`, publicar con `scripts/deploy.sh quien-es-quien <alias>`.

Cierre: el botón «¿Qué perfil necesito?» del final abre el chat de Landbot (`landbot/`) en una ventana encima del juego; a pantalla completa en móvil.

Pendiente según la auditoría: probar con 5 personas, asentar la caída en ~450 ms y congelar las animaciones al ocultar la pestaña (el motor ya lo hace).
