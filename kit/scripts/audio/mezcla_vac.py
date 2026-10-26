import json, numpy as np, soundfile as sf, subprocess, sys
sys.path.insert(0,'/home/claude/kit')
from kit import *
D='/home/claude/video/app/public/vac'
d=json.load(open(f'{D}/words.json')); W={w['i']:w for w in d['words']}
v,sr=sf.read(f'{D}/voz.wav',dtype='float32'); assert sr==48000
if v.ndim>1: v=v.mean(1)
last=max(w['e'] for w in W.values()); TOT=round(round((last+5.2)*100)/100*30)/30
N=int(TOT*SR); v=np.pad(v,(0,max(0,N-len(v))))[:N]; fx=np.zeros(N)
F=lambda s: round(s*30)
SCw=[0,16,27,38,50,70,79,93,105,113,128,156,161]
starts=[0]+[F(W[w]['s']-0.14)/30 for w in SCw[1:]]
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
add(impact(0.5),T(6)+0.3,-11)
add(ding(1568,0.9),T(12)-0.1,-13)
add(stamp(),T(13)-4/30,-8)
add(pop(900),T(18)-6/30,-11); add(pop(1100),T(20)-3/30,-11)
add(pop(800),T(29)-6/30,-11); add(pop(1000),T(31)-3/30,-11); add(ding(1320,0.8),T(37),-14)
add(pop(700),T(52)-6/30,-12); add(whoosh(0.3,True),T(54)-0.25,-13); add(ding(1760,0.8),T(66),-14)
for w in [71,74,77]: add(whoosh(0.25,True),T(w)-0.3,-12)
add(ding(1568,0.8),T(88),-14); add(pop(1200),T(91),-12)
for i in range(5): add(pop(900+i*120),T(100)+i*3/30+0.1,-14)
add(down(),T(106)-2/30,-13); add(impact(0.5),T(109)-6/30,-9)
for i,w in enumerate([115,123,124,126]): add(pop(800+i*120),T(w)-6/30,-12)
for i,w in enumerate([133,143]): add(pop(900+i*150),T(w)-6/30,-12)
add(stamp(),T(153)-4/30,-6)
add(tick(1500),T(158)-3/30,-11); add(tick(1700),T(160)-3/30,-11)
add(bloop(),T(166),-10)
add(click(),T(169)+4/30,-9)
dur=N/SR
subprocess.run(['python3','/home/claude/kit/musica2.py',str(dur),'/tmp/mus.wav',str(starts[3])],check=True)
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
