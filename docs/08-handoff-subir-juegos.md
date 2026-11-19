# Handoff: subir los videojuegos que ya están hechos y que retroalimenten el kit

Para quien vaya a meter en este repositorio los juegos que ya existen fuera de él (otra persona o un agente). Escrito el 26/10/2026. **No se ha subido ningún juego con este procedimiento todavía**: es la primera versión y hay que corregirla con el primero que se suba.

## Qué hay ya y qué falta
- **Ya están:** `quien-es-quien` (nothiring, sin motor) y `pistacho-imperium` (Vergel, marca inventada, con motor).
- **Candidatos conocidos** (según `README.md` y `docs/06-recursos.md`; **verifica rutas y estado antes**): Paella Police, Nasi Lemak Police y el juego por ciudad, y los demás que tenga quien mantiene el kit. No sé cuáles más hay ni su estado: haz el inventario primero.

## Paso 0: el inventario (30 min)
Una tabla por juego: carpeta de origen, URL en producción, ¿usa el motor? (¿tiene `GK`?), ¿lleva marca de cliente?, ¿lleva ids de Landbot, claves o datos personales?, ¿se monta hoy? Con quien aprueba, decide el **nivel** de cada uno:
- **A. Ejemplo vivo:** se porta al motor (o ya lo usa), se monta con `scripts/build.py` y pasa `check.py`. Entra en `juegos/` con su `EJEMPLO.md`.
- **B. Archivo:** código tal cual, sin motor. Entra en `juegos/` con `ESTADO: archivo` en su `README.md`, como `quien-es-quien` antes de extraer el motor. Sirve para aprender, no para copiar.
- **C. No se sube:** contenido confidencial, cliente que no lo permite o juego roto sin interés.

## Procedimiento por juego (lista de comprobación)
1. **Rama:** `git switch -c juego/<nombre>`.
2. **Carpeta:** `juegos/<nombre>/` con `shell.html`, `game.js`, `game.css`, `fonts.css` (si lleva fuentes incrustadas) y, si hay cierre, `landbot/README.md`. No copies `node_modules`, `dist/`, `deploy/`, `.vercel/`, `.env*`.
3. **Secretos:** `git grep -nIE "(api[_-]?key|secret|token|password|BEGIN .*PRIVATE|sk-[A-Za-z0-9]{20}|ghp_|gho_|xox[bp]-|AKIA|AIza)" -- juegos/<nombre>` sin hallazgos reales, y mira a mano `.env*` y los JSON de configuración.
4. **Marca y permisos:** si hay marca ajena, apunta en `EJEMPLO.md` si hay permiso o es «prototipo no oficial», y que el juego lo diga. Sustituye datos personales y códigos reales por demostración.
5. **Monta:** `python3 scripts/build.py juegos/<nombre>` y `python3 scripts/check.py juegos/<nombre>`. Si el juego es nivel A y no usa el motor, **no lo portes a ciegas**: apunta qué piezas del motor sustituirían a qué código suyo (paso 7).
6. **Ábrelo** en el navegador a 390 × 844 y 1280 × 800 y mira que arranca, se juega y no hay errores de consola. Si tiene `window.__game`, recorre una partida por código.
7. **`APRENDIZAJE.md`** (plantilla en `templates/`): qué piezas del kit usa, qué inventó, trampas. Es lo que alimenta el backlog.
8. **`EJEMPLO.md`** (plantilla en `templates/`): qué demuestra, cuándo elegirlo, **tabla de perillas**, qué sustituir sí o sí, medidas de referencia.
9. **`KIT_VERSION`:** versión y commit del kit contra los que lo has comprobado.
10. **Índice:** una fila en `juegos/README.md`.
11. **Todo el repositorio:** `scripts/check-all.sh` sin fallos; las huellas de los demás juegos **no** deben haber cambiado.
12. **Commit y PR:** `ejemplo: subir <nombre> (nivel A|B)`; en el PR, la tabla del inventario y la lista de lo que **no** se verificó.

