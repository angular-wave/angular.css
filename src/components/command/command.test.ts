import { expect, test, type Page } from "@playwright/test";

const canonicalUrl = "/src/components/command/command.html";
const dialogsUrl =
  "/docs/static/examples/components/command-dialog-workflows.html";
const scrollableUrl =
  "/docs/static/examples/components/command-scrollable.html";
const rtlUrl = "/docs/static/examples/components/command-rtl.html";

const expectBuiltArtifactRuntime = async (page: Page): Promise<void> => {
  await expect(
    page.locator('script[src$="/js/angular-ts.umd.js"]'),
  ).toHaveCount(1);
  await expect(
    page.locator('script[src$="/js/angular-css.umd.js"]'),
  ).toHaveCount(1);
  expect(
    await page.evaluate(() =>
      performance
        .getEntriesByType("resource")
        .map((entry) => entry.name)
        .filter((url) => /\/src\/(?:components|elements)\/.*\.ts$/.test(url)),
    ),
  ).toEqual([]);
};

test("canonical artifact exposes semantic command structure and packaged runtime", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  await expectBuiltArtifactRuntime(page);
  const root = page.locator("#command-demo");
  const input = root.getByRole("combobox");
  const list = root.locator(":scope > :last-child");
  await expect(root).toHaveAttribute("variant", "surface");
  await expect(input).toHaveAttribute("aria-autocomplete", "list");
  await expect(input).toHaveAttribute(
    "aria-controls",
    (await list.getAttribute("id")) ?? "",
  );
  await expect(list).toHaveAttribute("role", "listbox");
  await expect(root.getByRole("option")).toHaveCount(6);
  const groups = root.locator(":scope > :last-child > section");
  await expect(groups).toHaveCount(2);
  await expect(groups.first()).toHaveAttribute("role", "group");
  await expect(groups.first().locator("h2")).toHaveAttribute(
    "role",
    "presentation",
  );
  await expect(root.locator(":scope > :last-child > hr")).toHaveAttribute(
    "role",
    "presentation",
  );
  await expect(root.locator(":scope > header > label")).toHaveCSS(
    "height",
    "36px",
  );
  await expect(root.getByRole("option").first()).toHaveCSS("height", "32px");
});

test("AngularTS filtering owns result and empty state while Command follows the DOM", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  const root = page.locator("#command-demo");
  const input = root.getByRole("combobox");

  await input.fill("calculator");
  await expect(root.getByRole("option")).toHaveCount(1);
  await expect(
    root.getByRole("option", { name: "Calculator" }),
  ).toHaveAttribute("aria-disabled", "true");
  await expect(input).not.toHaveAttribute("aria-activedescendant");
  await expect(root.locator(":scope > :last-child > p")).toBeHidden();

  await input.fill("not-a-command");
  await expect(root.getByRole("option")).toHaveCount(0);
  await expect(root.locator(":scope > :last-child > p")).toBeVisible();
  await expect(root.locator(":scope > :last-child > p")).toHaveAttribute(
    "role",
    "status",
  );

  await input.fill("settings");
  await expect(root.getByRole("option")).toHaveCount(1);
  await input.press("Enter");
  await expect(page.locator('output[aria-live="polite"]')).toContainText(
    "Selected: Settings",
  );
});

test("keyboard and pointer navigation preserve active descendant and disabled skipping", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  const root = page.locator("#command-demo");
  const input = root.getByRole("combobox");
  const options = root.getByRole("option");

  await expect(options.nth(0)).toHaveAttribute("aria-selected", "true");
  await input.press("ArrowDown");
  await expect(options.nth(1)).toHaveAttribute("aria-selected", "true");
  await input.press("ArrowDown");
  await expect(options.nth(2)).toHaveAttribute("aria-disabled", "true");
  await expect(options.nth(3)).toHaveAttribute("aria-selected", "true");
  await input.press("End");
  await expect(options.last()).toHaveAttribute("aria-selected", "true");
  await input.press("Home");
  await expect(options.first()).toHaveAttribute("aria-selected", "true");

  await options.nth(4).hover();
  await expect(options.nth(4)).toHaveAttribute("aria-selected", "true");
  await expect(input).toHaveAttribute(
    "aria-activedescendant",
    (await options.nth(4).getAttribute("id")) ?? "",
  );
});

