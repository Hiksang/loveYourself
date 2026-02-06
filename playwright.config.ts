import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 60000,
  expect: { timeout: 15000 },
  fullyParallel: false,
  retries: 2,
  workers: 1,
  use: {
    baseURL: process.env.BASE_URL || "http://localhost:3111",
    screenshot: "only-on-failure",
    trace: "on-first-retry",
  },
  webServer: {
    command: "pnpm dev --port 3111",
    port: 3111,
    reuseExistingServer: false,
    timeout: 60000,
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
  ],
});
