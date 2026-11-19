# Backlog del kit

Mejoras pendientes con su evidencia. **Regla de dos:** algo pasa al motor (`engine/`) cuando **dos juegos** necesitan lo mismo; con uno solo se queda en ese juego y se apunta aquí. Cada entrada lleva el juego y el documento donde se vio (su `APRENDIZAJE.md`).

Estado a 26/10/2026, salido del diario de construcción de Pistacho Imperium (no se publica). Las duraciones son estimaciones, no cronometradas.

## Hechas
| # | Mejora | Commit |
|---|---|---|
| 2 | Foco de la guía con rectángulo o función (`GK.coach`) | `kit: el foco de la guia acepta un rectangulo o una funcion…` |
| 5 | Panel único abajo y centrado, tema claro por tokens, tamaños mínimos (`core.css`) | `kit: panel unico abajo y centrado…` |
| 3 | Auditoría por estados con Playwright (`tests/auditoria.spec.js`) y pruebas de recorrido de plantilla y juegos | `kit: pruebas con playwright…` |
| 0.3 | Puertas por hook, `scripts/fase.py`, subagente `verificador-juego` y protocolo de cambios tras aprobar (0.3.0) | `kit: puertas que se cumplen…` |
| 11 | `scripts/nuevo-juego.sh --desde <ejemplo>`, `scripts/check-all.sh`, `VERSION`, fichas `EJEMPLO.md` y `APRENDIZAJE.md` | `kit: repositorio de ejemplos…` |

## Pendientes, por orden de ahorro
| # | Mejora | Esfuerzo | Evidencia | ¿Cuántos juegos? |
|---|---|---|---|---|
| 1 | Bloques para juegos de territorios y tableros: `GK.board` (toque asistido, resaltado, fichas), formato de mapa y generador por celdas, `sim.py` genérico con tabla jugador/robot | grande | Pistacho Imperium: más de la mitad de la fase 4 | 1 (esperar a un segundo) |
| 6 | Ver una maqueta jugable antes de aprobar (el protocolo de cambios tras aprobar ya está en la 0.3: secciones 17+, `fase.py cambio` y hook; la maqueta tiene sitio en `juegos/<nombre>/maqueta/` pero no hay plantilla) | pequeño | Pistacho Imperium: 8 cambios pedidos tras aprobar | 1 |
| 7 | `templates/PRUEBA-PERSONAS.md` genérico (guion, tabla, umbrales marcados como hipótesis) | pequeño | `juegos/pistacho-imperium/PRUEBA-PERSONAS.md` | 1 |
| 8 | Trampas nuevas en `docs/05-trampas.md`: sRGB en Three.js r128, puerto de `launch.json`, `WebFetch` 429, binario de `impeccable`, `requestAnimationFrame` en el panel, `GK.announce` con `setTimeout` | mínimo | Pistacho Imperium | 1 |
| 9 | Qué hacer con un brief vacío y con una marca ajena (permisos, aviso, códigos de demostración) | mínimo | Pistacho Imperium | 1 |
| 10 | `scripts/marca.py <url>`: colores, fuentes y frases de una web, marcado como «a confirmar» | pequeño | Pistacho Imperium (se hizo con `curl` y a mano) | 1 |

## Cómo se añade una entrada
1. El juego trae su `APRENDIZAJE.md` (plantilla en `templates/`).
2. Una fila aquí con el juego y el documento.
3. Cuando una fila tiene dos juegos, se aplica en un commit que empiece por `kit:`, se actualiza `CHANGELOG.md` y se vuelve a pasar `scripts/check-all.sh` (las huellas de los juegos no deben cambiar salvo en los que se migran a propósito).
