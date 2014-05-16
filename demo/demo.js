/// <reference path="../ico.js" />
/// <reference path="lib/jquery/jquery.js" />
/// <reference path="lib/bootstrap/js/bootstrap.js" />
/// <reference path="lib/highlightjs/highlight.pack.js" />

/* global hljs:false, ico:false */

// init
addEventListener('load', function () {
    // add event
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

    // highlightjs
    hljs.initHighlighting();

    // #page-nav scrollspy affix
    pageNavScrollspy();
    addEventListener('resize', pageNavScrollspy, false);
    addEventListener('transitionend', pageNavScrollspy, false);
    // scrollspy support hitory
    history.pushState({}, document.head.title, location.hash);
    jQuery(document.body).on('activate.bs.scrollspy', function (evt) {
        history.replaceState({}, document.head.title, evt.target.firstChild.href);
    });
}, false);

function showIconImgs(icoArrayBuffer) {
    // convert *.ico to *.bmp(s)
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
    // class is depend on Bootstrap
    var text = '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' + message;
    var demosParse = document.createElement('div'),
        demosParseResults = document.getElementById('demos-parse-results');
    demosParse.className = 'alert alert-' + status + ' alert-dismissable fade in';
    demosParse.innerHTML = text;
    demosParseResults.insertBefore(demosParse, demosParseResults.firstChild.nextSibling.nextSibling);
}

function pageNavScrollspy() {
    var pageNavNav = jQuery('#page-nav .nav');
    var topHeight = 20;
    pageNavNav.affix({
        offset: {
            top: pageNavNav.offset().top - topHeight
        }
    });
    pageNavNav.css('top', topHeight);
    jQuery(document.body).scrollspy({
        target: '#page-nav'
    });
    pageNavNav.width(function () {
        return pageNavNav.parent().width();
    });
}