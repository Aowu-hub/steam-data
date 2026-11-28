
const CURRENT_PLAYER = SP_TV[0]; window.SP_PAGE = SP_TV[1]; window.NO_FEEDBACK_BUTTON = true;   /* the 📊 card sends the report instead */
try { UI.applyTheme(UI.cachedTheme(CURRENT_PLAYER), {kitOnly: true}); } catch(e){}
try { UI.navBar(document.getElementById('back-btn'), {}); } catch(e){}
(function navRoom(){ const n = document.getElementById('back-btn-nav'), app = document.getElementById('app'); if(!n) return; const fix = getComputedStyle(n).position === 'fixed';
  document.getElementById('top').style.setProperty('--nav-w', fix ? Math.ceil(n.getBoundingClientRect().right - app.getBoundingClientRect().left + 6) + 'px' : '0px'); })();
(function(){
'use strict';
/* ================= 🧊 boot: Three.js 0.187.0 from the importmap · loader · 3 s slow line · friendly cards ================= */
const $ = id => document.getElementById(id);
const PERF = {pageMs: performance.now(), threeMs: 0, buildMs: 0, firstMs: 0, fps: [], worst: 0, heat: '', sent: false};
const THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.187.0/build/three.module.min.js', THREE_FULL = 'https://cdn.jsdelivr.net/npm/three@0.187.0/build/three.module.js';
try { UI.KINDS.lab3d = ['🧊', 'Building the 3D islet', 'bob']; } catch(e){}
try { UI.loading('lab3d'); } catch(e){}
const slowT = setTimeout(() => { const t = document.querySelector('.ui-loader-text'); if(t) t.innerHTML = '🐢 Still loading the 3D engine… (slow internet?)'; }, 3000);   /* house rule: the "taking long" line after 3 s */
function card(icon, h, p, btn, fn){ $('card-i').textContent = icon; $('card-h').textContent = h; $('card-p').textContent = p; const b = $('card-b'); b.textContent = btn || '🔁 Try again'; b.onclick = fn || (() => location.reload()); $('card').classList.remove('hidden'); }
function fail(kind, err){ clearTimeout(slowT); try { UI.loaded(); } catch(e){} try { console.warn('[3dkit]', kind, err); } catch(e){}
  if(kind === 'gl') card('🧊', 'This device can’t draw 3D', 'Its browser has 3D pictures (WebGL) turned off — the rest of STEAM Playground still works.', '◀ Back', () => history.back());
  else card('📡', 'Can’t load the 3D engine', 'The 3D engine comes from the internet (jsDelivr). Check the Wi-Fi and try again.'); }
/* ================= 🧱 3d-t1 polygon ladder: round primitives get more segments (×√step each way); boxes, pyramids (< 6 sides), gems, extrudes + FX planes keep their shape.
   Each primitive remembers how it was made (WeakMap), so a step change rebuilds every builder IN PLACE — no page reload (the Apps Script frame can't reload itself). ================= */
const POLY = {f: 1, pm: new WeakMap(), cache: new Map()};
function polyT(T0){
  const T = Object.assign({}, T0), s = () => Math.sqrt(POLY.f), r = (n, min) => Math.max(min || 1, Math.round(n * s()));
  const FIX = {
    CylinderGeometry: a => { if((a[3] == null ? 32 : a[3]) >= 6) a[3] = r(a[3] == null ? 32 : a[3]); return a; },
    ConeGeometry: a => { if((a[2] == null ? 32 : a[2]) >= 6) a[2] = r(a[2] == null ? 32 : a[2]); return a; },
    IcosahedronGeometry: a => { a[1] = Math.max(0, Math.round(((a[1] || 0) + 1) * s()) - 1); return a; },
    TorusGeometry: a => { a[2] = r(a[2] == null ? 12 : a[2]); a[3] = r(a[3] == null ? 48 : a[3]); return a; },
    LatheGeometry: a => { a[1] = r(a[1] == null ? 12 : a[1]); return a; },
    SphereGeometry: a => { a[1] = r(a[1] == null ? 32 : a[1], 3); a[2] = r(a[2] == null ? 16 : a[2], 2); return a; }};
  Object.keys(FIX).forEach(name => { const Base = T0[name];
    T[name] = class extends Base { constructor(...a){ super(...FIX[name](a.slice())); POLY.pm.set(this, {name, a, ops: []}); }
      applyMatrix4(m){ const p = POLY.pm.get(this); if(p) p.ops.push(m.clone()); return super.applyMatrix4(m); }
      copy(src, rec){ super.copy(src, rec); const p = POLY.pm.get(src); if(p) POLY.pm.set(this, {name: p.name, a: p.a, ops: p.ops.slice()}); return this; } }; });
  T.polyRegen = g => { const p = POLY.pm.get(g); if(!p) return g; let n = POLY.cache.get(g); if(n) return n;
    n = new T[p.name](...p.a); p.ops.forEach(m => T0.BufferGeometry.prototype.applyMatrix4.call(n, m)); POLY.pm.set(n, {name: p.name, a: p.a, ops: p.ops.slice()}); POLY.cache.set(g, n); return n; };
  T.Base = T0; return T; }
const t0 = performance.now();
import('three').catch(() => import(THREE_FULL)).then(T => { PERF.threeMs = performance.now() - t0; try { start(T); } catch(e){ console.error(e); fail('gl', e); } }, e => fail('net', e));

function start(T0){
const T = polyT(T0), polyRegen = T.polyRegen;
/* 🎨 3d-t1 look-lab state (read BEFORE the world is built, so a saved 🧱 step builds once at that step) — panel + layers live in i_look.js */
const LAYERS = [['smooth', '🫧', 'Smooth'], ['warm', '🌗', 'Warm/cool'], ['paint', '🎨', 'Painted'], ['facets', '🧩', 'Facets'], ['ao', '🌑', 'Soft AO'], ['fog', '🌫️', 'Fog'], ['sky', '🌅', 'Sky'],
  ['motes', '✨', 'Motes'], ['grass', '🌾', 'Meadow'], ['sway', '🍃', 'Sway'], ['outline', '✏️', 'Outline'], ['rim', '💡', 'Rim'], ['glow', '🌟', 'Glow']];
const PRESETS = {
  t0:   {name: '🧊 T0',   poly: 1, L: {facets: 1, outline: 1}},
  low:  {name: '🪶 Low',  poly: 1, L: {smooth: 1, warm: 1, paint: 1, ao: 1, fog: 1, sway: 1, outline: 1}},
  med:  {name: '🌿 Med',  poly: 3, L: {smooth: 1, warm: 1, paint: 1, ao: 1, fog: 1, sky: 1, motes: 1, grass: 1, sway: 1, outline: 1, rim: 1}},
  high: {name: '🌟 High', poly: 3, L: {smooth: 1, warm: 1, paint: 1, ao: 1, fog: 1, sky: 1, motes: 1, grass: 1, sway: 1, outline: 1, rim: 1, glow: 1}}};
const LOOK = {L: {}, preset: 'med', poly: 1, cost: null, busy: false};
(function restore(){ let st = null; try { st = JSON.parse(sessionStorage.getItem('threelab.look') || 'null'); } catch(e){}
  const q = new URLSearchParams(location.search), pq = q.get('look'), pp = +q.get('poly');
  const pre = PRESETS[pq] ? pq : st && st.preset ? st.preset : 'med';
  LOOK.preset = pre; LOOK.L = Object.assign({}, st && !PRESETS[pq] && st.L ? st.L : PRESETS[pre === 'custom' ? 'med' : pre].L);
  LOOK.poly = [1, 2, 3, 4, 6, 8, 10, 16].includes(pp) ? pp : st && st.poly ? st.poly : PRESETS[pre === 'custom' ? 'med' : pre].poly; })();
POLY.f = LOOK.poly;
/* ================= helpers ================= */
const TAU = Math.PI * 2, clamp = (v, a, b) => v < a ? a : v > b ? b : v, lerp = (a, b, t) => a + (b - a) * t, sm = t => t * t * (3 - 2 * t);
const E = {out: t => 1 - Math.pow(1 - t, 3), in: t => t * t * t, io: t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2, back: t => { const c = 1.9; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); }};
const seg = (t, a, b) => clamp((t - a) / (b - a), 0, 1);
let seed = 20261128; const R = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const angDiff = (a, b) => Math.atan2(Math.sin(a - b), Math.cos(a - b));
const V3 = (x, y, z) => new T.Vector3(x, y, z);
const isPhone = (() => { try { return matchMedia('(pointer: coarse)').matches && Math.min(screen.width, screen.height) < 820; } catch(e){ return false; } })();
const isDesk = (() => { try { return matchMedia('(hover: hover) and (pointer: fine)').matches; } catch(e){ return false; } })();
function sound(k){ try { if(window.UISound) UISound.play(k); } catch(e){} }
function tone(f, d, o){ try { if(window.UISound && UISound.tone) UISound.tone(f, d, o || {}); } catch(e){} }
function toast(s, ms){ const el = $('toast'); el.textContent = s; el.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove('on'), ms || 2200); }

/* ================= 🖥️ renderer — phone rules (plan §5) ================= */
const cv = $('gl'); let renderer;
try { renderer = new T.WebGLRenderer({canvas: cv, antialias: true, alpha: true, powerPreference: 'high-performance'}); } catch(e){ fail('gl', e); return; }
renderer.setClearColor(0x000000, 0);
const SHARP = isPhone ? [1, 1.5, 2] : [1, 1.5, 2]; let sharp = isPhone ? 1.5 : 2;
function pixelRatio(){ const d = window.devicePixelRatio || 1, W = innerWidth, H = innerHeight; let p = Math.min(d, sharp); if(W * H * p * p > 3.2e6) p = Math.max(1, Math.sqrt(3.2e6 / (W * H))); return Math.round(p * 100) / 100; }   /* av-int1 lesson: cap big canvases at ≈ 3 MP */
const scene = new T.Scene();
scene.add(new T.HemisphereLight(0xEAF6FF, 0xB8A07C, 1.25));
const sun = new T.DirectionalLight(0xFFF1DA, 2.35); sun.position.set(-6, 12, 7); scene.add(sun);

/* ================= 🎨 the ONE toon material (3-step ramp, soft edge) + the ONE outline (inverted hull, same px width everywhere) =================
   3d-t1: the same material now carries every 🎨 appeal layer as a shared uniform (instant toggles, no recompile — plan §6c):
   🫧 smooth · 🌗 warm-light / cool-shadow ramp · 🎨 painted (part gradient + world noise) · 🧩 facets (T0 jitter) · 🌑 baked AO · 💡 rim · 🍃 sway */
const U = {uTime: {value: 0}, uSmooth: {value: 0}, uJit: {value: 1}, uGrad: {value: 0}, uAO: {value: 0}, uPaint: {value: 0}, uRimAll: {value: 0}, uSway: {value: 0}, uRimSky: {value: new T.Color(0xFFE2B8)}, uHaze: {value: 0}, uHazeCol: {value: new T.Color(0xF6E9E2)}};
function rampData(warm){ const n = 64, d = new Uint8Array(n * 4);
  const S = warm ? [0.40, 0.43, 0.72] : [0.52, 0.52, 0.52], Mi = warm ? [0.86, 0.80, 0.86] : [0.79, 0.79, 0.79], L = warm ? [1.0, 0.94, 0.80] : [1, 1, 1];
  for(let i = 0; i < n; i++){ const x = i / (n - 1), st = (e, w) => sm(clamp((x - e) / w + 0.5, 0, 1)), a = st(0.42, 0.07), b = st(0.66, 0.07);
    for(let c = 0; c < 3; c++) d[i * 4 + c] = Math.round(clamp(S[c] + (Mi[c] - S[c]) * a + (L[c] - Mi[c]) * b, 0, 1) * 255); d[i * 4 + 3] = 255; }
  return d; }
function rampTex(){ const t = new T.DataTexture(rampData(false), 64, 1, T.RGBAFormat); t.minFilter = t.magFilter = T.LinearFilter; t.generateMipmaps = false; t.needsUpdate = true; return t; }
const RAMP = rampTex();
function setRamp(warm){ RAMP.image.data.set(rampData(warm)); RAMP.needsUpdate = true; }
const NOISE_GLSL = 'float h3(vec3 p){ p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }\nfloat vn3(vec3 x){ vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);\n return mix(mix(mix(h3(i), h3(i + vec3(1,0,0)), f.x), mix(h3(i + vec3(0,1,0)), h3(i + vec3(1,1,0)), f.x), f.y), mix(mix(h3(i + vec3(0,0,1)), h3(i + vec3(1,0,1)), f.x), mix(h3(i + vec3(0,1,1)), h3(i + vec3(1,1,1)), f.x), f.y), f.z); }\n';
function patchToon(sh, rim){ Object.keys(U).forEach(k => sh.uniforms[k] = U[k]);
  sh.vertexShader = 'uniform float uTime, uSmooth, uJit, uGrad, uAO, uSway;\nattribute vec3 snorm; attribute float jit; attribute float grd; attribute float ao;\nvarying vec3 vWp;\n' + sh.vertexShader
    .replace('#include <beginnormal_vertex>', 'vec3 objectNormal = vec3( normal );\nif(uSmooth > 0.5 && dot(snorm, snorm) > 0.25) objectNormal = snorm;\n#ifdef USE_TANGENT\n vec3 objectTangent = vec3( tangent.xyz );\n#endif')
    .replace('#include <color_vertex>', '#include <color_vertex>\n#ifdef USE_COLOR\n vColor.rgb *= 1.0 + jit * uJit;\n { float gt = grd > 0.5 ? grd - 1.5 : 0.0; vColor.rgb *= mix(vec3(1.0), gt > 0.0 ? vec3(1.07, 1.04, 0.94) : vec3(0.90, 0.94, 1.08), abs(gt) * 2.0 * uGrad) * (1.0 + gt * 0.26 * uGrad); }\n vColor.rgb *= 1.0 - ao * uAO;\n#endif')
    .replace('#include <begin_vertex>', '#include <begin_vertex>\n#ifdef USE_SWAY\n{ float hh = max(position.y, 0.0); vec3 ip = vec3(0.0);\n#ifdef USE_INSTANCING\n ip = instanceMatrix[3].xyz;\n#endif\n float ph = uTime * 1.7 + ip.x * 0.71 + ip.z * 0.93; transformed.x += (sin(ph) * 0.05 + sin(ph * 2.3) * 0.015) * hh * hh * uSway; transformed.z += cos(ph * 0.83) * 0.04 * hh * hh * uSway; }\n#endif')
    .replace('#include <project_vertex>', '#include <project_vertex>\n{ vec4 w4 = vec4(transformed, 1.0);\n#ifdef USE_INSTANCING\n w4 = instanceMatrix * w4;\n#endif\n vWp = (modelMatrix * w4).xyz; }');
  sh.fragmentShader = 'uniform float uPaint, uRimAll, uHaze; uniform vec3 uRimSky, uHazeCol; varying vec3 vWp;\n' + NOISE_GLSL + sh.fragmentShader
    .replace('#include <gradientmap_pars_fragment>', '#ifdef USE_GRADIENTMAP\n uniform sampler2D gradientMap;\n#endif\nvec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ){ float dotNL = dot( normal, lightDirection ); vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );\n#ifdef USE_GRADIENTMAP\n return texture2D( gradientMap, coord ).rgb;\n#else\n vec2 fw = fwidth( coord ) * 0.5; return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );\n#endif\n}')
    .replace('#include <color_fragment>', '#include <color_fragment>\nif(uPaint > 0.0){ float pn = vn3(vWp * 0.32) * 0.6 + vn3(vWp * 1.3) * 0.4; diffuseColor.rgb *= 1.0 + (pn - 0.5) * 0.36 * uPaint;\n diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * vec3(0.84, 0.89, 1.1), clamp(-vWp.y / 8.0, 0.0, 1.0) * uPaint); }')
    .replace('#include <opaque_fragment>', '#include <opaque_fragment>\n{ vec3 vd = isOrthographic ? vec3(0.0, 0.0, 1.0) : normalize(vViewPosition); float rr = pow(1.0 - clamp(dot(normal, vd), 0.0, 1.0), 3.0); gl_FragColor.rgb += uRimSky * rr * uRimAll * 0.32;' + (rim ? ' float rm = pow(1.0 - clamp(dot(normal, vd), 0.0, 1.0), 2.6); gl_FragColor.rgb += uRimCol * rm * uRim;' : '') + ' }\n gl_FragColor.rgb = mix(gl_FragColor.rgb, uHazeCol, clamp((-vWp.y - 1.2) / 12.0, 0.0, 0.5) * uHaze);'); }
const TOON = new T.MeshToonMaterial({vertexColors: true, gradientMap: RAMP});
TOON.onBeforeCompile = sh => patchToon(sh); TOON.customProgramCacheKey = () => 'toon3';
const SWAYM = new T.MeshToonMaterial({vertexColors: true, gradientMap: RAMP}); SWAYM.defines = {USE_SWAY: ''};   /* 🍃 trees · palms · bushes · grass (style rule: plants breathe in the wind) */
SWAYM.onBeforeCompile = sh => patchToon(sh); SWAYM.customProgramCacheKey = () => 'toonsway3';
function rimMat(col, k){ const m = TOON.clone(); m.userData.rim = {value: k}; m.userData.rimCol = {value: new T.Color(col)};   /* rim light = bosses · magic · loot only (style rule §4) */
  m.onBeforeCompile = sh => { patchToon(sh, true); sh.uniforms.uRim = m.userData.rim; sh.uniforms.uRimCol = m.userData.rimCol; sh.fragmentShader = 'uniform float uRim; uniform vec3 uRimCol;\n' + sh.fragmentShader; };
  m.customProgramCacheKey = () => 'rim3'; return m; }
const OUTU = {uW: {value: 2.2}, uRes: {value: new T.Vector2(1, 1)}, uCol: {value: new T.Color(0x3A2B36)}};
function outMat(sway){ const m = new T.ShaderMaterial({side: T.BackSide, uniforms: {uW: OUTU.uW, uRes: OUTU.uRes, uCol: OUTU.uCol, uTime: U.uTime, uSway: U.uSway, uHaze: U.uHaze, uHazeCol: U.uHazeCol},
  vertexShader: 'attribute vec3 onorm; uniform float uW, uTime, uSway; uniform vec2 uRes; varying float vHy;\nvoid main(){ vec4 p = vec4(position, 1.0); vec3 n = onorm;\n#ifdef USE_SWAY\n{ float hh = max(position.y, 0.0); vec3 ip = vec3(0.0);\n#ifdef USE_INSTANCING\n ip = instanceMatrix[3].xyz;\n#endif\n float ph = uTime * 1.7 + ip.x * 0.71 + ip.z * 0.93; p.x += (sin(ph) * 0.05 + sin(ph * 2.3) * 0.015) * hh * hh * uSway; p.z += cos(ph * 0.83) * 0.04 * hh * hh * uSway; }\n#endif\n#ifdef USE_INSTANCING\n p = instanceMatrix * p; n = mat3(instanceMatrix) * n;\n#endif\n vHy = (modelMatrix * p).y; vec4 c = projectionMatrix * modelViewMatrix * p; vec3 vn = mat3(modelViewMatrix) * n; vec2 d = vn.xy; float L = length(d); d = L > 1e-5 ? d / L : vec2(0.0);\n c.xy += d * uW * 2.0 / uRes * c.w; gl_Position = c; }',
  fragmentShader: 'uniform vec3 uCol, uHazeCol; uniform float uHaze; varying float vHy; void main(){ gl_FragColor = vec4(mix(uCol, uHazeCol, clamp((-vHy - 1.2) / 12.0, 0.0, 0.5) * uHaze), 1.0);\n#include <colorspace_fragment>\n}'}); if(sway) m.defines = {USE_SWAY: ''}; return m; }
const OUT = outMat(false), OUT_SW = outMat(true);
const outFor = mat => mat === SWAYM ? OUT_SW : OUT;
const BASIC = new T.MeshBasicMaterial({vertexColors: true});

/* ================= 🧱 merge builder: every part = ONE mesh with vertex colours.
   Attributes: onorm (smooth, for the hull) · normal (flat = the T0 low-poly look) · snorm (creased smooth ≤ 50° = 🫧) · jit (T0 face colour jitter) · grd (height in its part = 🎨 gradient) · ao (🌑 baked AO).
   Every builder keeps its recipe (ops), so the 🧱 polygon ladder can rebuild it in place with more segments (POLY, top of start()). ================= */
const _q = new T.Quaternion(), _e = new T.Euler(), _v = new T.Vector3(), _s = new T.Vector3();
function M(x, y, z, rx, ry, rz, sx, sy, sz){ return new T.Matrix4().compose(_v.set(x || 0, y || 0, z || 0), _q.setFromEuler(_e.set(rx || 0, ry || 0, rz || 0)), _s.set(sx == null ? 1 : sx, sy == null ? (sx == null ? 1 : sx) : sy, sz == null ? (sx == null ? 1 : sx) : sz)); }
const pkey = (p, i) => Math.round(p[i] * 400) + ',' + Math.round(p[i + 1] * 400) + ',' + Math.round(p[i + 2] * 400);
function smoothN(p){ const map = new Map(), n = new Float32Array(p.length), key = i => pkey(p, i);
  for(let i = 0; i < p.length; i += 9){ const ax = p[i + 3] - p[i], ay = p[i + 4] - p[i + 1], az = p[i + 5] - p[i + 2], bx = p[i + 6] - p[i], by = p[i + 7] - p[i + 1], bz = p[i + 8] - p[i + 2];
    const cx = ay * bz - az * by, cy = az * bx - ax * bz, cz = ax * by - ay * bx;
    for(let v = 0; v < 9; v += 3){ const k = key(i + v); let a = map.get(k); if(!a){ a = [0, 0, 0]; map.set(k, a); } a[0] += cx; a[1] += cy; a[2] += cz; } }
  for(let i = 0; i < p.length; i += 3){ const a = map.get(key(i)), L = Math.hypot(a[0], a[1], a[2]) || 1; n[i] = a[0] / L; n[i + 1] = a[1] / L; n[i + 2] = a[2] / L; }
  return n; }
function creaseN(p, cosT){ const nF = p.length / 9, fa = new Float32Array(nF * 3), fu = new Float32Array(nF * 3), map = new Map(), out = new Float32Array(p.length);
  for(let f = 0, i = 0; f < nF; f++, i += 9){ const ax = p[i + 3] - p[i], ay = p[i + 4] - p[i + 1], az = p[i + 5] - p[i + 2], bx = p[i + 6] - p[i], by = p[i + 7] - p[i + 1], bz = p[i + 8] - p[i + 2];
    const cx = ay * bz - az * by, cy = az * bx - ax * bz, cz = ax * by - ay * bx, L = Math.hypot(cx, cy, cz) || 1;
    fa[f * 3] = cx; fa[f * 3 + 1] = cy; fa[f * 3 + 2] = cz; fu[f * 3] = cx / L; fu[f * 3 + 1] = cy / L; fu[f * 3 + 2] = cz / L;
    for(let v = 0; v < 9; v += 3){ const k = pkey(p, i + v); const a = map.get(k); if(a) a.push(f); else map.set(k, [f]); } }
  for(let f = 0, i = 0; f < nF; f++, i += 9) for(let v = 0; v < 9; v += 3){ const list = map.get(pkey(p, i + v)); let sx = 0, sy = 0, sz = 0;
    for(const g of list) if(fu[f * 3] * fu[g * 3] + fu[f * 3 + 1] * fu[g * 3 + 1] + fu[f * 3 + 2] * fu[g * 3 + 2] >= cosT){ sx += fa[g * 3]; sy += fa[g * 3 + 1]; sz += fa[g * 3 + 2]; }
    const L = Math.hypot(sx, sy, sz) || 1; out[i + v] = sx / L; out[i + v + 1] = sy / L; out[i + v + 2] = sz / L; }
  return out; }
const _c = new T.Color(), hash1 = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const BLDS = new Map();   /* geometry → its builder (for the 🧱 rebuild) */
class Bld { constructor(){ this.P = []; this.C = []; this.N = []; this.J = []; this.A = []; this.Y = []; this.ops = []; this.rb = false; this.nf = 0; }
  _k(jit){ if(!jit) return 0; const r = this.rb ? hash1(this.nf++) : R(); return (r - 0.5) * jit; }   /* first build uses R() like T0 (same islet); a rebuild uses a hash */
  _part(g, col, jit, colFn){ const p = g.attributes.position.array, on = smoothN(p); let y0 = 1e9, y1 = -1e9; for(let i = 1; i < p.length; i += 3){ if(p[i] < y0) y0 = p[i]; if(p[i] > y1) y1 = p[i]; }
    const rg = y1 - y0, flat = rg < 0.04;
    for(let f = 0; f < p.length; f += 9){ const k = this._k(jit), c = colFn ? colFn(f) : _c.set(col); for(let v = 0; v < 3; v++){ this.C.push(c.r, c.g, c.b); this.J.push(k); } }
    for(let i = 0; i < p.length; i += 3){ const t = flat ? 1 : (p[i + 1] - y0) / rg; this.P.push(p[i], p[i + 1], p[i + 2]); this.N.push(on[i], on[i + 1], on[i + 2]);
      this.Y.push(flat ? 0 : 1 + t); this.A.push(clamp(0.46 * (1 - t) * (1 - t) + 0.3 * Math.max(0, -on[i + 1]), 0, 0.72)); } }
  add(geo, col, m, jit){ this.ops.push(['add', geo, col, m ? m.clone() : null, jit]); const g = geo.index ? geo.toNonIndexed() : geo.clone(); if(m) g.applyMatrix4(m); this._part(g, col, jit); g.dispose(); return this; }
  split(geo, top, bot, m, cut, jit){ this.ops.push(['split', geo, top, bot, m ? m.clone() : null, cut, jit]); const g = geo.index ? geo.toNonIndexed() : geo.clone(); if(m) g.applyMatrix4(m);   /* two colours by height (naga jade back + pale belly) */
    const q = g.attributes.position.array, ty = m ? m.elements[13] : 0, ct = new T.Color(top), cb = new T.Color(bot);
    this._part(g, top, jit, f => ((q[f + 1] + q[f + 4] + q[f + 7]) / 3 - ty) < cut ? cb : ct); g.dispose(); return this; }
  tri(a, b, c, col, jit){ this.ops.push(['tri', a.clone(), b.clone(), c.clone(), col, jit]); const k = this._k(jit); _c.set(col);
    for(const q of [a, b, c]){ this.P.push(q.x, q.y, q.z); this.C.push(_c.r, _c.g, _c.b); this.J.push(k); this.N.push(0, 0, 0); this.Y.push(0); this.A.push(0); } return this; }
  geo(){ const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(this.P, 3)); g.setAttribute('color', new T.Float32BufferAttribute(this.C, 3));
    g.setAttribute('onorm', new T.Float32BufferAttribute(this.N, 3)); g.setAttribute('snorm', new T.Float32BufferAttribute(creaseN(this.P, 0.64), 3));
    g.setAttribute('jit', new T.Float32BufferAttribute(this.J, 1)); g.setAttribute('grd', new T.Float32BufferAttribute(this.Y, 1)); g.setAttribute('ao', new T.Float32BufferAttribute(this.A, 1));
    g.computeVertexNormals(); g.computeBoundingSphere(); BLDS.set(g, this); return g; }
  replay(){ const b = new Bld(); b.rb = true; for(const o of this.ops){ if(o[0] === 'add') b.add(polyRegen(o[1]), o[2], o[3], o[4]); else if(o[0] === 'split') b.split(polyRegen(o[1]), o[2], o[3], o[4], o[5], o[6]); else b.tri(o[1], o[2], o[3], o[4], o[5]); } return b; }
  mesh(mat, outline){ const m = new T.Mesh(this.geo(), mat || TOON); if(outline !== false) m.add(new T.Mesh(m.geometry, outFor(mat || TOON))); return m; } }
