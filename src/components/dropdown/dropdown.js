export function dropdownDirective() {
  return {
    scope: true,
    link(scope, element) {
      element.addEventListener("toggle", () => scope.close());
      const button = element.querySelector("button");
      const panel = element.querySelector('[role="menu"]');

      if (!button || !panel) return;

      // --- Add ARIA attributes ---
      const panelId = panel.id || `menu-${Math.random().toString(36).slice(2)}`;
      panel.id = panelId;
      button.setAttribute("aria-haspopup", "true");
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-controls", panelId);
      panel.setAttribute("tabindex", "-1"); // allow panel focus
      const menuItems = Array.from(panel.querySelectorAll("a, button"));
      menuItems.forEach((item) => {
        item.setAttribute("role", "menuitem");
        item.setAttribute("tabindex", "-1");
      });

      button.insertAdjacentHTML(
        "beforeend",
        `
          <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              class="size-4"
            >
              <path
                fill-rule="evenodd"
                d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                clip-rule="evenodd"
              />
            </svg>
        `,
      );

      button.addEventListener("click", () => scope.toggle());

      // --- Track if user is using keyboard ---
      let keyboardUser = false;
      const handleFirstTab = (e) => {
        if (e.key === "Tab") keyboardUser = true;
        window.removeEventListener("keydown", handleFirstTab);
      };
      window.addEventListener("keydown", handleFirstTab);

      scope.open = false;
      scope.toggle = () => {
        if (scope.open) {
          return scope.close();
        }

        scope.open = true;
        // Focus first item only if keyboard user
        if (keyboardUser) {
          requestAnimationFrame(() => {
            if (menuItems.length) menuItems[0].focus();
            else panel.focus();
          });
        }
      };
      scope.close = () => {
        if (!scope.open) return;
        scope.open = false;
      };

      scope.$watch("open", (v) => {
        panel.setAttribute("data-open", v);
        button.setAttribute("aria-expanded", v);
      });

      // Close when clicking outside
      const handleClickOutside = (event) => {
        // Check if click is outside the dropdown element
        if (!element.contains(event.target) && scope.open) {
          scope.close();
        }
      };
      // --- Keyboard navigation handler ---
      const handleKeyDown = (event) => {
        if (!scope.open) {
          // Open dropdown with ArrowDown or ArrowUp from button
          if (
            document.activeElement === button &&
            (event.key === "ArrowDown" || event.key === "ArrowUp")
          ) {
            event.preventDefault();
            scope.$apply(() => scope.toggle());
          }
          return;
        }

        const currentIndex = menuItems.indexOf(document.activeElement);

        switch (event.key) {
          case "Escape":
            scope.close();
            break;

          case "ArrowDown":
            event.preventDefault();
            if (currentIndex < menuItems.length - 1) {
              menuItems[currentIndex + 1].focus();
            } else {
              menuItems[0].focus(); // wrap around
            }
            break;

          case "ArrowUp":
            event.preventDefault();
            if (currentIndex > 0) {
              menuItems[currentIndex - 1].focus();
            } else {
              menuItems[menuItems.length - 1].focus(); // wrap around
            }
            break;

          case "Home":
            event.preventDefault();
            menuItems[0].focus();
            break;

          case "End":
            event.preventDefault();
            menuItems[menuItems.length - 1].focus();
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
      document.addEventListener("click", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);

      // Clean up on destroy
      scope.$on("$destroy", () => {
        document.removeEventListener("click", handleClickOutside);
        document.removeEventListener("keydown", handleKeyDown);
      });
    },
  };
}
