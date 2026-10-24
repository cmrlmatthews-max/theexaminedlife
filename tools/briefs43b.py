# Phase 43B (lead): fill the Phase 38 brief template for the 4 Level IV builders (copied from briefs42b.py).
# Reuses briefs40b/camus.md for the digest and PART A excerpts (lines 39-267), and slices Plan 5 and the 41A handoff.
import os, re
EL = "/home/claude/el"
plan = open("/home/claude/plan5.md", encoding="utf-8").read().split("\n")
camus = open(f"{EL}/briefs40b/camus.md", encoding="utf-8").read().split("\n")
ho = open(f"{EL}/claude_examined-life-43a-art.md", encoding="utf-8").read().split("\n")
L = lambda a, b: "\n".join(plan[a - 1:b])          # plan lines a..b inclusive (1-based)
H = lambda a, b: "\n".join(ho[a - 1:b])
STD = "\n".join(camus[38:267])                      # "## 3. Standing rules" .. end of 4.2
APPX_D = L(1783, 1830).rstrip()
APPX_C2 = L(1656, 1659) + "\n\n" + L(1760, 1782)
CARE = L(1501, 1501)
CADE23 = H(16, 27)
HO_INTRO = H(38, 50)                                 # §4 header, frame names, people sets

def ho_entry(key):
    s = ho.index(f"### `MINI_ART.{key}`")
    e = s + 1
    while e < len(ho) and not ho[e].startswith("#"):
        e += 1
    return "\n".join(ho[s:e]).rstrip()

NOTES = {n: H(78 + n, 78 + n) for n in range(1, 7)}  # §5 items 1..6 on lines 79..84

BASE = {
 "aquinas":  dict(who="Aquinas", games=["summa", "ox"], folder="s4", script="s4", key="aquinas_s",
                  plan=(1371, 1412), notes=[1, 5, 6], appd="7, 8, 17, 19"),
 "kant":     dict(who="Kant", games=["kantwalk", "citymap"], folder="s4", script="s4", key="kant_s",
                  plan=(1413, 1454), notes=[2, 5, 6], appd="13, 19"),
 "mill":     dict(who="Mill", games=["poems", "petition"], folder="s4", script="s4", key="mill_s",
                  plan=(1455, 1496), notes=[3, 5, 6], appd="14, 19, 21"),
 "gilligan": dict(who="Gilligan (through the Weaver)", games=["different", "tellmore"], folder="s4", script="s4", key="gilligan_s",
                  plan=(1497, 1541), notes=[4, 5, 6], appd="4, 9"),
}

