'use strict';

const ICO = require('../src/index');
const chai = require('chai');
const isICO = require('../src/is-ico');
const parse = require('../src/parse');

const expect = chai.expect;

describe('ICO', () => {
  describe('.isICO', () => {
    it('is expected to same as isICO', () => {
      expect(ICO.isICO).to.deep.equal(isICO);
    });
  });
  describe('.parse', () => {
    it('is expected to same as parse', () => {
      expect(ICO.parse).to.deep.equal(parse);
    });
  });
});
