#!/usr/bin/env python3
"""Estado de cada juego: en qué fase está, qué ha aprobado quien aprueba y qué cambió después.

Vive en juegos/<nombre>/juego.json. Nadie lo edita a mano: lo escribe este script, que pone la hora real,
guarda el historial y se niega a pasar una puerta sin lo que pide (docs/01-proceso.md).
Las aprobaciones (aprobar, reabrir) son de quien aprueba: el hook de .claude/ impide que un agente las ejecute.

Uso:
  scripts/fase.py estado [juego]                   fase, aprobaciones y siguiente puerta (todos los juegos si no se dice)
  scripts/fase.py iniciar <juego>                  lo llama scripts/nuevo-juego.sh
  scripts/fase.py avanzar <juego> [--nota T] [--url URL]
                                                   pasa a la fase siguiente si se cumple su puerta
  scripts/fase.py cambio <juego> "texto"           apunta un cambio pedido después de aprobar el diseño
  scripts/fase.py aprobar <juego> diseno|personas|publicar [--nota T]     (solo quien aprueba)
  scripts/fase.py reabrir <juego> [--nota T]       vuelve a la fase de diseño y retira su aprobación (solo quien aprueba)
  scripts/fase.py puede-publicar <juego>           sale con 0 si quien aprueba ha aprobado publicar (lo usa deploy.sh)
"""
import json
import os
import re
import subprocess
import sys
import urllib.request
from datetime import datetime

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FASES = ['brief', 'investigacion', 'diseno', 'prototipo', 'auditoria', 'personas', 'publicacion', 'publicado']
# Aprobación de quien aprueba que hace falta para salir de cada fase.
PUERTA_CARLOS = {'diseno': 'diseno', 'personas': 'personas', 'publicacion': 'publicar'}
APROBACIONES = ['diseno', 'personas', 'publicar']
# Filas de AUDITORIA.md que puede dejar abiertas (⏳) quien no es quien aprueba ni las personas de la prueba.
PENDIENTE = '⏳'


def ruta(juego, *partes):
    return os.path.join(RAIZ, 'juegos', juego, *partes)


def ahora():
    return datetime.now().strftime('%Y-%m-%d %H:%M')


def leer(juego):
    p = ruta(juego, 'juego.json')
    if not os.path.exists(p):
        sys.exit(f'{juego} no tiene juego.json: no lleva seguimiento de fases (es anterior a la 0.3 o no existe).')
    with open(p, encoding='utf8') as f:
        return json.load(f)


def guardar(juego, datos):
    with open(ruta(juego, 'juego.json'), 'w', encoding='utf8') as f:
        json.dump(datos, f, ensure_ascii=False, indent=2)
        f.write('\n')


def texto(p):
    try:
        with open(p, encoding='utf8') as f:
            return f.read()
    except FileNotFoundError:
        return ''


def secciones(md):
    """{número: contenido} de las secciones «## N. …» de un DISENO.md."""
    out = {}
    for m in re.finditer(r'^## (\d+)\.[^\n]*\n([\s\S]*?)(?=^## |\Z)', md, re.M):
        out[int(m.group(1))] = m.group(2).strip()
    return out


def commit():
    try:
        return subprocess.run(['git', 'rev-parse', '--short', 'HEAD'], cwd=RAIZ, capture_output=True, text=True).stdout.strip() or '?'
    except OSError:
        return '?'


def quien():
    try:
        nombre = subprocess.run(['git', 'config', 'user.name'], cwd=RAIZ, capture_output=True, text=True).stdout.strip()
    except OSError:
        nombre = ''
    return nombre or os.environ.get('USER', '?')


def marcar_estado(juego, linea):
    """Reescribe la línea «Estado: …» de DISENO.md, que solo cambia este script."""
    p = ruta(juego, 'DISENO.md')
    md = texto(p)
    if md:
        with open(p, 'w', encoding='utf8') as f:
            f.write(re.sub(r'^Estado:.*$', linea, md, count=1, flags=re.M))


# ---- puertas -----------------------------------------------------------------------

def puerta_brief(juego, datos, args):
    plantilla = secciones(texto(os.path.join(RAIZ, 'templates', 'DISENO.md')))
    diseno = secciones(texto(ruta(juego, 'DISENO.md')))
    vacias = [n for n in (1, 2, 3) if not diseno.get(n) or diseno.get(n) == plantilla.get(n)]
    return [f'DISENO.md: la sección {n} sigue como en la plantilla' for n in vacias]


