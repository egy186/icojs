import { MIME_BMP, MIME_JPEG, MIME_PNG } from '../mime.js';
import { PNG } from 'pngjs';
import bmp from '@jimp/bmp';
import { fileTypeFromBuffer } from 'file-type';
import jpeg from 'jpeg-js';

const Jimp = bmp();

const decoders = {
  [MIME_BMP]: buffer => Jimp.decoders[MIME_BMP](buffer),
  [MIME_JPEG]: buffer => jpeg.decode(buffer),
  [MIME_PNG]: buffer => PNG.sync.read(buffer)
};

const encoders = {
  [MIME_BMP]: imageData => Jimp.encoders[MIME_BMP]({ bitmap: imageData }),
  [MIME_JPEG]: imageData => jpeg.encode(imageData).data,
  [MIME_PNG]: imageData => PNG.sync.write(imageData)
};

const Image = {
  /**
   * Create ImageData from image.
   *
   * @param {ArrayBuffer} arrayBuffer - Image buffer.
   * @returns {Promise<ImageData>} Resolves to ImageData.
   * @access private
   */
  async decode (arrayBuffer) {
    const buffer = Buffer.from(arrayBuffer);
    const { mime } = await fileTypeFromBuffer(buffer) || {};
    if (!(mime in decoders)) {
      throw new TypeError(`${mime} is not supported`);
    }
    const decoder = decoders[mime];
    const { data, height, width } = decoder(buffer);
    return {
      data: new Uint8ClampedArray(data),
      height,
      width
    };
  },
  /**
   * Create image from ImageData.
   *
   * @param {object} image - Data.
   * @param {number} image.width - Image width in pixels.
   * @param {number} image.height - Image height in pixels.
   * @param {Uint8ClampedArray} image.data - Same as imageData.data.
   * @param {string} [mime=image/png] - MIME type.
   * @returns {Promise<ArrayBuffer>} Resolves to image.
   * @access private
   */
  // eslint-disable-next-line require-await
  async encode (image, mime = MIME_PNG) {
    const imageData = {
      data: Buffer.from(image.data),
      height: image.height,
      width: image.width
    };
    const encoder = mime in encoders ? encoders[mime] : encoders[MIME_PNG];
    const imageBuffer = encoder(imageData);
    return imageBuffer.buffer.slice(imageBuffer.byteOffset, imageBuffer.byteOffset + imageBuffer.byteLength);
  }
};

export default Image;
