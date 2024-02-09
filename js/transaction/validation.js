import '../../pristine/pristine.min.js';

const form = document.querySelector('.modal-form');
const exchangeAllButton = form.querySelector('.btn--exchange-all');
const rublesAmount = form.querySelector('#rubles-amount');
const keksAmount = form.querySelector('#keks-amount');

const getMaxRublesAmount = (status, balance, exchangeRate, userBalances) => {
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

const setCurrentRublesValue = (exchangeRate) => {
  rublesAmount.value = round(keksAmount.value * exchangeRate);
};

const setCurrentKeksValue = (exchangeRate) => {
  keksAmount.value = round(rublesAmount.value / exchangeRate);
};

let pristine;

const initValidation = (contractorData, userData) => {
  pristine = new Pristine(form, {
    classTo: 'form-validation',
    errorTextParent: 'form-validation',
    errorTextClass: 'custom-input__error',
  });

  const {status, balance, exchangeRate, minAmount } = contractorData;
  const maxRublesAmount = getMaxRublesAmount(status, balance, exchangeRate, userData.balances);
  rublesAmount.name = (status === 'buyer') ? 'receivingAmount' : 'sendingAmount';
  keksAmount.name = (status === 'buyer') ? 'sendingAmount' : 'receivingAmount';

  const maxKeksAmount = maxRublesAmount / exchangeRate;
  const minKeksAmount = minAmount / exchangeRate;

  pristine.addValidator (
    rublesAmount,
    (value) => value <= round(maxRublesAmount),
    `Максимальная сумма — ${round(maxRublesAmount)} ₽`
  );

  pristine.addValidator (
    rublesAmount,
    (value) => value.length > 0 && value >= minAmount,
    `Минимальная сумма — ${minAmount} ₽`
  );

  pristine.addValidator (
    keksAmount,
    (value) => value <= round(maxKeksAmount),
    `Максимальная сумма — ${round(maxKeksAmount)} КЕКС`
  );

  pristine.addValidator (
    keksAmount,
    (value) => value.length > 0 && value >= round(minKeksAmount),
    `Минимальная сумма — ${round(minKeksAmount)} КЕКС`
  );

  pristine.addValidator (
    form.paymentMethod,
    (value) => value !== 'Выберите платёжную систему',
    'Платежная система не выбрана'
  );

  pristine.addValidator (
    form.paymentPassword,
    (value) => Number(value) === 180712,
    'Введите корректный пароль'
  );

  form.addEventListener('input', (event) => {
    switch (event.target.id) {
      case 'rubles-amount':
        setCurrentKeksValue(exchangeRate);
        pristine.validate(keksAmount);
        break;
      case 'keks-amount':
        setCurrentRublesValue(exchangeRate);
        pristine.validate(rublesAmount);
        break;
    }
  });

  exchangeAllButton.addEventListener('click', () => {
    rublesAmount.value = maxRublesAmount;
    setCurrentKeksValue(exchangeRate);
    pristine.validate(keksAmount);
    pristine.validate(rublesAmount);
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
