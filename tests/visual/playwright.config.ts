import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  use: {},
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
