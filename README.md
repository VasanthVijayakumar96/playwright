# Food-Delivery-Tests

End-to-end (E2E) test automation framework for a Food Delivery web application using Playwright + Cucumber BDD + TypeScript.

---

## Tech Stack

- Playwright
- Cucumber (BDD)
- TypeScript
- Node.js
- npm

---

## Project Structure

- features/  
  - step-definitions/  
  - support/  
  - \*.feature  
- src/  
  - pages/  
  - utils/  
- test-results/  
- playwright.config.ts  
- cucumber.js  
- tsconfig.json

---

## Prerequisites

- Node.js (LTS recommended)
- npm

---

## Installation

1. Clone the repository
2. Install dependencies

    npm install

---

## Running Tests

### Run all tests

    npm test

### Run with tags

    npm test -- --tags @smoke

### Run headed

    npm run test:headed

### Run in UI mode (Playwright UI)

    npm run test:ui

---

## Reports

- Cucumber reports are generated under:

    test-results/

- Playwright traces/screenshots (if enabled) are stored under:

    test-results/

---

## Environment Configuration

You can configure environment variables using a `.env` file at the project root (if supported in your setup). Typical variables:

| Variable | Description |
|---------|-------------|
| BASE_URL | Base URL of the application under test |
| HEADLESS | Run browser in headless mode (true/false) |

---

## Sample Feature

    Feature: Place an order
      Scenario: User places an order successfully
        Given user is on the home page
        When user searches for a restaurant
        And user adds an item to the cart
        Then order should be placed successfully

---

## Scripts (example)

| Script | Description |
|--------|-------------|
| npm test | Run cucumber tests |
| npm run test:headed | Run tests in headed mode |
| npm run test:ui | Run Playwright UI mode |

---

## Notes

- Use Page Object Model (POM) under `src/pages`.
- Keep selectors stable and prefer role/text-based locators.
- Store reusable helpers under `src/utils`.

---

## License

MIT