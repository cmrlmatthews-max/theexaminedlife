"""Phase 40A: brief positions (cyan) and traced painted features (orange) on each Level I backdrop, in units (192 x 320)."""
import json
from PIL import Image, ImageDraw
P = "art/proc40"; U = lambda v: v * 2
CY, OR, GR = (90, 230, 255, 255), (255, 170, 60, 255), (140, 255, 140, 255)
def ov(name, bg, fn):
    im = Image.open(f"{P}/bg/{bg}.png").convert("RGBA"); d = ImageDraw.Draw(im); fn(d); im.save(f"{P}/geo/{name}.png")
def dot(d, x, y, c, t=None, r=4):
    d.ellipse((U(x) - r, U(y) - r, U(x) + r, U(y) + r), outline=c, width=2)
    if t: d.text((U(x) + r + 2, U(y) - 6), t, fill=c)
def box(d, b, c, t=None):
    d.rectangle((U(b[0]), U(b[1]), U(b[2]), U(b[3])), outline=c, width=2)
    if t: d.text((U(b[0]) + 3, U(b[1]) + 2), t, fill=c)
def ell(d, cx, cy, rx, ry, c): d.ellipse((U(cx - rx), U(cy - ry), U(cx + rx), U(cy + ry)), outline=c, width=2)
GEO = {
 "kierkegaard_s": {"door": [96, 70], "doorBox": [88, 62, 104, 78], "doorWindow": [96, 56], "bell": [166, 36], "street": [36, 80, 156, 320], "streetTopBox": [36, 80, 156, 90],
                   "houseEdges": {"left": "x 0-36 (houses jut to x 40 at y 120-210)", "right": "x 156-192"}, "lamps": [[38, 132], [150, 132], [40, 218], [150, 218]],
                   "alleys": "none painted; draw the brief alleys as dark openings in the house fronts", "darkBandFrom": 270},
 "nietzsche_s": {"horizonY": 96, "plateau": [8, 165, 190, 250], "plateauCenter": [100, 208], "boulder": [24, 170], "suggestTrack": {"c": [96, 208], "rx": 64, "ry": 30}, "darkBandFrom": 252},
 "camus_s": {"horizonY": 160, "sun": [149, 145], "ruins": [0, 112, 92, 170], "sand": [0, 175, 192, 265], "skyOpen": [0, 0, 192, 150], "darkBandFrom": 265},
 "sartre_s": {"backBar": [16, 0, 192, 34], "counter": [16, 34, 192, 48], "lowCounter": [62, 62, 192, 82], "floorOpen": [16, 84, 192, 250], "floorLeftOpen": [16, 48, 62, 84],
               "windowStrip": [0, 0, 16, 320], "lamps": [[18, 68], [16, 128], [16, 196]], "tileRowPx": 16, "darkBandFrom": 250},
 "beauvoir_s": {"sea": [0, 0, 192, 35], "meadow": [0, 35, 192, 105], "waystones": [[62, 92], [148, 103], [124, 98]], "lane": {"centerX": 96, "y300": [40, 150], "y200": [72, 120], "y120": [86, 108]}, "windowsLeft": [[20, 145], [28, 185], [36, 220]], "windowsRight": [[162, 135], [158, 175], [166, 215]]},
 "fromm_s": {"bed": [31, 145, 93, 185], "bedSoil": [62, 158], "table": [136, 150, 181, 180], "stool": [156, 182], "lanterns": [[30, 130], [104, 125], [160, 60], [160, 210]], "gravel": [50, 185, 180, 235], "wallTop": 80},
 "leap": {"cliffLeft": [0, 0, 30, 320], "cliffRight": [160, 0, 192, 320], "openFog": [30, 0, 160, 260], "lamps": [[40, 205], [145, 245], [174, 100]]},
 "leap2": {"cliffLeft": [0, 0, 28, 320], "cliffRight": [160, 0, 192, 320], "headlandLight": [116, 76], "openSea": [30, 90, 160, 260]},
 "doors": {"wallsInner": [26, 165], "carpet": [76, 116], "sconces": [[33, 172], [158, 172]], "tilePeriodPx": 640},
}
json.dump(GEO, open(f"{P}/geo40.json", "w"), indent=1)
def kier(d):
    box(d, [40, 20, 152, 290], CY, "brief street x40-152"); box(d, [20, 170, 40, 190], CY, "alley"); box(d, [152, 100, 172, 120], CY, "alley")
    dot(d, 96, 40, CY, "brief door"); dot(d, 164, 70, CY, "brief bell"); dot(d, 96, 246, CY, "start")
    g = GEO["kierkegaard_s"]; dot(d, *g["door"], OR, "painted door"); dot(d, *g["bell"], OR, "painted bell"); box(d, g["street"], OR, "painted street")
