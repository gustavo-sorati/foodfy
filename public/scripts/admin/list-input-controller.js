// Controla a adição de ingredients para receitas

const lists = document.querySelectorAll('.list');
let btnAddItem = document.querySelectorAll('.add_item');
let btnRemoveItem = document.querySelectorAll('.remove_item');

let id;

lists.forEach((list) => {
  id = list.getAttribute('id');
  let listChildren = list.querySelectorAll('.item');

  listChildren.forEach((children, indice) => {
    children.setAttribute('id', `${id}_${indice}`);
    children.querySelector('input').setAttribute('name', `${id}[${indice}]`);
  });
});

function reajustTags() {
  lists.forEach((list) => {
    id = list.getAttribute('id');
    let listChildren = list.querySelectorAll('.item');

    listChildren.forEach((children, indice) => {
      children.setAttribute('id', `${id}_${indice}`);
      children.querySelector('input').setAttribute('name', `${id}[${indice}]`);
      children.querySelector('span').addEventListener('click', removeItem);
    });
  });
}

function createElement(thisList) {
  //create elements childrens and define your propriets
  let div = document.createElement('div');
  let input = document.createElement('input');
  let span = document.createElement('span');

  // Add classes, attributes and function to elements
  div.classList.add('item');

  input.setAttribute('type', 'text');

  span.classList.add('remove_item');
  span.innerHTML = 'X';

  div.appendChild(input);
  div.appendChild(span);
  thisList.appendChild(div);
}

function addItem(event) {
  event.preventDefault();

  let thisList = this.parentNode.querySelector('.list');
  // let inputNull = listItem.lastElementChild.querySelector('input').value != '';

  // Verify the last input on list, and if your value is empty
  if (thisList.lastElementChild.querySelector('input').value != '') {
    createElement(thisList);
    reajustTags();
  }
}

function removeItem(event) {
  event.preventDefault();
  let listItem = this.parentNode.parentNode;

  // capture elements to remove
  let itemId = this.parentNode.getAttribute('id');
  let itemToExclude = listItem.querySelector(`#${itemId}`);

  if (listItem.children.length <= 1) {
    listItem.querySelector(`#${itemId} input`).value = '';
  } else {
    listItem.removeChild(itemToExclude);
    reajustTags(listItem);
  }
}

btnAddItem.forEach((button) => {
  button.addEventListener('click', addItem);
});

btnRemoveItem.forEach((button) => {
  button.addEventListener('click', removeItem);
});