def puerta_investigacion(juego, datos, args):
    d = ruta(juego, 'investigacion')
    hay = [f for f in os.listdir(d) if not f.startswith('.')] if os.path.isdir(d) else []
    return [] if hay else ['investigacion/ está vacía: hace falta al menos un informe con hechos con fuente separados de hipótesis']


def puerta_prototipo(juego, datos, args):
    fallos = []
    d = os.path.join('juegos', juego)
    for paso in (['python3', 'scripts/build.py', d], ['python3', 'scripts/check.py', d]):
        r = subprocess.run(paso, cwd=RAIZ, capture_output=True, text=True)
        salida = (r.stdout + r.stderr).strip()
        if r.returncode != 0 or re.search(r'^FALLO', salida, re.M):
            ultimas = '\n    '.join(salida.splitlines()[-5:])
            fallos.append(f'{" ".join(paso[1:])} falla:\n    {ultimas}')
    return fallos


def puerta_auditoria(juego, datos, args):
    md = texto(ruta(juego, 'AUDITORIA.md'))
    if not md:
        return ['falta AUDITORIA.md']
    fallos = []
    if not re.search(r'^Auditado por:\s*verificador-juego', md, re.M):
        fallos.append('AUDITORIA.md no la ha hecho el subagente verificador-juego (línea «Auditado por:»): quien construye no se audita')
    for linea in md.splitlines():
        celdas = [c.strip() for c in linea.strip().strip('|').split('|')]
        if not linea.startswith('|') or len(celdas) < 3 or celdas[0] in ('Criterio', ''):
            continue
        if celdas[1] and set(celdas[1]) <= set('-'):
            continue
        criterio, estado = celdas[0], celdas[1]
        if not estado:
            fallos.append(f'sin estado: «{criterio}»')
        elif '❌' in estado:
            fallos.append(f'❌ «{criterio}» (si depende de quien aprueba o de personas, márcalo {PENDIENTE})')
    return fallos


PUERTAS = {
    'brief': puerta_brief,
    'investigacion': puerta_investigacion,
    'prototipo': puerta_prototipo,
    'auditoria': puerta_auditoria,
}


def puerta_publicado(juego, url):
    if not url:
        return ['falta --url con la dirección publicada']
    try:
        with urllib.request.urlopen(url, timeout=15) as r:
            codigo = r.status
    except Exception as e:
        return [f'{url} no responde: {e}']
    return [] if codigo == 200 else [f'{url} devuelve {codigo}, no 200']


# ---- órdenes ------------------------------------------------------------------------

def siguiente_puerta(datos):
    fase = datos['fase']
    if fase == 'publicado':
        return 'publicado'
    falta = PUERTA_CARLOS.get(fase)
    if falta and falta not in datos.get('aprobaciones', {}):
        return f'👤 Aprueba quien decide «{falta}»: scripts/fase.py aprobar {datos["juego"]} {falta}'
    return f'scripts/fase.py avanzar {datos["juego"]}'


def estado(args):
    juegos = [args[0]] if args else sorted(
        j for j in os.listdir(os.path.join(RAIZ, 'juegos')) if os.path.exists(ruta(j, 'juego.json')))
    if not juegos:
        print('Ningún juego lleva seguimiento de fases todavía.')
    for j in juegos:
        d = leer(j)
        aprob = ', '.join(f'{k} ({v["fecha"]})' for k, v in d.get('aprobaciones', {}).items()) or 'ninguna'
        cambios = len(d.get('cambios_tras_aprobar', []))
        print(f'{j} · fase {d["fase"]} · aprobado: {aprob} · cambios tras aprobar: {cambios}')
        print(f'  siguiente: {siguiente_puerta(d)}')


def iniciar(args):
    juego = args[0]
    if os.path.exists(ruta(juego, 'juego.json')):
        sys.exit(f'{juego} ya tiene juego.json')
    guardar(juego, {'juego': juego, 'fase': 'brief', 'aprobaciones': {}, 'cambios_tras_aprobar': [],
                    'url': None, 'historial': [{'fecha': ahora(), 'a': 'brief', 'nota': 'creado'}]})
    print(f'{juego}: fase brief')


def opcion(args, nombre):
    if nombre in args:
        i = args.index(nombre)
        return args[i + 1] if i + 1 < len(args) else ''
    return None


