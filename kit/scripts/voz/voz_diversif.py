import json, subprocess, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
k=Kokoro("/home/claude/video/voz/kokoro-v1.0.onnx","/home/claude/video/voz/voices-v1.0.bin")
V=np.load("/home/claude/video/voz/voices-v1.0.bin")
VO={'B':V["em_alex"]*0.6+V["im_nicola"]*0.4}
SR=24000
# DIVERSIFICACIÓN educativo
# (hablante, pantalla con *clave*, hablado, velocidad, pausa después)  — Ahorrar vs invertir educativo, pausas <= 0.35 s
L=[
('B',"Todo tu *dinero* en un solo *lugar* es *riesgo*.","Todo tu dinero en un solo lugar es riesgo.",1.08,.3),
('B',"Si ese lugar *falla*, tu dinero *cae* con él.","Si ese lugar falla, tu dinero cae con él.",1.08,.3),
('B',"*Diversificar* es *repartir* tu dinero en *más de una opción*.","Diversificar es repartir tu dinero en más de una opción.",1.08,.3),
('B',"Así, si una *baja*, las otras pueden *amortiguar*.","Así, si una baja, las otras pueden amortiguar.",1.08,.3),
('B',"Y *sígueme*: ahora viene *cómo* hacerlo.","Y sígueme: ahora viene cómo hacerlo.",1.07,.35),
('B',"Por *tipo* de inversión: *deuda*, *acciones* y *efectivo*.","Por tipo de inversión: deuda, acciones y efectivo.",1.08,.3),
('B',"Por *país*: no todo en *un solo* país.","Por país: no todo en un solo país.",1.08,.3),
('B',"Y por *plazo*: unas a *corto* y otras a *largo*.","Y por plazo: unas a corto y otras a largo.",1.08,.3),
('B',"Según *CONDUSEF*, es la *mejor forma* de *disminuir riesgos*.","Según Condusef, es la mejor forma de disminuir riesgos.",1.08,.3),
('B',"Pero *no* los elimina ni *garantiza* ganancias.","Pero no los elimina ni garantiza ganancias.",1.08,.3),
('B',"El valor puede *subir* o *bajar*.","El valor puede subir o bajar.",1.08,.3),
('B',"Y ojo: no es juntar muchas cosas *iguales*, es *combinar* distintas.","Y ojo: no es juntar muchas cosas iguales, es combinar distintas.",1.08,.3),
('B',"No pongas *todos los huevos* en la *misma canasta*.","No pongas todos los huevos en la misma canasta.",1.08,.3),
('B',"Esto es *información educativa*, no una recomendación de inversión.","Esto es información educativa, no una recomendación de inversión.",1.1,.3),
('B',"Si te sirvió, dale *like* y *sígueme*.","Si te sirvió, dale laik, y sígueme.",1.05,0),
]
LEAD,TAIL=.15,2.8
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
 "-ar","48000","-ac","1","/home/claude/video/app/public/diversif/voz.wav"],check=True)
json.dump({"total":total,"words":words,"lines":lines},open("/home/claude/video/app/public/diversif/words.json","w"),ensure_ascii=False)
print("total",total,"palabras",len(words))
for l in lines: print(l['p'],l['s'],l['e'],'first word',next(w['i'] for w in words if w['p']==l['p']))
print(' '.join(f"{w['i']}:{w['w']}" for w in words))
