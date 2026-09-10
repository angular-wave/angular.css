import { defineConfig, devices } from "@playwright/test";

const port = process.env.HUGO_TEST_PORT ?? "4102";
const baseURL = `http://127.0.0.1:${port}/angular.css/`;

export default defineConfig({
  testDir: "./docs/tests",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: "html",
  use: {
    baseURL,
    screenshot: "only-on-failure",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: `npm run build:test-artifacts && hugo server --source docs --disableFastRender --renderToMemory --port ${port} --bind 127.0.0.1`,
    url: baseURL,
    timeout: 120_000,
    reuseExistingServer: false,
  },
});