def avanzar(args):
    juego = args[0]
    d = leer(juego)
    fase = d['fase']
    if fase == 'publicado':
        sys.exit(f'{juego} ya está publicado')
    nueva = FASES[FASES.index(fase) + 1]
    falta = PUERTA_CARLOS.get(fase)
    fallos = []
    if falta and falta not in d.get('aprobaciones', {}):
        fallos.append(f'falta la aprobación de quien aprueba: «{falta}»')
    if fase in PUERTAS:
        fallos += PUERTAS[fase](juego, d, args)
    if nueva == 'publicado':
        fallos += puerta_publicado(juego, opcion(args, '--url'))
    if fallos:
        print(f'PUERTA CERRADA: {juego} no pasa de {fase} a {nueva}')
        for f in fallos:
            print(f'  - {f}')
        sys.exit(1)
    d['fase'] = nueva
    if nueva == 'publicado':
        d['url'] = opcion(args, '--url')
    d['historial'].append({'fecha': ahora(), 'de': fase, 'a': nueva, 'nota': opcion(args, '--nota') or ''})
    guardar(juego, d)
    print(f'PUERTA ABIERTA: {juego} pasa de {fase} a {nueva}')
    print(f'  siguiente: {siguiente_puerta(d)}')


def aprobar(args):
    juego, que = args[0], args[1] if len(args) > 1 else ''
    if que not in APROBACIONES:
        sys.exit(f'Qué se aprueba: {" | ".join(APROBACIONES)}')
    d = leer(juego)
    fase_de = [f for f, a in PUERTA_CARLOS.items() if a == que][0]
    if FASES.index(d['fase']) < FASES.index(fase_de):
        sys.exit(f'{juego} está en {d["fase"]}: «{que}» se aprueba en la fase {fase_de}')
    d.setdefault('aprobaciones', {})[que] = {'por': quien(), 'fecha': ahora(), 'commit': commit(),
                                             'nota': opcion(args, '--nota') or ''}
    d['historial'].append({'fecha': ahora(), 'aprobado': que, 'por': quien()})
    guardar(juego, d)
    if que == 'diseno':
        marcar_estado(juego, f'Estado: aprobado · Aprobado: sí ({ahora()}, registrado con scripts/fase.py)')
    print(f'{juego}: «{que}» aprobado por {quien()}')
    print(f'  siguiente: {siguiente_puerta(d)}')


def reabrir(args):
    juego = args[0]
    d = leer(juego)
    previa = d.get('aprobaciones', {}).pop('diseno', None)
    d['historial'].append({'fecha': ahora(), 'de': d['fase'], 'a': 'diseno', 'reabierto': True,
                           'aprobacion_retirada': previa, 'nota': opcion(args, '--nota') or ''})
    d['fase'] = 'diseno'
    guardar(juego, d)
    marcar_estado(juego, f'Estado: reabierto ({ahora()}) · Aprobado: no')
    print(f'{juego}: vuelve a diseño; las secciones 1 a 16 de DISENO.md se pueden editar hasta que se apruebe otra vez')


def cambio(args):
    juego, que = args[0], ' '.join(args[1:]).strip()
    if not que:
        sys.exit('Falta el texto del cambio')
    d = leer(juego)
    if 'diseno' not in d.get('aprobaciones', {}):
        sys.exit(f'{juego} no tiene el diseño aprobado: cambia DISENO.md directamente')
    d.setdefault('cambios_tras_aprobar', []).append({'fecha': ahora(), 'fase': d['fase'], 'cambio': que})
    guardar(juego, d)
    n = len(d['cambios_tras_aprobar'])
    print(f'{juego}: cambio tras aprobar nº {n} apuntado. Descríbelo en una sección nueva al final de DISENO.md (## {16 + n}. …)')


def puede_publicar(args):
    juego = args[0]
    if not os.path.exists(ruta(juego, 'juego.json')):
        print(f'AVISO: {juego} no lleva seguimiento de fases; publicar sigue dependiendo del visto bueno de quien aprueba en el chat')
        return
    if 'publicar' not in leer(juego).get('aprobaciones', {}):
        sys.exit(f'{juego}: Quien aprueba no ha aprobado publicar (scripts/fase.py aprobar {juego} publicar)')


ORDENES = {'estado': estado, 'iniciar': iniciar, 'avanzar': avanzar, 'aprobar': aprobar,
           'reabrir': reabrir, 'cambio': cambio, 'puede-publicar': puede_publicar}

if __name__ == '__main__':
    if len(sys.argv) < 2 or sys.argv[1] not in ORDENES or (sys.argv[1] != 'estado' and len(sys.argv) < 3):
        sys.exit(__doc__)
    ORDENES[sys.argv[1]](sys.argv[2:])
