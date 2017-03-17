'use strict';

const bufferToArrayBuffer = require('../src/utils/buffer-to-arraybuffer');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const fs = require('fs');
const isICO = require('../src/is-ico');
const path = require('path');

chai.use(chaiAsPromised);

const expect = chai.expect;

describe('isICO', () => {
  it('is expected to return true or false', () => {
    const buffer = fs.readFileSync(path.join(__dirname, './fixtures/images/basic.ico'));
    const arrayBuffer = bufferToArrayBuffer(buffer);
    expect(isICO('it is not buffer')).to.be.false;
    expect(isICO(buffer)).to.be.true;
    expect(isICO(arrayBuffer)).to.be.true;
    const d = new ArrayBuffer(4);
    const dv = new DataView(d);
    expect(isICO(d)).to.be.false;
    dv.setUint16(2, 1, true);
    expect(isICO(d)).to.be.true;
    dv.setUint16(0, 1, true);
    expect(isICO(d)).to.be.false;
  });
});
