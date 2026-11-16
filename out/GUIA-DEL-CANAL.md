# Zona Leonida · canal de GTA 6 listo para el lanzamiento

Preparado el 16 de noviembre de 2026. GTA 6 sale el **jueves 19 de noviembre de 2026** en PS5 y Xbox Series X|S.

## 1. Qué hay en este kit

| Carpeta | Contenido |
|---|---|
| `out/videos/` | 10 videos 1080p / 30 fps (`.mp4`) + subtítulos en español (`.srt`) |
| `out/miniaturas/` | 10 miniaturas 1280×720 (`.jpg`) |
| `out/canal/` | Avatar 800×800 y banner 2560×1440 |
| `out/PUBLICACION.md` | Título, descripción con capítulos y fuentes, etiquetas y comentario fijado de cada video |
| `out/muestras-de-voz/` | La misma frase con las 3 voces disponibles, para elegir |
| `videos/content.py` | Los 10 guiones (editable) |
| `engine/` | El motor que genera voz, animaciones, música y montaje |

## 2. Qué busca la gente (y qué va a buscar)

La investigación se hizo el 16 de noviembre con búsquedas en medios y rastreadores de tendencias.

- El interés de búsqueda de "GTA 6" tocó su máximo (100 en Google Trends) con el anuncio de la preventa en junio, y volvió a dispararse con el adelanto extendido del 27 de agosto. GTA 6 ya fue el 7.º juego más buscado de 2025 sin haber salido.
- Las preguntas que más se repiten en titulares y guías en español, a tres días del estreno, son prácticas: **a qué hora sale**, **cuánto pesa / precarga**, **precio y ediciones**, **PC y requisitos**, **60 FPS / PS5 Pro / PS4**, **online**, **mapa**, **personajes e historia** y **trucos**.
- "Trucos GTA 6" ya tiene decenas de páginas posicionadas aunque no existe ningún truco confirmado: es la búsqueda que más va a crecer desde el jueves.

Cada video responde una de esas búsquedas:

| # | Búsqueda objetivo | Video | Vigencia |
|---|---|---|---|
| 01 | gta 6 a qué hora sale | Horarios por país | Caduca el jueves: subir primero |
| 02 | gta 6 cuánto pesa / precarga | 212 GB y cómo preparar la consola | Semana de lanzamiento |
| 03 | gta 6 pc / requisitos | Cuándo sale en PC | Meses |
| 04 | gta 6 precio / ultimate | Estándar vs Ultimate | Semanas |
| 05 | gta 6 60 fps / ps5 pro / ps4 | 30 FPS y consolas | Meses |
| 06 | gta 6 mapa | Las 6 regiones de Leonida | Meses |
| 07 | gta 6 historia / personajes | Jason y Lucía sin spoilers | Semanas |
| 08 | gta 6 gameplay / novedades | 12 novedades | Semanas |
| 09 | gta 6 online | ¿Hay multijugador? | Meses |
| 10 | trucos gta 6 / claves | ¿Reales o falsos? | Hasta que salgan los reales |

## 3. Orden de subida recomendado

GTA 6 se desbloquea a la medianoche local del jueves. Los videos 01 y 02 pierden valor apenas la gente ya está jugando, así que conviene que sean los primeros en salir.

1. **01 Horarios** y **02 Peso**: lo antes posible. Si puedes, el miércoles; si no, el jueves a primera hora.
2. **10 Trucos**, **03 PC** y **09 Online**: jueves en la mañana. Son las dudas del día uno.
3. **05 Rendimiento** y **08 Novedades**: jueves en la tarde.
4. **06 Mapa**, **07 Historia** y **04 Ediciones**: jueves en la noche o viernes.

Puedes subir los 10 el jueves y programar la hora de publicación de cada uno desde YouTube Studio.

## 4. Configuración del canal

- **Nombre:** Zona Leonida
- **Identificador sugerido:** @zonaleonida (revisa que esté libre)
- **Descripción:**

```
Todo GTA 6 en español: horarios, guías, mapa, personajes, trucos confirmados y noticias, explicado rápido y sin humo.
Videos nuevos cada semana desde el lanzamiento.

Zona Leonida es un canal de fans. No estamos afiliados a Rockstar Games ni a Take-Two Interactive.
```

- **Palabras clave del canal:** gta 6, gta vi, grand theft auto 6, gta 6 español, gta 6 guía, gta 6 trucos, gta 6 mapa, gta 6 noticias, vice city, leonida
- **País e idioma:** el tuyo / español
- Crea una lista de reproducción "GTA 6: todo lo que necesitas saber" con los 10 videos en el orden 01 → 10.

