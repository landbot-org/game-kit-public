"""Equilibrio con el mapa real de España: 17 comunidades, 5 zonas con bonus, adyacencias reales (+ enlaces marítimos).
Variantes de refuerzo, bonus, reparto inicial y compensación del segundo. Mismos bots (umbral de ventaja) que sim.py."""
import random, statistics, sys, itertools
import mapa as M
random.seed(3)
CODES=M.codes+['BAL','CNR','CEU','MEL']; N=len(CODES); ix={c:i for i,c in enumerate(CODES)}
ZONE=[r[5] for r in M.REG]+[4,4,4,4]
NB=[[] for _ in range(N)]
for a,b in M.EXPECT:
    NB[ix[a]].append(ix[b]); NB[ix[b]].append(ix[a])
def roll(a,d):
    ad=sorted((random.randint(1,6) for _ in range(min(3,a))),reverse=True); dd=sorted((random.randint(1,6) for _ in range(min(2,d))),reverse=True); la=ld=0
    for x,y in zip(ad,dd):
        if x>y: ld+=1
        else: la+=1
    return la,ld
def play(thr0,thr1,fort=False,div=3,bonus=(2,2,3,2,1),extra=1,extra_turns=3,cap=8,split=(9,10),start=(1,3),M_=1,ret=False):
    own=[0]*split[0]+[1]*split[1]; random.shuffle(own); arm=[random.randint(*start) for _ in range(N)]
    thr=(thr0,thr1); p=0; rt=0; over=-1; t=0
    def zones_owned(p): 
        n=0
        for z in range(5):
            if all(own[i]==p for i in range(N) if ZONE[i]==z): n+=bonus[z]
        return n
    for t in range(1,2*cap+1):
        pool=max(3,sum(1 for o in own if o==p)//div)+zones_owned(p)+(extra if (p==1 and rt<extra_turns) else 0)
        if p==1: rt+=1
        for _ in range(pool):
            best=-1; bs=1e9
            for i in range(N):
                if own[i]!=p: continue
                en=[j for j in NB[i] if own[j]!=p]
                if not en: continue
                s=sum(arm[j] for j in en)-arm[i]
                if s<bs: bs=s; best=i
            if best<0: break
            arm[best]+=1
        for _ in range(60):
            best=None
            for i in range(N):
                if own[i]!=p or arm[i]<2: continue
                for j in NB[i]:
                    if own[j]!=p and arm[i]-1>=arm[j]+thr[p]:
                        sc=arm[i]-1-arm[j]
                        if best is None or sc>best[0]: best=(sc,i,j)
            if not best: break
            _,i,j=best
            while True:
                la,ld=roll(arm[i]-1,arm[j]); arm[i]-=la; arm[j]-=ld
                if arm[j]<=0: arm[j]=arm[i]-1; arm[i]=1; own[j]=p; break
                if arm[i]<=1: break
        if fort:
            # pasar plantas: de una comunidad sin enemigos a una vecina propia con enemigos (una vez por turno)
            bestm=None
            for i in range(N):
                if own[i]!=p or arm[i]<2 or any(own[j]!=p for j in NB[i]): continue
                for j in NB[i]:
                    if own[j]==p and any(own[k]!=p for k in NB[j]):
                        if bestm is None or arm[i]>bestm[0]: bestm=(arm[i],i,j)
            if bestm: _,i,j=bestm; arm[j]+=arm[i]-1; arm[i]=1
        if len(set(own))==1: over=own[0]; break
        p^=1
    mine=sum(1 for o in own if o==0)
    if over>=0: return over,t,True
    return (0 if mine>N/2 else 1 if mine<N/2 else -1),t,False
def run(M_=1200,**kw):
    r=[play(kw.pop('thr0',1) if False else kw.get('t0',1),kw.get('t1',1),**{k:v for k,v in kw.items() if k not in('t0','t1')}) for _ in range(M_)]
    w0=sum(1 for w,t,f in r if w==0)/M_; w1=sum(1 for w,t,f in r if w==1)/M_; fin=sum(1 for w,t,f in r if f)/M_
    return w0,w1,fin,statistics.mean(t for w,t,f in r)
if __name__=='__main__':
    print('nodos',N,'vecinas por nodo',{CODES[i]:len(NB[i]) for i in range(N)})
    cfgs=[('divisor 3, bonus 2/2/3/2/1, +1 robot x3, reparto 8 jugador / 9 robot',dict()),
          ('divisor 3, mismo, reparto 9 jugador / 8 robot',dict(split=(9,8))),
          ('divisor 2, bonus 2/2/3/2/1, +1 robot x3',dict(div=2)),
          ('divisor 2, +0 al robot',dict(div=2,extra=0)),
          ('divisor 2, bonus 3/3/4/3/1',dict(div=2,bonus=(3,3,4,3,1))),
          ('divisor 2, arranque 2 a 4',dict(div=2,start=(2,4))),
          ('divisor 2, +2 robot x3',dict(div=2,extra=2))]
    for name,kw in cfgs:
        w0,w1,fin,tt=run(**kw); print('%-70s gana J %.1f%% R %.1f%% | acaba antes de ronda 8: %.0f%% | turnos globales %.1f (propios %.1f)'%(name,100*w0,100*w1,100*fin,tt,tt/2))
