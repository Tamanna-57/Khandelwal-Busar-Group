import "./style.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { about, firms, clients, milestones, heroMetrics, leaders } from "./data.js";
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
$("#aboutImg").srcset = `${about.image.replace(".webp", "-800.webp")} 800w, ${about.image} 1600w`;
$("#aboutImg").sizes = "(max-width: 900px) 100vw, 50vw";
$("#aboutImg").decoding = "async";
$("#aboutImg").alt = about.imageAlt;

const logoItems = clients.map(([n, src]) => `<li><img src="${src}" alt="${n}" loading="lazy" decoding="async" /></li>`).join("");
// Two copies make the loop seamless; the second copy is hidden from screen readers.
$("#logos").innerHTML = reduceMotion
  ? logoItems
  : logoItems + logoItems.replaceAll("<li>", '<li aria-hidden="true">').replaceAll('alt="', 'alt="" data-alt="');

const marqueePause = $(".marquee__pause");
if (reduceMotion) marqueePause.hidden = true;
marqueePause.addEventListener("click", () => {
  const paused = marqueePause.getAttribute("aria-pressed") !== "true";
  marqueePause.setAttribute("aria-pressed", String(paused));
  marqueePause.textContent = paused ? "Play logos" : "Pause logos";
  $(".marquee").classList.toggle("is-paused", paused);
});

/* Companies: one full-screen panel per company with its wordmark, details and figures */
const hexA = (hex, a) => `rgba(${hex.match(/\w\w/g).map((h) => parseInt(h, 16)).join(", ")}, ${a})`;

$("#cosTrack").innerHTML = firms
  .map(
    (f, i) => `<article class="co" id="co-${f.id}" style="--co:${f.accent};--glow:${hexA(f.accent, 0.42)};--tint-a:${f.tint[0]};--tint-b:${f.tint[1]};--fill:url('${f.image}');--fill-sm:url('${f.image.replace(".webp", "-800.webp")}')" aria-labelledby="co-${f.id}-name">
      <div class="co__bg" aria-hidden="true"><i class="co__photo"></i><i class="co__glow"></i><i class="co__grid"></i></div>
      <div class="co__in">
        <p class="co__top"><span class="co__eyebrow">Our companies</span><span class="co__idx">${pad2(i + 1)}<small>/${pad2(firms.length)}</small></span><span class="co__cat">${f.category}</span></p>
        <p class="co__mark" aria-hidden="true">${f.mark}</p>
        <div class="co__info">
          <div class="co__about">
            <div class="co__id">
              <img class="co__logo" src="${f.logo}" alt="" width="40" height="32" />
              <div><h3 class="co__name" id="co-${f.id}-name">${f.name}</h3><p class="co__meta">${f.meta}</p></div>
            </div>
            <p class="co__text">${f.tagline}</p>
            <a class="co__visit" href="${f.url}" target="_blank" rel="noopener">Visit website<span aria-hidden="true">↗</span><span class="sr-only"> for ${f.name} (opens in a new tab)</span></a>
          </div>
          <dl class="co__figs">${f.figures
            .map(([v, l], k) => `<div class="co__fig" style="--k:${k}"><dt>${l}</dt><dd>${v}</dd></div>`)
            .join("")}</dl>
        </div>
      </div>
    </article>`
  )
  .join("");

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
let hdrRaf = 0;
window.addEventListener("scroll", () => { if (!hdrRaf) hdrRaf = requestAnimationFrame(() => { hdrRaf = 0; updateHeader(); }); }, { passive: true });
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
   The section pins and scrolling down slides three full-screen
   panels sideways, pausing on each company. Each wordmark drifts
   against its panel and the figures rise in as a panel settles.
   After the last company the Our Story timeline slides up over
   the section.
   Reduced motion: a plain swipeable row.
   ------------------------------------------------------------ */
const cos = $(".cos");
const story = $("#story");
const stage = $(".cos__stage");
const cosTrack = $("#cosTrack");
const dim = $(".cos__dim");
const progressBar = $("#cosProgress");
const clamp01 = (v) => Math.min(1, Math.max(0, v));

const cosFirms = $$(".co", cosTrack).map((el) => ({ el, mark: $(".co__mark", el), photo: $(".co__photo", el), c: 0 }));

