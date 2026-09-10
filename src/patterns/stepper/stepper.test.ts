import { expect, test } from "@playwright/test";

import { testStyleOnlyElement } from "../../testing/style-only-element";

testStyleOnlyElement({
  category: "patterns",
  directive: "ngStepper",
  name: "stepper",
  selector: 'nav:has([aria-current="step"])',
});

test("stepper exposes the current workflow step", async ({ page }) => {
  await page.goto("/src/patterns/stepper/stepper.html");
  await expect(page.locator('[aria-current="step"]')).toHaveText("Contacts");
  await expect(page.locator("ol > li")).toHaveCount(4);
});
