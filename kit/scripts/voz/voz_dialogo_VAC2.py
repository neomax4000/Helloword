import json, subprocess, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
k=Kokoro("/home/claude/video/voz/kokoro-v1.0.onnx","/home/claude/video/voz/voices-v1.0.bin")
V=np.load("/home/claude/video/voz/voices-v1.0.bin")
VO={'A':V["ef_dora"]*0.7+V["if_sara"]*0.3, 'B':V["em_alex"]*0.6+V["im_nicola"]*0.4}
SR=24000
# (hablante, pantalla con *clave*, hablado, velocidad, pausa después)
L=[
('A',"Oye, me interesa el *VAC*…","Oye, me interesa el vac…",1.0,.15),
('A',"pero ¿y si un año *no puedo pagar*?","pero ¿y si un año no puedo pagar?",.97,.5),
('B',"Buena pregunta. Para eso existe el *periodo de descanso*.","Buena pregunta. Para eso existe el periodo de descanso.",1.0,.45),
('A',"¿*Periodo de descanso*?","¿Periodo de descanso?",.95,.45),
('B',"Sí. A partir del *segundo año*,","Sí. A partir del segundo año,",1.0,.08),
('B',"puedes pausar tus pagos hasta *12 meses* seguidos.","puedes pausar tus pagos hasta doce meses seguidos.",1.0,.12),
('B',"Una sola vez en la vida de la *póliza*.","Una sola vez en la vida de la póliza.",.97,.5),
('A',"¿Y mientras tanto pierdo mi *protección*?","¿Y mientras tanto pierdo mi protección?",.97,.45),
('B',"*No*. Tu protección *sigue*,","No. Tu protección sigue,",.95,.1),
('B',"y los costos se cubren con lo que llevas *ahorrado* en tu fondo.","y los costos se cubren con lo que llevas ahorrado en tu fondo.",1.02,.5),
('A',"¿Hay algún *requisito*?","¿Hay algún requisito?",.97,.45),
('B',"*Tres*:","Tres:",.95,.15),
('B',"tener *saldo suficiente* en tu fondo,","tener saldo suficiente en tu fondo,",1.0,.1),
('B',"no haber retirado más de la *mitad*,","no haber retirado más de la mitad,",1.0,.1),
('B',"y avisar con *30 días hábiles* de anticipación.","y avisar con treinta días hábiles de anticipación.",1.0,.5),
('A',"¿Y si lo que necesito es *dinero*?","¿Y si lo que necesito es dinero?",.97,.45),
('B',"Desde el segundo año, puedes hacer hasta *2 retiros parciales* al año.","Desde el segundo año, puedes hacer hasta dos retiros parciales al año.",1.02,.12),
('B',"Ojo: en los primeros *10 años* tienen una *comisión*.","Ojo: en los primeros diez años tienen una comisión.",.97,.5),
('A',"¿Y cuando me *sobra*?","¿Y cuando me sobra?",.97,.4),
('B',"Puedes hacer *aportaciones extra*, hasta *3* al año.","Puedes hacer aportaciones extra, hasta tres al año.",1.0,.5),
('A',"O sea… se *adapta* a mi vida.","O sea… se adapta a mi vida.",.95,.4),
('B',"*Exacto*.","Exacto.",.95,.45),
('B',"¿Tú qué harías: *pausar*, *retirar* o *aportar* más?","¿Tú qué harías: pausar, retirar, o aportar más?",.97,.35),
('B',"*Escríbeme* y lo vemos con tu *cotización*.","Escríbeme, y lo vemos con tu cotización.",1.0,.1),
('B',"Y *sígueme*, que esto sigue.","Y sígueme, que esto sigue.",1.0,0),
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
 "-ar","48000","-ac","1","/home/claude/video/app/public/vac2/voz.wav"],check=True)
json.dump({"total":total,"words":words,"lines":lines},open("/home/claude/video/app/public/vac2/words.json","w"),ensure_ascii=False)
print("total",total,"palabras",len(words))
for l in lines: print(l['p'],l['spk'],l['s'],l['e'])
