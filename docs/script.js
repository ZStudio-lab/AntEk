// AntEk landing page — small progressive-enhancement layer.
// No trackers, no third-party requests. Everything degrades gracefully with JS disabled.

(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --- Sticky header + scroll progress ---------------------------------- */
  const header = document.querySelector(".site-header");
  const progress = document.getElementById("scrollProgress");

  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 8);
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      progress.style.width = Math.min(100, Math.max(0, pct)) + "%";
    }
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });

  /* --- Reveal on scroll ------------------------------------------------- */
  const targets = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("in"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    targets.forEach((el) => observer.observe(el));
  }

  /* --- Active nav link -------------------------------------------------- */
  const navLinks = Array.from(document.querySelectorAll(".nav-links a[href^='#']"));
  const sections = navLinks
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = "#" + entry.target.id;
          navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === id));
        }
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* --- Cursor spotlight on feature cards -------------------------------- */
  if (!reduceMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.querySelectorAll(".card").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", Math.round(e.clientX - r.left) + "px");
        card.style.setProperty("--my", Math.round(e.clientY - r.top) + "px");
      });
    });
  }

  /* --- Screenshot gallery ----------------------------------------------- */
  const galleryImg = document.getElementById("galleryImg");
  const galleryCap = document.getElementById("galleryCap");
  const tabs = Array.from(document.querySelectorAll(".gallery-tab"));
  let current = Math.max(0, tabs.findIndex((t) => t.classList.contains("is-active")));

  const show = (index, focusTab) => {
    if (!tabs.length || !galleryImg) return;
    current = (index + tabs.length) % tabs.length;
    const tab = tabs[current];

    tabs.forEach((t, i) => {
      const active = i === current;
      t.classList.toggle("is-active", active);
      t.setAttribute("aria-selected", String(active));
      t.tabIndex = active ? 0 : -1;
    });

    galleryImg.src = tab.dataset.shot;
    galleryImg.alt = tab.dataset.alt || "";
    if (galleryCap) galleryCap.textContent = tab.dataset.cap || "";
    if (focusTab) tab.focus();
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => show(i));
    // Arrow-key navigation, as expected of a real tablist.
    tab.addEventListener("keydown", (e) => {
      const to = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (to) { e.preventDefault(); show(i + to, true); }
      else if (e.key === "Home") { e.preventDefault(); show(0, true); }
      else if (e.key === "End") { e.preventDefault(); show(tabs.length - 1, true); }
    });
  });

  /* --- Lightbox --------------------------------------------------------- */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  if (lightbox && lightboxImg) {
    const closeBtn = document.getElementById("lightboxClose");
    let lastFocus = null;

    const open = () => {
      if (!galleryImg) return;
      lastFocus = document.activeElement;
      lightboxImg.src = galleryImg.src;
      lightboxImg.alt = galleryImg.alt;
      lightbox.hidden = false;
      requestAnimationFrame(() => lightbox.classList.add("open"));
      document.body.style.overflow = "hidden";
      closeBtn.focus();
    };

    const close = () => {
      lightbox.classList.remove("open");
      document.body.style.overflow = "";
      window.setTimeout(() => {
        lightbox.hidden = true;
        lightboxImg.removeAttribute("src");
      }, reduceMotion ? 0 : 220);
      if (lastFocus) lastFocus.focus();
    };

    const openAt = () => open();
    const step = (dir) => {
      show(current + dir);
      lightboxImg.src = galleryImg.src;
      lightboxImg.alt = galleryImg.alt;
    };

    const zoom = document.getElementById("galleryZoom");
    if (zoom) zoom.addEventListener("click", openAt);

    document.getElementById("lightboxPrev").addEventListener("click", () => step(-1));
    document.getElementById("lightboxNext").addEventListener("click", () => step(1));
    closeBtn.addEventListener("click", close);
    lightbox.addEventListener("click", (e) => { if (e.target === lightbox) close(); });

    document.addEventListener("keydown", (e) => {
      if (lightbox.hidden) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "ArrowRight") step(1);
    });
  }
})();
