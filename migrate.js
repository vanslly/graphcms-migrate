const ora = require("ora");

const { createClient } = require("./utils/graphcms-client");
const {
  checkMigrationModelExists,
} = require("./utils/check-migration-model-exists");
const { createMigrationModel } = require("./utils/create-migration-model");
const { getCompletedMigrations } = require("./utils/get-completed-migrations");
const { getLocalMigrations } = require("./utils/get-local-migrations");
const { runMigration } = require("./utils/run-migration");

const migrate = async (directory = "graphcms-migrations", options) => {
  const { endpoint, token, dryRun } = options;

  const graphcmsClient = createClient({
    endpoint,
    token,
  });

  const spinner = ora("Checking migration model exists").start();

  if (!(await checkMigrationModelExists({ graphcmsClient }))) {
    spinner.text = "Migration model missing. Creating it";
    await createMigrationModel({ endpoint, token });
  }

  spinner.text = "Fetching existing migrations from project";
  const completedMigrations = await getCompletedMigrations({ graphcmsClient });

  spinner.text = "Fetching local migrations";
  const localMigrations = getLocalMigrations({ directory });

  spinner.text = "Fetching migrations not yet ran";
  const migrationsToRun = localMigrations.filter(
    (fileName) => !completedMigrations.includes(fileName)
  );

  const migrationCount = migrationsToRun.length;

  if (!migrationCount) {
    spinner.info("No migrations to run");
    process.exit();
  }

  spinner.succeed = `Detected ${migrationCount} pending migrations`;

  if (dryRun) {
    console.log("Dry mode enabled");
  }

  const migrationsSpinner = ora("Running migrations").start();

  for (const fileName of migrationsToRun) {
    await runMigration({
      endpoint,
      token,
      directory,
      fileName,
      dryRun,
      graphcmsClient,
    });
  }

  if (!dryRun) {
    migrationsSpinner.succeed(`Schema migration completed successfully`);
  } else {
    migrationsSpinner.info(`Dry run completed successfully`);
  }
};

exports.migrate = migrate;
