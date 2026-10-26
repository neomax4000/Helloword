import json, numpy as np, soundfile as sf, subprocess, sys
sys.path.insert(0,'/home/claude/kit')
from kit import *
D='/home/claude/video/app/public/fondos'
d=json.load(open(f'{D}/words.json')); W={w['i']:w for w in d['words']}
v,sr=sf.read(f'{D}/voz.wav',dtype='float32'); assert sr==48000
if v.ndim>1: v=v.mean(1)
N=len(v); fx=np.zeros(N)
F=lambda s: round(s*30)
SCw=[0,11,31,44,61,74,83,96,105,110,123,132,138]
starts=[0]+[F(W[w]['s']-0.14)/30 for w in SCw[1:]]
rms=np.sqrt(np.mean(v[np.abs(v)>0.02]**2)); print('voz rms dB',round(20*np.log10(rms),1))
def add(x,t,db):
    g=rms*10**(db/20)/np.sqrt(np.mean(x**2)+1e-9)
    i=int(t*SR); j=min(N,i+len(x))
    if 0<=i<N: fx[i:j]+=x[:j-i]*g
def buzz(d=0.28):
    n=int(d*SR); t=np.arange(n)/SR
    return np.sign(np.sin(2*np.pi*140*t))*0.6*np.exp(-t*6)+np.sin(2*np.pi*95*t)*0.4*np.exp(-t*6)
def bloop(d=0.25):
    n=int(d*SR); t=np.arange(n)/SR
    return np.sin(2*np.pi*np.cumsum(np.linspace(300,1200,n))/SR)*np.exp(-t*14)
T=lambda i: W[i]['s']
for k,t in enumerate(starts[1:],1):
    if k==4: add(riser(0.5),t-0.5+0.05,-9); add(impact(),t+3/30,-5)
    else: add(whoosh(0.38,up=k%2==0),t-0.29,-7)
add(impact(0.6),T(9),-8)
for i in range(5): add(pop(800+i*90),T(9)+(6+i*4)/30+0.1,-13)
for i,w in enumerate([25,26,27]): add(pop(700+i*150),T(w)+11/30,-12)
add(ding(1568,1.0),T(43),-13)
add(buzz(),T(51)+0.05,-11)
add(ding(1760,0.9),T(57),-13)
for i in range(3): add(tick(1500+i*200),T(80)+i*5/30,-11)
add(whoosh(0.25,True),T(91),-13)
for w in [105,106,108]: add(pop(1000),T(w)-0.05,-11)
add(ding(1976,0.9),T(119),-12)
add(bloop(),T(130),-9)
for i in range(3): add(pop(1100+i*150),T(144)+i*6/30,-13)
dur=N/SR
subprocess.run(['python3','/home/claude/kit/musica2.py',str(dur),'/tmp/mus.wav',str(starts[4])],check=True)
m,_=sf.read('/tmp/mus.wav',dtype='float32'); m=m[:N] if len(m)>=N else np.pad(m,((0,N-len(m)),(0,0)))
sf.write('/tmp/vfx.wav',np.stack([v+fx,v+fx],1).astype(np.float32),SR); sf.write('/tmp/vonly.wav',v,SR); sf.write('/tmp/m.wav',m,SR)
subprocess.run(['ffmpeg','-y','-v','error','-i','/tmp/vfx.wav','-i','/tmp/m.wav','-i','/tmp/vonly.wav','-filter_complex',
 '[1:a]volume=0.5[m];[2:a]aformat=channel_layouts=stereo[sc];[m][sc]sidechaincompress=threshold=0.03:ratio=6:attack=15:release=350[md];[0:a][md]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.93[a]',
 '-map','[a]','-ar','48000',f'{D}/voz_mix.wav'],check=True)
mx,_=sf.read(f'{D}/voz_mix.wav'); mx=mx.mean(1)
db=lambda x:20*np.log10(np.sqrt(np.mean(x**2))+1e-9)
for t in starts[1:6]:
    a,b=int((t-0.3)*SR),int(t*SR); print('pausa',round(t,2),'voz',round(db(v[a:b]),1),'mezcla',round(db(mx[a:b]),1))
print('starts',[round(s,2) for s in starts])
