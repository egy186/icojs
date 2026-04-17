import { describe, expect, it } from 'vitest';
import { isIco } from '../is-ico.js';
import { readFile } from 'node:fs/promises';

describe('isIco', () => {
  it('is expected to return true or false', async () => {
    const buffer = await readFile(new URL('../test-fixtures/images/basic.ico', import.meta.url));
    // @ts-expect-error test
    expect(() => isIco('it is not ArrayBuffer')).toThrow(TypeError);
    expect(isIco(buffer)).toStrictEqual(true);
  });
});
