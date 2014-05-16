/*!
 * ico.js
 * https://github.com/egy186/ico.js
 *
 * Copyright (c) 2014 egy186
 * Released under the MIT License.
 */

(function (window) {
    'use strict';

    var version = '0.0.0';
    /* jslint bitwise: true */

    // ref: http://msdn.microsoft.com/en-us/library/ms997538.aspx
    //var IconFileObject = {
    //    IconDir: {
    //        idReserved: 0, // Reserved (must be 0)
    //        idType: 1, // Resource Type (1 for icons)
    //        idCount: Number
    //    },
    //    IconDirEntry: [
    //        {
    //            bWidth: Number,
    //            bHeight: Number,
    //            bColorCount: Number,
    //            bReserved: 0, // Reserved ( must be 0)
    //            wPlanes: Number,
    //            wBitCount: Number,
    //            dwBytesInRes: Number,
    //            dwImageOffset: Number
    //        }
    //    ],
    //    IconImage: [
    //        {
    //            BitmapInfoHeader: {
    //                biSize: Number,
    //                biWidth: Number,
    //                biHeight: Number,
    //                biPlanes: Number,
    //                biBitCount: Number,
    //                biCompression: Number,
    //                biSizeImage: Number,
    //                biXPelsPerMeter: 0, // unused
    //                biYPelsPerMeter: 0, // unused
    //                biClrUsed: Number,
    //                biClrImportant: Number
    //            },
    //            RgbQuad: [
    //                {
    //                    rgbBlue: Number,
    //                    rgbGreen: Number,
    //                    rgbRed: Number,
    //                    rgbReserved: 0 // Reserved
    //                }
    //            ],
    //            icXOR: ArrayBuffer,
    //            icAND: ArrayBuffer
    //        }
    //    ]
    //};

    /**
     * parse ICO file
     * param: {ArrayBuffer} arraybuffer
     * returns: {Array} bitmaps
     * 
     * bitmaps = [
     *   {
     *     bitmap: Uint8Array,
     *     width: Number,
     *     height: Number,
     *     bit: Number
     *   }
     * ]
     */
    var Parse = function (buffer) {
        var icoData = new Uint8Array(buffer),
            i, j,
            bitmaps = [];
        if (icoData[0] !== 0 || icoData[2] !== 1) {
            throw new Error('It is not valid ICO file');
        }
        for (i = 0; i < icoData[4] + (icoData[5] << 8) ; i++) {
            var tmp = {};
            tmp.width = (icoData[6 + i * 16] === 0) ? 256 : icoData[6 + i * 16];
            tmp.height = (icoData[7 + i * 16] === 0) ? 256 : icoData[7 + i * 16];
            tmp.iconImageLn = 0; // dwBytesInRes
            tmp.iconImageOff = 0; // dwImageOffset
            for (j = 0; j < 4; j++) {
                tmp.iconImageLn += icoData[14 + i * 16 + j] << (j * 8);
                tmp.iconImageOff += icoData[18 + i * 16 + j] << (j * 8);
            }
            tmp.iconImage = new Uint8Array(buffer, tmp.iconImageOff, tmp.iconImageLn);
            delete tmp.iconImageLn;
            delete tmp.iconImageOff;
            tmp.tmpwid = tmp.width;
            for (j = 4; j < 8; j++) {
                tmp.iconImage[j] = tmp.tmpwid; // width
                tmp.tmpwid = (tmp.tmpwid - tmp.iconImage[j]) >> 8;
            }
            delete tmp.tmpwid;
            tmp.tmphei = tmp.height;
            for (j = 8; j < 12; j++) {
                tmp.iconImage[j] = tmp.tmphei; // height
                tmp.tmphei = (tmp.tmphei - tmp.iconImage[j]) >> 8;
            }
            delete tmp.tmphei;
            tmp.bitmap = new Uint8Array(14 + tmp.iconImage.length);
            tmp.bitmap[0] = 66; // B
            tmp.bitmap[1] = 77; // M
            tmp.filesize = tmp.bitmap.length;
            for (j = 2; j < 6; j++) {
                tmp.bitmap[j] = tmp.filesize; // file size
                tmp.filesize = (tmp.filesize - tmp.bitmap[j]) >> 8;
                console.log(j);
            }
            delete tmp.filesize;
            tmp.bitmap[10] = 40; // imagedataOffset-base
            tmp.bitmap.set(tmp.iconImage, 14);
            tmp.bit = tmp.iconImage[14] + (tmp.iconImage[15] << 8);
            tmp.tmpbit = tmp.bit;
            for (j = 10; j < 12; j++) {
                tmp.bitmap[j] = tmp.tmpbit;
                tmp.tmpbit = (tmp.tmpbit - tmp.bitmap[j]) >> 8;
            }
            delete tmp.tmpbit;
            delete tmp.iconImage;
            bitmaps.push(tmp);
        }
        return bitmaps;
    };

    window.ico = {
        Parse: Parse,
        version: version
    };
})(this);