function outlined(mesh){ mesh.add(new T.Mesh(mesh.geometry, outFor(mesh.material))); return mesh; }
function instanced(geo, mat, n, outline){ const im = new T.InstancedMesh(geo, mat || TOON, n); im.frustumCulled = false; im.instanceMatrix.setUsage(T.DynamicDrawUsage);
  if(outline !== false){ const o = new T.InstancedMesh(geo, outFor(mat || TOON), n); o.instanceMatrix = im.instanceMatrix; o.frustumCulled = false; im.add(o); im.userData.out = o; } return im; }
function setCount(im, n){ im.count = n; im.visible = n > 0; if(im.userData.out) im.userData.out.count = n; }   /* an empty layer costs no draw call */
const G = {box: new T.BoxGeometry(1, 1, 1), cyl6: new T.CylinderGeometry(0.5, 0.5, 1, 6), cyl8: new T.CylinderGeometry(0.5, 0.5, 1, 8), ico0: new T.IcosahedronGeometry(0.5, 0), ico1: new T.IcosahedronGeometry(0.5, 1),
  cone6: new T.ConeGeometry(0.5, 1, 6), cone5: new T.ConeGeometry(0.5, 1, 5), cone4: new T.ConeGeometry(0.5, 1, 4), oct: new T.OctahedronGeometry(0.5, 0), disc7: new T.CylinderGeometry(0.5, 0.5, 1, 7)};
function prism(){ const s = new T.Shape(); s.moveTo(-0.5, 0); s.lineTo(0.5, 0); s.lineTo(0, 1); s.lineTo(-0.5, 0); const g = new T.ExtrudeGeometry(s, {depth: 1, bevelEnabled: false}); g.translate(0, 0, -0.5); return g; }
G.prism = prism();
function radialTex(stops){ const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  stops.forEach(s => gr.addColorStop(s[0], s[1])); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; return t; }

/* ================= 🏝️ ④ River Temple · วัดริมน้ำ — the floating islet (Islet Design Guide §4 ④ card: ring + lagoon, 🌟 the old prang on the lagoon island,
   🗼 🔔 bell frame NE · 🐉 naga stair S, districts: ferry dock (arrive, W) · ruin ring (sacred) · lagoon · naga stair · monk's hut). Free outline (Q13) + hanging rock (Q14). ================= */
const C = {grass: '#8CC66A', grass2: '#79B65C', moss: '#6AA552', lip: '#76B356', dirt: '#9C6A44', dirt2: '#87593A', rock1: '#8E7562', rock2: '#7A675A', rock3: '#665850', rock4: '#56494A',
  sand: '#EAD6A8', stone: '#D3C7AA', stone2: '#BFB295', laterite: '#C98A68', sandstone: '#CDA57C', sandstone2: '#B98E66', gold: '#E0B547', wood: '#B57B4A', wood2: '#8E5B36',
  roof: '#E2733A', roof2: '#3E8E5A', red: '#C0392B', white: '#F4EEE2', water: '#41B6C8', water2: '#9EE3E6', leaf: '#5DAE4E', leaf2: '#4C9A45', leaf3: '#3F8A3E', palm: '#62B35A', trunk: '#7A5236',
  lotus: '#5FAE53', pink: '#F59BB8', cloud: '#FFFFFF', bronze: '#B98A3E'};
const ISLE_R = 1.9;
const Rout = a => 11.2 + 1.0 * Math.sin(2 * a + 0.7) + 0.55 * Math.sin(3 * a + 2.1) + 0.3 * Math.sin(5 * a + 0.3) - 1.5 * Math.exp(-Math.pow(angDiff(a, Math.PI) / 0.34, 2)) + 0.6 * Math.exp(-Math.pow(angDiff(a, Math.PI / 2) / 0.5, 2));
const Rin = a => 6.3 + 0.45 * Math.sin(2 * a + 1.3) + 0.3 * Math.sin(3 * a + 0.4);
const Rpath = a => Rin(a) + 1.95;
const polar = (a, r) => [Math.cos(a) * r, Math.sin(a) * r];
const NORTH = -Math.PI / 2, SOUTH = Math.PI / 2, WEST = Math.PI;
const STAIR_TOP = Rin(SOUTH) + 0.25, CAUSE_N = Rin(NORTH);
const SPOT = {
  dock: polar(WEST, Rout(WEST) + 2.6), arrive: [-(Rout(WEST) + 1.7), 0.35],
  bell: polar(-0.82, 8.7), hut: polar(0.22, 9.25), monk: polar(0.06, 8.05), spirit: polar(0.62, 9.35), bodhi: polar(-2.35, 8.5),
  tara: polar(WEST + 0.22, Rout(WEST + 0.22) - 0.9), stair: [0, STAIR_TOP + 0.7], slam: [0, STAIR_TOP - 0.05], prang: [0, 0], nagaBase: [0, 3.55]};
const world = new T.Group(); scene.add(world);
const colliders = [];   // {x, z, r}
const addCol = (x, z, r) => colliders.push({x, z, r});

function buildIslet(){
  const B = new Bld();
  /* ground top: the ring of land (outline with the lagoon as its hole) */
  const NO = 120, NI = 84, outer = [], inner = [];
  for(let i = 0; i < NO; i++){ const a = i / NO * TAU, r = Rout(a); outer.push(new T.Vector2(Math.cos(a) * r, Math.sin(a) * r)); }
  for(let i = 0; i < NI; i++){ const a = i / NI * TAU, r = Rin(a); inner.push(new T.Vector2(Math.cos(a) * r, Math.sin(a) * r)); }
  const tris = T.ShapeUtils.triangulateShape(outer, [inner]), all = outer.concat(inner);
  const up = (p, y) => V3(p.x, y, p.y);
  tris.forEach(t => { let a = up(all[t[0]], 0), b = up(all[t[1]], 0), c = up(all[t[2]], 0); if(new T.Vector3().crossVectors(b.clone().sub(a), c.clone().sub(a)).y < 0){ const s = b; b = c; c = s; }
    B.tri(a, b, c, C.grass, 0.05); });
  /* sides: grass lip + dirt band outside, dirt wall down to the lagoon inside */
  const wall = (pts, y0, y1, col, out) => { for(let i = 0; i < pts.length; i++){ const p = pts[i], q = pts[(i + 1) % pts.length]; const a = up(p, y0), b = up(q, y0), c = up(q, y1), d = up(p, y1);
    if(out){ B.tri(a, d, c, col, 0.08); B.tri(a, c, b, col, 0.08); } else { B.tri(a, b, c, col, 0.08); B.tri(a, c, d, col, 0.08); } } };
  wall(outer, 0, -0.16, C.lip, true); wall(outer, -0.16, -0.75, C.dirt, true); wall(inner, 0, -0.6, C.dirt2, false);
  /* 🪨 the hanging rock underside (Q14): rings shrink + drop with noise, strata colours, a tip in the sky */
  const L = 7, rings = [outer.map(p => up(p, -0.75))], strata = [C.dirt, C.rock1, C.rock2, C.rock1, C.rock3, C.rock4, C.rock3];
  for(let l = 1; l <= L; l++){ const f = l / L, s = 1 - Math.pow(f, 0.85) * 0.93, y = -0.75 - 7.8 * Math.pow(f, 1.25), ox = Math.sin(f * 2.2) * 0.9, oz = Math.cos(f * 1.7) * 0.5;
    rings.push(outer.map((p, i) => { const n = 1 + (Math.sin(i * 1.7 + l * 3.1) * 0.5 + Math.sin(i * 0.53 + l) * 0.5) * 0.16 * (1 - f * 0.4); return V3(p.x * s * n + ox * f, y + Math.sin(i * 2.3 + l) * 0.25, p.y * s * n + oz * f); })); }
  const tip = V3(1.0, -9.4, 0.4);
  for(let l = 0; l < L; l++){ const A = rings[l], Bq = rings[l + 1]; for(let i = 0; i < NO; i++){ const j = (i + 1) % NO; B.tri(A[i], Bq[i], Bq[j], strata[l], 0.12); B.tri(A[i], Bq[j], A[j], strata[l], 0.12); } }
  { const A = rings[L]; for(let i = 0; i < NO; i++) B.tri(A[i], tip, A[(i + 1) % NO], C.rock4, 0.12); }
  /* roots + vines hanging from the rim */
  for(let i = 0; i < 26; i++){ const a = R() * TAU, r = Rout(a) * (0.93 - R() * 0.12), x = Math.cos(a) * r, z = Math.sin(a) * r, len = 0.8 + R() * 2.2, vine = R() < 0.55;
    B.add(G.cyl6, vine ? C.leaf3 : C.trunk, M(x, -0.9 - len / 2, z, (R() - 0.5) * 0.3, 0, (R() - 0.5) * 0.3, vine ? 0.07 : 0.1, len, vine ? 0.07 : 0.1));
    if(vine) B.add(G.ico0, C.leaf, M(x, -0.9 - len, z, 0, R() * 3, 0, 0.22)); }
  /* 🛤️ the path ring round the lagoon + the dock spur + the stair court */
  const ribbon = (fn, a0, a1, n, w, col, y) => { let prev = null; for(let i = 0; i <= n; i++){ const a = lerp(a0, a1, i / n), r = fn(a), cx = Math.cos(a) * r, cz = Math.sin(a) * r, nx = Math.cos(a), nz = Math.sin(a);
      const L0 = V3(cx - nx * w / 2, y, cz - nz * w / 2), R0 = V3(cx + nx * w / 2, y, cz + nz * w / 2); if(prev){ B.tri(prev[0], L0, R0, col, 0.1); B.tri(prev[0], R0, prev[1], col, 0.1); } prev = [L0, R0]; } };
  ribbon(Rpath, 0, TAU, 120, 1.05, C.sand, 0.025);
  for(let i = 0; i < 7; i++){ const x0 = -(Rpath(WEST) + 0.1) - i * 0.52; B.add(G.box, C.sand, M(x0, 0.012, 0, 0, (R() - 0.5) * 0.2, 0, 0.56, 0.03, 0.98), 0.1); }
  B.add(G.box, C.stone, M(0, 0.03, STAIR_TOP + 0.95, 0, 0, 0, 2.9, 0.06, 1.7), 0.06);
  for(let i = 0; i < 9; i++) B.add(G.box, C.stone2, M(-1.2 + (i % 3) * 1.2, 0.065, STAIR_TOP + 0.45 + Math.floor(i / 3) * 0.55, 0, 0, 0, 1.08, 0.02, 0.48), 0.1);
  /* 🌿 moss patches near the ruins (ground tells the district, I6) */
  for(let i = 0; i < 34; i++){ const a = R() * TAU, r = Rin(a) + 0.35 + R() * 1.1; B.add(G.disc7, R() < 0.5 ? C.moss : C.grass2, M(Math.cos(a) * r, 0.006, Math.sin(a) * r, 0, R() * 3, 0, 0.5 + R() * 0.7, 0.01, 0.4 + R() * 0.6)); }
  /* 🧱 ruin ring — broken laterite walls between the lagoon and the path (gaps at the causeway + the stair) */
  for(let a = -Math.PI; a < Math.PI; a += 0.2){ if(Math.abs(angDiff(a, NORTH)) < 0.32 || Math.abs(angDiff(a, SOUTH)) < 0.42 || R() < 0.36) continue;
    const r = Rin(a) + 0.72, x = Math.cos(a) * r, z = Math.sin(a) * r, h = R() < 0.15 ? 0.75 + R() * 0.3 : 0.18 + R() * 0.38, len = r * 0.2 * (0.55 + R() * 0.3);
    B.add(G.box, C.laterite, M(x, h / 2, z, 0, -a + Math.PI / 2, 0, len, h, 0.3), 0.14);
    if(R() < 0.4) B.add(G.box, C.laterite, M(x + (R() - 0.5) * 0.2, h + 0.08, z, 0, -a + Math.PI / 2 + 0.1, (R() - 0.5) * 0.3, len * 0.45, 0.16, 0.28), 0.14);
    if(R() < 0.55) B.add(G.ico0, C.moss, M(x, h + 0.05, z, 0, R() * 3, 0, len * 0.55, 0.18, 0.4));
    if(R() < 0.3){ const fx = x + Math.cos(a) * 0.7, fz = z + Math.sin(a) * 0.7; B.add(G.box, C.laterite, M(fx, 0.12, fz, 0.2, R() * 3, 0.15, 0.32, 0.24, 0.26), 0.14); }
    addCol(x, z, 0.32); }
  /* gate pillars with lotus-bud tops at the causeway + the stair */
  [[NORTH, 0.62], [NORTH, -0.62], [SOUTH, 1.25], [SOUTH, -1.25]].forEach(([a, off]) => { const r = Rin(a) + 0.7, x = Math.cos(a) * r + (a === NORTH ? off : off), z = Math.sin(a) * r;
    B.add(G.box, C.stone2, M(x, 0.65, z, 0, 0, 0, 0.42, 1.3, 0.42), 0.08); B.add(G.box, C.stone, M(x, 1.34, z, 0, 0, 0, 0.52, 0.1, 0.52)); B.add(G.cone6, C.stone, M(x, 1.62, z, 0, 0, 0, 0.36, 0.5, 0.36)); addCol(x, z, 0.36); });
  /* 🏝️ the lagoon island + 🛕 THE OLD PRANG (🌟 main attraction, cond: old — moss + vines) */
  const isle = []; for(let i = 0; i < 14; i++){ const a = i / 14 * TAU; isle.push(new T.Vector2(Math.cos(a) * ISLE_R, Math.sin(a) * ISLE_R)); }
  T.ShapeUtils.triangulateShape(isle, []).forEach(t => { let a = up(isle[t[0]], 0), b = up(isle[t[1]], 0), c = up(isle[t[2]], 0); if(new T.Vector3().crossVectors(b.clone().sub(a), c.clone().sub(a)).y < 0){ const s = b; b = c; c = s; } B.tri(a, b, c, C.stone, 0.06); });
  wall(isle, 0, -0.7, C.stone2, true);
  B.add(G.box, C.stone, M(0, 0.18, 0, 0, 0, 0, 2.9, 0.36, 2.9), 0.06); B.add(G.box, C.stone2, M(0, 0.53, 0, 0, 0, 0, 2.35, 0.34, 2.35), 0.06);
  let y = 0.7; B.add(new T.CylinderGeometry(0.86, 1.02, 1.7, 8), C.sandstone, M(0, y + 0.85, 0, 0, Math.PI / 8, 0), 0.08);
  for(let k = 0; k < 4; k++){ const a = k * Math.PI / 2, dx = Math.sin(a), dz = Math.cos(a);   /* 4 porches + dark doorways + pediments */
    B.add(G.box, C.sandstone2, M(dx * 0.95, y + 0.6, dz * 0.95, 0, a, 0, 0.82, 1.2, 0.5), 0.06); B.add(G.box, '#4A3328', M(dx * 1.21, y + 0.45, dz * 1.21, 0, a, 0, 0.42, 0.78, 0.05));
    B.add(G.prism, C.sandstone, M(dx * 1.0, y + 1.2, dz * 1.0, 0, a, 0, 0.9, 0.5, 0.5), 0.06); B.add(G.cone4, C.gold, M(dx * 1.0, y + 1.82, dz * 1.0, 0, a, 0, 0.12, 0.26, 0.12)); }
  y += 1.7;
  for(let k = 0; k < 5; k++){ const r = 0.86 * (1 - k * 0.15), h = 0.44 * (1 - k * 0.08);
    B.add(new T.CylinderGeometry(r * 1.1, r * 1.12, 0.08, 8), C.sandstone2, M(0, y + 0.04, 0, 0, Math.PI / 8, 0));
    B.add(new T.CylinderGeometry(r * 0.88, r, h, 8), k % 2 ? C.sandstone : '#D4B086', M(0, y + 0.08 + h / 2, 0, 0, Math.PI / 8, 0), 0.08);
    for(let p = 0; p < 4; p++){ const a = p / 4 * TAU + Math.PI / 4; B.add(G.cone4, C.sandstone, M(Math.cos(a) * r * 1.0, y + 0.14 + h * 0.4, Math.sin(a) * r * 1.0, 0, a, 0, 0.12, 0.24, 0.08)); }
    y += 0.08 + h; }
  B.add(G.cone6, C.gold, M(0, y + 0.45, 0, 0, 0, 0, 0.36, 0.9, 0.36), 0.05); B.add(G.ico0, C.gold, M(0, y + 0.95, 0, 0, 0, 0, 0.14)); B.add(G.cone4, C.gold, M(0, y + 1.25, 0, 0, 0, 0, 0.06, 0.5, 0.06));
  for(let i = 0; i < 12; i++){ const a = R() * TAU, h = 0.8 + R() * 2.6, r = 0.95 - h * 0.12; B.add(G.ico0, C.moss, M(Math.cos(a) * r, h, Math.sin(a) * r, 0, R() * 3, 0, 0.24 + R() * 0.2, 0.14, 0.22));
    if(R() < 0.5) B.add(G.cyl6, C.leaf3, M(Math.cos(a) * (r + 0.05), h - 0.35, Math.sin(a) * (r + 0.05), 0, 0, 0, 0.05, 0.7, 0.05)); }
  PRANG_TOP = y + 1.5; addCol(0, 0, 1.6);
  /* 🛤️ stone causeway N + 🐍 naga rails ending in raised hoods at the ring end */
  for(let z = -ISLE_R + 0.1; z > -CAUSE_N - 0.1; z -= 0.62){ B.add(G.box, C.stone, M(0, -0.06, z - 0.3, 0, 0, 0, 1.3, 0.14, 0.58), 0.08); B.add(G.box, C.stone2, M(0, -0.45, z - 0.3, 0, 0, 0, 0.5, 0.7, 0.5)); }
  for(const sx of [-0.72, 0.72]){ for(let z = -ISLE_R; z > -CAUSE_N; z -= 0.26) B.add(G.ico0, C.stone2, M(sx, 0.12 + Math.sin(z * 2.2) * 0.04, z, 0, 0, 0, 0.24, 0.2, 0.3));
    nagaStatue(B, sx * 1.02, -CAUSE_N + 0.1, Math.PI, 0.7); }
  /* 🐉 the naga stair S (asleep): 5 steps down into the lagoon + stone naga balustrades with 3-head hoods (their eyes are their own mesh → they glint once woken) */
  for(let k = 0; k < 5; k++){ const z = STAIR_TOP - 0.05 - k * 0.42, yy = -0.08 - k * 0.14; B.add(G.box, k % 2 ? C.stone : C.stone2, M(0, yy, z, 0, 0, 0, 2.0, 0.22, 0.46), 0.06); }
  for(const sx of [-1.18, 1.18]){ for(let k = 0; k < 9; k++){ const z = STAIR_TOP - 2.0 + k * 0.28; B.add(G.ico0, C.stone2, M(sx, 0.02 - (8 - k) * 0.07 + 0.18, z, 0, 0, 0, 0.3, 0.26, 0.34)); }
    nagaStatue(B, sx, STAIR_TOP + 0.35, 0, 1.0); addCol(sx, STAIR_TOP + 0.35, 0.45); }
  /* 🔔 the silent bell frame NE (beacon) — the bell itself is its own mesh (it sways when you look) */
  { const [x, z] = SPOT.bell, a = -0.82 + Math.PI / 2; const ax = Math.cos(a), az = -Math.sin(a);
    B.add(G.box, C.stone2, M(x, 0.12, z, 0, a, 0, 2.2, 0.24, 1.1), 0.06);
    for(const s of [-0.85, 0.85]) B.add(G.box, '#8E3B2E', M(x + Math.cos(-a) * s, 1.25, z + Math.sin(-a) * s, 0, a, 0, 0.2, 2.3, 0.2), 0.06);
    B.add(G.box, '#8E3B2E', M(x, 2.42, z, 0, a, 0, 2.2, 0.18, 0.24)); thaiRoof(B, x, 2.5, z, 2.4, 1.0, 0.75, a, 1); addCol(x, z, 1.0); }
  /* 🛖 the monk's hut (กุฏิ) on stilts + steps · 🏠 the spirit house (ศาลพระภูมิ) beside it */
  { const [x, z] = SPOT.hut, a = 0.22 - Math.PI / 2;
    for(const [px, pz] of [[-0.95, -0.75], [0.95, -0.75], [-0.95, 0.75], [0.95, 0.75]]){ const c = Math.cos(-a), s = Math.sin(-a); B.add(G.box, C.wood2, M(x + px * c - pz * s, 0.32, z + px * s + pz * c, 0, a, 0, 0.16, 0.64, 0.16)); }
    B.add(G.box, C.wood2, M(x, 0.7, z, 0, a, 0, 2.3, 0.14, 1.9), 0.06); B.add(G.box, C.wood, M(x, 1.28, z, 0, a, 0, 2.0, 1.04, 1.6), 0.08);
    const fx = -Math.cos(a + Math.PI / 2), fz = Math.sin(a + Math.PI / 2);
    B.add(G.box, '#4A3328', M(x + fx * 0.81, 1.2, z + fz * 0.81, 0, a, 0, 0.5, 0.78, 0.04)); B.add(G.box, '#F2D9A2', M(x + fx * 0.81 + Math.cos(-a) * 0.6, 1.36, z + fz * 0.81 + Math.sin(-a) * 0.6, 0, a, 0, 0.34, 0.3, 0.04));
    for(let k = 0; k < 3; k++) B.add(G.box, C.wood, M(x + fx * (1.1 + k * 0.22), 0.52 - k * 0.17, z + fz * (1.1 + k * 0.22), 0, a, 0, 0.6, 0.1, 0.24));
    thaiRoof(B, x, 1.8, z, 2.7, 2.2, 1.1, a, 2); addCol(x, z, 1.45); }
  { const [x, z] = SPOT.spirit; B.add(G.box, C.white, M(x, 0.55, z, 0, 0.4, 0, 0.16, 1.1, 0.16)); B.add(G.box, C.white, M(x, 1.12, z, 0, 0.4, 0, 0.62, 0.06, 0.62));
    B.add(G.box, C.gold, M(x, 1.36, z, 0, 0.4, 0, 0.42, 0.42, 0.36), 0.06); B.add(G.box, C.red, M(x + 0.03, 1.32, z + 0.17, 0, 0.4, 0, 0.16, 0.24, 0.04)); thaiRoof(B, x, 1.56, z, 0.62, 0.52, 0.34, 0.4, 1);
    for(let i = 0; i < 5; i++) B.add(G.ico0, i % 2 ? '#FF9F1C' : '#FFD23F', M(x + Math.cos(i * 1.3) * 0.24, 1.18, z + Math.sin(i * 1.3) * 0.24, 0, 0, 0, 0.09)); addCol(x, z, 0.4); }
  /* 🌳 the bodhi tree NW (with a temple sash round its trunk) */
  { const [x, z] = SPOT.bodhi; for(let i = 0; i < 4; i++){ const a = i * 1.6; B.add(G.cyl6, C.trunk, M(x + Math.cos(a) * 0.18, 1.0, z + Math.sin(a) * 0.18, Math.cos(a) * 0.12, 0, Math.sin(a) * 0.12, 0.34, 2.1, 0.34), 0.1); }
    for(let i = 0; i < 6; i++){ const a = i / 6 * TAU; B.add(G.cyl6, C.trunk, M(x + Math.cos(a) * 0.5, 0.08, z + Math.sin(a) * 0.5, 0, -a, Math.PI / 2 - 0.25, 0.14, 0.7, 0.14)); }
    ['#FF9F1C', '#FFD23F', '#F59BB8'].forEach((c, i) => B.add(new T.TorusGeometry(0.34, 0.05, 4, 10), c, M(x, 0.75 + i * 0.1, z, Math.PI / 2, 0, 0)));
    for(let i = 0; i < 11; i++){ const a = R() * TAU, r = R() * 1.3; B.add(G.ico0, [C.leaf, C.leaf2, C.leaf3][i % 3], M(x + Math.cos(a) * r, 2.4 + R() * 1.1, z + Math.sin(a) * r, R(), R(), R(), 1.4 + R() * 0.7, 1.0 + R() * 0.4, 1.3 + R() * 0.6), 0.08); }
    addCol(x, z, 0.75); }
  /* ⛴️ the ferry dock W (arrival) over the sky + the "no ferry" sign + a lantern post */
  { const x0 = -(Rout(WEST) - 0.3); for(let i = 0; i < 9; i++){ const x = x0 - i * 0.46; B.add(G.box, i % 2 ? C.wood : '#C08A57', M(x, 0.0, 0, 0, 0, 0, 0.42, 0.12, 1.5), 0.1); }
    for(const [dx, dz] of [[-1.2, -0.68], [-1.2, 0.68], [-3.6, -0.68], [-3.6, 0.68]]) B.add(G.cyl6, C.wood2, M(x0 + dx + 1.0, -0.6, dz, 0, 0, 0, 0.16, 1.5, 0.16));
    const sx = x0 - 3.2; B.add(G.box, C.wood2, M(sx, 0.55, -0.62, 0, 0, 0, 0.1, 1.1, 0.1)); B.add(G.box, '#F6E7C8', M(sx, 1.05, -0.62, 0, 0, 0, 0.06, 0.46, 0.66), 0.04);
    B.add(G.box, C.red, M(sx + 0.04, 1.05, -0.62, 0.78, 0, 0, 0.03, 0.08, 0.66)); B.add(G.box, '#3B6FB6', M(sx + 0.035, 1.05, -0.62, 0, 0, 0, 0.02, 0.18, 0.3));
    B.add(G.box, C.wood2, M(x0 + 0.2, 0.7, 0.85, 0, 0, 0, 0.1, 1.4, 0.1)); B.add(G.box, '#FFB547', M(x0 + 0.2, 1.42, 0.85, 0, 0, 0, 0.26, 0.3, 0.26)); B.add(G.prism, C.red, M(x0 + 0.2, 1.57, 0.85, 0, 0, 0, 0.36, 0.2, 0.36)); }
  const mesh = B.mesh(); mesh.name = 'islet'; world.add(mesh);
  return mesh; }
