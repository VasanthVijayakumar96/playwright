import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { FoodDeliveryWorld } from "../support/world";

// ─── TC-AUTH-NEG-001  Login with empty email ──────────────────────────────────

When(
  "I submit the login form with password filled but email empty",
  async function (this: FoodDeliveryWorld) {
    await this.page
      .locator('[data-testid="login-password"]')
      .fill(process.env.E2E_USER_PASSWORD ?? "AnyPasswordWillTriggerValidation!");
    await this.page.locator('[data-testid="login-submit"]').click();
    await this.page.waitForTimeout(500);
  }
);

// ─── TC-AUTH-NEG-002  Login with empty password ───────────────────────────────

When(
  "I submit the login form with email filled but password empty",
  async function (this: FoodDeliveryWorld) {
    await this.page
      .locator('[data-testid="login-email"]')
      .fill(process.env.E2E_USER_EMAIL ?? "anyemail@example.com");
    await this.page.locator('[data-testid="login-submit"]').click();
    await this.page.waitForTimeout(500);
  }
);

// ─── TC-AUTH-NEG-003  Login with wrong credentials ───────────────────────────

When(
  "I submit the login form with wrong credentials",
  async function (this: FoodDeliveryWorld) {
    await this.page
      .locator('[data-testid="login-email"]')
      .fill(process.env.E2E_USER_EMAIL ?? "anyemail@example.com");
    await this.page
      .locator('[data-testid="login-password"]')
      .fill("wrong-password-that-will-never-match!");

    const termsCheckbox = this.page.locator(
      '[data-testid="login-page"] .auth-condition input[type="checkbox"]'
    );
    if (!(await termsCheckbox.isChecked())) {
      await termsCheckbox.check();
    }

    await this.page.locator('[data-testid="login-submit"]').click();
  }
);

// ─── TC-AUTH-NEG-004  Register with all fields empty ─────────────────────────

When(
  "I submit the register form with all fields empty",
  async function (this: FoodDeliveryWorld) {
    await this.page.locator('[data-testid="register-submit"]').click();
    await this.page.waitForTimeout(500);
  }
);

// ─── TC-AUTH-NEG-005  Register with invalid email format ─────────────────────

When(
  "I fill the register form with name and password but an invalid email",
  async function (this: FoodDeliveryWorld) {
    await this.page.locator('[data-testid="register-name"]').fill("Test User");
    await this.page.locator('[data-testid="register-email"]').fill("not-an-email");
    await this.page
      .locator('[data-testid="register-password"]')
      .fill("TestPassword123");
    await this.page.locator('[data-testid="register-submit"]').click();
    await this.page.waitForTimeout(500);
  }
);

// ─── Shared negative assertion steps ──────────────────────────────────────────

Then(
  "the page URL should still be {string}",
  async function (this: FoodDeliveryWorld, expectedPath: string) {
    const expectedPathname = new URL(expectedPath, this.baseURL).pathname;
    const currentPathname = new URL(this.page.url()).pathname;
    expect(
      currentPathname,
      [
        "Expected to remain on",
        expectedPath,
        "but pathname is now",
        currentPathname
      ].join(" ")
    ).toBe(expectedPathname);
  }
);

Then("an error message should be visible", async function (this: FoodDeliveryWorld) {
  await expect(this.page.locator(".Toastify__toast")).toBeVisible({
    timeout: 10000
  });
});
