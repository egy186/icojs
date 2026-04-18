import { describe, expect, it } from 'vitest';
import { isCur } from '../is-cur.js';
import { readFile } from 'node:fs/promises';

describe('isCur', () => {
  it('is expected to return true or false', async () => {
    const buffer = await readFile(new URL('../test-fixtures/images/cursor.cur', import.meta.url));
    // @ts-expect-error test
    expect(() => isCur('it is not buffer')).toThrow(TypeError);
    expect(isCur(buffer)).toStrictEqual(true);
    const d = new ArrayBuffer(4);
    const dv = new DataView(d);
    expect(isCur(d)).toStrictEqual(false);
    dv.setUint16(2, 2, true);
    expect(isCur(d)).toStrictEqual(true);
    dv.setUint16(0, 1, true);
    expect(isCur(d)).toStrictEqual(false);
  });
});
