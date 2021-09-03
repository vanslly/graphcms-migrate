const fs = require("fs");

const getLocalMigrations = ({ directory }) => {
  try {
    return fs.readdirSync(directory);
  } catch (e) {
    return [];
  }
};

exports.getLocalMigrations = getLocalMigrations;
