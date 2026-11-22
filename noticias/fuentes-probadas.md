# Fuentes del radar: qué se puede leer y qué no

Se actualiza cada vez que se prueba una fuente. «LEE» = WebFetch funciona. «FALLA» = no usar con WebFetch; usar WebSearch con `allowed_domains`.

| Fecha | Fuente | Resultado | Nota |
|---|---|---|---|
| 2026-11-19 | Fed, comunicados (`federalreserve.gov/feeds/press_all.xml`) | LEE | Trae las minutas del FOMC del 18 nov 19:00 GMT |
| 2026-11-19 | BLS, indicadores (`bls.gov/feed/bls_latest.rss`) | LEE | Un solo ítem de resumen con los indicadores recientes (CPI oct +0.4 %, desempleo 4.1 %) |
| 2026-11-19 | SEC, comunicados (`sec.gov/news/pressreleases.rss`) | LEE | |
| 2026-11-09 | Google Trends MX (`trends.google.com/trending?geo=MX`) | LEE | El RSS de Trends devolvió una copia vieja: no usarlo |
| 2026-11-19 | Google News RSS (sección Negocios y búsqueda) | FALLA | robots.txt |
| 2026-11-19 | CNBC RSS finanzas | FALLA | error de cliente |
| 2026-11-19 | BBC Mundo RSS | FALLA | sitio bloqueado |
| 2026-11-19 | Downdetector México | FALLA | sitio bloqueado; usar WebSearch «caída de [servicio] hoy» |
| 2026-11-19 | TikTok Creative Center (hashtags) | VACÍO | necesita JavaScript |
| 2026-11-19 | CONDUSEF (páginas de contenido) | FALLA | robots.txt; los PDF de `condusef.gob.mx/documentos/` sí se leen |

| 2026-11-19 | Espresso Matutino (newsletter en Gmail de Brandon, llega ~5–6 am CDMX; `noticias@mail.espressomatutino.com`) | LEE | Gmail: search_threads `Espresso newer_than:2d` + get_thread (el texto es largo: extraer con python). Resume mercados, negocios y México; sirve de pista, la cifra se confirma con 2.ª fuente |

Pendiente de probar: Banxico (sala de prensa y calendario), INEGI (calendario), Emisnet/BMV, Reuters, El Financiero, El Economista, Expansión, Milenio, Infobae, páginas de estado de Microsoft, Google, AWS y Cloudflare.
| 2026-11-19 (tarde) | WebFetch/subagente web-fetch (Trends, Fed, Banxico) | FALLA | PROVENANCE_REQUIRED: permiso sin responder en corrida desatendida; Bloomberg Línea sí se leyó (artículo de 2025) |
| 2026-11-19 (tarde) | WebSearch con `allowed_domains` (infobae.com, milenio.com) | LEE (solo títulos y URL) | Sirve para detectar qué salió hoy, no para leer cifras; varios dominios juntos a veces dan PROXY_REJECTED |
| 2026-11-22 | WebFetch y subagente web-fetch (Trends MX/US, Fed, BLS, México Cómo Vamos, Bloomberg Línea, Expansión, Infobae, El Financiero, Milenio) | FALLA | PROVENANCE_REQUIRED en las 10 URLs (permiso sin responder en corrida desatendida) |
| 2026-11-22 | WebSearch standard (mercados, México economía, caídas de bancos, calendario semanal) | LEE (solo títulos/URL) | resultados mayormente de 2025 o de otros países; nada fechado el 21–22 nov 2026 |
