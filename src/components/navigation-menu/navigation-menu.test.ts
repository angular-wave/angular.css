import { expect, test, type Locator, type Page } from "@playwright/test";

const canonicalUrl = "/src/components/navigation-menu/navigation-menu.html";
const workflowsUrl =
  "/docs/static/examples/components/navigation-menu-workflows.html";
const rtlUrl = "/docs/static/examples/components/navigation-menu-rtl.html";

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

const directContent = (trigger: Locator): Locator =>
  trigger.locator("..").locator(":scope > section");

test("canonical navigation preserves native landmark, list, button, and link semantics", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  await expectBuiltArtifactRuntime(page);

  const nav = page.getByRole("navigation", { name: "Primary navigation" });
  const triggers = nav.locator(":scope > ul > li > button");
  const contents = nav.locator(":scope > ul > li > section");
  await expect(nav).not.toHaveAttribute("open");
  await expect(nav.locator(":scope > ul")).toHaveCount(1);
  await expect(triggers).toHaveCount(3);
  await expect(nav.getByRole("link", { name: "Docs" })).toHaveAttribute(
    "href",
    "#docs",
  );
  await expect(nav.getByRole("menuitem")).toHaveCount(0);
  await expect(nav.getByRole("menu")).toHaveCount(0);
  await expect(
    nav.locator(":scope > ul > li > button[aria-haspopup]"),
  ).toHaveCount(0);

  for (const content of await contents.all()) {
    await expect(content).toBeHidden();
    await expect(content).toHaveAttribute("aria-hidden", "true");
    await expect(content).not.toHaveAttribute("role", "menu");
  }
  const triggerId = await triggers.first().getAttribute("id");
  expect(triggerId).toBeTruthy();
  await expect(contents.first()).toHaveAttribute("aria-labelledby", triggerId!);
});

test("pointer and click disclosure share state and Escape restores trigger focus", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  const trigger = page.getByRole("button", { name: "Getting started" });
  const content = directContent(trigger);

  await trigger.hover();
  await expect(content).toBeVisible();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(content).toHaveAttribute("open", "");

  await page.mouse.move(850, 320);
  await expect(content).toBeHidden();
  await trigger.click();
  await expect(content).toBeVisible();
  await expect(page.getByRole("link", { name: /Introduction/ })).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(content).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
});

test("directional keys include direct links and only switch disclosure when already open", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  const gettingStarted = page.getByRole("button", {
    name: "Getting started",
  });
  const components = page.getByRole("button", { name: "Components" });
  const withIcon = page.getByRole("button", { name: "With Icon" });
  const docs = page.getByRole("link", { name: "Docs" });

  await gettingStarted.focus();
  await gettingStarted.press("ArrowRight");
  await expect(components).toBeFocused();
  await expect(directContent(components)).toBeHidden();

  await components.press("Enter");
  await expect(directContent(components)).toBeVisible();
  await components.press("ArrowDown");
  const alertDialog = directContent(components).getByRole("link", {
    name: /Alert Dialog/,
  });
  const hoverCard = directContent(components).getByRole("link", {
    name: /Hover Card/,
  });
  await expect(alertDialog).toBeFocused();
  await alertDialog.press("ArrowDown");
  await expect(hoverCard).toBeFocused();

  await hoverCard.press("ArrowRight");
  await expect(withIcon).toBeFocused();
  await expect(directContent(withIcon)).toBeVisible();
  await withIcon.press("ArrowRight");
  await expect(docs).toBeFocused();
  await expect(directContent(withIcon)).toBeHidden();

  await docs.press("Home");
  await expect(gettingStarted).toBeFocused();
  await gettingStarted.press("End");
  await expect(docs).toBeFocused();
});

test("content links and outside focus dismiss disclosure without replacing navigation", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  const trigger = page.getByRole("button", { name: "Getting started" });
  const content = directContent(trigger);
  await trigger.click();
  const installation = content.getByRole("link", { name: /Installation/ });
  await installation.click();
  await expect(content).toBeHidden();
  await expect(page).toHaveURL(/#installation$/);

  await page.goto(workflowsUrl);
  const product = page.getByRole("button", { name: "Product" });
  const productContent = directContent(product);
  await product.click();
  await expect(productContent).toBeVisible();
  await page.getByRole("button", { name: "Outside focus target" }).focus();
  await expect(productContent).toBeHidden();
});

