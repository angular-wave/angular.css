import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { expect, test } from "@playwright/test";

const examplesDirectory = fileURLToPath(
  new URL("../docs/static/examples/components/", import.meta.url),
);
const examples = readdirSync(examplesDirectory)
  .filter((name) => name.endsWith(".html"))
  .sort();

for (const example of examples) {
  test(`${example} fits supported mobile viewports`, async ({ page }) => {
    for (const width of [560, 390, 320]) {
      await page.setViewportSize({ height: 10_000, width });
      await page.goto("/docs/static/examples/components/" + example);

      const metrics = await page.evaluate(() => {
        const viewportWidth = window.innerWidth;
        const visible = (element: HTMLElement) => {
          const style = getComputedStyle(element);
          return (
            !element.hidden &&
            style.display !== "none" &&
            style.visibility !== "hidden" &&
            Number(style.opacity) > 0
          );
        };
        const containedByOverflow = (element: HTMLElement) => {
          let ancestor = element.parentElement;
          while (ancestor && ancestor !== document.body) {
            const style = getComputedStyle(ancestor);
            if (
              /auto|hidden|scroll/.test(
                `${style.overflow} ${style.overflowX} ${style.overflowY}`,
              )
            ) {
              return true;
            }
            ancestor = ancestor.parentElement;
          }
          return false;
        };
        const clipped = Array.from(
          document.body.querySelectorAll<HTMLElement>("*"),
        )
          .filter(visible)
          .map((element) => ({ element, box: element.getBoundingClientRect() }))
          .filter(({ box }) => box.width > 0 && box.height > 0)
          .filter(
            ({ element, box }) =>
              (box.left < -1 || box.right > viewportWidth + 1) &&
              !containedByOverflow(element),
          )
          .map(({ element, box }) => ({
            bounds: [
              Math.round(box.left),
              Math.round(box.right),
              Math.round(box.width),
            ],
            element:
              element.id ||
              (typeof element.className === "string" && element.className) ||
              element.tagName.toLowerCase(),
          }));
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

        return {
          clipped,
          documentWidth: document.documentElement.scrollWidth,
          roleClasses,
          viewportWidth,
        };
      });

      expect(
        metrics.documentWidth,
        `${example} document width at ${width}px`,
      ).toBeLessThanOrEqual(metrics.viewportWidth);
      expect(
        metrics.clipped,
        `${example} visible content clipped at ${width}px`,
      ).toEqual([]);
      expect(
        metrics.roleClasses,
        `${example} role-bearing elements must not need authored classes at ${width}px`,
      ).toEqual([]);
    }
  });
}
