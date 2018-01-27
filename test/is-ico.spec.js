'use strict';

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
    expect(() => isICO('it is not ArrayBuffer')).to.throw(TypeError);
    expect(isICO(buffer)).to.be.true;
  });
});
