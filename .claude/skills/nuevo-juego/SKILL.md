---
name: nuevo-juego
description: Lleva un juego web corto de evento o marketing de la idea a la publicación con el kit de juegos (la raíz de este repositorio), por fases y con puertas. Úsala cuando el usuario diga «quiero hacer un juego», «nuevo juego», «un juego para el evento», «como Paella Police» o «como el quién es quién», o pida retomar un juego de juegos/.
---

# Nuevo juego

Trabaja en la raíz de este repositorio. Lee `CLAUDE.md` y `docs/00-reflexion.md` antes de empezar.

## 1. Brief (pregunta solo lo que falte, en una tanda)
Evento o canal, público, duración, marca, idioma, qué se lleva el jugador y qué la marca. Crea la carpeta con `scripts/nuevo-juego.sh <nombre>` y rellena los campos 1 a 3 de `juegos/<nombre>/DISENO.md`.

## 2. Investigación (subagentes en paralelo)
- La mecánica de referencia: reglas reales y qué la hace divertida.
- El contenido: hechos con fuente, separados de hipótesis.
- La marca: colores, fuentes, logotipo y tono, de su web.
Guarda los informes en `juegos/<nombre>/investigacion/`.

## 3. Diseño, y para
Rellena los 16 campos. Escribe y ejecuta el script de medidas previas (contenido y, si hay rival, simulación). Enséñale a quien aprueba el diseño con las decisiones abiertas como opciones concretas. **No sigas sin su aprobación.** Cuando diga que sí, no lo marques tú: dale el comando `python3 scripts/fase.py aprobar <nombre> diseno` para que lo ejecute él (un hook te impide hacerlo). Después, `python3 scripts/fase.py avanzar <nombre>`.

Si pide cambios después de aprobar: `python3 scripts/fase.py cambio <nombre> "qué y quién"` y una sección nueva al final de `DISENO.md`. Las secciones 1 a 16 ya no se tocan.

## 4. Prototipo
Cambia `CONFIG`, el contenido y la mecánica en `game.js`; los tokens de marca en `game.css`; las fuentes con `scripts/fonts.py juegos/<nombre>/fonts.css "<URL de Google Fonts>"`. Monta con `scripts/build.py` y prueba por código (`__game.step`, `render_game_to_text`) a 390 × 844 y 1280 × 800, de la guía al final.

## 5. Auditoría
Lanza el subagente `verificador-juego` con el nombre del juego: él rellena `AUDITORIA.md` con evidencia, con contexto limpio. Tú no la rellenas. Arregla sus ❌ y vuelve a lanzarlo. Pasa `design-taste-frontend` e `impeccable`. Cuando no quede ningún ❌, `python3 scripts/fase.py avanzar <nombre>`.

## 6. Prueba con personas
Prepara el guion de la prueba con 5 personas (qué medir, qué no decir) y díselo a quien aprueba. No pulas más hasta tener resultados.

## 7. Publicación
Solo con el visto bueno de quien aprueba: `scripts/deploy.sh <nombre> <alias>`. Comprueba el alias con `curl` y anota la URL en el README del juego.

Al acabar cada fase, di qué está hecho, qué no se ha verificado y cuál es la siguiente puerta (`python3 scripts/fase.py estado <nombre>` la dice).
