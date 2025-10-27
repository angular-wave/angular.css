export function dropdownDirective() {
  return {
    link(scope, element) {
        const panel = document.getElementById('panel');
      scope.open = false;
      scope.toggle = () => {
        if (scope.open) {
          return scope.close();
        }

        scope.open = true;
      };
      scope.close = () => {
        if (!scope.open) return;
        scope.open = false;
      };
    },
  };
}
