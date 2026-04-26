import type { ImageDataLike } from '../image.js';
import { loadFile } from './util.js';

interface TestImageData {
  readonly buffer: ArrayBuffer;
  readonly imageData: ImageDataLike;
}

const testImageData = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'bmp.bmp': {
    buffer: await loadFile('bmp.bmp'),
    imageData: {
      data: new Uint8ClampedArray([
        /* eslint-disable @stylistic/array-element-newline */
        255, 0, 0, 255,
        0, 255, 0, 255,
        0, 0, 255, 255,
        0, 0, 0, 255,
        255, 0, 255, 255,
        255, 255, 0, 255,
        0, 255, 255, 255,
        255, 255, 255, 255
        /* eslint-enable @stylistic/array-element-newline */
      ]),
      height: 2,
      width: 4
    }
  },
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'png.png': {
    buffer: await loadFile('png.png'),
    imageData: {
      data: new Uint8ClampedArray([
        0,
        0,
        0,
        0
      ]),
      height: 1,
      width: 1
    }
  }
} as const satisfies { readonly[name: string]: TestImageData };

export { testImageData };

export default testImageData;