let PRANG_TOP = 6;
function thaiRoof(B, x, y, z, w, d, h, rot, tiers){   /* gable roof: red-orange tiles, green border, gold chofa horns (tiers = 1 | 2) */
  for(let t = 0; t < tiers; t++){ const s = 1 - t * 0.28, yy = y + t * h * 0.55, hh = h * (t ? 0.8 : 1);
    B.add(G.prism, t ? C.roof : C.roof, M(x, yy, z, 0, rot, 0, w * s, hh, d * s * 1.02), 0.08);
    B.add(G.prism, C.roof2, M(x, yy - 0.02, z, 0, rot, 0, w * s * 1.06, hh * 0.14, d * s * 1.08));
    for(const e of [-1, 1]){ const lx = e * d * s * 0.51, wx = x + Math.sin(rot) * lx, wz = z + Math.cos(rot) * lx;
      B.add(G.cone4, C.gold, M(wx, yy + hh + 0.12, wz, e * 0.5, rot, 0, 0.09, 0.34, 0.09)); } } }
function nagaStatue(B, x, z, face, s){   /* a stone naga hood with 3 sleeping heads (balustrade end) — gold crests */
  for(let h = -1; h <= 1; h++){ const a = face + h * 0.5, hx = x + Math.sin(a) * 0.18 * s + h * 0.22 * s, hz = z + Math.cos(face) * 0.05, hy = (0.95 + (h ? -0.12 : 0)) * s;
    B.add(G.cyl6, C.stone2, M(hx, hy * 0.5, hz, 0, 0, h * 0.25, 0.22 * s, hy, 0.22 * s), 0.06);
    B.add(G.ico1, C.stone, M(hx, hy + 0.06 * s, hz + Math.cos(face) * 0.08 * s, 0, face, 0, 0.36 * s, 0.3 * s, 0.46 * s), 0.05);
    B.add(G.cone4, C.gold, M(hx, hy + 0.32 * s, hz - Math.cos(face) * 0.04 * s, -Math.cos(face) * 0.4, face, 0, 0.12 * s, 0.34 * s, 0.06 * s));
    STATUE_EYES.push([hx, hy + 0.1 * s, hz + Math.cos(face) * 0.27 * s, face, s]); }
  B.add(G.ico1, C.stone2, M(x, 0.3 * s, z - Math.cos(face) * 0.1, 0, 0, 0, 0.75 * s, 0.6 * s, 0.5 * s), 0.06); }
const STATUE_EYES = [];

/* ================= 🌴 repeats = InstancedMesh (trees · palms · bushes · lotus · floating rocks · clouds) + 💧 the lagoon ================= */
function treeGeo(){ const B = new Bld(); B.add(G.cyl6, C.trunk, M(0, 0.45, 0, 0, 0, 0, 0.2, 0.9, 0.2), 0.1); B.add(G.ico0, C.leaf, M(0, 1.25, 0, 0.3, 0.5, 0, 1.15, 0.95, 1.1), 0.1); B.add(G.ico0, C.leaf2, M(0.22, 1.7, -0.1, 0.6, 0.2, 0.3, 0.75, 0.6, 0.7), 0.1); return B.geo(); }
function palmGeo(){ const B = new Bld(); for(let i = 0; i < 4; i++) B.add(G.cyl6, i % 2 ? C.trunk : '#8A6040', M(0.07 * i, 0.3 + i * 0.5, 0, 0, 0, -0.1 - i * 0.04, 0.17 - i * 0.02, 0.52, 0.17 - i * 0.02), 0.08);
  for(let i = 0; i < 6; i++){ const a = i / 6 * TAU; B.add(G.cone4, i % 2 ? C.palm : C.leaf, M(0.3 + Math.cos(a) * 0.55, 2.08, Math.sin(a) * 0.55, Math.sin(a) * 1.05, 0, -Math.cos(a) * 1.05, 0.34, 1.3, 0.1), 0.06); }
  B.add(G.ico0, '#7A5A2E', M(0.3, 2.0, 0, 0, 0, 0, 0.28)); return B.geo(); }
function bushGeo(){ const B = new Bld(); B.add(G.ico0, C.leaf2, M(0, 0.25, 0, 0, 0, 0, 0.75, 0.55, 0.7), 0.12); B.add(G.ico0, C.leaf, M(0.25, 0.32, 0.1, 0.4, 0, 0, 0.5, 0.42, 0.45), 0.12); B.add(G.ico0, '#F59BB8', M(-0.1, 0.5, 0.22, 0, 0, 0, 0.12)); return B.geo(); }
function padGeo(){ const B = new Bld(); B.add(new T.CylinderGeometry(0.42, 0.42, 0.04, 7, 1, false, 0.3, TAU - 0.6), C.lotus, M(), 0.06); return B.geo(); }
function lotusGeo(){ const B = new Bld(); for(let i = 0; i < 5; i++){ const a = i / 5 * TAU; B.add(G.cone4, C.pink, M(Math.cos(a) * 0.08, 0.14, Math.sin(a) * 0.08, Math.sin(a) * 0.5, 0, -Math.cos(a) * 0.5, 0.12, 0.28, 0.06)); }
  B.add(G.ico0, '#FFD23F', M(0, 0.1, 0, 0, 0, 0, 0.1)); B.add(new T.CylinderGeometry(0.3, 0.3, 0.03, 7), C.lotus, M(0, 0, 0)); return B.geo(); }
function rockGeo(){ const B = new Bld(); B.add(G.ico0, C.rock1, M(0, 0, 0, 0, 0, 0, 1, 0.8, 1), 0.15); B.add(G.ico0, C.grass, M(0, 0.32, 0, 0, 0, 0, 0.8, 0.22, 0.8)); return B.geo(); }
function cloudGeo(){ const B = new Bld(); for(let i = 0; i < 6; i++){ const a = i * 1.1; B.add(G.ico1, i % 3 ? C.cloud : '#EEF4FF', M(Math.cos(a) * 1.3 * (i % 2 + 0.5), Math.sin(i) * 0.2, Math.sin(a) * 0.8, 0, 0, 0, 1.7 - i * 0.12, 0.75, 1.3)); } return B.geo(); }
const DEC = {};
const freeSpot = (x, z, r) => !colliders.some(c => Math.hypot(c.x - x, c.z - z) < c.r + r) && ![SPOT.dock, SPOT.arrive, SPOT.tara, SPOT.monk, SPOT.stair].some(s => Math.hypot(s[0] - x, s[1] - z) < 1.6);
function scatter(){
  const put = (im, list, colFn) => { const m = new T.Matrix4(); list.forEach((p, i) => { im.setMatrixAt(i, M(p[0], p[1] || 0, p[2], 0, p[3] || 0, 0, p[4] || 1)); if(colFn) im.setColorAt(i, _c.set(colFn(i))); }); setCount(im, list.length); im.instanceMatrix.needsUpdate = true; if(im.instanceColor) im.instanceColor.needsUpdate = true; void m; return im; };
  const trees = [], palms = [], bushes = [];
  for(let tries = 0; tries < 900 && (trees.length < 30 || palms.length < 12 || bushes.length < 26); tries++){
    const a = R() * TAU, ro = Rout(a), r = lerp(Rpath(a) + 1.05, ro - 0.55, R()), x = Math.cos(a) * r, z = Math.sin(a) * r;
    const west = Math.abs(angDiff(a, WEST)) < 1.0 || Math.abs(angDiff(a, SOUTH)) < 0.5, kind = R() < 0.3 ? 'bush' : west ? 'palm' : 'tree';
    if(Math.abs(angDiff(a, WEST)) < 0.16 || Math.abs(angDiff(a, SOUTH)) < 0.2) continue;   // keep the dock + the stair court open (I3 reveal)
    const rr = kind === 'tree' ? 0.42 : kind === 'palm' ? 0.3 : 0.3; if(!freeSpot(x, z, rr)) continue;
    if(kind === 'tree' && trees.length < 30){ trees.push([x, 0, z, R() * TAU, 0.85 + R() * 0.45]); addCol(x, z, 0.32); }
    else if(kind === 'palm' && palms.length < 12){ palms.push([x, 0, z, R() * TAU, 0.85 + R() * 0.3]); addCol(x, z, 0.22); }
    else if(kind === 'bush' && bushes.length < 26){ bushes.push([x, 0, z, R() * TAU, 0.7 + R() * 0.5]); } }
  DEC.trees = put(instanced(treeGeo(), TOON, trees.length), trees, i => ['#FFFFFF', '#E9F7E0', '#F7FFE8'][i % 3]); DEC.treeList = trees; DEC.palmList = palms; DEC.treeF = new Float32Array(trees.length).fill(1); DEC.palmF = new Float32Array(palms.length).fill(1);
  DEC.palms = put(instanced(palmGeo(), TOON, palms.length), palms);
  DEC.bushes = put(instanced(bushGeo(), TOON, bushes.length), bushes, i => i % 4 ? '#FFFFFF' : '#E6F5DA'); DEC.bushList = bushes; DEC.bushPulse = new Float32Array(bushes.length);
  const pads = [], flowers = [];
  for(let tries = 0; tries < 500 && pads.length < 22; tries++){ const a = R() * TAU, r = lerp(ISLE_R + 0.5, Rin(a) - 0.45, R()), x = Math.cos(a) * r, z = Math.sin(a) * r;
    if(Math.abs(x) < 1.1 && z < 0) continue; if(Math.hypot(x - SPOT.nagaBase[0], z - SPOT.nagaBase[1]) < 1.8 || (Math.abs(x) < 1.6 && z > 2.8)) continue;
    if(pads.some(p => Math.hypot(p[0] - x, p[2] - z) < 0.75)) continue; (R() < 0.28 ? flowers : pads).push([x, -0.3, z, R() * TAU, 0.8 + R() * 0.5]); }
  DEC.pads = put(instanced(padGeo(), TOON, pads.length, false), pads); DEC.lotus = put(instanced(lotusGeo(), TOON, flowers.length), flowers);
  const rocks = []; for(let i = 0; i < 9; i++){ const a = i / 9 * TAU + R() * 0.4, r = Rout(a) + 1.4 + R() * 2.2; rocks.push([Math.cos(a) * r, -2.5 - R() * 4, Math.sin(a) * r, R() * TAU, 0.35 + R() * 0.55]); }
  DEC.rocks = put(instanced(rockGeo(), TOON, rocks.length), rocks); DEC.rockList = rocks;
  const clouds = []; for(let i = 0; i < 8; i++){ const a = i / 8 * TAU + R() * 0.5, r = 18 + R() * 9; clouds.push([Math.cos(a) * r, -12 - R() * 7, Math.sin(a) * r, R() * TAU, 0.8 + R() * 0.7]); }
  DEC.clouds = put(instanced(cloudGeo(), TOON, clouds.length, false), clouds); DEC.cloudList = clouds;
  DEC.cloudGroup = new T.Group(); DEC.cloudGroup.add(DEC.clouds);
  [DEC.trees, DEC.palms, DEC.bushes, DEC.pads, DEC.lotus, DEC.rocks].forEach(m => world.add(m)); scene.add(DEC.cloudGroup);
  /* 💧 the lagoon: an opaque teal ring (it hides the naga under the water) + a light foam edge */
  const hole = [], ring = []; for(let i = 0; i < 18; i++){ const a = i / 18 * TAU; hole.push(new T.Vector2(Math.cos(a) * (ISLE_R - 0.05), Math.sin(a) * (ISLE_R - 0.05))); }
  for(let i = 0; i < 84; i++){ const a = i / 84 * TAU; ring.push(new T.Vector2(Math.cos(a) * (Rin(a) + 0.02), Math.sin(a) * (Rin(a) + 0.02))); }
  const W = new Bld(), all = ring.concat(hole);
  T.ShapeUtils.triangulateShape(ring, [hole]).forEach(t => { let a = V3(all[t[0]].x, -0.32, all[t[0]].y), b = V3(all[t[1]].x, -0.32, all[t[1]].y), c = V3(all[t[2]].x, -0.32, all[t[2]].y);
    if(new T.Vector3().crossVectors(b.clone().sub(a), c.clone().sub(a)).y < 0){ const s = b; b = c; c = s; } W.tri(a, b, c, C.water, 0.04); });
  for(let i = 0; i < 84; i++){ const a0 = i / 84 * TAU, a1 = (i + 1) / 84 * TAU, p = (a, d) => V3(Math.cos(a) * (Rin(a) - d), -0.31, Math.sin(a) * (Rin(a) - d));
    W.tri(p(a0, 0.02), p(a1, 0.02), p(a1, 0.32), C.water2, 0.1); W.tri(p(a0, 0.02), p(a1, 0.32), p(a0, 0.32), C.water2, 0.1); }
  const water = new T.Mesh(W.geo(), TOON); water.name = 'water'; world.add(water); DEC.water = water;
  /* 🐉 the stair statues' eyes: one mesh, grey "asleep" → gold glint once woken */
  const EB = new Bld(); STATUE_EYES.forEach(([x, y, z, f, s]) => { for(const e of [-1, 1]) EB.add(G.ico0, '#FFFFFF', M(x + Math.cos(f) * e * 0.12 * s, y, z, 0, f, 0, 0.09 * s, 0.035 * s, 0.05 * s)); });
  DEC.eyeMat = new T.MeshBasicMaterial({color: 0x6B6458}); DEC.eyes = new T.Mesh(EB.geo(), DEC.eyeMat); world.add(DEC.eyes);
}
/* ================= 🚶 where you can walk: the ring of land · the dock · the causeway · the lagoon island — never the water, never off the edge ================= */
const onDock = (x, z) => x < -(Rout(WEST) - 1.2) && x > -(Rout(WEST) + 3.7) && Math.abs(z) < 0.62;
function onLand(x, z){ const r = Math.hypot(x, z), a = Math.atan2(z, x);
  if(onDock(x, z)) return true;
  if(r > Rout(a) - 0.42) return false;
  if(r < ISLE_R - 0.22) return true;
  if(Math.abs(x) < 0.5 && z < -ISLE_R + 0.3 && z > -CAUSE_N - 0.3) return true;
  return r > Rin(a) + 0.3; }
function freeAt(x, z, rad, skip){ if(!onLand(x, z)) return false; for(const c of colliders){ if(c === skip) continue; if(Math.hypot(c.x - x, c.z - z) < c.r + rad) return false; } return true; }
function groundY(x, z){ return onDock(x, z) ? 0.06 : 0; }

/* ================= 🧑 chibi avatar — BUILT IN CODE: a Group of parts (hip · legs · body · head (+ eyes) · far arm · near arm · held item), no skeleton file,
   so the 🎬 3–5 beat rule + AvatarKit looks carry over. Palettes = a read-only copy of AvatarKit's tables (SKINS · HAIR_COLS · OUTFIT_COLS · MY_COLS). ================= */
const AVK = {SKINS: ['#FFE0C7', '#F5C9A5', '#E3A87C', '#C68654', '#8D5A3B', '#5C3A26', '#E8B923', '#7ED957', '#4FA3E0', '#C9A7F5', '#2B2F6B'],
  HAIR: ['short', 'long', 'puffs', 'spiky', 'bun', 'curly', 'mohawk', 'braids', 'ponytail', 'puffs', 'spacebuns', 'afro', 'spiky'],
  HAIR_COLS: ['#2B1B12', '#5A3A22', '#A0612B', '#E8B04B', '#F2E3B3', '#C0392B', '#7B5CFA', '#2EC4B6', '#B9BEC7', '#F1EADA', '#F7A8C8', '#B9A2E8', '#9FE3C7', '#8CCBF2', '#1E9E9A', '#6A2FB0', '#D9692A', '#8E2F1F'],
  OUTFIT_COLS: ['#FF4D6D', '#FF9F1C', '#FFD23F', '#4CB963', '#2CA6DE', '#4361EE', '#7B5FE0', '#FF6FA5', '#2B2D42', '#F4F4F4', '#F7F7F7', '#3A2A7A', '#E2481B', '#FF8FB8', '#1B1B3A', '#5B7F3A', '#E8B923', '#FF4D6D'],
  MY_COLS: ['#FF4D6D', '#E2481B', '#FF9F1C', '#FFD23F', '#C6E33B', '#4CB963', '#1E9E9A', '#2EC4B6', '#8CCBF2', '#2CA6DE', '#4361EE', '#1E2A4A', '#7B5FE0', '#B9A2E8', '#C04BD6', '#FF6FA5', '#F7A8C8', '#8A5A33', '#C8A878', '#F4F4F4', '#B9BEC7', '#5B5F6E', '#2B2D42', '#111111'],
  OUTFIT: ['tee', 'dress', 'hoodie', 'overalls', 'tee', 'tee', 'dress', 'hoodie', 'dress', 'tee', 'tee', 'tee', 'dress', 'hoodie', 'dress', 'tee', 'tee', 'dress', 'overalls', 'hoodie']};
function lookOf(a){ a = a || {}; const pick = (arr, i, d) => arr[(i >= 0 && i < arr.length) ? i : d];
  const top = pick(AVK.OUTFIT_COLS, a.outfitColor, 4), o2 = a.oc2 > 0 ? AVK.MY_COLS[a.oc2 - 1] : null, kind = pick(AVK.OUTFIT, a.outfit, 0);
  return {skin: pick(AVK.SKINS, a.skin, 1), hair: pick(AVK.HAIR, a.hair, 8), hairCol: pick(AVK.HAIR_COLS, a.hairColor, 1), outfit: kind, top,
    bottom: kind === 'dress' ? top : kind === 'overalls' ? top : (o2 || '#3A4A6B'), trim: o2 || (kind === 'overalls' ? '#F4F4F4' : '#FFFFFF'), shoe: '#FFFFFF', item: 'sword'}; }
const SAMPLES = [null, {skin: 3, hair: 2, hairColor: 0, outfit: 1, outfitColor: 7, oc2: 20}, {skin: 0, hair: 3, hairColor: 3, outfit: 2, outfitColor: 3, oc2: 12}, {skin: 4, hair: 11, hairColor: 1, outfit: 3, outfitColor: 5, oc2: 4}, {skin: 9, hair: 10, hairColor: 10, outfit: 0, outfitColor: 6, oc2: 3}];
function hairOn(B, L){ const hc = L.hairCol, j = 0.06, h = L.hair;
  if(h === 'bald') return;
  if(h === 'curly' || h === 'afro'){ const n = h === 'afro' ? 12 : 9, s = h === 'afro' ? 0.2 : 0.16; for(let i = 0; i < n; i++){ const a = i / n * TAU; B.add(G.ico0, hc, M(Math.cos(a) * 0.27, 0.44 + Math.sin(i * 1.7) * 0.08, -0.05 + Math.sin(a) * 0.22, R(), R(), R(), s * 2.2), j); }
    B.add(G.ico1, hc, M(0, 0.4, -0.06, 0, 0, 0, 0.62, 0.42, 0.6), j); return; }
  B.add(G.ico1, hc, M(0, 0.375, -0.055, 0, 0, 0, 0.66, 0.5, 0.64), j);                       /* the cap of hair (top + back) */
  for(let i = -2; i <= 2; i++) B.add(G.cone4, hc, M(i * 0.075, 0.42, 0.24, -2.5, 0, i * 0.2, 0.13, 0.2, 0.08), j);   /* fringe */
  if(h === 'long' || h === 'braids') B.add(G.cyl6, hc, M(0, 0.18, -0.16, 0.12, 0, 0, 0.56, 0.42, 0.28), j);
  if(h === 'braids') for(const s of [-1, 1]) for(let k = 0; k < 3; k++) B.add(G.ico0, hc, M(s * 0.25, 0.12 - k * 0.1, -0.02, 0, 0, 0, 0.11), j);
  if(h === 'puffs') for(const s of [-1, 1]) B.add(G.ico1, hc, M(s * 0.31, 0.45, -0.06, 0, 0, 0, 0.26), j);
  if(h === 'spacebuns') for(const s of [-1, 1]) B.add(G.ico1, hc, M(s * 0.17, 0.62, -0.03, 0, 0, 0, 0.22), j);
  if(h === 'bun') B.add(G.ico1, hc, M(0, 0.62, -0.13, 0, 0, 0, 0.24), j);
  if(h === 'spiky') for(let i = 0; i < 7; i++){ const a = i / 7 * Math.PI - Math.PI / 2; B.add(G.cone4, hc, M(Math.sin(a) * 0.18, 0.6, -0.05 - Math.cos(a) * 0.06, -0.2, 0, -Math.sin(a) * 0.7, 0.14, 0.26, 0.14), j); }
  if(h === 'mohawk') for(let i = 0; i < 5; i++) B.add(G.cone4, hc, M(0, 0.63 - Math.abs(i - 2) * 0.03, 0.14 - i * 0.09, -0.3 + i * 0.12, 0, 0, 0.1, 0.24, 0.16), j);
  if(h === 'ponytail'){ B.add(G.cone6, hc, M(0, 0.32, -0.38, -2.5, 0, 0, 0.2, 0.42, 0.2), j); B.add(new T.TorusGeometry(0.06, 0.025, 4, 8), '#FF4D6D', M(0, 0.47, -0.31, 0.6, 0, 0)); } }
function makeChibi(L, opt){ opt = opt || {};
  const root = new T.Group(), hip = new T.Group(); hip.position.y = 0.3; root.add(hip);
  const part = (b, parent, x, y, z, mat, out) => { const m = b.mesh(mat, out); m.position.set(x, y, z); parent.add(m); return m; };
  const robe = L.outfit === 'robe', dress = L.outfit === 'dress' || robe;
  const leg = () => { const b = new Bld(); b.add(G.cyl8, dress ? L.skin : L.bottom, M(0, -0.12, 0, 0, 0, 0, 0.15, 0.24, 0.15), 0.04); b.add(G.box, robe ? '#6B4A2E' : L.shoe, M(0, -0.265, 0.035, 0, 0, 0, 0.16, 0.085, 0.22), 0.04);
    if(!robe) b.add(G.box, L.trim === '#FFFFFF' ? '#E2481B' : L.trim, M(0, -0.235, 0.035, 0, 0, 0, 0.165, 0.025, 0.225)); return b; };
  const legL = part(leg(), hip, -0.085, 0, 0), legR = part(leg(), hip, 0.085, 0, 0);
  const bb = new Bld();
  bb.add(new T.CylinderGeometry(0.155, 0.2, 0.36, 8), L.top, M(0, 0.17, 0), 0.05);
  if(dress) bb.add(new T.CylinderGeometry(0.19, robe ? 0.27 : 0.3, robe ? 0.34 : 0.2, 8), L.top, M(0, robe ? -0.1 : 0.02, 0), 0.05);
  if(robe) bb.add(G.box, '#C9661C', M(0.02, 0.2, 0.0, 0, 0, -0.62, 0.08, 0.5, 0.41));
  else if(L.outfit === 'overalls'){ bb.add(G.box, L.top, M(0, 0.14, 0.16, 0, 0, 0, 0.22, 0.22, 0.05)); bb.add(G.cyl6, L.trim, M(0, 0.25, 0, 0, 0, 0, 0.33, 0.14, 0.33)); }
  else bb.add(G.cyl8, L.trim, M(0, 0.01, 0, 0, 0, 0, 0.41, 0.05, 0.41));
  if(L.outfit === 'hoodie') bb.add(G.ico1, L.top, M(0, 0.33, -0.15, 0.4, 0, 0, 0.36, 0.22, 0.2), 0.05);
  const body = part(bb, hip, 0, 0, 0);
  const neck = new T.Group(); neck.position.set(0, 0.34, 0); body.add(neck);
  const hb = new Bld(); hb.add(G.ico1, L.skin, M(0, 0.28, 0, 0, 0, 0, 0.64, 0.6, 0.62), 0.03); hairOn(hb, L);
  for(const s of [-1, 1]){ hb.add(G.disc7, '#FF9DB0', M(s * 0.175, 0.215, 0.245, Math.PI / 2 - 0.2, 0, -s * 0.5, 0.11, 0.01, 0.07)); }
  hb.add(G.ico0, '#B34A5C', M(0, 0.165, 0.3, 0, 0, 0, 0.07, 0.035, 0.03));
  if(L.hair === 'bald') for(const s of [-1, 1]) hb.add(G.box, '#F1EADA', M(s * 0.11, 0.37, 0.285, 0.2, 0, s * 0.2, 0.1, 0.025, 0.02));
  const head = part(hb, neck, 0, 0, 0);
  const eb = new Bld(); for(const s of [-1, 1]){ eb.add(G.ico1, '#2A2233', M(s * 0.112, 0.285, 0.272, 0, s * 0.3, 0, 0.12, 0.155, 0.06)); eb.add(G.ico0, '#FFFFFF', M(s * 0.112 + 0.022, 0.31, 0.3, 0, 0, 0, 0.045)); }
  const eyes = new T.Mesh(eb.geo(), BASIC); head.add(eyes); eyes.position.set(0, 0.285, 0); eyes.geometry.translate(0, -0.285, 0);
  const arm = () => { const b = new Bld(); b.add(G.cyl8, L.top, M(0, -0.07, 0, 0, 0, 0, 0.12, 0.15, 0.12), 0.04); b.add(G.cyl8, robe ? L.top : L.skin, M(0, -0.17, 0, 0, 0, 0, 0.09, 0.1, 0.09), 0.04); b.add(G.ico1, L.skin, M(0, -0.245, 0, 0, 0, 0, 0.12)); return b; };
  const armL = part(arm(), body, -0.205, 0.31, 0), armR = part(arm(), body, 0.205, 0.31, 0);
  const hand = new T.Group(); hand.position.set(0, -0.25, 0); armR.add(hand);
  let item = null;
  if(L.item === 'sword'){ const b = new Bld(); b.add(G.box, '#6B4A2E', M(0, 0.0, 0, 0, 0, 0, 0.05, 0.12, 0.05)); b.add(G.box, '#8E5B36', M(0, 0.075, 0, 0, 0, 0, 0.16, 0.04, 0.06)); b.add(G.box, '#E3BE86', M(0, 0.29, 0, 0, 0, 0, 0.065, 0.4, 0.025), 0.05); b.add(G.cone4, '#E3BE86', M(0, 0.52, 0, 0, Math.PI / 4, 0, 0.065, 0.08, 0.04)); item = part(b, hand, 0, 0, 0); item.rotation.x = 2.1; }
  if(L.item === 'broom'){ const b = new Bld(); b.add(G.cyl6, '#B57B4A', M(0, 0.15, 0, 0, 0, 0, 0.04, 0.9, 0.04)); b.add(G.cone6, '#E8C66A', M(0, -0.38, 0, Math.PI, 0, 0, 0.2, 0.26, 0.2), 0.1); item = part(b, hand, 0, 0, 0); item.rotation.x = 0.35; }
  root.scale.setScalar(opt.scale || 1);
  const c = {root, hip, body, neck, head, eyes, armL, armR, legL, legR, hand, item, L, st: {phase: 0, spd: 0, air: false, act: null, blink: 1 + R() * 3, gim: 4 + R() * 4, gimK: '', gimT: 0, look: 0, face: 0, squash: 1}};
  return c; }
function disposeTree(o){ o.traverse(n => { if(n.geometry && !Object.values(G).includes(n.geometry)) n.geometry.dispose(); }); }

