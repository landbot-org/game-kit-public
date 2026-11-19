# Principios de diseño

Cada principio lleva de dónde sale y qué lo violaría.

## Mecánica

1. **Una sola mecánica, y que sea el mensaje.** El verbo del juego es lo que vende la marca: distinguir perfiles parecidos (nothiring), separar lo que va de lo que no va en una paella (Paella Police). El recuerdo mejora cuando el mensaje está en la tarea (07c).
   *Lo viola:* un segundo juego dentro del juego («Contrata» en la versión 3).
2. **Partir de un juego que la gente ya conoce** y no quitarle su gracia. Se arregla la claridad dentro de la mecánica original (06a, versión 4).
   *Lo viola:* cambiar el «¿Quién es quién?» por «elige el perfil correcto».
3. **Lo que se pregunta o se juzga tiene que verse.** Los rasgos son objetos dibujados (casco, maletín), no datos ocultos (06a, 06c).
   *Lo viola:* respuestas que salen de una tabla que el jugador no ve.
4. **Contenido real.** Datos con fuente. Lo que es hipótesis se dice en el propio juego («Prototipo no oficial»).

## Claridad

5. **Se juega sin leer reglas.** Pantalla de inicio con gancho, 3 reglas y «Jugar» (Microsoft Advertising, 07c). Como mucho 3 conceptos nuevos (Hodent).
6. **Se enseña haciendo, sobre la partida real.** Un foco ilumina lo que toca y espera la acción; se puede saltar; al acabar, la práctica se reinicia (White, *Learn to Play*; versión 5). En el motor es `GK.coach`.
7. **El turno, el objetivo y cómo se gana, siempre a la vista** y en un sitio fijo (07a 7).
8. **Lo que ya no sirve se apaga**, y el texto dice por qué.
9. **Una información por canal.** Aviso grande = qué ha pasado; bocadillo = qué piensa el rival; panel = qué puedes hacer. Si dos cosas dicen lo mismo, sobra una (versión 5).

## Rival (si lo hay)

10. **Piensa en voz alta**: qué le queda, qué va a hacer y por qué (Halo, Into the Breach; 07a 10).
11. **Lo que dice coincide con lo que hace** (07a 12).
12. **Su turno se ve en grande** y su progreso en un sitio fijo.
13. **Calibrado por simulación**, no a ojo: el primer robot ganaba casi siempre.

## Feedback y motion (game-feel)

14. **Toda acción responde al instante**, en el mismo fotograma (Swink).
15. **Feedback por capas, en proporción:** pequeño (tic al elegir), medio (sí/no con sonido), grande (caída con clac y sacudida), máximo (victoria con confeti).
16. **Feedback que explica**, no solo acierto o fallo: «Marta sí lleva casco» (Clark y Mayer).
17. **Cada animación dice un cambio de estado.** Nada se mueve porque sí.
18. **Peso físico:** muelle con rebote al tocar, un solo «clac» por tanda, sacudida de cámara que decae (trauma²). En el motor: `GK.spring`, `GK.rig`.
19. **Movimiento reducido** respetado en todo: sin sacudida, rebotes ni confeti.
20. **Sonido sintetizado**, sin archivos, que arranca con el primer toque y con botón de silencio. En el motor: `GK.sound`.

## Móvil

21. **Móvil primero**: 390 × 844 desde la primera versión. Objetivos de 44 px. El panel cabe sin desplazarse.
22. **En vertical la escena va arriba y el panel abajo**: la cámara se desplaza con `setViewOffset`, no se aleja.
23. **Nada se sale de la pantalla**: los bocadillos que siguen a un objeto 3D se recortan a los bordes.
24. **Un solo HTML** que cargue rápido por QR, con las fuentes dentro.

## Cierre

25. **Acaba en un momento alto** y explica el resultado (regla pico-final, Meta).
26. **Al perder sabes por qué.**
27. **No se piden datos antes de jugar.** La llamada a la acción va al final, clara y con un chat de reserva si Landbot no carga.

## Proceso

28. **Medir antes de opinar**: script para el contenido, simulación para el rival, 5 personas para la diversión.
29. **Quitar antes que explicar.** Si algo necesita un texto para entenderse, primero intentar quitarlo.
