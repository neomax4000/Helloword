import json, subprocess, sys, numpy as np, soundfile as sf
sys.path.insert(0,'/home/claude/helloword/kit/scripts/voz')
from kokoro_onnx import Kokoro
from pregunta import pregunta, unir
k=Kokoro("/home/claude/video/voz/kokoro-v1.0.onnx","/home/claude/video/voz/voices-v1.0.bin")
V=np.load("/home/claude/video/voz/voices-v1.0.bin")
VO={'B':V["em_alex"]*0.6+V["im_nicola"]*0.4}
SR=24000
def gen(t,spd=1.07):
    s,_=k.create(t,voice=VO['B'],speed=spd,lang="es"); s=s.astype(np.float32)
    idx=np.where(np.abs(s)>0.01)[0]; return s[max(0,idx[0]-int(.02*SR)):idx[-1]+int(.06*SR)]
# (hablante, pantalla con *clave*, hablado, velocidad, pausa después) — JPMRVUS producto, pausas <= 0.3 s
L=[
('B',"*Value* o *growth*: no tienes que *elegir*.","Valiu o grouz: no tienes que elegir.",1.07,.3),
('B',"*Value*: empresas *sólidas* a buen *precio*. *Growth*: empresas que *crecen* rápido.","Valiu: empresas sólidas a buen precio. Grouz: empresas que crecen rápido.",1.08,.3),
('B',"*JPMRVUS* junta los *dos estilos*, con *J.P. Morgan*.","Jota Pe Eme, erre, ve, u, ese, junta los dos estilos, con Jota Pe Morgan.",1.06,.3),
('B',"Y *sígueme*: aquí viene lo *clave*.","Y sígueme: aquí viene lo clave.",1.07,.3),
('B',"Invierte en *emisoras americanas* de *mayor convicción*: *mitad value*, *mitad growth*.","Invierte en emisoras americanas de mayor convicción: mitad valiu, mitad grouz.",1.07,.3),
('B',"Es de *gestión activa* y concentra *pocas* emisoras de *alta calidad*.","Es de gestión activa, y concentra pocas emisoras de alta calidad.",1.07,.3),
('B',"Es un fondo de *largo plazo*.","Es un fondo de largo plazo.",1.07,.3),
('B',"*Compras* y *vendes* cualquier *día hábil*, con *liquidación* en *24 horas*.","Compras y vendes cualquier día hábil, con liquidación en veinticuatro horas.",1.07,.3),
('B',"El valor puede *subir* o *bajar*. *No es garantía*.","El valor puede subir o bajar. No es garantía.",1.07,.3),
('Q',"¿*Value* o *growth*? ¿Cuál va más *contigo*?","",1.07,.3),
('B',"*Escríbeme* y lo revisamos *juntos*.","Escríbeme, y lo revisamos juntos.",1.05,.1),
('B',"Y *sígueme* para más fondos de *Actinver*.","Y sígueme para más fondos de Actinver.",1.05,0),
]
LEAD,TAIL=.1,5.6
chunks=[np.zeros(int(LEAD*SR),np.float32)]; t=LEAD; words=[]; lines=[]; wi=0
for li,(spk,pan,hab,spd,gap) in enumerate(L):
    if spk=='Q':
        a=pregunta(gen("Valiu o grouz"),SR,"grouz",gen,inicio=9,tau_s=.2,final=False,estira=.7)
        b=pregunta(gen("Cuál va más contigo"),SR,"contigo",gen)
        s=unir(a,b,SR); hab="Valiu o grouz, cuál va más contigo"; spk='B'
        sf.write(f"q_{li}.wav",s,SR)
    else:
        s=gen(hab,spd)
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
sf.write("raw_jpmrvus.wav",np.concatenate(chunks),SR)
subprocess.run(["ffmpeg","-y","-v","error","-i","raw_jpmrvus.wav","-af",
 "highpass=f=70,equalizer=f=180:t=q:w=1:g=2,equalizer=f=3500:t=q:w=1:g=2,acompressor=threshold=-20dB:ratio=3:attack=5:release=80,aecho=0.8:0.5:25:0.06,loudnorm=I=-14:TP=-1.5",
 "-ar","48000","-ac","1","/home/claude/video/app/public/jpmrvus/voz.wav"],check=True)
json.dump({"total":total,"words":words,"lines":lines},open("/home/claude/video/app/public/jpmrvus/words.json","w"),ensure_ascii=False)
print("total",total,"palabras",len(words))
for l in lines: print(l['p'],l['s'],l['e'],'first word',next(w['i'] for w in words if w['p']==l['p']))
print(' '.join(f"{w['i']}:{w['w']}" for w in words))
