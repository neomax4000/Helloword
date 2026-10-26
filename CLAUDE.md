# Instrucciones para Claude — videos de Brandon

Brandon Ramírez Salas, Banquero Patrimonial en Actinver (Zapopan). Hace videos verticales animados para redes (TikTok brandonmichaels2): productos Actinver, tutoriales de la app y educación financiera. Escríbele en español, cercano y claro, de tú.

## Dónde está todo
- `kit/` — código para producir y recrear los videos (Remotion + Kokoro + audio). Lee `kit/LEEME.md` antes de empezar.
- `capturas/` — una hoja de capturas por video (portada + 8 momentos).
- `guiones/productos/` — guion base de 33 fondos + Pagaré Platinum + CD Platinum (datos al 31 mar 2026; revisar ficha vigente).
- `guiones/videos-producidos/` — guion final y notas de los primeros videos.
- `guiones/serie-deuda-en-pesos.md` — ACTIREN, ACTIGOB, ORION (guiones listos, sin producir).
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
- Nada se publica sin visto bueno de Cumplimiento: al entregar, lista los pendientes.
- Entrega: MP4 720×1280 + portada PNG + descripción + hashtags. Él sube los videos a Notion y redes.

## Para un video nuevo
1. Si es importante, propone plan (audiencia, mensaje, acción, formato) antes de producir.
2. Copia la plantilla más parecida: narrador `kit/app/src/actimed.tsx` / `acticob.tsx`; diálogo `vac2.tsx` / `actdual.tsx`.
3. Voz con `kit/scripts/voz/voz_*.py`, verifica pronunciación, mezcla con `kit/scripts/audio/mezcla_*.py`, revisa fotogramas y renderiza con `kit/app/render_c.mjs`.
4. Al terminar, guarda aquí: código nuevo en `kit/`, captura en `capturas/`, guion en `guiones/`.
