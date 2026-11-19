# Auditoría: <nombre del juego>

Auditado por: <verificador-juego (contexto limpio)> · Fecha: · Versión revisada: <URL o commit> · Verificado en: <anchos, navegador, teléfono real sí/no, personas sí/no>

> La rellena el subagente `verificador-juego`, no quien construyó el juego. `scripts/fase.py avanzar` no deja salir de la auditoría sin la línea «Auditado por: verificador-juego», con alguna fila vacía o con algún ❌.

Leyenda: ✅ cumple · 🟡 a medias · ❌ no cumple · ➖ no aplica · ⏳ pendiente de lo que el auditor no puede hacer (teléfono real, personas, decisión de quien aprueba). Cada fila lleva evidencia (medida, captura o estado de `window.__game`), no opinión. Ejemplo relleno: `juegos/quien-es-quien/diseno/AUDITORIA-buen-videojuego.md`.

## Claridad y onboarding
| Criterio | Estado | Evidencia |
|---|---|---|
| Se juega sin leer reglas largas (07a 1) | | |
| Pantalla de inicio con 2 o 3 zonas (07c) | | |
| Como mucho 3 conceptos nuevos (Hodent) | | |
| Guía sobre la partida real, que se puede saltar y se reinicia al acabar | | |
| Primera acción en 5-10 s (medido con personas) | | |
| Turno y objetivo visibles en un sitio fijo (07a 7) | | |
| Cómo se gana, a la vista | | |
| Lo que ya no sirve se apaga y se dice por qué | | |
| Una información por canal; nada duplicado | | |

## Rival (si lo hay)
| Criterio | Estado | Evidencia |
|---|---|---|
| Dice qué va a hacer y por qué (07a 10) | | |
| Su turno se ve en grande | | |
| Su progreso se ve | | |
| Lo que dice coincide con lo que hace (07a 12) | | |
| Calibrado con simulación (% de victorias) | | |

## Feedback y motion
| Criterio | Estado | Evidencia |
|---|---|---|
| Toda acción responde al instante | | |
| Feedback por capas y en proporción | | |
| El feedback explica, no solo acierta o falla | | |
| Cada animación comunica un cambio de estado | | |
| Un solo golpe de sonido por tanda | | |
| Sacudida en la cámara que decae | | |
| Asentado de caídas en unos 450 ms (07b 5) | | |
| Acierto y fallo se distinguen sin color | | |
| Movimiento reducido respetado | | |
| Sonido con botón de silencio, arranca tras el primer toque | | |

## Móvil y accesibilidad
| Criterio | Estado | Evidencia |
|---|---|---|
| Panel sin desplazarse a 390 × 844 | | |
| Objetivos táctiles de 44 px | | |
| Nada se sale de la pantalla (bocadillos, avisos) | | |
| Pausa y silencio al ocultar la pestaña | | |
| Navegable con teclado | | |
| Texto legible (mínimo 14 px en móvil) | | |
| Un solo HTML con las fuentes dentro | | |
| Probado en un teléfono real | | |

## Cierre
| Criterio | Estado | Evidencia |
|---|---|---|
| Final en un momento alto | | |
| Al perder se sabe por qué | | |
| No se piden datos antes de jugar | | |
| Llamada a la acción clara | | |
| Chat de reserva si Landbot no carga | | |

## Marca y taste
| Criterio | Estado | Evidencia |
|---|---|---|
| Tokens de la marca, un solo acento | | |
| 0 rayas largas (—) en textos | | |
| Radios coherentes | | |
| `design-taste-frontend` pasada | | |
| `impeccable` pasada | | |
| Aviso de «prototipo no oficial» si usa marca ajena o hipótesis | | |

## Prueba con personas
| Criterio | Estado | Evidencia |
|---|---|---|
| 5 personas nuevas, en voz alta, sin ayuda | | |

## Lo que falta, por orden
1.
