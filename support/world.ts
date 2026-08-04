import { World, IWorldOptions, setWorldConstructor, Before, After } from "@cucumber/cucumber";
import { chromium, Browser, Page, APIRequestContext, request as playwrightRequest } from "playwright";
import type { APIResponse } from "playwright";
import { Status } from "@cucumber/cucumber";
import * as dotenv from "dotenv";

dotenv.config();

export class CustomWorld extends World {
  browser!: Browser;
  page!: Page;
  request!: APIRequestContext;

  /** Stores the last API response for assertion steps in api.steps.ts */
  lastResponse?: APIResponse;

  baseURL: string;
  backendURL: string;

  constructor(options: IWorldOptions) {
    super(options);
    this.baseURL = process.env.FRONTEND_BASE_URL ?? "http://localhost:5173";
    this.backendURL = process.env.BACKEND_BASE_URL ?? "http://localhost:4000";
  }
}

setWorldConstructor(CustomWorld);

Before(async function (this: CustomWorld) {
  const headlessEnv = (process.env.HEADLESS ?? "true").toLowerCase();
  const headless = headlessEnv !== "false";

  this.browser = await chromium.launch({ headless });
  const context = await this.browser.newContext({
    viewport: { width: 1280, height: 720 }
  });

  this.page = await context.newPage();

  // API context for backend calls (TC-API-001)
  this.request = await playwrightRequest.newContext({
    baseURL: this.backendURL
  });
});

After(async function (this: CustomWorld, scenario) {
  // Take a screenshot on failure BEFORE closing the browser
  if (scenario.result?.status === Status.FAILED && this.page) {
    try {
      const screenshot = await this.page.screenshot({ fullPage: true });
      this.attach(screenshot, "image/png");
    } catch {
      // swallow — page may have navigated away or be unresponsive
    }
  }

  if (this.request) await this.request.dispose();
  if (this.browser) await this.browser.close();
});
