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
import {
  bindSemanticSubmenus,
  getSemanticMenuItemRole,
} from "../../internal/menu";

let menubarIdCounter = 0;

type MenubarEntry = {
  _menu: HTMLElement;
  _trigger: HTMLElement;
  _content: HTMLElement;
  _open: boolean;
};

const menuSelector = ":scope > section";
const triggerSelector = ":scope > button";
const contentSelector = ":scope > menu";
const itemSelector =
  'a, button, [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]';

export function menubarDirective(): ng.Directive {
  return {
    link(scope: ng.Scope, element: HTMLElement) {
      const entries: MenubarEntry[] = [];
      const triggers: HTMLElement[] = [];
      const boundMenus = new WeakSet<HTMLElement>();

      const getHorizontalDirection = (key: string): 1 | -1 =>
        (key === "ArrowRight") === (getDirection(element) === "ltr") ? 1 : -1;

      const syncRootState = () => {
        const open = entries.some((entry) => entry._open);
        element.toggleAttribute("open", open);
      };
      const cleanupSubmenus = bindSemanticSubmenus(element, "menubar", () =>
        getDirection(element),
      );

      const getAllContentItems = (content: HTMLElement): HTMLElement[] =>
        queryAll<HTMLElement>(content, itemSelector).filter((item) => {
          const hiddenAncestor = item.closest("[hidden]");
          return (
            item.closest("menu") === content &&
            (!hiddenAncestor || hiddenAncestor === content)
          );
        });
      const getContentItems = (content: HTMLElement): HTMLElement[] =>
        getAllContentItems(content).filter((item) => !isDisabled(item));

      const syncContentItems = () => {
        queryAll<HTMLElement>(element, ":scope > section > menu").forEach(
          (content) => {
            getAllContentItems(content).forEach((item) => {
              const role = getSemanticMenuItemRole(item);
              setAttributeIfChanged(item, "role", role);
              if (role !== "menuitem" && !item.hasAttribute("aria-checked")) {
                setAttributeIfChanged(item, "aria-checked", "false");
              }
            });
          },
        );
      };

      const setActiveTrigger = (index: number, focus = false) => {
        triggers.forEach((trigger, triggerIndex) => {
          setAttributeIfChanged(
            trigger,
            "tabindex",
            triggerIndex === index ? "0" : "-1",
          );
        });
        if (focus) triggers[index]?.focus({ preventScroll: true });
      };

      const syncActiveTrigger = () => {
        const current = triggers.findIndex(
          (trigger) =>
            trigger.getAttribute("tabindex") === "0" && !isDisabled(trigger),
        );
        const firstEnabled = triggers.findIndex(
          (trigger) => !isDisabled(trigger),
        );
        setActiveTrigger(current >= 0 ? current : firstEnabled);
      };

      const setMenuState = (index: number, open: boolean, focus = false) => {
        const entry = entries.at(index);
        if (!entry) return;

        const wasOpen = entry._open;
        entry._open = open;
        if (open) setActiveTrigger(index);
        setAttributeIfChanged(entry._trigger, "aria-expanded", String(open));
        entry._content.toggleAttribute("open", open);
        setAttributeIfChanged(entry._content, "aria-hidden", String(!open));
        setOpenState(entry._content, open);
        syncRootState();

        if (wasOpen === open) {
          if (open && focus) {
            const focusTarget = getContentItems(entry._content).at(0);
            if (focusTarget) {
              focusTarget.focus();
            } else {
              entry._trigger.focus();
            }
          }
          return;
        }

        if (open && focus) {
          const focusTarget = getContentItems(entry._content).at(0);
          if (focusTarget) {
            focusTarget.focus();
          } else {
            entry._trigger.focus();
          }
          return;
        }

        if (!open && focus) {
          entry._trigger.focus();
        }
      };

      const closeAll = () => {
        entries.forEach((_, index) => {
          setMenuState(index, false);
        });
      };
      const openMenu = (index: number, focus = false) => {
        if (index < 0) return;
        closeAll();
        setMenuState(index, true, focus);
      };

      const getEnabledTriggerIndex = (index: number, direction: 1 | -1) => {
        if (!triggers.length) return -1;
        let next = nextIndex(index, triggers.length, direction);
        let safety = 0;
        while (isDisabled(triggers[next]) && safety < triggers.length) {
          next = nextIndex(next, triggers.length, direction);
          safety += 1;
        }
        return isDisabled(triggers[next]) ? -1 : next;
      };
      const getBoundaryTriggerIndex = (fromEnd: boolean) => {
        const indexes = triggers.map((_, index) => index);
        if (fromEnd) indexes.reverse();
        return indexes.find((index) => !isDisabled(triggers[index])) ?? -1;
      };

      const cleanupEntries: Array<() => void> = [];

      const bindMenu = (menu: HTMLElement) => {
        if (boundMenus.has(menu)) return;

        const trigger = query(menu, triggerSelector, HTMLElement);
        const content = query(menu, contentSelector, HTMLElement);
        if (!trigger || !content) return;

        boundMenus.add(menu);
        const triggerId =
          trigger.id || `menubar-trigger-${String(menubarIdCounter++)}`;
        const contentId = content.id || `${triggerId}-content`;
        trigger.id = triggerId;
        content.id = contentId;
        setAttributeIfChanged(trigger, "role", "menuitem");
        setAttributeIfChanged(trigger, "aria-haspopup", "menu");
        setAttributeIfChanged(trigger, "aria-controls", contentId);
        setAttributeIfChanged(content, "role", "menu");
        setAttributeIfChanged(content, "aria-labelledby", triggerId);
        setAttributeIfChanged(content, "aria-hidden", "true");
        if (!content.hasAttribute("tabindex")) {
          setAttributeIfChanged(content, "tabindex", "-1");
        }
        getContentItems(content).forEach((item) => {
          const role = getSemanticMenuItemRole(item);
          setAttributeIfChanged(item, "role", role);
        });

        const entry: MenubarEntry = {
          _menu: menu,
          _trigger: trigger,
          _content: content,
          _open: content.hasAttribute("open"),
        };
        entries.push(entry);
        triggers.push(trigger);
        setAttributeIfChanged(trigger, "tabindex", "-1");
        const getEntryIndex = () => entries.indexOf(entry);

        const syncFromAttribute = () => {
          const nextOpen = content.hasAttribute("open");
          setMenuState(getEntryIndex(), nextOpen);
        };
        const openObserver = new MutationObserver(() => {
          syncFromAttribute();
        });
        openObserver.observe(content, {
          attributes: true,
          attributeFilter: ["open"],
        });
        cleanupEntries.push(() => {
          openObserver.disconnect();
        });

        setMenuState(getEntryIndex(), entry._open, false);

        const handleTriggerClick = () => {
          if (isDisabled(trigger)) return;
          const currentIndex = getEntryIndex();
          setActiveTrigger(currentIndex);
          if (entry._open) {
            closeAll();
          } else {
            openMenu(currentIndex, true);
          }
        };

        const handleTriggerKeydown = (event: KeyboardEvent) => {
          if (isDisabled(trigger)) return;

          if (
            event.key === "ArrowDown" ||
            event.key === "Enter" ||
            event.key === " " ||
            event.key === "Spacebar"
          ) {
            event.preventDefault();
            openMenu(getEntryIndex(), true);
            return;
          }

          if (
            event.key !== "ArrowRight" &&
            event.key !== "ArrowLeft" &&
            event.key !== "Home" &&
            event.key !== "End"
          ) {
            return;
          }

          event.preventDefault();
          event.stopPropagation();
          if (event.key === "Home" || event.key === "End") {
            const targetIndex = getBoundaryTriggerIndex(event.key === "End");
            if (entries.some((nextEntry) => nextEntry._open)) {
              openMenu(targetIndex, true);
            } else {
              setActiveTrigger(targetIndex, true);
            }
          } else {
            const targetIndex = getEnabledTriggerIndex(
              getEntryIndex(),
              getHorizontalDirection(event.key),
            );
            if (entries.some((nextEntry) => nextEntry._open)) {
              openMenu(targetIndex, true);
            } else {
              setActiveTrigger(targetIndex, true);
            }
          }
        };

        const handleTriggerFocus = () => {
          setActiveTrigger(getEntryIndex());
        };

        trigger.addEventListener("click", handleTriggerClick);
        trigger.addEventListener("keydown", handleTriggerKeydown);
        trigger.addEventListener("focus", handleTriggerFocus);
        cleanupEntries.push(() => {
          trigger.removeEventListener("click", handleTriggerClick);
          trigger.removeEventListener("keydown", handleTriggerKeydown);
          trigger.removeEventListener("focus", handleTriggerFocus);
        });
      };

      const syncStructure = () => {
        queryAll<HTMLElement>(element, menuSelector).forEach(bindMenu);
        entries.sort((left, right) => {
          const position = left._menu.compareDocumentPosition(right._menu);
          return position & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
        });
        triggers.splice(
          0,
          triggers.length,
          ...entries.map(({ _trigger }) => _trigger),
        );
        syncContentItems();
        syncActiveTrigger();
        syncRootState();
      };

      const handleKeydown = (event: KeyboardEvent) => {
        const activeElement =
          document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null;

        const activeTrigger = activeElement
          ? triggers.find((trigger) => trigger === activeElement)
          : null;
        const candidateContent = activeElement
          ? activeElement.closest<HTMLElement>("menu")
          : null;
        const activeContent =
          candidateContent?.parentElement?.parentElement === element
            ? candidateContent
            : null;

        if (!activeTrigger && !activeContent) return;

        if (event.key === "Escape") {
          event.preventDefault();
          if (activeContent) {
            const currentMenu = activeContent.parentElement;
            const currentIndex = currentMenu
              ? entries.findIndex((entry) => entry._menu === currentMenu)
              : -1;
            if (currentIndex >= 0) {
              entries[currentIndex]._trigger.focus();
            }
          }
          closeAll();
          if (activeTrigger) {
            activeTrigger.focus();
          }
          return;
        }

        if (activeContent) {
          const contentRoot = activeContent;
          const contentItems = getContentItems(contentRoot);
          const activeContentIndex = activeElement
            ? contentItems.indexOf(activeElement)
            : -1;
          if (
            event.key === "ArrowDown" ||
            event.key === "ArrowUp" ||
            event.key === "Home" ||
            event.key === "End"
          ) {
            if (!contentItems.length) return;
            event.preventDefault();
            const nextContentIndex =
              event.key === "Home"
                ? 0
                : event.key === "End"
                  ? contentItems.length - 1
                  : nextIndex(
                      activeContentIndex,
                      contentItems.length,
                      event.key === "ArrowDown" ? 1 : -1,
                    );
            contentItems[nextContentIndex].focus();
            return;
          }

          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            const currentMenu = activeContent.parentElement;
            const currentIndex = currentMenu
              ? entries.findIndex((entry) => entry._menu === currentMenu)
              : -1;
            const nextMenuIndex = getEnabledTriggerIndex(
              currentIndex,
              getHorizontalDirection(event.key),
            );
            if (nextMenuIndex >= 0) {
              openMenu(nextMenuIndex, true);
            }
            return;
          }
        }

        if (
          activeTrigger &&
          (event.key === "ArrowLeft" || event.key === "ArrowRight")
        ) {
          const currentIndex = triggers.indexOf(activeTrigger);
          event.preventDefault();
          const nextIndexValue = getEnabledTriggerIndex(
            currentIndex,
            getHorizontalDirection(event.key),
          );
          if (nextIndexValue >= 0) {
            openMenu(nextIndexValue, true);
          }
        }
      };

      setAttributeIfChanged(element, "role", "menubar");

      const handleDocumentClick = (event: MouseEvent) => {
        if (event.target instanceof Node && !element.contains(event.target)) {
          closeAll();
        }
      };
      const handleItemClick = (event: MouseEvent) => {
        const target =
          event.target instanceof Element
            ? event.target.closest<HTMLElement>(itemSelector)
            : null;
        if (!target?.closest("menu") || isDisabled(target)) {
          return;
        }
        closeAll();
      };
      element.addEventListener("keydown", handleKeydown);
      element.addEventListener("click", handleItemClick);
      document.addEventListener("click", handleDocumentClick);
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

      onDestroy(scope, () => {
        structureObserver.disconnect();
        element.removeEventListener("keydown", handleKeydown);
        element.removeEventListener("click", handleItemClick);
        document.removeEventListener("click", handleDocumentClick);
        cleanupEntries.forEach((cleanup) => {
          cleanup();
        });
        cleanupSubmenus();
      });
    },
  };
}
