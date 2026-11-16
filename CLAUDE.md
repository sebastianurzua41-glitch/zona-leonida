# Zona Leonida

Canal de YouTube de GTA 6 en español. Este repositorio guarda los videos publicados y el motor que los genera.

## Estructura

- `videos/content.py`: guiones y estructura visual de cada video (una entrada por video).
- `engine/`: `tts.py` (voz), `music.py` (música y efectos), `player.*` + `render.js` (animación), `build.py` (orquesta todo), `meta.py` (textos de publicación), `brand.js` (arte del canal).
- `out/videos/`: videos finales `.mp4` y subtítulos `.srt`.
- `out/miniaturas/`: miniaturas `.jpg` 1280×720.
- `out/PUBLICACION.md`: título, descripción, etiquetas y comentario fijado de cada video.
- `out/GUIA-DEL-CANAL.md`: investigación, orden de subida y plan de contenidos.

## Preparar una sesión nueva

```bash
./setup.sh
```

Instala dependencias y descarga el modelo de voz (no está en el repositorio por tamaño).

## Generar un video

1. Agrega o edita la entrada en `videos/content.py`.
2. `python3 engine/build.py NN` (NN = prefijo del id; sin argumento genera todos).
3. Miniaturas: actualiza `build/thumbs.json` como lo hace la sesión original y corre `node engine/render.js thumb build/thumbs.json build/thumbs_raw`, luego reduce a 1280×720 en `out/miniaturas/`.
4. `python3 engine/meta.py` regenera `out/PUBLICACION.md` (agrega antes la entrada del video en el diccionario `M`).
5. Revisa cuadros del resultado antes de darlo por bueno. El audio no se puede escuchar desde la sesión: dilo.

## Publicar en YouTube

No hay acceso directo a YouTube. Se publica con el conector de Metricool (`createScheduledPost`), que lee el video desde una URL pública:

1. Haz commit y push del `.mp4` y el `.jpg` a `main`.
2. URL pública: `https://raw.githubusercontent.com/<dueño>/zona-leonida/main/out/videos/<id>.mp4` (y `out/miniaturas/<id>.jpg` para `videoThumbnailUrl`).
3. `getBrandSettings` da el `blogId` y la zona horaria.
4. `createScheduledPost` con `providers: [{"network":"youtube"}]`, `text` = descripción, y `youtubeData` con `title`, `tags`, `category: "GAMING"`, `madeForKids: false`, `privacy`.
5. Los subtítulos `.srt` y el comentario fijado no se pueden enviar por Metricool: avisa que quedan a mano.

Reglas:

- Confirma siempre con el usuario fecha, hora y visibilidad antes de programar algo público.
- Los archivos de más de ~3 MB no se pueden subir a Google Drive desde la sesión; por eso se usa este repositorio.
- No uses material con copyright de Rockstar (tráilers, capturas, logos). Toda la gráfica es original.
- Cada dato del juego debe venir de una fuente verificada; marca en pantalla lo que sea rumor.
