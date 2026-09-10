import { expect, test, type Page } from "@playwright/test";

import { catalogReferenceApi } from "../scripts/catalog-api";
import {
  catalogNames,
  catalogPolicy,
  type CatalogEntryName,
} from "../scripts/component-policy";

type Contract = (page: Page) => Promise<void>;

const componentNames = catalogNames;
const elementNames = new Set<string>(
  catalogNames.filter((name) => !catalogPolicy[name].runtime),
);

const slot = (page: Page, name: CatalogEntryName) =>
  page.locator(
    catalogReferenceApi[name]?.rootSelector ?? `.${name}, [ng-${name}]`,
  );

const assertBuiltArtifactContract = async (
  page: Page,
  sourceRequests: string[],
) => {
  const scriptPaths = await page
    .locator("script[src]")
    .evaluateAll((scripts) =>
      scripts.map(
        (script) => new URL((script as HTMLScriptElement).src).pathname,
      ),
    );

  expect(scriptPaths).toContain("/docs/static/js/angular-ts.umd.js");
  expect(scriptPaths).toContain("/docs/static/js/angular-css.umd.js");
  expect(sourceRequests).toEqual([]);
};

const assertVisualContract = async (
  page: Page,
  component: CatalogEntryName,
) => {
  const rootSelector =
    (elementNames.has(component)
      ? (catalogReferenceApi[component]?.rootSelector ?? `.${component}`)
      : undefined) ??
    (component === "resizable"
      ? "[ng-resizable-panel-group]"
      : component === "toast"
        ? "[ng-toast]"
        : `[ng-${component}]`);
  const result = await page.evaluate(
    ({ rootSelector }) => {
      const root = document.querySelector<HTMLElement>(rootSelector);
      if (root instanceof HTMLDialogElement && !root.open) root.showModal();
      const angularSheet = Array.from(document.styleSheets).find((sheet) =>
        sheet.href?.endsWith("/css/angular.css"),
      );

      const matchesRule = (rules: CSSRuleList): boolean =>
        Array.from(rules).some((rule) => {
          if (rule instanceof CSSStyleRule) {
            try {
              return Boolean(root?.matches(rule.selectorText));
            } catch {
              return false;
            }
          }

          return "cssRules" in rule
            ? matchesRule((rule as CSSGroupingRule).cssRules)
            : false;
        });

      const rootBox = root?.getBoundingClientRect();
      const renderedBox =
        rootBox && rootBox.width > 0 && rootBox.height > 0
          ? rootBox
          : root
              ?.querySelector<HTMLElement>("*:not([hidden])")
              ?.getBoundingClientRect();
      const bodyStyle = getComputedStyle(document.body);
      const rootStyle = root ? getComputedStyle(root) : null;
      const roleClasses = Array.from(
        document.querySelectorAll<HTMLElement>("[role][class]"),
      )
        .map((element) => ({
          classes: Array.from(element.classList).filter(
            (className) => !className.startsWith("ng-"),
          ),
          role: element.getAttribute("role") ?? "",
          tag: element.tagName.toLowerCase(),
        }))
        .filter(({ classes }) => classes.length > 0)
        .map(
          ({ classes, role, tag }) =>
            `${tag}[role="${role}"].${classes.join(".")}`,
        );
      const clipped = Array.from(
        document.body.querySelectorAll<HTMLElement>("*"),
      )
        .filter((element) => {
          const style = getComputedStyle(element);
          return (
            !element.hidden &&
            style.display !== "none" &&
            style.visibility !== "hidden" &&
            Number(style.opacity) > 0
          );
        })
        .map((element) => ({ element, box: element.getBoundingClientRect() }))
        .filter(({ box }) => box.width > 0 && box.height > 0)
        .filter(({ element, box }) => {
          const outsideViewport =
            box.left < -1 ||
            box.top < -1 ||
            box.right > window.innerWidth + 1 ||
            box.bottom > window.innerHeight + 1;
          if (!outsideViewport) return false;

          let ancestor = element.parentElement;
          while (ancestor && ancestor !== document.body) {
            const style = getComputedStyle(ancestor);
            if (
              /auto|hidden|scroll/.test(
                `${style.overflow}${style.overflowX}${style.overflowY}`,
              )
            ) {
              return false;
            }
            ancestor = ancestor.parentElement;
          }
          return true;
        })
        .map(
          ({ element }) => element.className || element.tagName.toLowerCase(),
        );

      return {
        angularSheetLoaded: Boolean(
          angularSheet && angularSheet.cssRules.length,
        ),
        bodyFontSize: bodyStyle.fontSize,
        clipped,
        componentRuleApplied: Boolean(
          root && angularSheet && matchesRule(angularSheet.cssRules),
        ),
        roleClasses,
        rootBox: renderedBox
          ? { height: renderedBox.height, width: renderedBox.width }
          : null,
        spacing: rootStyle?.getPropertyValue("--spacing").trim() || "",
      };
    },
    { rootSelector },
  );

  expect(result.angularSheetLoaded).toBe(true);
  expect(result.bodyFontSize).toBe("14px");
  expect(result.componentRuleApplied).toBe(true);
  expect(
    result.roleClasses,
    `${component} role-bearing elements must not need authored classes`,
  ).toEqual([]);
  expect(result.rootBox, `${component} root must render`).not.toBeNull();
  expect(result.rootBox!.width, `${component} root width`).toBeGreaterThan(0);
  expect(result.rootBox!.height, `${component} root height`).toBeGreaterThan(0);
  expect(Number.parseFloat(result.spacing)).toBe(0.25);
  expect(
    result.clipped,
    `${component} has viewport-clipped visible content`,
  ).toEqual([]);
};

