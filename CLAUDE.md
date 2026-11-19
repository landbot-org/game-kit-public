# Kit de juegos: reglas para el agente

Kit para hacer juegos web cortos de evento o marketing (1 a 3 minutos, un solo HTML, 3D con Three.js r128 y cierre de captación). Antes de nada, lee `docs/00-reflexion.md`: explica por qué existen estas reglas.

## Orden de trabajo (no saltarse puertas)

Sigue `docs/01-proceso.md`. Lo esencial:

1. **Brief → investigación → diseño.** Investiga la mecánica de referencia y el contenido con subagentes en paralelo. Rellena `DISENO.md` (16 campos) con medidas previas: un script que compruebe el contenido y, si hay rival, una simulación de partidas.
2. **Sin diseño aprobado por quien aprueba no se escribe código de juego.** Enséñale el diseño y para.
3. **Prototipo** con `scripts/nuevo-juego.sh <nombre>` sobre el motor (`docs/04-motor.md`). Móvil primero (390 × 844).
4. **Auditoría** con `AUDITORIA.md` del juego, con evidencia medida. Pasa `design-taste-frontend` e `impeccable`.
5. **Prueba con 5 personas** antes de pulir más. Si no se ha hecho, dilo en cada entrega.
6. **Publicar solo con el visto bueno de quien aprueba** (`scripts/deploy.sh`).

## Las puertas se cumplen por hook, no por confianza

Desde la 0.3, cada juego nuevo lleva `juego.json` con su fase, las aprobaciones de quien aprueba y los cambios tras aprobar. Lo escribe `scripts/fase.py`; nadie lo edita a mano. Los hooks de `.claude/settings.json` (`scripts/hook.py`) bloquean:

- escribir `game.js`, `game.css`, `shell.html` o `fonts.css` antes de que se apruebe el diseño (una maqueta para decidir va en `juegos/<nombre>/maqueta/`);
- cambiar las secciones 1 a 16 o la línea «Estado» de un `DISENO.md` aprobado (los cambios van en secciones nuevas: `scripts/fase.py cambio`);
- registrar una aprobación: `fase.py aprobar` y `fase.py reabrir` los ejecuta quien aprueba, aunque diga «sí» en el chat. Dale el comando;
- `deploy.sh` de un juego sin la aprobación «publicar».

Para pasar de fase: `python3 scripts/fase.py avanzar <juego>`. Comprueba la puerta (investigación con informe, build y check sin fallos, auditoría hecha por `verificador-juego` sin ❌, URL con 200) y se niega si falta algo. **La auditoría la hace el subagente `verificador-juego`, con contexto limpio**: quien construye no se audita.

## Reglas de diseño que no se negocian

- Una sola mecánica, y que sea el mensaje de la marca.
- Partir de un juego conocido y no quitarle la gracia: la claridad se arregla dentro de él.
- Lo que se pregunta o se juzga tiene que verse.
- Guía sobre la partida real, que se puede saltar y se reinicia al acabar. Nada de pantallas de reglas.
- Una información por canal: aviso = qué ha pasado; bocadillo = qué piensa el rival; tarjeta central = el momento importante; panel = qué puedes hacer.
- Feedback que explica el porqué. Cada animación dice un cambio de estado. Movimiento reducido respetado.
- No se piden datos antes de jugar.
- Contenido real con fuente; lo que es hipótesis se avisa dentro del juego.
- El resto, en `docs/03-principios.md`.

## Reglas de código

- Usa `GK.after` en vez de `setTimeout` (se congela con la pestaña oculta y las pruebas lo adelantan).
- Expón `window.__game` con `GK.expose({ state, ... })` y prueba por código, no solo con capturas: las capturas del panel del navegador pueden ser fotogramas viejos de WebGL.
- Comentarios en su propia línea, nunca a mitad de una línea de código.
- Monta con `python3 scripts/build.py <carpeta>` y comprueba con `python3 scripts/check.py <carpeta>`.
- Sin rayas largas (—) en textos visibles.
- Trampas conocidas en `docs/05-trampas.md`. Si algo te cuesta más de 15 minutos, añádelo ahí.

## Cómo hablar con quien aprueba

- En español, con medidas y no con opiniones.
- Cuando diga que algo no se entiende: reprodúcelo como jugador nuevo, mide y propone el arreglo. Si hace falta preguntar, una pregunta con opciones concretas.
- Di siempre qué no se ha verificado (teléfono real, personas, Landbot).
