# -*- coding: utf-8 -*-
"""Música de fondo y efectos 100% sintetizados (originales, sin samples)."""
import json, os, sys
import numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt

SR = 44100
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def bq(kind, f, order=2):
    return butter(order, np.array(f) / (SR / 2), btype=kind, output="sos")

def hz(m): return 440.0 * 2 ** ((m - 69) / 12)

def saw(f, n, ph=0.0):
    t = np.arange(n) / SR; out = np.zeros(n); K = max(1, min(24, int(6000 / f)))
    for k in range(1, K + 1): out += np.sin(2 * np.pi * k * f * t + ph * k) / k
    return out * 0.6

PROGS = [  # (semitonos desde la tónica, menor?)
    [(0, 1), (8, 0), (3, 0), (10, 0)], [(0, 1), (10, 0), (8, 0), (10, 0)], [(8, 0), (10, 0), (0, 1), (0, 1)],
    [(0, 1), (5, 1), (8, 0), (7, 0)], [(0, 1), (3, 0), (10, 0), (8, 0)],
]
VARIANTS = [(96, 57, 0), (100, 55, 1), (92, 59, 2), (104, 52, 4), (98, 54, 3), (94, 57, 4), (102, 50, 0), (96, 53, 1), (100, 56, 2), (92, 52, 3)]

def music(dur, variant):
    bpm, root, pi = VARIANTS[variant % len(VARIANTS)]; prog = PROGS[pi]
    beat = 60 / bpm; bar = 4 * beat; nb = int(np.ceil((dur + 1) / bar)); N = int(nb * bar * SR) + SR
    rng = np.random.default_rng(100 + variant)
    L = np.zeros(N); R = np.zeros(N); duck = np.ones(N)
    bn = int(bar * SR); kick = np.zeros(N); perc = np.zeros(N)
    lp_pad = bq("low", 1100); lp_bass = bq("low", 320); hp_hat = bq("high", 7000); bp_sn = bq("band", [1200, 4500])
    for b in range(nb):
        off, mn = prog[b % 4]; r = root + off; third = 3 if mn else 4
        full = 2 <= b < nb - 2; s0 = b * bn
        # pad
        env = np.ones(bn); a = int(.35 * SR); env[:a] = np.linspace(0, 1, a); env[-a:] = np.linspace(1, 0, a)
        for i, m in enumerate([r, r + third, r + 7, r + 12]):
            f = hz(m)
            l = saw(f * 0.997, bn, i) + saw(f * 1.004, bn, i + 2); rr = saw(f * 1.003, bn, i + 1) + saw(f * 0.996, bn, i + 3)
            L[s0:s0 + bn] += sosfilt(lp_pad, l) * env * 0.11; R[s0:s0 + bn] += sosfilt(lp_pad, rr) * env * 0.11
        # bajo en corcheas
        if full or b >= 1:
            for e in range(8):
                n = int(beat / 2 * SR); t = np.arange(n) / SR; f = hz(r - 24 + (12 if e % 4 == 3 else 0))
                x = sosfilt(lp_bass, saw(f, n)) * np.exp(-t * 7) * (0.42 if full else 0.25)
                p = s0 + int(e * beat / 2 * SR); L[p:p + n] += x; R[p:p + n] += x
        # arpegio en semicorcheas con eco
        tones = [r + 12, r + 12 + third, r + 19, r + 24, r + 19, r + 12 + third]
        for e in range(16):
            n = int(beat * 0.9 * SR); t = np.arange(n) / SR; f = hz(tones[(e + b) % len(tones)])
            x = (np.sin(2 * np.pi * f * t) + 0.25 * np.sin(2 * np.pi * 2 * f * t)) * np.exp(-t * 9) * 0.07
            p = s0 + int(e * beat / 4 * SR); pan = 0.5 + 0.35 * np.sin(e * 1.3)
            for k, g in enumerate([1, .45, .22]):
                q = p + int(k * beat * .75 * SR)
                if q + n < N:
                    pp = pan if k % 2 == 0 else 1 - pan
                    L[q:q + n] += x * g * (1 - pp); R[q:q + n] += x * g * pp
        # batería
        if full:
            for q in range(4):
                p = s0 + int(q * beat * SR); n = int(.3 * SR); t = np.arange(n) / SR
                ph = 2 * np.pi * np.cumsum(46 + 115 * np.exp(-t * 34)) / SR
                kick[p:p + n] += np.sin(ph) * np.exp(-t * 10) * 0.6
                dn = int(.28 * SR); duck[p:p + dn] = np.minimum(duck[p:p + dn], 1 - 0.42 * np.exp(-np.arange(dn) / SR * 9))
                if q % 2 == 1:
                    n2 = int(.2 * SR); t2 = np.arange(n2) / SR
                    perc[p:p + n2] += sosfilt(bp_sn, rng.standard_normal(n2)) * np.exp(-t2 * 20) * 0.16
            for e in range(8):
                p = s0 + int((e + .5) * beat / 2 * SR); n3 = int(.06 * SR); t3 = np.arange(n3) / SR
                perc[p:p + n3] += sosfilt(hp_hat, rng.standard_normal(n3)) * np.exp(-t3 * 70) * 0.07
    L = L * duck + kick + perc; R = R * duck + kick + perc
    x = np.stack([L, R], 1)[: int((dur + .5) * SR)]
    fi = int(.6 * SR); fo = int(2.5 * SR); x[:fi] *= np.linspace(0, 1, fi)[:, None]; x[-fo:] *= np.linspace(1, 0, fo)[:, None]
    x = np.tanh(x * 1.2); x *= 0.7 / np.abs(x).max()
    return x.astype(np.float32)

