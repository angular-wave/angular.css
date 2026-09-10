import type {} from "@angular-wave/angular.ts";
import EmblaCarousel, {
  type EmblaCarouselType,
  type EmblaOptionsType,
  type EmblaPluginType,
} from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";

import {
  getDirection,
  isOwnedBy,
  observeInheritedDirection,
  onDestroy,
  queryAll,
  queryOwnedAll,
  setAttributeIfChanged,
} from "../../internal/dom";

const ROOT_SELECTOR = "[ng-carousel]";

export interface CarouselChangeDetail {
  api: EmblaCarouselType;
  count: number;
  index: number;
  item: HTMLElement | null;
  itemCount: number;
  itemIndex: number;
}

const hasEnabledAttribute = (element: HTMLElement, name: string): boolean => {
  const value = element.getAttribute(name);
  return value !== null && value !== "false";
};

const parsePositiveInteger = (
  element: HTMLElement,
  name: string,
): number | undefined => {
  const value = Number.parseInt(element.getAttribute(name) ?? "", 10);
  return Number.isFinite(value) && value > 0 ? value : undefined;
};

const parseNonNegativeInteger = (
  element: HTMLElement,
  name: string,
): number | undefined => {
  const value = Number.parseInt(element.getAttribute(name) ?? "", 10);
  return Number.isFinite(value) && value >= 0 ? value : undefined;
};