const contracts: Record<string, Contract> = {
  accordion: async (page) => {
    const root = page.locator("section[aria-label]:has(> details)");
    const firstItem = root.locator("details").first();
    const trigger = firstItem.locator("summary");
    await expect(root).toBeVisible();
    await expect(firstItem).toHaveAttribute("open", "");
    await trigger.click();
    await expect(firstItem).not.toHaveAttribute("open", "");
    const returnItem = root.locator("details").nth(1);
    await returnItem.locator("summary").click();
    await expect(returnItem).toHaveAttribute("open", "");
    await expect(
      page.getByText(/Returns are accepted within 30 days/),
    ).toBeVisible();
  },
  alert: async (page) => {
    await expect(page.locator('[role="alert"]')).toHaveCount(2);
    expect(
      await page
        .locator('[role="alert"]')
        .evaluateAll((alerts) =>
          alerts.map((alert) => alert.getAttribute("role")),
        ),
    ).toEqual(["alert", "alert"]);
    await expect(page.locator('[role="alert"] > h2')).toHaveCount(2);
    await expect(page.locator('[role="alert"] > p')).toHaveCount(2);
    await expect(page.locator('[role="alert"] > svg')).toHaveCount(2);
  },
  "alert-dialog": async (page) => {
    const content = page.getByRole("alertdialog", { includeHidden: true });
    const root = content.locator("..");
    const trigger = root.locator(":scope > button:first-child");
    await expect(trigger).toBeVisible();
    await expect(content).toBeHidden();
    await expect(trigger).toHaveAttribute(
      "commandfor",
      "confirmation-dialog-content",
    );
    await trigger.click();
    await expect(content).toHaveAttribute("open", "");
    await expect(content).toHaveAttribute(
      "aria-labelledby",
      "confirmation-dialog-title",
    );
    await expect(content).toHaveAttribute(
      "aria-describedby",
      "confirmation-dialog-description",
    );
    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(content).toBeHidden();
    await expect(trigger).toBeFocused();
    await trigger.click();
    await expect(page.getByRole("alertdialog")).toBeVisible();
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(content).toBeHidden();
  },
  "aspect-ratio": async (page) => {
    const box = await slot(page, "aspect-ratio").boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width / box!.height).toBeCloseTo(16 / 9, 1);
  },
  avatar: async (page) => {
    const avatars = slot(page, "avatar");
    await expect(avatars).toHaveCount(6);
    await expect(page.locator(".avatar > img")).toHaveCount(5);
    await expect(page.locator(".avatar > img").first()).toBeVisible();
    await expect(page.locator('.avatar[aria-label="Jane Doe"]')).toContainText(
      "JD",
    );
    await expect(
      page.locator(":is(div, span):has(> .avatar + .avatar) > output"),
    ).toBeVisible();
    expect(
      await avatars.evaluateAll((items) =>
        items.map((item) => getComputedStyle(item).width),
      ),
    ).toEqual(["32px", "32px", "32px", "32px", "32px", "32px"]);
    await expect(avatars.nth(0)).toHaveCSS("overflow", "visible");
    expect(
      await avatars
        .nth(0)
        .evaluate(
          (avatar) => getComputedStyle(avatar, "::after").borderTopStyle,
        ),
    ).toBe("solid");
    const badge = page.locator(".avatar > output").first();
    const [avatarBox, badgeBox] = await Promise.all([
      avatars.nth(1).boundingBox(),
      badge.boundingBox(),
    ]);
    expect(avatarBox).not.toBeNull();
    expect(badgeBox).not.toBeNull();
    expect(badgeBox!.x + badgeBox!.width).toBeGreaterThan(
      avatarBox!.x + avatarBox!.width - 2,
    );
  },
  badge: async (page) => {
    await expect(slot(page, "badge")).not.toHaveCount(0);
    await expect(slot(page, "badge").first()).toBeVisible();
  },
  breadcrumb: async (page) => {
    await expect(page.getByRole("navigation")).toHaveAttribute(
      "aria-label",
      /breadcrumb/i,
    );
    await expect(
      page.locator('nav > ol [aria-current="page"]'),
    ).toHaveAttribute("aria-current", "page");
  },
  button: async (page) => {
    const buttons = page.getByRole("button");
    await expect(buttons).toHaveCount(2);
    await expect(page.getByRole("button", { name: "Button" })).toHaveAttribute(
      "variant",
      "outline",
    );
    await expect(page.getByRole("button", { name: "Submit" })).toHaveAttribute(
      "size",
      "icon",
    );
  },
  "button-group": async (page) => {
    const copy = page.getByRole("button", { name: "Copy" });
    const separators = page.locator('[role="group"] > hr');
    const verticalSeparators = page.locator(
      '[role="group"] > hr[aria-orientation="vertical"]',
    );
    await expect(slot(page, "button-group")).toHaveCount(6);
    await expect(separators).toHaveCount(3);
    await expect(verticalSeparators).toHaveCount(2);
    await expect(verticalSeparators.first()).toHaveCSS("width", "1px");
    await expect(
      page.getByRole("group", { name: "Media controls" }),
    ).toHaveAttribute("orientation", "vertical");
    await copy.click();
    await expect(page.locator(".output")).toContainText("Action: Copy");
    await expect(copy).not.toHaveAttribute("aria-pressed");
  },
  calendar: async (page) => {
    const calendar = page.locator("[ng-calendar]");
    const days = calendar.locator(":scope > div button[value]");
    const controls = calendar.locator(":scope > header > button");
    await expect(days).toHaveCount(42);
    await days.filter({ hasText: /^20$/ }).click();
    await expect(page.locator(".output")).toContainText("2026-05-20");
    await controls.last().click();
    await expect(
      calendar
        .locator(":scope > header > :is(h1, h2, h3, h4, h5, h6)")
        .getByRole("combobox", { name: "Month" }),
    ).toHaveValue("5");
    await expect(calendar).toHaveAttribute("data-month", "2026-06");
  },
  card: async (page) => {
    const email = page.locator("#card-email");
    await page.getByText("Email", { exact: true }).click();
    await expect(email).toBeFocused();
    await email.fill("jane@example.com");
    await expect(email).toHaveValue("jane@example.com");
  },
  carousel: async (page) => {
    const root = page.locator("[ng-carousel]");
    const next = page.getByRole("button", { name: "Next" });
    const items = root.locator(":scope > * > :is(ul, ol) > li");
    await expect(items.first()).toHaveAttribute("aria-hidden", "false");
    for (const index of [1, 2, 3, 4]) {
      await next.click();
      await expect(items.nth(index)).toHaveAttribute("aria-hidden", "false");
    }
    await expect(next).toBeDisabled();
  },
  chart: async (page) => {
    const chart = page.locator(".chart");
    const bars = chart.locator(":scope > section > ul > li > span");
    expect(await chart.getAttribute("role")).toBeNull();
    await expect(chart.locator(":scope > section > ul > li")).toHaveCount(6);
    await expect(bars).toHaveCount(12);
    await expect(bars.nth(2)).toHaveAttribute("data-value", "100%");
    expect((await bars.nth(2).boundingBox())?.height).toBeGreaterThan(150);
  },
  checkbox: async (page) => {
    const checkbox = page.locator("#terms-checkbox");
    await expect(checkbox).toHaveAttribute("type", "checkbox");
    await expect(
      page.locator('input[type="checkbox"]:not([role="switch"])'),
    ).toHaveCount(4);
    await checkbox.check();
    await expect(page.getByRole("status")).toContainText("Terms accepted");
    await expect(checkbox).toBeChecked();
    expect(
      await checkbox.evaluate(
        (element) => getComputedStyle(element, "::after").display,
      ),
    ).toBe("block");
  },
  disclosure: async (page) => {
    const root = page.locator("details.disclosure");
    const trigger = root.locator(":scope > summary");
    await expect(root).not.toHaveAttribute("open", "");
    await expect(page.getByText("Status", { exact: true })).toBeVisible();
    await expect(root.locator(":scope > :last-child")).toBeHidden();
    await trigger.click();
    await expect(root).toHaveAttribute("open", "");
    await expect(page.getByText("Status", { exact: true })).toBeVisible();
    await expect(root.locator(":scope > :last-child")).toBeVisible();
  },
  combobox: async (page) => {
    const roots = page.locator("[ng-combobox]");
    const basic = page.locator("#basic-combobox");
    const automatic = page.locator("#auto-combobox");
    const basicInput = basic.getByRole("combobox");
    await expect(roots).toHaveCount(2);
    await expect(page.locator("[ng-combobox] > aside > div")).toHaveCount(2);
    await expect(page.locator("[ng-combobox] > aside > div > ul")).toHaveCount(
      2,
    );
    await expect(basic.locator(":scope > aside")).toBeHidden();

    await basicInput.fill("SvelteKit");
    await expect(basic.getByRole("option")).toHaveCount(1);
    await basicInput.press("ArrowDown");
    await basicInput.press("Enter");
    await expect(basicInput).toHaveValue("SvelteKit");
    await expect(page.locator('output[aria-live="polite"]')).toContainText(
      "Basic: SvelteKit",
    );

    const automaticInput = automatic.getByRole("combobox");
    await automaticInput.focus();
    await expect(automatic.getByRole("option").first()).toHaveAttribute(
      "data-highlighted",
      "true",
    );
  },
  command: async (page) => {
    const root = page.locator("#command-demo");
    const input = root.getByRole("combobox");
    await expect(root.getByRole("option")).toHaveCount(6);
    await input.fill("settings");
    await expect(root.locator("section > :is(h1, h2, h3):visible")).toHaveText(
      "Settings",
    );
    await expect(root.getByRole("option")).toHaveCount(1);
    await expect(root.locator(":scope > :last-child > hr")).toHaveCSS(
      "height",
      "1px",
    );
    await expect(input).toHaveAttribute("aria-activedescendant", /.+/);
    await input.press("Enter");
    await expect(page.locator('output[aria-live="polite"]')).toContainText(
      "Selected: Settings",
    );
  },
  "context-menu": async (page) => {
    const root = page.locator("[ng-context-menu]");
    const trigger = root.locator(":scope > :first-child");
    await trigger.click();
    await expect(root.locator(":scope > menu")).toBeHidden();
    await trigger.click({ button: "right" });
    await expect(root.locator(":scope > menu")).toBeVisible();
    await expect(root).toHaveAttribute("open", "");
    await expect(root.locator(":scope > menu > section").first()).toBeVisible();
    await expect(
      page.getByRole("menuitem", { name: /^Forward/ }),
    ).toBeDisabled();
    const subTrigger = root.locator("details > summary");
    await subTrigger.evaluate((element) =>
      element.focus({ preventScroll: true }),
    );
    await subTrigger.press("ArrowRight");
    await expect(root.locator("details > menu")).toBeVisible();
    await expect(
      page.getByRole("menuitem", { name: "Save Page..." }),
    ).toBeFocused();
    await page.keyboard.press("ArrowLeft");
    await expect(root.locator("details > menu")).toBeHidden();
    await page.keyboard.press("Escape");
    await expect(page.locator("[ng-context-menu]")).not.toHaveAttribute("open");
  },
  dialog: async (page) => {
    const root = page.locator(".dialog");
    const trigger = page.getByRole("button", { name: "Edit profile" });
    await expect(trigger).toBeVisible();
    await expect(root.locator("dialog")).toBeHidden();
    await trigger.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.locator("#dialog-name")).toBeFocused();
    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(root.locator("dialog")).toBeHidden();
  },
  direction: async (page) => {
    await expect(page.locator("#direction-rtl")).toHaveAttribute("dir", "rtl");
  },
  drawer: async (page) => {
    const root = page.locator(".drawer");
    const trigger = page.getByRole("button", { name: "Open Drawer" });
    const content = root.locator(":scope > dialog");
    await expect(trigger).toBeVisible();
    await expect(content).toBeHidden();
    await trigger.click();
    await expect(content).toHaveAttribute("open", "");
    await expect(content).toHaveAttribute("side", "bottom");
    expect(await content.getAttribute("role")).toBeNull();
    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(content).toBeHidden();
  },
  "dropdown-menu": async (page) => {
    const trigger = page.getByRole("button", { name: "Options" });
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByRole("menu")).toBeVisible();
    const menu = page.getByRole("menu").first();
    await expect(menu.locator(":scope > section")).toBeVisible();
    await expect(menu.locator("h3")).toBeVisible();
    await expect(menu.locator("hr")).toBeVisible();
    await expect(menu.locator("kbd")).toBeVisible();
    await expect(page.getByRole("menuitemcheckbox")).toBeVisible();
    await expect(page.getByRole("menuitemradio").first()).toBeVisible();
    const subTrigger = page.locator("[ng-dropdown-menu] details > summary");
    await subTrigger.evaluate((element) =>
      element.focus({ preventScroll: true }),
    );
    await subTrigger.press("ArrowRight");
    await expect(
      subTrigger.locator("..").locator(":scope > menu"),
    ).toBeVisible();
    await expect(
      page.getByRole("menuitem", { name: "Copy link" }),
    ).toBeFocused();
    await page.keyboard.press("ArrowLeft");
    await expect(
      subTrigger.locator("..").locator(":scope > menu"),
    ).toBeHidden();
  },
  empty: async (page) => {
    await expect(page.locator(".empty > header > h2")).toHaveText(
      "No Projects Yet",
    );
    await expect(
      page.getByRole("button", { name: "Create Project" }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Learn More" })).toBeVisible();
  },
  field: async (page) => {
    const email = page.locator("#demo-profile-email");
    await expect(email).toHaveAttribute(
      "aria-describedby",
      "demo-profile-email-error",
    );
    expect(
      await email.evaluate((control: HTMLInputElement) =>
        control.checkValidity(),
      ),
    ).toBe(false);
    await email.fill("jane@example.com");
    expect(
      await email.evaluate((control: HTMLInputElement) =>
        control.checkValidity(),
      ),
    ).toBe(true);
    await expect(page.locator(".output")).toContainText("jane@example.com");
  },
  "hover-card": async (page) => {
    const root = page.locator("[ng-hover-card]");
    const trigger = root.locator(":scope > :is(a, button)");
    await trigger.focus();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(root.locator(":scope > aside")).toBeVisible();
    await trigger.blur();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  },
  input: async (page) => {
    const input = page.locator("#docs-input-search");
    await input.fill("functional");
    await expect(input).toHaveValue("functional");
    await expect(page.locator(".output")).toContainText("functional");
    await expect(input).not.toHaveAttribute("data-empty");
  },
  "input-group": async (page) => {
    const input = page.locator(".input-group > input");
    await page.locator('.input-group > label[for="search"]').click();
    await expect(input).toBeFocused();
    await expect(page.locator(".input-group")).not.toHaveAttribute(
      "data-addon-count",
      /.+/,
    );
  },
  "input-otp": async (page) => {
    const input = page.getByLabel("One-time code");
    await expect(input).toHaveValue("123456");
    await expect(input).toHaveAttribute("autocomplete", "one-time-code");
    await expect(input).toHaveAttribute("maxlength", "6");
    await input.fill("923456");
    await expect(page.getByRole("status")).toContainText("Code: 923456");
  },
  item: async (page) => {
    await expect(slot(page, "item")).toHaveCount(3);
    await expect(page.locator(".item > section > h3").first()).toHaveText(
      "Profile verified",
    );
  },
  kbd: async (page) => {
    await expect(page.locator("kbd")).not.toHaveCount(0);
    await expect(page.locator("kbd").first()).toBeVisible();
  },
  label: async (page) => {
    await page.getByText("Email", { exact: true }).click();
    await expect(page.locator("#email")).toBeFocused();
  },
  menubar: async (page) => {
    const file = page.getByRole("menuitem", { name: "File", exact: true });
    const fileContent = file.locator("..").locator(":scope > menu");
    await expect(file).toHaveAttribute("aria-expanded", "false");
    await file.click();
    await expect(file).toHaveAttribute("aria-expanded", "true");
    await expect(fileContent).toBeVisible();
    await expect(fileContent.locator(":scope > section").first()).toBeVisible();
    await expect(page.locator("[ng-menubar] fieldset")).toHaveCount(1);
    await expect(fileContent.locator("kbd").first()).toBeVisible();
    const subTrigger = fileContent.getByRole("menuitem", { name: "Share" });
    const subContent = subTrigger.locator("..").locator(":scope > menu");
    await subTrigger.evaluate((element) =>
      element.focus({ preventScroll: true }),
    );
    await subTrigger.press("ArrowRight");
    await expect(subContent).toBeVisible();
    await expect(
      subContent.getByRole("menuitem", { name: "Email link" }),
    ).toBeFocused();
    await page.keyboard.press("ArrowLeft");
    await expect(subContent).toBeHidden();
    await page.keyboard.press("Escape");
    await expect(file).toHaveAttribute("aria-expanded", "false");
  },
  "navigation-menu": async (page) => {
    const nav = page.getByRole("navigation", { name: "Primary navigation" });
    const trigger = nav.getByRole("button", { name: "Getting started" });
    await expect(nav.getByRole("link", { name: "Docs" })).toHaveAttribute(
      "href",
      "#docs",
    );
    await expect(nav.getByRole("menu")).toHaveCount(0);
    await expect(nav.getByRole("menuitem")).toHaveCount(0);
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(trigger).toBeFocused();
  },
  pagination: async (page) => {
    const pagination = page.getByRole("navigation", { name: "pagination" });
    const links = pagination.locator("a:not([rel])");
    const previous = pagination.getByRole("link", {
      name: "Go to previous page",
    });
    const next = pagination.getByRole("link", { name: "Go to next page" });
    await expect(links).toHaveCount(3);
    await expect(pagination.locator("[aria-current='page']")).toHaveCount(1);
    await expect(previous).toHaveAttribute("href", "#previous");
    await expect(next).toHaveAttribute("href", "#next");
    await expect(previous.locator("svg[icon='inline-start']")).toHaveCount(1);
    await expect(next.locator("svg[icon='inline-end']")).toHaveCount(1);
    await expect(pagination.locator(":scope > ul > li > span")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect((await links.first().boundingBox())?.height).toBe(32);
  },
  popover: async (page) => {
    const trigger = page.getByRole("button", { name: "Open popover" });
    const content = page.locator(
      "span:has(> [popovertarget] ~ [popover]) > [popover]",
    );
    const contentId = await content.getAttribute("id");
    if (!contentId) throw new Error("Popover content requires an id");
    await expect(trigger).toHaveAttribute("popovertarget", contentId);
    await trigger.click();
    await expect(content).toBeVisible();
  },
  progress: async (page) => {
    const timed = page.locator(".progress-demo-timed");
    await expect(timed).toHaveAttribute("value", "66");
    await expect(timed).toHaveAttribute("max", "100");
    await expect(timed).toHaveCSS("height", "4px");

    const labeled = page.locator(".progress-demo-labeled");
    const label = labeled.locator("label");
    await expect(label).toHaveText("Upload progress");
    await expect(labeled.locator("progress")).toHaveAccessibleName(
      "Upload progress",
    );
    await expect(labeled.locator("output")).toHaveText("56%");
  },
  "radio-group": async (page) => {
    const compact = page.locator("#density-compact");
    await expect(
      page.locator('fieldset:has(input[type="radio"]):not(.toggle-group)'),
    ).toBeVisible();
    await compact.check();
    await expect(page.locator('output[aria-live="polite"]')).toContainText(
      "compact",
    );
    await expect(compact).toBeChecked();
    expect(
      await compact.evaluate(
        (element) => getComputedStyle(element, "::after").display,
      ),
    ).toBe("block");
  },
  resizable: async (page) => {
    const handle = page.locator("[ng-resizable-panel-group] > hr").first();
    const before = await handle.getAttribute("aria-valuenow");
    await handle.focus();
    await handle.press("ArrowRight");
    await expect(handle).not.toHaveAttribute("aria-valuenow", before || "");

    const box = await handle.boundingBox();
    expect(box).not.toBeNull();
    const pointerStart = box!.x + box!.width / 2;
    await page.mouse.move(pointerStart, box!.y + box!.height / 2);
    await page.mouse.down();
    await page.mouse.move(pointerStart + 24, box!.y + box!.height / 2);
    await expect(handle).toHaveAttribute("data-resizing", "true");
    await page.mouse.up();
    await expect(handle).not.toHaveAttribute("data-resizing", "true");
  },
  "scroll-area": async (page) => {
    const root = page.locator(".scroll-area");
    await expect(root).toHaveAttribute("tabindex", "0");
    await expect(root).toHaveAttribute("aria-label", "Release tags");
    const overflow = await root.evaluate((element) => ({
      x: element.scrollWidth > element.clientWidth,
      y: element.scrollHeight > element.clientHeight,
    }));
    expect(overflow).toEqual({ x: true, y: true });
    await root.evaluate((element) => {
      element.scrollTop = element.scrollHeight;
      element.scrollLeft = element.scrollWidth;
    });
    expect(await root.evaluate((element) => element.scrollTop)).toBeGreaterThan(
      0,
    );
    expect(
      await root.evaluate((element) => Math.abs(element.scrollLeft)),
    ).toBeGreaterThan(0);
  },
  select: async (page) => {
    const select = page.getByRole("combobox", { name: "Status" });
    await expect(select).toHaveValue("");
    await expect(select.locator("option")).toHaveCount(4);
    await select.selectOption({ label: "Done" });
    await expect(page.locator(".output")).toContainText("Current: Done");
    await expect(select).toHaveValue("Done");
  },
  separator: async (page) => {
    await expect(page.getByRole("separator")).not.toHaveCount(0);
    await expect(page.getByRole("separator").first()).not.toHaveAttribute(
      "aria-orientation",
    );
    await expect(
      page.locator('hr[aria-orientation="vertical"]'),
    ).not.toHaveCount(0);
  },
  sheet: async (page) => {
    const root = slot(page, "sheet");
    const trigger = root.locator(":scope > button:first-child");
    const content = root.locator(":scope > dialog");
    await expect(trigger).toBeVisible();
    await expect(content).toBeHidden();
    await trigger.click();
    await expect(content).toHaveAttribute("open", "");
    await expect(content).toHaveAttribute("side", "right");
    expect(await content.getAttribute("role")).toBeNull();
    await page.getByRole("button", { name: "Close", exact: true }).click();
    await expect(content).toBeHidden();
    await expect(trigger).toBeFocused();
  },
  sidebar: async (page) => {
    const sidebar = page.locator("#app-sidebar");
    await expect(sidebar.locator("..")).toBeVisible();
    await expect(sidebar.locator(":scope > header")).toBeVisible();
    await expect(sidebar.locator(":scope > nav")).toBeVisible();
    await expect(sidebar.locator(":scope > footer")).toBeVisible();
    await expect(sidebar.locator("+ main")).toBeVisible();
    await expect(sidebar.locator(":scope > hr")).toBeVisible();
    const filter = page.getByRole("textbox", { name: "Filter navigation" });
    await filter.fill("projects");
    await expect(filter).toHaveValue("projects");
    await expect(page.locator(".sidebar-query-output")).toContainText(
      "Filter: projects",
    );
    await page.getByRole("button", { name: "Close Sidebar" }).click();
    await expect(sidebar).toHaveAttribute("collapsed", "");
    await expect(sidebar).toHaveAttribute("aria-hidden", "false");
    await page.getByRole("button", { name: "Open Sidebar" }).click();
    await expect(sidebar).not.toHaveAttribute("collapsed", "");
  },
  skeleton: async (page) => {
    await expect(slot(page, "skeleton")).not.toHaveCount(0);
    await expect(slot(page, "skeleton").first()).toHaveCSS(
      "animation-name",
      /angularcss-skeleton-pulse/,
    );
  },
  range: async (page) => {
    const slider = page.locator("#volume");
    await expect(slider).not.toHaveAttribute("ng-range-slider");
    await slider.fill("42");
    await expect(page.locator('output[for="volume"]')).toHaveText("42");
    await expect(slider).toHaveValue("42");
  },
  "range-slider": async (page) => {
    const root = page.getByLabel("Price range");
    await expect(root).toHaveCSS("--range-start", "25%");
    await page.getByLabel("Minimum price").fill("40");
    await expect(root).toHaveCSS("--range-start", "40%");
    await expect(page.locator("output")).toHaveText("40-75");
  },
  toast: async (page) => {
    const toasts = page.locator("[ng-toast] > article");
    await expect(toasts).toHaveCount(0);
    await page.getByRole("button", { name: "Show Toast" }).click();
    await expect(toasts).toHaveCount(1);
    await expect(toasts).toHaveAttribute("role", "status");
    await expect(page.getByRole("button", { name: "Undo" })).toHaveAttribute(
      "type",
      "button",
    );
  },
  spinner: async (page) => {
    await expect(slot(page, "spinner").first()).toHaveAccessibleName(
      /loading/i,
    );
    await expect(slot(page, "spinner").first()).toHaveCSS(
      "animation-name",
      /angularcss-spinner-spin/,
    );
  },
  switch: async (page) => {
    const control = page.locator("#airplane-mode");
    await control.check();
    await expect(page.locator('output[aria-live="polite"]')).toContainText(
      "Mode enabled: true",
    );
    await expect(control).toHaveRole("switch");
  },
  table: async (page) => {
    await expect(page.getByRole("table")).toBeVisible();
    await expect(page.getByRole("row")).not.toHaveCount(0);
    await expect(page.locator("table caption")).toBeVisible();
  },
  tabs: async (page) => {
    const analytics = page.getByRole("tab", { name: "Analytics" });
    await analytics.click();
    await expect(analytics).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("tabpanel")).toContainText("Page views are up");
  },
  textarea: async (page) => {
    const textarea = page.locator("#docs-textarea-message");
    await textarea.fill("Accessible components");
    await expect(page.locator(".output")).toContainText(
      "Message: Accessible components",
    );
  },
  toggle: async (page) => {
    const bold = page.getByRole("button", { name: "Bold" });
    await bold.click();
    await expect(bold).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(".output")).toContainText("Bold: on");
  },
  "toggle-group": async (page) => {
    const left = page.getByRole("radio", { name: "Left" });
    await left.check();
    await expect(left).toBeChecked();
    await expect(page.locator(".output")).toContainText("Alignment: left");
  },
  "application-shell": async (page) => {
    const shell = page.locator(".application-shell");
    const sidebar = page.locator("[ng-sidebar]");
    await expect(shell).toHaveCSS("display", "grid");
    await expect(
      page.getByRole("complementary", { name: "Primary navigation" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Toggle navigation" }).click();
    await expect(sidebar).toHaveAttribute("collapsed", "");
  },
  "data-table": async (page) => {
    const rows = page.locator("tbody tr").filter({ visible: true });
    const search = page.getByRole("searchbox", { name: "Search orders" });
    await expect(rows).toHaveCount(2);
    await search.fill("Grace");
    await expect(rows).toHaveCount(1);
    await expect(rows).toContainText("Grace Hopper");
    await search.fill("Missing");
    await expect(rows).toHaveCount(0);
    await expect(page.locator(".data-table > figure > p")).toBeVisible();
    await expect(page.locator(".data-table > footer output")).toHaveText(
      "0 orders",
    );
  },
  "date-picker": async (page) => {
    const trigger = page.locator("#delivery-date");
    await trigger.click();
    await expect(page.locator("#delivery-date-calendar")).toBeVisible();
    await page
      .locator('[ng-calendar] > div button[value="2026-09-12"]')
      .click();
    await expect(trigger).toContainText("2026-09-12");
  },
  "description-list": async (page) => {
    const list = page.locator("dl:has(> div > dt):has(> div > dd)");
    await expect(list.locator("dt")).toHaveCount(4);
    await expect(list.locator("dd")).toHaveCount(4);
  },
  "file-upload": async (page) => {
    const input = page.locator('input[type="file"]');
    await input.setInputFiles({
      buffer: Buffer.from("contract"),
      mimeType: "application/pdf",
      name: "contract.pdf",
    });
    expect(
      await input.evaluate(
        (control: HTMLInputElement) => control.files?.length,
      ),
    ).toBe(1);
    await expect(page.locator("progress")).toHaveAttribute("value", "72");
  },
  "filter-bar": async (page) => {
    const search = page.getByRole("searchbox", { name: "Search" });
    await search.fill("Ada");
    await page.getByRole("button", { name: "Reset" }).click();
    await expect(search).toHaveValue("");
  },
  "form-layout": async (page) => {
    await page.getByRole("button", { name: "Create customer" }).click();
    await expect(page.getByRole("alert")).toBeVisible();
    await page.getByLabel("Customer name").fill("Analytical Engines Ltd");
    await page.getByRole("button", { name: "Create customer" }).click();
    await expect(page.getByText("Customer is ready to save.")).toBeVisible();
  },
  "master-detail": async (page) => {
    const handle = page.getByRole("separator", {
      name: "Resize customer list",
    });
    await expect(handle).toHaveAttribute("tabindex", "0");
    await expect(handle).toHaveAttribute("aria-valuenow", "0.75");
    await expect(
      page.getByRole("navigation", { name: "Customers" }),
    ).toBeVisible();
  },
  stepper: async (page) => {
    await expect(page.locator('nav:has([aria-current="step"]) li')).toHaveCount(
      4,
    );
    await expect(page.locator('[aria-current="step"]')).toHaveText("Contacts");
  },
  toolbar: async (page) => {
    const toolbar = page.getByRole("toolbar", { name: "Document actions" });
    const undo = toolbar.getByRole("button", { name: "Undo" });
    const copy = toolbar.getByRole("button", { name: "Copy" });
    await undo.focus();
    await undo.press("ArrowRight");
    await expect(copy).toBeFocused();
  },
  tree: async (page) => {
    const tree = page.getByRole("tree", { name: "Organization" });
    const operations = tree.locator('[data-value="operations"]');
    await expect(tree.locator('[role="treeitem"]')).toHaveCount(7);
    await operations.focus();
    await operations.press("ArrowDown");
    await expect(tree.locator('[data-value="fulfillment"]')).toBeFocused();
  },
  "validation-summary": async (page) => {
    const summary = page.getByRole("alert");
    await expect(summary.locator("a")).toHaveCount(2);
    await summary.getByRole("link", { name: "Enter a customer name." }).click();
    await expect(page).toHaveURL(/#customer-name$/);
  },
  tooltip: async (page) => {
    const trigger = page.getByRole("button", { name: "Hover" });
    const content = page.locator("[ng-tooltip] > :last-child");
    await trigger.focus();
    await expect(content).toBeVisible();
    await trigger.press("Escape");
    await expect(content).toBeHidden();
  },
};

test("published component contracts cover every canonical component", () => {
  expect(Object.keys(contracts).sort()).toEqual(componentNames);
});

for (const component of componentNames) {
  test(`${component} published example satisfies its functional contract`, async ({
    page,
  }) => {
    const errors: string[] = [];
    const sourceRequests: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("request", (request) => {
      const path = new URL(request.url()).pathname;
      if (path.startsWith("/src/")) sourceRequests.push(path);
    });
    await page.goto(`/docs/static/examples/components/${component}.html`);
    await assertBuiltArtifactContract(page, sourceRequests);
    await contracts[component](page);
    await assertVisualContract(page, component);
    for (const width of [390, 320]) {
      await page.setViewportSize({ height: 4000, width });
      await page.goto(`/docs/static/examples/components/${component}.html`);
      if (component === "toast") {
        await page.getByRole("button", { name: "Show Toast" }).click();
      }
      await assertVisualContract(page, component);
    }
    expect(errors).toEqual([]);
  });
}
