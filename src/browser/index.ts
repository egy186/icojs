import type { DecodeImage } from '../decode.js';
import Image from './image.js';
import { decode } from '../decode.js';
import { isIco } from '../is-ico.js';

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const decodeIco = async (arrayBuffer: ArrayBuffer, mime = 'image/png'): Promise<Array<DecodeImage>> => await decode(arrayBuffer, mime, Image);

/** @deprecated Use `isIco` instead. */
const isICO = isIco;

// eslint-disable-next-line jsdoc/require-param, jsdoc/require-returns
/** @deprecated Use `decodeIco` instead. */
// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const parseICO = async (arrayBuffer: ArrayBuffer, mime = 'image/png'): Promise<Array<DecodeImage>> => await decode(arrayBuffer, mime, Image);

const ICO = {
  decodeIco,
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  isICO,
  isIco,
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  parseICO
};

export type { DecodeImage };

// eslint-disable-next-line @typescript-eslint/no-deprecated
export { decodeIco, isICO, isIco, parseICO };

export default ICO;
