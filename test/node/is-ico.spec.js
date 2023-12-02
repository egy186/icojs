import { expect } from 'chai';
import { isICO } from '../../src/is-ico.js';
import { readFile } from 'node:fs/promises';

describe('isICO', () => {
  it('is expected to return true or false', async () => {
    const buffer = await readFile(new URL('../fixtures/images/basic.ico', import.meta.url));
    expect(() => isICO('it is not ArrayBuffer')).to.throw(TypeError);
    expect(isICO(buffer)).to.be.true;
  });
});
