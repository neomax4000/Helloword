import json, numpy as np, soundfile as sf, subprocess, sys
sys.path.insert(0,'/home/claude/kit')
from kit import *
D='/home/claude/video/app/public/vac2'
d=json.load(open(f'{D}/words.json')); W={w['i']:w for w in d['words']}
v,sr=sf.read(f'{D}/voz.wav',dtype='float32'); assert sr==48000
if v.ndim>1: v=v.mean(1)
TOT=d['total']; N=int(TOT*SR); v=np.pad(v,(0,max(0,N-len(v))))[:N]; fx=np.zeros(N)
F=lambda s: round(s*30)
LN=d['lines']; WL=d['words']
w0=lambda p: next(w['i'] for w in WL if w['p']==p)
SCp=[0,2,4,7,10,15,18,20,22,23]
starts=[0]+[F(LN[p]['s']-0.14)/30 for p in SCp[1:]]
rms=np.sqrt(np.mean(v[np.abs(v)>0.02]**2)); print('voz rms dB',round(20*np.log10(rms),1))
def add(x,t,db):
    g=rms*10**(db/20)/np.sqrt(np.mean(x**2)+1e-9)
    i=int(t*SR); j=min(N,i+len(x))
    if 0<=i<N: fx[i:j]+=x[:j-i]*g
def bloop(d=0.25):
    n=int(d*SR); t=np.arange(n)/SR
    return np.sin(2*np.pi*np.cumsum(np.linspace(300,1200,n))/SR)*np.exp(-t*14)
def buzz(d=0.28):
    n=int(d*SR); t=np.arange(n)/SR
    return np.sign(np.sin(2*np.pi*140*t))*0.6*np.exp(-t*6)+np.sin(2*np.pi*95*t)*0.4*np.exp(-t*6)
def down(d=0.6):
    n=int(d*SR); t=np.arange(n)/SR
    return np.sin(2*np.pi*np.cumsum(np.linspace(700,160,n))/SR)*np.exp(-t*4)
T=lambda i: W[i]['s']
for k,t in enumerate(starts[1:],1):
    if k==1: add(riser(0.5),t-0.5+0.05,-10); add(impact(),t+4/30,-6)
    else: add(whoosh(0.38,up=k%2==0),t-0.29,-7)
for l in LN:
    if l['spk']=='A' and l['p'] not in SCp: add(pop(1100),l['s']-0.08,-14)
T=lambda i: W[i]['s']
add(stamp(),T(w0(1)+4),-9)
for i in range(3): add(tick(1500+i*150),T(w0(5)+5)+i*0.12,-13)
add(ding(1568,0.8),T(w0(6)+1),-14)
add(ding(1760,0.8),T(w0(8)),-12)
for i,p in enumerate([12,13,14]): add(pop(900+i*150),T(w0(p))+6/30,-11)
add(chaching(),T(w0(16)+7),-12)
add(buzz(),T(w0(17)+5),-13)
for i in range(3): add(pop(800+i*120),T(w0(19)+2)+i*0.25,-13)
add(ding(1976,0.9),T(w0(21)),-12)
for j in [3,4,6]: add(tick(1600),T(w0(22)+j)-3/30,-12)
add(bloop(),T(w0(23)),-10)
add(click(),T(w0(24)+1)+4/30,-9)
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
