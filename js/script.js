/* ═══════════════════════════════════════════════════════════
   SMP IT Ibnu Abbas Klaten — interaksi & motion
   ═══════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ───────────── PRELOADER ───────────── */
  window.addEventListener("load", () => {
    const delay = reduceMotion ? 0 : 2000;
    setTimeout(() => {
      document.getElementById("preloader").classList.add("done");
      document.body.classList.add("loaded");
    }, delay);
  });
  // jaring pengaman bila 'load' terlambat (font eksternal dsb.)
  setTimeout(() => {
    document.getElementById("preloader").classList.add("done");
    document.body.classList.add("loaded");
  }, 4500);

  /* ───────────── NAVBAR: blur, hide-on-scroll ───────────── */
  const navbar = document.getElementById("navbar");
  const progress = document.getElementById("scrollProgress");
  const toTop = document.getElementById("toTop");
  const navLinks = document.getElementById("navLinks");
  let lastY = window.scrollY;

  function onScroll() {
    const y = window.scrollY;
    navbar.classList.toggle("scrolled", y > 40);
    // sembunyikan saat gulir turun, munculkan saat naik
    if (y > lastY && y > 320 && !navLinks.classList.contains("open")) {
      navbar.classList.add("hidden");
    } else {
      navbar.classList.remove("hidden");
    }
    lastY = y;

    // progress bar
    const h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";

    // tombol ke atas
    toTop.classList.toggle("show", y > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  toTop.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" })
  );

  /* ───────────── MENU MOBILE ───────────── */
  const hamburger = document.getElementById("hamburger");

  hamburger.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    hamburger.classList.toggle("open", open);
    hamburger.setAttribute("aria-expanded", open);
    document.body.style.overflow = open ? "hidden" : "";
  });
  navLinks.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      navLinks.classList.remove("open");
      hamburger.classList.remove("open");
      document.body.style.overflow = "";
    })
  );

  /* ───────────── SCROLLSPY ───────────── */
  const sections = document.querySelectorAll("main section[id]");
  const linkMap = new Map();
  document.querySelectorAll(".nav-link").forEach((l) => {
    linkMap.set(l.getAttribute("href").slice(1), l);
  });

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          linkMap.forEach((l) => l.classList.remove("active"));
          const link = linkMap.get(e.target.id);
          if (link) link.classList.add("active");
        }
      });
    },
    { rootMargin: "-42% 0px -52% 0px" }
  );
  sections.forEach((s) => spy.observe(s));

  /* ───────────── REVEAL ON SCROLL ───────────── */
  const revealObs = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in-view");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => revealObs.observe(el));

  /* ───────────── ANIMATED COUNTER ───────────── */
  const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10) || 0;
    const dur = 1800;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(easeOutExpo(p) * target).toLocaleString("id-ID");
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const counterObs = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          animateCounter(e.target);
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  document.querySelectorAll(".counter").forEach((c) => counterObs.observe(c));

  /* ───────────── TABS PILAR (sliding pill) ───────────── */
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabPill = document.getElementById("tabPill");
  const tabPanels = document.querySelectorAll(".tab-panel");

  function movePill(btn) {
    tabPill.style.left = btn.offsetLeft + "px";
    tabPill.style.width = btn.offsetWidth + "px";
  }

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabBtns.forEach((b) => b.classList.remove("active"));
      tabPanels.forEach((p) => p.classList.remove("active"));
      btn.classList.add("active");
      movePill(btn);
      document.getElementById(btn.dataset.tab).classList.add("active");
    });
    btn.addEventListener("mouseenter", () => {
      if (!btn.classList.contains("active")) movePill(btn);
    });
    btn.addEventListener("mouseleave", () => {
      const active = document.querySelector(".tab-btn.active");
      if (active) movePill(active);
    });
  });

  function initPill() {
    const active = document.querySelector(".tab-btn.active");
    if (active) movePill(active);
  }
  window.addEventListener("resize", initPill);
  // posisi pill setelah layout tab terlihat
  const tabsObs = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          initPill();
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.3 }
  );
  const tabsWrap = document.querySelector(".tabs");
  if (tabsWrap) tabsObs.observe(tabsWrap);

  /* ───────────── FILTER PRESTASI ───────────── */
  const chips = document.querySelectorAll(".filter-chip");
  const cards = document.querySelectorAll(".ach-card");

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      const f = chip.dataset.filter;

      // tahap 1: semua kartu mengecil-fade
      cards.forEach((c) => c.classList.add("fade-out"));

      // tahap 2: setelah transisi singkat, tampilkan yang cocok
      setTimeout(() => {
        cards.forEach((c) => {
          const match = f === "semua" || c.dataset.level === f;
          c.style.display = match ? "" : "none";
          c.classList.remove("fade-out");
          if (match) {
            // animasi masuk ulang dengan stagger kecil
            c.style.opacity = "0";
            c.style.transform = "scale(.94)";
            requestAnimationFrame(() => {
              c.style.transition = "opacity .45s var(--ease-out), transform .45s var(--ease-out)";
              c.style.opacity = "1";
              c.style.transform = "";
              setTimeout(() => (c.style.transition = ""), 500);
            });
          }
        });
      }, reduceMotion ? 0 : 260);
    });
  });

  /* ───────────── 3D TILT CARD ───────────── */
  if (!reduceMotion && window.matchMedia("(pointer:fine)").matches) {
    document.querySelectorAll(".tilt").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateX(${(-py * 7).toFixed(2)}deg) rotateY(${(px * 9).toFixed(2)}deg) translateY(-4px)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  /* ───────────── MAGNETIC BUTTON ───────────── */
  if (!reduceMotion && window.matchMedia("(pointer:fine)").matches) {
    document.querySelectorAll(".magnetic").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.18}px, ${y * 0.28}px)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "";
      });
    });
  }

  /* ───────────── PARALLAX ORNAMENT HERO ───────────── */
  const ornaments = document.querySelectorAll(".ornament");
  if (!reduceMotion) {
    window.addEventListener(
      "scroll",
      () => {
        const y = window.scrollY;
        ornaments.forEach((o, i) => {
          o.style.translate = `0 ${(y * (0.06 + i * 0.05)).toFixed(1)}px`;
        });
      },
      { passive: true }
    );
  }
})();
