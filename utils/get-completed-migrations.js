const { gql } = require("graphql-request");

// Walk through pages in future
const GET_COMPLETED_MIGRATIONS_QUERY = gql`
  query GetCompletedMigrations {
    migrations {
      fileName
      completedAt
    }
  }
`;

const getCompletedMigrations = async ({ graphcmsClient }) => {
  const { migrations } = await graphcmsClient.request(
    GET_COMPLETED_MIGRATIONS_QUERY
  );

  return migrations
    .filter(({ completedAt }) => Boolean(completedAt))
    .map(({ fileName }) => fileName);
};

exports.getCompletedMigrations = getCompletedMigrations;
