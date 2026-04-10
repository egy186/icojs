import toDataView from 'to-data-view';

/**
 * Check the ArrayBuffer is valid CUR.
 *
 * @param source - ArrayBuffer or Buffer object.
 * @returns Arg is CUR or not.
 * @access private
 */
// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const isCUR = (source: ArrayBuffer | Buffer): boolean => {
  const dataView = toDataView(source);
  return dataView.getUint16(0, true) === 0 && dataView.getUint16(2, true) === 2;
};

export { isCUR };

export default isCUR;
