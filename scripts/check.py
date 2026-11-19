"""Comprobaciones rápidas antes de enseñar o publicar un juego: python3 scripts/check.py <carpeta del juego>

- Sintaxis de game.js (node --check).
- Rayas largas (—) en textos: la marca y quien aprueba no las usan.
- setTimeout en game.js: con el motor se usa GK.after, que se congela con la pestaña oculta.
- Tamaño del HTML montado (aviso por encima de 2 MB: se carga por QR).
- Fuentes externas en el HTML montado.
- DISENO.md aprobado.
"""
import pathlib, re, subprocess, sys

d = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else sys.exit(__doc__)).resolve()
fails, warns = [], []
game = d / "game.js"
r = subprocess.run(["node", "--check", str(game)], capture_output=True, text=True)
if r.returncode:
    fails.append("game.js no compila:\n" + r.stderr.strip())
src = game.read_text(encoding="utf-8")
for f in [game, d / "shell.html"]:
    for i, line in enumerate(f.read_text(encoding="utf-8").splitlines(), 1):
        if "—" in line:
            warns.append(f"raya larga en {f.name}:{i}")
if "GK." in src and re.search(r"\bsetTimeout\(", src):
    warns.append("game.js usa setTimeout: con el motor, GK.after (se para con la pestaña oculta)")
dist = d / "dist" / "index.html"
if not dist.exists():
    fails.append("falta dist/index.html: python3 scripts/build.py " + str(d))
else:
    html = dist.read_text(encoding="utf-8")
    kb = len(html.encode()) // 1024
    (warns if kb > 2048 else []).append(f"dist/index.html pesa {kb} KB")
    if "fonts.googleapis.com" in html:
        warns.append("las fuentes vienen de Google Fonts: falta fonts.css (scripts/fonts.py)")
diseno = d / "DISENO.md"
if diseno.exists() and "Aprobado: sí" not in diseno.read_text(encoding="utf-8"):
    warns.append("DISENO.md sin aprobar")
for w in warns:
    print("aviso:", w)
for f in fails:
    print("FALLO:", f)
print("OK" if not fails else f"{len(fails)} fallos")
sys.exit(1 if fails else 0)
