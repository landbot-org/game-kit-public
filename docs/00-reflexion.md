# Reflexión: lo que aprendimos haciendo tres juegos

Escrito el 26/10/2026 tras Paella Police, Nasi Lemak Police y «¿Quién es quién en IA?» (nothiring). Es la base de este kit. Lo que viene de una fuente lo indica; lo demás es experiencia propia de estas partidas, sin probar todavía con jugadores.

## 1. Lo que salió mal y por qué

El «¿Quién es quién?» tuvo cinco versiones en dos días. Cada rehecho tuvo una causa que el kit intenta evitar:

| Versión | Qué falló | Causa de fondo | Regla que sale |
|---|---|---|---|
| 1. Cuestionario con cartas | No había dinámica | Se construyó antes de entender el juego original | **Investigar la mecánica de referencia antes de diseñar** |
| 2. Duelo de 24 cartas | Nada que razonar | Las respuestas estaban en una matriz oculta; las cartas no mostraban los rasgos | **Lo que se pregunta tiene que verse** |
| 3. Duelo con Contrata | No se entendía | Dos juegos en uno; cartas de 33 px en móvil | **Una sola mecánica; diseñar para el móvil primero** |
| 4. Elegir el perfil | Sin gracia | Se arregló la claridad quitando lo divertido | **No se sacrifica la gracia del juego de referencia: se arregla dentro de ella** |
| 5. 12 caras con objetos | Funciona | Rasgos visibles como objetos, duelo, guía en la partida real | Lo que hay en `docs/03-principios.md` |

La lección de proceso: **diseño aprobado antes de código**. Cada vez que se construyó sin documento de diseño aprobado, se tiró.

## 2. Lo que funcionó

1. **La mecánica es el mensaje.** Distinguir perfiles parecidos es lo que vende nothiring; el juego es eso mismo. El recuerdo mejora cuando el mensaje está en la tarea (informe 07c).
2. **Rasgos visibles como objetos en la cara** (portátil, casco, maletín), como gafas y sombreros en el original. La pregunta se responde mirando.
3. **Medir el tablero antes de dibujarlo**: con un script, que todas las cartas sean distinguibles y cuántas preguntas hacen falta (3 a 4 con 12 cartas). Y calibrar el rival con simulación de partidas (el primer robot ganaba casi siempre).
4. **El rival piensa en voz alta**: qué le queda, qué va a preguntar y por qué (Halo e Into the Breach, informe 07a). Su turno se ve en grande y su progreso en un mini tablero.
5. **El jugador hace los gestos**: abate sus cartas y responde Sí o No mirando su carta. Si se equivoca, se le corrige con la razón.
6. **Feedback que explica**, no solo acierto o fallo (Clark y Mayer).
7. **Guía sobre la partida real**, no pantalla de reglas: un foco ilumina lo que toca y espera la acción. Al acabar, la práctica se reinicia para empezar limpio.
8. **Motion con motivo**: cada animación dice un cambio de estado (reparto, caída con «clac», sacudida, salto del robot, confeti al ganar). Un solo «clac» por tanda. Respeta el movimiento reducido.
9. **Quitar antes que explicar**: tablero 3D del rival, avisos de turno duplicados, título y nota fuera. Una información por canal.

## 3. Lo que todavía no sabemos

- Si es divertido para alguien que no sea quien aprueba: **ningún juego se ha probado con 5 personas**.
- Si los objetos se entienden sin leyenda.
- Cuánto debe durar un juego de evento: no hay datos (07c).

## 4. Trampas técnicas que costaron tiempo

Están en `docs/05-trampas.md`: comentarios que se tragan código en una línea, capturas del navegador con fotogramas viejos, caché del servidor local, cámara en vertical, Vercel y su protección, el `.env.local` con token.

## 5. Qué hace este kit con todo esto

- Un **proceso con puertas** (`docs/01-proceso.md`): no se programa sin diseño aprobado ni se pule sin prueba con personas.
- Una **plantilla de diseño** de 16 campos y una **auditoría** con las comprobaciones que usamos.
- Un **motor pequeño** (`engine/`) con lo que se repitió en los tres juegos: sonido sintetizado, avisos, bocadillo del rival, tarjeta central, guía con foco, confeti, cámara con sacudida y encuadre vertical, cartas con bisagra y muelle, pausa al ocultar la pestaña y ganchos de prueba.
- Una **plantilla jugable** (`plantilla/`) que ya tiene todas las fases de un juego de evento.
- El **ejemplo completo** del «¿Quién es quién?» (`juegos/quien-es-quien/`).
