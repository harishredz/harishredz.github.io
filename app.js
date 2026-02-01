/* app.js — buttery smooth, lightweight, zero-lag interactions */

(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // -----------------------------
  // Helpers
  // -----------------------------
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // -----------------------------
  // Mobile nav toggle
  // -----------------------------
  const burger = $("#navBurger");
  const mobile = $("#navMobile");

  if (burger && mobile) {
    burger.addEventListener("click", () => {
      mobile.classList.toggle("open");
      burger.setAttribute("aria-expanded", mobile.classList.contains("open") ? "true" : "false");
    });

    // Close on click
    $$("#navMobile a").forEach((a) => {
      a.addEventListener("click", () => {
        mobile.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      });
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (!mobile.classList.contains("open")) return;
      const inside = mobile.contains(e.target) || burger.contains(e.target);
      if (!inside) {
        mobile.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      }
    });
  }

  // -----------------------------
  // Smooth scrolling (Lenis if available, else native)
  // -----------------------------
  let lenis = null;

  function initLenis() {
    if (prefersReduced) return;
    if (!window.Lenis) return;

    lenis = new window.Lenis({
      duration: 1.0,
      smoothWheel: true,
      smoothTouch: false,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.0
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Keep anchor jumps smooth via Lenis
    $$('.navLink[href^="#"], .navMobile a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        const el = $(id);
        if (!el) return;
        e.preventDefault();
        lenis.scrollTo(el, { offset: -110 });
      });
    });
  }

  initLenis();

  // Fallback native smooth scrolling if no Lenis
  if (!lenis) {
    $$('.navLink[href^="#"], .navMobile a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        const el = $(id);
        if (!el) return;
        e.preventDefault();
        const y = el.getBoundingClientRect().top + window.scrollY - 110;
        window.scrollTo({ top: y, behavior: prefersReduced ? "auto" : "smooth" });
      });
    });
  }

  // -----------------------------
  // Custom candlestick cursor + crosshair on interactive items
  // -----------------------------
  const cursor = $("#cursor");
  if (cursor && !prefersReduced) {
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let cx = mx;
    let cy = my;

    const speed = 0.18;

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
    };

    window.addEventListener("mousemove", onMove, { passive: true });

    function tick() {
      cx += (mx - cx) * speed;
      cy += (my - cy) * speed;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    const setCrosshair = (on) => {
      cursor.classList.toggle("crosshair", !!on);
    };

    const hoverables = "a, button, .btn, input, textarea, select, .navLink";
    document.addEventListener("pointerover", (e) => {
      if (e.target && e.target.closest(hoverables)) setCrosshair(true);
    });
    document.addEventListener("pointerout", (e) => {
      if (e.target && e.target.closest(hoverables)) setCrosshair(false);
    });
  }

  // -----------------------------
  // Typewriter line in hero
  // -----------------------------
  const typeEl = $("#typeText");
  if (typeEl && !prefersReduced) {
    const lines = [
      "Finance + markets. Built for speed. Built for impact.",
      "I turn messy data into clean decisions — budgets, valuation, dashboards.",
      "High-performance execution: analysis → action → results."
    ];

    let li = 0;
    let ci = 0;
    let deleting = false;

    const typeSpeed = 22;
    const deleteSpeed = 14;
    const hold = 900;

    function step() {
      const full = lines[li];
      const current = typeEl.textContent || "";

      if (!deleting) {
        const next = full.slice(0, current.length + 1);
        typeEl.textContent = next;

        if (next === full) {
          deleting = true;
          setTimeout(step, hold);
          return;
        }
        setTimeout(step, typeSpeed);
      } else {
        const next = full.slice(0, current.length - 1);
        typeEl.textContent = next;

        if (next.length === 0) {
          deleting = false;
          li = (li + 1) % lines.length;
          setTimeout(step, 240);
          return;
        }
        setTimeout(step, deleteSpeed);
      }
    }

    // initial
    typeEl.textContent = "";
    setTimeout(step, 350);
  }

  // -----------------------------
  // GSAP section reveals (if available)
  // -----------------------------
  function initGSAP() {
    if (prefersReduced) return;
    if (!window.gsap) return;

    // If ScrollTrigger isn't loaded, do simple load animation
    const gsap = window.gsap;

    const hero = $("#home");
    if (hero) {
      gsap.fromTo(
        hero.querySelectorAll(".kicker, .heroTitle, .typeLine, .heroBtns"),
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.08, ease: "power3.out" }
      );
    }

    if (!window.ScrollTrigger) return;

    gsap.registerPlugin(window.ScrollTrigger);

    $$(".section").forEach((sec) => {
      const targets = sec.querySelectorAll(".huge, .lead, .grid2 .card, .timeline .tCard, .hud .hudCol, .awards, .interestsGrid .card, .form");
      if (!targets.length) return;

      gsap.fromTo(
        targets,
        { y: 18, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.06,
          scrollTrigger: {
            trigger: sec,
            start: "top 78%",
            end: "bottom 60%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });
  }

  initGSAP();

  // -----------------------------
  // Contact form: mailto fallback (no backend)
  // -----------------------------
  const form = $("#contactForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = ($("#name")?.value || "").trim();
      const email = ($("#email")?.value || "").trim();
      const msg = ($("#message")?.value || "").trim();

      const subject = encodeURIComponent(`Portfolio Contact — ${name || "Visitor"}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${msg}\n`
      );

      // Put your email here if different
      const to = "harishreddyice@gmail.com";
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;

      form.reset();
    });
  }

  // -----------------------------
  // Performance: pause tickers if tab hidden (optional micro win)
  // -----------------------------
  const tickers = $$(".tickerInner");
  document.addEventListener("visibilitychange", () => {
    const paused = document.hidden;
    tickers.forEach((t) => (t.style.animationPlayState = paused ? "paused" : "running"));
  });
})();
