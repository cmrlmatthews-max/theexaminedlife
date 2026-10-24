# Phase 41B (lead): fill the Phase 38 brief template for the 7 Level II builders.
# Reuses briefs40b/camus.md for the digest and PART A excerpts (lines 39-267), and slices Plan 5 and the 41A handoff.
import os, re
EL = "/home/claude/el"
plan = open("/home/claude/plan5.md", encoding="utf-8").read().split("\n")
camus = open(f"{EL}/briefs40b/camus.md", encoding="utf-8").read().split("\n")
ho = open(f"{EL}/claude_examined-life-41a-art.md", encoding="utf-8").read().split("\n")
L = lambda a, b: "\n".join(plan[a - 1:b])          # plan lines a..b inclusive (1-based)
H = lambda a, b: "\n".join(ho[a - 1:b])
STD = "\n".join(camus[38:267])                      # "## 3. Standing rules" .. end of 4.2
APPX_D = L(1783, 1830).rstrip()
APPX_C2 = L(1656, 1659) + "\n\n" + L(1689, 1724)
HO_INTRO = H(44, 57)                                 # §4 header, frame names, people sets

def ho_entry(key):
    s = ho.index(f"### `MINI_ART.{key}`")
    e = s + 1
    while e < len(ho) and not ho[e].startswith("#"):
        e += 1
    return "\n".join(ho[s:e]).rstrip()

NOTES = {n: H(102 + n, 102 + n) for n in range(1, 10)}  # §5 items 1..9 on lines 102..110

BASE = {
 "garden":   dict(who="Epicurus (full game)", games=["garden"], folder="f2", script="f2", key="garden",
                  plan=(704, 733), notes=[1, 2, 9], appd="17, 20 (gate is not yours), 6–12 for background"),
 "socrates": dict(who="Socrates", games=["hemlock", "cloak"], folder="s2", script="s2", key="socrates_s",
                  plan=(734, 776), notes=[3, 9], appd="6, 13"),
 "aristotle": dict(who="Aristotle", games=["waxtablet", "peripatos"], folder="s2", script="s2", key="aristotle_s",
                  plan=(777, 819), notes=[4, 9], appd="3, 13"),
 "epicurus": dict(who="Epicurus (short games)", games=["gate", "cure"], folder="s2", script="s2", key="epicurus_s",
                  plan=(820, 863), notes=[5, 9], appd="7, 12, 20"),
 "seneca":   dict(who="Seneca", games=["letters", "sealring"], folder="s2", script="s2", key="seneca_s",
                  plan=(864, 906), notes=[6, 9], appd="6, 13"),
 "epictetus": dict(who="Epictetus", games=["chain", "crutch"], folder="s2", script="s2", key="epictetus_s",
                  plan=(907, 950), notes=[7, 9], appd="12"),
 "marcus":   dict(who="Marcus Aurelius", games=["morning", "danube"], folder="s2", script="s2", key="marcus_s",
                  plan=(951, 994), notes=[8, 9], appd="21"),
}

