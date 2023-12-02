$(() => {
  // Mime type of output files
  const mime = 'image/png';

  // Handler
  const parseComplete = (err, images) => {
    const alert = $('<div class="alert alert-dismissible fade show">');
    alert.append('<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>');
    if (err) {
      alert.addClass('alert-danger');
      alert.append(`<p class="mb-0"><strong>Error:</strong> ${err.message}</p>`);
    } else {
      alert.addClass('alert-success');
      alert.append('<p><strong>Success:</strong></p>');
      images.forEach((image, index) => {
        const text = `${image.width}x${image.height}, ${image.bpp}bit`;
        const url = URL.createObjectURL(new Blob([image.buffer], { type: mime }));
        alert.append(`<p class="mb-${index === images.length - 1 ? 0 : 3}"><a href="${url}" target="_blank"><img src="${url}" /> ${text}</a></p>`);
      });
    }
    alert.prependTo('#demos-parse-results');
  };

  const icoParse = file => {
    // Use FileReader for converting File object to ArrayBuffer object
    const reader = new FileReader();
    reader.onload = async evt => {
      try {
        // Convert *.ico to *.png(s)
        const images = await ICO.parseICO(evt.target.result, mime);
        console.dir(images); // Debug
        parseComplete(null, images);
      } catch (err) {
        parseComplete(err);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Input from drag and drop
  $(document).on('dragenter', evt => {
    evt.stopPropagation();
    evt.preventDefault();
  });
  $(document).on('dragover', evt => {
    evt.stopPropagation();
    evt.preventDefault();
  });
  $(document).on('drop', evt => {
    evt.stopPropagation();
    evt.preventDefault();
    icoParse(evt.originalEvent.dataTransfer.files[0]);
  });
  // Input from file
  const inputFile = $('#input-file');
  const inputFilePath = $('#input-file-path');
  const inputEvt = function (evt) {
    evt.preventDefault();
    inputFile.click();
  };
  $('#input-file-emu').on('click', inputEvt);
  inputFile.on('change', evt => {
    inputFilePath.text(evt.target.files[0].name);
    icoParse(evt.target.files[0]);
  });

  // Highlightjs
  hljs.highlightAll();

  // Add class
  $('h2').addClass('border-bottom mt-4 mb-3 pb-2');
  $('table').addClass('table table-striped table-hover');

  // Set theme
  const theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.setAttribute('data-bs-theme', theme);
  $('head').append($('<link />', {
    href: `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/${theme === 'dark' ? 'github-dark' : 'github'}.min.css`,
    rel: 'stylesheet'
  }));
});
