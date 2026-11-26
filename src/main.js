import "./style.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { about, firms, clients, milestones, heroMetrics } from "./data.js";
import glyphData from "./glyphs.json";
import { createGlyphArt } from "./glyphArt.js";
import { initHeroReveal } from "./heroReveal.js";

gsap.registerPlugin(ScrollTrigger);

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const pad2 = (i) => String(i).padStart(2, "0");

/* ------------------------------------------------------------
   Content
   ------------------------------------------------------------ */
$("#year").textContent = new Date().getFullYear();

$("#aboutTitle").textContent = about.title;
$("#aboutBody").innerHTML = about.body.map((p) => `<p>${p}</p>`).join("");
$("#aboutSinceLbl").textContent = about.sinceLabel;
$("#aboutSince").textContent = about.since;
$("#aboutImg").src = about.image;
$("#aboutImg").alt = about.imageAlt;

const logoItems = clients.map(([n, src]) => `<li><img src="${src}" alt="${n}" loading="lazy" /></li>`).join("");
// Two copies make the loop seamless; the second copy is hidden from screen readers.
$("#logos").innerHTML = reduceMotion
  ? logoItems
  : logoItems + logoItems.replaceAll("<li>", '<li aria-hidden="true">').replaceAll('alt="', 'alt="" data-alt="');

/* Companies: per company a full-screen wordmark panel, then a full-screen
   panel that tours captures of that company's own website */
const LOCK = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 7V5a3.5 3.5 0 0 1 7 0v2h.5a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h.5Zm1.5 0h4V5a2 2 0 1 0-4 0v2Z" fill="currentColor"/></svg>';
const pathText = (p) => (p === "/" ? "" : p);

$("#cosTrack").insertAdjacentHTML(
  "beforeend",
  firms
    .map((f, i) => {
      const { host, pages } = f.site;
      return `<article class="co" id="co-${f.id}" style="--co:${f.accent};--site-bg:${f.site.bg}" aria-labelledby="co-${f.id}-name">
      <div class="co__brand">
        <div class="co__brand-in">
          <p class="co__top"><span class="co__idx">${pad2(i + 1)}<small>/${pad2(firms.length)}</small></span><span class="co__cat">${f.category}</span></p>
          <p class="co__mark" aria-hidden="true" style="--fill:url('${f.image}')">${f.mark}</p>
          <div class="co__info">
            <div class="co__about">
              <div class="co__id">
                <img class="co__logo" src="${f.logo}" alt="" width="40" height="32" />
                <div><h3 class="co__name" id="co-${f.id}-name">${f.name}</h3><p class="co__meta">${f.meta}</p></div>
              </div>
              <p class="co__text">${f.tagline}</p>
            </div>
            <div class="co__figs">${f.figures.map(([v, l]) => `<div><b>${v}</b><span>${l}</span></div>`).join("")}</div>
          </div>
        </div>
      </div>
      <div class="co__site" role="group" aria-label="${f.name} website">
        <div class="site__inner">
          ${pages
            .map(
              (p, k) => `<div class="site__page${k === 0 ? " is-on" : ""}">
            ${p.video ? `<video muted loop playsinline preload="none" poster="${p.video.poster}" data-src="${p.video.src}" aria-hidden="true"></video>` : ""}
            <img alt="${f.name} website, ${p.label.toLowerCase()} page" decoding="async" />
          </div>`
            )
            .join("")}
        </div>
        <span class="site__shade" aria-hidden="true"></span>
        <span class="site__load" aria-hidden="true"></span>
        <div class="site__bar">
          <p class="site__addr">${LOCK}<b>${host}</b><span class="site__path">${pathText(pages[0].path)}</span></p>
          <div class="co__tabs" role="group" aria-label="${f.name} website pages">${pages
            .map((p, k) => `<button type="button" data-k="${k}"${k === 0 ? ' aria-current="true"' : ""}><span>${pad2(k + 1)}</span>${p.label}</button>`)
            .join("")}</div>
          <a class="co__visit" href="${f.url}" target="_blank" rel="noopener">Visit website<span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </article>`;
    })
    .join("")
);

