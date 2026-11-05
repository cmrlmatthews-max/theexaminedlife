# PAINT toolkit — contract for the Phase 47 parts

The toolkit is `window.PAINT`, made of part files in `mini/paint/`. A build step joins them in name order into `mini/paint.js`. PixiJS **v8.22.0** is loaded first as the global `PIXI` (file `mini/pixi.min.js`). Read `00-core.js` first: it owns the names in the table below. Do **not** redefine a name that another part owns.

## Fixed facts

- Design space: **360 × 780 units**. 1 unit = 1 PIXI pixel in `app.stage` (the renderer scales by resolution). Safe area: play stays below y = 44 and above y = 780 − 34.
- WebGL renderer only (`preference:"webgl"`). Filters must work in WebGL 1 and 2 (GLSL ES 1.00 or 3.00 through the v8 `Filter`/`GlProgram` API). No WebGPU program is needed, but `Filter.from({gl:{vertex,fragment}, resources})` must not throw.
- No other library. No network. No DOM changes except where a part says so.
- `PAINT.rm` is true when Reduce Motion is on. Reduce Motion: **no shake, no flashes, no fast zooms, no parallax drift**. Use crossfades and stills.
- Budgets for a whole game frame: CPU update ≤ 8 ms, ≤ 60 draw calls, ≤ 2,000 particles, ≤ 96 MB textures. Do not allocate objects in a per-frame path when you can reuse them. No `getImageData` in a frame.
- Every function that takes art must work with **no art** (texture `null`): draw a code fallback that still looks painted (soft gradients, layered translucent shapes), never a blank or a pink box.
- Write plain ES2020 in an IIFE: `(function(){ const P=window.PAINT; ... })();`. No modules, no classes exported to window except through `PAINT`.
- Code style: compact but readable; a one-line comment above each public function that gives its signature and units.

## Names owned by part 00 (core) — use, do not redefine

`W H SAFE app rm t ticks tx art gen stats clamp lerp ease rng hex init begin fresh clearView end on off frame render url load tex frameTex make radial toUnits sprite view world fx over ui cam game`

- `PAINT.begin(artMap)` makes `P.view` (holds `P.world`, `P.fx`, `P.over`) and `P.ui`, and resets `P.cam = {x,y,zoom,rot,shake,tx,ty,tz,k}`.
- `PAINT.on(fn)` registers `fn(dt,t)` for each frame until `PAINT.end()`. If `fn.dispose` exists, `end()` calls it.
- `PAINT.make(key,w,h,draw)` and `PAINT.radial(key,size,stops)` make cached generated textures.
- `PAINT.frame(dt)` runs the ticks, then calls `PAINT.applyCam()` if part 10 defined it.

## Parts and the names each one owns

| File | Owner | Names |
|---|---|---|
| `10-scene.js` | Scene + camera | `scene`, `applyCam`, `camTo`, `camFollow`, `shake`, `parallaxOf`, `paperGrain` |
| `20-light.js` | Light + grade | `light`, `shadow`, `rim`, `shafts`, `bloom`, `grade`, `vignette`, `LANDS` |
| `30-fx.js` | Particles + transitions + glass | `particles`, `PRESETS`, `burst`, `wash`, `glass`, `banner`, `pulse` |
| `40-actor.js` | Characters | `actor`, `puppet`, `frames`, `figure` |
| `50-input.js` | Input + auto + motion helpers | `drag`, `hold`, `lanes`, `path`, `flow`, `pick`, `finger`, `tween`, `tweens`, `autoTap`, `autoDrag`, `motion` |

## Shared conventions

- Colours: numbers (`0xF5C66A`) or `"#F5C66A"` strings; convert with `PAINT.hex`.
- Shared palette: glass gold `#F5C66A` / `#D9A93A`, lead line `#100B15`, night `#0E0B1A`.
- Land keys: `l1` Stormcliffs (plum `#8E3B5A`, crimson `#B23A48`, slate `#4A5568`, gold), `l2` Marble Coast (teal `#2F7470`, marble `#EDE6DA`, bronze `#A8743A`), `l3` Misty Valleys (jade `#4F7E3E`, ink `#15171A`, soft gold `#E8C873`), `l4` Clockwork City (bronze `#A0612E`, amber `#E0A040`, deep blue `#1E2E55`).
- Objects that a part makes return a small handle object with `.c` (its root `PIXI.Container`), `.set(...)`/`.update(...)` as needed, and `.destroy()`.
- Default parents: scene layers → `P.world`; lights → `P.fx`; weather → `P.over`; banners, glass → `P.ui`.
- The input object `inp` that the page passes to a game each frame (coordinates in 360 × 780 units): `{dx,dy,a,b,aTap,bTap,lTap,rTap,uTap,dTap,taps:[{x,y}],tap,down:{x,y}|null,drag:{x,y,dx,dy}|null,swipe:"left"|"right"|"up"|"down"|null,fingers,pinch,ups:[{x,y,t}]}`.
