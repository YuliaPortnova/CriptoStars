import { openModal } from './modal.js';

const MODAL_BUY_TITLE = 'Покупка криптовалюты';
const MODAL_SELL_TITLE = 'Продажа криптовалюты';
const RUB = 'RUB';
const KEKS = 'KEKS';

const form = document.querySelector('.modal-form');
const paymentMethodOptions = form.querySelectorAll('.select-paymentMethod option');
const modalTitle = document.querySelector('.modal__description');
const walletContainer = form.querySelector('.modal__wallet');
const star = form.querySelector('.transaction-info__is-verified');
const rate = form.querySelector('.transaction-info__exchange-rate');
const limit = form.querySelector('.transaction-info__limit');
const name = form.querySelector('.transaction-info__name');

let onPaymentMethodChange;

const renderForm = (contractorData, userData) => {
  const {id, status, userName, isVerified, balance, exchangeRate, minAmount, paymentMethods, wallet } = contractorData;

  if (status === 'seller') {
    modalTitle.textContent = MODAL_BUY_TITLE;
    form.classList.add('modal-buy');
    form.classList.remove('modal-sell');
    walletContainer.style.order = '0';
  }

  if (status === 'buyer') {
    modalTitle .textContent = MODAL_SELL_TITLE;
    form.classList.add('modal-sell');
    form.classList.remove('modal-buy');
    walletContainer.style.order = '-1';
  }

  name.textContent = userName;
  star.style.display = (isVerified) ? 'block' : 'none';
  rate.textContent = `${exchangeRate} ₽`;

  const getMaxAmount = (status === 'seller') ? (balance.amount * exchangeRate) : balance.amount;
  limit.textContent = `${minAmount} ₽ - ${getMaxAmount} ₽`;

  form.type.value = (status === 'seller') ? 'BUY' : 'SELL';
  form.contractorId.value = id;
  form.exchangeRate.value = exchangeRate;
  form.sendingCurrency.value = (status === 'seller') ? RUB : KEKS;
  form.receivingCurrency.value = (status === 'seller') ? KEKS : RUB;
  form.wallet.placeholder = (status === 'seller') ? userData.wallet.address : wallet.address;

  paymentMethodOptions.forEach((option) => {
    const methods = (status === 'buyer') ? userData.paymentMethods : paymentMethods;
    const isNecessary = methods.some((method) => method.provider === option.value);
    option.disabled = !isNecessary;
  });

  onPaymentMethodChange = () => {
    const methods = (status === 'buyer') ? userData.paymentMethods : paymentMethods;
    const currentMethod = methods.find((method) => method.provider === form.paymentMethod.value);
    form.accountNumber.placeholder = currentMethod.accountNumber ? currentMethod.accountNumber : '';
  };

  form.paymentMethod.addEventListener('change', onPaymentMethodChange);

  openModal();
};

const closeForm = () => {
  paymentMethodOptions.forEach((option, index) => {
    if (index) {
      option.disabled = false;
    }
  });
  form.paymentMethod.removeEventListener('change', onPaymentMethodChange);
  form.accountNumber.placeholder = '';
  form.reset();
};

export { renderForm, closeForm };
