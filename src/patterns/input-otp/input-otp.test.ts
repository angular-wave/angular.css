import { expect, test } from "@playwright/test";

const canonicalUrl = "/src/patterns/input-otp/input-otp.html";
const workflowsUrl =
  "/docs/static/examples/components/input-otp-workflows.html";

test("input OTP uses one native autofill-compatible control", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  const input = page.getByLabel("One-time code");

  await expect(input).toHaveValue("123456");
  await expect(input).toHaveAttribute("autocomplete", "one-time-code");
  await expect(input).toHaveAttribute("inputmode", "numeric");
  await expect(input).toHaveAttribute("maxlength", "6");
  await expect(page.locator('input[autocomplete="one-time-code"]')).toHaveCount(
    1,
  );

  await input.fill("923456");
  await expect(page.getByRole("status")).toContainText("Code: 923456");
});

test("input OTP relies on native paste, editing, and maxlength", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  const input = page.getByLabel("One-time code");

  await input.fill("");
  await input.pressSequentially("6543219");
  await expect(input).toHaveValue("654321");
  await input.press("Backspace");
  await expect(input).toHaveValue("65432");
});

test("input OTP preserves native validity and disabled state", async ({
  page,
}) => {
  await page.goto(workflowsUrl);
  const pattern = page.getByLabel("Security code");
  const disabled = page.getByLabel("Disabled code");

  expect(
    await pattern.evaluate((control: HTMLInputElement) =>
      control.checkValidity(),
    ),
  ).toBe(false);
  await pattern.fill("123456");
  expect(
    await pattern.evaluate((control: HTMLInputElement) =>
      control.checkValidity(),
    ),
  ).toBe(true);
  await expect(disabled).toBeDisabled();
  await expect(page.getByLabel("Invalid code")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
});

test("input OTP workflows keep AngularTS model and direction ownership", async ({
  page,
}) => {
  await page.goto(workflowsUrl);
  const controlled = page.getByLabel("Verification code");
  const rtl = page.getByLabel("رمز التحقق");

  await controlled.fill("987654");
  await expect(page.locator(".input-otp-message")).toContainText(
    "Code: 987654",
  );
  await expect(rtl).toHaveCSS("direction", "rtl");
  await page.getByRole("button", { name: "Change direction" }).click();
  await expect(rtl).toHaveCSS("direction", "ltr");
  await expect(page.getByLabel("PIN")).toHaveAttribute("maxlength", "4");
});

test("input OTP composes with a native form", async ({ page }) => {
  await page.goto(
    "/docs/static/examples/components/input-otp-compositions.html",
  );
  const input = page.getByLabel("Verification code");

  await page.getByRole("button", { name: "Resend Code" }).click();
  await expect(page.getByRole("status")).toContainText("Code resent 1 time");
  await input.fill("123456");
  await page.getByRole("button", { name: "Verify" }).click();
  await expect(page.getByRole("status")).toContainText(
    "Verification submitted",
  );
});
