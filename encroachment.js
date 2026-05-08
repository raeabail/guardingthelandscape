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



/* ---------------------------------------------------------
   7. TIMELINE MAP SYNC
--------------------------------------------------------- */

if (mapDisplay && steps.length) {
  const FADE_DURATION = 350;
  let currentStep = null;

  const MAP_CAPTIONS = {
    "1940s": "By 1960, aerial imagery (left) and land cover (right) data depict a landscape dominated by agriculture on the north, east, and south sides of Camp Atterbury (black outline), contrasted by intact forest and natural buffers to the west.",
    "1970s": "The 1980-today land use comparison shows how early lake developments evolved into dense residential clusters, fragmenting what had been an uninterrupted forest landscape.",
    "2000s": "Encroachment patterns appear in the NLCD Land Cover Explorer as development expands along major corridors toward Camp Atterbury. Areas in red show increasing developed land and farmland conversion during the 2000s–2010s, with implications for habitat connectivity, stormwater runoff, and training area access.",
    "2010s": "Floodplain overlays illustrate where recent zoning proposals and parcel-level development intersect flood-fringe areas, highlighting locations where land conversion may increase long-term flood exposure and management complexity.",
    "2050": "The Farms Under Threat 2040 tool shows how different development scenarios could shape land use across counties in the United States. As you compare scenarios around Camp Atterbury, notice how growth along major corridors near Camp Atterbury changes under each pathway, influencing farmland retention, habitat connectivity, and the extent of compatible-use buffers."
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
    if (captionEl) captionEl.classList.remove("visible");

    const MAPS = {
      "1940s": `https://experience.arcgis.com/experience/4d4c96d5e44a4caaaffb0b7eee5fd166`,
      "1970s": `https://experience.arcgis.com/experience/e42708ebe78440f58d0084b5ffaf1bb0`,
      "2000s": `https://livingatlas.arcgis.com/nlcdlandcoverexplorer/#mapCenter=-85.96885%2C39.34992%2C11.22&mode=step&timeExtent=2001%2C2010&renderingRule=1&year=2023`,
      "2010s": `https://experience.arcgis.com/experience/6fc0c2e7ab5442d58ca0957ab70954d4`,
      "2050": `https://development2040.farmland.org/`
    };

    fadeSwapMap(`<iframe src="${MAPS[step]}"></iframe>`);

    if (captionEl) {
      setTimeout(() => {
        captionEl.textContent = MAP_CAPTIONS[step] || "";
        captionEl.classList.add("visible");
      }, FADE_DURATION);
    }
  }

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

    // If no step is in view, keep the last step active (don't reset to first)
    if (!candidate && currentStep) {
      // Check if we've scrolled past all steps
      const lastStepRect = steps[steps.length - 1].getBoundingClientRect();
      if (lastStepRect.bottom < 0) {
        candidate = steps[steps.length - 1];
      } else {
        candidate = steps[0];
      }
    } else if (!candidate) {
      candidate = steps[0];
    }

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

    // Only set up slide navigation if this modal has slides
    if (slides.length > 0 && prevBtn && nextBtn) {
      let index = 0;

      function showSlide(i) {
        slides.forEach(s => s.classList.remove("visible"));
        slides[i].classList.add("visible");

        if (counter) counter.textContent = `${i + 1} / ${slides.length}`;
        prevBtn.disabled = i === 0;
        nextBtn.disabled = i === slides.length - 1;
      }

      showSlide(index);

      prevBtn.onclick = () => { if (index > 0) showSlide(--index); };
      nextBtn.onclick = () => { if (index < slides.length - 1) showSlide(++index); };
    }
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



/* ---------------------------------------------------------
   10. AUTO-SIZE TIMELINE HEIGHT
--------------------------------------------------------- */
function updateStickyScrollHeight() {
  const timelineFlex = document.querySelector(".timeline"); 
  const stickyMap = document.querySelector(".sticky-map");
  const stepsContainer = document.querySelector(".timeline-steps");

  if (!timelineFlex || !stickyMap || !stepsContainer) return;

  const stickyHeight = stickyMap.offsetHeight;
  const stepsHeight = stepsContainer.scrollHeight;
  const releaseOffset = stickyHeight * 0.75;

  const required = stepsHeight + releaseOffset + window.innerHeight * 0.25;
  timelineFlex.style.minHeight = required + "px";
}

window.addEventListener("load", updateStickyScrollHeight);
window.addEventListener("resize", updateStickyScrollHeight);



/* ---------------------------------------------------------
   ⭐ 11. FIXED + CLEANED EVA MODAL LOGIC ⭐
--------------------------------------------------------- */

const evaModal = document.getElementById("evaModal");
console.log("EVA Modal element:", evaModal);

if (evaModal) {
  console.log("EVA Modal found! Setting up event listeners...");
  const evaDefault = evaModal.querySelector(".eva-default");
  const evaBody = evaModal.querySelector(".eva-body");
  const evaContent = evaModal.querySelector(".eva-content");

  // OPEN: Interactive Map
  const evaButtons = document.querySelectorAll(".eva-btn");
  console.log("Found eva-btn buttons:", evaButtons.length);
  
  evaButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      console.log("EVA Interactive Map button clicked!");
      const link = btn.dataset.eva;
      console.log("Link:", link);

      evaDefault.style.display = "block";
      evaBody.style.display = "none";
      evaBody.innerHTML = "";
      if (evaContent) evaContent.classList.remove("showing-summary");

      evaModal.classList.add("visible");
      document.body.style.overflow = "hidden";

      const launchBtn = document.getElementById("evaLaunch");
      if (launchBtn && link) {
        // Store the link on the button itself
        launchBtn.dataset.mapUrl = link;
        launchBtn.onclick = () => {
          const url = launchBtn.dataset.mapUrl;
          console.log("Launch Map clicked! Opening:", url);
          if (url) {
            window.open(url, "_blank");
          }
        };
      }
    });
  });


  // OPEN: Summary Results
  document.querySelectorAll("[data-eva-summary]").forEach(btn => {
  btn.addEventListener("click", () => {
    const county = btn.getAttribute("data-eva-summary");

const EVA_TEXT = {
  brown: `<h3>Brown County (Low to Moderate Development Pressure) <span class="eva-cite" title="Source: MRLC Consortium, National Land Cover Database (NLCD), accessed via EVA (Enhanced Visualization and Analysis) tool, 1985 to 2024"></span></h3>
  <h4>Landscape Change Summary</h4>
  <ul>
    <li>Brown County experienced approximately <b>5.55% total land cover change</b> from 1985 to 2024, representing a relatively low rate compared to surrounding counties.</li>
    <li>The county remains <b>predominantly deciduous forest</b> in both 1985 and 2024, with forest continuing to form the dominant land cover class.</li>
    <li>Most land cover transitions reflect <b>forest shifting to low-density development</b>, shrub or grassland, or lightly modified rural residential areas.</li>
    <li><b>High-intensity development (HID)</b> remains limited in extent.</li>
    <li>Red change pixels in EVA maps cluster primarily around <b>lake communities and ridge-top parcels</b>, consistent with dispersed, amenity-driven development patterns.</li>
  </ul>
  <h4>Encroachment Relevance</h4>
  <ul>
    <li>Brown County’s land use change is <b>fragmented and generally low-intensity</b>, contributing moderate encroachment pressure along Camp Atterbury’s western edge.</li>
    <li>Forest thinning and rural home expansion influence <b>habitat connectivity</b> more than training-area buffers.</li>
    <li>Because development tends to occur in <b>dispersed patterns rather than along major transportation corridors</b>, its influence is more diffuse across the landscape.</li>
  </ul>`,

  johnson: `<h3>Johnson County (Highest Development Pressure) <span class="eva-cite" title="Source: MRLC Consortium, National Land Cover Database (NLCD), accessed via EVA (Enhanced Visualization and Analysis) tool, 1985 to 2024"></span></h3>
  <h4>Landscape Change Summary</h4>
  <ul>
    <li>Johnson County experienced approximately <b>11.16% total land cover change</b> from 1985 to 2024, the highest among the three counties.</li>
    <li>EVA results show increases across <b>multiple development categories</b>, reflecting continued suburban and industrial expansion.</li>
    <li>Red EVA change pixels are concentrated around <b>Greenwood, Whiteland, New Whiteland, and Franklin</b>.</li>
    <li>Large areas of <b>cropland and open space</b> have transitioned into developed land uses.</li>
    <li>Some wooded areas have shifted to <b>shrub or grassland and developed open space</b>, indicating gradual forest change over time.</li>
  </ul>
  <h4>Encroachment Relevance</h4>
  <ul>
    <li>Johnson County contributes the <b>highest encroachment pressure</b> on Camp Atterbury, particularly along the north and northeast boundaries.</li>
    <li>Growth along <b>I-65 and US-31</b> brings population and development closer to training areas.</li>
    <li>Increasing impervious surface near Atterbury can influence <b>stormwater runoff, lighting, and noise</b> within adjacent buffer areas.</li>
    <li>Reduction of agricultural transition zones decreases landscape separation between <b>training activities and nearby communities</b>.</li>
  </ul>`,

  bartholomew: `<h3>Bartholomew County (Moderate to High Development Pressure) <span class="eva-cite" title="Source: MRLC Consortium, National Land Cover Database (NLCD), accessed via EVA (Enhanced Visualization and Analysis) tool, 1985 to 2024"></span></h3>
  <h4>Landscape Change Summary</h4>
  <ul>
    <li>Bartholomew County experienced approximately <b>6.13% total land cover change</b> from 1985 to 2024.</li>
    <li>Developed land categories have increased, though less extensively than in Johnson County.</li>
    <li>Red EVA change pixels cluster around <b>Columbus</b>, particularly to the west, northwest, and along major transportation corridors.</li>
    <li>Agricultural areas show gradual transition into <b>developed open space and low-density residential uses</b>.</li>
    <li>Forest areas have shifted in scattered patches to <b>pasture or hay, shrub or grassland, and low-density development</b>.</li>
  </ul>
  <h4>Encroachment Relevance</h4>
  <ul>
    <li>Bartholomew County contributes <b>moderate encroachment pressure</b>, particularly along the western Columbus to Camp Atterbury interface.</li>
    <li>Development along <b>SR-46 and US-31</b> incrementally reduces buffer space between Columbus and Camp Atterbury.</li>
    <li>Changes near flood-prone corridors may influence <b>hydrology, runoff, and ecological conditions</b> adjacent to training lands.</li>
  </ul>`
};

    evaDefault.style.display = "none";
    evaBody.style.display = "block";
    evaBody.innerHTML = EVA_TEXT[county];
    if (evaContent) evaContent.classList.add("showing-summary");

    evaModal.classList.add("visible");
    document.body.style.overflow = "hidden";
  });
});


  // CLOSE MODAL (single clean implementation)
  function closeEVA() {
    evaModal.classList.remove("visible");
    document.body.style.overflow = "";

    evaDefault.style.display = "block";
    evaBody.style.display = "none";
    evaBody.innerHTML = "";
    if (evaContent) evaContent.classList.remove("showing-summary");
  }

  const closeBtn = evaModal.querySelector(".eva-close");
  const overlay = evaModal.querySelector(".eva-overlay");
  
  if (closeBtn) closeBtn.onclick = closeEVA;
  if (overlay) overlay.onclick = closeEVA;
  document.addEventListener("keydown", e => e.key === "Escape" && closeEVA());
}
document.querySelectorAll("#hotspotTable th").forEach(header => {
  header.addEventListener("click", () => {
    const table = header.closest("table");
    const index = [...header.parentNode.children].indexOf(header);
    const rows = [...table.querySelectorAll("tbody tr")];
    const isAscending = header.classList.contains("asc");

    table.querySelectorAll("th").forEach(h => h.classList.remove("asc", "desc"));
    header.classList.toggle("asc", !isAscending);
    header.classList.toggle("desc", isAscending);

    rows.sort((a, b) => {
      const A = a.children[index].innerText.trim().toLowerCase();
      const B = b.children[index].innerText.trim().toLowerCase();
      return isAscending ? B.localeCompare(A) : A.localeCompare(B);
    });

    rows.forEach(r => table.querySelector("tbody").appendChild(r));
  });
});

});
