import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../support/world";

// lastResponse is declared directly on CustomWorld in support/world.ts

When(
  "I send a GET request to {string}",
  async function (this: CustomWorld, path: string) {
    this.lastResponse = await this.request.get(path);
  }
);

Then(
  "the response status should be {int}",
  async function (this: CustomWorld, expectedStatus: number) {
    const res = this.lastResponse;
    expect(
      res,
      "No response found — did you call the GET request step first?"
    ).toBeTruthy();
    expect(res!.status()).toBe(expectedStatus);
  }
);

Then(
  "the response JSON should equal:",
  async function (this: CustomWorld, docString: string) {
    const res = this.lastResponse;
    expect(res, "No response found").toBeTruthy();

    const actual = await res!.json();
    const expected = JSON.parse(docString.trim());
    expect(actual).toEqual(expected);
  }
);
