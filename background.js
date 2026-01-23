document.addEventListener("DOMContentLoaded", () => {

  /* --------------------------------------------------
     EXECUTIVE SUMMARY COLLAPSE
  -------------------------------------------------- */
  const toggle = document.querySelector(".summary-toggle");
  const content = document.getElementById("summaryContent");

  if (toggle && content) {
    toggle.setAttribute("aria-expanded", "false");
    content.hidden = true;

    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isOpen));
      content.hidden = isOpen;
    });
  }

  /* --------------------------------------------------
     EXECUTIVE SUMMARY TABS (neutral default)
  -------------------------------------------------- */
  const tabs = Array.from(document.querySelectorAll(".sum-tab"));
  const panels = Array.from(document.querySelectorAll(".sum-content"));

  if (tabs.length && panels.length) {

    // Neutral default: nothing selected
    tabs.forEach(tab => {
      tab.classList.remove("is-active");
      tab.setAttribute("aria-selected", "false");
      tab.setAttribute("tabindex", "-1");
    });

    panels.forEach(panel => {
      panel.classList.remove("is-active");
      panel.hidden = true;
    });

    // Make first tab focusable for keyboard users (but not active)
    tabs[0].setAttribute("tabindex", "0");

    function activateTab(tab) {
      const targetId = tab.dataset.tab;
      const targetPanel = document.getElementById(targetId);
      if (!targetPanel) return;

      const panelWrap = document.querySelector(".summary-panel");

      // reset tabs
      tabs.forEach(t => {
        t.classList.remove("is-active");
        t.setAttribute("aria-selected", "false");
        t.setAttribute("tabindex", "-1");
      });

      // hide panels
      panels.forEach(p => {
        p.classList.remove("is-active");
        p.hidden = true;
      });

      // activate tab
      tab.classList.add("is-active");
      tab.setAttribute("aria-selected", "true");
      tab.setAttribute("tabindex", "0");

      // show panel wrapper
      if (panelWrap) panelWrap.style.display = "block";

      // show content
      targetPanel.classList.add("is-active");
      targetPanel.hidden = false;
    }


    tabs.forEach((tab, idx) => {
      tab.addEventListener("click", () => activateTab(tab));

      tab.addEventListener("keydown", (e) => {
        if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
        e.preventDefault();

        const nextIdx =
          e.key === "ArrowRight"
            ? (idx + 1) % tabs.length
            : (idx - 1 + tabs.length) % tabs.length;

        tabs[nextIdx].focus();
        activateTab(tabs[nextIdx]);
      });
    });

    // IMPORTANT: no auto-activation on load
  }

  /* --------------------------------------------------
     FIELD MAP MODAL
  -------------------------------------------------- */
  const fieldMapThumb = document.getElementById("fieldMapThumb");

  if (fieldMapThumb) {
    fieldMapThumb.addEventListener("click", () => {
      const modal = document.createElement("div");

      modal.style.position = "fixed";
      modal.style.top = "0";
      modal.style.left = "0";
      modal.style.width = "100vw";
      modal.style.height = "100vh";
      modal.style.background = "rgba(0,0,0,0.7)";
      modal.style.display = "flex";
      modal.style.alignItems = "center";
      modal.style.justifyContent = "center";
      modal.style.zIndex = "9999";

      modal.innerHTML = `
        <div role="dialog" aria-label="Field map modal"
             style="background:#fff; padding:16px; border-radius:14px;
                    max-width:96vw; max-height:96vh; overflow:auto;">
          <img src="images/FieldCardMap_2021_96ppi.png"
               alt="Field Map of Camp Atterbury (full size)"
               style="display:block; width:auto; height:auto;
                      max-width:none; max-height:none;
                      border-radius:10px;" />
        </div>
      `;

      modal.addEventListener("click", () => {
        document.body.removeChild(modal);
      });

      document.body.appendChild(modal);
    });
  }

});
