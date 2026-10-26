import json, subprocess, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
k=Kokoro("/home/claude/video/voz/kokoro-v1.0.onnx","/home/claude/video/voz/voices-v1.0.bin")
V=np.load("/home/claude/video/voz/voices-v1.0.bin")
VO={'A':V["ef_dora"]*0.7+V["if_sara"]*0.3, 'B':V["em_alex"]*0.6+V["im_nicola"]*0.4}
SR=24000
# (hablante, pantalla con *clave*, hablado, velocidad, pausa después)
L=[
('A',"Oye, ¿qué diferencia hay entre un fondo de manejo *pasivo* y uno de manejo *activo*?","Oye, ¿qué diferencia hay entre un fondo de manejo pasivo, y uno de manejo activo?",.97,.4),
('B',"Piénsalo como un *piloto automático* y un *piloto manual*.","Piénsalo como un piloto automático, y un piloto manual.",.97,.45),
('B',"En el *pasivo*, el fondo *replica* un índice: sigue al *mercado*.","En el pasivo, el fondo replica un índice: sigue al mercado.",1.0,.45),
('A',"¿Y no intenta *ganarle* al índice?","¿Y no intenta ganarle al índice?",.97,.4),
('B',"No. Y suele tener *costos* más bajos.","No. Y suele tener costos más bajos.",.97,.45),
('A',"¿Y el *activo*?","¿Y el activo?",.97,.35),
('B',"Ahí un *equipo* elige las empresas, para buscar *superar* al índice.","Ahí un equipo elige las empresas, para buscar superar al índice.",1.0,.45),
('A',"¿Y lo *logra*?","¿Y lo logra?",.97,.35),
('B',"Puede lograrlo, o *no*. Y suele tener costos más *altos*.","Puede lograrlo, o no. Y suele tener costos más altos.",.97,.45),
('A',"¿Entonces cuál es *mejor*?","¿Entonces cuál es mejor?",.97,.4),
('B',"Ninguno es mejor en *todos* los casos: depende de tu *objetivo*. También se pueden *combinar*.","Ninguno es mejor en todos los casos: depende de tu objetivo. También se pueden combinar.",1.0,.45),
('A',"¿Y algún *ejemplo*?","¿Y algún ejemplo?",.97,.4),
('B',"*ACTIVAR*, de manejo *pasivo*, replica el índice de la bolsa mexicana.","Activar, de manejo pasivo, replica el índice de la bolsa mexicana.",1.0,.4),
('B',"*MAYA*, de manejo *activo*, busca superarlo.","Maya, de manejo activo, busca superarlo.",1.0,.45),
('B',"En los dos, el valor puede *subir* o *bajar*, y no hay *garantía*.","En los dos, el valor puede subir o bajar, y no hay garantía.",.97,.5),
('B',"Para tu dinero, ¿prefieres *seguir* al mercado o buscar *superarlo*?","Para tu dinero, ¿prefieres seguir al mercado, o buscar superarlo?",.97,.45),
('B',"*Escríbeme* y lo revisamos *juntos*.","Escríbeme, y lo revisamos juntos.",1.0,.12),
('B',"Y *sígueme* para más *finanzas* fáciles.","Y sígueme, para más finanzas fáciles.",1.0,0),
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
 "-ar","48000","-ac","1","/home/claude/video/app/public/pasact/voz.wav"],check=True)
json.dump({"total":total,"words":words,"lines":lines},open("/home/claude/video/app/public/pasact/words.json","w"),ensure_ascii=False)
print("total",total,"palabras",len(words))
for l in lines: print(l['p'],l['spk'],l['s'],l['e'])
