import toDataView from 'to-data-view';

/**
 * Check the ArrayBuffer is valid CUR.
 *
 * @param {ArrayBuffer | Buffer} source - ArrayBuffer or Buffer object.
 * @returns {boolean} Arg is CUR or not.
 * @access private
 */
const isCUR = source => {
  const dataView = toDataView(source);
  return dataView.getUint16(0, true) === 0 && dataView.getUint16(2, true) === 2;
};

export { isCUR };

export default isCUR;
