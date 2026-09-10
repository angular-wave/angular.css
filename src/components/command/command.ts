import type {} from "@angular-wave/angular.ts";

import {
  isOwnedBy,
  queryOwned,
  queryOwnedAll,
  setAttributeIfChanged,
  isDisabled,
  onDestroy,
  setOpenState,
} from "../../internal/dom";

let commandIdCounter = 0;

const emptySelector = ":scope > :last-child > p";
const groupHeadingSelector = ":scope > :is(h1, h2, h3, h4, h5, h6)";
const groupSelector = ":scope > :last-child > section";
const inputSelector = ":scope input";
const itemSelectors = [
  ":scope > :last-child > button",
  ":scope > :last-child > li",
  ":scope > :last-child > section > button",
  ":scope > :last-child > section > li",
] as const;
const itemSelector = itemSelectors.join(", ");
const listSelector = ":scope > :last-child";
const rootSelector = "[ng-command]";
const separatorSelector = ":scope > :last-child > hr";
const shortcutSelector = itemSelectors
  .map((selector) => `${selector} > kbd`)
  .join(", ");

export function commandDirective(): ng.Directive {
  return {
    link(scope: ng.Scope, element: HTMLElement) {
      const input = queryOwned(
        element,
        rootSelector,
        inputSelector,
        HTMLInputElement,
      );
      if (!input) return;

      const itemCleanups = new Map<HTMLElement, () => void>();
      let items: HTMLElement[] = [];
      let activeItem: HTMLElement | null = null;

      const isVisible = (item: HTMLElement) => {
        const hiddenAncestor = item.parentElement?.closest("[hidden]");
        const hiddenInsideCommand = Boolean(
          hiddenAncestor &&
          hiddenAncestor !== element &&
          element.contains(hiddenAncestor),
        );
        return (
          !item.hidden &&
          item.getAttribute("aria-hidden") !== "true" &&
          !hiddenInsideCommand &&
          getComputedStyle(item).display !== "none"
        );
      };
      const renderedItems = () => items.filter(isVisible);
      const enabledItems = () =>
        renderedItems().filter((item) => !isDisabled(item));

      const selectItem = (item: HTMLElement | null, scroll = false): void => {
        if (!item || isDisabled(item) || !isVisible(item)) {
          activeItem = null;
        } else {
          activeItem = item;
        }

        items.forEach((candidate) => {
          const selected = candidate === activeItem;
          setAttributeIfChanged(candidate, "aria-selected", String(selected));
        });

        if (activeItem) {
          setAttributeIfChanged(input, "aria-activedescendant", activeItem.id);
          if (scroll) activeItem.scrollIntoView({ block: "nearest" });
        } else {
          input.removeAttribute("aria-activedescendant");
        }
      };

      const move = (delta: 1 | -1) => {
        const enabled = enabledItems();
        if (!enabled.length) {
          selectItem(null);
          return;
        }
        const current = activeItem ? enabled.indexOf(activeItem) : -1;
        const next =
          current < 0
            ? delta === 1
              ? 0
              : enabled.length - 1
            : (current + delta + enabled.length) % enabled.length;
        selectItem(enabled[next], true);
      };

      const bindItem = (item: HTMLElement) => {
        if (!item.id) item.id = `command-item-${String(commandIdCounter++)}`;
        setAttributeIfChanged(item, "role", "option");
        setAttributeIfChanged(item, "tabindex", "-1");
        if (isDisabled(item)) {
          setAttributeIfChanged(item, "aria-disabled", "true");
        }
        if (itemCleanups.has(item)) return;

        const handlePointerMove = () => {
          if (!isDisabled(item)) selectItem(item);
        };
        const handleClick = () => {
          if (!isDisabled(item)) selectItem(item);
        };
        item.addEventListener("pointermove", handlePointerMove);
        item.addEventListener("click", handleClick);
        itemCleanups.set(item, () => {
          item.removeEventListener("pointermove", handlePointerMove);
          item.removeEventListener("click", handleClick);
        });
      };

      const syncStructure = () => {
        const previousActive = activeItem;
        items = queryOwnedAll<HTMLElement>(element, rootSelector, itemSelector);
        items.forEach(bindItem);

        itemCleanups.forEach((cleanup, item) => {
          if (!item.isConnected || !isOwnedBy(element, rootSelector, item)) {
            cleanup();
            itemCleanups.delete(item);
          }
        });

        const list = queryOwned(
          element,
          rootSelector,
          listSelector,
          HTMLElement,
        );
        if (list) {
          if (!list.id) list.id = `command-list-${String(commandIdCounter++)}`;
          setAttributeIfChanged(list, "role", "listbox");
          setAttributeIfChanged(input, "aria-controls", list.id);
        }

        queryOwnedAll<HTMLElement>(
          element,
          rootSelector,
          groupSelector,
        ).forEach((group) => {
          setAttributeIfChanged(group, "role", "group");
          const heading =
            group.querySelector<HTMLElement>(groupHeadingSelector);
          if (!heading) return;
          if (!heading.id) {
            heading.id = `command-group-heading-${String(commandIdCounter++)}`;
          }
          setAttributeIfChanged(heading, "role", "presentation");
          setAttributeIfChanged(group, "aria-labelledby", heading.id);
        });
        queryOwnedAll<HTMLElement>(
          element,
          rootSelector,
          separatorSelector,
        ).forEach((separator) => {
          setAttributeIfChanged(separator, "role", "presentation");
          separator.removeAttribute("aria-orientation");
        });
        queryOwnedAll<HTMLElement>(
          element,
          rootSelector,
          shortcutSelector,
        ).forEach((shortcut) => {
          setAttributeIfChanged(shortcut, "aria-hidden", "true");
        });

        const rendered = renderedItems();
        const empty = rendered.length === 0;
        setAttributeIfChanged(input, "aria-expanded", String(!empty));
        queryOwnedAll<HTMLElement>(
          element,
          rootSelector,
          emptySelector,
        ).forEach((emptySlot) => {
          setAttributeIfChanged(emptySlot, "role", "status");
          setOpenState(emptySlot, empty);
        });

        const enabled = enabledItems();
        const authoredSelected = enabled.find(
          (item) => item.getAttribute("aria-selected") === "true",
        );
        if (previousActive && enabled.includes(previousActive)) {
          selectItem(previousActive);
        } else {
          selectItem(authoredSelected ?? enabled.at(0) ?? null);
        }
      };

      const handleKeydown = (event: KeyboardEvent) => {
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          event.preventDefault();
          move(event.key === "ArrowDown" ? 1 : -1);
          return;
        }
        if (event.key === "Home" || event.key === "End") {
          event.preventDefault();
          const enabled = enabledItems();
          selectItem(
            event.key === "Home"
              ? (enabled[0] ?? null)
              : (enabled.at(-1) ?? null),
            true,
          );
          return;
        }
        if (event.key === "Enter" && activeItem) {
          event.preventDefault();
          activeItem.click();
        }
      };

      setAttributeIfChanged(input, "role", "combobox");
      setAttributeIfChanged(
        input,
        "aria-autocomplete",
        input.getAttribute("aria-autocomplete") ?? "list",
      );

      const observer = new MutationObserver(syncStructure);
      observer.observe(element, {
        attributes: true,
        attributeFilter: [
          "aria-disabled",
          "aria-hidden",
          "dir",
          "disabled",
          "hidden",
        ],
        childList: true,
        subtree: true,
      });
      input.addEventListener("keydown", handleKeydown);
      syncStructure();

      onDestroy(scope, () => {
        observer.disconnect();
        itemCleanups.forEach((cleanup) => {
          cleanup();
        });
        itemCleanups.clear();
        input.removeEventListener("keydown", handleKeydown);
      });
    },
  };
}
