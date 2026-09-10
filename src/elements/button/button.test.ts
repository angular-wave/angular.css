import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { testStyleOnlyElement } from "../../testing/style-only-element";

testStyleOnlyElement({
  category: "elements",
  directive: "ngButton",
  name: "button",
  selector: "button",
});

test("status variants retain accessible contrast in light and dark contexts", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/components/button-workflows.html");

  for (const dark of [false, true]) {
    await page.locator("html").evaluate((element, enabled) => {
      element.classList.toggle("dark", enabled);
    }, dark);
    for (const state of ["rest", "Information", "Success", "Warning"]) {
      if (state === "rest") {
        await page.mouse.move(0, 0);
      } else {
        await page.getByRole("button", { name: state }).hover();
      }
      const results = await new AxeBuilder({ page })
        .include('[aria-label="Status buttons"]')
        .withRules(["color-contrast"])
        .analyze();
      expect(
        results.violations,
        `${dark ? "dark" : "light"} context, ${state}`,
      ).toEqual([]);
    }
  }
});
