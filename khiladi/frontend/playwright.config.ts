import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  timeout: 30000,
  expect: { timeout: 8000 },
  reporter: [
    ["list"],
    [
      "json",
      {
        outputFile: "../../docs/qa/reference-fidelity/playwright-results.json",
      },
    ],
  ],
  use: {
    baseURL: "http://127.0.0.1:3000",
    viewport: { width: 1440, height: 900 },
    launchOptions: {
      executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
      args: ["--no-sandbox"],
    },
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  outputDir: "../../docs/qa/reference-fidelity/test-artifacts",
});
