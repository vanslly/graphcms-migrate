#!/usr/bin/env node
require("dotenv").config();

const meow = require("meow");
const chalk = require("chalk");
const updateNotifier = require("update-notifier");

const { migrate } = require("./migrate");

const cli = meow(
  `
  Usage:
    $ ${chalk.magenta("graphcms")} ${chalk.bold(
    "<path-to-migrations-directory>"
  )} ${chalk.dim("[options]")}

  Options:
    --endpoint, -e    GraphCMS endpoint with environment
    --token,    -t    GraphCMS token with content + management permissions
    --dry-run,  -d    Don't actually run migrations, just print them
`,
  {
    flags: {
      endpoint: {
        type: "string",
        alias: "e",
        default: process.env.GRAPHCMS_ENDPOINT || "",
      },
      token: {
        type: "string",
        alias: "t",
        default: process.env.GRAPHCMS_TOKEN || "",
      },
      dryRun: {
        type: "boolean",
        alias: "d",
        default: false,
      },
    },
  }
);

updateNotifier({ pkg: cli.pkg }).notify();

migrate(cli.input[0], cli.flags);
