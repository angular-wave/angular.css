let dropdownIdCounter = 0;

export function dropdownDirective() {
  return {
    scope: true,
    link(scope, element) {
      const button = element.querySelector("button");
      const panel = element.querySelector('[role="menu"]');

      if (!button || !panel) return;

      // --- Setup IDs and ARIA ---
      const panelId = panel.id || `menu-${dropdownIdCounter++}`;
      panel.id = panelId;
      if (!button.id) button.id = `dropdown-btn-${dropdownIdCounter++}`;
      button.setAttribute("aria-haspopup", "true");
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-controls", panelId);
      panel.setAttribute("tabindex", "-1");
      panel.setAttribute("aria-labelledby", button.id);

      if (!button.querySelector("svg")) {
        button.insertAdjacentHTML(
          "beforeend",
          `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-4">
            <path fill-rule="evenodd" d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd"/>
          </svg>
        `,
        );
      }

      let keyboardUser = false;
      const handleFirstTab = (e) => {
        if (e.key === "Tab") keyboardUser = true;
        window.removeEventListener("keydown", handleFirstTab);
      };
      window.addEventListener("keydown", handleFirstTab);

      scope.open = scope.open || false;

      const getMenuItems = () =>
        Array.from(panel.querySelectorAll("a, button")).filter(
          (item) => !item.hasAttribute("disabled"),
        );

      scope.toggle = () => {
        scope.open ? scope.close() : scope.openDropdown();
      };

      scope.openDropdown = () => {
        scope.open = true;
        if (keyboardUser) {
          requestAnimationFrame(() => {
            const items = getMenuItems();
            if (items.length) items[0].focus();
            else panel.focus();
          });
        }
      };

      scope.close = () => {
        if (!scope.open) return;
        scope.open = false;
        button.focus(); // Return focus to button when closed
      };

      scope.$watch("open", (v) => {
        panel.setAttribute("data-open", v);
        button.setAttribute("aria-expanded", v);
      });

      button.addEventListener("click", () => scope.toggle());

      const handleClickOutside = (event) => {
        if (!element.contains(event.target) && scope.open) scope.close();
      };

      document.addEventListener("click", handleClickOutside);

      const handleKeyDown = (event) => {
        const items = getMenuItems();
        const currentIndex = items.indexOf(document.activeElement);

        if (!scope.open) {
          if (
            document.activeElement === button &&
            (event.key === "ArrowDown" || event.key === "ArrowUp")
          ) {
            event.preventDefault();
            scope.toggle();
          }
          return;
        }

        switch (event.key) {
          case "Escape":
            scope.$apply(() => scope.close());
            break;

          case "ArrowDown":
            event.preventDefault();
            if (items.length) {
              const nextIndex =
                currentIndex < items.length - 1 ? currentIndex + 1 : 0;
              items[nextIndex].focus();
            }
            break;

          case "ArrowUp":
            event.preventDefault();
            if (items.length) {
              const prevIndex =
                currentIndex > 0 ? currentIndex - 1 : items.length - 1;
              items[prevIndex].focus();
            }
            break;

          case "Home":
            event.preventDefault();
            if (items.length) items[0].focus();
            break;

          case "End":
            event.preventDefault();
            if (items.length) items[items.length - 1].focus();
            break;

          case "Enter":
          case " ": {
            const active = document.activeElement;
            if (active instanceof HTMLElement) {
              event.preventDefault();
              active.click();
            }
            break;
          }
        }
      };

      document.addEventListener("keydown", handleKeyDown);

      scope.$on("$destroy", () => {
        document.removeEventListener("click", handleClickOutside);
        document.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keydown", handleFirstTab);
      });
    },
  };
}
