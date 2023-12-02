import Image from './image.js';
import { MIME_PNG } from '../mime.js';
import { isICO } from '../is-ico.js';
import { parse as parseICO } from '../parse.js';

const parse = (arrayBuffer, mime = MIME_PNG) => parseICO(arrayBuffer, mime, Image);

const ICO = {
  isICO,
  parse
};

export { isICO, parse };

export default ICO;
