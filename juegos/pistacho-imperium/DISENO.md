# Diseño: pistacho-imperium

Estado: aprobado · Aprobado: sí (26/10/2026, con las opciones recomendadas del campo 16; logo: no, solo el nombre en tipografía)

> Sin aprobar no se escribe código (docs/01-proceso.md, fase 3).
> Origen de los datos: **[web]** fuente leída, **[medido]** simulación en `investigacion/`, **[hipótesis]** decisión mía por probar.

## 1. Una línea
Planta pistachos en las comunidades autónomas de un mapa esquemático de España y tira los dados para conquistar las del robot, el pistacho español contra el californiano, hasta dominar el mapa. (Mapa cambiado por quien aprueba el 26/10/2026: ver sección 17.)

## 2. Contexto de uso
- Dónde: **por confirmar.** Supuesto: enlace de campaña (QR o enlace desde redes) y demo para enseñar a la marca. El encargo de partida: una campaña que merezca algo mejor que un formulario.
- Duración objetivo de una partida: 2 a 3 minutos. [medido] 12 parcelas dan de 4 a 7 turnos propios según el nivel; [hipótesis] 20 a 30 s por turno, sin medir con personas.
- Dispositivo principal: móvil, 390 × 844. Escritorio secundario.
- Idiomas: español.
- Quién mira la pantalla: el jugador solo.

## 3. Objetivo de negocio y métrica
- Qué se lleva el jugador: una partida corta y un resultado que puede compartir. Premio posible en el campo 12.
- Qué se lleva la marca: **el contacto sin formulario.** El cierre es una conversación (Landbot), no una página de campos. Y una demo de «campaña con juego en vez de formulario».
- Marca: **el juego lleva una marca inventada, Vergel.** Una primera versión usaba una marca real sin permiso y se retiró: nombre, eslogan, colores, enlaces y chat. Nada de lo que ve el jugador es de una marca real.
- Métrica: % que acaba la partida, % que llega al cierre, % que deja el contacto en la conversación.

## 4. Experiencia buscada
Desafío (arriesgar con los números a favor) y fantasía (ser el agricultor que planta un imperio). Emoción final: **orgullo de ver el mapa teñido de tu verde**, o ganas de la revancha si pierdes por un dado.

## 5. Mecánica central
- Referencia y qué la hace divertida (informe 01): Risk. Apuesta de dados con decisión tuya, regiones con bonus, refuerzo creciente. [web: bgdf.com, unboxedtheboardgameblog.com, defector.com]
- El verbo: **plantar** (refuerzo) y **atacar** (tirada).
- Entrada en móvil: toca tu parcela, toca la vecina enemiga; botones «Una tirada» y «Hasta el final». Escritorio: igual con clic.
- **Por qué la mecánica es el mensaje:** Vergel (inventada) dice «Aquí plantamos, no importamos.» Aquí los ejércitos no se compran: se plantan. Quien domina el mapa es quien más ha plantado. Y el rival es California, un chiste que no depende de ninguna marca real.

Se queda de Risk: dados 3 contra 2 con empate para el defensor, regiones con bonus, refuerzo por turno. Se quita: cartas, fortificar, eliminación, 2 a 6 jugadores y diplomacia (el robot habla en su lugar). Detalle en `investigacion/01-informe-previo.md` §3.

## 6. Bucle y arcos
- Bucle: turno = plantar (N plantones) → atacar (0 o más tiradas) → fin de turno; el robot hace el suyo a la vista.
- Arco: intro y elección de equipo → guía en la primera partida → final → cierre. La guía se salta y la partida se reinicia al acabar.

## 7. Fases
| Fase | Se mantiene / comprime / quita | Segundos | Notas |
|---|---|---|---|
| Carga | Comprime | 2 | Sin pantalla de reglas |
| Título y gancho | Nuevo | 5 | «Plantar o comprar»: un toque para empezar y elegir equipo |
| Onboarding | Guía en la partida real | 20 a 30, saltable | Foco en «planta», luego «ataca con ventaja» |
| Bucle | Se mantiene, comprimido | 100 a 150 | 5 a 6 turnos propios |
| Feedback | Dado visible, «clac», avisos | dentro del bucle | Una información por canal |
| Fin | Tarjeta central | 10 | Resultado y por qué |
| Rejugar | Un botón | 0 | Reinicia limpio |
| Cierre | Conversación, no formulario | 20 a 40 | Después de jugar |

