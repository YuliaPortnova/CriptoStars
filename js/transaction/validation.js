import '../../pristine/pristine.min.js';

const form = document.querySelector('.modal-form');
const exchangeAllButton = form.querySelector('.btn--exchange-all');



const getMaxSendingAmount = (status, balance, exchangeRate) => {
  const maxAmountForSeller = Math.round(balance.amount * exchangeRate);
  return (status === 'seller') ? maxAmountForSeller : balance.amount;
};

const setCurrentSendingValue = (exchangeRate) => {
  form.sendingAmount.value = Math.round(form.receivingAmount.value * exchangeRate);
};

const setCurrentReceivingValue = (exchangeRate) => {
  form.receivingAmount.value = Math.round(form.sendingAmount.value / exchangeRate);
};

let pristine;

const initValidation = (properties) => {
  pristine = new Pristine(form, {
    classTo: 'custom-input',
    errorTextParent: 'custom-input',
    errorTextClass: 'custom-input__error',
  });

  const {status, balance, exchangeRate, minAmount } = properties;
  const maxSendingAmount = getMaxSendingAmount(status, balance, exchangeRate);
  const maxReceivingAmount = Math.round(maxSendingAmount / exchangeRate);
  const minReceivingAmount = Math.round(minAmount / exchangeRate);
  form.sendingAmount.step = Math.round(exchangeRate);

  pristine.addValidator (
    form.sendingAmount,
    (value) => value <= maxSendingAmount,
    `Максимальная сумма — ${maxSendingAmount} ₽`
  );

  pristine.addValidator (
    form.sendingAmount,
    (value) => value >= minAmount,
    `Минимальная сумма — ${minAmount} ₽`
  );

  pristine.addValidator (
    form.receivingAmount,
    (value) => value <= maxReceivingAmount,
    `Максимальная сумма — ${maxReceivingAmount} КЕКС`
  );

  pristine.addValidator (
    form.receivingAmount,
    (value) => value >= minReceivingAmount,
    `Минимальная сумма — ${minReceivingAmount} КЕКС`
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

export { initValidation, checkValidity, resetValidity };
