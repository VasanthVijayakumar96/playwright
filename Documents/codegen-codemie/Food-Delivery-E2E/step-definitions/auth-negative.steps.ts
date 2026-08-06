import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { FoodDeliveryWorld } from "../support/world";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error("Missing required env var: " + name);
  return v;
}

// ─── TC-AUTH-NEG-001  Login with empty email ──────────────────────────────────
//
// The login form uses HTML5 browser-native validation (required + type="email").
// When submit is clicked with the email field empty, the browser prevents
// submission and shows a validation bubble. No navigation occurs.

When(
  "I submit the login form with password filled but email empty",
  async function (this: FoodDeliveryWorld) {
    // Fill password only; leave email blank (required validation blocks submit)
    await this.page
      .locator('[data-testid="login-password"]')
      .fill(process.env.E2E_USER_PASSWORD ?? "AnyPasswordWillTriggerValidation!");
    await this.page.locator('[data-testid="login-submit"]').click();
    // Short pause to confirm no navigation was initiated
    await this.page.waitForTimeout(500);
  }
);

// ─── TC-AUTH-NEG-002  Login with empty password ───────────────────────────────

When(
  "I submit the login form with email filled but password empty",
  async function (this: FoodDeliveryWorld) {
    // Fill email only; leave password blank (required validation blocks submit)
    await this.page
      .locator('[data-testid="login-email"]')
      .fill(process.env.E2E_USER_EMAIL ?? "anyemail@example.com");
    await this.page.locator('[data-testid="login-submit"]').click();
    await this.page.waitForTimeout(500);
  }
);

// ─── TC-AUTH-NEG-003  Login with wrong credentials ───────────────────────────
//
// All required fields are filled (including the terms checkbox) so the form
// passes client-side validation and reaches the backend API. The backend then
// rejects the bad password and the app displays a react-toastify error toast.

When(
  "I submit the login form with wrong credentials",
  async function (this: FoodDeliveryWorld) {
    await this.page
      .locator('[data-testid="login-email"]')
      .fill(process.env.E2E_USER_EMAIL ?? "anyemail@example.com");
    await this.page
      .locator('[data-testid="login-password"]')
      .fill("wrong-password-that-will-never-match!");

    // Terms checkbox must be checked or the form will not reach the API
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
    // All inputs are empty by default; clicking submit triggers browser
    // required-field validation and prevents form submission.
    await this.page.locator('[data-testid="register-submit"]').click();
    await this.page.waitForTimeout(500);
  }
);

// ─── TC-AUTH-NEG-005  Register with invalid email format ─────────────────────

When(
  "I fill the register form with name and password but an invalid email",
  async function (this: FoodDeliveryWorld) {
    await this.page.locator('[data-testid="register-name"]').fill("Test User");
    // "not-an-email" passes required validation but fails type="email" format check
    await this.page
      .locator('[data-testid="register-email"]')
      .fill("not-an-email");
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
    // Compare only the pathname so scheme/host/port differences are ignored
    const expectedPathname = new URL(expectedPath, this.baseURL).pathname;
    const currentPathname = new URL(this.page.url()).pathname;
    expect(
      currentPathname,
      ["Expected to remain on", expectedPath, "but pathname is now", currentPathname].join(" ")
    ).toBe(expectedPathname);
  }
);

Then(
  "an error message should be visible",
  async function (this: FoodDeliveryWorld) {
    // react-toastify renders notifications inside .Toastify__toast elements.
    // Wait up to 10 s for the API call to complete and the toast to appear.
    await expect(this.page.locator(".Toastify__toast")).toBeVisible({
      timeout: 10000,
    });
  }
);