# Chat de cierre en Landbot: Pistacho Imperium (marca inventada Vergel)

Este ejemplo trae el flujo del chat exportado, pero no los bots: los ids y las URLs de configuración son de la cuenta de Landbot que los creó y no se publican. Para montar los tuyos:

1. Crea un bot web por idioma a partir de `diagram.es.json` y `diagram.en.json` (flujo de botones y mensajes, sin IA ni datos personales) y pega `style.css` en Design › Custom code.
2. Publica y copia la URL de configuración (`.../index.json`) de cada uno en `CONFIG.chat.config` (ES) y `CONFIG.chat.configEn` (EN) de `game.js`. Con ambos vacíos, el final solo enseña el enlace de reserva.
3. Cambia `CONFIG.chat.book` y el enlace de los diagramas (`https://example.com/reserva`) por tu calendario.

## Flujo

Saludo («demo de Landbot con una marca inventada») → `Mi premio` (según `@gano`: código simulado `VERGEL5` o recordatorio) · `Quiero un juego así` (reserva) · `Nada, gracias`. El juego manda solo `gano` (`si` o `no`) por `customData` de `Landbot.Container`.

- **El descuento es simulado**: Vergel no existe y el código no funciona en ninguna tienda; el chat lo dice.
- Los rótulos del widget salen en inglés; en español el juego los traduce desde fuera (`CHAT_ES` en `game.js`).
- Trampas de Landbot vistas aquí: los parámetros de la URL no llegan al bot, `richText` en mensajes con variables, `customData` solo llega a partir del segundo mensaje.
