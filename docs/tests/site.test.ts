import { expect, test, type Frame, type Page } from '@playwright/test';
import {
  catalogNames,
  catalogPolicy,
  type CatalogEntryName,
} from '../../scripts/component-policy.ts';

const openExample = async (
  page: Page,
  component: CatalogEntryName,
): Promise<Frame> => {
  await page.goto(`docs/${catalogPolicy[component].category}/${component}/`);
  const iframe = page.locator(
    `.angularcss-example-frame[src$="/examples/components/${component}.html"]`,
  );
  await expect(iframe).toHaveCount(1);
  await expect(iframe).not.toHaveAttribute('sandbox');
  await iframe.scrollIntoViewIfNeeded();

  const frameUrl = new RegExp(`/examples/components/${component}\\.html$`);
  await expect
    .poll(() => page.frames().some((frame) => frameUrl.test(frame.url())))
    .toBe(true);
  const frame = page.frame({ url: frameUrl });
  expect(frame, `${component}: example iframe did not load`).not.toBeNull();
  await frame!.waitForLoadState('load');
  return frame!;
};

test('homepage links every catalog entry in its canonical category', async ({
  page,
}) => {
  await page.goto('./');

  const componentLinks = page.locator('.component-catalog-list a');
  await expect(componentLinks).toHaveCount(catalogNames.length);

  const linkedComponents = await componentLinks.evaluateAll((links) =>
    links
      .map(
        (link) =>
          link.getAttribute('href')?.match(/\/docs\/([^/]+\/[^/]+)\/$/)?.[1],
      )
      .filter((component): component is string => Boolean(component))
      .sort(),
  );

  expect(linkedComponents).toEqual(
    catalogNames
      .map((name) => `${catalogPolicy[name].category}/${name}`)
      .sort(),
  );
});

