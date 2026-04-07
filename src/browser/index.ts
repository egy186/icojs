import Image from './image.js';
import { MIME_PNG } from '../mime.js';
import type { ParsedImage } from '../parse.js';
import { isICO } from '../is-ico.js';
import { parse } from '../parse.js';

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const parseICO = async (arrayBuffer: ArrayBuffer, mime: string = MIME_PNG): Promise<Array<ParsedImage>> => await parse(arrayBuffer, mime, Image);

const ICO = {
  isICO,
  parseICO
};

export type { ParsedImage };

export { isICO, parseICO };

export default ICO;
