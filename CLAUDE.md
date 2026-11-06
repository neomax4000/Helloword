# Instrucciones para Claude — videos de Brandon

Brandon Ramírez Salas, Banquero Patrimonial en Actinver (Zapopan). Hace videos verticales animados para redes (TikTok brandonmichaels2): productos Actinver, tutoriales de la app y educación financiera. Escríbele en español, cercano y claro, de tú.

## Dónde está todo
- `kit/` — código para producir y recrear los videos (Remotion + Kokoro + audio). Lee `kit/LEEME.md` antes de empezar.
- `capturas/` — una hoja de capturas por video (portada + 8 momentos).
- `guiones/productos/` — guion base de 33 fondos + Pagaré Platinum + CD Platinum (datos al 31 mar 2026; revisar ficha vigente).
- `guiones/videos-producidos/` — guion final y notas de los primeros videos.
- `guiones/serie-deuda-en-pesos.md` — ACTIREN, ACTIGOB, ORION (producidos).
- `cola-videos.md` — cola de producción: serie de productos, educativos largos y GLOSARIO FINANCIERO (mini videos de una palabra, ~20 s, plantilla `kit/app/src/cat.tsx`).
- `datos/productos.py` — catálogo con fichas, liquidez, calificación y notas de cada producto.
- Notion (Centro de Mando de IA): «Instructivo: cómo hacemos un video» y «Biblioteca de videos — cómo recrear cada uno» (ficha y capturas de los 15 videos).

## Reglas de siempre
- 100% animado, sin su cara. Voz por defecto: **Kokoro** (gratis). «La voz sintética que tienes» = Kokoro, no ElevenLabs.
  - Voz 3 (masculina): em_alex 0.6 + im_nicola 0.4. Voz 5 (femenina): ef_dora 0.7 + if_sara 0.3.
  - Diálogo: Ana (voz 5) pregunta, asesor (voz 3) responde.
- Fondo cambia cada 2–3 escenas; muchos cortes, transiciones variadas, efectos **en las pausas** (no encima de la voz), música con ducking.
- Siempre portada (1.5 s + PNG) y cierre: pregunta → «Escríbeme» → «Sígueme».
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
- Mantén el MP4 fuera de `main`; solo código, guiones y portadas se quedan en el repo.
- Entrega: MP4 720×1280 + portada PNG + descripción + hashtags + día y hora en que quedó programado en Metricool. Él sube los videos a Notion.

## Para un video nuevo
1. Si es importante, propone plan (audiencia, mensaje, acción, formato) antes de producir.
2. Copia la plantilla más parecida: narrador `kit/app/src/actimed.tsx` / `acticob.tsx`; diálogo `vac2.tsx` / `actdual.tsx`.
3. Voz con `kit/scripts/voz/voz_*.py`, verifica pronunciación, mezcla con `kit/scripts/audio/mezcla_*.py`, revisa fotogramas y renderiza con `kit/app/render_c.mjs`.
4. Al terminar, guarda aquí: código nuevo en `kit/`, captura en `capturas/`, guion en `guiones/`.
