"""Mezcla del Estándar Pro: voz + efectos en las pausas + golpes en los reveals + música con ducking, a −14 LUFS.

Uso:  python3 mezcla_pro.py <id>
Lee   kit/app/public/<id>/voz.wav y words.json, y "sfx" / "musica_desde" del guion
Deja  kit/app/public/<id>/voz_mix.wav

Automático: un whoosh corto en la pausa antes de cada bloque (salvo los marcados en "sin_whoosh").
"sfx" agrega golpes ligados a momentos (un efecto por momento clave, no en cada palabra):
  {"tipo": "stamp", "palabra": 6, "dt": -0.06, "db": -9}     # en el inicio de la palabra 6 (índice de words.json)
  {"tipo": "ding",  "fin_bloque": 3, "dt": 0.02, "db": -15}  # en la pausa después del bloque 3
  {"tipo": "riser", "bloque": 5, "dt": -0.22, "db": -11}     # antes del inicio del bloque 5
  {"tipo": "ticks", "palabra": 17, "n": 8, "paso": 0.07}     # conteo
tipos: whoosh, riser, impact, stamp, pop, ding, chaching, click, tick, ticks
Los golpes encima de la voz van bajos (−14 a −22 dB); los fuertes van en las pausas.
"""
import json, os, subprocess, sys
import numpy as np, soundfile as sf
from comun import AUDIO, SR, guion, public, work
sys.path.insert(0, str(AUDIO))
import kit as K  # noqa: E402

vid = sys.argv[1]
G = guion(vid)
D = public(vid)
Wd = work(vid)
d = json.load(open(D / 'words.json'))
W, B = d['words'], d['blocks']
TOTAL = B[-1]['e'] + 0.28
A = [0] + [b['s'] - 0.1 for b in B[1:]]
v, sr = sf.read(str(D / 'voz.wav'), dtype='float32')
assert sr == SR
N = int(TOTAL * SR)
v = np.pad(v, (0, max(0, N - len(v))))[:N]
fx = np.zeros(N)
rms = np.sqrt(np.mean(v[np.abs(v) > 0.02] ** 2))


def add(x, t, db):
    g = rms * 10 ** (db / 20) / np.sqrt(np.mean(x ** 2) + 1e-9)
    i = int(t * SR)
    j = min(N, i + len(x))
    if 0 <= i < N:
        fx[i:j] += x[:j - i] * g


sin = set(G.get('sin_whoosh', []))
for k in range(1, len(A)):
    if k not in sin:
        add(K.whoosh(0.26, up=k % 2 == 1), A[k] - 0.2, -10)
GEN = {'whoosh': lambda e: K.whoosh(0.3), 'riser': lambda e: K.riser(e.get('dur', 0.3)), 'impact': lambda e: K.impact(0.7),
       'stamp': lambda e: K.stamp(), 'pop': lambda e: K.pop(e.get('f', 800), 0.09), 'ding': lambda e: K.ding(e.get('f', 1568), 0.8),
       'chaching': lambda e: K.chaching(), 'click': lambda e: K.click(), 'tick': lambda e: K.tick(e.get('f', 1600))}
DEF = {'whoosh': -10, 'riser': -11, 'impact': -8, 'stamp': -9, 'pop': -14, 'ding': -15, 'chaching': -13, 'click': -16, 'tick': -22, 'ticks': -22}
for e in G.get('sfx', []):
    if 'palabra' in e:
        t0 = W[e['palabra']]['s']
    elif 'fin_bloque' in e:
        t0 = B[e['fin_bloque']]['e']
    else:
        t0 = A[e['bloque']]
    t0 += e.get('dt', -0.05)
    db = e.get('db', DEF[e['tipo']])
    if e['tipo'] == 'ticks':
        for k in range(e.get('n', 8)):
            add(K.tick(1500 + k * 60), t0 + k * e.get('paso', 0.07), db)
    else:
        add(GEN[e['tipo']](e), t0, db)
drop = A[min(len(A) - 1, G.get('musica_desde', 2))]
subprocess.run(['python3', str(AUDIO / 'musica2.py'), str(N / SR), str(Wd / 'mus.wav'), str(drop)], check=True)
m, _ = sf.read(str(Wd / 'mus.wav'), dtype='float32')
m = m[:N] if len(m) >= N else np.pad(m, ((0, N - len(m)), (0, 0)))
fade = np.ones(N)
n = int(.12 * SR)
fade[-n:] = np.linspace(1, 0, n)
m = m * fade[:, None]
fx *= fade
sf.write(str(Wd / 'vfx.wav'), np.stack([v + fx, v + fx], 1).astype(np.float32), SR)
sf.write(str(Wd / 'vonly.wav'), v, SR)
sf.write(str(Wd / 'm.wav'), m.astype(np.float32), SR)
pre = str(Wd / 'pre.wav')
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', str(Wd / 'vfx.wav'), '-i', str(Wd / 'm.wav'), '-i', str(Wd / 'vonly.wav'), '-filter_complex',
                '[1:a]volume=0.42[m];[2:a]aformat=channel_layouts=stereo[sc];[m][sc]sidechaincompress=threshold=0.03:ratio=7:attack=12:release=300[md];'
                '[0:a][md]amix=inputs=2:duration=first:normalize=0[a]', '-map', '[a]', '-ar', '48000', pre], check=True)
# ganancia exacta a −14 LUFS y limitador
r = subprocess.run(['ffmpeg', '-hide_banner', '-i', pre, '-af', 'loudnorm=print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
I = float(json.loads(r[r.rfind('{'):r.rfind('}') + 1])['input_i'])
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', pre, '-af', f'volume={-14 - I:.2f}dB,alimiter=limit=0.89:level=false', '-ar', '48000',
                str(D / 'voz_mix.wav')], check=True)
r = subprocess.run(['ffmpeg', '-hide_banner', '-i', str(D / 'voz_mix.wav'), '-af', 'loudnorm=print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
j = json.loads(r[r.rfind('{'):r.rfind('}') + 1])
print(f"voz_mix.wav listo: {j['input_i']} LUFS, pico {j['input_tp']} dBTP, {TOTAL:.2f} s")
