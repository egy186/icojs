import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import jsonfile from 'jsonfile';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

const banner = async () => {
  const { version } = await jsonfile.readFile('./package.json');
  return `/*!
 * icojs v${version}
 * (c) egy186
 * https://github.com/egy186/icojs/blob/main/LICENSE
 */`;
};

/** @type {import('rollup').RollupOptions} */
const config = {
  input: 'src/browser/index.js',
  onwarn (warning) {
    throw new Error(warning.message);
  },
  output: {
    banner,
    exports: 'named',
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

export default config;
