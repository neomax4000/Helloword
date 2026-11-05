import json, numpy as np, soundfile as sf, subprocess, sys
sys.path.insert(0,'/home/claude/kit')
from kit import *
D='/home/claude/video/app/public/acti500'
d=json.load(open(f'{D}/words.json')); W={w['i']:w for w in d['words']}
v,sr=sf.read(f'{D}/voz.wav',dtype='float32'); assert sr==48000
if v.ndim>1: v=v.mean(1)
TOT=d['total']; N=int(TOT*SR); v=np.pad(v,(0,max(0,N-len(v))))[:N]; fx=np.zeros(N)
F=lambda s: round(s*30)
LN=d['lines']; WL=d['words']
w0=lambda p: next(w['i'] for w in WL if w['p']==p)
SCp=[0,1,2,3,4,5,6,7,8,9]
starts=[0]+[F(LN[p]['s']-0.14)/30 for p in SCp[1:]]
rms=np.sqrt(np.mean(v[np.abs(v)>0.02]**2)); print('voz rms dB',round(20*np.log10(rms),1))
def add(x,t,db):
    g=rms*10**(db/20)/np.sqrt(np.mean(x**2)+1e-9)
    i=int(t*SR); j=min(N,i+len(x))
    if 0<=i<N: fx[i:j]+=x[:j-i]*g
def bloop(d=0.25):
    n=int(d*SR); t=np.arange(n)/SR
    return np.sin(2*np.pi*np.cumsum(np.linspace(300,1200,n))/SR)*np.exp(-t*14)
def down(d=0.6):
    n=int(d*SR); t=np.arange(n)/SR
    return np.sin(2*np.pi*np.cumsum(np.linspace(700,160,n))/SR)*np.exp(-t*4)
T=lambda i: W[i]['s']
for k,t in enumerate(starts[1:],1):
    if k==3: add(riser(0.6),t-0.6+0.05,-9); add(impact(),t+4/30,-5)
    else: add(whoosh(0.38,up=k%2==0),t-0.29,-7)
# efectos en las pausas (antes de la palabra) -- escena grid
for i in range(6): add(pop(800+i*60),T(7)-0.25+i*0.04,-14)        # 500 puntos
add(pop(1000),T(12)-4/30,-12)                                       # Estados Unidos
add(stamp(),T(16)-4/30,-10)                                         # S&P 500
for i,w in enumerate([26,27,27,28,28]): add(pop(700+i*100),T(w)-5/30,-12)  # burbujas
add(ding(1568,0.8),T(34)-4/30,-13); add(pop(900),T(40)-4/30,-12); add(pop(1000),T(38)-4/30,-12)  # intro
for w in [43,49,51]: add(pop(850+w*3),T(w)-5/30,-12)               # tarjetas ETF
for i in range(5): add(pop(900+i*90),T(55)+(i*4)/30-5/30,-13)      # semana
add(stamp(),T(62)-4/30,-9)                                          # 24 horas
add(bloop(),T(68)-4/30,-12)                                         # largo plazo
add(bloop(),T(76)-4/30,-12); add(down(),T(78)-2/30,-12); add(stamp(),T(80)-3/30,-9)  # sube/baja/no es garantía
add(bloop(),T(84)-4/30,-12)                                         # pregunta
add(bloop(),T(91)-0.35,-10); add(chaching(),T(91)+0.2,-14)          # escríbeme
add(click(),T(96)+4/30,-9)                                          # sígueme
dur=N/SR
subprocess.run(['python3','/home/claude/kit/musica2.py',str(dur),'/tmp/mus.wav',str(starts[2])],check=True)
m,_=sf.read('/tmp/mus.wav',dtype='float32'); m=m[:N] if len(m)>=N else np.pad(m,((0,N-len(m)),(0,0)))
sf.write('/tmp/vfx.wav',np.stack([v+fx,v+fx],1).astype(np.float32),SR); sf.write('/tmp/vonly.wav',v,SR); sf.write('/tmp/m.wav',m,SR)
subprocess.run(['ffmpeg','-y','-v','error','-i','/tmp/vfx.wav','-i','/tmp/m.wav','-i','/tmp/vonly.wav','-filter_complex',
 '[1:a]volume=0.5[m];[2:a]aformat=channel_layouts=stereo[sc];[m][sc]sidechaincompress=threshold=0.03:ratio=6:attack=15:release=350[md];[0:a][md]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.93[a]',
 '-map','[a]','-ar','48000',f'{D}/voz_mix.wav'],check=True)
mx,_=sf.read(f'{D}/voz_mix.wav'); mx=mx.mean(1)
db=lambda x:20*np.log10(np.sqrt(np.mean(x**2))+1e-9)
for t in starts[1:6]:
    a,b=int((t-0.3)*SR),int(t*SR); print('pausa',round(t,2),'voz',round(db(v[a:b]),1),'mezcla',round(db(mx[a:b]),1))
print('dur',round(dur,2),'starts',[round(s,2) for s in starts])
