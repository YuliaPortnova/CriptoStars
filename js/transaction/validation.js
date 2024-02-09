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

const round = (number) => Number(number.toFixed(2));

const setCurrentSendingValue = (exchangeRate) => {
  form.sendingAmount.value = round(form.receivingAmount.value * exchangeRate);
};

const setCurrentReceivingValue = (exchangeRate) => {
  form.receivingAmount.value = round(form.sendingAmount.value / exchangeRate);
};

let pristine;

const initValidation = (contractorData, userData) => {
  pristine = new Pristine(form, {
    classTo: 'form-validation',
    errorTextParent: 'form-validation',
    errorTextClass: 'custom-input__error',
  });

  const {status, balance, exchangeRate, minAmount } = contractorData;
  const maxSendingAmount = getMaxSendingAmount(status, balance, exchangeRate, userData.balances);
  const maxReceivingAmount = maxSendingAmount / exchangeRate;
  const minReceivingAmount = minAmount / exchangeRate;

  pristine.addValidator (
    form.sendingAmount,
    (value) => value <= maxSendingAmount,
    `Максимальная сумма — ${Number(round(maxSendingAmount))} ₽`
  );

  pristine.addValidator (
    form.sendingAmount,
    (value) => value.length > 0 && value >= minAmount,
    `Минимальная сумма — ${minAmount} ₽`
  );

  pristine.addValidator (
    form.receivingAmount,
    (value) => value <= maxReceivingAmount,
    `Максимальная сумма — ${round(maxReceivingAmount)} КЕКС`
  );

  pristine.addValidator (
    form.receivingAmount,
    (value) => value.length > 0 && value >= minReceivingAmount,
    `Минимальная сумма — ${round(minReceivingAmount)} КЕКС`
  );

  pristine.addValidator (
    form.paymentMethod,
    (value) => value !== 'Выберите платёжную систему',
    'Платежная система не выбрана'
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

const hideMessages = () => {
  form.querySelector('.modal__validation-message--error').style.display = 'none';
  form.querySelector('.modal__validation-message--success').style.display = 'none';
};

const showMessage = (status) => {
  hideMessages();
  const message = form.querySelector(`.modal__validation-message--${status}`);
  message.style.display = 'flex';
};

export { initValidation, checkValidity, resetValidity, showMessage, hideMessages };
