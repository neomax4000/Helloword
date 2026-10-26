import json
o=json.load(open('/home/claude/asr/out_word.json'))['chunks']
W=[[c['text'].strip(),c['timestamp'][0],c['timestamp'][1]] for c in o]
def split(t,s,e,ws):
    d=(e-s)/len(ws); return [[w,round(s+i*d,3),round(s+(i+1)*d,3)] for i,w in enumerate(ws)]
R={0:['¿Pagaré,'],5:['inversión?'],42:['IPAB.'],43:['¿La'],44:['desventaja?'],69:['Cetes'],89:['del','IPAB.'],90:['¿La'],91:['desventaja?'],
   111:['Su','ventaja:'],126:['¿La'],127:['desventaja?'],134:['IPAB,'],152:['Cetes?'],26:['ventaja:']}
out=[]; i=0
while i<len(W):
    t,s,e=W[i]
    if i==11: out.append(['Actinver,',s,W[12][2]]); i+=2; continue
    if i==128: out+=split(t,s,W[131][2],['No','están','protegidos']); i+=4; continue
    if i in R: out+=split(t,s,e,R[i]) if len(R[i])>1 else [[R[i][0],s,e]]
    else: out.append([t,s,e])
    i+=1
res=[]
for k,(t,s,e) in enumerate(out):
    if e-s<0.08: e=s+0.15
    res.append({'i':k,'w':t,'s':s,'e':round(e,3)})
KEY={'¿Pagaré,','CD','inversión?','Actinver,','iguales.','pagaré.','ventaja:','tasa','fija,','IPAB.','desventaja?','vencimiento,','suben,','aprovechas.','CD.','Cetes','mes,','más.','bajan,','baja','mínimo','alto.','fondos','objetivo,','deuda','acciones','liquidez','diaria.','protegidos','IPAB,','mercado.','certeza?','Pagaré.','Cetes?','flexibilidad','diversificar?','Fondos.','Escríbeme','combinación','sígueme'}
for w in res: w['k']=w['w'] in KEY
json.dump({'total':0,'words':res},open('words_orig.json','w'),ensure_ascii=False)
print(' '.join(f"{w['i']}:{w['w']}" for w in res))
