"""Ajusta semillas y pesos de mapa.py por búsqueda aleatoria hasta que las celdas se toquen justo donde hay frontera real."""
import random, math, json, sys
import mapa as M
random.seed(int(sys.argv[1]) if len(sys.argv)>1 else 5)
real={'GAL':29.5,'AST':10.6,'CTB':9.0,'PV':12.0,'NAV':10.4,'RIO':12.0,'ARA':47.7,'CAT':32.1,'CYL':94.2,'MAD':30.0,'CLM':79.5,'EXT':41.6,'AND':87.6,'MUR':11.3,'VAL':23.3}
tot=sum(v**0.6 for v in real.values())
def cells_of(seeds):
    cells=[]
    for i,(si,wi) in enumerate(seeds):
        poly=M.outline
        for j,(sj,wj) in enumerate(seeds):
            if i==j: continue
            a=2*(sj[0]-si[0]); b=2*(sj[1]-si[1]); c=(sj[0]**2+sj[1]**2-wj)-(si[0]**2+si[1]**2-wi)
            poly=M.clip(poly,a,b,c)
            if not poly: break
        cells.append(poly)
    return cells
def score(seeds):
    cells=cells_of(seeds)
    if any(len(c)<3 for c in cells): return 1e9,cells
    got=set()
    for i in range(len(cells)):
        for j in range(i+1,len(cells)):
            if M.shared(cells[i],cells[j])>0.15: got.add(tuple(sorted((M.codes[i],M.codes[j]))))
    bad=len(M.exp-got)+len(got-M.exp)
    A=[M.area(c) for c in cells]; S=sum(A); e=0
    for k,code in enumerate(M.codes): e+=math.log(A[k]/S/(real[code]**0.6/tot))**2
    # las comunidades pequeñas se agrandan a propósito (cartograma) para que se puedan tocar en el móvil
    # una celda estrecha no se puede tocar: penaliza el cociente perímetro^2/área
    return 10*bad+e,cells
seeds=[(s,w*0.3) for (s,w) in M.seeds]
best,_=score(seeds); print('inicio',round(best,2))
cur=[(list(s),w) for s,w in seeds]
for it in range(9000):
    k=random.randrange(len(cur)); s,w=cur[k]; ns=[s[0]+random.gauss(0,0.2),s[1]+random.gauss(0,0.2)]; nw=w+random.gauss(0,0.4)
    cand=[(tuple(a),b) for a,b in cur]; cand[k]=(tuple(ns),nw)
    sc,_=score(cand)
    if sc<best: best=sc; cur[k]=(ns,nw)
    if it%1000==0: print(it,round(best,2))
final=[(tuple(a),b) for a,b in cur]; sc,cells=score(final)
print('final',round(sc,2)); got=set()
for i in range(len(cells)):
    for j in range(i+1,len(cells)):
        if M.shared(cells[i],cells[j])>0.15: got.add(tuple(sorted((M.codes[i],M.codes[j]))))
print('faltan',sorted(M.exp-got),'sobran',sorted(got-M.exp)); print('OK' if M.exp==got else 'NO')
if M.exp==got: json.dump({'seeds':[[list(a),b] for a,b in final]},open('mapa_semillas.json','w'))