/* 🎬 actions = 3–5 beats each (ready · anticipation (opposite move) · contact (held) · follow-through (overshoot) · settle) — events fire on contact */
const ACTS = {
  wai:   {len: 0.86, b: [0.08, 0.28, 0.38, 0.66]},
  wave:  {len: 1.1, b: [0.08, 0.22, 0.3, 0.9]},
  cheer: {len: 0.9, b: [0.06, 0.2, 0.32, 0.62]},
  slash: {len: 0.83, b: [0.08, 0.3, 0.39, 0.65]},
  hurt:  {len: 1.2, b: [0.0, 0.0, 0.09, 0.45]},
  sweep: {len: 1.6, b: [0.1, 0.4, 0.55, 1.2]},
  look:  {len: 1.6, b: [0.1, 0.5, 0.9, 1.3]},
  hop:   {len: 0.8, b: [0.05, 0.2, 0.3, 0.55]},
  pet:   {len: 0.9, b: [0.06, 0.24, 0.36, 0.7]}};
function play(c, k, onContact){ c.st.act = {k, t: 0, fired: false, on: onContact}; }
function poseChibi(c, dt, time){ const s = c.st, P = {hipY: 0.3, bx: 0, by: 0, bz: 0, hx: 0, hy: s.look, aLx: 0, aLz: -0.12, aRx: 0, aRz: 0.12, lL: 0, lR: 0, sw: 2.1, sq: 1, blink: 1};
  const k = clamp(s.spd, 0, 1.5); s.phase += dt * (3 + k * 7.5);
  if(s.air){ P.aLz = -1.15; P.aRz = 1.15; P.aLx = -0.3; P.aRx = -0.3; P.lL = -0.55; P.lR = 0.25; P.bx = -0.08; }
  else if(k > 0.05){ const w = Math.sin(s.phase), q = Math.min(1, k); P.lL = w * 0.72 * q; P.lR = -w * 0.72 * q; P.aLx = -w * 0.6 * q; P.aRx = w * 0.6 * q; P.hipY += Math.abs(Math.cos(s.phase)) * 0.035 * q; P.bx = 0.06 + (k > 1 ? 0.1 : 0); P.by = w * 0.08 * q; P.hy = -w * 0.06 * q; }
  else { const br = Math.sin(time * 2.3 + c.root.id); P.sq = 1 + br * 0.012; P.hx = br * 0.025; P.aLz = -0.12 - br * 0.03; P.aRz = 0.12 + br * 0.03;   /* 🫁 alive idle: breathing */
    s.gim -= dt; if(s.gim < 0 && !s.act){ s.gim = 5 + R() * 5; if(c.idle) c.idle(c); } }
  s.blink -= dt; if(s.blink < 0){ P.blink = 0.12; if(s.blink < -0.11) s.blink = 2 + R() * 3.5; }
  if(s.land > 0){ s.land -= dt; const t = 1 - s.land / 0.32; P.sq *= t < 0.3 ? lerp(1, 0.82, t / 0.3) : t < 0.65 ? lerp(0.82, 1.06, (t - 0.3) / 0.35) : lerp(1.06, 1, (t - 0.65) / 0.35); }
  if(s.crouch > 0){ P.sq *= 0.86; P.hipY -= 0.05; P.aLz = -0.45; P.aRz = 0.45; }
  const a = s.act; if(a){ a.t += dt; const D = ACTS[a.k], b = D.b, t = a.t;
    const ph = t < b[0] ? 0 : t < b[1] ? 1 : t < b[2] ? 2 : t < b[3] ? 3 : 4, u = ph === 0 ? t / b[0] : ph === 1 ? seg(t, b[0], b[1]) : ph === 2 ? seg(t, b[1], b[2]) : ph === 3 ? seg(t, b[2], b[3]) : seg(t, b[3], D.len);
    if(ph >= 2 && !a.fired){ a.fired = true; if(a.on) a.on(c); }
    const W = (pre, ant, con, fol) => ph === 0 ? lerp(0, pre, u) : ph === 1 ? lerp(pre, ant, E.out(u)) : ph === 2 ? lerp(ant, con, E.in(u)) : ph === 3 ? lerp(con, fol, E.out(u)) : lerp(fol, 0, E.io(u));
    if(a.k === 'wai'){ P.bx = W(0, -0.1, 0.52, -0.07); P.hx = W(0, -0.05, 0.28, -0.04); const hx = W(0, -1.0, -1.55, -1.25), hz = W(0, 0.5, 0.78, 0.6); P.aLx = P.aRx = hx; P.aLz = hz; P.aRz = -hz; P.lL = P.lR = 0; }
    if(a.k === 'wave'){ P.aRz = W(0.12, -0.15, 2.5, 2.4) ; P.aRx = ph >= 2 && ph < 4 ? Math.sin(t * 16) * 0.32 - 0.2 : 0; P.hy = W(0, -0.1, 0.12, 0.08); P.bz = W(0, 0.04, -0.08, -0.05); }
    if(a.k === 'cheer'){ P.aLz = W(-0.12, 0.3, -2.6, -2.4); P.aRz = -P.aLz; P.sq *= W(1, 0.86, 1.1, 1.0) || 1; P.hipY += Math.max(0, W(0, -0.05, 0.22, 0.04)); }
    if(a.k === 'slash'){ P.aRx = W(0, -1.0, -1.45, -1.62); P.aRz = W(0.12, 1.25, -0.75, -1.0); P.by = W(0, 0.45, -0.5, -0.62); P.sw = W(2.1, 2.85, 1.35, 1.2) || 2.1; P.bx = W(0, -0.05, 0.12, 0.06); P.lL = W(0, 0.25, -0.2, -0.15); P.lR = -P.lL; }
    if(a.k === 'hurt'){ P.bx = W(0, 0, -0.5, -0.28); P.hx = W(0, 0, -0.35, -0.1) + (ph === 4 ? Math.sin(t * 9) * 0.12 : 0); P.hy = ph === 4 ? Math.sin(t * 7) * 0.25 : 0; P.aLz = W(-0.12, -0.12, -1.3, -0.6); P.aRz = -P.aLz; P.sq *= W(1, 1, 0.8, 1.04) || 1; }
    if(a.k === 'sweep'){ P.aRx = W(0, 0.3, -0.5, 0.25); P.aLx = P.aRx * 0.8; P.bx = W(0, -0.04, 0.16, 0.05); P.by = W(0, 0.25, -0.3, -0.1); }
    if(a.k === 'look'){ P.hy = W(0, 0.55, -0.55, -0.4); P.hx = W(0, -0.12, -0.18, -0.1); }
    if(a.k === 'hop'){ P.hipY += Math.max(0, W(0, -0.05, 0.3, 0.05)); P.sq *= W(1, 0.85, 1.1, 1.0) || 1; P.aLz = W(-0.12, 0.2, -1.5, -0.6); P.aRz = -P.aLz; }
    if(a.k === 'pet'){ P.aRx = W(0, -0.6, -1.35, -1.1) + (ph === 3 ? Math.sin(t * 20) * 0.1 : 0); P.bx = W(0, -0.05, 0.25, 0.15); }
    if(t >= D.len) s.act = null; }
  const r = s.act ? 1 - Math.exp(-dt * 40) : 1 - Math.exp(-dt * 16), Lp = (o, key, v) => { o[key] = lerp(o[key], v, r); };
  Lp(c.hip.position, 'y', P.hipY); Lp(c.body.rotation, 'x', P.bx); Lp(c.body.rotation, 'y', P.by); Lp(c.body.rotation, 'z', P.bz); Lp(c.neck.rotation, 'x', P.hx); Lp(c.neck.rotation, 'y', P.hy);
  Lp(c.armL.rotation, 'x', P.aLx); Lp(c.armL.rotation, 'z', P.aLz); Lp(c.armR.rotation, 'x', P.aRx); Lp(c.armR.rotation, 'z', P.aRz); Lp(c.legL.rotation, 'x', P.lL); Lp(c.legR.rotation, 'x', P.lR);
  if(c.item && c.L.item === 'sword') Lp(c.item.rotation, 'x', P.sw);
  s.squash = lerp(s.squash, P.sq, r); c.hip.scale.set(1 / Math.sqrt(s.squash), s.squash, 1 / Math.sqrt(s.squash)); c.eyes.scale.y = P.blink; }

/* ================= 🐘 Pudding — the baby elephant follower (story-pacing friend, idle gimmicks of his own: toot · ear flap · sniff · look at you) ================= */
function makePudding(){ const root = new T.Group(), body = new T.Group(); root.add(body); body.position.y = 0.42;
  const grey = '#B9B0C6', grey2 = '#A79DB5', pink = '#F4B6C6';
  const bb = new Bld(); bb.add(G.ico1, grey, M(0, 0, -0.05, 0, 0, 0, 0.78, 0.66, 0.92), 0.04); bb.add(G.cone4, grey2, M(0, 0.02, -0.53, -1.9, 0, 0, 0.05, 0.22, 0.05)); bb.add(G.ico0, '#5E5470', M(0, -0.06, -0.62, 0, 0, 0, 0.07));
  bb.add(G.box, '#C0392B', M(0, 0.3, 0.0, 0, 0, 0, 0.5, 0.05, 0.42)); bb.add(G.box, '#E0B547', M(0, 0.3, 0.0, 0, 0, 0, 0.54, 0.02, 0.46));
  const bodyM = bb.mesh(); body.add(bodyM);
  const headG = new T.Group(); headG.position.set(0, 0.14, 0.38); body.add(headG);
  const hb = new Bld(); hb.add(G.ico1, grey, M(0, 0.06, 0.12, 0, 0, 0, 0.58, 0.54, 0.52), 0.04); hb.add(G.disc7, '#FF9DB0', M(0.16, -0.02, 0.33, Math.PI / 2 - 0.3, 0, -0.5, 0.09, 0.01, 0.06)); hb.add(G.disc7, '#FF9DB0', M(-0.16, -0.02, 0.33, Math.PI / 2 - 0.3, 0, 0.5, 0.09, 0.01, 0.06));
  hb.add(G.box, '#E0B547', M(0, 0.33, 0.1, 0.2, 0, 0, 0.2, 0.06, 0.2)); hb.add(G.cone4, '#C0392B', M(0, 0.39, 0.1, 0.2, 0.78, 0, 0.12, 0.12, 0.12));
  for(const s of [-1, 1]) hb.add(G.cone4, '#F4EEE2', M(s * 0.1, -0.12, 0.32, 1.9, 0, s * 0.3, 0.035, 0.1, 0.035));
  const head = hb.mesh(); headG.add(head);
  const eb = new Bld(); for(const s of [-1, 1]){ eb.add(G.ico1, '#2A2233', M(s * 0.13, 0.11, 0.33, 0, s * 0.4, 0, 0.09, 0.11, 0.05)); eb.add(G.ico0, '#FFFFFF', M(s * 0.13 + 0.015, 0.13, 0.355, 0, 0, 0, 0.03)); }
  const eyes = new T.Mesh(eb.geo(), BASIC); eyes.geometry.translate(0, -0.11, 0); eyes.position.y = 0.11; headG.add(eyes);
  const ear = s => { const b = new Bld(); b.add(G.ico1, grey2, M(s * 0.2, 0, -0.02, 0, 0, 0, 0.42, 0.44, 0.07), 0.04); b.add(G.ico1, pink, M(s * 0.19, -0.01, 0.025, 0, 0, 0, 0.3, 0.32, 0.02)); const m = b.mesh(); m.position.set(s * 0.22, 0.12, 0.05); headG.add(m); return m; };
  const earL = ear(-1), earR = ear(1);
  const tr = (len, r0, r1) => { const b = new Bld(); b.add(new T.CylinderGeometry(r1, r0, len, 7), grey, M(0, -len / 2, 0), 0.04); return b.mesh(); };
  const tr1 = tr(0.18, 0.1, 0.085); tr1.position.set(0, -0.02, 0.36); tr1.rotation.x = 0.4; headG.add(tr1);
  const tr2 = (() => { const b = new Bld(); b.add(new T.CylinderGeometry(0.06, 0.08, 0.17, 7), grey, M(0, -0.085, 0), 0.04); b.add(G.cyl8, pink, M(0, -0.17, 0, 0, 0, 0, 0.11, 0.02, 0.11)); return b.mesh(); })(); tr2.position.y = -0.17; tr1.add(tr2);
  const legs = []; for(const [x, z] of [[-0.2, 0.22], [0.2, 0.22], [-0.2, -0.26], [0.2, -0.26]]){ const b = new Bld(); b.add(G.cyl8, grey, M(0, -0.12, 0, 0, 0, 0, 0.19, 0.26, 0.19), 0.04); b.add(G.cyl8, '#F4EEE2', M(0, -0.25, 0.02, 0, 0, 0, 0.2, 0.04, 0.18)); const m = b.mesh(TOON, false); m.position.set(x, -0.16, z); body.add(m); legs.push(m); }
  return {root, body, headG, eyes, earL, earR, tr1, tr2, legs, st: {phase: 0, spd: 0, gim: 3, gk: '', gt: 0, blink: 2, look: 0}}; }
function posePudding(p, dt, time){ const s = p.st, k = clamp(s.spd, 0, 1.4); s.phase += dt * (3 + k * 8);
  const w = Math.sin(s.phase), q = Math.min(1, k * 1.4);
  p.legs[0].rotation.x = w * 0.6 * q; p.legs[3].rotation.x = w * 0.6 * q; p.legs[1].rotation.x = -w * 0.6 * q; p.legs[2].rotation.x = -w * 0.6 * q;
  p.body.position.y = 0.42 + Math.abs(Math.cos(s.phase)) * 0.03 * q; p.body.rotation.z = w * 0.04 * q;
  let tr = 0.4 + Math.sin(time * 1.9) * 0.12, tr2 = 0.3 + Math.sin(time * 2.3 + 1) * 0.15, ear = 0.12 + Math.sin(time * 1.4) * 0.08, hx = Math.sin(time * 1.2) * 0.03, hy = s.look;
  if(k < 0.05){ s.gim -= dt; if(s.gim < 0 && !s.gk){ s.gk = ['toot', 'flap', 'sniff', 'flap', 'toot'][Math.floor(R() * 5)]; s.gt = 0; s.gim = 4 + R() * 5; } }
  if(s.gk){ s.gt += dt; const t = s.gt;
    if(s.gk === 'toot'){ const up = t < 0.35 ? E.out(t / 0.35) : t < 1.0 ? 1 : 1 - seg(t, 1.0, 1.5); tr = lerp(tr, -1.4, up * 0.95); tr2 = lerp(tr2, -0.9, up); hx = -0.25 * up; if(t > 0.35 && !s.tooted){ s.tooted = true; tone(523, 0.12, {type: 'triangle', gain: 0.18, slide: 784}); tone(784, 0.18, {type: 'triangle', gain: 0.14, delay: 0.12}); }
      if(t > 1.5){ s.gk = ''; s.tooted = false; } }
    else if(s.gk === 'flap'){ ear = 0.12 + Math.abs(Math.sin(t * 13)) * 0.9 * (1 - seg(t, 0.7, 1.1)); if(t > 1.1) s.gk = ''; }
    else if(s.gk === 'sniff'){ const d = t < 0.4 ? E.out(t / 0.4) : t < 1.4 ? 1 : 1 - seg(t, 1.4, 1.9); hx = 0.45 * d; tr = lerp(tr, 0.9, d); tr2 = 0.15 + Math.sin(t * 18) * 0.12 * d; if(t > 1.9) s.gk = ''; }
    else if(s.gk === 'happy'){ ear = 0.12 + Math.abs(Math.sin(t * 10)) * 0.8; tr = lerp(tr, -1.2, Math.min(1, t * 4)); hx = -0.2; p.body.position.y += Math.abs(Math.sin(t * 9)) * 0.08; if(t > 1.3) s.gk = ''; } }
  p.tr1.rotation.x = tr; p.tr2.rotation.x = tr2; p.earL.rotation.y = ear; p.earR.rotation.y = -ear; p.headG.rotation.x = hx; p.headG.rotation.y = lerp(p.headG.rotation.y, hy, 1 - Math.exp(-dt * 5));
  s.blink -= dt; p.eyes.scale.y = s.blink < 0 ? 0.12 : 1; if(s.blink < -0.12) s.blink = 2 + R() * 3; }

/* ================= 🐉 Phaya Naga ✦ the Cave Quaker (3 heads) — BUILT IN CODE: one segment chain per head sliding along its curve (InstancedMesh),
   heads + crests + crown painted in code, rim light (boss rule). Blocks from av-naga7p: 🪷 Guardian's Greeting (N0, bow back) · 🪨 Stair Slam (JUMP the spikes) ·
   🕊️ calm bow. Kid rules: ONE contact · aims at you (≤ 60°) · tell ≥ 0.6 s (🌱 Basic × 1.35) · comic hits (BONK · wet socks), never a KO · ends in a breathing pause. ================= */
const NAGA = {N: 15, base: V3(SPOT.nagaBase[0], -1.2, SPOT.nagaBase[1]), S: V3(SPOT.slam[0], 0.02, SPOT.slam[1]), mode: 'asleep', t: 0, e: 0, tempo: 0.9, tell: 1.35, heads: [], aim: V3(0, 0, 1), spikes: [], attempt: 0, result: '', bowed: false, slow: 1, stop: 0};
const NC = {jade: '#3E9C7E', jade2: '#2F8A6C', belly: '#F1D58A', plate: '#8C9A8E', gold: '#E3B341', eye: '#FFB52E', crown: '#F2C14E', gem: '#E2481B'};
function splitAdd(B, geo, top, bot, m, cut, jit){ B.split(geo, top, bot, m, cut, jit); }   /* 3d-t1: lives in Bld now (keeps the recipe for the 🧱 rebuild) */
function nagaSegGeo(){ const B = new Bld(); splitAdd(B, G.ico1, NC.jade, NC.belly, M(0, 0, 0, 0, 0, 0, 1, 0.9, 1.2), -0.16, 0.06); B.add(G.cone4, NC.plate, M(0, 0.44, -0.08, -0.6, Math.PI / 4, 0, 0.32, 0.36, 0.26), 0.1); return B.geo(); }
const NMAT = rimMat('#9FF2D8', 0.55);
function nagaHead(crowned){ const B = new Bld();
  splitAdd(B, G.ico1, NC.jade, NC.belly, M(0, 0, 0, 0, 0, 0, 0.78, 0.62, 0.92), -0.12, 0.05);
  splitAdd(B, new T.CylinderGeometry(0.2, 0.36, 0.62, 6), NC.jade2, NC.belly, M(0, -0.06, 0.52, Math.PI / 2, 0, 0), -0.12, 0.05);
  B.add(G.box, NC.gold, M(0, 0.17, 0.42, 0.18, 0, 0, 0.1, 0.05, 0.5)); for(const s of [-1, 1]){ B.add(G.box, NC.gold, M(s * 0.2, 0.2, 0.22, 0.1, s * 0.35, 0, 0.22, 0.06, 0.1)); B.add(G.cone4, NC.jade2, M(s * 0.42, 0.02, -0.12, 0, 0, s * 1.2, 0.18, 0.42, 0.1)); }
  for(let i = -2; i <= 2; i++) B.add(G.cone4, NC.gold, M(i * 0.12, 0.42 - Math.abs(i) * 0.06, -0.18 - Math.abs(i) * 0.04, -0.55 - Math.abs(i) * 0.1, 0, -i * 0.32, 0.13, 0.62 - Math.abs(i) * 0.1, 0.07), 0.06);   /* kranok crest (flames) */
  B.add(G.ico0, NC.plate, M(0, 0.28, -0.05, 0, 0, 0, 0.4, 0.14, 0.42), 0.1);   /* 🪨 Cave Quaker: a stone hood plate */
  if(crowned){ B.add(G.cyl8, NC.crown, M(0, 0.5, 0.02, 0, 0, 0, 0.5, 0.12, 0.46), 0.05); for(let k = 0; k < 3; k++){ B.add(new T.CylinderGeometry(0.2 - k * 0.055, 0.25 - k * 0.055, 0.13, 8), NC.crown, M(0, 0.62 + k * 0.13, 0.02), 0.05); B.add(G.cyl8, NC.gold, M(0, 0.69 + k * 0.13, 0.02, 0, 0, 0, 0.5 - k * 0.11, 0.03, 0.5 - k * 0.11)); }
    B.add(G.cone6, NC.crown, M(0, 1.1, 0.02, 0, 0, 0, 0.14, 0.32, 0.14)); B.add(G.oct, NC.gem, M(0, 0.56, 0.26, 0, 0, 0, 0.13, 0.16, 0.07)); for(const s of [-1, 1]) B.add(G.cone4, NC.crown, M(s * 0.3, 0.6, 0.0, 0, 0, -s * 0.9, 0.08, 0.3, 0.06)); }
  const m = new T.Mesh(B.geo(), NMAT); outlined(m);
  const eb = new Bld(); for(const s of [-1, 1]){ eb.add(G.ico1, NC.eye, M(s * 0.27, 0.12, 0.3, 0, s * 0.5, 0, 0.17, 0.12, 0.1)); eb.add(G.ico0, '#4A2300', M(s * 0.3, 0.12, 0.33, 0, s * 0.5, 0, 0.05, 0.1, 0.05)); }
  const eyes = new T.Mesh(eb.geo(), BASIC); m.add(eyes); return {m, eyes, H: V3(0, -3, 0), D: V3(0, 0, 1), crowned}; }
function buildNaga(){ const g = new T.Group(); g.name = 'naga'; world.add(g); NAGA.g = g;
  NAGA.seg = instanced(nagaSegGeo(), NMAT, NAGA.N * 3); g.add(NAGA.seg);
  for(let h = -1; h <= 1; h++){ const H = nagaHead(h === 0); H.h = h; g.add(H.m); NAGA.heads.push(H); }
  NAGA.glow = new T.Sprite(new T.SpriteMaterial({map: radialTex([[0, 'rgba(255,214,120,1)'], [0.35, 'rgba(255,150,40,.55)'], [1, 'rgba(255,120,0,0)']]), blending: T.AdditiveBlending, depthWrite: false, transparent: true}));
  NAGA.glow.scale.setScalar(0.01); g.add(NAGA.glow); g.visible = false; }
const _x = new T.Vector3(), _y = new T.Vector3(), _z = new T.Vector3(), _m4 = new T.Matrix4(), REF = new T.Vector3(0, 1, -0.7).normalize();
function basis(z){ _z.copy(z).normalize(); _x.crossVectors(REF, _z); if(_x.lengthSq() < 1e-6) _x.set(1, 0, 0); _x.normalize(); _y.crossVectors(_z, _x); return _m4.makeBasis(_x, _y, _z); }
const bez = (a, b, c, d, t, o) => { const u = 1 - t; return o.set(u * u * u * a.x + 3 * u * u * t * b.x + 3 * u * t * t * c.x + t * t * t * d.x, u * u * u * a.y + 3 * u * u * t * b.y + 3 * u * t * t * c.y + t * t * t * d.y, u * u * u * a.z + 3 * u * u * t * b.z + 3 * u * t * t * c.z + t * t * t * d.z); };
const bezD = (a, b, c, d, t, o) => { const u = 1 - t; return o.set(3 * u * u * (b.x - a.x) + 6 * u * t * (c.x - b.x) + 3 * t * t * (d.x - c.x), 3 * u * u * (b.y - a.y) + 6 * u * t * (c.y - b.y) + 3 * t * t * (d.y - c.y), 3 * u * u * (b.z - a.z) + 6 * u * t * (c.z - b.z) + 3 * t * t * (d.z - c.z)); };
const _p = new T.Vector3(), _d = new T.Vector3(), _P1 = new T.Vector3(), _P2 = new T.Vector3(), _B = new T.Vector3(), _sc = new T.Vector3();
function nagaLook(H, target, pitch){ const d = target.clone().sub(H); d.y = d.y * 0.4 + pitch; return d.normalize(); }
/* head targets per block — each returns {H, D} for head h at block time t */
function nagaIdlePose(h, time, look){ const sway = Math.sin(time * 1.05 + h * 1.9), B = NAGA.base;
  const H = V3(B.x + h * 2.05 + sway * 0.16, B.y + 5.5 - Math.abs(h) * 0.8 + Math.sin(time * 1.6 + h) * 0.14, B.z + 1.15 + Math.abs(h) * 0.25 + Math.cos(time * 1.25 + h) * 0.1);
  return {H, D: nagaLook(H, look, -0.35)}; }
