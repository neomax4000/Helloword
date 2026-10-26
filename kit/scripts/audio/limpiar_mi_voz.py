import json, subprocess, sys, numpy as np, soundfile as sf
SRC, OUT, ASR, FIXF = sys.argv[1:5]
FIX = {int(k): v for k, v in json.load(open(FIXF)).items()}
subprocess.run(['ffmpeg','-y','-loglevel','error','-i',SRC,'-ac','1','-af',
  'highpass=f=80,deesser=i=0.35,acompressor=threshold=-22dB:ratio=2.6:attack=6:release=90:makeup=2,'
  'equalizer=f=180:t=q:w=1:g=1.5,equalizer=f=3200:t=q:w=1.2:g=2,aresample=48000','/tmp/pulida.wav'],check=True)
x,sr=sf.read('/tmp/pulida.wav',dtype='float32')
hop=int(0.02*sr); n=len(x)//hop
db=np.array([20*np.log10(np.sqrt(np.mean(x[i*hop:(i+1)*hop]**2))+1e-9) for i in range(n)])
ref=np.percentile(db[db>-60],80); quiet=db<ref-24
runs=[];i=0
while i<n:
  if quiet[i]:
    j=i
    while j<n and quiet[j]: j+=1
    if (j-i)*0.02>0.38 and i>0: runs.append((i*hop,j*hop))
    i=j
  else: i+=1
KEEP=int(0.22*sr); fade=int(0.012*sr)
pieces=[];segmap=[];pos=0;outpos=0
for a,b in runs:
  ca=a+KEEP//2; cb=b-KEEP//2
  seg=x[pos:ca].copy(); pieces.append(seg); segmap.append((pos,ca,outpos)); outpos+=len(seg); pos=cb
seg=x[pos:]; pieces.append(seg); segmap.append((pos,len(x),outpos)); outpos+=len(seg)
for k in range(1,len(pieces)):
  f=np.linspace(0,1,fade,dtype='float32'); pieces[k][:fade]*=f; pieces[k-1][-fade:]*=f[::-1]
y=np.concatenate(pieces); LEAD=0.3; TAIL=4.0
y=np.concatenate([np.zeros(int(LEAD*sr),'float32'),y,np.zeros(int(TAIL*sr),'float32')])
sf.write('/tmp/editada.wav',y,sr)
subprocess.run(['ffmpeg','-y','-loglevel','error','-i','/tmp/editada.wav','-af','loudnorm=I=-14:TP=-1.5:LRA=9,aresample=48000','-ac','1',f'{OUT}/voz.wav'],check=True)
def mp(t):
  s=t*sr
  for a,b,o in segmap:
    if s<b: return LEAD+(o+max(0,s-a))/sr
  return LEAD+outpos/sr
c=json.load(open(ASR))['chunks']; words=[]
for i,w in enumerate(c):
  t=FIX.get(i,w['text'].strip())
  if not t: continue
  words.append({'i':i,'w':t,'s':round(mp(w['timestamp'][0]),3),'e':round(mp(w['timestamp'][1]),3)})
json.dump({'total':round(len(y)/sr,3),'words':words},open(f'{OUT}/words.json','w'),ensure_ascii=False)
print('recortes',len(runs),'ahorro',round((len(x)-outpos)/sr,2),'total',round(len(y)/sr,2))
