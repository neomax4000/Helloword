# Instrucciones para Claude — videos de Brandon

Brandon Ramírez Salas, Banquero Patrimonial en Actinver (Zapopan). Hace videos verticales animados para redes (TikTok brandonmichaels2): productos Actinver, tutoriales de la app y educación financiera. Escríbele en español, cercano y claro, de tú.

## Dónde está todo
- `kit/` — código para producir y recrear los videos (Remotion + Kokoro + audio). Lee `kit/LEEME.md` antes de empezar.
- `capturas/` — una hoja de capturas por video (portada + 8 momentos).
- `guiones/productos/` — guion base de 33 fondos + Pagaré Platinum + CD Platinum (datos al 31 mar 2026; revisar ficha vigente).
- `guiones/videos-producidos/` — guion final y notas de los primeros videos.
- `guiones/serie-deuda-en-pesos.md` — ACTIREN, ACTIGOB, ORION (producidos).
- `cola-videos.md` — cola de producción: serie de productos, educativos largos y GLOSARIO FINANCIERO (mini videos de una palabra, ~20 s, plantilla `kit/app/src/glosario.tsx`, estilo claro).
- `datos/productos.py` — catálogo con fichas, liquidez, calificación y notas de cada producto.
- Notion (Centro de Mando de IA): «Instructivo: cómo hacemos un video» y «Biblioteca de videos — cómo recrear cada uno» (ficha y capturas de los 15 videos).

## Cadencia diaria (decisión 2026-11-06) y retención
- 2 videos al día: **1 GLOSARIO todos los días** + **1 video principal** que alterna en ciclo de 3 días: **educativo, educativo, producto**. Ciclo desde el 2026-11-07: n = (fecha − 2026-11-07) mod 3 → 0 y 1 = educativo, 2 = producto. Se acabaron las rutinas de 5 am y 5 pm de la serie. Calidad antes que cantidad.
- Revisión de métricas el 2026-11-20 (línea base en el proyecto Videos: `metricas-tiktok-2026-11-06.md`): subir/mantener ritmo solo si mejora la retención.
- Motivo: tiempo promedio visto ≈ 3 s en videos de 50–80 s. Hay que subir la retención en TODOS los videos nuevos:
  - Gancho en las primeras 8 palabras y desde la primera pantalla (sin intro ni logo ni portada). El primer fotograma ya muestra el tema en grande.
  - Más velocidad: guion más corto (educativo ≈ 40–55 s, producto ≈ 45–60 s, glosario ≈ 20 s), voz a 1.05–1.1, pausas entre líneas ≤ 0.35 s, un corte o cambio visual cada ~1.5–2 s, sin escenas de relleno.
  - La respuesta/valor llega antes del segundo 20; la llamada a seguirlo va a mitad, justo antes del punto más relevante.
  - Educativo/relatable rinde mejor que producto: en producto, abrir con el problema del cliente, no con el nombre del fondo.
- Portada en TikTok: al programar sube también el PNG como `videoThumbnailUrl` en Metricool (puede ignorarse en cuentas personales). Buffer no acepta imagen de portada. Entrega siempre el PNG; Brandon puede ponerlo a mano desde la app de TikTok.

## Reglas de siempre
- 100% animado, sin su cara. Voz por defecto: **Kokoro** (gratis). «La voz sintética que tienes» = Kokoro, no ElevenLabs.
  - Voz 3 (masculina): em_alex 0.6 + im_nicola 0.4. Voz 5 (femenina): ef_dora 0.7 + if_sara 0.3.
  - Diálogo: Ana (voz 5) pregunta, asesor (voz 3) responde.