function nagaUpdate(dt, time, hero){
  const N = NAGA; if(N.mode === 'asleep'){ N.g.visible = false; return; } N.g.visible = true;
  if(N.stop > 0){ N.stop -= dt; return; }   /* ⏸️ hit-stop on contact */
  dt *= N.slow; N.t += dt; const t = N.t, look = V3(hero.root.position.x, 0.9, hero.root.position.z);
  let crest = 0, glow = 0, eyeY = 1, rate = 7;
  const poses = N.heads.map(H => nagaIdlePose(H.h, time, look));
  if(N.mode === 'rise'){ N.e = E.back(clamp(t / 1.9, 0, 1)); crest = clamp((t - 0.9) / 0.8, 0, 1); glow = crest * 0.6; if(t > 2.4){ N.mode = 'greet'; N.t = 0; N.onGreet && N.onGreet(); } }
  else if(N.mode === 'greet'){ glow = 0.4 + Math.sin(t * 3) * 0.15; crest = 1; if(N.bowed || t > 6.5){ N.mode = 'nod'; N.t = 0; N.nodNext = N.nodNext || 'slam'; } }
  else if(N.mode === 'nod'){ crest = 1; poses.forEach(p => { p.D.y -= Math.pow(Math.sin(clamp(t / 1.4, 0, 1) * Math.PI * 2), 2) * 0.55; p.D.normalize(); }); eyeY = 0.4; if(t > 1.5){ N.mode = N.nodNext || 'idle'; N.t = 0; N.nodNext = null; if(N.mode === 'slam') slamStart(); } }
  else if(N.mode === 'idle'){ crest = 1; if(N.after && t > N.after.at){ const k = N.after.k; N.after = null; if(k === 'slam') slamStart(); else if(k === 'calm'){ N.mode = 'calm'; N.t = 0; } } }
  else if(N.mode === 'slam'){ crest = 1; rate = 22; const TL = 1.0 * N.tell / N.tempo, AN = TL + 0.25 / N.tempo, ST = AN + 0.1, FO = ST + 0.45, SE = FO + 0.9, mid = poses[1], i0 = N.idle0 || mid;
    if(!N.contact) N.aim = aimAt(hero);
    const high = {H: i0.H.clone().add(V3(0, 1.5, -1.15)), D: V3(0, 0.6, 1).normalize()}, hit = {H: N.S.clone().add(V3(0, 0.6, -0.5)).addScaledVector(N.aim, 0.12), D: V3(N.aim.x * 0.5, -1, N.aim.z * 0.5 + 0.1).normalize()}, up = {H: N.S.clone().add(V3(0, 1.3, -1.0)), D: V3(N.aim.x, -0.2, N.aim.z).normalize()};
    let P;
    if(t < TL){ const u = E.out(seg(t, 0, TL * 0.6)); P = {H: mid.H.clone().lerp(high.H, u), D: mid.D.clone().lerp(high.D, u).normalize()}; glow = 0.4 + u * 0.8; crackShow(t / TL); if(t > TL * 0.35 && !N.saidJump){ N.saidJump = true; N.onTell && N.onTell(); } }
    else if(t < AN){ P = {H: high.H.clone().add(V3(Math.sin(t * 70) * 0.05, 0.15 * seg(t, TL, AN), -0.1 * seg(t, TL, AN))), D: high.D.clone()}; glow = 1.2; if(R() < dt * 30) fxPebble(high.H); crackShow(1); }
    else if(t < ST){ const u = E.in(seg(t, AN, ST)); P = {H: high.H.clone().lerp(hit.H, u), D: high.D.clone().lerp(hit.D, u).normalize()}; glow = 1.2; rate = 60; }
    else if(t < FO){ if(!N.contact){ N.contact = true; N.stop = 0.09; slamContact(hero); } const u = seg(t, ST, FO); P = {H: hit.H.clone().lerp(up.H, E.back(u)), D: hit.D.clone().lerp(up.D, E.out(u)).normalize()}; glow = 0.6 * (1 - u); rate = 30; }
    else if(t < SE){ const u = E.io(seg(t, FO, SE)); P = {H: up.H.clone().lerp(mid.H, u), D: up.D.clone().lerp(mid.D, u).normalize()}; crackShow(0); }
    else { P = mid; if(t > SE + 0.3 && spikesDone()) slamEnd(hero); }
    poses[1] = P; const lean = t < AN ? E.out(seg(t, 0, TL)) : t < FO ? 1 - seg(t, ST, FO) * 0.6 : 1 - seg(t, FO, SE);
    [0, 2].forEach(i => { const s = i ? 1 : -1; poses[i].H.add(V3(s * 0.65 * lean, -0.3 * lean, -0.4 * lean)); if(t > ST && t < FO) poses[i].H.y += Math.sin(seg(t, ST, FO) * Math.PI) * 0.45; }); }
  else if(N.mode === 'calm'){ crest = 1; poses.forEach(p => { p.H.y -= 0.8 * E.out(clamp(t / 0.8, 0, 1)); p.D.y -= Math.pow(Math.sin(clamp((t - 0.4) / 1.6, 0, 1) * Math.PI * 2), 2) * 0.6; p.D.normalize(); }); eyeY = 0.35; glow = 0.5;
    if(R() < dt * 9) fxBubble(); if(!N.calmed && t > 0.6){ N.calmed = true; N.onCalm && N.onCalm(); } if(t > 3.6 && N.autoSink){ N.mode = 'sink'; N.t = 0; } }
  else if(N.mode === 'sink'){ N.e = 1 - E.io(clamp(t / 2.2, 0, 1)); crest = 1 - clamp(t / 1.2, 0, 1); if(R() < dt * 12) fxBubble(); if(t > 2.3){ N.mode = 'asleep'; N.e = 0; N.onSink && N.onSink(); } }
  /* apply: emerge · smooth · chain */
  const B = N.base, k = 1 - Math.exp(-dt * rate);
  N.heads.forEach((Hd, i) => { const P = poses[i], sub = V3(lerp(B.x, P.H.x, 0.3), B.y - 0.6, lerp(B.z, P.H.z, 0.3)), tH = sub.lerp(P.H, N.e);
    if(Hd.H.y < -2.5) Hd.H.copy(tH); Hd.H.lerp(tH, k); Hd.D.lerp(P.D, k).normalize();
    Hd.m.position.copy(Hd.H); Hd.m.quaternion.setFromRotationMatrix(basis(Hd.D)); Hd.m.scale.setScalar(1.3);
    Hd.eyes.scale.y = lerp(Hd.eyes.scale.y, eyeY, k);
    _B.set(B.x + Hd.h * 0.55, B.y, B.z - Math.abs(Hd.h) * 0.2); _P1.copy(_B).add(_sc.set(Hd.h * 0.9, 2.4, -1.9)); _P2.copy(Hd.H).addScaledVector(Hd.D, -1.5); _P2.y -= 0.9;
    for(let s = 0; s < N.N; s++){ const u = Math.pow((s + 0.5) / N.N, 0.92) * 0.97; bez(_B, _P1, _P2, Hd.H, u, _p); bezD(_B, _P1, _P2, Hd.H, u, _d); const r = lerp(0.8, 0.5, u) * (Hd.h ? 0.9 : 1);
      _m4.copy(basis(_d)); _m4.scale(_sc.set(r, r, r * 1.05)); _m4.setPosition(_p); N.seg.setMatrixAt(i * N.N + s, _m4); } });
  N.seg.instanceMatrix.needsUpdate = true;
  const mid = N.heads[1]; N.crest = lerp(N.crest || 0, crest, k); N.heads.forEach(H => { H.m.scale.y = 1.3 * (0.82 + 0.18 * N.crest); });
  N.glow.position.copy(mid.H).add(V3(0, 0.75, -0.1)); const gs = glow * (2.2 + Math.sin(time * 9) * 0.25); N.glow.scale.setScalar(Math.max(0.01, gs)); N.glow.material.opacity = clamp(glow, 0, 1);
  NMAT.userData.rim.value = 0.45 + glow * 0.5;
  spikesUpdate(dt, hero); }
function aimAt(hero){ const d = V3(hero.root.position.x - NAGA.S.x, 0, hero.root.position.z - NAGA.S.z); if(d.lengthSq() < 0.01) d.set(0, 0, 1); d.normalize();
  const a = Math.atan2(d.x, d.z), c = clamp(a, -Math.PI / 3, Math.PI / 3); return V3(Math.sin(c), 0, Math.cos(c)); }
function slamStart(){ const N = NAGA; N.mode = 'slam'; N.t = 0; N.contact = false; N.saidJump = false; N.result = ''; N.jumped = false; N.hit = false; N.near = false; N.idle0 = null;
  N.idle0 = {H: N.heads[1].H.clone(), D: N.heads[1].D.clone()}; tone(110, 0.5, {type: 'sawtooth', gain: 0.06, slide: 160}); }
function slamContact(hero){ const N = NAGA; shake(0.32); sound('bump'); tone(70, 0.35, {type: 'square', gain: 0.22, slide: 38}); fxRing(N.S.x, 0.05, N.S.z, 2.6, 0.5, '#FFF3D6');
  for(let i = 0; i < 16; i++) fxDust(N.S.x + (R() - 0.5) * 1.2, 0.1, N.S.z + (R() - 0.5) * 0.8, 1.2);
  const hp = hero.root.position; if(Math.hypot(hp.x - N.S.x, hp.z - N.S.z) < 0.95 && hp.y < 0.3){ N.hit = true; N.onHit && N.onHit('head'); }
  const L = Math.max(5.6, Math.hypot(hp.x - N.S.x, hp.z - N.S.z) + 2.2), n = Math.ceil(L / 0.7);
  for(let i = 0; i < n; i++){ const d = 0.9 + i * 0.7, j = (R() - 0.5) * 0.18; const x = N.S.x + N.aim.x * d - N.aim.z * j, z = N.S.z + N.aim.z * d + N.aim.x * j;
    if(!onLand(x, z) && !(Math.abs(x) < 2 && z > N.S.z - 0.3)) break; N.spikes.push({x, z, t: -(0.1 + i * 0.11), r: R() * 3, s: 0.85 + R() * 0.35}); } }
function spikesDone(){ return NAGA.spikes.every(s => s.t > 0.62); }
function spikesUpdate(dt, hero){ const N = NAGA, im = SPK; let n = 0; const hp = hero.root.position;
  for(const s of N.spikes){ const was = s.t; s.t += dt; if(was < 0 && s.t >= 0){ for(let k = 0; k < 4; k++) fxDust(s.x, 0.05, s.z, 0.8); for(let k = 0; k < 3; k++) fxPebbleAt(s.x, 0.2, s.z); tone(150 + R() * 40, 0.07, {type: 'square', gain: 0.07, slide: 80}); }
    if(s.t < 0) continue; const t = s.t, h = t < 0.08 ? E.out(t / 0.08) * 1.18 : t < 0.13 ? lerp(1.18, 1, (t - 0.08) / 0.05) : t < 0.4 ? 1 : 1 - E.in(seg(t, 0.4, 0.62));
    if(t < 0.3){ const d = Math.hypot(hp.x - s.x, hp.z - s.z); if(d < 0.7 && hp.y >= 0.2) N.jumped = true; if(t > 0.02 && t < 0.15 && d < 0.56 && hp.y < 0.2 && !N.jumped){ if(!N.hit){ N.hit = true; N.onHit && N.onHit('spike'); } } if(d < 1.3) N.near = true; }
    if(h <= 0.01 || n > 57) continue;
    im.setMatrixAt(n++, M(s.x, 0, s.z, 0, s.r, 0, 0.5 * s.s, 1.0 * h * s.s, 0.5 * s.s)); im.setMatrixAt(n++, M(s.x + 0.22, 0, s.z + 0.1, 0.2, s.r + 1, -0.35, 0.3 * s.s, 0.6 * h * s.s, 0.3 * s.s)); im.setMatrixAt(n++, M(s.x - 0.2, 0, s.z - 0.08, -0.2, s.r + 2, 0.35, 0.28 * s.s, 0.52 * h * s.s, 0.28 * s.s)); }
  N.spikes = N.spikes.filter(s => s.t < 0.7); setCount(im, n); im.instanceMatrix.needsUpdate = true; }
function slamEnd(hero){ const N = NAGA; N.attempt++; const res = N.hit ? 'hit' : N.jumped ? 'jump' : 'miss'; N.result = res; N.onResult && N.onResult(res, N.attempt);
  if(res === 'jump' || N.attempt >= 3 || N.stage){ N.mode = 'idle'; N.t = 0; N.after = N.stage ? null : {k: res === 'jump' || N.attempt >= 3 ? 'calm' : 'slam', at: 0.6}; }
  else { N.mode = 'idle'; N.t = 0; N.after = {k: 'slam', at: res === 'hit' ? 1.6 : 1.1}; if(res === 'hit') for(let i = 0; i < 6; i++) fxBubble(); } }
/* the crack line (its tell): dashes appear along the aim, nearest first */
let CRK = null;
function crackShow(f){ const im = CRK; let n = 0; if(f > 0){ const N = NAGA; for(let i = 0; i < 14; i++){ const d = 0.9 + i * 0.55, show = clamp(f * 16 - i, 0, 1); if(show <= 0) break; const x = N.S.x + N.aim.x * d, z = N.S.z + N.aim.z * d; if(!onLand(x, z) && i > 2) break;
  im.setMatrixAt(n++, M(x, 0.04, z, 0, Math.atan2(N.aim.x, N.aim.z) + (i % 2 ? 0.25 : -0.25), 0, 0.09 * show, 0.02, 0.42 * show)); } } setCount(im, n); im.instanceMatrix.needsUpdate = true; }

/* ================= ✨ FX — particles (one InstancedMesh) · rings · glow · smear · blob shadows · markers · shake ================= */
const PGEO = (() => { const B = new Bld(); B.add(G.ico0, '#FFFFFF', M()); return B.geo(); })();
const PMAX = 240, PIM = instanced(PGEO, TOON, PMAX, false); scene.add(PIM); const PARTS = [];
function fx(x, y, z, vx, vy, vz, life, size, col, grav, drag, grow){ if(PARTS.length >= PMAX) PARTS.shift(); PARTS.push({x, y, z, vx, vy, vz, life, max: life, size, col: new T.Color(col), grav: grav == null ? 9 : grav, drag: drag || 0, grow: grow || 0, rx: R() * 3, ry: R() * 3}); }
function fxDust(x, y, z, k){ const a = R() * TAU, s = (0.6 + R() * 1.6) * (k || 1); fx(x, y, z, Math.cos(a) * s, 0.6 + R() * 1.4 * (k || 1), Math.sin(a) * s, 0.55 + R() * 0.4, 0.16 + R() * 0.14, R() < 0.5 ? '#E3CFA8' : '#CDB48C', -1.5, 2.6, 0.9); }
function fxPebble(H){ fx(H.x + (R() - 0.5) * 0.6, H.y - 0.2, H.z + (R() - 0.5) * 0.6, (R() - 0.5) * 0.6, -0.5, (R() - 0.5) * 0.6, 0.9, 0.09 + R() * 0.07, '#8C9A8E', 12, 0); }
function fxPebbleAt(x, y, z){ const a = R() * TAU; fx(x, y, z, Math.cos(a) * 1.6, 3 + R() * 2.4, Math.sin(a) * 1.6, 0.8, 0.08 + R() * 0.08, R() < 0.5 ? '#8E7562' : '#A08A72', 14, 0); }
function fxBubble(){ const a = R() * TAU, r = R() * 1.8, b = NAGA.base; fx(b.x + Math.cos(a) * r, -0.3, b.z + Math.sin(a) * r * 0.8, 0, 0.6 + R() * 0.6, 0, 1.0 + R() * 0.6, 0.08 + R() * 0.12, R() < 0.6 ? '#FFFFFF' : '#BFF3F2', -0.4, 0.5); }
function fxSplash(x, z, n){ for(let i = 0; i < (n || 10); i++){ const a = R() * TAU, s = 0.5 + R() * 1.5; fx(x + Math.cos(a) * 0.6, -0.28, z + Math.sin(a) * 0.6, Math.cos(a) * s, 2.4 + R() * 3, Math.sin(a) * s, 0.8, 0.1 + R() * 0.1, R() < 0.5 ? '#FFFFFF' : '#9EE3E6', 9, 0.3); } }
function fxLeaf(x, y, z){ for(let i = 0; i < 7; i++){ const a = R() * TAU; fx(x, y, z, Math.cos(a) * 1.3, 1.5 + R() * 1.5, Math.sin(a) * 1.3, 0.9, 0.08 + R() * 0.06, R() < 0.5 ? '#5DAE4E' : '#8CC66A', 4, 1.5); } }
function fxHearts(x, y, z){ for(let i = 0; i < 5; i++) fx(x + (R() - 0.5) * 0.4, y, z + (R() - 0.5) * 0.4, (R() - 0.5) * 0.4, 1.1 + R() * 0.6, (R() - 0.5) * 0.4, 1.1, 0.1 + R() * 0.05, '#FF6FA5', -0.6, 0.8); }
function fxSparkle(x, y, z, n, col){ for(let i = 0; i < (n || 8); i++){ const a = R() * TAU, e = R() * 2 - 1; fx(x, y, z, Math.cos(a) * 1.6 * (1 - e * e), e * 1.6 + 0.8, Math.sin(a) * 1.6 * (1 - e * e), 0.7, 0.07 + R() * 0.05, col || '#FFE58A', 0, 2.2); } }
function fxUpdate(dt){ let n = 0; for(let i = PARTS.length - 1; i >= 0; i--){ const p = PARTS[i]; p.life -= dt; if(p.life <= 0){ PARTS.splice(i, 1); continue; }
    p.vy -= p.grav * dt; const d = Math.max(0, 1 - p.drag * dt); p.vx *= d; p.vz *= d; p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt; if(p.grav > 3 && p.y < 0.03 && onLand(p.x, p.z)){ p.y = 0.03; p.vy *= -0.3; p.vx *= 0.6; p.vz *= 0.6; } }
  for(const p of PARTS){ const f = p.life / p.max, s = p.size * (f > 0.75 ? (1 - f) * 4 : 1) * (1 + p.grow * (1 - f)) * (f < 0.3 ? f / 0.3 : 1); PIM.setMatrixAt(n, M(p.x, p.y, p.z, p.rx, p.ry, 0, s)); PIM.setColorAt(n, p.col); n++; }
  setCount(PIM, n); PIM.instanceMatrix.needsUpdate = true; if(PIM.instanceColor) PIM.instanceColor.needsUpdate = true; }
const RINGS = []; for(let i = 0; i < 6; i++){ const m = new T.Mesh(new T.RingGeometry(0.86, 1, 32), new T.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0, depthWrite: false, side: T.DoubleSide})); m.rotation.x = -Math.PI / 2; m.visible = false; scene.add(m); RINGS.push({m, t: 1, life: 1, r: 1}); }
function fxRing(x, y, z, r, life, col){ const g = RINGS.find(q => q.t >= q.life) || RINGS[0]; g.m.position.set(x, y, z); g.m.material.color.set(col || '#FFFFFF'); g.t = 0; g.life = life || 0.6; g.r = r || 2; g.m.visible = true; }
function ringsUpdate(dt){ for(const g of RINGS){ if(g.t >= g.life){ g.m.visible = false; continue; } g.t += dt; const f = g.t / g.life; g.m.scale.setScalar(0.2 + g.r * E.out(f)); g.m.material.opacity = 0.85 * (1 - f); } }
const SHK = {t: 0, a: 0}; function shake(a){ SHK.t = 0.28; SHK.a = a; }
const SHADOW = (() => { const m = new T.InstancedMesh(new T.PlaneGeometry(1, 1).rotateX(-Math.PI / 2), new T.MeshBasicMaterial({map: radialTex([[0, 'rgba(40,30,50,.42)'], [0.6, 'rgba(40,30,50,.22)'], [1, 'rgba(40,30,50,0)']]), transparent: true, depthWrite: false}), 8); m.frustumCulled = false; m.renderOrder = 1; scene.add(m); return m; })();
function shadows(list){ list.forEach((s, i) => SHADOW.setMatrixAt(i, M(s[0], s[1] + 0.035, s[2], 0, 0, 0, s[3], 1, s[3] * (s[4] || 1)))); SHADOW.count = list.length; SHADOW.instanceMatrix.needsUpdate = true; }
const MARK = instanced((() => { const B = new Bld(); B.add(G.oct, '#FFC21A', M(0, 0, 0, 0, 0, 0, 0.36, 0.5, 0.36)); return B.geo(); })(), TOON, 4); scene.add(MARK);
const REACH = new T.Mesh(new T.TorusGeometry(0.62, 0.05, 4, 28), new T.MeshBasicMaterial({color: 0xFFD23F})); REACH.rotation.x = -Math.PI / 2; REACH.visible = false; scene.add(REACH);
const SMEAR = new T.Mesh(new T.RingGeometry(0.38, 0.8, 18, 1, 0, Math.PI * 0.95), new T.MeshBasicMaterial({color: 0xFFFFFF, transparent: true, opacity: 0, depthWrite: false, side: T.DoubleSide, blending: T.AdditiveBlending}));
SMEAR.rotation.x = -Math.PI / 2; SMEAR.position.y = 0.55; SMEAR.visible = false;
const STARS = instanced((() => { const B = new Bld(); B.add(G.oct, '#FFE14D', M(0, 0, 0, 0, 0, 0, 0.12, 0.16, 0.12)); return B.geo(); })(), TOON, 3, false); scene.add(STARS); setCount(STARS, 0);
const SPK = instanced((() => { const B = new Bld(); B.add(G.cone5, C.rock2, M(0, 0.5, 0), 0.14); B.add(G.cone5, C.rock1, M(0.06, 0.25, 0.04, 0, 0.5, 0, 0.7, 0.45, 0.7), 0.14); return B.geo(); })(), TOON, 60); scene.add(SPK); setCount(SPK, 0);
CRK = instanced((() => { const B = new Bld(); B.add(G.box, '#5C4636', M()); return B.geo(); })(), BASIC, 16, false); scene.add(CRK); setCount(CRK, 0);

/* ================= 🎮 build the world ================= */
const tb0 = performance.now();
buildIslet(); scatter(); buildNaga();
const BELL = (() => { const pts = [[0, 0], [0.12, -0.02], [0.2, -0.12], [0.26, -0.34], [0.34, -0.56], [0.38, -0.62], [0, -0.62]].map(p => new T.Vector2(p[0], p[1]));
  const B = new Bld(); B.add(new T.LatheGeometry(pts, 8), C.bronze, M(), 0.06); B.add(G.box, C.bronze, M(0, 0.06, 0, 0, 0, 0, 0.08, 0.14, 0.08)); B.add(G.ico0, '#7A5A2E', M(0, -0.58, 0, 0, 0, 0, 0.12));
  const m = B.mesh(); m.position.set(SPOT.bell[0], 2.32, SPOT.bell[1]); world.add(m); return {m, t: 9}; })();
const LOOKS = {i: 0, me: null};
let hero = makeChibi(lookOf(null)); world.add(hero.root);
const H = {x: SPOT.arrive[0], z: SPOT.arrive[1], y: 0, vy: 0, face: Math.PI / 2, air: false, crouch: 0, go: null, kb: null, dizzy: 0, inv: 0, jumpQ: 0};
hero.root.position.set(H.x, 0, H.z); hero.root.add(SMEAR);
const pud = makePudding(); world.add(pud.root); const PD = {x: H.x - 0.6, z: H.z + 1.2, face: Math.PI / 2}; pud.root.position.set(PD.x, 0, PD.z);
const monk = makeChibi({skin: '#E3A87C', hair: 'bald', hairCol: '#E3A87C', outfit: 'robe', top: '#E8892B', bottom: '#E8892B', trim: '#C9661C', shoe: '#6B4A2E', item: 'broom'}, {scale: 1.06});
const tara = makeChibi({skin: '#F5C9A5', hair: 'ponytail', hairCol: '#2B1B12', outfit: 'dress', top: '#8CCBF2', bottom: '#8CCBF2', trim: '#FFFFFF', shoe: '#F7A8C8', item: ''}, {scale: 0.9});
const NPCS = [{c: monk, id: 'monk', x: SPOT.monk[0], z: SPOT.monk[1], face0: Math.atan2(-SPOT.monk[0], -SPOT.monk[1]) + 0.5}, {c: tara, id: 'tara', x: SPOT.tara[0], z: SPOT.tara[1], face0: Math.atan2(SPOT.dock[0] - SPOT.tara[0], SPOT.dock[1] - SPOT.tara[1]) + 1.2}];
NPCS.forEach(n => { n.face = n.face0; n.c.root.position.set(n.x, 0, n.z); n.c.root.rotation.y = n.face; world.add(n.c.root); addCol(n.x, n.z, 0.32); });
monk.idle = c => play(c, R() < 0.7 ? 'sweep' : 'look'); tara.idle = c => play(c, R() < 0.5 ? 'hop' : 'look');
PERF.buildMs = performance.now() - tb0;

/* ================= 📜 quests (2–3 chips) + hint bar + interact targets ================= */
const Q = [{id: 'monk', ic: '💬', t: 'Meet Luang Ta Kaew', at: SPOT.monk, hy: 2.3}, {id: 'bell', ic: '🔔', t: 'Find the silent bell', at: SPOT.bell, hy: 3.6}, {id: 'naga', ic: '🐉', t: 'Wake the naga stair', at: [0, STAIR_TOP + 0.8], hy: 2.0}];
const DONE = new Set(); let qPick = null;
function qNext(){ return qPick && !DONE.has(qPick) ? Q.find(q => q.id === qPick) : Q.find(q => !DONE.has(q.id)); }
function drawQuests(pop){ const nx = qNext(); $('quests').innerHTML = Q.map(q => '<div class="q' + (DONE.has(q.id) ? ' done' : '') + (nx && nx.id === q.id ? ' now' : '') + (pop === q.id ? ' pop' : '') + '" data-q="' + q.id + '"><i>' + (DONE.has(q.id) ? '✅' : q.ic) + '</i>' + q.t + '</div>').join('');
  $('quests').querySelectorAll('.q').forEach(el => el.onclick = () => { qPick = el.dataset.q; sound('tap'); drawQuests(); }); }
function qDone(id){ if(DONE.has(id)) return; DONE.add(id); drawQuests(id); sound('pop'); tone(784, 0.12, {type: 'triangle', gain: 0.2}); tone(1046, 0.18, {type: 'triangle', gain: 0.18, delay: 0.1});
  if(DONE.size === Q.length) setTimeout(() => toast('🌟 All 3 done! Try the 🐉 Naga tab or the 🎥 camera.', 3800), 1800); }
const TALK = {monk: () => DONE.has('naga') ? [['Luang Ta Kaew', 'หลวงตาแก้ว', 'You woke the guardian! Listen… the river sounds happier already. 🎶']] : [['Luang Ta Kaew', 'หลวงตาแก้ว', 'Sawasdee, little traveller. 🙏'], ['Luang Ta Kaew', 'หลวงตาแก้ว', 'Our temple bell has been silent since the river naga fell asleep.'], ['Luang Ta Kaew', 'หลวงตาแก้ว', 'If the naga greets you at the stair, bow back to it. It is very polite!']],
  tara: () => DONE.has('naga') ? [['Tara', 'ธารา', 'Did you hear that rumble?! Was it the naga? 🐉']] : [['Tara', 'ธารา', 'No ferry today… the boatman says the river is too sleepy. ⛴️'], ['Tara', 'ธารา', 'Have you seen the big bell? It just goes “tuk”.']]};
const TARGETS = [{id: 'monk', k: 'talk', name: 'Luang Ta Kaew', p: () => SPOT.monk, r: 1.75}, {id: 'tara', k: 'talk', name: 'Tara', p: () => SPOT.tara, r: 1.6}, {id: 'bell', k: 'look', name: 'The silent bell', p: () => SPOT.bell, r: 2.0},
  {id: 'stair', k: 'wake', name: 'The naga stair', p: () => [0, STAIR_TOP + 0.75], r: 1.7}, {id: 'prang', k: 'look', name: 'The old prang', p: () => [0, -1.75], r: 1.5}, {id: 'pud', k: 'pet', name: 'Pudding', p: () => [PD.x, PD.z], r: 1.25}];
const ACT_IC = {talk: '💬', look: '🔍', wake: '🐉', pet: '🐾'}, ACT_W = {talk: 'Talk', look: 'Look', wake: 'Wake', pet: 'Pet'};
let reach = null, talking = null;
function findReach(){ if(STAGE.on || ENC.on) return null; let best = null, bd = 9; for(const t of TARGETS){ const [x, z] = t.p(), d = Math.hypot(x - H.x, z - H.z); if(d < t.r && d < bd){ bd = d; best = t; } } return best; }
function actLabel(t){ const b = $('b-act'), key = t ? t.id : ''; if(b.__k === key) return; b.__k = key; const ic = b.querySelector('.ic'), nm = b.querySelector('.nm');
  if(ic) ic.textContent = t ? ACT_IC[t.k] : '✋'; if(nm){ nm.textContent = t ? ACT_W[t.k] : 'Act'; keyCap(b, 'E'); } b.classList.toggle('int-on', !!t); b.classList.toggle('int-off', !t); }
