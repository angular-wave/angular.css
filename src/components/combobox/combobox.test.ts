import { expect, test, type Page } from "@playwright/test";

const canonicalUrl = "/src/components/combobox/combobox.html";
const workflowsUrl = "/docs/static/examples/components/combobox-workflows.html";
const compositionsUrl =
  "/docs/static/examples/components/combobox-compositions.html";
const statesUrl =
  "/docs/static/examples/components/combobox-state-workflows.html";

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

test("canonical basic and auto-highlight artifacts expose distinct listbox behavior", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  await expectBuiltArtifactRuntime(page);
  const roots = page.locator("[ng-combobox]");
  const basic = page.locator("#basic-combobox");
  const automatic = page.locator("#auto-combobox");
  await expect(roots).toHaveCount(2);

  const basicInput = basic.getByRole("combobox");
  const basicContent = basic.locator(":scope > aside");
  await expect(basicContent).toBeHidden();
  await expect(basicInput).toHaveAttribute("aria-expanded", "false");
  await expect(basicInput).toHaveAttribute("aria-autocomplete", "list");
  await expect(basic.locator(":scope > header")).toHaveCSS("height", "36px");
  await basicInput.focus();
  await expect(basicContent).toBeVisible();
  await expect
    .poll(async () => {
      const anchor = await basic.locator(":scope > header").boundingBox();
      const popup = await basicContent.boundingBox();
      return anchor && popup
        ? {
            left: Math.round(popup.x - anchor.x),
            width: Math.round(popup.width - anchor.width),
          }
        : null;
    })
    .toEqual({ left: 0, width: 0 });
  await expect(basic.locator('[data-highlighted="true"]')).toHaveCount(0);
  await basicInput.press("Escape");
  await expect(basicContent).toBeHidden();

  const autoInput = automatic.getByRole("combobox");
  await autoInput.focus();
  const first = automatic.getByRole("option").first();
  await expect(first).toHaveAttribute("data-highlighted", "true");
  const firstId = await first.getAttribute("id");
  await expect(autoInput).toHaveAttribute(
    "aria-activedescendant",
    firstId ?? "",
  );
});

test("AngularTS filtering, empty state, and keyboard selection remain functional", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  const root = page.locator("#basic-combobox");
  const input = root.getByRole("combobox");
  const content = root.locator(":scope > aside");
  const items = root.getByRole("option", { includeHidden: true });

  await input.fill("sv");
  await expect(items).toHaveCount(1);
  await expect(items).toHaveText(/SvelteKit/);
  await input.press("ArrowDown");
  await input.press("Enter");
  await expect(input).toHaveValue("SvelteKit");
  await expect(page.locator('output[aria-live="polite"]')).toContainText(
    "Basic: SvelteKit",
  );
  await expect(content).toBeHidden();

  await input.fill("no-match");
  await expect(items).toHaveCount(0);
  await expect(root.locator(":scope > aside > p")).toBeVisible();
  await expect(root.locator(":scope > aside > p")).toHaveAttribute(
    "role",
    "status",
  );
});

test("state artifact covers controlled open, disabled skipping, boundaries, and dynamic options", async ({
  page,
}) => {
  await page.goto(statesUrl);
  await expectBuiltArtifactRuntime(page);
  const root = page.locator("#state-combobox");
  const input = root.getByRole("combobox");
  const content = root.locator(":scope > aside");
  const items = root.getByRole("option", { includeHidden: true });

  await page.getByRole("button", { name: "Toggle popup" }).click();
  await expect(root).toHaveAttribute("open", "true");
  await expect(content).toBeVisible();
  await input.press("Home");
  await expect(items.nth(0)).toHaveAttribute("data-highlighted", "true");
  await input.press("ArrowDown");
  await expect(items.nth(1)).toHaveAttribute("aria-disabled", "true");
  await expect(items.nth(2)).toHaveAttribute("data-highlighted", "true");
  await input.press("Enter");
  await expect(page.locator(".combobox-state-output")).toContainText(
    "Selected: Nuxt.js",
  );
  await expect(root).toHaveAttribute("open", "false");

  await input.fill("");
  await page.getByRole("button", { name: "Toggle Astro option" }).click();
  await expect(items).toHaveCount(5);
  await page.getByRole("button", { name: "Toggle popup" }).click();
  await input.press("End");
  await expect(items.last()).toHaveAttribute("data-highlighted", "true");
  await input.press("Enter");
  await expect(page.locator(".combobox-state-output")).toContainText(
    "Selected: Astro",
  );

  await root.locator('button[value="toggle"]').click();
  await expect(content).toBeVisible();
  await page.getByRole("button", { name: "Toggle Astro option" }).click();
  await expect(root).toHaveAttribute("open", "false");
  await expect(content).toBeHidden();
});

