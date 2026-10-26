import json, subprocess, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
k=Kokoro("/home/claude/video/voz/kokoro-v1.0.onnx","/home/claude/video/voz/voices-v1.0.bin")
V=np.load("/home/claude/video/voz/voices-v1.0.bin")
VO={'A':V["ef_dora"]*0.7+V["if_sara"]*0.3, 'B':V["em_alex"]*0.6+V["im_nicola"]*0.4}
SR=24000
# (hablante, pantalla con *clave*, hablado, velocidad, pausa después)
L=[
('B',"¿Tienes gastos o metas en *dólares*?","¿Tienes gastos o metas en dólares?",.97,.45),
('B',"Un *viaje*, una *colegiatura*, una compra en el *extranjero*…","Un viaje, una colegiatura, una compra en el extranjero…",1.0,.45),
('B',"Si el dólar *sube*, eso te sale más *caro* en pesos.","Si el dólar sube, eso te sale más caro en pesos.",1.0,.5),
('B',"Para eso existe *ACTICOB*,","Para eso existe Acticob,",.95,.12),
('B',"un fondo de deuda en *dólares* de Actinver, de *corto plazo*.","un fondo de deuda en dólares de Actinver, de corto plazo.",1.0,.5),
('B',"Busca entregarte el *100%* del movimiento del *peso frente al dólar*.","Busca entregarte el cien por ciento del movimiento del peso frente al dólar.",1.0,.3),
('B',"Si el dólar sube, el fondo lo *refleja*.","Si el dólar sube, el fondo lo refleja.",1.0,.25),
('B',"Y ojo: si el dólar *baja*, el fondo *también* lo refleja.","Y ojo: si el dólar baja, el fondo también lo refleja.",.97,.5),
('B',"Su riesgo va de *bajo a moderado*,","Su riesgo va de bajo a moderado,",1.0,.1),
('B',"y tiene calificación *AAA/3* de HR Ratings.","y tiene calificación triple A, de Hache Erre Ratings.",1.0,.5),
('B',"Compras y vendes *cualquier día hábil*,","Compras y vendes cualquier día hábil,",1.0,.1),
('B',"y tu dinero se liquida en *48 horas*.","y tu dinero se liquida en cuarenta y ocho horas.",1.0,.5),
('B',"¿Qué gasto en *dólares* tienes en puerta?","¿Qué gasto en dólares tienes en puerta?",.97,.45),
('B',"*Escríbeme* y lo revisamos *juntos*.","Escríbeme, y lo revisamos juntos.",1.0,.12),
('B',"Y *sígueme*: esta es la serie del *dólar*.","Y sígueme: esta es la serie del dólar.",1.0,0),
]
LEAD,TAIL=.3,5.4
chunks=[np.zeros(int(LEAD*SR),np.float32)]; t=LEAD; words=[]; lines=[]; wi=0
for li,(spk,pan,hab,spd,gap) in enumerate(L):
    s,_=k.create(hab,voice=VO[spk],speed=spd,lang="es")
    s=s.astype(np.float32); a=np.abs(s); idx=np.where(a>0.01)[0]
    s=s[max(0,idx[0]-int(.02*SR)):idx[-1]+int(.06*SR)]
    d=len(s)/SR
    toks=pan.split(); hw=hab.split()
    clean=[x.replace('*','') for x in toks]
    # pesos por palabra hablada si coinciden en número
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
 "-ar","48000","-ac","1","/home/claude/video/app/public/acticob/voz.wav"],check=True)
json.dump({"total":total,"words":words,"lines":lines},open("/home/claude/video/app/public/acticob/words.json","w"),ensure_ascii=False)
print("total",total,"palabras",len(words))
for l in lines: print(l['p'],l['spk'],l['s'],l['e'])