/* Our story timeline */
const storyEl = $("#story");
storyEl.style.setProperty("--years", milestones.length);
$("#storyYears").insertAdjacentHTML(
  "beforeend",
  milestones
    .map((m, i) => `<button type="button" class="story__year" aria-controls="ms-${i}" ${i === 0 ? 'aria-current="step"' : ""} data-i="${i}">${m.year}</button>`)
    .join("")
);
$("#storyList").innerHTML = milestones
  .map(
    (m, i) => `<li class="story__item${i === 0 ? " is-active" : ""}" id="ms-${i}">
      <span class="story__dot" aria-hidden="true"></span>
      <p class="story__yr-sm">${m.year}</p>
      <h3 class="story__h">${m.title}</h3>
      <ul class="story__pts">${m.points.map((pt) => `<li>${pt}</li>`).join("")}</ul>
      ${m.tags?.length ? `<ul class="story__tags">${m.tags.map((t) => `<li>${t}</li>`).join("")}</ul>` : ""}
    </li>`
  )
  .join("");

/* Hero: scroll reveal through the KBI mark */
initHeroReveal({ hero: $(".hero"), metrics: heroMetrics, reduceMotion });

/* ------------------------------------------------------------
   Header: transparent over the hero, pill nav afterwards,
   logo colour follows the section underneath
   ------------------------------------------------------------ */
const hdr = $("#hdr");
const hero = $(".hero");
const surfaces = $$("main [data-surface], footer[data-surface]");
const navLinks = $$(".nav__link");
const ind = $(".nav__ind");
const sectionIds = navLinks.map((a) => a.getAttribute("href").slice(1));

function placeIndicator(link) {
  if (!link) return ind.classList.remove("is-on");
  // offset* ignores the pill's pop-in scale, so the highlight lands exactly on the link
  ind.style.setProperty("--ind-x", `${link.offsetLeft}px`);
  ind.style.setProperty("--ind-w", `${link.offsetWidth}px`);
  ind.classList.add("is-on");
}

let inContent = false;
let activeId = null;
function updateHeader() {
  const probe = hdr.offsetHeight / 2;

  const nowContent = hero.getBoundingClientRect().bottom <= hdr.offsetHeight;
  if (nowContent !== inContent) {
    inContent = nowContent;
    hdr.classList.toggle("is-content", inContent);
    if (inContent && !reduceMotion) {
      hdr.classList.remove("is-popping");
      void hdr.offsetWidth;
      hdr.classList.add("is-popping");
    }
  }

  // later sections can sit on top of earlier ones, so check from the bottom of the page up
  const under = [...surfaces].reverse().find((el) => {
    const r = el.getBoundingClientRect();
    return r.top <= probe && r.bottom > probe;
  });
  hdr.dataset.surface = under?.dataset.surface || "dark";

  let id = null;
  for (const sid of sectionIds) {
    const el = document.getElementById(sid);
    if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.45) id = sid;
  }
  if (!inContent) id = null;
  if (id !== activeId) {
    activeId = id;
    navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + id));
    placeIndicator(navLinks.find((a) => a.getAttribute("href") === "#" + id));
  }
}
hdr.addEventListener("animationend", () => hdr.classList.remove("is-popping"));
window.addEventListener("scroll", updateHeader, { passive: true });
window.addEventListener("resize", () => { activeId = undefined; updateHeader(); });
updateHeader();

const menuBtn = $(".hdr__menu");
const drawer = $("#drawer");
const setDrawer = (open) => {
  drawer.hidden = !open;
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
};
menuBtn.addEventListener("click", () => setDrawer(drawer.hidden));
$$("#drawer a").forEach((a) => a.addEventListener("click", () => setDrawer(false)));
window.addEventListener("keydown", (e) => e.key === "Escape" && setDrawer(false));

/* ------------------------------------------------------------
   Companies: full-screen horizontal scroll (after tehtariknation.com)
   The section pins and scrolling down slides a row of full-screen
   panels sideways: the intro, then for each company a giant
   wordmark and its website. Each website panel stops, scrolls down
   captures of that site and changes page as if a link had been
   clicked, before the row moves on. After the last company the
   Our Story timeline slides up over the section.
   Landscape screens get the desktop captures, portrait screens the
   phone ones.
   Reduced motion: a plain swipeable row; the page buttons switch
   pages and each website scrolls by hand.
   ------------------------------------------------------------ */
const cos = $(".cos");
const story = $("#story");
const stage = $(".cos__stage");
const cosTrack = $("#cosTrack");
const dim = $(".cos__dim");
const progressBar = $("#cosProgress");
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const CAPTURE_W = { d: 1440, m: 390 }; // window widths the captures were taken at
const portrait = window.matchMedia("(max-aspect-ratio: 1/1)");
const pct = (v) => `${(v * 100).toFixed(4)}%`;

