import json, subprocess, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
k=Kokoro("/home/claude/video/voz/kokoro-v1.0.onnx","/home/claude/video/voz/voices-v1.0.bin")
V=np.load("/home/claude/video/voz/voices-v1.0.bin")
VO={'B':V["em_alex"]*0.6+V["im_nicola"]*0.4}
SR=24000
# (hablante, pantalla con *clave*, hablado, velocidad, pausa después)
L=[
('B',"¿El *Buró de Crédito* es una *lista negra* que te cierra todas las puertas?","¿El Buró de Crédito es una lista negra que te cierra todas las puertas?",.97,.6),
('B',"*No* lo es. Y casi *nadie* sabe qué es en realidad.","No lo es. Y casi nadie sabe qué es en realidad.",1.0,.55),
('B',"Es una *empresa privada* que guarda tu *historial*: cómo *pagas* tus créditos.","Es una empresa privada que guarda tu historial: cómo pagas tus créditos.",1.0,.55),
('B',"Cada mes, bancos y otras empresas le *reportan* si pagaste *a tiempo* o con *atraso*.","Cada mes, bancos y otras empresas le reportan si pagaste a tiempo o con atraso.",.97,.55),
('B',"Ahí no hay *buenos* ni *malos*: hay un *registro*, y lo construyes *tú*.","Ahí no hay buenos ni malos: hay un registro, y lo construyes tú.",1.0,.6),
('B',"Y el Buró *no aprueba* ni *rechaza* tu crédito. Eso lo decide *cada institución*.","Y el Buró no aprueba ni rechaza tu crédito. Eso lo decide cada institución.",1.0,.6),
('B',"Y *sígueme*, porque lo que sigue es lo que *más gente* ignora.","Y sígueme, porque lo que sigue es lo que más gente ignora.",1.0,.7),
('B',"Tienes derecho a pedir tu *reporte gratis*, una vez cada *doce meses*.","Tienes derecho a pedir tu reporte gratis, una vez cada doce meses.",.97,.55),
('B',"Se pide en los sitios *oficiales*: *Buró de Crédito* y *Círculo de Crédito*.","Se pide en los sitios oficiales: Buró de Crédito y Círculo de Crédito.",1.0,.55),
('B',"*Revísalo*: a veces hay *errores*, y si lo encuentras, puedes pedir que lo *corrijan*.","Revísalo: a veces hay errores, y si lo encuentras, puedes pedir que lo corrijan.",.97,.6),
('B',"Los registros negativos *no son para siempre*: se *borran solos* con el tiempo.","Los registros negativos no son para siempre: se borran solos con el tiempo.",1.0,.6),
('B',"Ojo con quien promete *limpiar tu historial*: la *Condusef* alerta que *nadie* puede borrar deudas *vigentes*.","Ojo con quien promete limpiar tu historial: la Condusef alerta que nadie puede borrar deudas vigentes.",.97,.6),
('B',"Un buen historial se *construye* pagando *a tiempo*, mes con mes.","Un buen historial se construye pagando a tiempo, mes con mes.",1.0,.6),
('B',"Esto es *información educativa*, no una recomendación de inversión.","Esto es información educativa, no una recomendación de inversión.",1.0,.6),
('B',"¿Ya revisaste *cómo te ve* el Buró de Crédito?","¿Ya revisaste cómo te ve el Buró de Crédito?",.97,.5),
('B',"Si te sirvió, dale *like* y *sígueme*.","Si te sirvió, dale like, y sígueme.",1.0,0),
]
LEAD,TAIL=.3,5.0
chunks=[np.zeros(int(LEAD*SR),np.float32)]; t=LEAD; words=[]; lines=[]; wi=0
for li,(spk,pan,hab,spd,gap) in enumerate(L):
    s,_=k.create(hab,voice=VO[spk],speed=spd,lang="es")
    s=s.astype(np.float32); a=np.abs(s); idx=np.where(a>0.01)[0]
    s=s[max(0,idx[0]-int(.02*SR)):idx[-1]+int(.06*SR)]
    d=len(s)/SR
    toks=pan.split(); hw=hab.split()
    clean=[x.replace('*','') for x in toks]
    W=[len(x)+2 for x in (hw if len(hw)==len(toks) else clean)]
    tot=sum(W); acc=0
    for tk,c,wt in zip(toks,clean,W):
        ws=t+d*acc/tot; acc+=wt; we=t+d*acc/tot
        words.append({"i":wi,"w":c,"s":round(ws,3),"e":round(we-0.02,3),"k":'*' in tk,"p":li,"spk":spk}); wi+=1
    lines.append({"p":li,"spk":spk,"s":round(t,3),"e":round(t+d,3)})
    chunks+=[s,np.zeros(int(gap*SR),np.float32)]; t+=d+gap
total=round(t+TAIL,2)
chunks.append(np.zeros(int(TAIL*SR),np.float32))
sf.write("raw.wav",np.concatenate(chunks),SR)
subprocess.run(["ffmpeg","-y","-v","error","-i","raw.wav","-af",
 "highpass=f=70,equalizer=f=180:t=q:w=1:g=2,equalizer=f=3500:t=q:w=1:g=2,acompressor=threshold=-20dB:ratio=3:attack=5:release=80,aecho=0.8:0.5:25:0.06,loudnorm=I=-14:TP=-1.5",
 "-ar","48000","-ac","1","/home/claude/video/app/public/buro/voz.wav"],check=True)
json.dump({"total":total,"words":words,"lines":lines},open("/home/claude/video/app/public/buro/words.json","w"),ensure_ascii=False)
print("total",total,"palabras",len(words))
for l in lines: print(l['p'],l['spk'],l['s'],l['e'],'first word',next(w['i'] for w in words if w['p']==l['p']))
