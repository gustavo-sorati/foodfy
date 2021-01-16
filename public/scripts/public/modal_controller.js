const recipeItem = document.querySelectorAll('.recipes__card');
const modal = document.querySelector('.modal');
const closeModal = document.querySelector('.modal div .close-modal');

function handleClick(event) {
  modal.classList.add('active');
  console.log(this);
  modal
    .querySelector('img')
    .setAttribute('src', `${this.querySelector('img').getAttribute('src')}`);
  modal.querySelector('h1').innerHTML = this.querySelector('.recipes__card__title').innerHTML;
  modal.querySelector('p').innerHTML = this.querySelector('.recipes__card__author').innerHTML;

  closeModal.addEventListener('click', handleCloseModal);

  function handleCloseModal(event) {
    modal.classList.remove('active');
  }
}

recipeItem.forEach((recipe) => {
  recipe.addEventListener('click', handleClick);
  recipe.style.cursor = 'pointer';
});
