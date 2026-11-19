#!/bin/bash
# Publica juegos/<nombre>/dist en Vercel con un alias público <alias>.vercel.app.
# Uso: scripts/deploy.sh <nombre> <alias>
# Solo con el visto bueno de quien aprueba (docs/01-proceso.md, fase 7).
set -euo pipefail
cd "$(dirname "$0")/.."
name="${1:?Uso: scripts/deploy.sh <nombre> <alias>}"; alias="${2:?Falta el alias}"
dir="juegos/$name"
# Si el juego lleva seguimiento de fases, quien aprueba tiene que haber ejecutado `scripts/fase.py aprobar <nombre> publicar`.
python3 scripts/fase.py puede-publicar "$name"
python3 scripts/build.py "$dir"
python3 scripts/check.py "$dir"
# Vercel nombra el proyecto por la carpeta: la carpeta se llama como el alias.
# Se despliega desde una carpeta TEMPORAL FUERA del repositorio: dentro de un repo con remoto (p. ej. landbot-org/game-kit),
# la CLI adjunta los datos de git y un plan personal de Vercel deja el despliegue en «Blocked».
out="$(mktemp -d)/$alias"; mkdir -p "$out"; cp "$dir/dist/index.html" "$out/index.html"
trap 'rm -rf "$(dirname "$out")"' EXIT
printf '.env.local\n.vercel\n' > "$out/.vercelignore"
cd "$out"
# Las URLs de cada despliegue llevan protección (302): la pública es el alias.
npx vercel@latest deploy --prod --yes < /dev/null
npx vercel@latest domains add "$alias.vercel.app" "$alias" < /dev/null || true
rm -f .env.local   # vercel link deja aquí un token
echo "Comprobando https://$alias.vercel.app"
curl -s -o /dev/null -w "%{http_code}\n" "https://$alias.vercel.app"
