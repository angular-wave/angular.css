import type {} from "@angular-wave/angular.ts";

import {
  fitViewportRect,
  getDirection,
  isDisabled,
  onDestroy,
  setOpenState,
} from "../../internal/dom";
import {
  bindSemanticSubmenus,
  getSemanticMenuItemRole,
} from "../../internal/menu";

let dropdownIdCounter = 0;

type DropdownScope = ng.Scope & {};

type DropdownOpenOptions = {
  _focusFirst?: boolean;
  _restoreFocus?: boolean;
};

type DropdownOpenState = boolean;

const queryMenuItems = (panel: HTMLElement): HTMLElement[] =>
  Array.from(
    panel.querySelectorAll(
      'a, button, [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]',
    ),
  ).filter((item): item is HTMLElement => {
    if (!(item instanceof HTMLElement) || item.closest("menu") !== panel) {
      return false;
    }
    const hiddenAncestor = item.closest<HTMLElement>("[hidden]");
    return (!hiddenAncestor || hiddenAncestor === panel) && !isDisabled(item);
  });

export function dropdownMenuDirective(): ng.Directive {
  return {
    link(scope: DropdownScope, element: HTMLElement) {
      const button =
        element.querySelector<HTMLButtonElement>(":scope > button");
      const panel = element.querySelector<HTMLElement>(":scope > menu");

      if (!button || !panel) return;

      const cleanupSubmenus = bindSemanticSubmenus(
        element,
        "dropdown-menu",
        () => getDirection(element),
      );

      const panelId = panel.id || `menu-${String(dropdownIdCounter++)}`;
      panel.id = panelId;
      if (!button.id) button.id = `dropdown-btn-${String(dropdownIdCounter++)}`;
      button.setAttribute("aria-haspopup", "menu");
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-controls", panelId);
      panel.setAttribute("role", "menu");
      panel.setAttribute("tabindex", panel.getAttribute("tabindex") ?? "-1");
      panel.setAttribute("aria-labelledby", button.id);

      const isIconTrigger = button.getAttribute("size")?.startsWith("icon");
      if (!button.querySelector("svg") && !isIconTrigger) {
        button.insertAdjacentHTML(
          "beforeend",
          `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
            <path fill-rule="evenodd" d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd"/>
          </svg>
        `,
        );
      }

      let keyboardUser = false;
      const handleFirstTab = (event: KeyboardEvent) => {
        if (event.key !== "Tab") return;
        keyboardUser = true;
        window.removeEventListener("keydown", handleFirstTab);
      };
      window.addEventListener("keydown", handleFirstTab);

      const refreshMenuItemRoles = () => {
        queryMenuItems(panel).forEach((item) => {
          if (!item.hasAttribute("role")) {
            const role = getSemanticMenuItemRole(item);
            item.setAttribute("role", role);
            if (role !== "menuitem" && !item.hasAttribute("aria-checked")) {
              item.setAttribute("aria-checked", "false");
            }
          }
        });
      };

      let openState = element.hasAttribute("open");

      const positionPanel = () => {
        if (!openState) return;

        const buttonRect = button.getBoundingClientRect();
        const panelRect = panel.getBoundingClientRect();
        const containingBlock =
          panel.offsetParent instanceof HTMLElement
            ? panel.offsetParent
            : document.documentElement;
        const containingRect = containingBlock.getBoundingClientRect();
        const direction = getDirection(element);
        const side = panel.getAttribute("side") ?? "bottom";
        const align = panel.getAttribute("align") ?? "start";
        const offset = Number(panel.getAttribute("side-offset") ?? 8) || 0;
        const alignOffset =
          Number(panel.getAttribute("align-offset") ?? 0) || 0;
        const margin = 4;
        let left = buttonRect.left;
        let top = buttonRect.bottom + offset;

        if (side === "top") top = buttonRect.top - panelRect.height - offset;
        if (side === "left") left = buttonRect.left - panelRect.width - offset;
        if (side === "right") left = buttonRect.right + offset;

        if (side === "left" || side === "right") {
          top = buttonRect.top;
          if (align === "center") {
            top += (buttonRect.height - panelRect.height) / 2;
          }
          if (align === "end") top += buttonRect.height - panelRect.height;
          top += alignOffset;
        } else {
          const startLeft =
            direction === "rtl"
              ? buttonRect.right - panelRect.width
              : buttonRect.left;
          const endLeft =
            direction === "rtl"
              ? buttonRect.left
              : buttonRect.right - panelRect.width;
          left = align === "end" ? endLeft : startLeft;
          if (align === "center") {
            left = buttonRect.left + (buttonRect.width - panelRect.width) / 2;
          }
          left += direction === "rtl" ? -alignOffset : alignOffset;

          const spaceBelow = window.innerHeight - buttonRect.bottom - margin;
          const spaceAbove = buttonRect.top - margin;
          if (
            side !== "top" &&
            panelRect.height > spaceBelow &&
            spaceAbove > spaceBelow
          ) {
            top = buttonRect.top - panelRect.height - offset;
          }
        }

        const fitted = fitViewportRect(
          left,
          top,
          panelRect.width,
          panelRect.height,
          margin,
        );
        panel.style.inset = "auto";
        panel.style.left = `${String(Math.round(fitted._left - containingRect.left + containingBlock.scrollLeft))}px`;
        panel.style.top = `${String(Math.round(fitted._top - containingRect.top + containingBlock.scrollTop))}px`;
        panel.style.setProperty(
          "--dropdown-menu-available-height",
          `${String(Math.round(fitted._availableHeight))}px`,
        );
      };

      const syncState = (
        open: DropdownOpenState,
        options: { _restoreFocus?: boolean } = {},
      ) => {
        openState = open;
        button.setAttribute("aria-expanded", String(open));
        element.toggleAttribute("open", open);
        panel.setAttribute("aria-hidden", String(!open));
        setOpenState(panel, open);
        if (open) {
          positionPanel();
          requestAnimationFrame(positionPanel);
        }
        if (!open && options._restoreFocus) {
          button.focus();
        }
      };

      const setOpen = (
        open: DropdownOpenState,
        options: DropdownOpenOptions = {},
      ) => {
        const nextOpen = open;
        if (openState === nextOpen) {
          if (!nextOpen && options._restoreFocus) button.focus();
          return;
        }

        syncState(nextOpen);

        if (nextOpen && options._focusFirst) {
          requestAnimationFrame(() => {
            const items = queryMenuItems(panel);
            if (items.length) items[0].focus();
            else panel.focus();
          });
        }

        if (!nextOpen && options._restoreFocus) {
          button.focus();
        }
      };

      const openDropdown = () => {
        setOpen(true, { _focusFirst: keyboardUser });
      };

      const close = () => {
        setOpen(false, { _restoreFocus: true });
      };

      const toggle = () => {
        setOpen(!openState);
      };

      refreshMenuItemRoles();
      syncState(openState);

      const observer = new MutationObserver((records) => {
        if (
          records.some(
            (record) =>
              record.type === "childList" ||
              (record.type === "attributes" && record.attributeName === "role"),
          )
        ) {
          refreshMenuItemRoles();
        }
        if (
          records.some(
            (record) =>
              record.type === "attributes" &&
              (record.attributeName === "dir" ||
                record.attributeName === "disabled" ||
                record.attributeName === "aria-disabled"),
          )
        ) {
          refreshMenuItemRoles();
        }

        const shouldSyncOpen = records.some(
          (record) =>
            record.type === "attributes" &&
            record.target === element &&
            record.attributeName === "open",
        );
        if (!shouldSyncOpen) return;

        const nextOpen = element.hasAttribute("open");
        if (nextOpen !== openState) {
          syncState(nextOpen);
        }
      });
      observer.observe(element, {
        attributes: true,
        attributeFilter: ["aria-disabled", "dir", "disabled", "open", "role"],
        childList: true,
        subtree: true,
      });
      observer.observe(panel, {
        attributes: true,
        attributeFilter: ["dir", "role"],
        childList: true,
        subtree: true,
      });
      const panelSizeObserver = new ResizeObserver(positionPanel);
      panelSizeObserver.observe(panel);

      const handleButtonClick = () => {
        if (isDisabled(button)) return;
        toggle();
      };

      const handlePanelClick = (event: MouseEvent) => {
        if (!(event.target instanceof Element)) return;

        const item = event.target.closest(
          'a, button, [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]',
        );

        if (!item || !panel.contains(item)) return;
        if (isDisabled(item) || item.getAttribute("aria-haspopup") === "menu") {
          return;
        }

        event.preventDefault();
        event.stopPropagation();
        close();
      };

      button.addEventListener("click", handleButtonClick);
      panel.addEventListener("click", handlePanelClick);

      const handleClickOutside = (event: MouseEvent) => {
        if (
          event.target instanceof Node &&
          !element.contains(event.target) &&
          openState
        ) {
          close();
        }
      };

      document.addEventListener("click", handleClickOutside);

      const handleKeyDown = (event: KeyboardEvent) => {
        const items = queryMenuItems(panel);
        const activeElement =
          document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null;
        const currentIndex = activeElement ? items.indexOf(activeElement) : -1;

        if (!openState) {
          if (
            document.activeElement === button &&
            (event.key === "ArrowDown" || event.key === "ArrowUp")
          ) {
            event.preventDefault();
            openDropdown();
          }
          return;
        }

        switch (event.key) {
          case "Escape":
            close();
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
      window.addEventListener("resize", positionPanel);
      window.addEventListener("scroll", positionPanel, true);

      const destroy = () => {
        observer.disconnect();
        panelSizeObserver.disconnect();
        button.removeEventListener("click", handleButtonClick);
        panel.removeEventListener("click", handlePanelClick);
        document.removeEventListener("click", handleClickOutside);
        document.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("resize", positionPanel);
        window.removeEventListener("scroll", positionPanel, true);
        window.removeEventListener("keydown", handleFirstTab);
        cleanupSubmenus();
      };

      onDestroy(scope, destroy);
    },
  };
}
