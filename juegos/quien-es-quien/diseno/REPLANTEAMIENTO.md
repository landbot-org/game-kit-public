# Replanteamiento desde cero: «¿Quién es quién en IA?»

Estado: propuesta para aprobar. No hay nada construido con este diseño.
Base: informes 06 (mecánica del original, juegos de adivinar, atributos de roles), 07a (principios de UX), 07b (cartas y tablero digitales), 07c (estructura, libros, advergames), 07d (repos). Lo que es hecho viene de esos informes; lo demás es decisión mía y va como hipótesis a probar.

## 1. Por qué fallaba (en una frase cada cosa)

1. **Dos juegos en uno.** Duelo y Contrata competían, y Contrata no tenía razón de ser dentro del juego. Una sola mecánica por juego corto (guía de anuncios jugables de Meta, en 07c).
2. **Deducción sobre 24 cartas que no se leen.** En móvil cada carta medía unos 33 px; los rasgos eran iconos diminutos (07b).
3. **Reglas antes que acción.** El juego pedía leer cómo funciona antes de hacer nada; en juegos sencillos los tutoriales no mejoran el enganche (Andersen et al., CHI 2012, en 07a y 07c).
4. **La mecánica no era la idea.** Adivinar la carta del robot no se parece al problema que queremos enseñar: distinguir perfiles que se confunden. El recuerdo mejora cuando la marca o el mensaje están en la tarea principal (07c), y como añadido se recuerda peor (07a).
5. **Animación que adorna.** Muchas cartas cayendo a la vez sin decir nada; los efectos que solo amplifican bajan la motivación (Kao et al., CHI 2024, en 07a).

## 2. La idea nueva

**Eres quien contrata. El robot te trae candidatos uno a uno. Mira sus pistas y di qué perfil es.**

Es «¿quién es quién?» en sentido literal: identificar quién es cada uno. Una sola mecánica, una carta grande cada vez, tres botones.

- **Por qué esta:** la tarea del juego es exactamente lo que nothiring sabe hacer y lo que confunde a las empresas: separar perfiles parecidos. El mensaje no va añadido, es la tarea.
- **Qué se lleva el jugador:** saber distinguir los pares que se confunden (FDE frente a Solutions Engineer, Product Engineer frente a AI Product Engineer, GTM no-code frente a GTM con código) y una puntuación.
- **Qué se lleva el negocio:** al acabar, el mismo robot ofrece hacer el brief de su contratación en un chat (Landbot). Es la conversión, después del momento alto, no antes.
- **Qué se reutiliza:** el robot que piensa en voz alta, los 12 perfiles y sus rasgos, el feedback que explica y el despliegue de un solo archivo.

## 3. Estructura pantalla a pantalla (las 11 fases de 07c, comprimidas para un juego de evento)

| Fase | Qué se ve | Qué no |
|---|---|---|
| Carga | Nada que leer; un solo HTML | Esperas sin indicador |
| Título y gancho | «¿Sabrías distinguir a un AI Engineer de un FDE?», 8 candidatos, un botón «Empezar» | Menús, reglas, más de 3 zonas de atención |
| Premisa | Una línea dentro del título: «Eres quien contrata. El robot te trae candidatos.» | Historia, párrafos |
| Onboarding | La primera ronda es fácil y guiada: la pista decisiva brilla y no se puede perder | Pantalla de reglas |
| Bucle | Llega una carta con 3 o 4 pistas grandes (icono y palabra). Eliges entre 3 perfiles | Más de una mecánica |
| Progresión | Rondas 1 a 3, perfiles de familias distintas; 4 a 6, de la misma familia; 7 y 8, los «gemelos», con una pista menos | Saltos sin aviso |
| Feedback | Al pulsar, respuesta inmediata; sello de acierto o fallo; el robot dice en una frase qué pista decidía | Lluvia de efectos; feedback que solo dice bien o mal |
| Pausa | Silencio y pausa automática al cambiar de pestaña | Menú de ajustes |
| Fin | «6 de 8», qué pares confundiste y la diferencia entre ellos en una línea | Acabar en un fallo seco |
| Rejugar | Un botón; otra selección de candidatos | Repetir el onboarding |
| Cierre | El robot: «¿Y en tu empresa? Cuéntame qué necesitas y te preparo el brief», que abre el chat de Landbot | Pedir datos antes de jugar |

