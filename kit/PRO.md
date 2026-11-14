# Estándar Pro — cómo se hace un video (vigente desde 2026-11-13)

Aplica a TODOS los videos nuevos: glosario, educativo, noticia y producto. Aprobado por Brandon el 2026-11-13 («una gran mejora, aplica los cambios»). El piloto y referencia es **Aguinaldo** (`app/src/aguinaldo.tsx`, guion `scripts/pro/guiones/aguinaldo.json`). Los videos anteriores no se tocan.

## 1. Guion (lo más importante)
1. **Gancho = dato + tensión, en afirmación**, en las primeras 8 palabras y en el primer fotograma. Algo concreto que el espectador tiene, pierde o no sabe: «Tu aguinaldo no es un regalo: es ley». Nada abstracto («Todo tu dinero en un solo lugar es riesgo» no sirve).
2. **Promesa abierta en la segunda frase**, de preferencia numerada: «trae tres números que casi nadie revisa». En pantalla, un contador «1 DE 3».
3. **Cada idea con un ejemplo con cifras** (hipotético y con base de cálculo visible): «Si ganas 12 mil al mes, son 6 mil pesos».
4. **El punto más valioso al final de la lista, anunciado**: «Y tres, el que más se pierde».
5. **Cero líneas habladas sin valor.** No se dice «sígueme», «si te sirvió», «esto es información educativa» ni el aviso legal: van ESCRITOS (chip «＋ SÍGUEME», nota legal fija). Excepción: producto conserva la invitación hablada corta «Escríbeme» al final, en una sola frase.
6. **Cierre en bucle**: la última frase queda abierta y se completa con la primera («Haz tu cuenta antes de gastarlo, porque…» → «Tu aguinaldo no es un regalo: es ley»). El último fotograma es igual al primero.
7. **Duración**: glosario 18–25 s · educativo 28–40 s · noticia 35–50 s · producto 35–45 s (+ pantalla legal).
8. Sin preguntas en la voz (pueden ir escritas). Números en letra en el texto hablado; inglés como suena («laik»). Sin promesas ni cifras de rendimiento. Cada cifra con dos fuentes; fuentes anotadas en `guiones/videos-producidos/<id>.md`.
9. Un bloque = una idea (1–2 frases). Los cortes del subtítulo se escriben a mano con `|` para que nunca se lea una frase partida sin sentido («NO ES UN REGALO» junto, no «ES UN REGALO» solo).

## 2. Voz
- Kokoro, voz 3 por defecto (5 para narradora, D para el glosario). Velocidad **1.03** (1.00–1.05). El ritmo sale del guion corto, no de acelerar.
- Se genera **por bloques** (no línea por línea) y pausas de 0.15–0.3 s; 0 en el último bloque si hay bucle.
- `python3 kit/scripts/pro/voz_pro.py <id>` genera, masteriza (−15 LUFS, de-esser) y **alinea cada palabra con Whisper**. Imprime la transcripción: debe decir lo mismo que el guion; si una palabra suena mal, reescríbela como se pronuncia y repite.
- Si Whisper no está, la alineación es proporcional (lo dice y lo anota en words.json): avisa en la entrega.

## 3. Diseño (`app/src/pro.tsx`)
- **Una sola identidad**: fondo profundo con malla de color y grano (`Backdrop`, moods `navy`, `forest`, `plum`, `ember`, `steel`; `actinver` para producto), tarjetas crema (`Card`), acento ámbar (canal) u ocre (producto), verde = sí / bien, coral = no / alerta.
- La serie se distingue por el rótulo del `Frame` («GLOSARIO FINANCIERO», «FINANZAS FÁCILES», «NOTICIA · 14 NOV», «DATO ACTINVER»), no por otro diseño.
- **El dato es la imagen**: cada escena tiene UNA pieza protagonista grande (número gigante, calendario, barra, cuenta, objeto ilustrado) + 2–4 piezas de apoyo. Nada de píldoras que repiten la voz como pieza principal.
- **Zonas seguras de TikTok**: contenido entre y=170 y y=1500, x de 70 a 950 (botones a la derecha). Subtítulos en y≈1300. Nota legal en y=1532 (zona de la descripción: solo letra chica).
- Subtítulos `Captions`: por frase, 76 px, mayúsculas, palabra activa en el acento, palabras clave (lista `KEYS`) en acento.
- Producto: envolver en `<Brand value={ACTINVER}>` (acento ocre, logo blanco arriba a la derecha), moods `actinver`/`steel`, pantalla final con el aviso legal literal del Folleto (const LEGAL en `actimed.tsx`) o leyenda IPAB.
- Fondo cambia por sección (cada 2–3 escenas) con cortina circular.

