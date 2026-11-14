import json, re, difflib, unicodedata
G=json.load(open('guion.json')); B=json.load(open('blocks.json'))
A=json.load(open('asr_word.json'))['chunks']
def norm(w):
    w=unicodedata.normalize('NFD',w.lower()); w=''.join(c for c in w if c.isalnum()); return w
aw=[(norm(c['text']),c['timestamp'][0],c['timestamp'][1]) for c in A if norm(c['text'])]
words=[]; 
for bi,b in enumerate(B):
    for tk in b['t'].split():
        words.append({'w':tk,'n':norm(tk),'b':bi})
sm=difflib.SequenceMatcher(None,[w['n'] for w in words],[a[0] for a in aw],autojunk=False)
for tag,i1,i2,j1,j2 in sm.get_opcodes():
    if tag=='equal':
        for k in range(i2-i1):
            words[i1+k]['s']=aw[j1+k][1]; words[i1+k]['e']=aw[j1+k][2]
# interpolar huecos dentro de límites
for i,w in enumerate(words):
    if 's' in w: continue
    j=i
    while j<len(words) and 's' not in words[j]: j+=1
    lo=words[i-1]['e'] if i>0 and words[i-1]['b']==w['b'] else B[w['b']]['s']
    hi=words[j]['s'] if j<len(words) and words[j]['b']==words[j-1]['b'] and words[j]['b']==w['b'] else B[words[j-1]['b']]['e']
    span=words[i:j]; tot=sum(len(x['n'])+2 for x in span); acc=0
    for x in span:
        x['s']=lo+(hi-lo)*acc/tot; acc+=len(x['n'])+2; x['e']=lo+(hi-lo)*acc/tot; x['interp']=True
# ajustar a límites de bloque y monotonía
for i,w in enumerate(words):
    b=B[w['b']]; w['s']=max(b['s'],min(w['s'],b['e'])); w['e']=max(w['s']+0.05,min(w['e'],b['e']+0.05))
    if i and w['s']<words[i-1]['s']: w['s']=words[i-1]['s']+0.03
out=[{'i':i,'w':w['w'],'s':round(w['s'],3),'e':round(w['e'],3),'b':w['b']} for i,w in enumerate(words)]
json.dump({'total':round(B[-1]['e']+0.3,2),'words':out,'blocks':B},open('words.json','w'),ensure_ascii=False)
print(' '.join(f"{o['i']}:{o['w']}@{o['s']}" + ('*' if words[o['i']].get('interp') else '') for o in out))
