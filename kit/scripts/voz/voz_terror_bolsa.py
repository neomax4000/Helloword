import numpy as np, soundfile as sf, json, sys
from kokoro_onnx import Kokoro
k=Kokoro('kokoro-v1.0.onnx','voices-v1.0.bin')
VOICE=sys.argv[1]; OUT=sys.argv[2]
a_,b_,c_=0.10,0.22,0.42   # pausas: corta, media, dramática
S=[
("¡Martes, tres de noviembre!",1.0,b_),
("Cierran las urnas en Estados Unidos... y Wol Strit empieza a sangrar.",1.0,b_),
("Las pantallas se pintan de rojo... cada vez más rojo.",1.0,b_),
("Las acciones de inteligencia artificial, las intocables, se desploman... ¡y nadie las puede detener!",1.02,b_),
("Ya van casi veinticinco por ciento abajo de su máximo.",1.02,c_),
("¿Explotó la burbuja de la inteligencia artificial?",1.02,b_),
("Pero ojo... ese dinero no se evaporó, ¡huyó!",1.0,a_),
("Y te voy a decir a dónde.",1.0,c_),
("Ese martes hubo elecciones intermedias en Estados Unidos, y uno de los temas de campaña fue frenar los centros de datos:",1.08,a_),
("las naves donde vive la inteligencia artificial, y que devoran cantidades enormes de energía.",1.08,b_),
("El mercado entró en pánico: si construirlos se vuelve más difícil, la inteligencia artificial va a tardar más en dar ganancias.",1.08,b_),
("Y eso es un problema gigante, porque las grandes tecnológicas están gastando como nunca en la historia:",1.08,a_),
("¡setecientos cincuenta mil millones de dólares, solo en dos mil veintiséis!",1.05,b_),
("Si el negocio tarda en pagar, todo ese dinero se queda atrapado.",1.08,a_),
("Y como estas empresas son un tercio de la bolsa americana, cuando caen... ¡arrastran a todo el mercado con ellas!",1.06,c_),
("Y antes de seguir: si haces scrol ahora, probablemente nunca vuelvas a encontrar esta cuenta.",1.06,a_),
("Y te vas a perder lo que nadie te está diciendo sobre tu dinero.",1.06,a_),
("Así que sígueme... porque ahora viene lo bueno.",1.04,c_),
("¿A dónde huyó el dinero? Primero, a salud.",1.08,a_),
("Los medicamentos para bajar de peso de Eli Lili y de Novo Nórdisk, la de Ozémpic, dieron un salto enorme: de la inyección, a la pastilla.",1.08,a_),
("Novo Nórdisk lanzó la suya en enero, y Lili consiguió la aprobación de la suya en abril.",1.08,a_),
("Y también, los tratamientos contra el cáncer.",1.08,b_),
("Segundo, a energía: la inteligencia artificial necesita electricidad, y las empresas que la generan también se están llevando su parte.",1.08,c_),
("Pero el golpe no se quedó allá. ¡También llegó a México!",1.05,a_),
("El jueves cinco de noviembre, el Banco de México bajó su tasa a seis punto veinticinco por ciento. Así que los cetes van a pagarte menos.",1.08,a_),
("Y la diferencia con la tasa de Estados Unidos ya es la más chica de toda la historia.",1.08,a_),
("Si un inversionista gana casi lo mismo allá, y con menos riesgo... ¿para qué se queda aquí? Se lleva su dinero.",1.08,b_),
("¿El resultado? Ese mismo jueves, el dólar cerró en dieciocho pesos con setenta y cuatro centavos.",1.06,a_),
("El dólar sube... y el peso se tambalea.",1.04,c_),
("Si inviertes en acciones de Estados Unidos desde un bróker mexicano, esa subida del dólar te amortigua un poco la caída...",1.08,a_),
("pero no te salva.",1.02,c_),
("¿Entonces, qué hacer?",1.05,a_),
("Hay quien ve aquí la oportunidad de comprar barato.",1.08,a_),
("Y hay quien prefiere salir corriendo, antes de que caiga más.",1.08,b_),
("¿Tú qué harías? Te leo en los comentarios.",1.06,b_),
("Si esta información te fue útil, pulsa el corazón.",1.06,a_),
("Para ti es un segundo... y a mí me ayuda a seguir haciendo estos videos para ti.",1.06,a_),
("Y sígueme, para que la próxima vez que el mercado se ponga de terror... tú ya sepas qué está pasando.",1.04,0.6),
]
def trim(a,sr,thr=0.012,keep=0.03):
    idx=np.where(np.abs(a)>thr)[0]
    if len(idx)==0: return a
    s=max(0,idx[0]-int(keep*sr)); e=min(len(a),idx[-1]+int(keep*sr)); return a[s:e]
out=[];t=0;timing=[]
for txt,sp,pz in S:
    a,sr=k.create(txt,voice=VOICE,speed=sp,lang='es'); a=trim(a,sr)
    timing.append(dict(text=txt,start=round(t,2),end=round(t+len(a)/sr,2)))
    out+= [a,np.zeros(int(pz*sr),dtype=a.dtype)]; t+=len(a)/sr+pz
sf.write(OUT,np.concatenate(out),sr); json.dump(timing,open(OUT+'.json','w'),ensure_ascii=False,indent=1)
print(OUT,round(t,1))
