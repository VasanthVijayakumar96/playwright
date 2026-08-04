# Playwright Test Automation Framework for Food-Delivery-Tests

This repository contains an end-to-end (E2E) test automation framework built with **Playwright** for the **Food-Delivery** application. It is designed to be scalable, maintainable, and easy to run locally or in CI.

## Tech Stack

- **Playwright**
- **Node.js**
- **TypeScript / JavaScript** (depending on project setup)
- **GitHub Actions / CI** (optional)

## Project Structure

- `tests/` — Test specs
- `pages/` — Page Object Model (POM) classes
- `fixtures/` — Shared setup and test data
- `utils/` — Helpers and reusable utilities
- `playwright.config.*` — Playwright configuration
- `package.json` — Dependencies and scripts

## Prerequisites

- Node.js (LTS recommended)
- npm or yarn

## Installation

1. Clone the repository:
   - `git clone <repo-url>`
   - `cd Food-Delivery-Tests`

2. Install dependencies:
   - `npm install`

3. Install Playwright browsers:
   - `npx playwright install`

## Running Tests

- Run all tests:
  - `npx playwright test`

- Run tests in headed mode:
  - `npx playwright test --headed`

- Run a specific test file:
  - `npx playwright test tests/<test-file>.spec.ts`

- Run tests with a specific project (browser):
  - `npx playwright test --project=chromium`

## Reporting

- Generate and open Playwright HTML report:
  - `npx playwright show-report`

## Environment Configuration

If the framework uses environment variables (e.g., base URL, credentials), create a `.env` file in the root and provide required values. Example:

- `BASE_URL=https://your-app-url.com`
- `USERNAME=your-username`
- `PASSWORD=your-password`

## CI (Optional)

This framework can be run in CI using GitHub Actions or any other CI provider. Ensure Playwright dependencies are installed and the required environment variables/secrets are configured.

## Contributing

- Keep tests readable and deterministic
- Use Page Objects for UI interactions
- Avoid hard waits; prefer Playwright auto-waiting and explicit waits where needed
- Add meaningful assertions and maintain stable selectors

## License

This project is intended for internal/testing purposes.