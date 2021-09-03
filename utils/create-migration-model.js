const { newMigration, FieldType } = require("@graphcms/management");

const migrationModel = {
  apiId: "Migration",
  apiIdPlural: "Migrations",
  description: "Used for storing schema changes with npx graphcms-migrate",
  displayName: "Migration",
};

const createMigrationModel = async ({ endpoint, token }) => {
  const migration = newMigration({
    endpoint,
    authToken: token,
    name: migrationModel.displayName,
  });

  const model = migration.createModel(migrationModel);

  model.addSimpleField({
    apiId: "fileName",
    displayName: "File name",
    type: FieldType.String,
    isRequired: true,
    isTitle: true,
    isUnique: true,
  });

  model.addSimpleField({
    apiId: "completedAt",
    displayName: "Completed at",
    type: FieldType.Date,
    isHidden: true,
  });

  await migration.run(true);
};

exports.createMigrationModel = createMigrationModel;
