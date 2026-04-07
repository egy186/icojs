const MIME_BMP = 'image/bmp';
const MIME_JPEG = 'image/jpeg';
const MIME_PNG = 'image/png';

const mime = {
  /* eslint-disable @typescript-eslint/naming-convention */
  MIME_BMP,
  MIME_JPEG,
  MIME_PNG
  /* eslint-enable @typescript-eslint/naming-convention */
} as const;

export { MIME_BMP, MIME_JPEG, MIME_PNG };

export default mime;
