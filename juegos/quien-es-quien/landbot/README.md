# Chat de cierre en Landbot: asesor de perfiles

Este ejemplo no incluye el bot: los ids, la URL de compartir y el prompt completo del agente son de la cuenta de Landbot que lo creó y no se publican. Para montar el tuyo, pon la URL de compartir de tu bot en `CHAT_URL` de `game.js`.

## Flujo

Saludo que pide el resultado que quiere conseguir la persona (`@outcome`) → agente de IA que hace de 2 a 4 preguntas y recomienda un perfil (guarda `perfil_recomendado` y `resumen_necesidad`) → «Quiere reservar»: mensaje con el enlace de reserva / «No sigue»: despedida.

## Estructura del prompt del agente

1. **Regla de oro:** si la respuesta lleva botones, no repetir las opciones en el texto.
2. **Quién eres:** asistente de la marca en el juego; tono, idioma y límite de frases por mensaje.
3. **Lo que ya sabes:** el resultado que contó la persona (`@outcome`).
4. **Cómo trabajas:** de 2 a 4 preguntas, una por mensaje, elegidas para descartar perfiles; recomienda UN perfil con un formato fijo y cierra con la pregunta de reservar.
5. **Límites:** no inventar datos fuera de la base de conocimiento.

## Archivos

- `kb-perfiles.md`: base de conocimiento con los 12 perfiles, para subirla a mano en el editor del agente (la API no permite subir conocimiento).
- `style.css`: estilo del chat, que se pega en Design › Custom code.
