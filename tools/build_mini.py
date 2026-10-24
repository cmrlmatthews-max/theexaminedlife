"""Plan 5 build tool (Phase 38). Assemble one Plan 5 script from its game sources.

Usage:  python3 tools/build_mini.py <script> [<script> ...]     e.g.  python3 tools/build_mini.py s1
        python3 tools/build_mini.py all                          (all seven: f1 f2 f3 s1 s2 s3 s4)

Reads tools/mini_manifest.json. Writes work/mini/<script>.js as:
  header comment
  /* MINI_ART:BEGIN */ ... /* MINI_ART:END */      (kept exactly as it is in the current file)
  /* GAME:<id>:BEGIN */ <work_src/<script>/<id>.js> /* GAME:<id>:END */   (one block per game, manifest order)
  MINI_LOADED.<script>=true;
A missing source file is skipped with a note. The result must pass `node --check`.
It refuses to write a script above 150 KB (digest caution line), and warns above the script's budget (A2)
and above the per-game size (full game 32 KB, short game 9 KB of source)."""
import json, os, re, subprocess, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MAN = json.load(open(os.path.join(ROOT, "tools", "mini_manifest.json"), encoding="utf-8"))
LIMIT = 150 * 1024
GAME_MAX = {"full": 32 * 1024, "short": 9 * 1024}


def art_block(path):
    """The MINI_ART block of the current file, kept byte for byte (an empty block if the file is new)."""
    empty = "/* MINI_ART:BEGIN */\n/* MINI_ART:END */"
    if not os.path.exists(path):
        return empty
    s = open(path, encoding="utf-8").read()
    m = re.search(r"/\* MINI_ART:BEGIN \*/.*?/\* MINI_ART:END \*/", s, re.S)
    return m.group(0) if m else empty


def build(key):
    if key not in MAN or key.startswith("_"):
        sys.exit(f"unknown script '{key}' (known: {', '.join(k for k in MAN if not k.startswith('_'))})")
    M = MAN[key]
    out_path = os.path.join(ROOT, "work", "mini", key + ".js")
    parts = [f"/* The Examined Life: {M['title']}. Plan 5. Loaded after l1.js-l4.js (fx.js first, boss.js last).\n"
             f"   Source: work_src/{key}/<id>.js, one file per game, assembled by tools/build_mini.py {key}. Do not edit the GAME blocks here. */",
             art_block(out_path)]
    notes, sizes, missing = [], {}, []
    for gid in M["games"]:
        src = os.path.join(ROOT, "work_src", key, gid + ".js")
        if not os.path.exists(src):
            missing.append(gid)
            continue
        body = open(src, encoding="utf-8").read().strip("\n")
        sizes[gid] = len(body.encode("utf-8"))
        if f"MINI.{gid}=" not in body.replace(" ", ""):
            notes.append(f"  ! {gid}: the source does not assign MINI.{gid}")
        first = re.sub(r"^(\s|/\*.*?\*/|//[^\n]*\n)*", "", body, flags=re.S)[:1]
        if first != "{":
            notes.append(f"  ! {gid}: the source is not wrapped in a block scope {{ … }}")
        if sizes[gid] > GAME_MAX[M["kind"]]:
            notes.append(f"  ! {gid}: {sizes[gid]:,} B is above the {M['kind']} game size ({GAME_MAX[M['kind']]:,} B)")
        # Phase 40B: each game runs inside its own function scope. A block-level `function f(){}` in sloppy mode
        # leaks to the global scope (Annex B) and once overwrote the page's rng(); the wrapper keeps it local.
        parts.append(f"/* GAME:{gid}:BEGIN */\n(function(){{\n{body}\n}})();\n/* GAME:{gid}:END */")
    parts.append(f"MINI_LOADED.{key}=true;\n")
    text = "\n".join(parts)
    data = text.encode("utf-8")
    if len(data) > LIMIT:
        print(f"{key}.js: REFUSED. {len(data):,} B is above the 150 KB caution line. Nothing written. Stop and ask Cade.")
        return False
    with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False, encoding="utf-8") as t:
        t.write(text)
        tmp = t.name
    r = subprocess.run(["node", "--check", tmp], capture_output=True, text=True)
    os.unlink(tmp)
    if r.returncode != 0:
        print(f"{key}.js: SYNTAX ERROR. Nothing written.\n{r.stderr[:1200]}")
        return False
    old = open(out_path, "rb").read() if os.path.exists(out_path) else None
    if old != data:
        open(out_path, "wb").write(data)
    over = len(data) > M["budget"] * 1024
    print(f"{key}.js: {len(data):,} B ({'unchanged' if old == data else 'written'}); budget {M['budget']} KB{' — ABOVE BUDGET' if over else ''}; "
          f"games built {len(sizes)}/{len(M['games'])}" + (": " + ", ".join(f"{g} {n:,} B" for g, n in sizes.items()) if sizes else ""))
    if missing:
        print(f"  - no source yet (skipped): {', '.join(missing)}")
    for n in notes:
        print(n)
    return True


if __name__ == "__main__":
    keys = sys.argv[1:] or ["all"]
    if keys == ["all"]:
        keys = [k for k in MAN if not k.startswith("_")]
    ok = all([build(k) for k in keys])
    sys.exit(0 if ok else 1)
