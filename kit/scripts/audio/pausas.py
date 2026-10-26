import json, numpy as np, soundfile as sf
D='/home/claude/v9'
x,sr=sf.read(f'{D}/voz_orig.wav',dtype='float32'); d=json.load(open(f'{D}/words_orig.json')); W=d['words']
BIG={31,86}; SMALL={10,19,44,57,67,73,94}
hop=int(0.04*sr)
def en(t): a=x[int(t*sr):int(t*sr)+hop]; return np.sqrt(np.mean(a**2))+1e-9
ins=[]
for k,w in enumerate(W):
    if w['i'] not in BIG|SMALL: continue
    target=0.5 if w['i'] in BIG else 0.32
    ts=np.arange(W[k-1]['e']-0.45,w['s']+0.12,0.005)
    E=np.array([en(t) for t in ts]); t0=ts[int(np.argmin(E))]+0.02
    # largo del silencio existente alrededor de t0
    q=lambda t: 20*np.log10(en(t))<-45
    a=t0
    while q(a-0.01) and a>t0-1: a-=0.01
    b=t0
    while q(b+0.01) and b<t0+1: b+=0.01
    gap=b-a+0.04
    ins.append((t0,max(0,target-gap),w['i'],round(gap,2)))
ins.sort()
out=[];pos=0;shift=[];acc=0
for t0,add,i,g in ins:
    p=int(t0*sr); out+= [x[pos:p],np.zeros(int(add*sr),'float32')]; pos=p; acc+=add; shift.append((t0,acc))
out.append(x[pos:]); y=np.concatenate(out)
def mp(t):
    s=0
    for t0,a in shift:
        if t>=t0: s=a
    return t+s
for w in W: w['s']=round(mp(w['s']),3); w['e']=round(mp(w['e']),3)
# corregir arranque de palabra a la posición real tras el corte
for t0,add,i,g in ins:
    w=W[i]
    if w['s']<mp(t0): w['s']=round(mp(t0)+0.02,3)
d['total']=round(len(y)/sr,3)
sf.write(f'{D}/voz.wav',y,sr); json.dump(d,open(f'{D}/words.json','w'),ensure_ascii=False)
print('insertado',round(acc,2),'total',d['total']); print([(round(t,2),round(a,2),i,g) for t,a,i,g in ins])