## 8. Contenido
- **Mapa**: **España, 17 comunidades autónomas** (sin Ceuta ni Melilla), en 5 zonas con bonus. Ver sección 17. (La versión de 12 parcelas abstractas queda descartada.)
- **Equipos**: pistacho español y pistacho californiano.
  - Datos para la tarjeta final, con fuente: España ≈ 5.500 t, 0,8 % mundial [web: CIAG]; EE. UU. ≈ 503.700 t en 2024/25, ~43 % [web: mundus-agri.eu]; Europa consume el 25 % del pistacho mundial y produce menos del 1 % [web: Europistachios vía gextia.com, cifra de la propia empresa]; **el Kerman, la variedad de California, viene de Irán** (Whitehouse, 1929) [web: americanpistachios.org, atlasobscura.com; las fuentes difieren en las fechas del reparto].
  - Poderes asimétricos (vecería de Kerman, brote temprano de Larnaka y Sirora): [hipótesis], fuera del MVP salvo que quien aprueba diga lo contrario (campo 16).
- Lo no verificado se avisa en el juego con una marca «Dato por confirmar».
- Marca: paleta propia en `game.css` (tinta, verde pistacho, violeta para el bando rival); tipografías en `fonts.css`; frases propias, sin copiar las de ninguna marca.

## 9. Progresión y dificultad
Tres robots por umbral de ventaja para atacar: Cauto (2), Medio (1), Agresivo (0). Por defecto, Medio. Tras ganar, el juego sube un nivel. [medido: ver campo 13]

## 10. Feedback
| Evento | Visual | Sonido | Texto | Nivel |
|---|---|---|---|---|
| Plantar un plantón | Brote que crece en la parcela | «pop» suave | «Te quedan 3» (panel) | pequeño |
| Tirada de dados | Dados que ruedan, ordenados de mayor a menor y emparejados | «clac» único por tanda | Aviso: «Ganas 1, pierdes 1» | medio |
| Empate | Dado del defensor resaltado | tono corto | «Gana quien ya tiene raíces» (hipótesis de texto) | medio |
| Parcela conquistada | El suelo cambia de color | acorde corto | aviso | medio |
| Comarca completa | Se ilumina la comarca | arpegio | tarjeta «Finca completa: +2 plantones» | grande |
| Turno del robot | Bocadillo sobre su parcela | ninguno | frase corta de chulería | medio |
| Fin de partida | Confeti o hojas caídas | fanfarria o tono bajo | tarjeta con el porqué | máximo |

Movimiento reducido respetado en todos.

## 11. Recompensa y resultado
- Resultado: parcelas conquistadas y turnos. Rangos (hipótesis de nombres): Aprendiz de pistachero, Pistachero, Imperio.
- Fórmula sugerida: parcelas × 10 − turnos. [hipótesis]
- Al perder se explica el porqué con una jugada concreta de la partida: «Atacaste con 2 contra 3: ganabas el 20 % de las veces.» [medido: tabla del informe §2]

## 12. Cierre
Opciones en el campo 16. Por defecto: la pantalla final lleva a una conversación de Landbot que arranca con el resultado de la partida. Datos por `customData`: equipo, resultado, parcelas, turnos y nivel. Si el chat no carga, un botón con enlace directo a la reserva de una llamada. No se pide nada antes de jugar.

## 13. Medidas previas sin personas
- Contenido: no hay cartas que distinguir; el contenido es el mapa y 4 datos con fuente.
- **Estas tablas son del mapa de 12 parcelas, ya sustituido. Las del mapa de España están en la sección 17.** Simulación del rival (`investigacion/medidas.py` y `medidas.txt`, 1.000 partidas por celda, 12 parcelas, el segundo recibe +1 plantón):

Gana el jugador, empezando él (el robot recibe +1):

| Jugador \ Robot | Agresivo | Medio | Cauto |
|---|---|---|---|
| Agresivo | 52 % | 55 % | 62 % |
| Medio | 43 % | 48 % | 57 % |
| Cauto | 36 % | 40 % | 49 % |
| Flojo | 29 % | 31 % | 38 % |

Empezando el robot (el jugador recibe +1): mismos órdenes de magnitud, de 32 % (flojo contra agresivo) a 62 % (agresivo contra cauto). Turnos totales entre 8 y 15 (de 4 a 7,5 propios).

**Lecturas medidas**
1. El reparto de salida queda cerca de 50 % con +1 al segundo.
2. **La habilidad pesa poco**: un jugador flojo gana entre el 29 y el 45 % de las partidas; el agresivo, entre el 47 y el 62 %. Para un evento sirve (nadie se va con 0 %), pero un jugador que aprenda no notará mucha mejora.
3. **Atacar pronto compensa**, así que la guía debe enseñar «ataca cuando tienes ventaja», no «espera».
4. Límites: bot de una regla, mapa de rejilla, sin cartas ni geografía.

