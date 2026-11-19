"""Exporta mapa.json (polígonos proyectados, centroides, adyacencias, zonas) y lo inserta en ../game.js entre los marcadores MAPA:INICIO y MAPA:FIN."""
import json, math, pathlib, re
import mapa as M, mapa_opt_data as D
def pip(pt,poly):
    x,y=pt; ins=False; n=len(poly)
    for i in range(n):
        a,b=poly[i],poly[(i+1)%n]
        if (a[1]>y)!=(b[1]>y) and x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0]: ins=not ins
    return ins
def centroid(poly):
    A=0;cx=0;cy=0
    for i in range(len(poly)):
        a,b=poly[i],poly[(i+1)%len(poly)]; f=a[0]*b[1]-b[0]*a[1]; A+=f; cx+=(a[0]+b[0])*f; cy+=(a[1]+b[1])*f
    A/=2; c=(cx/(6*A),cy/(6*A))
    if pip(c,poly): return c
    return (sum(p[0] for p in poly)/len(poly),sum(p[1] for p in poly)/len(poly))
cells=D.cells; polys=[c for c in cells]
for name,code,pts,z in M.ISL: polys.append([M.proj(p) for p in pts])
allp=[p for poly in polys for p in poly]
x0=min(p[0] for p in allp); x1=max(p[0] for p in allp); y0=min(p[1] for p in allp); y1=max(p[1] for p in allp)
f=6.0/(x1-x0); cx=(x0+x1)/2; cy=(y0+y1)/2
tr=lambda p:[round((p[0]-cx)*f,3),round((p[1]-cy)*f,3)]
names=[r[0] for r in M.REG]+[i[0] for i in M.ISL]; codes=M.codes+[i[1] for i in M.ISL]; zone=[r[5] for r in M.REG]+[i[3] for i in M.ISL]
regions=[]
for k,poly in enumerate(polys):
    p=[tr(q) for q in poly]; c=centroid(p); regions.append({'name':names[k],'code':codes[k],'zone':zone[k],'c':[round(c[0],3),round(c[1],3)],'poly':[[round(q[0]-c[0],3),round(q[1]-c[1],3)] for q in p]})
ix={c:i for i,c in enumerate(codes)}
edges=sorted({tuple(sorted((ix[a],ix[b]))) for a,b in M.EXPECT})
sea=[[ix['BAL'],ix['CAT']],[ix['BAL'],ix['VAL']],[ix['CNR'],ix['AND']],[ix['CEU'],ix['AND']],[ix['MEL'],ix['AND']]]
data={'regions':regions,'edges':[list(e) for e in edges],'sea':sea,'zones':[{'name':n,'bonus':b} for n,b in zip(M.ZONES,M.BONUS)]}
pathlib.Path('mapa.json').write_text(json.dumps(data,ensure_ascii=False,separators=(',',':')))
g=pathlib.Path('../game.js'); s=g.read_text()
blk='/* MAPA:INICIO (generado por investigacion/mapa_export.py, no editar a mano) */\nconst MAPA = '+json.dumps(data,ensure_ascii=False,separators=(',',':'))+';\n/* MAPA:FIN */'
if 'MAPA:INICIO' in s: s=re.sub(r'/\* MAPA:INICIO.*?MAPA:FIN \*/',lambda m:blk,s,flags=re.S)
else: print('sin marcadores en game.js: solo se escribe mapa.json')
g.write_text(s); print('regiones',len(regions),'aristas',len(edges),'bytes',len(blk))
print({r['code']:round(M_ ,2) for r,M_ in zip(regions,[M.area(p) for p in polys])})
