/* ------------------------------------------------------------
   Hero reveal, built to the citadelgroup.org hero.

   The hero is three screens tall and its stage stays pinned.
   While you scroll:
     1. a navy plane with a hole in the shape of India sits
        over the video; the hole starts far larger than the screen,
        so navy only creeps in from the edges, then it shrinks to
        nothing (the plane is tilted back slightly, as on Citadel);
     2. the opening headline drifts up and fades;
     3. the closing line types in letter by letter, tied to scroll;
     4. once the screen is solid navy, a field of steel blocks rises
        behind the text and the figures count up from zero.
   ------------------------------------------------------------ */

import { INDIA_PATH } from "./indiaPath.js";

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const range = (q, a, b) => clamp01((q - a) / (b - a));
const easeOutExpo = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

// India outline in its own units (see the <g class="hero__hole"> path)
// The zoom starts centred on central India (so navy creeps in evenly from the
// edges) and drifts to the map's own centre as it shrinks.
const MARK = { cx: 306, cy: 334, w: 612, h: 668, fx: 235, fy: 330 };

export function initHeroReveal({ hero, metrics, reduceMotion }) {
  const pin = hero.querySelector(".hero__pin");
  const body = hero.querySelector(".hero__body");
  // navy plane on a canvas: Safari re-rasterises an SVG mask on every frame, a canvas
  // is redrawn only when the hole changes and the tilt stays on the compositor
  const plane = hero.querySelector(".hero__plane");
  const pctx = plane.getContext("2d");
  const india = new Path2D(INDIA_PATH);
  const navy = getComputedStyle(hero).getPropertyValue("--navy").trim() || "#0d1a3a";
  let pScale = 1;
  let lastHole = "";
  const video = hero.querySelector(".hero__video");
  const pauseBtn = hero.querySelector(".hero__pause");
  let userPaused = reduceMotion;
  const finalEl = hero.querySelector(".hero__final");
  const textEl = hero.querySelector("#heroFinalText");
  const metricsEl = hero.querySelector("#heroMetrics");
  const blocks = createBlocks(hero.querySelector(".hero__blocks"));

  // split the closing line into letters (screen readers get the aria-label)
  const letters = [];
  textEl.querySelectorAll(".hero__final-line").forEach((line) => {
    const chars = [...line.textContent];
    line.textContent = "";
    line.setAttribute("aria-hidden", "true");
    chars.forEach((ch) => {
      const s = document.createElement("span");
      s.className = "hero__letter";
      s.textContent = ch === " " ? " " : ch;
      line.appendChild(s);
      letters.push(s);
    });
  });

  metricsEl.innerHTML = metrics
    .map(
      (m) => `<div class="hero__metric">
        <p class="hero__metric-value"><span data-to="${m.value}">0</span>${m.suffix ? `<sup>${m.suffix}</sup>` : ""}</p>
        <p class="hero__metric-label">${m.label}</p>
      </div>`
    )
    .join("");
  const counters = [...metricsEl.querySelectorAll("[data-to]")];

  let W = 0, H = 0, PW = 0, PH = 0;
  function size() {
    W = pin.clientWidth;
    H = pin.clientHeight;
    // the plane is drawn larger than the screen so its edges never show while tilted
    PW = Math.round(W * 1.5);
    PH = Math.round(H * 1.5);
    // keep the bitmap to a few megapixels: the hole edge stays crisp, the redraw stays cheap
    pScale = Math.min(window.devicePixelRatio || 1, 1.5, Math.sqrt(4.5e6 / (PW * PH)));
    plane.width = Math.round(PW * pScale);
    plane.height = Math.round(PH * pScale);
    plane.style.width = `${PW}px`;
    plane.style.height = `${PH}px`;
    lastHole = "";
    blocks.resize(W, H);
  }

  let shown = -1;
  let closed = false;
  let countRaf = 0;

  function countUp() {
    cancelAnimationFrame(countRaf);
    if (reduceMotion) {
      counters.forEach((c) => (c.textContent = c.dataset.to));
      return;
    }
    const t0 = performance.now();
    const tick = (now) => {
      const t = easeOutExpo(clamp01((now - t0) / 1800));
      counters.forEach((c) => (c.textContent = Math.round(Number(c.dataset.to) * t)));
      if (t < 1) countRaf = requestAnimationFrame(tick);
    };
    countRaf = requestAnimationFrame(tick);
  }

  function update() {
    const span = Math.max(1, hero.offsetHeight - H);
    const q = clamp01(-hero.getBoundingClientRect().top / span);

    // 1. opening copy drifts up, then fades as the navy closes in
    body.style.transform = `translateY(${(-26 * q).toFixed(1)}px)`;
    body.style.opacity = (1 - range(q, 0.46, 0.6)).toFixed(3);

    // 2. the India-shaped window: about 3.4x the screen width, shrinking to nothing
    const t = reduceMotion ? (q < 0.5 ? 0 : 1) : range(q, 0.2, 0.8);
    // sized off whichever screen side the map would hit first, so phones behave like desktop
    const holeW = Math.max(W, (H * MARK.w) / MARK.h) * 3.4 * (1 - t);
    const s = holeW / MARK.w;
    const ox = MARK.fx + (MARK.cx - MARK.fx) * t;
    const oy = MARK.fy + (MARK.cy - MARK.fy) * t;
    drawPlane(t, s, ox, oy);
    plane.style.visibility = t > 0 ? "visible" : "hidden";
    // the video is hidden once the screen is navy: stop decoding it
    syncVideo(t < 1 && hero.getBoundingClientRect().bottom > 0);
    const tilt = 15 * (1 - range(q, 0.74, 0.84));
    plane.style.transform = `translate(-50%, -50%) perspective(1400px) rotateX(${tilt.toFixed(2)}deg)`;

    // 3. closing line types in with the scroll
    const n = reduceMotion ? (q > 0.5 ? letters.length : 0) : Math.round(range(q, 0.58, 0.76) * letters.length);
    if (n !== shown) {
      letters.forEach((l, i) => l.classList.toggle("is-on", i < n));
      shown = n;
    }
    finalEl.style.visibility = q > 0.5 ? "visible" : "hidden";
    finalEl.style.transform = `translateY(${(10 * (1 - easeOutCubic(range(q, 0.58, 0.74)))).toFixed(1)}px)`;

    // 4. solid navy: blocks rise and the figures count up (reset if you scroll back)
    const nowClosed = t >= 1;
    if (nowClosed && !closed) {
      closed = true;
      hero.classList.add("is-closed");
      blocks.rise(reduceMotion);
      countUp();
    } else if (!nowClosed && closed && q < 0.6) {
      closed = false;
      hero.classList.remove("is-closed");
      blocks.reset();
      cancelAnimationFrame(countRaf);
      counters.forEach((c) => (c.textContent = "0"));
    }
  }

  function drawPlane(t, s, ox, oy) {
    if (t <= 0) return;
    const key = t >= 1 ? "solid" : `${s.toFixed(4)}|${ox.toFixed(1)}|${oy.toFixed(1)}`;
    if (key === lastHole) return;
    lastHole = key;
    pctx.setTransform(1, 0, 0, 1, 0, 0);
    pctx.globalCompositeOperation = "source-over";
    pctx.fillStyle = navy;
    pctx.fillRect(0, 0, plane.width, plane.height);
    if (t >= 1 || s <= 0) return;
    pctx.globalCompositeOperation = "destination-out";
    pctx.setTransform(pScale * s, 0, 0, pScale * s, pScale * (PW / 2 - ox * s), pScale * (PH / 2 - oy * s));
    pctx.fill(india);
    pctx.globalCompositeOperation = "source-over";
  }

  function syncVideo(visible) {
    const want = visible && !userPaused && !document.hidden;
    if (want && video.paused) video.play().catch(() => {});
    else if (!want && !video.paused) video.pause();
  }
  pauseBtn.setAttribute("aria-pressed", String(userPaused));
  pauseBtn.querySelector(".sr-only").textContent = userPaused ? "Play background video" : "Pause background video";
  pauseBtn.addEventListener("click", () => {
    userPaused = !userPaused;
    pauseBtn.setAttribute("aria-pressed", String(userPaused));
    pauseBtn.querySelector(".sr-only").textContent = userPaused ? "Play background video" : "Pause background video";
    update();
  });
  document.addEventListener("visibilitychange", () => update());
  if (reduceMotion) video.removeAttribute("autoplay");

  let raf = 0;
  const onScroll = () => {
    if (raf) return;
    raf = requestAnimationFrame(() => { raf = 0; update(); });
  };
  size();
  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  let resizeT = 0;
  window.addEventListener("resize", () => { clearTimeout(resizeT); resizeT = setTimeout(() => { size(); update(); }, 120); });
}

