# ¿Qué es el IPAB y de verdad protege tu dinero? — educativo sin marca, narrador voz 3, 78 s
Producido 2026-11-05 · Código: `kit/app/src/ipab.tsx` · Voz: `kit/scripts/voz/voz_ipab.py` · Mezcla: `kit/scripts/audio/mezcla_ipab.py` · Portada: `capturas/26_IPAB_portada.png`

## Guion hablado
¿Si tu banco quiebra mañana, de verdad te devuelven tu dinero?
Ni todo, ni nada. Depende de dónde lo tengas y de cuánto.
Para eso existe el IPAB, el Instituto para la Protección al Ahorro Bancario.
Si un banco deja de operar, el IPAB paga a los ahorradores.
Pero con un límite: cuatrocientas mil UDIS, por persona y por banco.
La UDI es una unidad que se ajusta con la inflación, así que ese límite se actualiza.
**Y sígueme, porque lo que sigue es lo que casi nadie revisa.** ← llamada a mitad, antes del punto clave
Protege cuentas de ahorro, de nómina y de cheques, y también pagarés y depósitos a plazo.
Lo que no protege: fondos de inversión, casas de bolsa, cajas de ahorro y cooperativas.
Un fondo de inversión no es un depósito: su valor puede subir o bajar.
Y ojo: el límite es por banco. Si repartes, cada banco cuenta aparte.
No es teoría: en 2025 el IPAB pagó a ahorradores de un banco que dejó de operar.
Revisa en qué institución está tu dinero y cuánto tienes en cada una.
Esto es información educativa, no una recomendación de inversión.
¿Sabes dónde está tu dinero y si está protegido?
Si te sirvió, dale like y sígueme.

## Notas
- Pronunciación (Kokoro): «Ípab», «Údis»; verificada con Whisper (solo «al Ahorro» se transcribe «a Oro» por la h muda; suena correcto).
- Cierre sin «Escríbeme». Sin cifras de rendimiento ni promesas; la única cifra es el límite de la garantía (400 mil UDIS), que es un tope, no un rendimiento. No se menciona el equivalente en pesos (cambia con la UDI).
- No se nombra al banco del caso 2025 (CIBanco) a propósito.
- Nota técnica: `kit/app/public/acti500/words.json` faltaba en el repo (la corrida de ACTI500 no lo subió y rompía el bundle de Remotion); se regeneró con `voz_acti500.py` y se incluye.

## Fuentes
- Condusef vía UnoTV (11 may 2023): garantía de hasta 400 mil UDIS «por persona y por banco»; productos cubiertos (ahorro, nómina, débito, cheques, pagarés) y no cubiertos (sociedades de inversión, casas de bolsa, cajas de ahorro, SOFIPOs, cooperativas, etc.): https://www.unotv.com/negocios/si-quiebra-el-banco-que-pasa-con-mi-dinero-condusef-explica/
- UnoTV (14 oct 2025): IPAB inicia pago a ahorradores de un banco en liquidación; 400 mil UDIS por persona y por banco: https://www.unotv.com/negocios/ipab-comienza-pago-a-clientes-de-cibanco-en-liquidacion/
- Búsqueda adicional (no abierta a detalle): Ley del IPAB / notas de El Financiero, El Imparcial, Razón.
- No se pudo abrir ipab.gob.mx desde la corrida: revisar en la fuente oficial.

## Pendientes para Cumplimiento
- Confirmar contra IPAB / Ley de Protección al Ahorro Bancario: monto (400 mil UDIS por persona y por institución), lista de operaciones cubiertas y si incluye intereses (no se afirma en el video).
- «Si repartes, cada banco cuenta aparte»: confirmar redacción (es dato descriptivo, no recomendación).
- «Fondos de inversión, casas de bolsa… no los protege el IPAB»: confirmar redacción.
- Mención del caso de 2025 (sin nombrar el banco).
- Leyenda «información educativa, no una recomendación de inversión» (voz y pantalla).
