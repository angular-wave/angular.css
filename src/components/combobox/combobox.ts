import type {} from "@angular-wave/angular.ts";

import {
  isOwnedBy,
  observeInheritedDirection,
  queryOwned,
  queryOwnedAll,
  setAttributeIfChanged,
  isDisabled,
  onDestroy,
  setOpenState,
} from "../../internal/dom";

let comboboxIdCounter = 0;

const anchorSelector =
  ":scope > header, :scope > fieldset, :scope > aside > header";
const chipSelector = ":scope > fieldset > span";
const clearSelector = ':scope button[value="clear"]';
const contentSelector = ":scope > aside";
const emptySelector = ":scope > aside > p";
const groupLabelSelector = ":scope > :is(h1, h2, h3, h4, h5, h6)";
const groupSelector = ":scope > aside > div > section";
const inputSelector = ":scope input";
const itemSelector = [
  ":scope > aside > div > ul > li",
  ":scope > aside > div > section > ul > li",
].join(", ");
const rootSelector = "[ng-combobox]";
const separatorSelector = ":scope > aside > div > section > hr";
const triggerSelector = ':scope button[value="toggle"]';

export function comboboxDirective(): ng.Directive {
  return {
    link(scope: ng.Scope, element: HTMLElement) {
      const input = queryOwned(
        element,
        rootSelector,
        inputSelector,
        HTMLInputElement,
      );
      const content = queryOwned(
        element,
        rootSelector,
        contentSelector,
        HTMLElement,
      );
      if (!input || !content) return;

      const contentId =
        content.id || `combobox-content-${String(comboboxIdCounter++)}`;
      const inputId =
        input.id || `combobox-input-${String(comboboxIdCounter++)}`;
      content.id = contentId;
      input.id = inputId;
      setAttributeIfChanged(input, "role", "combobox");
      setAttributeIfChanged(input, "aria-controls", contentId);
      setAttributeIfChanged(input, "aria-haspopup", "listbox");
      setAttributeIfChanged(
        input,
        "aria-autocomplete",
        input.getAttribute("aria-autocomplete") ?? "list",
      );
      setAttributeIfChanged(content, "role", "listbox");
      if (!content.hasAttribute("aria-label")) {
        setAttributeIfChanged(content, "aria-labelledby", inputId);
      }

      let items: HTMLElement[] = [];
      let activeItem: HTMLElement | null = null;
      let open =
        element.hasAttribute("open") &&
        element.getAttribute("open") !== "false";
      let openAtPointerDown = false;

      const itemCleanups = new Map<HTMLElement, () => void>();
      const controlCleanups = new Map<HTMLElement, () => void>();

      const isMultiple = () => element.hasAttribute("multiple");
      const hasAutoHighlight = () => element.hasAttribute("auto-highlight");
      const isVisible = (item: HTMLElement) =>
        !item.hidden &&
        item.getAttribute("aria-hidden") !== "true" &&
        !item.closest("[hidden]") &&
        getComputedStyle(item).display !== "none";
      const visibleItems = (includeDisabled = false) =>
        items.filter(
          (item) => isVisible(item) && (includeDisabled || !isDisabled(item)),
        );

      const syncChrome = () => {
        const multiple = isMultiple();
        setAttributeIfChanged(
          content,
          "aria-multiselectable",
          String(multiple),
        );
      };

      const positionContent = () => {
        if (!open) return;
        const externalTrigger = queryOwnedAll<HTMLElement>(
          element,
          rootSelector,
          triggerSelector,
        ).find((trigger) => trigger.parentElement === element);
        const anchor =
          externalTrigger ??
          queryOwned(element, rootSelector, anchorSelector, HTMLElement) ??
          input;
        const rootBox = element.getBoundingClientRect();
        const anchorBox = anchor.getBoundingClientRect();
        const contentHeight = Math.min(content.scrollHeight, 288);
        let top = anchor.offsetTop + anchorBox.height + 6;
        const projectedBottom = rootBox.top + top + contentHeight;
        if (projectedBottom > window.innerHeight - 4) {
          top = anchor.offsetTop - contentHeight - 6;
          setAttributeIfChanged(content, "side", "top");
        } else {
          setAttributeIfChanged(content, "side", "bottom");
        }
        content.style.setProperty(
          "--combobox-content-top",
          `${String(Math.round(top))}px`,
        );
        content.style.setProperty(
          "--combobox-anchor-width",
          `${String(Math.round(anchorBox.width))}px`,
        );
      };

      const notifyOpenChange = () => {
        element.dispatchEvent(
          new CustomEvent("angularcss:combobox-open-change", {
            bubbles: true,
            detail: { open },
          }),
        );
      };

      const setOpen = (
        nextOpen: boolean,
        notifyApplication = false,
        focusInput = false,
      ) => {
        if (nextOpen && isDisabled(input)) nextOpen = false;
        open = nextOpen;
        setAttributeIfChanged(element, "open", String(open));
        setAttributeIfChanged(content, "aria-hidden", String(!open));
        setAttributeIfChanged(input, "aria-expanded", String(open));
        queryOwnedAll<HTMLElement>(
          element,
          rootSelector,
          triggerSelector,
        ).forEach((trigger) => {
          setAttributeIfChanged(trigger, "aria-expanded", String(open));
        });
        setOpenState(content, open);
        if (open) requestAnimationFrame(positionContent);
        if (focusInput) input.focus({ preventScroll: true });
        if (notifyApplication) notifyOpenChange();
      };

      const clearHighlight = () => {
        activeItem = null;
        items.forEach((item) => {
          setAttributeIfChanged(item, "data-highlighted", "false");
        });
        input.removeAttribute("aria-activedescendant");
      };

      const highlight = (item: HTMLElement | null) => {
        if (!item || isDisabled(item) || !isVisible(item)) {
          clearHighlight();
          return;
        }
        activeItem = item;
        items.forEach((candidate) => {
          setAttributeIfChanged(
            candidate,
            "data-highlighted",
            String(candidate === item),
          );
        });
        setAttributeIfChanged(input, "aria-activedescendant", item.id);
        if (open) item.scrollIntoView({ block: "nearest" });
      };

      const highlightBoundary = (end: "first" | "last") => {
        const visible = visibleItems();
        highlight(end === "first" ? visible[0] : (visible.at(-1) ?? null));
      };

      const moveHighlight = (direction: 1 | -1) => {
        const visible = visibleItems();
        if (!visible.length) {
          clearHighlight();
          return;
        }
        const current = activeItem ? visible.indexOf(activeItem) : -1;
        const next =
          current < 0
            ? direction === 1
              ? 0
              : visible.length - 1
            : (current + direction + visible.length) % visible.length;
        highlight(visible[next]);
      };

      const selectItem = (item: HTMLElement) => {
        if (isDisabled(item)) return;
        const multiple = isMultiple();
        const value =
          item.getAttribute("data-value") ?? item.textContent.trim();
        element.dispatchEvent(
          new CustomEvent("angularcss:combobox-select", {
            bubbles: true,
            detail: { item, multiple, value },
          }),
        );
        if (!multiple) setOpen(false, true);
        input.focus({ preventScroll: true });
      };

      const bindItem = (item: HTMLElement) => {
        if (!item.id) item.id = `combobox-item-${String(comboboxIdCounter++)}`;
        setAttributeIfChanged(item, "role", "option");
        const semanticLabel = item.querySelector<HTMLElement>(
          "h1, h2, h3, h4, h5, h6",
        );
        if (semanticLabel?.textContent.trim()) {
          setAttributeIfChanged(
            item,
            "aria-label",
            semanticLabel.textContent.trim(),
          );
        }
        setAttributeIfChanged(item, "tabindex", "-1");
        if (!item.hasAttribute("aria-selected")) {
          setAttributeIfChanged(item, "aria-selected", "false");
        }
        if (isDisabled(item))
          setAttributeIfChanged(item, "aria-disabled", "true");
        if (itemCleanups.has(item)) return;
        const handleClick = () => {
          selectItem(item);
        };
        item.addEventListener("click", handleClick);
        itemCleanups.set(item, () => {
          item.removeEventListener("click", handleClick);
        });
      };

      const bindControl = (control: HTMLElement, kind: "clear" | "trigger") => {
        if (controlCleanups.has(control)) return;
        if (
          control instanceof HTMLButtonElement &&
          !control.hasAttribute("type")
        ) {
          control.type = "button";
        }
        if (kind === "trigger") {
          setAttributeIfChanged(control, "aria-controls", contentId);
          setAttributeIfChanged(control, "aria-haspopup", "listbox");
          if (
            !control.hasAttribute("aria-label") &&
            !control.textContent.trim()
          ) {
            setAttributeIfChanged(control, "aria-label", "Show options");
          }
          const handleClick = (event: MouseEvent) => {
            event.preventDefault();
            setOpen(!open, true, true);
          };
          control.addEventListener("click", handleClick);
          controlCleanups.set(control, () => {
            control.removeEventListener("click", handleClick);
          });
          return;
        }

        setAttributeIfChanged(
          control,
          "aria-label",
          control.getAttribute("aria-label") ?? "Clear selection",
        );
        const handleClick = () => {
          element.dispatchEvent(
            new CustomEvent("angularcss:combobox-clear", { bubbles: true }),
          );
          input.focus({ preventScroll: true });
        };
        control.addEventListener("click", handleClick);
        controlCleanups.set(control, () => {
          control.removeEventListener("click", handleClick);
        });
      };

      const syncStructure = () => {
        syncChrome();
        const previousActive = activeItem;
        items = queryOwnedAll<HTMLElement>(element, rootSelector, itemSelector);
        items.forEach(bindItem);
        queryOwnedAll<HTMLElement>(
          element,
          rootSelector,
          triggerSelector,
        ).forEach((control) => {
          bindControl(control, "trigger");
        });
        queryOwnedAll<HTMLElement>(
          element,
          rootSelector,
          clearSelector,
        ).forEach((control) => {
          bindControl(control, "clear");
        });
        queryOwnedAll<HTMLElement>(
          element,
          rootSelector,
          groupSelector,
        ).forEach((group) => {
          setAttributeIfChanged(group, "role", "group");
          const label = group.querySelector<HTMLElement>(groupLabelSelector);
          if (!label) return;
          if (!label.id)
            label.id = `combobox-label-${String(comboboxIdCounter++)}`;
          setAttributeIfChanged(group, "aria-labelledby", label.id);
        });
        queryOwnedAll<HTMLElement>(
          element,
          rootSelector,
          separatorSelector,
        ).forEach((separator) => {
          separator.removeAttribute("aria-orientation");
        });

        itemCleanups.forEach((cleanup, item) => {
          if (!item.isConnected || !isOwnedBy(element, rootSelector, item)) {
            cleanup();
            itemCleanups.delete(item);
          }
        });
        controlCleanups.forEach((cleanup, control) => {
          if (
            !control.isConnected ||
            !isOwnedBy(element, rootSelector, control)
          ) {
            cleanup();
            controlCleanups.delete(control);
          }
        });

        const visible = visibleItems(true);
        const empty = visible.length === 0;
        queryOwnedAll<HTMLElement>(
          element,
          rootSelector,
          emptySelector,
        ).forEach((emptySlot) => {
          setAttributeIfChanged(emptySlot, "role", "status");
          setOpenState(emptySlot, empty);
        });

        if (
          previousActive &&
          items.includes(previousActive) &&
          isVisible(previousActive)
        ) {
          highlight(previousActive);
        } else {
          const selected = items.find(
            (item) =>
              isVisible(item) && item.getAttribute("aria-selected") === "true",
          );
          if (selected) highlight(selected);
          else if (open && hasAutoHighlight()) highlightBoundary("first");
          else clearHighlight();
        }
        if (open) requestAnimationFrame(positionContent);
      };

      const handleInput = () => {
        syncChrome();
        clearHighlight();
        setOpen(true, true);
        requestAnimationFrame(syncStructure);
      };
      const handleFocus = () => {
        setOpen(true, true);
      };
      const handleInvalid = () => {
        syncChrome();
      };
      const handleKeydown = (event: KeyboardEvent) => {
        if (event.key === "Tab") {
          setOpen(false, true);
          return;
        }
        if (event.key === "Escape" && open) {
          event.preventDefault();
          setOpen(false, true, true);
          return;
        }
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          event.preventDefault();
          if (!open) setOpen(true, true);
          moveHighlight(event.key === "ArrowDown" ? 1 : -1);
          return;
        }
        if ((event.key === "Home" || event.key === "End") && open) {
          event.preventDefault();
          highlightBoundary(event.key === "Home" ? "first" : "last");
          return;
        }
        if (event.key === "Enter" && open && activeItem) {
          event.preventDefault();
          selectItem(activeItem);
          return;
        }
        if (
          event.key === "Backspace" &&
          isMultiple() &&
          input.value.length === 0 &&
          queryOwnedAll<HTMLElement>(element, rootSelector, chipSelector).length
        ) {
          element.dispatchEvent(
            new CustomEvent("angularcss:combobox-remove-last", {
              bubbles: true,
            }),
          );
        }
      };

      const handlePointerDown = () => {
        openAtPointerDown = open;
      };
      const handleOutsideClick = (event: MouseEvent) => {
        if (
          open &&
          openAtPointerDown &&
          event.target instanceof Node &&
          !element.contains(event.target)
        ) {
          setOpen(false, true);
        }
      };
      const handleOutsideFocus = (event: FocusEvent) => {
        if (
          open &&
          event.target instanceof Node &&
          !element.contains(event.target)
        ) {
          setOpen(false, true);
        }
      };

      const observer = new MutationObserver((records) => {
        syncStructure();
        if (
          records.some(
            (record) =>
              record.target === element && record.attributeName === "open",
          )
        ) {
          const authoredOpen =
            element.hasAttribute("open") &&
            element.getAttribute("open") !== "false";
          if (authoredOpen !== open) setOpen(authoredOpen);
        }
      });
      observer.observe(element, {
        attributes: true,
        attributeFilter: [
          "aria-disabled",
          "aria-hidden",
          "aria-invalid",
          "aria-selected",
          "auto-highlight",
          "dir",
          "disabled",
          "hidden",
          "multiple",
          "open",
          "required",
        ],
        childList: true,
        characterData: true,
        subtree: true,
      });
      const directionObserver = observeInheritedDirection(element, () => {
        syncChrome();
        requestAnimationFrame(positionContent);
      });

      input.addEventListener("input", handleInput);
      input.addEventListener("focus", handleFocus);
      input.addEventListener("invalid", handleInvalid);
      element.addEventListener("keydown", handleKeydown);
      document.addEventListener("pointerdown", handlePointerDown, true);
      document.addEventListener("click", handleOutsideClick);
      document.addEventListener("focusin", handleOutsideFocus);
      window.addEventListener("resize", positionContent);
      syncStructure();
      setOpen(open);

      onDestroy(scope, () => {
        observer.disconnect();
        directionObserver?.disconnect();
        input.removeEventListener("input", handleInput);
        input.removeEventListener("focus", handleFocus);
        input.removeEventListener("invalid", handleInvalid);
        element.removeEventListener("keydown", handleKeydown);
        document.removeEventListener("pointerdown", handlePointerDown, true);
        document.removeEventListener("click", handleOutsideClick);
        document.removeEventListener("focusin", handleOutsideFocus);
        window.removeEventListener("resize", positionContent);
        itemCleanups.forEach((cleanup) => {
          cleanup();
        });
        itemCleanups.clear();
        controlCleanups.forEach((cleanup) => {
          cleanup();
        });
        controlCleanups.clear();
      });
    },
  };
}