/* ------------------------------------------------------------
   Steel blocks: an isometric field of navy blocks that rise from
   the centre outward (KBI's take on Citadel's orange columns).
   Drawn once per rise, then left still.
   ------------------------------------------------------------ */
function createBlocks(canvas) {
  const ctx = canvas.getContext("2d");
  let W = 0, H = 0, cells = [], cell = 40, raf = 0;

  // stable pseudo-random heights
  const rnd = (i, j) => {
    const x = Math.sin(i * 127.1 + j * 311.7) * 43758.5453;
    return x - Math.floor(x);
  };

  function resize(w, h) {
    W = w; H = h;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cell = Math.max(26, Math.min(44, W / 34));
    build();
    draw(current);
  }

  function build() {
    cells = [];
    const hw = cell, hh = cell / 2;
    const n = Math.ceil((W / hw + H / hh) / 2) + 4;
    for (let s = 0; s <= 2 * n; s++) {
      for (let i = 0; i <= s; i++) {
        const j = s - i;
        const x = W / 2 + (i - j) * hw;
        const y = -H * 0.35 + (i + j) * hh;
        if (x < -hw * 2 || x > W + hw * 2 || y < -cell * 3 || y > H + cell * 4) continue;
        const r = rnd(i, j);
        const h = cell * (0.25 + Math.pow(r, 1.6) * 2.4);
        const dist = Math.hypot((x - W / 2) / W, (y - H * 0.75) / H);
        cells.push({ x, y, h, delay: dist * 0.9 + r * 0.25 });
      }
    }
  }

  let current = 0;
  function draw(p) {
    current = p;
    ctx.clearRect(0, 0, W, H);
    if (p <= 0) return;
    const hw = cell, hh = cell / 2;
    for (const c of cells) {
      const k = easeOutCubic(clamp01((p * 2.2 - c.delay) / 0.8));
      if (k <= 0) continue;
      const h = c.h * k;
      const { x, y } = c;
      // left face
      ctx.fillStyle = "#0f1f47";
      ctx.beginPath();
      ctx.moveTo(x - hw, y); ctx.lineTo(x, y + hh); ctx.lineTo(x, y + hh - h); ctx.lineTo(x - hw, y - h);
      ctx.fill();
      // right face
      ctx.fillStyle = "#0b1735";
      ctx.beginPath();
      ctx.moveTo(x + hw, y); ctx.lineTo(x, y + hh); ctx.lineTo(x, y + hh - h); ctx.lineTo(x + hw, y - h);
      ctx.fill();
      // top face
      ctx.fillStyle = "#14295c";
      ctx.beginPath();
      ctx.moveTo(x, y - hh - h); ctx.lineTo(x + hw, y - h); ctx.lineTo(x, y + hh - h); ctx.lineTo(x - hw, y - h);
      ctx.fill();
    }
  }

  function rise(instant) {
    cancelAnimationFrame(raf);
    if (instant) return draw(1);
    const t0 = performance.now();
    const tick = (now) => {
      const p = clamp01((now - t0) / 2200);
      draw(p);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  }

  function reset() {
    cancelAnimationFrame(raf);
    draw(0);
  }

  return { resize, rise, reset };
}
