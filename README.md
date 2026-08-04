# Food Delivery Playwright + Cucumber BDD + TypeScript Test Suite

End-to-end (E2E) test automation framework for a Food Delivery web application using **Playwright**, **Cucumber (BDD)**, and **TypeScript**.

---

## Tech Stack

- **Node.js**
- **TypeScript**
- **Playwright**
- **Cucumber (BDD)**
- **@playwright/test** (runner utilities + assertions)
- **dotenv** (environment configuration)
- **ESLint / Prettier** (optional linting/formatting)

---

## Project Structure

A typical structure for this framework:

- `features/`  
  Cucumber feature files (`.feature`)
- `features/step-definitions/`  
  Step definitions in TypeScript
- `features/support/`  
  Cucumber hooks, custom world, fixtures
- `src/`  
  Page Objects, helpers, utilities
- `config/`  
  Environment configs, Playwright/Cucumber configuration
- `reports/`  
  Generated test reports
- `playwright.config.ts`  
  Playwright configuration
- `cucumber.js` (or `cucumber.mjs`)  
  Cucumber configuration

---

## Prerequisites

- Node.js (LTS recommended)
- npm (or yarn/pnpm)

---

## Installation

1. Install dependencies:

   npm install

2. Install Playwright browsers:

   npx playwright install

---

## Environment Configuration

Create a `.env` file in the project root (or use existing environment files if provided):

- `BASE_URL=https://your-food-delivery-app.com`
- `HEADLESS=true`
- `BROWSER=chromium`

Adjust as needed for your environments.

---

## Running Tests

### Run all tests

npm test

### Run with tags

npm run test:tags -- --tags "@smoke"

### Run in headed mode

HEADLESS=false npm test

### Run on a specific browser

BROWSER=firefox npm test

---

## Reports

Framework may generate reports in `reports/` depending on configuration. Common report types:

- Cucumber HTML report
- JSON report for CI parsing
- Playwright traces/screenshots/videos on failure (if enabled)

---

## Writing Tests (BDD)

### Feature file example

Feature: Order food delivery

  @smoke
  Scenario: User places an order successfully
    Given the user is on the home page
    When the user searches for "Pizza"
    And the user adds the first item to the cart
    And the user checks out
    Then the order should be placed successfully

### Step definitions

Implement corresponding steps in `features/step-definitions/*.ts` using Playwright’s `page` and your Page Objects.

---

## Page Object Model (POM)

Keep UI interactions in Page Objects under `src/pages/`. Example responsibilities:

- Locators and actions
- Screen-specific assertions
- Reusable flows (search, add to cart, checkout)

---

## Hooks & Fixtures

Use `features/support/` to define:

- Browser/page lifecycle
- Before/After hooks
- Screenshot/trace capture on failure
- Shared context via Cucumber World

---

## Best Practices

- Keep steps readable and business-focused (BDD)
- Move UI details to Page Objects
- Use stable locators (data-testid preferred)
- Avoid hard waits; use Playwright auto-waits and proper assertions
- Keep tests independent and deterministic

---

## CI Integration

Recommended CI steps:

- Install dependencies
- Install Playwright browsers
- Run tests headless
- Publish artifacts: reports, screenshots, traces, videos (if configured)

---

## Troubleshooting

- If browsers are missing:  
  npx playwright install

- If tests are flaky:
  - Replace timeouts with proper assertions
  - Ensure stable selectors
  - Review network stubbing or environment stability

---

## License

Internal / Project-specific.