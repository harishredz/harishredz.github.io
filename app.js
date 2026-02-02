/* ===========================
   TYPEWRITER (smooth + readable)
=========================== */
const typeEl = document.getElementById("type");
const TYPE_TEXT =
  "I'M A FINANCE NERD WITH MARKETS & FINANCE IN MIND, BIRYANI & COCA COLA IN BELLY, WHEELS IN FEET.";

let i = 0;
let last = 0;
const cps = 40; // chars per second

function typeLoop(ts){
  if(!typeEl) return;
  if(!last) last = ts;
  const dt = (ts - last) / 1000;
  last = ts;

  i += dt * cps;
  const n = Math.min(TYPE_TEXT.length, Math.floor(i));
  typeEl.textContent = TYPE_TEXT.slice(0, n);

  if(n < TYPE_TEXT.length) requestAnimationFrame(typeLoop);
}
requestAnimationFrame(typeLoop);

/* ===========================
   MOBILE NAV (burger)
=========================== */
const burger = document.getElementById("burger");
const navMobile = document.getElementById("navMobile");

if (burger && navMobile) {
  burger.addEventListener("click", () => {
    const open = navMobile.classList.toggle("open");
    burger.setAttribute("aria-expanded", String(open));
    navMobile.setAttribute("aria-hidden", String(!open));
  });

  navMobile.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      navMobile.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
      navMobile.setAttribute("aria-hidden", "true");
    });
  });
}

/* ===========================
   CUSTOM CURSOR (candlestick -> crosshair on hover)
=========================== */
const cursor = document.getElementById("cursor");
if (cursor) {
  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let cx = mx,
    cy = my;

  window.addEventListener(
    "mousemove",
    (e) => {
      mx = e.clientX;
      my = e.clientY;
    },
    { passive: true }
  );

  function cursorRAF() {
    cx += (mx - cx) * 0.22;
    cy += (my - cy) * 0.22;
    cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
    requestAnimationFrame(cursorRAF);
  }
  cursorRAF();

  function setCrosshair(on) {
    cursor.classList.toggle("crosshair", on);
  }

  // hover targets
  document.querySelectorAll("a, button, .btn, input, textarea").forEach((el) => {
    el.addEventListener("mouseenter", () => setCrosshair(true));
    el.addEventListener("mouseleave", () => setCrosshair(false));
  });
   /* ================================
   CURSOR CLICK STATE (candlestick)
================================ */

window.addEventListener("mousedown", () => {
  cursor.classList.add("down");
});

window.addEventListener("mouseup", () => {
  cursor.classList.remove("down");
});

window.addEventListener("blur", () => {
  cursor.classList.remove("down");
});
}

/* ===========================
   LENIS SMOOTH SCROLL
=========================== */
if (window.Lenis) {
  const lenis = new Lenis({
    duration: 1.05,
    smoothWheel: true,
    smoothTouch: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

/* ===========================
   LIGHTWEIGHT GSAP ENTRANCE
=========================== */
window.addEventListener("load", () => {
  if (!window.gsap) return;

  gsap.from(".nav", { y: -14, opacity: 0, duration: 0.55, ease: "power2.out" });
  gsap.from(".hero .kicker", { y: 10, opacity: 0, duration: 0.55, delay: 0.1, ease: "power2.out" });
  gsap.from(".hero .heroTitle", { y: 16, opacity: 0, duration: 0.65, delay: 0.14, ease: "power2.out" });
  gsap.from(".hero .typeLine", { y: 12, opacity: 0, duration: 0.55, delay: 0.22, ease: "power2.out" });
  gsap.from(".hero .heroBtns .btn", {
    y: 10,
    opacity: 0,
    duration: 0.45,
    delay: 0.28,
    stagger: 0.08,
    ease: "power2.out",
  });
});
