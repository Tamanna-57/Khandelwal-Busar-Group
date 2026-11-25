import "./style.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { group, firms, capabilities, leaders, clients, certs, sites } from "./data.js";

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ------------------------------------------------------------
   Render content
   ------------------------------------------------------------ */
$("#year").textContent = new Date().getFullYear();

$("#heroRail").innerHTML = firms
  .map(
    (f) => `<a class="rail__item" href="#co-${f.id}" data-co="${f.id}">
      <span class="rail__i">${f.index}</span>
      <span class="rail__n">${f.name}<span class="rail__k">${f.kicker}</span></span>
      <span class="rail__a" aria-hidden="true">→</span>
    </a>`
  )
  .join("");

$("#stats").innerHTML = group.stats
  .map(
    (s) => `<div class="stat reveal"><dt>${s.label}</dt><dd>${s.value}${s.unit ? `<small>${s.unit}</small>` : ""}</dd></div>`
  )
  .join("");

$("#cosTrack").innerHTML = firms
  .map(
    (f) => `<article class="co" id="co-${f.id}">
      <div class="co__text">
        <div class="co__top"><span class="co__i">${f.index}</span><span class="co__since">${f.since}</span></div>
        <p class="co__kicker">${f.kicker}</p>
        <h3 class="co__name">${f.name}</h3>
        <p class="co__loc">${f.location}</p>
        <p class="co__blurb">${f.blurb}</p>
        <dl class="co__specs">${f.specs.map(([k, v]) => `<div class="co__spec"><dt>${k}</dt><dd>${v}</dd></div>`).join("")}</dl>
        <a class="co__link" href="${f.url}" target="_blank" rel="noopener">${f.linkLabel} <span aria-hidden="true">↗</span></a>
      </div>
      <div class="co__media">
        <img src="${f.image}" alt="${f.alt}" loading="lazy" />
        <span class="co__tag">${f.location}</span>
      </div>
    </article>`
  )
  .join("");

$("#capsGrid").innerHTML = capabilities
  .map(
    (c) => `<article class="cap reveal">
      <div class="cap__img"><img src="${c.image}" alt="${c.title}" loading="lazy" /></div>
      <div class="cap__meta"><h3 class="cap__t">${c.title}</h3><span class="cap__f">${c.firm}</span></div>
      <p class="cap__p">${c.text}</p>
    </article>`
  )
  .join("");

$("#leaders").innerHTML = leaders
  .map(
    (p) => `<figure class="person reveal">
      <div class="person__img"><img src="${p.image}" alt="${p.name}" loading="lazy" /></div>
      <figcaption>
        <p class="person__n">${p.name}</p>
        <p class="person__r">${p.role}</p>
        ${p.note ? `<p class="person__p">${p.note}</p>` : ""}
      </figcaption>
    </figure>`
  )
  .join("");

$("#logos").innerHTML = clients
  .map(([n, src]) => `<li><img src="${src}" alt="${n}" loading="lazy" /></li>`)
  .join("");

$("#certs").innerHTML = certs.map(([c, d]) => `<li class="reveal"><b>${c}</b><span>${d}</span></li>`).join("");

$("#sites").innerHTML = sites
  .map(
    (s) => `<article class="site reveal">
      <div class="site__img"><img src="${s.image}" alt="${s.label}" loading="lazy" /></div>
      <p class="site__lbl">${s.label}</p>
      <h3 class="site__city">${s.city}</h3>
      <p class="site__addr">${s.address}</p>
      <p class="site__ct">${s.contact}</p>
    </article>`
  )
  .join("");

/* ------------------------------------------------------------
   Header + drawer
   ------------------------------------------------------------ */
const hdr = $("#hdr");
const onScroll = () => hdr.classList.toggle("is-solid", window.scrollY > 40);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

