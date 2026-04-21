import type { MatcherResult } from 'vitest';
import { expect } from 'vitest';
import { isBrowser } from './util.js';
import pixelmatch from 'pixelmatch';

// eslint-disable-next-line @typescript-eslint/naming-convention
const { Image } = isBrowser()
  ? await import('../browser/image.js')
  : await import('../node/image.js');

expect.extend({
  async toMatchImage (received: Readonly<ArrayBuffer>, expected: Readonly<ArrayBuffer>): Extract<MatcherResult, Promise<unknown>> {
    const receivedImageData = await Image.decode(received);
    const expectedImageData = await Image.decode(expected);

    if (receivedImageData.width !== expectedImageData.width || receivedImageData.height !== expectedImageData.height) {
      return {
        actual: received,
        expected,
        message: () => 'dimensions are not match',
        pass: false
      };
    }

    const diff = pixelmatch(receivedImageData.data, expectedImageData.data, undefined, receivedImageData.width, receivedImageData.height, {
      includeAA: true,
      threshold: 0
    });

    return {
      actual: received,
      expected,
      message: () => `${diff} pixels differ`,
      pass: diff === 0
    };
  }
});

declare module 'vitest' {
  interface Matchers {
    readonly toMatchImage: (expected: Readonly<ArrayBuffer>) => Promise<void>;
  }
}
