var showResult = function (status, message) {
  jQuery('<div class="alert alert-' + status + ' alert-dismissable fade in">')
    .html('<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' + message)
    .prependTo(jQuery('#demos-parse-results'));
};

var icoParse = function (file) {
  var reader = new FileReader();
  reader.onload = function (e) {
    // Convert *.ico to *.png(s)
    ICO.parse(e.target.result).then(function (images) {
      console.dir(images); // Debug
      var text = '<p><strong>Success:</strong></p>';
      for (var i = 0; i < images.length; i++) {
        var url = URL.createObjectURL(new Blob([images[i].buffer], { type: images[i].type }));
        text += '<p><a href="' + url + '" target="_blank"><img src="' + url + '" /> ' + images[i].width + 'x' + images[i].height + ', ' + images[i].bit + 'bit</a></p>';
      }
      showResult('success', text);
    }).catch(function (err) {
      showResult('danger', '<p><strong>Error:</strong> ' + err.message + '</p>');
    });
  };
  reader.readAsArrayBuffer(file);
};

jQuery(document).ready(function () {
  // From drag and drop
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
  // From file
  var inputFile = jQuery('#input-file');
  var inputFilePath = jQuery('#input-file-path');
  var inputEvt = function (evt) {
    evt.preventDefault();
    inputFile.click();
  };
  inputFilePath.on('click', inputEvt);
  jQuery('#input-file-emu').on('click', inputEvt);
  inputFile.on('change', function (evt) {
    inputFilePath.text(evt.target.value.replace('C:\\fakepath\\', ''));
    icoParse(evt.target.files[0]);
  });

  // Highlightjs
  hljs.initHighlighting();
  // Add class
  jQuery('table').addClass('table table-striped table-hover');
});
