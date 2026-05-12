/**
 * Check whether the buffer is a PNG file.
 *
 * @param source - Input data to inspect.
 * @returns `true` when the source is a PNG file, `false` otherwise.
 * @private
 */
// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const isPng = (source: ArrayBuffer | Buffer): boolean => {
  const view = source instanceof ArrayBuffer
    ? new DataView(source, 0, 8)
    : new DataView(source.buffer, source.byteOffset, 8);
  return view.getUint32(0, false) === 0x89504E47 && view.getUint32(4, false) === 0x0D0A1A0A;
};

export { isPng };

export default isPng;
