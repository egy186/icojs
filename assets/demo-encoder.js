$(() => {
  // Handler
  const encodeComplete = (err, ico) => {
    const alert = $('<div class="alert alert-dismissible fade show">');
    alert.append('<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>');
    if (err) {
      alert.addClass('alert-danger');
      alert.append(`<p class="mb-0"><strong>Error:</strong> ${err.message}</p>`);
    } else {
      alert.addClass('alert-success');
      alert.append('<p><strong>Success:</strong></p>');
      const url = URL.createObjectURL(new Blob([ico], { type: 'image/x-icon' }));
      alert.append(`<p class="mb-0"><a href="${url}" target="_blank"><img src="${url}" />favicon.ico</a></p>`);
    }
    alert.prependTo('#demo-encode-results');
  };

  const icoEncode = async files => {
    try {
      const iconList = await Promise.all(Array.from(files).map(async file => {
        const buffer = await file.arrayBuffer();
        return { buffer };
      }));
      // Convert image files to *.ico
      const ico = await ICO.encodeIco(iconList);
      // Debug
      console.dir(ico);
      encodeComplete(null, ico);
    } catch (err) {
      encodeComplete(err);
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
    icoEncode(evt.originalEvent.dataTransfer.files);
  });

  // Input from file
  $('#input-file').on('change', evt => {
    icoEncode(evt.target.files);
  });

  // Set theme
  const theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.setAttribute('data-bs-theme', theme);
});
