/* Design-time search for the Two Lights puzzles (Phase 34B). Run: node tools/l4_puzzles.js <mode> [seed]  (mode: 1 = Stage I, A = Stage II amber+blue, B = Stage II rose+green)
   Prints candidate layouts as JSON; the chosen ones are hard-coded in work_src/l4/lights.js and re-verified by the kit. */
const W = 7, H = 8, ALT = [3, 7];
const GOLD = { at: [3, 0], dir: [0, 1] }, SILV = { at: [0, 4], dir: [1, 0] };
function trace(e, mir, panes) {
  let [c, r] = e.at, [dx, dy] = e.dir, tint = null, np = 0;
  const cells = [];
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
const COMP = { amber: "blue", blue: "amber", rose: "green", green: "rose" };
function solved(mode, g, s) {
  if (!g.altar || !s.altar) return false;
  if (mode === "1") return g.np >= 1 && s.np >= 1;
  return !!g.tint && COMP[g.tint] === s.tint;
}
let seed = +(process.argv[3] || 1);
const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
const pick = a => a[Math.floor(rnd() * a.length)];
const mode = process.argv[2] || "1";
const cellsNave = []; for (let c = 1; c <= 5; c++) for (let r = 2; r <= 6; r++) cellsNave.push([c, r]);
const extra = [[0, 4], [6, 4], [3, 1], [1, 1]];
function evalState(mirs, st, panes) {
  const mir = {}; mirs.forEach((m, i) => mir[m[0] + "," + m[1]] = st >> i & 1 ? "\\" : "/");
  return [trace(GOLD, mir, panes), trace(SILV, mir, panes), mir];
}
const out = [];
for (let it = 0; it < 200000 && out.length < 12; it++) {
  const n = 5 + Math.floor(rnd() * 2);
  const pool = cellsNave.slice(); const mirs = [];
  for (let i = 0; i < n; i++) mirs.push(pool.splice(Math.floor(rnd() * pool.length), 1)[0]);
  const np = mode === "1" ? 3 : 4;
  const panes = {};
  const colors = mode === "1" ? ["clear", "clear", "clear"] : mode === "A" ? ["amber", "blue", pick(["rose", "green"]), pick(["amber", "blue", "rose", "green"])] : ["rose", "green", pick(["amber", "blue"]), pick(["amber", "blue", "rose", "green"])];
  for (let i = 0; i < np; i++) { const q = pool.splice(Math.floor(rnd() * pool.length), 1)[0]; panes[q[0] + "," + q[1]] = colors[i]; }
  const N = 1 << n, res = [];
  for (let st = 0; st < N; st++) { const [g, s] = evalState(mirs, st, panes); res.push([g, s]); }
  const sols = []; for (let st = 0; st < N; st++) if (solved(mode, res[st][0], res[st][1])) sols.push(st);
  if (sols.length < 1 || sols.length > 2) continue;
  const pc = x => { let k = 0; while (x) { k += x & 1; x >>= 1; } return k; };
  // a start: not solved, distance 3..5 to the nearest solution; in Stage II both beams arrive with a wrong pair
  const starts = [];
  for (let st = 0; st < N; st++) {
    const d = Math.min(...sols.map(q => pc(q ^ st)));
    if (d < 3 || d > 5) continue;
    const [g, s] = res[st];
    if (mode !== "1" && !(g.altar && s.altar && g.tint && s.tint)) continue;
    if (mode === "1" && (g.altar && s.altar)) continue;
    starts.push([st, d]);
  }
  if (!starts.length) continue;
  // the solution must use, for each beam, panes (Stage I) / the right tints (Stage II); both beams must cross somewhere without a mirror in the solution
  const q = sols[0], [g, s] = res[q];
  const common = g.cells.filter(x => s.cells.includes(x) && !(x in evalState(mirs, q, panes)[2]));
  const [st, d] = pick(starts);
  out.push({ mirs, panes, sols: sols.map(x => x.toString(2).padStart(n, "0")), cross: common, start: st.toString(2).padStart(n, "0"), d, gt: g.tint, st: s.tint });
}
console.log(JSON.stringify(out, null, 0).replace(/\},\{/g, "},\n{"));
