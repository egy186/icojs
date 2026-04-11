import toDataView from 'to-data-view';

/**
 * Check the ArrayBuffer is valid ICO.
 *
 * @param source - ICO file data.
 * @returns True if arg is ICO.
 */
// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const isICO = (source: ArrayBuffer | Buffer): boolean => {
  const dataView = toDataView(source);
  return dataView.getUint16(0, true) === 0 && dataView.getUint16(2, true) === 1;
};

export { isICO };

export default isICO;
