import { openModal } from './modal.js';

const form = document.querySelector('.modal-form');
const paymentMethodOptions = form.querySelectorAll('.select-paymentMethod option');

const renderForm = (contractorData, userData) => {
  const {id, status, userName, isVerified, balance, exchangeRate, minAmount, paymentMethods } = contractorData;
  form.querySelector('.transaction-info__name').textContent = userName;
  if (isVerified) {
    form.querySelector('.transaction-info__is-verified').style.display = 'block';
  } else {
    form.querySelector('.transaction-info__is-verified').style.display = 'none';
  }
  form.querySelector('.transaction-info__exchange-rate').textContent = `${Math.round(exchangeRate)} ₽`;
  const getMaxAmount = (status === 'seller') ? Math.round(balance.amount * exchangeRate) : balance.amount;
  form.querySelector('.transaction-info__limit').textContent = `${minAmount} ₽ - ${getMaxAmount} ₽`;
  form.type.value = (status === 'seller') ? 'BUY' : 'SELL';
  form.contractorId.value = id;
  form.exchangeRate.value = exchangeRate;
  form.sendingCurrency.value = balance.currency;
  form.receivingCurrency.value = (status === 'seller') ? 'RUB' : 'KEKS';

  paymentMethodOptions.forEach((option) => {
    if (status === 'buyer') {
      const isNecessary = userData.paymentMethods.some((method) => method.provider === option.value);
      if (!isNecessary) {
        option.disabled = true;
      }
    }
    if (status === 'seller') {
      const isNecessary = paymentMethods.some((method) => method.provider === option.value);
      if (!isNecessary) {
        option.disabled = true;
      }
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
