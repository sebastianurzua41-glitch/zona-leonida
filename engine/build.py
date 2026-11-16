# -*- coding: utf-8 -*-
"""Orquesta todo: voz → música/efectos → render de cuadros → montaje final.
Uso: python3 engine/build.py [prefijos de id ...]   (sin argumentos = los 10)"""
import json, math, os, subprocess, sys, time
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "engine")); sys.path.insert(0, os.path.join(ROOT, "videos"))
import content, tts, music as mus, soundfile as sf
FPS, WORKERS = 30, 4
run = lambda *a: subprocess.run(a, check=True)

def icons():
    ic = {"check", "bell-ring", "play", "tree-palm"}
    def walk(o):
        if isinstance(o, dict):
            for k, v in o.items():
                if k == "icon": ic.add(v)
                else: walk(v)
        elif isinstance(o, list):
            for x in o: walk(x)
    walk(content.VIDEOS); json.dump(sorted(ic), open(os.path.join(ROOT, "build/icons.json"), "w"))

def build(v):
    t0 = time.time(); d = os.path.join(ROOT, "build", v["id"]); out = os.path.join(ROOT, "out", "videos"); os.makedirs(out, exist_ok=True)
    tl = tts.build(v)
    sf.write(f"{d}/music.wav", mus.music(tl["duration"], tl["music"]), mus.SR); sf.write(f"{d}/sfx.wav", mus.sfx(tl), mus.SR)
    total = math.ceil(tl["duration"] * FPS); step = math.ceil(total / WORKERS); procs = []; parts = []
    for k in range(WORKERS):
        f0, f1 = k * step, min(total, (k + 1) * step)
        if f0 >= f1: continue
        p = f"{d}/part{k}.mp4"; parts.append(p)
        procs.append(subprocess.Popen(["node", os.path.join(ROOT, "engine/render.js"), "video", f"{d}/timeline.json", p, str(f0), str(f1)]))
    for p in procs:
        if p.wait() != 0: raise SystemExit("falló el render de " + v["id"])
    open(f"{d}/parts.txt", "w").write("".join(f"file '{p}'\n" for p in parts))
    run("ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", f"{d}/parts.txt", "-c", "copy", f"{d}/video.mp4")
    fc = ("[1:a]aresample=48000,highpass=f=75,acompressor=threshold=-21dB:ratio=3:attack=8:release=140:makeup=5dB,pan=stereo|c0=c0|c1=c0,asplit[v1][v2];"
          "[2:a]aresample=48000,volume=0.15[m];[m][v2]sidechaincompress=threshold=0.02:ratio=5:attack=15:release=450[md];"
          "[3:a]aresample=48000,volume=0.6[s];[v1][md][s]amix=inputs=3:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11,alimiter=limit=0.89[a]")
    final = f"{out}/{v['id']}.mp4"
    run("ffmpeg", "-y", "-loglevel", "error", "-i", f"{d}/video.mp4", "-i", f"{d}/voice.wav", "-i", f"{d}/music.wav", "-i", f"{d}/sfx.wav",
        "-filter_complex", fc, "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-shortest", "-movflags", "+faststart", final)
    subprocess.run(["cp", f"{d}/subs.srt", f"{out}/{v['id']}.srt"])
    for p in parts: os.remove(p)
    print(f"OK {v['id']}  {tl['duration']:.1f}s  {total} cuadros  en {time.time() - t0:.0f}s", flush=True)

if __name__ == "__main__":
    icons(); ids = sys.argv[1:]
    for v in content.VIDEOS:
        if ids and not any(v["id"].startswith(i) for i in ids): continue
        build(v)
