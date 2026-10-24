# Phase 42B (lead): fill the Phase 38 brief template for the 6 Level III builders (copied from briefs42b.py).
# Reuses briefs40b/camus.md for the digest and PART A excerpts (lines 39-267), and slices Plan 5 and the 41A handoff.
import os, re
EL = "/home/claude/el"
plan = open("/home/claude/plan5.md", encoding="utf-8").read().split("\n")
camus = open(f"{EL}/briefs40b/camus.md", encoding="utf-8").read().split("\n")
ho = open(f"{EL}/claude_examined-life-42a-art.md", encoding="utf-8").read().split("\n")
L = lambda a, b: "\n".join(plan[a - 1:b])          # plan lines a..b inclusive (1-based)
H = lambda a, b: "\n".join(ho[a - 1:b])
STD = "\n".join(camus[38:267])                      # "## 3. Standing rules" .. end of 4.2
APPX_D = L(1783, 1830).rstrip()
APPX_C2 = L(1656, 1659) + "\n\n" + L(1725, 1759)
CARE = L(1061, 1061)
CADE23 = H(20, 27)
HO_INTRO = H(42, 56)                                 # §4 header, frame names, people sets

def ho_entry(key):
    s = ho.index(f"### `MINI_ART.{key}`")
    e = s + 1
    while e < len(ho) and not ho[e].startswith("#"):
        e += 1
    return "\n".join(ho[s:e]).rstrip()

NOTES = {n: H(95 + n, 95 + n) for n in range(1, 9)}  # §5 items 1..8 on lines 96..103

BASE = {
 "shared":    dict(who="Confucius (full game)", games=["shared"], folder="f3", script="f3", key="shared",
                  plan=(1063, 1088), notes=[1, 2, 8], appd="8, 17, 18"),
 "buddha":    dict(who="the Buddha", games=["bodhi", "alms"], folder="s3", script="s3", key="buddha_s",
                  plan=(1089, 1130), notes=[3, 8], appd="8, 16, 19"),
 "laozi":     dict(who="Laozi", games=["slips", "buffalo"], folder="s3", script="s3", key="laozi_s",
                  plan=(1131, 1172), notes=[4, 8], appd="8"),
 "zhuangzi":  dict(who="Zhuangzi", games=["ding", "claypot"], folder="s3", script="s3", key="zhuangzi_s",
                  plan=(1173, 1216), notes=[5, 8], appd="1, 6, 10"),
 "confucius": dict(who="Confucius (short games)", games=["analects", "zither"], folder="s3", script="s3", key="confucius_s",
                  plan=(1217, 1259), notes=[6, 8], appd="1, 8, 13"),
 "dogen":     dict(who="Dōgen", games=["sitting", "sandal"], folder="s3", script="s3", key="dogen_s",
                  plan=(1260, 1302), notes=[7, 8], appd="8, 15, 16"),
}

