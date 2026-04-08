import { describe, expect, it } from 'vitest';
import { isCUR } from '../is-cur.js';
import { readFile } from 'node:fs/promises';

describe('isCUR', () => {
  it('is expected to return true or false', async () => {
    const buffer = await readFile(new URL('../test-fixtures/images/cursor.cur', import.meta.url));
    // @ts-expect-error test
    expect(() => isCUR('it is not buffer')).toThrow(TypeError);
    expect(isCUR(buffer)).toStrictEqual(true);
    const d = new ArrayBuffer(4);
    const dv = new DataView(d);
    expect(isCUR(d)).toStrictEqual(false);
    dv.setUint16(2, 2, true);
    expect(isCUR(d)).toStrictEqual(true);
    dv.setUint16(0, 1, true);
    expect(isCUR(d)).toStrictEqual(false);
  });
});
