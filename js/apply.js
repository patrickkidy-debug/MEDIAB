/* ============================================================
   SELLVORA — formulaire de candidature multi-étapes
   ============================================================ */
(function () {
  "use strict";

  var form = document.getElementById("applyForm");
  if (!form) return;

  var steps = Array.prototype.slice.call(form.querySelectorAll(".form-step"));
  var stepperItems = Array.prototype.slice.call(document.querySelectorAll(".stepper__item"));
  var current = 0;

  /* --- Pré-sélection du pack via ?pack= --- */
  var params = new URLSearchParams(window.location.search);
  var packParam = params.get("pack");
  if (packParam) {
    var packRadio = form.querySelector('input[name="pack"][value="' + packParam + '"]');
    if (packRadio) packRadio.checked = true;
  }

  /* --- Affichage d'une étape --- */
  function showStep(index) {
    steps.forEach(function (s, i) {
      s.classList.toggle("is-active", i === index);
    });
    stepperItems.forEach(function (item, i) {
      item.classList.toggle("is-active", i === index);
      item.classList.toggle("is-done", i < index);
    });
    current = index;
    window.scrollTo({ top: 0, behavior: "smooth" });
    // focus premier champ pour l'accessibilité
    var firstField = steps[index].querySelector("input, select, textarea");
    if (firstField) setTimeout(function () { firstField.focus(); }, 300);
  }

  /* --- Validation d'un champ --- */
  function markField(field, ok) {
    var wrapper = field.closest(".field");
    if (wrapper) wrapper.classList.toggle("has-error", !ok);
  }

  function validateStep(index) {
    var step = steps[index];
    var valid = true;
    var firstInvalid = null;

    // champs requis input/select/textarea
    var fields = step.querySelectorAll("input[required], select[required], textarea[required]");
    fields.forEach(function (f) {
      if (f.type === "checkbox") return; // gérés à part
      var ok = f.checkValidity() && f.value.trim() !== "";
      if (f.tagName === "TEXTAREA" && f.minLength > 0) {
        ok = f.value.trim().length >= f.minLength;
      }
      markField(f, ok);
      if (!ok && !firstInvalid) firstInvalid = f;
      valid = valid && ok;
    });

    // étape 3 : au moins un objectif
    if (index === 2) {
      var checked = step.querySelectorAll('input[name="objectifs"]:checked').length;
      var objErr = document.getElementById("objErr");
      if (objErr) objErr.style.display = checked ? "none" : "block";
      if (!checked && !firstInvalid) firstInvalid = step.querySelector('input[name="objectifs"]');
      valid = valid && checked > 0;

      // choix du pack obligatoire
      var packChecked = step.querySelectorAll('input[name="pack"]:checked').length;
      var packErr = document.getElementById("packErr");
      if (packErr) packErr.style.display = packChecked ? "none" : "block";
      if (!packChecked && !firstInvalid) firstInvalid = step.querySelector('input[name="pack"]');
      valid = valid && packChecked > 0;
    }

    // étape 4 : consentement
    if (index === 3) {
      var consent = document.getElementById("consent");
      var consentErr = document.getElementById("consentErr");
      var cok = consent && consent.checked;
      if (consentErr) consentErr.style.display = cok ? "none" : "block";
      if (!cok && !firstInvalid) firstInvalid = consent;
      valid = valid && cok;
    }

    if (firstInvalid) firstInvalid.focus();
    return valid;
  }

  /* --- Navigation entre étapes --- */
  form.addEventListener("click", function (e) {
    var next = e.target.closest("[data-next]");
    var prev = e.target.closest("[data-prev]");
    if (next) {
      if (validateStep(current)) showStep(Math.min(current + 1, steps.length - 1));
    }
    if (prev) {
      showStep(Math.max(current - 1, 0));
    }
  });

  /* --- Compteur de caractères présentation --- */
  var textarea = document.getElementById("presentation");
  var counter = document.getElementById("charCount");
  if (textarea && counter) {
    textarea.addEventListener("input", function () {
      var len = textarea.value.trim().length;
      counter.textContent = len + (len > 1 ? " caractères" : " caractère") + " · minimum 200";
      counter.classList.toggle("is-ok", len >= 200);
      if (len >= 200) {
        var w = textarea.closest(".field");
        if (w) w.classList.remove("has-error");
      }
    });
  }

  /* --- Nettoyage d'erreur à la saisie --- */
  form.addEventListener("input", function (e) {
    var f = e.target;
    if (f.matches("input, select, textarea")) {
      var wrapper = f.closest(".field");
      if (wrapper && wrapper.classList.contains("has-error")) {
        var ok = f.checkValidity() && f.value.trim() !== "";
        if (f.tagName === "TEXTAREA" && f.minLength > 0) ok = f.value.trim().length >= f.minLength;
        if (ok) wrapper.classList.remove("has-error");
      }
    }
  });

  /* --- Soumission : envoi réel par email via FormSubmit --- */
  var ENDPOINT = "https://formsubmit.co/ajax/patrickkidy@gmail.com";

  function showConfirmation() {
    form.hidden = true;
    var stepper = document.getElementById("stepper");
    if (stepper) stepper.hidden = true;
    var confirmation = document.getElementById("confirmation");
    if (confirmation) {
      confirmation.hidden = false;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validateStep(current)) return;

    var submitBtn = document.getElementById("submitBtn");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Envoi en cours…";
    }

    var data = new FormData(form);
    var entreprise = data.get("entreprise") || "";
    data.append("_subject", "Nouvelle candidature Sellvora — " + entreprise);
    data.append("_template", "table");
    data.append("_captcha", "false");

    fetch(ENDPOINT, {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" }
    })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function () {
        showConfirmation();
      })
      .catch(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Envoyer ma candidature";
        }
        alert(
          "L'envoi a échoué. Vérifiez votre connexion internet puis réessayez.\n" +
          "Si le problème persiste, contactez-nous directement sur WhatsApp."
        );
      });
  });
})();
