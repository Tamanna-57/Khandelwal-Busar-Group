// Two people in conversation, drawn as a mosaic of blue ">" glyphs.
// The figures are painted each frame on a tiny offscreen canvas (one pixel per
// glyph), then every covered cell is drawn as a ">" whose shade flickers.
// The left figure gestures while talking, the right one nods and listens,
// and both shift their weight a little — like the reference's live footage.

const COLS = 44;
const ROWS = 54;
const CELL_ASPECT = 1.15; // glyph cells are taller than wide

const COLORS = {
  low: [38, 84, 168],
  mid: [31, 95, 209],
  high: [150, 190, 255],
};
const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));

// tiny deterministic noise so cloth texture stays put while glyphs flicker
const hash = (x, y) => {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
};

/* ---------------- figure painting (units: 0..100 wide, 0..135 tall) --------------- */
function limb(g, x1, y1, x2, y2, w) {
  g.lineWidth = w;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(x1, y1);
  g.lineTo(x2, y2);
  g.stroke();
}
function poly(g, pts) {
  g.beginPath();
  g.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]);
  g.closePath();
  g.fill();
}

function paintScene(g, t) {
  g.clearRect(0, 0, 100, 135);
  g.fillStyle = "#fff";
  g.strokeStyle = "#fff";

  // ---- left speaker, facing right, gesturing ----
  const swayA = Math.sin(t * 0.9) * 0.8;
  const talk = Math.sin(t * 5.2) * 0.6 + Math.sin(t * 3.1) * 0.4; // small head movement while speaking
  const gesture = 0.5 + 0.5 * Math.sin(t * 1.7) * Math.sin(t * 0.43 + 1); // slow, irregular hand lift
  const ax = 26 + swayA;
  g.beginPath();
  g.ellipse(ax + 1.5 + talk * 0.4, 15.5 + talk * 0.3, 6.4, 7.6, 0, 0, Math.PI * 2); // head
  g.fill();
  limb(g, ax + 0.5, 21, ax + 0.5, 28, 4.6); // neck
  poly(g, [[ax - 10, 31.5], [ax - 5, 27.5], [ax + 6, 27.5], [ax + 10, 31], [ax + 8, 56], [ax + 8.5, 72], [ax - 8.5, 72], [ax - 8, 56]]); // jacket
  limb(g, ax - 11, 33, ax - 13.5, 53, 4.2); // back arm
  limb(g, ax - 13.5, 53, ax - 12.5, 68, 3.8);
  const ex = ax + 13.5, ey = 50; // front arm: elbow out, forearm rising toward the listener
  const ang = -0.15 - gesture * 0.9;
  const hx = ex + Math.cos(ang) * 11.5, hy = ey + Math.sin(ang) * 11.5;
  limb(g, ax + 10.5, 33, ex, ey, 4.4);
  limb(g, ex, ey, hx, hy, 3.8);
  g.beginPath(); g.ellipse(hx + 1, hy - 0.3, 2.4, 2, ang, 0, Math.PI * 2); g.fill();
  limb(g, ax - 4.2, 71, ax - 4.8 - swayA * 0.3, 121, 6.4); // legs
  limb(g, ax + 4.2, 71, ax + 5, 121, 6.4);
  poly(g, [[ax - 8.5, 119], [ax - 1.5, 119], [ax + 0.5, 126], [ax - 9.5, 126]]); // shoes
  poly(g, [[ax + 1.8, 119], [ax + 8.5, 119], [ax + 12.5, 126], [ax + 1.2, 126]]);

  // ---- right listener, facing left, nodding, holding a folder ----
  const swayB = Math.sin(t * 0.7 + 2) * 0.7;
  const nod = Math.max(0, Math.sin(t * 1.25)) ** 3 * 1.6;
  const bx = 72 + swayB;
  g.beginPath();
  g.ellipse(bx - 1.5, 12 + nod, 6.8, 8, 0, 0, Math.PI * 2);
  g.fill();
  limb(g, bx - 0.5, 18, bx - 0.5, 26, 4.8);
  poly(g, [[bx - 10.5, 29.5], [bx - 6, 25.5], [bx + 5.5, 25.5], [bx + 10.5, 29.5], [bx + 9, 56], [bx + 9.5, 74], [bx - 9.5, 74], [bx - 9, 56]]);
  limb(g, bx + 11.5, 31, bx + 13.5, 53, 4.3); // far arm down
  limb(g, bx + 13.5, 53, bx + 12.5, 69, 3.8);
  limb(g, bx - 11, 31, bx - 14.5, 48, 4.3); // near arm bent, holding a folder
  limb(g, bx - 14.5, 48, bx - 9.5, 58, 3.8);
  poly(g, [[bx - 16, 52], [bx - 6.5, 51], [bx - 6.5, 63], [bx - 16, 64]]);
  limb(g, bx - 4.4, 73, bx - 5, 122, 6.6);
  limb(g, bx + 4.4, 73, bx + 4 + swayB * 0.3, 122, 6.6);
  poly(g, [[bx - 8.5, 120], [bx - 1.5, 120], [bx - 0.5, 127], [bx - 12.5, 127]]);
  poly(g, [[bx + 0.8, 120], [bx + 8, 120], [bx + 8.5, 127], [bx - 2.5, 127]]);
}

// faint fragments in the background, like passers-by in the footage
const SPECKS = [
  { x: 2, y: 1, w: 5, h: 4 },
  { x: 9, y: 2, w: 2, h: 5 },
  { x: 4, y: 14, w: 1, h: 2 },
  { x: 0, y: 23, w: 2, h: 1 },
  { x: 35, y: 1, w: 4, h: 3 },
  { x: 37, y: 9, w: 2, h: 4 },
];

