"""Descarga el subconjunto latino (woff2) de unas Google Fonts y genera un fonts.css con data URIs.

  python3 scripts/fonts.py [salida] [URL de css2 de Google Fonts]

Por defecto: engine/fonts.css con Space Grotesk y JetBrains Mono (marca nothiring).
Para un juego con otra marca: python3 scripts/fonts.py juegos/<nombre>/fonts.css "<URL>".
Sale de la versión original de Paella Police.
"""
import base64, pathlib, re, sys, urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
out = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "engine" / "fonts.css"
url = sys.argv[2] if len(sys.argv) > 2 else "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;600&family=Space+Grotesk:wght@400;500;700&display=swap"

get = lambda u: urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": UA})).read()
css = get(url).decode()
faces = []
for subset, block in re.findall(r"/\* ([\w-]+) \*/\s*(@font-face \{.*?\})", css, re.S):
    if subset != "latin":
        continue
    src = re.search(r"url\((https://[^)]+\.woff2)\)", block).group(1)
    faces.append(block.replace(f"url({src})", "url(data:font/woff2;base64," + base64.b64encode(get(src)).decode() + ")"))
out.write_text("\n".join(faces), encoding="utf-8")
print(len(faces), "caras,", out.stat().st_size // 1024, "KB ->", out)
