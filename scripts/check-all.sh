#!/bin/bash
# Monta y comprueba la plantilla y todos los juegos de juegos/. Úsalo antes de cambiar engine/ o de subir un juego.
# Imprime una fila por juego con su huella de montaje: si cambia sin que hayas tocado ese juego, el motor lo ha cambiado.
# Uso: scripts/check-all.sh
set -uo pipefail
cd "$(dirname "$0")/.."
fail=0
printf '%-34s %-8s %-8s %s\n' juego montaje check huella
for d in plantilla juegos/*/; do
  d=${d%/}; [ -f "$d/shell.html" ] || continue
  if python3 scripts/build.py "$d" >/dev/null 2>&1; then b=ok; else b=FALLA; fail=1; fi
  out=$(python3 scripts/check.py "$d" 2>&1); if echo "$out" | grep -q '^FALLO'; then c=FALLA; fail=1; else c=ok; fi
  [ -f "$d/dist/index.html" ] && h=$(shasum -a 256 "$d/dist/index.html" | cut -c1-12) || h=-
  printf '%-34s %-8s %-8s %s\n' "$d" "$b" "$c" "$h"
done
exit $fail