export function createGlyphArt(canvas, { reduceMotion = false } = {}) {
  const ctx = canvas.getContext("2d");
  const off = document.createElement("canvas");
  off.width = COLS;
  off.height = ROWS;
  const og = off.getContext("2d", { willReadFrequently: true });
  // map scene units (100 x 135) onto the glyph grid
  const sx = COLS / 100;
  const sy = ROWS / 135;

  const n = COLS * ROWS;
  const flick = new Float32Array(n).fill(1);
  const flickNext = new Float64Array(n);
  const tone = new Float32Array(n);
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) tone[r * COLS + c] = hash(c, r);

  let w = 0, h = 0, cw = 0, ch = 0, ox = 0, oy = 0;
  let running = false, raf = 0, last = 0, burstUntil = 0;
  const drifters = [];
  let coverage = new Uint8ClampedArray(n);

  function sample(t) {
    og.setTransform(sx, 0, 0, sy, 0, 0);
    paintScene(og, t);
    const px = og.getImageData(0, 0, COLS, ROWS).data;
    for (let i = 0; i < n; i++) coverage[i] = px[i * 4 + 3];
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    w = rect.width;
    h = rect.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cw = Math.min(w / COLS, h / (ROWS * CELL_ASPECT));
    ch = cw * CELL_ASPECT;
    ox = (w - cw * COLS) / 2;
    oy = (h - ch * ROWS) / 2;
    ctx.font = `700 ${Math.max(8, ch * 1.02)}px ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    render(performance.now());
  }

  function color(v, f) {
    let rgb = v < 0.6 ? mix(COLORS.low, COLORS.mid, v / 0.6) : mix(COLORS.mid, COLORS.high, (v - 0.6) / 0.4);
    if (f > 1.15) rgb = mix(rgb, COLORS.high, 0.65);
    const a = Math.min(1, (0.5 + v * 0.5) * f);
    return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a.toFixed(3)})`;
  }

  function spawnDrifter(now) {
    if (drifters.length > 10) return;
    for (let tries = 0; tries < 40; tries++) {
      const i = Math.floor(Math.random() * n);
      const c = i % COLS;
      if (coverage[i] < 128 || c === COLS - 1 || coverage[i + 1] >= 128) continue;
      drifters.push({ r: Math.floor(i / COLS), c: c + 1, born: now, life: 700 + Math.random() * 1100, step: 150 + Math.random() * 120 });
      return;
    }
  }

  function render(now) {
    const t = now / 1000;
    sample(reduceMotion ? 0.8 : t);
    ctx.clearRect(0, 0, w, h);
    const burst = now < burstUntil;

    for (let i = 0; i < n; i++) {
      const cov = coverage[i];
      if (cov < 110) continue;
      const r = Math.floor(i / COLS), c = i % COLS;
      if (!reduceMotion && now > flickNext[i]) {
        const roll = Math.random();
        flick[i] = roll < 0.03 ? 1.35 : roll < 0.11 ? 0.45 : 0.8 + Math.random() * 0.24;
        flickNext[i] = now + 160 + Math.random() * 900;
      }
      // edge cells are softer; the cloth texture comes from the static tone noise
      const v = Math.min(1, 0.25 + (cov / 255) * 0.45 + tone[i] * 0.35);
      const f = burst && Math.random() < 0.25 ? 0.3 : flick[i];
      ctx.fillStyle = color(v, reduceMotion ? 1 : f);
      ctx.fillText(">", ox + c * cw + cw / 2, oy + r * ch + ch / 2);
    }

    // floor strip under the shoes and faint background fragments
    for (let c = 0; c < COLS; c++) {
      const under = coverage[(ROWS - 4) * COLS + c] >= 110 || coverage[(ROWS - 5) * COLS + c] >= 110;
      if (!under && !(c < 5 && hash(c, 99) > 0.3)) continue;
      ctx.fillStyle = color(0.25 + hash(c, 7) * 0.3, 0.55);
      ctx.fillText(">", ox + c * cw + cw / 2, oy + (ROWS - 1) * ch + ch / 2);
    }
    for (const s of SPECKS) {
      for (let y = s.y; y < s.y + s.h; y++) {
        for (let x = s.x; x < s.x + s.w; x++) {
          if (hash(x, y) < 0.35) continue;
          ctx.fillStyle = color(0.2 + hash(y, x) * 0.3, (reduceMotion ? 1 : flick[(y * COLS + x) % n]) * 0.5);
          ctx.fillText(">", ox + x * cw + cw / 2, oy + y * ch + ch / 2);
        }
      }
    }

    for (let k = drifters.length - 1; k >= 0; k--) {
      const d = drifters[k];
      const age = now - d.born;
      const x = ox + (d.c + Math.floor(age / d.step)) * cw + cw / 2;
      if (age > d.life || x > w - cw / 2) { drifters.splice(k, 1); continue; }
      ctx.fillStyle = `rgba(110,160,240,${(0.7 * (1 - age / d.life)).toFixed(3)})`;
      ctx.fillText(">", x, oy + d.r * ch + ch / 2);
    }
  }

  function frame(now) {
    if (!running) return;
    raf = requestAnimationFrame(frame);
    if (now - last < 50) return; // ~20 fps keeps the footage-like stepping
    last = now;
    if (Math.random() < 0.3) spawnDrifter(now);
    render(now);
  }
  function start() {
    if (running || reduceMotion) return;
    running = true;
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  resize();
  window.addEventListener("resize", resize);
  new IntersectionObserver((entries) => entries.forEach((e) => (e.isIntersecting ? start() : stop()))).observe(canvas);

  return {
    // a brief flicker when the milestone changes
    pulse() {
      if (!reduceMotion) burstUntil = performance.now() + 260;
    },
    resize,
  };
}
