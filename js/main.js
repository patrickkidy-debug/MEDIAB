/* ============================================================
   SELLVORA — interactions globales
   ============================================================ */
(function () {
  "use strict";

  /* --- Année dynamique --- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* --- Nav : ombre au scroll --- */
  var nav = document.getElementById("nav");
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle("is-scrolled", window.scrollY > 20);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* --- Menu mobile --- */
  var burger = document.getElementById("burger");
  var navLinks = document.getElementById("navLinks");
  if (burger && navLinks) {
    var toggleMenu = function (open) {
      navLinks.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    };
    burger.addEventListener("click", function () {
      toggleMenu(!navLinks.classList.contains("is-open"));
    });
    navLinks.addEventListener("click", function (e) {
      if (e.target.tagName === "A") toggleMenu(false);
    });
  }

  /* --- Révélations au scroll --- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach(function (el) {
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --- Barre de progression de lecture --- */
  var progress = document.createElement("div");
  progress.className = "scroll-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.appendChild(progress);
  var updateProgress = function () {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = "scaleX(" + (h > 0 ? window.scrollY / h : 0) + ")";
  };
  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress, { passive: true });

  /* --- Compteurs animés (bandeau statistiques) --- */
  var counters = document.querySelectorAll("[data-count]");
  function formatValue(el, value) {
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    var prefix = el.getAttribute("data-prefix") || "";
    var suffix = el.getAttribute("data-suffix") || "";
    return prefix + value.toFixed(decimals).replace(".", ",") + suffix;
  }
  function animateCounter(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    if (isNaN(target)) return;
    if (reducedMotion) {
      el.textContent = formatValue(el, target);
      return;
    }
    var duration = 1400;
    var start = null;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      el.textContent = formatValue(el, target * eased);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if ("IntersectionObserver" in window && counters.length) {
    var cio = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            cio.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(function (el) {
      el.textContent = formatValue(el, parseFloat(el.getAttribute("data-count")));
    });
  }

  /* --- Parallaxe légère sur l'illustration hero --- */
  var heroArt = document.querySelector(".hero__art");
  if (heroArt && !reducedMotion) {
    var parallax = function () {
      var y = window.scrollY;
      if (y < window.innerHeight) {
        heroArt.style.transform = "translateY(" + y * 0.06 + "px)";
      }
    };
    window.addEventListener("scroll", parallax, { passive: true });
  }

  /* --- FAQ accordéon --- */
  var faqItems = document.querySelectorAll(".faq__item");
  faqItems.forEach(function (item) {
    var btn = item.querySelector(".faq__q");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var isOpen = item.classList.contains("is-open");
      faqItems.forEach(function (other) {
        other.classList.remove("is-open");
        var b = other.querySelector(".faq__q");
        if (b) b.setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        item.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });
})();
