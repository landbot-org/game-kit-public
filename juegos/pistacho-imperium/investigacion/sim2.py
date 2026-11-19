"""Variantes de mapa y compensación del segundo jugador. Reutiliza batalla y bot de sim.py."""
import random, statistics, sim
random.seed(11)
def setup(R,C,reg_of):
    sim.N=C  # solo para nb; reconstruimos a mano abajo
def mk(R,C,regfn):
    n=R*C
    nb=[]
    for i in range(n):
        r,c=divmod(i,C); o=[]
        for dr,dc in((1,0),(-1,0),(0,1),(0,-1)):
            rr,cc=r+dr,c+dc
            if 0<=rr<R and 0<=cc<C:o.append(rr*C+cc)
        nb.append(o)
    reg=[regfn(i//C,i%C) for i in range(n)]
    return n,nb,reg
def run(R,C,regfn,thr0,thr1,bonus,extra2,M=1500):
    n,nb,reg=mk(R,C,regfn); G=max(reg)+1
    def reinf(owner,p):
        m=sum(1 for o in owner if o==p); r=max(3,m//3)
        for g in range(G):
            if all(owner[i]==p for i in range(n) if reg[i]==g): r+=bonus
        return r
    def turn(owner,army,p,thr,extra):
        for _ in range(reinf(owner,p)+extra):
            fr=[i for i in range(n) if owner[i]==p and any(owner[j]!=p for j in nb[i])]
            if not fr: return
            i=min(fr,key=lambda i:(sum(army[j] for j in nb[i] if owner[j]!=p)-army[i])); army[i]+=1
        for _ in range(60):
            best=None
            for i in range(n):
                if owner[i]!=p or army[i]<2: continue
                for j in nb[i]:
                    if owner[j]!=p and army[i]-1>=army[j]+thr:
                        sc=(army[i]-1)-army[j]
                        if best is None or sc>best[0]: best=(sc,i,j)
            if not best: break
            _,i,j=best; a,d=sim.battle(army[i]-1,army[j])
            if d==0: army[j]=a; army[i]=1; owner[j]=p
            else: army[i]=1; army[j]=d
    res=[]
    for _ in range(M):
        owner=([0,1]*n)[:n]; random.shuffle(owner)
        army=[random.choice([1,2,3]) for _ in range(n)]
        thr=[thr0,thr1]; p=0; w=-1
        for t in range(1,81):
            turn(owner,army,p,thr[p],extra2 if (p==1 and t<=6) else 0)
            if len(set(owner))==1: w=owner[0]; break
            p^=1
        res.append((w,t))
    return res
if __name__=='__main__':
    cfgs={'3x3 (9 parcelas, 3 regiones por filas)':(3,3,lambda r,c:r),
          '3x4 (12 parcelas, 4 regiones por columnas)':(3,4,lambda r,c:c),
          '4x4 (16 parcelas, 4 regiones 2x2)':(4,4,lambda r,c:(r//2)*2+c//2)}
    for name,(R,C,f) in cfgs.items():
        for extra2 in (0,1,2):
            r=run(R,C,f,1,1,2,extra2)
            ts=[t for w,t in r]; w0=sum(1 for w,t in r if w==0)/len(r)
            print('%-45s plantones extra J2 (primeros 6 turnos)=%d  gana J1 %.1f%%  turnos totales medios %.1f  (propios ~%.1f)'%(name,extra2,100*w0,statistics.mean(ts),statistics.mean(ts)/2))
    print('--- bot agresivo vs cauto en 3x4, J1=bot cauto empieza')
    for a,b in ((2,0),(0,2),(1,0),(0,1)):
        r=run(3,4,cfgs['3x4 (12 parcelas, 4 regiones por columnas)'][2],a,b,2,1)
        print(' umbral J1=%d J2=%d: gana J1 %.1f%%'%(a,b,100*sum(1 for w,t in r if w==0)/len(r)))
