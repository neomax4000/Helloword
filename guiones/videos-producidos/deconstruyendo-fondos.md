# Deconstruyendo las finanzas — Guion 1: los fondos de inversión

- **Tipo:** Deconstruyendo las finanzas (serie aparte, fuera del ciclo diario).
- **Duración:** 5:50 (350.6 s). Una sola animación continua, sin cortes.
- **Voz:** Baldur (XTTS), generada en Code: `audio/deconstruyendo-fondos-baldur.mp3`, rama `claude/busy-sagan-sdtq9d`.
  - Se quitó un glitch de XTTS: unos 5 s de sílabas sin sentido entre «retención de impuestos» y «Pero al final del año» (corte de 290.30 a 295.38 s del audio original).
  - Mezcla a −14 LUFS.
- **Código:**
  - Animación: `kit/app/src/deconstruyendo-fondos.tsx` (composición `DeconstruyendoFondos`).
  - Estaciones: `kit/scripts/pro/estaciones_fondos.py`.
  - Guion: `kit/scripts/pro/guiones/deconstruyendo-fondos.json`.
- **Guion completo:** `guiones/deconstruyendo-las-finanzas.md`.

## Producción visual (v2, 2026-11-20)

- **Estaciones.** Cada pieza es una estación del mismo camino. Aparece un letrero rosa con el problema; al llegar la solución, el letrero se quita y se ilumina la institución o el anuncio correspondiente:
  - Autoridad (autoriza).
  - Sociedad operadora.
  - Política de inversión.
  - Custodio (bóveda).
  - Registro de títulos.
  - Comité de inversión (sala).
  - Cumplimiento.
  - Precio del título.
  - Valuación (fórmula).
  - Proveedor de precios (pantallas).
  - Casa de bolsa.
  - Suscripción.
  - Reembolso.
  - Activos líquidos.
  - Hora de corte (reloj).
  - Plazo de liquidación.
  - Comisión.
  - Reinversión.
  - Autoridad fiscal (SAT).
  - Constancia fiscal.
  - Prospecto (con DICI).
  - Regulador (CNBV).
- **Gente que se suma a la caravana:**
  - Sociedad operadora: 2 personas.
  - Custodio: 1.
  - Comité de inversión: 3.
  - Cumplimiento: 2.
  - Casa de bolsa: 1.
  - Regulador: 1.
- **Inversionistas que entran y salen:** una inversionista nueva sale de la casa de bolsa, se suma a la caravana y en «suscripción» deposita su dinero; en «reembolso», otro inversionista recibe su dinero y se va.
- **Lo que viaja:**
  - Monedas: precio del título, reinversión, la comisión hacia la operadora y la retención hacia el SAT.
  - Constancias: van a cada inversionista.
- **Cierre:** la cámara regresa volando al principio de la calle y la recorre, iluminando cada institución cuando se nombra; en «Todo junto» se aleja hasta mostrar toda la calle. Al final hay una pregunta escrita: «¿Cuál de estas piezas no conocías? Te leo en comentarios.»

## Datos en pantalla y fuentes (cada cifra con dos fuentes)

