import itertools, json
# Atributos visibles de cada rol (hipótesis salvo donde 06c da fuente). 1 sí, 0 no.
ATTR = ['CODE','GENAI','TRAIN','EXT','EMBED','VENTA','HACE','EVAL']
HACE = ['construye','configura','diseña','prioriza','opera']
R = {
 'Product Engineer':        dict(CODE=1,GENAI=0,TRAIN=0,EXT=1,EMBED=0,VENTA=0,HACE='construye',EVAL=0),
 'AI Product Engineer':     dict(CODE=1,GENAI=1,TRAIN=0,EXT=1,EMBED=0,VENTA=0,HACE='construye',EVAL=1),
 'LLM Application Engineer':dict(CODE=1,GENAI=1,TRAIN=0,EXT=0,EMBED=0,VENTA=0,HACE='construye',EVAL=1),
 'AI Platform Engineer':    dict(CODE=1,GENAI=0,TRAIN=0,EXT=0,EMBED=0,VENTA=0,HACE='opera',EVAL=1),
 'ML Engineer':             dict(CODE=1,GENAI=0,TRAIN=1,EXT=0,EMBED=0,VENTA=0,HACE='construye',EVAL=1),
 'Forward Deployed Engineer':dict(CODE=1,GENAI=1,TRAIN=0,EXT=1,EMBED=1,VENTA=0,HACE='construye',EVAL=1),
 'Solutions Engineer':      dict(CODE=0,GENAI=0,TRAIN=0,EXT=1,EMBED=0,VENTA=1,HACE='configura',EVAL=0),
 'GTM Engineer no-code':    dict(CODE=0,GENAI=0,TRAIN=0,EXT=1,EMBED=0,VENTA=1,HACE='configura',EVAL=0),
 'GTM Engineer software':   dict(CODE=1,GENAI=1,TRAIN=0,EXT=0,EMBED=0,VENTA=1,HACE='construye',EVAL=0),
 'Conversation Designer':   dict(CODE=0,GENAI=1,TRAIN=0,EXT=1,EMBED=0,VENTA=0,HACE='diseña',EVAL=1),
 'AI Product Manager':      dict(CODE=0,GENAI=1,TRAIN=0,EXT=1,EMBED=0,VENTA=0,HACE='prioriza',EVAL=1),
 'Product Operations':      dict(CODE=0,GENAI=0,TRAIN=0,EXT=0,EMBED=0,VENTA=0,HACE='opera',EVAL=0),
}
def vec(r): return tuple(r[a] for a in ATTR)
names = list(R)
print('roles con vector idéntico:')
for a,b in itertools.combinations(names,2):
    d=[k for k in ATTR if R[a][k]!=R[b][k]]
    if len(d)<=1: print(' ',a,'|',b,'difieren en',d)
for k in ATTR:
    if k=='HACE':
        from collections import Counter; print(k,dict(Counter(R[n][k] for n in names)))
    else: print(k,sum(R[n][k] for n in names),'de 12')
