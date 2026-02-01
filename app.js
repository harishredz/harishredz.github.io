/* ---------- Typewriter ---------- */
const typeEl = document.getElementById("type");
const TYPE_TEXT =
  "I'M A FINANCE NERD WITH MARKETS & FINANCE IN MIND, BIRYANI & COCA COLA IN BELLY, WHEELS IN FEET.";

let i = 0;
function typeLoop(){
  if(!typeEl) return;
  typeEl.textContent = TYPE_TEXT.slice(0, i++);
  if(i <= TYPE_TEXT.length) requestAnimationFrame(typeLoop);
}
typeLoop();

/* ---------- Mobile Nav ---------- */
const burger = document.getElementById("burger");
const navMobile = document.getElementById("navMobile");

if(burger && navMobile){
  burger.addEventListener("click", () => {
    const open = navMobile.classList.toggle("open");
    burger.setAttribute("aria-expanded", String(open));
    navMobile.setAttribute("aria-hidden", String(!open));
  });

  navMobile.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      navMobile.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
      navMobile.setAttribute("aria-hidden", "true");
    });
  });
}

/* ---------- Custom Cursor (candlestick -> crosshair on hover links/buttons) ---------- */
const cursor = document.getElementById("cursor");

let mx = window.innerWidth / 2;
let my = window.innerHeight / 2;
let cx = mx, cy = my;

window.addEventListener("mousemove", (e) => {
  mx = e.clientX;
  my = e.clientY;
}, { passive: true });

function cursorRAF(){
  // simple smooth follow (fast but buttery)
  cx += (mx - cx) * 0.22;
  cy += (my - cy) * 0.22;
  if(cursor) cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
  requestAnimationFrame(cursorRAF);
}
cursorRAF();

function setCrosshair(on){
  if(!cursor) return;
  cursor.classList.toggle("crosshair", on);
}

document.querySelectorAll("a, button, .btn, input, textarea").forEach(el => {
  el.addEventListener("mouseenter", () => setCrosshair(true));
  el.addEventListener("mouseleave", () => setCrosshair(false));
});

/* ---------- Smooth Scroll (Lenis) ---------- */
if(window.Lenis){
  const lenis = new Lenis({
    duration: 1.05,
    smoothWheel: true,
    smoothTouch: false
  });

  function raf(time){
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

/* ---------- Lightweight entrance animations (GSAP) ---------- */
window.addEventListener("load", () => {
  if(!window.gsap) return;

  gsap.from(".nav", { y: -14, opacity: 0, duration: 0.55, ease: "power2.out" });
  gsap.from(".hero .kicker", { y: 10, opacity: 0, duration: 0.55, delay: 0.1, ease: "power2.out" });
  gsap.from(".hero .heroTitle", { y: 16, opacity: 0, duration: 0.65, delay: 0.14, ease: "power2.out" });
  gsap.from(".hero .typeLine", { y: 12, opacity: 0, duration: 0.55, delay: 0.22, ease: "power2.out" });
  gsap.from(".hero .heroBtns .btn", { y: 10, opacity: 0, duration: 0.45, delay: 0.28, stagger: 0.08, ease: "power2.out" });
});

/* ---------- Contact form: fast validation (no backend yet) ---------- */
const form = document.getElementById("contactForm");
if(form){
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    // super light “success” feedback
    const btn = form.querySelector("button[type='submit']");
    if(btn){
      const old = btn.textContent;
      btn.textContent = "SENT";
      btn.style.borderColor = "rgba(0,255,65,.55)";
      setTimeout(()=>{ btn.textContent = old; }, 1200);
    }
    form.reset();
  });
}
