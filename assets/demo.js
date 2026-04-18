$(() => {
  // Mime type of output files
  const mime = 'image/png';

  // Handler
  const decodeComplete = (err, images) => {
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
    alert.prependTo('#demo-decode-results');
  };

  const icoDecode = async files => {
    for (const file of files) {
      try {
        const buffer = await file.arrayBuffer();
        // Convert *.ico to *.png(s)
        const images = await ICO.decodeIco(buffer, mime);
        // Debug
        console.dir(images);
        decodeComplete(null, images);
      } catch (err) {
        decodeComplete(err);
      }
    }
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
    icoDecode(evt.originalEvent.dataTransfer.files);
  });

  // Input from file
  $('#input-file').on('change', evt => {
    icoDecode(evt.target.files);
  });

  // Set theme
  const theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.setAttribute('data-bs-theme', theme);
});
