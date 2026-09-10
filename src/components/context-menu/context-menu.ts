import type {} from "@angular-wave/angular.ts";

import {
  getDirection,
  isOwnedBy,
  observeInheritedDirection,
  queryOwned,
  queryOwnedAll,
  setAttributeIfChanged,
  fitViewportRect,
  isDisabled,
  onDestroy,
  queryAll,
  setOpenState,
} from "../../internal/dom";
import {
  bindSemanticSubmenus,
  getSemanticMenuItemRole,
} from "../../internal/menu";

let contextMenuIdCounter = 0;

type MenuSide =
  | "bottom"
  | "inline-end"
  | "inline-start"
  | "left"
  | "right"
  | "top";
type PhysicalSide = "bottom" | "left" | "right" | "top";
type MenuAlign = "center" | "end" | "start";
type AnchorPoint = { _x: number; _y: number };

const rootSelector = "[ng-context-menu]";
const triggerSelector = ":scope > :first-child:not(menu)";
const contentSelector = ":scope > menu";
const menuSurfaceSelector = "menu";
const itemSelector = "a, button";
const subTriggerSelector = "details > summary";
const groupSelector = "menu > section, menu > fieldset";
const sides = new Set<MenuSide>([
  "bottom",
  "inline-end",
  "inline-start",
  "left",
  "right",
  "top",
]);
const alignments = new Set<MenuAlign>(["center", "end", "start"]);

