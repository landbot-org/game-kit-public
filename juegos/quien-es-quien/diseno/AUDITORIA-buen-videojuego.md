# Auditoría: ¿cumple con lo que pide un buen videojuego?

Versión revisada: https://quienesquienia.vercel.app (26/10/2026). Criterios: las 18 comprobaciones del informe 07a, las checklists del 07c, las 14 recomendaciones del 07b, las skills `game-feel`, `game-ui-ux` y `audio-design` del repo awesome-gamedev-agent-skills (leídas, no instaladas) y la skill design-taste. Verificado en el navegador a 1024 px y a 390 px simulados, sin teléfono real y sin jugadores.

Leyenda: ✅ cumple · 🟡 a medias · ❌ no cumple · ➖ no aplica.

## Claridad y onboarding
| Criterio | Estado | Evidencia |
|---|---|---|
| Se juega sin leer reglas largas (07a 1; Andersen 2012) | ✅ | Intro de 3 frases; la leyenda de objetos va plegada |
| Pantalla de inicio con 2 o 3 zonas (07c) | ✅ | Gancho, 3 reglas, botón «Jugar» |
| Primera acción en 5-10 s | 🟡 | Sin medir con personas |
| Turno visible en un sitio fijo (07a 7) | ✅ | Cabecera del panel: turno y caras de cada uno |
| Historial de quién hizo qué (07a 8; 07b 13) | ✅ | Últimas 4 jugadas en escritorio, 2 en móvil |
| Cómo se gana, a la vista | ✅ | «¿Es X?» con 3 caras o menos; «Arriesgar ya» siempre |
| Preguntas que ya no sirven se distinguen | ✅ | Se apagan y lo dice el texto |
| Ayuda que se retira (HGB, coaching) | ✅ | Pregunta recomendada solo en el primer turno |

## El rival
| Criterio | Estado | Evidencia |
|---|---|---|
| El robot dice qué va a preguntar y por qué (07a 10) | ✅ | Bocadillo con la pregunta y el reparto «6 sí y 6 no» |
| Su turno se ve en grande | ✅ | Tarjeta central con el objeto, la respuesta de tu carta y cuántas descarta |
| Se ve cómo va el robot | ✅ | Mini tablero de 12 caras: descartes tachados, tu carta en lima |
| Sus apuestas se ven | ✅ | Tarjeta «El robot apuesta» con la cara y el resultado |
| Bocadillo, aviso y tarjeta no se pisan (07a 11) | ✅ | El bocadillo sale 600 ms después del aviso y se oculta con la tarjeta |
| Lo que dice coincide con lo que hace (07a 12) | ✅ | El reparto anunciado es el real |

## Feedback y motion (game-feel)
| Criterio | Estado | Evidencia |
|---|---|---|
| Toda acción tiene respuesta inmediata (07a 9) | ✅ | Icono con pulsación y sonido; respuesta en el mismo turno |
| Feedback por capas y en proporción (game-feel) | ✅ | Pequeño: «tic» al elegir. Medio: sí/no con sonido. Grande: caída con «clac» y sacudida. Máximo: victoria con confeti |
| Un solo «clac» por tanda (07b 6) | ✅ | Limitado a uno cada 400 ms |
| Sacudida en la cámara, que decae (game-feel) | ✅ | «Trauma» al cuadrado que decae; no mueve el tablero |
| Caída con peso, entre 350 y 450 ms (07b 5) | 🟡 | Toca a los 300 ms y asienta a los 740 ms (calculado), algo más largo |
| Cada animación comunica un estado (07a 15) | ✅ | Reparto al empezar, caída, marca, tarjeta del robot, salto del robot, confeti |
| Respeta movimiento reducido | ✅ | Sin reparto, sacudida, confeti ni rebotes con `prefers-reduced-motion` |
| Sonido con botón de silencio (07c) | ✅ | Sintetizado, sin archivos; se activa al pulsar «Jugar» |
| «No encaja» sin depender del color (07a 4) | ✅ | Marco rojo con una X blanca |

## Móvil y accesibilidad
| Criterio | Estado | Evidencia |
|---|---|---|
| Panel sin desplazarse en 390 px | ✅ | Medido: cabe entero |
| Objetivos táctiles de 44 px (07b 11) | ✅ | Iconos de 48 px; cartas de unos 90 px |
| Tocar una carta la amplía (07b 9) | ✅ | Ficha centrada con sus objetos |
| Pausa al ocultar la pestaña (07c) | 🟡 | El robot espera; las animaciones no se congelan |
| Navegable con teclado (game-ui-ux) | 🟡 | Botones y apuesta sí; abatir cartas una a una, solo con ratón o dedo (está el botón «Abatir las N») |
| Texto mínimo legible | 🟡 | Etiquetas a 12,8 px en escritorio; el nombre en las cartas pequeñas del mini tablero no se lee |
| Un solo HTML autónomo (07c) | 🟡 | Las fuentes vienen de Google Fonts |

## Cierre y design-taste
| Criterio | Estado | Evidencia |
|---|---|---|
| Final en un momento alto (07c, pico-final) | ✅ | Ganar: confeti y sonido. Perder: el robot salta, y se explica por qué |
| Al perder sabes por qué (07a 13) | ✅ | «Cómo buscaba el robot tu carta» con sus preguntas |
| No se piden datos antes de jugar | ✅ | |
| Llamada a la acción clara | ✅ | «Hablar con nothiring»; falta el chat de Landbot |
| Sin rayas, un solo acento, radios coherentes (taste) | ✅ | 0 rayas; lima como acento y rojo solo para error |
| Prueba con 5 personas (07a 18) | ❌ | Pendiente; es lo que más falta |

## Lo que falta, por orden
1. Probar con 5 personas, pensando en voz alta, y medir el tiempo hasta la primera pregunta.
2. Acortar la caída a unos 450 ms hasta asentarse.
3. Congelar las animaciones al ocultar la pestaña.
4. Fuentes dentro del HTML.
5. Chat de Landbot como cierre.
