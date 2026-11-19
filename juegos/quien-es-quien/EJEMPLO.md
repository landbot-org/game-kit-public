# Ejemplo: ¿Quién es quién en IA? (nothiring)

- **Estado:** vivo pero **sin motor** (anterior a `engine/`; el motor se extrajo de este juego). Se monta con `scripts/build.py`.
- **URL en producción:** https://quienesquienia.vercel.app
- **Marca de origen:** nothiring.

## Qué demuestra
**Deducción con cartas** contra un robot que piensa en voz alta (12 caras con rasgos visibles como objetos, guía sobre la partida real, cierre con un agente de Landbot que recomienda un perfil).

## Cuándo elegirlo como punto de partida
- Sí si: el cliente tiene un conjunto de **perfiles, productos o roles** que se parecen entre sí y la gracia es **distinguirlos**.
- No si: quieres reutilizar piezas del motor (este juego tiene su propio código para guía, avisos y sonido): para eso, la plantilla.

## Perillas
| Perilla | Dónde vive | Qué hay que cambiar |
|---|---|---|
| Contenido | `diseno/cartas.json` y `game.js` | Las cartas y sus rasgos; **comprueba que se distinguen** con `diseno/matriz.py` |
| Marca | `shell.html` (CSS inline) | Colores, tipografías, nombre |
| Cierre | `landbot/` (agente de IA, flujo, estilo) y `CHAT_URL` en `game.js` | Bot, agente, base de conocimiento y enlace de reserva propios |

## Medidas de referencia
`diseno/DISENO-duelo.md` (simulación de partidas del robot) y `diseno/AUDITORIA-buen-videojuego.md`.

## Lo que hay que sustituir sí o sí al copiarlo
`CHAT_URL`, el agente y su conocimiento, y todo lo de nothiring.
