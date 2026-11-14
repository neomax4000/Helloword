"""Alinea el guion con la voz real: cada palabra toma su tiempo de la transcripción de Whisper.

Lo llama voz_pro.py. También se puede correr solo:  python3 alinear_pro.py <id>
Si Whisper no está disponible, reparte el tiempo dentro de cada bloque según el largo de las palabras
(menos preciso; lo avisa y lo anota en words.json como "alineacion": "proporcional").
Imprime la transcripción: compárala con el guion para revisar la pronunciación.
"""
import difflib, json, subprocess, sys, unicodedata
from comun import ASR_DIR, guion, public, work


def norm(w):
    w = unicodedata.normalize('NFD', w.lower())
    return ''.join(c for c in w if c.isalnum())


def whisper(vid):
    asr = ASR_DIR / 'asr.mjs'
    if not asr.exists():
        return None
    try:
        subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', str(public(vid) / 'voz.wav'), '-ar', '16000', '-ac', '1',
                        '-f', 'f32le', str(ASR_DIR / 'audio16k.f32')], check=True)
        subprocess.run(['node', str(asr), 'word'], cwd=str(ASR_DIR), check=True, timeout=900,
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        out = json.load(open(ASR_DIR / 'out_word.json'))
        json.dump(out, open(work(vid) / 'asr_word.json', 'w'), ensure_ascii=False)
        print('Whisper:', out.get('text', '').strip())
        return [(norm(c['text']), c['timestamp'][0], c['timestamp'][1]) for c in out['chunks'] if norm(c['text'])]
    except Exception as e:  # noqa: BLE001
        print('Whisper no disponible:', e)
        return None


def alinear(vid, blocks=None):
    G = guion(vid)
    if blocks is None:
        blocks = json.load(open(public(vid) / 'words.json'))['blocks']
    # palabras habladas (para alinear) y palabras del subtítulo (para mostrar), bloque por bloque
    words, g = [], 0
    for bi, b in enumerate(G['bloques']):
        spoken = b['t'].split()
        cap = b.get('c', b['t'])
        frases = [f.split() for f in cap.split('|')] if '|' in cap else [cap.split()]
        cw = [(w, g + k) for k, f in enumerate(frases) for w in f]
        g += len(frases)
        if len(cw) != len(spoken):
            print(f'AVISO bloque {bi}: el subtítulo tiene {len(cw)} palabras y el hablado {len(spoken)}; tiempos repartidos')
        for k, (w, gg) in enumerate(cw):
            sk = spoken[min(len(spoken) - 1, round(k * len(spoken) / len(cw)))]
            words.append({'w': w, 'n': norm(sk), 'b': bi, 'g': gg if '|' in cap else None})
    aw = whisper(vid)
    modo = 'whisper' if aw else 'proporcional'
    if aw:
        sm = difflib.SequenceMatcher(None, [w['n'] for w in words], [a[0] for a in aw], autojunk=False)
        for tag, i1, i2, j1, j2 in sm.get_opcodes():
            if tag == 'equal':
                for k in range(i2 - i1):
                    words[i1 + k]['s'], words[i1 + k]['e'] = aw[j1 + k][1], aw[j1 + k][2]
    # huecos: interpolar dentro del bloque
    i = 0
    while i < len(words):
        if 's' in words[i]:
            i += 1
            continue
        j = i
        while j < len(words) and 's' not in words[j] and words[j]['b'] == words[i]['b']:
            j += 1
        b = words[i]['b']
        lo = words[i - 1]['e'] if i > 0 and words[i - 1]['b'] == b else blocks[b]['s']
        hi = words[j]['s'] if j < len(words) and words[j]['b'] == b and 's' in words[j] else blocks[b]['e']
        span = words[i:j]
        tot = sum(len(x['n']) + 2 for x in span) or 1
        acc = 0
        for x in span:
            x['s'] = lo + (hi - lo) * acc / tot
            acc += len(x['n']) + 2
            x['e'] = lo + (hi - lo) * acc / tot
            x['interp'] = True
        i = j
    for k, w in enumerate(words):
        b = blocks[w['b']]
        w['s'] = max(b['s'], min(w['s'], b['e']))
        w['e'] = max(w['s'] + 0.05, min(w['e'], b['e'] + 0.05))
        if k and w['s'] < words[k - 1]['s']:
            w['s'] = words[k - 1]['s'] + 0.03
    out = []
    for k, w in enumerate(words):
        o = {'i': k, 'w': w['w'], 's': round(w['s'], 3), 'e': round(w['e'], 3), 'b': w['b']}
        if w['g'] is not None:
            o['g'] = w['g']
        out.append(o)
    total = round(blocks[-1]['e'] + 0.3, 2)
    json.dump({'total': total, 'alineacion': modo, 'words': out, 'blocks': blocks},
              open(public(vid) / 'words.json', 'w'), ensure_ascii=False)
    interp = sum(1 for w in words if w.get('interp'))
    print(f'words.json listo ({modo}); {len(out)} palabras, {interp} interpoladas')
    print(' '.join(f"{o['i']}:{o['w']}@{o['s']}" for o in out))


if __name__ == '__main__':
    alinear(sys.argv[1])
