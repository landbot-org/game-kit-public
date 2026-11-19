# Auditoría: pistacho-imperium

Versión revisada: commit de la fase 5 sobre `db36482` (`dist/index.html`, 909 KB, servido en `localhost:4330`) · Fecha: 26/10/2026 · Verificado en: 390 × 844 y 1280 × 800 (panel del navegador de Claude, tamaño emulado, por código con `window.__game`), teléfono real **no**, personas **no**, Landbot **no** (no existe todavía).

Leyenda: ✅ cumple · 🟡 a medias · ❌ no cumple · ➖ no aplica. Cada fila lleva evidencia (medida, captura o estado de `window.__game`), no opinión. Todas las pruebas se hicieron con `GK.sound.muted = true` (petición de quien aprueba). Las capturas del panel pueden ser fotogramas viejos de WebGL: lo medido sale del estado por código.

## Cómo se ha medido
- `python3 scripts/check.py juegos/pistacho-imperium`: sin avisos ni fallos (sintaxis, rayas largas, `setTimeout`, tamaño, fuentes externas, diseño aprobado).
- Auditoría por código en 390 × 844 a lo largo de 10 estados (título, plantar, atacar sin selección, ataque listo, dados, mover sin selección, mover cantidad, turno del robot, vuelta del jugador, final): scroll del panel, botones menores de 44 px, texto más pequeño, elementos fuera de pantalla, scroll horizontal. En 1280 × 800: título, plantar, atacar y dados.
- Contrastes calculados con la fórmula WCAG a partir de los valores de marca.
- Teclado: se rellenó la lista de territorios (19 botones) y se plantó por código desde un botón.
- Partidas completas por código con el mismo flujo que el jugador (`autoTurn`) y 60 más por nivel.
- `design-taste-frontend`: pasada leyendo la skill y su comprobación final, adaptada a una interfaz de juego (la skill es para landings: hero, bento, logos y marquesinas no aplican).
- `impeccable`: **el detector no se ha ejecutado**. Su lanzador descarga un binario en la primera ejecución y no tengo permiso para descargar. He aplicado a mano `reference/audit.md` (5 dimensiones) y `reference/craft-floor.md` (comprobaciones y rechazos). Si quieres el detector, dímelo y lo ejecuto.

## Claridad y onboarding
| Criterio | Estado | Evidencia |
|---|---|---|
| Se juega sin leer reglas largas (07a 1) | 🟡 | Título con 3 reglas (unas 45 palabras) y guía de 4 pasos sobre la partida real. Comprensión sin medir con personas. |
| Pantalla de inicio con 2 o 3 zonas (07c) | ✅ | Título y gancho, 3 reglas, el aviso del premio del 5 % y «Jugar» (sin elección de equipo desde el 26/10/2026). Tarjeta de 358 × 524 px a 390 de ancho, dentro de pantalla. |
| Como mucho 3 conceptos nuevos (Hodent) | 🟡 | Hay 5: plantones, ataque con dados, zonas con bonus, pasar plantas y tope de 6 rondas. La guía enseña solo 3 (plantar, atacar, empate). Zonas y pasar plantas se explican en el panel, sin foco. |
| Guía sobre la partida real, que se puede saltar y se reinicia al acabar | ✅ | Recorrido por código: pasos 0, 1, 2, 3 y fin; al terminar, `practice: false`, fase `plantar`, ronda 1, 9 contra 10 (partida nueva). «Saltar guía» a mitad: mismo resultado y se guarda `pistacho_tut = 1`. Arreglado en esta fase el caso «Terminar turno» al final de la guía (antes arrancaba el turno del robot en la partida nueva). |
| Primera acción en 5-10 s (medido con personas) | ❌ | Sin medir. |
| Turno y objetivo visibles en un sitio fijo (07a 7) | ✅ | Barra del panel: turno, comunidades de cada bando y «ronda x/6». Fija abajo en móvil y a la izquierda en escritorio. |
| Cómo se gana, a la vista | 🟡 | En la regla 3 del título y, desde esta fase, en el texto de la fase de ataque («Gana quien tenga más territorios al acabar la ronda 6»). No está siempre visible. |
| Lo que ya no sirve se apaga y se dice por qué | ✅ | Solo se resaltan los territorios que se pueden tocar ahora (anillo claro). Si no sirve: «Necesitas 2 o más para atacar», «X no está pegado a Y», «Solo puedes pasar plantas entre los tuyos». |
| Una información por canal; nada duplicado | ✅ | Aviso = qué ha pasado; bocadillo = qué hace el robot; tarjeta = los dados; panel = qué puedes hacer. Mientras la tarjeta está abierta, el panel dice «Mira los dados.». |

