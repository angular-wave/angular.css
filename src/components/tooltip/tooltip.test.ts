import { expect, test, type Locator, type Page } from "@playwright/test";

const canonicalUrl = "/src/components/tooltip/tooltip.html";
const workflowsUrl = "/docs/static/examples/components/tooltip-workflows.html";
const rtlUrl = "/docs/static/examples/components/tooltip-rtl.html";

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
  expect(triggerBox).not.toBeNull();
  expect(contentBox).not.toBeNull();

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

test("canonical tooltip uses built bundles and hover disclosure semantics", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  await expectBuiltArtifactRuntime(page);

  const root = page.locator("[ng-tooltip]");
  const trigger = root.locator(":scope > :first-child");
  const content = root.locator(":scope > :last-child");

  await expect(content).toBeHidden();
  await expect(content).toHaveAttribute("role", "tooltip");
  await expect(content).toHaveAttribute("aria-hidden", "true");
  await expect(content).toHaveAttribute("side", "top");
  await expect(content).not.toHaveAttribute("tabindex");
  await expect(trigger).toHaveAttribute(
    "aria-describedby",
    (await content.getAttribute("id")) ?? "",
  );

  await trigger.hover();
  await expect(content).toBeVisible();
  await expect(root).toHaveAttribute("open", "");
  await expect(content).toHaveAttribute("aria-hidden", "false");
  await expectPhysicalSide(trigger, content, "top");

  const arrow = await content.evaluate((element) => {
    const style = getComputedStyle(element, "::after");
    return { content: style.content, height: style.height, width: style.width };
  });
  expect(arrow).toEqual({ content: '""', height: "10px", width: "10px" });

  await page.mouse.move(4, 4);
  await expect(content).toBeHidden();
});

test("focus opens canonical tooltip and Escape closes it without moving focus", async ({
  page,
}) => {
  await page.goto(canonicalUrl);

  const root = page.locator("[ng-tooltip]");
  const trigger = root.locator(":scope > :first-child");
  const content = root.locator(":scope > :last-child");
  await trigger.focus();
  await expect(content).toBeVisible();
  await trigger.press("Escape");
  await expect(content).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("externally controlled root and content open state remains authoritative", async ({
  page,
}) => {
  await page.goto(canonicalUrl);

  const root = page.locator("[ng-tooltip]");
  const trigger = root.locator(":scope > :first-child");
  const content = root.locator(":scope > :last-child");

  await root.evaluate((element) => element.setAttribute("open", ""));
  await expect(content).toBeVisible();
  await trigger.focus();
  await trigger.press("Escape");
  await expect(content).toBeVisible();

  await root.evaluate((element) => element.removeAttribute("open"));
  await expect(content).toBeHidden();
  await expect(root).not.toHaveAttribute("open");
});

test("keyboard and disabled-button wrapper references remain functional", async ({
  page,
}) => {
  await page.goto(workflowsUrl);
  await expectBuiltArtifactRuntime(page);

  const save = page.getByRole("button", { name: "Save changes" });
  const saveContent = save.locator("..").locator(":scope > :last-child");
  await save.focus();
  await expect(saveContent).toBeVisible();
  await expect(saveContent.locator("kbd")).toHaveText("S");
  await save.press("Escape");
  await expect(saveContent).toBeHidden();

  const disabledButton = page.getByRole("button", { name: "Disabled" });
  const disabledWrapper = disabledButton.locator("..");
  const disabledContent = disabledWrapper
    .locator("..")
    .locator(":scope > :last-child");
  await disabledWrapper.hover();
  await expect(disabledButton).toBeDisabled();
  await expect(disabledContent).toBeVisible();
  await expect(disabledContent).toHaveText(
    "This feature is currently unavailable",
  );

  const unavailable = page.getByRole("button", { name: "Unavailable" });
  const unavailableContent = unavailable
    .locator("..")
    .locator(":scope > :last-child");
  await unavailable.hover({ force: true });
  await expect(unavailableContent).toBeHidden();
});

test("workflow sides use physical rendered placement", async ({ page }) => {
  await page.goto(workflowsUrl);

  for (const side of ["left", "top", "bottom", "right"] as const) {
    const trigger = page.getByRole("button", {
      name: new RegExp(`^${side}$`, "i"),
    });
    const content = trigger.locator("..").locator(":scope > :last-child");
    await trigger.hover();
    await expect(content).toBeVisible();
    await expect(content).toHaveAttribute("side", side);
    await expectPhysicalSide(trigger, content, side);
  }
});

test("RTL mirrors text direction while left and right remain physical", async ({
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
    const root = trigger.locator("..");
    const content = root.locator(":scope > :last-child");
    await expect(root).toHaveCSS("direction", "rtl");
    await trigger.hover();
    await expect(content).toHaveCSS("direction", "rtl");
    await expectPhysicalSide(trigger, content, side);
  }
});
