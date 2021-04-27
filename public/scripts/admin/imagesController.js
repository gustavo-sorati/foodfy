const ImagesController = {
  hero: document.querySelector('.show-images__main img'),
  container: document.querySelectorAll('.show-images__children'),

  getImage(event){
    return event;
  },
  changeImages(alvo){
    const selection = alvo;
    const selectedImage = selection.querySelector('img');

    ImagesController.container.forEach((image) => {
      image.querySelector('img').classList.remove('active');
    });

    selectedImage.classList.add('active');

    ImagesController.hero.src = selectedImage.src;
    ImagesController.hero.id = selectedImage.id;
  }
}
