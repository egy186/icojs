'use strict';

const bufferToArrayBuffer = require('../src/node/buffer-to-arraybuffer');
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
    expect(isICO('it is not ArrayBuffer')).to.be.false;
    expect(isICO(buffer)).to.be.false;
    expect(isICO(arrayBuffer)).to.be.true;
  });
});
