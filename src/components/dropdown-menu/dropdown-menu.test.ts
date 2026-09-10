import { expect, test } from "@playwright/test";

const canonicalUrl = "/src/components/dropdown-menu/dropdown-menu.html";
const workflowsUrl =
  "/docs/static/examples/components/dropdown-menu-workflows.html";

test("canonical dropdown exposes semantic state and closes from selection or Escape", async ({
  page,
}) => {
  await page.goto(canonicalUrl);

  const root = page.locator("[ng-dropdown-menu]");
  const trigger = page.getByRole("button", { name: "Options" });
  const menu = root.locator(":scope > menu");

  await expect(trigger).toHaveAttribute("aria-haspopup", "menu");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(menu).toBeHidden();
  await expect(menu).toHaveAttribute(
    "aria-labelledby",
    (await trigger.getAttribute("id")) ?? "",
  );
  await expect(
    menu.getByRole("menuitem", { includeHidden: true }),
  ).not.toHaveCount(0);

  await trigger.click();
  await expect(root).toHaveAttribute("open", "");
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(menu).toBeVisible();

  await menu.getByRole("menuitem", { name: /New task/ }).click();
  await expect(menu).toBeHidden();
  await expect(trigger).toBeFocused();

  await trigger.click();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("canonical dropdown reflects external authored open state", async ({
  page,
}) => {
  await page.goto(canonicalUrl);

  const root = page.locator("[ng-dropdown-menu]");
  const trigger = page.getByRole("button", { name: "Options" });
  const menu = root.locator(":scope > menu");

  await root.evaluate((element) => element.setAttribute("open", ""));
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(menu).toBeVisible();

  await root.evaluate((element) => element.removeAttribute("open"));
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(menu).toBeHidden();
});

test("workflow HTML supplies dynamic items and AngularTS preference state", async ({
  page,
}) => {
  await page.goto(workflowsUrl);

  const account = page.getByLabel("Account commands");
  await page.getByRole("button", { name: "Add archive item" }).click();
  const accountMenu = account.locator(":scope > menu");
  const archive = accountMenu.getByRole("menuitem", {
    name: "Archive",
    includeHidden: true,
  });
  await expect(archive).toBeAttached();
  await expect(archive).toHaveAttribute("role", "menuitem");
  await account.getByRole("button", { name: "Open" }).click();
  await archive.click();
  await expect(accountMenu).toBeHidden();

  const preferences = page.locator("#dropdown-preferences-title").locator("..");
  const preferencesTrigger = preferences.getByRole("button", {
    name: "Notifications",
  });
  await preferencesTrigger.click();
  const sms = preferences.getByRole("menuitemcheckbox", {
    name: "SMS notifications",
  });
  await expect(sms).toHaveAttribute("aria-checked", "false");
  await sms.click();
  await preferencesTrigger.click();
  await expect(sms).toHaveAttribute("aria-checked", "true");
  await preferences.getByRole("menuitemradio", { name: "Top" }).click();
  await preferencesTrigger.click();
  await expect(
    preferences.getByRole("menuitemradio", { name: "Top" }),
  ).toHaveAttribute("aria-checked", "true");
});

test("workflow HTML preserves icon triggers and submenu keyboard behavior", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto(workflowsUrl);

  const avatarTrigger = page.getByRole("button", {
    name: "Open account menu",
  });
  await expect(avatarTrigger.locator(":scope > svg")).toHaveCount(0);
  await expect(avatarTrigger.locator(".avatar")).toBeVisible();
  await avatarTrigger.click();
  await expect(
    page.locator(".dropdown-avatar-demo").getByRole("menu"),
  ).toBeVisible();
  await page.keyboard.press("Escape");

  const actions = page.locator("#dropdown-actions-title").locator("..");
  await actions.getByRole("button", { name: "Actions" }).click();
  const subTrigger = actions.getByRole("menuitem", { name: "Invite users" });
  await subTrigger.focus();
  await subTrigger.press("ArrowRight");
  const subContent = subTrigger.locator("..").locator(":scope > menu");
  await expect(subTrigger.locator("..")).toHaveAttribute("open", "");
  await expect(subContent).toBeVisible();
  const submenuBox = await subContent.boundingBox();
  expect(submenuBox!.x).toBeGreaterThanOrEqual(4);
  expect(submenuBox!.x + submenuBox!.width).toBeLessThanOrEqual(316);
  await expect(actions.getByRole("menuitem", { name: "Email" })).toBeFocused();
  await page.keyboard.press("ArrowLeft");
  await expect(subContent).toBeHidden();
});

test("workflow HTML mirrors RTL direction and AngularTS disabled state", async ({
  page,
}) => {
  await page.goto(workflowsUrl);

  const root = page.getByLabel("Arabic account menu");
  const trigger = root.getByRole("button", { name: "افتح القائمة" });
  const menu = root.locator(":scope > menu");
  const disabled = page.getByRole("checkbox", { name: "تعطيل القائمة" });

  await expect(root).toHaveCSS("direction", "rtl");
  await expect(menu).toHaveCSS("direction", "rtl");
  await disabled.check();
  await expect(trigger).toBeDisabled();
  await trigger.click({ force: true });
  await expect(menu).toBeHidden();

  await disabled.uncheck();
  await trigger.click();
  await expect(menu).toBeVisible();
});

test("workflow menus stay within a narrow viewport near every edge", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 600 });
  await page.goto(workflowsUrl);

  for (const name of ["Open account menu", "Actions", "افتح القائمة"]) {
    const trigger = page.getByRole("button", { name });
    await trigger.click();
    const menu = page.locator(
      `[aria-labelledby="${await trigger.getAttribute("id")}"]`,
    );
    const box = await menu.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(4);
    expect(box!.x + box!.width).toBeLessThanOrEqual(316);
    expect(box!.y).toBeGreaterThanOrEqual(4);
    expect(box!.y + box!.height).toBeLessThanOrEqual(596);
    await page.keyboard.press("Escape");
  }
});
