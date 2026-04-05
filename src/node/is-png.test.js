import { describe, expect, it } from 'vitest';
import { isPNG } from '../is-png.js';
import { readFile } from 'node:fs/promises';

describe('isPNG', () => {
  it('is expected to return true or false', async () => {
    const buffer1 = await readFile(new URL('../test-fixtures/images/1x1/1x1-1bit.png', import.meta.url));
    const buffer2 = await readFile(new URL('../test-fixtures/images/png/256x256-32bit.png', import.meta.url));
    expect(() => isPNG('it is not buffer')).toThrow(TypeError);
    expect(isPNG(new ArrayBuffer(16))).toStrictEqual(false);
    expect(isPNG(buffer1)).toStrictEqual(true);
    expect(isPNG(buffer2)).toStrictEqual(true);
  });
});
