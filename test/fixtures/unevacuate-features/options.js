/**
 * @file Provides the base options object that applies to all tests.
 * https://github.com/babel/babel/blob/master/CONTRIBUTING.md#writing-tests
 */
const { resolve } = require('path');

module.exports = {
  plugins: [
    resolve(__dirname, '../../../src/unevacuate.js'),
  ],
  parserOpts: {
    plugins: ['classProperties', 'decorators-legacy']
  }
};
