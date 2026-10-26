import json, subprocess, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
k=Kokoro("/home/claude/video/voz/kokoro-v1.0.onnx","/home/claude/video/voz/voices-v1.0.bin")
V=np.load("/home/claude/video/voz/voices-v1.0.bin")
VO={'A':V["ef_dora"]*0.7+V["if_sara"]*0.3, 'B':V["em_alex"]*0.6+V["im_nicola"]*0.4}
SR=24000
# (hablante, pantalla con *clave*, hablado, velocidad, pausa después)
L=[
('A',"Oye, ¿qué me conviene más: *pesos* o *dólares*?","Oye, ¿qué me conviene más: pesos, o dólares?",.97,.4),
('B',"¿Y si no tienes que *elegir*?","¿Y si no tienes que elegir?",.97,.4),
('A',"¿Cómo que *no*?","¿Cómo que no?",.97,.4),
('B',"Existe *ACTDUAL*, un fondo de deuda de Actinver","Existe Act dual, un fondo de deuda de Actinver",1.0,.08),
('B',"que busca *optimizar* la mezcla entre *pesos* y *dólares*.","que busca optimizar la mezcla entre pesos y dólares.",1.0,.45),
('A',"¿Y quién decide cuánto va a cada *lado*?","¿Y quién decide cuánto va a cada lado?",.97,.4),
('B',"Un *equipo* administra esa *mezcla*.","Un equipo administra esa mezcla.",.97,.45),
('A',"¿Y qué *busca*?","¿Y qué busca?",.97,.35),
('B',"Rendimientos *superiores* a las tasas en pesos, a *largo plazo*.","Rendimientos superiores a las tasas en pesos, a largo plazo.",1.0,.12),
('B',"Ojo: no es *garantía*, y el valor puede *subir* o *bajar*.","Ojo: no es garantía, y el valor puede subir o bajar.",.97,.45),
('A',"¿Y si necesito mi *dinero*?","¿Y si necesito mi dinero?",.97,.4),
('B',"Compras y vendes *todos los días hábiles*, con liquidación en *24 horas*.","Compras y vendes todos los días hábiles, con liquidación en veinticuatro horas.",1.0,.45),
('A',"Entonces, ¿cuál de los *tres* me conviene?","Entonces, ¿cuál de los tres me conviene?",.97,.4),
('B',"*ACTICOB*, si buscas seguir al *dólar*.","Acticob, si buscas seguir al dólar.",1.0,.15),
('B',"*PROTEGE*, si quieres deuda de *Estados Unidos*.","Protege, si quieres deuda de Estados Unidos.",1.0,.15),
('B',"Y *ACTDUAL*, si prefieres una *mezcla* de las dos monedas.","Y Act dual, si prefieres una mezcla de las dos monedas.",1.0,.45),
('B',"*Escríbeme* y vemos cuál va *contigo*.","Escríbeme, y vemos cuál va contigo.",1.0,.12),
('B',"Y *sígueme*: aquí termina la serie del *dólar*.","Y sígueme: aquí termina la serie del dólar.",1.0,0),
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
 "-ar","48000","-ac","1","/home/claude/video/app/public/actdual/voz.wav"],check=True)
json.dump({"total":total,"words":words,"lines":lines},open("/home/claude/video/app/public/actdual/words.json","w"),ensure_ascii=False)
print("total",total,"palabras",len(words))
for l in lines: print(l['p'],l['spk'],l['s'],l['e'])
