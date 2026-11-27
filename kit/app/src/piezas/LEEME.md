# Piezas reutilizables (kit/app/src/piezas)

Biblioteca para armar escenas SIN escribir código nuevo: cada pieza recibe datos (cifras, textos, segundos). Tiempos en segundos, absolutos dentro de la composición. Lienzo 1080×1920; respetar `SAFE` de `pro.tsx` (arriba 170, abajo 1500, derecha 950).

| Pieza | Para qué | Props clave |
|---|---|---|
| `Personaje` | Anfitrión o puerquito | `quien` (anfitrion/puerquito), `vista` (front, tq, side, back; anfitrión: senala, moneda, abre), `expr` (guino, alegre, sorpresa, duda, preocupado; puerquito también dormido), `x`, `y` (suelo), `alto`, `at`, `busto`, `flip`, `hasta` |
| `Duelo` | A vs B con cifra cada uno | `a`/`b` = `{etiqueta, valor, sub, color}`, `at`, `top`, `alto` |
| `Contador` | Cifra grande que sube o baja | `desde`, `hasta`, `at`, `dur`, `prefijo`, `sufijo`, `decimales`, `color`, `y`, `etiqueta` |
| `Cuenta` | Ticket con operaciones fila por fila | `filas: [{at, izq, der, color, fuerte}]`, `titulo`, `y` |
| `Chat` | Conversación tipo mensajería | `msgs: [{at, lado: in/out, texto, hora}]`, `top`, `alto`, `contacto` |
| `LineaTiempo` | Cronología (día 1 → día 90) | `nodos: [{at, titulo, detalle, color}]`, `top`, `paso` |
| `StickerLegal` | «EJEMPLO», «NO ES RECOMENDACIÓN», «REVISA LA VIGENTE» dentro de la escena | `texto`, `at`, `hasta`, `rot`, `x`, `y` |
| `PortadaTitular` | Portada: titular con una palabra resaltada + elenco | `antes`, `resaltada`, `despues`, `mood`, `personaje` |
| `RecetaVideo` | Arma todo desde JSON | `receta = {moods, escenas: [{a, b, piezas: [{pieza, props}]}]}` |

## Cómo se usa
1. Guion JSON y voz como siempre (`kit/scripts/pro/`). Los tiempos de cada pieza salen del alineado Whisper.
2. Escribe la receta (ver `Demo.tsx`: ejemplo con todas las piezas) y envuélvela en `<RecetaVideo receta={...} />`; subtítulos y marco legal siguen siendo `Captions` y `Frame` de `pro.tsx`.
3. Registra la composición en `Root.tsx`, verifica con `node kit/app/stills_piezas.mjs` y renderiza con `render_pro.mjs`.

## Reglas
- El elenco viene de `pruebas/identidad/` (`gen_hoja.py`, `gen_expresiones.py`). Para cambiar un personaje: edita esos scripts y corre `python3 pruebas/identidad/gen_componentes.py` (regenera `elenco-data.ts`; no se edita a mano).
- Pieza nueva que se use en 2 videos o más → se agrega aquí con props, una línea en esta tabla y un ejemplo en `Demo.tsx`.
- Estado: v1 (27 nov 2026), verificada con stills. Aún no se ha usado en un video publicado.
