# Pantallas y fases de un juego de evento

Basado en las 11 fases del informe 07c (Phaser, Nystrom, Cook, MDA) comprimidas para juegos de 1 a 3 minutos. La plantilla ya trae todas.

| # | Fase | En un juego de evento | Lleva | No lleva | En la plantilla |
|---|---|---|---|---|---|
| 0 | Carga | Se aprieta: un solo HTML | Nada que leer | Esperas sin indicador | `scripts/build.py` |
| 1 | Título y gancho | 2-3 zonas de atención | Pregunta gancho, 3 frases, botón «Jugar» | Menús, reglas largas | `intro()` |
| 2 | Premisa | Una línea dentro del título | Quién soy y qué consigo | Historia | `intro()` |
| 3 | Onboarding | Guía sobre la partida real, que se reinicia al acabar | Foco que espera la acción, se puede saltar | Pantalla de reglas | `GK.coach()` |
| 4 | Bucle | Una sola mecánica | El verbo central | Mecánicas que compitan | `game.js` |
| 5 | Progresión | Rampa dentro de la partida | Más difícil al final | Saltos sin aviso | `game.js` |
| 6 | Feedback | Entero, por capas | Ver `03-principios.md` | Efectos que tapen | `GK.sound`, `GK.announce`, `GK.overlay` |
| 7 | Pausa | Silencio y pausa al ocultar la pestaña | Botón de sonido | Menú de ajustes | `GK.onHidden` |
| 8 | Fin | Momento alto y explicación | Resultado y por qué | Fallo seco | `finish()` |
| 9 | Rejugar | Un botón | Reinicio limpio | Repetir la guía | `newGame()` |
| 10 | Cierre | Captación | CTA (Landbot o enlace) | Pedir datos antes de jugar | `finish()` |
