'use strict';

const chai = require('chai');
const toDividableBy4 = require('../src/utils/to-dividable-by-4');

const expect = chai.expect;

describe('utils/toDividableBy4', () => {
  it('is expected to return a number dividable by 4', () => {
    expect(toDividableBy4(0)).to.deep.equal(0);
    expect(toDividableBy4(1)).to.deep.equal(4);
    expect(toDividableBy4(2)).to.deep.equal(4);
    expect(toDividableBy4(3)).to.deep.equal(4);
    expect(toDividableBy4(4)).to.deep.equal(4);
    expect(toDividableBy4(5)).to.deep.equal(8);
    expect(toDividableBy4(96)).to.deep.equal(96);
    expect(toDividableBy4(97)).to.deep.equal(100);
    expect(toDividableBy4(98)).to.deep.equal(100);
    expect(toDividableBy4(99)).to.deep.equal(100);
    expect(toDividableBy4(100)).to.deep.equal(100);
    expect(toDividableBy4(101)).to.deep.equal(104);
  });
});
