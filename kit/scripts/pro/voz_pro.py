"""Voz del Estándar Pro: genera la narración por BLOQUES de sentido y la alinea palabra por palabra.

Uso:  python3 voz_pro.py <id>
Lee   kit/scripts/pro/guiones/<id>.json
Deja  kit/app/public/<id>/voz.wav y words.json (palabras con tiempos reales, bloques y grupos de subtítulo)

Formato del guion:
{
  "voz": "3",                 # 3 (narrador), 5 (narradora) o D (glosario)
  "velocidad": 1.03,          # 1.00–1.05. El ritmo sale de un guion corto, no de acelerar la voz.
  "bloques": [
    {"t": "Tu aguinaldo no es un regalo: es ley.",      # lo que se DICE (números en letra, inglés como suena)
     "c": "Tu aguinaldo | no es un regalo: | es ley.",  # SUBTÍTULO con cortes | escritos a mano (opcional)
     "p": 0.22}                                          # pausa después (s); ≤ 0.3; 0 en el último si hay bucle
  ],
  "sfx": [...]                # efectos para mezcla_pro.py (ver ese archivo)
}
Reglas: una idea por bloque (1–2 frases); sin preguntas en la voz; las palabras de "c" deben corresponder
una a una con las de "t" (si no, se reparte el tiempo proporcionalmente y se avisa).
"""
import subprocess, sys
import numpy as np, soundfile as sf
from comun import KOKORO_DIR, SR_TTS, VOCES, guion, public, work
from alinear_pro import alinear

vid = sys.argv[1]
G = guion(vid)
from kokoro_onnx import Kokoro
k = Kokoro(str(KOKORO_DIR / 'kokoro-v1.0.onnx'), str(KOKORO_DIR / 'voices-v1.0.bin'))
V = np.load(str(KOKORO_DIR / 'voices-v1.0.bin'))
vo = sum(V[n] * w for n, w in VOCES[str(G.get('voz', '3'))].items())
vel = float(G.get('velocidad', 1.03))


def trim(s):
    idx = np.where(np.abs(s) > 0.012)[0]
    return s[max(0, idx[0] - int(.015 * SR_TTS)): idx[-1] + int(.05 * SR_TTS)]


out = [np.zeros(int(.08 * SR_TTS), np.float32)]
t = .08
blocks = []
for b in G['bloques']:
    s, _ = k.create(b['t'], voice=vo, speed=float(b.get('v', vel)), lang='es')
    s = trim(s.astype(np.float32))
    blocks.append({'s': round(t, 3), 'e': round(t + len(s) / SR_TTS, 3)})
    p = float(b.get('p', .2))
    out += [s, np.zeros(int(p * SR_TTS), np.float32)]
    t += len(s) / SR_TTS + p
W = work(vid)
sf.write(W / 'raw.wav', np.concatenate(out), SR_TTS)
# masterización: cuerpo, menos «caja», presencia, de-esser, compresión suave, aire mínimo, −15 LUFS
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', str(W / 'raw.wav'), '-af',
                'highpass=f=75,equalizer=f=160:t=q:w=1.2:g=2.5,equalizer=f=320:t=q:w=1.5:g=-1.5,'
                'equalizer=f=3200:t=q:w=1.2:g=2,equalizer=f=9000:t=h:w=1:g=1.5,deesser=i=0.35,'
                'acompressor=threshold=-22dB:ratio=3.5:attack=4:release=90:makeup=2,aecho=0.9:0.35:18:0.05,'
                'loudnorm=I=-15:TP=-1.5:LRA=7', '-ar', '48000', '-ac', '1', str(public(vid) / 'voz.wav')], check=True)
print('duración', round(t, 2), 's ·', len(blocks), 'bloques')
alinear(vid, blocks)
