# Afore: las semanas que te faltan para pensionarte (educativo, sin marca) — 35.8 s — T03 de la semana de pruebas
Producido 2026-11-26 · Código: `kit/app/src/afore-semanas.tsx` (Root: `AforeSemanas` / `AforeSemanasCover`) · Guion: `kit/scripts/pro/guiones/afore-semanas.json` · Portada: `capturas/66_AFORE_SEMANAS_portada.png` · Programado: jue 26 nov 12:00 CDMX (Buffer).

## Etiquetas de prueba (T03)
- **Apertura:** a mitad de la historia (el chat ya va empezado y la primera voz es Ana: «Ya fui al IMSS: me faltan setenta y cinco semanas»).
- **Texto en pantalla:** medio, en burbujas de chat (frases clave + 3 tarjetas: ley 2026 con barra 800/875, meta que sube 1,250→875→1,000, cuenta 75 ÷ 52).
- **Estructura:** caso con personaje (Ana, hipotético; rotulado en pantalla).
- **Fondo y animación:** pantalla de chat tipo mensajería hecha en Remotion (cabecera verde, papel tapiz con puntos, burbujas que empujan el scroll, «escribiendo…»), sin marcas ni capturas reales.
- **Duración:** 35.8 s (objetivo 45 s; se añadió un bloque de cálculo pero el guion verificable no daba para más).
- **Voz:** 3 (narrador) + 5 (Ana, bloques con `"voz": "5"`; se añadió soporte de voz por bloque en `voz_pro.py`).

## Cambio de tema respecto al plan
El plan decía «Tu Afore no alcanza para retirarte (VERIFICAR cifra)». No se pudo confirmar con fuente oficial una cifra de saldo, tasa de reemplazo ni monto de pensión (las notas de prensa se contradicen: pensión mínima 10,636.54 vs promedio 6,600 pesos). Se conservó el tema Afore/pensión y el estilo, pero se cambió el gancho a la cifra que sí tiene dos fuentes: **semanas de cotización que pide hoy la ley (875)**. Sin montos de pensión ni rendimientos.

## Guion hablado ( | = corte de subtítulo)
[Ana] Ya fui al IMSS: | me faltan | setenta y cinco | semanas.
Ana cotizó | ochocientas semanas. | Unos quince años.
Pero hoy | la ley pide | ochocientas | setenta y cinco.
[Ana] O sea que todavía | no me toca | la pensión.
Y la meta | sigue subiendo: | mil semanas | en dos mil | treinta y uno. | Antes eran | mil doscientas | cincuenta.
[Ana] Entonces tengo | que seguir | cotizando.
Cada año completo | cotizando | suma unas | cincuenta y dos. | A Ana le falta | casi año y medio.
Los meses | sin cotizar | no suman nada. | Y solo cuentan | las semanas cotizadas | al IMSS, | no los años | que trabajaste.
Revisa | cuántas llevas hoy, | porque, → (bucle con la primera frase de Ana)

## Fuentes y cálculos
- Reforma 2020: semanas pasan de 1,250 a 750 y suben gradualmente hasta 1,000 en 2031 — CEFP, Nota informativa 090/2020 (11 dic 2020), https://www.cefp.gob.mx/publicaciones/nota/2020/notacefp0902020.pdf (leída). También cita arts. 154 y 162 de la LSS y que la pensión garantizada es para quienes cumplan el tiempo de cotización.
- 875 semanas en 2026 (cesantía/vejez, Ley 97): El Imparcial, 21 mar 2026 y UnoTV, 8 oct 2026 (ambas leídas; coinciden). Coherente con el calendario 750 en 2021 + 25 por año. **Pendiente: no se leyó el texto vigente de la LSS ni la página del IMSS (no cargaron).**
- Cálculos: 800 ÷ 52 ≈ 15.4 años; 75 ÷ 52 ≈ 1.4 años; 52 semanas por año (calendario). Ana y sus 800 semanas son un caso hipotético.
- No usado por no confirmarse: monto de pensión mínima garantizada 2026 (10,636.54 vs 6,600 promedio), tasa de reemplazo 71 % (solo prensa citando CONSAR), 26 % del salario.

## Notas
- Transcripción de la voz (Whisper) = guion; dice «a LIMS» una vez por «al IMSS» (error del reconocedor, de oído revisar) y «Previsa» por «Revisa».
- Mezcla −13.9 LUFS, pico −2.9 dBFS. Cierre: la voz queda en «porque,» y el chat vuelve a «Ana escribiendo…» (bucle con su primera frase).
- Puntos por vigilar: la cifra 875 (confirmar con el IMSS/LSS), que Ana es caso hipotético, nota «no es recomendación», sin marca Actinver. El mensaje no promete montos.
- Descripción TikTok: «Ana cotizó 800 semanas y hoy la ley pide 875: le faltan 75. La meta sigue subiendo hasta 1,000 en 2031. Solo cuentan las semanas cotizadas al IMSS. Revisa cuántas llevas. Caso hipotético; contenido educativo, no es recomendación de inversión.» Hashtags: #afore #pension #imss #finanzaspersonales #educacionfinanciera #mexico
