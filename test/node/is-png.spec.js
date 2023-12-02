import { expect } from 'chai';
import { isPNG } from '../../src/is-png.js';
import { readFile } from 'node:fs/promises';

describe('isPNG', () => {
  it('is expected to return true or false', async () => {
    const buffer1 = await readFile(new URL('../fixtures/images/1x1/1x1-1bit.png', import.meta.url));
    const buffer2 = await readFile(new URL('../fixtures/images/png/256x256-32bit.png', import.meta.url));
    expect(() => isPNG('it is not buffer')).to.throw(TypeError);
    expect(isPNG(new ArrayBuffer(16))).to.be.false;
    expect(isPNG(buffer1)).to.be.true;
    expect(isPNG(buffer2)).to.be.true;
  });
});
