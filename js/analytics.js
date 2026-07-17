/* ============================================================
   SELLVORA — analytics (Umami Cloud)
   1. Crée un compte gratuit sur https://cloud.umami.is
   2. Ajoute le site (Settings → Websites → Add website)
   3. Copie le "Website ID" et colle-le ci-dessous entre les guillemets
   ============================================================ */
(function () {
  "use strict";

  var UMAMI_WEBSITE_ID = "15b76713-9029-401a-b6d2-a3d9a2632fde";

  if (!UMAMI_WEBSITE_ID) return;

  var s = document.createElement("script");
  s.defer = true;
  s.src = "https://cloud.umami.is/script.js";
  s.setAttribute("data-website-id", UMAMI_WEBSITE_ID);
  document.head.appendChild(s);
})();