## Cómo retroalimentan el kit (el ciclo)
1. **Cada juego deja un `APRENDIZAJE.md`.** Sin él, el juego sube pero no enseña nada.
2. **Busca lo repetido.** Compara el código del juego con el motor y con los otros ejemplos: funciones con el mismo nombre o la misma forma (por ejemplo, `grep -n "function openChat\|function finish\|rig = GK.rig" juegos/*/game.js`) y estilos duplicados. Apunta cada coincidencia en `docs/09-backlog.md` con los dos juegos.
3. **Regla de dos.** Una cosa pasa al motor cuando **dos juegos** la necesitan (`docs/07-repositorio.md`). Con uno, se queda en el juego y entra en el backlog con su evidencia.
4. **Trampas.** Todo lo que costó más de 15 minutos y no esté en `docs/05-trampas.md` se añade ahí, con el juego y la fecha.
5. **Aplicar una mejora al kit:** commit `kit:` aparte; actualiza `CHANGELOG.md` y `VERSION`; pasa `scripts/check-all.sh` antes y después. Los juegos que dependan de lo cambiado se migran en el mismo PR (sección «Migración» del `CHANGELOG.md` si rompe algo).
6. **Cerrar el círculo:** cuando una mejora se aplique, márcala como hecha en el backlog con el commit, y avisa en los `EJEMPLO.md` afectados (la perilla puede haber cambiado de sitio).
7. **Medir si ayuda:** el siguiente juego nuevo anota en su `APRENDIZAJE.md` cuánto tardó cada fase y si la pieza nueva le ahorró algo. Sin esa medida, el kit crece pero no se sabe si mejora.

## Qué decidir con quien aprueba antes de subir más
- Qué juegos son A, B o C (paso 0).
- Licencia y visibilidad del repositorio (hoy: tratar como interno de Landbot).
- Si los juegos con marca de cliente se suben aquí o se quedan en repositorios aparte con un ejemplo genérico en este.
- Quién revisa los PR.

## Lo que este handoff no cubre ni se ha probado
- Portar un juego grande al motor: se ha hecho solo en dirección contraria (el motor se extrajo de `quien-es-quien`).
- Que el procedimiento funcione sin tener cerca a quien aprueba para los permisos de marca.
- Integración continua: no existe.

## Texto para pegar en el chat de cada juego

Cada chat de Claude conoce su juego pero no este repositorio, así que el texto es autocontenido. Cambia `<nombre>`. Si varios chats trabajan a la vez, **cada uno en su propio `git worktree`** para no pisarse (el texto ya lo pide).

```text
Quiero subir este juego al repositorio game-kit para que sirva de ejemplo y alimente el kit. El repositorio es el clon local de landbot-org/game-kit-public. Tú solo haces commits en una rama; el push lo hago yo.

1. Lee en ese repositorio: README.md, CLAUDE.md, docs/07-repositorio.md y docs/08-handoff-subir-juegos.md. Sigue la lista de comprobación por juego de docs/08.
2. Trabaja en tu propio worktree, sin tocar la carpeta principal:
   cd <carpeta-del-kit> && git worktree add ../game-kit-<nombre> -b juego/<nombre> && cd ../game-kit-<nombre>
3. Copia el juego a juegos/<nombre>/ (shell.html, game.js, game.css, fonts.css si lleva fuentes, y landbot/ si tiene cierre). No copies node_modules, dist, deploy, .vercel ni ningún .env.
4. Antes de copiar, revisa que no haya secretos (claves, tokens, contraseñas), datos personales ni contenido confidencial del cliente. Si dudas, pregúntame. No incluyas rutas ni referencias a mi vault, a mis notas ni a carpetas locales mías: en el repositorio no todo el mundo tiene acceso.
5. Dime si es nivel A (ejemplo vivo: usa engine/ y se monta con scripts/build.py) o nivel B (archivo: código tal cual, sin motor). Si es A y no usa el motor, no lo portes: apunta qué piezas del motor sustituirían a qué código tuyo.
6. Escribe juegos/<nombre>/EJEMPLO.md (plantilla en templates/EJEMPLO.md: qué demuestra, cuándo elegirlo, tabla de perillas para personalizarlo, qué hay que sustituir sí o sí, medidas de referencia) y juegos/<nombre>/APRENDIZAJE.md (plantilla en templates/APRENDIZAJE.md: qué piezas del kit usó, qué inventó, trampas, qué faltó). Añade la fila en juegos/README.md y escribe KIT_VERSION con la versión y el commit del kit.
7. Si ves algo que el motor debería traer, NO toques engine/, docs/ ni scripts/: apúntalo en docs/09-backlog.md con el juego como evidencia (regla de dos: pasa al motor cuando dos juegos lo necesitan).
8. Comprueba: scripts/check-all.sh sin fallos (las huellas de los demás juegos no deben cambiar), npm install && npm test, y abre el juego a 390 × 844 y a 1280 × 800 para ver que arranca y se juega sin errores de consola.
9. Commit con el mensaje «ejemplo: subir <nombre> (nivel A|B)» y termina con este informe: la rama y la ruta del worktree, los comandos exactos de push que debo ejecutar, lo que NO has verificado y qué decisiones necesitas de mí.
```
