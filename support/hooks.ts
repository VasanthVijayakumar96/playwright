import { setDefaultTimeout } from "@cucumber/cucumber";

// Allow up to 30 s per step before timing out.
// Screenshot-on-failure is handled inside the After hook in support/world.ts
// (before browser teardown) to ensure the page is still open when the
// screenshot is taken.
setDefaultTimeout(30_000);