function keyCap(b, k){ if(!b || !isDesk) return; const nm = b.querySelector('.nm'); if(nm && !nm.querySelector('.kc')){ const i = document.createElement('b'); i.className = 'kc'; i.textContent = k; nm.appendChild(i); } }
function say(lines, done){ talking = {lines, i: 0, done}; document.body.classList.add('talking'); sayShow(); }
function sayShow(){ const l = talking.lines[talking.i]; $('say-h').innerHTML = l[0] + '<small>' + l[1] + '</small>'; $('say-p').textContent = l[2]; $('say').classList.remove('hidden'); sound('tap'); }
function sayNext(){ if(!talking) return; talking.i++; if(talking.i < talking.lines.length) return sayShow(); const d = talking.done; talking = null; $('say').classList.add('hidden'); document.body.classList.remove('talking'); if(d) d(); }
$('say').addEventListener('pointerdown', e => { e.preventDefault(); sayNext(); });
function faceTo(x, z){ H.face = Math.atan2(x - H.x, z - H.z); }
function interact(t){ if(!t) return; const [x, z] = t.p(); faceTo(x, z); H.vx = H.vz = 0;
  if(t.id === 'monk' || t.id === 'tara'){ const n = NPCS.find(q => q.id === t.id); n.face = Math.atan2(H.x - n.x, H.z - n.z); n.talk = true; say(TALK[t.id](), () => { n.talk = false; if(t.id === 'monk') qDone('monk'); }); }
  else if(t.id === 'bell'){ play(hero, 'slash', () => { BELL.t = 0; tone(210, 0.09, {type: 'square', gain: 0.18}); tone(160, 0.12, {type: 'square', gain: 0.12, delay: 0.05}); pop3d(SPOT.bell[0], 2.4, SPOT.bell[1], 'tuk… 🔇'); });
    setTimeout(() => { toast('🔔 The bell is silent… it needs its song back.', 2600); qDone('bell'); }, 700); }
  else if(t.id === 'prang'){ toast('🛕 The old prang — moss and vines… it has slept here for a very, very long time.', 3200); play(hero, 'look'); }
  else if(t.id === 'pud'){ play(hero, 'pet', () => { pud.st.gk = 'happy'; pud.st.gt = 0; fxHearts(PD.x, 1.1, PD.z); tone(660, 0.1, {type: 'triangle', gain: 0.16, slide: 880}); }); }
  else if(t.id === 'stair') encStart(); }

/* ================= 🐉 the encounter on the islet (🪷 greet → bow back → 🪨 Stair Slam until you jump it → 🕊️ calm bow → sinks) ================= */
const ENC = {on: false};
function encStart(){ if(ENC.on || NAGA.mode !== 'asleep') return; ENC.on = true; NAGA.stage = false; NAGA.mode = 'rise'; NAGA.t = 0; NAGA.e = 0; NAGA.attempt = 0; NAGA.bowed = false; NAGA.calmed = false; NAGA.autoSink = true; NAGA.nodNext = 'slam';
  DEC.eyeMat.color.set('#FFC21A'); tone(70, 1.8, {type: 'sine', gain: 0.22, attack: 0.5}); tone(105, 1.8, {type: 'sine', gain: 0.12, attack: 0.6}); for(let i = 0; i < 3; i++) setTimeout(() => fxRing(NAGA.base.x, -0.28, NAGA.base.z, 2.5 + i, 0.9, '#E9FFFF'), i * 260);
  setTimeout(() => fxSplash(NAGA.base.x, NAGA.base.z, 22), 500); hint('🐉 The guardian rises…'); document.body.classList.add('enc'); }
NAGA.onGreet = () => { if(STAGE.on) return; hint('🙏 It greets you — bow back! (🎭 → 🙏 Wai)'); $('emotes').classList.add('glow'); openEmotes(true); };
NAGA.onTell = () => { const hp = hero.root.position; pop3d(hp.x, 1.7, hp.z, '🦘 JUMP!', true); $('b-jump').classList.add('hot'); if(!STAGE.on) hint('🪨 Rocks are coming — 🦘 JUMP over them!'); };
NAGA.onHit = why => { $('b-jump').classList.remove('hot'); hurt(why); };
NAGA.onResult = (res, n) => { $('b-jump').classList.remove('hot'); const hp = hero.root.position;
  if(res === 'jump'){ pop3d(hp.x, 1.8, hp.z, '✨ Great jump!', true); tone(880, 0.1, {type: 'triangle', gain: 0.18}); tone(1175, 0.16, {type: 'triangle', gain: 0.16, delay: 0.09}); fxSparkle(hp.x, 0.8, hp.z, 10); }
  else if(res === 'miss') { pop3d(hp.x, 1.6, hp.z, '🦘 Jump over the rocks!'); }
  if(!STAGE.on && res !== 'jump' && n < 3) hint('🪨 Again! Watch the crack line… then 🦘 JUMP'); };
NAGA.onCalm = () => { if(STAGE.on) return; hint('🕊️ The guardian bows. 🎶 A note rings out!'); [1046, 1318, 1568].forEach((f, i) => tone(f, 0.3, {type: 'sine', gain: 0.14, delay: i * 0.18})); fxSparkle(NAGA.heads[1].H.x, NAGA.heads[1].H.y + 0.8, NAGA.heads[1].H.z, 16); qDone('naga'); };
NAGA.onSink = () => { ENC.on = false; document.body.classList.remove('enc'); hint(); fxSplash(NAGA.base.x, NAGA.base.z, 12); };
function hurt(why){ const hp = H; const d = V3(hp.x - NAGA.S.x, 0, hp.z - NAGA.S.z); if(d.lengthSq() < 0.01) d.copy(NAGA.aim); d.normalize();
  H.kb = {vx: d.x * 3.2, vz: d.z * 3.2, t: 0.38}; H.vy = 3.2; H.air = true; H.dizzy = 1.3; H.inv = 1.2; play(hero, 'hurt'); sound('bump'); tone(330, 0.25, {type: 'sine', gain: 0.18, slide: 160});
  pop3d(hp.x, 1.8, hp.z, why === 'head' ? 'BONK! 💫' : 'BONK! 💦 Wet socks!', true); shake(0.12); }

/* ================= 🐉 the Naga tab — turntable stage (▶ Stair Slam · 🪷 Greet · 🕊️ Bow · 🦘 Auto-jump · 🐢 Slow · ⟳ Turn) ================= */
const STAGE = {on: false, auto: true, slow: false, turn: true, yaw: 0.25, save: null};
function stageOn(on){ if(STAGE.on === on) return; STAGE.on = on; document.body.classList.toggle('stage', on); $('tabs').querySelectorAll('.chip').forEach(b => b.classList.toggle('on', (b.dataset.tab === 'naga') === on));
  closeEmotes(); if(talking){ talking.done = null; sayNext(); }
  if(on){ STAGE.save = {x: H.x, z: H.z, face: H.face, px: PD.x, pz: PD.z}; H.x = 0; H.z = STAIR_TOP + 2.7; H.face = Math.PI; H.go = null; PD.x = 2.6; PD.z = STAIR_TOP + 2.4; ENC.on = false;
    NAGA.stage = true; NAGA.slow = STAGE.slow ? 0.25 : 1; NAGA.autoSink = false; NAGA.nodNext = 'idle'; if(NAGA.mode === 'asleep' || NAGA.mode === 'sink'){ NAGA.mode = 'rise'; NAGA.t = 0; NAGA.e = 0; } DEC.eyeMat.color.set('#FFC21A'); }
  else { const s = STAGE.save; if(s){ H.x = s.x; H.z = s.z; H.face = s.face; PD.x = s.px; PD.z = s.pz; } NAGA.stage = false; NAGA.slow = 1; NAGA.mode = 'sink'; NAGA.t = 0; NAGA.spikes = []; document.body.classList.remove('enc'); }
  layout(); }
$('tabs').querySelectorAll('.chip').forEach(b => b.onclick = () => stageOn(b.dataset.tab === 'naga'));
$('nagabar').querySelectorAll('.chip').forEach(b => b.onclick = () => { const k = b.dataset.n, N = NAGA;
  if(k === 'slam'){ if(N.mode === 'idle' || N.mode === 'greet' || N.mode === 'calm'){ N.attempt = 0; slamStart(); } }
  if(k === 'greet'){ N.mode = 'rise'; N.t = 0; N.e = 0; N.bowed = false; N.nodNext = 'idle'; fxSplash(N.base.x, N.base.z, 18); tone(70, 1.8, {type: 'sine', gain: 0.2, attack: 0.5}); }
  if(k === 'bow'){ if(N.mode !== 'rise' && N.mode !== 'sink'){ N.mode = 'calm'; N.t = 0; N.calmed = false; } }
  if(k === 'auto'){ STAGE.auto = !STAGE.auto; b.classList.toggle('on', STAGE.auto); }
  if(k === 'slow'){ STAGE.slow = !STAGE.slow; b.classList.toggle('on', STAGE.slow); N.slow = STAGE.slow ? 0.25 : 1; }
  if(k === 'turn'){ STAGE.turn = !STAGE.turn; b.classList.toggle('on', STAGE.turn); } });

/* ================= 🕹️ controls — shared UiKit pad: stick · 🦘 jump (main) · ✋ interact (E) · ⚔️ fight (F) · 🎭 emote (Q) ================= */
const IN = {sx: 0, sy: 0, m: 0, keys: {}};
(function controls(){ const st = $('stick'), kn = st.querySelector('.knob'); let T0 = null, on = null; try { T0 = UI.stickTracker(st, {player: CURRENT_PLAYER}); } catch(e){}
  const mv = v => { kn.style.transform = 'translate(' + (v.fx * 30) + '%,' + (v.fy * 30) + '%)'; const m = Math.min(1, v.m); if(m < 0.15){ IN.m = 0; return; } IN.sx = v.x / (v.m || 1); IN.sy = v.y / (v.m || 1); IN.m = m; H.go = null; };
  const local = e => { const r = st.getBoundingClientRect(), R0 = r.width / 2, x = (e.clientX - r.left - R0) / R0, y = (e.clientY - r.top - R0) / R0, m = Math.hypot(x, y), k = m > 1 ? 1 / m : 1; return {x, y, m, fx: x * k, fy: y * k}; };
  st.addEventListener('pointerdown', e => { if(talking) return; closeEmotes(); on = e.pointerId; try { st.setPointerCapture(e.pointerId); } catch(x){} mv(T0 ? T0.start(e) : local(e)); e.preventDefault(); });
  const move = e => { if(e.pointerId === on) mv(T0 ? T0.at(e) : local(e)); }; if(UI.onFastMove) UI.onFastMove(st, move); else st.addEventListener('pointermove', move);
  const up = e => { if(e.pointerId !== on) return; on = null; IN.m = 0; kn.style.transform = ''; }; st.addEventListener('pointerup', up); st.addEventListener('pointercancel', up);
  try { if(UI.stickZone) UI.stickZone(st, null); } catch(e){}
  const press = (b, fn) => b.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); if(!talking) fn(); });
  press($('b-jump'), jumpPress); press($('b-emote'), () => $('emotes').classList.contains('hidden') ? openEmotes() : closeEmotes()); press($('b-swing'), swingPress); press($('b-act'), interactPress);
  $('emotes').querySelectorAll('button').forEach(b => b.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); emote(b.dataset.e); }));
  addEventListener('keydown', e => { if(e.repeat) return; if(talking && (e.code === 'KeyE' || e.code === 'Space' || e.code === 'Enter')){ sayNext(); e.preventDefault(); return; }
    if(e.code === 'Space'){ jumpPress(); e.preventDefault(); } if(e.code === 'KeyE') interactPress(); if(e.code === 'KeyQ'){ const em = $('emotes'); if(em.classList.contains('hidden')) openEmotes(); else if(em.classList.contains('glow')) emote('wai'); else closeEmotes(); } if(e.code === 'KeyF') swingPress();
    if(/^Digit[123]$/.test(e.code) && !STAGE.on) emote(['wai', 'wave', 'cheer'][+e.code.slice(5) - 1]);
    if(/^(Arrow|Key[WASD])/.test(e.code)){ IN.keys[e.code] = 1; H.go = null; e.preventDefault(); } });
  addEventListener('keyup', e => { delete IN.keys[e.code]; });
  const dress = (b, ic, nm, rim, main) => { try { UI.pad.dress(b, ic, nm, rim, main); } catch(x){ b.innerHTML = '<span class="ic">' + ic + '</span><span class="nm">' + nm + '</span>'; } };
  dress($('b-jump'), '🦘', 'Jump', '#22A867', true); dress($('b-emote'), '🎭', 'Emote', '#9B5DE5'); dress($('b-swing'), '⚔️', 'Fight', '#FF6B5B'); dress($('b-act'), '✋', 'Act', '#FFC21A');
  keyCap($('b-jump'), '␣'); keyCap($('b-emote'), 'Q'); keyCap($('b-swing'), 'F'); keyCap($('b-act'), 'E'); actLabel(null);
  document.addEventListener('contextmenu', e => e.preventDefault()); document.addEventListener('selectstart', e => e.preventDefault()); })();
function jumpPress(){ if(STAGE.on) return; if(H.air || H.crouch > 0){ H.jumpQ = 0.15; return; } H.crouch = 0.1; hero.st.crouch = 0.1; }
function doJump(){ H.vy = 6.1; H.air = true; hero.st.air = true; tone(420, 0.09, {type: 'sine', gain: 0.12, slide: 700}); for(let i = 0; i < 4; i++) fxDust(H.x, 0.05, H.z, 0.5); }
function swingPress(){ if(STAGE.on) return; closeEmotes(); if(reach && reach.id === 'stair') return interact(reach);
  play(hero, 'slash', () => { SMEAR.visible = true; SMEAR.material.opacity = 0.85; SMEAR.userData.t = 0; tone(600, 0.08, {type: 'triangle', gain: 0.12, slide: 280});
    const fx0 = H.x + Math.sin(H.face) * 0.7, fz0 = H.z + Math.cos(H.face) * 0.7; DEC.bushList.forEach((b, i) => { if(Math.hypot(b[0] - fx0, b[2] - fz0) < 0.8){ DEC.bushPulse[i] = 0.5; fxLeaf(b[0], 0.45, b[2]); } }); }); }
function interactPress(){ if(talking) return sayNext(); closeEmotes(); if(!reach){ const b = $('b-act'); b.classList.remove('int-no'); void b.offsetWidth; b.classList.add('int-no'); return; } interact(reach); }
function openEmotes(glow){ const el = $('emotes'); el.classList.remove('hidden'); if(!glow) el.classList.remove('glow'); const b = $('btns').getBoundingClientRect(), w = el.getBoundingClientRect().width;
  el.style.left = Math.max(8, Math.min(innerWidth - w - 8, b.right - w)) + 'px'; el.style.top = Math.max(60, b.top - el.getBoundingClientRect().height - 10) + 'px'; }
function closeEmotes(){ $('emotes').classList.add('hidden'); }
function emote(k){ closeEmotes(); $('emotes').classList.remove('glow'); play(hero, k, () => { if(k === 'wai' && NAGA.mode === 'greet'){ NAGA.bowed = true; pop3d(H.x, 1.7, H.z, '🙏'); hint('🐉 It bows back… get ready!'); } if(k === 'cheer') fxSparkle(H.x, 1.2, H.z, 8); }); sound('tap'); }

/* ================= 🎥 cameras — iso (orthographic 45°, like today's 2.5D) ↔ third-person follow ================= */
const CAM = {padT: 0, padB: 0, mode: 'iso', zoom: 1, tgt: V3(H.x, 0.6, H.z), yaw: H.face + Math.PI, dragAt: -9, dist: 6.4, iso: new T.OrthographicCamera(-1, 1, 1, -1, 0.1, 300), per: new T.PerspectiveCamera(50, 1, 0.1, 300)};
const ISO_DIR = V3(Math.sin(Math.PI / 4) * Math.cos(Math.PI / 6), Math.sin(Math.PI / 6), Math.cos(Math.PI / 4) * Math.cos(Math.PI / 6));
const camNow = () => STAGE.on ? CAM.per : CAM.mode === 'iso' ? CAM.iso : CAM.per;
$('b-cam').onclick = () => { CAM.mode = CAM.mode === 'iso' ? 'third' : 'iso'; CAM.yaw = H.face + Math.PI; $('b-cam').querySelector('.lb').textContent = CAM.mode === 'iso' ? ' Iso' : ' Behind'; toast(CAM.mode === 'iso' ? '🎥 Iso camera (like the 2.5D games)' : '🎥 Behind-you camera · drag to turn'); };
function camUpdate(dt, time){ const asp = innerWidth / innerHeight, k = 1 - Math.exp(-dt * 5);
  if(STAGE.on){ const c = CAM.per; if(STAGE.turn && time - CAM.dragAt > 1.5) STAGE.sw = (STAGE.sw || 0) + dt * 0.35; const yaw = STAGE.yaw + Math.sin(STAGE.sw || 0) * 0.95; const ctr = V3(0, 2.4, (NAGA.base.z + STAIR_TOP + 1.2) / 2 + 0.4), r = asp < 1 ? 16 : 12.5;
    c.clearViewOffset(); c.fov = 48; c.aspect = asp; c.position.set(ctr.x + Math.sin(yaw) * r, ctr.y + 4.8, ctr.z + Math.cos(yaw) * r); c.lookAt(ctr); c.updateProjectionMatrix(); }
  else if(CAM.mode === 'iso'){ const c = CAM.iso, enc = ENC.on && NAGA.mode !== 'asleep'; const f = enc ? V3((H.x + NAGA.S.x) / 2, 1.4, (H.z + NAGA.S.z) / 2 + 0.6) : V3(H.x, 0.6, H.z); CAM.tgt.lerp(f, k);
    const S = asp < 1 ? 14 : isPhone ? 16 : 19, h = (asp < 1 ? S / asp : S * 0.82) * CAM.zoom * (enc ? 1.1 : 1), sh = (CAM.padT - CAM.padB) / 2 / innerHeight * h; c.left = -h * asp / 2; c.right = h * asp / 2; c.top = h / 2 + sh; c.bottom = -h / 2 + sh;
    c.position.copy(CAM.tgt).addScaledVector(ISO_DIR, 60); c.lookAt(CAM.tgt); c.updateProjectionMatrix(); }
  else { const c = CAM.per, enc = ENC.on && NAGA.mode !== 'asleep', moving = Math.hypot(H.vx || 0, H.vz || 0) > 0.3;
    let want = CAM.yaw; if(enc) want = Math.atan2(H.x - NAGA.base.x, H.z - NAGA.base.z); else if(moving && time - CAM.dragAt > 1.6) want = H.face + Math.PI;
    if(enc || (moving && time - CAM.dragAt > 1.6)) CAM.yaw += angDiff(want, CAM.yaw) * (1 - Math.exp(-dt * (enc ? 2.5 : 1.8)));
    const d = CAM.dist * CAM.zoom * (enc ? 1.35 : 1), hh = 2.9 * CAM.zoom * (enc ? 1.2 : 1); const look = enc ? V3(lerp(H.x, NAGA.S.x, 0.4), 1.8, lerp(H.z, NAGA.S.z, 0.4)) : V3(H.x, 1.0, H.z);
    CAM.tgt.lerp(look, 1 - Math.exp(-dt * 8)); c.fov = asp < 1 ? 60 : 50; c.aspect = asp; c.position.set(CAM.tgt.x + Math.sin(CAM.yaw) * d, CAM.tgt.y + hh, CAM.tgt.z + Math.cos(CAM.yaw) * d); c.lookAt(CAM.tgt); c.setViewOffset(innerWidth, innerHeight, 0, -(CAM.padT - CAM.padB) / 2, innerWidth, innerHeight); c.updateProjectionMatrix(); }
  if(SHK.t > 0){ SHK.t -= dt; const c = camNow(), a = SHK.a * (SHK.t / 0.28); c.position.x += (R() - 0.5) * a; c.position.y += (R() - 0.5) * a; c.position.z += (R() - 0.5) * a; } }
/* 👆 canvas: tap = walk there (a person / thing = walk + do it) · drag = turn (behind cam / stage) · pinch / wheel = zoom */
(function canvasInput(){ const P = new Map(); let tap = null, pinch = null; const ray = new T.Raycaster(), plane = new T.Plane(V3(0, 1, 0), 0), hit = new T.Vector3();
  cv.addEventListener('pointerdown', e => { if(talking){ sayNext(); return; } closeEmotes(); P.set(e.pointerId, {x: e.clientX, y: e.clientY}); try { cv.setPointerCapture(e.pointerId); } catch(x){}
    if(P.size === 1) tap = {x: e.clientX, y: e.clientY, t: performance.now(), id: e.pointerId, moved: 0}; else { tap = null; const [a, b] = [...P.values()]; pinch = {d: Math.hypot(a.x - b.x, a.y - b.y), z: CAM.zoom}; } e.preventDefault(); });
  cv.addEventListener('pointermove', e => { const p = P.get(e.pointerId); if(!p) return; const dx = e.clientX - p.x; p.x = e.clientX; p.y = e.clientY;
    if(pinch && P.size === 2){ const [a, b] = [...P.values()]; CAM.zoom = clamp(pinch.z * pinch.d / Math.max(20, Math.hypot(a.x - b.x, a.y - b.y)), 0.55, 2.2); return; }
    if(tap && tap.id === e.pointerId){ tap.moved += Math.abs(dx); if(tap.moved > 10 && (CAM.mode === 'third' || STAGE.on)){ CAM.dragAt = performance.now() / 1000; if(STAGE.on) STAGE.yaw -= dx * 0.008; else CAM.yaw -= dx * 0.008; } } });
  const end = e => { const p = P.get(e.pointerId); P.delete(e.pointerId); if(P.size < 2) pinch = null; if(!tap || tap.id !== e.pointerId) return; const t = tap; tap = null; if(t.moved > 10 || performance.now() - t.t > 450 || STAGE.on || !p) return;
    const r = cv.getBoundingClientRect(); ray.setFromCamera(new T.Vector2((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1), camNow()); if(!ray.ray.intersectPlane(plane, hit)) return;
    let best = null, bd = 1.3; for(const q of TARGETS){ const [x, z] = q.p(), d = Math.hypot(x - hit.x, z - hit.z); if(d < bd){ bd = d; best = q; } }
    if(best){ const [x, z] = best.p(); H.go = {x, z, t: best, stop: best.r * 0.7}; } else if(onLand(hit.x, hit.z)) H.go = {x: hit.x, z: hit.z, stop: 0.15}; else return; fxRing(hit.x, 0.05, hit.z, 0.6, 0.4, '#FFFFFF'); };
  cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);
  cv.addEventListener('wheel', e => { CAM.zoom = clamp(CAM.zoom * (e.deltaY > 0 ? 1.08 : 0.93), 0.55, 2.2); e.preventDefault(); }, {passive: false}); })();
/* ================= 🎨 3d-t1 LOOK LAB — stylized mid-poly appeal layers (Aowu 2026-11-29: T0 = "fast but the appeal is gone", plan §6c)
   13 layers, each ONE switch: 🫧 smooth · 🌗 warm/cool ramp · 🎨 painted · 🧩 facets · 🌑 baked AO · 🌫️ fog · 🌅 sky · ✨ motes · 🌾 meadow · 🍃 sway · ✏️ outline · 💡 rim · 🌟 glow
   + 🧱 polygon steps ×1 / ×3 / ×10 (rebuilt in place) · 🔍 sharpness ×1 / ×1.5 / ×2 · presets 🧊 T0 / 🪶 Low / 🌿 Med / 🌟 High (first guesses) · ⏱️ cost check (GPU-synced ms per layer) ================= */
function saveLook(){ try { sessionStorage.setItem('threelab.look', JSON.stringify({preset: LOOK.preset, L: LOOK.L, poly: LOOK.poly})); } catch(e){} }

/* ---------- 🌅 sky: one full-screen triangle drawn first (gradient · sun haze · drifting cloud sea under the islet) ---------- */
const SKY = (() => { const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3));
  const col = h => new T.Color(h);
  const m = new T.ShaderMaterial({depthTest: false, depthWrite: false, uniforms: {uTime: U.uTime, uTop: {value: col('#5DB7EE')}, uMid: {value: col('#AEE0F7')}, uHor: {value: col('#FFE7D0')}, uLow: {value: col('#FFF3E6')}, uSun: {value: col('#FFF2C4')}, uAsp: {value: 1}},
    vertexShader: 'varying vec2 vUv; void main(){ vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 1.0, 1.0); }',
    fragmentShader: 'uniform float uTime, uAsp; uniform vec3 uTop, uMid, uHor, uLow, uSun; varying vec2 vUv;\n' + NOISE_GLSL + 'void main(){ float y = vUv.y; vec3 c = mix(uLow, uHor, smoothstep(0.0, 0.38, y)); c = mix(c, uMid, smoothstep(0.32, 0.7, y)); c = mix(c, uTop, smoothstep(0.66, 1.05, y));\n vec2 p = vec2(vUv.x * uAsp, y); float d = distance(p, vec2(0.12 * uAsp, 0.92)); c += uSun * (exp(-d * 5.0) * 0.55 + exp(-d * 1.6) * 0.16);\n float band = smoothstep(0.52, 0.05, y); vec3 q = vec3(p.x * 2.4 + uTime * 0.012, y * 7.5, uTime * 0.02); float n = vn3(q) * 0.6 + vn3(q * 2.3) * 0.3 + vn3(q * 5.1) * 0.1;\n float cl = smoothstep(0.5, 0.72, n + band * 0.35 - 0.12); c = mix(c, vec3(1.0, 0.985, 0.97), cl * band * 0.85); c = mix(c, uLow * 0.97, (1.0 - cl) * band * 0.18);\n gl_FragColor = vec4(c, 1.0);\n#include <colorspace_fragment>\n}'});
  const s = new T.Mesh(g, m); s.frustumCulled = false; s.renderOrder = -1e9; s.name = 'sky'; scene.add(s); return s; })();

/* ---------- 🌫️ fog (always there so nothing recompiles; "off" = pushed far away) ---------- */
scene.fog = new T.Fog(new T.Color('#F4E6DA'), 1e5, 2e5);
[OUT, OUT_SW].forEach(m => { m.fog = true; Object.assign(m.uniforms, {fogColor: {value: new T.Color()}, fogNear: {value: 1}, fogFar: {value: 2000}, fogDensity: {value: 0}});
  m.vertexShader = m.vertexShader.replace('void main(){', '#include <fog_pars_vertex>\nvoid main(){').replace(' gl_Position = c; }', ' gl_Position = c; vec4 mvPosition = modelViewMatrix * p;\n#include <fog_vertex>\n}');
  m.fragmentShader = '#include <fog_pars_fragment>\n' + m.fragmentShader.replace('#include <colorspace_fragment>', '#include <colorspace_fragment>\n#include <fog_fragment>'); m.needsUpdate = true; });

/* ---------- ✨ motes (fireflies + floating pollen) and 🌟 glow halos = additive points, animated on the GPU (1 draw call each) ---------- */
function pointsMat(add){ return new T.ShaderMaterial({transparent: true, depthWrite: false, blending: T.AdditiveBlending, fog: false, uniforms: {uTime: U.uTime, uVH: {value: 800}},
  vertexShader: 'attribute vec4 seed; attribute vec3 tint; uniform float uTime, uVH; varying vec3 vT; varying float vA;\nvoid main(){ vec3 p = position; float t = uTime * seed.y + seed.x * 6.283;\n' + (add ?
    ' p += vec3(sin(t) * 0.6 + sin(t * 0.37) * 0.9, sin(t * 0.71) * 0.35 + 0.2 * sin(t * 1.9), cos(t * 0.83) * 0.7); vA = (0.45 + 0.55 * sin(t * 2.7 + seed.x * 9.0)) * seed.w;' :
    ' vA = (0.78 + 0.22 * sin(uTime * 2.1 + seed.x * 6.0)) * seed.w;') +
    '\n vec4 mv = modelViewMatrix * vec4(p, 1.0); gl_Position = projectionMatrix * mv; bool ortho = projectionMatrix[2][3] == 0.0; float ppu = projectionMatrix[1][1] * uVH * 0.5 / (ortho ? 1.0 : max(0.3, -mv.z));\n gl_PointSize = clamp(seed.z * ppu, 1.5, 160.0); vT = tint; }',
  fragmentShader: 'varying vec3 vT; varying float vA; void main(){ vec2 d = gl_PointCoord - 0.5; float r = length(d) * 2.0; float a = smoothstep(1.0, 0.0, r); a = a * a * (0.55 + 0.45 * smoothstep(0.35, 0.0, r)); gl_FragColor = vec4(vT * a * vA, 1.0); }'}); }
