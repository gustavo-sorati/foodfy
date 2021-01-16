const cards = document.querySelectorAll('.recipes__card');

for (let card of cards) {
  card.addEventListener('click', () => {
    console.log('oi');
    const pageId = card.getAttribute('id');
    window.location.href = `/recipes/${pageId}`;
  });
}
