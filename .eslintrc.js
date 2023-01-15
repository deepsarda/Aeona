const eslintConfig = require('@aeona/eslint-config');

module.exports = {
  ...eslintConfig,
  ignorePatterns: ['*.js', 'packages/**/node_modules/*', 'packages/**/dist/*', '*.jsx', 'old/*'],
};
