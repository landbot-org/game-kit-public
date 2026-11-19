#!/bin/bash
# Crea juegos/<nombre> con DISENO.md y AUDITORIA.md vacíos, a partir de la plantilla o de un ejemplo.
# Uso: scripts/nuevo-juego.sh <nombre-en-minusculas> [--desde <ejemplo>]
#   sin --desde: copia plantilla/ (juego mínimo con todas las fases).
#   con --desde: copia shell.html, game.js, game.css y fonts.css de juegos/<ejemplo>/ para personalizarlo
#                (lee juegos/<ejemplo>/EJEMPLO.md: dice qué perillas tocar y qué hay que cambiar sí o sí).
set -euo pipefail
cd "$(dirname "$0")/.."
name="${1:?Uso: scripts/nuevo-juego.sh <nombre> [--desde <ejemplo>]}"; shift || true
from=""; if [ "${1:-}" = "--desde" ]; then from="${2:?Falta el ejemplo tras --desde}"; fi
dest="juegos/$name"
[ -e "$dest" ] && { echo "Ya existe $dest"; exit 1; }
if [ -n "$from" ]; then
  src="juegos/$from"; [ -d "$src" ] || { echo "No existe el ejemplo $src"; exit 1; }
  [ -f "$src/shell.html" ] && [ -f "$src/game.js" ] || { echo "$src no tiene shell.html y game.js"; exit 1; }
  mkdir -p "$dest/investigacion"
  for f in shell.html game.js game.css fonts.css; do [ -f "$src/$f" ] && cp "$src/$f" "$dest/"; done
else
  mkdir -p "$dest/investigacion"
  cp plantilla/shell.html plantilla/game.js plantilla/game.css "$dest/"
fi
sed "s/<nombre del juego>/$name/" templates/DISENO.md > "$dest/DISENO.md"
sed "s/<nombre del juego>/$name/" templates/AUDITORIA.md > "$dest/AUDITORIA.md"
# Cada juego guarda su guía con su propia clave, para que no se pisen en el mismo navegador.
sed -i '' -E "s/storageKey: '[^']*'/storageKey: '${name}_tut'/" "$dest/game.js"
# La versión del kit con la que nace, para saber qué migrar si el motor cambia.
echo "kit $(cat VERSION 2>/dev/null || echo '?') · $(git rev-parse --short HEAD 2>/dev/null || echo '?')${from:+ · desde $from}" > "$dest/KIT_VERSION"
# Fase y aprobaciones en juego.json: desde aquí los hooks de .claude/ hacen cumplir las puertas.
python3 scripts/fase.py iniciar "$name" >/dev/null
echo "Creado $dest${from:+ desde $src}"
if [ -n "$from" ]; then
  echo "OJO: es una copia de $from. Cambia sí o sí: nombre y textos de marca, CONFIG (cierre, enlaces, premio), título, tokens de game.css y las fuentes."
  echo "Mira juegos/$from/EJEMPLO.md. Los ids de Landbot, enlaces y códigos de descuento de la copia NO son tuyos: sustitúyelos."
fi
echo "Siguiente: rellenar $dest/DISENO.md (fases 1 a 3 de docs/01-proceso.md). Sin diseño aprobado no se toca game.js."
echo "Fase: brief. Estado y siguiente puerta: python3 scripts/fase.py estado $name"