function pointsObj(list, add){ const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(list.flatMap(o => o.p), 3)); g.setAttribute('seed', new T.Float32BufferAttribute(list.flatMap(o => o.s), 4));
  g.setAttribute('tint', new T.Float32BufferAttribute(list.flatMap(o => { const c = new T.Color(o.c); return [c.r, c.g, c.b]; }), 3)); g.boundingSphere = new T.Sphere(new T.Vector3(), 40);
  const p = new T.Points(g, pointsMat(add)); p.frustumCulled = false; p.renderOrder = 5; world.add(p); return p; }
const MOTES = (() => { const L = []; for(let i = 0; i < 150; i++){ const a = hash1(i * 3.1) * TAU, rr = lerp(ISLE_R, 12.5, Math.sqrt(hash1(i * 7.7))), fly = i % 3 === 0;
    L.push({p: [Math.cos(a) * rr, fly ? 0.4 + hash1(i) * 1.4 : 1 + hash1(i * 2.2) * 4.5, Math.sin(a) * rr], s: [hash1(i * 1.3), 0.16 + hash1(i * 5.1) * 0.22, fly ? 0.2 : 0.12, fly ? 1.0 : 0.55], c: fly ? '#FFD36B' : '#FFFFFF'}); }
  return pointsObj(L, true); })();
const GLOWS = (() => { const L = [], at = (x, y, z, sz, c, w) => L.push({p: [x, y, z], s: [L.length * 0.37, 1, sz, w || 1], c});
  at(0, PRANG_TOP + 0.25, 0, 1.4, '#FFC861', 0.9); at(SPOT.bell[0], 2.25, SPOT.bell[1], 1.0, '#FFB24A', 0.55);
  STATUE_EYES.forEach(e => at(e[0], e[1], e[2], 0.5, '#7CFFE0', 0.8));
  at(SPOT.hut[0], 1.85, SPOT.hut[1], 0.9, '#FFB866', 0.7); at(SPOT.spirit[0], 1.35, SPOT.spirit[1], 0.75, '#FFD27A', 0.7); at(SPOT.dock[0], 1.3, SPOT.dock[1], 0.8, '#FFC36E', 0.6);
  return pointsObj(L, false); })();

/* ---------- 🌾 meadow: grass tufts + little flowers on the land ring (InstancedMesh, swaying; MORE of them on each 🧱 step — calls stay flat) ---------- */
const MEADOW = (() => { const MAX = 6400, pts = [];
  for(let i = 0, n = 0; i < MAX * 6 && pts.length < MAX; i++){ const a = hash1(i * 1.618) * TAU, ri = Rin(a) + 0.32, ro = Rout(a) - 0.3, rr = lerp(ri, ro, hash1(i * 2.71)), x = Math.cos(a) * rr, z = Math.sin(a) * rr;
    if(Math.abs(rr - Rpath(a)) < 0.42) continue; if(!freeSpot(x, z, 0.12)) continue; pts.push([x, 0, z, hash1(i * 4.4) * TAU, 0.75 + hash1(i * 9.3) * 0.6]); }
  /* fixed-cost pieces (the base classes, NOT the 🧱 ladder): density is what grows here */
  const blade = (() => { const g = new T.Base.BufferGeometry(); g.setAttribute('position', new T.Base.Float32BufferAttribute([-0.5, 0, 0, 0.5, 0, 0, 0, 1, 0, 0.5, 0, 0, -0.5, 0, 0, 0, 1, 0], 3)); return g; })();
  const ball = new T.Base.IcosahedronGeometry(0.5, 0), stem = new T.Base.ConeGeometry(0.5, 1, 3);
  const tuft = () => { const B = new Bld(); for(let k = 0; k < 5; k++){ const a = k / 5 * Math.PI + 0.3, l = 0.17 + (k % 3) * 0.05; B.add(blade, k % 2 ? C.grass : '#9AD873', M(Math.cos(a) * 0.05, 0, Math.sin(a) * 0.05, (k - 2) * 0.16, a, (k % 2 ? 1 : -1) * 0.22, 0.13, l, 1)); } return B.geo(); };
  const bloom = () => { const B = new Bld(); B.add(stem, '#6DBA57', M(0, 0.12, 0, 0, 0, 0, 0.03, 0.24, 0.03)); for(let k = 0; k < 4; k++){ const a = k / 4 * TAU; B.add(ball, '#FFFFFF', M(Math.cos(a) * 0.045, 0.25, Math.sin(a) * 0.045, 0, 0, 0, 0.055)); } B.add(ball, '#FFD44A', M(0, 0.27, 0, 0, 0, 0, 0.045)); return B.geo(); };
  const g = instanced(tuft(), SWAYM, MAX, false), f = instanced(bloom(), SWAYM, Math.ceil(MAX / 8), false);
  const fc = ['#FFFFFF', '#FFB6D0', '#C9B8FF', '#FFE9A6'];
  pts.forEach((p, i) => { g.setMatrixAt(i, M(p[0], 0, p[2], 0, p[3], 0, p[4])); g.setColorAt(i, _c.set(i % 5 ? '#FFFFFF' : '#E3F5C8')); if(i % 8 === 0){ const j = i / 8; f.setMatrixAt(j, M(p[0] + 0.12, 0, p[2] - 0.08, 0, p[3], 0, p[4] * 0.9)); f.setColorAt(j, _c.set(fc[j % 4])); } });
  g.instanceMatrix.needsUpdate = f.instanceMatrix.needsUpdate = true; world.add(g); world.add(f);
  return {g, f, n: pts.length, set(step, on){ const k = on ? Math.min(pts.length, Math.round(420 * step)) : 0; setCount(g, k); setCount(f, Math.ceil(k / 8)); }}; })();
DEC.trees.material = DEC.palms.material = DEC.bushes.material = SWAYM; [DEC.trees, DEC.palms, DEC.bushes].forEach(m => { if(m.userData.out) m.userData.out.material = OUT_SW; });

/* ---------- apply: every layer → its uniform / switch (instant) ---------- */
function applyLook(){ const L = LOOK.L;
  U.uSmooth.value = L.smooth ? 1 : 0; U.uJit.value = L.facets ? 1 : 0; U.uGrad.value = L.paint ? 1 : 0; U.uPaint.value = L.paint ? 1 : 0; U.uAO.value = L.ao ? 1 : 0;
  U.uRimAll.value = L.rim ? 1 : 0; U.uSway.value = L.sway ? 1 : 0; setRamp(!!L.warm); OUT.visible = OUT_SW.visible = !!L.outline;
  SKY.visible = !!L.sky; MOTES.visible = !!L.motes; GLOWS.visible = !!L.glow; MEADOW.set(LOOK.poly, !!L.grass);
  if(!L.fog){ scene.fog.near = 1e5; scene.fog.far = 2e5; } U.uHaze.value = L.fog ? 1 : 0;   /* 🌫️ = height haze (the rock fades into the cloud sea, works in iso) + distance fog (behind cam) */
  sun.color.set(L.warm ? 0xFFE6C2 : 0xFFF1DA); scene.children.forEach(o => { if(o.isHemisphereLight){ o.color.set(L.warm ? 0xE4F0FF : 0xEAF6FF); o.groundColor.set(L.warm ? 0x9C8FB0 : 0xB8A07C); } });
  OUTU.uCol.value.set(L.warm ? 0x3B2A3E : 0x3A2B36);
  drawLookPanel(); saveLook(); }
function lookUpdate(dt, time){ const c = camNow(); U.uTime.value = time;
  if(LOOK.L.fog){ if(c.isOrthographicCamera){ scene.fog.near = 1e5; scene.fog.far = 2e5; } else { scene.fog.near = 20; scene.fog.far = 80; } }
  const v = renderer.getDrawingBufferSize(_lv); MOTES.material.uniforms.uVH.value = GLOWS.material.uniforms.uVH.value = v.y; SKY.material.uniforms.uAsp.value = v.x / Math.max(1, v.y); }
const _lv = new T.Vector2();

/* ---------- 🧱 polygon step: rebuild every builder + every round primitive in place ---------- */
function setPoly(step){ if(step === POLY.f && LOOK.poly === step) return; const t0 = performance.now(); POLY.f = step; POLY.cache.clear(); LOOK.poly = step;
  Object.keys(G).forEach(k => { G[k] = polyRegen(G[k]); });
  const swap = new Map(), olds = [...BLDS.entries()]; olds.forEach(([g, b]) => { swap.set(g, b.replay().geo()); BLDS.delete(g); });   /* snapshot first: geo() adds the new builders to BLDS */
  scene.traverse(o => { if(!o.geometry) return; const n = swap.get(o.geometry) || (POLY.pm.has(o.geometry) ? polyRegen(o.geometry) : null); if(n && n !== o.geometry) o.geometry = n; });
  swap.forEach((n, g) => g.dispose()); MEADOW.set(step, !!LOOK.L.grass);
  LOOK.buildMs = Math.round(performance.now() - t0); MT.skip = 2; saveLook(); drawLookPanel(); toast('🧱 Detail ×' + step + ' · rebuilt in ' + LOOK.buildMs + ' ms', 1800); }

/* ---------- ⏱️ cost check: each layer off → on, frames timed with a 1-pixel read (waits for the GPU), median of 9 ---------- */
const _px = new Uint8Array(4);
function timedFrames(n){ const gl = renderer.getContext(), c = camNow(), t = []; for(let i = 0; i < n; i++){ const a = performance.now(); renderer.render(scene, c); gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, _px); t.push(performance.now() - a); }
  t.sort((x, y) => x - y); return {ms: t[n >> 1], calls: renderer.info.render.calls, tris: renderer.info.render.triangles}; }
function costCheck(){ if(LOOK.busy) return; LOOK.busy = true; renderer.setAnimationLoop(null); const on = LAYERS.filter(l => LOOK.L[l[0]]).map(l => l[0]), rows = [];
  $('lk-cost').textContent = '⏱️ …'; let i = -1, base = null;
  const step = () => { if(i === -1){ timedFrames(3); base = timedFrames(9); i = 0; return requestAnimationFrame(step); }
    if(i < on.length){ const k = on[i]; LOOK.L[k] = 0; applyLook(); timedFrames(2); const r = timedFrames(9); LOOK.L[k] = 1; applyLook(); rows.push({k, d: base.ms - r.ms, calls: base.calls - r.calls, tris: base.tris - r.tris}); i++; $('lk-cost').textContent = '⏱️ ' + i + '/' + on.length; return requestAnimationFrame(step); }
    LOOK.cost = {base, rows: rows.sort((a, b) => b.d - a.d), poly: LOOK.poly, pr: PERF.pr, cam: camNow() === CAM.iso ? 'iso' : 'behind', at: new Date().toLocaleTimeString()};
    LOOK.busy = false; last = performance.now(); MT.skip = 2; renderer.setAnimationLoop(frame); drawLookPanel(); costCard(); };
  requestAnimationFrame(step); }
function costCard(){ const c = LOOK.cost; if(!c) return; const nm = k => { const l = LAYERS.find(x => x[0] === k); return l ? l[1] + ' ' + l[2] : k; };
  const tot = c.rows.reduce((s, r) => s + Math.max(0, r.d), 0);
  $('lk-out').innerHTML = '<b>⏱️ Frame ' + c.base.ms.toFixed(1) + ' ms</b> · ' + c.base.calls + ' calls · ' + Math.round(c.base.tris / 1000) + 'k △ · 🧱×' + c.poly + ' · 🔍×' + c.pr + ' · ' + c.cam + '<br>' +
    c.rows.map(r => '<span class="lk-r">' + nm(r.k) + ' <i>' + (r.d >= 0 ? '+' : '') + r.d.toFixed(1) + ' ms</i>' + (r.calls ? ' · ' + r.calls + 'c' : '') + '</span>').join('') +
    '<br><small>all layers ≈ +' + tot.toFixed(1) + ' ms · budget 16.7 ms = 60 fps · goes in 📊 → 📤 Send</small>'; $('lk-out').classList.remove('hidden'); }
LOOK.rows = () => { const on = LAYERS.filter(l => LOOK.L[l[0]]).map(l => l[1]).join('') || '—', r = [['🎨 Look', (PRESETS[LOOK.preset] ? PRESETS[LOOK.preset].name : '🎛️ custom') + ' · 🧱×' + LOOK.poly + ' · ' + on]];
  if(LOOK.cost) r.push(['⏱️ Layer cost', LOOK.cost.base.ms.toFixed(1) + ' ms frame (🧱×' + LOOK.cost.poly + ' 🔍×' + LOOK.cost.pr + ' ' + LOOK.cost.cam + ') · ' + LOOK.cost.rows.map(x => { const l = LAYERS.find(y => y[0] === x.k); return (l ? l[1] : x.k) + (x.d >= 0 ? '+' : '') + x.d.toFixed(1); }).join(' ')]);
  if(window.LAB_VRM && LAB_VRM.info) r.push(['🧑 VRM', LAB_VRM.info]); return r; };

/* ---------- 🎛️ the panel (one sheet, no scroll; stick + petals hide while it is open) ---------- */
function drawLookPanel(){ const p = $('lookp'); if(!p) return;
  p.querySelectorAll('[data-pre]').forEach(b => b.classList.toggle('on', LOOK.preset === b.dataset.pre));
  p.querySelectorAll('[data-poly]').forEach(b => b.classList.toggle('on', +b.dataset.poly === LOOK.poly));
  p.querySelectorAll('[data-pr]').forEach(b => b.classList.toggle('on', +b.dataset.pr === sharp));
  p.querySelectorAll('[data-ly]').forEach(b => b.classList.toggle('on', !!LOOK.L[b.dataset.ly])); }
(function lookPanel(){ const p = $('lookp'), row = (h) => { const d = document.createElement('div'); d.className = 'lk-row'; d.innerHTML = h; p.appendChild(d); return d; };
  const chip = (attr, v, txt, ttl) => '<button class="lk" ' + attr + '="' + v + '" data-sound="tap"' + (ttl ? ' title="' + ttl + '"' : '') + '>' + txt + '</button>';
  row('<span class="lk-st" id="lk-st">📊 …</span><button class="lk" id="lk-cost" data-sound="tap">⏱️ Cost</button><button class="lk" id="lk-x" data-sound="tap">✕</button>');
  row(Object.keys(PRESETS).map(k => chip('data-pre', k, PRESETS[k].name)).join('') + '<i class="lk-gap"></i>' + [1, 3, 10].map(s => chip('data-poly', s, '🧱×' + s)).join('') + '<i class="lk-gap"></i>' + [1, 1.5, 2].map(s => chip('data-pr', s, '🔍×' + s)).join(''));
  const ly = LAYERS.map(l => chip('data-ly', l[0], l[1] + '<span> ' + l[2] + '</span>', l[2]));
  row(ly.slice(0, 7).join('')); row(ly.slice(7).join(''));
  row('<button class="lk" id="lk-vrm" data-sound="tap">🧑<span> VRoid</span></button><button class="lk" id="lk-sk" data-sound="tap" title="combineSkeletons">🦴<span> 1 skeleton</span></button><button class="lk" id="lk-mo" data-sound="tap" title="combineMorphs">😶<span> 1 morph set</span></button><button class="lk" id="lk-file" data-sound="tap">📂<span> .vrm</span></button><span class="lk-st" id="lk-vst"></span>');
  const out = document.createElement('div'); out.id = 'lk-out'; out.className = 'hidden'; p.appendChild(out);
  p.addEventListener('click', e => { const b = e.target.closest('button'); if(!b) return;
    if(b.dataset.pre){ const P = PRESETS[b.dataset.pre]; LOOK.preset = b.dataset.pre; LOOK.L = Object.assign({}, P.L); applyLook(); if(P.poly !== LOOK.poly) setTimeout(() => setPoly(P.poly), 30); toast(P.name + ' look', 1400); }
    else if(b.dataset.poly){ const s = +b.dataset.poly; toast('🧱 Building ×' + s + '…', 900); setTimeout(() => setPoly(s), 40); }
    else if(b.dataset.pr){ sharp = +b.dataset.pr; resize(); drawLookPanel(); }
    else if(b.dataset.ly){ const k = b.dataset.ly; LOOK.L[k] = LOOK.L[k] ? 0 : 1; LOOK.preset = 'custom'; applyLook(); }
    else if(b.id === 'lk-cost') costCheck(); else if(b.id === 'lk-x') lookOpen(false); });
  $('b-style').onclick = () => lookOpen(p.classList.contains('hidden')); })();
function lookOpen(on){ $('lookp').classList.toggle('hidden', !on); document.body.classList.toggle('lookp', on); $('b-style').classList.toggle('on', on); if(on){ drawLookPanel(); lookStats(); } }
function lookStats(){ const el = $('lk-st'); if(!el || $('lookp').classList.contains('hidden')) return;
  el.textContent = '📊 ' + MT.fps + ' fps · ' + (MT.drawMs || 0).toFixed(1) + ' ms · ' + MT.calls + ' calls · ' + Math.round(MT.tris / 1000) + 'k △ · 🧱×' + LOOK.poly + ' · 🔍×' + PERF.pr; }
applyLook();
/* ================= 🧑 3d-t1 VRoid guest — Aowu's own VRoid export (.vrm, VRoid Studio 2.17, 2 materials, 1024 atlas) stands on the islet as a guest
   Loaded only when 🧑 is tapped (GLTFLoader + @pixiv/three-vrm 3.6.0 from the importmap — the base page pays nothing).
   🦴 combineSkeletons (2 skins → 1) and 😶 combineMorphs (57 face morphs → 1 set) are switches: tapping one re-parses the same file so the stats show the difference.
   Source: ?vrm=<url> · else VRM_URL (empty until 3d-s0 puts the file on steam-models) · else 📂 pick the .vrm from this device (Files / Drive). ================= */
const VRM_URL = '';
const VR = {buf: null, name: '', vrm: null, root: null, on: false, sk: true, mo: true, t: 0, info: '', busy: false, base: null, mods: null};
window.LAB_VRM = VR;
function vrmStat(s){ const el = $('lk-vst'); if(el) el.textContent = s; }
function vrmMods(){ if(VR.mods) return VR.mods;
  VR.mods = Promise.all([import('three/addons/loaders/GLTFLoader.js'), import('@pixiv/three-vrm')]).then(([G1, V]) => ({GLTFLoader: G1.GLTFLoader, V})); return VR.mods; }
function vrmFetch(){ const q = new URLSearchParams(location.search).get('vrm'), url = q || VRM_URL;
  if(!url) return Promise.reject('pick');
  vrmStat('🧑 downloading…'); return fetch(url).then(r => { if(!r.ok) throw new Error('http ' + r.status); return r.arrayBuffer(); }).then(b => { VR.buf = b; VR.name = url.split('/').pop(); return b; }); }
function vrmCount(root){ let tris = 0, meshes = 0, mats = new Set(), skins = new Set(), morphs = 0; root.traverse(o => { if(!o.isMesh) return; meshes++; const g = o.geometry, n = g.index ? g.index.count / 3 : g.attributes.position.count / 3; tris += n;
  (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => mats.add(m)); if(o.isSkinnedMesh) skins.add(o.skeleton); morphs = Math.max(morphs, Object.keys(g.morphAttributes || {}).length ? (g.morphAttributes.position || []).length : 0); });
  return {tris: Math.round(tris), meshes, mats: mats.size, skins: skins.size, morphs}; }
function vrmBuild(){ if(!VR.buf) return Promise.resolve(); VR.busy = true; vrmStat('🧑 building…'); const t0 = performance.now();
  return vrmMods().then(({GLTFLoader, V}) => new Promise((ok, no) => { const L = new GLTFLoader(); L.register(p => new V.VRMLoaderPlugin(p)); L.parse(VR.buf.slice(0), '', ok, no); }).then(gltf => {
    const vrm = gltf.userData.vrm; if(!vrm) throw new Error('not a VRM');
    const before = vrmCount(gltf.scene);
    if(VR.sk && V.VRMUtils.combineSkeletons) V.VRMUtils.combineSkeletons(gltf.scene);
    if(VR.mo && V.VRMUtils.combineMorphs) V.VRMUtils.combineMorphs(vrm);
    vrmDrop(); VR.vrm = vrm; VR.V = V; const root = new T.Group(); root.add(vrm.scene); VR.root = root;
    vrm.scene.traverse(o => { o.frustumCulled = false; });
    const box = new T.Box3().setFromObject(vrm.scene), h = box.max.y - box.min.y || 1.6, s = 1.45 / h; root.scale.setScalar(s); root.position.set(SPOT.arrive[0] + 1.5, 0, SPOT.arrive[1] + 1.1);
    const hb = vrm.humanoid; VR.bones = {}; ['leftUpperArm', 'rightUpperArm', 'leftLowerArm', 'rightLowerArm', 'chest', 'spine', 'neck', 'head', 'hips'].forEach(k => { VR.bones[k] = hb.getNormalizedBoneNode(k); });
    world.add(root); const after = vrmCount(vrm.scene); VR.count = after;
    VR.info = (Math.round(after.tris / 100) / 10) + 'k △ · ' + after.meshes + ' meshes · ' + after.mats + ' materials · skins ' + before.skins + ' → ' + after.skins + ' · morph targets ' + before.morphs + ' → ' + after.morphs + ' · 🦴 ' + (VR.sk ? 'on' : 'off') + ' · 😶 ' + (VR.mo ? 'on' : 'off') + ' · built ' + Math.round(performance.now() - t0) + ' ms' + (VR.name ? ' · ' + VR.name + ' ' + Math.round(VR.buf.byteLength / 1048576 * 10) / 10 + ' MB' : '');
    VR.on = true; VR.busy = false; MT.skip = 2; vrmStat('🧑 ' + (Math.round(after.tris / 100) / 10) + 'k △ · skins ' + after.skins + ' · ' + after.mats + ' mats'); vrmBtns(); })).catch(e => { VR.busy = false; vrmStat('🧑 ' + (e && e.message || e)); console.warn('[3dkit] vrm', e); }); }
function vrmDrop(){ if(!VR.root) return; world.remove(VR.root); try { VR.V.VRMUtils.deepDispose(VR.root); } catch(e){} VR.root = null; VR.vrm = null; VR.on = false; }
function vrmBtns(){ const b = id => $(id); if(!b('lk-vrm')) return; b('lk-vrm').classList.toggle('on', VR.on); b('lk-sk').classList.toggle('on', VR.sk); b('lk-mo').classList.toggle('on', VR.mo); }
function vrmUpdate(dt, time){ const v = VR.vrm; if(!v) return; VR.t += dt; const B = VR.bones, t = VR.t;
  if(B.leftUpperArm) B.leftUpperArm.rotation.z = -1.18 + Math.sin(t * 1.3) * 0.03; if(B.rightUpperArm) B.rightUpperArm.rotation.z = 1.18 - Math.sin(t * 1.3 + 0.4) * 0.03;
  if(B.leftLowerArm) B.leftLowerArm.rotation.z = -0.16; if(B.rightLowerArm) B.rightLowerArm.rotation.z = 0.16;
  if(B.chest) B.chest.rotation.x = Math.sin(t * 1.6) * 0.025; if(B.spine) B.spine.rotation.y = Math.sin(t * 0.45) * 0.05;
  if(B.head && VR.root){ const want = Math.atan2(H.x - VR.root.position.x, H.z - VR.root.position.z), lim = clamp(angDiff(want, VR.root.rotation.y), -0.7, 0.7); B.head.rotation.y += (lim - B.head.rotation.y) * Math.min(1, dt * 3); }
  if(VR.root){ const want = Math.atan2(H.x - VR.root.position.x, H.z - VR.root.position.z); if(Math.hypot(H.x - VR.root.position.x, H.z - VR.root.position.z) < 4.5) VR.root.rotation.y += angDiff(want, VR.root.rotation.y) * Math.min(1, dt * 1.2); }
  const em = v.expressionManager; if(em){ const ph = (t % 3.6), bl = ph < 0.16 ? Math.sin(ph / 0.16 * Math.PI) : 0; try { em.setValue('blink', bl); em.setValue('happy', 0.25 + Math.sin(t * 0.3) * 0.1); } catch(e){} }
  v.update(dt); }
(function vrmUi(){ const inp = document.createElement('input'); inp.type = 'file'; inp.accept = '.vrm,.glb,model/gltf-binary'; inp.id = 'lk-vrmfile'; inp.style.display = 'none'; document.body.appendChild(inp);
  inp.onchange = () => { const f = inp.files && inp.files[0]; if(!f) return; vrmStat('🧑 reading ' + Math.round(f.size / 1048576) + ' MB…'); f.arrayBuffer().then(b => { VR.buf = b; VR.name = f.name; return vrmBuild(); }); inp.value = ''; };
  const go = () => { if(VR.busy) return; if(VR.on){ vrmDrop(); vrmStat('🧑 off'); vrmBtns(); MT.skip = 2; return; }
    if(VR.buf) return vrmBuild(); vrmFetch().then(vrmBuild, e => { if(e === 'pick'){ vrmStat('📂 pick the .vrm file'); inp.click(); } else vrmStat('🧑 ' + (e && e.message || e)); }); };
  $('lk-vrm').onclick = go; $('lk-file').onclick = () => inp.click();
  $('lk-sk').onclick = () => { VR.sk = !VR.sk; vrmBtns(); if(VR.on) vrmBuild(); };
  $('lk-mo').onclick = () => { VR.mo = !VR.mo; vrmBtns(); if(VR.on) vrmBuild(); };
  vrmBtns(); })();