## 14. Plan de prueba
- Automática: recorrido completo con `window.__game` en 390 × 844 y 1280 × 800, de la guía al cierre; `scripts/check.py` sin fallos.
- Con 5 personas: segundos hasta la primera acción, si saben decir el objetivo, dónde se atascan, cuántas acaban, cuántas llegan al cierre. **No hecha.**
- Daltonismo: comprobar verde `#BED157` contra rojo `#FB4A4A` o burdeos; los equipos se distinguen también por forma y símbolo, no solo por color. [por medir]

## 15. Riesgos y trampas conocidas
- Dos toques por ataque en móvil: hay que medir toques por turno.
- El azar manda y se pierde sin entender: se mitiga con la tabla de ventajas en pantalla.
- Marca ajena: marca inventada con aviso de «demo»; no se nombra a ninguna marca, persona ni empresa reales, ni se usan sus frases.
- Datos de California: solo con fuente y sin burla a una empresa real.
- Trampas del kit (`docs/05-trampas.md`): `GK.after` en vez de `setTimeout`, capturas de WebGL con fotogramas viejos.
- Landbot: el canal nace 3.0.0, el saludo v4 no recibe `customData`, UNSET no vacía el email. Se verificará al llegar al cierre.

## 16. Decisiones abiertas para quien aprueba
1. **Contexto**: ¿enlace desde redes o QR en un evento, y cuánto dura de verdad? *Recomiendo enlace de campaña, 2 a 3 min.*
2. **Mapa**: A) 12 parcelas abstractas *(recomiendo: menos riesgo de dato)* · B) 12 parcelas con nombres de comarcas reales (Lleida, La Mancha…) · C) 16 parcelas (3 a 4 min, fuera de margen).
3. **Color del rival**: A) rojo `#FB4A4A` con símbolo · B) burdeos `#4E1221` *(recomiendo: más contraste de luminosidad con el verde)* · C) dorado, que no es de su paleta.
4. **Poder de cada equipo**: A) ninguno en el MVP *(recomiendo)* · B) vecería de Kerman · C) brote temprano del español.
5. **Quién empieza**: A) el jugador, robot con +1 *(recomiendo)* · B) el robot, jugador con +1.
6. **Fin de partida**: A) todas las parcelas o más parcelas al turno 8 *(recomiendo)* · B) solo todas las parcelas (partidas más largas).
7. **Cierre**: A) conversación de Landbot que arranca con el resultado y pide el correo a cambio de una muestra o descuento *(recomiendo: es el «algo mejor que un formulario»)* · B) conversación sin premio, solo recuerdo · C) enlace directo a la tienda sin captar.
8. **Logo**: ¿puedo descargar el logo de su tienda para el prototipo? Sin tu permiso uso solo el nombre en tipografía.
9. **Tercer bando** (Sicilia/Bronte o Irán): A) fuera, solo como dato final *(recomiendo)* · B) pantalla de desbloqueo.

## 17. Cambio de mapa: España con sus comunidades (26/10/2026, petición de quien aprueba tras aprobar el diseño)

Quien aprueba pidió: «Quiero que sea el mapa de España y cada trozo se una comunidad». Es un cambio de la decisión 2 del campo 16 (era 12 parcelas abstractas). Cambia el mapa y por tanto el equilibrio, que se ha vuelto a medir.

### Mapa
- **17 territorios**: las 17 comunidades autónomas. (Ceuta y Melilla quedaron fuera en esta versión y quien aprueba las pidió después: ver sección 18.)
- Dibujo **esquemático y no a escala**: contorno peninsular simplificado a ojo (coordenadas aproximadas de conocimiento general, no una fuente cartográfica) recortado en celdas de un diagrama de Voronoi con pesos. Las celdas se ajustaron con búsqueda aleatoria para que **se toquen justo donde hay frontera real** (32 pares, comprobado en `investigacion/mapa_opt.py`). Baleares y Canarias van como piezas aparte, unidas por **enlaces marítimos** (línea discontinua): Baleares con Cataluña y Valencia, Canarias con Andalucía.
- Adyacencias: fronteras terrestres reales entre comunidades (conocimiento general, **sin fuente citada**, a revisar antes de publicar).
- **Madrid es una cuña diminuta** (solo toca Castilla y León y Castilla-La Mancha): se toca por su ficha. Se agrandaron a propósito La Rioja, País Vasco, Cantabria y Madrid en el objetivo del ajuste.
- **Zonas con bonus** (como los continentes de Risk, ajustadas por simulación): Norte (Galicia, Asturias, Cantabria, País Vasco) +2; Ebro (Navarra, La Rioja, Aragón, Cataluña) +2; Centro (Castilla y León, Madrid, Castilla-La Mancha, Extremadura) +3; Sur y Levante (Andalucía, Murcia, C. Valenciana) +2; Islas (Baleares, Canarias) +1. Las zonas son una agrupación mía, no oficial.

