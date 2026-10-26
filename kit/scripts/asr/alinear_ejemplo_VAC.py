import json
o=json.load(open('/home/claude/asr/out_word.json'))['chunks']
W=[[c['text'].strip(),c['timestamp'][0],c['timestamp'][1]] for c in o]
def merge(i,j,text):  # une W[i..j] en una palabra
    W[i]=[text,W[i][1],W[j][2]]; del W[i+1:j+1]
# de atrás hacia adelante para no mover índices
merge(78,79,'S&P')
merge(41,43,'Vida Ahorro')  # se separa abajo
FIX={'actinver':'Actinver','actinver,':'Actinver,','mas':'más','poliza,':'póliza,','creciente,':'Creciente,'}
out=[]
for t,s,e in W:
    if t=='Vida Ahorro':
        m=(s+e)/2; out+= [{'w':'Vida','s':s,'e':round(m,3)},{'w':'Ahorro','s':round(m,3),'e':e}]; continue
    out.append({'w':FIX.get(t,t),'s':s,'e':e})
for w in out:
    if w['e']-w['s']<0.08: w['e']=round(w['s']+0.15,3)
out[-1]['e']=65.95
KEY={'protege','crecer','ahorro.','Ana,','Roberto,','28','55','retiro.','patrimonio.','Vida','Ahorro','Creciente,','Actinver','Zurich.','protección','fondo','gubernamental','S&P','500.','faltar,','suma','asegurada','ahorrado,','ellos,','mercado','cambia.','coberturas','extra,','accidente,','invalidez','enfermedades','graves.','pocos','60','5','ISR.','Ana','Roberto?','Escríbeme','cotización','personalizada.','sígueme'}
for i,w in enumerate(out): w['i']=i; w['k']=w['w'] in KEY
json.dump({'total':0,'words':out},open('words_orig.json','w'),ensure_ascii=False)
print(' '.join(f"{w['i']}:{w['w']}" for w in out))
