# Idea unificada: identidad para los videos de prueba (propuesta, 27 nov 2026)

Estado: PROPUESTA. No cambia reglas del repo (`CLAUDE.md`, `kit/PRO.md`). Se aplica solo a videos de prueba y a la semana 2 (3–9 dic) si Brandon la aprueba.

## 1. Qué se deconstruyó

**@billete.animado (cuenta de 748 seguidores, 11 videos; un video con ~186 mil vistas, CETES P1; el resto entre 307 y 5,626; mediana ≈ 1,000)**
- Personajes fijos (dos humanos 2D + mascota billete) en todos los videos.
- Series con sello «PARTE 1 / PARTE 2» y duelo con cifras (Ana vs Beto).
- Fondo plano de un color distinto cada 2–3 s, una pieza protagonista grande, sticker rotado, subtítulo arriba.
- Aviso legal DENTRO de la escena («EJEMPLO», «REVISA LA VIGENTE»).
- Cierre «Mándaselo a ese amigo que…» + tarjeta con barra de búsqueda del perfil.
- Portadas con titular y una palabra resaltada; temas cotidianos o de actualidad.
- Palanca principal probable: título/caption con la frase que la gente busca («Como invertir en CETES», «desde $100»).

**Imágenes de Brandon**
- Figura de bloques tipo juguete, traje azul y corbata verde, guiño (generada con IA).
- Puerquito alcancía dorado con relieve.
- Esfera navideña de Actinver con puerquito dorado («Refiere y gana con Actinver»): ya existe un puerquito dorado en la comunicación navideña de Actinver.

## 2. Decisión de mascota (recomendación)

Combinar las opciones de Brandon sin copiar nada de nadie:

1. **Mascota/logo: puerquito alcancía dorado en 2D** (trazo grueso oscuro, degradado dorado, ranura visible). Es la «marca» de la cuenta: aparece en todos los videos, en la portada y en la tarjeta final.
2. **Anfitrión humano: hombre 2D** de traje azul, corbata verde y guiño (boceto en `elenco.png`). Hace el papel de «el que explica».
3. **Segundo humano:** una mujer 2D original, solo para duelos (A vs B).

Descartado por ahora: la figura estilo Lego tal cual. Es un producto de marca registrada; una figura de bloques propia y distinta (sin tetones, sin proporciones de minifigura) evita riesgos. El «puerquito dorado de lego en 2D» se queda como variante: puerquito con acabado de bloques propio, sin la marca ni la forma de la minifigura.

Nota Actinver: los videos educativos, de glosario y de noticias NO llevan marca ni producto de Actinver. El puerquito dorado de nuestra cuenta es propio y debe verse distinto al de la campaña navideña de Actinver (otro estilo 2D, sin esfera ni árbol). En videos de producto se puede conectar con la marca; eso lo decide Brandon.

## 3. La fórmula (una sola idea para los videos de prueba)

1. **Tema por búsqueda:** antes de elegir el tema, anotar 3 frases que TikTok sugiere en la barra de búsqueda y usar la mejor en las primeras palabras del caption y en 1–2 hashtags. Sin cifras sin dos fuentes.
2. **Gancho:** dato o situación cotidiana en afirmación, escrito arriba desde el primer cuadro (sin preguntas en la voz).
3. **Elenco:** puerquito + hombre (+ mujer en duelos). Dos personajes frente a frente con una cifra cada uno cuando el tema lo permita.
4. **Ritmo:** cambio de fondo y de pieza cada 2–3 s; una pieza grande por escena; sticker rotado con la palabra clave.
5. **Serie:** sello «PARTE 1/2» cuando el tema tenga continuación; la Parte 2 sale al día siguiente o 2 días después.
6. **Legal integrado:** sticker «EJEMPLO», «NO ES RECOMENDACIÓN», «REVISA LA VIGENTE» dentro de la escena, más la nota obligatoria en el caption.
7. **Cierre escrito:** «Mándaselo a ese amigo que…» con escena de humor (puerquito dormido) y tarjeta con el perfil. Nada de esto en la voz.
8. **Portada:** titular corto con una palabra resaltada, puesta a mano en TikTok (Buffer no acepta portada).
9. **Duración:** 18–25 s para glosario; 45–60 s para historias con duelo.

## 4. Cómo se prueba (semana 2)

- Piloto de 2 videos con el elenco, mismo tema y formato que uno de la semana 1 (pareja gemela), cambiando solo la identidad.
- Medir contra la mediana de los últimos 10 (145.5 vistas, 8.3 s, 23 % visto ÷ duración al 27 nov) y guardados/compartidos.
- Veredicto con la regla de siempre: «Se queda» si supera la mediana en 2 videos con temas distintos.

## 5. Limitaciones

- Un solo video explica casi todo el alcance de la cuenta de referencia; no se sabe cuánto vino de búsqueda ni el % visto completo.
- El elenco es un boceto de dirección; antes de producir se pule y se fija una «hoja de personaje».
- Esta idea choca con «una sola identidad visual» solo en el sentido contrario (la refuerza) y con la semana de pruebas (que pide variedad total); se aplica desde el 2 dic si Brandon aprueba.

## 6. Hoja de personajes y reparto de trabajo (propuesta, 27 nov)

- `hoja-personajes.png` / `.svg`: puerquito y anfitrión en frente, 3/4, perfil y atrás, con paleta. Es la referencia obligatoria de cualquier escena. Se generó con `gen_hoja.py`.
- **Reparto propuesto:** Claude diseña personajes, guiones, storyboard y revisa el resultado; Haiku (subagente) arma las escenas y la animación en Remotion siguiendo la hoja, el guion JSON y una especificación cerrada por escena.
- **Condiciones para que funcione:** (1) la hoja y los componentes de personaje (`kit/app/src/`) se hacen UNA vez con el modelo principal; (2) Haiku solo ensambla, no inventa el diseño; (3) Claude revisa fotogramas clave antes de programar; (4) si el resultado falla la lista de control, se corrige con el modelo principal. Pendiente: aprobación de Brandon para convertirlo en regla en `CLAUDE.md` / `PRO.md`.