CHANGES = {
 "shared": """- **Hall (Stages I–II and the meal in III):** the brief's places fit the painted hall: table (96, 128), the six seats, bench y 212, side table y 36 (teapot (40, 36), rice tub (72, 36)), door (96, 238) in the carved frame (opening x 78–114, y 212–256), window (24, 60), lamp (170, 52). Brazier (162, 104). Confucius stands at (170, 76). `geo.hall`.
- **Altar (Stage III, `bg[1]`, `geo.altar`):** the altar top is at **y 99** (brief 90); the floor starts at y 162.
  - Offering outlines on the altar top at **y 99**, x 44 / 76 / 116 / 148 (x unchanged).
  - Incense spot **(96, 102)** (brief (96, 100)).
  - **Bow rows y 184 / 210 / 236** (brief 136 / 164 / 192), x 76 and 116.
  - Offering tray **(96, 200)** (brief y 214). The empty tray **fades out after the incense is placed, before the bow line** (row 2 is at y 210).
  - **Waiting spots for the bow line.** The hall bench is not in the altar scene, and y > 250 is the pad zone. The six family members wait in a 2 × 3 block at the **left side of the floor**: (20, 184), (44, 184), (20, 210), (44, 210), (20, 236), (44, 236), in a random order (the brief's "wait on the bench"). Drag each from there to a row spot.
  - Confucius bows at **(170, 200)** (brief (170, 150)).
  - The tablet base stands in the niche at **(96, 56)** (brief (96, 58)). It is a fixed piece (`tablet`).
- **People frames:** Confucius uses `con_idle_0/1`, `con_bow`, `con_nod` from `MINI_ART.shared` (the brief's "existing sprite"). Seated upper-body frames (`*_sf`, `*_sb`, `w_sf`, `w_sb`, `gm_pour`, `gu_pour`) are cut at the table edge: place their pivot on the table's near edge for that seat. The inset face is `face_neutral / face_shiver / face_squint / face_smile` drawn at 2× (28 units) with its top-left at (4, 20).
- **Art facts:** `table` 176 × 100 px (88 × 50 units; brief 88 × 56). `door_open` is drawn ajar (31 × 64 px). `cup_empty` is a recolor of the full cup. `bowl_full` has no steam: code draws it. The plate (`MINI_ART.shared.plate`) is faded in by the engine; you do not draw it.""",
 "buddha": """- **The Mindful Stream (`bodhi`):** the tree fills y 0–64. **The Buddha sits on the stone seat at (96, 86)** (brief (96, 30)): `bud_sit` (with a very slow `bud_sit_1` breath at most; still and calm).
  - **The stream is the traced polyline `MINI_ART.buddha_s.stream`** (also `geo.stream`), from (150, 92) down to (88, 300). Boats follow it at 14 units/s. Keep the brief's polyline only as the fallback when art data is missing. The reach zone stays y 60–230; petals at y 240 stay (the stream passes y 240 at about x 88).
  - Boats start at the top of the traced stream (150, 92), not (96, 22).
  - The Bodhi leaf of the bloom rests at **(104, 114)** (brief (96, 96) is on the island).
  - Draw the `boat` piece at 1× (15 × 14 units). The hit area stays 28 × 24 units, and the jam spacing stays 18 units.
- **The Alms Round (`alms`):** keep the brief's code lane polyline and fork at (96, 60) exactly. **The grove is at (70, 92)** (brief (60, 36)): the Buddha sits there (`bud_sit`), with the three monks (`monk0–2_sit` / `_pour`) seated around him. **The grand gate is at (150, 58)** (brief (138, 40)). The two fork branches run from (96, 60) to these two points.
  - **Door sides:** the brief says the 9 lit doors alternate sides but not which side comes first. Put door 1 (y 232) on the **right**, so door 9 (y 84) is also on the right and stays clear of the grove at (70, 92).
  - Pieces: `house_humble`, `house_fine`, `house_shut` (48 × 56 px), `gate_grand` (66 × 64 px), `bowl_empty`/`bowl_full` 24 px wide, offerings 12 px (`o_riceball`, `o_banana`, `o_greens`, `o_cake`, `o_honey`; `o_fruit` 16 px). Villagers `vil0_*`, `vil1_*`; host `host_*`; the Wanderer with the bowl `wb_*`.""",
 "laozi": """- **The road is the traced polyline `MINI_ART.laozi_s.road`** (also `geo.road`; 17 points from (96, 300) up to (96, 88)). The painted road is about 18–24 units wide. **Keep the brief's rule width of 30 units** for the on-road test (within 15 units of the traced centerline = on the road). Use the brief's polyline only as the fallback when art data is missing.
- **The gate is at (96, 80)** (`geo.gate`; brief (96, 40)). The finish is within 12 units of (96, 80). The buffalo starts on the traced road at y 248 (just above the pad zone), heading up the road.
- **Buffalo art:** the buffalo frames are **top-down from behind, 24 × 56 px** (`buf_left`, `buf_mid` 20 × 51, `buf_right`); the head points up the screen, so **rotate the sprite to the heading**, and choose the frame by the head's swing (left / middle / right). Laozi rides with `lao_ride_0/1` (frame 1 sways the hem), drawn on the buffalo's back, calm and upright.
- **The Empty Middle (`slips`):** Laozi sits at **(160, 196)** writing (`lao_write_0/1`), at the painted writing table (166, 182); Yinxi stands at **(180, 186)** (`yin_stand`, `yin_bow`, `yin_hold`). The slip bundle builds at **(176, 100)** (the brief's x 176, y 60–140 band). The objects come to (96, 128) as briefed. Pieces: `wheel_solid`, `wheel_axle`, `clay`, `bowl`, `hut_closed`, `hut_open` (64 px on the long side = 32 units; the brief says each object is 64 units across: draw them at 2× scale), `slip`, `bundle`, `bell`.""",
 "zhuangzi": """- **Following the Gaps (`ding`):** the scroll (`ox_scroll`, 320 × 240 px = 160 × 120 units) lies at **(96, 130)** over the pavilion table, as briefed. **The seams are `MINI_ART.zhuangzi_s.seams`** (six named polylines, 31–54 units long) and the **knots are `MINI_ART.zhuangzi_s.knots`** (four points), radius `geo.knotR` = 8. Use the brief's fallback (code polylines over a code ink outline) only when art data is missing. **Cook Ding stands at (24, 176)** (brief (22, 150)): `ding_stand`, `ding_knife`, `ding_bow`.
- **The Turning Seasons (`claypot`):** **Zhuangzi sits at (64, 178)** (brief (64, 168)) and **the pot is at (104, 172)** (brief (104, 160)), on the open ground in front of the steps. The emblem ring stays at (96, 54), radius 26. Zhuangzi frames: `zz_drum_up`, `zz_drum_down`, `zz_relax`. Pieces: `pot` 57 × 64 px (draw at 1×, about 28 × 32 units, = the brief's 32 units), `petal`, `maple`, `snow`, `cicada`, `em_blossom`, `em_lotus`, `em_maple`, `em_pine`.
- Both games show no death, no grief, no mourners, and nothing cut open (Appendix D 6, 10).""",
 "confucius": """- The brief's places fit the painted courtyard (no moves). Courtyard paving x 4–158, y 90–222; dark tiles from y 224.
- **What We Remember (`analects`):** students rows y 104 / 156 at x 36–156; the slip table at (96, 214) (`table` 64 × 36 px, `slip` 7 × 56, `bundle` 48 × 33). Students `stu0`–`stu7` (`_sit`, `_stand`, `_bow`). Confucius is not drawn.
- **Play in Harmony (`zither`):** the zither (`zither` 192 × 85 px = 96 × 42 units, drawn at an angle; brief 40 tall) at (96, 206). Flute player `flute_0/1` at (24, 150); chime player `chime_up` / `chime_down` at (168, 150); the Wanderer behind the zither `wz_up`, `wz_pluck`, `wz_sit`. The four eave lanterns for the bloom are at (32, 30), (74, 30), (117, 30), (159, 30) (`geo.lanterns`). The chime stone is a jade hook shape.""",
 "dogen": """- **Just Sitting (`sitting`):** the floor starts at y 170 (railing y 148–170). **The cushion is at (96, 196)** (brief (96, 176)); **the incense is at (132, 198)** (brief (132, 178)). The Wanderer sits on the cushion (`wm_still`, `wm_breath`, `wm_turn`). The sit zone y 120–250 is unchanged. Visitors drift within 40 units of the Wanderer as briefed; the sparrow settles on the railing (top y 150) beside you.
- **Each Step (`sandal`):** keep the brief's code path, stones, ships, and gate positions exactly. The painted path down to the harbor is decoration; your path is code-drawn over the 45 % mist wash. Pieces: `stone`, `stone_lit` (24 × 16 px), `sandals`, `ship` 53 × 64 px, `gate` 56 × 39 px (a roofed gate). Walking frames `ww_up_0/1`, `ww_down_0/1`, `ww_stand`.""",
}

