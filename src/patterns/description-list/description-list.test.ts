import { expect, test } from "@playwright/test";

import { testStyleOnlyElement } from "../../testing/style-only-element";

testStyleOnlyElement({
  category: "patterns",
  directive: "ngDescriptionList",
  name: "description-list",
  selector: "dl:has(> div > dt):has(> div > dd)",
});

test("description list preserves native terms and descriptions", async ({
  page,
}) => {
  await page.goto("/src/patterns/description-list/description-list.html");
  await expect(page.locator("dt")).toHaveCount(4);
  await expect(page.locator("dd")).toHaveCount(4);
});

test("description list stacks terms and values in a narrow container", async ({
  page,
}) => {
  await page.setViewportSize({ width: 420, height: 700 });
  await page.goto("/src/patterns/description-list/description-list.html");
  const row = page.locator("dl:has(> div > dt):has(> div > dd) > div").first();
  const term = row.locator("dt");
  const description = row.locator("dd");

  await expect
    .poll(async () => {
      const termBox = await term.boundingBox();
      const descriptionBox = await description.boundingBox();
      return termBox && descriptionBox
        ? {
            aligned: Math.round(descriptionBox.x - termBox.x),
            stacked: descriptionBox.y > termBox.y,
          }
        : null;
    })
    .toEqual({ aligned: 0, stacked: true });
});