### Reglas que cambian
| Antes (12 parcelas) | Ahora (España) | Por qué (medido en `investigacion/sim3.py`) |
|---|---|---|
| Refuerzo: máx(3, parcelas ÷ 3) | máx(3, comunidades ÷ 2) | Con ÷ 3 la partida dura 7 turnos propios; con ÷ 2, 6,4 |
| Reparto 6 y 6 | **8 para el jugador y 9 para el robot** | Con 17 nodos, una comunidad de más decide el desempate de la ronda tope: 9 para el jugador le da el 80 % |
| Robot +1 plantón en sus 3 primeros turnos | Robot **+1 plantón solo en su primer turno** | Es la combinación que deja 49,0 % / 51,0 % |
| Sin tope de rondas | **Tope de 6 rondas**: gana quien tenga más comunidades (17 es impar: no hay empate) | Mantiene la partida en unos 2 a 3 minutos |

### Medidas con el mapa de España (jugador contra robot, ambos «medio», 1.500 partidas por fila, `sim3.py`)
| Tope | Reparto J / R | Robot +1 | Gana jugador | Acaba antes del tope | Turnos propios |
|---|---|---|---|---|---|
| 5 rondas | 8 / 9 | 1 turno | 47,7 % | 30 % | 4,8 |
| **6 rondas** | **8 / 9** | **1 turno** | **49,0 %** | **47 %** | **5,4** |
| 7 rondas | 8 / 9 | 1 turno | 50,8 % | 63 % | 6,0 |
| 6 rondas | 9 / 8 | 1 turno | 75,3 % | 52 % | 5,3 |

- **El mismo código del juego en JavaScript** (`__game.headless`, 4.000 partidas) reproduce la simulación: espejo 47,6 % de victorias del jugador, 44,5 % acaban antes del tope; agresivo contra medio 53,8 %; cauto contra agresivo 27,3 %.
- **Recorrido completo por código** (flujo real del juego con un jugador automático «medio» contra el robot «medio», 60 partidas): 45 % de victorias del jugador, 5,6 rondas de media, **38 s de turnos del robot por partida** (6,9 s por turno del robot). Más 5 a 6 turnos del jugador: [hipótesis] unos 20 s cada uno = ≈ 2,5 min en total, sin medir con personas.
- **Toque en móvil (390 × 844)**: 466 de 480 toques de prueba sobre el centro o 10 px más arriba de cada comunidad propia dieron la comunidad correcta (97 %); los fallos son sobre todo Madrid.
- Límites: bot de una regla; mapa y adyacencias aproximadas; sin personas.

### Pendiente por este cambio
- Revisar adyacencias y nombres con una fuente cartográfica antes de publicar.
- Decidir si Ceuta y Melilla entran.
- Poner el aviso «mapa esquemático» (ya está en la nota de la pantalla de título).

## 18. Ceuta, Melilla y pasar plantas (26/10/2026, peticiones de quien aprueba)

Dos peticiones posteriores a la aprobación: «Añade Ceuta y Melilla» y «Quiero poder pasar plantas de uno a otro». Las dos cambian reglas y se han vuelto a medir.

### Ceuta y Melilla
- **19 territorios**: 17 comunidades y 2 ciudades autónomas. Cada una es una pieza pequeña bajo Andalucía, unida a Andalucía por un enlace marítimo (línea discontinua). Posiciones esquemáticas, no a escala. Los textos del juego dicen «territorios».
- Zona «Islas y ciudades»: Baleares, Canarias, Ceuta y Melilla, con **+2** (antes +1 con 2 nodos). Elegido por simulación: con +1 el reparto se desvía y con +2 queda en 48,2 % para el jugador (`sim3.py`).
- Reparto inicial **9 territorios para el jugador y 10 para el robot** (19 es impar: sin empate). Con 10 para el jugador, gana el 78 %.

