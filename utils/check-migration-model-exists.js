const { gql } = require("graphql-request");

const CHECK_MIGRATION_MODEL_EXISTS_QUERY = gql`
  query CheckMigrationModelExists {
    migrationsConnection(first: 1) {
      aggregate {
        count
      }
    }
  }
`;

const checkMigrationModelExists = async ({ graphcmsClient }) => {
  try {
    await graphcmsClient.request(CHECK_MIGRATION_MODEL_EXISTS_QUERY);

    return true;
  } catch (err) {
    return false;
  }
};

exports.checkMigrationModelExists = checkMigrationModelExists;
