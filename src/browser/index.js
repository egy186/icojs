import Image from './image.js';
import { MIME_PNG } from '../mime.js';
import { isICO } from '../is-ico.js';
import { parse } from '../parse.js';

const parseICO = (arrayBuffer, mime = MIME_PNG) => parse(arrayBuffer, mime, Image);

const ICO = {
  isICO,
  parseICO
};

export { isICO, parseICO };

export default ICO;
