import numpy as np, sys, wave
sr=48000; dur=float(sys.argv[1]); out=sys.argv[2]; bpm=float(sys.argv[3]) if len(sys.argv)>3 else 92
n=int(sr*(dur+2)); t=np.arange(n)/sr
beat=60/bpm; bar=beat*4
# progresion Am - F - C - G
chords=[[57,60,64],[53,57,60],[48,52,55],[55,59,62]]
f=lambda m:440*2**((m-69)/12)
pad=np.zeros(n)
for i in range(int(t[-1]/bar)+1):
    s=int(i*bar*sr); e=min(n,int((i+1)*bar*sr))
    if s>=n: break
    tt=t[s:e]-t[s]; L=e-s
    env=np.minimum(1,tt/0.8)*np.minimum(1,(bar-tt)/0.8)
    for m in chords[i%4]:
        for det in (-0.003,0,0.003):
            pad[s:e]+=env*np.sin(2*np.pi*f(m)*(1+det)*tt)*0.07
    pad[s:e]+=env*np.sin(2*np.pi*f(chords[i%4][0]-12)*tt)*0.12  # bajo
# arpegio suave
arp=np.zeros(n)
step=beat/2
for k in range(int(t[-1]/step)):
    s=int(k*step*sr); L=int(0.35*sr)
    if s+L>=n: break
    ch=chords[int(k*step/bar)%4]; m=ch[k%3]+12
    tt=np.arange(L)/sr
    arp[s:s+L]+=np.sin(2*np.pi*f(m)*tt)*np.exp(-tt*9)*0.05
# pulso: bombo suave + hihat
perc=np.zeros(n); rng=np.random.default_rng(1)
for k in range(int(t[-1]/beat)):
    s=int(k*beat*sr)
    L=int(0.25*sr)
    if s+L>=n: break
    tt=np.arange(L)/sr
    if k%2==0: perc[s:s+L]+=np.sin(2*np.pi*(55+70*np.exp(-tt*30))*tt)*np.exp(-tt*12)*0.30
    h=int(0.05*sr); perc[s+int(beat*sr/2):s+int(beat*sr/2)+h]+=rng.standard_normal(h)*np.exp(-np.arange(h)/sr*80)*0.02 if s+int(beat*sr/2)+h<n else 0
x=pad+arp+perc
# eco simple
d=int(0.375*sr); y=x.copy(); y[d:]+=0.25*x[:-d]
y=y/np.max(np.abs(y))*0.8
y[:int(sr*1)]*=np.linspace(0,1,int(sr*1)); y[-int(sr*2):]*=np.linspace(1,0,int(sr*2))
st=np.stack([y,np.roll(y,40)],1)
with wave.open(out,'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(sr); w.writeframes((st*32767).astype(np.int16).tobytes())
