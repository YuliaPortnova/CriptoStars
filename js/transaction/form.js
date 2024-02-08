import { openModal } from './modal.js';

const form = document.querySelector('.modal-form');
const paymentMethodOptions = form.querySelectorAll('.select-paymentMethod option');
const modalTitle = document.querySelector('.modal__description');
const walletContainer = document.querySelector('.modal__wallet');
const star = form.querySelector('.transaction-info__is-verified');
const rate = form.querySelector('.transaction-info__exchange-rate');
const limit = form.querySelector('.transaction-info__limit');
const name = form.querySelector('.transaction-info__name');

const renderForm = (contractorData, userData) => {
  const {id, status, userName, isVerified, balance, exchangeRate, minAmount, paymentMethods, wallet } = contractorData;

  if (status === 'seller') {
    modalTitle.textContent = 'Покупка криптовалюты';
    form.classList.add('modal-buy');
    form.classList.remove('modal-sell');
    walletContainer.style.order = '0';
  }

  if (status === 'buyer') {
    modalTitle .textContent = 'Продажа криптовалюты';
    form.classList.add('modal-sell');
    form.classList.remove('modal-buy');
    walletContainer.style.order = '-1';
  }

  name.textContent = userName;
  star.style.display = (isVerified) ? 'block' : 'none';
  rate.textContent = `${Math.round(exchangeRate)} ₽`;

  const getMaxAmount = (status === 'seller') ? Math.floor(balance.amount * exchangeRate) : balance.amount;
  limit.textContent = `${minAmount} ₽ - ${getMaxAmount} ₽`;

  form.type.value = (status === 'seller') ? 'BUY' : 'SELL';
  form.contractorId.value = id;
  form.exchangeRate.value = exchangeRate;
  form.sendingCurrency.value = balance.currency;
  form.receivingCurrency.value = (status === 'seller') ? 'KEKS' : 'RUB';
  form.wallet.placeholder = (status === 'seller') ? userData.wallet.address : wallet.address;

  paymentMethodOptions.forEach((option) => {
    const isNecessaryForBuyer = () => userData.paymentMethods.some((method) => method.provider === option.value);
    const isNecessaryForSeller = () => paymentMethods.some((method) => method.provider === option.value);

    const isNecessary = (status === 'seller') ? isNecessaryForSeller : isNecessaryForBuyer;
    if (!isNecessary) {
      option.disabled = true;
    }
  });

  openModal();
};

const resetForm = () => {
  paymentMethodOptions.forEach((option, index) => {
    if (index) {
      option.disabled = false;
    }
  });
  form.reset();
};

export { renderForm, resetForm };
