import type { DecodeImage } from '../decode.js';
import Image from './image.js';
import { decode } from '../decode.js';
import { isIco } from '../is-ico.js';

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const decodeIco = async (arrayBuffer: ArrayBuffer, mime = 'image/png'): Promise<Array<DecodeImage>> => await decode(arrayBuffer, mime, Image);

const ICO = {
  decodeIco,
  isIco
};

export type { DecodeImage };

export { decodeIco, isIco };

export default ICO;
