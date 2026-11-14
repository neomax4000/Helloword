import json, numpy as np, soundfile as sf, subprocess, sys, os
HERE=os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0,HERE)
from kit import *
D=os.environ.get('OUT_DIR','/home/claude/helloword/kit/app/public/brian')
d=json.load(open(f'{D}/words.json')); L=d['lines']
v,sr=sf.read(f'{D}/voz.wav',dtype='float32'); assert sr==48000
if v.ndim>1: v=v.mean(1)
N=len(v); fx=np.zeros(N)
F=lambda s: round(s*30)
SCl=[0,1,2,5,7,8]   # primera línea de cada escena (igual que SCENES en outlook.tsx)
starts=[0]+[F(L[p]['s']-0.14)/30 for p in SCl[1:]]
rms=np.sqrt(np.mean(v[np.abs(v)>0.02]**2)); print('voz rms dB',round(20*np.log10(rms),1))
def add(x,t,db):
    g=rms*10**(db/20)/np.sqrt(np.mean(x**2)+1e-9)
    i=int(t*SR); j=min(N,i+len(x))
    if 0<=i<N: fx[i:j]+=x[:j-i]*g
add(ding(1760,1.2),L[9]['e']+0.3,-20)   # cierre suave
dur=N/SR
subprocess.run(['python3',f'{HERE}/musica2.py',str(dur),'/tmp/mus_b.wav',str(starts[3])],check=True)
m,_=sf.read('/tmp/mus_b.wav',dtype='float32'); m=m[:N] if len(m)>=N else np.pad(m,((0,N-len(m)),(0,0)))
sf.write('/tmp/vfx_b.wav',np.stack([v+fx,v+fx],1).astype(np.float32),SR); sf.write('/tmp/vonly_b.wav',v,SR); sf.write('/tmp/m_b.wav',m,SR)
subprocess.run(['ffmpeg','-y','-v','error','-i','/tmp/vfx_b.wav','-i','/tmp/m_b.wav','-i','/tmp/vonly_b.wav','-filter_complex',
 '[1:a]volume=0.38[m];[2:a]aformat=channel_layouts=stereo[sc];[m][sc]sidechaincompress=threshold=0.03:ratio=6:attack=15:release=350[md];[0:a][md]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.93,loudnorm=I=-15:TP=-1.5:LRA=11[a]',
 '-map','[a]','-ar','48000',f'{D}/voz_mix.wav'],check=True)
mx,_=sf.read(f'{D}/voz_mix.wav'); mx=mx.mean(1)
db=lambda x:20*np.log10(np.sqrt(np.mean(x**2))+1e-9)
for t in starts[1:]:
    a,b=int((t-0.3)*SR),int(t*SR); print('pausa',round(t,2),'voz',round(db(v[a:b]),1),'mezcla',round(db(mx[a:b]),1))
print('starts',[round(s,2) for s in starts])
