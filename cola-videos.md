# Cola de videos programados (2 al día desde 2026-11-07: glosario diario + educativo, educativo, producto en ciclo; ver CLAUDE.md)

Reglas: voz Kokoro. Horarios de producción (CDMX): 2:00 glosario · 11:00 video principal (educativo o SERIE de productos según el ciclo). Las rutinas de 5:00 y 17:00 se pausaron.
Cada corrida toma el PRIMER pendiente `[ ]` de su lista, lo produce, lo marca `[x]` con fecha y hace commit + push.
NOTICIA DEL DÍA (opcional): radar a las 7:00 CDMX según `guiones/protocolo-noticias.md`. Antes de producir, la corrida de las 11:00 lee `noticias/AAAA-MM-DD.md`: si el estado es APROBADA, la noticia es el video principal y NO se toma ningún pendiente de las listas (el desplazado sigue de primero). El ciclo sigue por fecha. Si el estado es ESPERA_OK o NO_GO, la corrida de las 11:00 produce normal.

## SERIE (productos Actinver, tipo 1, marca Actinver) — guion base en guiones/productos/<NOMBRE>.md; se produce con el Estándar Pro (`kit/PRO.md`, `<Brand value={ACTINVER}>`)
(ACTIREN y ORION: guion en guiones/serie-deuda-en-pesos.md)
- [x] ACTIREN (2026-11-04)
- [x] ORION (2026-11-04)
- [x] ACTI500 (2026-11-05)
- [x] ACTIEUR (2026-11-05)
- [x] ACTIAI (2026-11-06)
- [x] ACTIRVT (2026-11-06)
- [x] JPMRVUS (2026-11-09; guion `guiones/videos-producidos/jpmrvus.md`, portada `capturas/37_JPMRVUS_portada.png`)
- [x] ROBOTIK (2026-11-16; guion `guiones/videos-producidos/robotik.md`, portada `capturas/56_ROBOTIK_portada.png`; SIN PROGRAMAR: el 16-nov ya no había hueco de producto (18:00 ocupado en Buffer, 10:00 pasado); MP4 entregado por SendUserFile)
- [ ] TEMATIK
- [ ] MAXIMO
- [ ] DINAMO
- [ ] OPORT1
- [ ] ESFERA
- [ ] SALUD
- [ ] ACT2030
- [ ] ACT2035
- [ ] ACT2040
- [ ] ACT4560
- [ ] ACTIG+
- [ ] ACTIG+2
- [ ] ACTIPLU
- [ ] ACTVIDA
- [ ] ALTERN
- [ ] ESCALA
- [ ] IMPULSA
- [ ] Pagaré Platinum
- [ ] CD Platinum

## EDUCATIVO (tipo 2, sin marca; Estándar Pro, `kit/PRO.md`)
Los títulos de abajo son el TEMA, no el gancho: el gancho se reescribe como dato concreto en afirmación (ver PRO.md §1). Sin cifras de rendimiento ni promesas; fuentes institucionales (Banxico, CONDUSEF, CNBV, IPAB).
- [x] ¿Por qué tu dinero en el colchón pierde valor? (inflación) (2026-11-04)
- [x] ¿Qué es el IPAB y de verdad protege tu dinero? (2026-11-05)
- [x] ¿Qué es el Buró de Crédito y por qué no es una lista negra? (2026-11-06)
- [x] ¿Qué es la tasa de interés y por qué mueve todo? (2026-11-07; guion `guiones/videos-producidos/tasa.md`, portada `capturas/32_TASA_portada.png`)
- [x] ¿Qué es el CAT y por qué deberías mirarlo antes de pedir un crédito? (2026-11-08; guion `guiones/videos-producidos/catedu.md`, portada `capturas/35_CATEDU_portada.png`)
- [x] ¿Qué es una Afore y quién la maneja? (2026-11-10; guion `guiones/videos-producidos/afore.md`, portada `capturas/41_AFORE_portada.png`)
- [x] ¿Qué es el fondo de emergencia y de cuánto debería ser? (2026-11-11; guion `guiones/videos-producidos/fondo.md`, portada `capturas/44_FONDO_portada.png`)
- [x] ¿Qué diferencia hay entre ahorrar e invertir? (2026-11-12; guion `guiones/videos-producidos/ahorrar.md`, portada `capturas/46_AHORRAR_portada.png`)
- [x] ¿Qué es la diversificación? («no pongas todos los huevos en la misma canasta») (2026-11-13; guion `guiones/videos-producidos/diversif.md`, portada `capturas/49_DIVERSIF_portada.png`)
- [x] Aguinaldo: no es un regalo, es ley (2026-11-13; PILOTO del Estándar Pro, aprobado; guion `guiones/videos-producidos/aguinaldo.md`, portada `capturas/50_AGUINALDO_portada.png`; programado en Metricool el 16-nov-2026 13:00, id 427761458)
- [x] ¿Qué es la deuda buena y la deuda mala? (2026-11-14; guion `guiones/videos-producidos/deuda.md`, portada `capturas/52_DEUDA_portada.png`; programado en Buffer el 17-nov-2026 18:00 CDMX, post 6af9438d76c23bf1c75de095; el de Metricool 428178066 quedó en borrador. PENDIENTE: borrar `v/deuda_educativo.mp4` de `publicar-temp` (`git rm`) DESPUÉS de que salga)
- [x] ¿Qué es el SPEI y por qué es instantáneo? (2026-11-15; guion `guiones/videos-producidos/spei-edu.md`, portada `capturas/54_SPEI_EDU_portada.png`; PROGRAMADO en Buffer el 15-nov-2026 21:00 CDMX (post 6afa4f07ff465c57dac1776d; movido de 18-nov a hoy por pedido de Brandon, 4.º del día). PENDIENTE: borrar `v/spei_educativo.mp4` de `publicar-temp` (`git rm`) DESPUÉS de que salga)
- [x] ¿Qué es un seguro de vida y cuándo sí lo necesitas? (2026-11-17; guion `guiones/videos-producidos/seguro-vida.md`, portada `capturas/58_SEGURO_VIDA_portada.png`; SIN PROGRAMAR: el 17-nov ya no había hueco educativo (18:00 ocupado en Buffer, 10:00 pasado); MP4 entregado por SendUserFile)
- [x] ¿Por qué la tarjeta de crédito no es dinero tuyo? (2026-11-18; guion `guiones/videos-producidos/tarjeta-credito.md`, portada `capturas/60_TARJETA_CREDITO_portada.png`; PROGRAMADO en Buffer el 18-nov-2026 18:00 CDMX, post 6afddd424b233b0b898aac82. PENDIENTE: borrar `v/tarjeta_educativo.mp4` y `.png` de `publicar-temp` (`git rm`) DESPUÉS de que salga)
- [x] ¿Qué es una tasa real vs. nominal? (2026-11-20; guion `guiones/videos-producidos/tasa-real.md`, portada `capturas/61_TASA_REAL_EDU_portada.png`; PROGRAMADO en Buffer el 20-nov-2026 18:00 CDMX, post 6b00814c6f199ec35b6926ce. PENDIENTE: borrar `v/tasa_real_educativo.mp4` y `.png` de `publicar-temp` (`git rm`) DESPUÉS de que salga)
- [ ] ¿Qué son las UDIS?

