import json,re
T=json.load(open('/home/claude/kokoro/raw3_dora.wav.json'))
D=["¡Martes, 3 de noviembre!",
"Cierran las urnas en Estados Unidos... y Wall Street empieza a sangrar.",
"Las pantallas se pintan de rojo... cada vez más rojo.",
"Las acciones de inteligencia artificial, las intocables, se desploman... ¡y nadie las puede detener!",
"Ya van casi 25% abajo de su máximo.",
"¿Explotó la burbuja de la inteligencia artificial?",
"Pero ojo... ese dinero no se evaporó, ¡huyó!",
"Y te voy a decir a dónde.",
"Ese martes hubo elecciones intermedias en Estados Unidos, y uno de los temas de campaña fue frenar los centros de datos:",
"las naves donde vive la inteligencia artificial, y que devoran cantidades enormes de energía.",
"El mercado entró en pánico: si construirlos se vuelve más difícil, la inteligencia artificial va a tardar más en dar ganancias.",
"Y eso es un problema gigante, porque las grandes tecnológicas están gastando como nunca en la historia:",
"¡750 mil millones de dólares, solo en 2026!",
"Si el negocio tarda en pagar, todo ese dinero se queda atrapado.",
"Y como estas empresas son un tercio de la bolsa americana, cuando caen... ¡arrastran a todo el mercado con ellas!",
"Y antes de seguir: si haces scroll ahora, probablemente nunca vuelvas a encontrar esta cuenta.",
"Y te vas a perder lo que nadie te está diciendo sobre tu dinero.",
"Así que sígueme... porque ahora viene lo bueno.",
"¿A dónde huyó el dinero? Primero, a salud.",
"Los medicamentos para bajar de peso de Eli Lilly y de Novo Nordisk, la de Ozempic, dieron un salto enorme: de la inyección, a la pastilla.",
"Novo Nordisk lanzó la suya en enero, y Lilly consiguió la aprobación de la suya en abril.",
"Y también, los tratamientos contra el cáncer.",
"Segundo, a energía: la inteligencia artificial necesita electricidad, y las empresas que la generan también se están llevando su parte.",
"Pero el golpe no se quedó allá. ¡También llegó a México!",
"El jueves 5 de noviembre, el Banco de México bajó su tasa a 6.25%. Así que los Cetes van a pagarte menos.",
"Y la diferencia con la tasa de Estados Unidos ya es la más chica de toda la historia.",
"Si un inversionista gana casi lo mismo allá, y con menos riesgo... ¿para qué se queda aquí? Se lleva su dinero.",
"¿El resultado? Ese mismo jueves, el dólar cerró en $18.74 pesos.",
"El dólar sube... y el peso se tambalea.",
"Si inviertes en acciones de Estados Unidos desde un broker mexicano, esa subida del dólar te amortigua un poco la caída...",
"pero no te salva.",
"¿Entonces, qué hacer?",
"Hay quien ve aquí la oportunidad de comprar barato.",
"Y hay quien prefiere salir corriendo, antes de que caiga más.",
"¿Tú qué harías? Te leo en los comentarios.",
"Si esta información te fue útil, pulsa el corazón.",
"Para ti es un segundo... y a mí me ayuda a seguir haciendo estos videos para ti.",
"Y sígueme, para que la próxima vez que el mercado se ponga de terror... tú ya sepas qué está pasando."]
assert len(D)==len(T),(len(D),len(T))
SP={'3':5,'25%':22,'750':24,'2026!':18,'5':5,'6.25%.':30,'$18.74':38}
out=[]
for d,t in zip(D,T):
    ws=d.split(); wt=[]
    for w in ws:
        x=SP.get(w,len(re.sub(r'[^\wáéíóúñü]','',w,flags=re.I))+1.5)
        if w.endswith('...'): x+=5
        elif w[-1] in ',:;': x+=2.5
        elif w[-1] in '.!?': x+=3
        wt.append(x)
    tot=sum(wt); s=t['start']; dur=t['end']-t['start']
    for i,(w,x) in enumerate(zip(ws,wt)):
        out.append(dict(t=w,s=round(s,2),e=round(s+dur*x/tot*0.9,2),line=len(out) and 0)); s+=dur*x/tot
json.dump(out,open('src/words.json','w'),ensure_ascii=False)
print(len(out))