/* ================= 🔁 the frame ================= */
const WALK = 3.1, RUN = 4.9;
function heroUpdate(dt){ const s = hero.st;
  let mx = 0, mz = 0, m = 0;
  if(!talking && !STAGE.on){ let sx = IN.sx, sy = IN.sy; m = IN.m;
    const kx = (IN.keys.ArrowRight || IN.keys.KeyD ? 1 : 0) - (IN.keys.ArrowLeft || IN.keys.KeyA ? 1 : 0), ky = (IN.keys.ArrowDown || IN.keys.KeyS ? 1 : 0) - (IN.keys.ArrowUp || IN.keys.KeyW ? 1 : 0);
    if(kx || ky){ const L = Math.hypot(kx, ky); sx = kx / L; sy = ky / L; m = IN.keys.ShiftLeft ? 0.75 : 1; }
    if(m > 0){ const c = camNow(), f = new T.Vector3(); c.getWorldDirection(f); f.y = 0; f.normalize(); const rx = -f.z, rz = f.x; mx = rx * sx - f.x * sy; mz = rz * sx - f.z * sy; const L = Math.hypot(mx, mz) || 1; mx /= L; mz /= L; }
    else if(H.go){ const dx = H.go.x - H.x, dz = H.go.z - H.z, d = Math.hypot(dx, dz); if(d < H.go.stop + 0.05){ const t = H.go.t; H.go = null; if(t) interact(t); } else { mx = dx / d; mz = dz / d; m = 0.95; } } }
  if(hero.st.act && (hero.st.act.k === 'wai' || hero.st.act.k === 'pet' || hero.st.act.k === 'hurt') && !H.air) m = 0;
  const sp = m > 0.92 ? RUN : WALK * Math.max(m, 0.35 * (m > 0)); let vx = mx * sp * (m > 0 ? 1 : 0), vz = mz * sp * (m > 0 ? 1 : 0);
  if(H.kb){ H.kb.t -= dt; vx = H.kb.vx; vz = H.kb.vz; if(H.kb.t <= 0) H.kb = null; }
  const step = (x, z) => { if(freeAt(x, z, 0.26)){ H.x = x; H.z = z; return true; } return false; };
  if(vx || vz){ const nx = H.x + vx * dt, nz = H.z + vz * dt; if(!step(nx, nz) && !step(nx, H.z) && !step(H.x, nz)){ if(H.go) H.go = null; } }
  H.vx = vx; H.vz = vz; if((vx || vz) && !H.kb){ H.face += angDiff(Math.atan2(vx, vz), H.face) * (1 - Math.exp(-dt * 14)); }
  /* jump: crouch (anticipation) → launch → air → land squash (follow-through) → settle */
  if(H.crouch > 0){ H.crouch -= dt; hero.st.crouch = H.crouch; if(H.crouch <= 0){ hero.st.crouch = 0; doJump(); } }
  const gy = groundY(H.x, H.z);
  if(H.air){ H.vy -= 18 * dt; H.y += H.vy * dt; if(H.y <= gy){ H.y = gy; H.air = false; hero.st.air = false; hero.st.land = 0.32; H.vy = 0; for(let i = 0; i < 5; i++) fxDust(H.x, 0.05, H.z, 0.7); tone(180, 0.06, {type: 'sine', gain: 0.1});
    if(H.jumpQ > 0){ H.jumpQ = 0; H.crouch = 0.06; } } } else H.y = gy;
  if(H.jumpQ > 0) H.jumpQ -= dt;
  H.dizzy = Math.max(0, H.dizzy - dt); H.inv = Math.max(0, H.inv - dt);
  s.spd = Math.hypot(vx, vz) / WALK; s.air = H.air;
  hero.root.position.set(H.x, H.y, H.z); hero.root.rotation.y = H.face;
  if(SMEAR.visible){ SMEAR.userData.t += dt; const u = SMEAR.userData.t / 0.2; SMEAR.material.opacity = 0.85 * (1 - u); SMEAR.rotation.z = -0.6 + u * 1.4; SMEAR.scale.setScalar(1 + u * 0.25); if(u >= 1) SMEAR.visible = false; } }
function pudUpdate(dt){ const bx = H.x - Math.sin(H.face) * 1.35 + Math.cos(H.face) * 0.55, bz = H.z - Math.cos(H.face) * 1.35 - Math.sin(H.face) * 0.55;
  let tx = bx, tz = bz; if(ENC.on){ tx = H.x + (H.x - NAGA.S.x) * 0.25 + 1.4; tz = H.z + 1.5; }
  const dx = tx - PD.x, dz = tz - PD.z, d = Math.hypot(dx, dz), dh = Math.hypot(H.x - PD.x, H.z - PD.z);
  let v = 0; if(STAGE.on){ PD.face = Math.atan2(NAGA.S.x - PD.x, NAGA.S.z - PD.z); } else if(d > 0.5 && dh > 1.05){ v = Math.min(5.6, d * 2.2 + 0.8); const nx = PD.x + dx / d * v * dt, nz = PD.z + dz / d * v * dt;
    if(freeAt(nx, nz, 0.34)){ PD.x = nx; PD.z = nz; } else if(freeAt(nx, PD.z, 0.34)) PD.x = nx; else if(freeAt(PD.x, nz, 0.34)) PD.z = nz; else if(d > 7){ PD.x = tx; PD.z = tz; }
    PD.face += angDiff(Math.atan2(dx, dz), PD.face) * (1 - Math.exp(-dt * 8)); }
  else { const want = Math.atan2(H.x - PD.x, H.z - PD.z); pud.st.look = clamp(angDiff(want, PD.face), -0.7, 0.7); if(Math.abs(angDiff(want, PD.face)) > 1.2) PD.face += angDiff(want, PD.face) * (1 - Math.exp(-dt * 2)); }
  pud.st.spd = v / 3; pud.root.position.set(PD.x, 0, PD.z); pud.root.rotation.y = PD.face; }
const _cp = new T.Vector3();
function outlineLod(){ const c = camNow(), per = c === CAM.per; c.getWorldPosition(_cp);
  [[monk.root, 1], [tara.root, 1], [pud.root, 1]].forEach(([r]) => { const far = per && _cp.distanceTo(r.position) > 11; if(r.userData.far === far) return; r.userData.far = far; r.traverse(o => { if(o.material === OUT) o.visible = !far; }); }); }
function npcUpdate(dt, time){ NPCS.forEach(n => { const d = Math.hypot(H.x - n.x, H.z - n.z), want = d < 2.4 || n.talk ? Math.atan2(H.x - n.x, H.z - n.z) : n.face0;
    n.face += angDiff(want, n.face) * (1 - Math.exp(-dt * 5)); n.c.root.rotation.y = n.face; n.c.st.spd = 0; if(d < 2.4 && n.c.st.act && n.c.st.act.k === 'sweep') n.c.st.act = null;
    poseChibi(n.c, dt, time); }); }
function bellUpdate(dt){ BELL.t += dt; BELL.m.rotation.z = Math.sin(BELL.t * 6.5) * 0.35 * Math.exp(-BELL.t * 1.1); BELL.m.rotation.x = Math.sin(BELL.t * 5.2) * 0.12 * Math.exp(-BELL.t * 1.1); }
function decorUpdate(dt, time){ DEC.rockList.forEach((r, i) => DEC.rocks.setMatrixAt(i, M(r[0], r[1] + Math.sin(time * 0.6 + i) * 0.25, r[2], 0, r[3] + time * 0.05, 0, r[4]))); DEC.rocks.instanceMatrix.needsUpdate = true;
  DEC.cloudGroup.rotation.y = time * 0.006;
  /* 🎥 behind-you camera: trees between the camera and you shrink away (no clipping through palms) */
  { const c = camNow(), third = c === CAM.per; [[DEC.trees, DEC.treeList, DEC.treeF], [DEC.palms, DEC.palmList, DEC.palmF]].forEach(([im, list, F]) => { let ch = false;
    list.forEach((p, i) => { let want = 1; if(third){ const ax = c.position.x, az = c.position.z, bx = H.x, bz = H.z, dx = bx - ax, dz = bz - az, L2 = dx * dx + dz * dz || 1, u = clamp(((p[0] - ax) * dx + (p[2] - az) * dz) / L2, 0, 1), d = Math.hypot(ax + dx * u - p[0], az + dz * u - p[2]);
      if((d < 1.5 && u < 0.92) || Math.hypot(p[0] - ax, p[2] - az) < 2.2) want = 0.12; }
      const f = F[i] + (want - F[i]) * Math.min(1, dt * 8); if(Math.abs(f - F[i]) > 0.002){ F[i] = f; im.setMatrixAt(i, M(p[0], 0, p[2], 0, p[3], 0, p[4] * f, p[4] * f, p[4] * f)); ch = true; } });
    if(ch) im.instanceMatrix.needsUpdate = true; }); }
  let bp = false; DEC.bushList.forEach((b, i) => { if(DEC.bushPulse[i] > 0){ DEC.bushPulse[i] -= dt; const u = DEC.bushPulse[i] / 0.5, w = 1 + Math.sin(u * 14) * 0.15 * u; DEC.bushes.setMatrixAt(i, M(b[0], 0, b[2], 0, b[3], 0, b[4] * w, b[4] / w, b[4] * w)); bp = true; if(DEC.bushPulse[i] <= 0) DEC.bushes.setMatrixAt(i, M(b[0], 0, b[2], 0, b[3], 0, b[4])); } });
  if(bp) DEC.bushes.instanceMatrix.needsUpdate = true;
  let n = 0; Q.forEach(q => { if(DONE.has(q.id)) return; MARK.setMatrixAt(n++, M(q.at[0], q.hy + Math.sin(time * 2.6 + n) * 0.12, q.at[1], 0, time * 1.6, 0, 0.85)); }); setCount(MARK, STAGE.on ? 0 : n); MARK.instanceMatrix.needsUpdate = true;
  if(H.dizzy > 0){ for(let i = 0; i < 3; i++){ const a = time * 5 + i * TAU / 3; STARS.setMatrixAt(i, M(H.x + Math.cos(a) * 0.32, H.y + 1.28, H.z + Math.sin(a) * 0.32, 0, a, 0, 1)); } setCount(STARS, 3); STARS.instanceMatrix.needsUpdate = true; } else setCount(STARS, 0);
  const sh = [[H.x, 0, H.z, 0.75 * clamp(1 - H.y * 0.35, 0.4, 1)], [PD.x, 0, PD.z, 0.95, 1.2]].concat(NPCS.map(n => [n.x, 0, n.z, 0.7])); shadows(sh); }
/* 🏷️ DOM overlays: name tag over the target in reach · hint bar with an arrow to the next quest · 3D stickers */
const _sp = new T.Vector3();
function toScreen(x, y, z){ _sp.set(x, y, z).project(camNow()); return {x: (_sp.x + 1) / 2 * innerWidth, y: (1 - _sp.y) / 2 * innerHeight, ok: _sp.z < 1}; }
function pop3d(x, y, z, text, big){ const p = toScreen(x, y, z), el = document.createElement('div'); el.className = 'stk' + (big ? ' big' : ''); el.textContent = text; el.style.left = clamp(p.x, 60, innerWidth - 60) + 'px'; el.style.top = clamp(p.y, 80, innerHeight - 40) + 'px'; $('app').appendChild(el); setTimeout(() => el.remove(), 1500); }
let HINT = '';
function hint(s){ HINT = s || ''; }
function overlays(){ const tag = $('tag');
  if(reach && !talking){ const [x, z] = reach.p(), p = toScreen(x, reach.id === 'bell' ? 3.2 : reach.id === 'stair' ? 1.7 : 1.75, z); tag.textContent = ACT_IC[reach.k] + ' ' + reach.name; tag.style.left = p.x + 'px'; tag.style.top = p.y + 'px'; tag.classList.remove('hidden');
    REACH.visible = true; REACH.position.set(x, 0.05, z); REACH.scale.setScalar(1 + Math.sin(performance.now() / 160) * 0.06); } else { tag.classList.add('hidden'); REACH.visible = false; }
  const g = $('goal'), nx = qNext(); let html = '';
  if(HINT) html = HINT; else if(nx){ const a = toScreen(H.x, 0.5, H.z), b = toScreen(nx.at[0], 0.5, nx.at[1]), ang = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI, d = Math.round(Math.hypot(nx.at[0] - H.x, nx.at[1] - H.z));
    html = nx.ic + ' ' + nx.t + ' <b style="transform:rotate(' + Math.round(ang) + 'deg)">➜</b> ' + d + ' m'; }
  else html = '🌟 All done! Try 🐉 Naga or 🎥';
  if(g.__h !== html){ g.__h = html; g.innerHTML = html; } g.classList.toggle('hidden', !html); }

/* ================= 📏 layout (7 sizes: nothing covers the stick, the petals or the goal) ================= */
function layout(){ const top = $('top').getBoundingClientRect(), narrow = innerWidth < 760, g = $('goal'), q = $('quests'), mt = $('meter');
  const short = innerHeight < 500 && innerWidth > innerHeight; document.body.classList.toggle('narrow', narrow); document.body.classList.toggle('short', short);
  g.style.top = Math.round(top.bottom + 6) + 'px'; q.style.top = Math.round(top.bottom + (narrow ? 46 : 6)) + 'px';
  try { UI.pad.petals($('btns'), $('b-jump'), [$('b-act'), $('b-swing'), $('b-emote')], {fit: true}); } catch(e){}
  const st = $('stick'); st.style.width = st.style.height = ''; const sr = st.getBoundingClientRect(), bl = Math.min(...[...$('btns').querySelectorAll('button')].filter(x => x.offsetParent).map(x => x.getBoundingClientRect().left).concat([innerWidth]));
  if(bl - sr.left - 18 < sr.width) st.style.width = st.style.height = Math.max(104, Math.round(bl - sr.left - 18)) + 'px';
  mt.style.top = ''; mt.style.bottom = ''; mt.style.left = ''; mt.style.right = ''; mt.style.transform = '';
  if(STAGE.on){ const nb = $('nagabar').getBoundingClientRect(); mt.style.left = '50%'; mt.style.transform = 'translateX(-50%)'; mt.style.top = Math.round(nb.top - 34) + 'px'; }
  else if(short){ mt.style.left = '50%'; mt.style.transform = 'translateX(-50%)'; mt.style.bottom = 'calc(6px + env(safe-area-inset-bottom))'; mt.style.width = 'max-content'; }   /* 📱 sideways phone: the right corner belongs to the 🌼 petals */
  else { mt.style.right = 'calc(8px + env(safe-area-inset-right))'; mt.style.top = Math.round(top.bottom + (narrow ? 46 : 6)) + 'px'; }
  const qb = q.getBoundingClientRect(), hudB = Math.max(top.bottom, g.getBoundingClientRect().bottom || 0, STAGE.on ? 0 : qb.bottom);

  /* 🎥 the hero sits in the middle of the FREE screen: under the HUD, above the pads when they cover the middle (upright phones) */
  const pr = [st.getBoundingClientRect()].concat([...$('btns').querySelectorAll('button')].filter(x => x.offsetParent).map(x => x.getBoundingClientRect())), padTop = Math.min(...pr.map(r => r.top)),
    corners = (Math.min(...pr.slice(1).map(r => r.left).concat([innerWidth])) - pr[0].right) > innerWidth * 0.3;
  $('toast').style.top = short && !STAGE.on ? Math.round(innerHeight - 96) + 'px' : Math.round(hudB + 8) + 'px';   /* sideways phone: tips sit low in the middle, between the stick and the petals */
  $('toast').style.maxWidth = short ? Math.max(220, Math.round(Math.min(...pr.slice(1).map(r => r.left).concat([innerWidth])) - pr[0].right - 24)) + 'px' : '';
  CAM.padT = STAGE.on ? 0 : Math.round(Math.min(hudB, innerHeight * 0.3)); CAM.padB = STAGE.on || corners ? 0 : Math.round(Math.min(innerHeight - padTop, innerHeight * 0.35));
  resize(); }
function resize(){ const p = pixelRatio(); renderer.setPixelRatio(p); renderer.setSize(innerWidth, innerHeight, false); const v = new T.Vector2(); renderer.getDrawingBufferSize(v); OUT.uniforms.uRes.value.copy(v); OUT.uniforms.uW.value = 1.9 * p + 0.3; PERF.pr = p;
  $('b-sharp').querySelector('.lb').textContent = ' ×' + p; }
addEventListener('resize', () => requestAnimationFrame(layout));
$('b-sharp').onclick = () => { const d = window.devicePixelRatio || 1, opts = SHARP.filter(x => x <= Math.max(1, d) + 0.01); const i = opts.indexOf(sharp); sharp = opts[(i + 1) % opts.length] || 1; resize(); toast('🔍 Sharpness ×' + PERF.pr + ' (phones start at ×1.5)'); };
function rebuildHero(){ const a = LOOKS.i === 0 ? LOOKS.me : SAMPLES[LOOKS.i]; world.remove(hero.root); hero.root.remove(SMEAR); disposeTree(hero.root); hero = makeChibi(lookOf(a)); hero.root.add(SMEAR); world.add(hero.root); }
$('b-look').onclick = () => { LOOKS.i = (LOOKS.i + 1) % SAMPLES.length; rebuildHero(); $('b-look').querySelector('.lb').textContent = LOOKS.i ? ' ' + (LOOKS.i + 1) + '/' + SAMPLES.length : ' Me'; play(hero, 'cheer'); };
try { if(window.google && google.script && google.script.run && CURRENT_PLAYER) google.script.run.withSuccessHandler(d => { const a = d && d.avatars && d.avatars[CURRENT_PLAYER]; if(a){ LOOKS.me = a; if(LOOKS.i === 0) rebuildHero(); } }).withFailureHandler(() => {}).getMazeData(CURRENT_PLAYER); } catch(e){}

/* ================= 📊 meter: fps · worst frame · draw calls · triangles · sharpness · load · size → 📋 copy · 📤 send ================= */
const MT = {n: 0, t0: 0, worst: 0, fps: 0, calls: 0, tris: 0, open: false, start: 0, heatAsked: false};
function sizes(){ const r = performance.getEntriesByType('resource'), nav = performance.getEntriesByType('navigation')[0] || {}; let three = 0, threeDec = 0, site = 0, siteN = 0, total = (nav.transferSize || 0), dec = (nav.decodedBodySize || 0), threeN = 0;
  r.forEach(e => { total += e.transferSize || 0; dec += e.decodedBodySize || 0; if(/three@0\.187/.test(e.name)){ three += e.transferSize || 0; threeDec += e.decodedBodySize || 0; threeN++; } if(/ThreeLab\./.test(e.name)){ site += e.transferSize || e.decodedBodySize || 0; siteN++; } });
  return {three, threeDec, threeN, site, siteN, total, dec}; }
const kb = (b, n) => b ? (b / 1024 < 1000 ? Math.round(b / 1024) + ' KB' : (b / 1048576).toFixed(2) + ' MB') : n ? 'cached' : '—';
function devName(){ const u = navigator.userAgent, m = u.match(/(iPhone|iPad)[^;]*;[^)]*OS (\d+[_\d]*)/), a = u.match(/Android [\d.]+; ([^;)]+)/); return m ? m[1] + ' iOS ' + m[2].replace(/_/g, '.') : a ? 'Android ' + a[1] : /Mac/.test(u) ? 'Mac' : /Windows/.test(u) ? 'Windows' : 'device'; }
function avg(a){ return a.length ? Math.round(a.reduce((s, x) => s + x, 0) / a.length) : 0; }
function report(){ const S = sizes(), el = (performance.now() - MT.start) / 1000, f30 = PERF.fps.slice(0, 30), f5 = PERF.fps.slice(-60);
  return {rows: [['📱 Device', devName() + ' · ' + innerWidth + '×' + innerHeight + ' @' + (window.devicePixelRatio || 1) + ' · sharp ×' + PERF.pr], ['⏱️ Load', 'page → first 3D frame ' + (PERF.firstMs / 1000).toFixed(1) + ' s (three.js ' + (PERF.threeMs / 1000).toFixed(1) + ' s · build ' + Math.round(PERF.buildMs) + ' ms)'],
    ['📦 Size', 'three.js ' + (S.three ? kb(S.three) + ' sent (' + kb(S.threeDec) + ' unzipped)' : S.threeN ? 'cached on this device' : '—') + ' · page code ' + kb(S.site, S.siteN) + ' · all ' + kb(S.total)], ['🎞️ FPS', 'now ' + MT.fps + ' · first 30 s ' + avg(f30) + ' · last min ' + avg(f5) + ' · lowest ' + (PERF.fps.length ? Math.min(...PERF.fps) : 0) + ' · worst frame ' + Math.round(PERF.worst) + ' ms'],
    ['🧱 Draw', MT.calls + ' draw calls · ' + Math.round(MT.tris / 1000) + 'k triangles · ' + (STAGE.on ? '🐉 stage' : CAM.mode === 'iso' ? '🎥 iso' : '🎥 behind')], ['🔥 5-min test', el >= 300 ? 'done' + (PERF.heat ? ' · phone felt ' + PERF.heat : '') : Math.floor(el / 60) + ':' + String(Math.floor(el % 60)).padStart(2, '0') + ' of 5:00'], ...LOOK.rows()], el}; }   /* 3d-t1a: 🎨 look · ⏱️ layer cost · 🧑 VRM rows LAST (the 990-char send keeps the T0 rows first) */
function reportText(){ const r = report(); return ('🧊 3DKit report (3d-t1)\n' + r.rows.map(x => x[0] + ' ' + x[1]).join('\n')).slice(0, 990); }
function perfCard(){ const r = report(), el = $('perf'); el.innerHTML = '<h3>📊 3D look test — speed</h3><table>' + r.rows.filter(x => x[0] !== '⏱️ Layer cost').map(x => '<tr><td>' + x[0] + '</td><td>' + x[1] + '</td></tr>').join('') + '</table>' +
  '<div class="bar"><i style="width:' + Math.min(100, r.el / 3) + '%"></i></div><div class="row"><button class="chip" id="pf-copy">📋 Copy</button><button class="chip on" id="pf-send">📤 Send to 🧊 3DKit chat</button><button class="chip" id="pf-x">✕ Close</button></div>';
  el.classList.remove('hidden'); MT.open = true;
  $('pf-x').onclick = () => { el.classList.add('hidden'); MT.open = false; };
  $('pf-copy').onclick = () => { try { navigator.clipboard.writeText(reportText()).then(() => toast('📋 Copied'), () => toast('📋 Copy blocked — use 📤 Send')); } catch(e){ toast('📋 Copy blocked — use 📤 Send'); } };
  $('pf-send').onclick = () => { try { google.script.run.withSuccessHandler(() => { toast('📤 Sent! The 🧊 3DKit chat reads it from 💬 Feedback.'); PERF.sent = true; }).withFailureHandler(e => toast('📤 ' + (e && e.message || 'Could not send'), 3000))
    .sendFeedback({kind: 'idea', player: CURRENT_PLAYER, text: reportText()}); } catch(e){ toast('📤 Sending works inside the app only'); } }; }
$('meter').onclick = () => MT.open ? ($('perf').classList.add('hidden'), MT.open = false) : perfCard();
function heatAsk(){ MT.heatAsked = true; const el = $('perf'); el.innerHTML = '<h3>🔥 5 minutes! How warm is the phone?</h3><div class="row"><button class="chip" data-h="🙂 cool">🙂 Cool</button><button class="chip" data-h="😐 warm">😐 Warm</button><button class="chip" data-h="🥵 hot">🥵 Hot</button></div>';
  el.classList.remove('hidden'); MT.open = true; el.querySelectorAll('[data-h]').forEach(b => b.onclick = () => { PERF.heat = b.dataset.h; perfCard(); }); }
function meter(now, dt){ MT.n++; if(now - MT.start > 2000 && !(MT.skip > 0)) PERF.worst = Math.max(PERF.worst, dt * 1000); MT.worst = Math.max(MT.worst, dt * 1000);
  if(now - MT.t0 >= 1000){ MT.fps = Math.round(MT.n * 1000 / (now - MT.t0)); if(MT.skip > 0) MT.skip--; else PERF.fps.push(MT.fps); if(PERF.fps.length > 400) PERF.fps.shift(); $('meter').textContent = innerWidth < 760 || innerHeight < 500 ? '📊 ' + MT.fps + ' fps · ' + MT.calls + ' · ' + Math.round(MT.tris / 1000) + 'k△' : '📊 ' + MT.fps + ' fps · ' + Math.round(MT.worst) + ' ms · ' + MT.calls + ' calls · ' + Math.round(MT.tris / 1000) + 'k △ · ×' + PERF.pr; lookStats();
    MT.n = 0; MT.t0 = now; MT.worst = 0; if(MT.open && $('perf').querySelector('table')) perfCard(); if(!MT.heatAsked && (now - MT.start) / 1000 >= 300) heatAsk(); } }

/* ================= ▶ run · ⏸️ pause when hidden · 🧊 context lost card · 🧹 dispose on exit ================= */
let last = performance.now(), simT = 0, first = true;
function frame(){ const now = performance.now(); let dt = Math.min(0.05, (now - last) / 1000); last = now; const sdt = dt * (STAGE.on && STAGE.slow ? 0.25 : 1); simT += sdt;
  if(STAGE.on && STAGE.auto && !H.air && H.crouch <= 0){ if(NAGA.spikes.some(s => s.t > -0.16 && s.t < -0.06 && Math.hypot(s.x - H.x, s.z - H.z) < 0.75)){ H.crouch = 0.06; hero.st.crouch = 0.06; } }
  heroUpdate(sdt); pudUpdate(sdt); npcUpdate(sdt, simT); poseChibi(hero, sdt, simT); posePudding(pud, sdt, simT); bellUpdate(sdt);
  nagaUpdate(dt * (STAGE.on && STAGE.slow ? 1 : 1), simT, hero); fxUpdate(sdt); ringsUpdate(sdt); decorUpdate(sdt, simT);
  reach = findReach(); actLabel(reach); camUpdate(dt, now / 1000); outlineLod(); overlays();
  lookUpdate(dt, simT); vrmUpdate(sdt, simT); const rt0 = performance.now(); renderer.render(scene, camNow()); MT.drawMs = (MT.drawMs || 0) * 0.9 + (performance.now() - rt0) * 0.1; MT.calls = renderer.info.render.calls; MT.tris = renderer.info.render.triangles;
  if(first){ first = false; PERF.firstMs = performance.now(); MT.start = MT.t0 = performance.now(); clearTimeout(slowT); try { UI.loaded(); } catch(e){} $('meter').classList.remove('hidden'); setTimeout(() => toast(isDesk ? '🧊 Walk to the gold ◆ · E talks · Q bows · F swings' : '🧊 Walk to the gold ◆ · ✋ talks · 🎭 bows · ⚔️ swings', 3400), 600); }
  meter(now, dt); }
drawQuests(); layout(); camUpdate(1, 0);
renderer.setAnimationLoop(frame);
document.addEventListener('visibilitychange', () => { if(document.hidden) renderer.setAnimationLoop(null); else { last = performance.now(); MT.n = 0; MT.t0 = last; MT.worst = 0; MT.skip = 2; renderer.setAnimationLoop(frame); } });   /* the paused second never counts as a slow one */
cv.addEventListener('webglcontextlost', e => { e.preventDefault(); renderer.setAnimationLoop(null); card('🧊', 'The 3D picture took a nap', 'The phone needed its graphics memory back. Tap to wake the islet up.', '🔁 Wake it up'); });
cv.addEventListener('webglcontextrestored', () => { $('card').classList.add('hidden'); last = performance.now(); renderer.setAnimationLoop(frame); });
addEventListener('pagehide', () => { try { renderer.setAnimationLoop(null); scene.traverse(o => { if(o.geometry) o.geometry.dispose(); if(o.material){ (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => { if(m.map) m.map.dispose(); m.dispose(); }); } }); RAMP.dispose(); renderer.dispose(); renderer.forceContextLoss(); } catch(e){} });
window.LAB3D = {LOOK, POLY, U, setPoly, applyLook, costCheck, VR, MEADOW, T, scene, renderer, H, NAGA, CAM, STAGE, DONE, PERF, MT, encStart, stageOn, slamStart, interact, TARGETS, report, onLand, emote, jump: jumpPress, get hero(){ return hero; }};   /* 🧪 for tests + device checks */
}
})();
