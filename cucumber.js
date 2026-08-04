require("dotenv").config();

/** @type {import('@cucumber/cucumber').IConfiguration} */
module.exports = {
  default: {
    requireModule: ["ts-node/register"],
    require: ["support/**/*.ts", "steps/**/*.ts"],
    format: [
      "progress-bar",
      "json:reports/cucumber-report.json",
      "html:reports/cucumber-report.html"
    ],
    formatOptions: { snippetInterface: "async-await" },
    // Exclude @skip (pending / repeatability) and @blocked (not yet implementable)
    tags: "not @skip and not @blocked"
  }
};
