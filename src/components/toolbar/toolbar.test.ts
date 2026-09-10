import { expect, test } from "@playwright/test";

test("toolbar exposes one tab stop and skips disabled actions", async ({
  page,
}) => {
  await page.goto("/src/components/toolbar/toolbar.html");
  const toolbar = page.getByRole("toolbar", { name: "Document actions" });
  const undo = toolbar.getByRole("button", { name: "Undo" });
  const redo = toolbar.getByRole("button", { name: "Redo" });
  const copy = toolbar.getByRole("button", { name: "Copy" });

  await expect(undo).toHaveAttribute("tabindex", "0");
  await expect(redo).toHaveAttribute("tabindex", "-1");
  await undo.focus();
  await undo.press("ArrowRight");
  await expect(copy).toBeFocused();
  await copy.press("End");
  await expect(toolbar.getByRole("button", { name: "Export" })).toBeFocused();
  await page.keyboard.press("Home");
  await expect(undo).toBeFocused();

  await redo.evaluate((button) => button.removeAttribute("disabled"));
  await expect(redo).not.toHaveAttribute("aria-disabled");
  await undo.press("ArrowRight");
  await expect(redo).toBeFocused();
});

test("toolbar follows authored orientation and inherited RTL direction", async ({
  page,
}) => {
  await page.goto("/src/components/toolbar/toolbar.html");
  const toolbar = page.getByRole("toolbar", { name: "Document actions" });
  const undo = toolbar.getByRole("button", { name: "Undo" });
  const copy = toolbar.getByRole("button", { name: "Copy" });

  await toolbar.evaluate((element) =>
    element.setAttribute("aria-orientation", "vertical"),
  );
  await expect(toolbar).toHaveAttribute("aria-orientation", "vertical");
  await undo.focus();
  await undo.press("ArrowDown");
  await expect(copy).toBeFocused();

  await toolbar.evaluate((element) =>
    element.removeAttribute("aria-orientation"),
  );
  await page
    .locator("body")
    .evaluate((element) => element.setAttribute("dir", "rtl"));
  await undo.focus();
  await undo.press("ArrowLeft");
  await expect(copy).toBeFocused();
});