test("basic dialog composes focus, filtering, activation, close, and restore behavior", async ({
  page,
}) => {
  await page.goto(dialogsUrl);
  await expectBuiltArtifactRuntime(page);
  const trigger = page.getByRole("button", { name: "Open Menu", exact: true });
  const dialog = page.locator("#basic-command-dialog");
  const content = dialog.locator(":scope > dialog");
  await expect(content).toBeHidden();

  await trigger.click();
  await expect(content).toBeVisible();
  const input = content.getByRole("combobox");
  await expect(input).toBeFocused();
  await input.fill("Emoji");
  await expect(content.getByRole("option")).toHaveCount(1);
  await input.press("Enter");
  await expect(content).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(page.locator(".command-workflow-output").first()).toContainText(
    "Basic: Search Emoji",
  );
});

test("grouped and shortcut dialogs preserve labels, separators, and shortcut semantics", async ({
  page,
}) => {
  await page.goto(dialogsUrl);
  const groupedTrigger = page.getByRole("button", {
    name: "Open Grouped Menu",
  });
  await groupedTrigger.click();
  const grouped = page.locator("#groups-command-dialog");
  const groupedInput = grouped.getByRole("combobox");
  await groupedInput.fill("Billing");
  await expect(
    grouped.locator(":scope section[role='group']:visible"),
  ).toHaveCount(1);
  const group = grouped.locator(":scope section[role='group']:visible");
  const heading = group.locator(":scope > :is(h1, h2, h3, h4, h5, h6)");
  await expect(group).toHaveAttribute(
    "aria-labelledby",
    (await heading.getAttribute("id")) ?? "",
  );
  await expect(grouped.locator("kbd:visible")).toHaveText("⌘B");
  await groupedInput.press("Enter");
  await expect(grouped.locator(":scope > dialog")).toBeHidden();
  await expect(page.locator(".command-workflow-output").nth(1)).toContainText(
    "Grouped: Billing",
  );

  await page.getByRole("button", { name: "Open Shortcuts" }).click();
  const shortcuts = page.locator("#shortcuts-command-dialog");
  await expect(shortcuts.locator("kbd")).toHaveCount(3);
  for (const shortcut of await shortcuts.locator("kbd").all()) {
    await expect(shortcut).toHaveAttribute("aria-hidden", "true");
  }
});

test("application-owned Ctrl+J state opens the composed command dialog", async ({
  page,
}) => {
  await page.goto(dialogsUrl);
  const dialog = page.locator("#keyboard-command-dialog");
  const content = dialog.locator(":scope > dialog");
  await expect(content).toBeHidden();
  await page.keyboard.press("Control+j");
  await expect(content).toBeVisible();
  await expect(content.getByRole("combobox")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(content).toBeHidden();
});

test("scrollable dialog constrains a complete command inventory and scrolls active items", async ({
  page,
}) => {
  await page.goto(scrollableUrl);
  await expectBuiltArtifactRuntime(page);
  await page.getByRole("button", { name: "Open Menu" }).click();
  const list = page.locator("[ng-command] > :last-child");
  await expect(page.getByRole("option")).toHaveCount(23);
  const dimensions = await list.evaluate((element) => ({
    clientHeight: element.clientHeight,
    scrollHeight: element.scrollHeight,
  }));
  expect(dimensions.clientHeight).toBe(288);
  expect(dimensions.scrollHeight).toBeGreaterThan(dimensions.clientHeight);
  const input = page.getByRole("combobox");
  await input.press("End");
  expect(await list.evaluate((element) => element.scrollTop)).toBeGreaterThan(
    0,
  );
  await input.press("Enter");
  await expect(page.locator(".command-workflow-output")).toContainText(
    "Selected: Code Editor",
  );
  await expect(page.locator(".dialog > dialog")).toBeHidden();
});

test("RTL artifact keeps logical icon, text, shortcut, and keyboard order", async ({
  page,
}) => {
  await page.goto(rtlUrl);
  await expectBuiltArtifactRuntime(page);
  const root = page.locator("#rtl-command");
  const input = root.getByRole("combobox");
  await expect(root).toHaveCSS("direction", "rtl");
  await expect(root).toHaveCSS("direction", "rtl");
  await expect(root.getByRole("option")).toHaveCount(6);
  await input.press("End");
  await input.press("Enter");
  await expect(page.locator('output[aria-live="polite"]')).toContainText(
    "الإعدادات",
  );

  const item = root.getByRole("option", { name: /الملف الشخصي/ });
  const itemBox = await item.boundingBox();
  const iconBox = await item.locator(":scope > svg").boundingBox();
  const shortcutBox = await item.locator(":scope > kbd").boundingBox();
  expect(itemBox).not.toBeNull();
  expect(iconBox!.x).toBeGreaterThan(itemBox!.x + itemBox!.width / 2);
  expect(shortcutBox!.x).toBeLessThan(itemBox!.x + itemBox!.width / 2);
});
