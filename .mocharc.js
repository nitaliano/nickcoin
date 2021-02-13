process.env.NODE_ENV= 'test';

module.exports = {
  require: 'ts-node/register/transpile-only',
  extension: ['ts'],
  spec: ['test/**/*.test.ts'],
  timeout: 10000,
};
