import "./style.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { group, firms } from "./data.js";

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ---------- year ---------- */
$("#year").textContent = new Date().getFullYear();

/* ---------- stats ---------- */
$("#stats").innerHTML = group.stats
  .map((s) => `<div class="stat reveal"><div class="stat__v">${s.value}</div><div class="stat__l">${s.label}</div></div>`)
  .join("");

/* ---------- firm panels ---------- */
const track = $(".firms__track");
track.insertAdjacentHTML(
  "beforeend",
  firms
    .map((f) => {
      const visit = f.live
        ? `<a class="firm__visit" href="${f.url}" target="_blank" rel="noopener">Visit ${f.city} site <span aria-hidden="true">↗</span></a>`
        : `<a class="firm__visit" href="${f.url}">View division</a><span class="firm__soon">Dedicated site in progress</span>`;
      return `
      <article class="panel firm-panel" style="--fa:${f.accent};--fa-soft:${f.accentSoft}">
        <div class="firm__wash"></div>
        <span class="firm__i">${f.index}</span>
        <div class="firm">
          <div class="firm__text">
            <span class="firm__kicker">${f.kicker}</span>
            <h3 class="firm__name">${f.name}</h3>
            <p class="firm__place"><b>${f.city}</b>, ${f.state} · ${f.since}</p>
            <p class="firm__blurb">${f.blurb}</p>
            <div class="firm__meta">
              <div class="firm__row">
                <h4>Products</h4>
                <div class="chips">${f.products.map((p) => `<span class="chip">${p}</span>`).join("")}</div>
              </div>
              <div class="firm__row">
                <h4>Standards</h4>
                <div class="chips">${f.certs.map((c) => `<span class="chip chip--accent">${c}</span>`).join("")}</div>
              </div>
            </div>
            <div class="firm__actions">${visit}</div>
          </div>
          <div class="firm__visual">
            <div class="firm__frame">
              <span class="firm__tag">${f.city} · ${f.state}</span>
              <img src="${f.image}" alt="${f.name} — ${f.kicker}" loading="lazy" />
            </div>
          </div>
        </div>
      </article>`;
    })
    .join("")
);

/* ---------- map / network ---------- */
const sites = [
  { city: "Faridabad", state: "Haryana", firm: "Khandelwal Busar Industries — automobile sheet metal", a: firms[0].accent, soft: firms[0].accentSoft },
  { city: "Alwar", state: "Rajasthan", firm: "KB Wires & Strips — cable input & armouring", a: firms[1].accent, soft: firms[1].accentSoft },
  { city: "Faridabad", state: "Haryana", firm: "Metal Coatings (India) Ltd — cold-rolled strips", a: firms[2].accent, soft: firms[2].accentSoft },
];
$("#mapGrid").innerHTML = sites
  .map(
    (s) => `<div class="site reveal" style="--site-a:${s.a};--site-soft:${s.soft}">
      <span class="site__dot"></span>
      <div class="site__city">${s.city}</div>
      <div class="site__state">${s.state}</div>
      <div class="site__firm">${s.firm}</div>
    </div>`
  )
  .join("");

/* ---------- nav: stuck + burger ---------- */
const nav = $("#nav");
const onScroll = () => nav.classList.toggle("is-stuck", window.scrollY > 40);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

const burger = $(".nav__burger");
const pill = $(".nav__pill");
burger.addEventListener("click", () => {
  const open = pill.classList.toggle("is-open");
  burger.setAttribute("aria-expanded", String(open));
});
$$(".nav__pill a").forEach((a) => a.addEventListener("click", () => pill.classList.remove("is-open")));

/* ---------- reveal on scroll ---------- */
const io = new IntersectionObserver(
  (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
  { threshold: 0.15 }
);
$$(".reveal").forEach((el) => io.observe(el));

/* ============================================================
   Horizontal scroll for the firms section
   ============================================================ */
function setupHorizontal() {
  const section = $(".firms");
  const panels = $$(".panel", track);
  const bar = $(".firms__progress span");
  const mq = window.matchMedia("(min-width: 901px)");

  if (!mq.matches) {
    section.classList.add("no-scroll");
    return;
  }

  const getScrollX = () => track.scrollWidth - window.innerWidth;

  const tween = gsap.to(track, {
    x: () => -getScrollX(),
    ease: "none",
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: () => "+=" + getScrollX(),
      pin: true,
      scrub: reduceMotion ? true : 0.6,
      invalidateOnRefresh: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        if (bar) {
          bar.style.width = (self.progress * 100).toFixed(1) + "%";
          const i = Math.min(panels.length - 1, Math.round(self.progress * (panels.length - 1)));
          const accent = panels[i]?.style.getPropertyValue("--fa") || "var(--amber)";
          bar.style.background = accent.trim() || "var(--amber)";
        }
      },
    },
  });

  // subtle parallax lift on each firm's visual as it enters center
  if (!reduceMotion) {
    $$(".firm-panel").forEach((p) => {
      const img = $(".firm__frame img", p);
      gsap.fromTo(
        img,
        { yPercent: 8 },
        {
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: p,
            containerAnimation: tween,
            start: "left right",
            end: "right left",
            scrub: true,
          },
        }
      );
    });
  }
}
setupHorizontal();

/* ============================================================
   Hero particle field — drifting steel filings + spark lines
   ============================================================ */
function heroField() {
  const canvas = $(".hero__canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let w, h, dpr, pts, raf;
  const COUNT = () => Math.min(130, Math.floor(window.innerWidth / 11));

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.width = window.innerWidth * dpr;
    h = canvas.height = canvas.offsetHeight * dpr;
    canvas.style.width = "100%";
    pts = Array.from({ length: COUNT() }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.18 * dpr,
      vy: (Math.random() - 0.5) * 0.18 * dpr,
      r: (Math.random() * 1.4 + 0.4) * dpr,
    }));
  }

  function frame() {
    ctx.clearRect(0, 0, w, h);
    const linkDist = 120 * dpr;
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(242,106,27,0.55)";
      ctx.fill();
      for (let j = i + 1; j < pts.length; j++) {
        const q = pts[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const d = Math.hypot(dx, dy);
        if (d < linkDist) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(154,160,171,${(1 - d / linkDist) * 0.22})`;
          ctx.lineWidth = dpr * 0.6;
          ctx.stroke();
        }
      }
    }
    raf = requestAnimationFrame(frame);
  }

  resize();
  window.addEventListener("resize", () => { cancelAnimationFrame(raf); resize(); if (!reduceMotion) frame(); });
  if (reduceMotion) { frame(); cancelAnimationFrame(raf); } // draw one static frame
  else frame();
}
heroField();

/* keep layout correct after fonts/images load */
window.addEventListener("load", () => ScrollTrigger.refresh());
