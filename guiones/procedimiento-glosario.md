# Procedimiento del GLOSARIO (2 publicaciones por semana: lunes y jueves) — vigente desde 2026-11-19

**ACTUALIZACIÓN 2026-11-19 (Brandon, tras el corte de métricas):** el glosario se PUBLICA solo lunes y jueves (12:00–14:00 CDMX, mismo día) y la tarea programada corre solo esos dos días a las 2:00 am. Los turnos de 3:00 y 4:00 desaparecen. En cada corrida: (1) prepara el entorno con `bash kit/scripts/preparar_entorno.sh` y carga Buffer/GitHub/Notion (ver «Herramientas obligatorias» de CLAUDE.md); (2) borra de `publicar-temp` los MP4 de glosario con post `sent`; (3) si la reserva (videos con MP4 en `publicar-temp` sin post) es **menor de 3**, produce un video nuevo; si no, NO produces (ahorra tokens); (4) programa el más antiguo en reserva para hoy. Las reglas de abajo que mencionan 3 turnos al día quedan sustituidas por esto; el resto (producción, reserva, entrega) sigue igual.

# (Texto original, desde 2026-11-15)

Decisión de Brandon (2026-11-15): se producen **3 videos de glosario al día**, en tres turnos —**2:00, 3:00 y 4:00 am CDMX**—, pero **solo se sube (programa) 1 al día**. Los demás se quedan **EN RESERVA** para subirse después. Los videos principales y las noticias no cambian.

## Quién publica qué
- Turno **2:00**: produce su video y **programa 1 video** (ver «Publicación»; solo si hay hueco hoy). Es el único turno que programa.
- Turnos **3:00 y 4:00**: producen su video, lo dejan EN RESERVA y **NO programan nada** (ni Buffer ni Metricool). Estos turnos tampoco borran MP4 de la rama.
- Si el turno 2:00 falló o no corrió, el turno 3:00 hace también la publicación del día (si hoy aún no hay glosario programado para publicar hoy o después en el hueco que toque).

## RESERVA (cómo se guarda)
- Un video EN RESERVA = MP4 + PNG en la rama `publicar-temp` (carpeta `v/`, nombre `<id>_glosario.mp4` y `<id>_portada.png`) **sin post en Buffer**. Se sube con worktree aparte, `git push origin <rama>:publicar-temp`, sin force-push; nunca se borra la rama.
- En `cola-videos.md` (sección GLOSARIO) la palabra queda `[x] <Palabra> (fecha, … ) — EN RESERVA`. Cuando se programa, cambia a `— PROGRAMADO en Buffer (post <id>, <fecha hora>)`. El MP4 NO va en main.
- El código, el guion JSON, la portada en `capturas/` y `guiones/videos-producidos/<id>.md` sí van en main como siempre. En ese .md anota descripción y hashtags finales para poder publicar la reserva sin rehacerlos.
- Antes de hacer push a main: `git pull --rebase` (hay varios turnos escribiendo `cola-videos.md`, `Root.tsx` y `capturas/`). Si hay conflicto, conserva ambos cambios. El número de portada en `capturas/` es el siguiente libre tras el pull.
- Si quedan menos de 6 palabras pendientes `[ ]` en la cola del glosario, manda además PushNotification: «quedan N palabras del glosario; agrega más a la cola». Si no queda ninguna, no inventes un tema: avisa y termina.

