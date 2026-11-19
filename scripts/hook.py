#!/usr/bin/env python3
"""Hooks de Claude Code que hacen cumplir las puertas de docs/01-proceso.md. Configurados en .claude/settings.json.

Una regla escrita en CLAUDE.md es un consejo; estas se cumplen. Solo actúan sobre juegos con juego.json
(los anteriores a la 0.3 no llevan seguimiento y no se tocan).

  inicio  al abrir una sesión, escribe en su contexto la fase de cada juego y su siguiente puerta
  pre     antes de cada herramienta; bloquea (exit 2) y dice qué hacer en su lugar cuando un agente intenta:
          - escribir game.js, game.css, shell.html o fonts.css de un juego sin el diseño aprobado
          - cambiar las secciones 1 a 16 o la línea «Estado:» de un DISENO.md ya aprobado
          - editar juego.json a mano
          - registrar una aprobación de quien aprueba (fase.py aprobar / reabrir)
          - publicar (deploy.sh) un juego cuya publicación quien aprueba no ha aprobado
"""
import json
import os
import re
import sys

RAIZ = os.environ.get('CLAUDE_PROJECT_DIR') or os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JUEGOS = os.path.join(RAIZ, 'juegos')
CODIGO = ('game.js', 'game.css', 'shell.html', 'fonts.css')
ANTES_DEL_CODIGO = ('brief', 'investigacion', 'diseno')
ESCRIBE = r'(>|\bsed\s+-i|\btee\b|\bcp\b|\bmv\b|writeFile|json\.dump|open\([^)]*[\'"]w|perl\s+-[a-z]*i)'


def leer_json(p):
    try:
        with open(p, encoding='utf8') as f:
            return json.load(f)
    except (OSError, ValueError):
        return None


def denegar(msg):
    sys.stderr.write('kit de juegos: ' + msg + '\n')
    sys.exit(2)


def juego_de(ruta_archivo):
    """(nombre, nombre de archivo) si la ruta está dentro de juegos/<nombre>/, si no (None, None)."""
    p = os.path.abspath(os.path.join(RAIZ, ruta_archivo))
    rel = os.path.relpath(p, JUEGOS)
    partes = rel.split(os.sep)
    if rel.startswith('..') or len(partes) < 2:
        return None, None
    return partes[0], os.sep.join(partes[1:])


def protegido(md):
    """Lo que no cambia tras aprobar: la línea «Estado:» y las secciones 1 a 16."""
    estado = re.search(r'^Estado:.*$', md, re.M)
    secs = {}
    for m in re.finditer(r'^## (\d+)\.[^\n]*\n([\s\S]*?)(?=^## |\Z)', md, re.M):
        if int(m.group(1)) <= 16:
            secs[int(m.group(1))] = m.group(0).strip()
    return (estado.group(0) if estado else None, secs)


def despues(herramienta, entrada, antes):
    if herramienta == 'Write':
        return entrada.get('content', '')
    ediciones = entrada.get('edits') if isinstance(entrada.get('edits'), list) else [entrada]
    texto = antes
    for e in ediciones:
        viejo, nuevo = e.get('old_string', ''), e.get('new_string', '')
        texto = texto.replace(viejo, nuevo) if e.get('replace_all') else texto.replace(viejo, nuevo, 1)
    return texto