const cosFirms = $$(".co", cosTrack).map((el, i) => ({
  el,
  brand: $(".co__brand", el),
  mark: $(".co__mark", el),
  site: $(".co__site", el),
  inner: $(".site__inner", el),
  shade: $(".site__shade", el),
  path: $(".site__path", el),
  load: $(".site__load", el),
  tabs: $$(".co__tabs button", el),
  pages: $$(".site__page", el).map((pg, k) => ({ el: pg, img: $("img", pg), video: $("video", pg), spec: firms[i].site.pages[k], v: null, max: 0 })),
  shown: 0,
  brandC: 0,
  siteC: 0,
}));

// Point every page at the desktop or phone capture; images load once the section is close.
let variant = "d";
let mediaOn = false;
function applyVariant() {
  variant = portrait.matches ? "m" : "d";
  const W = CAPTURE_W[variant];
  cosFirms.forEach((f) =>
    f.pages.forEach((p) => {
      p.v = p.spec[variant];
      p.img.width = W;
      p.img.height = p.v.h;
      if (mediaOn && !p.img.src.endsWith(p.v.img)) p.img.src = p.v.img;
      if (p.video) {
        const r = p.v.video;
        Object.assign(p.video.style, { left: pct(r.x / W), top: pct(r.y / p.v.h), width: pct(r.w / W), height: pct(r.h / p.v.h) });
      }
    })
  );
}
applyVariant();
portrait.addEventListener("change", () => { applyVariant(); ScrollTrigger.refresh(); });

const mediaIO = new IntersectionObserver(
  (entries) => {
    if (!entries.some((e) => e.isIntersecting)) return;
    mediaOn = true;
    applyVariant();
    mediaIO.disconnect();
  },
  { rootMargin: "150% 0px" }
);
mediaIO.observe(cos);

function setVideo(v, on) {
  if (on && v.dataset.src) { v.src = v.dataset.src; delete v.dataset.src; }
  if (on && v.paused) v.play().catch(() => {});
  else if (!on && !v.paused) v.pause();
}

function markPage(f, cur) {
  if (cur === f.shown) return;
  f.shown = cur;
  f.path.textContent = pathText(f.pages[cur].spec.path);
  f.tabs.forEach((t, k) => (k === cur ? t.setAttribute("aria-current", "true") : t.removeAttribute("aria-current")));
}

// pos: page index (fractional while changing page); ys: how far down each page is, 0..1
function showPage(f, pos, ys) {
  f.pages.forEach((p, k) => {
    // like following a link: the old page goes, a beat of empty window, then the new one
    const d = pos - k;
    const o = d >= 0 ? clamp01(1 - d / 0.45) : clamp01((1 + d - 0.55) / 0.45);
    p.el.style.opacity = o.toFixed(3);
    p.el.style.visibility = o > 0 ? "visible" : "hidden";
    p.el.style.transform = `translate3d(0, ${((-ys[k] * p.max) / p.v.h * 100).toFixed(3)}%, 0)`;
  });
  markPage(f, Math.round(pos));
  const frac = pos - Math.floor(pos);
  f.load.style.transform = `scaleX(${frac.toFixed(3)})`;
  f.load.style.opacity = frac > 0.001 && frac < 0.999 ? "1" : "0";
}

let goToPage = () => {};
cosFirms.forEach((f, i) => f.tabs.forEach((t) => t.addEventListener("click", () => goToPage(i, Number(t.dataset.k)))));

