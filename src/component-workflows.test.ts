import { expect, test } from "@playwright/test";

test("button workflows preserve reference variants, sizes, loading, and RTL", async ({
  page,
}) => {
  await page.setViewportSize({ height: 520, width: 900 });
  await page.goto("/docs/static/examples/components/button-workflows.html");

  const sizePairs = [
    ["Extra Small", "Submit extra small", 24],
    ["Small", "Submit small", 32],
    ["Default", "Submit default", 36],
    ["Large", "Submit large", 40],
  ] as const;
  for (const [textName, iconName, expectedHeight] of sizePairs) {
    const textBox = await page
      .getByRole("button", { name: textName, exact: true })
      .boundingBox();
    const iconBox = await page
      .getByRole("button", { name: iconName, exact: true })
      .boundingBox();
    expect(textBox).not.toBeNull();
    expect(iconBox).not.toBeNull();
    expect(textBox!.height).toBeCloseTo(expectedHeight, 0);
    expect(iconBox).toMatchObject({
      height: expectedHeight,
      width: expectedHeight,
    });
  }

  await expect(page.getByRole("button", { name: "Generating" })).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "Downloading" }),
  ).toBeDisabled();
  await expect(
    page.locator('[aria-label="Loading buttons"] .spinner'),
  ).toHaveCount(2);
  const statusRow = page.getByLabel("Status buttons");
  const statusButtons = statusRow.getByRole("button");
  await expect(statusButtons).toHaveCount(3);
  for (const variant of ["info", "success", "warning"]) {
    await expect(statusRow.locator(`button[variant="${variant}"]`)).toHaveCount(
      1,
    );
  }
  await expect(page.getByLabel("RTL buttons")).toHaveAttribute("dir", "rtl");
  await expect(page.getByRole("button", { name: "Get Started" })).toHaveCSS(
    "border-radius",
    "9999px",
  );
  const login = page.getByRole("link", { name: "Login" });
  await expect(login).toHaveAttribute("href", "#login");
  await expect(login).toHaveAttribute("variant", "secondary");
  expect((await login.boundingBox())!.height).toBeCloseTo(32, 0);
  await expect(page.locator(".workflow-stack")).toHaveScreenshot(
    "button-workflows-desktop.png",
    { animations: "disabled" },
  );
});

test("badge workflows preserve link, icon, loading, and RTL compositions", async ({
  page,
}) => {
  await page.setViewportSize({ height: 420, width: 900 });
  await page.goto("/docs/static/examples/components/badge-workflows.html");

  const badges = page.locator(".badge");
  await expect(badges).toHaveCount(19);
  expect(
    await badges.evaluateAll((items) =>
      items.map((item) => item.getBoundingClientRect().height),
    ),
  ).toEqual(Array(19).fill(20));
  const customColors = page.getByLabel("Badge custom colors").locator(".badge");
  const colors = await customColors.evaluateAll((items) =>
    items.map((item) => {
      const style = getComputedStyle(item);
      const tokenName = [...item.classList]
        .find((name) => name.startsWith("badge-color-"))
        ?.replace("badge-color-", "");
      if (!tokenName) throw new Error("Badge color token class is missing");
      const token =
        tokenName === "sky"
          ? "cyan"
          : tokenName === "purple"
            ? "violet"
            : tokenName;
      const probe = document.createElement("span");
      probe.style.background = `var(--${token}-2)`;
      probe.style.color = `var(--${token}-${token === "green" ? "12" : "11"})`;
      document.body.append(probe);
      const expected = getComputedStyle(probe);
      const result = {
        background: style.backgroundColor,
        color: style.color,
        expectedBackground: expected.backgroundColor,
        expectedColor: expected.color,
      };
      probe.remove();
      return result;
    }),
  );
  for (const color of colors) {
    expect(color.background).toBe(color.expectedBackground);
    expect(color.color).toBe(color.expectedColor);
  }
  await expect(page.getByRole("link", { name: "Open Link" })).toHaveAttribute(
    "href",
    "#link",
  );
  await expect(
    page.locator('[aria-label="Badges with loading status"] .spinner'),
  ).toHaveCount(2);
  await expect(page.getByLabel("RTL badges")).toHaveAttribute("dir", "rtl");
  await expect(page.locator(".workflow-stack")).toHaveScreenshot(
    "badge-workflows-desktop.png",
    { animations: "disabled" },
  );
});

test("spinner workflows retain size inside composed components", async ({
  page,
}) => {
  await page.setViewportSize({ height: 680, width: 900 });
  await page.goto("/docs/static/examples/components/spinner-workflows.html");

  const sizeRow = page.getByLabel("Spinner sizes").locator(".spinner");
  expect(
    await sizeRow.evaluateAll((items) =>
      items.map((item) => getComputedStyle(item).width),
    ),
  ).toEqual(["12px", "16px", "24px", "32px"]);

  const loadingButtons = page.getByLabel("Spinner buttons").getByRole("button");
  await expect(loadingButtons).toHaveCount(3);
  for (const button of await loadingButtons.all()) {
    await expect(button).toBeDisabled();
  }

  await expect(page.locator(".spinner-empty-demo .spinner")).toHaveCSS(
    "width",
    "16px",
  );
  await expect(
    page.getByLabel("Spinner input groups").locator(".input-group"),
  ).toHaveCount(2);
  await expect(page.locator(".spinner-rtl-demo")).toHaveAttribute("dir", "rtl");
  await expect(page.locator(".spinner")).toHaveCount(14);
  expect(
    await page.locator(".spinner-empty-demo").getAttribute("role"),
  ).toBeNull();
  await expect(page.locator(".spinner-empty-demo")).toHaveAttribute(
    "aria-live",
    "polite",
  );
  await expect(page.locator(".spinner-workflows")).toHaveScreenshot(
    "spinner-workflows-desktop.png",
    { animations: "disabled" },
  );
});

test("accordion state workflows preserve basic, disabled, and multiple behavior", async ({
  page,
}) => {
  await page.setViewportSize({ height: 760, width: 900 });
  await page.goto(
    "/docs/static/examples/components/accordion-state-workflows.html",
  );

  const basicItem = page
    .locator("section[aria-label]:has(> details) > details")
    .first();
  const basicTrigger = basicItem.locator("summary");
  await expect(basicItem).toHaveAttribute("open", "");
  await basicTrigger.click();
  await expect(basicItem).not.toHaveAttribute("open", "");

  const disabledItem = page.locator("details", {
    has: page.getByText("Premium feature information", { exact: true }),
  });
  await expect(disabledItem).toHaveAttribute("inert", "");
  await disabledItem.locator("summary").click({ force: true });
  await expect(disabledItem).not.toHaveAttribute("open", "");

  const notificationItem = page.locator("details", {
    has: page.getByText("Notification Settings", { exact: true }),
  });
  const privacyItem = page.locator("details", {
    has: page.getByText("Privacy & Security", { exact: true }),
  });
  const privacyTrigger = privacyItem.locator("summary");
  await expect(notificationItem).toHaveAttribute("open", "");
  await privacyTrigger.click();
  await expect(notificationItem).toHaveAttribute("open", "");
  await expect(privacyItem).toHaveAttribute("open", "");

  await basicTrigger.click();
  await expect(basicItem).toHaveAttribute("open", "");
  await page.mouse.move(890, 750);

  await expect(page.locator(".accordion-workflow-grid")).toHaveScreenshot(
    "accordion-state-workflows-desktop.png",
    { animations: "disabled" },
  );
});

test("accordion layout workflows preserve borders, card composition, and RTL", async ({
  page,
}) => {
  await page.setViewportSize({ height: 780, width: 900 });
  await page.goto(
    "/docs/static/examples/components/accordion-layout-workflows.html",
  );

  await expect(page.locator(".accordion-bordered")).toHaveCSS(
    "border-top-width",
    "1px",
  );
  const { borderColor, tokenColor } = await page
    .locator(".accordion-bordered")
    .evaluate((element) => {
      const probe = document.createElement("span");
      probe.style.color = "var(--border)";
      document.body.append(probe);
      const borderColor = getComputedStyle(element).borderTopColor;
      const tokenColor = getComputedStyle(probe).color;
      probe.remove();
      return { borderColor, tokenColor };
    });
  expect(borderColor).toBe(tokenColor);
  await expect(page.locator(".card")).toBeVisible();

  const rtlSection = page.locator("[dir='rtl']");
  await expect(rtlSection).toHaveAttribute("lang", "ar");
  const rtlItem = rtlSection.locator("details", {
    has: page.getByText("كيف يمكنني إعادة تعيين كلمة المرور؟", {
      exact: true,
    }),
  });
  const rtlTrigger = rtlItem.locator("summary");
  const triggerBox = await rtlTrigger.boundingBox();
  expect(triggerBox).not.toBeNull();
  await expect(rtlTrigger).toHaveCSS("direction", "rtl");
  await expect(rtlTrigger).toHaveCSS("text-align", "start");

  const secondRtlItem = rtlSection.locator("details", {
    has: page.getByText("هل يمكنني تغيير خطة الاشتراك الخاصة بي؟", {
      exact: true,
    }),
  });
  const secondRtlTrigger = secondRtlItem.locator("summary");
  await secondRtlTrigger.click();
  await expect(rtlItem).not.toHaveAttribute("open", "");
  await expect(secondRtlItem).toHaveAttribute("open", "");

  await rtlTrigger.click();
  await expect(rtlItem).toHaveAttribute("open", "");
  await expect(secondRtlItem).not.toHaveAttribute("open", "");
  await page.mouse.move(890, 770);

  await expect(page.locator(".accordion-workflow-grid")).toHaveScreenshot(
    "accordion-layout-workflows-desktop.png",
    { animations: "disabled" },
  );
});

