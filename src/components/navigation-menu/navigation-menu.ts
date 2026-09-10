import type {} from "@angular-wave/angular.ts";

import {
  getDirection,
  setAttributeIfChanged,
  isDisabled,
  nextIndex,
  onDestroy,
  query,
  queryAll,
  setOpenState,
} from "../../internal/dom";

type NavigationMenuEntry = {
  _item: HTMLElement;
  _trigger: HTMLElement;
  _content: HTMLElement;
  _open: boolean;
  _disconnect: () => void;
};

const itemSelector = ":scope > ul > li";
const triggerSelector = "button";
const contentSelector = "section";
const linkSelector = "a[href]";
const listSelector = ":scope > ul";

let navigationMenuId = 0;

const directChild = (
  element: HTMLElement,
  selector: string,
): HTMLElement | null =>
  Array.from(element.children).find(
    (child): child is HTMLElement =>
      child instanceof HTMLElement && child.matches(selector),
  ) ?? null;

export function navigationMenuDirective(): ng.Directive {
  return {
    link(scope: ng.Scope, element: HTMLElement) {
      const list = query(element, listSelector, HTMLElement);
      const entries: NavigationMenuEntry[] = [];
      const triggers: HTMLElement[] = [];
      const topLevelControls: HTMLElement[] = [];
      const boundEntries = new Map<HTMLElement, NavigationMenuEntry>();
      let initialized = false;

      const getHorizontalDirection = (key: string): 1 | -1 =>
        (key === "ArrowRight") === (getDirection(element) === "ltr") ? 1 : -1;

      const syncRootState = () => {
        const open = entries.some((entry) => entry._open);
        element.toggleAttribute("open", open);
      };

      const getContentItems = (content: HTMLElement): HTMLElement[] =>
        Array.from(
          content.querySelectorAll<HTMLElement>("a[href], button, [tabindex]"),
        ).filter(
          (item) =>
            !isDisabled(item) &&
            !item.hidden &&
            item.getAttribute("aria-hidden") !== "true",
        );

      const positionContent = (content: HTMLElement) => {
        content.style.removeProperty("--navigation-menu-content-offset");
        const bounds = content.getBoundingClientRect();
        const viewportPadding = 12;
        const offset =
          bounds.left < viewportPadding
            ? viewportPadding - bounds.left
            : bounds.right > window.innerWidth - viewportPadding
              ? window.innerWidth - viewportPadding - bounds.right
              : 0;
        content.style.setProperty(
          "--navigation-menu-content-offset",
          `${String(offset)}px`,
        );
      };

      const setMenuState = (index: number, open: boolean, focus = false) => {
        const entry = entries.at(index);
        if (!entry) return;

        entry._open = open;
        setAttributeIfChanged(entry._trigger, "aria-expanded", String(open));
        entry._content.toggleAttribute("open", open);
        setAttributeIfChanged(entry._content, "aria-hidden", String(!open));
        setOpenState(entry._content, open);
        syncRootState();

        if (open) positionContent(entry._content);
        if (open && focus) {
          getContentItems(entry._content)[0]?.focus({ preventScroll: true });
        }
      };

      const closeAll = () => {
        entries.forEach((_, index) => {
          setMenuState(index, false);
        });
      };

      const openMenu = (index: number, focus = false) => {
        if (index < 0 || isDisabled(entries[index]?._trigger)) return;
        closeAll();
        setMenuState(index, true, focus);
      };

      const getEntryIndex = (entry: NavigationMenuEntry) =>
        entries.indexOf(entry);

      const getEntryForControl = (
        control: HTMLElement,
      ): NavigationMenuEntry | undefined =>
        entries.find((entry) => entry._trigger === control);

      const getEntryForContent = (
        content: HTMLElement,
      ): NavigationMenuEntry | undefined =>
        entries.find((entry) => entry._content === content);

      const getEnabledControlIndex = (index: number, direction: 1 | -1) => {
        if (!topLevelControls.length) return -1;
        let candidate = nextIndex(index, topLevelControls.length, direction);
        let safety = 0;
        while (
          isDisabled(topLevelControls[candidate]) &&
          safety < topLevelControls.length
        ) {
          candidate = nextIndex(candidate, topLevelControls.length, direction);
          safety += 1;
        }
        return isDisabled(topLevelControls[candidate]) ? -1 : candidate;
      };

      const getBoundaryControlIndex = (fromEnd: boolean) => {
        const indexes = topLevelControls.map((_, index) => index);
        if (fromEnd) indexes.reverse();
        return (
          indexes.find((index) => !isDisabled(topLevelControls[index])) ?? -1
        );
      };

      const activateTopLevelControl = (
        control: HTMLElement,
        keepDisclosureOpen: boolean,
      ) => {
        control.focus({ preventScroll: true });
        if (!keepDisclosureOpen) return;

        const entry = getEntryForControl(control);
        if (entry) {
          openMenu(getEntryIndex(entry));
        } else {
          closeAll();
        }
      };

      const bindItem = (item: HTMLElement) => {
        if (boundEntries.has(item)) return;

        const trigger = directChild(item, triggerSelector);
        const content = directChild(item, contentSelector);
        if (!trigger || !content) return;

        const triggerId =
          trigger.id || `navigation-menu-trigger-${String(navigationMenuId++)}`;
        const contentId = content.id || `${triggerId}-content`;
        trigger.id = triggerId;
        content.id = contentId;
        setAttributeIfChanged(trigger, "aria-controls", contentId);
        setAttributeIfChanged(content, "aria-labelledby", triggerId);

        const entry: NavigationMenuEntry = {
          _item: item,
          _trigger: trigger,
          _content: content,
          _open: content.hasAttribute("open"),
          _disconnect: () => void 0,
        };
        entries.push(entry);
        triggers.push(trigger);
        boundEntries.set(item, entry);

        const syncFromAttribute = () => {
          const nextOpen = content.hasAttribute("open");
          if (nextOpen === entry._open) return;
          if (nextOpen) {
            openMenu(getEntryIndex(entry));
          } else {
            setMenuState(getEntryIndex(entry), false);
          }
        };

        const observer = new MutationObserver(syncFromAttribute);
        observer.observe(content, {
          attributes: true,
          attributeFilter: ["open"],
        });

        let closeTimer = 0;
        let openedByPointer = false;
        const cancelClose = () => {
          window.clearTimeout(closeTimer);
          closeTimer = 0;
        };
        const scheduleClose = () => {
          cancelClose();
          closeTimer = window.setTimeout(() => {
            if (
              entry._open &&
              !item.matches(":hover") &&
              !item.contains(document.activeElement)
            ) {
              setMenuState(getEntryIndex(entry), false);
            }
          }, 100);
        };
        const handleTriggerClick = () => {
          if (isDisabled(trigger)) return;
          if (entry._open && !openedByPointer) {
            closeAll();
          } else if (entry._open) {
            openedByPointer = false;
          } else {
            openMenu(getEntryIndex(entry));
          }
        };
        const handleTriggerKeydown = (event: KeyboardEvent) => {
          if (isDisabled(trigger) || event.key !== "ArrowDown") {
            return;
          }
          event.preventDefault();
          event.stopPropagation();
          openMenu(getEntryIndex(entry), true);
        };
        const handlePointerEnter = () => {
          cancelClose();
          if (!isDisabled(trigger) && !entry._open) {
            openedByPointer = true;
            openMenu(getEntryIndex(entry));
          }
        };
        const handlePointerLeave = () => {
          scheduleClose();
        };

        trigger.addEventListener("click", handleTriggerClick);
        trigger.addEventListener("keydown", handleTriggerKeydown);
        item.addEventListener("pointerenter", handlePointerEnter);
        item.addEventListener("pointerleave", handlePointerLeave);

        entry._disconnect = () => {
          cancelClose();
          observer.disconnect();
          trigger.removeEventListener("click", handleTriggerClick);
          trigger.removeEventListener("keydown", handleTriggerKeydown);
          item.removeEventListener("pointerenter", handlePointerEnter);
          item.removeEventListener("pointerleave", handlePointerLeave);
        };

        if (initialized) {
          if (entry._open) {
            openMenu(getEntryIndex(entry));
          } else {
            setMenuState(getEntryIndex(entry), false);
          }
        }
      };

      const syncTopLevelControls = () => {
        if (!list) return;
        const controls = Array.from(list.children).flatMap((child) => {
          if (!(child instanceof HTMLLIElement)) {
            return [];
          }
          const control =
            directChild(child, triggerSelector) ??
            directChild(child, linkSelector);
          return control ? [control] : [];
        });
        topLevelControls.splice(0, topLevelControls.length, ...controls);
      };

      const syncStructure = () => {
        boundEntries.forEach((entry, item) => {
          const replaced =
            directChild(item, triggerSelector) !== entry._trigger ||
            directChild(item, contentSelector) !== entry._content;
          if (!item.isConnected || !element.contains(item) || replaced) {
            entry._disconnect();
            boundEntries.delete(item);
            const index = entries.indexOf(entry);
            if (index >= 0) entries.splice(index, 1);
          }
        });

        queryAll<HTMLElement>(element, itemSelector).forEach(bindItem);
        entries.sort((left, right) => {
          const position = left._item.compareDocumentPosition(right._item);
          return position & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
        });
        triggers.splice(
          0,
          triggers.length,
          ...entries.map(({ _trigger }) => _trigger),
        );
        syncTopLevelControls();
        syncRootState();
      };

      const handleKeydown = (event: KeyboardEvent) => {
        const active =
          document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null;
        if (!active || !element.contains(active)) return;

        const activeContent =
          entries.find((entry) => entry._content.contains(active))?._content ??
          null;
        if (event.key === "Escape") {
          if (!entries.some((entry) => entry._open)) return;
          event.preventDefault();
          const entry = activeContent
            ? getEntryForContent(activeContent)
            : entries.find((candidate) => candidate._open);
          closeAll();
          entry?._trigger.focus({ preventScroll: true });
          return;
        }

        if (activeContent) {
          const contentItems = getContentItems(activeContent);
          const activeIndex = contentItems.indexOf(active);
          if (
            event.key === "ArrowDown" ||
            event.key === "ArrowUp" ||
            event.key === "Home" ||
            event.key === "End"
          ) {
            if (!contentItems.length) return;
            event.preventDefault();
            const targetIndex =
              event.key === "Home"
                ? 0
                : event.key === "End"
                  ? contentItems.length - 1
                  : nextIndex(
                      activeIndex,
                      contentItems.length,
                      event.key === "ArrowDown" ? 1 : -1,
                    );
            contentItems[targetIndex].focus({ preventScroll: true });
            return;
          }

          if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            const entry = getEntryForContent(activeContent);
            if (!entry) return;
            const controlIndex = topLevelControls.indexOf(entry._trigger);
            const targetIndex = getEnabledControlIndex(
              controlIndex,
              getHorizontalDirection(event.key),
            );
            if (targetIndex < 0) return;
            event.preventDefault();
            activateTopLevelControl(topLevelControls[targetIndex], true);
          }
          return;
        }

        const currentIndex = topLevelControls.indexOf(active);
        if (currentIndex < 0) return;
        if (
          event.key !== "ArrowRight" &&
          event.key !== "ArrowLeft" &&
          event.key !== "Home" &&
          event.key !== "End"
        ) {
          return;
        }

        event.preventDefault();
        const targetIndex =
          event.key === "Home" || event.key === "End"
            ? getBoundaryControlIndex(event.key === "End")
            : getEnabledControlIndex(
                currentIndex,
                getHorizontalDirection(event.key),
              );
        if (targetIndex < 0) return;
        activateTopLevelControl(
          topLevelControls[targetIndex],
          entries.some((entry) => entry._open),
        );
      };

      const handleClick = (event: MouseEvent) => {
        const target =
          event.target instanceof Element
            ? event.target.closest<HTMLElement>("a[href]")
            : null;
        if (target && element.contains(target)) closeAll();
      };

      const handleDocumentPointerDown = (event: PointerEvent) => {
        if (event.target instanceof Node && !element.contains(event.target)) {
          closeAll();
        }
      };

      const handleDocumentFocus = (event: FocusEvent) => {
        if (event.target instanceof Node && !element.contains(event.target)) {
          closeAll();
        }
      };

      const handleResize = () => {
        entries
          .filter((entry) => entry._open)
          .forEach((entry) => {
            positionContent(entry._content);
          });
      };

      if (element.tagName !== "NAV" && !element.hasAttribute("role")) {
        setAttributeIfChanged(element, "role", "navigation");
      }
      element.addEventListener("keydown", handleKeydown);
      element.addEventListener("click", handleClick);
      document.addEventListener("pointerdown", handleDocumentPointerDown);
      document.addEventListener("focusin", handleDocumentFocus);
      window.addEventListener("resize", handleResize);

      const structureObserver = new MutationObserver(syncStructure);
      structureObserver.observe(element, {
        attributes: true,
        attributeFilter: ["dir"],
        childList: true,
        subtree: true,
      });
      syncStructure();
      let foundInitialOpen = false;
      entries.forEach((entry, index) => {
        const keepOpen = entry._open && !foundInitialOpen;
        if (keepOpen) foundInitialOpen = true;
        setMenuState(index, keepOpen);
      });
      initialized = true;

      onDestroy(scope, () => {
        structureObserver.disconnect();
        element.removeEventListener("keydown", handleKeydown);
        element.removeEventListener("click", handleClick);
        document.removeEventListener("pointerdown", handleDocumentPointerDown);
        document.removeEventListener("focusin", handleDocumentFocus);
        window.removeEventListener("resize", handleResize);
        entries.forEach((entry) => {
          entry._disconnect();
        });
      });
    },
  };
}