const mm = gsap.matchMedia();
mm.add("(prefers-reduced-motion: no-preference)", () => {
  cos.classList.add("is-pinned");
  const cover = () => cos.offsetHeight; // scroll spent while the timeline slides over
  const setOverlap = () => { story.style.marginTop = `-${cover()}px`; };
  setOverlap();

  // mostly linear so the row follows the wheel, softened into each stop
  const ease = (t) => t * 0.45 + t * t * (3 - 2 * t) * 0.55;
  let plan = { segs: [], total: 1, pageAt: [] };

  // Lay the scroll out as a run of segments: slide to the wordmark, hold, slide to
  // the website, scroll each page (changing page in between), hold.
  function measure() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const minX = Math.min(0, vw - cosTrack.scrollWidth);
    const stop = (c) => Math.min(0, Math.max(minX, vw / 2 - c));
    const segs = [];
    const pageAt = [];
    let at = 0, x = 0;
    const push = (seg) => { seg.start = at; at += seg.len; segs.push(seg); };
    const slide = (to) => { push({ type: "h", from: x, to, len: Math.abs(to - x) * 0.65 + 1 }); x = to; };
    const W = CAPTURE_W[variant];

    cosFirms.forEach((f, i) => {
      f.brandC = f.brand.offsetLeft + f.brand.offsetWidth / 2;
      f.siteC = f.site.offsetLeft + f.site.offsetWidth / 2;
      slide(stop(f.brandC));
      push({ type: "hold", len: vh * 0.15 });
      slide(stop(f.siteC));

      const viewW = f.site.clientWidth || 1;
      const visible = (W * f.site.clientHeight) / viewW; // capture px that fit on screen
      const scale = viewW / W;
      pageAt[i] = [];
      f.pages.forEach((p, k) => {
        p.max = Math.max(0, Math.min(p.v.scroll, p.v.h - visible));
        if (k > 0) push({ type: "nav", i, from: k - 1, len: vh * 0.3 });
        pageAt[i][k] = at;
        push({ type: "scroll", i, k, len: Math.max(1, p.max * scale * 0.5) });
      });
      push({ type: "hold", len: vh * 0.1 });
    });
    plan = { segs, total: at, pageAt };
  }

  const state = cosFirms.map((f) => ({ pos: 0, ys: f.pages.map(() => 0) }));

  function render(offset) {
    let x = 0;
    state.forEach((s) => { s.pos = 0; s.ys.fill(0); });
    for (const seg of plan.segs) {
      if (offset <= seg.start) break;
      const t = clamp01((offset - seg.start) / seg.len);
      if (seg.type === "h") x = seg.from + (seg.to - seg.from) * ease(t);
      else if (seg.type === "nav") state[seg.i].pos = seg.from + t;
      else if (seg.type === "scroll") state[seg.i].ys[seg.k] = t;
    }
    cosTrack.style.transform = `translate3d(${x.toFixed(1)}px, 0, 0)`;

    const vw = window.innerWidth;
    cosFirms.forEach((f, i) => {
      // the wordmark drifts against the row and its photo fill pans
      const d = Math.max(-1.5, Math.min(1.5, (f.brandC + x - vw / 2) / vw));
      f.mark.style.transform = `translate3d(${(-d * vw * 0.12).toFixed(1)}px, 0, 0)`;
      f.mark.style.backgroundPosition = `${(50 + d * 40).toFixed(2)}% 50%`;
      // the website lags behind its panel as it slides (parallax) and is shaded until it arrives
      const ds = Math.max(-1, Math.min(1, (f.siteC + x - vw / 2) / vw));
      f.inner.style.transform = `translate3d(${(-ds * vw * 0.35).toFixed(1)}px, 0, 0)`;
      f.shade.style.opacity = (Math.abs(ds) * 0.6).toFixed(3);
      showPage(f, state[i].pos, state[i].ys);
      f.pages.forEach((p, k) => p.video && setVideo(p.video, Math.abs(ds) < 0.6 && Math.abs(state[i].pos - k) < 1));
    });

    progressBar.style.transform = `scaleX(${clamp01(offset / plan.total).toFixed(4)})`;
    const p2 = clamp01((offset - plan.total) / cover());
    dim.style.opacity = (p2 * 0.65).toFixed(3);
    stage.style.transform = p2 > 0 ? `translate3d(0, ${(-p2 * 30).toFixed(1)}px, 0) scale(${(1 - p2 * 0.05).toFixed(4)})` : "";
  }

  const st = ScrollTrigger.create({
    trigger: cos,
    start: "top top",
    end: () => { measure(); return "+=" + (plan.total + cover()); },
    pin: true,
    invalidateOnRefresh: true,
    onRefreshInit: setOverlap,
    onRefresh: (self) => render(self.scroll() - self.start),
    onUpdate: (self) => render(self.scroll() - self.start),
  });
  render(st.scroll() - st.start);

  goToPage = (i, k) => window.scrollTo({ top: st.start + plan.pageAt[i][k] + 2, behavior: "smooth" });

  return () => {
    cos.classList.remove("is-pinned");
    story.style.marginTop = "";
    cosTrack.style.transform = stage.style.transform = progressBar.style.transform = "";
    dim.style.opacity = 0;
    cosFirms.forEach((f) => {
      f.mark.style.transform = f.mark.style.backgroundPosition = f.inner.style.transform = "";
      f.shade.style.opacity = 0;
      f.pages.forEach((p) => {
        p.el.style.opacity = p.el.style.visibility = p.el.style.transform = "";
        if (p.video) setVideo(p.video, false);
      });
    });
    goToPage = () => {};
  };
});

