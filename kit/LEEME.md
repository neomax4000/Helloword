# Kit para producir los videos de Brandon (Remotion + Kokoro)

**Videos nuevos: lee `PRO.md` (Estándar Pro, vigente desde 2026-11-13).** Este archivo solo explica la instalación y qué hay en el kit.

## Qué hay adentro
- `PRO.md` — el estándar: guion, voz, diseño, animación, sonido, paso a paso y lista de control.
- `app/` — proyecto Remotion 4.0.536 (React). `src/Root.tsx` registra todas las composiciones.
  - **Estándar Pro:** `src/pro.tsx` (sistema visual: Backdrop, Scene, Rise, Pop, Mask, Card, Chip, Captions, Frame, Brand) y `src/aguinaldo.tsx` (plantilla de referencia). Render `render_pro.mjs`; fotogramas sueltos `st.mjs`.
  - Videos anteriores (solo para recrearlos o tomar piezas): narrador `actimed.tsx`, `acticob.tsx`; diálogo `vac2.tsx`, `actdual.tsx`; glosario claro `glosario.tsx`; noticia `outlook.tsx`, `noticia-fondos.tsx`; portada vieja `cover.tsx`; render viejo `render_c.mjs`.
  - `public/<video>/words.json` — tiempos por palabra (los WAV no se incluyen). `public/grain.png` — grano del Estándar Pro.
- `scripts/pro/` — voz por bloques + alineación con Whisper (`voz_pro.py`, `alinear_pro.py`), mezcla a −14 LUFS (`mezcla_pro.py`), guiones en `guiones/<id>.json`. Rutas en `comun.py` (variables `KOKORO_DIR`, `ASR_DIR`).
- `scripts/voz/`, `scripts/audio/` — scripts anteriores; `audio/kit.py` (efectos) y `audio/musica2.py` (música) los usa también el Estándar Pro. `voz/pregunta.py` — receta de entonación de pregunta.
- `scripts/asr/asr.mjs` — Whisper offline.

## Instalación en un entorno nuevo (Linux)
```bash
cd app && npm install                      # Remotion y paquetes
pip install kokoro-onnx soundfile numpy --break-system-packages
# Modelos Kokoro v1.0 (GitHub releases de thewh1teagle/kokoro-onnx): kokoro-v1.0.onnx y voices-v1.0.bin
#   en /home/claude/video/voz/ o en la carpeta de la variable KOKORO_DIR
# Whisper offline: en /home/claude/asr/ (o ASR_DIR): asr.mjs + npm i sts-whisper-small @huggingface/transformers --ignore-scripts
# ffmpeg
```
Chromium: `render_pro.mjs` usa `/tmp/chromium` o la variable `CHROMIUM`.

## Flujo del Estándar Pro (detalle en PRO.md)
1. `scripts/pro/guiones/<id>.json` → `python3 scripts/pro/voz_pro.py <id>` (voz + words.json alineado).
2. Copiar `app/src/aguinaldo.tsx` a `<id>.tsx`, escenas por bloque; registrar `<Id>` y `<Id>Cover` en `Root.tsx`.
3. `"sfx"` en el guion → `python3 scripts/pro/mezcla_pro.py <id>`.
4. Fotogramas con `node app/st.mjs <Id> <carpeta> 0.4 <segundos…>` y render con `node app/render_pro.mjs <Id> salida.mp4 <Id>Cover portada.png`.
