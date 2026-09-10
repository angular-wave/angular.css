import { testStyleOnlyElement } from "../../testing/style-only-element";

testStyleOnlyElement({
  category: "elements",
  directive: "ngCheckbox",
  name: "checkbox",
  selector: 'input[type="checkbox"]:not([role="switch"])',
});
