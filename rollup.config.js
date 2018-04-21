'use strict';

const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const jsonfile = require('jsonfile');
const resolve = require('rollup-plugin-node-resolve');
const uglify = require('rollup-plugin-uglify');

const pkg = jsonfile.readFileSync('./package.json');
const banner = `/*!
 * icojs v${pkg.version}
 * (c) egy186
 * https://github.com/egy186/icojs/blob/master/LICENSE
 */`;

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
    resolve(),
    commonjs(),
    babel(),
    uglify({ output: { comments: /^!/ } })
  ]
};

module.exports = config;
