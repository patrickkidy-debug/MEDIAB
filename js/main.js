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
