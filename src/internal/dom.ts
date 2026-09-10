type ElementConstructor<T extends Element> = abstract new (
  ...args: never[]
) => T;

type TextDirection = "ltr" | "rtl";

export function getDirection(element: Element): TextDirection {
  return element.closest<HTMLElement>("[dir]")?.getAttribute("dir") === "rtl"
    ? "rtl"
    : "ltr";
}

function getDirectionOwner(element: HTMLElement): HTMLElement {
  return element.closest<HTMLElement>("[dir]") ?? element;
}

export function observeInheritedDirection(
  element: HTMLElement,
  callback: MutationCallback,
): MutationObserver | null {
  const owner = getDirectionOwner(element);
  if (owner === element) return null;

  const observer = new MutationObserver(callback);
  observer.observe(owner, {
    attributes: true,
    attributeFilter: ["dir"],
  });
  return observer;
}

export function query(root: ParentNode, selector: string): Element | null;
export function query<T extends Element>(
  root: ParentNode,
  selector: string,
  constructor: ElementConstructor<T>,
): T | null;
export function query<T extends Element>(
  root: ParentNode,
  selector: string,
  constructor?: ElementConstructor<T>,
): Element | T | null {
  const result = root.querySelector(selector);
  return constructor && !(result instanceof constructor) ? null : result;
}

export function queryAll<T extends Element>(
  root: ParentNode,
  selector: string,
): T[] {
  return Array.from(root.querySelectorAll<T>(selector));
}

export function queryOwned<T extends Element>(
  root: Element,
  rootSelector: string,
  selector: string,
  constructor: ElementConstructor<T>,
): T | null {
  const result = queryAll<Element>(root, selector).find((candidate) =>
    isOwnedBy(root, rootSelector, candidate),
  );
  return result instanceof constructor ? result : null;
}

export function queryOwnedAll<T extends Element>(
  root: Element,
  rootSelector: string,
  selector: string,
): T[] {
  return queryAll<T>(root, selector).filter((candidate) =>
    isOwnedBy(root, rootSelector, candidate),
  );
}

export function isOwnedBy(
  root: Element,
  rootSelector: string,
  candidate: Element,
): boolean {
  return candidate.closest(rootSelector) === root;
}

export function setAttributeIfChanged(
  element: Element,
  name: string,
  value: string,
): void {
  if (element.getAttribute(name) !== value) {
    element.setAttribute(name, value);
  }
}

export function setOpenState(element: HTMLElement, open: boolean): void {
  if (element.hidden === open) {
    element.hidden = !open;
  }
}

export function isDisabled(element: Element): boolean {
  return (
    element.hasAttribute("disabled") ||
    element.getAttribute("aria-disabled") === "true"
  );
}

export function nextIndex(
  currentIndex: number,
  length: number,
  direction: 1 | -1,
): number {
  if (length <= 0) return -1;
  if (currentIndex < 0) return direction === 1 ? 0 : length - 1;
  return (currentIndex + direction + length) % length;
}

export function fitViewportRect(
  left: number,
  top: number,
  width: number,
  height: number,
  margin = 4,
): { _left: number; _top: number; _availableHeight: number } {
  return {
    _left: Math.min(
      Math.max(left, margin),
      Math.max(margin, window.innerWidth - width - margin),
    ),
    _top: Math.min(
      Math.max(top, margin),
      Math.max(margin, window.innerHeight - height - margin),
    ),
    _availableHeight: Math.max(0, window.innerHeight - margin * 2),
  };
}

export function onDestroy(
  scope: ng.Scope | null | undefined,
  cleanup: () => void,
): void {
  if (scope) {
    scope.on("$destroy", cleanup);
  }
}
