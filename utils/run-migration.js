const path = require("path");
const ora = require("ora");

const { createMigrationEntry } = require("../utils/create-migration-entry");

const runMigration = async ({
  endpoint,
  token,
  directory,
  fileName,
  dryRun,
  graphcmsClient,
}) => {
  const filePath = path.resolve(directory, fileName);
  const spinner = ora(`Running migration: ${fileName}`).start();

  try {
    const migration = await require(filePath);

    if (dryRun) {
      const changes = await migration.dryRun();
      spinner.info(`Changes will be accepted when not in dry run ${fileName}`);
    }

    const { errors, name, id, status } = await migration.run(true);

    if (errors) {
      spinner.fail(`Could not process migration`);
      console.log(errors);
      throw errors;
    } else {
      spinner.succeed(`Success! ${fileName}`);

      // If something goes wrong here, there will be a conflict of local/remote migrations

      spinner.text = `Saving migration: ${fileName} to GraphCMS`;
      await createMigrationEntry({ graphcmsClient, fileName });
    }
  } catch (err) {
    spinner.fail(`Could not process migration`);
    console.log(err);
    process.exit(1);
  }
};

exports.runMigration = runMigration;
