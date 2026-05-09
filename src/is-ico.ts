/**
 * Check whether the buffer is a ICO file.
 *
 * @param source - Input data to inspect.
 * @returns `true` when the source is a ICO file, `false` otherwise.
 */
// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const isIco = (source: ArrayBuffer | Buffer): boolean => {
  const view = source instanceof ArrayBuffer
    ? new DataView(source, 0, 4)
    : new DataView(source.buffer, source.byteOffset, 4);
  return view.getUint16(0, true) === 0 && view.getUint16(2, true) === 1;
};

export { isIco };

export default isIco;
