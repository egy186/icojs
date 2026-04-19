import { describe, expect, it } from 'vitest';
import { isIco } from '../is-ico.js';
import { testIcon } from '../test-fixtures/test-icon.js';

describe('isIco', () => {
  it('is expected to return true or false', () => {
    // @ts-expect-error test
    expect(() => isIco('it is not ArrayBuffer')).toThrow(TypeError);
    expect(isIco(testIcon['basic.ico'].buffer)).toStrictEqual(true);
  });
});