## SERIE «TU NUEVA APP ACTINVER» (8 capítulos + video largo; ritmo aprobado 2026-11-10: UN capítulo en cada día de PRODUCTO, junto al video del fondo; plan en `guiones/serie-app-nueva.md`)
Fuente: video interno de capacitación (Acelera Talent). Cada capítulo 35–45 s con el Estándar Pro y marca Actinver (`<Brand value={ACTINVER}>`). Al terminar los 8 se arma el video largo (~6–7 min).
- [ ] 1/8 Qué cambia y qué NO (contraseña y Actipass iguales)
- [ ] 2/8 Tres secciones: Banco, Inversiones, Productos
- [ ] 3/8 Banco: saldo disponible, ocultar saldos, alias y cuenta principal
- [ ] 4/8 Tarjetas y accesos directos (apagar/prender, CVV dinámico, «¿Qué quieres hacer hoy?»)
- [ ] 5/8 Movimientos y Patrimonio total
- [ ] 6/8 Inversiones: tu portafolio (saldo total, desglose, posiciones)
- [ ] 7/8 Inversiones: accesos según tu contrato y resumen por mercado
- [ ] 8/8 Productos: retiro, créditos y seguros, «Pensados para ti»
- [ ] VIDEO LARGO: los 8 capítulos + cierre «qué es y qué NO es»

