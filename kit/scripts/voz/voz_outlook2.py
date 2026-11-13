# Noticia 2026-11-12: seguimiento Outlook 13 nov. Voz 3 (em_alex 0.6 + im_nicola 0.4), pausas <= 0.3 s.
# Modelos Kokoro v1.0: https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/ (GitHub SÍ está permitido; Hugging Face no)
import json, subprocess, os, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
M=os.environ.get('KOKORO_DIR','/tmp/kokoro'); OUT=os.environ.get('OUT_DIR','/home/claude/helloword/kit/app/public/outlook2')
k=Kokoro(f"{M}/kokoro-v1.0.onnx",f"{M}/voices-v1.0.bin")
V=np.load(f"{M}/voices-v1.0.bin")
VO={'B':V["em_alex"]*0.6+V["im_nicola"]*0.4}
SR=24000
# (hablante, pantalla con *clave*, hablado, velocidad, pausa después)
L=[
('B',"El *jueves* cayó *Outlook*. Ya sabemos *qué pasó*.","El jueves cayó Autlúk. Ya sabemos qué pasó.",1.08,.3),
('B',"Más de *120 mil reportes* en *Downdetector*.","Más de ciento veinte mil reportes en Daundetéctor.",1.08,.3),
('B',"Microsoft dice: *servidores* fuera de línea *sin aviso*.","Máicrosoft dice: servidores fuera de línea sin aviso.",1.08,.3),
('B',"No fue *más tráfico*, ni señales de *ciberataque*.","No fue más tráfico, ni señales de ciberataque.",1.08,.3),
('B',"Y *sígueme*: qué significa para tu *dinero* en *México*.","Y sígueme: qué significa para tu dinero en México.",1.07,.35),
('B',"Cayeron *Outlook*, *Teams* y *Copilot*, de *Australia* a *Estados Unidos*.","Cayeron Autlúk. Tims. Y Copáilot. De Australia a Estados Unidos.",1.08,.3),
('B',"Hubo reportes en *74 países* y cerca de *18 horas* de falla.","Hubo reportes en setenta y cuatro países, y cerca de dieciocho horas de falla.",1.08,.3),
('B',"Hoy los reportes *bajan*, pero pueden quedar *fallas*.","Hoy los reportes bajan, pero pueden quedar fallas.",1.08,.3),
('B',"Y Microsoft aún *investiga* el *origen*.","Y Máicrosoft aún investiga el origen.",1.08,.3),
('B',"*Uno*: ante un aviso del *banco*, entra a su *app*.","Uno: ante un aviso del banco, entra a su app.",1.08,.3),
('B',"*Dos*: desconfía de correos que digan *«restablece tu cuenta»*.","Dos: desconfía de correos que digan, restablece tu cuenta.",1.08,.3),
('B',"*Tres*: ten un *segundo canal* para cobros y avisos.","Tres: ten un segundo canal para cobros y avisos.",1.08,.3),
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
sf.write("/tmp/raw_outlook2.wav",np.concatenate(chunks),SR)
subprocess.run(["ffmpeg","-y","-v","error","-i","/tmp/raw_outlook2.wav","-af",
 "highpass=f=70,equalizer=f=180:t=q:w=1:g=2,equalizer=f=3500:t=q:w=1:g=2,acompressor=threshold=-20dB:ratio=3:attack=5:release=80,aecho=0.8:0.5:25:0.06,loudnorm=I=-14:TP=-1.5",
 "-ar","48000","-ac","1",f"{OUT}/voz.wav"],check=True)
json.dump({"total":total,"words":words,"lines":lines},open(f"{OUT}/words.json","w"),ensure_ascii=False)
print("total",total,"palabras",len(words))
for l in lines: print(l['p'],l['s'],l['e'])
