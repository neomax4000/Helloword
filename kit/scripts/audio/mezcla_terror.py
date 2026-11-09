import numpy as np, soundfile as sf, json
sr=48000; dur=161.6+0.7; N=int(dur*sr); t=np.arange(N)/sr
rng=np.random.default_rng(7)
def lp(x,k): return np.convolve(x,np.ones(k)/k,'same')
L=np.zeros(N); R=np.zeros(N)
# drone D menor con batimientos + cluster disonante
for f0,a in [(36.71,0.10),(73.42,0.06),(77.78,0.025),(110.0,0.03),(146.83,0.018),(155.56,0.012)]:
    ph=2*np.pi*f0*t; mod=1+0.004*np.sin(2*np.pi*0.13*t)
    L+=a*np.sin(ph*mod); R+=a*np.sin(ph*mod*1.002)
air=lp(rng.standard_normal(N),60)*0.06*(0.6+0.4*np.sin(2*np.pi*0.05*t)); L+=air; R+=lp(rng.standard_normal(N),60)*0.06
# tic-tac de reloj en secciones intermedias
for s in np.arange(26,101,0.5):
    i=int(s*sr); n=int(0.02*sr); tk=np.arange(n)/sr
    c=np.sin(2*np.pi*(2400 if int(s*2)%2 else 1800)*tk)*np.exp(-tk*400)*0.05
    L[i:i+n]+=c; R[i:i+n]+=c
fade=np.minimum(1,t/1.5)*np.clip((dur-t)/2.5,0,1)
M=np.stack([L*fade,R*fade],1); M/=np.abs(M).max()/0.6
sf.write('music.wav',M,sr)
# efectos
FX=np.zeros((N,2))
def add(x,at,g):
    i=int(at*sr); e=min(N,i+len(x)); FX[i:e]+=np.stack([x[:e-i],x[:e-i]],1)*g if x.ndim==1 else x[:e-i]*g
def heart():
    n=int(0.2*sr); tk=np.arange(n)/sr; return np.sin(2*np.pi*(45+35*np.exp(-tk*30))*tk)*np.exp(-tk*16)
def boom():
    n=int(2.2*sr); tk=np.arange(n)/sr
    x=np.sin(2*np.pi*(32+70*np.exp(-tk*6))*tk)*np.exp(-tk*1.8)+lp(rng.standard_normal(n),20)*np.exp(-tk*7)*0.6
    return x/np.abs(x).max()
def static():
    n=int(0.28*sr); tk=np.arange(n)/sr; x=rng.standard_normal(n)*(np.sin(np.pi*tk/0.28))*(rng.random(n)>0.3); return x/np.abs(x).max()
def riser(d=3.0):
    n=int(d*sr); tk=np.arange(n)/sr; ph=np.cumsum(2*np.pi*(120+900*(tk/d)**2)/sr)
    x=(np.sin(ph)*0.5+lp(rng.standard_normal(n),4)*0.5)*(tk/d)**2; return x/np.abs(x).max()
def stamp():
    n=int(0.35*sr); tk=np.arange(n)/sr; x=np.sin(2*np.pi*90*tk)*np.exp(-tk*25)+rng.standard_normal(n)*np.exp(-tk*60)*0.5; return x/np.abs(x).max()
for k in np.arange(0,25.5,1.15):   # latido sincronizado con la viñeta
    add(heart(),k+0.17,0.55); add(heart(),k+0.40,0.32)
for at in [14.9,37.95,50.4,105.3,123.9]: add(boom(),at,0.55)
for at in [23.0,29.5,106.5,137.6]: add(stamp(),at,0.45)
add(riser(3.0),73.4,0.35)
W=json.load(open('src/words.json'))
gaps=[(W[i]['e'],W[i+1]['s']) for i in range(len(W)-1) if W[i+1]['s']-W[i]['e']>0.12]
for sc in [5.85,18.28,25.89,32.52,45.29,58.53,64.83,85.9,93.48,112.27,130.97,139.16,149.1]:
    g=min(gaps,key=lambda g:abs((g[0]+g[1])/2-sc)); add(static(),(g[0]+g[1])/2-0.14,0.16)
sf.write('fx.wav',FX/max(1,np.abs(FX).max()/0.9),sr)
