const { gql } = require("graphql-request");

// Walk through pages in future
const CREATE_MIGRATION_ENTRY_MUTATION = gql`
  mutation CreateMigrationEntry($fileName: String!, $completedAt: Date!) {
    createMigration(data: { fileName: $fileName, completedAt: $completedAt }) {
      id
    }
  }
`;

const PUBLISH_MIGRATION_ENTRY = gql`
  mutation PublishMigrationEntry($id: ID!) {
    publishMigration(where: { id: $id }, to: PUBLISHED) {
      id
    }
  }
`;

const createMigrationEntry = async ({ fileName, graphcmsClient }) => {
  try {
    const { createMigration } = await graphcmsClient.request(
      CREATE_MIGRATION_ENTRY_MUTATION,
      {
        fileName,
        completedAt: new Date().toISOString(),
      }
    );

    await graphcmsClient.request(PUBLISH_MIGRATION_ENTRY, {
      id: createMigration.id,
    });
  } catch (err) {
    console.error(err.message || "Something went wrong");
    throw err;
  }
};

exports.createMigrationEntry = createMigrationEntry;
