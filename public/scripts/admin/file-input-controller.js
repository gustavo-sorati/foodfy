// captura a quantidade de arquivos enviados no file e verifica se ultrapassou o limite
// caso tenha ultrapassado realiza um retorno avisando o cliente do limite
// caso contrario percorre o fileList para criar um array dos files e instanciar o componente
// das visualizações das imagens, atráves da interface FileReader da API File do javascript.

const PhotosUpload = {
  input: '',
  preview: document.querySelector('.image-preview'),
  uploadLimit: 5,
  files: [],

  handleFileInput(event) {
    const { files : fileList } = event.target;
    PhotosUpload.input = event.target;

    if(PhotosUpload.hasLimit(event)) return;

    Array.from(fileList).forEach((file) => {
      PhotosUpload.files.push(file);

      const reader = new FileReader();

      reader.onload = () => {
        const image = new Image();
        image.src = String(reader.result);

        const div = PhotosUpload.getContainer(image);

        PhotosUpload.preview.appendChild(div);
      }

      reader.readAsDataURL(file);
    });

    PhotosUpload.input.files = PhotosUpload.getAllFiles();
  },
  hasLimit(event) {
    const { input, uploadLimit, preview } = PhotosUpload;
    const { files : filesList } = input;

    if(filesList.length > uploadLimit) {
      alert('Envie no máximo 5 fotos');
      event.preventDefault();
      return true;
    }

    const photosDiv = [];
    preview.childNodes.forEach(item => {
      if(item.classList && item.classList.value === 'photo') {
        photosDiv.push(item);
      }
    })

    const totalPhotos = filesList.length + photosDiv.length;
    if( totalPhotos > uploadLimit){
      alert('Você atingiu o limite máximo de fotos');
      event.preventDefault();
      return true;
    }


    return false;
  },
  getContainer(image) {
    const div = document.createElement('div');
    div.classList.add('photo')

    div.onclick = PhotosUpload.excludePhoto;

    div.appendChild(image);
    div.appendChild(PhotosUpload.getRemoveButton());

    return div;
  },
  getRemoveButton() {
    const button = document.createElement('i');
    button.classList.add('btnRemovePreview');
    button.innerHTML = 'x';

    return button;
  },
  excludePhoto(event) {
    const photoToExclude = event.target.parentNode;

    if(photoToExclude.hasAttribute("id")){
      PhotosUpload.removeOldPhoto(photoToExclude.getAttribute('id'))
    }

    const photosArray = Array.from(PhotosUpload.preview.children);

    const index = photosArray.indexOf(photoToExclude);

    PhotosUpload.files.splice(index, 1);
    PhotosUpload.input.files = PhotosUpload.getAllFiles();

    photoToExclude.remove();
  },
  getAllFiles() {
    const dataTransfer = new ClipboardEvent('').clipboardData || new DataTransfer();

    PhotosUpload.files.forEach((file) => dataTransfer.items.add(file));

    return dataTransfer.files
  },
  removeOldPhoto(id){
    const input = document.querySelector('#removed_files');

    if(input.value !== ''){
      input.value = ',' + id;
    }

    input.value = id;

    console.log(input)
  }
}
