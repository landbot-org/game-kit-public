# Prueba con 5 personas: Pistacho Imperium

Puerta 6 del proceso (`docs/01-proceso.md`). **Sin hacer todavía.** Este guion se prepara el 26/10/2026 y no tiene resultados. Las cifras de «qué es éxito» son **hipótesis mías**, fijadas antes de probar para no ajustarlas después a lo que salga.

## Para qué sirve
Saber si una persona nueva, en un móvil, **entiende sin ayuda** qué hacer, juega una partida entera y llega al final con ganas de apoyar al pistacho español. No sirve para saber si «gusta»: sirve para ver dónde se atasca.

Cuatro cosas concretas que el juego todavía no ha demostrado:
1. Que se entiende el objetivo y el primer gesto (plantar, atacar) sin leer reglas.
2. Que **pasar plantas** se encuentra y se entiende (ya costó explicarlo una vez).
3. Que el **premio del 5 %** se ve, se entiende y motiva.
4. Que el final lleva a **Ver mi premio** y el chat se entiende (comprar o distribuir).

## Quién y cómo
- **5 personas que no hayan visto el juego**, que no sepan que lo has hecho tú, y **que no sean del equipo de producto**. Mezcla: al menos 2 que conozcan Risk o juegos de estrategia y al menos 2 que no; al menos 3 que no hayan visto antes un juego de este tipo. Apúntalo en la tabla de registro.
- **Una persona cada vez**, 10 minutos cada una (5 de juego, 5 de preguntas).
- **En su propio móvil** si puedes (Safari y Chrome; si hay mezcla, mejor). Es la parte que más falta: audio, toques sobre fichas pequeñas, barra del navegador.
- Quien dirige **no ayuda**. Se sienta al lado, no delante, y mira la pantalla.

## Antes de empezar (tú)
1. **Una URL que abra en el móvil de cada persona.** Hoy el juego solo está en tu ordenador (`localhost`). Opciones: (a) servir la carpeta en tu red local y abrirla desde el móvil con la IP del ordenador; (b) publicar en Vercel, **que solo se hace con tu visto bueno** (`scripts/deploy.sh`). Dime cuál y lo preparo.
2. **Borra el recuerdo de la guía** en ese navegador para que cada persona vea la guía como nueva: el juego guarda `pistacho_tut`. En un móvil ajeno, abre en una pestaña privada.
3. **Grabación de pantalla con permiso** (si no quieren, solo notas). No grabar cara ni voz sin que lo digan.
4. **Cronómetro** y la **tabla de registro** de abajo (una fila por persona).
5. **Sonido activado** en el móvil (parte de lo que se mide es si se oye algo).
6. Avisa al terminar de que **el descuento y el enlace de reserva son de demostración** (ver «Al terminar»).
7. Antes de la primera persona, **juega tú una partida entera** para comprobar que la URL funciona. No cuenta como prueba.

## Lo que se dice (palabra por palabra)
Al empezar:
> «Esto es un juego que estamos probando. No te evalúo a ti, evalúo el juego: si algo no se entiende, es un fallo del juego, no tuyo. Voy a mirar y a tomar notas, no te voy a ayudar, y no pasa nada si te quedas parado. Piensa en voz alta: di lo que ves y lo que crees que hay que hacer. ¿Te parece bien que grabe la pantalla? [esperar]. Aquí tienes el enlace: ábrelo y juega como harías en casa.»

Cuando se quede parado más de 15 segundos:
> «¿Qué estás pensando ahora mismo?»

Cuando pregunte «¿y ahora qué hago?» o «¿esto qué es?»:
> «¿Qué crees tú que es?» o «Haz lo que harías si yo no estuviera.»

## Lo que NO se dice (y por qué)
| No decir | Porque |
|---|---|
| «Es como el Risk» | Le das la regla; el juego tiene que explicarse solo. |
| «Toca ahí», «prueba el botón de abajo», señalar con el dedo | Es una ayuda: apunta y no cuenta como «lo hizo solo». |
| «Pasa plantas» o «hay un botón para mover» | Es justo lo que se mide si lo encuentran. |
| «Si ganas, te llevas un 5 %» | Se mide si lo ven y lo entienden. |
| «Es de Vergel» o «apoya a Vergel» | Se mide si lo entienden por el juego. |
| «Muy bien», «eso es», «casi» | Tus reacciones guían sin que te des cuenta. |
| «Lo hemos hecho nosotros», «me costó mucho» | La gente se corta y dice que está bien. |
| Explicar un fallo del juego | Anótalo: es el hallazgo. |
| Preguntas que dan la respuesta: «¿No te parece claro que…?» | Usa preguntas abiertas. |

## Qué mirar mientras juega (cronometrar y apuntar)
Una fila por persona (ver tabla). Para cada cosa, apunta el **momento y la frase literal** si dice algo.

