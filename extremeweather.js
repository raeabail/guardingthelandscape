document.addEventListener("DOMContentLoaded", () => {
console.log("Script loaded!");

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

console.log("mapDisplay:", mapDisplay);
console.log("steps found:", steps.length);

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

    // ⬇️ Set your map URLs for each timeline step - MUST BE BEFORE loadMapForStep
    // Note: Timeline steps can have a single source (string) or multiple sources (array)
    const MAPS = {
      "pre1980": "https://experience.arcgis.com/experience/8701cea8c4f247aea6f6cee9028f5ed7",
      "2000s": "https://experience.arcgis.com/experience/68ae64bb6e64477a8edb854727c337bd",
      "2010s": [
        "images/EastFWR_flooding.png",
        "images/flatrock_flooding.png"
      ],
      "2020s": "https://experience.arcgis.com/experience/608a664f91b94ac1b4d43ed3e48238a7",
      "2050": "https://livingatlas.arcgis.com/assessment-tool/search"
    };

    // ⬇️ Set your captions for each timeline step
    const MAP_CAPTIONS = {
      "pre1980": "Historic flood observation points (numbered above) documented by the U.S. Geological Survey during the 1959 Indiana floods, illustrating flood impacts concentrated along established river corridors.",
      "2000s": "As development expanded around Camp Atterbury from the 1980s through the 2010s, areas of increased development increasingly coincided with higher downstream streamflow, as reflected in average monthly discharge.",
      "2010s": [
        "East Fork White River floodplain expansion in Bartholomew County, showing FEMA-mapped flood zones extending adjacent to Camp Atterbury's southern perimeter where development and flood-prone areas increasingly overlap.",
        "Flat Rock Creek floodplain mapping near Camp Atterbury's eastern boundary, illustrating how tributary flooding and localized stormwater drainage affect training access roads and buffer zone infrastructure."
      ],
      "2020s": "Areas surrounding Camp Atterbury's perimeter where floodplains, storm pathways, impervious surfaces, and access routes intersect, illustrating real-time operational exposure to multiple extreme weather hazards.",
      "2050": "Use NOAA's Mapping For Resilience and Adaptation Tool above to explore future projections for extreme weather hazards. Type in <b>Johnson County, Bartholomew County, or Brown County</b> to see forecasts for flooding, wildfire, extreme heat, and drought impacts. Choose between two emission scenarios (<b>Lower Emissions</b> or <b>Higher Emissions</b>) and time periods: <b>early century (2015-2044), mid century (2035-2064), or late century (2070-2099)</b>. Make tool full screen for access to all features. A user guide is available: https://resilience.climate.gov/pages/user-guide"
    };

    const captionEl = document.getElementById("mapCaption");
    mapDisplay.style.transition = `opacity ${FADE_DURATION}ms ease-in-out`;

    // Track current slide index for multi-source steps
    let currentSlideIndex = 0;
    let currentStepSources = null;

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

    function loadMapForStep(stepEl, slideIndex = 0) {
  if (!stepEl) return;

  const step = stepEl.dataset.step;
  const mapData = MAPS[step];
  
  if (!mapData) {
    console.warn(`No map data found for step: ${step}`);
    return;
  }
  
  // Determine if this step has multiple sources
  const isMultiSource = Array.isArray(mapData);
  const sources = isMultiSource ? mapData : [mapData];
  const captions = Array.isArray(MAP_CAPTIONS[step]) ? MAP_CAPTIONS[step] : [MAP_CAPTIONS[step]];
  
  currentStepSources = sources;
  currentSlideIndex = Math.min(slideIndex, sources.length - 1);
  
  const src = sources[currentSlideIndex];
  
  if (!src) {
    console.warn(`No source found for step: ${step}, index: ${currentSlideIndex}`);
    return;
  }
  
  const caption = captions[currentSlideIndex] || captions[0] || "";

  if (captionEl) captionEl.classList.remove("visible");

  // Build navigation arrows HTML if multiple sources
  const navHTML = isMultiSource ? `
    <div class="map-nav-arrows">
      <button class="map-nav-btn map-nav-prev" ${currentSlideIndex === 0 ? 'disabled' : ''}>
        <span>‹</span>
      </button>
      <span class="map-nav-counter">${currentSlideIndex + 1} / ${sources.length}</span>
      <button class="map-nav-btn map-nav-next" ${currentSlideIndex === sources.length - 1 ? 'disabled' : ''}>
        <span>›</span>
      </button>
    </div>
  ` : '';

  // Fullscreen button HTML
  const fullscreenHTML = `
    <button class="map-fullscreen-btn" aria-label="Toggle fullscreen" title="Toggle fullscreen">
      <span class="fullscreen-icon">⛶</span>
    </button>
  `;

  // Check if it's an image
  if (src && src.match(/\.(png|jpg|jpeg|webp)$/i)) {
    fadeSwapMap(`
      <img src="${src}" 
           class="static-map-image" 
           style="width:100%; height:auto; display:block;"/>
      ${navHTML}
      ${fullscreenHTML}
    `);
  } 
  // Check if it's a PDF
  else if (src && src.match(/\.pdf$/i)) {
    fadeSwapMap(`
      <iframe src="${src}" 
              style="width:100%; height:100%; border:none;" 
              type="application/pdf"></iframe>
      ${navHTML}
      ${fullscreenHTML}
    `);
  }
  // Otherwise load it as an iframe (for ArcGIS experiences)
  else {
    fadeSwapMap(`
      <iframe src="${src}"></iframe>
      ${navHTML}
      ${fullscreenHTML}
    `);
  }

  // Attach event listeners to navigation buttons
  if (isMultiSource) {
    setTimeout(() => {
      const prevBtn = mapDisplay.querySelector('.map-nav-prev');
      const nextBtn = mapDisplay.querySelector('.map-nav-next');
      
      if (prevBtn) {
        prevBtn.onclick = () => {
          if (currentSlideIndex > 0) {
            loadMapForStep(stepEl, currentSlideIndex - 1);
          }
        };
      }
      
      if (nextBtn) {
        nextBtn.onclick = () => {
          if (currentSlideIndex < sources.length - 1) {
            loadMapForStep(stepEl, currentSlideIndex + 1);
          }
        };
      }
    }, FADE_DURATION);
  }

  // Attach fullscreen button event listener
  setTimeout(() => {
    const fullscreenBtn = mapDisplay.querySelector('.map-fullscreen-btn');
    if (fullscreenBtn) {
      fullscreenBtn.onclick = () => {
        // Target the actual content (iframe or img) for fullscreen
        const content = mapDisplay.querySelector('iframe, img');
        if (content) {
          if (!document.fullscreenElement) {
            content.requestFullscreen().catch(err => {
              console.error('Fullscreen request failed:', err);
            });
          } else {
            document.exitFullscreen();
          }
        }
      };
    }
  }, FADE_DURATION);

  // Show caption after fade-in
  if (captionEl) {
    setTimeout(() => {
      captionEl.innerHTML = caption;
      captionEl.classList.add("visible");
    }, FADE_DURATION);
  }
}

  function pickActiveStep() {
    const stickyMap = document.querySelector(".sticky-map");
    console.log("pickActiveStep called, stickyMap:", stickyMap);
    
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
    console.log("Selected candidate:", candidate ? candidate.dataset.step : "none");

    if (candidate !== currentStep) {
      currentStep = candidate;
      currentSlideIndex = 0; // Reset to first slide when changing steps
      activateStep(candidate);
      loadMapForStep(candidate);
    }
  }

  window.addEventListener("scroll", pickActiveStep, { passive: true });
  window.addEventListener("resize", pickActiveStep);
  console.log("About to call pickActiveStep initially");
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
