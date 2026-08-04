# Playwright + Cucumber BDD Framework

Automated end-to-end (E2E) testing framework using **Playwright** with **Cucumber (BDD)**. This project supports cross-browser testing, tagged execution, environment configuration, reporting, and reusable step definitions.

---

## Tech Stack

- **Node.js** (LTS recommended)
- **Playwright** (E2E browser automation)
- **Cucumber.js** (BDD runner)
- **TypeScript** (typed test code)
- **ESLint / Prettier** (code quality & formatting)
- **Allure** (optional rich reporting) / built-in HTML report

---

## Prerequisites

- **Node.js**: `>= 18.x` (LTS recommended)
- **npm** (bundled with Node) or **pnpm/yarn** (if your repo is configured for it)
- Installed Playwright browsers (done during setup)
- Access to target environments (URLs, credentials, and any required VPN)

---

## Setup

1. Install dependencies:
   - `npm install`

2. Install Playwright browsers:
   - `npx playwright install`

3. (Optional) Install system dependencies for Linux CI:
   - `npx playwright install-deps`

4. Configure environment variables (choose one approach):
   - Create `.env` in the project root (if supported by your setup), or
   - Export variables in your shell/CI pipeline

Common environment variables (examples):
- `BASE_URL=https://your-app-url`
- `ENV=local|dev|qa|staging|prod`
- `HEADLESS=true|false`
- `BROWSER=chromium|firefox|webkit`
- `PWDEBUG=0|1`

---

## Running Tests

### Run all tests

- `npm test`

### Run Cucumber features directly

- `npx cucumber-js`

### Run by tag

- `npx cucumber-js --tags "@smoke"`
- `npx cucumber-js --tags "@regression"`
- `npx cucumber-js --tags "@smoke and not @wip"`

### Run in a specific browser

Depending on how your project is wired (env-driven is typical):

- `BROWSER=chromium npx cucumber-js`
- `BROWSER=firefox npx cucumber-js`
- `BROWSER=webkit npx cucumber-js`

### Headed vs headless

- `HEADLESS=false npx cucumber-js`
- `HEADLESS=true npx cucumber-js`

### Debug mode

- `PWDEBUG=1 npx cucumber-js`

You can also use:
- `npx playwright codegen <url>` for selector exploration and quick flows.

---

## Reports

### Playwright HTML report

If your framework generates Playwright HTML reports:
- After a run, open:
  - `npx playwright show-report`

### Cucumber reports

If configured with Cucumber HTML/JSON output:
- JSON output is typically written under a `reports/` or `test-results/` folder.
- Generate HTML from JSON (if applicable to your scripts):
  - `npm run report`

### Allure reports (optional)

If Allure is enabled:
- Generate:
  - `npm run allure:generate`
- Open:
  - `npm run allure:open`

---

## Project Structure

Typical structure (may vary slightly by repo conventions):

- `features/`
  - `.feature` files (Gherkin scenarios)
- `features/step-definitions/`
  - Step definition implementations
- `features/support/`
  - Cucumber hooks (`Before`, `After`), World configuration
- `src/`
  - Reusable utilities (API clients, helpers, fixtures)
  - Page Objects (if used)
- `playwright.config.*`
  - Playwright configuration
- `cucumber.*` / `cucumber.js`
  - Cucumber runner configuration
- `reports/` or `test-results/`
  - Execution artifacts (screenshots, videos, traces, JSON)

---

## Test Coverage

This framework is intended for:
- Smoke tests (critical path)
- Regression suites (broad coverage)
- Cross-browser verification
- Visual checks (if configured)
- Accessibility checks (if configured)

Recommended tagging strategy:
- `@smoke` — short, stable, must-pass suite
- `@regression` — full suite
- `@wip` — work in progress; exclude from CI
- `@flaky` — unstable scenarios; isolate and fix

---

## Selector Reference

Prefer resilient selectors in the following order:

1. **Role-based selectors (recommended)**
   - `page.getByRole('button', { name: 'Save' })`
   - `page.getByRole('textbox', { name: 'Email' })`

2. **Label-based selectors**
   - `page.getByLabel('Password')`

3. **Test IDs (highly recommended for stability)**
   - `page.getByTestId('submit-button')`
   - Use consistent attributes like `data-testid="..."`

4. **Text selectors (use sparingly)**
   - `page.getByText('Welcome')`

5. **CSS/XPath (avoid when possible)**
   - `page.locator('.some .deep .css')`
   - Only if no stable semantic/test-id selector exists

Guidelines:
- Avoid brittle selectors tied to layout or styling.
- Add `data-testid` attributes for interactive elements and key components.
- Use `locator` chaining for scoped selection (e.g., within a modal).

---

## Storage Keys

If the framework uses persisted authentication/state, storage is typically handled via:

- Playwright storage state file:
  - `storageState.json` (name may vary)
- Local/session storage keys may include (examples; adjust to your app):
  - `access_token`
  - `refresh_token`
  - `id_token`
  - `auth`
  - `user`
  - `tenant`
  - `locale`

Best practices:
- Do not commit real tokens or credentials.
- Store only the minimal required state.
- Rotate and invalidate tokens used in CI if applicable.

---

## Implementation Notes

### Cucumber World + Playwright

- A custom `World` is commonly used to share `page`, `context`, and helpers across steps.
- Hooks (`Before`, `After`) create and tear down the browser context per scenario for isolation.
- On failure, hooks should capture:
  - Screenshot
  - Trace (if enabled)
  - Video (if enabled)
  - Console logs (optional)

### Parallelism

- If enabled, ensure scenarios are isolated (no shared mutable state).
- Prefer separate browser contexts per scenario.
- Avoid writing to shared files from multiple workers unless coordinated.

### Retries and timeouts

- Use retries sparingly and fix root causes of flakiness.
- Keep timeouts consistent:
  - Navigation / action timeouts for UI
  - Explicit waits only when necessary (prefer Playwright auto-wait)

### CI recommendations

- Run headless in CI.
- Use tags to split smoke/regression jobs.
- Archive artifacts:
  - `reports/` / `test-results/`
  - traces/videos/screenshots
- Pin Node and Playwright versions for reproducibility.

---