test("dropdown workflows preserve dynamic, model, submenu, icon, disabled, and RTL states", async ({
  page,
}) => {
  await page.setViewportSize({ height: 900, width: 900 });
  await page.goto(
    "/docs/static/examples/components/dropdown-menu-workflows.html",
  );

  await page.getByRole("button", { name: "Add archive item" }).click();
  await expect(page.locator("#dropdown-archive-item")).toHaveAttribute(
    "role",
    "menuitem",
  );

  const preferences = page.locator("#dropdown-preferences-title").locator("..");
  await preferences.getByRole("button", { name: "Notifications" }).click();
  await expect(preferences.getByRole("menu")).toBeVisible();

  const rtlRoot = page.getByLabel("Arabic account menu");
  await expect(rtlRoot).toHaveCSS("direction", "rtl");
  await page.mouse.move(890, 890);
  await expect(page.locator(".dropdown-workflow-grid")).toHaveScreenshot(
    "dropdown-workflows-desktop.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 1380, width: 390 });
  await page.reload();
  const actions = page.locator("#dropdown-actions-title").locator("..");
  await actions.getByRole("button", { name: "Actions" }).click();
  const subTrigger = actions.getByRole("menuitem", { name: "Invite users" });
  await subTrigger.focus();
  await subTrigger.press("ArrowRight");
  await expect(subTrigger.locator("..").locator(":scope > menu")).toBeVisible();
  await page.mouse.move(380, 1370);
  await expect(page.locator(".dropdown-workflow-grid")).toHaveScreenshot(
    "dropdown-workflows-mobile.png",
    { animations: "disabled" },
  );
});

test("hover card workflows preserve physical sides, mobile framing, and RTL", async ({
  page,
}) => {
  await page.setViewportSize({ height: 680, width: 900 });
  await page.goto("/docs/static/examples/components/hover-card-workflows.html");
  await page.getByRole("button", { name: "Left", exact: true }).hover();
  await expect(
    page
      .getByRole("button", { name: "Left", exact: true })
      .locator("..")
      .locator(":scope > aside"),
  ).toBeVisible();
  await expect(page.locator(".hover-card-workflow")).toHaveScreenshot(
    "hover-card-sides-desktop.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 1040, width: 390 });
  await page.reload();
  await page.getByRole("button", { name: "Bottom", exact: true }).hover();
  await expect(
    page
      .getByRole("button", { name: "Bottom", exact: true })
      .locator("..")
      .locator(":scope > aside"),
  ).toBeVisible();
  await expect(page.locator(".hover-card-workflow")).toHaveScreenshot(
    "hover-card-sides-mobile.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 680, width: 900 });
  await page.goto("/docs/static/examples/components/hover-card-rtl.html");
  await page.getByRole("button", { name: "أعلى", exact: true }).hover();
  const rtlContent = page
    .getByRole("button", { name: "أعلى", exact: true })
    .locator("..")
    .locator(":scope > aside");
  await expect(rtlContent).toBeVisible();
  await expect(rtlContent).toHaveCSS("direction", "rtl");
  await expect(page.locator(".hover-card-workflow")).toHaveScreenshot(
    "hover-card-rtl-desktop.png",
    { animations: "disabled" },
  );
});

test("popover examples preserve Nova surfaces, alignment, mobile framing, and RTL", async ({
  page,
}) => {
  await page.setViewportSize({ height: 560, width: 900 });
  await page.goto("/docs/static/examples/components/popover.html");
  await page.getByRole("button", { name: "Open popover" }).click();
  await expect(
    page.locator('body[data-example~="popover-demo"] > .visual-example'),
  ).toHaveScreenshot("popover-demo-open-desktop.png", {
    animations: "disabled",
  });

  await page.setViewportSize({ height: 760, width: 900 });
  await page.goto("/docs/static/examples/components/popover-workflows.html");
  await page.getByRole("button", { name: "Edit dimensions" }).click();
  await expect(page.locator(".popover-workflows")).toHaveScreenshot(
    "popover-workflows-desktop.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 1200, width: 390 });
  await page.reload();
  await page.getByRole("button", { name: "Center", exact: true }).click();
  await expect(page.locator(".popover-workflows")).toHaveScreenshot(
    "popover-workflows-mobile.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 560, width: 900 });
  await page.goto("/docs/static/examples/components/popover-rtl.html");
  await page.getByRole("button", { name: "أعلى", exact: true }).click();
  const rtlContent = page
    .getByRole("button", { name: "أعلى", exact: true })
    .locator("..")
    .locator(":scope > [popover]");
  await expect(rtlContent).toHaveCSS("direction", "rtl");
  await expect(page.locator(".popover-rtl-workflow")).toHaveScreenshot(
    "popover-rtl-desktop.png",
    { animations: "disabled" },
  );
});

test("tooltip examples preserve Nova arrows, disabled wrappers, mobile sides, and RTL", async ({
  page,
}) => {
  await page.setViewportSize({ height: 360, width: 900 });
  await page.goto("/docs/static/examples/components/tooltip.html");
  await page.getByRole("button", { name: "Hover" }).hover();
  await expect(
    page.locator('body[data-example~="tooltip-demo"] > .visual-example'),
  ).toHaveScreenshot("tooltip-demo-open-desktop.png", {
    animations: "disabled",
  });

  await page.setViewportSize({ height: 680, width: 900 });
  await page.goto("/docs/static/examples/components/tooltip-workflows.html");
  await page.getByRole("button", { name: "Save changes" }).focus();
  await expect(page.locator(".tooltip-workflows")).toHaveScreenshot(
    "tooltip-workflows-desktop.png",
    { animations: "disabled" },
  );

  const disabled = page.getByRole("button", { name: "Disabled" });
  await disabled.locator("..").hover();
  await expect(
    page.locator(".tooltip-workflow-section").nth(1),
  ).toHaveScreenshot("tooltip-disabled-open-desktop.png", {
    animations: "disabled",
  });

  await page.setViewportSize({ height: 1000, width: 390 });
  await page.reload();
  await page.getByRole("button", { name: "Bottom", exact: true }).hover();
  await expect(page.locator(".tooltip-workflows")).toHaveScreenshot(
    "tooltip-workflows-mobile.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 360, width: 900 });
  await page.goto("/docs/static/examples/components/tooltip-rtl.html");
  await page.getByRole("button", { name: "أعلى", exact: true }).hover();
  await expect(page.locator(".tooltip-rtl-workflow")).toHaveScreenshot(
    "tooltip-rtl-desktop.png",
    { animations: "disabled" },
  );
});

test("menubar examples preserve compact surfaces, state items, submenus, mobile framing, and RTL", async ({
  page,
}) => {
  await page.setViewportSize({ height: 420, width: 900 });
  await page.goto("/docs/static/examples/components/menubar.html");
  await page.getByRole("menuitem", { name: "File", exact: true }).click();
  await expect(
    page.locator('body[data-example~="menubar-demo"] > .visual-example'),
  ).toHaveScreenshot("menubar-demo-open-desktop.png", {
    animations: "disabled",
  });

  await page.setViewportSize({ height: 1100, width: 900 });
  await page.goto("/docs/static/examples/components/menubar-workflows.html");
  await page
    .getByRole("menubar", { name: "View preferences" })
    .getByRole("menuitem", { name: "View" })
    .click();
  await expect(page.locator(".menubar-workflows")).toHaveScreenshot(
    "menubar-workflows-desktop.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 2200, width: 390 });
  await page.reload();
  const commands = page.getByRole("menubar", { name: "Editing commands" });
  await commands.getByRole("menuitem", { name: "File" }).click();
  const share = commands.getByRole("menuitem", { name: "Share" });
  await share.focus();
  await share.press("ArrowRight");
  await expect(page.locator(".menubar-workflows")).toHaveScreenshot(
    "menubar-workflows-mobile.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 520, width: 900 });
  await page.goto("/docs/static/examples/components/menubar-rtl.html");
  await page.getByRole("menuitem", { name: "ملف", exact: true }).click();
  await expect(page.locator(".menubar-rtl-workflow")).toHaveScreenshot(
    "menubar-rtl-desktop.png",
    { animations: "disabled" },
  );
});

test("navigation menu examples preserve native navigation, flyouts, dynamic state, mobile framing, and RTL", async ({
  page,
}) => {
  await page.setViewportSize({ height: 560, width: 900 });
  await page.goto("/docs/static/examples/components/navigation-menu.html");
  await page.getByRole("button", { name: "Getting started" }).click();
  await expect(
    page.locator('body[data-example~="navigation-menu-demo"] > main'),
  ).toHaveScreenshot("navigation-menu-demo-open-desktop.png", {
    animations: "disabled",
  });

  await page.setViewportSize({ height: 760, width: 900 });
  await page.goto(
    "/docs/static/examples/components/navigation-menu-workflows.html",
  );
  await page.getByRole("button", { name: "Toggle controlled panel" }).click();
  await page.getByRole("button", { name: "Add company menu" }).click();
  await page.getByRole("button", { name: "Add careers link" }).click();
  await expect(page.locator(".navigation-menu-workflows")).toHaveScreenshot(
    "navigation-menu-workflows-desktop.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 1100, width: 390 });
  await page.reload();
  await page.getByRole("button", { name: "Product" }).click();
  await expect(page.locator(".navigation-menu-workflows")).toHaveScreenshot(
    "navigation-menu-workflows-mobile.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 560, width: 900 });
  await page.goto("/docs/static/examples/components/navigation-menu-rtl.html");
  await page.getByRole("button", { name: "البدء" }).click();
  await expect(
    page.locator('body[data-example~="navigation-menu-rtl"] > main'),
  ).toHaveScreenshot("navigation-menu-rtl-desktop.png", {
    animations: "disabled",
  });
});

test("pagination examples preserve Nova sizing, native links, AngularTS state, compact composition, mobile framing, and RTL", async ({
  page,
}) => {
  await page.setViewportSize({ height: 240, width: 900 });
  await page.goto("/docs/static/examples/components/pagination.html");
  await expect(
    page.locator('body[data-example~="pagination-demo"] > .visual-example'),
  ).toHaveScreenshot("pagination-demo-desktop.png", { animations: "disabled" });

  await page.setViewportSize({ height: 420, width: 900 });
  await page.goto("/docs/static/examples/components/pagination-workflows.html");
  await page.getByRole("button", { name: "Add page 4" }).click();
  await page.getByRole("button", { name: "Disable next" }).click();
  await page
    .getByRole("combobox", { name: "Rows per page" })
    .selectOption("50");
  await expect(page.locator("main")).toHaveScreenshot(
    "pagination-workflows-desktop.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 720, width: 390 });
  await page.reload();
  await expect(page.locator("main")).toHaveScreenshot(
    "pagination-workflows-mobile.png",
    { animations: "disabled" },
  );
});

test("progress examples preserve Nova geometry, timed and controlled state, labels, mobile framing, and RTL", async ({
  page,
}) => {
  await page.setViewportSize({ height: 260, width: 900 });
  await page.goto("/docs/static/examples/components/progress.html");
  await expect(page.locator(".progress-demo-timed")).toHaveAttribute(
    "value",
    "66",
  );
  await page.waitForTimeout(200);
  await expect(
    page.locator('body[data-example~="progress-demo"] > .visual-example'),
  ).toHaveScreenshot("progress-demo-desktop.png", { animations: "disabled" });

  await page.setViewportSize({ height: 420, width: 900 });
  await page.goto("/docs/static/examples/components/progress-workflows.html");
  await page.getByRole("slider", { name: "Progress value" }).fill("83");
  await expect(
    page.getByRole("progressbar", { name: "Controlled" }),
  ).toHaveAttribute("value", "83");
  await page.waitForTimeout(200);
  await expect(page.locator(".progress-workflows")).toHaveScreenshot(
    "progress-workflows-desktop.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 520, width: 390 });
  await page.reload();
  await expect(page.locator(".progress-workflows")).toHaveScreenshot(
    "progress-workflows-mobile.png",
    { animations: "disabled" },
  );
});

test("resizable examples preserve Nova nested, visible-handle, vertical, RTL, and mobile layouts", async ({
  page,
}) => {
  await page.setViewportSize({ height: 260, width: 900 });
  await page.goto("/docs/static/examples/components/resizable.html");
  await expect(
    page.locator('body[data-example~="resizable-demo"] > .visual-example'),
  ).toHaveScreenshot("resizable-demo-desktop.png", { animations: "disabled" });

  await page.setViewportSize({ height: 500, width: 900 });
  await page.goto("/docs/static/examples/components/resizable-workflows.html");
  await expect(page.locator(".resizable-workflows")).toHaveScreenshot(
    "resizable-workflows-desktop.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 760, width: 390 });
  await page.reload();
  await expect(page.locator(".resizable-workflows")).toHaveScreenshot(
    "resizable-workflows-mobile.png",
    { animations: "disabled" },
  );
});

test("combobox examples preserve Nova search, grouped, multiple, state, mobile, and RTL visuals", async ({
  page,
}) => {
  await page.setViewportSize({ height: 420, width: 900 });
  await page.goto("/docs/static/examples/components/combobox.html");
  await page.getByRole("combobox", { name: "Framework", exact: true }).focus();
  await expect(
    page.locator('body[data-example~="combobox-demo"] > .visual-example'),
  ).toHaveScreenshot("combobox-demo-open-desktop.png", {
    animations: "disabled",
  });

  await page.setViewportSize({ height: 980, width: 900 });
  await page.goto("/docs/static/examples/components/combobox-workflows.html");
  await page.getByRole("combobox", { name: "Grouped timezone" }).fill("Tokyo");
  await expect(page.locator(".combobox-workflows")).toHaveScreenshot(
    "combobox-workflows-desktop.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 1500, width: 390 });
  await page.reload();
  await page.getByRole("combobox", { name: "Clearable framework" }).focus();
  await expect(page.locator(".combobox-workflows")).toHaveScreenshot(
    "combobox-workflows-mobile.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 600, width: 1100 });
  await page.goto(
    "/docs/static/examples/components/combobox-compositions.html",
  );
  await page
    .getByRole("combobox", { name: "Country with details" })
    .fill("Japan");
  await expect(page.locator(".combobox-compositions")).toHaveScreenshot(
    "combobox-compositions-desktop.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 1200, width: 390 });
  await page.reload();
  await page.getByRole("combobox", { name: "Frameworks" }).focus();
  await expect(page.locator(".combobox-compositions")).toHaveScreenshot(
    "combobox-compositions-mobile.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 440, width: 500 });
  await page.goto(
    "/docs/static/examples/components/combobox-compositions.html",
  );
  const rtl = page.locator("#rtl-combobox");
  await rtl.getByRole("combobox").focus();
  await rtl.scrollIntoViewIfNeeded();
  await expect(page).toHaveScreenshot("combobox-rtl-open-desktop.png", {
    animations: "disabled",
  });

  await page.setViewportSize({ height: 480, width: 500 });
  await page.goto(
    "/docs/static/examples/components/combobox-state-workflows.html",
  );
  await page.getByRole("button", { name: "Toggle popup" }).click();
  await expect(page.locator(".combobox-state-workflows")).toHaveScreenshot(
    "combobox-state-workflows-desktop.png",
    { animations: "disabled" },
  );
});

test("command examples preserve Nova standalone, dialog, scrollable, mobile, and RTL visuals", async ({
  page,
}) => {
  await page.setViewportSize({ height: 520, width: 900 });
  await page.goto("/docs/static/examples/components/command.html");
  await expect(
    page.locator('body[data-example~="command-demo"] > .visual-example'),
  ).toHaveScreenshot("command-demo-desktop.png", { animations: "disabled" });

  await page.setViewportSize({ height: 980, width: 1000 });
  await page.goto(
    "/docs/static/examples/components/command-dialog-workflows.html",
  );
  await page.getByRole("button", { name: "Open Grouped Menu" }).click();
  await expect(
    page.getByRole("dialog", { name: "Grouped Command Palette" }),
  ).toBeVisible();
  await expect(page).toHaveScreenshot("command-dialog-workflows-desktop.png", {
    animations: "disabled",
  });

  await page.setViewportSize({ height: 1000, width: 390 });
  await page.reload();
  await page.getByRole("button", { name: "Open Menu", exact: true }).click();
  await expect(
    page.getByRole("dialog", { name: "Command Palette" }),
  ).toBeVisible();
  await expect(page).toHaveScreenshot("command-dialog-workflows-mobile.png", {
    animations: "disabled",
  });

  await page.setViewportSize({ height: 680, width: 900 });
  await page.goto("/docs/static/examples/components/command-scrollable.html");
  await page.getByRole("button", { name: "Open Menu" }).click();
  await expect(page.locator(".command-scrollable-demo")).toHaveScreenshot(
    "command-scrollable-desktop.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 520, width: 900 });
  await page.goto("/docs/static/examples/components/command-rtl.html");
  await expect(
    page.locator('body[data-example~="command-rtl"] > .visual-example'),
  ).toHaveScreenshot("command-rtl-desktop.png", { animations: "disabled" });
});

test("context menu examples preserve pointer, state, side, mobile, and RTL visuals", async ({
  page,
}) => {
  await page.setViewportSize({ height: 560, width: 900 });
  await page.goto("/docs/static/examples/components/context-menu.html");
  await page
    .locator("[ng-context-menu] > :first-child")
    .click({ button: "right", position: { x: 160, y: 40 } });
  await expect(
    page.locator('body[data-example~="context-menu-demo"] > .visual-example'),
  ).toHaveScreenshot("context-menu-demo-desktop.png", {
    animations: "disabled",
  });

  await page.setViewportSize({ height: 920, width: 1000 });
  await page.goto(
    "/docs/static/examples/components/context-menu-workflows.html",
  );
  await page
    .getByRole("heading", { name: "Icons and destructive action" })
    .locator("..")
    .locator("[ng-context-menu] > :first-child")
    .click({ button: "right" });
  await expect(page.locator(".context-menu-workflow-grid")).toHaveScreenshot(
    "context-menu-workflows-desktop.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 760, width: 900 });
  await page.goto("/docs/static/examples/components/context-menu-sides.html");
  await page
    .locator("[ng-context-menu] > :first-child")
    .nth(2)
    .click({ button: "right" });
  await expect(page.locator(".context-menu-sides")).toHaveScreenshot(
    "context-menu-sides-desktop.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 500, width: 390 });
  await page.goto("/docs/static/examples/components/context-menu.html");
  await page
    .locator("[ng-context-menu] > :first-child")
    .click({ button: "right" });
  await expect(
    page.locator('body[data-example~="context-menu-demo"] > .visual-example'),
  ).toHaveScreenshot("context-menu-demo-mobile.png", {
    animations: "disabled",
  });

  await page.setViewportSize({ height: 560, width: 900 });
  await page.goto("/docs/static/examples/components/context-menu-rtl.html");
  await page
    .locator("[ng-context-menu] > :first-child")
    .first()
    .click({ button: "right" });
  await expect(
    page.locator('body[data-example~="context-menu-rtl"] > .visual-example'),
  ).toHaveScreenshot("context-menu-rtl-desktop.png", {
    animations: "disabled",
  });
});

test("dialog examples preserve modal, close, scroll, mobile, and RTL visuals", async ({
  page,
}) => {
  await page.setViewportSize({ height: 560, width: 900 });
  await page.goto("/docs/static/examples/components/dialog.html");
  await page.getByRole("button", { name: "Edit profile" }).click();
  await expect(page).toHaveScreenshot("dialog-demo-desktop.png", {
    animations: "disabled",
  });

  await page.setViewportSize({ height: 620, width: 390 });
  await page.reload();
  await page.getByRole("button", { name: "Edit profile" }).click();
  await expect(page).toHaveScreenshot("dialog-demo-mobile.png", {
    animations: "disabled",
  });

  await page.setViewportSize({ height: 560, width: 900 });
  await page.goto(
    "/docs/static/examples/components/dialog-close-workflows.html",
  );
  await page.getByRole("button", { name: "Share" }).click();
  await expect(page).toHaveScreenshot("dialog-custom-close-desktop.png", {
    animations: "disabled",
  });
  await page
    .locator("#share-dialog [command='close']")
    .filter({ hasText: "Close" })
    .first()
    .click();
  await page.getByRole("button", { name: "Open dialog" }).click();
  await expect(page).toHaveScreenshot("dialog-no-close-desktop.png", {
    animations: "disabled",
  });

  await page.setViewportSize({ height: 520, width: 900 });
  await page.goto(
    "/docs/static/examples/components/dialog-scroll-workflows.html",
  );
  await page.getByRole("button", { name: "Review notes" }).click();
  await page
    .locator("#sticky-dialog > dialog > section")
    .evaluate((element) => {
      element.scrollTop = element.scrollHeight / 2;
    });
  await expect(page).toHaveScreenshot("dialog-sticky-footer-desktop.png", {
    animations: "disabled",
  });

  await page.setViewportSize({ height: 560, width: 900 });
  await page.goto("/docs/static/examples/components/dialog-rtl.html");
  await page.getByRole("button", { name: "تعديل الملف الشخصي" }).click();
  await expect(page).toHaveScreenshot("dialog-rtl-desktop.png", {
    animations: "disabled",
  });
});

test("drawer examples preserve goal, side, scroll, responsive, and RTL visuals", async ({
  page,
}) => {
  await page.setViewportSize({ height: 620, width: 900 });
  await page.goto("/docs/static/examples/components/drawer.html");
  await page.getByRole("button", { name: "Open Drawer" }).click();
  await expect(page).toHaveScreenshot("drawer-demo-desktop.png", {
    animations: "disabled",
  });

  await page.goto("/docs/static/examples/components/drawer-sides.html");
  await page.getByRole("button", { name: "Right" }).click();
  await expect(page).toHaveScreenshot("drawer-sides-right-desktop.png", {
    animations: "disabled",
  });

  await page.setViewportSize({ height: 560, width: 900 });
  await page.goto("/docs/static/examples/components/drawer-scrollable.html");
  await page.getByRole("button", { name: "Scrollable Content" }).click();
  await page
    .locator("#scrollable-drawer > dialog > section")
    .evaluate((element) => {
      element.scrollTop = element.scrollHeight / 2;
    });
  await expect(page).toHaveScreenshot("drawer-scrollable-desktop.png", {
    animations: "disabled",
  });

  await page.setViewportSize({ height: 620, width: 900 });
  await page.goto("/docs/static/examples/components/drawer-dialog.html");
  await page
    .locator(".drawer-dialog-desktop")
    .getByRole("button", { name: "Edit Profile" })
    .click();
  await expect(page).toHaveScreenshot("drawer-dialog-desktop.png", {
    animations: "disabled",
  });

  await page.setViewportSize({ height: 700, width: 390 });
  await page.reload();
  await page
    .locator(".drawer-dialog-mobile")
    .getByRole("button", { name: "Edit Profile" })
    .click();
  await expect(page).toHaveScreenshot("drawer-dialog-mobile.png", {
    animations: "disabled",
  });

  await page.setViewportSize({ height: 620, width: 900 });
  await page.goto("/docs/static/examples/components/drawer-rtl.html");
  await page.getByRole("button", { name: "فتح الدرج" }).click();
  await expect(page).toHaveScreenshot("drawer-rtl-desktop.png", {
    animations: "disabled",
  });
});

test("sheet examples preserve profile, close, side, mobile, and RTL visuals", async ({
  page,
}) => {
  await page.setViewportSize({ height: 620, width: 900 });
  await page.goto("/docs/static/examples/components/sheet.html");
  await page.getByRole("button", { name: "Open", exact: true }).click();
  await expect(page).toHaveScreenshot("sheet-demo-desktop.png", {
    animations: "disabled",
  });

  await page.setViewportSize({ height: 700, width: 390 });
  await page.reload();
  await page.getByRole("button", { name: "Open", exact: true }).click();
  await expect(page).toHaveScreenshot("sheet-demo-mobile.png", {
    animations: "disabled",
  });

  await page.setViewportSize({ height: 620, width: 900 });
  await page.goto("/docs/static/examples/components/sheet-no-close.html");
  await page.getByRole("button", { name: "Open Sheet" }).click();
  await expect(page).toHaveScreenshot("sheet-no-close-desktop.png", {
    animations: "disabled",
  });

  await page.goto("/docs/static/examples/components/sheet-sides.html");
  await page.getByRole("button", { name: "Right" }).click();
  await page
    .locator(".sheet")
    .nth(1)
    .locator(":scope > dialog > section")
    .evaluate((element) => {
      element.scrollTop = element.scrollHeight / 2;
    });
  await expect(page).toHaveScreenshot("sheet-side-right-desktop.png", {
    animations: "disabled",
  });

  await page.goto("/docs/static/examples/components/sheet-rtl.html");
  await page.getByRole("button", { name: "فتح" }).click();
  await expect(page).toHaveScreenshot("sheet-rtl-desktop.png", {
    animations: "disabled",
  });
});

test("sidebar examples preserve controlled, anatomy, collapse, and RTL visuals", async ({
  page,
}) => {
  await page.setViewportSize({ height: 700, width: 900 });
  await page.goto("/docs/static/examples/components/sidebar.html");
  await expect(page).toHaveScreenshot("sidebar-demo-desktop.png", {
    animations: "disabled",
  });
  await page.getByRole("button", { name: "Close Sidebar" }).click();
  await expect(page).toHaveScreenshot("sidebar-icon-desktop.png", {
    animations: "disabled",
  });

  await page.setViewportSize({ height: 800, width: 900 });
  await page.goto("/docs/static/examples/components/sidebar-anatomy.html");
  await expect(page).toHaveScreenshot("sidebar-anatomy-desktop.png", {
    animations: "disabled",
  });

  await page.setViewportSize({ height: 700, width: 900 });
  await page.goto("/docs/static/examples/components/sidebar-collapsible.html");
  await page
    .locator("summary")
    .filter({ hasText: "Build Your Application" })
    .click();
  await expect(page).toHaveScreenshot("sidebar-collapsible-desktop.png", {
    animations: "disabled",
  });

  await page.goto("/docs/static/examples/components/sidebar-rtl.html");
  await expect(page).toHaveScreenshot("sidebar-rtl-desktop.png", {
    animations: "disabled",
  });
});

test("alert workflows preserve action, color, destructive, and RTL compositions", async ({
  page,
}) => {
  await page.setViewportSize({ height: 760, width: 900 });
  await page.goto("/docs/static/examples/components/alert-workflows.html");

  const alerts = page.locator('[role="alert"]');
  await expect(alerts).toHaveCount(6);
  expect(
    await alerts.evaluateAll((items) =>
      items.map((item) => item.getAttribute("role")),
    ),
  ).toEqual(Array(6).fill("alert"));
  await expect(
    page.locator('[role="alert"][aria-live="polite"]'),
  ).toHaveAttribute("aria-live", "polite");
  expect(
    await alerts.evaluateAll((items) =>
      items
        .filter((item) => !item.hasAttribute("aria-live"))
        .map((item) => item.getAttribute("aria-live")),
    ),
  ).toEqual(Array(5).fill(null));

  const warning = page.locator('[role="alert"][variant="warning"]');
  const warningColors = await warning.evaluate((element) => {
    const probe = document.createElement("span");
    probe.style.color = "var(--amber-12)";
    document.body.append(probe);
    const foreground = getComputedStyle(element).color;
    const token = getComputedStyle(probe).color;
    probe.remove();
    return { foreground, token };
  });
  expect(warningColors.foreground).toBe(warningColors.token);

  const destructive = page.locator(`[role="alert"][variant="destructive"]`);
  const destructiveColors = await destructive.evaluate((element) => {
    const probe = document.createElement("span");
    probe.style.color = "var(--error-foreground)";
    document.body.append(probe);
    const foreground = getComputedStyle(element).color;
    const token = getComputedStyle(probe).color;
    probe.remove();
    return { foreground, token };
  });
  expect(destructiveColors.foreground).toBe(destructiveColors.token);

  const rtlAlert = page.locator('.alert-rtl-demo [role="alert"]').first();
  const rtlBox = await rtlAlert.boundingBox();
  const rtlIconBox = await rtlAlert.locator(":scope > svg").boundingBox();
  expect(rtlBox).not.toBeNull();
  expect(rtlIconBox).not.toBeNull();
  expect(rtlIconBox!.x).toBeGreaterThan(rtlBox!.x + rtlBox!.width / 2);

  await expect(page.locator(".alert-workflow-grid")).toHaveScreenshot(
    "alert-workflows-desktop.png",
    { animations: "disabled" },
  );

  await page.getByRole("button", { name: "Enable" }).click();
  await expect(page.getByRole("button", { name: "Enabled" })).toBeDisabled();
  await expect(page.locator(".alert-workflow-output")).toContainText(
    "Dark mode: enabled",
  );
});

test("alert dialog workflows preserve size, media, destructive, focus, and RTL behavior", async ({
  page,
}) => {
  await page.setViewportSize({ height: 700, width: 900 });
  await page.goto(
    "/docs/static/examples/components/alert-dialog-workflows.html",
  );

  const content = (id: string) => page.locator(`#${id} > dialog`);
  const media = (id: string) =>
    page.locator(`#${id} > dialog > header > figure`);

  await expect(
    page.getByRole("alertdialog", { includeHidden: true }),
  ).toHaveCount(6);
  await expect(page.getByRole("alertdialog")).toHaveCount(0);

  const shareTrigger = page.getByRole("button", { name: "Share Project" });
  await shareTrigger.click();
  const shareContent = content("share-project-dialog");
  await expect(shareContent).toBeVisible();
  const shareBox = await shareContent.boundingBox();
  const shareMediaBox = await media("share-project-dialog").boundingBox();
  expect(shareBox).not.toBeNull();
  expect(shareMediaBox).toMatchObject({ height: 64, width: 64 });
  expect(shareBox!.width).toBeCloseTo(512, 0);
  await expect(shareContent).toHaveScreenshot(
    "alert-dialog-default-media-desktop.png",
    { animations: "disabled" },
  );
  await shareContent.getByRole("button", { name: "Cancel" }).click();
  await expect(shareContent).toBeHidden();
  await expect(shareTrigger).toBeFocused();

  await page
    .getByRole("button", { name: "Show Small Dialog", exact: true })
    .click();
  const smallContent = content("accessory-dialog");
  const smallBox = await smallContent.boundingBox();
  expect(smallBox).not.toBeNull();
  expect(smallBox!.width).toBeCloseTo(320, 0);
  const smallButtons = smallContent.locator(":scope > footer > button");
  const smallButtonWidths = await smallButtons.evaluateAll((buttons) =>
    buttons.map((button) => button.getBoundingClientRect().width),
  );
  expect(smallButtonWidths[0]).toBeCloseTo(smallButtonWidths[1], 0);
  await expect(smallContent).toHaveScreenshot(
    "alert-dialog-small-desktop.png",
    { animations: "disabled" },
  );
  await smallContent.getByRole("button", { name: "Don't allow" }).click();

  await page
    .getByRole("button", { name: "Show Small Dialog With Media" })
    .click();
  const smallMediaContent = content("accessory-media-dialog");
  await expect(media("accessory-media-dialog")).toHaveCSS("width", "64px");
  await expect(smallMediaContent).toHaveScreenshot(
    "alert-dialog-small-media-desktop.png",
    { animations: "disabled" },
  );
  await smallMediaContent.getByRole("button", { name: "Don't allow" }).click();

  await page.getByRole("button", { name: "Delete Chat" }).click();
  const destructiveContent = content("delete-chat-dialog");
  const destructiveMedia = media("delete-chat-dialog");
  const destructiveColors = await destructiveMedia.evaluate((element) => {
    const probe = document.createElement("span");
    probe.style.color = "var(--error)";
    document.body.append(probe);
    const foreground = getComputedStyle(element).color;
    const token = getComputedStyle(probe).color;
    probe.remove();
    return { foreground, token };
  });
  expect(destructiveColors.foreground).toBe(destructiveColors.token);
  await expect(destructiveContent).toHaveScreenshot(
    "alert-dialog-destructive-desktop.png",
    { animations: "disabled" },
  );
  await destructiveContent.getByRole("button", { name: "Delete" }).click();
  await expect(destructiveContent).toBeHidden();
  await expect(page.getByRole("status")).toContainText("Chat: deleted");

  const rtlTrigger = page.getByRole("button", {
    name: "إظهار الحوار",
    exact: true,
  });
  await rtlTrigger.click();
  const rtlContent = content("rtl-confirmation-dialog");
  await expect(rtlContent).toHaveCSS("direction", "rtl");
  const rtlContentBox = await rtlContent.boundingBox();
  const rtlTitleBox = await rtlContent
    .locator(":scope > header > :is(h1, h2, h3)")
    .boundingBox();
  expect(rtlContentBox).not.toBeNull();
  expect(rtlTitleBox).not.toBeNull();
  expect(rtlTitleBox!.x).toBeGreaterThan(
    rtlContentBox!.x + rtlContentBox!.width / 2,
  );
  await expect(rtlContent).toHaveScreenshot("alert-dialog-rtl-desktop.png", {
    animations: "disabled",
  });
  await rtlContent.getByRole("button", { name: "إلغاء" }).click();
  await expect(rtlTrigger).toBeFocused();

  await page.setViewportSize({ height: 480, width: 390 });
  await page
    .getByRole("button", { name: "Show Small Dialog With Media" })
    .click();
  const compactContentBox = await smallMediaContent.boundingBox();
  expect(compactContentBox).not.toBeNull();
  expect(compactContentBox!.x).toBeGreaterThanOrEqual(0);
  expect(compactContentBox!.y).toBeGreaterThanOrEqual(0);
  expect(compactContentBox!.x + compactContentBox!.width).toBeLessThanOrEqual(
    390,
  );
  expect(compactContentBox!.y + compactContentBox!.height).toBeLessThanOrEqual(
    480,
  );
  await smallMediaContent.getByRole("button", { name: "Don't allow" }).click();
});

test("aspect ratio workflows preserve portrait, square, and RTL geometry", async ({
  page,
}) => {
  await page.setViewportSize({ height: 620, width: 900 });
  await page.goto(
    "/docs/static/examples/components/aspect-ratio-workflows.html",
  );

  const portrait = page.getByLabel("Portrait aspect ratio");
  const square = page.getByLabel("Square aspect ratio");
  const landscape = page.getByLabel("Landscape aspect ratio");
  const [portraitBox, squareBox, landscapeBox] = await Promise.all([
    portrait.boundingBox(),
    square.boundingBox(),
    landscape.boundingBox(),
  ]);
  expect(portraitBox).not.toBeNull();
  expect(squareBox).not.toBeNull();
  expect(landscapeBox).not.toBeNull();
  expect(portraitBox!.width).toBeCloseTo(160, 0);
  expect(portraitBox!.width / portraitBox!.height).toBeCloseTo(9 / 16, 2);
  expect(squareBox).toMatchObject({ height: 192, width: 192 });
  expect(landscapeBox!.width / landscapeBox!.height).toBeCloseTo(16 / 9, 2);
  await expect(page.locator(".aspect-ratio-rtl")).toHaveAttribute("dir", "rtl");
  await expect(page.locator(".aspect-ratio-rtl figcaption")).toHaveText(
    "منظر طبيعي جميل",
  );
  expect(
    await page.locator("figure[ratio] > img").evaluateAll((images) =>
      images.map((image) => ({
        objectFit: getComputedStyle(image).objectFit,
        position: getComputedStyle(image).position,
      })),
    ),
  ).toEqual(
    Array(3).fill({
      objectFit: "cover",
      position: "absolute",
    }),
  );
  await expect(page.locator(".aspect-ratio-workflows")).toHaveScreenshot(
    "aspect-ratio-workflows-desktop.png",
    { animations: "disabled" },
  );
});

test("avatar workflows preserve badges, group counts, sizes, dropdown composition, and RTL", async ({
  page,
}) => {
  await page.setViewportSize({ height: 620, width: 900 });
  await page.goto("/docs/static/examples/components/avatar-workflows.html");

  const sizeAvatars = page.getByLabel("Avatar sizes").locator(".avatar");
  await expect(sizeAvatars).toHaveCount(3);
  expect(
    await sizeAvatars.evaluateAll((avatars) =>
      avatars.map((avatar) => ({
        height: avatar.getBoundingClientRect().height,
        size: avatar.getAttribute("size") ?? "default",
        width: avatar.getBoundingClientRect().width,
      })),
    ),
  ).toEqual([
    { height: 24, size: "sm", width: 24 },
    { height: 32, size: "default", width: 32 },
    { height: 40, size: "lg", width: 40 },
  ]);

  const badge = page
    .getByLabel("Avatar badge icon")
    .locator(".avatar > output");
  const badgeBox = await badge.boundingBox();
  const badgeIconBox = await badge.locator("svg").boundingBox();
  expect(badgeBox).toMatchObject({ height: 10, width: 10 });
  expect(badgeIconBox).toMatchObject({ height: 8, width: 8 });

  const groupCount = page
    .getByLabel("Avatar group count icon")
    .locator(":scope > output");
  expect(await groupCount.boundingBox()).toMatchObject({
    height: 32,
    width: 32,
  });
  expect(await groupCount.locator("svg").boundingBox()).toMatchObject({
    height: 16,
    width: 16,
  });

  const rtlAvatar = page.locator(".avatar-rtl-badge");
  const rtlBadge = rtlAvatar.locator(":scope > output");
  const [rtlAvatarBox, rtlBadgeBox] = await Promise.all([
    rtlAvatar.boundingBox(),
    rtlBadge.boundingBox(),
  ]);
  expect(rtlAvatarBox).not.toBeNull();
  expect(rtlBadgeBox).not.toBeNull();
  expect(rtlBadgeBox!.x).toBeLessThan(
    rtlAvatarBox!.x + rtlAvatarBox!.width / 2,
  );

  await expect(page.locator(".avatar-workflows")).toHaveScreenshot(
    "avatar-workflows-desktop.png",
    { animations: "disabled" },
  );

  const trigger = page.getByRole("button", { name: "Open user menu" });
  expect(await trigger.boundingBox()).toMatchObject({ height: 36, width: 36 });
  expect(await trigger.locator(".avatar").boundingBox()).toMatchObject({
    height: 32,
    width: 32,
  });
  await expect(trigger.locator(":scope > svg")).toHaveCount(0);

  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  const menu = page.locator(".avatar-dropdown-stage").getByRole("menu");
  await expect(menu).toBeVisible();
  await expect(menu).toHaveCSS("width", "128px");
  await expect(page.locator(".avatar-dropdown-stage")).toHaveScreenshot(
    "avatar-dropdown-desktop.png",
    { animations: "disabled" },
  );

  await page.getByRole("menuitem", { name: "Profile" }).click();
  await expect(page.locator(".avatar-workflow-output")).toHaveText(
    "Selected: Profile",
  );
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).toBeFocused();
});

test("breadcrumb workflows preserve separators, ellipsis, dropdown composition, and RTL", async ({
  page,
}) => {
  await page.setViewportSize({ height: 700, width: 900 });
  await page.goto("/docs/static/examples/components/breadcrumb-workflows.html");

  const breadcrumbs = page.locator('nav:has(> ol [aria-current="page"])');
  await expect(breadcrumbs).toHaveCount(5);
  const pages = breadcrumbs.locator('[aria-current="page"]');
  await expect(pages).toHaveCount(5);
  for (const currentPage of await pages.all()) {
    await expect(currentPage).toHaveAttribute("aria-current", "page");
    await expect(currentPage).toHaveAttribute("aria-disabled", "true");
    expect(await currentPage.getAttribute("role")).toBeNull();
  }

  const cssSeparators = page.locator('nav > ol > li[aria-hidden="true"]:empty');
  await expect(cssSeparators).toHaveCount(6);
  expect(
    await cssSeparators.evaluateAll((separators) =>
      separators.map((separator) => {
        const box = separator.getBoundingClientRect();
        return { height: box.height, width: box.width };
      }),
    ),
  ).toEqual(Array(6).fill({ height: 14, width: 14 }));
  await expect(
    breadcrumbs.locator(':is(button, li) > span[aria-hidden="true"]'),
  ).toHaveCount(2);

  const collapsedTrigger = page.getByRole("button", {
    name: "Toggle breadcrumb menu",
  });
  await collapsedTrigger.click();
  await expect(collapsedTrigger).toHaveAttribute("aria-expanded", "true");
  await page.getByRole("menuitem", { name: "Themes" }).first().click();
  await expect(
    page.locator('section[aria-labelledby="breadcrumb-demo-heading"] output'),
  ).toHaveText("Selected: Themes");
  await expect(collapsedTrigger).toBeFocused();

  const dropdownSection = page.locator(
    'section[aria-labelledby="breadcrumb-dropdown-heading"]',
  );
  const dropdownTrigger = dropdownSection.getByRole("button", {
    name: "Components",
  });
  await dropdownTrigger.click();
  await expect(dropdownSection.getByRole("menu")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dropdownTrigger).toBeFocused();

  const rtlSection = page.locator('section[dir="rtl"]');
  await expect(rtlSection).toHaveAttribute("dir", "rtl");
  const rtlTrigger = rtlSection.getByRole("button", { name: "المكونات" });
  const [rtlTriggerBox, rtlIconBox] = await Promise.all([
    rtlTrigger.boundingBox(),
    rtlTrigger.locator("svg").boundingBox(),
  ]);
  expect(rtlTriggerBox).not.toBeNull();
  expect(rtlIconBox).not.toBeNull();
  expect(rtlIconBox!.x).toBeLessThan(
    rtlTriggerBox!.x + rtlTriggerBox!.width / 2,
  );
  await rtlTrigger.click();
  await rtlSection.getByRole("menuitem", { name: "السمات" }).click();
  await expect(rtlSection.locator("output")).toHaveText("المحدد: السمات");

  await expect(page.locator("main")).toHaveScreenshot(
    "breadcrumb-workflows-desktop.png",
    { animations: "disabled" },
  );
});

test("button group workflows preserve command, form, overlay, nested, and RTL composition", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ height: 1200, width: 900 });
  await page.goto(
    "/docs/static/examples/components/button-group-workflows.html",
  );

  const toolbar = page.getByRole("group", { name: "Message actions" });
  const nestedGroups = toolbar.locator(':scope > [role="group"]');
  await expect(nestedGroups).toHaveCount(3);
  await expect(toolbar).toHaveCSS("gap", "8px");
  const archive = toolbar.getByRole("button", { name: "Archive", exact: true });
  await archive.click();
  await expect(page.locator(".button-group-output").first()).toHaveText(
    "Action: Archive",
  );
  await expect(archive).not.toHaveAttribute("aria-pressed");

  const more = toolbar.getByRole("button", { name: "More Options" });
  await more.click();
  const toolbarMenu = toolbar.getByRole("menu");
  await expect(toolbarMenu).toBeVisible();
  await toolbarMenu.getByRole("menuitem", { name: "Trash" }).click();
  await expect(page.locator(".button-group-output").first()).toHaveText(
    "Action: Trash",
  );

  const follow = page.getByRole("group", { name: "Follow actions" });
  const followMore = follow.getByRole("button", {
    name: "More follow actions",
  });
  await followMore.click();
  const followMenu = follow.getByRole("menu");
  await expect(followMenu.getByRole("menuitem")).toHaveCount(7);
  await expect(followMenu).toHaveScreenshot(
    "button-group-dropdown-open-desktop.png",
    {
      animations: "disabled",
    },
  );
  await page.keyboard.press("Escape");
  await expect(followMore).toBeFocused();

  const search = page.getByRole("textbox", { name: "Search query" });
  await search.fill("Invoices");
  await expect(search).toHaveValue("Invoices");
  await expect(page.getByText("Query: Invoices")).toBeVisible();

  const voice = page.getByRole("button", { name: "Voice Mode" });
  const voiceInput = page.getByRole("textbox", { name: "Voice message" });
  await expect(voice).toHaveAttribute("aria-pressed", "false");
  await voice.click();
  await expect(voice).toHaveAttribute("aria-pressed", "true");
  await expect(voiceInput).toBeDisabled();
  await expect(voiceInput).toHaveAttribute(
    "placeholder",
    "Record and send audio...",
  );

  const popoverTrigger = page.getByRole("button", { name: "Open Popover" });
  await popoverTrigger.click();
  const copilotPopover = page.getByLabel("Copilot task");
  await expect(copilotPopover).toBeVisible();
  await expect(page.locator(".button-group-popover-stage")).toHaveScreenshot(
    "button-group-popover-open-desktop.png",
    { animations: "disabled" },
  );
  await page.keyboard.press("Escape");
  await expect(popoverTrigger).toBeFocused();

  const currency = page.getByRole("combobox", { name: "Currency" });
  await currency.selectOption("€");
  await expect(currency).toHaveValue("€");

  const rtlGroup = page.getByRole("group", { name: "إجراءات الرسالة" });
  const rtlMore = rtlGroup.getByRole("button", { name: "المزيد من الخيارات" });
  await rtlMore.click();
  const rtlMenu = rtlGroup.getByRole("menu");
  await expect(rtlMenu).toHaveCSS("direction", "rtl");
  await rtlMenu.getByRole("menuitem", { name: "سلة المهملات" }).click();
  await expect(page.getByText("الإجراء: سلة المهملات")).toBeVisible();

  await expect(page.locator(".button-group-workflows")).toHaveScreenshot(
    "button-group-workflows-desktop.png",
    { animations: "disabled" },
  );
});

test("calendar workflows preserve reference scale, connected state, and disabled dates", async ({
  page,
}) => {
  await page.setViewportSize({ height: 1820, width: 900 });
  await page.goto("/docs/static/examples/components/calendar-workflows.html");

  const calendars = page.locator("[ng-calendar]");
  await expect(calendars).toHaveCount(6);
  expect((await calendars.nth(0).boundingBox())!.width).toBeCloseTo(214, 0);
  await expect(calendars.nth(1).locator(`[data-booked="true"]`)).toHaveCount(
    15,
  );
  await expect(calendars.nth(3).locator(`[aria-pressed="true"]`)).toHaveCount(
    2,
  );
  const range = calendars.nth(4);
  await expect(range.locator(`[data-range-start="true"]`)).toHaveCount(1);
  await expect(range.locator(`[data-range-middle="true"]`)).toHaveCount(4);
  await expect(range.locator(`[data-range-end="true"]`)).toHaveCount(1);
  await expect(calendars.nth(5).locator(`:scope > div data`)).toHaveCount(6);
  await expect(page.locator(".calendar-workflow-grid")).toHaveScreenshot(
    "calendar-workflows-desktop.png",
    { animations: "disabled" },
  );
});

test("calendar compositions preserve custom cells, application adapters, and native time state", async ({
  page,
}) => {
  await page.setViewportSize({ height: 1750, width: 1100 });
  await page.goto(
    "/docs/static/examples/components/calendar-compositions.html",
  );

  const calendars = page.locator("[ng-calendar]");
  await expect(calendars).toHaveCount(5);
  expect((await calendars.nth(0).boundingBox())!.width).toBeCloseTo(352, 0);
  await expect(
    calendars.nth(0).locator(`[value="2026-09-12"] span`),
  ).toHaveText("$120");
  await expect(calendars.nth(3)).toHaveCSS("direction", "rtl");
  await expect(
    calendars.nth(4).locator(`:scope > div button[value]`),
  ).toHaveCount(42);
  await page.getByLabel("Start time").fill("10:30");
  await expect(page.locator(".calendar-workflow-output").nth(2)).toContainText(
    "10:30",
  );
  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  });
  await expect(page.locator(".calendar-composition-grid")).toHaveScreenshot(
    "calendar-compositions-desktop.png",
    { animations: "disabled" },
  );
});

test("date picker compositions preserve closed, parsing, range, mobile, and RTL visuals", async ({
  page,
}) => {
  const path = "/docs/static/examples/components/date-picker-workflows.html";

  await page.setViewportSize({ height: 620, width: 1100 });
  await page.goto(path);
  await expect(page.locator(".date-picker-grid")).toHaveScreenshot(
    "date-picker-workflows-desktop.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 760, width: 1100 });
  await page.reload();
  await page.locator("#date-picker-range").click();
  await expect(page).toHaveScreenshot("date-picker-range-open-desktop.png", {
    animations: "disabled",
  });

  await page.keyboard.press("Escape");
  const natural = page.getByRole("textbox", { name: "Schedule Date" });
  await natural.fill("October 5, 2026");
  await natural.press("ArrowDown");
  await expect(page).toHaveScreenshot("date-picker-natural-open-desktop.png", {
    animations: "disabled",
  });

  await page.keyboard.press("Escape");
  await page.locator("#date-picker-rtl-popover > button:first-child").click();
  await expect(page).toHaveScreenshot("date-picker-rtl-open-desktop.png", {
    animations: "disabled",
  });

  await page.setViewportSize({ height: 1400, width: 390 });
  await page.reload();
  await expect(page.locator(".date-picker-grid")).toHaveScreenshot(
    "date-picker-workflows-mobile.png",
    { animations: "disabled" },
  );
});

test("card workflows preserve local image media, logical RTL layout, and form commands", async ({
  page,
}) => {
  await page.setViewportSize({ height: 700, width: 900 });
  await page.goto("/docs/static/examples/components/card-workflows.html");

  const cards = page.locator(".card");
  await expect(cards).toHaveCount(3);
  const image = page.locator(".card-cover-image");
  await expect(image).toHaveAttribute("src", "../../images/avatars/01.png");
  const [imageBox, overlayBox] = await Promise.all([
    image.boundingBox(),
    page.locator(".card-image-overlay").boundingBox(),
  ]);
  expect(imageBox).not.toBeNull();
  expect(overlayBox).not.toBeNull();
  expect(imageBox!.width / imageBox!.height).toBeCloseTo(16 / 9, 2);
  expect(overlayBox).toMatchObject({
    height: imageBox!.height,
    width: imageBox!.width,
  });
  await page.getByRole("button", { name: "View Event" }).click();
  await expect(page.locator(".card-workflow-output").nth(0)).toHaveText(
    "Viewing Design systems meetup",
  );

  const rtlCard = cards.nth(1);
  await expect(rtlCard).toHaveAttribute("dir", "rtl");
  const titleBox = await rtlCard.locator(`:scope > header h2`).boundingBox();
  const actionBox = await rtlCard
    .locator(`:scope > header > menu`)
    .boundingBox();
  expect(titleBox).not.toBeNull();
  expect(actionBox).not.toBeNull();
  expect(actionBox!.x).toBeLessThan(titleBox!.x);
  await page.locator("#card-email-rtl").fill("jane@example.com");
  await page.locator("#card-password-rtl").fill("secret");
  await rtlCard
    .getByRole("button", { name: "تسجيل الدخول", exact: true })
    .click();
  await expect(page.locator(".card-workflow-output").nth(1)).toContainText(
    "jane@example.com",
  );
  const smallCard = cards.nth(2);
  await expect(smallCard).toHaveAttribute("size", "sm");
  await expect(smallCard).toHaveCSS("gap", "12px");
  await smallCard.getByRole("button", { name: "See what's new" }).click();
  await expect(page.locator(".card-workflow-output").nth(2)).toHaveText(
    "Showing report updates",
  );
  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  });
  await expect(page.locator(".card-workflows")).toHaveScreenshot(
    "card-workflows-desktop.png",
    { animations: "disabled" },
  );
});

test("carousel workflows preserve API state, multi-item snaps, vertical geometry, and autoplay", async ({
  page,
}) => {
  await page.setViewportSize({ height: 1080, width: 1200 });
  await page.goto("/docs/static/examples/components/carousel-workflows.html");

  const carousels = page.locator("[ng-carousel]");
  await expect(carousels).toHaveCount(4);
  await expect(page.locator("body")).toHaveAttribute(
    "data-example",
    "carousel-api carousel-multiple carousel-orientation carousel-plugin",
  );
  await expect(
    carousels.nth(0).locator(":scope > * > :is(ul, ol) > li"),
  ).toHaveCount(5);
  await expect(
    carousels.nth(1).locator(":scope > * > :is(ul, ol) > li"),
  ).toHaveCount(5);
  await expect(carousels.nth(2)).toHaveAttribute("orientation", "vertical");
  await expect(
    carousels.nth(2).locator(":scope > * > :is(ul, ol) > li"),
  ).toHaveCount(5);

  await carousels.nth(0).locator(":scope > button").nth(1).click();
  await expect(page.locator(".carousel-status").first()).toHaveText(
    "Slide 2 of 5",
  );
  await carousels.nth(2).press("ArrowDown");
  await expect(
    carousels.nth(2).locator(":scope > * > :is(ul, ol) > li").nth(1),
  ).toHaveAttribute("aria-hidden", "false");

  await carousels.nth(0).locator(":scope > button").first().click();
  await expect(
    carousels.nth(0).locator(":scope > * > :is(ul, ol) > li").first(),
  ).toHaveAttribute("aria-hidden", "false");
  await carousels.nth(2).press("ArrowUp");
  await expect(
    carousels.nth(2).locator(":scope > * > :is(ul, ol) > li").first(),
  ).toHaveAttribute("aria-hidden", "false");

  await carousels.nth(3).hover();
  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  });
  await expect(page.locator(".carousel-workflow-grid")).toHaveScreenshot(
    "carousel-workflows-desktop.png",
    { animations: "disabled" },
  );
});

test("carousel compositions preserve RTL controls, responsive basis, and authored spacing", async ({
  page,
}) => {
  await page.setViewportSize({ height: 760, width: 1200 });
  await page.goto(
    "/docs/static/examples/components/carousel-compositions.html",
  );

  const carousels = page.locator("[ng-carousel]");
  await expect(carousels).toHaveCount(3);
  await expect(page.locator("body")).toHaveAttribute(
    "data-example",
    "carousel-rtl carousel-size carousel-spacing",
  );
  await expect(carousels.first()).toHaveCSS("direction", "rtl");
  await carousels.first().locator(":scope > button").nth(1).click();
  await expect(
    carousels.first().locator(":scope > * > :is(ul, ol) > li").nth(1),
  ).toHaveAttribute("aria-hidden", "false");
  await expect(
    carousels.first().locator(":scope > * > :is(ul, ol) > li").nth(1),
  ).toContainText("٢");
  await carousels.first().locator(":scope > button").first().click();
  await expect(
    carousels.first().locator(":scope > * > :is(ul, ol) > li").first(),
  ).toHaveAttribute("aria-hidden", "false");

  const spacedCards = carousels.nth(2).locator(".card");
  const first = await spacedCards.first().boundingBox();
  const second = await spacedCards.nth(1).boundingBox();
  expect(first).not.toBeNull();
  expect(second).not.toBeNull();
  expect(second!.x - (first!.x + first!.width)).toBeCloseTo(12, 0);
  await expect(page.locator(".carousel-composition-grid")).toHaveScreenshot(
    "carousel-compositions-desktop.png",
    { animations: "disabled" },
  );
});

test("chart workflows preserve grid, axis, legend, and AngularTS tooltip state", async ({
  page,
}) => {
  await page.setViewportSize({ height: 850, width: 1200 });
  await page.goto("/docs/static/examples/components/chart-workflows.html");

  const charts = page.locator(".chart");
  await expect(charts).toHaveCount(4);
  await expect(page.locator("body")).toHaveAttribute(
    "data-example",
    "chart-example-grid chart-example-axis chart-example-tooltip chart-example-legend",
  );
  await expect(page.locator(".chart > section > ul > li")).toHaveCount(24);
  await expect(page.locator(".chart > section > hr")).toHaveCount(4);
  await expect(page.locator(".chart > footer")).toHaveCount(3);
  await expect(page.locator(".chart > ul")).toHaveCount(1);

  const tooltipWorkflow = page.locator(
    "[aria-labelledby='chart-tooltip-heading']",
  );
  await tooltipWorkflow.locator(".chart > section > ul > li").first().hover();
  const tooltip = tooltipWorkflow.locator(".chart output");
  await expect(tooltip).toHaveRole("status");
  await expect(tooltip).toContainText("January");
  await expect(tooltip).toContainText(/Desktop\s+186/);
  await page.mouse.move(1190, 840);
  await expect(tooltip).toHaveCount(0);

  await expect(page.locator(".chart-workflow-grid")).toHaveScreenshot(
    "chart-workflows-desktop.png",
    { animations: "disabled" },
  );
});

test("chart compositions preserve active series, RTL, and tooltip variants", async ({
  page,
}) => {
  await page.setViewportSize({ height: 1050, width: 1200 });
  await page.goto("/docs/static/examples/components/chart-compositions.html");

  await expect(page.locator("body")).toHaveAttribute(
    "data-example",
    "chart-demo chart-rtl chart-tooltip",
  );
  const controls = page.locator(".chart-series-controls > button");
  const bars = page.locator(".chart-daily-bars > span");
  await expect(bars).toHaveCount(30);
  await controls.nth(1).click();
  await expect(controls.nth(1)).toHaveAttribute("aria-pressed", "true");
  await expect(bars.first()).toHaveAttribute("data-value", "36%");
  await bars.first().hover();
  await expect(page.locator(".chart-interactive-demo output")).toContainText(
    /Mobile\s+150/,
  );

  const rtl = page.locator(`.chart-composition[dir="rtl"] .chart`);
  await expect(page.locator('.chart-composition[dir="rtl"]')).toHaveAttribute(
    "dir",
    "rtl",
  );
  await expect(rtl.locator(":scope > section > ul > li")).toHaveCount(6);
  const gallery = page.locator(".chart-tooltip-gallery");
  expect(await gallery.getAttribute("role")).toBeNull();
  await expect(gallery).toHaveRole("figure");
  await expect(gallery.locator(":scope > output")).toHaveCount(4);
  await expect(gallery.locator(`[indicator="dashed"]`)).toHaveCount(2);
  await expect(gallery.locator(`[indicator="line"]`)).toHaveCount(1);

  await controls.nth(0).click();
  await page.mouse.move(1190, 1040);
  await expect(page.locator(".chart-composition-grid")).toHaveScreenshot(
    "chart-compositions-desktop.png",
    { animations: "disabled" },
  );
});

test("checkbox workflows preserve reference states, grouping, and RTL layout", async ({
  page,
}) => {
  await page.setViewportSize({ height: 720, width: 1000 });
  await page.goto("/docs/static/examples/components/checkbox-workflows.html");

  await expect(page.locator("body")).toHaveAttribute(
    "data-example",
    "checkbox-basic checkbox-description checkbox-disabled checkbox-group checkbox-invalid checkbox-rtl",
  );
  const checkboxes = page.locator(
    'input[type="checkbox"]:not([role="switch"])',
  );
  await expect(checkboxes).toHaveCount(12);
  await page.locator("#terms-checkbox-basic").check();
  await expect(page.getByRole("status")).toContainText("Basic true");
  await page.locator("#cds-dvds").check();
  await expect(page.getByRole("status")).toContainText("CDs true");
  await expect(page.locator("#toggle-checkbox-disabled")).toBeDisabled();
  await expect(page.locator("#terms-checkbox-invalid")).toHaveAttribute(
    "aria-invalid",
    "true",
  );

  const rtl = page.locator(".checkbox-workflow-rtl");
  await expect(rtl).toHaveAttribute("dir", "rtl");
  const rtlField = rtl.locator(".field").first();
  const [controlBox, labelBox] = await Promise.all([
    rtlField
      .locator('input[type="checkbox"]:not([role="switch"])')
      .boundingBox(),
    rtlField.locator("label").boundingBox(),
  ]);
  expect(controlBox).not.toBeNull();
  expect(labelBox).not.toBeNull();
  expect(controlBox!.x).toBeGreaterThan(labelBox!.x);

  await expect(page.locator(".checkbox-workflow-grid")).toHaveScreenshot(
    "checkbox-workflows-desktop.png",
    { animations: "disabled" },
  );
});

test("checkbox table keeps selection and selected-row state synchronized", async ({
  page,
}) => {
  await page.setViewportSize({ height: 420, width: 1000 });
  await page.goto(
    "/docs/static/examples/components/checkbox-compositions.html",
  );

  await expect(page.locator("body")).toHaveAttribute(
    "data-example",
    "checkbox-table",
  );
  const table = page.getByRole("table", { name: "Team members" });
  const rows = table.locator("tbody tr");
  const selectAll = page.getByRole("checkbox", { name: "Select all rows" });
  await expect(rows).toHaveCount(4);
  await expect(rows.nth(0)).toHaveAttribute("aria-selected", "true");

  await selectAll.check();
  await expect(
    rows.locator('input[type="checkbox"]:not([role="switch"]):checked'),
  ).toHaveCount(4);
  await page.getByLabel("Select Marcus Rodriguez").uncheck();
  await expect(selectAll).not.toBeChecked();
  await expect(rows.nth(1)).toHaveAttribute("aria-selected", "false");

  await selectAll.check();
  await selectAll.uncheck();
  await page.getByLabel("Select Sarah Chen").check();
  await expect(page.locator(".checkbox-table-demo")).toHaveScreenshot(
    "checkbox-table-desktop.png",
    { animations: "disabled" },
  );
});

test("disclosure workflows preserve native disclosure, settings, and RTL behavior", async ({
  page,
}) => {
  await page.setViewportSize({ height: 760, width: 1000 });
  await page.goto("/docs/static/examples/components/disclosure-workflows.html");

  await expect(page.locator("body")).toHaveAttribute(
    "data-example",
    "disclosure-basic disclosure-rtl disclosure-settings",
  );
  const product = page.locator(".disclosure-product");
  await product.locator("summary").click();
  await expect(product).toHaveAttribute("open", "");
  await expect(product.locator(":scope > :last-child")).toBeVisible();

  const settings = page.locator(".disclosure-settings");
  await expect(settings.locator("input:visible")).toHaveCount(2);
  await page
    .locator('summary[aria-label="Toggle additional radius settings"]')
    .click();
  await expect(settings.locator("input:visible")).toHaveCount(4);

  const rtl = page.locator(".disclosure-workflow-wide");
  await rtl.locator("summary").click();
  await expect(rtl.locator("details > :last-child")).toBeVisible();
  await expect(page.locator(".disclosure-workflow-grid")).toHaveScreenshot(
    "disclosure-workflows-desktop.png",
    { animations: "disabled" },
  );
});

test("disclosure file tree expands nested reference folders", async ({
  page,
}) => {
  await page.setViewportSize({ height: 760, width: 800 });
  await page.goto(
    "/docs/static/examples/components/disclosure-compositions.html",
  );

  const tree = page.locator(".disclosure-file-tree");
  const components = tree.locator("details").first();
  await components.locator(":scope > summary").click();
  await components
    .locator("details")
    .first()
    .locator(":scope > summary")
    .click();
  await expect(tree.getByText("button.tsx", { exact: true })).toBeVisible();
  await expect(tree.getByText("app.tsx", { exact: true })).toBeVisible();
  await expect(page.locator(".disclosure-file-card")).toHaveScreenshot(
    "disclosure-file-tree-desktop.png",
    { animations: "disabled" },
  );
});

test("switch workflows preserve native sizes, validation, choice cards, and RTL", async ({
  page,
}) => {
  await page.setViewportSize({ height: 760, width: 900 });
  await page.goto("/docs/static/examples/components/switch-workflows.html");

  const small = page.locator("#switch-size-sm");
  const standard = page.locator("#switch-size-default");
  const disabled = page.locator("#switch-disabled-unchecked");
  const invalid = page.locator("#switch-terms");
  const selectedChoice = page.locator(
    '.switch-choice:has([role="switch"]:checked)',
  );
  const rtl = page.locator('[aria-label="RTL switch"]');

  const [smallBox, standardBox] = await Promise.all([
    small.boundingBox(),
    standard.boundingBox(),
  ]);
  expect(smallBox).not.toBeNull();
  expect(standardBox).not.toBeNull();
  expect(smallBox!.width).toBeLessThan(standardBox!.width);
  await expect(disabled).toBeDisabled();
  await expect(invalid).toHaveAttribute("aria-invalid", "true");
  await expect(selectedChoice).toHaveCount(1);
  await expect(rtl).toHaveAttribute("dir", "rtl");
  const rtlControl = page.locator("#switch-focus-mode-rtl");
  await rtlControl.check();
  await expect
    .poll(() =>
      rtlControl.evaluate(
        (element) => getComputedStyle(element, "::after").transform,
      ),
    )
    .toContain("-14");
  await rtlControl.uncheck();

  await page.mouse.move(880, 740);
  await expect(page.locator(".switch-workflows")).toHaveScreenshot(
    "switch-workflows-desktop.png",
    { animations: "disabled" },
  );
});

test("radio group workflows preserve model state, choice cards, fieldsets, validation, and RTL", async ({
  page,
}) => {
  await page.setViewportSize({ height: 760, width: 900 });
  await page.goto(
    "/docs/static/examples/components/radio-group-workflows.html",
  );

  const groups = page.locator(
    'fieldset:has(input[type="radio"]):not(.toggle-group)',
  );
  const checked = groups.locator('input[type="radio"]:checked');
  const disabled = page.locator("#disabled-1");
  const invalid = page.locator('[name="notification"][aria-invalid="true"]');
  const rtl = page.locator('[aria-label="RTL density options"]');

  await expect(groups).toHaveCount(6);
  await expect(checked).toHaveCount(6);
  await expect(page.locator("#plus-plan")).toBeChecked();
  await expect(page.locator("#desc-r2")).toBeChecked();
  await expect(page.locator("#disabled-2")).toBeChecked();
  await expect(page.locator("#plan-monthly")).toBeChecked();
  await expect(page.locator("#invalid-email")).toBeChecked();
  await expect(page.locator("#r2-rtl")).toBeChecked();
  await expect(disabled).toBeDisabled();
  await expect(invalid).toHaveCount(3);
  await expect(rtl).toHaveAttribute("dir", "rtl");

  await page.locator("#pro-plan").check();
  await expect(page.locator("#pro-plan")).toBeChecked();
  await expect(
    page.locator('.radio-choice:has(input[type="radio"]:checked)'),
  ).toHaveCount(1);
  await page.mouse.move(880, 740);
  await expect(page.locator(".radio-group-workflows")).toHaveScreenshot(
    "radio-group-workflows-desktop.png",
    { animations: "disabled" },
  );
});

test("radio fields preserve Nova fieldset, content, title-card, invalid, disabled, and mobile compositions", async ({
  page,
}) => {
  await page.setViewportSize({ height: 1180, width: 900 });
  await page.goto("/docs/static/examples/components/radio-fields.html");
  await expect(page.locator("#radio-free")).toBeChecked();
  await expect(page.locator(".radio-fields-demo")).toHaveScreenshot(
    "radio-fields-desktop.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 1360, width: 390 });
  await page.reload();
  await expect(page.locator(".radio-fields-demo")).toHaveScreenshot(
    "radio-fields-mobile.png",
    { animations: "disabled" },
  );
});

test("Toast workflows preserve description, position, type, and promise behavior", async ({
  page,
}) => {
  await page.setViewportSize({ height: 1040, width: 900 });
  await page.goto("/docs/static/examples/components/toast-workflows.html");

  await page.getByRole("button", { name: "Show Toast", exact: true }).click();
  const descriptionToast = page
    .getByLabel("Description notifications")
    .locator(":scope > article");
  await expect(descriptionToast).toContainText("Monday, January 3rd");

  await page.getByRole("button", { name: "Top Right" }).click();
  await expect(page.getByLabel("Position notifications")).toHaveAttribute(
    "position",
    "top-right",
  );

  await page
    .getByLabel("Toast types")
    .getByRole("button", { name: "Warning" })
    .click();
  await expect(
    page.getByLabel("Type notifications").locator(":scope > article"),
  ).toHaveAttribute("type", "warning");

  await page.mouse.move(890, 1030);
  await expect(page.locator(".toast-workflow-grid")).toHaveScreenshot(
    "toast-workflows-desktop.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 1200, width: 390 });
  await page.reload();
  await page.getByRole("button", { name: "Show Toast", exact: true }).click();
  await page.getByRole("button", { name: "Bottom Center" }).click();
  await page
    .getByLabel("Toast types")
    .getByRole("button", { name: "Error" })
    .click();
  await page.mouse.move(380, 1190);
  await expect(page.locator(".toast-workflow-grid")).toHaveScreenshot(
    "toast-workflows-mobile.png",
    { animations: "disabled" },
  );
});

test("Range Slider workflows preserve controlled, range, multiple, RTL, and vertical states", async ({
  page,
}) => {
  await page.setViewportSize({ height: 680, width: 900 });
  await page.goto(
    "/docs/static/examples/components/range-slider-workflows.html",
  );

  await page.getByRole("slider", { name: "Minimum temperature" }).fill("0.4");
  await page.getByRole("slider", { name: "Maximum price" }).fill("75");
  await page.getByRole("slider", { name: "Second value" }).fill("40");
  await page.getByRole("slider", { name: "مستوى الصوت" }).fill("65");
  await page.getByRole("slider", { name: "Second vertical value" }).fill("35");

  await expect(
    page.getByRole("slider", { name: "Minimum temperature" }),
  ).toHaveValue("0.4");
  await expect(page.getByRole("slider", { name: "Second value" })).toHaveValue(
    "40",
  );
  await expect(
    page.getByRole("slider", { name: "Second vertical value" }),
  ).toHaveAttribute("orientation", "vertical");

  await page.mouse.move(890, 670);
  await expect(page.locator(".slider-workflow-grid")).toHaveScreenshot(
    "range-slider-workflows-desktop.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 720, width: 390 });
  await page.reload();
  await page.getByRole("slider", { name: "Minimum price" }).fill("35");
  await page.mouse.move(380, 710);
  await expect(page.locator(".slider-workflow-grid")).toHaveScreenshot(
    "range-slider-workflows-mobile.png",
    { animations: "disabled" },
  );
});

test("workflow iframes fit compact viewports without scrolling or clipping", async ({
  context,
  page: initialPage,
}) => {
  let page = initialPage;

  for (const [index, [name, path, height]] of (
    [
      [
        "button-workflows",
        "/docs/static/examples/components/button-workflows.html",
        480,
      ],
      [
        "badge-workflows",
        "/docs/static/examples/components/badge-workflows.html",
        300,
      ],
      [
        "spinner-workflows",
        "/docs/static/examples/components/spinner-workflows.html",
        740,
      ],
      [
        "accordion-state-workflows",
        "/docs/static/examples/components/accordion-state-workflows.html",
        800,
      ],
      [
        "accordion-layout-workflows",
        "/docs/static/examples/components/accordion-layout-workflows.html",
        1024,
      ],
      [
        "alert-workflows",
        "/docs/static/examples/components/alert-workflows.html",
        792,
      ],
      [
        "alert-dialog-workflows",
        "/docs/static/examples/components/alert-dialog-workflows.html",
        480,
      ],
      [
        "dialog-close-workflows",
        "/docs/static/examples/components/dialog-close-workflows.html",
        480,
      ],
      [
        "dialog-scroll-workflows",
        "/docs/static/examples/components/dialog-scroll-workflows.html",
        480,
      ],
      ["dialog-rtl", "/docs/static/examples/components/dialog-rtl.html", 420],
      [
        "drawer-dialog",
        "/docs/static/examples/components/drawer-dialog.html",
        480,
      ],
      [
        "drawer-sides",
        "/docs/static/examples/components/drawer-sides.html",
        480,
      ],
      [
        "drawer-scrollable",
        "/docs/static/examples/components/drawer-scrollable.html",
        480,
      ],
      ["drawer-rtl", "/docs/static/examples/components/drawer-rtl.html", 460],
      [
        "sheet-no-close",
        "/docs/static/examples/components/sheet-no-close.html",
        420,
      ],
      ["sheet-sides", "/docs/static/examples/components/sheet-sides.html", 480],
      ["sheet-rtl", "/docs/static/examples/components/sheet-rtl.html", 420],
      [
        "sidebar-anatomy",
        "/docs/static/examples/components/sidebar-anatomy.html",
        800,
      ],
      [
        "sidebar-collapsible",
        "/docs/static/examples/components/sidebar-collapsible.html",
        700,
      ],
      ["sidebar-rtl", "/docs/static/examples/components/sidebar-rtl.html", 700],
      [
        "aspect-ratio-workflows",
        "/docs/static/examples/components/aspect-ratio-workflows.html",
        816,
      ],
      [
        "avatar-workflows",
        "/docs/static/examples/components/avatar-workflows.html",
        720,
      ],
      [
        "breadcrumb-workflows",
        "/docs/static/examples/components/breadcrumb-workflows.html",
        1024,
      ],
      [
        "button-group-workflows",
        "/docs/static/examples/components/button-group-workflows.html",
        1800,
      ],
      [
        "calendar-workflows",
        "/docs/static/examples/components/calendar-workflows.html",
        2800,
      ],
      [
        "calendar-compositions",
        "/docs/static/examples/components/calendar-compositions.html",
        2600,
      ],
      [
        "date-picker-workflows",
        "/docs/static/examples/components/date-picker-workflows.html",
        1400,
      ],
      [
        "date-picker-with-dropdowns",
        "/docs/static/examples/components/date-picker-with-dropdowns.html",
        700,
      ],
      [
        "card-workflows",
        "/docs/static/examples/components/card-workflows.html",
        1500,
      ],
      [
        "carousel-workflows",
        "/docs/static/examples/components/carousel-workflows.html",
        1800,
      ],
      [
        "carousel-compositions",
        "/docs/static/examples/components/carousel-compositions.html",
        1200,
      ],
      [
        "chart-workflows",
        "/docs/static/examples/components/chart-workflows.html",
        1600,
      ],
      [
        "chart-compositions",
        "/docs/static/examples/components/chart-compositions.html",
        1500,
      ],
      [
        "checkbox-workflows",
        "/docs/static/examples/components/checkbox-workflows.html",
        1200,
      ],
      [
        "checkbox-compositions",
        "/docs/static/examples/components/checkbox-compositions.html",
        420,
      ],
      [
        "disclosure-workflows",
        "/docs/static/examples/components/disclosure-workflows.html",
        1000,
      ],
      [
        "disclosure-compositions",
        "/docs/static/examples/components/disclosure-compositions.html",
        1000,
      ],
      [
        "switch-workflows",
        "/docs/static/examples/components/switch-workflows.html",
        980,
      ],
      [
        "radio-group-workflows",
        "/docs/static/examples/components/radio-group-workflows.html",
        1320,
      ],
      [
        "radio-fields",
        "/docs/static/examples/components/radio-fields.html",
        1360,
      ],
      [
        "input-group-workflows",
        "/docs/static/examples/components/input-group-workflows.html",
        3600,
      ],
      [
        "input-group-compositions",
        "/docs/static/examples/components/input-group-compositions.html",
        1900,
      ],
      [
        "input-group-textarea-workflows",
        "/docs/static/examples/components/input-group-textarea-workflows.html",
        2800,
      ],
      [
        "input-group-rtl",
        "/docs/static/examples/components/input-group-rtl.html",
        700,
      ],
      [
        "empty-workflows",
        "/docs/static/examples/components/empty-workflows.html",
        3000,
      ],
      [
        "table-workflows",
        "/docs/static/examples/components/table-workflows.html",
        2600,
      ],
      [
        "input-workflows",
        "/docs/static/examples/components/input-workflows.html",
        3000,
      ],
      [
        "field-workflows",
        "/docs/static/examples/components/field-workflows.html",
        4200,
      ],
      [
        "item-workflows",
        "/docs/static/examples/components/item-workflows.html",
        3900,
      ],
      [
        "pagination-workflows",
        "/docs/static/examples/components/pagination-workflows.html",
        720,
      ],
      [
        "progress-workflows",
        "/docs/static/examples/components/progress-workflows.html",
        520,
      ],
      [
        "resizable-workflows",
        "/docs/static/examples/components/resizable-workflows.html",
        760,
      ],
      [
        "resizable-state-workflows",
        "/docs/static/examples/components/resizable-state-workflows.html",
        760,
      ],
      [
        "combobox-workflows",
        "/docs/static/examples/components/combobox-workflows.html",
        1500,
      ],
      [
        "combobox-compositions",
        "/docs/static/examples/components/combobox-compositions.html",
        1200,
      ],
      [
        "combobox-state-workflows",
        "/docs/static/examples/components/combobox-state-workflows.html",
        480,
      ],
      [
        "command-dialog-workflows",
        "/docs/static/examples/components/command-dialog-workflows.html",
        1000,
      ],
      [
        "command-scrollable",
        "/docs/static/examples/components/command-scrollable.html",
        720,
      ],
      [
        "context-menu-workflows",
        "/docs/static/examples/components/context-menu-workflows.html",
        800,
      ],
      [
        "context-menu-sides",
        "/docs/static/examples/components/context-menu-sides.html",
        650,
      ],
      [
        "tabs-workflows",
        "/docs/static/examples/components/tabs-workflows.html",
        1080,
      ],
      [
        "toggle-group-workflows",
        "/docs/static/examples/components/toggle-group-workflows.html",
        1260,
      ],
      [
        "toggle-workflows",
        "/docs/static/examples/components/toggle-workflows.html",
        300,
      ],
      [
        "scroll-area-workflows",
        "/docs/static/examples/components/scroll-area-workflows.html",
        1260,
      ],
      [
        "toast-workflows",
        "/docs/static/examples/components/toast-workflows.html",
        1200,
      ],
      [
        "range-slider-workflows",
        "/docs/static/examples/components/range-slider-workflows.html",
        720,
      ],
      [
        "dropdown-menu-workflows",
        "/docs/static/examples/components/dropdown-menu-workflows.html",
        1380,
      ],
      [
        "hover-card-workflows",
        "/docs/static/examples/components/hover-card-workflows.html",
        1040,
      ],
      [
        "hover-card-rtl",
        "/docs/static/examples/components/hover-card-rtl.html",
        1040,
      ],
      [
        "popover-workflows",
        "/docs/static/examples/components/popover-workflows.html",
        1200,
      ],
      [
        "popover-rtl",
        "/docs/static/examples/components/popover-rtl.html",
        1260,
      ],
      [
        "tooltip-workflows",
        "/docs/static/examples/components/tooltip-workflows.html",
        1000,
      ],
      ["tooltip-rtl", "/docs/static/examples/components/tooltip-rtl.html", 480],
      [
        "menubar-workflows",
        "/docs/static/examples/components/menubar-workflows.html",
        2400,
      ],
      ["menubar-rtl", "/docs/static/examples/components/menubar-rtl.html", 720],
      [
        "navigation-menu-workflows",
        "/docs/static/examples/components/navigation-menu-workflows.html",
        1100,
      ],
      [
        "navigation-menu-rtl",
        "/docs/static/examples/components/navigation-menu-rtl.html",
        720,
      ],
    ] as const
  ).entries()) {
    if (index > 0 && index % 20 === 0) {
      await page.close();
      page = await context.newPage();
    }
    await page.setViewportSize({ height, width: 390 });
    await page.goto(path);
    const metrics = await page.evaluate(() => ({
      height: document.documentElement.scrollHeight,
      width: document.documentElement.scrollWidth,
    }));
    expect(metrics.height, `${name} height`).toBeLessThanOrEqual(height);
    expect(metrics.width, `${name} width`).toBeLessThanOrEqual(390);
  }
});
