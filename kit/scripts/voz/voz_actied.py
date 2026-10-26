import json, subprocess, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
k=Kokoro("/home/claude/video/voz/kokoro-v1.0.onnx","/home/claude/video/voz/voices-v1.0.bin")
V=np.load("/home/claude/video/voz/voices-v1.0.bin")
VO={'A':V["ef_dora"]*0.7+V["if_sara"]*0.3, 'B':V["em_alex"]*0.6+V["im_nicola"]*0.4}
SR=24000
# (hablante, pantalla con *clave*, hablado, velocidad, pausa después)
L=[
('B',"¿Has escuchado la palabra *nearshoring*?","¿Has escuchado la palabra nirshóring?",.97,.5),
('B',"Es cuando las empresas traen su *producción* cerca de su *mercado principal*.","Es cuando las empresas traen su producción cerca de su mercado principal.",1.0,.45),
('B',"Y *México* está justo al lado de *Estados Unidos*.","Y México está justo al lado de Estados Unidos.",1.0,.5),
('B',"Eso suele traducirse en *naves industriales*, *parques* y *logística*.","Eso suele traducirse en naves industriales, parques y logística.",1.0,.5),
('B',"Para eso existe *ACTIED*,","Para eso existe Acti e de,",.95,.12),
('B',"un fondo de renta variable de Actinver, orientado a sectores y empresas con alto *potencial de crecimiento* por el *nearshoring*.","un fondo de renta variable de Actinver, orientado a sectores y empresas con alto potencial de crecimiento por el nirshóring.",1.0,.55),
('B',"Al *31 de marzo de 2026*, una parte relevante de su cartera estaba en *bienes raíces industriales*.","Al treinta y uno de marzo de dos mil veintiséis, una parte relevante de su cartera estaba en bienes raíces industriales.",1.0,.55),
('B',"Es un fondo de *largo plazo*, y el valor puede *subir* o *bajar*, y no es *garantía*.","Es un fondo de largo plazo, y el valor puede subir o bajar, y no es garantía.",.97,.5),
('B',"Compras y vendes *cualquier día hábil*,","Compras y vendes cualquier día hábil,",1.0,.1),
('B',"y se liquida en *24 horas*.","y se liquida en veinticuatro horas.",1.0,.5),
('B',"Así queda la serie de renta variable *local*:","Así queda la serie de renta variable local:",.97,.35),
('B',"*ACTIVAR*, sigue al *índice*.","Activar, sigue al índice.",1.0,.25),
('B',"*MAYA*, busca *superarlo*.","Maya, busca superarlo.",1.0,.25),
('B',"*ACTICRE*, empresas de *valor*.","Acticre, empresas de valor.",1.0,.25),
('B',"*ACTIED*, *nearshoring*.","Acti e de, nirshóring.",1.0,.5),
('B',"¿Crees que el *nearshoring* va a cambiar a *México*?","¿Crees que el nirshóring va a cambiar a México?",.97,.45),
('B',"*Escríbeme* y vemos cuál va *contigo*.","Escríbeme, y vemos cuál va contigo.",1.0,.12),
('B',"Y *sígueme*: aquí cerramos la serie de renta variable *local*.","Y sígueme: aquí cerramos la serie de renta variable local.",1.0,0),
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
 "-ar","48000","-ac","1","/home/claude/video/app/public/actied/voz.wav"],check=True)
json.dump({"total":total,"words":words,"lines":lines},open("/home/claude/video/app/public/actied/words.json","w"),ensure_ascii=False)
print("total",total,"palabras",len(words))
for l in lines: print(l['p'],l['spk'],l['s'],l['e'])
