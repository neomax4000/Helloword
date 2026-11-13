# Inflación (glosario mini, 2026-11-13) — solo hechos, voz D, 22 s
Voz D (`kit/scripts/voz/voz_glosario.py`, guion `kit/scripts/voz/guion_inflamini.json`); pausas 0.08 s; sin portada al inicio. Whisper offline NO verificado (huggingface bloqueado en el entorno); hablado: «Inegui», «tres/cuatro por ciento», «cien/ciento cuatro», «laik». Revisar a oído «INEGI».
1. Tus *pesos* de hoy comprarán *menos* mañana.
2. La *inflación* es el *aumento general* de los *precios* con el tiempo.
3. En México la mide el *INEGI*, y el *Banxico* busca que sea de *3 %*.
4. Ejemplo: si todo sube *4 %*, lo que cuesta *100 pesos*, mañana cuesta *104*. (cifras hipotéticas)
5. *Compara* siempre lo que *ganas* con la *inflación*.
6. Si te sirvió, dale *like* y *sígueme*.
Código: `kit/app/src/inflamini.tsx` (Root: `InflaMini`/`InflaMiniC`), mezcla `kit/scripts/audio/mezcla_inflamini.py`, portada `capturas/48_INFLACION_portada.png`.
Fuentes: INEGI (INPC, mide la inflación), Banxico (meta de inflación 3 %, ±1 punto); la búsqueda web devolvió solo títulos/notas de prensa (octubre 2026: 3.75 % anual, no usado en el video por vigencia). Sin cifras de rendimiento ni promesas.
Nota de entorno: `kit/app/public/outlook/words.json` falta en el repo y rompe el bundle de Root.tsx; se usó un stub local (no versionado).
