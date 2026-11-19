# Ejemplo: <nombre del juego>

Ficha para que otra persona (o un agente) pueda **copiar este juego y personalizarlo para un cliente** sin leer todo el código.

- **Estado:** vivo (usa `engine/` y se monta con `scripts/build.py`) · archivo (código tal cual, sin motor)
- **Kit:** versión y commit con los que se construyó (`KIT_VERSION`)
- **URL en producción:**
- **Marca de origen:** <de quién es; si es marca ajena, di si hay permiso o es «prototipo no oficial»>

## Qué demuestra
Una frase: la mecánica y qué tiene de reutilizable (por ejemplo: «deducción con cartas y un robot que piensa en voz alta»).

## Cuándo elegirlo como punto de partida
- Sí si: <el cliente quiere…>
- No si: <…>

## Perillas: qué cambiar para otro cliente
| Perilla | Dónde vive | Qué hay que cambiar | Qué no tocar |
|---|---|---|---|
| Marca (colores, tipografías, nombre) | `game.css` (`:root`), `fonts.css` (`scripts/fonts.py`), `shell.html` | | |
| Contenido (cartas, datos, textos) | `game.js` (constantes arriba) | | |
| Reglas y dificultad | `game.js` (`CONFIG`, constantes) | | |
| Cierre (Landbot, enlaces, premio) | `game.js` (`CONFIG.chat`, `CONFIG.cta`) | | |
| Idioma | | | |

## Piezas del kit que usa
`GK.…`, plantillas, scripts. Y lo que **tuvo que inventar** (candidato a pasar al motor si otro juego lo necesita: ver `docs/09-backlog.md`).

## Lo que hay que sustituir sí o sí al copiarlo
Ids de Landbot, enlaces de reserva y de tienda, códigos de descuento de demostración, nombres de marca y datos con fuente propia.

## Medidas de referencia
Simulaciones, duración, resultados de la auditoría y de la prueba con personas (con fecha). Así se sabe si la copia mejora o empeora.

## Trampas de este ejemplo
Lo que costó más de 15 minutos aquí (y no está ya en `docs/05-trampas.md`).
