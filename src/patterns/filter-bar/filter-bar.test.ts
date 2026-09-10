import { expect, test } from "@playwright/test";

import { testStyleOnlyElement } from "../../testing/style-only-element";

testStyleOnlyElement({
  category: "patterns",
  directive: "ngFilterBar",
  name: "filter-bar",
  selector: 'form[role="search"]:has(> fieldset + menu)',
});

test("filter bar uses native form reset behavior", async ({ page }) => {
  await page.goto("/src/patterns/filter-bar/filter-bar.html");
  const search = page.getByRole("searchbox", { name: "Search" });
  await search.fill("Ada");
  await page.getByRole("button", { name: "Reset" }).click();
  await expect(search).toHaveValue("");
});
