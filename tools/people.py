#!/usr/bin/env python3
"""Map-scale people for the developed mini-games (plan 4, A8): 16-pixel sprites drawn in the style of the game's
own SPRITES (dark outline, two-tone faces, a single-color robe with a highlight and a shadow edge), shown at 2x.
Also derives new Wanderer poses (push, sit, dive, lie) from the characters atlas."""
import numpy as np
from PIL import Image

OUT = (24, 18, 30)
EYE = (36, 22, 18)
FEET = (34, 26, 28)
SKIN = {"light": ((222, 182, 150), (182, 138, 112)), "medium": ((204, 154, 112), (164, 116, 82)),
        "tan": ((178, 126, 88), (140, 94, 64)), "brown": ((140, 96, 66), (106, 70, 48)), "dark": ((104, 68, 46), (76, 48, 34))}

HEAD = [  # h hair, S skin, s skin shadow, E eye, A outline
    ".....AAAAAA.....",
    "....AhhhhhhA....",
    "...AhhhhhhhhA...",
    "...AhhhhhhhhA...",
    "...AhSSSSSShA...",
    "...ASSSSSSSSA...",
    "...ASSESSESsA...",
    "...ASSSSSSSsA...",
    "....ASSSsssA....",
    ".....AssssA.....",
]
BODY = [  # m main, d shadow, J highlight, C collar, s skin (hands)
    "..AAJCCCCCCdAA..",
    ".AmJmmCCCCmmddA.",
    ".AmJmmmmmmmdddA.",
    ".AmJdmmmmmmmddA.",
    ".AmJdmmmmmmmddA.",
    ".AmJdmmmmmmdmdA.",
    ".AmJdmmmmmmdmdA.",
    ".AmJdmmmmmmmddA.",
    ".AsJdmmmmmmmdsA.",
    ".AmJdmmmmmmddmA.",
    ".AmdmmdmmmmdddA.",
    "..AAAAAAAAAAAA..",
    "................",
    ".....AKA.AKA....",
]
KID_BODY = [
    "..AAJCCCCCCdAA..",
    ".AmJmmmmmmmddA..",
    ".AsJdmmmmmmdsA..",
    ".AmJdmmmmmmddA..",
    "..AAAAAAAAAAA...",
    ".....AKA.AKA....",
]

def shade(c, k):
    return tuple(max(0, min(255, int(v * k))) for v in c)

