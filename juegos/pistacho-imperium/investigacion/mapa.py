"""Mapa esquemático de España para Pistacho Imperium: 15 comunidades peninsulares como celdas de un diagrama de
Voronoi con pesos recortado por un contorno simplificado, más Baleares y Canarias como piezas aparte.
El contorno y las semillas son coordenadas aproximadas a ojo (conocimiento general, NO una fuente cartográfica):
el mapa es esquemático y así se avisa en el juego. Las adyacencias de juego son las fronteras terrestres reales
(más enlaces marítimos para las islas, como Kamchatka en Risk). Salida: mapa.json."""
import json, math
OUT=[(-9.3,43.0),(-8.2,43.7),(-7.0,43.6),(-5.8,43.6),(-4.0,43.45),(-2.9,43.4),(-1.8,43.35),(-1.3,43.0),(-0.2,42.8),(0.7,42.8),(1.45,42.6),(2.0,42.45),(3.2,42.3),
(3.1,41.9),(2.5,41.5),(1.3,41.1),(0.8,40.7),(0.1,40.1),(-0.3,39.4),(0.2,38.7),(-0.5,38.3),(-0.9,37.6),(-1.8,36.9),(-2.5,36.7),(-3.5,36.75),(-4.4,36.7),(-5.3,36.2),(-5.6,36.0),(-6.3,36.5),(-6.9,37.2),
(-7.4,37.2),(-7.5,38.0),(-7.0,38.3),(-7.2,38.8),(-6.9,39.2),(-7.3,39.7),(-6.9,40.0),(-6.8,41.0),(-6.2,41.6),(-6.6,41.95),(-7.2,41.95),(-8.1,41.8),(-8.7,42.0),(-8.9,42.6)]
# nombre, código, lon, lat, peso (los pesos agrandan o encogen la celda), zona
REG=[('Galicia','GAL',-8.0,42.7,0.0,0),('Asturias','AST',-5.9,43.25,-1.2,0),('Cantabria','CTB',-4.1,43.05,-1.5,0),('País Vasco','PV',-2.6,43.0,-1.6,0),
('Navarra','NAV',-1.6,42.7,-1.1,1),('La Rioja','RIO',-2.4,42.25,-2.0,1),('Aragón','ARA',-0.8,41.6,0.4,1),('Cataluña','CAT',1.6,41.8,-0.2,1),
('Castilla y León','CYL',-4.8,41.6,1.0,2),('Madrid','MAD',-3.7,40.4,-2.2,2),('Castilla-La Mancha','CLM',-2.9,39.2,1.0,2),('Extremadura','EXT',-6.2,39.2,0.0,2),
('Andalucía','AND',-4.6,37.5,0.5,3),('Murcia','MUR',-1.5,37.9,-1.4,3),('Comunidad Valenciana','VAL',-0.6,39.3,-1.0,3)]
ISL=[('Baleares','BAL',[(1.2,39.9),(3.5,39.95),(4.4,39.7),(3.2,38.9),(1.4,38.8)],4),('Canarias','CNR',[(-9.4,35.3),(-8.2,35.15),(-6.4,35.4),(-6.5,35.9),(-8.6,36.0)],4),
('Ceuta','CEU',[(-5.9,35.15),(-5.0,35.15),(-5.0,35.7),(-5.9,35.7)],4),('Melilla','MEL',[(-3.6,35.15),(-2.7,35.15),(-2.7,35.7),(-3.6,35.7)],4)]
ZONES=['Norte','Ebro','Centro','Sur y Levante','Islas y ciudades']; BONUS=[2,2,3,2,2]
EXPECT={('GAL','AST'),('GAL','CYL'),('AST','CYL'),('AST','CTB'),('CTB','CYL'),('CTB','PV'),('PV','CYL'),('PV','RIO'),('PV','NAV'),('NAV','RIO'),('NAV','ARA'),('RIO','ARA'),('RIO','CYL'),
('ARA','CYL'),('ARA','CLM'),('ARA','VAL'),('ARA','CAT'),('CAT','VAL'),('CYL','CLM'),('CYL','MAD'),('CYL','EXT'),('MAD','CLM'),('CLM','EXT'),('CLM','AND'),('CLM','MUR'),('CLM','VAL'),('EXT','AND'),('AND','MUR'),('MUR','VAL'),
('BAL','CAT'),('BAL','VAL'),('CNR','AND'),('CEU','AND'),('MEL','AND')}
def clip(poly,a,b,c):  # conserva a*x+b*y<=c
    out=[]; n=len(poly)
    for k in range(n):
        p,q=poly[k],poly[(k+1)%n]; fp=a*p[0]+b*p[1]-c; fq=a*q[0]+b*q[1]-c
        if fp<=0: out.append(p)
        if (fp<0 and fq>0) or (fp>0 and fq<0):
            t=fp/(fp-fq); out.append((p[0]+t*(q[0]-p[0]),p[1]+t*(q[1]-p[1])))
    return out
K=math.cos(math.radians(40))
def proj(p): return (p[0]*K,p[1])
def area(poly): return abs(sum(poly[i][0]*poly[(i+1)%len(poly)][1]-poly[(i+1)%len(poly)][0]*poly[i][1] for i in range(len(poly))))/2
outline=[proj(p) for p in OUT]; seeds=[(proj((r[2],r[3])),r[4]) for r in REG]
cells=[]
for i,(si,wi) in enumerate(seeds):
    poly=outline
    for j,(sj,wj) in enumerate(seeds):
        if i==j: continue
        # potencia: |x-si|^2 - wi <= |x-sj|^2 - wj
        a=2*(sj[0]-si[0]); b=2*(sj[1]-si[1]); c=(sj[0]**2+sj[1]**2-wj*0.05)-(si[0]**2+si[1]**2-wi*0.05)
        poly=clip(poly,a,b,c)
        if not poly: break
    cells.append(poly)
def shared(p,q,eps=1e-6):
    n=0
    for i in range(len(p)):
        a,b=p[i],p[(i+1)%len(p)]
        for j in range(len(q)):
            c,d=q[j],q[(j+1)%len(q)]
            # segmentos colineales con solape
            def on(u,v,w): return abs((v[0]-u[0])*(w[1]-u[1])-(v[1]-u[1])*(w[0]-u[0]))<1e-5
            if on(a,b,c) and on(a,b,d):
                L=math.hypot(b[0]-a[0],b[1]-a[1]); 
                if L<1e-9: continue
                t=lambda w:((w[0]-a[0])*(b[0]-a[0])+(w[1]-a[1])*(b[1]-a[1]))/L/L
                lo=max(0,min(t(c),t(d))); hi=min(1,max(t(c),t(d)))
                if hi-lo>eps: n+=(hi-lo)*L
    return n
codes=[r[1] for r in REG]
got=set()
for i in range(len(cells)):
    for j in range(i+1,len(cells)):
        if shared(cells[i],cells[j])>0.05: got.add((codes[i],codes[j]))
norm=lambda s:{tuple(sorted(x)) for x in s}
exp=norm({e for e in EXPECT if e[0] in codes and e[1] in codes}); gotn=norm(got)
if __name__=='__main__':
    print('áreas:',{codes[i]:round(area(c),2) for i,c in enumerate(cells)})
    print('faltan (reales y no se tocan):',sorted(exp-gotn)); print('sobran (se tocan y no son vecinas):',sorted(gotn-exp))
