'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const fs = require('fs');
const path = require('path');

chai.use(chaiAsPromised);

const expect = chai.expect;

const isCUR = require('../src/is-cur');
const bufferToArrayBuffer = require('../src/utils/buffer-to-arraybuffer');

describe('isCUR', () => {
  it('is expected to return true or false', () => {
    const buffer = fs.readFileSync(path.join(__dirname, './fixtures/images/cursor.cur'));
    const data = bufferToArrayBuffer(buffer);
    expect(isCUR('it is not buffer')).to.be.false;
    expect(isCUR(data)).to.be.true;
    const d = new ArrayBuffer(4);
    const dv = new DataView(d);
    expect(isCUR(d)).to.be.false;
    dv.setUint16(2, 2, true);
    expect(isCUR(d)).to.be.true;
    dv.setUint16(0, 1, true);
    expect(isCUR(d)).to.be.false;
  });
});
