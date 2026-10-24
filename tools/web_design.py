"""Design helper for The Web (Phase 34C): for each stage's needs, the feasible region of every knot, the minimum enclosing circle, and Stage III's budget.
python3 tools/web_design.py   (prints the tables the game's constants come from)"""
import numpy as np, itertools, json, sys
SRC = {"L": (51, 103), "Q": (128, 72), "C": (148, 133), "W": (96, 76)}
HOME = [(61, 17), (126, 42), (178, 44), (172, 145), (20, 193), (40, 217), (77, 217), (117, 217)]
BOX = (14, 56, 178, 244)   # where a knot may rest
X, Y = np.meshgrid(np.arange(BOX[0], BOX[2] + 1, 1.0), np.arange(BOX[1], BOX[3] + 1, 1.0))
def dist(p): return np.hypot(X - p[0], Y - p[1])
def mec(pts):
    best = None
    for k in (2, 3):
        for c in itertools.combinations(pts, k):
            if k == 2: ctr = ((c[0][0] + c[1][0]) / 2, (c[0][1] + c[1][1]) / 2); r = np.hypot(c[0][0] - c[1][0], c[0][1] - c[1][1]) / 2
            else:
                (ax, ay), (bx, by), (cx, cy) = c; d = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by))
                if abs(d) < 1e-9: continue
                ux = ((ax * ax + ay * ay) * (by - cy) + (bx * bx + by * by) * (cy - ay) + (cx * cx + cy * cy) * (ay - by)) / d
                uy = ((ax * ax + ay * ay) * (cx - bx) + (bx * bx + by * by) * (ax - cx) + (cx * cx + cy * cy) * (bx - ax)) / d
                ctr = (ux, uy); r = np.hypot(ax - ux, ay - uy)
            if all(np.hypot(p[0] - ctr[0], p[1] - ctr[1]) <= r + 1e-6 for p in pts) and (best is None or r < best[1]): best = (ctr, r)
    return best
def pts_of(src, homes): return [SRC[src]] + [HOME[h] for h in homes]
def region(src, homes, R):
    m = np.ones_like(X, bool)
    for p in pts_of(src, homes): m &= dist(p) <= R
    return m
def describe(src, homes, R):
    m = region(src, homes, R); n = int(m.sum())
    if not n: return "EMPTY"
    ys, xs = np.nonzero(m)
    return f"area {n:5d} x {X[0, xs.min()]:.0f}..{X[0, xs.max()]:.0f} y {Y[ys.min(), 0]:.0f}..{Y[ys.max(), 0]:.0f}"
def L_of(src, homes, p): return sum(np.hypot(p[0] - q[0], p[1] - q[1]) for q in pts_of(src, homes))
def Lgrid(src, homes): return sum(dist(p) for p in pts_of(src, homes))
if __name__ == "__main__":
    S = json.load(open(sys.argv[1])) if len(sys.argv) > 1 else None
