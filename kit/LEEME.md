# Kit para recrear los videos de Brandon (Remotion + Kokoro)

Este paquete trae TODO el código con el que se hicieron los videos (sin los audios ni los MP4).
Si abres un chat nuevo con Claude, sube este zip y dile: «Usa este kit y el Instructivo de Notion para hacer el video de X».

## Qué hay adentro
- `app/` — proyecto Remotion 4.0.536 (React). `src/Root.tsx` registra todas las composiciones.
  - Plantilla **narrador** (una voz): `src/actimed.tsx`, `src/acticob.tsx`, `src/protege.tsx`.
  - Plantilla **diálogo** (Ana + asesor): `src/vac2.tsx`, `src/actdual.tsx`.
  - Otras: `actigob.tsx` (primera con kit de efectos), `vac.tsx` (personajes Ana y Roberto), `compara.tsx` (3 productos con colores), `fondos.tsx` (educativo sin marca), `sp500.tsx`, `banca.tsx`, `interes.tsx`, `narrador.tsx` (con tu voz), `replica.tsx`, `scenes.tsx`/`screens.tsx` (Bienvenida).
  - `src/cover.tsx` — portada (1.5 s) para todos los videos; `COVERS` en Root.tsx.
  - `src/banca.tsx` exporta paleta Actinver y fondos (`THEMES`, `ThemeBg`); `src/narrador.tsx` exporta `F`, `sp`, `ease`, `cl`.
  - `public/<video>/words.json` — tiempos por palabra de cada video (los WAV no se incluyen).
  - `render_c.mjs` — render final con portada: `node render_c.mjs ActimedC salida.mp4 portada.png`.
  - `stills_*.mjs` — capturas de fotogramas para revisar.
- `scripts/voz/` — generación de voz con Kokoro (voz 3 = em_alex 0.6 + im_nicola 0.4; voz 5 = ef_dora 0.7 + if_sara 0.3).
- `scripts/asr/` — transcripción por palabra con Whisper offline (`asr.mjs`) y ejemplos de alineación al guion.
- `scripts/audio/` — `kit.py` (efectos sintetizados), `musica2.py` (música 104 bpm), `mezcla_*.py` (efectos en pausas + ducking), `pausas.py`, `limpiar_mi_voz.py` (cuando es tu voz grabada).

## Instalación en un entorno nuevo (Linux)
```bash
cd app && npm install                      # Remotion y paquetes
pip install kokoro-onnx soundfile numpy --break-system-packages
# Modelos Kokoro v1.0 (GitHub releases de thewh1teagle/kokoro-onnx):
#   kokoro-v1.0.onnx y voices-v1.0.bin  -> ajusta la ruta en scripts/voz/*.py
# Whisper offline para tiempos: npm i sts-whisper-small @huggingface/transformers --ignore-scripts
# ffmpeg con rubberband para limpiar y mezclar audio
```
Chromium: Remotion usa un Chromium local (`browserExecutable` en render_c.mjs); cámbialo por el de tu entorno.

## Flujo (resumen; el detalle está en Notion: «Instructivo: cómo hacemos un video»)
1. Guion por líneas en `scripts/voz/voz_*.py` (pantalla con *clave*, texto hablado, velocidad, pausa).
2. `python3 voz.py` → `public/<video>/voz.wav` + `words.json` (palabras, líneas, hablante).
3. Verificar pronunciación con `asr.mjs`.
4. Copiar la plantilla `.tsx` más parecida, cambiar escenas (`SC`), textos y visuales; registrar en `Root.tsx` y en `COVERS`.
5. `python3 scripts/audio/mezcla_<video>.py` → `voz_mix.wav` (música + efectos en pausas).
6. Revisar fotogramas con `stills_*.mjs`; render con `render_c.mjs` (720×1280, crf 20).