test("clear, disabled, and invalid references mirror native and AngularTS state", async ({
  page,
}) => {
  await page.goto(workflowsUrl);
  await expectBuiltArtifactRuntime(page);
  const clear = page.locator("#clear-combobox");
  await expect(clear.getByRole("combobox")).toHaveValue("Next.js");
  await clear.getByRole("button", { name: "Clear selection" }).click();
  await expect(clear.getByRole("combobox")).toHaveValue("");
  await expect(page.locator('output[aria-live="polite"]')).toContainText(
    "Clear: none",
  );

  const disabled = page.locator("#disabled-combobox");
  await expect(disabled.getByRole("combobox")).toBeDisabled();
  await disabled
    .getByRole("button", { name: "Show disabled frameworks" })
    .press("Enter");
  await expect(disabled.locator(":scope > aside")).toBeHidden();

  const invalid = page.locator("#invalid-combobox");
  await expect(invalid.getByRole("combobox")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  await expect(invalid.locator(":scope > header")).toHaveCSS(
    "border-color",
    "rgb(229, 72, 77)",
  );
});

test("grouped and input-addon references preserve labels, separators, filtering, and width", async ({
  page,
}) => {
  await page.goto(workflowsUrl);
  const grouped = page.locator("#groups-combobox");
  const input = grouped.getByRole("combobox");
  await input.fill("Tokyo");
  await expect(
    grouped.locator(":scope > aside > div > section").filter({ visible: true }),
  ).toHaveCount(1);
  await expect(
    grouped.getByRole("option").filter({ visible: true }),
  ).toHaveCount(1);
  const group = grouped
    .locator(":scope > aside > div > section")
    .filter({ visible: true });
  const labelId = await group
    .locator(":scope > :is(h1, h2, h3, h4, h5, h6)")
    .getAttribute("id");
  await expect(group).toHaveAttribute("role", "group");
  await expect(group).toHaveAttribute("aria-labelledby", labelId ?? "");
  await expect(group.getByRole("separator")).toHaveCount(1);

  const withAddon = page.locator("#input-group-combobox");
  await expect(withAddon.locator(".combobox-globe")).toBeVisible();
  await withAddon.getByRole("combobox").focus();
  await expect(withAddon.locator(":scope > aside")).toHaveCSS("width", "240px");
});

test("popup reference focuses its internal search and selects from a separate trigger", async ({
  page,
}) => {
  await page.goto(workflowsUrl);
  const root = page.locator("#popup-combobox");
  const trigger = root.getByRole("button", { name: "Country" });
  const input = root.getByRole("combobox");
  await trigger.click();
  await expect(root.locator(":scope > aside")).toBeVisible();
  await expect(input).toBeFocused();
  await input.fill("Japan");
  await expect(root.getByRole("option")).toHaveCount(1);
  await input.press("ArrowDown");
  await input.press("Enter");
  await expect(
    root.locator(':scope > button[value="toggle"] > span'),
  ).toHaveText("Japan");
  await expect(input).toHaveCount(0);
});

test("multiple reference keeps application chips authoritative and supports remove-last signaling", async ({
  page,
}) => {
  await page.goto(compositionsUrl);
  await expectBuiltArtifactRuntime(page);
  const root = page.locator("#multiple-combobox");
  const input = root.getByRole("combobox");
  const content = root.locator(":scope > aside");
  const chips = root.locator(":scope > fieldset > span");
  await expect(root).toHaveAttribute("multiple", "");
  await expect(content).toHaveAttribute("aria-multiselectable", "true");
  await expect(chips).toHaveCount(1);
  await expect(root.getByRole("button", { name: "Remove Next.js" })).toHaveCSS(
    "width",
    "24px",
  );

  await input.focus();
  await input.press("ArrowDown");
  await input.press("Enter");
  await expect(chips).toHaveCount(2);
  await expect(chips.nth(1)).toContainText("SvelteKit");
  await expect(content).toBeVisible();
  await input.fill("");
  await input.press("Backspace");
  await expect(chips).toHaveCount(1);
  await root.getByRole("button", { name: "Remove Next.js" }).click();
  await expect(chips).toHaveCount(0);
});

test("custom and RTL references retain authored option content and logical multi-selection", async ({
  page,
}) => {
  await page.goto(compositionsUrl);
  const custom = page.locator("#custom-combobox");
  const customInput = custom.getByRole("combobox");
  await customInput.fill("Japan");
  const japan = custom.getByRole("option", { name: /Japan/ });
  await expect(custom.getByText("Asia (jp)", { exact: true })).toBeVisible();
  await japan.click();
  await expect(page.locator('output[aria-live="polite"]')).toContainText(
    "Country: Japan",
  );

  const rtl = page.locator("#rtl-combobox");
  await expect(rtl).toHaveCSS("direction", "rtl");
  await expect(rtl.locator(":scope > aside")).toHaveCSS("direction", "rtl");
  await rtl.getByRole("combobox").focus();
  await rtl.getByRole("option", { name: "التصميم", exact: true }).click();
  await expect(rtl.locator(":scope > fieldset > span")).toHaveCount(2);
  await rtl.getByRole("button", { name: "إزالة التصميم" }).click();
  await expect(rtl.locator(":scope > fieldset > span")).toHaveCount(1);
});
