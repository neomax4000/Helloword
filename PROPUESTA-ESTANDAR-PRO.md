# Propuesta: Estándar Pro v1 (2026-11-13)

Auditoría del repositorio y de Notion, y propuesta para subir la calidad. El video piloto «Tu aguinaldo no es un regalo: es ley» está hecho con todo lo que aquí se propone. **APROBADA por Brandon el 2026-11-13 y aplicada:** reglas vigentes en `CLAUDE.md` y `kit/PRO.md`; reglas anteriores en `HISTORIAL-DECISIONES.md`.

## 1. Diagnóstico (lo que encontré)

### Diseño
- **Cuatro identidades distintas.** Educativo (colores planos con rayas y puntos), glosario (pastel), noticia (oscuro técnico) y producto (azul corporativo) parecen cuatro canales. Nadie reconoce el canal al deslizar.
- **Media pantalla vacía.** En casi todos los fotogramas el contenido ocupa el tercio de arriba; el resto es fondo.
- **Rótulos en lugar de imágenes.** La pieza principal suele ser una píldora con texto («POR TIPO», «UNA BAJA»). El video dice lo mismo en la voz, en el subtítulo y en la píldora: tres veces el mismo texto y ninguna imagen que explique.
- **Ilustraciones de figuras básicas** (rectángulos, círculos) con contorno negro grueso: se ve infantil para un tema de dinero.
- **Subtítulos chicos** dentro de una caja, sin control de dónde se corta la frase.

### Voz y tiempos
- **Los subtítulos no están sincronizados de verdad.** Los scripts reparten el tiempo de cada línea según el número de letras de cada palabra; no usan la transcripción. La palabra resaltada se adelanta o se atrasa.
- **Cada línea se genera aislada y acelerada (1.08).** Kokoro pierde la entonación entre frases y suena a lista leída.
- La pronunciación quedó «sin verificar» en varios videos porque Whisper no estaba disponible en esa corrida.

### Guion
- **Ganchos abstractos** («Todo tu dinero en un solo lugar es riesgo»): no hay un dato, una fecha ni algo que el espectador pueda perder.
- **Sin promesa abierta.** El guion no anuncia qué viene, así que no hay razón para quedarse.
- **Tres o cuatro líneas habladas que no dan valor**: «Y sígueme…», «Esto es información educativa…», «Si te sirvió…». Son 8–10 s de 47.
- Estructura de lista de definiciones; pocos ejemplos con números.

### Animación y sonido
- Casi todo entra igual (aparece con rebote) y se queda quieto. No hay conteos, trazos que se dibujan ni piezas que se transforman.
- Los efectos son correctos pero genéricos (whoosh en cada corte); no marcan los momentos clave.

### Reglas y documentación
- **Notion contradice a GitHub.** El Instructivo de Notion todavía dice: portada al inicio del video, «nada se publica sin Cumplimiento», 45–70 s, 2 videos por semana. `CLAUDE.md` dice lo contrario en los cuatro puntos.
- `CLAUDE.md` mezcla reglas vigentes con historial de decisiones; cuesta saber qué aplica hoy.
- Cada video es un archivo nuevo de 500–700 líneas copiado del anterior; los estilos se duplican y divergen.

## 2. Propuesta

### Diseño: un solo sistema visual (`kit/app/src/pro.tsx`)
- **Una identidad para todo el canal:** fondo profundo con malla de color y grano fino, tarjetas crema con sombra, un solo acento ámbar, verde para «sí» y coral para «no». El color del fondo cambia por sección (azul, verde, morado, rojo oscuro), pero la tipografía, las piezas y los subtítulos son siempre los mismos. Glosario, educativo, noticia y producto se distinguen por el rótulo de serie, no por otro diseño.
- **El dato es la imagen.** Cada escena tiene una pieza protagonista grande: el número («15», «20», «1 año»), un calendario, una barra, una cuenta. Las píldoras de texto quedan solo como apoyo.
- **Zonas seguras de TikTok fijas** (arriba 170 px, abajo 420 px, derecha 130 px): nada importante queda debajo de la descripción ni de los botones.
- **Subtítulos por frase**, grandes, sin caja, con la palabra activa en ámbar. Los cortes de frase se escriben a mano en el guion (`|`), para que nunca se lea «ES UN REGALO» separado del «NO».
- Marco fijo: serie, barra de progreso, contador «1 de 3» y nota legal chica.

### Voz
- **Sincronía real:** la voz se transcribe con Whisper y cada palabra del guion toma su tiempo de ahí (`kit/scripts/pro/alinear_pro.py`). Solo se interpolan las palabras que Whisper escribe distinto (números).
- **Bloques de sentido en vez de líneas sueltas** y velocidad 1.03: la entonación fluye. El ritmo sale de un guion más corto, no de acelerar la voz.
- Masterización con de-esser y menos eco.
- **Límite que no puedo saltar:** no puedo escuchar el audio; verifico con transcripción y medidores. La voz necesita tu oído. Kokoro tiene techo: el siguiente salto es una voz de pago o tu voz grabada.

### Guion
- **Gancho = dato + tensión**, en afirmación: «Tu aguinaldo no es un regalo: es ley».
- **Promesa numerada en la segunda frase** («trae tres números que casi nadie revisa»): el espectador sabe cuánto falta, y el contador en pantalla lo refuerza.
- **Un ejemplo con números por cada idea** ($12,000 al mes → $6,000).
- **El punto más valioso al final de la lista** y anunciado («el que más se pierde»).
- **Cero líneas habladas sin valor:** el aviso legal y el «sígueme» van escritos; el cierre es un bucle hacia la primera frase.
- 30–40 s para educativo en lugar de 45–55.

### Animación y sonido
- Movimiento con intención: números que cuentan, calendario que se llena, barra que baja a 50 %, sello que cae, texto que sube detrás de una máscara. Cada escena entra distinto.
- Sonido ligado a los momentos: sello en «es ley», tics en el conteo, subida y golpe antes del punto tres. Transiciones solo en las pausas. Mezcla final a −14 LUFS.

### Reglas y documentación
- Dividir `CLAUDE.md` en reglas vigentes (corto) e historial de decisiones (archivo aparte).
- Actualizar el Instructivo de Notion desde GitHub para quitar las cuatro contradicciones.
- Videos nuevos sobre `pro.tsx` + un archivo de escenas por video (~350 líneas).
- Lista de control antes de publicar: gancho con dato, promesa numerada, ejemplo con cifra, cortes de subtítulo a mano, transcripción idéntica al guion, fotogramas revisados, datos con dos fuentes.

## 3. Cómo medirlo
Publicar el piloto y comparar contra la mediana de educativos (338 vistas, 5.5–7.0 s vistos, corte del 11 nov). Si el tiempo visto sube, migrar primero el glosario (lo que más rinde) al mismo sistema.

## 4. Archivos del piloto
- Sistema: `kit/app/src/pro.tsx` · Video: `kit/app/src/aguinaldo.tsx` (Root: `Aguinaldo`, `AguinaldoCover`) · Render: `kit/app/render_pro.mjs`
- Voz, alineación y mezcla: `kit/scripts/pro/`
- Guion y fuentes: `guiones/videos-producidos/aguinaldo.md`
