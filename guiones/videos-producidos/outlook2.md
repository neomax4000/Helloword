# Noticia R · SEGUIMIENTO de la caída de Outlook / Microsoft 365 (viernes 13 nov 2026)
48.5 s, 720×1280, −15.2 LUFS. Código: `kit/app/src/outlook2.tsx`, voz `kit/scripts/voz/voz_outlook2.py`, mezcla `kit/scripts/audio/mezcla_outlook2.py`, render `kit/app/render_news.mjs` (composición `Outlook2C`). v1 (12 nov): `outlook.md`.

## Guion (voz 3, Kokoro)
1. El jueves cayó Outlook. Ya sabemos qué pasó.
2. Más de 120 mil reportes en Downdetector.
3. Microsoft dice: servidores fuera de línea sin aviso.
4. No fue más tráfico, ni señales de ciberataque.
5. Y sígueme: qué significa para tu dinero en México.
6. Cayeron Outlook, Teams y Copilot, de Australia a Estados Unidos.
7. Hubo reportes en 74 países y cerca de 18 horas de falla.
8. Hoy los reportes bajan, pero pueden quedar fallas.
9. Y Microsoft aún investiga el origen.
10. Uno: ante un aviso del banco, entra a su app.
11. Dos: desconfía de correos que digan «restablece tu cuenta».
12. Tres: ten un segundo canal para cobros y avisos.
13. Esto es información educativa, no una recomendación de inversión.
14. Si te sirvió, dale like y sígueme.

## Cifra → fuente → hora
| Cifra / afirmación | Fuente | Fecha y hora |
|---|---|---|
| Pico de +120,000 reportes de Outlook en Downdetector (EE. UU.) y +45,000 de Microsoft 365 | ABC News (Australia), «Outage reports peaked at about 4:20am AEST» | publicada 13 nov 6:29 AEST, actualizada 13 nov 10:27 AEST |
| Inicio de la falla: 12 nov, ~12:30 p.m. ET | TechRadar (blog en vivo) | última actualización 13 nov 12:20 UTC |
| Reportes en al menos 74 países | TechRadar | 13 nov 12:20 UTC |
| ≈18 h desde el inicio hasta que los reportes bajan | TechRadar (cálculo sobre su propia cronología) | 13 nov 12:20 UTC |
| «Servidores inesperadamente no disponibles»; «la carga elevada no viene de más tráfico» | Estado de Microsoft 365 citado por The National y ABC (Australia) | 12–13 nov |
| Sin señales de ciberataque | ABC News (Australia), «no indication of a cyber attack» | 13 nov |
| Origen aún en investigación; avisos EX1550543 y MO1550821 | TechRadar (centro de administración de Microsoft 365) | 13 nov |
| Pueden quedar fallas intermitentes | TechRadar, citando a Microsoft | 13 nov |
| Outlook, Teams, Copilot, SharePoint y OneDrive afectados; de Australia a EE. UU. | ABC (Australia) y TechRadar | 12–13 nov |

Los tres consejos (app del banco, desconfiar de correos, segundo canal) son orientación general, no cifras.

## Notas
- Ninguna fuente da reacción de la acción de Microsoft ni dato específico de México: no se dijo nada de eso.
- Corrección aplicada una vez (control 6): la voz decía «Jueves» (Whisper lo oía «Cueves») y pegaba «Teams y Copilot»; se cambió a «El jueves» y se separaron las palabras.
- Estilo: fondos de tema (`noticia-fondos.tsx`), pastilla de etiqueta por bloque, 3–5 piezas por bloque, verde/rojo con sentido, sin logo ni productos de Actinver.