| Dato | Fuentes |
|---|---|
| Más de 16 millones de clientes en fondos (AMIB) | [El CEO, 19 ene 2026 (16.1 M, dic 2025)](https://elceo.com/mercados/bbva-blackrock-y-otros-fondos-de-inversion-rompen-records-llegan-a-4-9-bdp-y-16-millones-de-clientes/) · [El Cronista, 30 mar 2026 (16.55 M, feb 2026)](https://www.cronista.com/mexico/finanzas-economia/inversionista-por-accidente-el-dato-oculto-detras-del-record-de-5-billones-de-pesos-en-fondos-en-mexico) |
| 29 operadoras de fondos (AMIB) | El CEO (dic 2025) · El Cronista (feb 2026), mismas ligas |
| Más de 5 billones de pesos en fondos (AMIB, feb 2026) | [BBVA, 17 mar 2026](https://www.bbva.com/es/mx/economia-y-finanzas/fondos-de-inversion-superan-5-billones-de-pesos-en-activos-una-opcion-estable-para-proteger-el-capital/) · El Cronista |
| 36 casas de bolsa autorizadas por la CNBV | [El CEO, 26 ago 2025 (dato CNBV, jun 2025)](https://elceo.com/mercados/mercado-de-casas-de-bolsa-sin-movimiento-relevante-pese-a-venta-de-vector/) · [Rankia (padrón CNBV, abr 2026)](https://www.rankia.mx/blog/casas-de-bolsa-de-mexico/7316144-cuales-son-casas-bolsa-autorizadas-mexico) |
| Dos bolsas: BMV y BIVA; BIVA abrió en 2018 | [Expansión, 25 jul 2018](https://expansion.mx/empresas/2018/07/25/biva-la-nueva-bolsa-de-valores-mexicana-arranca-hoy-operaciones) · [Wikipedia: BIVA](https://en.wikipedia.org/wiki/Bolsa_Institucional_de_Valores) |
| Ley de Sociedades de Inversión (4 jun 2001); desde la reforma financiera de 2014 se llama Ley de Fondos de Inversión | [Cámara de Diputados, reformas LFI](https://www.diputados.gob.mx/LeyesBiblio/ref/lfi.htm) · [Rankia: Ley de Fondos de Inversión](https://www.rankia.mx/blog/fondos-de-inversion-mexico/6427007-ley-fondos-inversion) |
| 4 tipos de fondo: renta variable, deuda, capitales y cobertura (art. 6); abiertos y cerrados (art. 7) | [LFI en Justia](https://mexico.justia.com/federales/leyes/ley-de-fondos-de-inversion) · Rankia LFI |
| Prospecto autorizado por la CNBV con política, valuación y DICI (art. 9) | LFI (Justia) · Rankia LFI |
| Contralor normativo vigila al fondo (art. 10); el consejo de la operadora fija las políticas (art. 11) | LFI (Justia) |
| Valores depositados en una institución para el depósito de valores (art. 16); en México, Indeval | LFI (Justia) · [Rankia: Indeval](https://www.rankia.mx/blog/como-comenzar-invertir-bolsa/3239314-que-indeval-prestamo-valores-mexico) |
| Indeval: registro electrónico y código ISIN | Rankia: Indeval · [Banxico: liquidación de instrumentos](https://www.banxico.org.mx/elib/mercado-valores-gub/OEBPS/Text/vi.html) |
| Servicios que el fondo debe contratar: valuación, proveeduría de precios, depósito y custodia (art. 32) | LFI (Justia) |
| Valmer es proveedor de precios y parte de Grupo BMV | [BMV: Valmer 25 aniversario (3 nov 2025)](https://www.bmv.com.mx/docs-pub/SALA_PRENSA/CTEN_BOLE/Valmer%2025%20Aniversario%2003.11.25.pdf) · [BMV: Valmer en el IVSC](https://www.bmv.com.mx/docs-pub/SALA_PRENSA/CTEN_BOLE/Valmer%20forma%20parte%20del%20Consejo%20de%20Est%C3%A1ndares%20Internacionales%2016.01.23.pdf) |
| Liquidación en T+1 desde el 27 may 2024 (antes T+2, desde 2017) | [Grupo BMV, comunicado](https://bmv.com.mx/docs-pub/SALA_PRENSA/CTEN_BOLE/Grupo%20BMV%20implementa%20ciclo%20de%20liquidaci%C3%B3n%20T+1%2027.05.24.pdf) · [Expansión, 27 may 2024](https://expansion.mx/mercados/2024/05/27/grupo-bolsa-mexicana-valores-liquidacion-t-1) |
| Retención de ISR 2026: 0.90% anual sobre el capital (2025: 0.50%) | [Expansión, 19 oct 2026 (LIF 2026, art. 24)](https://expansion.mx/finanzas-personales/2026/10/19/retiene-sat-por-cada-10-000-pesos-inviertes-en-cetes) · [EY, Paquete Económico 2026](https://www.ey.com/es_mx/technical/tax/boletines-fiscales/paquete-economico-2026-principales-propuestas-isr-e-iva-sector-financiero) |
| La CNBV nació en 1995 por la fusión de la CNB y la CNV | [CNBV: fusión de la CNB y CNV](https://www.cnbv.gob.mx/CNBV/Historia/Paginas/Fusi%C3%B3n-de-la-CNB-y-CNV.aspx) · [Wikipedia: CNBV](https://es.wikipedia.org/wiki/Comisi%C3%B3n_Nacional_Bancaria_y_de_Valores) |

### Puntos por vigilar

- **Tasa de retención.** El 0.90% es la tasa de 2026. Hay propuesta para bajarla en 2027 ([IDC, 14 oct 2026](https://idconline.mx/fiscal-contable/2026/10/14/paquete-economico-2027-bajaria-tasa-de-retencion-sobre-intereses)). Si el video se publica en 2027, hay que cambiar ese dato.
- **Cifras de la AMIB.** Las cifras van a cambiar con cada corte.
- **Sin marca.** El video no menciona a Actinver.
