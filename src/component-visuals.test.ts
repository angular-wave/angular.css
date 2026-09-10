import { expect, test, type Page } from "@playwright/test";

const examples = [
  "accordion",
  "alert",
  "aspect-ratio",
  "avatar",
  "badge",
  "button",
  "button-group",
  "calendar",
  "card",
  "carousel",
  "chart",
  "checkbox",
  "disclosure",
  "empty",
  "input-otp",
  "radio-group",
  "resizable",
  "skeleton",
  "spinner",
  "switch",
] as const;

const assertGeometry = async (
  page: Page,
  component: (typeof examples)[number],
) => {
  if (component === "aspect-ratio") {
    const viewportWidth = await page.evaluate(
      () => document.documentElement.clientWidth,
    );
    const root = await page.locator("figure[ratio]").boundingBox();
    expect(root).not.toBeNull();
    expect(root!.width).toBeCloseTo(Math.min(384, viewportWidth - 48), 0);
    expect(root!.width / root!.height).toBeCloseTo(16 / 9, 2);
    await expect(page.locator("figure[ratio] > img")).toBeVisible();
    return;
  }

  if (component === "alert") {
    const viewportWidth = await page.evaluate(
      () => document.documentElement.clientWidth,
    );
    const root = await page
      .locator('body[data-example~="alert-demo"] > .visual-example')
      .boundingBox();
    const alerts = page.locator('[role="alert"]');
    const icons = page.locator('[role="alert"] > svg');
    expect(root).not.toBeNull();
    expect(root!.width).toBeCloseTo(Math.min(448, viewportWidth - 48), 0);
    await expect(alerts).toHaveCount(2);
    await expect(icons).toHaveCount(2);
    expect(
      await icons.evaluateAll((items) =>
        items.map((item) => {
          const box = item.getBoundingClientRect();
          return { height: box.height, width: box.width };
        }),
      ),
    ).toEqual([
      { height: 16, width: 16 },
      { height: 16, width: 16 },
    ]);
    return;
  }

  if (component === "accordion") {
    const root = await page
      .locator("section[aria-label]:has(> details)")
      .boundingBox();
    const triggers = page.locator(
      "section[aria-label]:has(> details) > details > summary",
    );
    const viewportWidth = await page.evaluate(
      () => document.documentElement.clientWidth,
    );
    expect(root).not.toBeNull();
    expect(root!.width).toBeCloseTo(Math.min(512, viewportWidth - 48), 0);
    await expect(triggers).toHaveCount(3);
    await expect(
      page.locator("section[aria-label]:has(> details) > details").first(),
    ).toHaveAttribute("open", "");
    return;
  }

  if (component === "skeleton") {
    const boxes = await page
      .locator(".visual-example .skeleton")
      .evaluateAll((items) =>
        items.map((item) => {
          const box = item.getBoundingClientRect();
          return { height: box.height, width: box.width };
        }),
      );
    expect(boxes).toEqual([
      { height: 48, width: 48 },
      { height: 16, width: 250 },
      { height: 16, width: 200 },
    ]);
    return;
  }

  if (component === "empty") {
    const media = await page.locator(".empty > header > figure").boundingBox();
    expect(media).not.toBeNull();
    expect(media!.width).toBeCloseTo(40, 0);
    expect(media!.height).toBeCloseTo(40, 0);
    await expect(page.locator(".empty > header > h2")).toHaveCSS(
      "font-size",
      "18px",
    );
    return;
  }

  if (component === "button") {
    const boxes = await page.locator("button").evaluateAll((items) =>
      items.map((item) => {
        const box = item.getBoundingClientRect();
        return { height: box.height, width: box.width };
      }),
    );
    expect(boxes).toHaveLength(2);
    expect(boxes[0].height).toBeCloseTo(36, 0);
    expect(boxes[1]).toEqual({ height: 36, width: 36 });
    return;
  }

  if (component === "button-group") {
    const groups = page.locator('[role="group"]');
    await expect(groups).toHaveCount(6);
    const sizeButtons = page
      .getByLabel("Button group sizes")
      .getByRole("button");
    expect(
      await sizeButtons.evaluateAll((buttons) =>
        buttons.map((button) => button.getBoundingClientRect().height),
      ),
    ).toEqual([32, 32, 32, 32, 36, 36, 36, 36, 40, 40, 40, 40]);
    const vertical = page.getByRole("group", { name: "Media controls" });
    const verticalBox = await vertical.boundingBox();
    expect(verticalBox).not.toBeNull();
    expect(verticalBox!.width).toBeCloseTo(36, 0);
    expect(verticalBox!.height).toBeCloseTo(73, 0);
    await expect(vertical.locator(":scope > hr")).toHaveCSS("height", "1px");
    await expect(
      page.locator('[role="group"] > hr[aria-orientation="vertical"]').first(),
    ).toHaveCSS("width", "1px");
    return;
  }

  if (component === "badge") {
    const boxes = await page
      .locator(".badge")
      .evaluateAll((items) =>
        items.map((item) => item.getBoundingClientRect().height),
      );
    expect(boxes.length).toBeGreaterThanOrEqual(4);
    expect(boxes.every((height) => height === 20)).toBe(true);
    return;
  }

  if (component === "calendar") {
    const root = await page.locator("[ng-calendar]").boundingBox();
    expect(root).not.toBeNull();
    expect(root!.width).toBeCloseTo(214, 0);
    expect(root!.height).toBeCloseTo(314, 0);
    await expect(page.locator(`[ng-calendar] > div button[value]`)).toHaveCount(
      42,
    );
    await expect(
      page.locator(`[ng-calendar] > div button[value][aria-pressed="true"]`),
    ).toHaveCount(1);
    await expect(page.getByRole("combobox", { name: "Month" })).toHaveValue(
      "4",
    );
    return;
  }

  if (component === "spinner") {
    const spinnerSize = await page.locator(".spinner").evaluate((element) => {
      const style = getComputedStyle(element);
      return { height: style.height, width: style.width };
    });
    const item = await page.locator(".item").boundingBox();
    expect(item).not.toBeNull();
    expect(spinnerSize).toEqual({ height: "16px", width: "16px" });
    expect(item!.width).toBeCloseTo(320, 0);
    return;
  }

  if (component === "avatar") {
    const avatars = await page.locator(".avatar").evaluateAll((items) =>
      items.map((item) => {
        const box = item.getBoundingClientRect();
        return { height: box.height, width: box.width };
      }),
    );
    expect(avatars).toHaveLength(6);
    expect(avatars).toEqual(avatars.map(() => ({ height: 32, width: 32 })));
    await expect(page.locator(".avatar > output")).toHaveCSS("width", "10px");
    return;
  }

  if (component === "switch") {
    const box = await page.locator("#airplane-mode").boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeCloseTo(32, 0);
    expect(box!.height).toBeCloseTo(20, 0);
    return;
  }

  if (component === "radio-group") {
    const boxes = await page
      .locator(
        'fieldset:has(input[type="radio"]):not(.toggle-group) input[type="radio"]',
      )
      .evaluateAll((items) =>
        items.map((item) => {
          const box = item.getBoundingClientRect();
          return { height: box.height, width: box.width };
        }),
      );
    expect(boxes).toHaveLength(3);
    expect(boxes).toEqual(boxes.map(() => ({ height: 16, width: 16 })));
    return;
  }

  if (component === "card") {
    const card = page.locator(".card");
    const buttons = card.locator(":scope > footer > button");
    const [cardBox, firstButtonBox, secondButtonBox] = await Promise.all([
      card.boundingBox(),
      buttons.nth(0).boundingBox(),
      buttons.nth(1).boundingBox(),
    ]);
    expect(cardBox).not.toBeNull();
    expect(firstButtonBox).not.toBeNull();
    expect(secondButtonBox).not.toBeNull();
    expect(firstButtonBox!.width).toBeCloseTo(secondButtonBox!.width, 0);
    expect(firstButtonBox!.width).toBeCloseTo(cardBox!.width - 34, 0);
    return;
  }

  if (component === "carousel") {
    const root = page.locator("[ng-carousel]");
    const rootBox = await root.boundingBox();
    const cardBox = await root.locator(`.card > section`).first().boundingBox();
    const controls = root.locator(":scope > button");
    expect(rootBox).not.toBeNull();
    expect(cardBox).not.toBeNull();
    expect(rootBox!.width).toBeCloseTo(
      viewportWidthForCarousel(await page.evaluate(() => innerWidth)),
      0,
    );
    expect(cardBox!.width / cardBox!.height).toBeCloseTo(1, 2);
    await expect(controls).toHaveCount(2);
    expect(
      await controls.evaluateAll((items) =>
        items.map((item) => item.getBoundingClientRect().width),
      ),
    ).toEqual([32, 32]);
    await expect(controls.first()).toBeDisabled();
    await expect(controls.last()).toBeEnabled();
    return;
  }

  if (component === "chart") {
    const viewportWidth = await page.evaluate(() => innerWidth);
    const chart = page.locator(".chart");
    const plot = chart.locator(":scope > section");
    const groups = plot.locator(":scope > ul > li");
    const bars = groups.locator(":scope > span");
    const [chartBox, plotBox] = await Promise.all([
      chart.boundingBox(),
      plot.boundingBox(),
    ]);
    expect(chartBox).not.toBeNull();
    expect(plotBox).not.toBeNull();
    expect(chartBox!.width).toBeCloseTo(Math.min(512, viewportWidth - 48), 0);
    expect(plotBox!.height).toBeCloseTo(200, 0);
    await expect(groups).toHaveCount(6);
    await expect(bars).toHaveCount(12);
    expect(
      await bars.evaluateAll((items) =>
        items.map((item) => item.getBoundingClientRect().height),
      ),
    ).toEqual([122, 52, 200, 132, 156, 78, 48, 124, 138, 86, 140, 92]);
    return;
  }

  if (component === "checkbox") {
    const viewportWidth = await page.evaluate(() => innerWidth);
    const root = page.locator(
      'body[data-example~="checkbox-demo"] > .visual-example',
    );
    const controls = page.locator(
      'input[type="checkbox"]:not([role="switch"])',
    );
    const rootBox = await root.boundingBox();
    expect(rootBox).not.toBeNull();
    expect(rootBox!.width).toBeCloseTo(Math.min(384, viewportWidth - 48), 0);
    await expect(controls).toHaveCount(4);
    expect(
      await controls.evaluateAll((items) =>
        items.map((item) => {
          const box = item.getBoundingClientRect();
          return { height: box.height, width: box.width };
        }),
      ),
    ).toEqual(Array(4).fill({ height: 16, width: 16 }));
    await expect(controls.nth(1)).toBeChecked();
    await expect(controls.nth(2)).toBeDisabled();
    await expect(controls.first()).toHaveCSS("box-shadow", "none");
    return;
  }

  if (component === "disclosure") {
    const viewportWidth = await page.evaluate(() => innerWidth);
    const root = page.locator("details.disclosure:has(> summary > header + p)");
    const trigger = root.locator(":scope > summary");
    const icon = trigger.locator(":scope > header > svg");
    const rootBox = await root.boundingBox();
    const iconBox = await icon.boundingBox();
    expect(rootBox).not.toBeNull();
    expect(iconBox).not.toBeNull();
    expect(rootBox!.width).toBeCloseTo(Math.min(350, viewportWidth - 48), 0);
    expect(iconBox).toMatchObject({ height: 32, width: 32 });
    await expect(page.getByText("Status", { exact: true })).toBeVisible();
    await expect(page.locator("details.disclosure > :last-child")).toBeHidden();
    await expect(trigger).toHaveCSS("box-shadow", "none");
    return;
  }

  if (component === "input-otp") {
    const input = page.locator('input[autocomplete="one-time-code"]');
    const box = await input.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeCloseTo(32, 0);
    expect(box!.width).toBeCloseTo(192, 0);
    await input.focus();
    await expect(input).not.toHaveCSS("box-shadow", "none");
    return;
  }

  const groups = page.locator("[ng-resizable-panel-group]");
  const outerPanels = groups.first().locator(":scope > section");
  const innerPanels = groups.nth(1).locator(":scope > section");
  const [groupBox, leftBox, rightBox, topBox, bottomBox] = await Promise.all([
    groups.first().boundingBox(),
    outerPanels.nth(0).boundingBox(),
    outerPanels.nth(1).boundingBox(),
    innerPanels.nth(0).boundingBox(),
    innerPanels.nth(1).boundingBox(),
  ]);
  expect(groupBox).not.toBeNull();
  expect(groupBox!.height).toBeCloseTo(200, 0);
  expect(leftBox!.width).toBeCloseTo(rightBox!.width, 0);
  expect(bottomBox!.height / topBox!.height).toBeCloseTo(3, 0);
};

const viewportWidthForCarousel = (viewportWidth: number): number =>
  viewportWidth <= 700 ? Math.min(192, viewportWidth - 48) : 320;

for (const component of examples) {
  for (const viewport of [
    { name: "desktop", width: 800 },
    { name: "compact", width: 420 },
  ]) {
    test(`${component} matches its ${viewport.name} visual contract`, async ({
      page,
    }) => {
      await page.setViewportSize({ height: 600, width: viewport.width });
      await page.goto(`/docs/static/examples/components/${component}.html`);

      const example = page.locator(".visual-example");
      await expect(example).toBeVisible();
      await assertGeometry(page, component);
      await expect(example).toHaveScreenshot(
        `${component}-${viewport.name}.png`,
        { animations: "disabled" },
      );
    });
  }
}
