# Cambios del kit

Versión semver en `VERSION`. Cada juego anota en `KIT_VERSION` con qué versión nació. Un cambio que rompe algo lleva una sección **Migración**.

## 0.3.0 (27/10/2026)
Las puertas de `docs/01-proceso.md` pasan de consejo a regla. Ideas tomadas de [buildline](https://github.com/julianoczkowski/buildline): las reglas que tienen que cumplirse van en hooks, quien construye no se audita, y el estado vive en un archivo que solo cambia un script.
- `scripts/fase.py`: fase, aprobaciones, cambios tras aprobar e historial de cada juego en `juegos/<nombre>/juego.json`. `avanzar` comprueba la puerta (informe de investigación, build y check, auditoría del verificador sin ❌, URL con 200) y se niega si falta algo.
- `scripts/hook.py` y `.claude/settings.json`: bloquean código de juego sin diseño aprobado, cambios en las secciones 1 a 16 o en la línea «Estado» de un diseño aprobado, ediciones a mano de `juego.json`, que un agente registre una aprobación y `deploy.sh` sin la aprobación «publicar». Al abrir una sesión, resumen la fase de cada juego.
- Subagente `verificador-juego` (`.claude/agents/`): audita con contexto limpio y rellena `AUDITORIA.md`; quien construyó ya no la rellena.
- Plantillas: `AUDITORIA.md` con «Auditado por:» y el estado ⏳ (pendiente de teléfono real, personas o quien aprueba); `DISENO.md` con el protocolo de cambios tras aprobar (secciones 17 en adelante). Backlog 6, primera mitad.
- `scripts/nuevo-juego.sh` crea `juego.json`; `scripts/deploy.sh` exige la aprobación «publicar».
- `tests/test_puertas.py`: 45 comprobaciones sobre una copia del kit (`python3 tests/test_puertas.py`).
- La skill `nuevo-juego` apuntaba a una copia vieja del kit; ahora a la raíz de este repositorio.

### Migración desde 0.2
- `pistacho-imperium` y `quien-es-quien` no tienen `juego.json`: no llevan seguimiento y los hooks no los tocan. No se les ha creado uno porque eso sería registrar aprobaciones de quien aprueba en su nombre.
- Los hooks solo se cargan en sesiones de Claude Code abiertas **dentro de** la carpeta del kit, y la primera vez hay que aceptar la confianza en la carpeta.
- Las huellas de montaje no cambian (`scripts/check-all.sh` igual antes y después).

## 0.2.0 (26/10/2026)
- `GK.coach`: el foco acepta un selector, un elemento, un rectángulo o una función; la caja de texto va donde cabe (`tipSide` para fijar el lado).
- `core.css`: panel y pantalla final abajo y centrados en móvil y escritorio; barra superior sólida; tokens del kit en `@layer kit-tokens` y tema claro con `data-theme="light"`; tokens `--focus`, `--on-red`, `--scrim`, `--scrim-soft`, `--elev*`, `--panel-max`; letra mínima de 13 a 14 px, botones pequeños de 44 px, foco de 3 px.
- `scripts/nuevo-juego.sh --desde <ejemplo>`, `scripts/check-all.sh`, `VERSION`, `KIT_VERSION` por juego.
- Plantillas `templates/EJEMPLO.md` y `templates/APRENDIZAJE.md`; `docs/07-repositorio.md`, `docs/08-handoff-subir-juegos.md` y `docs/09-backlog.md`.
- `scripts/deploy.sh` despliega desde una carpeta temporal fuera del repositorio (dentro de un repo con remoto, Vercel bloqueaba el despliegue en un plan personal).
- Pruebas con Playwright (`tests/`, `npm test`): recorridos de la plantilla y de Pistacho Imperium, auditoría por estados en móvil y escritorio, y paridad de reglas con las simulaciones.
- Pistacho Imperium: las vecinas por mar se contaban dos veces (lo vio una prueba); ahora una sola vez, como en `sim3.py`.
- Juegos: nuevo `pistacho-imperium` (ejemplo de territorios con mapa real).

### Migración desde 0.1
- **Panel:** ya no es una columna a la izquierda en escritorio. Un juego que usara `dx` negativo en `GK.rig` para dejarle sitio debe poner `dx: 0` (la plantilla ya está cambiada).
- **Tokens:** `--panel-w` desaparece. Los tokens del kit pasan a una capa: los del `:root` de un juego siguen ganando.
- **Guía:** los pasos con selector siguen igual; la caja de texto puede colocarse en otro lado (debajo si cabe, si no encima).
- `quien-es-quien` no usa el motor y no cambia (misma huella de montaje antes y después).

## 0.1 (26/10/2026)
- Primera versión: motor `GK`, plantilla, documentos y scripts, extraídos de Paella Police, Nasi Lemak Police y «¿Quién es quién en IA?».