LESSONS = """### 2.1 Lessons from Phase 40B (read these)

- **Scope.** `tools/build_mini.py` wraps each game as `(function(){ <your source> })();`. Your source still starts with `{` and ends with `}`. Inside, prefer `const f=(…)=>{…}`. Never write to a global except `MINI.<id>` and `SFX.<id>_*`.
- **Sounds.** `index.html` belongs to the lead, so register your sounds from your own source, guarded, with the page synth (`aTone`, `aNoise`, `AN`). Example from `work_src/s1/absurd.js`:
  ```js
  if(typeof SFX!=="undefined"&&!SFX.absurd_pull){
    SFX.absurd_pull=()=>{aNoise(.16,{f:700,to:1500,q:3,v:.045,a:.03});aTone(AN(-5),.12,{type:"triangle",v:.03,lp:900,to:AN(-3)})};
  }
  ```
  Play a sound with `sfx("<name>")` (read how the existing games call it: `grep -n "sfx(" work_src/s1/absurd.js | head`).
- **Models to copy.** Read one finished game of the same kind before you start: short games `work_src/s1/absurd.js`, `work_src/s1/rose.js`, `work_src/s1/zenletter.js` (mPath); full game `work_src/f1/leap.js`. Kit modules: `kits/p40/absurd.py`, `kits/p40/rose.py`, `kits/p40/leap.py`.
- **Screenshots.** `--mini-shots DIR` takes the setup card, a mid-play frame, and the win card. Add `shotReady(s){return …}` to your `MINI` entry so the mid-play frame shows the game at a telling moment (for example, after 3 questions). Look at every image (use the Read tool on the PNG files).
- **Size.** Short source ≤ 9,216 B; full ≤ 32 KB. Five 40B games ended within 130 B of the line. Keep header comments short; cut drawing extras first, never a rule.
- **Stage name (41B).** The title is the game name; the one stage name (short games) is the brief's "Stage:" name. Full game: stage names as in the brief's **I · / II · / III ·** rows.
- **Bloom (41B bug).** The kit's `bloom_every_game` forces a win at the **start** of the stage, before anything has happened. Your bloom and `rate()` must not throw when no state has been built yet (use defaults).
- **Models for Level III:** short games `work_src/s2/danube.js` (mLanes), `work_src/s2/hemlock.js` (path), `work_src/s2/gate.js` (mPick, memory); full game `work_src/f2/garden.js` with `kits/p41/garden.py`. Kit modules: `kits/p41/*.py`.
- **Art.** Draw with your key and the names in §6 (`mPiece(c,"«key»","name",x,y,o)`, `mPerson(c,"«key»","name",x,y,o)`; read `work/mini/fx.js` for the options: scale, flip, alpha, anchor). Every game must play with no art loaded (code fallbacks).
"""

