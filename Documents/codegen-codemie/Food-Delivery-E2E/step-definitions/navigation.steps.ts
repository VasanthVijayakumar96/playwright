import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { FoodDeliveryWorld } from "../support/world";

// ─── localStorage helper ──────────────────────────────────────────────────────

Given(
  "I clear localStorage {string}",
  async function (this: FoodDeliveryWorld, key: string) {
    await this.page.goto(this.baseURL, { waitUntil: "domcontentloaded" });
    await this.page.evaluate((k) => localStorage.removeItem(k), key);
    // Reload so React re-reads localStorage (token check happens on mount)
    await this.page.reload({ waitUntil: "domcontentloaded" });
  }
);

// ─── Navbar assertions ────────────────────────────────────────────────────────

Then(
  "the navbar profile should not be visible",
  async function (this: FoodDeliveryWorld) {
    // .navbar-profile is only rendered when token is truthy
    await expect(this.page.locator(".navbar-profile")).toHaveCount(0);
  }
);

// ─── Navbar CTA clicks ────────────────────────────────────────────────────────

When(
  "I click the navbar Sign in button",
  async function (this: FoodDeliveryWorld) {
    await this.page.locator('[data-testid="navbar-signin"]').click();
    await this.page.waitForURL(/\/login$/, { timeout: 8000 });
  }
);

When(
  "I click the navbar Sign up button",
  async function (this: FoodDeliveryWorld) {
    await this.page.locator('[data-testid="navbar-signup"]').click();
    await this.page.waitForURL(/\/register$/, { timeout: 8000 });
  }
);

// ─── URL assertion ────────────────────────────────────────────────────────────

Then(
  "the URL should end with {string}",
  async function (this: FoodDeliveryWorld, suffix: string) {
    const escaped = suffix.replace(/\//g, "\/");
    await expect(this.page).toHaveURL(new RegExp(`${escaped}$`));
  }
);

Then(
  "the URL should contain {string}",
  async function (this: FoodDeliveryWorld, fragment: string) {
    const url = this.page.url();
    expect(url, `Expected URL to contain "${fragment}" but got "${url}"`).toContain(fragment);
  }
);

// ─── Browser back ─────────────────────────────────────────────────────────────

When("I go back", async function (this: FoodDeliveryWorld) {
  await this.page.goBack({ waitUntil: "domcontentloaded" });
});

// ─── Viewport check for anchored sections ─────────────────────────────────────

Then(
  "the element {string} should be in the viewport",
  async function (this: FoodDeliveryWorld, selector: string) {
    const loc = this.page.locator(selector);
    await expect(loc).toBeVisible({ timeout: 5000 });

    // Wait for smooth-scroll to settle (ScrollToHash uses a 50 ms timeout)
    await this.page.waitForTimeout(200);

    const inViewport = await loc.evaluate((el: Element) => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const vw = window.innerWidth || document.documentElement.clientWidth;
      // Accept partial visibility: at least the top edge is within the viewport
      return rect.top >= 0 && rect.top <= vh && rect.left >= 0 && rect.left <= vw;
    });

    expect(
      inViewport,
      `Expected element "${selector}" to be visible in the viewport after scroll`
    ).toBe(true);
  }
);

// ─── Crash / render check ─────────────────────────────────────────────────────

Then("the page should still render", async function (this: FoodDeliveryWorld) {
  await expect(this.page.locator("body")).toBeVisible();
});

Then(
  "there should be no fatal console errors",
  async function (this: FoodDeliveryWorld) {
    const fatalErrors: string[] = [];

    const onConsoleError = (msg: import("playwright").ConsoleMessage) => {
      if (msg.type() === "error") fatalErrors.push(msg.text());
    };
    this.page.on("console", onConsoleError);

    // Give the page a moment to emit any pending errors
    await this.page.waitForTimeout(300);
    this.page.off("console", onConsoleError);

    // Filter out known benign errors (network failures when backend is not running)
    const realErrors = fatalErrors.filter(
      (e) =>
        !e.includes("Failed to load resource") &&
        !e.includes("net::ERR_CONNECTION_REFUSED") &&
        !e.includes("favicon")
    );

    expect(
      realErrors,
      `Fatal console errors detected:\n${realErrors.join("\n")}`
    ).toEqual([]);
  }
);
