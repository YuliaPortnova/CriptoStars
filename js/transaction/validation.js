import '../../pristine/pristine.min.js';

const form = document.querySelector('.modal-form');
const exchangeAllButton = form.querySelector('.btn--exchange-all');

const getMaxSendingAmount = (status, balance, exchangeRate, userBalances) => {
  const maxUserRubleBalances = userBalances.find((item) => item.currency === 'RUB');
  if (status === 'buyer') {
    return Math.min(balance.amount, maxUserRubleBalances.amount);
  }
  if (status === 'seller') {
    const maxAmountForSeller = balance.amount * exchangeRate;
    return Math.min(maxAmountForSeller, maxUserRubleBalances.amount);
  }
};

const setCurrentSendingValue = (exchangeRate) => {
  form.sendingAmount.value = Math.round(form.receivingAmount.value * exchangeRate);
};

const setCurrentReceivingValue = (exchangeRate) => {
  form.receivingAmount.value = Math.round(form.sendingAmount.value / exchangeRate);
};

let pristine;

const initValidation = (contractorData, userData) => {
  pristine = new Pristine(form, {
    classTo: 'custom-input',
    errorTextParent: 'custom-input',
    errorTextClass: 'custom-input__error',
  });

  const {status, balance, exchangeRate, minAmount } = contractorData;
  const maxSendingAmount = getMaxSendingAmount(status, balance, exchangeRate, userData.balances);
  const maxReceivingAmount = maxSendingAmount / exchangeRate;
  const minReceivingAmount = minAmount / exchangeRate;
  form.sendingAmount.step = Math.floor(exchangeRate);

  pristine.addValidator (
    form.sendingAmount,
    (value) => value <= maxSendingAmount,
    `Максимальная сумма — ${Math.floor(maxSendingAmount)} ₽`
  );

  pristine.addValidator (
    form.sendingAmount,
    (value) => value.length > 0 && value >= minAmount,
    `Минимальная сумма — ${minAmount} ₽`
  );

  pristine.addValidator (
    form.receivingAmount,
    (value) => value <= maxReceivingAmount,
    `Максимальная сумма — ${Math.floor(maxReceivingAmount)} КЕКС`
  );

  pristine.addValidator (
    form.receivingAmount,
    (value) => value.length > 0 && value >= minReceivingAmount,
    `Минимальная сумма — ${Math.ceil(minReceivingAmount)} КЕКС`
  );

  pristine.addValidator (
    form.paymentPassword,
    (value) => value.length > 0,
    'Введите пароль'
  );

  form.addEventListener('input', (event) => {
    switch (event.target.name) {
      case 'sendingAmount':
        setCurrentReceivingValue(exchangeRate);
        pristine.validate(form.receivingAmount);
        break;
      case 'receivingAmount':
        setCurrentSendingValue(exchangeRate);
        pristine.validate(form.sendingAmount);
        break;
    }
  });

  exchangeAllButton.addEventListener('click', () => {
    form.sendingAmount.value = maxSendingAmount;
    setCurrentReceivingValue(exchangeRate);
    pristine.validate(form.receivingAmount);
    pristine.validate(form.sendingAmount);
  });
};

const checkValidity = () => pristine.validate();
const resetValidity = () => pristine.destroy();

const showMessage = (status) => {
  const message = form.querySelector(`.modal__validation-message--${status}`);
  message.style.display = 'flex';
};

export { initValidation, checkValidity, resetValidity, showMessage };
