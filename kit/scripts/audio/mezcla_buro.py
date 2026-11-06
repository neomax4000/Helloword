import json, numpy as np, soundfile as sf, subprocess, sys
sys.path.insert(0,'/home/claude/kit')
from kit import *
D='/home/claude/video/app/public/buro'
d=json.load(open(f'{D}/words.json')); W={w['i']:w for w in d['words']}
v,sr=sf.read(f'{D}/voz.wav',dtype='float32'); assert sr==48000
if v.ndim>1: v=v.mean(1)
N=len(v); fx=np.zeros(N)
F=lambda s: round(s*30)
SCw=[0,14,25,37,52,65,79,91,103,116,130,143,159,170,179,188]
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
    if k==6: add(riser(0.5),t-0.5+0.05,-9); add(impact(),t+3/30,-5)   # llamada a seguir
    else: add(whoosh(0.38,up=k%2==0),t-0.29,-7)
add(impact(0.6),T(0)-0.02,-9)
add(stamp(),T(6)-0.05,-12)         # lista negra
add(buzz(),T(10)+0.05,-12)
add(buzz(0.3),T(14)+0.02,-12)      # no lo es
add(pop(800),T(21)-0.1,-13)
add(ding(1568,1.0),T(27),-13)      # empresa
for i in range(3): add(pop(900+i*120),T(35)-0.05+i*0.12,-13)
add(ding(1568,0.8),T(46),-13); add(buzz(0.2),T(50),-13)   # a tiempo / atraso
add(pop(900),T(58)-0.05,-12); add(pop(1000),T(63)-0.05,-12)
add(buzz(0.25),T(68)-0.02,-12); add(pop(800),T(76)-0.05,-12)
add(ding(1760,1.0),T(97),-12)      # gratis
add(pop(900),T(100)-0.05,-13)
add(pop(900),T(109)-0.05,-13); add(pop(1100),T(113)-0.05,-13)
add(buzz(0.2),T(120)-0.02,-13); add(ding(1760,0.9),T(127),-13)
add(bloop(),T(133)-0.1,-10); add(stamp(),T(138)-0.05,-12)
add(buzz(0.3),T(143)-0.02,-12); add(stamp(),T(151)-0.05,-12)
for i in range(5): add(ding(1500+i*110,0.4),T(164)-0.05+i*0.16,-14)
add(pop(900),T(172)-0.05,-12)
add(bloop(),T(179)-0.1,-10)
add(ding(1760,0.9),T(192),-13)
dur=N/SR
subprocess.run(['python3','/home/claude/kit/musica2.py',str(dur),'/tmp/mus.wav',str(starts[6])],check=True)
m,_=sf.read('/tmp/mus.wav',dtype='float32'); m=m[:N] if len(m)>=N else np.pad(m,((0,N-len(m)),(0,0)))
sf.write('/tmp/vfx.wav',np.stack([v+fx,v+fx],1).astype(np.float32),SR); sf.write('/tmp/vonly.wav',v,SR); sf.write('/tmp/m.wav',m,SR)
subprocess.run(['ffmpeg','-y','-v','error','-i','/tmp/vfx.wav','-i','/tmp/m.wav','-i','/tmp/vonly.wav','-filter_complex',
 '[1:a]volume=0.5[m];[2:a]aformat=channel_layouts=stereo[sc];[m][sc]sidechaincompress=threshold=0.03:ratio=6:attack=15:release=350[md];[0:a][md]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.93[a]',
 '-map','[a]','-ar','48000',f'{D}/voz_mix.wav'],check=True)
mx,_=sf.read(f'{D}/voz_mix.wav'); mx=mx.mean(1)
db=lambda x:20*np.log10(np.sqrt(np.mean(x**2))+1e-9)
for t in starts[1:7]:
    a,b=int((t-0.3)*SR),int(t*SR); print('pausa',round(t,2),'voz',round(db(v[a:b]),1),'mezcla',round(db(mx[a:b]),1))
print('starts',[round(s,2) for s in starts])
