# Cómo organizar el repositorio: ejemplos que se pueden ultrapersonalizar

Reflexión del 26/10/2026 tras hacer Pistacho Imperium y ordenar el kit. Lo que sale de la experiencia está dicho como hecho; lo demás son propuestas mías, sin probar con otra persona que use el repositorio.

## Qué queremos
Que alguien con un cliente nuevo pueda **empezar desde un juego completo parecido** (no solo desde una plantilla vacía) y llegar a «el juego de este cliente» cambiando cosas concretas, sin romper lo que ya funciona y sin tener que entender todo el código.

## Tres capas, con reglas distintas
| Capa | Qué | Quién lo toca | Regla |
|---|---|---|---|
| **Motor y proceso** | `engine/`, `plantilla/`, `templates/`, `scripts/`, `docs/` | Quien mejora el kit | Cambios con commit `kit:`; **regla de dos**: algo pasa al motor cuando dos juegos lo necesitan (`docs/09-backlog.md`). Antes de tocar, `scripts/check-all.sh`; después, las huellas de los juegos no deben cambiar salvo en los migrados a propósito. |
| **Ejemplos** | `juegos/<nombre>/` con `EJEMPLO.md` | Quien sube o mantiene el ejemplo | Cada ejemplo es **completo y se monta** (`scripts/build.py`), lleva su ficha de perillas y sus medidas, y dice qué hay que sustituir al copiarlo. |
| **Juegos de cliente** | Fuera de este repositorio, o en una rama privada | Quien hace el encargo | Nacen con `scripts/nuevo-juego.sh <nombre> --desde <ejemplo>`. Lo que aprendan vuelve al kit como `APRENDIZAJE.md` (nunca el contenido del cliente). |

## Los ejemplos: qué los hace útiles
1. **Uno por mecánica, no uno por cliente.** El valor está en la mecánica (deducción con cartas, territorios con dados, quiz de «va o no va»…). Hoy: `quien-es-quien` (deducción, sin motor) y `pistacho-imperium` (territorios, con motor). Pendientes de subir: los de `docs/06-recursos.md` («Juegos hechos»).
2. **Una ficha `EJEMPLO.md`** (plantilla en `templates/`) con la tabla de **perillas**: qué cambiar para otro cliente y dónde vive cada cosa. Es lo que convierte «código que funciona» en «código que se puede adaptar».
3. **Perillas en cinco sitios fijos**, para que cualquier ejemplo se personalice igual:
   - **Marca:** tokens en el `:root` de `game.css`, `fonts.css` (`scripts/fonts.py`), nombre en `shell.html`. Tema claro con `data-theme="light"`.
   - **Contenido:** constantes al principio de `game.js` (cartas, datos, textos), con su fuente.
   - **Reglas y dificultad:** `CONFIG` y constantes (en Pistacho: rondas, bonus de zona, niveles del robot), **con la simulación que las respalda** (`investigacion/`).
   - **Cierre:** `CONFIG.chat` y `CONFIG.cta` (Landbot, enlaces, premio). Es lo que más cambia entre clientes y lo que más se arrastra por error: la ficha lo marca como «sustituir sí o sí».
   - **Idioma:** textos visibles en `game.js` y `shell.html`.
4. **Medidas de referencia dentro del ejemplo**: tabla de la simulación, duración, resultado de la auditoría. Si la copia empeora esas cifras, se nota.
5. **Su propio `APRENDIZAJE.md`**: lo que costó y lo que faltó. Es la materia prima del backlog. (Los diarios de trabajo no se publican: ver «Qué se puede subir».)

## Cómo se arranca desde un ejemplo
```bash
scripts/nuevo-juego.sh mi-cliente --desde pistacho-imperium
```
Copia `shell.html`, `game.js`, `game.css` y `fonts.css`, cambia la clave de la guía, crea `DISENO.md` y `AUDITORIA.md` vacíos y anota en `KIT_VERSION` la versión del kit y el ejemplo de origen. **No copia** `landbot/`, `investigacion/`, `DISENO.md` ni los diarios: son del ejemplo. El script avisa de lo que hay que sustituir sí o sí.

## Versiones y migraciones
- `VERSION` (semver) y `CHANGELOG.md` en la raíz. Cada juego guarda en `KIT_VERSION` con qué versión y commit nació.
- Un cambio del motor que **rompe** algo (por ejemplo, el panel que pasó de la izquierda a abajo y centrado, y `dx` de la cámara a 0) lleva una sección «Migración» en `CHANGELOG.md` y se aplica juego por juego, con `scripts/check-all.sh` delante y detrás.

## Qué se puede subir y qué no
- **Sí:** código, diseño, simulaciones, medidas, ids públicos de Landbot (los share URL son públicos), enlaces de reserva ya públicos.
- **Con aviso:** marcas ajenas (hoy solo nothiring, en `quien-es-quien`): el ejemplo lo dice en su ficha y en el propio juego («prototipo no oficial»). Una marca real que no sea nuestra **solo entra con permiso por escrito**; si no, se inventa una (como Vergel en Pistacho Imperium). Códigos de descuento: siempre de demostración, de una marca inventada.
- **Interno, no se sube:** ids de bots, agentes y canales de la cuenta de Landbot, el prompt completo de un agente, diarios de construcción (`DIARIO-KIT.md`), informes de investigación sobre marcas o personas reales y cualquier nota de proceso con nombres.
- **Nunca:** tokens, claves, `.env.local` (`.gitignore` ya excluye `.env.local`, `.vercel/`, `deploy/` y `dist/`), datos personales, contenido confidencial de un cliente.
- **Licencia:** MIT (`LICENSE`). **Antes de hacer público el repositorio**, publica una copia con historial nuevo (un solo commit): el historial del repositorio interno contiene todo lo anterior.

## Cómo se contribuye
- Una rama por juego (`juego/<nombre>`) y una por mejora del kit (`kit/<tema>`); pull request con la lista de comprobación de `docs/08-handoff-subir-juegos.md`.
- Prefijos de commit: `faseN:` (juego en curso), `kit:` (motor, plantillas, scripts, docs del proceso), `ejemplo:` (subir o actualizar un ejemplo).
- La puerta de revisión es `scripts/check-all.sh` sin fallos y las huellas explicadas.

## Lo que no he verificado
- Que otra persona, sin el contexto de esta sesión, pueda personalizar un ejemplo solo con su ficha: **falta esa prueba** (es la equivalente a la prueba con personas del juego).
- La estructura propuesta no se ha usado con más de dos ejemplos. Si aparece un tercero con una mecánica distinta, hay que revisar si `juegos/` sigue siendo el sitio o conviene `ejemplos/` y `clientes/`.
- No hay integración continua todavía: `scripts/check-all.sh` se ejecuta a mano.
