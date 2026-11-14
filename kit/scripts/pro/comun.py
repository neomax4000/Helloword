"""Rutas y utilidades comunes del Estándar Pro.

Rutas (se pueden cambiar con variables de entorno):
  KOKORO_DIR  carpeta con kokoro-v1.0.onnx y voices-v1.0.bin   (por defecto /home/claude/video/voz)
  ASR_DIR     carpeta con asr.mjs de Whisper offline             (por defecto /home/claude/asr)
"""
import json, os, pathlib

PRO = pathlib.Path(__file__).resolve().parent
KIT = PRO.parents[1]
APP = KIT / 'app'
AUDIO = KIT / 'scripts' / 'audio'
KOKORO_DIR = pathlib.Path(os.environ.get('KOKORO_DIR', '/home/claude/video/voz'))
ASR_DIR = pathlib.Path(os.environ.get('ASR_DIR', '/home/claude/asr'))
SR_TTS = 24000
SR = 48000

# Voces Kokoro del canal
VOCES = {
    '3': {'em_alex': 0.6, 'im_nicola': 0.4},                 # narrador masculino (por defecto)
    '5': {'ef_dora': 0.7, 'if_sara': 0.3},                   # narradora (Ana)
    'D': {'em_santa': 0.5, 'em_alex': 0.25, 'im_nicola': 0.25},  # voz del glosario
}


def guion(vid):
    return json.load(open(PRO / 'guiones' / f'{vid}.json'))


def public(vid):
    d = APP / 'public' / vid
    d.mkdir(parents=True, exist_ok=True)
    return d


def work(vid):
    d = PRO / '.trabajo' / vid
    d.mkdir(parents=True, exist_ok=True)
    return d
