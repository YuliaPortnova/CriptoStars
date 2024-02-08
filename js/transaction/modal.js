const modal = document.querySelector('.modal');
const closeButton = modal.querySelector('.modal__close-btn');

const onDocumentKeydown = (event) => {
  if (event.key.startsWith('Esc')) {
    closeButton.click();
  }
};

const onModalClick = (event) => {
  if (!event.target.closest('.modal__content')) {
    closeButton.click();
  }
};

const openModal = () => {
  modal.style.display = 'flex';
  modal.scroll(0, 0);
  document.body.classList.add('scroll-lock');
  document.addEventListener('keydown', onDocumentKeydown);
  modal.addEventListener('click', onModalClick);
};

const closeModal = () => {
  modal.style.display = 'none';
  document.body.classList.remove('scroll-lock');
  document.removeEventListener('keydown', onDocumentKeydown);
  modal.removeEventListener('click', onModalClick);
};

closeButton.addEventListener('click', () => closeModal());

export { openModal };

