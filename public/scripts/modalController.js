const recipeItem = document.querySelectorAll('.recipes');
const modal = document.querySelector('.modal');
const closeModal = document.querySelector('.modal div .close-modal');

function handleClick(event) {
  modal.classList.add('active');

  modal
    .querySelector('img')
    .setAttribute('src', `${this.querySelector('img').getAttribute('src')}`);
  modal.querySelector('h1').innerHTML = this.querySelector(
    '.info h3',
  ).innerHTML;
  modal.querySelector('p').innerHTML = this.querySelector('.info p').innerHTML;

  closeModal.addEventListener('click', handleCloseModal);

  function handleCloseModal(event) {
    modal.classList.remove('active');
  }
}

recipeItem.forEach((recipe) => {
  recipe.addEventListener('click', handleClick);
});