## Rival
| Criterio | Estado | Evidencia |
|---|---|---|
| Dice qué va a hacer y por qué (07a 10) | ✅ | Bocadillo sobre su territorio: «Voy a por Andalucía: 4 contra 2.» y «Paso 3 de X a Y: ahí tengo enemigos.». Hecho en esta fase (antes eran frases sueltas de marca). |
| Su turno se ve en grande | ✅ | Aviso «Juega el robot» al empezar (añadido en esta fase) y rótulo «Turno del robot» en el panel. |
| Su progreso se ve | ✅ | Contador en el panel y fichas del mapa, que se actualizan cada ataque. |
| Lo que dice coincide con lo que hace (07a 12) | ✅ | La frase se construye con los mismos datos del ataque (`m.i`, `m.j`, tropas) justo antes de tirar. |
| Calibrado con simulación (% de victorias) | ✅ | `investigacion/sim3.py` y `__game.headless`: espejo 49,3 %. Jugador medio automático contra cada nivel (20 a 30 partidas, ±10 puntos): cauto 75 %, medio 50 %, agresivo 45 %. |

## Feedback y motion
| Criterio | Estado | Evidencia |
|---|---|---|
| Toda acción responde al instante | ✅ | Plantar: estado y panel actualizados en 0,2 ms de JavaScript. El tiempo de pintado no se ha medido. |
| Feedback por capas y en proporción | ✅ | Plantar: brote y «tick». Atacar: dados, golpe y sacudida pequeña. Conquistar: acorde y sacudida. Zona completa: aviso. Fin: confeti y fanfarria (o tono bajo). |
| El feedback explica, no solo acierta o falla | ✅ | Dados emparejados con «Gana el ataque», «Gana la defensa», «Empate: gana la defensa». Si pierdes: «Atacabas con 3 contra 5: la probabilidad era 20 %». El final cuenta ataques ganados con y sin ventaja. |
| Cada animación comunica un cambio de estado | ✅ | Salto de la comunidad = cambió su número; elevación = seleccionada o atacada; sacudida = hubo tirada; confeti = ganaste. Sin animaciones decorativas. |
| Un solo golpe de sonido por tanda | ✅ | Medido: 1 «clac» por ataque «hasta el final» (antes 2). Arreglado en esta fase usando `rig.impact` una vez. |
| Sacudida en la cámara que decae | ✅ | `rig.shake` del motor (trauma al cuadrado, decae 2,2 por segundo). Valores 0,15 a 0,2. Decaimiento no medido visualmente. |
| Asentado de caídas en unos 450 ms (07b 5) | ➖ | No hay caídas. |
| Acierto y fallo se distinguen sin color | ✅ | Texto en cada pareja de dados, dado ganador con doble contorno y perdedor atenuado, equipos con círculo o rombo además del color. |
| Movimiento reducido respetado | 🟡 | Por código: `REDUCE` anula el salto, el movimiento de cámara, la elevación animada y el confeti, y `GK.T` acorta las esperas; hay bloque `@media (prefers-reduced-motion)` en el CSS. No emulado en el panel. |
| Sonido con botón de silencio, arranca tras el primer toque | ✅ | Botón «Sonido: sí/no» de 44 px; el audio se desbloquea al pulsar «Jugar». Auditivamente no escuchado (silenciado en pruebas). |

## Móvil y accesibilidad
| Criterio | Estado | Evidencia |
|---|---|---|
| Panel sin desplazarse a 390 × 844 | ✅ | `scrollHeight` ≤ `clientHeight` en los 10 estados. Alto del panel de 94 a 228 px (máximo 27 % de la pantalla). Sin scroll horizontal. |
| Objetivos táctiles de 44 px | 🟡 | Todos los botones del panel y de las tarjetas, 44 a 56 px (al abrirse la tarjeta miden 38 a 40 px durante 0,3 s por la animación de entrada). **Las fichas del mapa miden unos 30 px**; se compensa con selección asistida (la ficha más cercana en 20 px, la comunidad más cercana en 28 px): 530 de 540 toques de prueba acertaron (98 %). |
| Nada se sale de la pantalla (bocadillos, avisos) | ✅ | En 390 × 844, 10 estados, y en 1280 × 800, 4 estados: `outside: []` para aviso, bocadillo, tarjeta, guía, final y título. |
| Pausa y silencio al ocultar la pestaña | 🟡 | Por código: `core.js` pone `paused = document.hidden` y suspende el audio. No comprobable aquí: en el panel `requestAnimationFrame` no corre, así que el tiempo de juego no avanza ni oculto ni visible. |
| Navegable con teclado | 🟡 | 19 botones (uno por territorio) con etiqueta («Galicia: tuyo, 3 plantones, se puede tocar ahora»); plantar desde uno funcionó por código (2 a 3). Los botones del panel son `button` reales. El foco visible (contorno de 3 px de color tinta, y el territorio mostrado) está en el CSS pero **no se ha visto con foco real** (la ventana del panel no lo tiene). Orden de tabulación sin probar. |
| Texto legible (mínimo 14 px en móvil) | 🟡 | Cuerpo y botones desde 14 px; etiquetas pequeñas (columnas de dados, fuente de datos, chips de zona) a 13 px; el «®» y la etiqueta «prototipo no oficial» (solo escritorio) a 12 px. **El código de 3 letras de las fichas del mapa queda en unos 6 px efectivos a 390**; el nombre completo aparece en el panel y en la lista de teclado. |
| Un solo HTML con las fuentes dentro | ✅ | `dist/index.html` 909 KB, Jost y Montserrat en base64, `check.py` sin avisos de Google Fonts. |
| Probado en un teléfono real | ❌ | No. |

