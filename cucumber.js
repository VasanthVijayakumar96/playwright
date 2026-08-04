require("dotenv").config();

module.exports = {
  default: {
    require: [
      "support/world.ts",
      "support/hooks.ts",
      "step-definitions/**/*.ts"
    ],
    requireModule: ["ts-node/register"],
    format: [
      "progress-bar",
      "html:reports/cucumber-report.html",
      "json:reports/cucumber-report.json"
    ],
    formatOptions: { snippetInterface: "async-await" },
    tags: "not @skip and not @blocked",
    publishQuiet: true
  }
};
