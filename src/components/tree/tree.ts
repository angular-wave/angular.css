import type {} from "@angular-wave/angular.ts";

import {
  isDisabled,
  isOwnedBy,
  onDestroy,
  queryAll,
  setAttributeIfChanged,
} from "../../internal/dom";

let treeIdCounter = 0;
const treeSelector = "[ng-tree]";

export function treeDirective(): ng.Directive {
  return {
    link(scope: ng.Scope, element: HTMLElement) {
      let items: HTMLElement[] = [];
      let active: HTMLElement | null = null;
      let typeahead = "";
      let typeaheadTimer: ReturnType<typeof setTimeout> | undefined;

      const owned = (candidate: Element) =>
        isOwnedBy(element, treeSelector, candidate);
      const childGroup = (item: HTMLElement) =>
        Array.from(item.children).find((child) => child.matches("ul, ol")) as
          | HTMLElement
          | undefined;
      const parentItem = (item: HTMLElement) => {
        const group = item.parentElement;
        const parent = group?.parentElement;
        return parent?.matches("li") && owned(parent) ? parent : null;
      };
      const isVisible = (item: HTMLElement) => {
        if (item.hidden || getComputedStyle(item).display === "none")
          return false;
        let ancestor = item.parentElement;
        while (ancestor && ancestor !== element) {
          if (
            ancestor.hidden ||
            getComputedStyle(ancestor).display === "none"
          ) {
            return false;
          }
          ancestor = ancestor.parentElement;
        }
        let parent = parentItem(item);
        while (parent) {
          if (parent.getAttribute("aria-expanded") === "false") return false;
          parent = parentItem(parent);
        }
        return true;
      };
      const enabledVisibleItems = () =>
        items.filter((item) => isVisible(item) && !isDisabled(item));
      const labelText = (item: HTMLElement) =>
        Array.from(item.children)
          .find((child) => child.matches("span"))
          ?.textContent.trim() ?? "";

      const setActive = (item: HTMLElement, focus = false) => {
        active = item;
        items.forEach((candidate) => {
          candidate.tabIndex = candidate === item && !isDisabled(item) ? 0 : -1;
        });
        if (focus) item.focus({ preventScroll: true });
      };

      const select = (item: HTMLElement, toggle = false) => {
        const multiple =
          element.getAttribute("aria-multiselectable") === "true";
        const selected =
          toggle && multiple
            ? item.getAttribute("aria-selected") !== "true"
            : true;
        if (!multiple) {
          items.forEach((candidate) => {
            candidate.setAttribute(
              "aria-selected",
              String(candidate === item && selected),
            );
          });
        } else {
          item.setAttribute("aria-selected", String(selected));
        }
        element.dispatchEvent(
          new CustomEvent("ng:tree-select", {
            bubbles: true,
            detail: {
              id: item.id,
              selected,
              value: item.getAttribute("data-value") ?? item.id,
            },
          }),
        );
      };

      const setExpanded = (item: HTMLElement, expanded: boolean) => {
        if (childGroup(item)) {
          item.setAttribute("aria-expanded", String(expanded));
        }
      };

      const sync = () => {
        const previous = active;
        items = queryAll<HTMLElement>(element, "li").filter(owned);
        element.setAttribute("role", "tree");

        queryAll<HTMLElement>(element, "ul, ol")
          .filter(owned)
          .forEach((group) => {
            group.setAttribute("role", "group");
          });

        items.forEach((item) => {
          item.setAttribute("role", "treeitem");
          if (!item.id) item.id = `tree-item-${String(treeIdCounter++)}`;
          const label = item.querySelector<HTMLElement>(":scope > span");
          if (label !== null) {
            if (!label.id) label.id = `${item.id}-label`;
            item.setAttribute("aria-labelledby", label.id);
          }
          if (childGroup(item) && !item.hasAttribute("aria-expanded")) {
            item.setAttribute("aria-expanded", "true");
          }
          if (!item.hasAttribute("aria-selected")) {
            setAttributeIfChanged(item, "aria-selected", "false");
          }
        });

        const enabled = enabledVisibleItems();
        let next: HTMLElement | null;
        if (previous !== null && enabled.includes(previous)) {
          next = previous;
        } else {
          const authored = enabled.find(
            (item) => item.getAttribute("tabindex") === "0",
          );
          const selected = enabled.find(
            (item) => item.getAttribute("aria-selected") === "true",
          );
          if (authored !== undefined) next = authored;
          else if (selected !== undefined) next = selected;
          else next = enabled.length > 0 ? enabled[0] : null;
        }
        items.forEach((item) => {
          item.tabIndex = item === next ? 0 : -1;
        });
        active = next;
      };

      const move = (delta: 1 | -1) => {
        const enabled = enabledVisibleItems();
        if (!enabled.length) return;
        const current = active ? enabled.indexOf(active) : -1;
        const next = Math.max(
          0,
          Math.min(
            enabled.length - 1,
            current < 0
              ? delta === 1
                ? 0
                : enabled.length - 1
              : current + delta,
          ),
        );
        setActive(enabled[next], true);
      };

      const handleFocusIn = (event: FocusEvent) => {
        const item = (event.target as Element | null)?.closest<HTMLElement>(
          "li",
        );
        if (item && owned(item) && !isDisabled(item)) setActive(item);
      };

      const handleClick = (event: MouseEvent) => {
        const item = (event.target as Element | null)?.closest<HTMLElement>(
          "li",
        );
        if (!item || !owned(item) || isDisabled(item)) return;
        setActive(item, true);
        select(item, event.ctrlKey || event.metaKey);
        if (childGroup(item)) {
          setExpanded(item, item.getAttribute("aria-expanded") !== "true");
        }
      };

      const handleKeydown = (event: KeyboardEvent) => {
        const item = (event.target as Element | null)?.closest<HTMLElement>(
          "li",
        );
        if (!item || !owned(item) || isDisabled(item)) return;
        const group = childGroup(item);

        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          event.preventDefault();
          move(event.key === "ArrowDown" ? 1 : -1);
          return;
        }
        if (event.key === "Home" || event.key === "End") {
          const enabled = enabledVisibleItems();
          if (!enabled.length) return;
          const next =
            event.key === "Home" ? enabled[0] : enabled[enabled.length - 1];
          event.preventDefault();
          setActive(next, true);
          return;
        }
        const rtl = getComputedStyle(element).direction === "rtl";
        const expandKey = rtl ? "ArrowLeft" : "ArrowRight";
        const collapseKey = rtl ? "ArrowRight" : "ArrowLeft";
        if (event.key === expandKey && group) {
          event.preventDefault();
          if (item.getAttribute("aria-expanded") !== "true") {
            setExpanded(item, true);
          } else {
            const child = queryAll<HTMLElement>(group, ":scope > li").find(
              (candidate) => !isDisabled(candidate),
            );
            if (child) setActive(child, true);
          }
          return;
        }
        if (event.key === collapseKey) {
          const parent = parentItem(item);
          if (group && item.getAttribute("aria-expanded") === "true") {
            event.preventDefault();
            setExpanded(item, false);
          } else if (parent) {
            event.preventDefault();
            setActive(parent, true);
          }
          return;
        }
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          select(item, event.ctrlKey || event.metaKey);
          return;
        }
        if (
          event.key.length === 1 &&
          !event.altKey &&
          !event.ctrlKey &&
          !event.metaKey
        ) {
          typeahead += event.key.toLocaleLowerCase();
          clearTimeout(typeaheadTimer);
          typeaheadTimer = setTimeout(() => {
            typeahead = "";
          }, 500);
          const enabled = enabledVisibleItems();
          const start = Math.max(0, enabled.indexOf(item) + 1);
          const ordered = [...enabled.slice(start), ...enabled.slice(0, start)];
          const match = ordered.find((candidate) =>
            labelText(candidate).toLocaleLowerCase().startsWith(typeahead),
          );
          if (match) setActive(match, true);
        }
      };

      const observer = new MutationObserver(sync);
      observer.observe(element, {
        attributeFilter: [
          "aria-disabled",
          "aria-expanded",
          "aria-selected",
          "disabled",
          "hidden",
        ],
        attributes: true,
        childList: true,
        subtree: true,
      });
      element.addEventListener("focusin", handleFocusIn);
      element.addEventListener("click", handleClick);
      element.addEventListener("keydown", handleKeydown);
      sync();

      onDestroy(scope, () => {
        clearTimeout(typeaheadTimer);
        observer.disconnect();
        element.removeEventListener("focusin", handleFocusIn);
        element.removeEventListener("click", handleClick);
        element.removeEventListener("keydown", handleKeydown);
      });
    },
  };
}
