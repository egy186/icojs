import { describe, expect, it } from 'vitest';
import { isPng } from '../is-png.js';
import { readFile } from 'node:fs/promises';

describe('isPng', () => {
  it('is expected to return true or false', async () => {
    const buffer1 = await readFile(new URL('../test-fixtures/images/1x1/1x1-1bit.png', import.meta.url));
    const buffer2 = await readFile(new URL('../test-fixtures/images/png/256x256-32bit.png', import.meta.url));
    // @ts-expect-error test
    expect(() => isPng('it is not buffer')).toThrow(TypeError);
    expect(isPng(new ArrayBuffer(16))).toStrictEqual(false);
    expect(isPng(buffer1)).toStrictEqual(true);
    expect(isPng(buffer2)).toStrictEqual(true);
  });
});
