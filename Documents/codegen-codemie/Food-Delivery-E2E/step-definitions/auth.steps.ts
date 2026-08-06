import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { FoodDeliveryWorld } from "../support/world";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

// ─── Navigation ───────────────────────────────────────────────────────────────

Given("I navigate to {string}", async function (this: FoodDeliveryWorld, path: string) {
  await this.page.goto(new URL(path, this.baseURL).toString(), {
    waitUntil: "domcontentloaded"
  });
});

// ─── Storage helpers ──────────────────────────────────────────────────────────

Given(
  "I set sessionStorage {string} to {string}",
  async function (this: FoodDeliveryWorld, key: string, value: string) {
    // Must be on the app origin before writing sessionStorage
    await this.page.goto(this.baseURL, { waitUntil: "domcontentloaded" });
    await this.page.evaluate(
      ([k, v]) => sessionStorage.setItem(k, v),
      [key, value] as [string, string]
    );
  }
);

Given(
  "I clear sessionStorage {string}",
  async function (this: FoodDeliveryWorld, key: string) {
    await this.page.goto(this.baseURL, { waitUntil: "domcontentloaded" });
    await this.page.evaluate((k) => sessionStorage.removeItem(k), key);
  }
);

// ─── Login page assertions ────────────────────────────────────────────────────

Then(
  "the login page form should be visible",
  async function (this: FoodDeliveryWorld) {
    await expect(this.page.locator('[data-testid="login-page"]')).toBeVisible();
    await expect(this.page.locator('[data-testid="login-email"]')).toBeVisible();
    await expect(this.page.locator('[data-testid="login-password"]')).toBeVisible();
    await expect(this.page.locator('[data-testid="login-submit"]')).toBeVisible();
  }
);

// ─── Register page assertions ─────────────────────────────────────────────────

Then(
  "the register page form should be visible",
  async function (this: FoodDeliveryWorld) {
    await expect(this.page.locator('[data-testid="register-page"]')).toBeVisible();
    await expect(this.page.locator('[data-testid="register-name"]')).toBeVisible();
    await expect(this.page.locator('[data-testid="register-email"]')).toBeVisible();
    await expect(this.page.locator('[data-testid="register-password"]')).toBeVisible();
    await expect(this.page.locator('[data-testid="register-submit"]')).toBeVisible();
  }
);

// ─── Login action ─────────────────────────────────────────────────────────────

When(
  "I login with valid credentials",
  async function (this: FoodDeliveryWorld) {
    const email = requireEnv("E2E_USER_EMAIL");
    const password = requireEnv("E2E_USER_PASSWORD");

    await this.page.locator('[data-testid="login-email"]').fill(email);
    await this.page.locator('[data-testid="login-password"]').fill(password);

    // IMPORTANT: the terms checkbox is required — must be checked before submit
    const termsCheckbox = this.page.locator(
      '[data-testid="login-page"] .auth-condition input[type="checkbox"]'
    );
    await expect(termsCheckbox).toBeVisible();
    if (!(await termsCheckbox.isChecked())) {
      await termsCheckbox.check();
    }

    await Promise.all([
      this.page.waitForURL((url) => !url.pathname.startsWith("/login"), {
        timeout: 10000
      }),
      this.page.locator('[data-testid="login-submit"]').click()
    ]);
  }
);

// ─── Redirect assertion ───────────────────────────────────────────────────────

Then(
  "I should be redirected to {string}",
  async function (this: FoodDeliveryWorld, expectedPath: string) {
    const expected = new URL(expectedPath, this.baseURL).toString();
    await expect(this.page).toHaveURL(expected, { timeout: 10000 });
  }
);

// ─── localStorage assertions ──────────────────────────────────────────────────

Then(
  "localStorage {string} should be set",
  async function (this: FoodDeliveryWorld, key: string) {
    const value = await this.page.evaluate(
      (k) => localStorage.getItem(k),
      key
    );
    expect(value, `Expected localStorage["${key}"] to be non-empty`).toBeTruthy();
  }
);

Then(
  "localStorage {string} should be cleared",
  async function (this: FoodDeliveryWorld, key: string) {
    const value = await this.page.evaluate(
      (k) => localStorage.getItem(k),
      key
    );
    expect(value).toBeNull();
  }
);

// ─── Navbar state assertions ──────────────────────────────────────────────────

Then(
  "the navbar profile should be visible",
  async function (this: FoodDeliveryWorld) {
    await expect(this.page.locator(".navbar-profile")).toBeVisible({
      timeout: 10000
    });
  }
);

Then(
  "the logged out navbar should be visible",
  async function (this: FoodDeliveryWorld) {
    await expect(
      this.page.locator('[data-testid="navbar-signin"]')
    ).toBeVisible();
    await expect(
      this.page.locator('[data-testid="navbar-signup"]')
    ).toBeVisible();
  }
);

// ─── Logged-in setup helper ───────────────────────────────────────────────────

Given("I am logged in via UI", async function (this: FoodDeliveryWorld) {
  await this.page.goto(new URL("/login", this.baseURL).toString(), {
    waitUntil: "domcontentloaded"
  });

  const email = requireEnv("E2E_USER_EMAIL");
  const password = requireEnv("E2E_USER_PASSWORD");

  await this.page.locator('[data-testid="login-email"]').fill(email);
  await this.page.locator('[data-testid="login-password"]').fill(password);

  const termsCheckbox = this.page.locator(
    '[data-testid="login-page"] .auth-condition input[type="checkbox"]'
  );
  await expect(termsCheckbox).toBeVisible();
  if (!(await termsCheckbox.isChecked())) await termsCheckbox.check();

  await Promise.all([
    this.page.waitForURL((url) => !url.pathname.startsWith("/login"), {
      timeout: 10000
    }),
    this.page.locator('[data-testid="login-submit"]').click()
  ]);

  await expect(this.page.locator(".navbar-profile")).toBeVisible({
    timeout: 10000
  });
  const token = await this.page.evaluate(() => localStorage.getItem("token"));
  expect(token, "Expected token in localStorage after login").toBeTruthy();
});

// ─── Logout action ────────────────────────────────────────────────────────────

When("I logout via navbar", async function (this: FoodDeliveryWorld) {
  // Hover .navbar-profile to reveal the CSS :hover-only dropdown
  await this.page.locator(".navbar-profile").hover();
  await expect(
    this.page.locator('[data-testid="navbar-signout"]')
  ).toBeVisible({ timeout: 5000 });
  await this.page.locator('[data-testid="navbar-signout"]').click();

  // Wait for navigation back to home
  await this.page.waitForURL(new URL("/", this.baseURL).toString(), {
    timeout: 10000
  });
});

// ─── Reload action ────────────────────────────────────────────────────────────

When("I reload the page", async function (this: FoodDeliveryWorld) {
  await this.page.reload({ waitUntil: "domcontentloaded" });
});

// ─── Security: origin check ───────────────────────────────────────────────────

Then(
  "I should remain on the application origin",
  async function (this: FoodDeliveryWorld) {
    const current = new URL(this.page.url());
    const expected = new URL(this.baseURL);
    expect(current.origin).toBe(expected.origin);
  }
);
