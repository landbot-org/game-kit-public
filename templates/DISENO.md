# Diseño: <nombre del juego>

Estado: borrador · Aprobado: no · Fecha:

> Sin aprobar no se escribe código (docs/01-proceso.md, fase 3). La línea «Estado» la escribe `scripts/fase.py` cuando quien aprueba ejecuta `aprobar`; no se toca a mano.
> Una vez aprobado, las secciones 1 a 16 quedan fijas (lo hace cumplir un hook). Cada cambio que se pida después va en una sección nueva al final (`## 17. Cambio tras aprobar: …`): qué cambia, quién lo pidió, por qué y qué se ha vuelto a medir. Se apunta también con `scripts/fase.py cambio <juego> "…"`.

## 1. Una línea
Qué hace el jugador y por qué. «Adivina la cara secreta del robot preguntando por lo que se ve, antes de que él adivine la tuya.»

## 2. Contexto de uso
- Dónde: evento con QR / web / LinkedIn / pantalla en un stand
- Duración objetivo de una partida:
- Dispositivo principal (casi siempre móvil):
- Idiomas:
- Quién mira la pantalla (el jugador solo, un grupo, un stand):

## 3. Objetivo de negocio y métrica
- Qué se lleva el jugador:
- Qué se lleva la marca (lead, recuerdo, demo de Landbot):
- Métrica: % que acaba, % que llega al cierre, % que deja el contacto.

## 4. Experiencia buscada
1 o 2 estéticas de MDA (desafío, descubrimiento, fantasía, compañerismo…) y la emoción del final.

## 5. Mecánica central
- Juego de referencia que la gente ya conoce y qué lo hace divertido (de la investigación):
- El verbo:
- Entrada en móvil / en escritorio:
- **Por qué la mecánica es el mensaje:**

## 6. Bucle y arcos
- Qué se repite (bucle):
- Qué se vive una vez (arco: intro, guía, final):

## 7. Fases
| Fase | Se mantiene / comprime / quita | Segundos | Notas |
|---|---|---|---|
| Carga | | | |
| Título y gancho | | | |
| Onboarding (guía en la partida real) | | | |
| Bucle | | | |
| Feedback | | | |
| Fin | | | |
| Rejugar | | | |
| Cierre | | | |

## 8. Contenido
Entidades del juego (cartas, ingredientes, preguntas), con su fuente. Lo no verificado, marcado como hipótesis y avisado en el juego.

## 9. Progresión y dificultad
Rampa, rival y cómo se calibra (simulación).

## 10. Feedback
| Evento | Visual | Sonido | Texto | Nivel (pequeño / medio / grande / máximo) |
|---|---|---|---|---|
| | | | | |

## 11. Recompensa y resultado
Rangos, fórmula, mensaje del final, qué se explica al perder.

## 12. Cierre
Llamada a la acción, datos que pasan a Landbot (`customData`) y qué pasa si el chat no carga.

## 13. Medidas previas sin personas
- Script de contenido (por ejemplo: todas las cartas distinguibles; preguntas medias para identificar una):
- Simulación del rival (N partidas; % de victorias del jugador modelo óptimo, cauto, flojo):

## 14. Plan de prueba
- Automática: recorrido con `window.__game` en 390 × 844 y 1440 × 900.
- Con 5 personas: tiempo hasta la primera acción, si saben decir el objetivo, dónde se atascan, cuántos acaban, cuántos llegan al cierre.

## 15. Riesgos y trampas conocidas

## 16. Decisiones abiertas para quien aprueba
Una por línea, con opciones concretas y mi recomendación.
