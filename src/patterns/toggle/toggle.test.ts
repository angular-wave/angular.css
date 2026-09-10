import { expect, test } from "@playwright/test";

import { testStyleOnlyElement } from "../../testing/style-only-element";

const canonicalUrl = "/src/patterns/toggle/toggle.html";

testStyleOnlyElement({
  category: "patterns",
  directive: "ngToggle",
  name: "toggle",
  selector: "button[aria-pressed]",
});

test("toggle press moves without resizing and respects reduced motion", async ({
  browser,
}) => {
  const animatedPage = await browser.newPage({
    reducedMotion: "no-preference",
  });
  await animatedPage.goto(canonicalUrl);
  const toggle = animatedPage.locator("button[aria-pressed]").first();
  const box = await toggle.boundingBox();
  if (!box) throw new Error("Toggle is not rendered");

  await animatedPage.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await animatedPage.mouse.down();
  await expect(toggle).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 1)");
  await expect(toggle).toHaveCSS("scale", "none");
  await animatedPage.mouse.up();
  await animatedPage.close();

  const reducedPage = await browser.newPage({ reducedMotion: "reduce" });
  await reducedPage.goto(canonicalUrl);
  await expect(reducedPage.locator("button[aria-pressed]").first()).toHaveCSS(
    "transition-duration",
    "0s",
  );
  await reducedPage.close();
});
