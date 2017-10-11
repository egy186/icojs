'use strict';

const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const jsonfile = require('jsonfile');
const uglify = require('rollup-plugin-uglify');

const pkg = jsonfile.readFileSync('./package.json');
const banner = `/*!
 * icojs v${pkg.version}
 * (c) egy186
 * https://github.com/egy186/icojs/blob/master/LICENSE
 */`;

const config = {
  banner,
  input: 'src/browser/index.js',
  output: {
    file: 'dist/ico.js',
    format: 'umd',
    name: 'ICO'
  },
  plugins: [
    babel(),
    commonjs(),
    uglify({ output: { comments: /^!/ } })
  ],
  sourcemap: true
};

module.exports = config;
