import type { angular as angularRuntime } from "@angular-wave/angular.ts";
import type { CarouselChangeDetail } from "./components/carousel/carousel.js";
export type CalendarSelectionMode = "multiple" | "range" | "single";
export interface CalendarSelectDetail {
    day: HTMLElement;
    value: string;
    values: string[];
    range: {
        start: string;
        end: string;
    };
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
export type AngularCssCustomEvent<Name extends AngularCssEventName> = CustomEvent<AngularCssEventDetailMap[Name]>;
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
export declare const angularCssModuleName = "angular.css";
export declare const angular: typeof angularRuntime | undefined;
export type AngularCssDirective = readonly [string, () => ng.Directive];
export declare const angularCssDirectives: readonly AngularCssDirective[];
export declare function registerAngularCss(ng?: typeof angularRuntime | undefined): ng.NgModule | undefined;
