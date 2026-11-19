#!/usr/bin/env python3
"""Pruebas de las puertas (scripts/fase.py y scripts/hook.py) sobre una copia del kit en una carpeta temporal.

Recorre un juego de prueba de brief a publicación y comprueba, en cada fase, qué deja hacer el hook y qué no.
Uso: python3 tests/test_puertas.py   (no toca el repositorio; sin dependencias)
"""
import json
import os
import shutil
import subprocess
import sys
import tempfile

KIT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
fallos = []
total = 0


def comprobar(nombre, ok, detalle=''):
    global total
    total += 1
    print(('ok    ' if ok else 'FALLA ') + nombre + ('' if ok else f'\n      {detalle}'))
    if not ok:
        fallos.append(nombre)


def correr(raiz, *args):
    return subprocess.run(list(args), cwd=raiz, capture_output=True, text=True)


def hook(raiz, herramienta, entrada):
    datos = json.dumps({'tool_name': herramienta, 'tool_input': entrada})
    r = subprocess.run(['python3', os.path.join(raiz, 'scripts', 'hook.py'), 'pre'], input=datos, cwd=raiz,
                       capture_output=True, text=True, env={**os.environ, 'CLAUDE_PROJECT_DIR': raiz})
    return r.returncode, r.stderr.strip()


def bloquea(raiz, nombre, herramienta, entrada):
    codigo, msg = hook(raiz, herramienta, entrada)
    comprobar(f'bloquea: {nombre}', codigo == 2, f'exit {codigo} {msg}')


def deja(raiz, nombre, herramienta, entrada):
    codigo, msg = hook(raiz, herramienta, entrada)
    comprobar(f'deja: {nombre}', codigo == 0, f'exit {codigo} {msg}')


def fase(raiz, *args):
    return correr(raiz, 'python3', 'scripts/fase.py', *args)


def leer(p):
    with open(p, encoding='utf8') as f:
        return f.read()


def escribir(p, t):
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, 'w', encoding='utf8') as f:
        f.write(t)


