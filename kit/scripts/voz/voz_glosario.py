"""Voz del GLOSARIO FINANCIERO (decisión de Brandon 2026-11-07).
Voz D = em_santa 0.5 + em_alex 0.25 + im_nicola 0.25 (Kokoro). Solo HECHOS, sin preguntas (la pregunta delata la voz sintética).
Pausas entre frases de 0.08 s; cada frase arranca con tono alto y golpe de volumen (+4 dB que decae en 0.35 s), como gritando desde el inicio.
Fonética: inglés escrito como suena en el HABLADO (like -> «laik»); el subtítulo conserva la ortografía real.
Uso: python3 voz_glosario.py <carpeta_public> guion.json   (guion.json = lista de [panel_con_*claves*, hablado])
Receta de pregunta (solo si algún día se usa; F1 aprobado): en la última palabra el tono sube desde su inicio (+3, +9, +15 st por sílaba,
con pyworld forzando tono también en la sílaba final) y la última sílaba dura 1.25x."""
import json, sys, subprocess, numpy as np, soundfile as sf, parselmouth
from parselmouth.praat import call
from kokoro_onnx import Kokoro
D=sys.argv[1]; L=json.load(open(sys.argv[2],encoding='utf-8'))
k=Kokoro("/home/claude/video/voz/kokoro-v1.0.onnx","/home/claude/video/voz/voices-v1.0.bin")
V=np.load("/home/claude/video/voz/voices-v1.0.bin")
VOZ=V["em_santa"]*0.5+V["em_alex"]*0.25+V["im_nicola"]*0.25
SR=24000; GAP=0.08; LEAD=0.05; TAIL=float(sys.argv[3]) if len(sys.argv)>3 else 1.2
def gen(t):
    s,_=k.create(t,voice=VOZ,speed=0.97,lang="es"); s=s.astype(np.float32)
    i=np.where(np.abs(s)>0.01)[0]; return s[max(0,i[0]-int(.005*SR)):i[-1]+int(.03*SR)]
def ataque(s):
    snd=parselmouth.Sound(s.astype(np.float64),SR); T=snd.duration
    man=call(snd,"To Manipulation",0.01,75,400); pt=call(man,"Extract pitch tier"); n=call(pt,"Get number of points")
    new=call("Create PitchTier","n",0,T)
    for i in range(1,n+1):
        t=call(pt,"Get time from index",i); f=call(pt,"Get value at index",i)
        call(new,"Add point",t,f*2**((4.0*np.exp(-(t/T)/0.25)+0.5)/12))
    call([man,new],"Replace pitch tier")
    o=call(man,"Get resynthesis (overlap-add)").values[0].astype(np.float32)
    return o*(1+(10**(4/20)-1)*np.exp(-(np.arange(len(o))/SR)/0.35))
chunks=[np.zeros(int(LEAD*SR),np.float32)]; t=LEAD; words=[]; lines=[]; wi=0
for li,(pan,hab) in enumerate(L):
    s=ataque(gen(hab)); d=len(s)/SR
    toks=pan.split(); hw=hab.split(); clean=[x.replace('*','') for x in toks]
    W=[len(x)+2 for x in (hw if len(hw)==len(toks) else clean)]; tot=sum(W); acc=0
    for tk,c,wt in zip(toks,clean,W):
        ws=t+d*acc/tot; acc+=wt; we=t+d*acc/tot
        words.append({"i":wi,"w":c,"s":round(ws,3),"e":round(we-0.02,3),"k":'*' in tk,"p":li,"spk":"B"}); wi+=1
    lines.append({"p":li,"spk":"B","s":round(t,3),"e":round(t+d,3)})
    last=li==len(L)-1; gap=0 if last else GAP
    chunks+=[s,np.zeros(int(gap*SR),np.float32)]; t+=d+gap
total=round(t+TAIL,2); chunks.append(np.zeros(int(TAIL*SR),np.float32))
sf.write(D+"/raw.wav",np.concatenate(chunks),SR)
subprocess.run(["ffmpeg","-y","-v","error","-i",D+"/raw.wav","-af",
 "highpass=f=70,equalizer=f=180:t=q:w=1:g=2,equalizer=f=3500:t=q:w=1:g=2,acompressor=threshold=-20dB:ratio=3:attack=5:release=80,aecho=0.8:0.5:25:0.06,loudnorm=I=-14:TP=-1.5",
 "-ar","48000","-ac","1",D+"/voz.wav"],check=True)
json.dump({"total":total,"words":words,"lines":lines},open(D+"/words.json","w"),ensure_ascii=False)
print("total",total,"palabras",len(words))
