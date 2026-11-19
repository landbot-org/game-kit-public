# Trampas que ya nos costaron tiempo

No se ven leyendo el código. Ampliar esta lista cada vez que algo cueste más de 15 minutos.

## Código

1. **Un comentario `//` en medio de una línea se traga el resto.** Un parche puso `// …` antes de `if (facing<0)…; scene.add(g);` y desaparecieron los tableros. Los comentarios van en su propia línea.
2. **Ediciones con Python:** comprobar que la cadena buscada existe y aparece una sola vez (`assert s.count(a) == 1`). Un `replace('', b)` destrozó un archivo entero en Paella. Mejor usar la herramienta Edit.
3. **Contar antes de cambiar el estado.** «Descarta N» salía mal porque se calculaba después del `push`.
4. **`</script>` dentro del JS** rompe el HTML montado. `scripts/build.py` lo escapa.

## Three.js y cámara

5. **En vertical la cámara no ve el tablero** si solo se cambia el `fov`. Hay que reencuadrar con `camera.setViewOffset` (en el motor, `GK.rig`, opción `portraitDy`).
6. **La cámara no ve nada lejano**: el fondo va pintado en una pared cerca de la mesa (Nasi Lemak).
7. **Un plano grande «de adorno» tapa la mesa** (el canto lima era una lámina entera). Usar listones finos.
8. **Una carta abatida debe apoyarse en su propio escalón**: `TIER_Z = alto de la carta + margen`.

## Navegador y pruebas

9. **Las capturas del panel del navegador pueden ser fotogramas viejos de WebGL.** Comprobar el estado con JS (`window.__game.state()`), no solo con la captura.
10. **El servidor local cachea**: añadir `?v=N` a la URL tras cada build.
11. **Si alguien está usando el panel**, sus clics reinician la partida: probar en una pestaña aparte.
12. **macOS no tiene `timeout`**: no usarlo en scripts.
13. **El móvil emulado no es un móvil**: falta probar en un teléfono real (notch, Safari, audio).

## Vercel

14. **Las URLs de cada despliegue tienen protección (302).** La pública es el alias, y se pone con `vercel domains add <alias> <proyecto>`; `alias set` también da 302.
15. **`vercel link` deja un `.env.local` con un token.** Borrarlo y meterlo en `.vercelignore` antes de desplegar. `scripts/deploy.sh` lo hace.
16. **Comprobar con `curl -s <alias> | grep <texto nuevo>`** que lo publicado es lo último.

17b. **Un despliegue «Blocked» o que se queda colgado:** si la carpeta desde la que se despliega está dentro de un repositorio con remoto (por ejemplo, `landbot-org/game-kit`), la CLI adjunta los datos de git y un plan personal de Vercel bloquea el despliegue. `scripts/deploy.sh` ya despliega desde una carpeta temporal fuera del repositorio. Si ves «Blocked» en `vercel ls`, es esto, no un fallo del juego.

## Landbot (cierre)

17. El chat web v4 no dibuja `ask_picture_choice`, `ask_form` ni `ask_yes_no` con iconos: usar botones.
18. El saludo no lee `customData`: hacerlo neutro y usar variables desde el segundo mensaje.
19. Las imágenes de `send_media` van en caja 4:3.
20. Para traducir el widget, cambiar `nodeValue`, nunca `textContent` (React se cae).
21. El agente IA calcula mal: pasarle los importes ya calculados.
22. Canal recién creado: `handoff` y `channel v4` pueden tardar minutos.
23. Más trampas de Landbot (parámetros de la URL que no llegan, `richText` en mensajes con variables, rótulos en inglés) en `juegos/pistacho-imperium/landbot/README.md`.

## Proceso

24. **Construir antes de tener el diseño aprobado** costó cuatro versiones del «¿Quién es quién?».
25. **Arreglar la claridad quitando la gracia** del juego original. Se nota al momento.
26. **Dar por bueno algo porque «se ve bien» en escritorio.** Quien aprueba lo abre en el móvil.
