import json, subprocess, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
k=Kokoro("/home/claude/video/voz/kokoro-v1.0.onnx","/home/claude/video/voz/voices-v1.0.bin")
V=np.load("/home/claude/video/voz/voices-v1.0.bin")
VO={'A':V["ef_dora"]*0.7+V["if_sara"]*0.3, 'B':V["em_alex"]*0.6+V["im_nicola"]*0.4}
SR=24000
# (hablante, pantalla con *clave*, hablado, velocidad, pausa después)
L=[
('B',"¿Sabías que puedes tener *protección* para tu familia y un *ahorro*, en un mismo instrumento?","¿Sabías que puedes tener protección para tu familia, y un ahorro, en un mismo instrumento?",.97,.5),
('B',"Se llama *Vida Ahorro Creciente*, de *Actinver*, en alianza con *Zurich*.","Se llama Vida Ahorro Creciente, de Actinver, en alianza con Zurich.",.97,.5),
('B',"Con tus aportaciones, tienes una *suma asegurada* para tu familia,","Con tus aportaciones, tienes una suma asegurada para tu familia,",1.0,.15),
('B',"y una parte se invierte en *fondos* de Actinver.","y una parte se invierte en fondos de Actinver.",1.0,.5),
('B',"Ojo: ese ahorro está expuesto al *mercado*; su valor puede *subir* o *bajar*.","Ojo: ese ahorro está expuesto al mercado; su valor puede subir o bajar.",.97,.5),
('B',"Si llegaras a faltar, tus beneficiarios reciben la *suma asegurada*, más el *saldo* del ahorro.","Si llegaras a faltar, tus beneficiarios reciben la suma asegurada, más el saldo del ahorro.",1.0,.5),
('B',"Y al final del plazo, el *saldo* del ahorro es para ti.","Y al final del plazo, el saldo del ahorro es para ti.",1.0,.5),
('B',"Coberturas, costos y condiciones dependen de tu *póliza*.","Coberturas, costos y condiciones dependen de tu póliza.",.97,.5),
('B',"¿Quieres saber cómo funcionaría en *tu caso*?","¿Quieres saber cómo funcionaría en tu caso?",.97,.45),
('B',"*Escríbeme* y te hago tu *cotización* personalizada.","Escríbeme, y te hago tu cotización personalizada.",1.0,.12),
('B',"Y *sígueme* para más datos como este.","Y sígueme para más datos como este.",1.0,0),
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
 "-ar","48000","-ac","1","/home/claude/video/app/public/vacad/voz.wav"],check=True)
json.dump({"total":total,"words":words,"lines":lines},open("/home/claude/video/app/public/vacad/words.json","w"),ensure_ascii=False)
print("total",total,"palabras",len(words))
for l in lines: print(l['p'],l['spk'],l['s'],l['e'])
