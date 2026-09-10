import { expect, test, type Locator, type Page } from "@playwright/test";

const canonicalUrl = "/src/patterns/popover/popover.html";
const workflowsUrl = "/docs/static/examples/components/popover-workflows.html";
const rtlUrl = "/docs/static/examples/components/popover-rtl.html";

const expectBuiltArtifactRuntime = async (page: Page): Promise<void> => {
  await expect(
    page.locator('script[src$="/js/angular-ts.umd.js"]'),
  ).toHaveCount(1);
  await expect(
    page.locator('script[src$="/js/angular-css.umd.js"]'),
  ).toHaveCount(1);
  const sourceRequests = await page.evaluate(() =>
    performance
      .getEntriesByType("resource")
      .map((entry) => entry.name)
      .filter((url) => /\/src\/(?:components|elements)\/.*\.ts$/.test(url)),
  );
  expect(sourceRequests).toEqual([]);
};

const expectPhysicalSide = async (
  trigger: Locator,
  content: Locator,
  side: "bottom" | "left" | "right" | "top",
): Promise<void> => {
  const triggerBox = await trigger.boundingBox();
  const contentBox = await content.boundingBox();
  if (side === "left") {
    expect(contentBox!.x + contentBox!.width).toBeLessThanOrEqual(
      triggerBox!.x,
    );
  } else if (side === "right") {
    expect(contentBox!.x).toBeGreaterThanOrEqual(
      triggerBox!.x + triggerBox!.width,
    );
  } else if (side === "top") {
    expect(contentBox!.y + contentBox!.height).toBeLessThanOrEqual(
      triggerBox!.y,
    );
  } else {
    expect(contentBox!.y).toBeGreaterThanOrEqual(
      triggerBox!.y + triggerBox!.height,
    );
  }
};

test("canonical popover uses native disclosure and light dismissal", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  await expectBuiltArtifactRuntime(page);
  const root = page.locator("span:has(> [popovertarget] ~ [popover])");
  const trigger = root.locator(":scope > button:first-child");
  const content = root.locator(":scope > [popover]");

  await expect(root).not.toHaveAttribute("ng-popover", "");
  await expect(content).toHaveAttribute("popover", "");
  const contentId = await content.getAttribute("id");
  if (!contentId) throw new Error("Popover content requires an id");
  await expect(trigger).toHaveAttribute("popovertarget", contentId);
  await expect(content).toBeHidden();

  await trigger.click();
  await expect(content).toBeVisible();
  expect(
    await content.evaluate((element) => element.matches(":popover-open")),
  ).toBe(true);
  await expect(page.locator("#popover-width")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(content).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("native trigger supports keyboard activation", async ({ page }) => {
  await page.goto(canonicalUrl);
  const trigger = page.locator(
    "span:has(> [popovertarget] ~ [popover]) > button:first-child",
  );
  const content = page.locator(
    "span:has(> [popovertarget] ~ [popover]) > [popover]",
  );

  await trigger.focus();
  await trigger.press("Enter");
  await expect(content).toBeVisible();
  await page.keyboard.press("Escape");
  await trigger.press("Space");
  await expect(content).toBeVisible();
});

test("popover content keeps a narrow viewport inset", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 600 });
  await page.goto(canonicalUrl);
  await page
    .locator("span:has(> [popovertarget] ~ [popover]) > button:first-child")
    .click();
  const box = await page
    .locator("span:has(> [popovertarget] ~ [popover]) > [popover]")
    .boundingBox();
  expect(box).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(8);
  expect(box!.x + box!.width).toBeLessThanOrEqual(312);
  expect(box!.y).toBeGreaterThanOrEqual(8);
  expect(box!.y + box!.height).toBeLessThanOrEqual(592);
});

test("workflow alignments render start, center, and end geometry", async ({
  page,
}) => {
  await page.goto(workflowsUrl);
  await expectBuiltArtifactRuntime(page);

  for (const align of ["start", "center", "end"] as const) {
    const trigger = page.getByRole("button", {
      name: new RegExp(`^${align}$`, "i"),
    });
    const content = trigger.locator("..").locator(":scope > [popover]");
    await trigger.click();
    await expect(content).toBeVisible();
    await expect(content).toHaveAttribute("align", align);

    const triggerBox = await trigger.boundingBox();
    const contentBox = await content.boundingBox();
    if (align === "start") {
      expect(Math.abs(contentBox!.x - triggerBox!.x)).toBeLessThanOrEqual(2);
    } else if (align === "center") {
      expect(
        Math.abs(
          contentBox!.x +
            contentBox!.width / 2 -
            (triggerBox!.x + triggerBox!.width / 2),
        ),
      ).toBeLessThanOrEqual(2);
    } else {
      expect(
        Math.abs(
          contentBox!.x +
            contentBox!.width -
            (triggerBox!.x + triggerBox!.width),
        ),
      ).toBeLessThanOrEqual(2);
    }
    await page.keyboard.press("Escape");
  }
});

test("pointer interaction outside light-dismisses an open form popover", async ({
  page,
}) => {
  await page.goto(workflowsUrl);
  const trigger = page.getByRole("button", { name: "Edit dimensions" });
  const content = trigger.locator("..").locator(":scope > [popover]");

  await trigger.click();
  await content.getByRole("textbox", { name: "Height" }).focus();
  await expect(content).toBeVisible();
  await page.getByRole("button", { name: "Start", exact: true }).click();
  await expect(content).toBeHidden();
});

test("disabled triggers stay closed and sibling auto popovers are exclusive", async ({
  page,
}) => {
  await page.goto(workflowsUrl);
  const disabled = page.getByRole("button", { name: "Disabled" });
  const disabledContent = disabled.locator("..").locator(":scope > [popover]");
  await expect(disabled).toBeDisabled();
  await expect(disabledContent).toBeHidden();

  const first = page.getByRole("button", { name: "First", exact: true });
  const second = page.getByRole("button", { name: "Second", exact: true });
  const firstContent = first.locator("..").locator(":scope > [popover]");
  const secondContent = second.locator("..").locator(":scope > [popover]");
  await first.click();
  await expect(firstContent).toBeVisible();
  await second.click();
  await expect(firstContent).toBeHidden();
  await expect(secondContent).toBeVisible();
});

test("RTL direction is inherited while every side remains physical", async ({
  page,
}) => {
  await page.goto(rtlUrl);
  for (const [name, side] of [
    ["يسار", "left"],
    ["أعلى", "top"],
    ["أسفل", "bottom"],
    ["يمين", "right"],
  ] as const) {
    const trigger = page.getByRole("button", { name });
    const content = trigger.locator("..").locator(":scope > [popover]");
    await trigger.click();
    await expect(content).toHaveCSS("direction", "rtl");
    await expect(content).toHaveAttribute("side", side);
    await expectPhysicalSide(trigger, content, side);
    await page.keyboard.press("Escape");
  }
});