def guardia_archivo(herramienta, entrada):
    archivo = entrada.get('file_path') or entrada.get('notebook_path')
    if not archivo:
        return
    juego, nombre = juego_de(archivo)
    if not juego:
        return
    if nombre == 'juego.json':
        denegar(f'juegos/{juego}/juego.json no se edita a mano. Usa scripts/fase.py (estado, avanzar, cambio); '
                'pone la hora real y comprueba las puertas.')
    estado = leer_json(os.path.join(JUEGOS, juego, 'juego.json'))
    if not estado:
        return
    fase = estado.get('fase')
    aprobado = 'diseno' in estado.get('aprobaciones', {})
    if nombre in CODIGO and fase in ANTES_DEL_CODIGO:
        denegar(f'{juego} está en la fase «{fase}» y quien aprueba no ha aprobado el diseño: no se escribe código de juego '
                f'(docs/01-proceso.md, fase 3). Enséñale DISENO.md y para. Si necesitas una maqueta para que decida, '
                f'hazla en juegos/{juego}/maqueta/.')
    if nombre != 'DISENO.md':
        return
    ruta = os.path.join(JUEGOS, juego, nombre)
    try:
        with open(ruta, encoding='utf8') as f:
            antes = f.read()
    except OSError:
        antes = ''
    p_antes, p_despues = protegido(antes), protegido(despues(herramienta, entrada, antes))
    if p_antes[0] != p_despues[0]:
        denegar('la línea «Estado:» de DISENO.md la escribe scripts/fase.py cuando quien aprueba da el visto bueno o reabre. '
                'No la cambies tú, ni siquiera si quien aprueba dice «aprobado» en el chat: pídele que ejecute '
                f'`python3 scripts/fase.py aprobar {juego} diseno`.')
    if aprobado and p_antes[1] != p_despues[1]:
        cambiadas = sorted(n for n in set(p_antes[1]) | set(p_despues[1]) if p_antes[1].get(n) != p_despues[1].get(n))
        n = len(estado.get('cambios_tras_aprobar', [])) + 1
        denegar(f'el diseño de {juego} está aprobado: las secciones 1 a 16 no se tocan (intentabas cambiar '
                f'{", ".join(map(str, cambiadas))}). Un cambio pedido después de aprobar va así: '
                f'`python3 scripts/fase.py cambio {juego} "qué y quién lo pidió"` y una sección nueva al final '
                f'(## {16 + n}. Cambio tras aprobar: …) con qué cambia, por qué y qué se ha vuelto a medir. '
                f'Si el cambio es tan grande que hay que rehacer el diseño, quien aprueba lo reabre con '
                f'`python3 scripts/fase.py reabrir {juego}`.')


def guardia_bash(entrada):
    cmd = entrada.get('command', '') or ''
    if re.search(r'fase\.py["\']?\s+(aprobar|reabrir)\b', cmd):
        denegar('aprobar y reabrir son de quien aprueba: un agente no registra una aprobación en su nombre, ni con su '
                '«sí» en el chat. Dale el comando para que lo ejecute él en su terminal.')
    if 'juego.json' in cmd and 'fase.py' not in cmd and re.search(ESCRIBE, cmd):
        denegar('juego.json no se escribe desde la terminal. Usa scripts/fase.py.')
    m = re.search(r'deploy\.sh["\']?\s+([\w.-]+)', cmd)
    if m:
        estado = leer_json(os.path.join(JUEGOS, m.group(1), 'juego.json'))
        if estado and 'publicar' not in estado.get('aprobaciones', {}):
            denegar(f'quien aprueba no ha aprobado publicar {m.group(1)}. Pídele que ejecute '
                    f'`python3 scripts/fase.py aprobar {m.group(1)} publicar`.')
    if not re.search(ESCRIBE, cmd):
        return
    for m in re.finditer(r'juegos/([\w.-]+)/(game\.js|game\.css|shell\.html|fonts\.css)', cmd):
        estado = leer_json(os.path.join(JUEGOS, m.group(1), 'juego.json'))
        if estado and estado.get('fase') in ANTES_DEL_CODIGO:
            denegar(f'{m.group(1)} no tiene el diseño aprobado: no se escribe {m.group(2)} desde la terminal ni '
                    'con el editor (docs/01-proceso.md, fase 3).')


def inicio():
    if not os.path.isdir(JUEGOS):
        return
    lineas = []
    for j in sorted(os.listdir(JUEGOS)):
        e = leer_json(os.path.join(JUEGOS, j, 'juego.json'))
        if not e:
            continue
        aprob = ', '.join(e.get('aprobaciones', {})) or 'nada'
        cambios = len(e.get('cambios_tras_aprobar', []))
        lineas.append(f'  {j} · fase {e.get("fase")} · aprobado: {aprob}'
                      + (f' · {cambios} cambios tras aprobar' if cambios else ''))
    print('[kit de juegos] Las puertas se cumplen por hook: estado con `python3 scripts/fase.py estado`; '
          'las aprobaciones las ejecuta quien aprueba.')
    print('\n'.join(lineas) if lineas else '  Ningún juego lleva seguimiento de fases todavía.')


if __name__ == '__main__':
    modo = sys.argv[1] if len(sys.argv) > 1 else ''
    if modo == 'inicio':
        inicio()
        sys.exit(0)
    try:
        datos = json.load(sys.stdin)
    except ValueError:
        sys.exit(0)
    herramienta = datos.get('tool_name', '')
    entrada = datos.get('tool_input') or {}
    if herramienta == 'Bash':
        guardia_bash(entrada)
    elif herramienta in ('Write', 'Edit', 'MultiEdit', 'NotebookEdit'):
        guardia_archivo(herramienta, entrada)