mm.add("(prefers-reduced-motion: reduce)", () => {
  const show = (f, k) => {
    f.pages.forEach((p, j) => p.el.classList.toggle("is-on", j === k));
    f.inner.scrollTop = 0;
    markPage(f, k);
  };
  cosFirms.forEach((f) => show(f, 0));
  goToPage = (i, k) => show(cosFirms[i], k);
  return () => {
    cosFirms.forEach((f) => f.pages.forEach((p, j) => p.el.classList.toggle("is-on", j === 0)));
    goToPage = () => {};
  };
});

$$('a[href="#companies"]').forEach((a) =>
  a.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: cos.getBoundingClientRect().top + window.scrollY + 2, behavior: "smooth" });
  })
);

/* ------------------------------------------------------------
   Our story: the section holds while you scroll; the active
   year grows on the left and its milestone fades in on the right
   ------------------------------------------------------------ */
const track = $("#storyTrack");
const years = $$(".story__year");
const items = $$(".story__item");
const bar = $("#storyBar");
const nYears = milestones.length;
const lerp = (a, b, t) => a + (b - a) * t;
let activeYear = 0;
const art = createGlyphArt($("#storyArt"), glyphData, { reduceMotion });

function yearStyle(d) {
  // as in the reference: 4.5rem active, 2.75rem neighbours, 1.5rem the rest
  if (d < 1) return { size: lerp(4.5, 2.75, d), op: lerp(1, 0.825, d), x: lerp(1.25, 0.52, d) };
  if (d < 2) return { size: lerp(2.75, 1.5, d - 1), op: lerp(0.825, 0.7, d - 1), x: lerp(0.52, 0, d - 1) };
  return { size: 1.5, op: 0.7, x: 0 };
}

const storyMQ = window.matchMedia("(min-width: 901px) and (prefers-reduced-motion: no-preference)");

function updateStory() {
  if (!storyMQ.matches) return;
  const r = track.getBoundingClientRect();
  const span = track.offsetHeight - window.innerHeight;
  const prog = Math.min(1, Math.max(0, -r.top / Math.max(1, span)));
  const pos = prog * (nYears - 1);
  years.forEach((y, i) => {
    const st = yearStyle(Math.abs(i - pos));
    y.style.fontSize = `${st.size}rem`;
    y.style.opacity = st.op.toFixed(3);
    y.style.transform = `translateX(${st.x}rem)`;
  });
  bar.style.setProperty("--bar", pos.toFixed(4));
  const idx = Math.round(pos);
  if (idx !== activeYear) {
    activeYear = idx;
    items.forEach((it, i) => it.classList.toggle("is-active", i === idx));
    art.setShape(idx);
    years.forEach((y, i) => (i === idx ? y.setAttribute("aria-current", "step") : y.removeAttribute("aria-current")));
  }
}
years.forEach((y) =>
  y.addEventListener("click", () => {
    const i = Number(y.dataset.i);
    const span = track.offsetHeight - window.innerHeight;
    const top = track.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + span * (i / (nYears - 1)) + 1, behavior: "smooth" });
  })
);
window.addEventListener("scroll", updateStory, { passive: true });
window.addEventListener("resize", updateStory);
updateStory();

/* ------------------------------------------------------------
   Small touches
   ------------------------------------------------------------ */
if (!reduceMotion) {
  gsap.fromTo("#aboutImg", { yPercent: -4, scale: 1.08 }, {
    yPercent: 4, scale: 1.08, ease: "none",
    scrollTrigger: { trigger: ".about", start: "top bottom", end: "bottom top", scrub: true },
  });
} else {
  $(".hero__video").pause();
}

window.addEventListener("load", () => { ScrollTrigger.refresh(); updateHeader(); });
// Once Bebas Neue is in, measure each wordmark (in em) so CSS can fit long names to
// the screen, then re-measure the track: the wordmarks set where every stop falls.
const fitMarks = () => {
  const ctx = document.createElement("canvas").getContext("2d");
  ctx.font = '400 100px "Bebas Neue"';
  cosFirms.forEach((f) => {
    const t = f.mark.textContent;
    f.mark.style.setProperty("--mark-em", (ctx.measureText(t).width / 100 + t.length * 0.01).toFixed(3));
  });
};
fitMarks();
(document.fonts ? document.fonts.load('400 100px "Bebas Neue"') : Promise.resolve())
  .catch(() => {})
  .then(() => { fitMarks(); ScrollTrigger.refresh(); });
