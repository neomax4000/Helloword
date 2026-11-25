# Reto de ahorro de 52 semanas (educativo, sin marca) — 34 s — T01 de la semana de pruebas
Producido 2026-11-25 · Código: `kit/app/src/reto52.tsx` (Root: `Reto52` / `Reto52Cover`) · Guion: `kit/scripts/pro/guiones/reto52.json` · Portada: `capturas/64_RETO52_portada.png` · Programado: mié 25 nov 12:00 CDMX (Buffer).

## Etiquetas de prueba (T01)
- **Apertura:** resultado primero (la cifra final «$13,780» en el primer fotograma y en la voz).
- **Texto en pantalla:** poco, solo números (contador, burbuja de cada semana, «1+2+…+52», «43 → 52», «52 → 1»). Además: subtítulos, rótulo de serie, chip «＋ SÍGUEME», pregunta escrita «¿EMPIEZAS HOY?» y nota legal (todo lo exigido por las reglas).
- **Estructura:** cuenta en vivo (una sola operación armada paso a paso).
- **Fondo y animación:** mundo continuo: una escalera de 52 escalones y una cámara que viaja (zoom/pan) sin un solo corte; malla verde («forest»), pasa a «ember» en el tramo de las últimas diez semanas. Gancho = vista general; se «vacía» y la cámara se lanza al escalón 1; termina otra vez en la vista general (bucle).
- **Duración:** 34 s (objetivo 35 s).
- **Voz:** 3 (narrador), 1.03.

## Guion hablado ( | = corte de subtítulo)
Trece mil | setecientos | ochenta pesos.
Es el reto | de las cincuenta | y dos semanas.
Semana uno: | diez pesos. | Semana dos: | veinte.
Cada semana, | diez más.
Semana veinte: | doscientos. | Semana | cincuenta y dos: | quinientos veinte.
Suma de uno | a cincuenta y dos: | mil trescientos | setenta y ocho.
Por diez pesos: | trece mil | setecientos | ochenta.
Pero lo pesado | viene al final.
Las últimas | diez semanas | suman cuatro mil | setecientos | cincuenta.
Hazlo al revés: | empieza con | quinientos veinte, | cuando más | ganas tienes.
Así llegas, | a fin de año, | a → (bucle: «Trece mil setecientos ochenta pesos.»)

## Cifras y verificación
Es una cuenta hipotética, sin rendimientos: ahorro de $10 × número de semana. Suma 1+2+…+52 = 52×53/2 = 1,378; ×$10 = $13,780; semana 52 = $520; semanas 43 a 52 = 475 × $10 = $4,750. Verificado por dos vías: fórmula de la suma de Gauss (n(n+1)/2) y suma directa con código (Python). No es dato de fuente externa, por lo que no aplica «dos fuentes» más allá del cálculo.

## Notas
- Transcripción final (Whisper) = guion; única diferencia de oído: «Hazlo» sale «Háflo» en la transcripción del MP4 (en la pasada de alineación dijo «Hazlo»); revisar de oído. «cincuenta y dos» → «50 y 2» es solo la forma en que Whisper escribe.
- Alineación Whisper por palabra (40 de 86 interpoladas dentro de bloque).
- Mezcla −14 LUFS, pico −2.5 dBTP. Último fotograma ≈ primero (bucle visual; el último añade el chip «¿EMPIEZAS HOY?» y «＋ SÍGUEME»).
- Puntos por vigilar: la cifra del ejemplo y la nota «sin rendimientos». Sin marca ni productos Actinver.
- Descripción TikTok: «Con $10 la primera semana y 10 más cada semana, en 52 semanas juntas $13,780. Ojo con las últimas 10 semanas: son $4,750. ¿Empiezas hoy o al revés? Cuenta ilustrativa, sin rendimientos. Contenido educativo, no es recomendación de inversión.» Hashtags: #ahorro #retodeahorro #52semanas #finanzaspersonales #educacionfinanciera #mexico
