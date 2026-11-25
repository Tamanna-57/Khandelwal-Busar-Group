// Blue ">" glyph mosaic for the Our Story timeline.
// Each milestone has a shape (a grid of 0-9 intensities, generated from
// KBI product cut-outs and partner marks). Glyphs flicker, a few drift off
// the edges, and the mosaic scrambles into the next shape when the year changes.

const COLORS = {
  low: [38, 84, 168],    // deep KBI blue
  mid: [31, 95, 209],    // accent
  high: [150, 190, 255], // highlight
};

const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));

export function createGlyphArt(canvas, data, { reduceMotion = false } = {}) {
  const { cols, rows } = data;
  const shapes = Object.values(data.shapes).map((grid) => grid.map((row) => [...row].map(Number)));
  const ctx = canvas.getContext("2d");
  const n = cols * rows;

  // per-cell state
  const from = new Uint8Array(n);       // value shown before a switch
  const to = new Uint8Array(n);         // value after the switch
  const switchAt = new Float64Array(n); // time the cell flips to `to`
  const flick = new Float32Array(n);    // current flicker multiplier
  const flickNext = new Float64Array(n);
  for (let i = 0; i < n; i++) { flick[i] = 1; flickNext[i] = 0; }

  let shapeIndex = -1;
  let w = 0, h = 0, cw = 0, ch = 0, ox = 0, oy = 0, dpr = 1;
  let running = false;
  let raf = 0;
  let last = 0;
  const drifters = [];

  function load(index, now, instant) {
    const grid = shapes[index % shapes.length];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        const shown = now >= switchAt[i] ? to[i] : from[i];
        from[i] = shown;
        to[i] = grid[r][c];
        // sweep loosely left-to-right with plenty of randomness
        switchAt[i] = instant ? 0 : now + 80 + Math.random() * 520 + (c / cols) * 260;
      }
    }
    shapeIndex = index;
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(2, window.devicePixelRatio || 1);
    w = rect.width;
    h = rect.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cw = Math.min(w / cols, h / (rows * 1.15));
    ch = cw * 1.15;
    ox = (w - cw * cols) / 2;
    oy = (h - ch * rows) / 2;
    ctx.font = `700 ${Math.max(8, ch * 1.05)}px ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    draw(performance.now());
  }

  function isEdge(i, grid) {
    const r = Math.floor(i / cols), c = i % cols;
    return grid[r][c] > 0 && (c === cols - 1 || grid[r][c + 1] === 0);
  }

  function spawnDrifter(now) {
    if (drifters.length > 14 || shapeIndex < 0) return;
    const grid = shapes[shapeIndex];
    for (let tries = 0; tries < 30; tries++) {
      const i = Math.floor(Math.random() * n);
      if (now < switchAt[i] || !isEdge(i, grid)) continue;
      drifters.push({ r: Math.floor(i / cols), c: (i % cols) + 1, born: now, life: 900 + Math.random() * 1300, step: 140 + Math.random() * 120 });
      return;
    }
  }

  function glyphColor(v, f) {
    const t = Math.min(1, Math.max(0, (v - 3) / 6));
    let rgb = t < 0.6 ? mix(COLORS.low, COLORS.mid, t / 0.6) : mix(COLORS.mid, COLORS.high, (t - 0.6) / 0.4);
    if (f > 1.15) rgb = mix(rgb, COLORS.high, 0.6);
    const a = Math.min(1, (0.55 + t * 0.45) * f);
    return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a.toFixed(3)})`;
  }

  function draw(now) {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < n; i++) {
      const r = Math.floor(i / cols), c = i % cols;
      const x = ox + c * cw + cw / 2;
      const y = oy + r * ch + ch / 2;
      const dt = now - switchAt[i];
      let v, glyph = ">";
      if (dt < -110) v = from[i];
      else if (dt < 0) {
        // scramble just before the flip
        if (!from[i] && !to[i]) continue;
        v = 5 + Math.floor(Math.random() * 4);
        glyph = Math.random() < 0.5 ? ">" : "·";
      } else v = to[i];
      if (!v) continue;

      if (!reduceMotion && now > flickNext[i]) {
        const roll = Math.random();
        flick[i] = roll < 0.03 ? 1.35 : roll < 0.12 ? 0.45 : 0.82 + Math.random() * 0.22;
        flickNext[i] = now + 160 + Math.random() * 900;
      }
      ctx.fillStyle = glyphColor(v, reduceMotion ? 1 : flick[i]);
      ctx.fillText(glyph, x, y);
    }

    // drifting glyphs leaving the shape's right edge
    for (let k = drifters.length - 1; k >= 0; k--) {
      const d = drifters[k];
      const age = now - d.born;
      if (age > d.life) { drifters.splice(k, 1); continue; }
      const steps = Math.floor(age / d.step);
      const x = ox + (d.c + steps) * cw + cw / 2;
      if (x > w - cw / 2) { drifters.splice(k, 1); continue; }
      const y = oy + d.r * ch + ch / 2;
      ctx.fillStyle = `rgba(110,160,240,${(0.75 * (1 - age / d.life)).toFixed(3)})`;
      ctx.fillText(">", x, y);
    }
  }

  function frame(now) {
    if (!running) return;
    raf = requestAnimationFrame(frame);
    if (now - last < 33) return; // ~30 fps is plenty for a flicker
    last = now;
    if (Math.random() < 0.35) spawnDrifter(now);
    draw(now);
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

  load(0, 0, true);
  resize();
  window.addEventListener("resize", resize);
  const io = new IntersectionObserver((entries) => entries.forEach((e) => (e.isIntersecting ? start() : stop())));
  io.observe(canvas);

  return {
    setShape(index) {
      if (index === shapeIndex) return;
      load(index, performance.now(), reduceMotion);
      if (reduceMotion) draw(performance.now());
    },
    resize,
  };
}