## 5. Revisa esto antes de publicar

**Escucha al menos un video completo.** La narración es una voz sintética de código abierto (Kokoro, licencia Apache 2.0) con acento latino neutro. No pude escuchar el audio desde este entorno: verifiqué la fonética palabra por palabra, los niveles (−14 LUFS) y la sincronía, pero no cómo suena. Si alguna palabra en inglés suena rara, se corrige en la tabla `SAY` de `engine/tts.py` y se vuelve a generar.

**Datos que pueden cambiar entre hoy y el jueves** (vuelve a mirarlos el miércoles):

| Video | Dato | Estado al 16 nov |
|---|---|---|
| 01 | Hora de desbloqueo | Medianoche local según las fichas de las tiendas; algunos medios en español publicaron una hora única que no coincide |
| 02 | Tamaño | Rockstar: hasta 212 GB. Tiendas: ~210 GB PS5, ~225 GB Xbox. El parche del día uno puede moverlo |
| 05 | 30 FPS | Confirmado por Rockstar el 10 nov. La entrevista de "60 FPS sin autos" no está verificada (el video lo dice) |
| 06 | Tamaño del mapa | Sin cifra oficial; "el doble de GTA 5" viene de primeras impresiones de la prensa |
| 09 | Online | Sin anuncio. Si Rockstar anuncia algo, este video necesita un comentario fijado |
| 10 | Trucos | Ninguno confirmado antes del lanzamiento. Van a aparecer en horas: actualiza el comentario fijado |

Las reseñas se publican, según reportes no confirmados, el 18 de noviembre. Ningún video habla de notas, así que no los afecta.

## 6. Limitaciones que debes conocer

- **No hay imágenes ni gameplay del juego.** Todo lo visual es gráfica animada original (fondos, mapas esquemáticos, tablas, fichas). No usé tráilers, capturas ni arte de Rockstar porque tienen copyright y no tengo forma de licenciarlos. El público de juegos espera ver el juego: los videos funcionan como explicativos, pero rinden más si les superpones gameplay tuyo cuando lo tengas.
- **El mapa del video 06 es un esquema ilustrativo**, no el mapa oficial (está rotulado así en pantalla).
- **Monetización:** YouTube limita el contenido "producido en masa" con voz sintética y plantillas. Para que el canal pueda monetizar a futuro, conviene sumar tu propia voz o comentario y gameplay propio en los siguientes videos.
- **La música y los efectos son sintetizados por código**, sin samples de terceros, así que no hay reclamos de copyright posibles por el audio.

## 7. Segunda ola: lo que se va a buscar después del jueves

Estos temas no se pueden hacer bien antes de jugar. Son los que más van a crecer del viernes en adelante:

1. Trucos y claves reales, probados (actualiza también el video 10)
2. Cómo ganar dinero rápido al inicio
3. Los mejores autos y dónde encontrarlos
4. Primeras 10 cosas que hacer / errores de principiante
5. Ubicación de armas, chalecos y vehículos especiales
6. Easter eggs y referencias a GTA anteriores
7. Mapa real con puntos de interés
8. Mejores ajustes de cámara, control y HDR
9. Guía de misiones y golpes (con aviso de spoilers)
10. Final explicado (con aviso de spoilers, no antes de una semana)

El motor ya está armado: se escribe el guion nuevo en `videos/content.py` y se genera el video.

## 8. Cómo regenerar o editar

```bash
python3 engine/build.py 03
```

Eso vuelve a generar solo el video 03 (voz, música, animación y montaje, unos 2 minutos). Sin número, genera los 10.

```bash
VOICE=ef_dora python3 engine/build.py
```

Cambia la voz (`em_alex` masculina por defecto, `em_santa` masculina, `ef_dora` femenina).

```bash
node engine/render.js thumb build/thumbs.json build/thumbs_raw
```

Regenera las miniaturas.

## 9. Fuentes de la investigación