const menuBtn = $(".hdr__menu");
const drawer = $("#drawer");
const setDrawer = (open) => {
  drawer.classList.toggle("is-open", open);
  drawer.setAttribute("aria-hidden", String(!open));
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  document.body.style.overflow = open ? "hidden" : "";
  hdr.classList.toggle("is-solid", open || window.scrollY > 40);
};
menuBtn.addEventListener("click", () => setDrawer(!drawer.classList.contains("is-open")));
$$("#drawer a").forEach((a) => a.addEventListener("click", () => setDrawer(false)));
window.addEventListener("keydown", (e) => e.key === "Escape" && setDrawer(false));

// active section in nav
const navLinks = $$(".hdr__nav a");
const navIO = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + e.target.id));
    }),
  { rootMargin: "-45% 0px -50% 0px" }
);
["group", "companies", "capabilities", "leadership", "locations"].forEach((id) => navIO.observe(document.getElementById(id)));

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
   Reveal on scroll
   ------------------------------------------------------------ */
const io = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    }),
  { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
);
$$(".reveal").forEach((el, i) => {
  el.style.transitionDelay = `${(i % 3) * 90}ms`;
  io.observe(el);
});

/* ------------------------------------------------------------
   Motion (GSAP)
   ------------------------------------------------------------ */
if (!reduceMotion) {
  // hero intro
  gsap.from(".hero__title .ln > span", { yPercent: 110, duration: 1.3, ease: "power4.out", stagger: 0.12, delay: 0.15 });
  gsap.from([".hero__kicker", ".hero__lede", ".hero__actions", ".hero__rail"], {
    opacity: 0, y: 24, duration: 1.1, ease: "power3.out", stagger: 0.1, delay: 0.5,
  });
  // hero video drifts as you leave
  gsap.to(".hero__video", {
    yPercent: 12, ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
  });
  // quote band parallax
  gsap.fromTo(".band__img", { yPercent: -8 }, {
    yPercent: 8, ease: "none",
    scrollTrigger: { trigger: ".band", start: "top bottom", end: "bottom top", scrub: true },
  });
}

/* Companies: pinned horizontal sequence on desktop, stacked on small screens */
const cos = $(".cos");
const track = $("#cosTrack");
const bar = $("#cosBar");
const now = $("#cosNow");
const mm = gsap.matchMedia();

mm.add("(min-width: 1024px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)", () => {
  cos.classList.remove("is-stacked");
  const panels = $$(".co", track);
  const dist = () => track.scrollWidth - window.innerWidth;

  const tween = gsap.to(track, {
    x: () => -dist(),
    ease: "none",
    scrollTrigger: {
      trigger: ".cos__pin",
      start: "top 72px",
      end: () => "+=" + dist(),
      pin: true,
      scrub: 0.8,
      invalidateOnRefresh: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        const n = panels.length;
        bar.style.width = `${100 / n}%`;
        bar.style.transform = `translateX(${self.progress * (n - 1) * 100}%)`;
        now.textContent = String(Math.round(self.progress * (n - 1)) + 1).padStart(2, "0");
      },
    },
  });

  panels.forEach((p) => {
    gsap.fromTo($(".co__media img", p), { xPercent: -6, scale: 1.12 }, {
      xPercent: 6, scale: 1.12, ease: "none",
      scrollTrigger: { trigger: p, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
    });
  });

  // hero rail links jump to the right point of the pinned sequence
  const onRail = (e) => {
    const id = e.currentTarget.dataset.co;
    const i = firms.findIndex((f) => f.id === id);
    const st = tween.scrollTrigger;
    e.preventDefault();
    window.scrollTo({ top: st.start + (st.end - st.start) * (i / (panels.length - 1)) + 2, behavior: "smooth" });
  };
  const railLinks = $$(".rail__item");
  railLinks.forEach((a) => a.addEventListener("click", onRail));

  return () => {
    railLinks.forEach((a) => a.removeEventListener("click", onRail));
    cos.classList.add("is-stacked");
  };
});
mm.add("(max-width: 1023px), (max-height: 639px), (prefers-reduced-motion: reduce)", () => {
  cos.classList.add("is-stacked");
});

window.addEventListener("load", () => ScrollTrigger.refresh());