CHANGES = {
 "aquinas": """- **Objection! (`summa`):** the three reply gaps are the painted windows: **centers x 36 / 96 / 156, y 44** (brief 44 / 96 / 148). Use `MINI_ART.aquinas_s.gaps` (rects 30 × 48 units) for the hit areas and the seal spots; the brief's numbers are only the fallback with no art. The swipe angle rule (±18°) is unchanged. Aquinas (96, 178), the lectern and book (96, 196), the lantern (130, 192), the reach ring (radius 54, center (96, 190)), and the floor spots (96 ± 36, 236) stay as briefed.
  - Pieces: draw `book_lectern` (128 × 128 px) for the book on its lectern, or `book` (128 × 60 px = 64 × 30 units, the open book alone; brief 64 × 40) over a lectern. `dart` 23 × 16 px (keep its aspect; the 26 × 26 hit box is unchanged), `crumpled` 28 × 26, `sheet`, `scroll`, `lantern` 16 × 32.
  - People: `aq_stand`, `aq_reach` (catching), `aq_write_0/1`. Calm poses only.
- **The Quiet Ox (`ox`):** the four classmates sit on the painted side benches at **(10, 150), (10, 206), (182, 150), (182, 206)** (brief x 26 / 166). `cls0`/`cls1` look right, so they sit on the **left** bench; `cls2`/`cls3` sit on the right bench. The desk (96, 176), the ox figurine (124, 166), and the page (48–144, 28–124) stay as briefed. Albert stands at **(128, 180)** in the bloom (`alb_stand`, `alb_nod`). Young Aquinas: `yaq_write_0/1`, `yaq_still`.
  - The warm morning grade: amber `#E9B872` at 30 % with `grade(c,"#E9B872",.3)` (the brief gives a color, so use `grade`, not `gradeN`).
  - Albert is drawn in the bloom only, standing and nodding (Appendix D 8).""",
 "kant": """- **Kant's Walk (`kantwalk`):** the route is **`MINI_ART.kant_s.walk`**: (44,86) → (20,86) → (20,131) → (72,131) → (72,152) → (96,152) → (96,176) → (36,176) → (36,236). It runs **north to south**: it starts at the university gate and **ends in the linden avenue**. Length **310 units**, so the **48 steps are 6.46 units** each (brief 7.42). Doors stay at every 8th step (steps 8, 16, … 48), evenly spaced by length. Keep the brief's route only as the fallback with no art.
  - Doors stand 10 units to the right of the route (right of the walking direction is fine too, if the brief's literal "right" puts a door in the river; choose the side that sits on land, and list each door spot in your report).
  - **Band at (112, 156)** (steps 17–24 are on the island; the brief's (116, 150) is in the river). **Neighbor's window at (50, 205)** (steps 41–44, on the house block right of the last leg). `nb_wave_0/1` is an upper body cut at the sill: put its pivot on the window sill.
  - The watch stays at (160, 38) (over the castle roofs; fine).
  - Kant frames: `kant_walk_0/1` (side view facing right; flip for left), `kant_up_0/1`, `kant_down_0/1` for the up/down legs, `kant_stand`, `kant_hat`. Band `band0_0/1`, `band1_0/1`.
  - Dusk grade: deep blue `#1E2A4A` at 25 % with `grade(c,"#1E2A4A",.25)`.
  - **Rhythm lesson (Phase 42B `claypot`):** fast tapping must not earn lanterns. Add a kit check that mashes (a tap every 0.25 s from t = 3) and confirms 1 lantern. The brief already makes a door exact only on its tick, so this should hold; prove it.
- **Dare to Know (`citymap`):** the blocked areas are **`geo.walls` (buildings) + `geo.water` (river and harbor)** plus the map edge, not the brief's A–F rects and river band (those are the fallback with no art). Bridges and quays are the gaps between the water rects (see `geo.bridges`).
  - Landmarks `geo.landmarks`: university (44, 82), castle (148, 80), island church (96, 152), bookshop (22, 156), harbor (155, 205); radius 14 as briefed. The university, castle, church and harbor are painted: draw only their gold rings. The bookshop is not painted: draw `bookshop` at `geo.icons.bookshop` (8, 150).
  - **Guardian loop: rectangle x 38–96, y 175–218** (`geo.loop`), lap **202 units = 9.2 s** at 22 units/s (brief 11.6 s). **The 3-lantern rule reads "cut before the first lap ends" = `s.cutT` < 9.2 s** (use `loopLap/22`). The loop keeps ≥ 23 units from every landmark. **Start on the loop at (67, 218)** (`geo.loopStart`).
  - `geo.autoPath` is a tested open route for `auto` (it starts at the loop start and visits bookshop, university, church, castle, harbor). Check it against your own collision code and adjust waypoints if needed (report any change).
  - Parchment grade: sepia `#C8A46A` at 40 % with `grade(c,"#C8A46A",.4)`, plus a soft `vignette`.
  - People: the Wanderer walking from the characters atlas (read how other games draw `wanderer_*`: `grep -n "wanderer_" work_src/s*/*.js | head`), `w_sit` (after a stumble), guardians `grd0_*`, `grd1_*` (`walk_0/1`, `offer`), Kant at a window `kant_0` (characters atlas) in the bloom, at the university (44, 82).""",
 "mill": """- **The backdrop is squashed** (Cade, §2.3): the town fills y 40–250, the hills and lake y 0–40. All 30 corners are above the pad zone.
- **Color Comes Back (`poems`):** keep the brief's verse segments S1–S3, rod, gears G1–G3, Mill (20, 62) and the book (24, 40) exactly. S1 runs along the top of the town (not over the hills); the color mask reveals whatever is under the traced line. The grey grade is `gradeN(c,"grey",.9)` (or the brief's "full grey grade", 90 %); color shows through a cached offscreen color mask (no `getImageData`). Gears: the 8 frames `gear_0`…`gear_7` loop one turn of 45°. People: `mill_read`, `mill_up`.
  - `mPath` reports `pace` each frame (A6). Use it for the 40 units/s limit, smoothed over 0.25 s.
- **The Lamplighter's Round (`petition`):** the 30 corners are **`MINI_ART.mill_s.nodes`** (row-major: index = r·5 + c). **Columns x 22 / 57 / 96 / 135 / 169; rows y 47 / 87 / 139 / 172 / 207 / 246**; the **depot is (96, 246)** = (c2, r5). Rows are not evenly spaced. The brief's grid is only the fallback with no art. The people counts per street, the oil (10 streets), the old round, and Best = 28 are topology rules and do not change (the lead checked: exhaustive search over all routes of ≤ 10 streets from the depot gives 28, by 4 routes; the old round gives 13; total 75).
  - The lamp button stays at (172, 18) (26 × 26), over the hills. The tally stays at the top center.
  - Night grade: deep blue `#16213C` at 45 % with `grade(c,"#16213C",.45)`.
  - Pieces: lamps `lamp_off`/`lamp_on` 11 × 24 px, cottages 19 × 24, townhouses `town_dark`/`town_lit` 20 × 40, `oilcan`, `scroll` 120 × 53. People: `lamp_walk_0/1` (side view facing right; flip for left), `lamp_light`, `mill_stand` at the depot.""",
 "gilligan": """- **Two Voices (`different`):** the Measure is **140 × 312 px (70 × 156 units), top-left (61, 43)** (`geo.measure.rect`; draw it at 1:1). **Six rungs at y 175.5 (rung 1), 154, 131.5, 109.5, 87.5, 65.5** (`geo.measure.rungsBottomUp`; brief 200…50). Keep the 4 snap slots per rung at x = 70, 86, 106, 122 (draw tokens on rungs smaller, about 14 units, so they do not overlap). The pointer pivots at the dial **(77.5, 114.5)** (brief (52, 125)); the painted needle is removed, so code draws the pointer. The four townsfolk sit on the chairs of the two side tables: **(16, 116), (16, 152), (178, 116), (178, 152)** (brief (26, 280) / (166, 280)); their picture bubbles sit above the two tables (`geo.tables` (16, 133), (176, 133)). Tokens fly from a table to the tray. The tray (96, 292) and the open strip (y 258) stay as briefed (no pad shows in this game).
  - Cool grade: blue `#2A3F6A` at 30 % with `grade(c,"#2A3F6A",.3)`.
  - People: the Weaver `wv_stand`, `wv_book` (bloom); townsfolk `tf0`–`tf3` `_talk_0/1`. Pieces `measure`, `tok_square` 44 × 42 px, `tok_round` 44, `book` 48 × 47.
- **Tell Me More (`tellmore`):** the counter crosses y 183–213 with the shelves behind it (nearer the viewer, y 222–260). **Weaver (96, 220)** (brief (96, 196)), between the counter and the shelves, facing up. **Visitor stop (96, 176)** (brief (96, 112)); visitors walk in from the top left. **Request bubbles (60, 134), (96, 118), (132, 134)** (brief y 70 / 54 / 70). **Spool button (150, 160)** (brief (160, 120)), 28 × 28. **Shelf row y 236** (brief 232) at the brief's x = 18, 44, 70, 96, 122, 148, 174 (24 × 24 hit boxes). The notebook stays at (26, 30).
  - Warm grade: amber `#D89A4A` at 20 % with `grade(c,"#D89A4A",.2)`.
  - People: the Weaver `wv_stand`, `wv_hand` (handing across), `wv_spool` (bloom); visitors `vis0`–`vis5` `_walk_0/1` (walking toward the viewer), dim and bright by tint in code.
- **Care for both:** the Weaver's face stays hidden in light. Carol Gilligan is never drawn, quoted, or given first-person words. All townsfolk and visitors are anonymous.""",
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
- **Models for Level IV:** `work_src/s3/claypot.js` (rhythm with a local beat, plus its kit `kits/p42/claypot.py`), `work_src/s3/sitting.js` and `work_src/s2/sealring.js` (mHold), `work_src/s2/cloak.js` and `work_src/s1/tornpage.js` (mDrag), `work_src/s3/ding.js` and `work_src/s1/zenletter.js` (mPath), `work_src/s2/gate.js` and `work_src/s3/analects.js` (mPick), `work_src/s3/buffalo.js` (steering). Kit modules: `kits/p42/*.py`.
- **Test the brief's numbers first (42B lesson).** Three 42B checks could not hold as written. Before you build the visuals, write the rule core and your kit checks, and confirm each named check can pass with the brief's exact numbers. If one cannot, do not bend the rule: keep it exact, and report the conflict with the numbers.
- **Rhythm lesson (42B `claypot`):** in any timing game, fast tapping or mashing must not earn 2 or 3 lanterns. Add a kit check that proves it.
- **`RESULT: PASS` can lie on a `--only` run.** Always `grep "❌"` in your kit output.
- **Art.** Draw with your key and the names in §6 (`mPiece(c,"«key»","name",x,y,o)`, `mPerson(c,"«key»","name",x,y,o)`; read `work/mini/fx.js` for the options: scale, flip, alpha, anchor). Every game must play with no art loaded (code fallbacks).
"""

def brief(sub, d):
    ids = d["games"]; key = d["key"]; script = d["script"]; folder = d["folder"]
    full = folder.startswith("f")
    job = (f"the full game of {d['who'].split(' (')[0]}: `{ids[0]}`" if full else
           f"the short games of {d['who']}: " + ", ".join(f"`{i}`" for i in ids))
    srcs = ", ".join(f"`work_src/{folder}/{i}.js`" for i in ids)
    kits = ", ".join(f"`kits/p43/{i}.py`" for i in ids)
    idstr = ",".join(ids)
    notes = "\n".join(NOTES[n] for n in d["notes"])
    out = f"""# Subagent brief — Phase 43B, subagent `{sub}`

*Filled by the lead (Opus) from the Phase 38 template on October 7, 2026. Read all of it before you write code.*

## 0. Your job

You build {job} for *The Examined Life*, a browser game. You work alone in your own copy of the workspace: `/home/claude/el-{sub}`. You cannot talk to Cade. When the brief is not clear, choose the reading that keeps the rule exact, and list it in your report.

**Model:** Sonnet. **Lead:** Opus. The lead reviews your diff, your kit result, and your screenshots against the plan rules. **Rule fidelity is strict:** build each rule exactly. Do not simplify a rule. If a rule does not work, say so plainly in the report and propose a correction.

**Machine note:** this machine has 2 CPUs and 7 GB of memory, and 4 builders share it. Run the kit only for your own ids (§7), and only when your game is ready; a second run only after a fix. Do not start more than one kit run at a time. A speed check that reads high may come from the shared load: report the number; do not cut a rule to lower it. Do not use `--mini-shots` on any game but your own. Never run the full kit. Never touch `/home/claude/el`, `/home/claude/src`, or another builder's folder.

**Not your job:** publishing, uploads, art processing, Cade's computer folders, and the handoff. The lead does those. Ignore the digest's publish rules (§3.4 below) except as background. Do not add facts that are not in your brief.

## 1. Restore

```
mkdir -p /home/claude/el-{sub} && cd /home/claude/el-{sub}
unzip -q -o /home/claude/src/after43a.zip
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

## 5. Your game brief(s) — Plan 5, Phase 43B, word for word

{L(*d['plan']).rstrip()}

### 5.0 Care (Plan 5, 43B, Gilligan section, word for word; the digest care rules apply to all)

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

### 5.3 Sources behind the designs (Plan 5, Appendix C, Level IV)

{APPX_C2}

## 6. Art numbers — Phase 43A handoff §4 and §5 (your parts)

Your key is **`MINI_ART.{key}`**. The lead has already written it into the script's `MINI_ART` block. Do not change that block.

{HO_INTRO}

{ho_entry(key)}

### 6.1 Notes for 43B (layout and art facts, from the art handoff §5)

{notes}

## 7. Kit

Your module(s): {kits}. Shape:

```python
# kit checks for <id> (Plan 5, Phase 43B)
async def run(kit, b, pg):
    G = "p43"
    r = await pg.evaluate(\"\"\"(()=>{{const g=MINI.<id>;const s={{W:192,H:320,rm:false,t:0}};g.init(s);
      /* set up the exact situation of the rule, step with miniBlankInp() + the input you need, and return what happened */
      return {{}}}})()\"\"\")
    ok = True  # the defining rule, tested directly
    kit.add(G, "rules_<id>", ok, "what was measured, in plain words")
```

- Add one `kit.add` line for each named check in the brief's **Kit** row (for example `{ids[0]}_…`), plus one summary `rules_<id>` line. Each tests the **defining rule** directly, not only that the game wins.
- The group also runs `mini_suite` and `hd_suite` ({'full mode' if full else 'short mode'}) on your game(s).
- Your command (your group and your ids only; never the full kit):
  `cd /home/claude/el-{sub} && python3 -u kit.py work/index.html --blobs blobs --only p43 --mini-ids {idstr} --mini-shots shots-{sub}`
- It must end with no ❌ in group `p43` for your ids, and `RESULT: PASS`.

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

os.makedirs(f"{EL}/briefs43b", exist_ok=True)
import sys
for sub, d in BASE.items():
    t = brief(sub, d)
    open(f"{EL}/briefs43b/{sub}.md", "w", encoding="utf-8").write(t)
    print(sub, len(t))