def whoosh(rng):
    n = int(.66 * SR); nz = rng.standard_normal(n); t = np.linspace(0, 1, n)
    bands = [sosfilt(bq("band", b), nz) for b in ([300, 900], [900, 2600], [2600, 7500])]
    w = [np.clip(1 - np.abs(t - c) * 3.2, 0, 1) for c in (.25, .5, .75)]
    x = sum(b * ww for b, ww in zip(bands, w)) * np.sin(np.pi * t) ** 2
    return x / np.abs(x).max()

def pop():
    n = int(.07 * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * np.cumsum(820 + 5200 * t) / SR) * np.exp(-t * 55)

def thud(rng):
    n = int(.22 * SR); t = np.arange(n) / SR
    x = np.sin(2 * np.pi * np.cumsum(60 + 120 * np.exp(-t * 40)) / SR) * np.exp(-t * 16)
    c = int(.012 * SR); x[:c] += sosfilt(bq("high", 2500), rng.standard_normal(c)) * 0.35
    return x

def events(tl):
    wh, pp, th = [], [], []
    for i, sc in enumerate(tl["scenes"]):
        S = sc["sent"]; st = lambda at: max(sc["start"] + .38, S[min(at or 0, len(S) - 1)]["s"] - .14)
        if i: wh.append(sc["start"] - .26)
        else: th.append(.42)
        ty = sc["type"]
        if ty in ("list",): pp += [st(it["at"]) for it in sc["items"]]
        if ty in ("table", "bars"): pp += [st(r["at"]) for r in sc["rows"]]
        if ty == "cards": pp += [st(c["at"]) for c in sc["cards"]]
        if ty == "map": pp += [st(r["at"]) for r in sc["regions"]]
        if ty == "stat":
            th.append(sc["start"] + .52); pp += [st(c["at"]) for c in sc.get("chips", [])]
        if ty in ("quote", "outro"): th.append(sc["start"] + .6)
        if ty == "compare": pp += [st(sc["left"]["at"]), st(sc["right"]["at"])]
        if ty == "verdict":
            for r in sc["rows"]:
                s = S[r["at"]]; pp.append(st(r["at"])); th.append(min(s["e"] - .35, s["s"] + (s["e"] - s["s"]) * .6))
    return wh, sorted(set(round(x, 2) for x in pp)), th

def sfx(tl):
    rng = np.random.default_rng(7); N = int((tl["duration"] + 1) * SR); x = np.zeros(N)
    wh, pp, th = events(tl); W = whoosh(rng); P = pop(); T = thud(rng)
    def put(s, t, g):
        p = max(0, int(t * SR)); n = min(len(s), N - p)
        if n > 0: x[p:p + n] += s[:n] * g
    for t in wh: put(W, t, .30)
    for t in pp: put(P, t, .10)
    for t in th: put(T, t, .42)
    return np.stack([x, x], 1).astype(np.float32)

if __name__ == "__main__":
    for d in sorted(os.listdir(os.path.join(ROOT, "build"))):
        p = os.path.join(ROOT, "build", d, "timeline.json")
        if not os.path.exists(p) or (len(sys.argv) > 1 and not any(d.startswith(a) for a in sys.argv[1:])): continue
        tl = json.load(open(p))
        sf.write(os.path.join(ROOT, "build", d, "music.wav"), music(tl["duration"], tl["music"]), SR)
        sf.write(os.path.join(ROOT, "build", d, "sfx.wav"), sfx(tl), SR)
        print("audio", d)
