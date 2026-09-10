import { expect, test } from "@playwright/test";

import { testStyleOnlyElement } from "../../testing/style-only-element";

testStyleOnlyElement({
  category: "patterns",
  directive: "ngFileUpload",
  name: "file-upload",
  selector: 'section:has(> label > input[type="file"])',
});

test("file upload retains the native file input contract", async ({ page }) => {
  await page.goto("/src/patterns/file-upload/file-upload.html");
  const input = page.locator('input[type="file"]');
  await input.setInputFiles({
    buffer: Buffer.from("contract"),
    mimeType: "application/pdf",
    name: "contract.pdf",
  });
  expect(
    await input.evaluate((control: HTMLInputElement) => control.files?.length),
  ).toBe(1);
  await expect(page.locator("progress")).toHaveAttribute("value", "72");
});
