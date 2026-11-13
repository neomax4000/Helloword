import json, numpy as np, soundfile as sf, subprocess, sys
sys.path.insert(0,'/home/claude/kit')
from kit import *
D='/home/claude/video/app/public/udiprueba'
d=json.load(open(f'{D}/words.json')); W={w['i']:w for w in d['words']}
v,sr=sf.read(f'{D}/voz.wav',dtype='float32'); assert sr==48000
if v.ndim>1: v=v.mean(1)
N=len(v); fx=np.zeros(N)
F=lambda s: round(s*30)
SCw=[0,8,18,25,38,49,58]
starts=[0]+[F(W[w]['s']-0.14)/30 for w in SCw[1:]]
rms=np.sqrt(np.mean(v[np.abs(v)>0.02]**2)); print('voz rms dB',round(20*np.log10(rms),1))
def add(x,t,db):
    g=rms*10**(db/20)/np.sqrt(np.mean(x**2)+1e-9)
    i=int(t*SR); j=min(N,i+len(x))
    if 0<=i<N: fx[i:j]+=x[:j-i]*g
def buzz(dd=0.28):
    n=int(dd*SR); t=np.arange(n)/SR
    return np.sign(np.sin(2*np.pi*140*t))*0.6*np.exp(-t*6)+np.sin(2*np.pi*95*t)*0.4*np.exp(-t*6)
T=lambda i: W[i]['s']
for k,t in enumerate(starts[1:],1):
    add(whoosh(0.22,up=k%2==0),t-0.2,-12)
add(impact(0.5),T(0)-0.02,-14)
add(pop(900),T(4)-0.05,-15)           # valor
add(ding(1568,0.8),T(7),-15)          # días
add(pop(800),T(10)-0.05,-15)          # unidad de cuenta
add(ding(1760,0.8),T(17),-15)         # inflación
add(pop(700),T(19)-0.05,-15)          # Banxico
add(ding(1976,0.9),T(24),-15)         # día
add(pop(800),T(28)-0.05,-15)          # créditos
add(ding(1760,0.9),T(34),-15)         # ajusta
add(pop(800),T(41)-0.05,-15)          # inflación
add(ding(1976,0.9),T(48),-15)         # sube
add(pop(800),T(52)-0.05,-15)          # revisa
add(ding(1760,0.9),T(57),-15)         # pago
add(ding(1976,0.9),T(63),-15)
dur=N/SR
subprocess.run(['python3','/home/claude/kit/musica2.py',str(dur),'/tmp/mus.wav',str(starts[3])],check=True)
m,_=sf.read('/tmp/mus.wav',dtype='float32'); m=m[:N] if len(m)>=N else np.pad(m,((0,N-len(m)),(0,0)))
sf.write('/tmp/vfx.wav',np.stack([v+fx,v+fx],1).astype(np.float32),SR); sf.write('/tmp/vonly.wav',v,SR); sf.write('/tmp/m.wav',m,SR)
subprocess.run(['ffmpeg','-y','-v','error','-i','/tmp/vfx.wav','-i','/tmp/m.wav','-i','/tmp/vonly.wav','-filter_complex',
 '[1:a]volume=0.5[m];[2:a]aformat=channel_layouts=stereo[sc];[m][sc]sidechaincompress=threshold=0.03:ratio=6:attack=15:release=350[md];[0:a][md]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.93[a]',
 '-map','[a]','-ar','48000',f'{D}/voz_mix.wav'],check=True)
mx,_=sf.read(f'{D}/voz_mix.wav'); mx=mx.mean(1)
db=lambda x:20*np.log10(np.sqrt(np.mean(x**2))+1e-9)
for t in starts[1:]:
    a,b=int((t-0.3)*SR),int(t*SR); print('pausa',round(t,2),'voz',round(db(v[a:b]),1),'mezcla',round(db(mx[a:b]),1))
