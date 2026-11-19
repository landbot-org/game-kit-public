"""Simulación previa de Pistacho Imperium: mapa 4x4 (16 parcelas, 4 regiones 2x2), reglas tipo Risk.
Mide: probabilidades de batalla, duración de partida, ventaja de quien empieza y bot agresivo vs cauto."""
import random, statistics, sys
random.seed(7)
N=4
def nb(i):
    r,c=divmod(i,N); o=[]
    for dr,dc in((1,0),(-1,0),(0,1),(0,-1)):
        rr,cc=r+dr,c+dc
        if 0<=rr<N and 0<=cc<N:o.append(rr*N+cc)
    return o
NB=[nb(i) for i in range(N*N)]
REG=[(i//N//2)*2+(i%N)//2 for i in range(N*N)]
BONUS=2
def roll(a,d):
    ad=sorted((random.randint(1,6) for _ in range(min(3,a))),reverse=True)
    dd=sorted((random.randint(1,6) for _ in range(min(2,d))),reverse=True)
    la=ld=0
    for x,y in zip(ad,dd):
        if x>y: ld+=1
        else: la+=1
    return la,ld
def battle(a,d):
    # a = ejércitos que atacan (sin contar el que se queda), d = defensores
    while a>0 and d>0:
        la,ld=roll(a,d); a-=la; d-=ld
    return a,d
def pwin(a,d,n=4000):
    return sum(battle(a,d)[1]==0 for _ in range(n))/n
def reinforce(owner,p):
    mine=[i for i in range(N*N) if owner[i]==p]
    r=max(3,len(mine)//3)
    for g in range(4):
        if all(owner[i]==p for i in range(N*N) if REG[i]==g): r+=BONUS
    return r
def turn(owner,army,p,thr):
    for _ in range(reinforce(owner,p)):
        fr=[i for i in range(N*N) if owner[i]==p and any(owner[j]!=p for j in NB[i])]
        if not fr: return
        i=min(fr,key=lambda i:(sum(army[j] for j in NB[i] if owner[j]!=p)-army[i]))
        # refuerza donde más amenaza hay respecto a lo que tiene
        army[i]+=1
    again=True; guard=0
    while again and guard<60:
        again=False; guard+=1
        best=None
        for i in range(N*N):
            if owner[i]!=p or army[i]<2: continue
            for j in NB[i]:
                if owner[j]!=p and army[i]-1>=army[j]+thr:
                    sc=(army[i]-1)-army[j]
                    if best is None or sc>best[0]: best=(sc,i,j)
        if best:
            _,i,j=best
            a,d=battle(army[i]-1,army[j])
            if d==0:
                army[j]=a; army[i]=army[i]-1-(army[i]-1-a)  # tras ganar, mueve a ejércitos supervivientes
                army[i]=1+0  # deja 1
                # los a supervivientes ocupan j; el resto se pierde ya contado en a
                owner[j]=p
            else:
                army[i]=1; army[j]=d
            again=True
def game(thr0,thr1,first=0):
    owner=[0,1]*8; random.shuffle(owner)
    army=[random.choice([1,2,3]) for _ in range(N*N)]
    thr=[thr0,thr1]; p=first
    for t in range(1,81):
        turn(owner,army,p,thr[p])
        s=set(owner)
        if len(s)==1: return owner[0],t
        p^=1
    c=owner.count(0)
    return (0 if c>8 else 1 if c<8 else -1),80
if __name__=='__main__':
    print('P(ganar la batalla completa) atacante a vs defensor d (4000 tiradas)')
    for d in (1,2,3,4):
        print(' d=%d: '%d+' '.join('a=%d:%.2f'%(a,pwin(a,d)) for a in (1,2,3,4,5,6,8)))
    la=[];ld=[]
    for _ in range(100000):
        x,y=roll(3,2); la.append(x); ld.append(y)
    print('3 vs 2: pierde atacante %.3f, defensor %.3f por tirada'%(statistics.mean(la),statistics.mean(ld)))
    M=1500
    for name,(a,b) in {'mismo bot (thr1 vs thr1)':(1,1),'agresivo(0) vs cauto(2)':(0,2),'cauto(2) vs agresivo(0)':(2,0),'agresivo(0) vs medio(1)':(0,1)}.items():
        res=[game(a,b,first=0) for _ in range(M)]
        w=[r[0] for r in res]; ts=[r[1] for r in res]
        fin=[t for r,t in res if r!=-1 and t<80]
        print('%-28s gana J0 %.1f%%  gana J1 %.1f%%  sin final(80t) %.1f%%  turnos medios %.1f (mediana %d)'%(name,100*w.count(0)/M,100*w.count(1)/M,100*sum(1 for r in res if r[1]>=80)/M,statistics.mean(ts),statistics.median(ts)))
