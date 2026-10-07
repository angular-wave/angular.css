import type { angular as angularRuntime } from "@angular-wave/angular.ts";

import { dropdownMenuDirective } from "./components/dropdown-menu/dropdown-menu";
import { calendarDirective } from "./components/calendar/calendar";
import { carouselDirective } from "./components/carousel/carousel";
import type { CarouselChangeDetail } from "./components/carousel/carousel.js";
import { comboboxDirective } from "./components/combobox/combobox";
import { commandDirective } from "./components/command/command";
import { contextMenuDirective } from "./components/context-menu/context-menu";
import { hoverCardDirective } from "./components/hover-card/hover-card";
import { menubarDirective } from "./components/menubar/menubar";
import { navigationMenuDirective } from "./components/navigation-menu/navigation-menu";
import { resizablePanelGroupDirective } from "./components/resizable/resizable";
import { sidebarDirective } from "./components/sidebar/sidebar";
import { rangeSliderDirective } from "./components/range-slider/range-slider";
import { toastDirective } from "./components/toast/toast";
import { tabsDirective } from "./components/tabs/tabs";
import { tooltipDirective } from "./components/tooltip/tooltip";
import { toolbarDirective } from "./components/toolbar/toolbar";
import { treeDirective } from "./components/tree/tree";

export type CalendarSelectionMode = "multiple" | "range" | "single";

export interface CalendarSelectDetail {
  day: HTMLElement;
  value: string;
  values: string[];
  range: { start: string; end: string };
  selectionMode: CalendarSelectionMode;
}

export interface CalendarRangeInvalidDetail {
  minNights: number;
  start: string;
  value: string;
}

export interface CalendarMonthChangeDetail {
  month: string;
}

export interface ComboboxOpenChangeDetail {
  open: boolean;
}

export interface ComboboxSelectDetail {
  item: HTMLElement;
  multiple: boolean;
  value: string;
}

export interface ContextMenuSelectDetail {
  item: HTMLElement;
}

export interface TreeSelectDetail {
  id: string;
  selected: boolean;
  value: string;
}

export interface AngularCssEventDetailMap {
  "ng:calendar-month-change": CalendarMonthChangeDetail;
  "ng:calendar-range-invalid": CalendarRangeInvalidDetail;
  "ng:calendar-select": CalendarSelectDetail;
  "ng:carousel-change": CarouselChangeDetail;
  "ng:carousel-ready": CarouselChangeDetail;
  "ng:combobox-clear": null;
  "ng:combobox-open-change": ComboboxOpenChangeDetail;
  "ng:combobox-remove-last": null;
  "ng:combobox-select": ComboboxSelectDetail;
  "ng:context-menu-select": ContextMenuSelectDetail;
  "ng:tree-select": TreeSelectDetail;
}

export type AngularCssEventName = keyof AngularCssEventDetailMap;
export type AngularCssCustomEvent<Name extends AngularCssEventName> =
  CustomEvent<AngularCssEventDetailMap[Name]>;

export type { CarouselChangeDetail };

declare global {
  interface HTMLElementEventMap {
    "ng:calendar-month-change": AngularCssCustomEvent<"ng:calendar-month-change">;
    "ng:calendar-range-invalid": AngularCssCustomEvent<"ng:calendar-range-invalid">;
    "ng:calendar-select": AngularCssCustomEvent<"ng:calendar-select">;
    "ng:carousel-change": AngularCssCustomEvent<"ng:carousel-change">;
    "ng:carousel-ready": AngularCssCustomEvent<"ng:carousel-ready">;
    "ng:combobox-clear": AngularCssCustomEvent<"ng:combobox-clear">;
    "ng:combobox-open-change": AngularCssCustomEvent<"ng:combobox-open-change">;
    "ng:combobox-remove-last": AngularCssCustomEvent<"ng:combobox-remove-last">;
    "ng:combobox-select": AngularCssCustomEvent<"ng:combobox-select">;
    "ng:context-menu-select": AngularCssCustomEvent<"ng:context-menu-select">;
    "ng:tree-select": AngularCssCustomEvent<"ng:tree-select">;
  }
}

export const angularCssModuleName = "angular.css";
const globalScope = globalThis as typeof globalThis & {
  angular?: typeof angularRuntime;
};
export const angular: typeof angularRuntime | undefined = globalScope.angular;

export type AngularCssDirective = readonly [string, () => ng.Directive];
const registeredModules = new WeakMap<object, ng.NgModule>();
interface AngularModuleRuntime {
  createModule?: (name: string, dependencies?: string[]) => ng.NgModule;
  getModule?: (name: string) => ng.NgModule;
  module?: (name: string, dependencies?: string[]) => ng.NgModule;
}

export const angularCssDirectives: readonly AngularCssDirective[] = [
  ["ngDropdownMenu", dropdownMenuDirective],
  ["ngCalendar", calendarDirective],
  ["ngCarousel", carouselDirective],
  ["ngCombobox", comboboxDirective],
  ["ngCommand", commandDirective],
  ["ngContextMenu", contextMenuDirective],
  ["ngHoverCard", hoverCardDirective],
  ["ngMenubar", menubarDirective],
  ["ngNavigationMenu", navigationMenuDirective],
  ["ngResizablePanelGroup", resizablePanelGroupDirective],
  ["ngSidebar", sidebarDirective],
  ["ngRangeSlider", rangeSliderDirective],
  ["ngToast", toastDirective],
  ["ngTabs", tabsDirective],
  ["ngTooltip", tooltipDirective],
  ["ngToolbar", toolbarDirective],
  ["ngTree", treeDirective],
];

export function registerAngularCss(
  ng: typeof angularRuntime | undefined = angular,
): ng.NgModule | undefined {
  if (!ng) return undefined;

  const runtime = ng as unknown as AngularModuleRuntime;
  if (!runtime.getModule && !runtime.createModule && !runtime.module) {
    return undefined;
  }

  const registered = registeredModules.get(ng);
  if (registered) return registered;

  let module: ng.NgModule;
  try {
    if (runtime.getModule) module = runtime.getModule(angularCssModuleName);
    else if (runtime.module) module = runtime.module(angularCssModuleName);
    else throw new Error("AngularTS does not expose a module lookup API");
  } catch {
    if (runtime.createModule) {
      module = runtime.createModule(angularCssModuleName, []);
    } else if (runtime.module) {
      module = runtime.module(angularCssModuleName, []);
    } else {
      throw new Error("AngularTS does not expose a module creation API");
    }
  }
  angularCssDirectives.forEach(([name, factory]) => {
    module.directive(name, factory);
  });
  registeredModules.set(ng, module);

  return module;
}

registerAngularCss();
