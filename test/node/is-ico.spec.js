'use strict';

const { expect } = require('chai');
const fs = require('fs');
const isICO = require('../../src/is-ico');
const path = require('path');

describe('isICO', () => {
  it('is expected to return true or false', () => {
    const buffer = fs.readFileSync(path.join(__dirname, '../fixtures/images/basic.ico'));
    expect(() => isICO('it is not ArrayBuffer')).to.throw(TypeError);
    expect(isICO(buffer)).to.be.true;
  });
});
