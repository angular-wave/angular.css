import { accordionDirective } from "./components/accordion/accordion.js";
import { dropdownDirective } from "./components/dropdown/dropdown.js";

window["angular"]
  .module("ui", [])
  .directive("ngAccordion", accordionDirective)
  .directive("ngDropdown", dropdownDirective);