## GLOSARIO FINANCIERO (mini videos 18–25 s, tipo 2 sin marca, una palabra por video)
Desde 2026-11-19: 2 publicaciones por semana (lun y jue, 12:00 CDMX en Buffer); solo se produce uno nuevo si la reserva queda por debajo de 3 (ver CLAUDE.md y `guiones/procedimiento-glosario.md`). Antes (2026-11-15 al 18): 3 producciones al día, 1 publicación al día; el resto EN RESERVA (MP4 en `publicar-temp`, sin post). Ver `guiones/procedimiento-glosario.md`. Estados: `[ ]` pendiente · `[~]` en producción · `[x]` producido (EN RESERVA o PROGRAMADO).
Formato (Estándar Pro desde 2026-11-14, `kit/PRO.md`): gancho con dato concreto en afirmación → qué es en una frase → ejemplo con cifras → consejo corto → cierre en bucle hacia la primera frase. Rótulo «GLOSARIO FINANCIERO», voz D, CTA solo escritos. Sin cifras de rendimiento ni promesas; datos oficiales verificados en la web.
- [x] CAT (2026-11-06; versión final 2026-11-08 con voz D y solo hechos, `guiones/videos-producidos/cat.md`)
- [x] CETES (2026-11-07, mini video 2; guion `guiones/videos-producidos/cetes.md`, portada `capturas/31_CETES_portada.png`)
- [x] Liquidez (2026-11-08; guion `guiones/videos-producidos/liquidez.md`, portada `capturas/34_LIQUIDEZ_portada.png`)
- [x] Diversificar (2026-11-09; guion `guiones/videos-producidos/diversificar.md`, portada `capturas/36_DIVERSIFICAR_portada.png`)
- [x] Value (inversión en valor) (2026-11-10; guion `guiones/videos-producidos/value.md`, portada `capturas/40_VALUE_portada.png`) — — nota 2026-11-09: explicar qué es en simple (empresas sólidas que cotizan a buen precio frente a lo que valen). Pronunciar «valiu». Verificar definición en fuente (CNBV/Bolsa/gestora) y sin promesas de rendimiento. Enlaza con el video de JPMRVUS (programado 2026-11-13).
- [x] Growth (inversión en crecimiento) (2026-11-11; guion `guiones/videos-producidos/growth.md`, portada `capturas/43_GROWTH_portada.png`) — nota 2026-11-09: explicar qué es en simple (empresas que crecen rápido; suelen reinvertir utilidades y pueden ser más volátiles). Pronunciar «grouz». Verificar definición en fuente y sin promesas de rendimiento. Pareja de «Value»; idealmente salen en días seguidos, antes del 2026-11-13.
- [x] Tasa real (2026-11-12; guion `guiones/videos-producidos/tasa-real.md`, portada `capturas/45_TASA_REAL_portada.png`)
- [x] Inflación (versión mini) (2026-11-13; guion `guiones/videos-producidos/inflacion-mini.md`, portada `capturas/48_INFLACION_portada.png`)
- [x] UDI — FORMATO DE PRUEBA (ver CLAUDE.md «PRUEBA DE FORMATO DEL GLOSARIO»). **PRODUCIDO (v2, 30 s) y PROGRAMADO en Buffer el 2026-11-13** (post 6af72ca15d42e353d99c162a, estado scheduled, 15-nov-2026 13:10 CDMX, 10 min después de Inflación; excede el tope de 3/día por decisión de Brandon). Título «UDI en 30 segundos», isAiGenerated true. **PENDIENTE: borrar `v/udi_prueba_glosario.mp4` de `publicar-temp` (`git rm`, commit normal) DESPUÉS de que se publique el 15-nov** (Buffer aún apunta a la URL raw, no la re-hospedó). «Hoy vale más de 8»: sitio de terceros marca 8.90 el 12-nov-2026; falta confirmar en Banxico/DOF.
- [x] SPEI (2026-11-14, Estándar Pro; guion `guiones/videos-producidos/spei.md`, portada `capturas/51_SPEI_portada.png`) — PROGRAMADO en Buffer (post 6af81aa74b28296eb1445686, 17-nov-2026 12:00 CDMX). MP4 borrado de publicar-temp el 2026-11-18 (post sent).
- [x] Interés compuesto (mini) (2026-11-15, Estándar Pro, turno 2; guion `guiones/videos-producidos/interes-compuesto.md`, portada `capturas/53_INTERES_COMPUESTO_portada.png`) — PROGRAMADO en Buffer (post 6afd6030805b2f3bff3f6f59, publicado 18-nov-2026 12:00 CDMX; MP4 borrado de publicar-temp el 2026-11-19)
- [x] Plazo (2026-11-16, Estándar Pro, turno 2; guion `guiones/videos-producidos/plazo.md`, portada `capturas/55_PLAZO_portada.png`) — PROGRAMADO en Buffer (post 6afead4db7fe0c41dda9cc97, 19-nov-2026 12:00 CDMX; MP4 queda en publicar-temp hasta que salga)
- [x] Comisión (2026-11-17, Estándar Pro, turno 2; guion `guiones/videos-producidos/comision.md`, portada `capturas/57_COMISION_portada.png`) — PROGRAMADO en Buffer (post 6b03f7ac51038c931ba4b871, 23-nov-2026 12:00 CDMX; MP4 queda en publicar-temp hasta que salga)
- [x] Riesgo y volatilidad (2026-11-18, Estándar Pro, turno 2; guion `guiones/videos-producidos/riesgo-volatilidad.md`, portada `capturas/59_RIESGO_portada.png`) — EN RESERVA
- [x] Horizonte de inversión (2026-11-23, Estándar Pro; guion `guiones/videos-producidos/horizonte.md`, portada `capturas/62_HORIZONTE_portada.png`) — EN RESERVA
- [ ] Fondo de inversión
- [ ] Afore
- [ ] Buró de Crédito
- [ ] Pagaré
- [ ] Dividendo
- [ ] ETF
- [ ] Deuda buena vs mala

## DECONSTRUYENDO LAS FINANZAS (tipo aparte, proyecto futuro; NO entra al ciclo diario)
Reglas, temas planeados y guion 1 (fondos de inversión, terminado) en `guiones/deconstruyendo-las-finanzas.md`. Todavía no se produce ningún video de este tipo; esperar la instrucción de Brandon.
