import type {} from "@angular-wave/angular.ts";

import { isDisabled, onDestroy, queryAll } from "../../internal/dom";

const itemSelector = ":scope > :is(button, a[href])";

export function toolbarDirective(): ng.Directive {
  return {
    link(scope: ng.Scope, element: HTMLElement) {
      let items: HTMLElement[] = [];
      let active: HTMLElement | null = null;

      const visibleItems = () =>
        items.filter(
          (item) =>
            !item.hidden &&
            getComputedStyle(item).display !== "none" &&
            !isDisabled(item),
        );

      const setActive = (item: HTMLElement, focus = false) => {
        active = item;
        items.forEach((candidate) => {
          candidate.tabIndex = candidate === item && !isDisabled(item) ? 0 : -1;
        });
        if (focus) item.focus({ preventScroll: true });
      };

      const sync = () => {
        const previous = active;
        items = queryAll<HTMLElement>(element, itemSelector);
        const enabled = visibleItems();
        let next: HTMLElement | null;
        if (previous !== null && enabled.includes(previous)) {
          next = previous;
        } else {
          const authored = enabled.find(
            (item) => item.getAttribute("tabindex") === "0",
          );
          next = authored ?? (enabled.length > 0 ? enabled[0] : null);
        }

        element.setAttribute("role", "toolbar");
        items.forEach((item) => {
          item.tabIndex = item === next ? 0 : -1;
        });
        active = next;
      };

      const move = (delta: 1 | -1) => {
        const enabled = visibleItems();
        if (!enabled.length) return;
        const current = active ? enabled.indexOf(active) : -1;
        const next =
          current < 0
            ? delta === 1
              ? 0
              : enabled.length - 1
            : (current + delta + enabled.length) % enabled.length;
        setActive(enabled[next], true);
      };

      const handleFocusIn = (event: FocusEvent) => {
        const target = event.target as HTMLElement | null;
        const item = target?.matches("button, a[href]") ? target : null;
        if (item?.parentElement === element && !isDisabled(item)) {
          setActive(item);
        }
      };

      const handleKeydown = (event: KeyboardEvent) => {
        const eventTarget = event.target as HTMLElement | null;
        const target = eventTarget?.matches("button, a[href]")
          ? eventTarget
          : null;
        if (target?.parentElement !== element) return;

        const vertical =
          element.getAttribute("aria-orientation") === "vertical";
        const rtl = getComputedStyle(element).direction === "rtl";
        let delta: 1 | -1 | null = null;

        if (vertical && event.key === "ArrowDown") delta = 1;
        if (vertical && event.key === "ArrowUp") delta = -1;
        if (!vertical && event.key === "ArrowRight") delta = rtl ? -1 : 1;
        if (!vertical && event.key === "ArrowLeft") delta = rtl ? 1 : -1;

        if (delta) {
          event.preventDefault();
          move(delta);
          return;
        }

        if (event.key === "Home" || event.key === "End") {
          const enabled = visibleItems();
          if (!enabled.length) return;
          const item =
            event.key === "Home" ? enabled[0] : enabled[enabled.length - 1];
          event.preventDefault();
          setActive(item, true);
        }
      };

      const observer = new MutationObserver(sync);
      observer.observe(element, {
        attributeFilter: [
          "aria-disabled",
          "dir",
          "disabled",
          "hidden",
          "aria-orientation",
        ],
        attributes: true,
        childList: true,
        subtree: true,
      });
      element.addEventListener("focusin", handleFocusIn);
      element.addEventListener("keydown", handleKeydown);
      sync();

      onDestroy(scope, () => {
        observer.disconnect();
        element.removeEventListener("focusin", handleFocusIn);
        element.removeEventListener("keydown", handleKeydown);
      });
    },
  };
}
