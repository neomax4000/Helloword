# Instrucciones para Claude — videos de Brandon

Brandon Ramírez Salas, Banquero Patrimonial en Actinver (Zapopan). Hace videos verticales animados para redes (TikTok brandonmichaels2): educación financiera, glosario, noticias, productos Actinver y tutoriales de la app. Escríbele en español, cercano y claro, de tú.

Este archivo tiene SOLO las reglas vigentes. El porqué de cada decisión está en `HISTORIAL-DECISIONES.md` (no son reglas).

## Cómo se hace un video: ESTÁNDAR PRO (vigente desde 2026-11-13)
**Todo video nuevo (glosario, educativo, noticia y producto) se hace con `kit/PRO.md`.** Ahí están las reglas de guion, voz, diseño, animación, sonido, el paso a paso y la lista de control. Resumen:
- Guion: gancho = dato concreto en afirmación (≤ 8 palabras, desde el primer fotograma) → promesa numerada → ejemplo con cifras → lo más valioso al final y anunciado → cierre en bucle hacia la primera frase. Nada hablado sin valor: «sígueme», «si te sirvió» y avisos legales van escritos.
- Duración: glosario 18–25 s · educativo 28–40 s · noticia 35–50 s · producto 35–45 s (+ legal).
- Voz Kokoro por bloques a 1.03 (`kit/scripts/pro/voz_pro.py`), alineada con Whisper palabra por palabra. Sin preguntas en la voz.
- Un solo sistema visual (`kit/app/src/pro.tsx`): fondo profundo con malla de color y grano, tarjetas crema, una pieza protagonista grande por escena, subtítulos por frase con cortes a mano, zonas seguras de TikTok. La serie se distingue por el rótulo; producto con `<Brand value={ACTINVER}>` (ocre y logo).
- Mezcla `kit/scripts/pro/mezcla_pro.py` a −14 LUFS. Render `kit/app/render_pro.mjs` (720×1280).
- Plantilla de referencia: `kit/app/src/aguinaldo.tsx` + `kit/scripts/pro/guiones/aguinaldo.json`.
- Las plantillas viejas (`glosario.tsx`, `actimed.tsx`, `diversif.tsx`, `noticia-fondos.tsx`, scripts `voz_*.py`/`mezcla_*.py`) solo sirven para recrear videos anteriores o tomar piezas; no se usan como base de videos nuevos.

## Dónde está todo
- `kit/PRO.md` — el estándar (léelo antes de producir). `kit/LEEME.md` — instalación del entorno.
- `kit/scripts/pro/guiones/<id>.json` — guion hablado + cortes de subtítulo + efectos de cada video nuevo.
- `guiones/videos-producidos/<id>.md` — guion final, fuentes y notas de cada video. `capturas/` — portadas.
- `guiones/productos/` — guion base de 33 fondos + Pagaré Platinum + CD Platinum (datos al 31 mar 2026; revisar ficha vigente). `datos/productos.py` — catálogo de productos.
- `guiones/protocolo-noticias.md` — protocolo de noticias. `noticias/` — radar diario y registro.
- `guiones/serie-app-nueva.md`, `guiones/serie-deuda-en-pesos.md`, `guiones/deconstruyendo-las-finanzas.md` (proyecto futuro, fuera del ciclo).
- `cola-videos.md` — cola de producción. `PROPUESTA-ESTANDAR-PRO.md` — auditoría que originó el estándar.
- Notion (Centro de Mando de IA): «Instructivo: cómo hacemos un video» (espejo de estas reglas para el celular) y «Biblioteca de videos».
- Métricas: `claude/historico-metricas-tiktok.md` en el proyecto Videos (agregar un corte en cada revisión).

## Cadencia
- 2 videos al día: **1 GLOSARIO** + **1 video principal**. El principal sigue un ciclo de 6 días: m = (fecha − 2026-11-11) mod 6 → 0 a 4 = EDUCATIVO, 5 = PRODUCTO (próximos productos: 2026-11-16, 2026-11-22…). Los días de producto sale además un capítulo de «Tu nueva app Actinver».
- **NOTICIA DEL DÍA (opcional):** protocolo completo en `guiones/protocolo-noticias.md` (tipos R = reacción y P = previa, compuertas, puntaje R «atención + puente al dinero» 0–100, elección de ruta, controles, freno). Temas: finanzas y también tecnología, caídas de servicios, empresas y personas famosas de negocios o desarrollo personal, siempre con puente a su dinero. Modo AUTOMÁTICO desde 2026-11-14 (75 o más se programa solo; 60–74 pide OK; 50–59 es sugerencia; supervisado solo tras un freno). Radar 6:47 y 13:00 CDMX; cada pasada le manda a Brandon sus 3 mejores candidatos aunque sea NO_GO. Si hay noticia APROBADA, es el video principal del día y el tema desplazado queda primero en su lista. Estados y decisiones en `noticias/AAAA-MM-DD.md`.
- Máximo 3 publicaciones al día en total y ≥ 3 h entre ellas (salvo que Brandon pida otra cosa).
- Revisión de métricas 2026-11-20: comparar los videos del Estándar Pro contra la línea base (educativo: mediana 338 vistas, 5.5–7.0 s vistos; glosario: 354 vistas, 3.7–5.5 s). Seguir solo si mejora la retención.

