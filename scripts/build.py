"""Monta un juego en un solo HTML: python3 scripts/build.py <carpeta del juego>

Lee <carpeta>/shell.html y sustituye:
  <!--@@FONTS@@-->   <carpeta>/fonts.css, si no engine/fonts.css (fuentes en base64), si no Google Fonts
  /*@@CORE_CSS@@*/   engine/core.css
  /*@@GAME_CSS@@*/   <carpeta>/game.css
  /*@@THREE@@*/      engine/three.r128.js
  /*@@CORE@@*/       engine/core.js
  /*@@GAME@@*/       <carpeta>/game.js
Escribe <carpeta>/dist/index.html.
"""
import pathlib, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
ENGINE = ROOT / "engine"
GOOGLE = ('<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
          '<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;600&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet">')


def js(p):  # un </script> dentro del JS cerraría la etiqueta
    return p.read_text(encoding="utf-8").replace("</script>", "<\\/script>")


def main(game_dir):
    d = pathlib.Path(game_dir).resolve()
    shell = (d / "shell.html").read_text(encoding="utf-8")
    fonts = next((p for p in (d / "fonts.css", ENGINE / "fonts.css") if p.exists()), None)
    parts = {
        "<!--@@FONTS@@-->": f"<style>{fonts.read_text(encoding='utf-8')}</style>" if fonts else GOOGLE,
        "/*@@CORE_CSS@@*/": (ENGINE / "core.css").read_text(encoding="utf-8"),
        "/*@@GAME_CSS@@*/": (d / "game.css").read_text(encoding="utf-8") if (d / "game.css").exists() else "",
        "/*@@THREE@@*/": js(ENGINE / "three.r128.js"),
        "/*@@CORE@@*/": js(ENGINE / "core.js"),
        "/*@@GAME@@*/": js(d / "game.js"),
    }
    # GAME es obligatorio; el resto puede faltar (juegos/quien-es-quien es anterior al motor y no usa CORE).
    for k, v in parts.items():
        n = shell.count(k)
        if n > 1 or (k == "/*@@GAME@@*/" and n != 1):
            sys.exit(f"shell.html debe tener {k} una vez (tiene {n})")
        shell = shell.replace(k, v)
    out = d / "dist" / "index.html"
    out.parent.mkdir(exist_ok=True)
    out.write_text(shell, encoding="utf-8")
    print(f"{out.relative_to(ROOT)}  {len(shell.encode()) // 1024} KB  fuentes: {'dentro' if fonts else 'Google Fonts'}")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])
