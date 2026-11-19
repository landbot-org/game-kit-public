"""Celdas del mapa a partir de las semillas ajustadas (mapa_semillas.json), sin repetir la búsqueda de mapa_opt.py."""
import json, pathlib
import mapa as M
S=json.loads((pathlib.Path(__file__).parent/'mapa_semillas.json').read_text())['seeds']
seeds=[(tuple(a),b) for a,b in S]
cells=[]
for i,(si,wi) in enumerate(seeds):
    poly=M.outline
    for j,(sj,wj) in enumerate(seeds):
        if i==j: continue
        a=2*(sj[0]-si[0]); b=2*(sj[1]-si[1]); c=(sj[0]**2+sj[1]**2-wj)-(si[0]**2+si[1]**2-wi)
        poly=M.clip(poly,a,b,c)
    cells.append(poly)
got=set()
for i in range(len(cells)):
    for j in range(i+1,len(cells)):
        if M.shared(cells[i],cells[j])>0.15: got.add(tuple(sorted((M.codes[i],M.codes[j]))))
assert got==M.exp, (sorted(M.exp-got), sorted(got-M.exp))