## 4. Reglas concretas

- 8 candidatos por partida, sin cronómetro duro: el tiempo se usa para leer la explicación. Hipótesis de duración: entre 90 segundos y 2 minutos.
- Cada carta: nombre ficticio, cara y 3 o 4 pistas en frases de oferta real («Lleva tres semanas dentro del cliente», «Monta la prospección con Clay», «Decide qué se construye»). Pistas sacadas del informe 03 y de la matriz 06c, por validar.
- Los 3 perfiles para elegir son el correcto y sus dos vecinos más parecidos (ya está calculado: el rol más cercano por rasgos).
- Racha visible, sin penalización dura: fallar enseña.
- El robot: antes de cada carta dice qué perfil le parece difícil; tras responder, explica la pista decisiva. Nunca habla a la vez que el sello (07a, comprobaciones 10 y 11).

## 5. Lo visual

- Una mesa de entrevistas con el robot al otro lado y **una sola carta grande** en el centro, legible en móvil sin ampliar.
- 3D ligero: la carta entra deslizándose, el sello cae con peso (de 350 a 450 ms, un solo «clac»), y nada más se mueve si no cambia el estado (07b, recomendaciones 5 a 7).
- Pistas con icono y palabra, nunca solo color (07a, comprobaciones 3 y 4).

## 6. Cómo se prueba antes de pulir

- Ronda de 5 personas nuevas, en voz alta, sin ayudarles (07a, comprobación 18; RITE).
- Medidas: segundos hasta la primera respuesta (objetivo, menos de 10), si saben decir de qué va el juego, aciertos por par de perfiles, cuántos llegan al final y cuántos abren el chat.
- Se itera y se repite con otras 5.

## 7. Lo que queda fuera de esta versión

- El duelo y Contrata se retiran. El duelo podría volver más adelante como modo para quien ya conoce los perfiles.
- Un modo «¿qué perfil eres tú?» para ingenieros (tipo Akinator) es una idea aparte, no de esta versión.

## 7 bis. Alternativa que conserva la gracia del «¿Quién es quién?»

Objeción de quien aprueba (25/10): la propuesta de arriba quita la gracia del juego original. La gracia es el tablero de caras, la carta secreta de cada uno, las preguntas de sí o no, abatir caras y la carrera contra el rival. Esta alternativa la conserva y arregla lo que fallaba:

- **12 caras, una por perfil**, en un tablero de 4 por 3. Cartas grandes y legibles en móvil. Adivinar la cara del robot es adivinar su perfil, así que jugar ya enseña.
- **Los rasgos se ven como en el original, en la cara**: portátil (programa), chispa en la camiseta (usa IA generativa), casco (trabaja dentro del cliente), maletín (ligado a vender), auriculares (diseña conversaciones), portapapeles (organiza procesos)… y el color de la camiseta dice qué hace sobre todo, con la palabra escrita para no depender del color. Se pregunta como en el juego de mesa: «¿Lleva casco?», y debajo, qué significa.
- **Abatir es tuyo**: tras la respuesta, las caras que no encajan se marcan y las abates tú con un toque, o todas de golpe con un botón. Es el gesto del juego.
- **Duelo contra el robot** que piensa en voz alta, con su carta secreta y la tuya. Con 12 caras, unas 4 preguntas bastan: partida de unos 2 minutos.
- **Medido antes**: con los rasgos de la matriz, los 12 perfiles son distinguibles entre sí (comprobado con el script de `matriz.py`); falta comprobar que cada rasgo visual parte el tablero de forma útil.
- **Fuera**: la fase Contrata. Al acabar, el robot revela las dos cartas, explica qué separa cada perfil de su gemelo y ofrece el brief en el chat de Landbot.

## 8. Decisiones que necesito de quien aprueba

1. ¿Esta mecánica (identificar el perfil de cada candidato) o mantener el duelo simplificado?
2. ¿El cierre es el chat de Landbot con el brief, como en Paella Police?
3. ¿Marca de nothiring en el juego o neutra hasta hablar con Eusebio?
