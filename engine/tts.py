# -*- coding: utf-8 -*-
"""Genera la voz (Kokoro, Apache-2.0) y la línea de tiempo de un video."""
import hashlib, json, os, re, sys
import numpy as np, soundfile as sf

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "videos"))
import content  # noqa

VOICE = os.environ.get("VOICE", "em_alex")
SPEED = float(os.environ.get("SPEED", "1.04"))
SR = 24000
LANG = "es-latam"  # fonemas de español + seseo y yeísmo (acento latinoamericano neutro)
CACHE = os.path.join(ROOT, "build", "tts_cache")
os.makedirs(CACHE, exist_ok=True)

# Pronunciación: el subtítulo muestra la clave, la voz dice el valor.
SAY = [
    ("GTA Online", "ge te a onláin"), ("GTA Plus", "ge te a plus"), ("GTA+", "ge te a plus"),
    ("GTA 6", "ge te a seis"), ("GTA 5", "ge te a cinco"), ("GTA 4", "ge te a cuatro"), ("GTA 3", "ge te a tres"),
    ("GTA", "ge te a"),
    ("PS5 Pro Enhanced", "pe ese cinco pro enjánst"), ("PS5", "pe ese cinco"), ("PS4", "pe ese cuatro"),
    ("PS Plus", "pe ese plus"), ("PlayStation Store", "pleistéishon estór"), ("PlayStation", "pleistéishon"),
    ("Xbox Cloud Gaming", "écsbox cláud guéimin"), ("Xbox Series X", "écsbox síries équis"),
    ("Xbox Series S", "écsbox síries ese"), ("Xbox Series", "écsbox síries"), ("Series S", "síries ese"),
    ("Xbox One", "écsbox uán"), ("Xbox", "écsbox"), ("Game Pass", "guéim pas"), ("Switch 2", "suích dos"),
    ("Rockstar", "rócstar"), ("Take-Two", "téic tu"), ("Strauss Zelnick", "Estráus Zélnic"),
    ("Vintage Vice City", "víntash váis síti"), ("Vice City", "váis síti"), ("Liberty City", "líberti síti"),
    ("Jason Duval", "Yéison Duvál"), ("Jason", "Yéison"),
    ("Grassrivers", "Grasrívers"), ("Port Gellhorn", "Port Guélorn"),
    ("Cal Hampton", "Cal Jámpton"), ("Brian Heder", "Bráian Jéder"), ("Boobie Ike", "Bubi Áic"), ("Boobie", "Bubi"),
    ("Dre'Quan Priest", "Dricuán Prist"), ("Only Raw Records", "Ónli Ro Récords"), ("Real Dimez", "Ríal Dáims"),
    ("Bae-Luxe", "Bei Lacs"), ("Roxy", "Rócsi"),
    ("Ultimate", "Áltimet"), ("Grotti Cheetah", "Gróti Chíta"),
    ("Red Dead Redemption 2", "Red Ded Ridémshon dos"), ("Red Dead Online", "Red Ded onláin"),
    ("Snapmatic", "Esnapmátic"), ("PSSR", "pe ese ese erre"), ("HDR", "hache de erre"),
    ("Bonnie y Clyde", "Bóni y Cláid"), ("motocross", "motocrós"), ("kayaks", "kayács"), ("Kayak", "Kayác"),
    ("PC", "pe ce"), ("2026", "dos mil veintiséis"), ("2027", "dos mil veintisiete"), ("2028", "dos mil veintiocho"),
]

_k = None
def kokoro():
    global _k
    if _k is None:
        from kokoro_onnx import Kokoro
        _k = Kokoro(os.path.join(ROOT, "models/kokoro-v1.0.onnx"), os.path.join(ROOT, "models/voices-v1.0.bin"))
    return _k

def split_markup(s):
    shown = re.sub(r"\{([^|}]*)\|([^}]*)\}", r"\1", s)
    spoken = re.sub(r"\{([^|}]*)\|([^}]*)\}", r"\2", s)
    for a, b in SAY:
        spoken = re.sub(r"(?<![\wáéíóúñ])" + re.escape(a) + r"(?![\wáéíóúñ])", b, spoken)
    return shown, spoken