test("workflow exposes controlled state and disabled triggers through built AngularTS", async ({
  page,
}) => {
  await page.goto(workflowsUrl);
  await expectBuiltArtifactRuntime(page);

  const nav = page.getByRole("navigation", { name: "Controlled navigation" });
  const resources = nav.getByRole("button", { name: "Resources" });
  const content = directContent(resources);
  const disabled = nav.getByRole("button", { name: "Disabled" });
  await expect(content).toBeHidden();
  await page.getByRole("button", { name: "Toggle controlled panel" }).click();
  await expect(content).toBeVisible();
  await expect(content).toHaveAttribute("open", "");
  await expect(resources).toHaveAttribute("aria-expanded", "true");
  await page.getByRole("button", { name: "Toggle controlled panel" }).click();
  await expect(content).toBeHidden();

  await disabled.click({ force: true });
  await expect(directContent(disabled)).toBeHidden();
  await expect(disabled).toHaveAttribute("aria-expanded", "false");
});

test("dynamic AngularTS menus and links bind in actual DOM order", async ({
  page,
}) => {
  await page.goto(workflowsUrl);
  await page.getByRole("button", { name: "Add company menu" }).click();
  await page.getByRole("button", { name: "Add careers link" }).click();

  const nav = page.getByRole("navigation", { name: "Dynamic navigation" });
  const product = nav.getByRole("button", { name: "Product" });
  const company = nav.getByRole("button", { name: "Company" });
  const support = nav.getByRole("link", { name: "Support" });
  const careers = nav.locator("#dynamic-careers-link");
  await expect(page.locator("#dynamic-company-menu")).toBeVisible();
  await expect(careers).toHaveAttribute("href", "#careers");
  await expect(company).not.toHaveAttribute("role", "menuitem");

  await product.focus();
  await product.press("ArrowRight");
  await expect(company).toBeFocused();
  await expect(directContent(company)).toBeHidden();
  await company.press("ArrowRight");
  await expect(support).toBeFocused();
  await support.press("ArrowRight");
  await expect(product).toBeFocused();

  await company.press("Enter");
  await expect(directContent(company)).toBeVisible();
  await company.press("ArrowDown");
  await expect(
    directContent(company).getByRole("link", { name: "About" }),
  ).toBeFocused();
});

test("RTL reverses physical movement and keeps inline-end flyouts in view", async ({
  page,
}) => {
  await page.setViewportSize({ width: 900, height: 700 });
  await page.goto(rtlUrl);
  await expectBuiltArtifactRuntime(page);

  const nav = page.getByRole("navigation", { name: "التنقل الرئيسي" });
  const start = nav.getByRole("button", { name: "البدء" });
  const components = nav.getByRole("button", { name: "المكونات" });
  const withIcon = nav.getByRole("button", { name: "مع أيقونة" });
  await expect(nav).toHaveCSS("direction", "rtl");
  await expect(nav.getByRole("link", { name: "الوثائق" })).toBeVisible();

  await components.focus();
  await components.press("ArrowRight");
  await expect(start).toBeFocused();
  await expect(directContent(start)).toBeHidden();

  await components.press("Enter");
  await components.press("ArrowLeft");
  await expect(withIcon).toBeFocused();
  await expect(directContent(withIcon)).toBeVisible();

  await page.keyboard.press("Escape");
  await start.press("Enter");
  const content = directContent(start);
  const triggerBox = await start.boundingBox();
  const contentBox = await content.boundingBox();
  expect(triggerBox).not.toBeNull();
  expect(contentBox).not.toBeNull();
  expect(contentBox!.x).toBeGreaterThanOrEqual(0);
  expect(contentBox!.x + contentBox!.width).toBeLessThanOrEqual(900);
  expect(contentBox!.x).toBeGreaterThan(triggerBox!.x - contentBox!.width);
});
