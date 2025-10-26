export function accordionDirective() {
  return {
    link(_scope, element) {
      const items = Array.from(element.children);

      items.forEach((item) => {
        const [header, panel] = item.children;
        if (!header || !panel) return;

        /** @type {HTMLButtonElement | null} */
        const button = header.querySelector("button");
        if (!button) return;

        // Add chevron icon if missing
        if (!button.querySelector("svg")) {
          button.insertAdjacentHTML(
            "beforeend",
            `
              <svg xmlns="http://www.w3.org/2000/svg"
                   width="24" height="24"
                   fill="none"
                   viewBox="0 0 24 24"
                   stroke-width="2"
                   stroke-linecap="round"
                   stroke-linejoin="round"
                   stroke="currentColor">
                <path d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            `,
          );
        }

        // Accessibility setup
        const id =
          button.id ||
          `accordion-btn-${Math.random().toString(36).slice(2, 7)}`;
        const panelId = `${id}-panel`;

        button.id = id;
        panel.id = panelId;
        button.setAttribute("aria-controls", panelId);
        panel.setAttribute("role", "region");
        panel.setAttribute("aria-labelledby", id);

        // Initialize closed
        button.setAttribute("aria-expanded", "false");
        panel.setAttribute("data-open", "false");

        // Add click behavior
        button.addEventListener("click", () => {
          const isOpen = panel.getAttribute("data-open") === "true";

          // Close all panels
          items.forEach((otherItem) => {
            const [, otherPanel] = otherItem.children;
            const otherButton = otherItem.querySelector("button");
            if (otherPanel && otherButton) {
              panel.setAttribute("data-open", "false");
              button.setAttribute("aria-expanded", "false");
            }
          });

          // Open this one if it was closed
          if (!isOpen) {
            panel.setAttribute("data-open", "true");
            button.setAttribute("aria-expanded", "true");
          }
        });
      });
    },
  };
}