export function carouselDirective(): ng.Directive {
  return {
    link(scope: ng.Scope, element: HTMLElement) {
      const viewport = Array.from(element.children).find(
        (child): child is HTMLElement =>
          child instanceof HTMLElement &&
          child.querySelector(":scope > ul, :scope > ol") !== null,
      );
      const track = viewport?.querySelector<HTMLElement>(
        ":scope > ul, :scope > ol",
      );

      if (!viewport || track?.parentElement !== viewport) return;

      const getItems = (): HTMLElement[] =>
        queryAll<HTMLElement>(track, ":scope > li").filter((item) =>
          isOwnedBy(element, ROOT_SELECTOR, item),
        );
      const getDots = (): HTMLElement[] =>
        queryOwnedAll<HTMLElement>(
          element,
          ROOT_SELECTOR,
          ":scope > nav > button",
        );
      const getControls = (): readonly [
        HTMLButtonElement | undefined,
        HTMLButtonElement | undefined,
      ] => {
        const controls = Array.from(element.children).filter(
          (child): child is HTMLButtonElement =>
            child instanceof HTMLButtonElement,
        );
        return [controls.at(0), controls.at(1)];
      };
      const getOrientation = (): "horizontal" | "vertical" =>
        element.getAttribute("orientation") === "vertical"
          ? "vertical"
          : "horizontal";
      const getOptions = (): EmblaOptionsType => {
        const align = element.getAttribute("align");
        const containScroll = element.getAttribute("contain-scroll");

        return {
          align:
            align === "start" || align === "center" || align === "end"
              ? align
              : "center",
          axis: getOrientation() === "vertical" ? "y" : "x",
          containScroll:
            containScroll === "false"
              ? false
              : containScroll === "keepSnaps"
                ? "keepSnaps"
                : "trimSnaps",
          direction: getDirection(element),
          dragFree: hasEnabledAttribute(element, "drag-free"),
          loop: hasEnabledAttribute(element, "loop"),
          skipSnaps: hasEnabledAttribute(element, "skip-snaps"),
          slidesToScroll:
            parsePositiveInteger(element, "slides-to-scroll") ?? 1,
          startIndex: parseNonNegativeInteger(element, "start-index") ?? 0,
          watchDrag: element.getAttribute("draggable") !== "false",
        };
      };
      const getPlugins = (): EmblaPluginType[] => {
        if (!hasEnabledAttribute(element, "autoplay")) return [];

        return [
          Autoplay({
            delay: parsePositiveInteger(element, "autoplay-delay") ?? 2000,
            stopOnFocusIn: true,
            stopOnInteraction: true,
            stopOnMouseEnter: true,
          }),
        ];
      };

      const api = EmblaCarousel(viewport, getOptions(), getPlugins());
      let destroyed = false;
      let reinitializeQueued = false;
      const syncStaticSemantics = () => {
        const items = getItems();
        const dots = getDots();
        if (element.tagName !== "SECTION" && !element.hasAttribute("role")) {
          setAttributeIfChanged(element, "role", "region");
        }
        setAttributeIfChanged(element, "aria-roledescription", "carousel");
        setAttributeIfChanged(
          element,
          "tabindex",
          element.getAttribute("tabindex") ?? "0",
        );
        setAttributeIfChanged(element, "orientation", getOrientation());

        items.forEach((item, index) => {
          item.removeAttribute("role");
          setAttributeIfChanged(item, "aria-roledescription", "slide");
          setAttributeIfChanged(
            item,
            "aria-label",
            item.getAttribute("aria-label") ??
              `${String(index + 1)} of ${String(items.length)}`,
          );
        });
        dots.forEach((dot, index) => {
          setAttributeIfChanged(
            dot,
            "aria-label",
            dot.getAttribute("aria-label") ??
              `Go to slide ${String(index + 1)}`,
          );
        });
        const [previous, next] = getControls();
        if (previous) {
          setAttributeIfChanged(
            previous,
            "aria-label",
            previous.getAttribute("aria-label") ?? "Previous slide",
          );
        }
        if (next) {
          setAttributeIfChanged(
            next,
            "aria-label",
            next.getAttribute("aria-label") ?? "Next slide",
          );
        }
      };

      const getSelectedItemIndex = (): number => {
        const selectedSnap = api.selectedScrollSnap();
        return api.internalEngine().slideRegistry[selectedSnap]?.[0] ?? 0;
      };

      const createDetail = (): CarouselChangeDetail => {
        const items = getItems();
        const itemIndex = Math.min(getSelectedItemIndex(), items.length - 1);
        return {
          api,
          count: api.scrollSnapList().length,
          index: api.selectedScrollSnap(),
          item: items[itemIndex] || null,
          itemCount: items.length,
          itemIndex,
        };
      };

      const syncSelectedState = () => {
        const detail = createDetail();
        const itemsInView = new Set(api.slidesInView());
        const dots = getDots();

        getItems().forEach((item, index) => {
          setAttributeIfChanged(
            item,
            "aria-hidden",
            String(!itemsInView.has(index)),
          );
        });
        dots.forEach((dot, index) => {
          const active = index === detail.index;
          setAttributeIfChanged(dot, "aria-current", active ? "true" : "false");
          dot.toggleAttribute("hidden", index >= detail.count);
        });

        const [previous, next] = getControls();
        if (previous) {
          previous.setAttribute("aria-disabled", String(!api.canScrollPrev()));
          previous.toggleAttribute("disabled", !api.canScrollPrev());
        }
        if (next) {
          next.setAttribute("aria-disabled", String(!api.canScrollNext()));
          next.toggleAttribute("disabled", !api.canScrollNext());
        }
      };

      const dispatchState = (name: string) => {
        element.dispatchEvent(
          new CustomEvent(name, {
            bubbles: true,
            detail: createDetail(),
          }),
        );
      };
      const handleSelect = () => {
        syncSelectedState();
        dispatchState("angularcss:carousel-change");
      };
      const handleReInit = () => {
        syncStaticSemantics();
        syncSelectedState();
      };
      const handleClick = (event: MouseEvent) => {
        const target = event.target;
        if (!(target instanceof Element)) return;
        const control = target.closest<HTMLButtonElement>("button");
        if (!control || !isOwnedBy(element, ROOT_SELECTOR, control)) return;
        const [previous, next] = getControls();

        if (control === previous) {
          api.scrollPrev();
        } else if (control === next) {
          api.scrollNext();
        } else {
          const dotIndex = getDots().indexOf(control);
          if (dotIndex >= 0) api.scrollTo(dotIndex);
        }
      };
      const handleKeydown = (event: KeyboardEvent) => {
        const vertical = getOrientation() === "vertical";
        const nextKey = vertical ? "ArrowDown" : "ArrowRight";
        const previousKey = vertical ? "ArrowUp" : "ArrowLeft";
        if (event.key !== nextKey && event.key !== previousKey) return;

        event.preventDefault();
        if (event.key === nextKey) api.scrollNext();
        else api.scrollPrev();
      };
      const queueReinitialize = () => {
        if (reinitializeQueued || destroyed) return;
        reinitializeQueued = true;
        queueMicrotask(() => {
          reinitializeQueued = false;
          if (destroyed) return;
          api.reInit(getOptions(), getPlugins());
        });
      };

      api.on("select", handleSelect);
      api.on("reInit", handleReInit);
      api.on("slidesInView", syncSelectedState);
      element.addEventListener("click", handleClick);
      element.addEventListener("keydown", handleKeydown);

      const carouselObserver = new MutationObserver(queueReinitialize);
      carouselObserver.observe(element, {
        attributes: true,
        attributeFilter: [
          "align",
          "autoplay",
          "autoplay-delay",
          "contain-scroll",
          "dir",
          "drag-free",
          "draggable",
          "loop",
          "orientation",
          "skip-snaps",
          "slides-to-scroll",
        ],
        childList: true,
        subtree: true,
      });
      const directionObserver = observeInheritedDirection(
        element,
        queueReinitialize,
      );

      syncStaticSemantics();
      syncSelectedState();
      requestAnimationFrame(() => {
        if (!destroyed) dispatchState("angularcss:carousel-ready");
      });

      onDestroy(scope, () => {
        destroyed = true;
        carouselObserver.disconnect();
        directionObserver?.disconnect();
        element.removeEventListener("click", handleClick);
        element.removeEventListener("keydown", handleKeydown);
        api.destroy();
      });
    },
  };
}
