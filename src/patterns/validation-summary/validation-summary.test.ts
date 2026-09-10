import { expect, test } from "@playwright/test";

import { testStyleOnlyElement } from "../../testing/style-only-element";

testStyleOnlyElement({
  category: "patterns",
  directive: "ngValidationSummary",
  name: "validation-summary",
  selector: 'aside[role="alert"]:has(> header + ul)',
});

test("validation messages link directly to invalid controls", async ({
  page,
}) => {
  await page.goto("/src/patterns/validation-summary/validation-summary.html");
  await page.getByRole("link", { name: "Enter a customer name." }).click();
  await expect(page).toHaveURL(/#customer-name$/);
});

test("validation links preserve a usable compact hit area", async ({
  page,
}) => {
  await page.goto("/src/patterns/validation-summary/validation-summary.html");
  await expect(
    page.getByRole("link", { name: "Enter a customer name." }),
  ).toHaveCSS("min-height", "24px");
});
