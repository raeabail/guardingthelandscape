document.addEventListener("DOMContentLoaded", () => {

/* ---------------------------------------------------------
   1. FADE-IN REVEAL ANIMATIONS
--------------------------------------------------------- */
const faders = document.querySelectorAll(".fade-in, .slide-up");
const appearOptions = { threshold: 0.2, rootMargin: "0px 0px -50px 0px" };

const appearOnScroll = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      obs.unobserve(entry.target);
    }
  });
}, appearOptions);

faders.forEach(el => appearOnScroll.observe(el));



/* ---------------------------------------------------------
   2. ACCORDION
--------------------------------------------------------- */
const accHeaders = document.querySelectorAll(".acc-header");

accHeaders.forEach(header => {
  header.addEventListener("click", function () {
    const expanded = this.getAttribute("aria-expanded") === "true";
    accHeaders.forEach(h => h.setAttribute("aria-expanded", "false"));
    if (!expanded) this.setAttribute("aria-expanded", "true");
  });
});


/* ---------------------------------------------------------
   3. TIMELINE SAFETY CHECK
--------------------------------------------------------- */
const mapDisplay = document.getElementById("mapDisplay");
const steps = Array.from(document.querySelectorAll(".timeline-step"));

if (mapDisplay) {
  mapDisplay.style.position = "relative";
  mapDisplay.style.overflow = "hidden";
}



/* ---------------------------------------------------------
   4. TAB NAVIGATION
--------------------------------------------------------- */
const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".tab-panel");

if (tabs.length && panels.length) {
  tabs.forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-tab");

      tabs.forEach(t => t.classList.remove("active"));
      panels.forEach(p => p.classList.remove("active"));

      btn.classList.add("active");
      const panel = document.getElementById(id);
      if (panel) {
        panel.classList.add("active");
        panel.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}



/* ---------------------------------------------------------
   5. KEYBOARD NAV FOR TABS
--------------------------------------------------------- */
document.addEventListener("keydown", e => {
  const index = [...tabs].findIndex(t => t.classList.contains("active"));
  if (index >= 0) {
    if (e.key === "ArrowRight") tabs[(index + 1) % tabs.length]?.click();
    if (e.key === "ArrowLeft") tabs[(index - 1 + tabs.length) % tabs.length]?.click();
  }
});



/* ---------------------------------------------------------
   6. PARALLAX
--------------------------------------------------------- */
const parallaxElements = document.querySelectorAll(".parallax-bg");

if (parallaxElements.length) {
  window.addEventListener("scroll", () => {
    parallaxElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const offset = rect.top * 0.25;
      el.style.transform = `translateY(${offset}px)`;
    });
  });
}



