# Proceso: de la idea al juego publicado

Siete fases con una puerta al final de cada una. **No se pasa una puerta sin lo que pide.** Las puertas marcadas con 👤 necesitan el visto bueno de quien aprueba.

Desde la 0.3 las puertas no dependen de que el agente se acuerde: `scripts/fase.py` lleva la fase de cada juego en `juego.json` y `scripts/hook.py` bloquea lo que se salta una puerta. Por qué: en Pistacho Imperium el agente escribió él mismo «Aprobado: sí» y hubo 8 cambios después de aprobar sin un sitio fijo donde apuntarlos.

| Para pasar | Qué comprueba `fase.py avanzar` | Quién |
|---|---|---|
| brief → investigación | secciones 1 a 3 de `DISENO.md` distintas de la plantilla | agente |
| investigación → diseño | al menos un informe en `investigacion/` | agente |
| diseño → prototipo | aprobación «diseno» | 👤 `fase.py aprobar <juego> diseno` |
| prototipo → auditoría | `build.py` y `check.py` sin fallos | agente |
| auditoría → personas | `AUDITORIA.md` hecha por `verificador-juego`, sin filas vacías ni ❌ (lo que depende de quien aprueba o de personas, ⏳) | agente |
| personas → publicación | aprobación «personas» | 👤 `fase.py aprobar <juego> personas` |
| publicación → publicado | aprobación «publicar» y `--url` que responde 200 | 👤 `fase.py aprobar <juego> publicar` |

Si después de aprobar hay que rehacer el diseño, quien aprueba ejecuta `fase.py reabrir <juego>`: vuelve a la fase de diseño y retira la aprobación (queda en el historial).

## 1. Brief (15 min)
- Qué juego, para quién, en qué contexto (evento con QR, web, LinkedIn), duración objetivo, marca, idioma.
- **Qué se lleva el jugador** y **qué se lleva el negocio** (contacto, recuerdo, demo de Landbot).
- Puerta: `DISENO.md` con los campos 1 a 3 rellenos.

## 2. Investigación (30 a 60 min, con subagentes en paralelo)
- La mecánica de referencia: reglas reales, qué la hace divertida, cómo la han adaptado otros (como hicimos con Guess Who).
- El contenido: datos reales y verificables (ofertas, platos, roles…). Nada inventado; lo que no se verifica se marca como hipótesis.
- La marca, si la hay: colores, fuentes, logotipo, tono (de su web).
- Puerta: informe en `investigacion/` con hechos con fuente separados de hipótesis.

## 3. Diseño 👤
- `DISENO.md` completo: los 16 campos de `templates/DISENO.md`.
- **Medidas previas sin personas**: script que compruebe el contenido (por ejemplo, que todas las cartas se distinguen) y, si hay rival, simulación de partidas para calibrarlo.
- Puerta 👤: Quien aprueba da el visto bueno al diseño. **Sin esto no se escribe código.**

## 4. Prototipo
- Copiar `plantilla/` con `scripts/nuevo-juego.sh <nombre>` y construir sobre el motor.
- Móvil primero: probar a 390 × 844 desde la primera versión.
- Puerta: se juega de principio a fin en escritorio y móvil, sin errores de consola; el gancho de prueba (`window.__game`) permite recorrer la partida por código.

## 5. Auditoría
- La hace el subagente `verificador-juego` (`.claude/agents/`), con contexto limpio: solo lee el diseño, la plantilla y los principios, mide por código y no toca el juego.
- Pasar `templates/AUDITORIA.md` (claridad, rival, feedback y motion, móvil, cierre, design-taste e impeccable).
- Puerta: ningún ❌ salvo la prueba con personas.

## 6. Prueba con personas 👤
- 5 personas nuevas, en voz alta, sin ayudarles. Medir: segundos hasta la primera acción, si saben decir el objetivo, dónde se atascan, cuántos acaban y cuántos llegan al cierre.
- Iterar y repetir con otras 5.
- Puerta 👤: Quien aprueba decide si está listo.

## 7. Publicación 👤
- `scripts/deploy.sh <juego>` (Vercel) o Cloudflare Pages corporativo si es para un cliente.
- Si usa una marca ajena: aviso de «prototipo no oficial» y confirmación de quien aprueba antes de publicar.
- Puerta: URL comprobada con `curl` (200 y contenido nuevo) y anotada en el `HANDOFF.md` del juego.

## Cómo pedir feedback a quien aprueba

Cuando diga que algo no se entiende, no preguntar en abstracto: reproducirlo como un jugador nuevo, medir (qué se ve, qué mide cada cosa) y proponer el arreglo. Si hace falta preguntar, una sola pregunta con opciones concretas.
