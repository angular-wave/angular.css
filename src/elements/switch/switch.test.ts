import { testStyleOnlyElement } from "../../testing/style-only-element";

testStyleOnlyElement({
  category: "elements",
  directive: "ngSwitchControl",
  name: "switch",
  selector: 'input[type="checkbox"][role="switch"]',
});
