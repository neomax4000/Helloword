# Kit de sonido sintetizado: whoosh, riser, impact, pop, click, tick, ding, chaching, swoosh-up
import numpy as np
SR=48000
rng=np.random.default_rng(11)
def env(n,a,r):
    e=np.ones(n); A=int(a*SR); R=int(r*SR)
    if A: e[:A]=np.linspace(0,1,A)
    if R: e[-R:]*=np.linspace(1,0,R)**2
    return e
def bp_noise(n,f0,f1,q=6):
    # ruido filtrado con resonador que barre de f0 a f1
    x=rng.standard_normal(n); y=np.zeros(n); y1=y2=0
    fs=np.geomspace(f0,f1,n)
    for i in range(n):
        w=2*np.pi*fs[i]/SR; r=1-w/q/2; r=min(max(r,0.5),0.999)
        yy=x[i]*(1-r)+2*r*np.cos(w)*y1-r*r*y2; y2=y1; y1=yy; y[i]=yy
    return y/np.max(np.abs(y))
def whoosh(d=0.42,up=True):
    n=int(d*SR); t=np.arange(n)/SR
    y=bp_noise(n,300 if up else 3500,3500 if up else 300,4)
    e=np.sin(np.pi*np.clip(t/d,0,1))**1.6
    return y*e
def riser(d=0.7):
    n=int(d*SR); t=np.arange(n)/SR
    y=bp_noise(n,200,6000,5)*0.7+0.3*np.sin(2*np.pi*np.cumsum(np.geomspace(120,900,n))/SR)
    return y*(t/d)**2.2
def impact(d=0.9):
    n=int(d*SR); t=np.arange(n)/SR
    sub=np.sin(2*np.pi*(45+90*np.exp(-t*18))*t)*np.exp(-t*4.5)
    hit=rng.standard_normal(n)*np.exp(-t*30)*0.5
    return (sub+hit)/1.3
def pop(f0=900,d=0.1):
    n=int(d*SR); t=np.arange(n)/SR
    return np.sin(2*np.pi*(f0*t+f0*1.5*t*t*10))*np.exp(-t*40)
def click(d=0.03):
    n=int(d*SR); t=np.arange(n)/SR
    return (rng.standard_normal(n)*0.5+np.sin(2*np.pi*2500*t))*np.exp(-t*220)
def tick(f=1800):
    n=int(0.06*SR); t=np.arange(n)/SR
    return np.sin(2*np.pi*f*t)*np.exp(-t*70)
def ding(f=1320,d=1.0):
    n=int(d*SR); t=np.arange(n)/SR
    return (np.sin(2*np.pi*f*t)+0.5*np.sin(2*np.pi*f*2.01*t)+0.25*np.sin(2*np.pi*f*3.02*t))*np.exp(-t*5)/1.75
def chaching():
    a=np.concatenate([click()*0.8,np.zeros(int(0.07*SR))])
    b=ding(2093,0.8)*0.7+ding(2637,0.8)*0.5
    return np.concatenate([a,b])
def stamp():
    i=impact(0.5)*0.9; c=click(0.04)
    i[:len(c)]+=c
    return i
