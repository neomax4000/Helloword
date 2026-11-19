#!/usr/bin/env bash
# Prepara un entorno nuevo (sesión en la nube) para producir y subir videos. Se puede repetir: salta lo que ya está.
# Uso: bash kit/scripts/preparar_entorno.sh      (desde la raíz del repo)
set -u
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
KOKORO_DIR="${KOKORO_DIR:-/home/claude/video/voz}"
ASR_DIR="${ASR_DIR:-/home/claude/asr}"
ok(){ echo "[ok] $*"; }; falta(){ echo "[FALTA] $*"; }

# 1. Remotion
[ -d "$ROOT/kit/app/node_modules" ] || (cd "$ROOT/kit/app" && npm install --no-audit --no-fund >/dev/null 2>&1)
[ -d "$ROOT/kit/app/node_modules" ] && ok "Remotion (node_modules)" || falta "Remotion: corre npm install en kit/app"

# 2. Kokoro (paquete + modelos)
python3 -c "import kokoro_onnx, soundfile, numpy" 2>/dev/null || pip install kokoro-onnx soundfile numpy --break-system-packages >/dev/null 2>&1
mkdir -p "$KOKORO_DIR"
for f in kokoro-v1.0.onnx voices-v1.0.bin; do
  [ -s "$KOKORO_DIR/$f" ] || curl -sSL -o "$KOKORO_DIR/$f" "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/$f"
  [ -s "$KOKORO_DIR/$f" ] && ok "Kokoro: $f" || falta "Kokoro: $f (no se pudo bajar)"
done

# 3. Whisper offline (alineación palabra por palabra)
mkdir -p "$ASR_DIR"; cp -n "$ROOT/kit/scripts/asr/asr.mjs" "$ASR_DIR/" 2>/dev/null
[ -d "$ASR_DIR/node_modules/sts-whisper-small" ] || (cd "$ASR_DIR" && { [ -f package.json ] || npm init -y >/dev/null; } && npm i sts-whisper-small @huggingface/transformers --ignore-scripts >/dev/null 2>&1)
[ -d "$ASR_DIR/node_modules/sts-whisper-small" ] && ok "Whisper offline" || falta "Whisper offline (la voz saldrá con alineación proporcional: avísalo)"

# 4. Chromium para render (los scripts lo buscan en /tmp/chromium)
if [ ! -x /tmp/chromium ]; then
  C="$(ls /opt/pw-browsers/chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell 2>/dev/null | head -1)"
  [ -n "$C" ] && ln -sf "$C" /tmp/chromium
fi
[ -x /tmp/chromium ] && ok "Chromium (/tmp/chromium)" || falta "Chromium: define CHROMIUM=<ruta> o enlaza el headless-shell en /tmp/chromium"

# 5. ffmpeg
command -v ffmpeg >/dev/null && ok "ffmpeg" || falta "ffmpeg (instálalo con apt o el gestor del entorno)"

echo
echo "Conectores (no se instalan desde aquí): Buffer, GitHub y Notion. Revisa que sus herramientas aparezcan (ToolSearch)."
echo "Si falta Buffer: entrega el MP4 y la portada por SendUserFile, deja el video EN RESERVA y avisa por notificación."
