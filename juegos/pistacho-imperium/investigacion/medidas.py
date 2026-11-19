"""Medidas previas del campo 13: jugador modelo (umbral de ataque) contra robot, mapa 3x4, +1 plantón al segundo.
Umbral 0 = agresivo, 1 = medio, 2 = cauto, 3 = flojo (casi no ataca). 1.500 partidas por celda."""
import sim2
cfg=(3,4,lambda r,c:c)
names={0:'agresivo',1:'medio',2:'cauto',3:'flojo'}
print('Jugador (fila) contra robot (columna): % de victorias del jugador. Entre paréntesis, turnos totales medios.')
for first in (True,False):
    print('\nEmpieza el %s'%('JUGADOR (el robot recibe +1 plantón)' if first else 'ROBOT (el jugador recibe +1 plantón)'))
    print('%-10s'%''+''.join('%-16s'%('robot '+names[r]) for r in (0,1,2)))
    for pj in (0,1,2,3):
        row='%-10s'%names[pj]
        for rb in (0,1,2):
            if first: res=sim2.run(*cfg,pj,rb,2,1,M=1000); wins=sum(1 for w,t in res if w==0)
            else: res=sim2.run(*cfg,rb,pj,2,1,M=1000); wins=sum(1 for w,t in res if w==1)
            ts=sum(t for w,t in res)/len(res)
            row+='%-16s'%('%.0f%% (%.1f)'%(100*wins/len(res),ts))
        print(row)
