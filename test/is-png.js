'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const fs = require('fs');
const path = require('path');

chai.use(chaiAsPromised);

const expect = chai.expect;

const isPNG = require('../src/is-png');
const bufferToArrayBuffer = require('../src/utils/buffer-to-arraybuffer');

describe('isPNG', () => {
  it('is expected to return true or false', () => {
    const buffer = fs.readFileSync(path.join(__dirname, './fixtures/images/1x1/1x1-1bit.png'));
    const data = bufferToArrayBuffer(buffer);
    const buffer2 = fs.readFileSync(path.join(__dirname, './fixtures/images/png/256x256-32bit.png'));
    const data2 = bufferToArrayBuffer(buffer2);
    expect(isPNG('it is not buffer')).to.be.false;
    expect(isPNG(data)).to.be.true;
    expect(isPNG(data2)).to.be.true;
  });
});
