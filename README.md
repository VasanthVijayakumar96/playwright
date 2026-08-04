# Food Delivery Tests (Playwright)

This repository contains end-to-end tests for a Food Delivery application using **Playwright**.

## Tech Stack

- **Playwright**
- **Node.js**
- **TypeScript**

## Prerequisites

- Node.js (LTS recommended)
- npm (comes with Node.js)

## Installation

1. Install dependencies:

   npm install

2. Install Playwright browsers:

   npx playwright install

## Running Tests

- Run all tests:

  npx playwright test

- Run tests in headed mode:

  npx playwright test --headed

- Run a specific test file:

  npx playwright test path/to/test.spec.ts

- Run tests in a specific project (if configured):

  npx playwright test --project=chromium

## Reports

- Open the last HTML report:

  npx playwright show-report

## Configuration

- Playwright configuration is located at:

  playwright.config.ts

## Notes

- Ensure the application under test is running and accessible before executing the tests.
- Environment-specific values (e.g., base URL) should be configured via the Playwright config or environment variables as needed.