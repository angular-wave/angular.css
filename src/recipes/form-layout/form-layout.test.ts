import { expect, test } from "@playwright/test";

import { testStyleOnlyElement } from "../../testing/style-only-element";

testStyleOnlyElement({
  category: "recipes",
  directive: "ngFormLayout",
  name: "form-layout",
  selector: ".form-layout",
});

test("form layout keeps AngularTS form validation authoritative", async ({
  page,
}) => {
  await page.goto("/src/recipes/form-layout/form-layout.html");
  await page.getByRole("button", { name: "Create customer" }).click();
  await expect(page.getByRole("alert")).toBeVisible();
  await page.getByLabel("Customer name").fill("Analytical Engines Ltd");
  await page.getByRole("button", { name: "Create customer" }).click();
  await expect(page.getByText("Customer is ready to save.")).toBeVisible();
});

test("form layout collapses fields to one column in narrow containers", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto("/src/recipes/form-layout/form-layout.html");
  const fields = page.locator(".form-layout fieldset > .field");

  await expect
    .poll(async () => {
      const first = await fields.nth(0).boundingBox();
      const second = await fields.nth(1).boundingBox();
      return first && second
        ? {
            aligned: Math.round(second.x - first.x),
            stacked: second.y > first.y,
          }
        : null;
    })
    .toEqual({ aligned: 0, stacked: true });
});
