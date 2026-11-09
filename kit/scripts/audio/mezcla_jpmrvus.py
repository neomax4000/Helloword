import json, numpy as np, soundfile as sf, subprocess, sys
sys.path.insert(0,'/home/claude/kit')
from kit import *
D='/home/claude/video/app/public/jpmrvus'
d=json.load(open(f'{D}/words.json')); W={w['i']:w for w in d['words']}
v,sr=sf.read(f'{D}/voz.wav',dtype='float32'); assert sr==48000
if v.ndim>1: v=v.mean(1)
TOT=d['total']; N=int(TOT*SR); v=np.pad(v,(0,max(0,N-len(v))))[:N]; fx=np.zeros(N)
F=lambda s: round(s*30)
LN=d['lines']; WL=d['words']
w0=lambda p: next(w['i'] for w in WL if w['p']==p)
SCw=[0,7,13,18,23,26,32,39,43,54,60,71,80,87]
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
    add(whoosh(0.38,up=k%2==0),t-0.29,-7)
    if k==3: add(impact(),t+4/30,-5)
# efectos en las pausas (antes de la palabra)
add(pop(900),T(3)-4/30,-12); add(pop(1000),T(8)-4/30,-12); add(pop(900),T(11)-4/30,-12)       # value
add(bloop(),T(14)-4/30,-12)
for i in range(5): add(pop(700+i*90),T(14)+(i*3)/30,-14)                                      # barras growth
add(ding(1568,0.8),T(16)-6/30,-13)                                                            # cohete
add(ding(1568,0.8),T(19)-4/30,-13)                                                            # logo / junta
add(pop(900),T(24)-4/30,-12); add(pop(1100),T(25)-4/30,-12)                                   # J.P. Morgan
add(click(),T(27)+6/30,-9)                                                                    # sígueme
for w in (34,35,36): add(pop(700+w*6),T(w)-4/30,-12)                                          # emisoras
add(ding(1318,0.8),T(37)-4/30,-13)                                                            # convicción
add(pop(900),T(39)-4/30,-12); add(pop(1000),T(41)-4/30,-12)                                   # mitad / mitad
add(pop(800),T(48)-4/30,-12); add(pop(1000),T(49)-4/30,-12); add(ding(1568,0.8),T(52)-4/30,-13)  # pocas, calidad
add(bloop(),T(58)-10/30,-12)                                                                  # largo plazo
for i in range(5): add(pop(750+i*70),T(63)+(i*4)/30-2/30,-14)                                 # días
add(ding(1318,0.8),T(69)-5/30,-13)                                                            # 24 h
add(bloop(),T(74)-4/30,-12); add(down(),T(76)-2/30,-12); add(stamp(),T(77)-3/30,-9)          # riesgo
add(bloop(),T(80)-4/30,-12); add(bloop(),T(82)-4/30,-12); add(bloop(),T(85)-4/30,-12)       # pregunta
add(bloop(),T(87)-0.35,-10); add(chaching(),T(87)+0.2,-14)                                    # escríbeme
add(click(),T(95)+4/30,-9)                                                                    # sígueme
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
