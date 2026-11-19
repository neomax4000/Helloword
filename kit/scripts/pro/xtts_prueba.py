"""PRUEBA (no es el flujo estándar): voces XTTS v2 para el A/B de voces. Brandon A (clon, refs/brandon_A.wav fuera del repo) y Daisy Studious.
Necesita coqui-tts, torch 2.8 CPU y Whisper offline (/home/claude/asr). Licencia XTTS: no comercial."""
import os, re, json, time, difflib, subprocess, unicodedata
os.environ['COQUI_TOS_AGREED'] = '1'  # licencia CPML aceptada por Brandon en la sesión
import numpy as np, soundfile as sf
from TTS.api import TTS

G = json.load(open('/home/user/Helloword/kit/scripts/pro/guiones/aguinaldo.json'))
blocks = G['bloques']
blocks[2] = dict(blocks[2], t=blocks[2]['t'].replace('Uno:', 'Número uno:'))
NUM = set('cero uno una dos tres cuatro cinco seis siete ocho nueve diez once doce trece catorce quince veinte treinta cuarenta cincuenta cien mil millon millones'.split())
ASR, SR = '/home/claude/asr', 24000
t = TTS('tts_models/multilingual/multi-dataset/xtts_v2')


def norm(s):
    s = unicodedata.normalize('NFD', s.lower())
    s = ''.join(c for c in s if c.isalpha() or c.isspace())
    return [w for w in s.split() if w not in NUM]


def oir(wav):
    sf.write('take.wav', wav, SR)
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', 'take.wav', '-ar', '16000', '-ac', '1', '-f', 'f32le', f'{ASR}/audio16k.f32'], check=True)
    subprocess.run(['node', 'asr.mjs', 'word'], cwd=ASR, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    return json.load(open(f'{ASR}/out_word.json'))['text'].strip()


def trim(s):
    idx = np.where(np.abs(s) > 0.012)[0]
    return s[max(0, idx[0] - int(.015 * SR)): idx[-1] + int(.05 * SR)]


def pulir(src, dst):
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', src, '-af',
                    'highpass=f=75,deesser=i=0.3,acompressor=threshold=-22dB:ratio=3:attack=5:release=90:makeup=2,loudnorm=I=-15:TP=-1.5:LRA=7',
                    '-ar', '48000', '-ac', '1', dst], check=True)


def generar(name, kw, vel, temps, fp, reintentos):
    t0, out, info = time.time(), [], []
    for b in blocks:
        mejor = None
        for i in range(reintentos):
            w = trim(np.asarray(t.tts(text=b['t'], language='es', speed=vel, temperature=temps[i % len(temps)], **kw), np.float32))
            heard = oir(w)
            sc = difflib.SequenceMatcher(None, norm(b['t']), norm(heard)).ratio()
            if norm(heard)[:1] != norm(b['t'])[:1]:
                sc -= 0.2  # la primera palabra importa más
            if mejor is None or sc > mejor[0]:
                mejor = (sc, w, heard, i + 1)
            if sc >= 0.97:
                break
        out += [mejor[1], np.zeros(int(float(b.get('p', .2)) * fp * SR), np.float32)]
        info.append((round(mejor[0], 2), mejor[3], mejor[2]))
    sf.write(f'tmp_{name}.wav', np.concatenate(out), SR)
    pulir(f'tmp_{name}.wav', f'r6_{name}.wav')
    print(name, round(time.time() - t0), 's', [(a, b) for a, b, _ in info], flush=True)
    return info


rep = {}
rep['brandon_A_final'] = generar('brandon_A_final', dict(speaker_wav=['refs/brandon_A.wav']), 1.15, [0.8, 0.85, 0.7, 0.9, 0.75], 0.5, 5)
rep['daisy_final'] = generar('daisy_final', dict(speaker='Daisy Studious'), 1.2, [0.85, 0.75, 0.9, 0.7, 0.8], 0.5, 5)
json.dump(rep, open('final2.json', 'w'), ensure_ascii=False, indent=1)
