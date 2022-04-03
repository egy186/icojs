'use strict';

const { expect } = require('chai');
const fs = require('fs');
const isPNG = require('../../src/is-png');
const path = require('path');

describe('isPNG', () => {
  it('is expected to return true or false', () => {
    const buffer1 = fs.readFileSync(path.join(__dirname, '../fixtures/images/1x1/1x1-1bit.png'));
    const buffer2 = fs.readFileSync(path.join(__dirname, '../fixtures/images/png/256x256-32bit.png'));
    expect(() => isPNG('it is not buffer')).to.throw(TypeError);
    expect(isPNG(new ArrayBuffer(16))).to.be.false;
    expect(isPNG(buffer1)).to.be.true;
    expect(isPNG(buffer2)).to.be.true;
  });
});
