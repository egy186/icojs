/// <reference path="../ico.js" />
/// <reference path="../lib/jquery.js" />
/// <reference path="../lib/google-code-prettify/prettify.js" />

addEventListener('load', init, false);

function init() {
    var inputFilePath = document.getElementById('input-file-path');

    // drag and drop
    addEventListener('dragenter', function (evt) {
        evt.stopPropagation();
        evt.preventDefault();
    }, false);
    addEventListener('dragover', function (evt) {
        evt.stopPropagation();
        evt.preventDefault();
    }, false);
    addEventListener('drop', function (evt) {
        evt.stopPropagation();
        evt.preventDefault();
        var reader = new FileReader();
        reader.onload = function (e) {
            //console.log(Uint8Array(e.target.result));
            showIconImgs(e.target.result);
        };
        reader.readAsArrayBuffer(evt.dataTransfer.files[0]);
    }, false);

    // file
    inputFilePath.addEventListener('click', inputFile, false);
    document.getElementById('input-file-emu').addEventListener('click', inputFile, false);
    function inputFile(evt) {
        evt.preventDefault();
        document.getElementById('input-file').click();
    }
    document.getElementById('input-file').addEventListener('change', function (evt) {
        inputFilePath.textContent = evt.target.value.replace('C:\\fakepath\\', '');
        var reader = new FileReader();
        reader.onload = function (e) {
            showIconImgs(e.target.result);
        };
        reader.readAsArrayBuffer(evt.target.files[0]);
    }, false);

    // url
    document.getElementById('submit-url').addEventListener('click', function () {
        var url = document.getElementById('input-url').value;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function () {
            if (this.status === 200) {
                showIconImgs(this.response);
            } else {
                showResult('danger', '<p><strong>' + this.status + ': </strong>' + this.statusText + '</p>');
            }
        };
        xhr.onerror = function () {
            showResult('warning', '<p><strong>AJAX Error:</strong> please check URL</p>');
        };
        xhr.send();
    }, false);

    // google-code-prettify
    prettyPrint();

    // bs scrollspy
    if (screen.availWidth >= 992) { // col-md
        jQuery(document.body).scrollspy({ target: '#page-nav' });
    }
}

function showIconImgs(icoArrayBuffer) {
    var bitmaps;
    try {
        bitmaps = ico.Parse(icoArrayBuffer);
    } catch (err) {
        showResult('danger', '<p><strong>Error:</strong> ' + err.message + '</p>');
        return;
    }

    console.dir(bitmaps); // debug

    var text = '<p><strong>Success:</strong></p>';
    for (var i = 0; i < bitmaps.length; i++) {
        var blob = new Blob([bitmaps[i].bitmap], { type: 'image/bmp' });
        var blobURL = window.URL.createObjectURL(blob);
        text += '<p><a href="' + blobURL + '" target="_blank"><img src="' + blobURL + '" /> ' + blobURL + '</a></p>';
    }

    showResult('success', text);
}

function showResult(status, message) {
    var text = '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' + message;
    var demosParse = document.createElement('div'),
        demosParseResults = document.getElementById('demos-parse-results');
    demosParse.className = 'alert alert-' + status + ' alert-dismissable fade in';
    demosParse.innerHTML = text;
    demosParseResults.insertBefore(demosParse, demosParseResults.firstChild.nextSibling.nextSibling);
}
