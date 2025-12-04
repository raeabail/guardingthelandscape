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
    "1940s": "By 1960, aerial imagery and land-cover data depict a landscape dominated by agriculture...",
    "1970s": "The 1980–today land-use comparison shows how early lake developments evolved...",
    "2000s": "Encroachment patterns emerge as subdivisions expand during the 2000s–2010s...",
    "2010s": "Floodplain overlays illustrate areas where new districts extend into flood-fringe zones...",
    "2050": "Farms Under Threat 2040 scenarios show how sprawl could intensify without intervention."
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
const evaDefault = evaModal.querySelector(".eva-default");
const evaBody = evaModal.querySelector(".eva-body");

// OPEN: Interactive Map
document.querySelectorAll(".eva-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const link = btn.dataset.eva;

    evaDefault.style.display = "block";
    evaBody.style.display = "none";
    evaBody.innerHTML = "";

    evaModal.classList.add("visible");
    document.body.style.overflow = "hidden";

    document.getElementById("evaLaunch").onclick = () => {
      const w = 1400, h = 900;
      const left = (screen.width - w) / 2;
      const top = (screen.height - h) / 2;

      window.open(
        link, "_blank",
        `toolbar=no,location=no,status=no,menubar=no,
         scrollbars=yes,resizable=yes,width=${w},height=${h},
         top=${top},left=${left}`
      );
    };
  });
});


// OPEN: Summary Results
document.querySelectorAll("[data-eva-summary]").forEach(btn => {
  btn.addEventListener("click", () => {
    const county = btn.getAttribute("data-eva-summary");

const EVA_TEXT = { brown: `<h3>Brown County – Low–Moderate Development Pressure <span class="eva-cite" title="Source: MRLC EVA Land Cover Change Report (1985–2024)"></span> </h3> <h4>Landscape Change Summary</h4> <ul> <li>Brown County experienced <b>5.55% total land cover change</b> from 1985–2024—one of the lowest rates among surrounding counties.</li> <li>The county remains <b>predominantly deciduous forest</b> in both 1985 and 2024, with forest still forming the dominant land cover class.</li> <li>Most land cover transitions involve <b>forest converting to low-density development</b>, shrub/grassland, or lightly modified rural residential areas.</li> <li><b>High-intensity development (HID)</b> remains extremely limited in extent.</li> <li>Red change pixels in EVA maps cluster primarily around <b>lake communities and ridge-top parcels</b>, matching dispersed, amenity-driven patterns.</li> </ul> <h4>Encroachment Relevance</h4> <ul> <li>Brown County’s change is <b>fragmented but low-intensity</b>, contributing modest encroachment pressure on Atterbury’s western edge.</li> <li>Forest thinning and rural home expansion affect <b>habitat connectivity</b> more than training-area buffers.</li> <li>Because development does not follow transportation corridors, its influence is <b>diffuse</b> rather than corridor-driven.</li> </ul>`, johnson: `<h3>Johnson County – Highest Development Pressure <span class="eva-cite" title="Source: MRLC EVA Land Cover Change Report (1985–2024)"></span> </h3> <h4>Landscape Change Summary</h4> <ul> <li>Johnson County shows the <b>highest land cover change</b> of the three counties, with <b>11.16% of its area changing</b> between 1985 and 2024.</li> <li>EVA shows strong increases across <b>most development categories</b>, indicating broad suburban and industrial expansion.</li> <li>Red EVA change pixels are highly concentrated around <b>Greenwood, Whiteland, New Whiteland, and Franklin</b>.</li> <li>Large areas of <b>cropland and open space</b> converted into developed categories.</li> <li>Several wooded tracts transitioned into <b>shrub/grassland or developed open space</b>, indicating incremental forest loss.</li> </ul> <h4>Encroachment Relevance</h4> <ul> <li>Johnson County exerts the <b>strongest encroachment pressure</b> on Camp Atterbury, particularly along the north and northeast boundaries.</li> <li>Growth along <b>I-65 and US-31</b> moves population closer to Atterbury’s training zones.</li> <li>Increasing impervious surface near Atterbury contributes to <b>stormwater, lighting, and noise spillover</b> into buffer areas.</li> <li>Loss of agricultural transition zones reduces landscape separation between <b>training activities and residential communities</b>.</li> </ul>`, bartholomew: `<h3>Bartholomew County – Moderate–High Development Pressure <span class="eva-cite" title="Source: MRLC EVA Land Cover Change Report (1985–2024)"></span> </h3> <h4>Landscape Change Summary</h4> <ul> <li>Bartholomew County experienced <b>6.13% total land cover change</b> from 1985–2024.</li> <li>Developed categories all <b>increased</b>, though less dramatically than in Johnson County.</li> <li>EVA change pixels cluster around <b>Columbus</b>, especially west, northwest, and along major corridors.</li> <li>Agricultural areas show gradual transition into <b>developed open space and low-density residential</b>.</li> <li>Forest conversion occurs in scattered patches, typically shifting to <b>pasture/hay, shrub/grassland, or low-density development</b>.</li> </ul> <h4>Encroachment Relevance</h4> <ul> <li>Bartholomew contributes <b>moderate encroachment pressure</b>, especially along the western Columbus-to-Atterbury interface.</li> <li>SR-46 and US-31 corridor development incrementally narrows <b>buffer space</b> between Columbus and Atterbury.</li> <li>Changes near flood-prone corridors may influence <b>hydrology, runoff, and ecological constraints</b> adjacent to training lands.</li> </ul>` };

    evaDefault.style.display = "none";
    evaBody.style.display = "block";
    evaBody.innerHTML = EVA_TEXT[county];

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
}

evaModal.querySelector(".eva-close").onclick = closeEVA;
evaModal.querySelector(".eva-overlay").onclick = closeEVA;
document.addEventListener("keydown", e => e.key === "Escape" && closeEVA());



/* ---------------------------------------------------------
   12. SORTABLE HOTSPOT TABLE
--------------------------------------------------------- */
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