## Cierre
| Criterio | Estado | Evidencia |
|---|---|---|
| Final en un momento alto | 🟡 | Tarjeta con rango, explicación, dato con fuente y confeti si ganas. Sin medir con personas. |
| Al perder se sabe por qué | ✅ | Texto con los ataques ganados con y sin 2 de ventaja y la probabilidad de 4 contra 2 (cerca del 79 %). |
| No se piden datos antes de jugar | ✅ | No hay ningún campo en todo el juego. |
| Llamada a la acción clara | 🟡 | Botón final que abre el chat de cierre. El cierre del diseño (campo 12, conversación de Landbot sin formulario) **no está hecho**. |
| Chat de reserva si Landbot no carga | ➖ | No hay Landbot todavía. El enlace directo es lo único que hay. |

## Marca y taste
| Criterio | Estado | Evidencia |
|---|---|---|
| Tokens de la marca, un solo acento | 🟡 | Paleta propia de Vergel en `:root` (tinta, verde pistacho, violeta); acento de interfaz único: verde pistacho. Más colores, pero como datos: burdeos para el bando rival, rojo para alerta y objetivo, y 5 tonos tierra para identificar las zonas. |
| 0 rayas largas (—) en textos | ✅ | 0 en `game.js`, `game.css`, `shell.html` y el HTML montado fuera de los scripts. `check.py` sin avisos. |
| Radios coherentes | 🟡 | Botones 8 px, dados 10, paneles 12 a 16, píldoras para chips. Hay regla (cuanto más grande el contenedor, más radio) pero no está documentada en el CSS. |
| `design-taste-frontend` pasada | 🟡 | Ver abajo. |
| `impeccable` pasada | 🟡 | A mano, sin detector. Ver abajo. |
| Aviso de «prototipo no oficial» si usa marca ajena o hipótesis | 🟡 | Etiqueta junto al nombre en escritorio y nota en la pantalla de título. **En móvil la etiqueta de la barra se oculta**, así que tras cerrar el título no queda aviso. |

### Resultado de `design-taste-frontend` (adaptada a un juego)
Lectura: juego de campaña para público general, con una marca inventada, Vergel (clara, directa, agrícola); dials de partida 5 / 5 / 6 (variación, movimiento, densidad).
- **Cumple**: sin Inter, sin serif, tipografías de marca; sin morado ni neón; sin emojis; sin iconos dibujados a mano (formas del equipo hechas con canvas como marca funcional); contraste del botón principal 9,9:1; ningún botón se parte en dos líneas; CTAs con intenciones distintas («Jugar», «Jugar otra vez», «Ver mi premio»); sin cursores, sin scroll cues, sin versiones ni puntos decorativos.
- **Arreglado en esta fase**: las etiquetas pequeñas en mayúsculas encima de los títulos de la tarjeta de dados y del rango final (la skill las llama eyebrows); el aviso del robot sin explicar; el texto de 10 a 11 px.
- **Pendiente o discutible**: sin modo oscuro (la paleta de Vergel es clara; la skill pide dos modos por defecto); 5 tonos de zona más 2 equipos superan el «máximo 1 acento»; cabecera de panel en mayúsculas pequeñas (`TU TURNO: PLANTA`) que es estado, no título.
- **No aplica**: hero, bento, marquesinas, logos de clientes, imágenes de stock (el juego es una escena 3D).

