# Diseño del duelo: «Quién es quién» con personas y roles de IA (C con B)

Estado: propuesta para aprobar. No hay nada construido en 3D con este diseño. Las personas son ficticias. Las celdas de rol salen de la matriz del informe 06c con las ambigüedades («a veces») resueltas por la regla «caso típico de oferta», y son hipótesis a validar. Seniority y tamaño de empresa los he asignado yo para repartir el tablero.

## Qué es

Un duelo clásico entre la persona y un robot sobre el mismo tablero de 24 candidatos ficticios. Cada uno recibe una carta secreta y por turnos se hacen preguntas de sí o no sobre rasgos que se ven en las cartas. Gana quien identifica antes la carta del otro. Los roles (Product Engineer, FDE, etc.) no se dicen en la carta: se revelan al final y es lo que el juego enseña.

## Dos fases

1. **Duelo.** Enseña el vocabulario de rasgos jugando.
2. **Contrata.** El mismo tablero, ahora con filtros: el jugador activa los rasgos que necesita y las cartas que no encajan se atenúan. Quedan 1 a 3 candidatos, se revelan sus roles y qué rasgo separa a cada uno del vecino, y sale un borrador de brief. Es la parte que sirve a quien no sabe qué perfil contratar.

## Rasgos visibles en cada carta (icono más frase de criterio en pantalla)

| Rasgo | Se pregunta como | Valores |
|---|---|---|
| CODE | ¿Escribe código de producción? | sí / no |
| GENAI | ¿Lo que entrega lleva IA generativa dentro? | sí / no |
| TRAIN | ¿Entrena o ajusta modelos? | sí / no |
| EXT | ¿Trabaja para clientes o usuarios de fuera de su empresa? | sí / no |
| EMBED | ¿Trabaja dentro del cliente? | sí / no |
| VENTA | ¿Su trabajo está ligado a una venta? | sí / no |
| PIPE | ¿Se le mide por oportunidades comerciales generadas? | sí / no |
| EVAL | ¿Mide su trabajo con evaluaciones sistemáticas? | sí / no |
| HACE | ¿Qué hace sobre todo? | construye / configura / diseña / prioriza / opera |
| SEN | ¿Qué experiencia tiene? | junior / mid / senior |
| EMP | ¿En qué tipo de empresa trabaja? | startup / scale-up / gran empresa |

## Las 24 cartas (la columna Rol no se ve hasta el final)

| Persona | CODE | GENAI | TRAIN | EXT | EMBED | VENTA | PIPE | EVAL | HACE | SEN | EMP | Rol |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Lucía Ferrer | sí | no | no | sí | no | no | no | no | construye | junior | startup | Product Engineer |
| Marc Vidal Roca | sí | no | no | sí | no | no | no | no | construye | mid | gran empresa | Product Engineer |
| Irene Salvador | sí | sí | no | sí | no | no | no | sí | construye | mid | scale-up | AI Product Engineer |
| Joel Campos | sí | sí | no | sí | no | no | no | sí | construye | senior | startup | AI Product Engineer |
| Nerea Ibáñez | sí | sí | no | no | no | no | no | sí | construye | senior | gran empresa | LLM Application Engineer |
| Álvaro Pons | sí | sí | no | no | no | no | no | sí | construye | junior | scale-up | LLM Application Engineer |
| Marta Climent | sí | no | no | no | no | no | no | sí | opera | junior | startup | AI Platform Engineer |
| Hugo Beltrán | sí | no | no | no | no | no | no | sí | opera | mid | gran empresa | AI Platform Engineer |
| Paula Ortiz | sí | no | sí | no | no | no | no | sí | construye | mid | scale-up | ML Engineer |
| Sergio Llorca | sí | no | sí | no | no | no | no | sí | construye | senior | startup | ML Engineer |
| Clara Montes | sí | sí | no | sí | sí | no | no | sí | construye | senior | gran empresa | Forward Deployed Engineer |
| Daniel Roig | sí | sí | no | sí | sí | no | no | sí | construye | junior | scale-up | Forward Deployed Engineer |
| Aitana Soler | no | no | no | sí | no | sí | no | no | configura | junior | startup | Solutions Engineer |
| Raúl Cebrián | no | no | no | sí | no | sí | no | no | configura | mid | gran empresa | Solutions Engineer |
| Elena Gisbert | no | no | no | sí | no | sí | sí | no | configura | mid | scale-up | GTM Engineer no-code |
| Pablo Domingo | no | no | no | sí | no | sí | sí | no | configura | senior | startup | GTM Engineer no-code |
| Carmen Aguilar | sí | sí | no | no | no | sí | sí | no | construye | senior | gran empresa | GTM Engineer software |
| Iván Tormo | sí | sí | no | no | no | sí | sí | no | construye | junior | scale-up | GTM Engineer software |
| Sara Peris | no | sí | no | sí | no | no | no | sí | diseña | junior | startup | Conversation Designer |
| Víctor Lozano | no | sí | no | sí | no | no | no | sí | diseña | mid | gran empresa | Conversation Designer |
| Noa Benavent | no | sí | no | sí | no | no | no | sí | prioriza | mid | scale-up | AI Product Manager |
| Adrián Mas | no | sí | no | sí | no | no | no | sí | prioriza | senior | startup | AI Product Manager |
| Julia Ramos | no | no | no | no | no | no | no | no | opera | senior | gran empresa | Product Operations |
| Biel Serra | no | no | no | no | no | no | no | no | opera | junior | scale-up | Product Operations |

