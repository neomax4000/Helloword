"""Entonación de PREGUNTA para Kokoro (receta F1 aprobada por Brandon 2026-11-08). Sirve para cualquier voz/video.
Kokoro lee «¿…?» como afirmación y eso delata la voz sintética. Con esto la última palabra SUBE desde su primera sílaba
(0 → +3 → +9 → +15 semitonos en 3 sílabas), la última sílaba dura 1.25x, y la frase arranca alta (+5 st que decaen).
Uso:   from pregunta import pregunta
       s = pregunta(s, SR, 'crédito', lambda w: gen(w))     # s = audio float32 de la frase ya recortado; gen(texto)->audio
Requiere:  pip install pyworld parselmouth --break-system-packages
Si en un video se usan preguntas, aplicar a CADA frase interrogativa. Escuchar siempre el resultado antes de renderizar.
Pregunta en DOS partes (probada 2026-11-08): "¿Parte uno? ¿Parte dos?", cada una con pregunta(...). En la parte uno usar inicio=9, tau_s=0.2
(la primera sílaba arranca +9 st y baja en ~0.2 s, como la subida final) y pegar con 0.1 s de pausa. Usar palabras finales de 3+ sílabas (crédito, tarjeta, retiro).
(Nota: en los mini videos del GLOSARIO no se usan preguntas; solo hechos.)"""
import re, numpy as np, pyworld as pw, parselmouth
def silabas(p):
    p=p.lower(); g=re.findall(r'[aeiouáéíóúü]+',p); n=0
    for x in g:
        fuertes=[c for c in x if c in 'aeoáéíóú' and c not in 'íú']  # vocales fuertes (hiato con tilde en í/ú cuenta aparte)
        n+= 2 if len(fuertes)>=2 or re.search(r'[íú][aeo]|[aeo][íú]',x) else 1
    return max(1,n)
def pregunta(s, SR, ultima, gen, rise=15.0, estira=1.25, fp=5.0, inicio=5.0, tau_s=None):
    x=s.astype(np.float64); T=len(x)/SR; n=silabas(ultima)
    dw=len(gen(ultima))/SR; ini=max(0.0,T-dw)
    snd=parselmouth.Sound(x,SR); it=snd.to_intensity(minimum_pitch=100,time_step=0.01); tt=it.xs(); vv=it.values[0]
    b=[ini+dw*j/n for j in range(n+1)]
    for j in range(1,n):  # ajustar cada frontera al valle de energía más cercano (±60 ms)
        m=(tt>b[j]-.06)&(tt<b[j]+.06)
        if m.any(): b[j]=float(tt[m][np.argmin(vv[m])])
    f0,t=pw.harvest(x,SR,f0_floor=70,f0_ceil=400,frame_period=fp)
    sp=pw.cheaptrick(x,f0,t,SR); ap=pw.d4c(x,f0,t,SR)
    base=np.median(f0[(t>max(0,ini-0.5))&(t<ini)&(f0>0)]) if ((t>max(0,ini-0.5))&(t<ini)&(f0>0)).any() else np.median(f0[f0>0])
    f=np.where(f0>0,f0*2**((inicio*np.exp(-t/(tau_s if tau_s else 0.18*T)))/12),0)
    pts_t=[b[0]]+[b[j] for j in range(1,n+1)]; pts_s=[0]+[rise*(j/n)**1.4 for j in range(1,n+1)]
    for i,tm in enumerate(t):
        if tm>=ini: f[i]=base*2**(np.interp(tm,pts_t,pts_s)/12)   # tono forzado incluso donde el original era sordo
    N=len(t); iL=int(b[n-1]*1000/fp); idx=[];pos=0.0
    while pos<N-1: idx.append(pos); pos+= 1.0 if pos<iL else 1.0/estira
    idx=np.array(idx); i0=np.floor(idx).astype(int); i1=np.minimum(i0+1,N-1); w=(idx-i0)[:,None]
    y=pw.synthesize(np.interp(idx,np.arange(N),f),np.ascontiguousarray(sp[i0]*(1-w)+sp[i1]*w),np.ascontiguousarray(ap[i0]*(1-w)+ap[i1]*w),SR,fp)
    return y.astype(np.float32)
