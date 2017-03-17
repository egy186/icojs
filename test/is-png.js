'use strict';

const bufferToArrayBuffer = require('../src/utils/buffer-to-arraybuffer');
const chai = require('chai');
const fs = require('fs');
const isPNG = require('../src/is-png');
const path = require('path');

const expect = chai.expect;

describe('isPNG', () => {
  it('is expected to return true or false', () => {
    const buffer = fs.readFileSync(path.join(__dirname, './fixtures/images/1x1/1x1-1bit.png'));
    const arrayBuffer1 = bufferToArrayBuffer(buffer);
    const buffer2 = fs.readFileSync(path.join(__dirname, './fixtures/images/png/256x256-32bit.png'));
    const arrayBuffer2 = bufferToArrayBuffer(buffer2);
    expect(isPNG('it is not buffer')).to.be.false;
    expect(isPNG(new ArrayBuffer(16))).to.be.false;
    expect(isPNG(arrayBuffer1)).to.be.true;
    expect(isPNG(arrayBuffer2)).to.be.true;
  });
});