const mm = gsap.matchMedia();
mm.add("(prefers-reduced-motion: no-preference)", () => {
  cos.classList.add("is-pinned");
  const cover = () => cos.offsetHeight; // scroll spent while the timeline slides over
  const setOverlap = () => { story.style.marginTop = `-${cover()}px`; };
  setOverlap();

  // mostly linear so the row follows the wheel, softened into each stop
  const ease = (t) => t * 0.45 + t * t * (3 - 2 * t) * 0.55;
  let plan = { segs: [], total: 1 };

  // a pause on each company, with a slide between them
  function measure() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const segs = [];
    let at = 0, x = 0;
    const push = (seg) => { seg.start = at; at += seg.len; segs.push(seg); };
    cosFirms.forEach((f, i) => {
      f.c = f.el.offsetLeft + f.el.offsetWidth / 2;
      const to = vw / 2 - f.c;
      if (i > 0) push({ type: "h", from: x, to, len: Math.abs(to - x) * 0.75 + 1 });
      x = to;
      // the last company holds longer so it is fully read before Our Story slides over it
      push({ type: "hold", len: vh * (i === cosFirms.length - 1 ? 0.9 : 0.35) });
    });
    plan = { segs, total: at };
  }

  function render(offset) {
    let x = 0;
    for (const seg of plan.segs) {
      if (offset <= seg.start) break;
      if (seg.type === "h") x = seg.from + (seg.to - seg.from) * ease(clamp01((offset - seg.start) / seg.len));
    }
    const vw = window.innerWidth;
    const inView = cos.getBoundingClientRect().top < window.innerHeight * 0.5;
    cosTrack.style.transform = `translate3d(${x.toFixed(1)}px, 0, 0)`;
    cosFirms.forEach((f) => {
      // the wordmark drifts against its panel, its photo fill pans and the backdrop photo lags
      const d = Math.max(-1.5, Math.min(1.5, (f.c + x - vw / 2) / vw));
      // entering panels: the first letter only peeks a little past the panel edge (about 3vw);
      // leaving panels drift gently the other way, hidden under the next panel
      const shift = d > 0 ? -Math.min(d * 0.14, 0.09) * vw : -d * vw * 0.12;
      f.mark.style.transform = `translate3d(${shift.toFixed(1)}px, 0, 0)`;
      f.photo.style.transform = `translate3d(${(-d * vw * 0.18).toFixed(1)}px, 0, 0)`;
      f.el.classList.toggle("is-in", inView && Math.abs(d) < 0.3);
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

  // keyboard users: focusing a link inside a panel brings that panel on screen
  const onFocus = (e) => {
    const i = cosFirms.findIndex((f) => f.el.contains(e.target));
    if (i < 0) return;
    let at = 0, hold = 0;
    for (const seg of plan.segs) { if (seg.type === "hold" && hold++ === i) { at = seg.start + seg.len / 2; break; } }
    // focusing can scroll the clipped containers sideways; undo that, the row is moved by transform
    [cos, cos.querySelector(".cos__pin"), stage].forEach((el) => el && (el.scrollLeft = 0));
    window.scrollTo({ top: st.start + at, behavior: "auto" });
  };
  cosTrack.addEventListener("focusin", onFocus);

  return () => {
    cosTrack.removeEventListener("focusin", onFocus);
    cos.classList.remove("is-pinned");
    story.style.marginTop = "";
    cosTrack.style.transform = stage.style.transform = progressBar.style.transform = "";
    dim.style.opacity = 0;
    cosFirms.forEach((f) => {
      f.mark.style.transform = f.photo.style.transform = "";
      f.el.classList.remove("is-in");
    });
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
let storyRaf = 0;
window.addEventListener("scroll", () => { if (!storyRaf) storyRaf = requestAnimationFrame(() => { storyRaf = 0; updateStory(); }); }, { passive: true });
window.addEventListener("resize", updateStory);
updateStory();

/* ------------------------------------------------------------
   Leadership grid + profile panel (after citadelgroup.org)
   ------------------------------------------------------------ */
$("#leadGrid").innerHTML = leaders
  .map(
    (m, i) => `<li class="lead__card">
      <div class="lead__img"><img src="${m.image}" alt="${m.name}" width="480" height="640" loading="lazy" decoding="async" /></div>
      <h3 class="lead__name">${m.name}</h3>
      <p class="lead__role">${m.role}</p>
      <p class="lead__co">${m.company}</p>
      <button class="lead__more" type="button" data-i="${i}" aria-haspopup="dialog">Read about ${m.first} <span aria-hidden="true">↗</span></button>
    </li>`
  )
  .join("");

const leadModal = $("#leadModal");
let leadReturn = null;
function openLeader(i) {
  const m = leaders[i];
  $("#leadModalImg").src = m.image;
  $("#leadModalImg").alt = m.name;
  $("#leadModalChip").textContent = m.chip;
  $("#leadModalName").textContent = m.name;
  $("#leadModalRole").textContent = `${m.role} · ${m.company}`;
  $("#leadModalBio").innerHTML = m.bio.split(/\n\s*\n/).map((p) => `<p>${p}</p>`).join("");
  $("#leadModalQual").textContent = m.qualification;
  leadReturn = document.activeElement;
  leadModal.hidden = false;
  document.documentElement.style.overflow = "hidden";
  $(".lead-modal__close", leadModal).focus();
}
function closeLeader() {
  if (leadModal.hidden) return;
  leadModal.hidden = true;
  document.documentElement.style.overflow = "";
  leadReturn?.focus?.();
}
$$(".lead__more").forEach((b) => b.addEventListener("click", () => openLeader(Number(b.dataset.i))));
$$("[data-close]", leadModal).forEach((el) => el.addEventListener("click", closeLeader));
window.addEventListener("keydown", (e) => {
  if (leadModal.hidden) return;
  if (e.key === "Escape") return closeLeader();
  if (e.key !== "Tab") return;
  // keep focus inside the open profile
  const f = $$('button, [href], [tabindex]:not([tabindex="-1"])', leadModal).filter((el) => el.offsetParent !== null);
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});

/* ------------------------------------------------------------
   Footer mosaic (after digitalmetal.io): black cells over the light
   band; their opacity shifts a few at a time. The logo and name are
   sized to run across the full width.
   ------------------------------------------------------------ */
const ftrEl = $(".ftr");
const mosaic = $("#ftrMosaic");
const ftrBrand = $("#ftrBrand");
let cells = [];

// darker at the top and bottom, more open through the band of light
function cellOpacity(row, rows) {
  const t = rows > 1 ? row / (rows - 1) : 0.5;
  const band = Math.exp(-Math.pow((t - 0.56) / 0.22, 2)); // 1 in the band, 0 away from it
  const r = Math.random();
  if (r < 0.42 * band + 0.05) return 0;
  if (r < 0.78 * band + 0.12) return +(0.15 + Math.random() * 0.55).toFixed(2);
  return 1;
}

function buildMosaic() {
  const cs = getComputedStyle(mosaic);
  const cell = parseFloat(cs.gridAutoRows) || 100;
  const cols = Math.ceil(ftrEl.offsetWidth / (cell + 1)) + 1;
  const rows = Math.ceil(ftrEl.offsetHeight / (cell + 1)) + 1;
  const frag = document.createDocumentFragment();
  cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const el = document.createElement("i");
      el.style.setProperty("--o", cellOpacity(r, rows));
      el.dataset.row = r;
      frag.append(el);
      cells.push(el);
    }
  }
  mosaic.replaceChildren(frag);
  mosaic.dataset.rows = rows;
}

function fitBrand() {
  if (window.innerWidth <= 600) { ftrBrand.style.removeProperty("--brand-fs"); return; }
  ftrBrand.style.setProperty("--brand-fs", "100px");
  const natural = ftrBrand.scrollWidth;
  const avail = ftrBrand.parentElement.clientWidth - parseFloat(getComputedStyle(ftrBrand.parentElement).paddingLeft) - parseFloat(getComputedStyle(ftrBrand.parentElement).paddingRight);
  if (natural > 0) ftrBrand.style.setProperty("--brand-fs", `${(100 * avail / natural).toFixed(2)}px`);
}

buildMosaic();
fitBrand();
(document.fonts ? document.fonts.ready : Promise.resolve()).then(fitBrand);
let ftrResize = 0;
window.addEventListener("resize", () => {
  clearTimeout(ftrResize);
  ftrResize = setTimeout(() => { buildMosaic(); fitBrand(); }, 150);
});

if (!reduceMotion) {
  let shimmer = 0;
  const tick = () => {
    const rows = +mosaic.dataset.rows || 1;
    const n = Math.max(3, Math.round(cells.length * 0.06));
    for (let k = 0; k < n; k++) {
      const el = cells[(Math.random() * cells.length) | 0];
      if (el) el.style.setProperty("--o", cellOpacity(+el.dataset.row, rows));
    }
  };
  new IntersectionObserver((entries) => entries.forEach((e) => {
    clearInterval(shimmer);
    if (e.isIntersecting) shimmer = setInterval(tick, 900);
  })).observe(ftrEl);
}

/* ------------------------------------------------------------
   Small touches
   ------------------------------------------------------------ */
if (!reduceMotion) {
  gsap.fromTo("#aboutImg", { yPercent: -4, scale: 1.08 }, {
    yPercent: 4, scale: 1.08, ease: "none",
    scrollTrigger: { trigger: ".about", start: "top bottom", end: "bottom top", scrub: true },
  });
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
