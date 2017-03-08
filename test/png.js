'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const fs = require('fs');
const path = require('path');

chai.use(chaiAsPromised);

const expect = chai.expect;

const ICO = require('../src/index');
const bufferToArrayBuffer = require('../src/utils/buffer-to-arraybuffer');

describe('parse PNG-compressed icon', () => {
  const png = 'png';
  it('is expected to be rejected', () => {
    const buffer = fs.readFileSync(path.join(__dirname, `./fixtures/images/${png}.ico`));
    const data = bufferToArrayBuffer(buffer);
    const promise = ICO.parse(data);
    return expect(promise).to.be.rejectedWith(Error);
  });
});
