'use strict';

const bitDepthOfPNG = arrayBuffer => {
  const dataView = new DataView(arrayBuffer);
  const bit = dataView.getUint8(24);
  const colorType = dataView.getUint8(25);
  if (colorType === 2) {
    return bit * 3;
  } else if (colorType === 4) {
    return bit * 2;
  } else if (colorType === 6) {
    return bit * 4;
  }
  return bit;
};

module.exports = bitDepthOfPNG;
