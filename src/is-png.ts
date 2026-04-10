import toDataView from 'to-data-view';

/**
 * Check the ArrayBuffer is valid PNG.
 *
 * @param source - ArrayBuffer or Buffer object.
 * @returns Arg is PNG or not.
 * @access private
 */
// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const isPNG = (source: ArrayBuffer | Buffer): boolean => {
  const dataView = toDataView(source);
  return dataView.getUint32(0, false) === 0x89504E47 && dataView.getUint32(4, false) === 0x0D0A1A0A;
};

export { isPNG };

export default isPNG;