- **Preguntas en la voz (decisión 2026-11-08, aplica a TODOS los videos con Kokoro):** Kokoro lee «¿…?» como afirmación y eso delata que es IA. Preferir afirmaciones/datos como gancho (la pregunta puede ir escrita en pantalla). Si una frase interrogativa se queda en el audio, aplicar SIEMPRE `kit/scripts/voz/pregunta.py` (la última palabra sube desde su primera sílaba, 0→+3→+9→+15 st, última sílaba 1.25x, frase arranca alta; receta F1 aprobada) y escucharla antes de renderizar. Mejor aún: partir la pregunta en DOS cortas pegadas con `unir()` (aprobado 2026-11-08): parte uno con `inicio=9, tau_s=0.2, final=False, estira=0.7` (arranca alta, sin subida final, última sílaba corta) y parte dos con subida final; palabras finales de 3+ sílabas. Inglés escrito como suena en el hablado (like → «laik»). Los tiempos/pausas recortados son solo del glosario por ahora; no tocar los demás formatos.
- Fondo cambia cada 2–3 escenas; muchos cortes, transiciones variadas, efectos **en las pausas** (no encima de la voz), música con ducking.
- Portada: SOLO como PNG aparte (decisión 2026-11-06: la portada de 1.5 s al inicio del video restaba retención). El MP4 arranca directo con el gancho; `render_c.mjs XC` ya lo hace (el PNG sale de la composición con portada y el video de la base). Cierre: pregunta → «Escríbeme» → «Sígueme» (productos); educativo/glosario: «si te sirvió, dale like y sígueme».
- Productos: marca Actinver (azul #041E42, ocre #B3A369 solo acento, crema #F5F3EE, Poppins). Educativo general puede ir sin marca.
- Sin promesas ni cifras de rendimiento; «el valor puede subir o bajar»; «no es garantía»; evitar dobles sentidos.
- Legales: fondos → aviso del Folleto literal (en `kit/app/src/actimed.tsx`, const LEGAL); Pagaré/CD → leyenda IPAB 400 mil UDIS; VAC → pendiente texto oficial de Cumplimiento; en VAC decir «instrumento», Zurich sin logo.
- Si grabó su voz y dijo algo de más, se corta. Los videos ya hechos que le gustan no se tocan.
- Cumplimiento: desde el 2026-11-06 Brandon decidió que NO hace falta visto bueno de Cumplimiento para subir, porque el TikTok es personal y no oficial de Actinver. Los videos se programan solos. Al entregar, solo menciona (informativo, sin frenar) los puntos por vigilar: logo Actinver, textos legales y cualquier cifra.
- Publicación automática (Metricool, marca 7551486, TikTok brandonmichaels2, zona America/Mexico_City): al terminar el render, programa el video tú misma(o) sin preguntar. Pasos:
  1. Elige el horario con `getBestTimeToPostByNetwork` (tiktok, próximos 7 días) y `getScheduledPosts`: hora en punto, al menos 2 h en el futuro, que no esté ocupada ni a menos de 3 h de otra publicación, máximo 3 por día. Horas fuertes hoy: 10:00, 12:00 y 18:00. Prioriza según el tipo de contenido: glosario (mini ~20 s) → 12:00–14:00; educativo largo → 10:00 o 18:00–19:00; producto Actinver → 18:00–19:00 o 10:00. Si la ideal está ocupada, toma la siguiente mejor del mismo tipo.
  2. Metricool necesita URL pública: sube el MP4 a la rama temporal `publicar-temp` del repo (worktree aparte, `git push origin <rama>:publicar-temp`, sin force), usa `https://raw.githubusercontent.com/neomax4000/Helloword/publicar-temp/v/<archivo>.mp4`.
  3. `createScheduledPost` con network tiktok, autoPublish true, `tiktokData.isAigc` true (voz sintética), texto = descripción + hashtags (con «el valor puede subir o bajar; no es garantía» en productos).
  4. Confirma que la respuesta trae media en `static.metricool.com` y luego borra el MP4 de la rama con un commit normal (`git rm`) y push. Nunca force-push ni borrar la rama.
  5. Si algo falla, entrega el MP4 por SendUserFile y dilo.
- Reparto de herramientas (decisión 2026-11-06, Metricool tiene tope mensual de publicaciones): **Metricool** para videos largos y de producto; **Buffer** (conector `mcp__Buffer__*`, organización 6aee2a5b736a55e56b275fe1, canal TikTok brandonmichaels2 `6aee2b0fe29c69a171871113`, zona America/Mexico_City) para los mini videos del GLOSARIO. Si una herramienta llega a su tope, usa la otra. Mismo flujo de MP4 en `publicar-temp` y mismas reglas de horario (máx. 3 por día en TOTAL, ≥3 h entre publicaciones): revisa `getScheduledPosts` (Metricool) **y** `list_posts` con status scheduled (Buffer) antes de elegir hora. En Buffer: `create_post` con mode customScheduled + dueAt, schedulingType automatic, assets video con la URL raw, metadata.tiktok.isAiGenerated true y title. El plan gratis de Buffer permite 10 programadas por canal; revisa cuántas hay antes. Primera publicación real en Buffer = prueba: confirmar que acepta el MP4 y que queda en estado scheduled.
- Mantén el MP4 fuera de `main`; solo código, guiones y portadas se quedan en el repo.
- Entrega: MP4 720×1280 + portada PNG + descripción + hashtags + día y hora en que quedó programado en Metricool. Él sube los videos a Notion.

## Estilo del GLOSARIO FINANCIERO (claro) — distinto de los videos largos y de fondos
Decisión de Brandon (2026-11-06): los mini videos del glosario van en tema claro para diferenciarlos. Plantilla: `kit/app/src/glosario.tsx` (CAT es el ejemplo). Los videos largos, de productos y la serie anterior conservan el diseño oscuro.
- Fondo blanco con lavado pastel (azul `#E3EDFA`, menta `#E1F3EA`, arena `#FAF1D6`) que cambia cada 2–3 escenas con fundido; solo círculos tenues y muy lentos. Sin rayas ni patrones móviles.
- Color: azul Actinver `#041E42` para texto y trazos, dorado `#B3A369` en detalles (barra de progreso, subrayado de palabras clave, rótulo), gris `#555759` para apoyo. Rellenos de objetos en pastel (`#D3E3F8`, `#D2EEE0`, `#F6EBC8`, `#F7D8D4`, `#E0DBF5`), trazo azul marino fino (5 px) y sombra suave. El pastel solo en decoración y rellenos, nunca en el texto principal.
- Subtítulos: sin caja de fondo, azul marino fuerte; palabra activa en azul brillante `#1B4FC4`; palabras clave con subrayado dorado; resplandor blanco leve para legibilidad.
- Movimiento: solo aparecer/desvanecer, subir/bajar y trasladar suave (componente `Rise`). Nada de giros, inclinaciones, temblores, rebotes ni zoom con golpe. Cámara casi quieta (deriva de 2.5 %).
- Encabezado fijo «— GLOSARIO FINANCIERO —» arriba en gris con rayitas doradas.
- Voz del glosario (decisión 2026-11-07): voz D de Kokoro = em_santa 0.5 + em_alex 0.25 + im_nicola 0.25, con `kit/scripts/voz/voz_glosario.py`. Guion SOLO de hechos, sin preguntas (la entonación de pregunta delata la voz sintética); sin pausas largas entre frases (0.08 s) y cada frase arranca con tono alto y golpe de volumen. Palabras en inglés escritas como suenan en el hablado (like → «laik»; «Cat» tal cual) y se verifica la fonética. Si se usara una pregunta, receta F1 en el docstring del script.
- Portada clara (`theme: 'light'` en `cover.tsx`): fondo blanco/crema, rótulo y detalles dorados, letras azul marino, subtítulo gris; logo azul solo si es de producto.

## Para un video nuevo
1. Si es importante, propone plan (audiencia, mensaje, acción, formato) antes de producir.
2. Copia la plantilla más parecida: narrador `kit/app/src/actimed.tsx` / `acticob.tsx`; diálogo `vac2.tsx` / `actdual.tsx`.
3. Voz con `kit/scripts/voz/voz_*.py`, verifica pronunciación, mezcla con `kit/scripts/audio/mezcla_*.py`, revisa fotogramas y renderiza con `kit/app/render_c.mjs`.
4. Al terminar, guarda aquí: código nuevo en `kit/`, captura en `capturas/`, guion en `guiones/`.