/* ============================================================
     7. TIMELINE MAP SYNC
  ============================================================ */

  if (mapDisplay && steps.length) {
    const FADE_DURATION = 350;
    let currentStep = null;

    // ⬇️ Set your captions for each timeline step
    const MAP_CAPTIONS = {
      "pre1940": "Historical plat maps from the 1920s–1940s reveal a pre-establishment landscape of small farms, pastures, scattered woodlots, and rural communities. Together with the forested hills of Brown County, these areas provided suitable roosting and foraging habitat for Indiana and Northern long-eared bats prior to Camp Atterbury’s establishment.",
      "1940s": "The 1960 aerial (left) captures Atterbury’s preserved interior forests during the installation’s early decades. Modern land cover (right) shows increased surrounding development, emphasizing Atterbury’s role in maintaining intact bat habitat.",
      "1967": "Late 1990s surveys at Camp Atterbury identified multiple Indiana bat maternity colonies. Figure shows mapped primary and alternate roost trees documented through 1997–2002 mist-netting and radio-telemetry studies, revealing core summer habitat along Nineveh Creek, the Driftwood River, and wooded corridors near the multi-impact training range.",
      "2000s": "Land-cover change from 2000 (left) to 2010 (right) shows rapid suburban growth in Johnson County, shrinking forest blocks and increasing fragmentation near Franklin, Whiteland, and Edinburgh.",
      "2015": "The Northern long-eared bat was listed as threatened in 2015 (endangered in 2023) due to white-nose syndrome and habitat loss. This change coincided with rising development pressures around Camp Atterbury, increasing ESA compliance needs as forest corridors narrowed.",
      "2050": "Projected changes in habitat suitability for the Indiana bat under multiple scenarios through mid-century. Red areas indicate regions where suitable habitat is expected to contract, expand, or shift over time as environmental conditions change."
    };

    const captionEl = document.getElementById("mapCaption");
    mapDisplay.style.transition = `opacity ${FADE_DURATION}ms ease-in-out`;

    function activateStep(step) {
      steps.forEach(s => s.classList.remove("active"));
      step.classList.add("active");
    }

    function fadeSwapMap(html) {
      mapDisplay.style.opacity = "0";
      setTimeout(() => {
        mapDisplay.innerHTML = html;
        mapDisplay.style.opacity = "1";
      }, FADE_DURATION);
    }

    function loadMapForStep(stepEl) {
  if (!stepEl) return;

  const step = stepEl.dataset.step;
  const src = MAPS[step]; // <-- Must read from MAPS BEFORE using it

  if (captionEl) captionEl.classList.remove("visible");

  // If it's an image (PNG/JPG/etc), load it as an <img>
  if (src.match(/\.(png|jpg|jpeg|webp)$/i)) {
    fadeSwapMap(`
      <img src="${src}" 
           class="static-map-image" 
           style="width:100%; height:auto; display:block;"/>
    `);

    // show caption after fade-in
    if (captionEl) {
      setTimeout(() => {
        captionEl.textContent = MAP_CAPTIONS[step] || "";
        captionEl.classList.add("visible");
      }, FADE_DURATION);
    }

    return; // IMPORTANT: stop execution here
  }

  // Otherwise load it as an iframe
  fadeSwapMap(`<iframe src="${src}"></iframe>`);

  // Caption
  if (captionEl) {
    setTimeout(() => {
      captionEl.textContent = MAP_CAPTIONS[step] || "";
      captionEl.classList.add("visible");
    }, FADE_DURATION);
  }
}

    // ⬇️ Set your map URLs for each timeline step
    const MAPS = {
      "pre1940": "https://experience.arcgis.com/experience/99a1d7cc48714142adfa1aa41d5a649d",
      "1940s": "https://experience.arcgis.com/experience/095b6a4ddec8428f80b7263adaa69232",
      "1967": "https://experience.arcgis.com/experience/28a01ecb94b94e93ad0bb80da2c37f90",
      "2000s": "https://experience.arcgis.com/experience/409e917dd6fd435da9eb6067fe5c1aa6",
      "2015": "images/NLEB.png",
      "2050": "images/indianabat_futurescenarios.jpg"
    };

  function pickActiveStep() {
    const stickyMap = document.querySelector(".sticky-map");
    const triggerY = stickyMap.getBoundingClientRect().height * 0.50;

    let candidate = null;
    let topVal = -Infinity;

    steps.forEach(step => {
      const rect = step.getBoundingClientRect();
      if (rect.top <= triggerY && rect.bottom > 0 && rect.top > topVal) {
        topVal = rect.top;
        candidate = step;
      }
    });

    if (!candidate) candidate = steps[0];

    if (candidate !== currentStep) {
      currentStep = candidate;
      activateStep(candidate);
      loadMapForStep(candidate);
    }
  }

  window.addEventListener("scroll", pickActiveStep, { passive: true });
  window.addEventListener("resize", pickActiveStep);
  pickActiveStep();
}

/* ============================================================
   8. SPECIES CARD FLIP INTERACTION
============================================================ */

const flipCards = document.querySelectorAll(".species-card .flip");

flipCards.forEach(btn => {
  btn.addEventListener("click", () => {
    const expanded = btn.getAttribute("aria-expanded") === "true";

    // Close all other cards
    flipCards.forEach(b => b.setAttribute("aria-expanded", "false"));

    // Toggle current card
    btn.setAttribute("aria-expanded", expanded ? "false" : "true");
  });
});


  /* ============================================================
     4. SWIPE + FORECAST PLACEHOLDERS
  ============================================================ */

  const swipe = document.getElementById("swipe-container");
  if (swipe) {
    swipe.innerHTML = "<div class='map-placeholder'>[Swipe map comparison coming soon]</div>";
  }

  const forecast = document.getElementById("forecastMap");
  if (forecast) {
    forecast.innerHTML = "<div class='map-placeholder'>[2050 habitat forecast coming soon]</div>";
  }
});


/* ============================================================
   5. Progressive Image Loader Helpers
============================================================ */
function resourceExists(url) {
  return fetch(url, { method: 'HEAD' }).then(r => r.ok).catch(() => false);
}

function trySmallVariant(src) {
  const candidates = [
    src.replace(/(\.[^/.]+)$/, '-small$1'),
    src.replace(/(\.[^/.]+)$/, '-thumb$1'),
    src.replace(/(\.[^/.]+)$/, '.webp')
  ];
  return new Promise(async resolve => {
    for (const c of candidates) {
      try {
        if (await resourceExists(c)) return resolve(c);
      } catch (e) {}
    }
    resolve(null);
  });
}

function progressiveLoadImg(imgEl, src) {
  imgEl.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"></svg>';
  imgEl.loading = 'lazy';
  trySmallVariant(src).then(small => {
    if (small) imgEl.src = small;
    const full = new Image();
    full.onload = () => {
      imgEl.src = src;
      imgEl.loading = 'eager';
    };
    full.src = src;
  }).catch(() => {
    const full = new Image();
    full.onload = () => {
      imgEl.src = src;
      imgEl.loading = 'eager';
    };
    full.src = src;
  });
}