def main():
    raiz = tempfile.mkdtemp(prefix='kit-puertas-')
    try:
        for d in ('scripts', 'templates', 'plantilla', 'engine'):
            shutil.copytree(os.path.join(KIT, d), os.path.join(raiz, d), ignore=shutil.ignore_patterns('dist', '__pycache__'))
        shutil.copy(os.path.join(KIT, 'VERSION'), raiz)
        os.makedirs(os.path.join(raiz, 'juegos', 'viejo'))
        escribir(os.path.join(raiz, 'juegos', 'viejo', 'game.js'), '// juego anterior a la 0.3\n')

        J = os.path.join(raiz, 'juegos', 'prueba')
        r = correr(raiz, 'bash', 'scripts/nuevo-juego.sh', 'prueba')
        comprobar('nuevo-juego.sh crea juego.json en fase brief', r.returncode == 0 and
                  json.load(open(os.path.join(J, 'juego.json')))['fase'] == 'brief', r.stdout + r.stderr)
        diseno = os.path.join(J, 'DISENO.md')
        estado = [l for l in leer(diseno).splitlines() if l.startswith('Estado:')][0]

        # Antes de aprobar el diseño
        bloquea(raiz, 'Write de game.js sin diseño aprobado', 'Write', {'file_path': 'juegos/prueba/game.js', 'content': 'x'})
        bloquea(raiz, 'Edit de game.css sin diseño aprobado (ruta absoluta)', 'Edit',
                {'file_path': os.path.join(J, 'game.css'), 'old_string': 'a', 'new_string': 'b'})
        bloquea(raiz, 'sed -i sobre shell.html sin diseño aprobado', 'Bash', {'command': "sed -i '' 's/a/b/' juegos/prueba/shell.html"})
        deja(raiz, 'maqueta en juegos/prueba/maqueta/', 'Write', {'file_path': 'juegos/prueba/maqueta/index.html', 'content': 'x'})
        deja(raiz, 'leer game.js con cat', 'Bash', {'command': 'cat juegos/prueba/game.js'})
        bloquea(raiz, 'el agente se marca el diseño como aprobado', 'Edit',
                {'file_path': diseno, 'old_string': estado, 'new_string': 'Estado: aprobado · Aprobado: sí'})
        deja(raiz, 'editar la sección 5 antes de aprobar', 'Edit',
             {'file_path': diseno, 'old_string': '- El verbo:', 'new_string': '- El verbo: plantar'})
        # El hook solo deja pasar la edición: la aplicamos como haría la herramienta.
        escribir(diseno, leer(diseno).replace('- El verbo:', '- El verbo: plantar', 1))
        bloquea(raiz, 'fase.py aprobar desde un agente', 'Bash', {'command': 'python3 scripts/fase.py aprobar prueba diseno'})
        bloquea(raiz, 'fase.py reabrir desde un agente', 'Bash', {'command': 'python3 "scripts/fase.py" reabrir prueba'})
        bloquea(raiz, 'Edit de juego.json', 'Edit', {'file_path': 'juegos/prueba/juego.json', 'old_string': 'brief', 'new_string': 'prototipo'})
        bloquea(raiz, 'escribir juego.json desde la terminal', 'Bash', {'command': 'echo "{}" > juegos/prueba/juego.json'})
        bloquea(raiz, 'deploy.sh sin aprobar publicar', 'Bash', {'command': 'scripts/deploy.sh prueba prueba-alias'})
        deja(raiz, 'juego sin juego.json (anterior a la 0.3)', 'Write', {'file_path': 'juegos/viejo/game.js', 'content': 'x'})
        deja(raiz, 'deploy.sh de un juego sin juego.json', 'Bash', {'command': 'scripts/deploy.sh viejo viejo'})
        deja(raiz, 'archivos fuera de juegos/', 'Write', {'file_path': 'docs/nota.md', 'content': 'x'})

        # brief → investigación → diseño
        r = fase(raiz, 'avanzar', 'prueba')
        comprobar('brief sin rellenar no avanza', r.returncode == 1 and 'sección 1' in r.stdout, r.stdout)
        md = leer(diseno)
        for n, t in ((1, 'Planta pistachos.'), (2, '- Dónde: QR'), (3, '- Métrica: % que acaba')):
            md = md.replace(f'## {n}.', f'## {n}.', 1)
            cab = md.index(f'## {n}.')
            fin = md.index('\n## ', cab + 1)
            md = md[:md.index('\n', cab) + 1] + t + '\n' + md[fin:]
        escribir(diseno, md)
        r = fase(raiz, 'avanzar', 'prueba')
        comprobar('brief relleno avanza a investigación', r.returncode == 0, r.stdout + r.stderr)
        r = fase(raiz, 'avanzar', 'prueba')
        comprobar('investigación vacía no avanza', r.returncode == 1, r.stdout)
        escribir(os.path.join(J, 'investigacion', '01-mecanica.md'), '# Risk\n')
        r = fase(raiz, 'avanzar', 'prueba')
        comprobar('investigación con informe avanza a diseño', r.returncode == 0, r.stdout)
        r = fase(raiz, 'avanzar', 'prueba')
        comprobar('diseño sin aprobar no avanza', r.returncode == 1 and 'aprobación' in r.stdout, r.stdout)
        r = fase(raiz, 'aprobar', 'prueba', 'publicar')
        comprobar('no se aprueba publicar en la fase de diseño', r.returncode != 0, r.stdout + r.stderr)

        # quien aprueba da el visto bueno (en su terminal; aquí, el script directamente)
        r = fase(raiz, 'aprobar', 'prueba', 'diseno')
        comprobar('aprobar diseño escribe la línea Estado', r.returncode == 0 and 'Aprobado: sí' in leer(diseno), r.stdout + r.stderr)
        r = fase(raiz, 'avanzar', 'prueba')
        comprobar('con diseño aprobado avanza a prototipo', r.returncode == 0, r.stdout)

        # Tras aprobar
        deja(raiz, 'Write de game.js con el diseño aprobado', 'Write', {'file_path': 'juegos/prueba/game.js', 'content': 'x'})
        bloquea(raiz, 'cambiar la sección 5 de un diseño aprobado', 'Edit',
                {'file_path': diseno, 'old_string': '- El verbo: plantar', 'new_string': '- El verbo: conquistar'})
        bloquea(raiz, 'reescribir el DISENO.md entero con Write', 'Write', {'file_path': diseno, 'content': '# Diseño\n'})
        deja(raiz, 'añadir la sección 17 de cambio tras aprobar', 'Write',
             {'file_path': diseno, 'content': leer(diseno) + '\n## 17. Cambio tras aprobar: mapa de España\nPedido por quien aprueba.\n'})
        r = fase(raiz, 'cambio', 'prueba', 'mapa de España, pedido por quien aprueba')
        comprobar('cambio tras aprobar se cuenta', r.returncode == 0 and len(json.load(open(os.path.join(J, 'juego.json')))['cambios_tras_aprobar']) == 1, r.stdout + r.stderr)

        # prototipo → auditoría (build y check de verdad)
        r = fase(raiz, 'avanzar', 'prueba')
        comprobar('prototipo con build y check sin fallos avanza a auditoría', r.returncode == 0, r.stdout + r.stderr)
        r = fase(raiz, 'avanzar', 'prueba')
        comprobar('auditoría sin rellenar no avanza', r.returncode == 1 and 'verificador-juego' in r.stdout, r.stdout + r.stderr)
        audit = os.path.join(J, 'AUDITORIA.md')
        a = leer(audit).replace('Auditado por: <verificador-juego (contexto limpio)>', 'Auditado por: verificador-juego (contexto limpio)')
        a = a.replace('| | |\n', '| ✅ | medido |\n')
        escribir(audit, a.replace('| Probado en un teléfono real | ✅ | medido |', '| Probado en un teléfono real | ❌ | sin teléfono |'))
        r = fase(raiz, 'avanzar', 'prueba')
        comprobar('auditoría con un ❌ no avanza', r.returncode == 1 and 'teléfono real' in r.stdout, r.stdout)
        escribir(audit, a.replace('| Probado en un teléfono real | ✅ | medido |', '| Probado en un teléfono real | ⏳ | lo hace quien aprueba |')
                 .replace('Auditado por: verificador-juego', 'Auditado por: yo mismo'))
        r = fase(raiz, 'avanzar', 'prueba')
        comprobar('auditoría hecha por quien construyó no avanza', r.returncode == 1, r.stdout)
        escribir(audit, a.replace('| Probado en un teléfono real | ✅ | medido |', '| Probado en un teléfono real | ⏳ | lo hace quien aprueba |'))
        r = fase(raiz, 'avanzar', 'prueba')
        comprobar('auditoría del verificador con ⏳ y sin ❌ avanza a personas', r.returncode == 0, r.stdout)

        # personas → publicación → publicado
        r = fase(raiz, 'avanzar', 'prueba')
        comprobar('personas sin aprobar no avanza', r.returncode == 1, r.stdout)
        fase(raiz, 'aprobar', 'prueba', 'personas')
        r = fase(raiz, 'avanzar', 'prueba')
        comprobar('con personas aprobado avanza a publicación', r.returncode == 0, r.stdout)
        bloquea(raiz, 'deploy.sh en publicación sin aprobar publicar', 'Bash', {'command': 'bash scripts/deploy.sh prueba alias'})
        r = fase(raiz, 'puede-publicar', 'prueba')
        comprobar('puede-publicar sale con error sin aprobación', r.returncode != 0, r.stdout)
        fase(raiz, 'aprobar', 'prueba', 'publicar')
        deja(raiz, 'deploy.sh con publicar aprobado', 'Bash', {'command': 'bash scripts/deploy.sh prueba alias'})
        r = fase(raiz, 'puede-publicar', 'prueba')
        comprobar('puede-publicar sale con 0 con aprobación', r.returncode == 0, r.stdout + r.stderr)
        r = fase(raiz, 'avanzar', 'prueba')
        comprobar('publicado sin --url no avanza', r.returncode == 1 and '--url' in r.stdout, r.stdout)

        # reabrir
        fase(raiz, 'reabrir', 'prueba')
        d = json.load(open(os.path.join(J, 'juego.json')))
        comprobar('reabrir vuelve a diseño y retira la aprobación', d['fase'] == 'diseno' and 'diseno' not in d['aprobaciones'], json.dumps(d)[:200])
        deja(raiz, 'editar la sección 5 tras reabrir', 'Edit',
             {'file_path': diseno, 'old_string': '- El verbo: plantar', 'new_string': '- El verbo: conquistar'})
        bloquea(raiz, 'código otra vez bloqueado tras reabrir', 'Write', {'file_path': 'juegos/prueba/game.js', 'content': 'x'})

        r = subprocess.run(['python3', 'scripts/hook.py', 'inicio'], cwd=raiz, capture_output=True, text=True,
                           env={**os.environ, 'CLAUDE_PROJECT_DIR': raiz})
        comprobar('el hook de inicio resume la fase', 'prueba · fase diseno' in r.stdout and '1 cambios' in r.stdout, r.stdout)
    finally:
        shutil.rmtree(raiz, ignore_errors=True)
    print(f'\n{total - len(fallos)} de {total} pasan')
    sys.exit(1 if fallos else 0)


if __name__ == '__main__':
    main()
