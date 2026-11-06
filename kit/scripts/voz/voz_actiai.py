import json, subprocess, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
k=Kokoro("/home/claude/video/voz/kokoro-v1.0.onnx","/home/claude/video/voz/voices-v1.0.bin")
V=np.load("/home/claude/video/voz/voices-v1.0.bin")
VO={'A':V["ef_dora"]*0.7+V["if_sara"]*0.3, 'B':V["em_alex"]*0.6+V["im_nicola"]*0.4}
SR=24000
# (hablante, pantalla con *clave*, hablado, velocidad, pausa después)
L=[
('B',"Hoy usas *inteligencia artificial* casi sin darte cuenta.","Hoy usas inteligencia artificial casi sin darte cuenta.",.97,.55),
('B',"¿Y si también pudieras *invertir* en ella?","¿Y si también pudieras invertir en ella?",.97,.55),
('B',"*ACTIAI* es un fondo de *Actinver*, asesorado por *AXA Investment Managers*.","Acti éi ái es un fondo de Actinver, asesorado por Axa Inbéstment Mánayers.",.97,.55),
('B',"Invierte en *empresas globales* ligadas a la revolución de la *inteligencia artificial*.","Invierte en empresas globales ligadas a la revolución de la inteligencia artificial.",.97,.5),
('B',"También en la *economía digital*: *comercio electrónico* y *ciberseguridad*.","También en la economía digital: comercio electrónico y ciberseguridad.",.97,.55),
('B',"Es de *largo plazo*. Compras y vendes cualquier *día hábil*, con liquidación en *24 horas*.","Es de largo plazo. Compras y vendes cualquier día hábil, con liquidación en veinticuatro horas.",1.0,.55),
('B',"Al concentrarse en *tecnología*, puede tener mayor *volatilidad*: el valor puede *subir* o *bajar*, y *no es garantía*.","Al concentrarse en tecnología, puede tener mayor volatilidad: el valor puede subir o bajar, y no es garantía.",.97,.55),
('B',"¿Crees que la *IA* va a cambiar tu *trabajo*?","¿Crees que la inteligencia artificial va a cambiar tu trabajo?",.97,.45),
('B',"*Escríbeme* y lo revisamos *juntos*.","Escríbeme, y lo revisamos juntos.",1.0,.12),
('B',"Y *sígueme* para conocer más fondos de *Actinver*.","Y sígueme para conocer más fondos de Actinver.",1.0,0),
]
LEAD,TAIL=.3,5.6
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
 "-ar","48000","-ac","1","/home/claude/video/app/public/actiai/voz.wav"],check=True)
json.dump({"total":total,"words":words,"lines":lines},open("/home/claude/video/app/public/actiai/words.json","w"),ensure_ascii=False)
print("total",total,"palabras",len(words))
for l in lines: print(l['p'],l['spk'],l['s'],l['e'])
