import { defineConfig } from "@playwright/test";
import { join } from "node:path";
import { tmpdir } from "node:os";

// Unit tests run in Node; e2e tests drive the installed Chrome against a production build.
// Run `npm run build` first, then `npm test`.
const PORT = 3150;
export const ADMIN_TEST_PASSWORD = "e2e-admin-password";
// Set once in the runner; worker processes inherit it, so tests and the server share one directory.
process.env.HB_E2E_DATA_DIR ??= join(tmpdir(), `hb-e2e-${Date.now()}`);
export const E2E_DATA_DIR = process.env.HB_E2E_DATA_DIR;

export default defineConfig({
  timeout: 60_000,
  // Hard stop so a hung run can never block indefinitely.
  globalTimeout: 15 * 60_000,
  workers: 1,
  reporter: [["list"]],
  projects: [
    { name: "unit", testDir: "tests/unit" },
    {
      name: "e2e",
      testDir: "tests/e2e",
      use: { baseURL: `http://localhost:${PORT}`, channel: "chrome", headless: true },
    },
  ],
  // Unit-only runs (npm run test:unit) skip the web server.
  webServer: process.argv.includes("--project=unit") ? undefined : {
    command: `npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}/robots.txt`,
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      ADMIN_PASSWORD: ADMIN_TEST_PASSWORD,
      ADMIN_INSECURE_COOKIE: "1",
      HB_DATA_DIR: E2E_DATA_DIR,
    },
  },
});
