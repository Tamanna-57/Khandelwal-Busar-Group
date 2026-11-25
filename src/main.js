import "./style.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { about, firms, clients } from "./data.js";

gsap.registerPlugin(ScrollTrigger);

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

$("#cosTrack").innerHTML = firms
  .map(
    (f, i) => `<li class="card${f.dark ? " card--dark" : ""}${i === 0 ? " is-current" : ""}" id="co-${f.id}">
      <div class="card__body">
        <div class="card__logo"><img src="${f.dark ? f.logoDark : f.logo}" alt="" /><span>${f.category.split(" · ")[0]}</span></div>
        <h3 class="card__name">${f.name}</h3>
        <p class="card__meta">${f.meta}</p>
        <div class="card__text">
          ${f.description.map((p) => `<p>${p}</p>`).join("")}
          <dl class="card__facts">${f.facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("")}</dl>
        </div>
        <div class="card__foot">
          <p class="card__cat">${f.category}</p>
          <a class="card__btn" href="${f.url}" target="_blank" rel="noopener">Visit website</a>
        </div>
      </div>
      <div class="card__media"><img src="${f.image}" alt="${f.alt}" loading="lazy" /></div>
    </li>`
  )
  .join("");

$("#cosDots").innerHTML = firms
  .map((f, i) => `<button type="button" role="tab" aria-label="${f.name}" aria-selected="${i === 0}" data-i="${i}"></button>`)
  .join("");

/* ------------------------------------------------------------
   Header: transparent over the hero, pill nav afterwards,
   logo colour follows the section underneath
   ------------------------------------------------------------ */
const hdr = $("#hdr");
const hero = $(".hero");
const surfaces = $$("[data-surface]").filter((el) => el !== hdr);
const navLinks = $$(".nav__link");
const ind = $(".nav__ind");
const sectionIds = navLinks.map((a) => a.getAttribute("href").slice(1));

function placeIndicator(link) {
  if (!link) return ind.classList.remove("is-on");
  const nav = $("#nav").getBoundingClientRect();
  const r = link.getBoundingClientRect();
  ind.style.setProperty("--ind-x", `${r.left - nav.left - 0}px`);
  ind.style.setProperty("--ind-w", `${r.width}px`);
  ind.classList.add("is-on");
}

let inContent = false;
let activeId = null;
function updateHeader() {
  const probe = hdr.offsetHeight / 2;

  // pill appears once the hero has scrolled away
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

  // which surface sits under the header
  const under = surfaces.find((el) => {
    const r = el.getBoundingClientRect();
    return r.top <= probe && r.bottom > probe;
  });
  hdr.dataset.surface = under?.dataset.surface || "dark";

  // which nav section is active
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

// mobile menu
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
   Companies: horizontal scroll
   Desktop: the section pins and vertical scroll slides the cards.
   Small screens: a swipeable row with scroll-snap.
   ------------------------------------------------------------ */
const track = $("#cosTrack");
const viewport = $("#cosViewport");
const cards = $$(".card", track);
const dots = $$("#cosDots button");
const prev = $(".arrow--prev");
const next = $(".arrow--next");
const n = cards.length;
let current = 0;
let goTo = () => {};

function setCurrent(i) {
  if (i === current) return;
  current = i;
  cards.forEach((c, k) => c.classList.toggle("is-current", k === i));
  dots.forEach((d, k) => d.setAttribute("aria-selected", String(k === i)));
  prev.disabled = i === 0;
  next.disabled = i === n - 1;
}
prev.disabled = true;

const mm = gsap.matchMedia();
mm.add("(min-width: 901px) and (min-height: 601px)", () => {
  const step = () => cards[0].offsetWidth + parseFloat(getComputedStyle(track).columnGap || 28);
  const tween = gsap.to(track, {
    x: () => -step() * (n - 1),
    ease: "none",
    scrollTrigger: {
      trigger: ".cos",
      start: "top top",
      end: () => "+=" + step() * (n - 1),
      pin: true,
      scrub: reduceMotion ? true : 0.7,
      snap: { snapTo: 1 / (n - 1), duration: { min: 0.2, max: 0.5 }, delay: 0.08, ease: "power2.inOut" },
      invalidateOnRefresh: true,
      onUpdate: (self) => setCurrent(Math.round(self.progress * (n - 1))),
    },
  });
  goTo = (i) => {
    const st = tween.scrollTrigger;
    window.scrollTo({ top: st.start + (st.end - st.start) * (i / (n - 1)), behavior: reduceMotion ? "auto" : "smooth" });
  };
  return () => { gsap.set(track, { x: 0 }); goTo = () => {}; };
});
mm.add("(max-width: 900px), (max-height: 600px)", () => {
  const onScroll = () => {
    const mid = viewport.scrollLeft + viewport.clientWidth / 2;
    let best = 0, dist = Infinity;
    cards.forEach((c, k) => {
      const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid);
      if (d < dist) { dist = d; best = k; }
    });
    setCurrent(best);
  };
  viewport.addEventListener("scroll", onScroll, { passive: true });
  goTo = (i) => viewport.scrollTo({ left: cards[i].offsetLeft - (viewport.clientWidth - cards[i].offsetWidth) / 2, behavior: "smooth" });
  return () => viewport.removeEventListener("scroll", onScroll);
});

prev.addEventListener("click", () => goTo(Math.max(0, current - 1)));
next.addEventListener("click", () => goTo(Math.min(n - 1, current + 1)));
dots.forEach((d) => d.addEventListener("click", () => goTo(Number(d.dataset.i))));

/* nav links into the pinned section land on its first card */
$$('a[href="#companies"]').forEach((a) =>
  a.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: $("#companies").getBoundingClientRect().top + window.scrollY + 2, behavior: "smooth" });
  })
);

/* ------------------------------------------------------------
   Small touches
   ------------------------------------------------------------ */
if (!reduceMotion) {
  // about photo drifts slightly as the section passes
  gsap.fromTo("#aboutImg", { yPercent: -4, scale: 1.08 }, {
    yPercent: 4, scale: 1.08, ease: "none",
    scrollTrigger: { trigger: ".about", start: "top bottom", end: "bottom top", scrub: true },
  });
} else {
  $(".hero__video").pause();
}

window.addEventListener("load", () => { ScrollTrigger.refresh(); updateHeader(); });