### Resultado de `impeccable` aplicado a mano (`audit.md` y `craft-floor.md`)
Puntuación mía por la guía, no del detector: Accesibilidad 2/4 · Rendimiento 3/4 · Responsive 3/4 · Temas 2/4 · Integridad de implementación 3/4 = **13/20 (aceptable)**.
- **P1 arreglado**: sombras duras de 3 a 4 px con desplazamiento y borde de 2 px en paneles, tarjetas y botones (un disfraz neobrutalista que la marca no pide). Ahora, sombras suaves con tinte de la tinta y borde de 1,5 px.
- **P1 arreglado**: `border-left` de 4 px en la tarjeta del dato; ahora fondo tintado.
- **P1 arreglado**: foco del teclado con el verde pistacho sobre crema (contraste bajo): ahora tinta, 3 px.
- **P1 arreglado**: tablero sin acceso por teclado; ahora, lista de territorios.
- **P2 arreglado**: texto de 11 a 12 px (botón de sonido, chips, cabecera de la guía, columnas de dados), objetivos de 40 px en los botones pequeños de la guía, selección de texto con el color del navegador (ahora, verde de marca), materiales 3D recreados en cada repintado (ahora, en caché).
- **P2 sin arreglar**: códigos de 3 letras de las fichas (≈ 6 px efectivos); colores de equipo y mapa escritos en `game.js` y no en tokens CSS; sin modo oscuro.
- **P3 sin arreglar**: dos rampas de radios sin documentar; panel de escritorio con mucho espacio vacío mientras juega el robot.
- **Integridad**: pasa. Las reglas están en funciones puras y se comprueban contra la simulación (`headless`); el mapa sale de datos generados y verificados (32 fronteras); no hay texto de relleno.

## Prueba con personas
| Criterio | Estado | Evidencia |
|---|---|---|
| 5 personas nuevas, en voz alta, sin ayuda | ❌ | No hecha. Es la puerta siguiente. |

## Lo que falta, por orden
1. **Prueba con 5 personas** (guion en el diario cuando se quiera): segundos hasta la primera acción, si saben decir el objetivo, dónde se atascan, cuántas acaban, cuántas llegan al cierre.
2. **Teléfono real** (Safari y Chrome): audio, notch, toques sobre fichas de 30 px, foco del teclado.
3. **Cierre de Landbot** (campo 12 del diseño): conversación con el resultado, sin formulario, con enlace de reserva.
4. **Legibilidad de las fichas del mapa**: códigos de 3 letras a 6 px. Opciones: fichas más grandes, o nombre de la comunidad al tocar.
5. **Aviso «prototipo no oficial» también en móvil** tras cerrar el título.
6. **Ejecutar el detector de `impeccable`** (requiere permiso para que descargue su binario).
7. **Revisar mapa y fronteras con una fuente cartográfica** antes de publicar.
8. **Decidir** modo oscuro y si la guía debe enseñar zonas y pasar plantas (hoy son 5 conceptos).

## Cambios tras la auditoría (26/10/2026)
Pedidos por quien aprueba después de la fase 5; se midieron pero la tabla de arriba no se ha vuelto a rellenar fila por fila.
- Guía de 5 pasos con «Pasar plantas»: concepto enseñado sobre la partida real (era el hueco de «como mucho 3 conceptos»: siguen siendo 5 conceptos, ahora 4 con guía).
- Interfaz centrada y pegada al borde en móvil y escritorio, botones sin sombra (la fila «Nada se sale de la pantalla» se vuelve a cumplir: mapa y panel no se tapan a 390 × 844 ni a 1280 × 800).
- Pendiente: repetir la auditoría por estados tras estos cambios y ver el diseño en un teléfono real.

## Cierre de Landbot, premio y reinicio (26/10/2026)
- Chat de cierre en Landbot montado y probado desde el juego (`landbot/README.md`): el chat no habla de la partida: ofrece comprar o distribuir (no las dos) y recibe solo si ganó y el enlace con 5 % solo si se ganó. **Las filas «Llamada a la acción clara» y «Chat de reserva si Landbot no carga» pasan de 🟡/➖ a 🟡**: hay conversación y respaldo con enlaces directos, pero el respaldo no se ha probado sin conexión, el código del 5 % es de demostración y el enlace de reserva es provisional.
- Premio visible en título, panel, aviso y final; botón «Ver mi premio» visible sin desplazarse en el final a 390 × 844 (ganando y perdiendo).
- Chat con la paleta de Vergel (estilo verificado en la config publicada, mirado en el navegador del panel a 390 y a escritorio); rótulos en español. No se cambia el avatar del bot.
- Botón «Reiniciar»: 44 px de alto; primera pulsación pide confirmación a mitad de partida.
- Sin repetir la auditoría por estados tras estos cambios. Sin teléfono real ni personas.

- (26/10/2026) Guía: el foco ilumina el mapa en los pasos de tocar el mapa y el panel solo en los de pulsar botones; 6 pasos. Medido en 390 y 1280; sin repetir la auditoría completa.
