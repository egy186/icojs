'use strict';

const { babel } = require('@rollup/plugin-babel');
const commonjs = require('@rollup/plugin-commonjs');
const jsonfile = require('jsonfile');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const terser = require('@rollup/plugin-terser');

const banner = async () => {
  const { version } = await jsonfile.readFile('./package.json');
  return `/*!
 * icojs v${version}
 * (c) egy186
 * https://github.com/egy186/icojs/blob/master/LICENSE
 */`;
};

// eslint-disable-next-line jsdoc/valid-types
/** @type {import('rollup').RollupOptions} */
const config = {
  input: 'src/browser/index.js',
  onwarn (warning) {
    throw new Error(warning.message);
  },
  output: {
    banner,
    file: 'dist/ico.js',
    format: 'umd',
    name: 'ICO',
    noConflict: true,
    sourcemap: true
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    babel({ babelHelpers: 'bundled' }),
    terser()
  ],
  strictDeprecations: true
};

module.exports = config;