### Pasar plantas
- **Regla**: al final del turno, después de atacar, el jugador puede pasar plantas de un territorio suyo con 2 o más a otro territorio suyo **pegado a él** (los enlaces marítimos cuentan). **Un traslado por turno**, y al hacerlo se acaba el turno. Son 1, la mitad o todas menos una.
- **Interfaz**: botón «Pasar plantas» junto a «Terminar turno». Se toca el origen, el destino y la cantidad; el panel muestra los números de los dos territorios.
- **El robot también pasa plantas** (`fortifyPick`): una vez por turno, de un territorio sin enemigos a uno vecino suyo que sí los tenga.
- Esto revierte la decisión del campo 5 («se quita: fortificar»), por orden de quien aprueba. Coste: un paso más por turno en móvil. Por medir con personas.

### Medidas (ambos «medio», cap de 6 rondas, bonus 2/2/3/2/2, 1.500 partidas por fila, `sim3.py`)
| Pasar plantas | Reparto J / R | Robot +1 | Gana jugador | Acaba antes del tope | Turnos propios |
|---|---|---|---|---|---|
| no | 9 / 10 | 1 turno | 50,1 % | 18 % | 5,9 |
| **sí** | **9 / 10** | **1 turno** | **50,0 %** | **36 %** | **5,6** |
| sí | 10 / 9 | 1 turno | 78,5 % | 44 % | 5,4 |

- Pasar plantas **no cambia el equilibrio** pero **duplica las partidas que acaban antes del tope** (se pueden concentrar tropas): 36 % frente a 18 %.
- **El mismo código en JavaScript** (`__game.headless`, 4.000 partidas): espejo 49,3 % de victorias del jugador; agresivo contra medio 54,9 %; cauto contra agresivo 30,3 %.
- **Recorrido completo por código** (60 partidas, jugador automático «medio» contra robot «medio», con traslados): 50 % de victorias, 5,7 rondas, **41 s de turnos del robot por partida** (7,2 s por turno). Con 5 o 6 turnos del jugador de unos 20 s [hipótesis]: ≈ 2,5 a 3 min.
- **Toque en móvil**: 530 de 540 toques de prueba dieron el territorio correcto (98 %).
- Límites: igual que antes (bot de una regla, mapa y adyacencias aproximadas, sin personas).

## 19. Cierre de Landbot, premio del 5 % y reinicio (26/10/2026, peticiones de quien aprueba)

Cambios sobre el campo 12 (cierre) y el 11 (recompensa):
- **Botón final**: «Ver mi premio». Abre el chat de Landbot.
- **Premio**: si el jugador gana al robot, **5 % de descuento simulado en Vergel**. Se ve en la pantalla de título (aviso «-5 %»), en el panel mientras se juega («Premio: gana al robot…»), en el aviso al ganar («¡Ganas! -5 % en Vergel») y en el final como un cupón grande con la explicación. Si pierde, el final lo dice: «Esta vez no hay descuento; gana al robot y te llevas un 5 %».
- **Chat** (simplificado después a petición de quien aprueba): no habla de la partida; ofrece directamente apoyar al pistacho español y se elige **comprar o distribuir, no las dos**. Distribuir: enlace de calendario. Comprar: enlace con el 5 % solo si ganó; si no, la tienda sin descuento. Sin formulario y sin datos personales. Detalle y trampas en `landbot/README.md`.
- **Reinicio**: botón «Reiniciar» en la barra. A mitad de partida pide confirmar con un segundo toque («¿Seguro?», 3 s); con la partida terminada o sin empezar, reinicia a la primera. Vuelve al nivel medio y cierra el chat.
- **Sin canje real**: el código `VERGEL5` no existe en ninguna tienda y el enlace de reserva es de ejemplo. Todo lo que ve el jugador dice que el descuento es de demostración.

Ajuste posterior (26/10/2026): el chat no recapitula la partida y no ofrece «las dos cosas». Saludo directo con tres botones (comprar, distribuir, nada). Al juego le basta mandar si ganó (`gano`) para ofrecer el enlace con el 5 %.

Ajuste posterior (26/10/2026, Comentario: «siempre juegas con el pistacho español, no tiene sentido dejarles usar uno u otro»): **se quita la elección de equipo**. El jugador es siempre el pistacho español (verde, círculo) y el robot el californiano (burdeos, rombo). Desaparecen del título los dos botones de equipo.

## 20. Robot más fácil por defecto (26/10/2026)
Comentario: el robot es muy difícil. Se mide con `__game.headless` (2500 partidas por celda). Un jugador de nivel medio gana el 49 % contra el robot Medio y el 62 % contra el Cauto. La primera partida pasa de Medio a **Cauto**; tras ganar sube un nivel como antes. No probado con personas.
