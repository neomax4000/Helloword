"""Voz XTTS v2 (Baldur Sanjin, Brandon A, etc.) para el Estándar Pro. ALTERNATIVA a voz_pro.py (Kokoro), que NO se toca.
Respaldo de la configuración anterior (Kokoro): tag `respaldo-voz-kokoro-2026-11-19`.

Uso:   python3 voz_xtts.py <id>               genera con XTTS (necesita coqui-tts, torch CPU y Hugging Face; NO corre en la sesión de Cowork)
       python3 voz_xtts.py <id> --externo DIR  usa audios ya generados: DIR/b1.wav … bN.wav (uno por bloque, mismo texto del guion)
Lee    kit/scripts/pro/guiones/<id>.json (mismo formato que voz_pro.py; opcional "xtts": {"speaker": "Baldur Sanjin", "velocidad": 1.1, "ref": "refs/brandon_A.wav"})
Deja   kit/app/public/<id>/voz.wav y words.json (alineado con Whisper) — igual que voz_pro.py, así mezcla_pro.py y el render no cambian.
Reglas: hasta 5 tomas por bloque y Whisper elige la mejor (penaliza si falla la primera palabra); «Uno:» se escribe «Número uno»; sin ElevenLabs.
Licencia XTTS: no comercial (aceptada por Brandon 2026-11-19). No clonar voces de personajes ni actores. Las grabaciones de Brandon no se suben al repo."""
import difflib, json, os, subprocess, sys, unicodedata
import numpy as np, soundfile as sf
from comun import ASR_DIR, guion, public, work
from alinear_pro import alinear

SR = 24000
vid = sys.argv[1]
externo = sys.argv[sys.argv.index('--externo') + 1] if '--externo' in sys.argv else None
G = guion(vid)
X = G.get('xtts', {})
vel = float(X.get('velocidad', 1.1))
TEMPS = [0.85, 0.75, 0.9, 0.7, 0.8]
NUM = set('cero uno una dos tres cuatro cinco seis siete ocho nueve diez once doce trece catorce quince veinte treinta cuarenta cincuenta cien mil millon millones'.split())


def norm(s):
    s = unicodedata.normalize('NFD', s.lower())
    s = ''.join(c for c in s if c.isalpha() or c.isspace())
    return [w for w in s.split() if w not in NUM]


def trim(s):
    idx = np.where(np.abs(s) > 0.012)[0]
    return s[max(0, idx[0] - int(.015 * SR)): idx[-1] + int(.05 * SR)]


def oir(wav):
    sf.write('/tmp/take.wav', wav, SR)
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', '/tmp/take.wav', '-ar', '16000', '-ac', '1', '-f', 'f32le', str(ASR_DIR / 'audio16k.f32')], check=True)
    subprocess.run(['node', 'asr.mjs', 'word'], cwd=str(ASR_DIR), stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    return json.load(open(ASR_DIR / 'out_word.json'))['text'].strip()


def leer_externo(i):
    for ext in ('wav', 'mp3', 'flac'):
        p = os.path.join(externo, f'b{i + 1}.{ext}')
        if os.path.exists(p):
            subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', p, '-ar', str(SR), '-ac', '1', '/tmp/ext.wav'], check=True)
            s, _ = sf.read('/tmp/ext.wav', dtype='float32')
            return trim(s)
    sys.exit(f'falta {externo}/b{i + 1}.wav')


if not externo:
    os.environ['COQUI_TOS_AGREED'] = '1'
    from TTS.api import TTS
    tts = TTS('tts_models/multilingual/multi-dataset/xtts_v2')
    kw = dict(speaker_wav=[X['ref']]) if X.get('ref') else dict(speaker=X.get('speaker', 'Baldur Sanjin'))

out = [np.zeros(int(.08 * SR), np.float32)]
t, blocks = .08, []
for i, b in enumerate(G['bloques']):
    if externo:
        s = leer_externo(i)
    else:
        texto = b['t'].replace('Uno:', 'Número uno:')
        mejor = None
        for n in range(5):
            w = trim(np.asarray(tts.tts(text=texto, language='es', speed=float(b.get('v', vel)), temperature=TEMPS[n], **kw), np.float32))
            heard = oir(w)
            sc = difflib.SequenceMatcher(None, norm(texto), norm(heard)).ratio()
            if norm(heard)[:1] != norm(texto)[:1]:
                sc -= 0.2
            if mejor is None or sc > mejor[0]:
                mejor = (sc, w)
            if sc >= 0.97:
                break
        s = mejor[1]
        print(f'bloque {i + 1}: ajuste {mejor[0]:.2f}')
    blocks.append({'s': round(t, 3), 'e': round(t + len(s) / SR, 3)})
    p = float(b.get('p', .2))
    out += [s, np.zeros(int(p * SR), np.float32)]
    t += len(s) / SR + p
W = work(vid)
sf.write(W / 'raw.wav', np.concatenate(out), SR)
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', str(W / 'raw.wav'), '-af',
                'highpass=f=75,deesser=i=0.3,acompressor=threshold=-22dB:ratio=3:attack=5:release=90:makeup=2,loudnorm=I=-15:TP=-1.5:LRA=7',
                '-ar', '48000', '-ac', '1', str(public(vid) / 'voz.wav')], check=True)
print('duración', round(t, 2), 's ·', len(blocks), 'bloques')
alinear(vid, blocks)