CHANGES = {
 "garden": """- **Rill:** the painted rill is at **y 110** (band 102–118), not 92. Rafts ride at y 110. `MINI_ART.garden.geo.rill`.
- **Table:** painted table **x 18–166, top 162–188**; plates (snap spots) at **y 176** (`geo.plateY`). Keep the brief's seat x positions per stage (I: 56, 96, 136; II: 36, 76, 116, 156; III: 32, 64, 96, 128, 160); all fit on the painted bench (x 22–160). Guests sit behind the table (feet on the bench line, about y 160); keep heads near y 146 and need bubbles near y 134 as briefed. Drop zones stay seat x ± 15, y 120–190.
- **Lamp:** the painted table lamp is at **(96, 168)** (`geo.lamp`); the glow is centred there (brief: (96, 160)).
- **Gate:** opening x 14–48, y 212–240 in the bottom wall; wait spots (14, 214), (28, 214), (42, 214) as briefed.
- **Worry clouds** drift up from the guest (about y 130) toward the moon (y 60). Keep the brief's 10 s life and drain.
- **Stage III wash:** `gradeN(c,'storm',0.4)`.
- **Dish sizes (art):** N and V dishes 36 px wide (18 units), E dishes 48 px wide (24 units), aspect kept (goblet is 84 px tall: 42 units). Hit boxes stay 26 × 26 units. `raft` 48 × 24 px, `lamp` 38 × 40 px, `jug` 25 × 36 px.
- The garden plate (`MINI_ART.garden.plate`) is v3 (approved). The engine fades the plate in; you do not draw it.""",
 "socrates": """- **City gate:** the painted gate is at **(26, 86)** (opening x 14–40, y 72–98): `MINI_ART.socrates_s.geo.gate`. Use it as the end of branch B3 in *Seventy Years* (brief default (18, 74)). Read it from the geo with a fallback to (26, 86) if art data is missing.
- **Square:** x 64–160, y 98–250; houses left x 0–64, right x 160–192; the Acropolis upper right. Keep the brief's polyline P0–P9 and branches exactly (the path is code-drawn; P0–P2 lie near the left houses).
- *What Holds It Up?* uses `gradeN(c,'dawn',0.5)`. *Seventy Years* uses the backdrop as it is (night).""",
 "aristotle": """- Colonnade y 0–52 (floor at 50); lawn x 20–168, y 52–260; gravel path x 86–106; grotto x 132–192, y 76–128 (mouth (166, 110)); trees left x 0–22 and right x 168–192.
- *Practice Shots:* the target point **T = (96, 104)** is on the painted path, as briefed. `target` is 77 × 80 px (about 38 × 40 units; gold ring radius 5 units is a code ring drawn over it, centred on T).
- *The Covered Walk:* `gradeN(c,'dusk',0.4)`. The brief puts the walkers' feet at y 136 and column tops at y 70–80; the painted colonnade is at y 0–52. Keep the brief's numbers: your scrolling code columns (70 units tall, every 48 units) form the walk in front of the painted lawn. `column` is 42 × 140 px (21 × 70 units).
- Gemini drew two fig trees; use the one rect named `figtree`. The web was re-toned grey-white.""",
 "epicurus": """- **Gate:** painted gate at **(18, 212)** (opening x 10–26, y 200–224), not (14, 224). Guests enter there; the peg rack stays beside it at about (30, 204).
- **Lamp:** the painted bronze lamp post is at **(96, 146)**, its flame at **(96, 136)** (brief default (96, 128)). In *Four Moths*, centre the moth orbit and the glow on the flame (96, 136); keep the four corner lanterns at the briefed corners. In *Friends at the Gate* the bloom gathers pairs around the lamp at (96, 146).
- **Benches:** painted benches y 78–96 (bench line `benchY` 88). Seat pairs at the brief's x spots (24…168) on **y 88** (brief y 66), so they sit on the painted benches. Guest grid y 112 and 160 stays.
- *Four Moths* uses `gradeN(c,'night',0.5)`. `in_stars` is one icon made of three stars.""",
 "seneca": """- The backdrop keeps the top of the image. Bay y 0–224 (open water x 40–152; rocks left x 0–40, right x 152–192; harbor light (96, 8)); balustrade y 226–270; desk y 272–320 (desk lamp (66, 270)).
- **Rehearse the Storm: the boat sits at about y 200** (Cade; brief y 222, which is on the balustrade). Move every boat-relative number by the same offset (the sight distances, the rock hit test). The Sail button at (96, 232) stays on the balustrade.
- `letter` is the parchment turned upright, 160 × 200 px (80 × 100 units): draw it at 2× to fill the x 16–176, y 20–220 overlay.
- *A Steady Hand* uses `gradeN(c,'night',0.6)` plus `vignette`. `document` is 96 × 95 px with the wax disk; `chair` 63 × 96 px; `ring` 64 × 61 px (a slight angle). Seneca: `sen_idle_0/1` (standing) and `sen_calm`.""",
 "epictetus": """- **Backdrop (approved as is, v2):** cliff face x 122–192 from **top y 80**; school door **(150, 66)** (box x 144–156, y 56–78); left ledge x 0–52, top y 192 (decoration only); rubble y 236–272.
- **Use What Falls:** keep the brief's grid exactly (6 columns, x 24–168, row-0 base y 232, h = [1,0,0,0,0,6]). Draw every column in code from the `block` sprite, **in front of** the painted cliff (columns 4–5 overlap it; Cade approved this). Column 5 stays a fixed height-6 column (top y 88). The finish is reaching column 5; in the bloom he climbs from column 5's top to the painted door (150, 66), leans the crutch, sits.
- **The Free Mind:** `gradeN(c,'night',0.7)` behind the code maze. The exit cell E is at row 0 (x 96, y 36); draw a code doorway glow there for the bloom.
- `block` 48 × 48 and `slab` 96 × 48 px fit the 24-unit cells exactly.""",
 "marcus": """- Tent x 10–96, y 58–132 (mouth (64, 118)); clearing y 100–160; river y 164–256 (the lanes 172/196/220 fit); near bank y 258–320.
- **Whatever Comes: the stone is at (140, 224)** (box x 124–156, y 216–232), not x 166. **Put the now-line at x 120** (just upstream of the stone; Cade: "for example x 122–126", so the band's right edge stays clear of the stone box). Use `NOW = 120` as one constant; every other rule (±8 window, 40-unit early zone) is measured from it.
- *Morning Reminder:* Marcus sits at the tent mouth (52, 150) and visitors stop at (104, 156), as briefed. The provoke poses follow the brief's order: v0 busybody, v1 ungrateful, v2 arrogant, v3 deceitful, v4 envious, v5 unsocial.
- *Whatever Comes* uses `gradeN(c,'day',0.3)`.""",
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
- **Art.** Draw with your key and the names in §6 (`mPiece(c,"«key»","name",x,y,o)`, `mPerson(c,"«key»","name",x,y,o)`; read `work/mini/fx.js` for the options: scale, flip, alpha, anchor). Every game must play with no art loaded (code fallbacks).
"""

def brief(sub, d):
    ids = d["games"]; key = d["key"]; script = d["script"]; folder = d["folder"]
    full = folder.startswith("f")
    job = (f"the full game of Epicurus: `garden`" if full else
           f"the short games of {d['who']}: " + ", ".join(f"`{i}`" for i in ids))
    srcs = ", ".join(f"`work_src/{folder}/{i}.js`" for i in ids)
    kits = ", ".join(f"`kits/p41/{i}.py`" for i in ids)
    idstr = ",".join(ids)
    notes = "\n".join(NOTES[n] for n in d["notes"])
    out = f"""# Subagent brief — Phase 41B, subagent `{sub}`

*Filled by the lead (Opus) from the Phase 38 template on October 6, 2026. Read all of it before you write code.*

## 0. Your job

You build {job} for *The Examined Life*, a browser game. You work alone in your own copy of the workspace: `/home/claude/el-{sub}`. You cannot talk to Cade. When the brief is not clear, choose the reading that keeps the rule exact, and list it in your report.

**Model:** Sonnet. **Lead:** Opus. The lead reviews your diff, your kit result, and your screenshots against the plan rules. **Rule fidelity is strict:** build each rule exactly. Do not simplify a rule. If a rule does not work, say so plainly in the report and propose a correction.

**Machine note:** this machine has 2 CPUs and 7 GB of memory, and 7 builders share it. Run the kit only for your own ids (§7), and only when your game is ready; a second run only after a fix. Do not start more than one kit run at a time. A speed check that reads high may come from the shared load: report the number; do not cut a rule to lower it. Do not use `--mini-shots` on any game but your own. Never run the full kit. Never touch `/home/claude/el`, `/home/claude/src`, or another builder's folder.

**Not your job:** publishing, uploads, art processing, Cade's computer folders, and the handoff. The lead does those. Ignore the digest's publish rules (§3.4 below) except as background. Do not add facts that are not in your brief.

## 1. Restore

```
mkdir -p /home/claude/el-{sub} && cd /home/claude/el-{sub}
unzip -q -o /home/claude/src/after41a.zip
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

## 5. Your game brief(s) — Plan 5, Phase 41B, word for word

{L(*d['plan']).rstrip()}

### 5.1 Approved changes that override the brief (Cade and the art handoff, October 6, 2026)

These positions moved to fit the painted art. They win over the brief text. The rules do not change.

{CHANGES[sub]}
- Where a brief position and the handoff geometry (§6) disagree for other items, follow the §6.1 notes; else keep the brief.
- Grades: where the brief writes `grade('<name>')`, use `gradeN(c,'<name>',a)` (PART A, A4).

### 5.2 Lead decisions on the briefs (Plan 5, Appendix D, in full; the items for your games: {d['appd']})

{APPX_D}

### 5.3 Sources behind the designs (Plan 5, Appendix C, Level II)

{APPX_C2}

## 6. Art numbers — Phase 41A handoff §4 and §5 (your parts)

Your key is **`MINI_ART.{key}`**. The lead has already written it into the script's `MINI_ART` block. Do not change that block.

{HO_INTRO}

{ho_entry(key)}

### 6.1 Notes for 41B (layout and art facts, from the art handoff §5)

{notes}

## 7. Kit

Your module(s): {kits}. Shape:

```python
# kit checks for <id> (Plan 5, Phase 41B)
async def run(kit, b, pg):
    G = "p41"
    r = await pg.evaluate(\"\"\"(()=>{{const g=MINI.<id>;const s={{W:192,H:320,rm:false,t:0}};g.init(s);
      /* set up the exact situation of the rule, step with miniBlankInp() + the input you need, and return what happened */
      return {{}}}})()\"\"\")
    ok = True  # the defining rule, tested directly
    kit.add(G, "rules_<id>", ok, "what was measured, in plain words")
```

- Add one `kit.add` line for each named check in the brief's **Kit** row (for example `{ids[0]}_…`), plus one summary `rules_<id>` line. Each tests the **defining rule** directly, not only that the game wins.
- The group also runs `mini_suite` and `hd_suite` ({'full mode' if full else 'short mode'}) on your game(s).
- Your command (your group and your ids only; never the full kit):
  `cd /home/claude/el-{sub} && python3 -u kit.py work/index.html --blobs blobs --only p41 --mini-ids {idstr} --mini-shots shots-{sub}`
- It must end with no ❌ in group `p41` for your ids, and `RESULT: PASS`.

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

os.makedirs(f"{EL}/briefs41b", exist_ok=True)
for sub, d in BASE.items():
    t = brief(sub, d)
    open(f"{EL}/briefs41b/{sub}.md", "w", encoding="utf-8").write(t)
    print(sub, len(t))
