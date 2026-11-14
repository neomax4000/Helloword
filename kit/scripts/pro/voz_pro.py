import json, sys, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
k=Kokoro("/home/claude/video/voz/kokoro-v1.0.onnx","/home/claude/video/voz/voices-v1.0.bin")
V=np.load("/home/claude/video/voz/voices-v1.0.bin")
vo=V["em_alex"]*0.6+V["im_nicola"]*0.4
SR=24000
G=json.load(open('guion.json'))
def trim(s):
    a=np.abs(s); idx=np.where(a>0.012)[0]
    return s[max(0,idx[0]-int(.015*SR)):idx[-1]+int(.05*SR)]
# toma por bloques (cada bloque = varias frases juntas para que la entonación fluya)
out=[np.zeros(int(.08*SR),np.float32)]; t=.08; blocks=[]
for b in G['bloques']:
    s,_=k.create(b['t'],voice=vo,speed=b.get('v',1.03),lang="es"); s=trim(s.astype(np.float32))
    blocks.append({'s':round(t,3),'e':round(t+len(s)/SR,3),'t':b['t']})
    out+=[s,np.zeros(int(b.get('p',.18)*SR),np.float32)]; t+=len(s)/SR+b.get('p',.18)
x=np.concatenate(out); sf.write('raw.wav',x,SR)
json.dump(blocks,open('blocks.json','w'),ensure_ascii=False,indent=1)
print('dur',round(len(x)/SR,2)); [print(b) for b in blocks]
