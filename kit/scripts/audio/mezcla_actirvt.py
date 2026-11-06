import json, numpy as np, soundfile as sf, subprocess, sys
sys.path.insert(0,'/home/claude/kit')
from kit import *
D='/home/claude/video/app/public/actirvt'
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
    if k==1: add(riser(0.6),t-0.6+0.05,-9); add(impact(),t+4/30,-5)
    else: add(whoosh(0.38,up=k%2==0),t-0.29,-7)
# efectos en las pausas (antes de la palabra)
add(pop(900),T(5)-4/30,-12); add(pop(1000),T(7)-4/30,-12); add(ding(1568,0.8),T(9)-4/30,-13)   # bolsa, escudo, moneda
add(ding(1568,0.8),T(17)-4/30,-13); add(pop(900),T(19)-4/30,-12)                              # logo, capital protegido
add(pop(900),T(25)-4/30,-12)                                                                  # bolsa EE.UU.
add(pop(800),T(33)-4/30,-12); add(pop(1000),T(37)-4/30,-12)                                   # deuda, bolsa
add(pop(900),T(43)-4/30,-12); add(pop(1100),T(45)-4/30,-12); add(down(),T(50)-2/30,-12)        # piso, moneda, caída
for i in range(6): add(pop(750+i*70),T(58)+(i*6)/30-4/30,-14)                                 # meses
add(ding(1318,0.8),T(61)+6/30,-13); add(stamp(),T(64)-3/30,-9)                                # escudo, ventas anuales
for w in (73,74,75): add(pop(700+w*6),T(w)-4/30,-12)                                          # fechas
add(pop(900),T(76)-4/30,-12); add(pop(1000),T(77)-4/30,-12)                                   # consejo
add(bloop(),T(86)-4/30,-12); add(down(),T(88)-2/30,-12); add(stamp(),T(90)-3/30,-9)           # riesgo
add(bloop(),T(99)-4/30,-12); add(bloop(),T(101)-4/30,-12); add(bloop(),T(103)-4/30,-12)       # pregunta
add(bloop(),T(104)-0.35,-10); add(chaching(),T(104)+0.2,-14)                                  # escríbeme
add(click(),T(110)+4/30,-9)                                                                   # sígueme
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
