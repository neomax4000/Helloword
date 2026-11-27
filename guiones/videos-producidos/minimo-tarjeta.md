# Pagar solo el mínimo de la tarjeta (T05, semana de pruebas) — 40.5 s
Producido 2026-11-27 · Código: `kit/app/src/minimo-tarjeta.tsx` (Root: `Minimo` / `MinimoCover`) · Guion: `kit/scripts/pro/guiones/minimo-tarjeta.json` · Voz 3, 1.03 (Whisper, 10 palabras interpoladas) · Mezcla −14 LUFS, pico −2.7 · Portada `capturas/68_MINIMO_TARJETA_portada.png`
Programado: Buffer, vie 27 nov 12:00 CDMX.

## Etiquetas de la prueba
- **ID:** T05
- **Apertura:** predicción «adivina, la respuesta al final» (la voz afirma; número tapado ██ en pantalla)
- **Texto:** medio (cifras clave, sellos y notas de expediente; subtítulos por frase; pregunta escrita al final)
- **Estructura:** error común (lo que casi todos hacen mal → por qué cuesta → cómo se hace bien)
- **Fondo y animación:** thriller (grano, viñeta, escaneo, tipografía de expediente, curva de saldo que se dibuja)
- **Duración objetivo:** 40 s (real 40.5 s)
- **Voz:** 3 (narrador)

## Guion hablado ( | = corte de subtítulo)
Adivina cuánto tardas | en liquidar | diez mil pesos | pagando | solo el mínimo. | La respuesta, | al final.
Casi todos | pagan el mínimo | y creen | que van bien.
Ese pago cubre | intereses, | comisiones | y muy poco capital.
Ejemplo: | debes diez mil pesos | y tu mínimo | es de cuatrocientos quince.
Cada mes | el banco cobra primero | sus intereses. | Tu deuda | baja muy despacio.
Según la Condusef, | el pago mínimo | es la opción | más cara | para tu bolsillo.
Ahora sí, | la respuesta: | casi tres años. | Y casi | cinco mil pesos | solo de intereses.
Lo correcto: paga el total para no generar intereses. Si no puedes, paga siempre más que el mínimo.
Antes de pagar el mínimo, haz la cuenta. Y adivina, → (bucle con «Adivina cuánto tardas…»)
Escrito: «¿Cuántos meses tardarías con tu tarjeta? Cuéntame en comentarios» · «＋ SÍGUEME» · nota legal.

## Cifras y cálculo (hipotético, base visible en pantalla)
- Deuda $10,000, pago fijo $415 (4.15 %), interés de EJEMPLO 28 % anual (2.33 % mensual), sin compras nuevas. Cálculo propio mes a mes: **36 meses** y **$4,864** de intereses (script en el .tsx, `bal`/`intCum`).
- Contraste: ejemplo de Profeco en El Financiero (6-may-2023): deuda de 10 mil, mínimo de 415 → hasta 35 meses y hasta $4,963 de interés. Coincide en orden de magnitud con el cálculo propio.

## Fuentes
- El Imparcial, 8-abr-2026 (cita CONDUSEF): «El pago mínimo es la opción más cara para tu bolsillo»; el mínimo suele cubrir intereses, comisiones y solo una pequeña parte del capital. https://www.elimparcial.com/dinero/2026/04/08/solo-pagas-el-minimo-este-es-el-tiempo-que-tienes-antes-de-liquidar-tu-tarjeta/
- Vanguardia, 21-feb-2026 (CONDUSEF): el mínimo cubre intereses, comisiones y una pequeña parte del capital, que disminuye lentamente; pagar el mínimo puede duplicar o triplicar la deuda original. https://vanguardia.com.mx/informacion/condusef-advierte-sobre-pago-minimo-de-tu-tarjeta-de-credito-asi-puede-aumentar-tu-deuda-segun-el-banco-MI19334954
- El Financiero, 6-may-2023 (Profeco): ejemplo de 10 mil pesos y mínimo de 415. https://www.elfinanciero.com.mx/mis-finanzas/2023/05/06/como-usar-la-calculadora-de-pagos-minimos-de-tarjetas-de-credito-condusef/
- Pago para no generar intereses = total antes de la fecha límite: tarjeta-credito.md (CONDUSEF vía El Imparcial, 7-feb-2026).

## Descripción
Pagar solo el mínimo parece poco, pero cuesta mucho. Ejemplo hipotético: deuda de $10,000, mínimo de $415 e interés de 28 % anual → casi 3 años y casi $5,000 de intereses. Lo correcto: paga el total para no generar intereses; si no puedes, siempre más que el mínimo. Contenido educativo, no es recomendación de inversión.
#tarjetadecredito #pagominimo #educacionfinanciera #finanzaspersonales #condusef

## Puntos por vigilar
- Todas las fuentes son notas periodísticas que citan a CONDUSEF/Profeco; no se leyó la fuente primaria (condusef.gob.mx). Se evitó afirmar un % típico del mínimo (UnoTV dice <2 %, El Imparcial 2–5 %).
- El 28 % anual y el pago de $415 son supuestos de ejemplo (rotulados en pantalla y en la nota legal); las tarjetas reales suelen cobrar tasas distintas.
- Whisper transcribe «Condusef» como «Conducef» (solo en la transcripción); la voz Kokoro dice «Condusef».
- Barras de «qué hay en tu pago mínimo» son esquema ilustrativo (rotulado «no son cifras reales»). Sin logo Actinver, sin promesas.
- Estilo thriller: tipografía Courier del sistema (monoespaciada).
