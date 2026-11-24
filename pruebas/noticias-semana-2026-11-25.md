# Noticias en la semana de pruebas — 1 diaria SÍ O SÍ (25 nov – 1 dic 2026)

Decisión de Brandon (24 nov 2026, 17:39): REGLA TEMPORAL, solo TikTok. Durante la semana de pruebas se publica **una noticia en video TODOS LOS DÍAS, sin excepción**, y cada día con un **formato de desglose distinto** (7 formatos, uno por día, ninguno se repite). Manda sobre el protocolo (`guiones/protocolo-noticias.md`) y sobre el prompt del radar en todo lo que contradiga; lo demás del protocolo sigue.

## 1. Qué se publica (siempre hay algo)
Orden de elección en la pasada de la mañana (6:47 CDMX):
1. **R · Reacción relevante del día** con puente honesto a tu dinero en México y verificada (una fuente primaria o agencia nombrada; si no, dos medios independientes).
2. Si no hay una R que pase las compuertas: **P · Previa de 24 h** = el dato oficial más importante de MAÑANA que puede mover mercado, peso o tasas (Banxico, INEGI, SHCP, Fed, BLS, BEA, BCE, resultados de empresas emblemáticas), con hora confirmada en el calendario oficial. Objetivo: que la gente sepa a qué estar atenta mañana.
3. Si mañana no hay dato relevante (fin de semana, feriado): **Previa de la semana** = agenda de los próximos días hábiles con 2–4 datos clave, su hora y por qué importan.
Siempre existe una opción 2 o 3 (el calendario es un hecho verificable), así que **NO_GO deja de existir esta semana**: si el mejor candidato falla un control, se toma el siguiente.

Se prefiere lo PREVISOR (P) cuando la R del día sea floja: Brandon quiere que la noticia avise qué dato importa mañana.

## 2. Qué se suspende y qué NO
- Se suspenden esta semana: el puntaje mínimo (65/50/40), el estado ESPERA_OK y la necesidad de OK. El mejor candidato verificado se programa solo.
- NO se suspenden: verificación y fuente en pantalla, «qué significa para tu dinero en México», cero pronósticos y cero «compra/vende», nada partidista, nada de tragedias o crimen sin puente, sin logo ni productos de Actinver, sin fotos de personas reales, controles de calidad (PRO.md §7 y protocolo). Un hecho sin confirmación solo con el formato «lo que sí sabemos y lo que no». El FRENO sigue: si una noticia publicada tuvo un error, se avisa a Brandon y la siguiente pide OK.
- Cupo: **1 noticia al día** (con los 2 videos de prueba son 3 publicaciones, el máximo).

## 3. Horario
- Pasada mañana (6:47): produce y programa en Buffer para las **15:00 CDMX** (queda ≥ 3 h de los videos de 12:00 y 19:00). Terminar a más tardar a las 13:00.
- Pasada tarde (12:47): si la de la mañana NO dejó un post programado, produce una ahora (R de la tarde o P de mañana) para las **16:00**. Si ya hay noticia programada, solo revisa y no produce otra.
- Si las dos pasadas fallan: PushNotification a Brandon con el motivo exacto y entrega lo que se tenga.

## 4. Los 7 formatos de desglose (uno por día; ninguno se repite)
Todos: gancho en el primer fotograma con el hecho o la hora (lo nuevo primero, en ≤ 8 palabras); «por qué importa» en la segunda frase; «qué significa para tu dinero en México»; qué vigilar; fuente y hora escritas en pantalla (sello de verificación); pregunta ESCRITA al final; sin preguntas en la voz; duración la que necesite (30–60 s).

| Día | Formato | Cómo se desglosa | Visual propio | Si es previa (P) |
|---|---|---|---|---|
| Mié 25 | **Efecto dominó** | Cadena causa → efecto en 4–5 fichas que caen hasta tu bolsillo (p. ej. dato → tasas → dólar → tus compras) | Fichas de dominó / flechas que se encadenan | La cadena muestra «si sale arriba» y «si sale abajo» |
| Jue 26 | **El titular vs lo que importa** | Se muestra el titular tal cual, se marca qué parte engaña o exagera y aparece el dato que sí cambia algo | Recorte de periódico que se tacha y se subraya | «Mañana vas a leer este titular; esto es lo que importa» |
| Vie 27 | **Ganadores y perdedores** | Dos columnas: quién gana, quién pierde y «tú estás aquí» | Marcador tipo tablero deportivo | Quién ganaría y quién perdería según salga el dato |
| Sáb 28 | **Explicado con tu quincena** | La noticia traducida a una quincena de ejemplo (hipotética, con la base de cálculo en pantalla) | Ticket o recibo que se imprime línea por línea | Qué movería en esa quincena el dato de la semana |
| Dom 29 | **La agenda de la semana** | Previa semanal: 2–4 datos de lun a vie con día, hora y por qué importan | Calendario / planner que se va llenando | Es previa por naturaleza |
| Lun 30 | **Mañana a las HH:MM** | Cuenta regresiva: qué sale, qué espera el consenso (fuente y hora), si sale arriba / abajo, cuándo verlo | Reloj y semáforo | Es previa por naturaleza (si hay R fuerte: «qué sigue mañana tras…») |
| Mar 1 dic | **Lo que sí sabemos y lo que no** | Dos columnas verificado / pendiente y una mini cronología | Expediente o tablero de investigación | Lo confirmado del calendario y lo que nadie sabe aún |

Si el formato del día de plano no encaja con la noticia, se cambia por un formato de la tabla que aún no se haya usado esa semana y se anota.
Contexto útil (verificar en calendarios oficiales): el jueves 26 nov es Thanksgiving en EE.UU. (mercados de EE.UU. cerrados) y el viernes 27 suele ser sesión corta; la semana del 30 nov–4 dic trae datos de inicio de mes.

## 5. Registro y medición
- Estado y motivo en `noticias/AAAA-MM-DD.md` (APROBADA_AUTOMÁTICA_PRUEBA) y `noticias/registro.md` (con el formato usado).
- El guion JSON lleva `"prueba": {"id": "N1"…"N7", "formato", "tipo": "R/P/semana", "apertura", "fondo", "duracion_objetivo", "voz"}`.
- En Notion, base «Historial de cambios»: un renglón por formato de noticia («Noticia · Efecto dominó», etc.) con Veredicto «En prueba» y el video. La revisión diaria lo mide igual que los demás.
- Pregunta que respondemos: ¿qué formato de noticia retiene y se comparte más? ¿La previa rinde igual que la reacción?

## 6. Lo que aprendimos de la comunidad y la investigación (resumen; detalle en Notion)
- Abrir en el momento dinámico y luego dar contexto (bucle y flashback); explicar con personajes que representan posturas (RJI, entrevistas a 11 redacciones, 2026).
- Lo nuevo primero y luego «por qué importa»; titular corto y concreto; parar cuando basta (método Smart Brevity de Axios).
- Verificar con 2–3 medios y documentos primarios, no hacer «breaking», corregir en público; balancear con historias más ligeras (V Spehar, Under the Desk News, Nieman Lab 2026).
- La gente se preocupa por distinguir lo real de lo falso (58 % en el Reuters Digital News Report 2025): la fuente en pantalla es parte del diseño.
