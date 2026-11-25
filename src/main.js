import "./style.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { group, firms, chain, capabilities, leaders, clients, certs, sites } from "./data.js";

gsap.registerPlugin(ScrollTrigger);

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------
   Render content
   ------------------------------------------------------------ */
$("#year").textContent = new Date().getFullYear();

$("#heroCos").innerHTML = firms
  .map((f) => `<li><a href="#co-${f.id}" data-co="${f.id}"><b>${f.name}</b><span>${f.kicker} · ${f.location.split(",")[0]}</span></a></li>`)
  .join("");

$("#chain").innerHTML = chain
  .map(
    (c, i) => `<li class="chain__step${i > 0 && i < chain.length - 1 ? " is-group" : ""}">
      <span class="chain__n">${String(i + 1).padStart(2, "0")}</span>
      <p class="chain__t">${c.step}</p>
      <p class="chain__d">${c.detail}</p>
      <p class="chain__w">${c.who}</p>
    </li>`
  )
  .join("");

$("#cosTrack").innerHTML = firms
  .map(
    (f) => `<article class="co" id="co-${f.id}">
      <div class="co__media"><img src="${f.image}" alt="${f.alt}" loading="lazy" /></div>
      <div class="co__text">
        <p class="co__kicker"><span>${f.kicker}</span><span>${f.since}</span></p>
        <h3 class="co__name">${f.name}</h3>
        <p class="co__loc">${f.location}</p>
        <p class="co__blurb">${f.blurb}</p>
        <dl class="co__specs">${f.specs.map(([k, v]) => `<div class="co__spec"><dt>${k}</dt><dd>${v}</dd></div>`).join("")}</dl>
        <a class="btn btn--blue co__link" href="${f.url}" target="_blank" rel="noopener">Visit ${f.linkLabel} ↗</a>
      </div>
    </article>`
  )
  .join("");

$("#capsGrid").innerHTML = capabilities
  .map(
    (c) => `<article class="cap">
      <div class="cap__img"><img src="${c.image}" alt="${c.title} at ${c.firm}" loading="lazy" /></div>
      <div class="cap__meta"><h3 class="cap__t">${c.title}</h3><span class="cap__f">${c.firm}</span></div>
      <p class="cap__p">${c.text}</p>
    </article>`
  )
  .join("");

$("#stats").innerHTML = group.stats
  .map((s) => `<div class="stat"><dt>${s.label}</dt><dd>${s.value}${s.unit ? `<small>${s.unit}</small>` : ""}</dd></div>`)
  .join("");

$("#logos").innerHTML = clients.map(([n, src]) => `<li><img src="${src}" alt="${n}" loading="lazy" /></li>`).join("");

$("#certs").innerHTML = certs.map(([c, d]) => `<li><b>${c}</b><span>${d}</span></li>`).join("");

$("#leaders").innerHTML = leaders
  .map(
    (p) => `<figure class="person">
      <div class="person__img"><img src="${p.image}" alt="${p.name}" loading="lazy" /></div>
      <figcaption>
        <p class="person__n">${p.name}</p>
        <p class="person__r">${p.role}</p>
        ${p.note ? `<p class="person__p">${p.note}</p>` : ""}
      </figcaption>
    </figure>`
  )
  .join("");

$("#sites").innerHTML = sites
  .map(
    (s) => `<article class="site">
      <div class="site__img"><img src="${s.image}" alt="${s.label}" loading="lazy" /></div>
      <div class="site__body">
        <p class="site__lbl">${s.label}</p>
        <h3 class="site__city">${s.city}</h3>
        <p class="site__addr">${s.address}</p>
        <p class="site__ct">${s.contact}</p>
      </div>
    </article>`
  )
  .join("");

/* ------------------------------------------------------------
   Header, mobile menu, active link
   ------------------------------------------------------------ */
const hdr = $("#hdr");
const onScroll = () => hdr.classList.toggle("is-scrolled", window.scrollY > 8);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

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

const navLinks = $$(".hdr__nav a");
const navIO = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (e.isIntersecting) navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + e.target.id));
    }),
  { rootMargin: "-45% 0px -50% 0px" }
);
["companies", "capabilities", "customers", "leadership", "locations"].forEach((id) => navIO.observe(document.getElementById(id)));

/* ------------------------------------------------------------
   Hero video
   ------------------------------------------------------------ */
const video = $(".hero__video");
const pauseBtn = $(".hero__pause");
const setPaused = (paused) => {
  paused ? video.pause() : video.play().catch(() => {});
  pauseBtn.setAttribute("aria-pressed", String(paused));
  pauseBtn.setAttribute("aria-label", paused ? "Play background video" : "Pause background video");
};
if (reduceMotion) setPaused(true);
pauseBtn.addEventListener("click", () => setPaused(!video.paused));

/* ------------------------------------------------------------
   Motion: one load moment + the company sequence
   ------------------------------------------------------------ */
if (!reduceMotion) {
  gsap.from(".slab", { yPercent: 12, duration: 1.1, ease: "power3.out" });
  gsap.from(".slab__in > *", { y: 18, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.08, delay: 0.2 });
}

const cos = $(".cos");
const track = $("#cosTrack");
const bar = $("#cosBar");
const now = $("#cosNow");
const mm = gsap.matchMedia();

mm.add("(min-width: 1024px) and (min-height: 680px) and (prefers-reduced-motion: no-preference)", () => {
  cos.classList.remove("is-stacked");
  const panels = $$(".co", track);
  const n = panels.length;
  const dist = () => track.scrollWidth - window.innerWidth;

  const tween = gsap.to(track, {
    x: () => -dist(),
    ease: "none",
    scrollTrigger: {
      trigger: ".cos__pin",
      start: () => `top ${hdr.offsetHeight + 24}px`,
      end: () => "+=" + dist(),
      pin: true,
      scrub: 0.6,
      invalidateOnRefresh: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        bar.style.transform = `translateX(${self.progress * (n - 1) * 100}%)`;
        now.textContent = String(Math.round(self.progress * (n - 1)) + 1);
      },
    },
  });

  panels.forEach((p) => {
    gsap.fromTo($(".co__media img", p), { scale: 1.12, xPercent: -4 }, {
      scale: 1.12, xPercent: 4, ease: "none",
      scrollTrigger: { trigger: p, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
    });
  });

  const jump = (e) => {
    const i = firms.findIndex((f) => f.id === e.currentTarget.dataset.co);
    const st = tween.scrollTrigger;
    e.preventDefault();
    window.scrollTo({ top: st.start + (st.end - st.start) * (i / (n - 1)) + 2, behavior: "smooth" });
  };
  const links = $$("#heroCos a");
  links.forEach((a) => a.addEventListener("click", jump));
  return () => {
    links.forEach((a) => a.removeEventListener("click", jump));
    cos.classList.add("is-stacked");
  };
});
mm.add("(max-width: 1023px), (max-height: 679px), (prefers-reduced-motion: reduce)", () => {
  cos.classList.add("is-stacked");
});

window.addEventListener("load", () => ScrollTrigger.refresh());
