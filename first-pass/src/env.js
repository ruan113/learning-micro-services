function requireFromEnv(envName) {
  const result = process.env[envName];
  if (!result) throw Error(`${envName} must be provided`);
  return process.env[envName];
}

var packageJson = require('../package.json');

module.exports = {
  appName: requireFromEnv('APP_NAME'),
  env: requireFromEnv('NODE_ENV'),
  port: parseInt(requireFromEnv('PORT'), 10),
  version: packageJson.version,
};
