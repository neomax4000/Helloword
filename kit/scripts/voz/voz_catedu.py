import json, subprocess, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
k=Kokoro("/home/claude/video/voz/kokoro-v1.0.onnx","/home/claude/video/voz/voices-v1.0.bin")
V=np.load("/home/claude/video/voz/voices-v1.0.bin")
VO={'B':V["em_alex"]*0.6+V["im_nicola"]*0.4}
SR=24000
# (hablante, pantalla con *clave*, hablado, velocidad, pausa después)  — CAT educativo, pausas <= 0.35 s
L=[
('B',"Dos *créditos* con la misma *tasa* cuestan *distinto*.","Dos créditos con la misma tasa cuestan distinto.",1.08,.3),
('B',"La diferencia está en el *CAT*.","La diferencia está en el Cat.",1.07,.3),
('B',"*CAT*: *Costo Anual Total*.","Cat: Costo Anual Total.",1.07,.3),
('B',"Suma la *tasa*, las *comisiones* y los *seguros*.","Suma la tasa, las comisiones y los seguros.",1.08,.3),
('B',"Todo en un solo *porcentaje anual*.","Todo en un solo porcentaje anual.",1.08,.3),
('B',"Una tasa *baja* puede *esconder* costos.","Una tasa baja puede esconder costos.",1.07,.3),
('B',"Y *sígueme*: ahora viene cómo *usarlo*.","Y sígueme: ahora viene cómo usarlo.",1.07,.35),
('B',"Pide el *CAT* de cada crédito antes de *firmar*.","Pide el Cat de cada crédito antes de firmar.",1.08,.3),
('B',"Compara el *CAT*, no solo la *tasa*.","Compara el Cat, no solo la tasa.",1.08,.3),
('B',"Con el mismo *monto* y *plazo*, el CAT más *bajo* cuesta *menos*.","Con el mismo monto y plazo, el Cat más bajo cuesta menos.",1.08,.3),
('B',"Banxico tiene una *calculadora* del CAT en su *página*.","Banxico tiene una calculadora del Cat en su página.",1.08,.3),
('B',"Para *tarjetas*, tiene *otra*.","Para tarjetas, tiene otra.",1.08,.3),
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
 "-ar","48000","-ac","1","/home/claude/video/app/public/catedu/voz.wav"],check=True)
json.dump({"total":total,"words":words,"lines":lines},open("/home/claude/video/app/public/catedu/words.json","w"),ensure_ascii=False)
print("total",total,"palabras",len(words))
for l in lines: print(l['p'],l['s'],l['e'],'first word',next(w['i'] for w in words if w['p']==l['p']))
print(' '.join(f"{w['i']}:{w['w']}" for w in words))