export function contextMenuDirective(): ng.Directive {
  return {
    link(scope: ng.Scope, element: HTMLElement) {
      const trigger = queryOwned(
        element,
        rootSelector,
        triggerSelector,
        HTMLElement,
      );
      const content = queryOwned(
        element,
        rootSelector,
        contentSelector,
        HTMLElement,
      );
      if (!trigger || !content) return;

      const getPhysicalSide = (side: MenuSide): PhysicalSide => {
        if (side === "inline-start") {
          return getDirection(element) === "rtl" ? "right" : "left";
        }
        if (side === "inline-end") {
          return getDirection(element) === "rtl" ? "left" : "right";
        }
        return side;
      };
      const getAuthoredSide = (): MenuSide => {
        const value = content.getAttribute("side");
        return value && sides.has(value as MenuSide)
          ? (value as MenuSide)
          : "right";
      };
      const getAlign = (): MenuAlign => {
        const value = content.getAttribute("align");
        return value && alignments.has(value as MenuAlign)
          ? (value as MenuAlign)
          : "start";
      };

      const contentId =
        content.id || `context-menu-content-${String(contextMenuIdCounter++)}`;
      content.id = contentId;
      if (
        !trigger.matches(
          "button, a[href], input, select, textarea, summary, [role]",
        )
      ) {
        trigger.setAttribute("role", "button");
      }
      trigger.setAttribute("aria-haspopup", "menu");
      trigger.setAttribute("aria-controls", contentId);
      if (!trigger.hasAttribute("tabindex")) trigger.tabIndex = 0;
      setAttributeIfChanged(content, "role", "menu");
      setAttributeIfChanged(
        content,
        "tabindex",
        content.getAttribute("tabindex") ?? "-1",
      );

      const menuItems = (surface: HTMLElement): HTMLElement[] =>
        queryAll<HTMLElement>(surface, itemSelector).filter((item) => {
          if (!isOwnedBy(element, rootSelector, item)) return false;
          return item.closest("menu") === surface;
        });
      const visibleEnabledItems = (surface: HTMLElement): HTMLElement[] =>
        menuItems(surface).filter(
          (item) =>
            !isDisabled(item) &&
            !item.hidden &&
            !item.closest("[hidden]") &&
            getComputedStyle(item).display !== "none",
        );

      const syncSemantics = (): void => {
        queryOwnedAll<HTMLElement>(
          element,
          rootSelector,
          menuSurfaceSelector,
        ).forEach((surface) => {
          setAttributeIfChanged(surface, "role", "menu");
          if (!surface.hasAttribute("tabindex")) surface.tabIndex = -1;
        });
        queryOwnedAll<HTMLElement>(
          element,
          rootSelector,
          groupSelector,
        ).forEach((group) => {
          setAttributeIfChanged(group, "role", "group");
        });
        queryOwnedAll<HTMLElement>(element, rootSelector, itemSelector).forEach(
          (item) => {
            const role = getSemanticMenuItemRole(item);
            setAttributeIfChanged(item, "role", role);
            if (!item.hasAttribute("tabindex")) item.tabIndex = -1;
            if (
              (role === "menuitemcheckbox" || role === "menuitemradio") &&
              !item.hasAttribute("aria-checked")
            ) {
              setAttributeIfChanged(item, "aria-checked", "false");
            }
            if (isDisabled(item)) {
              setAttributeIfChanged(item, "aria-disabled", "true");
            }
          },
        );
      };

      const syncDirection = (): void => {
        if (open) requestAnimationFrame(positionContent);
      };

      let anchorPoint: AnchorPoint | null = null;
      let open = element.hasAttribute("open");

      const keyboardAnchor = (): AnchorPoint => {
        const rect = trigger.getBoundingClientRect();
        return {
          _x: getDirection(element) === "rtl" ? rect.right : rect.left,
          _y: rect.bottom,
        };
      };

      const positionContent = (): void => {
        if (!open) return;
        const point = anchorPoint ?? keyboardAnchor();
        const rootRect = element.getBoundingClientRect();
        const menuRect = content.getBoundingClientRect();
        const authoredSide = getAuthoredSide();
        const side = getPhysicalSide(authoredSide);
        const align = getAlign();
        const offset = Number(content.getAttribute("side-offset") ?? 4) || 0;
        const alignOffset =
          Number(content.getAttribute("align-offset") ?? 0) || 0;
        const margin = 4;
        let left = point._x;
        let top = point._y;

        if (side === "left") left -= menuRect.width + offset;
        if (side === "right") left += offset;
        if (side === "top") top -= menuRect.height + offset;
        if (side === "bottom") top += offset;

        if (side === "left" || side === "right") {
          if (align === "center") top -= menuRect.height / 2;
          if (align === "end") top -= menuRect.height;
          top += alignOffset;
        } else {
          if (align === "center") left -= menuRect.width / 2;
          if (align === "end") left -= menuRect.width;
          left += getDirection(element) === "rtl" ? -alignOffset : alignOffset;
        }

        const fitted = fitViewportRect(
          left,
          top,
          menuRect.width,
          menuRect.height,
          margin,
        );

        content.style.setProperty(
          "--context-menu-left",
          `${String(Math.round(fitted._left - rootRect.left + element.scrollLeft))}px`,
        );
        content.style.setProperty(
          "--context-menu-top",
          `${String(Math.round(fitted._top - rootRect.top + element.scrollTop))}px`,
        );
        content.style.setProperty(
          "--context-menu-available-height",
          `${String(Math.round(fitted._availableHeight))}px`,
        );
        setAttributeIfChanged(content, "side", authoredSide);
        setAttributeIfChanged(content, "align", align);
      };

      const focusItem = (item: HTMLElement, surface: HTMLElement): void => {
        menuItems(surface).forEach((candidate) => {
          candidate.tabIndex = candidate === item ? 0 : -1;
        });
        item.focus({ preventScroll: true });
      };

      const focusBoundary = (
        surface: HTMLElement,
        boundary: "first" | "last",
      ): void => {
        const items = visibleEnabledItems(surface);
        const item = boundary === "first" ? items[0] : items.at(-1);
        if (item) focusItem(item, surface);
      };

      const moveFocus = (surface: HTMLElement, direction: 1 | -1): void => {
        const items = visibleEnabledItems(surface);
        if (!items.length) return;
        const current =
          document.activeElement instanceof HTMLElement
            ? items.indexOf(document.activeElement)
            : -1;
        const next =
          current < 0
            ? direction === 1
              ? 0
              : items.length - 1
            : (current + direction + items.length) % items.length;
        focusItem(items[next], surface);
      };

      const setOpen = (
        nextOpen: boolean,
        options: { _focusFirst?: boolean; _restoreFocus?: boolean } = {},
      ): void => {
        if (nextOpen && isDisabled(trigger)) nextOpen = false;
        const wasOpen = open;
        open = nextOpen;
        element.toggleAttribute("open", open);
        setAttributeIfChanged(trigger, "aria-expanded", String(open));
        setAttributeIfChanged(content, "aria-hidden", String(!open));
        setOpenState(content, open);

        if (open) {
          requestAnimationFrame(() => {
            positionContent();
            if (options._focusFirst) focusBoundary(content, "first");
          });
        } else {
          menuItems(content).forEach((item) => {
            item.tabIndex = -1;
          });
          if (wasOpen && options._restoreFocus) {
            trigger.focus({ preventScroll: true });
          }
        }
      };

      const openAt = (point: AnchorPoint, focusFirst = true): void => {
        anchorPoint = point;
        syncSemantics();
        setOpen(true, { _focusFirst: focusFirst });
      };
      const close = (restoreFocus = false): void => {
        setOpen(false, { _restoreFocus: restoreFocus });
      };

      const handleContextMenu = (event: MouseEvent): void => {
        if (isDisabled(trigger)) return;
        event.preventDefault();
        openAt({ _x: event.clientX, _y: event.clientY });
      };

      const handleKeydown = (event: KeyboardEvent): void => {
        const target =
          event.target instanceof HTMLElement ? event.target : null;
        if (
          target === trigger &&
          (event.key === "ContextMenu" ||
            (event.key === "F10" && event.shiftKey))
        ) {
          if (isDisabled(trigger)) return;
          event.preventDefault();
          openAt(keyboardAnchor());
          return;
        }
        if (!open) return;

        if (event.key === "Escape") {
          event.preventDefault();
          close(true);
          return;
        }
        if (event.key === "Tab") {
          event.preventDefault();
          close(true);
          return;
        }

        const surface = target?.closest<HTMLElement>(menuSurfaceSelector);
        if (!surface || !isOwnedBy(element, rootSelector, surface)) return;
        if (event.key === "ArrowDown") {
          event.preventDefault();
          moveFocus(surface, 1);
        } else if (event.key === "ArrowUp") {
          event.preventDefault();
          moveFocus(surface, -1);
        } else if (event.key === "Home") {
          event.preventDefault();
          focusBoundary(surface, "first");
        } else if (event.key === "End") {
          event.preventDefault();
          focusBoundary(surface, "last");
        } else if (
          (event.key === "Enter" || event.key === " ") &&
          target?.matches(itemSelector)
        ) {
          event.preventDefault();
          target.click();
        }
      };

      const handleItemClick = (event: MouseEvent): void => {
        const target = event.target instanceof Element ? event.target : null;
        const item = target?.closest<HTMLElement>(itemSelector);
        if (
          !item ||
          !isOwnedBy(element, rootSelector, item) ||
          isDisabled(item)
        )
          return;
        if (item.matches(subTriggerSelector)) return;
        element.dispatchEvent(
          new CustomEvent("angularcss:context-menu-select", {
            bubbles: true,
            detail: { item },
          }),
        );
        close(true);
      };

      const handlePointerMove = (event: PointerEvent): void => {
        const target = event.target instanceof Element ? event.target : null;
        const item = target?.closest<HTMLElement>(itemSelector);
        const surface = item?.closest<HTMLElement>(menuSurfaceSelector);
        if (
          !item ||
          !surface ||
          !isOwnedBy(element, rootSelector, item) ||
          isDisabled(item)
        )
          return;
        focusItem(item, surface);
      };

      const handlePointerDownOutside = (event: PointerEvent): void => {
        if (
          open &&
          event.target instanceof Node &&
          !element.contains(event.target)
        ) {
          close(false);
        }
      };

      const cleanupSubmenus = bindSemanticSubmenus(
        element,
        "context-menu",
        () => getDirection(element),
      );
      const observer = new MutationObserver((records) => {
        if (records.some((record) => record.type === "childList")) {
          syncSemantics();
        }
        if (
          records.some(
            (record) =>
              record.type === "attributes" &&
              (record.attributeName === "dir" ||
                record.attributeName === "side" ||
                record.attributeName === "align"),
          )
        ) {
          syncDirection();
        }
        if (
          records.some(
            (record) =>
              record.type === "attributes" &&
              record.attributeName === "open" &&
              record.target === element,
          )
        ) {
          const source = records
            .filter(
              (record) =>
                record.type === "attributes" &&
                record.attributeName === "open" &&
                record.target === element,
            )
            .at(-1)?.target;
          const nextOpen =
            source instanceof HTMLElement && source.hasAttribute("open");
          if (nextOpen !== open) setOpen(nextOpen);
        }
      });
      observer.observe(element, {
        attributes: true,
        attributeFilter: ["dir", "open"],
        childList: true,
        subtree: true,
      });
      observer.observe(content, {
        attributes: true,
        attributeFilter: ["align", "side"],
      });
      const directionObserver = observeInheritedDirection(
        element,
        syncDirection,
      );

      syncDirection();
      syncSemantics();
      setOpen(open);

      trigger.addEventListener("contextmenu", handleContextMenu);
      element.addEventListener("keydown", handleKeydown);
      content.addEventListener("click", handleItemClick);
      content.addEventListener("pointermove", handlePointerMove);
      document.addEventListener("pointerdown", handlePointerDownOutside);
      window.addEventListener("resize", positionContent);
      window.addEventListener("scroll", positionContent, true);

      onDestroy(scope, () => {
        cleanupSubmenus();
        observer.disconnect();
        directionObserver?.disconnect();
        trigger.removeEventListener("contextmenu", handleContextMenu);
        element.removeEventListener("keydown", handleKeydown);
        content.removeEventListener("click", handleItemClick);
        content.removeEventListener("pointermove", handlePointerMove);
        document.removeEventListener("pointerdown", handlePointerDownOutside);
        window.removeEventListener("resize", positionContent);
        window.removeEventListener("scroll", positionContent, true);
      });
    },
  };
}
