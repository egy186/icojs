import type { ImageDataLike } from './image.js';

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types, max-statements
const createBmp24 = ({ data, height, width }: ImageDataLike): Uint8Array => {
  const bytesPerRow = Math.ceil(width * 3);
  const rowSize = Math.ceil(bytesPerRow / 4) * 4;
  const buffer = new Uint8Array(rowSize * height);

  for (let y = 0; y < height; y++) {
    // Bottom to top
    const bmpY = (height - 1) - y;

    for (let x = 0; x < width; x++) {
      const i = ((y * width) + x) * 4;
      /* eslint-disable @typescript-eslint/no-non-null-assertion */
      const r = data[i]!;
      const g = data[i + 1]!;
      const b = data[i + 2]!;

      /* eslint-enable @typescript-eslint/no-non-null-assertion */
      const bmpIndex = (bmpY * rowSize) + (x * 3);
      buffer[bmpIndex] = b;
      buffer[bmpIndex + 1] = g;
      buffer[bmpIndex + 2] = r;
    }
  }

  return buffer;
};

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types, max-statements
const createMask = ({ data, height, width }: ImageDataLike): Uint8Array => {
  const bytesPerRow = Math.ceil(width / 8);
  const rowSize = Math.ceil(bytesPerRow / 4) * 4;
  const buffer = new Uint8Array(rowSize * height);

  for (let y = 0; y < height; y++) {
    // Bottom to top
    const bmpY = (height - 1) - y;

    for (let x = 0; x < width; x++) {
      const i = ((y * width) + x) * 4;
      const alpha = data[i + 3];

      if (alpha === 0) {
        const bmpIndex = (bmpY * rowSize) + Math.floor(x / 8);
        const shift = 7 - (x % 8);

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        buffer[bmpIndex]! |= 1 << shift;
      }
    }
  }

  return buffer;
};

const BITMAPINFOHEADER_SIZE = 40;

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types, max-statements
const createBmpIcon = (imageData: ImageDataLike): ArrayBuffer => {
  const bmp = createBmp24(imageData);
  const mask = createMask(imageData);

  const icon = new Uint8Array(BITMAPINFOHEADER_SIZE + bmp.byteLength + mask.byteLength);
  icon.set(bmp, BITMAPINFOHEADER_SIZE);
  icon.set(mask, BITMAPINFOHEADER_SIZE + bmp.byteLength);

  const view = new DataView(icon.buffer, 0, BITMAPINFOHEADER_SIZE);
  view.setUint32(0, BITMAPINFOHEADER_SIZE, true);
  view.setUint32(4, imageData.width, true);
  // Double the height to include the mask
  view.setUint32(8, imageData.height * 2, true);
  // Planes
  view.setUint16(12, 1, true);
  // Bits per pixel
  view.setUint16(14, 24, true);
  // None compression
  view.setUint32(16, 0, true);
  view.setUint32(20, bmp.byteLength + mask.byteLength, true);

  return icon.buffer;
};

export { createBmpIcon };

export default createBmpIcon;
