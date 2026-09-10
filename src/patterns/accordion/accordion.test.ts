import { expect, test, type Page } from "@playwright/test";

const canonicalUrl = "/src/patterns/accordion/accordion.html";
const statesUrl =
  "/docs/static/examples/components/accordion-state-workflows.html";

const expectBuiltArtifactRuntime = async (page: Page): Promise<void> => {
  await expect(
    page.locator('script[src$="/js/angular-ts.umd.js"]'),
  ).toHaveCount(1);
  await expect(
    page.locator('script[src$="/js/angular-css.umd.js"]'),
  ).toHaveCount(1);

  const resources = await page.evaluate(() =>
    performance.getEntriesByType("resource").map((entry) => entry.name),
  );
  expect(resources.some((url) => url.endsWith("/angular-ts.umd.js"))).toBe(
    true,
  );
  expect(resources.some((url) => url.endsWith("/angular-css.umd.js"))).toBe(
    true,
  );
  expect(
    resources.filter((url) =>
      /\/src\/(?:components|elements)\/.*\.ts$/.test(url),
    ),
  ).toEqual([]);
};

test("canonical accordion uses native exclusive disclosure", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  await expectBuiltArtifactRuntime(page);
  const root = page.locator("section[aria-label]:has(> details)");
  const items = root.locator(":scope > details");
  const triggers = root.locator(":scope > details > summary");

  await expect(root).not.toHaveAttribute("ng-accordion", "");
  await expect(items).toHaveCount(3);
  await expect(items.nth(0)).toHaveAttribute("open", "");
  await expect(items.nth(0)).toHaveAttribute("name", "shipping-questions");

  await triggers.nth(1).click();
  await expect(items.nth(0)).not.toHaveAttribute("open", "");
  await expect(items.nth(1)).toHaveAttribute("open", "");

  await triggers.nth(1).click();
  await expect(items.nth(1)).not.toHaveAttribute("open", "");
});

test("canonical accordion delegates keyboard behavior to summary", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  const root = page.locator("section[aria-label]:has(> details)");
  const items = root.locator(":scope > details");
  const triggers = root.locator(":scope > details > summary");

  await triggers.nth(1).focus();
  await triggers.nth(1).press("Enter");
  await expect(items.nth(1)).toHaveAttribute("open", "");
  await triggers.nth(1).press("Space");
  await expect(items.nth(1)).not.toHaveAttribute("open", "");
  await triggers.nth(1).press("Tab");
  await expect(triggers.nth(2)).toBeFocused();
});

test("accordion disclosure motion preserves control size and respects reduced motion", async ({
  browser,
}) => {
  const animatedPage = await browser.newPage({
    reducedMotion: "no-preference",
  });
  await animatedPage.goto(canonicalUrl);
  const item = animatedPage
    .locator("section[aria-label]:has(> details) > details")
    .nth(1);
  const trigger = item.locator("summary");
  const triggerBox = await trigger.boundingBox();
  if (!triggerBox) throw new Error("Accordion trigger is not rendered");

  await animatedPage.mouse.move(
    triggerBox.x + triggerBox.width - 8,
    triggerBox.y + triggerBox.height / 2,
  );
  await animatedPage.mouse.down();
  await expect
    .poll(() =>
      trigger.evaluate(
        (element) => getComputedStyle(element, "::after").translate,
      ),
    )
    .toBe("0px 1px");
  await animatedPage.mouse.up();
  const contentDuration = await item.evaluate(
    (element) =>
      getComputedStyle(element, "::details-content").transitionDuration,
  );
  expect(contentDuration).not.toBe("0s");
  await animatedPage.close();

  const reducedPage = await browser.newPage({ reducedMotion: "reduce" });
  await reducedPage.goto(canonicalUrl);
  const reducedItem = reducedPage
    .locator("section[aria-label]:has(> details) > details")
    .nth(1);
  const reducedDuration = await reducedItem.evaluate(
    (element) =>
      getComputedStyle(element, "::details-content").transitionDuration,
  );
  expect(reducedDuration).toBe("0s");
  await reducedPage.close();
});

test("accordion workflow covers independent and inert disclosures", async ({
  page,
}) => {
  await page.goto(statesUrl);
  await expectBuiltArtifactRuntime(page);
  const multiple = page.locator('section[aria-label="Settings questions"]');
  const multipleItems = multiple.locator(":scope > details");
  const disabled = page.locator(
    'section[aria-label="Feature availability questions"] details[inert]',
  );

  await multipleItems.nth(1).locator("summary").click();
  await expect(multipleItems.nth(0)).toHaveAttribute("open", "");
  await expect(multipleItems.nth(1)).toHaveAttribute("open", "");
  await expect(multipleItems.nth(0)).not.toHaveAttribute("name", /.+/);
  await expect(disabled).toHaveCount(1);
  await expect(disabled).not.toHaveAttribute("open", "");
});
