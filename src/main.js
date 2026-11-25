import "./style.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { about, firms, clients, milestones } from "./data.js";
import glyphData from "./glyphs.json";
import { createGlyphArt } from "./glyphArt.js";

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

$("#cosDeck").innerHTML = firms
  .map(
    (f, i) => `<li class="card" id="co-${f.id}">
      <div class="card__body">
        <div class="card__top">
          <div class="card__logo"><img src="${f.logo}" alt="" /><span>${f.category.split(" · ")[0]}</span></div>
          <span class="card__idx">${pad2(i + 1)}<small>/${pad2(firms.length)}</small></span>
        </div>
        <h3 class="card__name">${f.name}</h3>
        <p class="card__meta">${f.meta}</p>
        <div class="card__text">${f.description.map((p) => `<p>${p}</p>`).join("")}</div>
        <div class="card__figs">${f.figures.map(([v, l]) => `<div><b>${v}</b><span>${l}</span></div>`).join("")}</div>
        <div class="card__foot">
          <p class="card__cat">${f.category}</p>
          <a class="card__btn" href="${f.url}" target="_blank" rel="noopener">Visit website</a>
        </div>
      </div>
      <div class="card__media">
        <img src="${f.image}" alt="${f.alt}" />
        <span class="card__tag">${f.meta.split(" · ")[0]}</span>
      </div>
      <span class="card__shade" aria-hidden="true"></span>
    </li>`
  )
  .join("");

$("#cosDots").innerHTML = firms
  .map((f, i) => `<button type="button" role="tab" aria-label="${f.name}" aria-selected="${i === 0}" data-i="${i}"></button>`)
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
   Photo reveal: the image builds up through a grid of black
   cells with flickering 0/1 digits that clear in random order
   ------------------------------------------------------------ */