## Producción (todos los turnos)
1. Prepara el entorno según `kit/LEEME.md` (Remotion, Kokoro, Chromium, Whisper offline). Lee completos `CLAUDE.md`, `kit/PRO.md`, `kit/LEEME.md`, `cola-videos.md`, y estudia `kit/app/src/aguinaldo.tsx`, `kit/app/src/pro.tsx`, `kit/scripts/pro/guiones/aguinaldo.json` (y `spei.tsx` / `spei.json` como ejemplo de glosario).
2. `git pull` y toma la **PRIMERA palabra pendiente `[ ]`** de la sección GLOSARIO. **Márcala de inmediato** en `cola-videos.md` (`[~] <Palabra> en producción, turno N`), commit y push, para que otro turno no tome la misma; al terminar cambia a `[x]`.
3. Investiga con fuentes oficiales (Banxico, CONDUSEF, CNBV, IPAB, SAT, INEGI) y verifica en la web cualquier dato vigente; cada cifra con dos fuentes. Sin cifras de rendimiento ni promesas. Si un dato solo tiene una fuente o es de prensa, no lo uses o anótalo como punto por vigilar.
4. GUION (PRO.md §1): 4–7 bloques, solo hechos, SIN preguntas en la voz. Gancho = dato concreto en afirmación en ≤ 8 palabras (algo que el espectador tiene, paga, pierde o no sabe) → qué es en una frase → ejemplo con cifras (hipotético, con la base de cálculo en pantalla) → consejo corto → cierre en BUCLE (la última frase queda abierta y se completa con la primera). Nada hablado sin valor: ni «si te sirvió», ni «sígueme», ni avisos (van escritos). Cortes de subtítulo a mano con `|` en "c". Escribe `kit/scripts/pro/guiones/<palabra>.json` con `"voz": "D"`, `"velocidad": 1.03`. Duración 18–25 s.
5. VOZ: `python3 kit/scripts/pro/voz_pro.py <palabra>`. Compara la transcripción con el guion; si una palabra suena mal, escríbela como se pronuncia (inglés como suena: like → «laik») y repite. Si la alineación salió proporcional (sin Whisper), dilo en la entrega.
6. VIDEO (Estándar Pro): copia `kit/app/src/aguinaldo.tsx` (o `spei.tsx`) a `kit/app/src/<palabra>.tsx`; una escena por bloque ligada a las palabras con T(i); rótulo del Frame «GLOSARIO FINANCIERO»; nota «Contenido educativo, no es recomendación de inversión. Fuente: …»; chip escrito «＋ SÍGUEME»; KEYS; MOOD_AT con cambio de fondo cada 2–3 escenas. Cada escena: UNA pieza protagonista grande + 2–4 de apoyo; movimientos suaves. Último fotograma igual al primero. Portada `<Palabra>Cover`. Registra ambas composiciones en `kit/app/src/Root.tsx`.
7. SONIDO: `"sfx"` en el guion (2–4 golpes) y `python3 kit/scripts/pro/mezcla_pro.py <palabra>` (−14 LUFS).
8. REVISIÓN (PRO.md §7): fotogramas a tamaño completo con `node kit/app/st.mjs` (nada fuera de zonas seguras ni encimado; el chip «＋ SÍGUEME» va en y≈1415, no arriba). Render: `node kit/app/render_pro.mjs <Palabra> salida.mp4 <Palabra>Cover portada.png`. Revisa el MP4 final (inicio, cambios, final) y transcribe su audio.
9. REPO (main): código en `kit/`, guion JSON, portada en `capturas/`, `guiones/videos-producidos/<palabra>.md` (anota «Estándar Pro», fuentes, descripción, hashtags y puntos por vigilar), marca `[x]` con fecha en `cola-videos.md`; `git pull --rebase`, commit y push. El MP4 NO va en main.
10. Sube MP4 y PNG a `publicar-temp` (`v/<palabra>_glosario.mp4`, `v/<palabra>_portada.png`) para dejarlos en reserva o publicarlos.

## Publicación (solo turno 2:00; 1 video al día)
- Al iniciar el turno 2:00: borra con `git rm` (commit normal) los MP4 de glosario de `publicar-temp` cuyos posts de Buffer ya tengan status `sent`. NUNCA borres uno que esté en reserva o con post `scheduled`.
- Después de producir y subir el suyo, elige **el video EN RESERVA MÁS ANTIGUO** (el que lleva más tiempo esperando; puede ser el de hoy si no hay otro) y prográmalo en **Buffer** según «Publicación automática» de `CLAUDE.md` (org 6aee2a5b736a55e56b275fe1, canal TikTok 6aee2b0fe29c69a171871113, `create_post` customScheduled + dueAt, schedulingType automatic, asset video con la URL raw, `metadata.tiktok.isAiGenerated` true y title). Usa la descripción y hashtags anotados en su .md.
- Horario (regla de `CLAUDE.md` del 2026-11-15, programar solo para el MISMO DÍA): **hoy**, 12:00–14:00 CDMX (mejor hora con `getBestTimeToPostByNetwork` tiktok 7 días), revisando `getScheduledPosts` (Metricool, marca 7551486) y `list_posts` scheduled (Buffer); hora en punto, ≥ 2 h en el futuro, ≥ 3 h de otra publicación, máx. 3 al día en total. Si hoy ya no hay hueco o ya hay un glosario programado hoy, NO programes: todos quedan EN RESERVA y el turno 2:00 de mañana lo intenta de nuevo. Nunca programes con días de anticipación.
- Herramienta: **Buffer** (mientras `CLAUDE.md` diga que Metricool está agotado, TODO va por Buffer; máx. 10 programadas en el plan gratis). Buffer no acepta portada: va en la entrega para ponerla a mano. Buffer no re-hospeda: el MP4 se queda en `publicar-temp` hasta que el post salga.
- Un solo video de glosario programado por día. Marca en la cola `PROGRAMADO`.

## Entrega (todos los turnos)
SendUserFile con MP4 y PNG; por mensaje: palabra, turno, estado (EN RESERVA o PROGRAMADO + día y hora), descripción, hashtags (#GlosarioFinanciero #FinanzasPersonales #EducaciónFinanciera + los de la palabra, sin #Actinver), fuentes y puntos por vigilar. En el turno 2:00 incluye también cuántos videos hay en reserva y cuáles. Si algo falla, entrega el MP4 por SendUserFile y dilo; nunca force-push ni borrar la rama.
