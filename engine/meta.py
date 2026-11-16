# -*- coding: utf-8 -*-
"""Genera out/PUBLICACION.md: título, descripción, capítulos, etiquetas y comentario fijado de cada video."""
import json, os, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "videos"))
import content

DISCLAIMER = ("Zona Leonida es un canal de fans. No estamos afiliados a Rockstar Games ni a Take-Two Interactive. "
              "Grand Theft Auto y GTA son marcas de sus respectivos dueños. Información verificada al 16 de noviembre de 2026; "
              "si algo cambia, lo actualizamos en el comentario fijado.")

M = {
 "01": dict(
  hook="¿A qué hora se desbloquea GTA 6 en tu país? Horarios de lanzamiento para México, Chile, Argentina, Colombia, Perú, Ecuador, Uruguay y España, el truco de Nueva Zelanda y qué hacer para jugar en el minuto cero.",
  tags="gta 6, gta 6 a que hora sale, gta 6 hora de lanzamiento, gta 6 horarios, gta 6 hora mexico, gta 6 hora chile, gta 6 hora argentina, gta 6 hora colombia, gta 6 hora españa, gta vi, gta 6 lanzamiento, gta 6 precarga, truco nueva zelanda gta 6, gta 6 ps5, gta 6 xbox",
  pin="¿Desde qué país vas a jugar? 👇 Si la hora de tu tienda cambia a último minuto, lo actualizo aquí.",
  src=["https://www.forbes.com/sites/brianmazique/2026/11/12/gta-6-unlocks-at-midnight-on-november-19-but-millions-of-americans-can-start-playing-the-night-before/",
       "https://www.vice.com/en/article/gta-6-release-date-launch-times-new-zealand-method/",
       "https://elcomercio.pe/saltar-intro/noticias/gta-6-a-que-hora-se-podra-jugar-estos-son-los-horarios-oficiales-de-lanzamiento-digital-por-pais-tdpe-noticia/"]),
 "02": dict(
  hook="GTA 6 pide hasta 212 GB libres. Te muestro cuánto ocupa en PS5, PS5 Slim, Xbox Series X y Series S, cuánto tarda la descarga según tu internet y una checklist para llegar listo al estreno.",
  tags="gta 6, gta 6 peso, gta 6 cuanto pesa, gta 6 212 gb, gta 6 gb, gta 6 precarga, gta 6 descarga, gta 6 espacio ps5, gta 6 xbox series s, gta 6 tamaño, gta vi peso, gta 6 preload, gta 6 edicion fisica",
  pin="¿Cuántos juegos tuviste que borrar para hacerle espacio? 😅 Si el parche del día uno cambia el tamaño, lo pongo aquí.",
  src=["https://www.eurogamer.es/grand-theft-auto-6-gta6-fecha-hora-lanzamiento-precarga-cuando-empezar-jugar",
       "https://gamerant.com/gta-6-preload-start-time-download-size/",
       "https://www.gamingbible.com/news/gta-6-release-time-preload-download-size-editions-385283-20261012"]),
 "03": dict(
  hook="¿GTA 6 sale en PC? Lo confirmado por Rockstar y Take-Two, cuánto tardaron GTA IV, GTA V y Red Dead Redemption 2 en llegar a PC, y por qué los “requisitos” que circulan son falsos.",
  tags="gta 6 pc, gta 6 en pc, gta 6 pc fecha, gta 6 pc cuando sale, gta 6 requisitos, gta 6 requisitos pc, gta 6 requisitos minimos, gta vi pc, gta 6 steam, gta 6 pc release, gta 6",
  pin="¿Vas a esperar la versión de PC o juegas en consola? Cuando Rockstar anuncie algo oficial, lo fijo aquí.",
  src=["https://www.tweaktown.com/news/114580/grand-theft-auto-6-pc-and-physical-disc-news-will-come-from-rockstar-confirms-take-two/index.html",
       "https://screenrant.com/gta-6-pc-version-gets-official-release-date-update/",
       "https://global.techradar.com/es-es/gaming/consoles-pc/gta-6-llegara-a-ps5-y-xbox-series-xors-pero-no-se-sabe-nada-de-su-lanzamiento-en-pc"]),
 "04": dict(
  hook="GTA 6 Estándar (US$ 79,99) vs Ultimate (US$ 99,99): qué incluye cada edición, los bonos de preventa, la mejora de US$ 20 y cuál conviene comprar.",
  tags="gta 6 precio, gta 6 ediciones, gta 6 ultimate edition, gta 6 estandar vs ultimate, gta 6 cuanto cuesta, gta 6 preventa, gta 6 precio mexico, gta 6 precio chile, gta 6 precio argentina, gta 6 vintage vice city pack, gta+, gta 6",
  pin="¿Estándar o Ultimate? Cuéntame cuál compraste y cuánto te costó en tu país 👇",
  src=["https://insider-gaming.com/gta-6-standard-edition-ultimate-edition/",
       "https://www.infobae.com/tecno/2026/06/25/gta-6-precio-en-preventa-cuanto-cuesta-el-juego-de-rockstar-en-argentina-colombia-mexico-y-espana/",
       "https://cnnespanol.cnn.com/2026/06/25/entretenimiento/precios-preordenar-grand-theft-auto-vi-orix"]),
 "05": dict(
  hook="GTA 6 apunta a 30 FPS en todas las consolas. Qué gana la PS5 Pro, cómo queda en PS5, Xbox Series X y Series S, qué pasa con PS4, Xbox One, Switch 2 y PC, y tres ajustes para que se vea mejor.",
  tags="gta 6 60 fps, gta 6 30 fps, gta 6 ps5 pro, gta 6 ps5 vs xbox, gta 6 xbox series s, gta 6 ps4, gta 6 xbox one, gta 6 rendimiento, gta 6 graficos, gta 6 switch 2, gta 6 modo rendimiento, gta 6",
  pin="¿En qué consola vas a jugar? Si Rockstar anuncia un modo a 60 FPS, lo actualizo aquí.",
  src=["https://www.gamesradar.com/games/grand-theft-auto/gta-6-wont-run-at-60fps-even-on-ps5-pro-but-sonys-console-does-have-an-exclusive-ray-traced-shadows-and-pssr/",
       "https://insider-gaming.com/gta-6-60-fps-graphics-settings/",
       "https://www.forbes.com/sites/brianmazique/2026/10/28/gta-vi-wont-run-on-last-gen-boxes---heres-what-you-actually-need/"]),
 "06": dict(
  hook="El mapa de GTA 6 explicado: las seis regiones del estado de Leonida (Cayos de Leonida, Vice City, Grassrivers, Ambrosia, Port Gellhorn y Monte Kalaga), qué tan grande es y qué actividades tiene.",
  tags="gta 6 mapa, mapa gta 6, gta 6 leonida, gta 6 vice city, gta 6 regiones, gta 6 tamaño del mapa, gta 6 mapa completo, gta 6 cayos de leonida, gta 6 grassrivers, gta 6 port gellhorn, gta 6 ambrosia, gta 6 mount kalaga, gta 6",
  pin="¿Qué región vas a explorar primero? 🌴 (El mapa del video es un esquema ilustrativo, no el mapa oficial.)",
  src=["https://www.rockstargames.com/VI", "https://dotesports.com/gta/guides/gta-6",
       "https://www.redbull.com/ke-en/gta-6-extended-look-everything-revealed"]),
 "07": dict(
  hook="La historia de GTA 6 sin spoilers: quiénes son Jason Duval y Lucía Caminos, la premisa oficial y los personajes confirmados (Cal Hampton, Brian Heder, Raúl Bautista, Boobie Ike, Dre'Quan Priest y Real Dimez).",
  tags="gta 6 historia, gta 6 personajes, gta 6 jason y lucia, jason duval, lucia caminos, gta 6 sin spoilers, gta 6 historia explicada, gta 6 protagonistas, gta 6 cal hampton, gta 6 boobie ike, gta 6 trama, gta 6",
  pin="¿Team Jason o Team Lucía? 👇 Por favor, sin spoilers en los comentarios.",
  src=["https://www.rockstargames.com/VI", "https://variety.com/2026/gaming/news/gta-6-release-details-1236846230/",
       "https://www.dlcompare.com/gaming-news/gta-6-story-characters-and-setting-everything-confirmed-so-far"]),
 "08": dict(
  hook="12 novedades de gameplay de GTA 6 vistas en el adelanto extendido: cambio entre Jason y Lucía, coberturas, sistema de enfoque, seis estrellas, conducción, destrucción, Snapmatic, actividades y más.",
  tags="gta 6 gameplay, gta 6 novedades, gta 6 nuevas mecanicas, gta 6 extended look, gta 6 detalles, gta 6 seis estrellas, gta 6 antes de jugar, gta 6 consejos, gta 6 guia, gta 6 cambios, gta 6",
  pin="¿Cuál de las 12 ya comprobaste jugando? Si alguna se siente distinta en el juego final, cuéntamelo y lo corrijo aquí.",
  src=["https://www.techradar.com/gaming/ps5/16-new-gta-6-details-we-learned-from-the-big-extended-look-gameplay-video-captured-in-game-on-a-ps5",
       "https://www.redbull.com/ke-en/gta-6-extended-look-everything-revealed", "https://box.co.uk/blog/gta-6-extended-look-breakdown"]),
 "09": dict(
  hook="¿GTA 6 tiene online de salida? No: sale como juego para un jugador. Lo confirmado, lo que pasa con GTA Online, cuánto tardó el online en GTA V y Red Dead Redemption 2, y los rumores.",
  tags="gta 6 online, gta online 2, gta 6 multijugador, gta 6 online fecha, gta 6 online cuando sale, gta 6 ps plus, gta 6 game pass, gta 6 online gratis, gta 6 modo online, gta 6",
  pin="¿Esperas el online o vienes por la historia? Cuando Rockstar anuncie el multijugador, lo fijo aquí.",
  src=["https://www.pushsquare.com/news/2026/11/psa-gta-6-does-not-have-online-multiplayer-at-launch",
       "https://gamerant.com/gta-6-online-take-two-statement-release-beyond/", "https://www.vice.com/en/article/gta-6-online-release-date/"]),
 "10": dict(
  hook="Trucos de GTA 6: qué es real y qué es falso. Por qué las listas que circulan son de GTA 5, cómo funcionaron los trucos en la saga y cómo evitar las estafas de “dinero infinito”.",
  tags="gta 6 trucos, trucos gta 6, gta 6 claves, claves gta 6, gta 6 codigos, gta 6 trucos ps5, gta 6 trucos xbox, gta 6 dinero infinito, gta 6 cheats, trucos de gta 6, gta 6 telefonos, gta 6",
  pin="📌 ACTUALIZACIÓN: aquí voy a ir poniendo los trucos REALES y probados a medida que aparezcan. ¿Encontraste alguno? Déjalo abajo.",
  src=["https://endgametools.com/en/gta-6/news/gta-6-cheats", "https://www.cheatcc.com/articles/gta-6-cheats/"]),
}

