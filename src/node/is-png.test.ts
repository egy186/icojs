import { describe, expect, it } from 'vitest';
import { isPng } from '../is-png.js';
import { testIcon } from '../test-fixtures/test-icon.js';
import { testImageData } from '../test-fixtures/test-image-data.js';

describe('isPng', () => {
  it('is expected to return true or false', () => {
    // @ts-expect-error test
    expect(() => isPng('it is not buffer')).toThrow(TypeError);
    expect(isPng(new ArrayBuffer(16))).toStrictEqual(false);
    expect(isPng(testImageData['png.png'].buffer)).toStrictEqual(true);
    expect(isPng(testIcon['png.ico'].iconList[0].buffer)).toStrictEqual(true);
  });
});
