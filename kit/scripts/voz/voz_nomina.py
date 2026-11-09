import json, subprocess, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
k=Kokoro("/home/claude/video/voz/kokoro-v1.0.onnx","/home/claude/video/voz/voices-v1.0.bin")
V=np.load("/home/claude/video/voz/voices-v1.0.bin")
VO={'B':V["em_alex"]*0.6+V["im_nicola"]*0.4}
SR=24000
# Portabilidad de nómina (tutorial app). (hablante, pantalla con *clave*, hablado, velocidad, pausa después)  — CAT educativo, pausas <= 0.35 s
L=[
('B',"Tu *nómina* puede llegar a *Actinver*, sin pedirle *permiso* a tu empresa.","Tu nómina puede llegar a Actinver, sin pedirle permiso a tu empresa.",1.07,.28),
('B',"Y el cambio es *gratis*.","Y el cambio es gratis.",1.05,.28),
('B',"Te enseño cómo, desde tu *app*.","Te enseño cómo, desde tu ap.",1.07,.3),
('B',"Toca tu *perfil*, arriba a la *izquierda*.","Toca tu perfil, arriba a la izquierda.",1.07,.28),
('B',"Entra a *Portabilidad de nómina*.","Entra a Portabilidad de nómina.",1.07,.3),
('B',"Sin cuota *anual* y con tarjeta de débito *VISA internacional*.","Sin cuota anual, y con tarjeta de débito Visa internacional.",1.08,.3),
('B',"En *Consulta bancos autorizados*, revisa que tu *banco* esté en la lista.","En Consulta bancos autorizados, revisa que tu banco esté en la lista.",1.08,.32),
('B',"*Sígueme*, que ahora viene lo *importante*.","Sígueme, que ahora viene lo importante.",1.07,.32),
('B',"Toca *Traer nómina a Actinver*.","Toca Traer nómina a Actinver.",1.06,.28),
('B',"*Confirma* tus datos.","Confirma tus datos.",1.05,.28),
('B',"Escribe la *CLABE* de tu cuenta de nómina *actual*: *18 dígitos*.","Escribe la clabe de tu cuenta de nómina actual: dieciocho dígitos.",1.07,.28),
('B',"Y sigue los *tres pasos* que te pide la app.","Y sigue los tres pasos que te pide la ap.",1.07,.3),
('B',"El cambio no debe tardar más de *10 días hábiles*.","El cambio no debe tardar más de diez días hábiles.",1.07,.28),
('B',"Y en *Estatus de portabilidad* ves cómo *va*.","Y en Estatus de portabilidad ves cómo va.",1.07,.32),
('B',"Ojo: si tienes un *crédito de nómina*, tu banco actual puede *retener* ese pago.","Ojo: si tienes un crédito de nómina, tu banco actual puede retener ese pago.",1.08,.32),
('B',"Si tienes *dudas*, *escríbeme* y lo hacemos *juntos*.","Si tienes dudas, escríbeme, y lo hacemos juntos.",1.06,.28),
('B',"Y *sígueme* para más trucos de tu *app Actinver*.","Y sígueme para más trucos de tu ap Actinver.",1.06,0),
]
LEAD,TAIL=.1,2.4
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
 "-ar","48000","-ac","1","/home/claude/video/app/public/nomina/voz.wav"],check=True)
json.dump({"total":total,"words":words,"lines":lines},open("/home/claude/video/app/public/nomina/words.json","w"),ensure_ascii=False)
print("total",total,"palabras",len(words))
for l in lines: print(l['p'],l['s'],l['e'],'first word',next(w['i'] for w in words if w['p']==l['p']))
print(' '.join(f"{w['i']}:{w['w']}" for w in words))