## 4. Animación
- Cada escena entra distinto (`Scene kind`: up, left, zoom, down) y sale rápido (0.17 s).
- Movimiento con intención, ligado a la palabra exacta (`T(i)` = inicio de la palabra i): números que cuentan, barras que se llenan, calendarios que se iluminan, sello que cae, tache que tacha, texto que sube detrás de máscara (`Mask`), tarjetas que suben (`Rise`), chips que saltan (`Pop`).
- Un cambio visual cada 1.5–2 s. Cámara con deriva lenta (3.5 %) dentro de cada escena.
- Glosario: mismo sistema, movimientos más suaves (sin sacudida ni sello con rebote fuerte).

## 5. Sonido
- `python3 kit/scripts/pro/mezcla_pro.py <id>`: whoosh corto en cada pausa entre bloques, música con ducking, mezcla final **−14 LUFS**.
- Golpes ligados a momentos clave en `"sfx"` del guion (sello en la revelación, tics en un conteo, ding en la cifra, riser + impacto antes del punto más fuerte). Fuertes en las pausas; bajos (−14 a −22 dB) si caen sobre la voz.

## 6. Paso a paso
1. Tema y fuentes (dos por cifra). Escribe `kit/scripts/pro/guiones/<id>.json` (formato en `voz_pro.py`).
2. `python3 kit/scripts/pro/voz_pro.py <id>` → revisa la transcripción.
3. Copia `kit/app/src/aguinaldo.tsx` a `<id>.tsx`: cambia import de words.json, escenas (una `S#` por bloque), `KEYS`, `MOOD_AT`, `PASOS`, rótulo y nota del `Frame`, portada (`<Id>Cover`). Registra `<Id>` y `<Id>Cover` en `Root.tsx`.
4. Agrega `"sfx"` al guion y corre `python3 kit/scripts/pro/mezcla_pro.py <id>`.
5. Revisa fotogramas a tamaño completo en los momentos más cargados (`node kit/app/st.mjs <Id> <carpeta> 0.4 <segundos...>`): nada fuera de zona segura, nada encimado, subtítulos completos.
6. Render: `node kit/app/render_pro.mjs <Id> salida.mp4 <Id>Cover portada.png` (720×1280, crf 18). Revisa el MP4 final: fotogramas del inicio, de cada cambio y del final (bucle), y transcribe el audio final.
7. Guarda guion + fuentes en `guiones/videos-producidos/<id>.md`, portada en `capturas/`, código en `kit/`. Publica según CLAUDE.md.

## 7. Lista de control antes de publicar
- [ ] Gancho con dato concreto en ≤ 8 palabras y en el primer fotograma
- [ ] Promesa abierta (numerada) en la segunda frase
- [ ] Al menos un ejemplo con cifras y su base de cálculo en pantalla
- [ ] Ninguna línea hablada sin valor; CTA y aviso legal escritos
- [ ] Transcripción igual al guion (palabras dudosas anotadas)
- [ ] Alineación con Whisper (o avisada como proporcional)
- [ ] Subtítulos con cortes a mano; nada fuera de zonas seguras ni encimado
- [ ] Mezcla −14 LUFS ±1, pico < −1 dBTP
- [ ] Cada cifra con dos fuentes en el .md del video
- [ ] Último fotograma enlaza con el primero
