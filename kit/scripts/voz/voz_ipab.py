import json, subprocess, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
k=Kokoro("/home/claude/video/voz/kokoro-v1.0.onnx","/home/claude/video/voz/voices-v1.0.bin")
V=np.load("/home/claude/video/voz/voices-v1.0.bin")
VO={'B':V["em_alex"]*0.6+V["im_nicola"]*0.4}
SR=24000
# (hablante, pantalla con *clave*, hablado, velocidad, pausa después)
L=[
('B',"¿Si tu *banco quiebra* mañana, de verdad te *devuelven* tu dinero?","¿Si tu banco quiebra mañana, de verdad te devuelven tu dinero?",.97,.6),
('B',"Ni *todo*, ni *nada*. Depende de *dónde* lo tengas y de *cuánto*.","Ni todo, ni nada. Depende de dónde lo tengas y de cuánto.",1.0,.55),
('B',"Para eso existe el *IPAB*, el Instituto para la *Protección al Ahorro Bancario*.","Para eso existe el Ípab, el Instituto para la Protección al Ahorro Bancario.",1.0,.55),
('B',"Si un banco *deja de operar*, el IPAB *paga* a los ahorradores.","Si un banco deja de operar, el Ípab paga a los ahorradores.",1.0,.55),
('B',"Pero con un *límite*: *cuatrocientas mil UDIS*, por *persona* y por *banco*.","Pero con un límite: cuatrocientas mil Údis, por persona y por banco.",.97,.6),
('B',"La *UDI* es una unidad que se *ajusta con la inflación*, así que ese límite se *actualiza*.","La Údi es una unidad que se ajusta con la inflación, así que ese límite se actualiza.",1.0,.6),
('B',"Y *sígueme*, porque lo que sigue es lo que *casi nadie* revisa.","Y sígueme, porque lo que sigue es lo que casi nadie revisa.",1.0,.7),
('B',"Protege *cuentas* de ahorro, de nómina y de cheques, y también *pagarés* y depósitos a plazo.","Protege cuentas de ahorro, de nómina y de cheques, y también pagarés y depósitos a plazo.",.97,.55),
('B',"Lo que *no* protege: *fondos de inversión*, *casas de bolsa*, *cajas de ahorro* y *cooperativas*.","Lo que no protege: fondos de inversión, casas de bolsa, cajas de ahorro y cooperativas.",.97,.6),
('B',"Un fondo de inversión *no es un depósito*: su valor *puede subir o bajar*.","Un fondo de inversión no es un depósito: su valor puede subir o bajar.",1.0,.6),
('B',"Y ojo: el límite es *por banco*. Si repartes, cada banco *cuenta aparte*.","Y ojo: el límite es por banco. Si repartes, cada banco cuenta aparte.",1.0,.6),
('B',"No es teoría: en *2025* el IPAB *pagó* a ahorradores de un banco que *dejó de operar*.","No es teoría: en dos mil veinticinco el Ípab pagó a ahorradores de un banco que dejó de operar.",.97,.6),
('B',"Revisa *en qué institución* está tu dinero y *cuánto* tienes en cada una.","Revisa en qué institución está tu dinero y cuánto tienes en cada una.",1.0,.6),
('B',"Esto es *información educativa*, no una recomendación de inversión.","Esto es información educativa, no una recomendación de inversión.",1.0,.6),
('B',"¿Sabes *dónde* está tu dinero y si está *protegido*?","¿Sabes dónde está tu dinero y si está protegido?",.97,.5),
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
 "-ar","48000","-ac","1","/home/claude/video/app/public/ipab/voz.wav"],check=True)
json.dump({"total":total,"words":words,"lines":lines},open("/home/claude/video/app/public/ipab/words.json","w"),ensure_ascii=False)
print("total",total,"palabras",len(words))
for l in lines: print(l['p'],l['spk'],l['s'],l['e'],'first word',next(w['i'] for w in words if w['p']==l['p']))
