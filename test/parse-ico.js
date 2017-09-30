'use strict';

const Image = require('../src/node/image');
const bufferToArrayBuffer = require('../src/node/buffer-to-arraybuffer');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const fs = require('fs');
const parseICO = require('../src/parse-ico');
const path = require('path');

chai.use(chaiAsPromised);

const expect = chai.expect;

describe('ICO', () => {
  describe('.parse', () => {
    it('is expected to be rejected when arg is not ArrayBuffer', () => {
      const buffer = fs.readFileSync(path.join(__dirname, './fixtures/images/basic.ico'));
      const promise = parseICO(buffer, null, Image);
      return expect(promise).to.be.rejectedWith(TypeError);
    });
    it('is expected to be fulfilled', () => {
      const buffer = fs.readFileSync(path.join(__dirname, './fixtures/images/basic.ico'));
      const arrayBuffer = bufferToArrayBuffer(buffer);
      const promise = parseICO(arrayBuffer, null, Image);
      return expect(promise).to.be.fulfilled;
    });
  });
});
