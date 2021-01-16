// Controle de cards
const spanCut = document.querySelectorAll('.recipes-show__cards__span');

function flipFlop(event) {
  const card = this.parentNode.parentNode;
  const cardChildren = card.querySelector('.recipes-show__cards__itens');

  if (cardChildren.classList.contains('hidden')) {
    this.innerHTML = 'Esconder';
    cardChildren.classList.remove('hidden');
    return;
  }

  cardChildren.classList.add('hidden');
  this.innerHTML = 'Mostrar';
}

spanCut.forEach((button) => {
  button.addEventListener('click', flipFlop);
});
