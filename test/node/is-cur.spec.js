import { expect } from 'chai';
import { isCUR } from '../../src/is-cur.js';
import { readFile } from 'node:fs/promises';

describe('isCUR', () => {
  it('is expected to return true or false', async () => {
    const buffer = await readFile(new URL('../fixtures/images/cursor.cur', import.meta.url));
    expect(() => isCUR('it is not buffer')).to.throw(TypeError);
    expect(isCUR(buffer)).to.be.true;
    const d = new ArrayBuffer(4);
    const dv = new DataView(d);
    expect(isCUR(d)).to.be.false;
    dv.setUint16(2, 2, true);
    expect(isCUR(d)).to.be.true;
    dv.setUint16(0, 1, true);
    expect(isCUR(d)).to.be.false;
  });
});
