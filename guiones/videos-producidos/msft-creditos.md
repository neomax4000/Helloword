# Noticia R · Microsoft: créditos por la caída (jueves 12 nov, producido 14 nov 2026)
Pedido de Brandon: gancho duro («te puede devolver dinero») pero con datos duros y sin prometer lo que no es. Referencia de formato: video de @dunebox (otro creador); el guion y el diseño son propios. Sustituye al seguimiento `outlook2` (quedó desactualizado: la caída pasó de 27 h). Código `kit/app/src/msftcred.tsx`, voz `voz_msftcred.py`, mezcla `mezcla_msftcred.py`, composición `MsftCredC`.

## Guion (voz 3, Kokoro)
1. Microsoft te puede devolver dinero por la caída.
2. Pero no es automático, y no es en efectivo.
3. Su contrato promete Outlook al 99.9 % del mes: unos 43 minutos de falla permitida.
4. Menos de eso: 25 % de crédito. Bajo 99: la mitad. Bajo 95: el 100 %.
5. Y la falla pasó de 27 horas, según un medio de tecnología.
6. Y sígueme: qué significa para tu dinero en México.
7. Si tu empresa paga Microsoft 365, se pide en el centro de administración.
8. Cita el incidente EX1550543. Plazo: 31 de diciembre.
9. Ojo: es crédito en tu factura. No cubre ventas perdidas.
10. Microsoft dice que no fue ciberataque, sino una mejora de red.
11. Esto es información educativa, no una recomendación de inversión.
12. Si te sirvió, pulsa el corazón y sígueme.

## Cifra → fuente → hora
| Cifra | Fuente | Fecha / hora |
|---|---|---|
| 99.9 %, créditos 25 % (<99.9), 50 % (<99), 100 % (<95); downtime en minutos-usuario (versión oct 2026 del SLA, Exchange Online) | Captura del contrato mostrada en el video de @dunebox + Men's Journal, Open Magazine, LazyAdmin (los tres coinciden). **No se pudo abrir el contrato oficial** (el índice de Microsoft existe, el .docx no es legible por la herramienta) | 13–14 nov |
| ≈43 min/mes | Cálculo propio: 0.1 % de 43,200 min (mes de 30 días), con todos los usuarios afectados; coincide con Men's Journal y LazyAdmin | — |
| Más de 27 horas; inicio jueves 12 ~18:00 UTC; viernes 21:44 UTC «sin ETA de recuperación total» | The Register (13 nov, actualización 21:50 UTC). ABC: «dos días laborables» | 13 nov |
| No es automático; crédito en factura, no efectivo; solo el servicio afectado; no cubre ventas perdidas | Men's Journal, Open Magazine, LazyAdmin | 13 nov |
| Plazo 31 dic 2026 (ciclo de facturación calendario) | Men's Journal y LazyAdmin (difieren en el encuadre; ambos dan 31 dic) | 13 nov |
| Incidentes EX1550543 y MO1550821; solicitud en el centro de administración | TechRadar, LazyAdmin, Men's Journal | 13 nov |
| No fue ciberataque; «problema durante una mejora de capacidad de red» | Microsoft, citado por ABC News (13 nov, 12:34) y KUOW | 13 nov |

## Notas
- Variety titula que Microsoft se disculpó y que los clientes pueden pedir créditos, pero la nota no pudo abrirse. Disculpa citada: Charles Lamanna (ABC): «We regret that today's outages caused disruptions for our customers».
- Planes Personal/Family sin SLA: una sola fuente, por eso NO se dice en el video.
- Para México: aplica a clientes comerciales; si se compró con revendedor, el reclamo va por él (Men's Journal).
