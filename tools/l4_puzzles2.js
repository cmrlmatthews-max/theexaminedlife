/* Design-time search for the Two Lights puzzles (Phase 34B). Run: node tools/l4_puzzles2.js <mode> [seed] [count]
   mode 1 = Stage I (clear panes), A = Stage II amber+blue, B = Stage II rose+green.
   For many random mirror layouts, tries many pane placements and keeps puzzles with 1-3 solutions where the start has BOTH beams arriving with a wrong pair.
   Prints candidates as JSON; the chosen ones are hard-coded in work_src/l4/lights.js and re-verified by the kit. */
const W = 7, H = 8, ALT = [3, 7];
const GOLD = { at: [3, 0], dir: [0, 1] }, SILV = { at: [0, 4], dir: [1, 0] };
const COMP = { amber: "blue", blue: "amber", rose: "green", green: "rose" };
function trace(e, mir, panes) {
  let [c, r] = e.at, [dx, dy] = e.dir, tint = null, np = 0; const cells = [];
  for (let n = 0; n < 60; n++) {
    if (c < 0 || c >= W || r < 0 || r >= H) return { altar: false, tint, np, cells };
    cells.push(c + "," + r);
    if (c === ALT[0] && r === ALT[1]) return { altar: true, tint, np, cells };
    const k = c + "," + r;
    if (panes[k]) { tint = panes[k]; np++; }
    const m = mir[k];
    if (m) { if (m === "/") { const t = dx; dx = -dy; dy = -t; } else { const t = dx; dx = dy; dy = t; } }
    c += dx; r += dy;
  }
  return { altar: false, tint, np, cells };
}
let seed = +(process.argv[3] || 1);
const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
const pick = a => a[Math.floor(rnd() * a.length)];
const mode = process.argv[2] || "1", want = +(process.argv[4] || 8);
const solved = (g, s) => g.altar && s.altar && (mode === "1" ? g.np >= 1 && s.np >= 1 : !!g.tint && COMP[g.tint] === s.tint);
const pc = x => { let k = 0; while (x) { k += x & 1; x >>= 1; } return k; };
const E = process.env, NMIN = +(E.NMIN || 4), NMAX = +(E.NMAX || 6), C0 = +(E.C0 || 0), C1 = +(E.C1 || 6), R0 = +(E.R0 || 1), R1 = +(E.R1 || 7), MAXSOL = +(E.MAXSOL || 3);
const cellsAll = []; for (let c = C0; c <= C1; c++) for (let r = R0; r <= R1; r++) if (!(c === 3 && r === 7) && !(c === 3 && r === 6)) cellsAll.push([c, r]);
const out = [], R = { lay: 0, rich: 0, tries: 0 };
const t0 = Date.now();
while (out.length < want && Date.now() - t0 < 80000) {
  const n = NMIN + Math.floor(rnd() * (NMAX - NMIN + 1));
  const pool = cellsAll.slice(); const mirs = [];
  const take = (c, r) => { const i = pool.findIndex(p => p[0] === c && p[1] === r); if (i >= 0) mirs.push(pool.splice(i, 1)[0]); };
  take(3, 1 + Math.floor(rnd() * 5)); take(1 + Math.floor(rnd() * 5), 4);
  while (mirs.length < n) mirs.push(pool.splice(Math.floor(rnd() * pool.length), 1)[0]);
  const N = 1 << n, mirOf = st => { const m = {}; mirs.forEach((q, i) => m[q[0] + "," + q[1]] = (st >> i & 1) ? "\\" : "/"); return m; };
  R.lay++;
  const arr = [];
  for (let st = 0; st < N; st++) { const mir = mirOf(st), g = trace(GOLD, mir, {}), s = trace(SILV, mir, {}); if (g.altar && s.altar) arr.push(st); }
  if (arr.length < 3 || arr.length > 12) continue;
  R.rich++;
  const pathCells = new Set(); for (const st of arr) { const mir = mirOf(st); for (const e of [GOLD, SILV]) trace(e, mir, {}).cells.forEach(c => { if (!(c in mir) && c !== "3,7" && c !== "3,6") pathCells.add(c); }); }
  const pcs = [...pathCells]; if (pcs.length < 4) continue;
  for (let tr = 0; tr < 120; tr++) {
    R.tries++;
    const np = mode === "1" ? 3 : 4, panes = {}, pl = pcs.slice();
    const cols = mode === "1" ? ["clear", "clear", "clear"] : mode === "A" ? ["amber", "blue", pick(["amber", "blue", "rose", "green"]), pick(["rose", "green"])] : ["rose", "green", pick(["amber", "blue", "rose", "green"]), pick(["amber", "blue"])];
    for (let i = 0; i < np; i++) panes[pl.splice(Math.floor(rnd() * pl.length), 1)[0]] = cols[i];
    const res = []; for (let st = 0; st < N; st++) { const mir = mirOf(st); res.push([trace(GOLD, mir, panes), trace(SILV, mir, panes), mir]); }
    const sols = []; for (let st = 0; st < N; st++) if (solved(res[st][0], res[st][1])) sols.push(st);
    if (sols.length < 1 || sols.length > MAXSOL) continue;
    const bothArr = st => res[st][0].altar && res[st][1].altar;
    const wrongPair = st => mode === "1" ? (!solved(res[st][0], res[st][1]) && (res[st][0].altar || res[st][1].altar)) : bothArr(st) && !solved(res[st][0], res[st][1]) && (mode === "1" ? (res[st][0].np === 0 || res[st][1].np === 0) : (res[st][0].tint && res[st][1].tint));
    const starts = []; for (let st = 0; st < N; st++) { const d = Math.min(...sols.map(z => pc(z ^ st))); if (d >= +(process.env.DMIN || 2) && d <= +(process.env.DMAX || 4) && wrongPair(st)) starts.push([st, d]); }
    if (!starts.length) continue;
    const q = sols.find(z => { const m = res[z][2], g = res[z][0], s = res[z][1]; return g.cells.some(c => c in m) && s.cells.some(c => c in m) && g.cells.some(c => s.cells.includes(c) && !(c in m) && c !== "3,7"); });
    if (q === undefined) continue;
    const [st, d] = pick(starts), cross = res[q][0].cells.filter(c => res[q][1].cells.includes(c) && !(c in res[q][2]) && c !== "3,7");
    out.push({ mirs, panes, sols: sols.map(x => x.toString(2).padStart(n, "0")), cross, start: st.toString(2).padStart(n, "0"), d, sgt: res[st][0].tint, sst: res[st][1].tint, gp: res[q][0].cells.join(" "), sp: res[q][1].cells.join(" ") });
    break;
  }
}
console.error(JSON.stringify(R));
console.log(JSON.stringify(out).replace(/\},\{/g, "},\n{"));