- Fecha y estado del lanzamiento: [Variety](https://variety.com/2026/gaming/news/gta-6-release-details-1236846230/), [Vice](https://www.vice.com/en/article/gta-6-release-date-launch-times-new-zealand-method/)
- Horarios: [Forbes](https://www.forbes.com/sites/brianmazique/2026/11/12/gta-6-unlocks-at-midnight-on-november-19-but-millions-of-americans-can-start-playing-the-night-before/), [El Comercio](https://elcomercio.pe/saltar-intro/noticias/gta-6-a-que-hora-se-podra-jugar-estos-son-los-horarios-oficiales-de-lanzamiento-digital-por-pais-tdpe-noticia/), [3DJuegos](https://www.3djuegos.com/juegos/grand-theft-auto-vi/guias-y-trucos/a-que-hora-se-podra-jugar-gta-6-estos-todos-horarios-clasificados-paises)
- Peso y precarga: [Eurogamer.es](https://www.eurogamer.es/grand-theft-auto-6-gta6-fecha-hora-lanzamiento-precarga-cuando-empezar-jugar), [GameRant](https://gamerant.com/gta-6-preload-start-time-download-size/), [GamingBible](https://www.gamingbible.com/news/gta-6-release-time-preload-download-size-editions-385283-20261012)
- Precio y ediciones: [Insider Gaming](https://insider-gaming.com/gta-6-standard-edition-ultimate-edition/), [Infobae](https://www.infobae.com/tecno/2026/06/25/gta-6-precio-en-preventa-cuanto-cuesta-el-juego-de-rockstar-en-argentina-colombia-mexico-y-espana/), [CNN en Español](https://cnnespanol.cnn.com/2026/06/25/entretenimiento/precios-preordenar-grand-theft-auto-vi-orix)
- PC: [TweakTown](https://www.tweaktown.com/news/114580/grand-theft-auto-6-pc-and-physical-disc-news-will-come-from-rockstar-confirms-take-two/index.html), [ScreenRant](https://screenrant.com/gta-6-pc-version-gets-official-release-date-update/), [TechRadar](https://global.techradar.com/es-es/gaming/consoles-pc/gta-6-llegara-a-ps5-y-xbox-series-xors-pero-no-se-sabe-nada-de-su-lanzamiento-en-pc)
- Rendimiento y plataformas: [GamesRadar](https://www.gamesradar.com/games/grand-theft-auto/gta-6-wont-run-at-60fps-even-on-ps5-pro-but-sonys-console-does-have-an-exclusive-ray-traced-shadows-and-pssr/), [Insider Gaming](https://insider-gaming.com/gta-6-60-fps-graphics-settings/), [Notebookcheck](https://www.notebookcheck.net/Rockstar-says-GTA-6-PS5-Pro-build-ran-at-60-fps-with-major-performance-compromises.1449081.0.html), [Forbes](https://www.forbes.com/sites/brianmazique/2026/10/28/gta-vi-wont-run-on-last-gen-boxes---heres-what-you-actually-need/)
- Mapa, historia y personajes: [Dot Esports](https://dotesports.com/gta/guides/gta-6), [DLCompare](https://www.dlcompare.com/gaming-news/gta-6-story-characters-and-setting-everything-confirmed-so-far)
- Adelanto extendido: [TechRadar](https://www.techradar.com/gaming/ps5/16-new-gta-6-details-we-learned-from-the-big-extended-look-gameplay-video-captured-in-game-on-a-ps5), [Red Bull](https://www.redbull.com/ke-en/gta-6-extended-look-everything-revealed), [Box](https://box.co.uk/blog/gta-6-extended-look-breakdown)
- Online: [Push Square](https://www.pushsquare.com/news/2026/11/psa-gta-6-does-not-have-online-multiplayer-at-launch), [GameRant](https://gamerant.com/gta-6-online-take-two-statement-release-beyond/), [Vice](https://www.vice.com/en/article/gta-6-online-release-date/)
- Trucos: [EndgameTools](https://endgametools.com/en/gta-6/news/gta-6-cheats), [CheatCC](https://www.cheatcc.com/articles/gta-6-cheats/)
- Tendencias de búsqueda: [The Crypto Times](https://www.cryptotimes.io/2026/06/23/gta-6-beats-crypto-in-google-trends-what-is-happening-right-now/), [iPhone in Canada](https://www.iphoneincanada.ca/2026/09/08/gta-vi-most-trending-game-search/), [LibertyCity](https://libertycity.net/news/gta-6/9499-google-reveals-top-10-most-searched.html), [TheGamer](https://www.thegamer.com/people-are-really-worried-about-falling-in-love-with-gta-6s-lucia/)
- Preventas: [Benzinga](https://www.benzinga.com/markets/prediction-markets/26/11/63248840/gta-6-preorders), [TalkEsport](https://www.talkesport.com/gta-6/gta-6-pre-orders-1-18-billion-sensor-tower-console-prices/)
