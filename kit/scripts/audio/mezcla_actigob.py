import json, numpy as np, soundfile as sf, subprocess, sys
sys.path.insert(0,'/home/claude/kit')
from kit import *
D='/home/claude/video/app/public/actigob'
d=json.load(open(f'{D}/words.json')); W=d['words']; PH=d['phrases']
v,sr=sf.read(f'{D}/voz.wav',dtype='float32'); assert sr==48000
if v.ndim>1: v=v.mean(1)
N=len(v); fx=np.zeros(N)
F=lambda s: round(s*30)
SCp=[0,2,4,6,8,10,11,14,15,16,18,21,22,23]
starts=[0]+[F(PH[p]['s']-0.12)/30 for p in SCp[1:]]
rms=np.sqrt(np.mean(v[np.abs(v)>0.02]**2)); print('voz rms dB',20*np.log10(rms))
def add(x,t,db):  # db relativo al RMS de la voz
    g=rms*10**(db/20)/np.sqrt(np.mean(x**2)+1e-9)
    i=int(t*SR); j=min(N,i+len(x))
    if 0<=i<N: fx[i:j]+=x[:j-i]*g
ev=[]
# transiciones: whoosh terminando justo en el corte (vive en la pausa)
for k,t in enumerate(starts[1:],1):
    if k==2:  # intro ACTIGOB: riser + impacto
        r=riser(0.55); add(r,t-0.55+0.05,-9); add(impact(),t+4/30,-4); ev+=['riser+impact']
    else:
        w=whoosh(0.4,up=k%2==0); add(w,t-0.30,-7); ev.append('whoosh')
T=lambda i: W[i]['s']
# palomitas de días
for i in range(5): add(tick(1600+i*120),T(59)+i*5/30,-12)
add(chaching(),T(69)+0.05,-12)
add(stamp(),T(51),-6); add(ding(1568,1.2),T(51)+0.08,-14)
for n,sc in [(1,8),(2,9),(3,10)]: add(pop(700+n*120),starts[sc]+2/30,-10)
add(pop(1200),T(18),-12)            # disponible
add(pop(900),T(102),-13)            # oportunidades (destello)
add(whoosh(0.3,True),T(126),-14)    # enviar mensaje
for i in range(3): add(pop(1000+i*150),T(130)+i*6/30,-13)
add(click(),T(139),-8); add(ding(1760,0.9),T(139)+8/30,-12)
add(impact(0.6),F(W[-1]['e']+0.4)/30,-12)  # cierre/logo
# música
dur=N/SR
subprocess.run(['python3','/home/claude/kit/musica2.py',str(dur),'/tmp/mus.wav',str(starts[2])],check=True)
m,_=sf.read('/tmp/mus.wav',dtype='float32'); m=m[:N] if len(m)>=N else np.pad(m,((0,N-len(m)),(0,0)))
sf.write('/tmp/vfx.wav',np.stack([v+fx,v+fx],1).astype(np.float32),SR)
sf.write('/tmp/vonly.wav',v,SR)
sf.write('/tmp/m.wav',m,SR)
subprocess.run(['ffmpeg','-y','-v','error','-i','/tmp/vfx.wav','-i','/tmp/m.wav','-i','/tmp/vonly.wav','-filter_complex',
 '[1:a]volume=0.5[m];[2:a]aformat=channel_layouts=stereo[sc];[m][sc]sidechaincompress=threshold=0.03:ratio=6:attack=15:release=350[md];[0:a][md]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.93[a]',
 '-map','[a]','-ar','48000',f'{D}/voz_mix.wav'],check=True)
print(ev)
