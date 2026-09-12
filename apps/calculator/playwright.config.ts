import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests", outputDir: "../../.local/browser-results", workers: 1,
  use: { baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:4175", channel: "chrome", headless: true, viewport: { width: 1440, height: 1000 }, screenshot: "only-on-failure" },
});
