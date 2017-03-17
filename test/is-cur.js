'use strict';

const bufferToArrayBuffer = require('../src/utils/buffer-to-arraybuffer');
const chai = require('chai');
const fs = require('fs');
const isCUR = require('../src/is-cur');
const path = require('path');

const expect = chai.expect;

describe('isCUR', () => {
  it('is expected to return true or false', () => {
    const buffer = fs.readFileSync(path.join(__dirname, './fixtures/images/cursor.cur'));
    const arrayBuffer = bufferToArrayBuffer(buffer);
    expect(isCUR('it is not buffer')).to.be.false;
    expect(isCUR(arrayBuffer)).to.be.true;
    const d = new ArrayBuffer(4);
    const dv = new DataView(d);
    expect(isCUR(d)).to.be.false;
    dv.setUint16(2, 2, true);
    expect(isCUR(d)).to.be.true;
    dv.setUint16(0, 1, true);
    expect(isCUR(d)).to.be.false;
  });
});
