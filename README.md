# `npx graphcms-migrate`

EXPERIMENTAL

Needs migrating to the newer meow/ora with esm support, typescript.

## Usage

1. Add your `GRAPHCMS_ENDPOINT` and `GRAPHCMS_TOKEN` to `.env` (or use flags `--endpoint` and `--token`)
2. Add migrations to a directory called `graphcms-migrations`, or a name you prefer
3. Run and pass the directory name `npx graphcms-migrate <directory-of-migrations>`

## Migration template

You must create migration `.js` files inside your custom migrations directory formatted like this:

```js
const { FieldType, newMigration } = require("@graphcms/management");

const migration = newMigration({
  endpoint: process.env.GRAPHCMS_ENDPOINT,
  authToken: process.env.GRAPHCMS_TOKEN,
});

const instructor = migration.createModel({
  apiId: "Instructor",
  apiIdPlural: "Instructors",
  displayName: "Instructor",
});

instructor.addSimpleField({
  apiId: "name",
  displayName: "Name",
  type: FieldType.String,
  isRequired: true,
  isTitle: true,
});

instructor.addRelationalField({
  apiId: "avatar",
  displayName: "Avatar",
  model: "Asset",
});

module.exports = migration;
```

In an upcoming version we will pass the `endpoint`/`token` to `newMigration`, so this would remove the need for:

```js
const migration = newMigration({
  endpoint: process.env.GRAPHCMS_ENDPOINT,
  authToken: process.env.GRAPHCMS_TOKEN,
});
```
