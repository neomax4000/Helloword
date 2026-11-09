# Cola de videos programados (2 al día desde 2026-11-07: glosario diario + educativo, educativo, producto en ciclo; ver CLAUDE.md)

Reglas: voz Kokoro. Horarios de producción (CDMX): 2:00 glosario · 11:00 video principal (educativo o SERIE de productos según el ciclo). Las rutinas de 5:00 y 17:00 se pausaron.
Cada corrida toma el PRIMER pendiente `[ ]` de su lista, lo produce, lo marca `[x]` con fecha y hace commit + push.
NOTICIA DEL DÍA (opcional): radar a las 7:00 CDMX según `guiones/protocolo-noticias.md`. Antes de producir, la corrida de las 11:00 lee `noticias/AAAA-MM-DD.md`: si el estado es APROBADA, la noticia es el video principal y NO se toma ningún pendiente de las listas (el desplazado sigue de primero). El ciclo sigue por fecha. Si el estado es ESPERA_OK o NO_GO, la corrida de las 11:00 produce normal.

## SERIE (productos Actinver, tipo 1, marca Actinver) — guion en guiones/productos/<NOMBRE>.md
(ACTIREN y ORION: guion en guiones/serie-deuda-en-pesos.md)
- [x] ACTIREN (2026-11-04)
- [x] ORION (2026-11-04)
- [x] ACTI500 (2026-11-05)
- [x] ACTIEUR (2026-11-05)
- [x] ACTIAI (2026-11-06)
- [x] ACTIRVT (2026-11-06)
- [x] JPMRVUS (2026-11-09; guion `guiones/videos-producidos/jpmrvus.md`, portada `capturas/37_JPMRVUS_portada.png`)
- [ ] ROBOTIK
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

## EDUCATIVO (tipo 2, sin marca, cierre «si te sirvió, dale like y sígueme»)
Cada tema: gancho en pregunta fuerte, sin cifras de rendimiento ni promesas, fuentes institucionales (Banxico, CONDUSEF, CNBV, IPAB) cuando haya datos.
- [x] ¿Por qué tu dinero en el colchón pierde valor? (inflación) (2026-11-04)
- [x] ¿Qué es el IPAB y de verdad protege tu dinero? (2026-11-05)
- [x] ¿Qué es el Buró de Crédito y por qué no es una lista negra? (2026-11-06)
- [x] ¿Qué es la tasa de interés y por qué mueve todo? (2026-11-07; guion `guiones/videos-producidos/tasa.md`, portada `capturas/32_TASA_portada.png`)
- [x] ¿Qué es el CAT y por qué deberías mirarlo antes de pedir un crédito? (2026-11-08; guion `guiones/videos-producidos/catedu.md`, portada `capturas/35_CATEDU_portada.png`)
- [ ] ¿Qué es una Afore y quién la maneja?
- [ ] ¿Qué es el fondo de emergencia y de cuánto debería ser?
- [ ] ¿Qué diferencia hay entre ahorrar e invertir?
- [ ] ¿Qué es la diversificación? («no pongas todos los huevos en la misma canasta»)
- [ ] ¿Qué es la deuda buena y la deuda mala?
- [ ] ¿Qué es el SPEI y por qué es instantáneo?
- [ ] ¿Qué es un seguro de vida y cuándo sí lo necesitas?
- [ ] ¿Por qué la tarjeta de crédito no es dinero tuyo?
- [ ] ¿Qué es una tasa real vs. nominal?
- [ ] ¿Qué son las UDIS?

## SERIE «TU NUEVA APP ACTINVER» (8 capítulos + video largo; propuesta 2026-11-09, PENDIENTE de aprobación de ritmo; plan en `guiones/serie-app-nueva.md`)
Fuente: video interno de capacitación (Acelera Talent). Cada capítulo ≤ 55 s, gancho en afirmación, marca Actinver (diseño oscuro). Al terminar los 8 se arma el video largo (~6–7 min).
- [ ] 1/8 Qué cambia y qué NO (contraseña y Actipass iguales)
- [ ] 2/8 Tres secciones: Banco, Inversiones, Productos
- [ ] 3/8 Banco: saldo disponible, ocultar saldos, alias y cuenta principal
- [ ] 4/8 Tarjetas y accesos directos (apagar/prender, CVV dinámico, «¿Qué quieres hacer hoy?»)
- [ ] 5/8 Movimientos y Patrimonio total
- [ ] 6/8 Inversiones: tu portafolio (saldo total, desglose, posiciones)
- [ ] 7/8 Inversiones: accesos según tu contrato y resumen por mercado
- [ ] 8/8 Productos: retiro, créditos y seguros, «Pensados para ti»
- [ ] VIDEO LARGO: los 8 capítulos + cierre «qué es y qué NO es»

## GLOSARIO FINANCIERO (mini videos ~20 s, tipo 2 sin marca, una palabra por video)
Corrida diaria a las 2:00 CDMX; se programa en Metricool en el mejor horario para este tipo de contenido (mediodía, ver CLAUDE.md).
Formato: gancho en afirmación/dato (sin preguntas en la voz) → qué es → ejemplo cotidiano o cómo usarlo → cierre «Si te sirvió, dale like y sígueme». Plantilla (estilo claro, ver CLAUDE.md): `kit/app/src/glosario.tsx`. Sin cifras de rendimiento ni promesas; datos oficiales (Banxico, CONDUSEF, CNBV, IPAB) verificados en la web.
- [x] CAT (2026-11-06; versión final 2026-11-08 con voz D y solo hechos, `guiones/videos-producidos/cat.md`)
- [x] CETES (2026-11-07, mini video 2; guion `guiones/videos-producidos/cetes.md`, portada `capturas/31_CETES_portada.png`)
- [x] Liquidez (2026-11-08; guion `guiones/videos-producidos/liquidez.md`, portada `capturas/34_LIQUIDEZ_portada.png`)
- [x] Diversificar (2026-11-09; guion `guiones/videos-producidos/diversificar.md`, portada `capturas/36_DIVERSIFICAR_portada.png`)
- [ ] Value (inversión en valor) — nota 2026-11-09: explicar qué es en simple (empresas sólidas que cotizan a buen precio frente a lo que valen). Pronunciar «valiu». Verificar definición en fuente (CNBV/Bolsa/gestora) y sin promesas de rendimiento. Enlaza con el video de JPMRVUS (programado 2026-11-13).
- [ ] Growth (inversión en crecimiento) — nota 2026-11-09: explicar qué es en simple (empresas que crecen rápido; suelen reinvertir utilidades y pueden ser más volátiles). Pronunciar «grouz». Verificar definición en fuente y sin promesas de rendimiento. Pareja de «Value»; idealmente salen en días seguidos, antes del 2026-11-13.
- [ ] Tasa real
- [ ] Inflación (versión mini)
- [ ] UDI
- [ ] SPEI
- [ ] Interés compuesto (mini)
- [ ] Plazo
- [ ] Comisión
- [ ] Riesgo y volatilidad
- [ ] Horizonte de inversión
- [ ] Fondo de inversión
- [ ] Afore
- [ ] Buró de Crédito
- [ ] Pagaré
- [ ] Dividendo
- [ ] ETF
- [ ] Deuda buena vs mala
