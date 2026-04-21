import { describe, expect, it } from 'vitest';
import { isCur } from '../is-cur.js';
import { testIcon } from '../test-fixtures/test-icon.js';

describe('isCur', () => {
  it('is expected to return true or false', () => {
    // @ts-expect-error test
    expect(() => isCur('it is not buffer')).toThrow(TypeError);
    expect(isCur(testIcon['cursor.cur'].buffer)).toStrictEqual(true);
    expect(isCur(new Uint8Array([0, 0, 0, 0]).buffer)).toStrictEqual(false);
    expect(isCur(new Uint8Array([0, 0, 2, 0]).buffer)).toStrictEqual(true);
    expect(isCur(new Uint8Array([1, 0, 2, 0]).buffer)).toStrictEqual(false);
  });
});
