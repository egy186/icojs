$(function () {
  // Mime type of output files
  var mime = 'image/png';

  // Handler
  var parseComplete = function (err, images) {
    var alert = $('<div class="alert alert-dismissable fade in">');
    alert.append('<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>');
    if (err) {
      alert.addClass('alert-danger');
      alert.append('<p><strong>Error:</strong> ' + err.message + '</p>');
    } else {
      alert.addClass('alert-success');
      alert.append('<p><strong>Success:</strong></p>');
      images.forEach(function (image) {
        var text = image.width + 'x' + image.height + ', ' + image.bit + 'bit';
        var url = URL.createObjectURL(new Blob([image.buffer], { type: mime }));
        alert.append('<p><a href="' + url + '" target="_blank"><img src="' + url + '" /> ' + text + '</a></p>');
      });
    }
    alert.prependTo('#demos-parse-results');
  };

  var icoParse = function (file) {
    // Use FileReader for converting File object to ArrayBuffer object
    var reader = new FileReader();
    reader.onload = function (evt) {
      // Convert *.ico to *.png(s)
      ICO.parse(evt.target.result, mime).then(function (images) {
        console.dir(images); // Debug
        parseComplete(null, images);
      }).catch(function (err) {
        parseComplete(err);
      });
    };
    reader.readAsArrayBuffer(file);
  };

  // Input from drag and drop
  $(document).on('dragenter', function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
  });
  $(document).on('dragover', function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
  });
  $(document).on('drop', function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
    icoParse(evt.originalEvent.dataTransfer.files[0]);
  });
  // Input from file
  var inputFile = $('#input-file');
  var inputFilePath = $('#input-file-path');
  var inputEvt = function (evt) {
    evt.preventDefault();
    inputFile.click();
  };
  inputFilePath.on('click', inputEvt);
  $('#input-file-emu').on('click', inputEvt);
  inputFile.on('change', function (evt) {
    inputFilePath.text(evt.target.files[0].name);
    icoParse(evt.target.files[0]);
  });

  // Highlightjs
  hljs.initHighlighting();
  // Add class
  $('h2').addClass('page-header');
  $('table').addClass('table table-striped table-hover');
});
