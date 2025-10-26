import { accordionDirective } from "./components/accordion/accordion.js";

window["angular"]
  .module("ui", [])
  .controller(
    "VersionController",
    class VersionController {
      static $inject = ["$scope"];
      /** @param {ng.Scope} $scope */
      constructor($scope) {
        this.$scope = $scope;
      }
      version = angular.version;
    },
  )
  .directive("ngAccordion", accordionDirective);