| # | Qué | Cómo se mide |
|---|---|---|
| 1 | **Segundos hasta la primera acción** | Desde que carga el juego (aparece el título) hasta el primer toque en un territorio. |
| 2 | **Lee el título o lo salta** | Si toca «Jugar» sin leer, es normal; apunta si se para en el premio del 5 %. |
| 3 | **Guía: sigue, salta o se pierde** | Si pulsa «Saltar guía», en qué paso. |
| 4 | **Primer ataque** | Si ataca sin ayuda; cuántos toques erró antes (toques que no hacen nada o caen en otro territorio). |
| 5 | **Dados** | Si entiende por qué ganó o perdió una tirada (lo dice en voz alta o no). |
| 6 | **Pasar plantas** | Si pulsa el botón sin ayuda (sí / no / tras cuántos turnos) y si completa el traslado. |
| 7 | **Atascos** | Cada vez que se queda más de 15 segundos sin tocar nada: dónde y qué dice. |
| 8 | **Toques fallidos** | Contar cuántas veces toca una ficha o comunidad y no pasa lo que esperaba. |
| 9 | **Acaba la partida** | Sí / no; duración total (objetivo del diseño: de 2 a 3 minutos). |
| 10 | **Ve el final y el premio** | Si lee el cupón del 5 % o el aviso de «esta vez no». |
| 11 | **Llega al cierre** | Si pulsa «Ver mi premio». |
| 12 | **Elige en el chat** | Qué elige (comprar, distribuir, nada) y si duda. |
| 13 | **Sonido** | Si lo oye, si lo apaga, si dice algo. |

## Preguntas al terminar (en este orden, abiertas)
1. «Cuéntame con tus palabras: ¿de qué va el juego y cómo se gana?» *(objetivo)*
2. «¿Qué ha sido lo más confuso?» *(atascos)*
3. «¿Qué crees que hacía el robot?» *(rival)*
4. «¿Hay algo que pudieras hacer y no lo hayas hecho?» *(si no menciona pasar plantas, preguntar:)* «Cuando terminas de atacar, ¿qué puedes hacer?»
5. «¿Qué has ganado, o qué podrías haber ganado?» *(premio del 5 %: ¿lo han entendido?)*
6. «¿Qué es Vergel?» *(marca)* y «¿Qué te ha parecido el final?»
7. «Si esto lo vieras en un anuncio, ¿qué harías?» *(intención; no es una promesa, solo señal)*
8. «¿Lo volverías a jugar? ¿Por qué sí o por qué no?»

## Al terminar
- Cuéntales que **el 5 % y el enlace de reserva son de demostración**: no tienen que comprar ni reservar nada. Si probaron el código `VERGEL5` en alguna tienda, no funciona: Vergel no existe.
- Cada partida que llegue al chat crea una conversación en la bandeja de Landbot. **No contiene datos personales** (el chat no pide ninguno).
- **No guardes nombres** en las notas si no hace falta: «P1 a P5» y su perfil (conoce Risk sí o no, sabe qué es un cupón de demostración sí o no).

## Tabla de registro (copia una fila por persona)
| Persona | Móvil y navegador | Conoce Risk | Conoce el juego | 1. Seg. hasta 1.ª acción | 3. Guía | 4. Toques fallidos antes del 1.er ataque | 6. Pasar plantas (sí/no, turno) | 7. Atascos (dónde) | 9. Acaba (sí/no, min) | 10. Ve el premio | 11. Pulsa Comprar | 12. Elige | Frases literales |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| P1 | | | | | | | | | | | | | |
| P2 | | | | | | | | | | | | | |
| P3 | | | | | | | | | | | | | |
| P4 | | | | | | | | | | | | | |
| P5 | | | | | | | | | | | | | |

## Qué cuenta como «está listo» (hipótesis fijadas antes de probar)
Con 5 personas, un 4 de 5 es bueno y un 2 de 5 es un problema. Son umbrales **míos**, no medidos en otros juegos del kit (el kit todavía no tiene datos de referencia):

| Medida | Bien | Revisar |
|---|---|---|
| Primera acción en 10 segundos o menos | 4 de 5 | 2 o menos |
| Saben decir cómo se gana (más territorios al acabar la ronda 6) | 4 de 5 | 2 o menos |
| Acaban la partida | 4 de 5 | 3 o menos |
| Duración de la partida | de 2 a 4 minutos | más de 5 |
| Encuentran y completan «Pasar plantas» sin ayuda | 3 de 5 | 1 o menos |
| Saben decir que ganar da un 5 % (simulado) | 4 de 5 | 2 o menos |
| Pulsan «Ver mi premio» | 3 de 5 | 1 o menos |
| Toques fallidos antes del primer ataque | 1 o menos de media | 3 o más |

## Después
1. Rellena la tabla y **ordena los problemas por cuántas personas los tuvieron**, no por lo llamativos que fueron.
2. Para cada problema: ¿qué pasó (hecho), qué creemos que lo causa (hipótesis), qué se cambia? Una pregunta por problema, con opciones, no «¿qué te parece?».
3. **Itera y repite con otras 5 personas** (`docs/01-proceso.md`): una sola ronda no basta si se cambia algo grande.
4. Decide tú (**puerta 6**) si está listo. Hasta entonces, cada entrega del juego dice que **no se ha probado con personas**.
5. Anota en `docs/09-backlog.md` lo que el kit debería traer para esta fase (guion y tabla de registro genéricos).

## Lo que este guion no cubre
- No mide si el juego **convierte en ventas** ni si el descuento mueve a comprar; solo si se entiende y se llega al botón.
- No sustituye una prueba en el **evento o canal real** (enlace desde redes, QR…): el contexto cambia la atención.
- Con 5 personas se ven los atascos más grandes, no los raros.
