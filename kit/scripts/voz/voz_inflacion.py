import json, subprocess, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
k=Kokoro("/home/claude/video/voz/kokoro-v1.0.onnx","/home/claude/video/voz/voices-v1.0.bin")
V=np.load("/home/claude/video/voz/voices-v1.0.bin")
VO={'B':V["em_alex"]*0.6+V["im_nicola"]*0.4}
SR=24000
# (hablante, pantalla con *clave*, hablado, velocidad, pausa después)
L=[
('B',"¿Guardar tu dinero en el *colchón* es *ahorrar*… o *perderlo* poco a poco?","¿Guardar tu dinero en el colchón es ahorrar, o perderlo poco a poco?",.97,.6),
('B',"El billete *no cambia*. Lo que cambia es *lo que compras* con él.","El billete no cambia. Lo que cambia es lo que compras con él.",1.0,.55),
('B',"A eso se le llama *inflación*: las cosas *suben de precio* con el tiempo.","A eso se le llama inflación: las cosas suben de precio con el tiempo.",1.0,.55),
('B',"Con la misma cantidad, hoy llevas *menos* que hace unos años.","Con la misma cantidad, hoy llevas menos que hace unos años.",1.0,.55),
('B',"Tu dinero sigue ahí… pero su *poder de compra* se va *encogiendo*.","Tu dinero sigue ahí, pero su poder de compra se va encogiendo.",.97,.6),
('B',"En México, el *INEGI* mide cuánto suben los precios, y el *Banxico* busca mantener esa alza *baja y estable*.","En México, el Inégui mide cuánto suben los precios, y el Bansico busca mantener esa alza baja y estable.",1.0,.55),
('B',"Su meta es de *tres por ciento*, con un punto de margen.","Su meta es de tres por ciento, con un punto de margen.",1.0,.6),
('B',"Y *sígueme*, que lo que sigue es lo que *casi nadie* te explica.","Y sígueme, que lo que sigue es lo que casi nadie te explica.",1.0,.7),
('B',"Aunque la inflación sea *baja*, no *desaparece*: se acumula *año tras año*.","Aunque la inflación sea baja, no desaparece: se acumula año tras año.",.97,.55),
('B',"Y lo que está *quieto*, es lo que *más pierde*.","Y lo que está quieto, es lo que más pierde.",1.0,.6),
('B',"Cada peso tiene un *trabajo*: *emergencias*, *corto plazo* o *largo plazo*.","Cada peso tiene un trabajo: emergencias, corto plazo o largo plazo.",1.0,.55),
('B',"Y cada trabajo pide una *opción distinta*.","Y cada trabajo pide una opción distinta.",1.0,.55),
('B',"Tener *efectivo* a la mano es *sano*. Lo que cuesta es dejar *todo* quieto *para siempre*.","Tener efectivo a la mano es sano. Lo que cuesta es dejar todo quieto para siempre.",.97,.6),
('B',"Esto es *información educativa*, no una recomendación de inversión.","Esto es información educativa, no una recomendación de inversión.",1.0,.6),
('B',"¿*Cuánto* de tu dinero está *quieto* hoy?","¿Cuánto de tu dinero está quieto hoy?",.97,.5),
('B',"Si te sirvió, dale *like* y *sígueme*.","Si te sirvió, dale like, y sígueme.",1.0,0),
]
LEAD,TAIL=.3,5.0
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
 "-ar","48000","-ac","1","/home/claude/video/app/public/inflacion/voz.wav"],check=True)
json.dump({"total":total,"words":words,"lines":lines},open("/home/claude/video/app/public/inflacion/words.json","w"),ensure_ascii=False)
print("total",total,"palabras",len(words))
for l in lines: print(l['p'],l['spk'],l['s'],l['e'])