## Medidas (script `matriz.py` y el análisis de este documento, no opiniones)

- 24 cartas, 24 combinaciones de rasgos distintas: cualquier carta se puede identificar.
- Con la mejor pregunta en cada paso, se identifica cualquier carta en 4 o 5 preguntas (media 4,67). El mínimo teórico para 24 cartas es 5 (log2 de 24 es 4,58).
- Reparto de las preguntas de sí o no sobre 24: GENAI 12, HACE=construye 12, CODE 14, EXT 14, EVAL 14, VENTA 6, PIPE 4, TRAIN 2, EMBED 2. Seniority y empresa, 8 cada valor. Las preguntas centrales parten el tablero casi por la mitad y hay varias de apoyo para el final.
- Límite honesto: estas medidas dicen que el tablero es identificable y equilibrado, no que sea divertido. Eso solo se sabe jugándolo.

## Reglas propuestas

- Turnos alternos. En tu turno: una pregunta de la lista o una apuesta.
- Responder: el robot responde con su carta; tú respondes con la tuya (el juego rellena la respuesta para que no haya errores).
- Apuesta fallida: pierdes el turno y se abate esa carta (versión suave; la versión Hasbro estándar pierde la partida). Decisión tuya.
- Robot: elige la pregunta que mejor parte lo que le queda y, si va por detrás, arriesga más (Nica 2016). Con un fallo ocasional para que no sea perfecto.
- Ventaja del primero: es del 63 % con juego óptimo en el original. Propuesta: empieza el jugador.
- Partida esperada: entre 5 y 8 preguntas por bando. Con contador visible.

## Lo que sigue (si lo apruebas)

1. Construir el duelo en 3D con 24 cartas (6 columnas por 4 filas) y rasgos como iconos con leyenda.
2. Fase «Contrata» con filtros y brief.
3. Probar con 3 a 5 personas y medir preguntas por partida y abandonos antes de afinar.

## Calibración del robot (simulación de 1.500 partidas por caso)

Con el robot inicial (apuesta siempre que va por detrás o con 35 % a dos candidatas), un jugador óptimo ganaba el 51,6 %. Con el robot actual (60 % de preguntas no óptimas y apuesta a dos candidatas con 20 % o 50 % si va por detrás), un jugador óptimo gana el 65 %, uno cauto el 68 % y uno flojo el 67 %. Las personas reales jugarán peor que esos modelos, así que la cifra real de victorias del jugador será menor: hay que medirla.
