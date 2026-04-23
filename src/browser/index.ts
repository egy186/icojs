import type { DecodeImage } from '../decode.js';
import type { EncodeImage } from '../encode.js';
import { decode } from '../decode.js';
import { encode } from '../encode.js';
import { imageConverter } from './image.js';
import { isIco } from '../is-ico.js';

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const decodeIco = async (arrayBuffer: ArrayBuffer, mime = 'image/png'): Promise<Array<DecodeImage>> => await decode(arrayBuffer, mime, imageConverter);

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const encodeIco = async (encodeImageList: ReadonlyArray<EncodeImage>): Promise<ArrayBuffer> => await encode(encodeImageList, imageConverter);

const ICO = {
  decodeIco,
  encodeIco,
  isIco
};

export type { DecodeImage, EncodeImage };

export { decodeIco, encodeIco, isIco };

export default ICO;
