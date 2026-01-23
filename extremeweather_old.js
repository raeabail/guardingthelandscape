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
      "pre1980": "Historic flood observation points documented by the U.S. Geological Survey during the 1959 Indiana floods, illustrating flood impacts concentrated along established river corridors.",
      "2000s": "As development expanded around Camp Atterbury from the 1980s through the 2010s, areas of increased development increasingly coincided with higher downstream streamflow, as reflected in average monthly discharge.",
      "1967": "Late 1990s surveys at Camp Atterbury identified multiple Indiana bat maternity colonies. Figure shows mapped primary and alternate roost trees documented through 1997–2002 mist-netting and radio-telemetry studies, revealing core summer habitat along Nineveh Creek, the Driftwood River, and wooded corridors near the multi-impact training range.",
      "2020s": "Areas surrounding Camp Atterbury’s perimeter where floodplains, storm pathways, impervious surfaces, and access routes intersect, illustrating real-time operational exposure to multiple extreme weather hazards.",
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
      "pre1980": "https://experience.arcgis.com/experience/8701cea8c4f247aea6f6cee9028f5ed7",
      "2000s": "https://experience.arcgis.com/experience/68ae64bb6e64477a8edb854727c337bd",
      "1967": "https://experience.arcgis.com/experience/28a01ecb94b94e93ad0bb80da2c37f90",
      "2020s": "https://experience.arcgis.com/experience/608a664f91b94ac1b4d43ed3e48238a7",
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

/* ---------------------------------------------------------
   8. CASE STUDY MODALS
--------------------------------------------------------- */
document.querySelectorAll(".timeline-case-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const modalID = btn.getAttribute("data-case");
    const modal = document.getElementById(modalID);
    if (!modal) return;

    modal.classList.add("visible");
    document.body.style.overflow = "hidden";

    const slides = modal.querySelectorAll(".case-slide");
    const prevBtn = modal.querySelector(".case-prev");
    const nextBtn = modal.querySelector(".case-next");
    const counter = modal.querySelector(".case-counter");

    let index = 0;

    function showSlide(i) {
      slides.forEach(s => s.classList.remove("visible"));
      slides[i].classList.add("visible");

      if (counter) counter.textContent = `${i + 1} / ${slides.length}`;
      if (prevBtn) prevBtn.disabled = i === 0;
      if (nextBtn) nextBtn.disabled = i === slides.length - 1;
    }

    showSlide(index);

    if (prevBtn)
      prevBtn.onclick = () => { if (index > 0) showSlide(--index); };

    if (nextBtn)
      nextBtn.onclick = () => { if (index < slides.length - 1) showSlide(++index); };
  });
});



/* ---------------------------------------------------------
   9. CASE STUDY CLOSE
--------------------------------------------------------- */
document.querySelectorAll(".case-modal").forEach(modal => {
  const closeBtn = modal.querySelector(".case-modal-close");
  const overlay = modal.querySelector(".case-modal-overlay");

  function close() {
    modal.classList.remove("visible");
    document.body.style.overflow = "";
  }

  if (closeBtn) closeBtn.addEventListener("click", close);
  if (overlay) overlay.addEventListener("click", close);

  document.addEventListener("keydown", e => e.key === "Escape" && close());
});
});