ov("kierkegaard_s-geo", "kierkegaard-sbg", kier)
def voices(d):
    for x in (48, 96, 144): box(d, [x - 18, 40, x + 18, 230], CY); dot(d, x, 26, CY); dot(d, x, 120, CY)
    d.line((U(30), U(214), U(162), U(214)), fill=CY, width=2)
ov("kierkegaard_s-voices", "kierkegaard-sbg", voices)
def nie(d):
    box(d, [12, 40, 180, 180], CY, "brief stone area"); box(d, [56, 175, 136, 225], CY, "brief tablet"); dot(d, 36, 230, CY, "brief Wanderer")
    ell(d, 96, 150, 64, 36, CY); dot(d, 96, 186, CY, "brief gate"); box(d, [26, 198, 86, 238], CY, "Enough"); box(d, [106, 198, 166, 238], CY, "Once more")
    g = GEO["nietzsche_s"]; box(d, g["plateau"], OR, "painted plateau"); d.line((0, U(96), 384, U(96)), fill=OR, width=2); dot(d, *g["boulder"], OR, "boulder")
    t = g["suggestTrack"]; ell(d, t["c"][0], t["c"][1], t["rx"], t["ry"], GR)
ov("nietzsche_s-geo", "nietzsche-sbg", nie)
def cam(d):
    dot(d, 40, 236, CY, "brief Wanderer"); dot(d, 110, 232, CY, "brief kite"); box(d, [136, 8, 184, 40], CY, "notebook (top right, 48x32)")
    g = GEO["camus_s"]; d.line((0, U(160), 384, U(160)), fill=OR, width=2); box(d, g["sand"], OR, "painted sand"); dot(d, *g["sun"], OR, "sun")
ov("camus_s-geo", "camus-sbg", cam)
def sar(d):
    box(d, [0, 34, 192, 50], CY, "brief counter y34-50")
    for n, (x, y) in zip("123456", [(50, 96), (142, 96), (96, 136), (46, 176), (146, 176), (96, 216)]): box(d, [x - 16, y - 12, x + 16, y + 12], CY, "T" + n)
    box(d, [18, 170, 78, 210], GR, "medal desk"); box(d, [143, 80, 177, 140], GR, "medal door")
    g = GEO["sartre_s"]; box(d, g["counter"], OR, "painted counter"); box(d, g["lowCounter"], OR, "low counter"); box(d, g["floorOpen"], OR, "painted open floor")
ov("sartre_s-geo", "sartre-sbg", sar)
def bea(d):
    d.line((U(96), U(250), U(96), U(70)), fill=CY, width=2); dot(d, 28, 150, CY, "tags L"); dot(d, 164, 150, CY, "tags R")
    S = [(96, 206), (60, 184), (132, 184), (96, 160), (48, 138), (144, 138), (96, 116), (40, 92), (152, 92), (96, 76), (64, 60), (128, 60)]
    for k, (x, y) in enumerate(S): dot(d, x, y, GR, f"S{k + 1}", 6)
    for n, (x, y) in (("school", (30, 48)), ("workshop", (96, 36)), ("shore", (166, 50)), ("start", (96, 244)), ("waystone", (24, 236))): dot(d, x, y, GR, n)
    g = GEO["beauvoir_s"]; box(d, g["meadow"], OR, "painted meadow")
ov("beauvoir_s-geo", "beauvoir-sbg", bea)
def fro(d):
    dot(d, 64, 140, CY, "brief rose"); box(d, [144, 134, 168, 166], CY, "brief urn")
    for x in (36, 72, 108, 144): box(d, [x - 15, 212, x + 15, 240], CY)
    g = GEO["fromm_s"]; box(d, g["bed"], OR, "painted bed"); box(d, g["table"], OR, "painted table"); dot(d, *g["stool"], OR, "stool")
ov("fromm_s-geo", "fromm-sbg", fro)
print("ok")
