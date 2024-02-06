const modal = document.querySelector('.modal--buy');
const closeButton = modal.querySelector('.modal__close-btn');
const form = modal.querySelector('.modal-form');

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

const renderModal = (properties) => {
  const {id, status, userName, isVerified, balance, exchangeRate, minAmount, paymentMethods } = properties;
  modal.querySelector('.transaction-info__name').textContent = userName;
  if (isVerified) {
    modal.querySelector('.transaction-info__is-verified').style.display = 'block';
  } else {
    modal.querySelector('.transaction-info__is-verified').style.display = 'none';
  }
  modal.querySelector('.transaction-info__exchange-rate').textContent = `${Math.round(exchangeRate)} ₽`;
  const maxAmount = (status === 'seller') ? Math.round(balance.amount * exchangeRate) : balance.amount;
  modal.querySelector('.transaction-info__limit').textContent = `${minAmount} ₽ - ${maxAmount} ₽`;
  form.type.value = (status === 'seller') ? 'BUY' : 'SELL';
  form.contractorId.value = id;
  form.exchangeRate.value = exchangeRate;
  form.sendingCurrency.value = balance.currency;
  form.receivingCurrency.value = (status === 'seller') ? 'RUB' : 'KEKS';

  openModal();
};

export { renderModal };
