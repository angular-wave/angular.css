import { testStyleOnlyElement } from "../../testing/style-only-element";

testStyleOnlyElement({
  category: "elements",
  directive: "ngRadioGroup",
  name: "radio-group",
  selector: 'fieldset:has(input[type="radio"]):not(.toggle-group)',
});
