import { describe, expect, it } from 'vitest';
import { isICO } from '../is-ico.js';
import { readFile } from 'node:fs/promises';

describe('isICO', () => {
  it('is expected to return true or false', async () => {
    const buffer = await readFile(new URL('../test-fixtures/images/basic.ico', import.meta.url));
    // @ts-expect-error test
    expect(() => isICO('it is not ArrayBuffer')).toThrow(TypeError);
    expect(isICO(buffer)).toStrictEqual(true);
  });
});
