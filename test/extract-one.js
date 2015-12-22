'use strict';

const chai = require('chai');
const fs = require('fs');
const path = require('path');

const expect = chai.expect;

const bufferToArrayBuffer = require('../src/utils/buffer-to-arraybuffer');
const extractOne = require('../src/extract-one');

const bufferToBase64 = require('./fixtures/buffer-to-base64');

const buffer = fs.readFileSync(path.join(__dirname, './fixtures/images/basic.ico'));
const data = bufferToArrayBuffer(buffer);
const expecteds = require('./fixtures/images/basic');

describe('extractOne', () => {
  it('is expected to be a function', () => {
    expect(extractOne).to.be.a('function');
  });
  expecteds.map((expected, i) => {
    it('is expected to return extracted ico (' + i + ')', () => {
      const ico = extractOne(data, i);
      expect(ico).to.be.a('object');
      expect(ico.width).to.deep.equal(expected.width);
      expect(ico.height).to.deep.equal(expected.height);
      expect(ico.colorCount).to.deep.equal(expected.colorCount);
      expect(ico.bit).to.deep.equal(expected.bit);
      expect(ico.colors).to.deep.equal(expected.colors);
      expect(ico.xor instanceof ArrayBuffer).to.be.true;
      expect(bufferToBase64(ico.xor)).to.deep.equal(expected.xor);
      expect(ico.and instanceof ArrayBuffer).to.be.true;
      expect(bufferToBase64(ico.and)).to.deep.equal(expected.and);
    });
  });
});
