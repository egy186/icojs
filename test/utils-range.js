'use strict';

const chai = require('chai');
const range = require('../src/utils/range');

const expect = chai.expect;

describe('utils/range', () => {
  it('is expected to return array', () => {
    expect(range(0)).to.deep.equal([]);
    expect(range(1)).to.deep.equal([0]);
    expect(range(2)).to.deep.equal([0, 1]);
    expect(range(3)).to.deep.equal([0, 1, 2]);
    expect(range(10)).to.deep.equal([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });
});
