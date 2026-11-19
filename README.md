# game-kit

Repositorio que da a Claude el contexto suficiente para hacer videojuegos divertidos.

Sirve para hacer **juegos web cortos para eventos y campañas**: de 1 a 3 minutos, en **un solo HTML** que se abre con un QR, **pensados para el móvil**, en 3D con Three.js y con un cierre que lleva a una acción (comprar, reservar, un chat de Landbot). Trae el motor, una plantilla, un proceso con puertas y juegos completos que se pueden copiar y adaptar a un cliente.

## Ejemplos

| Ejemplo | Mecánica | Probar | Para copiarlo |
|---|---|---|---|
| **Pistacho Imperium** | Conquista de territorios con dados sobre el mapa de España, contra un robot, con premio al ganar | Se monta en local | [juegos/pistacho-imperium](juegos/pistacho-imperium/EJEMPLO.md) |
| **¿Quién es quién en IA?** | Deducción con cartas contra un robot que piensa en voz alta | [quienesquienia.vercel.app](https://quienesquienia.vercel.app) | [juegos/quien-es-quien](juegos/quien-es-quien/EJEMPLO.md) |
| **Plantilla** | Un quiz de «va o no va» con todas las fases | `plantilla/` (ver «Ver un juego») | [plantilla/](plantilla/) |

Cada ejemplo trae su ficha `EJEMPLO.md`: qué demuestra, **qué cambiar para otro cliente** y qué hay que sustituir sí o sí.

## Hacer un juego nuevo

Necesitas Python 3 y [Claude Code](https://claude.com/claude-code). Node y Chrome solo para las pruebas.

1. Abre Claude Code en esta carpeta (lee `CLAUDE.md` y sigue el proceso solo).
2. Cuéntale qué quieres: «Quiero hacer un juego para `<evento>` sobre `<tema>`, para `<marca>`, que acabe en `<acción>`».
3. El proceso tiene **puertas**: brief, investigación, diseño (tú lo apruebas), prototipo, auditoría, prueba con personas y publicación (también con tu visto bueno). Detalle en [docs/01-proceso.md](docs/01-proceso.md).

Sin Claude, a mano:

```bash
scripts/nuevo-juego.sh mi-juego                             # parte de la plantilla
scripts/nuevo-juego.sh mi-juego --desde pistacho-imperium   # parte de un ejemplo
python3 scripts/build.py juegos/mi-juego                    # monta dist/index.html
```

## Ver un juego

```bash
python3 scripts/build.py plantilla
python3 -m http.server 4330
```

Abre `http://localhost:4330/plantilla/dist/index.html`. En la consola del navegador, `__game.step(1500)` adelanta el juego y `render_game_to_text()` da su estado.

## Qué hay en el repositorio

| Carpeta | Qué |
|---|---|
| [`docs/`](docs/) | Por qué existen las reglas, proceso, pantallas, principios, motor, trampas, recursos, [cómo organizar el repositorio](docs/07-repositorio.md), [cómo subir más juegos](docs/08-handoff-subir-juegos.md) y el [backlog del kit](docs/09-backlog.md) |
| [`engine/`](engine/) | El motor `GK`: sonido, avisos, bocadillo, tarjeta central, guía con foco, cámara, pausa y ganchos de prueba |
| [`plantilla/`](plantilla/) | Juego mínimo y jugable con todas las fases |
| [`juegos/`](juegos/) | Un juego por carpeta, con su ficha de ejemplo |
| [`templates/`](templates/) | Documento de diseño (16 campos), auditoría, ficha de ejemplo y ficha de aprendizajes |
| [`scripts/`](scripts/) | `build.py`, `check.py`, `check-all.sh`, `fonts.py`, `nuevo-juego.sh`, `deploy.sh` |
| [`tests/`](tests/) | Pruebas con Playwright en móvil y escritorio |

## Antes de cambiar algo del motor o subir un juego

```bash
scripts/check-all.sh   # monta y comprueba todo; la huella de cada juego no debe cambiar si no lo has tocado
npm install && npm test
```

Los cambios del kit llevan commit que empiece por `kit:` y una línea en [CHANGELOG.md](CHANGELOG.md) (versión en [VERSION](VERSION)). Algo pasa al motor cuando **dos juegos** lo necesitan; si no, se apunta en el [backlog](docs/09-backlog.md).

## Qué falta

- Integración continua: las comprobaciones se ejecutan a mano.
- Los juegos que ya existen fuera de este repositorio (Paella Police, Nasi Lemak Police…) no están subidos: procedimiento en [docs/08-handoff-subir-juegos.md](docs/08-handoff-subir-juegos.md).