async function revealMedia(media) {
  if (media.dataset.revealed) return;
  media.dataset.revealed = "1";
  const img = $("img", media);
  try { await img.decode(); } catch (e) { /* show it anyway */ }
  media.classList.add("is-revealed");
  if (reduceMotion) return;

  const w = media.clientWidth;
  const h = media.clientHeight;
  if (!w || !h) return;
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  media.append(canvas);
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);

  const size = Math.max(30, Math.round(w / 13));
  const cols = Math.ceil(w / size);
  const rows = Math.ceil(h / size);
  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const roll = Math.random();
      cells.push({
        x: c * size,
        y: r * size,
        t: 120 + Math.random() * 820 + (r / rows) * 260, // ms until this cell clears
        kind: roll < 0.1 ? "flash" : roll < 0.3 ? "ghost" : roll < 0.78 ? "digit" : "black",
        bit: Math.random() < 0.5 ? 0 : 1,
      });
    }
  }
  const end = Math.max(...cells.map((c) => c.t)) + 60;
  ctx.font = `500 ${Math.max(10, Math.round(size * 0.28))}px "IBM Plex Mono", ui-monospace, Menlo, monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const start = performance.now();
  const frame = (now) => {
    const e = now - start;
    ctx.clearRect(0, 0, w, h);
    for (const cell of cells) {
      if (e >= cell.t) continue;
      if (cell.kind === "flash" && e > cell.t - 90) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(cell.x, cell.y, size, size);
      } else if (cell.kind === "ghost" && e > cell.t * 0.55) {
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(cell.x, cell.y, size, size);
      } else {
        ctx.fillStyle = "#000000";
        ctx.fillRect(cell.x, cell.y, size, size);
        if (cell.kind === "digit") {
          const bit = (cell.bit + Math.floor(e / 140)) % 2;
          ctx.fillStyle = "rgba(255,255,255,0.85)";
          ctx.fillText(String(bit), cell.x + size / 2, cell.y + size / 2);
        }
      }
    }
    if (e < end) requestAnimationFrame(frame);
    else canvas.remove();
  };
  requestAnimationFrame(frame);
}

/* ------------------------------------------------------------
   Companies
   Desktop: the section pins; scrolling slides each card in over
   the last one, which steps back into a stack. After the last
   card the Our Story timeline slides up over the whole section.
   Small screens: a swipeable row.
   ------------------------------------------------------------ */
const cos = $(".cos");
const story = $("#story");
const cards = $$(".card", $("#cosDeck"));
const medias = cards.map((c) => $(".card__media", c));
const shades = cards.map((c) => $(".card__shade", c));
const dots = $$("#cosDots button");
const prev = $(".arrow--prev");
const next = $(".arrow--next");
const dim = $(".cos__dim");
const n = cards.length;
let current = -1;
let goTo = () => {};

function setCurrent(i) {
  if (i === current) return;
  current = i;
  dots.forEach((d, k) => d.setAttribute("aria-selected", String(k === i)));
  prev.disabled = i === 0;
  next.disabled = i === n - 1;
  revealMedia(medias[i]);
}

function layoutDeck(pos) {
  const cw = cards[0].offsetWidth;
  cards.forEach((card, i) => {
    const d = i - pos;
    let x = 0, s = 1, shade = 0;
    if (d >= 0) {
      x = d * (cw + 48);
    } else {
      const e = Math.min(-d, 2);
      x = -e * 56;
      s = 1 - e * 0.07;
      shade = e * 0.32;
    }
    gsap.set(card, { x, scale: s, zIndex: 10 + i });
    shades[i].style.opacity = shade.toFixed(3);
  });
}

const mm = gsap.matchMedia();
mm.add("(min-width: 901px) and (min-height: 601px)", () => {
  const travel = () => window.innerHeight * 0.85 * (n - 1); // scroll spent moving through the cards
  const cover = () => cos.offsetHeight;                      // scroll spent while the timeline slides over
  const setOverlap = () => { story.style.marginTop = `-${cover()}px`; };
  setOverlap();

  const st = ScrollTrigger.create({
    trigger: cos,
    start: "top top",
    end: () => "+=" + (travel() + cover()),
    pin: true,
    invalidateOnRefresh: true,
    onRefreshInit: setOverlap,
    snap: {
      snapTo: (p) => {
        const split = travel() / (travel() + cover());
        if (p > split) return p; // free scroll while the next page covers
        return (Math.round((p / split) * (n - 1)) / (n - 1)) * split;
      },
      duration: { min: 0.2, max: 0.5 },
      delay: 0.08,
      ease: "power2.inOut",
    },
    onUpdate: (self) => {
      const split = travel() / (travel() + cover());
      const p1 = Math.min(1, self.progress / split);
      const pos = p1 * (n - 1);
      layoutDeck(pos);
      setCurrent(Math.round(pos));
      const p2 = Math.max(0, (self.progress - split) / (1 - split));
      dim.style.opacity = (p2 * 0.65).toFixed(3);
      gsap.set(".cos__stage", { scale: 1 - p2 * 0.05, y: -p2 * 30 });
    },
  });
  layoutDeck(0);

  // first card builds in when the section arrives
  ScrollTrigger.create({ trigger: cos, start: "top 60%", once: true, onEnter: () => revealMedia(medias[0]) });

  goTo = (i) => {
    const split = travel() / (travel() + cover());
    window.scrollTo({ top: st.start + (st.end - st.start) * split * (i / (n - 1)), behavior: reduceMotion ? "auto" : "smooth" });
  };
  current = -1;
  dots.forEach((d, k) => d.setAttribute("aria-selected", String(k === 0)));
  prev.disabled = true;

  return () => {
    story.style.marginTop = "";
    gsap.set(cards, { clearProps: "transform,zIndex" });
    gsap.set(".cos__stage", { clearProps: "transform" });
    shades.forEach((s) => (s.style.opacity = 0));
    dim.style.opacity = 0;
    goTo = () => {};
  };
});

mm.add("(max-width: 900px), (max-height: 600px)", () => {
  const deck = $("#cosDeck");
  const onScroll = () => {
    const mid = deck.scrollLeft + deck.clientWidth / 2;
    let best = 0, dist = Infinity;
    cards.forEach((c, k) => {
      const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid);
      if (d < dist) { dist = d; best = k; }
    });
    current = best;
    dots.forEach((d, k) => d.setAttribute("aria-selected", String(k === best)));
  };
  deck.addEventListener("scroll", onScroll, { passive: true });
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && revealMedia(e.target)),
    { threshold: 0.45 }
  );
  medias.forEach((m) => io.observe(m));
  goTo = (i) => deck.scrollTo({ left: cards[i].offsetLeft - (deck.clientWidth - cards[i].offsetWidth) / 2, behavior: "smooth" });
  return () => { deck.removeEventListener("scroll", onScroll); io.disconnect(); };
});

prev.addEventListener("click", () => goTo(Math.max(0, current - 1)));
next.addEventListener("click", () => goTo(Math.min(n - 1, current + 1)));
dots.forEach((d) => d.addEventListener("click", () => goTo(Number(d.dataset.i))));

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
