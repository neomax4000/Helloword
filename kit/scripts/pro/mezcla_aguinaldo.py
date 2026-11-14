# Mezcla del piloto AGUINALDO (Estándar Pro v1): efectos en las pausas, golpes suaves en los reveals, música con ducking
import json, numpy as np, soundfile as sf, subprocess, sys
sys.path.insert(0,'/home/claude/kit')
from kit import *
D='/home/claude/v23/app/public/aguinaldo'
d=json.load(open('words.json')); W=d['words']; B=d['blocks']
T=lambda i: W[i]['s']
A=[0]+[b['s']-0.1 for b in B[1:]]
TOTAL=B[-1]['e']+0.28
v,sr=sf.read('voz.wav',dtype='float32'); assert sr==48000
N=int(TOTAL*SR); v=np.pad(v,(0,max(0,N-len(v))))[:N]
fx=np.zeros(N)
rms=np.sqrt(np.mean(v[np.abs(v)>0.02]**2))
def add(x,t,db):
    g=rms*10**(db/20)/np.sqrt(np.mean(x**2)+1e-9)
    i=int(t*SR); j=min(N,i+len(x))
    if 0<=i<N: fx[i:j]+=x[:j-i]*g
# transiciones (en la pausa previa a cada escena)
for k in range(1,len(A)):
    if k==5: continue
    add(whoosh(0.26,up=k%2==1),A[k]-0.2,-10)
# gancho
add(pop(700,0.09),T(2)-0.05,-14)          # tache
add(stamp(),T(6)-0.06,-9)                 # sello ES LEY
# conteo del 15
for k in range(8): add(tick(1500+k*60),T(17)-0.05+k*0.07,-22)
add(pop(1000,0.08),T(21)-0.05,-15)        # mínimo por ley
add(ding(1568,0.7),B[3]['e']+0.02,-15)    # $6,000 (en la pausa)
add(pop(900,0.08),T(37)-0.05,-15)         # círculo del 20
# «Y tres»: riser en la pausa + golpe
add(riser(0.3),A[5]-0.22,-11); add(impact(0.7),A[5]+0.02,-8)
add(pop(600,0.09),T(73)-0.02,-14); add(pop(520,0.09),T(75)-0.02,-14)   # taches
add(ding(1760,0.8),B[8]['e']+0.02,-15)    # gratis
dur=N/SR
subprocess.run(['python3','/home/claude/kit/musica2.py',str(dur),'mus.wav',str(A[2])],check=True)
m,_=sf.read('mus.wav',dtype='float32'); m=m[:N] if len(m)>=N else np.pad(m,((0,N-len(m)),(0,0)))
fade=np.ones(N); n=int(.12*SR); fade[-n:]=np.linspace(1,0,n); m=m*fade[:,None]; fx*=fade
sf.write('vfx.wav',np.stack([v+fx,v+fx],1).astype(np.float32),SR); sf.write('vonly.wav',v,SR); sf.write('m.wav',m.astype(np.float32),SR)
subprocess.run(['ffmpeg','-y','-v','error','-i','vfx.wav','-i','m.wav','-i','vonly.wav','-filter_complex',
 '[1:a]volume=0.42[m];[2:a]aformat=channel_layouts=stereo[sc];[m][sc]sidechaincompress=threshold=0.03:ratio=7:attack=12:release=300[md];[0:a][md]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.93[a]',
 '-map','[a]','-ar','48000',f'{D}/voz_mix.wav'],check=True)
subprocess.run(['ffmpeg','-y','-v','error','-i',f'{D}/voz_mix.wav','-af','volume=-2.3dB','-ar','48000',f'{D}/m2.wav'],check=True); import os; os.replace(f'{D}/m2.wav',f'{D}/voz_mix.wav')
print('total',round(TOTAL,3))
