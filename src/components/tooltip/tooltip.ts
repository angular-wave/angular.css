import type {} from "@angular-wave/angular.ts";

import {
  isDisabled,
  onDestroy,
  query,
  setOpenState,
  setAttributeIfChanged,
} from "../../internal/dom";

let tooltipIdCounter = 0;

const sides = new Set(["bottom", "left", "right", "top"]);

export function tooltipDirective(): ng.Directive {
  return {
    link(scope: ng.Scope, element: HTMLElement) {
      const trigger = query(element, ":scope > :first-child", HTMLElement);
      const content = query(element, ":scope > :last-child", HTMLElement);

      if (!trigger || !content || trigger === content) return;

      const syncSide = () => {
        const authored = content.getAttribute("side");
        const side = authored && sides.has(authored) ? authored : "top";
        setAttributeIfChanged(content, "side", side);
      };
      const contentId =
        content.id || `tooltip-content-${String(tooltipIdCounter++)}`;
      content.id = contentId;
      trigger.setAttribute("aria-describedby", contentId);
      content.setAttribute("role", "tooltip");

      let controlledOpen = element.hasAttribute("open");
      let keepOpen = false;
      const isOpen = () => keepOpen || controlledOpen;
      let appliedOpen = isOpen();
      let reflectingOpen = false;
      const setOpen = () => {
        const nextOpen = isOpen();
        const wasOpen = appliedOpen;
        appliedOpen = nextOpen;
        setAttributeIfChanged(content, "aria-hidden", String(!nextOpen));
        reflectingOpen = true;
        element.toggleAttribute("open", nextOpen);
        setOpenState(content, nextOpen);
        queueMicrotask(() => {
          reflectingOpen = false;
        });
        if (nextOpen === wasOpen) return;
      };

      const syncFromAttribute = () => {
        if (reflectingOpen) return;
        const nextOpen = element.hasAttribute("open");
        if (nextOpen === controlledOpen) return;
        controlledOpen = nextOpen;
        setOpen();
      };
      const sideObserver = new MutationObserver(syncSide);
      sideObserver.observe(content, {
        attributes: true,
        attributeFilter: ["side"],
      });
      const elementObserver = new MutationObserver((records) => {
        if (records.some((record) => record.attributeName === "open")) {
          syncFromAttribute();
        }
      });
      elementObserver.observe(element, {
        attributes: true,
        attributeFilter: ["dir", "open"],
      });

      syncSide();
      setOpen();

      const handleOpen = () => {
        if (isDisabled(trigger)) return;
        keepOpen = true;
        setOpen();
      };
      const handleClose = () => {
        keepOpen = false;
        setOpen();
      };
      const handleKeydown = (event: KeyboardEvent) => {
        if (event.key === "Escape") handleClose();
      };

      trigger.addEventListener("mouseenter", handleOpen);
      trigger.addEventListener("mouseleave", handleClose);
      trigger.addEventListener("focusin", handleOpen);
      trigger.addEventListener("focus", handleOpen);
      trigger.addEventListener("blur", handleClose);
      trigger.addEventListener("keydown", handleKeydown);

      onDestroy(scope, () => {
        sideObserver.disconnect();
        elementObserver.disconnect();
        trigger.removeEventListener("mouseenter", handleOpen);
        trigger.removeEventListener("mouseleave", handleClose);
        trigger.removeEventListener("focusin", handleOpen);
        trigger.removeEventListener("focus", handleOpen);
        trigger.removeEventListener("blur", handleClose);
        trigger.removeEventListener("keydown", handleKeydown);
      });
    },
  };
}
