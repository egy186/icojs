/// <reference path="../ico.js" />
/// <reference path="lib/jquery/jquery.js" />
/// <reference path="lib/bootstrap/js/bootstrap.js" />
/// <reference path="lib/highlightjs/highlight.pack.js" />

/* global hljs:false, ico:false */

jQuery(document).ready(function () {
  // from drag and drop
  jQuery(document).on('dragenter', function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
  });
  jQuery(document).on('dragover', function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
  });
  jQuery(document).on('drop', function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
    icoParse(evt.originalEvent.dataTransfer.files[0]);
  });
  // from file
  var inputFile = jQuery('#input-file'),
      inputFilePath = jQuery('#input-file-path');
  inputFilePath.on('click', inputEvt);
  jQuery('#input-file-emu').on('click', inputEvt);
  function inputEvt(evt) {
    evt.preventDefault();
    inputFile.click();
  }
  inputFile.on('change', function (evt) {
    inputFilePath.text(evt.target.value.replace('C:\\fakepath\\', ''));
    icoParse(evt.target.files[0]);
  });

  // highlightjs
  hljs.initHighlighting();

  // #page-nav scrollspy affix
  pageNavScrollspy();
  addEventListener('resize', pageNavScrollspy, false);
});

function icoParse(file) {
  var reader = new FileReader();
  reader.onload = function (e) {
    // convert *.ico to *.png(s)
    try {
        var images = ico.Parse(e.target.result);
      console.dir(images); // debug
      var text = '<p><strong>Success:</strong></p>';
      for (var i = 0; i < images.length; i++) {
        var url = URL.createObjectURL(new Blob([images[i].buffer], { type : images[i].type }));
        text += '<p><a href="' + url + '" target="_blank"><img src="' + url + '" /> ' + images[i].width + 'x' + images[i].height + ', ' + images[i].bit + 'bit</a></p>';
      }
      showResult('success', text);
    } catch (err) {
      showResult('danger', '<p><strong>Error:</strong> ' + err.message + '</p>');
    }
  };
  reader.readAsArrayBuffer(file);
}

function showResult(status, message) {
  jQuery('<div class="alert alert-' + status + ' alert-dismissable fade in">')
    .html('<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' + message)
    .insertAfter(jQuery('#demos-parse-results > h3:first-child'));
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
