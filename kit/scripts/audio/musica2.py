# Pista con más energía: 104 bpm, intro sobria, pausa antes del riser, entra el beat completo tras la presentación
import numpy as np, sys, soundfile as sf
sr=48000; dur=float(sys.argv[1]); out=sys.argv[2]; drop=float(sys.argv[3])
bpm=104; beat=60/bpm; bar=beat*4
n=int(sr*(dur+1)); t=np.arange(n)/sr
f=lambda m:440*2**((m-69)/12)
ch=[[57,60,64,67],[53,57,60,64],[48,52,55,59],[55,59,62,65]]
pad=np.zeros(n); bass=np.zeros(n); arp=np.zeros(n); kick=np.zeros(n); hat=np.zeros(n); clap=np.zeros(n)
rng=np.random.default_rng(3)
for i in range(int(dur/bar)+2):
    s=int(i*bar*sr); e=min(n,int((i+1)*bar*sr))
    if s>=n: break
    tt=t[s:e]-t[s]; c=ch[i%4]
    ev=np.minimum(1,tt/0.3)*np.minimum(1,(bar-tt)/0.3)
    for m in c:
        for dt in (-0.004,0.004):
            ph=2*np.pi*f(m)*(1+dt)*tt
            pad[s:e]+=ev*(np.sin(ph)+0.3*np.sin(2*ph))*0.045
    for k in range(8):  # bajo en corcheas
        a=int(s+k*beat/2*sr); L=int(beat/2*sr*0.9)
        if a+L>n: break
        tb=np.arange(L)/sr
        bass[a:a+L]+=np.sin(2*np.pi*f(c[0]-24)*tb)*np.exp(-tb*5)*0.28
    for k in range(16):  # arpegio en semicorcheas
        a=int(s+k*beat/4*sr); L=int(0.18*sr)
        if a+L>n: break
        tb=np.arange(L)/sr; m=c[[0,1,2,3,2,1,0,2][k%8]]+12
        arp[a:a+L]+=(np.sin(2*np.pi*f(m)*tb)+0.2*np.sin(4*np.pi*f(m)*tb))*np.exp(-tb*14)*0.05
    for k in range(4):
        a=int(s+k*beat*sr); L=int(0.3*sr)
        if a+L>n: break
        tb=np.arange(L)/sr
        kick[a:a+L]+=np.sin(2*np.pi*(50+90*np.exp(-tb*35))*tb)*np.exp(-tb*9)*0.42
        if k in (1,3):
            Lc=int(0.15*sr); clap[a:a+Lc]+=rng.standard_normal(Lc)*np.exp(-np.arange(Lc)/sr*28)*0.1
        h=int(s+(k+0.5)*beat*sr); Lh=int(0.04*sr)
        if h+Lh<n: hat[h:h+Lh]+=rng.standard_normal(Lh)*np.exp(-np.arange(Lh)/sr*90)*0.05
def gate(x,a,b,ramp=0.3):
    g=np.zeros(n); i=int(a*sr); j=int(b*sr); g[i:j]=1
    r=int(ramp*sr); g[i:i+r]=np.linspace(0,1,len(g[i:i+r]))
    return x*g
full=np.ones(n)
# intro (antes de ACTIGOB): pad + arpegio + hat; hueco de 0.6 s antes del drop; luego todo
cut=np.ones(n); cut[int((drop-0.6)*sr):int((drop+0.13)*sr)]=0
intro=(pad+arp+hat)*np.where(t<drop,1,0)
main=(pad+arp+hat+bass+kick+clap)*np.where(t>=drop+0.13,1,0)
y=(intro*0.8+main)*cut
y=y/np.max(np.abs(y))*0.85
d=int(0.288*sr); y2=y.copy(); y2[d:]+=0.18*y[:-d]
y2[:sr]*=np.linspace(0,1,sr); y2[-2*sr:]*=np.linspace(1,0,2*sr)
st=np.stack([y2,np.roll(y2,60)],1)
sf.write(out,(st/np.max(np.abs(st))*0.85).astype(np.float32),sr)