def trim(x, thr=0.012, pad=0.03):
    idx = np.where(np.abs(x) > thr)[0]
    if len(idx) == 0: return x
    a = max(0, idx[0] - int(pad * SR)); b = min(len(x), idx[-1] + int(pad * SR))
    return x[a:b]

def synth(spoken):
    key = hashlib.sha1(f"{VOICE}|{SPEED}|{LANG}|{spoken}".encode()).hexdigest()[:16]
    p = os.path.join(CACHE, key + ".wav")
    if os.path.exists(p):
        x, _ = sf.read(p, dtype="float32"); return x
    ph = kokoro().tokenizer.phonemize(spoken, "es").replace("θ", "s").replace("ʎ", "ʝ")
    x, sr = kokoro().create(ph, voice=VOICE, speed=SPEED, is_phonemes=True)
    assert sr == SR
    x = trim(np.asarray(x, dtype=np.float32))
    f = int(0.012 * SR); x[:f] *= np.linspace(0, 1, f); x[-f:] *= np.linspace(1, 0, f)
    sf.write(p, x, SR); return x

def chunks(text, maxc=46):
    """Parte una frase en trozos cortos para subtítulos."""
    words = text.split(); out = []; cur = ""
    for w in words:
        if cur and (len(cur) + 1 + len(w) > maxc or (cur[-1] in ",.:;?!" and len(cur) > maxc * 0.55)):
            out.append(cur); cur = w
        else:
            cur = (cur + " " + w).strip()
    if cur: out.append(cur)
    if len(out) > 1 and len(out[-1]) < 12:  # evita viudas
        out[-2] += " " + out[-1]; out.pop()
    return out

LEAD, GAP, TAIL = 0.50, 0.26, 0.45

def build(v):
    out_dir = os.path.join(ROOT, "build", v["id"]); os.makedirs(out_dir, exist_ok=True)
    t = 0.0; audio = []; caps = []
    def silence(d): audio.append(np.zeros(int(round(d * SR)), dtype=np.float32))
    cursor = lambda: sum(len(a) for a in audio) / SR
    for si, sc in enumerate(v["scenes"]):
        sc["start"] = cursor()
        silence(0.9 if si == 0 else LEAD)
        sc["sent"] = []
        for i, raw in enumerate(sc["vo"]):
            shown, spoken = split_markup(raw)
            x = synth(spoken)
            s0 = cursor(); audio.append(x); s1 = cursor()
            sc["sent"].append({"s": round(s0, 3), "e": round(s1, 3), "text": shown})
            parts = chunks(shown); tot = sum(len(p) for p in parts); c0 = s0
            for p in parts:
                d = (s1 - s0) * len(p) / tot
                caps.append({"s": round(c0, 3), "e": round(c0 + d, 3), "text": p}); c0 += d
            if i < len(sc["vo"]) - 1: silence(GAP)
        silence(1.6 if sc["type"] == "outro" else TAIL)
        sc["end"] = cursor()
    voice = np.concatenate(audio)
    sf.write(os.path.join(out_dir, "voice.wav"), voice, SR)
    tl = {"id": v["id"], "title": v["title"], "chapter": v["chapter"], "channel": content.CHANNEL,
          "num": v["id"][:2], "duration": round(len(voice) / SR, 3), "scenes": v["scenes"], "caps": caps,
          "music": v.get("music", 0)}
    json.dump(tl, open(os.path.join(out_dir, "timeline.json"), "w"), ensure_ascii=False, indent=1)
    # SRT
    def ts(x):
        h = int(x // 3600); m = int(x % 3600 // 60); s = x % 60
        return f"{h:02d}:{m:02d}:{int(s):02d},{int(round((s % 1) * 1000)) % 1000:03d}"
    with open(os.path.join(out_dir, "subs.srt"), "w") as f:
        for i, c in enumerate(caps, 1):
            f.write(f"{i}\n{ts(c['s'])} --> {ts(c['e'])}\n{c['text']}\n\n")
    return tl

if __name__ == "__main__":
    ids = sys.argv[1:]
    for v in content.VIDEOS:
        if ids and not any(v["id"].startswith(i) for i in ids): continue
        tl = build(v)
        words = sum(len(split_markup(s)[0].split()) for sc in v["scenes"] for s in sc["vo"])
        print(f"{v['id']:28s} {tl['duration']:6.1f}s  {len(v['scenes'])} escenas  {words} palabras")
