# Plantilla de terror / thriller — «La semana que Wall Street sangró» (9 nov 2026)

Estilo: thriller realista, sin fantasía. Expediente policial, cámara de seguridad (REC + hora), visión nocturna, tablero de detective con hilo rojo, cartel de SE BUSCA, sellos rojos, monitor cardiaco.
- Paleta: negro, rojo #E3122B, hueso #EDE6D6, ámbar #FFB020, verde visión nocturna #4CFF8A.
- Tipografías: Oswald 700 (títulos y subtítulos), Special Elite (máquina de escribir), Poppins (texto).
- Capas: grano de película (feTurbulence), viñeta, parpadeo, viñeta roja que late con el corazón en la apertura, scanlines en fondos verde/azul.
- Subtítulos: Oswald 84 px en mayúsculas, máx. 3 palabras, activa en rojo, clave en ámbar.
- Fondos (5 temas oscuros) cambian cada 2–3 escenas con clip circular.
- Proyecto independiente: index.tsx registra la composición «TerrorC» (con portada de 1.5 s para el PNG); el MP4 final se corta 1.5 s (`ffmpeg -ss 1.5`).

Audio: voz `kit/scripts/voz/voz_terror_bolsa.py ef_dora salida.wav` (velocidad 1.0–1.08, pausas 0.10/0.22/0.42 s, recorte de silencios); subtítulos con `mkwords.py` (texto exacto del guion repartido por la duración de cada frase); música y efectos con `kit/scripts/audio/mezcla_terror.py` (drone en re menor, tic-tac, latidos sincronizados con la viñeta, golpes graves en las cifras, estática en los cambios de escena) y mezcla con sidechain.
Fuentes de fuentes: public/ necesita oswald-latin-400/700, special-elite-latin-400 y poppins-latin-400/600 (woff2 de @fontsource).
