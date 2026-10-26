import numpy as np, soundfile as sf, subprocess
from kokoro_onnx import Kokoro
k=Kokoro("/home/claude/video/voz/kokoro-v1.0.onnx","/home/claude/video/voz/voices-v1.0.bin")
V=np.load("/home/claude/video/voz/voices-v1.0.bin")
T="¿Y si un año no puedo pagar? Tranquilo, tiene solución. Hoy te explico cómo funciona el periodo de descanso, y por qué tu protección sigue activa."
mix=lambda d: sum(V[n]*w for n,w in d.items())
S={
 "1_santa": (V["em_santa"],1.0,0),
 "2_alex_grave": (V["em_alex"],0.98,-1.5),
 "3_mezcla_alex_nicola": (mix({"em_alex":0.6,"im_nicola":0.4}),1.0,0),
 "4_mezcla_santa_alex": (mix({"em_santa":0.5,"em_alex":0.5}),1.0,0),
 "5_dora_calida": (mix({"ef_dora":0.7,"if_sara":0.3}),1.0,0),
 "6_dora": (V["ef_dora"],1.0,0),
}
for name,(sty,spd,st) in S.items():
    s,sr=k.create(T,voice=sty,speed=spd,lang="es")
    sf.write("/tmp/s.wav",s.astype(np.float32),sr)
    r=2**(st/12)
    subprocess.run(["ffmpeg","-y","-v","error","-i","/tmp/s.wav","-af",
      f"rubberband=pitch={r:.4f}:formant=preserved,highpass=f=70,equalizer=f=180:t=q:w=1:g=2,equalizer=f=3500:t=q:w=1:g=2,acompressor=threshold=-20dB:ratio=3:attack=5:release=80,aecho=0.8:0.5:25:0.06,loudnorm=I=-14:TP=-1.5",
      "-ar","48000","-b:a","160k",f"{name}.mp3"],check=True)
    print(name, round(len(s)/sr,1))
