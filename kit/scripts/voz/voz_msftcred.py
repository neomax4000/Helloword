# Noticia 2026-11-12: Microsoft: créditos por la caída (14 nov). Voz 3 (em_alex 0.6 + im_nicola 0.4), pausas <= 0.3 s.
# Modelos Kokoro v1.0: https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/ (GitHub SÍ está permitido; Hugging Face no)
import json, subprocess, os, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
M=os.environ.get('KOKORO_DIR','/tmp/kokoro'); OUT=os.environ.get('OUT_DIR','/home/claude/helloword/kit/app/public/msftcred')
k=Kokoro(f"{M}/kokoro-v1.0.onnx",f"{M}/voices-v1.0.bin")
V=np.load(f"{M}/voices-v1.0.bin")
VO={'B':V["em_alex"]*0.6+V["im_nicola"]*0.4}
SR=24000
# (hablante, pantalla con *clave*, hablado, velocidad, pausa después)
L=[
('B',"Microsoft te puede *devolver dinero* por la caída.","Máicrosoft te puede devolver dinero por la caída.",1.1,.25),
('B',"Pero *no es automático*, y *no es en efectivo*.","Pero no es automático, y no es en efectivo.",1.1,.25),
('B',"Su contrato promete *Outlook* al *99.9 %* del mes: unos *43 minutos* de falla permitida.","Su contrato promete Autlúk al noventa y nueve punto nueve por ciento del mes: unos cuarenta y tres minutos de falla permitida.",1.1,.25),
('B',"Menos de eso: *25 %* de crédito. Bajo 99: la *mitad*. Bajo 95: el *100 %*.","Menos de eso: veinticinco por ciento de crédito. Bajo noventa y nueve: la mitad. Bajo noventa y cinco: el cien por ciento.",1.1,.25),
('B',"Y la falla pasó de *27 horas*, según un *medio de tecnología*.","Y la falla pasó de veintisiete horas, según un medio de tecnología.",1.1,.25),
('B',"Y *sígueme*: qué significa para tu *dinero* en *México*.","Y sígueme: qué significa para tu dinero en México.",1.07,.35),
('B',"Si tu empresa paga *Microsoft 365*, se pide en el *centro de administración*.","Si tu empresa paga Máicrosoft trescientos sesenta y cinco, se pide en el centro de administración.",1.1,.25),
('B',"Cita el incidente *EX1550543*. Plazo: *31 de diciembre*.","Cita el incidente E equis, uno cinco cinco cero cinco cuatro tres. Plazo: treinta y uno de diciembre.",1.1,.25),
('B',"Ojo: es *crédito en tu factura*. No cubre *ventas perdidas*.","Ojo: es crédito en tu factura. No cubre ventas perdidas.",1.1,.25),
('B',"Microsoft dice que *no fue ciberataque*, sino una *mejora de red*.","Máicrosoft dice que no fue ciberataque, sino una mejora de red.",1.1,.25),
('B',"Esto es *información educativa*, no una recomendación de inversión.","Esto es información educativa, no una recomendación de inversión.",1.1,.3),
('B',"Si te sirvió, pulsa el *corazón* y *sígueme*.","Si te sirvió, pulsa el corazón, y sígueme.",1.05,0),
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
sf.write("/tmp/raw_msftcred.wav",np.concatenate(chunks),SR)
subprocess.run(["ffmpeg","-y","-v","error","-i","/tmp/raw_msftcred.wav","-af",
 "highpass=f=70,equalizer=f=180:t=q:w=1:g=2,equalizer=f=3500:t=q:w=1:g=2,acompressor=threshold=-20dB:ratio=3:attack=5:release=80,aecho=0.8:0.5:25:0.06,loudnorm=I=-14:TP=-1.5",
 "-ar","48000","-ac","1",f"{OUT}/voz.wav"],check=True)
json.dump({"total":total,"words":words,"lines":lines},open(f"{OUT}/words.json","w"),ensure_ascii=False)
print("total",total,"palabras",len(words))
for l in lines: print(l['p'],l['s'],l['e'])