## Reglas de contenido
- 100% animado, sin su cara. Voz Kokoro (gratis): voz 3 = em_alex 0.6 + im_nicola 0.4 (narrador); voz 5 = ef_dora 0.7 + if_sara 0.3 (narradora); voz D = em_santa 0.5 + em_alex 0.25 + im_nicola 0.25 (glosario). «La voz sintética que tienes» = Kokoro, no ElevenLabs.
- Si una pregunta tiene que ir en el audio: receta de `kit/scripts/voz/pregunta.py` (o partirla en dos con `unir()`), y escucharla. Mejor: pregunta solo escrita.
- Sin promesas ni cifras de rendimiento; «el valor puede subir o bajar»; «no es garantía»; sin dobles sentidos. Cada cifra con dos fuentes.
- Educativo, glosario y noticia: sin marca ni productos de Actinver; nota «Contenido educativo, no es recomendación de inversión».
- Producto: marca Actinver (azul #041E42, ocre #B3A369 solo acento, crema #F5F3EE, Poppins), abrir con el problema del cliente (no con el nombre del fondo), cierre hablado corto «Escríbeme»; legales: fondos → aviso del Folleto literal (const LEGAL en `kit/app/src/actimed.tsx`); Pagaré/CD → leyenda IPAB 400 mil UDIS; VAC → decir «instrumento», Zurich sin logo, leyenda pendiente de Cumplimiento.
- Si grabó su voz y dijo algo de más, se corta. Los videos ya publicados no se tocan.
- Cumplimiento: no hace falta su visto bueno (TikTok personal, decisión 2026-11-06). Al entregar, solo menciona los puntos por vigilar: logo Actinver, textos legales y cifras.

## Publicación automática
Al terminar el render, programa el video sin preguntar.
1. Horario: `getBestTimeToPostByNetwork` (tiktok, 7 días), `getScheduledPosts` (Metricool) **y** `list_posts` status scheduled (Buffer). Hora en punto, ≥ 2 h en el futuro, libre, ≥ 3 h de otra publicación, máx. 3 al día. Glosario → 12:00–14:00; educativo → 10:00 o 18:00–19:00; producto → 18:00–19:00 o 10:00.
2. URL pública: MP4 (y PNG) a la rama temporal `publicar-temp` (worktree aparte, `git push origin <rama>:publicar-temp`, sin force): `https://raw.githubusercontent.com/neomax4000/Helloword/publicar-temp/v/<archivo>.mp4`. **Nunca preguntes por Google Drive** (solo si Brandon lo pide).
3. **Metricool** (marca 7551486, zona America/Mexico_City) para educativo, noticia y producto: `createScheduledPost` con network tiktok, autoPublish true, `tiktokData.isAigc` true, PNG como `videoThumbnailUrl`, texto = descripción + hashtags («el valor puede subir o bajar; no es garantía» en producto). Confirma media en `static.metricool.com` y borra el MP4 de la rama con `git rm` (commit normal).
4. **Buffer** (org 6aee2a5b736a55e56b275fe1, canal TikTok `6aee2b0fe29c69a171871113`) para el glosario: `create_post` mode customScheduled + dueAt, schedulingType automatic, assets video con la URL raw, metadata.tiktok.isAiGenerated true y title. Máx. 10 programadas en el plan gratis. Buffer NO re-hospeda al programar: el MP4 se queda en la rama hasta que el post salga; bórralo después.
5. Si una herramienta llega a su tope, usa la otra. Si algo falla, entrega el MP4 por SendUserFile y dilo. Nunca force-push ni borrar la rama.
- El MP4 nunca va en `main`; solo código, guiones y portadas.
- Entrega: MP4 720×1280 + portada PNG + descripción + hashtags + día y hora programados. Brandon sube los videos a Notion. La portada también se puede poner a mano en la app de TikTok.
