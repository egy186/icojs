/**
 * Check the ArrayBuffer is valid CUR.
 *
 * @param source - ArrayBuffer or Buffer object.
 * @returns Arg is CUR or not.
 * @access private
 */
// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const isCur = (source: ArrayBuffer | Buffer): boolean => {
  const view = source instanceof ArrayBuffer
    ? new DataView(source, 0, 4)
    : new DataView(source.buffer, source.byteOffset, 4);
  return view.getUint16(0, true) === 0 && view.getUint16(2, true) === 2;
};

export { isCur };

export default isCur;