import re
FIX = ["GTA", "FPS", "PC", "PS4", "PS5", "Leonida", "Vice City", "Jason", "Rockstar", "Estados Unidos"]
def sent_case(x):
    x = x.lower(); x = re.sub(r"^([^a-záéíóúñ]*)([a-záéíóúñ])", lambda m: m.group(1) + m.group(2).upper(), x)
    x = re.sub(r"([?.:] )([a-záéíóúñ])", lambda m: m.group(1) + m.group(2).upper(), x)
    for f in FIX: x = re.sub(r"\b" + f.lower() + r"\b", f, x)
    return x

def mmss(t): return f"{int(t // 60)}:{int(t % 60):02d}"

def chapters(tl):
    out = []
    for sc in tl["scenes"]:
        name = {"title": "Intro", "outro": "Cierre"}.get(sc["type"]) or sc.get("heading") or sc.get("label") or sc.get("text") or "…"
        name = sent_case(name) if name.isupper() else name
        t = 0 if not out else sc["start"]
        if out and 8.5 <= t - out[-1][0] < 10: t = out[-1][0] + 10
        if out and t - out[-1][0] < 10: continue
        out.append((t, name.rstrip(".")))
    return out

def main():
    L = ["# Kit de publicación · Zona Leonida\n", "Copia y pega cada bloque en YouTube Studio. Archivos en `out/videos/`, miniaturas en `out/miniaturas/`, subtítulos `.srt` junto a cada video.\n"]
    for v in content.VIDEOS:
        n = v["id"][:2]; m = M[n]; tl = json.load(open(os.path.join(ROOT, "build", v["id"], "timeline.json")))
        assert len(v["title"]) <= 100, (v["id"], len(v["title"]))
        assert len(m["tags"]) <= 500, (v["id"], len(m["tags"]))
        ch = "\n".join(f"{mmss(t)} {name}" for t, name in chapters(tl))
        desc = f"{m['hook']}\n\n⏱️ Capítulos\n{ch}\n\n📚 Fuentes\n" + "\n".join(m["src"]) + f"\n\n{DISCLAIMER}\n\n#GTA6 #GTAVI #GrandTheftAutoVI"
        L += [f"\n---\n\n## {n} · {v['chapter'].title()}\n",
              f"- **Archivo:** `out/videos/{v['id']}.mp4` ({mmss(tl['duration'])})", f"- **Miniatura:** `out/miniaturas/{v['id']}.jpg`",
              f"- **Subtítulos:** `out/videos/{v['id']}.srt` (español)\n",
              "**Título**\n", "```", v["title"], "```\n", "**Descripción**\n", "```", desc, "```\n", "**Etiquetas**\n", "```", m["tags"], "```\n",
              "**Comentario fijado**\n", "```", m["pin"], "```"]
    open(os.path.join(ROOT, "out", "PUBLICACION.md"), "w").write("\n".join(L) + "\n")
    print("ok", len(content.VIDEOS))

if __name__ == "__main__":
    main()