test('every catalog page loads a bootstrapped local example', async ({
  page,
}) => {
  test.setTimeout(120_000);
  const failures: string[] = [];

  for (const component of catalogNames) {
    const errors: string[] = [];
    page.removeAllListeners('pageerror');
    page.on('pageerror', (error) => errors.push(error.message));

    const frame = await openExample(page, component);
    const state = await frame.evaluate(() => ({
      accessibleName: Boolean(
        document.body.querySelector('[aria-label], img[alt]:not([alt=""])'),
      ),
      angular: Boolean(window.angular),
      bodyText: document.body.innerText.trim(),
      module: Boolean(window.angular?.getModule('angular.css')),
      remoteAssets: Array.from(
        document.querySelectorAll('script[src], link[href]'),
        (element) =>
          element.getAttribute('src') ?? element.getAttribute('href') ?? '',
      ).filter((source) => /^(?:https?:)?\/\//i.test(source)),
    }));

    if (!state.angular) failures.push(`${component}: AngularTS did not load`);
    if (!state.module)
      failures.push(`${component}: angular.css module did not register`);
    if (!state.bodyText && !state.accessibleName) {
      failures.push(
        `${component}: example rendered no text or accessible name`,
      );
    }
    if (state.remoteAssets.length > 0) {
      failures.push(
        `${component}: loaded remote assets ${state.remoteAssets.join(', ')}`,
      );
    }
    if (errors.length > 0) {
      failures.push(`${component}: ${errors.join('; ')}`);
    }
  }

  expect(failures).toEqual([]);
});

test('published iframe interactions update component and AngularTS state', async ({
  page,
}) => {
  let frame = await openExample(page, 'accordion');
  const accordionItem = frame.locator('details').first();
  const accordionTrigger = accordionItem.locator('summary');
  await expect(accordionItem).toHaveAttribute('open', '');
  await accordionTrigger.click();
  await expect(accordionItem).not.toHaveAttribute('open');
  await accordionTrigger.click();
  await expect(accordionItem).toHaveAttribute('open', '');

  frame = await openExample(page, 'dropdown-menu');
  const dropdownTrigger = frame.getByRole('button', { name: 'Options' });
  await dropdownTrigger.click();
  await expect(dropdownTrigger).toHaveAttribute('aria-expanded', 'true');
  await expect(frame.locator('[ng-dropdown-menu]')).toHaveAttribute('open', '');
  await expect(frame.locator('[ng-dropdown-menu] > menu')).toBeVisible();

  frame = await openExample(page, 'tabs');
  const analyticsTab = frame.getByRole('tab', { name: 'Analytics' });
  await analyticsTab.click();
  await expect(analyticsTab).toHaveAttribute('aria-selected', 'true');

  frame = await openExample(page, 'dialog');
  await frame.getByRole('button', { name: 'Edit profile' }).click();
  await expect(frame.getByRole('dialog')).toBeVisible();

  frame = await openExample(page, 'input');
  await frame.locator('#docs-input-search').fill('functional');
  await expect(frame.locator('.output').first()).toContainText(
    'Value: functional',
  );

  frame = await openExample(page, 'range');
  await frame.locator('#volume').fill('42');
  await expect(frame.locator('output[for="volume"]')).toHaveText('42');

  frame = await openExample(page, 'range-slider');
  await frame.getByRole('slider', { name: 'Minimum price' }).fill('30');
  await frame.getByRole('slider', { name: 'Maximum price' }).fill('80');
  await expect(frame.locator('output')).toHaveText('30-80');

  frame = await openExample(page, 'switch');
  await frame.locator('#airplane-mode').check();
  await expect(frame.locator('output[aria-live="polite"]')).toContainText(
    'Mode enabled: true',
  );

  frame = await openExample(page, 'select');
  await frame.getByRole('combobox').selectOption('Done');
  await expect(frame.locator('.output').first()).toContainText('Current: Done');

  frame = await openExample(page, 'calendar');
  await expect(frame.locator('[ng-calendar] > div button[value]')).toHaveCount(
    42,
  );
  await frame.locator("[ng-calendar] button[value='2026-05-20']").click();
  await expect(frame.locator('.output')).toContainText('Selected: 2026-05-20');
  await frame.getByRole('button', { name: 'Next month' }).click();
  await expect(frame.getByRole('combobox', { name: 'Month' })).toHaveValue('5');
  const calendarViewport = await frame.evaluate(() => ({
    contentHeight: document.body.scrollHeight,
    viewportHeight: document.documentElement.clientHeight,
  }));
  expect(calendarViewport.contentHeight).toBeLessThanOrEqual(
    calendarViewport.viewportHeight,
  );
});

test('bookings application is published with local functional assets', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('docs/examples/bookings/');

  const iframe = page.locator(
    '.angularcss-example-frame[src$="/examples/applications/bookings/index.html"]',
  );
  await expect(iframe).toHaveCount(1);
  await iframe.scrollIntoViewIfNeeded();
  const frameUrl = /\/examples\/applications\/bookings\/(?:index\.html)?$/;
  await expect
    .poll(() => page.frames().some((frame) => frameUrl.test(frame.url())))
    .toBe(true);
  const frame = page.frame({ url: frameUrl });
  expect(frame).not.toBeNull();

  const visibleRows = frame!.locator('.booking-row:not(.ng-hide)');
  await expect(visibleRows).toHaveCount(8);
  await frame!.getByRole('searchbox').fill('Nora');
  await expect(visibleRows).toHaveCount(1);
  await visibleRows.first().locator('.booking-row-trigger').click();
  await expect(frame!.getByRole('dialog')).toContainText('Nora Hansen');

  const remoteAssets = await frame!.evaluate(() =>
    Array.from(
      document.querySelectorAll('script[src], link[href]'),
      (element) =>
        element.getAttribute('src') ?? element.getAttribute('href') ?? '',
    ).filter((source) => /^(?:https?:)?\/\//i.test(source)),
  );
  expect(remoteAssets).toEqual([]);
  expect(errors).toEqual([]);
});
