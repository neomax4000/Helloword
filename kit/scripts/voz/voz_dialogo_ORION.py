import json, subprocess, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
k=Kokoro("/home/claude/video/voz/kokoro-v1.0.onnx","/home/claude/video/voz/voices-v1.0.bin")
V=np.load("/home/claude/video/voz/voices-v1.0.bin")
VO={'A':V["ef_dora"]*0.7+V["if_sara"]*0.3, 'B':V["em_alex"]*0.6+V["im_nicola"]*0.4}
SR=24000
# (hablante, pantalla con *clave*, hablado, velocidad, pausa después)
L=[
('A',"Oye, ¿qué pasa con los *bonos* cuando las *tasas* bajan?","Oye, ¿qué pasa con los bonos cuando las tasas bajan?",.97,.4),
('B',"Los bonos de *largo plazo* suelen *subir* de precio.","Los bonos de largo plazo suelen subir de precio.",.97,.15),
('B',"Y cuando las tasas *suben*, suelen *bajar*.","Y cuando las tasas suben, suelen bajar.",.97,.45),
('A',"¿Y hay un *fondo* que trabaje con eso?","¿Y hay un fondo que trabaje con eso?",.97,.4),
('B',"*ORION*, un fondo de deuda de Actinver","Orión, un fondo de deuda de Actinver",1.0,.08),
('B',"con *administración activa*, que busca el *crecimiento* de tu capital a *largo plazo*.","con administración activa, que busca el crecimiento de tu capital a largo plazo.",1.0,.45),
('B',"Invierte principalmente en *deuda* de distintos *plazos*,","Invierte principalmente en deuda de distintos plazos,",1.0,.08),
('B',"y un *equipo* va ajustando la *cartera*.","y un equipo va ajustando la cartera.",1.0,.45),
('A',"¿Y el *riesgo*?","¿Y el riesgo?",.97,.35),
('B',"Es más *sensible* a las tasas: si suben, su valor puede *bajar*.","Es más sensible a las tasas: si suben, su valor puede bajar.",.97,.15),
('B',"Por eso es para *largo plazo*: su documento recomienda más de *tres años*.","Por eso es para largo plazo: su documento recomienda más de tres años.",.97,.12),
('B',"Y ojo: *no es garantía*.","Y ojo: no es garantía.",.97,.45),
('A',"¿Y si necesito mi *dinero*?","¿Y si necesito mi dinero?",.97,.4),
('B',"Compras y vendes *cualquier día hábil*, con liquidación en *48 horas*.","Compras y vendes cualquier día hábil, con liquidación en cuarenta y ocho horas.",1.0,.45),
('A',"Entonces, ¿para *quién* es?","Entonces, ¿para quién es?",.97,.4),
('B',"Para quien *ya invierte* y entiende que su valor *se mueve* con las tasas.","Para quien ya invierte, y entiende que su valor se mueve con las tasas.",1.0,.45),
('B',"¿Qué *escalón* de la escalera va *contigo*?","¿Qué escalón de la escalera va contigo?",1.0,.15),
('B',"*Escríbeme* y lo vemos.","Escríbeme, y lo vemos.",1.0,.12),
('B',"Y *sígueme*: aquí cerramos la serie de *deuda en pesos*.","Y sígueme: aquí cerramos la serie de deuda en pesos.",1.0,0),
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
 "-ar","48000","-ac","1","/home/claude/video/app/public/orion/voz.wav"],check=True)
json.dump({"total":total,"words":words,"lines":lines},open("/home/claude/video/app/public/orion/words.json","w"),ensure_ascii=False)
print("total",total,"palabras",len(words))
for l in lines: print(l['p'],l['spk'],l['s'],l['e'])