def brief(sub, d):
    ids = d["games"]; key = d["key"]; script = d["script"]; folder = d["folder"]
    full = folder.startswith("f")
    job = (f"the full game of {d['who'].split(' (')[0]}: `{ids[0]}`" if full else
           f"the short games of {d['who']}: " + ", ".join(f"`{i}`" for i in ids))
    srcs = ", ".join(f"`work_src/{folder}/{i}.js`" for i in ids)
    kits = ", ".join(f"`kits/p42/{i}.py`" for i in ids)
    idstr = ",".join(ids)
    notes = "\n".join(NOTES[n] for n in d["notes"])
    out = f"""# Subagent brief — Phase 42B, subagent `{sub}`

*Filled by the lead (Opus) from the Phase 38 template on October 7, 2026. Read all of it before you write code.*

## 0. Your job

You build {job} for *The Examined Life*, a browser game. You work alone in your own copy of the workspace: `/home/claude/el-{sub}`. You cannot talk to Cade. When the brief is not clear, choose the reading that keeps the rule exact, and list it in your report.

**Model:** Sonnet. **Lead:** Opus. The lead reviews your diff, your kit result, and your screenshots against the plan rules. **Rule fidelity is strict:** build each rule exactly. Do not simplify a rule. If a rule does not work, say so plainly in the report and propose a correction.

**Machine note:** this machine has 2 CPUs and 7 GB of memory, and 6 builders share it. Run the kit only for your own ids (§7), and only when your game is ready; a second run only after a fix. Do not start more than one kit run at a time. A speed check that reads high may come from the shared load: report the number; do not cut a rule to lower it. Do not use `--mini-shots` on any game but your own. Never run the full kit. Never touch `/home/claude/el`, `/home/claude/src`, or another builder's folder.

**Not your job:** publishing, uploads, art processing, Cade's computer folders, and the handoff. The lead does those. Ignore the digest's publish rules (§3.4 below) except as background. Do not add facts that are not in your brief.

## 1. Restore

```
mkdir -p /home/claude/el-{sub} && cd /home/claude/el-{sub}
unzip -q -o /home/claude/src/after42a.zip
python3 tools/build_mini.py {script}        # must print the script's size and "games built 0/…"
```

The `MINI_ART` entry of your games (`MINI_ART.{key}`) is already in `work/mini/{script}.js`. Check it with `grep -c 'MINI_ART.{key}=' work/mini/{script}.js` (must print 1). Read the exact values with `grep -o 'MINI_ART.{key}=.*' work/mini/{script}.js | head -c 6000`.

## 2. Files you own (and nothing else)

| You may change | Path |
|---|---|
| Game source, one per game | {srcs} |
| Kit module, one per game | {kits} |
| The built script (only through the build tool) | `work/mini/{script}.js` |

- **Do not change** `work/index.html`, `work/mini/fx.js`, `kit.py`, `tools/*`, other games' sources, or the `MINI_ART` block. If you need a shared helper or a stage-engine change, **stop and report the need**; the lead makes it.
- A source file holds only `MINI.<id>={{…}}` and that game's helpers, **wrapped in one block `{{ … }}`** so names never clash. Short game ≤ 9 KB of source; full game ≤ 32 KB.
- Build: `python3 tools/build_mini.py {script}`. It writes the script, runs `node --check`, prints sizes, and refuses a script above 150 KB.
- Other builders write other games into the same script in their own copies. That is expected: the lead merges the source files. Your build shows only your game(s) built.

{LESSONS.replace('«key»', key)}
{STD}

## 5. Your game brief(s) — Plan 5, Phase 42B, word for word

{L(*d['plan']).rstrip()}

### 5.0 Care for this whole land (Plan 5, 42B, word for word)

{CARE}

### 5.1 Approved changes that override the brief (Cade and the art handoff, October 7, 2026)

Cade's decisions in the art handoff (§2), word for word:

{CADE23}

Lead instructions for your games:

These positions moved to fit the painted art. They win over the brief text. The rules do not change.

{CHANGES[sub]}
- Where a brief position and the handoff geometry (§6) disagree for other items, follow the §6.1 notes; else keep the brief.
- Grades: where the brief writes `grade('<name>')`, use `gradeN(c,'<name>',a)` (PART A, A4).

### 5.2 Lead decisions on the briefs (Plan 5, Appendix D, in full; the items for your games: {d['appd']})

{APPX_D}

### 5.3 Sources behind the designs (Plan 5, Appendix C, Level III)

{APPX_C2}

## 6. Art numbers — Phase 42A handoff §4 and §5 (your parts)

Your key is **`MINI_ART.{key}`**. The lead has already written it into the script's `MINI_ART` block. Do not change that block.

{HO_INTRO}

{ho_entry(key)}

### 6.1 Notes for 42B (layout and art facts, from the art handoff §5)

{notes}

## 7. Kit

Your module(s): {kits}. Shape:

```python
# kit checks for <id> (Plan 5, Phase 42B)
async def run(kit, b, pg):
    G = "p42"
    r = await pg.evaluate(\"\"\"(()=>{{const g=MINI.<id>;const s={{W:192,H:320,rm:false,t:0}};g.init(s);
      /* set up the exact situation of the rule, step with miniBlankInp() + the input you need, and return what happened */
      return {{}}}})()\"\"\")
    ok = True  # the defining rule, tested directly
    kit.add(G, "rules_<id>", ok, "what was measured, in plain words")
```

- Add one `kit.add` line for each named check in the brief's **Kit** row (for example `{ids[0]}_…`), plus one summary `rules_<id>` line. Each tests the **defining rule** directly, not only that the game wins.
- The group also runs `mini_suite` and `hd_suite` ({'full mode' if full else 'short mode'}) on your game(s).
- Your command (your group and your ids only; never the full kit):
  `cd /home/claude/el-{sub} && python3 -u kit.py work/index.html --blobs blobs --only p42 --mini-ids {idstr} --mini-shots shots-{sub}`
- It must end with no ❌ in group `p42` for your ids, and `RESULT: PASS`.

## 8. Report (your final message)

1. What you built (3–6 lines) and the source size of each game; the built script size.
2. The idea check sentence for each game.
3. The kit lines for your ids (copy them), and the screenshot paths.
4. Lantern thresholds, and how `auto` wins (and how long it takes).
5. Every line of game text, exactly as in the source.
6. Each difference from the brief, with the reason. Any rule you could not build exactly: say so plainly; do not simplify it.
7. Any shared change you need from the lead.
8. Your workspace path (`/home/claude/el-{sub}`) and the exact paths of your source and kit files, so the lead can merge them.
"""
    if full:
        out = out.replace("(short mode for short games)", "")
    return out

os.makedirs(f"{EL}/briefs42b", exist_ok=True)
import sys
for sub, d in BASE.items():
    t = brief(sub, d)
    open(f"{EL}/briefs42b/{sub}.md", "w", encoding="utf-8").write(t)
    print(sub, len(t))
