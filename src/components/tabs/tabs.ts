import type {} from "@angular-wave/angular.ts";

import {
  getDirection,
  isDisabled,
  observeInheritedDirection,
  setAttributeIfChanged,
  nextIndex,
  onDestroy,
  queryAll,
  setOpenState,
} from "../../internal/dom";

let tabsIdCounter = 0;
const triggerSelector = ":scope > menu > button";
const contentSelector = ":scope > :is(article, section)";
const listSelector = ":scope > menu";

export function tabsDirective(): ng.Directive {
  return {
    link(scope: ng.Scope, element: HTMLElement) {
      let triggers: HTMLElement[] = [];
      let contents: HTMLElement[] = [];
      let orientation = "horizontal";
      let activeIndex = 0;
      const cleanupTriggers = new WeakMap<HTMLElement, () => void>();

      const firstEnabledIndex = () =>
        Math.max(
          0,
          triggers.findIndex((trigger) => !isDisabled(trigger)),
        );

      const lastEnabledIndex = () => {
        for (let index = triggers.length - 1; index >= 0; index -= 1) {
          if (!isDisabled(triggers[index])) return index;
        }
        return 0;
      };

      const getNextEnabledIndex = (index: number, direction: 1 | -1) => {
        if (!triggers.length) return -1;
        let next = nextIndex(index, triggers.length, direction);
        let safety = 0;
        while (isDisabled(triggers[next]) && safety < triggers.length) {
          next = nextIndex(next, triggers.length, direction);
          safety += 1;
        }
        return next;
      };

      const activate = (index: number, focus = false) => {
        if (!triggers.length || index < 0) return;
        const nextActiveIndex = Math.min(index, triggers.length - 1);
        activeIndex = nextActiveIndex;
        triggers.forEach((trigger, triggerIndex) => {
          const selected = triggerIndex === nextActiveIndex;
          const disabled = isDisabled(trigger);
          setAttributeIfChanged(trigger, "aria-selected", String(selected));
          setAttributeIfChanged(
            trigger,
            "tabindex",
            selected && !disabled ? "0" : "-1",
          );
          if (selected && focus) trigger.focus();
        });

        contents.forEach((content, contentIndex) => {
          const selected = contentIndex === nextActiveIndex;
          setOpenState(content, selected);
          setAttributeIfChanged(content, "role", "tabpanel");
          setAttributeIfChanged(content, "aria-hidden", String(!selected));
          setAttributeIfChanged(content, "tabindex", selected ? "0" : "-1");
        });
      };

      const bindTrigger = (trigger: HTMLElement) => {
        if (cleanupTriggers.has(trigger)) return;

        const handleClick = () => {
          const index = triggers.indexOf(trigger);
          if (index >= 0 && !isDisabled(trigger)) activate(index);
        };
        const handleKeydown = (event: KeyboardEvent) => {
          const index = triggers.indexOf(trigger);
          if (index < 0) return;

          if (
            event.key === "Enter" ||
            event.key === " " ||
            event.key === "Spacebar"
          ) {
            event.preventDefault();
            if (!isDisabled(trigger)) activate(index, true);
            return;
          }

          if (isDisabled(trigger)) return;

          const nextKey =
            orientation === "vertical" ? "ArrowDown" : "ArrowRight";
          const previousKey =
            orientation === "vertical" ? "ArrowUp" : "ArrowLeft";

          if (event.key === nextKey || event.key === previousKey) {
            event.preventDefault();
            let direction: 1 | -1 = event.key === nextKey ? 1 : -1;
            if (orientation !== "vertical" && getDirection(element) === "rtl") {
              direction = direction === 1 ? -1 : 1;
            }
            const next = getNextEnabledIndex(index, direction);
            activate(next, true);
            return;
          }

          if (event.key === "Home" || event.key === "End") {
            event.preventDefault();
            activate(
              event.key === "Home" ? firstEnabledIndex() : lastEnabledIndex(),
              true,
            );
          }
        };

        trigger.addEventListener("click", handleClick);
        trigger.addEventListener("keydown", handleKeydown);
        cleanupTriggers.set(trigger, () => {
          trigger.removeEventListener("click", handleClick);
          trigger.removeEventListener("keydown", handleKeydown);
        });
      };

      const sync = () => {
        triggers = queryAll<HTMLElement>(element, triggerSelector);
        contents = queryAll<HTMLElement>(element, contentSelector);

        const list = element.querySelector<HTMLElement>(listSelector);
        orientation =
          element.getAttribute("orientation") ??
          element.getAttribute("aria-orientation") ??
          list?.getAttribute("aria-orientation") ??
          "horizontal";
        orientation = orientation === "vertical" ? "vertical" : "horizontal";
        setAttributeIfChanged(element, "orientation", orientation);
        if (list) {
          setAttributeIfChanged(list, "role", "tablist");
          setAttributeIfChanged(list, "aria-orientation", orientation);
        }

        triggers.forEach((trigger, index) => {
          const content = contents.at(index);
          const triggerId = trigger.id || `tabs-tab-${String(tabsIdCounter++)}`;
          trigger.id = triggerId;
          setAttributeIfChanged(trigger, "role", "tab");
          if (content) {
            const contentId = content.id || `${triggerId}-content`;
            content.id = contentId;
            setAttributeIfChanged(trigger, "aria-controls", contentId);
            setAttributeIfChanged(content, "role", "tabpanel");
            setAttributeIfChanged(content, "aria-labelledby", triggerId);
          }
          bindTrigger(trigger);
        });

        if (!triggers.length) return;

        const selectedIndex = triggers.findIndex(
          (trigger) =>
            !isDisabled(trigger) &&
            trigger.getAttribute("aria-selected") === "true",
        );
        const nextActiveIndex =
          selectedIndex >= 0
            ? selectedIndex
            : triggers[activeIndex] && !isDisabled(triggers[activeIndex])
              ? activeIndex
              : firstEnabledIndex();
        activate(nextActiveIndex);
      };

      const observer = new MutationObserver(sync);
      observer.observe(element, {
        attributes: true,
        attributeFilter: [
          "aria-disabled",
          "aria-orientation",
          "aria-selected",
          "disabled",
          "orientation",
          "dir",
        ],
        childList: true,
        subtree: true,
      });

      sync();

      const directionObserver = observeInheritedDirection(element, sync);

      onDestroy(scope, () => {
        observer.disconnect();
        directionObserver?.disconnect();
        triggers.forEach((trigger) => cleanupTriggers.get(trigger)?.());
      });
    },
  };
}