def person(hair="short", hair_col=(60, 40, 30), skin="light", cloth=(90, 60, 110), collar=None, acc=None,
           kid=False, pose="stand", frame=0, tint=None):
    grid = [list(r) for r in HEAD] + [list(r) for r in (KID_BODY if kid else BODY)]
    H = len(grid)
    hc, hs = hair_col, shade(hair_col, .72)
    sk, sks = SKIN[skin]
    m, d, J = cloth, shade(cloth, .62), shade(cloth, 1.35)
    C = collar or (236, 230, 218)
    # hair styles
    if hair == "bald":
        for y in (1, 2, 3):
            for x in range(16):
                if grid[y][x] == "h": grid[y][x] = "S"
        grid[3][4] = "h"; grid[3][11] = "h"; grid[4][4] = "h"; grid[4][11] = "h"
    elif hair == "long":
        for y in (5, 6, 7):
            grid[y][4] = "h"; grid[y][11] = "h"
        grid[8][4] = "h"; grid[8][11] = "h"
    elif hair == "scarf":
        for y in range(0, 10):
            for x in range(16):
                if grid[y][x] == "h": grid[y][x] = "w"
        for y in (4, 5, 6, 7, 8):
            grid[y][4] = "w"; grid[y][11] = "w"
        grid[9] = list(".....AwwwwA.....")
    elif hair == "cap":
        grid[1] = list("....AccccccA....")
        grid[2] = list("...AccccccccA...")
        grid[3] = list("..AcccccccccccA.") if False else list("..AAccccccccAAA.")
        grid[4] = list("...AhSSSSSShA...")
    elif hair == "bun":
        grid[0] = list("......AAAA......")
        grid[1] = list(".....AhhhhA.....")
        grid[2] = list("...AAhhhhhhAA...")
    # accessories
    if acc == "cane":
        for y in range(17, H):
            if grid[y][14] in ".A":
                grid[y][14] = "n"
        grid[17][13] = "s"
    if acc == "books" and not kid:
        for y in (15, 16, 17):
            for x in (0, 1, 2):
                grid[y][x] = "b"
        grid[15][0] = "B"; grid[16][0] = "B"; grid[17][0] = "B"
    if acc == "apron" and not kid:
        for y in range(13, 20):
            for x in range(5, 11):
                if grid[y][x] in "md": grid[y][x] = "C"
    # poses
    top = 10  # first body row
    hand_y = top + (8 if not kid else 2)
    def arm(side, y0, y1):
        """a raised arm on one side, two pixels wide with an outline: the hand at row y0, the sleeve down to y1"""
        xo, xa, xb = (0, 1, 2) if side == 0 else (15, 14, 13)
        grid[y0 - 1][xa] = "A"; grid[y0 - 1][xb] = "A"
        for y in range(y0, y1 + 1):
            grid[y][xo] = "A"
            grid[y][xa] = "s" if y == y0 else ("d" if side else "m")
            grid[y][xb] = "s" if y == y0 else ("m" if side else "J")
        hx = 2 if side == 0 else 13
        if grid[hand_y][hx] == "s": grid[hand_y][hx] = "m"
    if pose == "cheer":
        y0 = 4 if frame == 0 else 6
        arm(0, y0, 10); arm(1, y0, 10)
    elif pose == "wave":
        arm(1, 3 if frame == 0 else 6, 10)
    elif pose == "thread":
        for (x, y) in ((14, hand_y - 1), (15, hand_y - 2), (15, hand_y - 3), (14, hand_y - 4), (14, hand_y - 5)):
            if 0 <= y < H: grid[y][x] = "g"
    # colors
    pal = {"A": OUT, "E": EYE, "K": FEET, "S": sk, "s": sks, "h": hc, "c": hc, "w": hc, "m": m, "d": d, "J": J, "C": C,
           "n": (120, 84, 50), "b": (150, 58, 48), "B": (230, 214, 180), "g": (245, 198, 106)}
    if hair == "scarf":
        pal["w"] = hc
    img = Image.new("RGBA", (16, H), (0, 0, 0, 0))
    px = img.load()
    for y, row in enumerate(grid):
        for x, ch in enumerate(row):
            if ch == ".": continue
            c = pal.get(ch)
            if c is None: continue
            if tint:
                c = tuple(int(v * (1 - tint[3]) + tint[i] * tint[3]) for i, v in enumerate(c))
            px[x, y] = c + (255,)
    if frame == 1 and pose == "stand":
        # a one-pixel breath: the head and shoulders settle by a pixel
        a = np.array(img)
        b = np.zeros_like(a)
        b[1:top + 3] = a[0:top + 2]
        b[top + 3:] = a[top + 3:]
        img = Image.fromarray(b, "RGBA")
    return img

def dim(img, k=.55):
    a = np.array(img).astype(np.float32)
    g = a[..., :3].mean(-1, keepdims=True)
    a[..., :3] = (a[..., :3] * .45 + g * .55) * k + np.array([18, 14, 34]) * (1 - k)
    return Image.fromarray(a.clip(0, 255).astype(np.uint8), "RGBA")

# ---- the Wanderer's new poses, from the characters atlas ----
def lean(img, amount=2):
    """shear the rows so the figure leans forward (right): the top moves right by `amount`"""
    a = np.array(img)
    h = a.shape[0]
    out = np.zeros((h, a.shape[1] + amount, 4), np.uint8)
    for y in range(h):
        sh = int(round(amount * (h - 1 - y) / (h - 1)))
        out[y, sh:sh + a.shape[1]] = a[y]
    return Image.fromarray(out, "RGBA")

def sit(img):
    a = np.array(img)
    h = a.shape[0]
    # drop three body rows and the feet, then add feet pointing forward
    keep = [y for y in range(h) if y not in (14, 16, 18, 22, 23)]
    b = a[keep]
    out = np.zeros((h, a.shape[1] + 3, 4), np.uint8)
    out[h - len(keep):, :a.shape[1]] = b
    feet = np.array([34, 26, 28, 255], np.uint8)
    for x in range(a.shape[1] - 2, a.shape[1] + 3):
        out[h - 1, x] = feet
    out[h - 2, a.shape[1] + 1] = feet
    return Image.fromarray(out, "RGBA")

def rot90(img, cw=True):
    return img.transpose(Image.Transpose.ROTATE_270 if cw else Image.Transpose.ROTATE_90)
