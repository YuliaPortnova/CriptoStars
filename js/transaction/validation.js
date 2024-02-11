import '../../pristine/pristine.min.js';

const PASSWORD = 180712;
const PAYMENT_METHOD_HEADER = 'Выберите платёжную систему';
const RUB = 'RUB';
const KEKS = 'KEKS';

const messages = {
  paymentMethod: 'Платежная система не выбрана',
  password: 'Введите корректный пароль',
};

const form = document.querySelector('.modal-form');
const exchangeAllButton = form.querySelector('.btn--exchange-all');
const rublesAmount = form.querySelector('#rubles-amount');
const keksAmount = form.querySelector('#keks-amount');
const errorMessage = form.querySelector('.modal__validation-message--error');
const successMessage = form.querySelector('.modal__validation-message--success');

const getMaxRublesAmount = (status, balance, exchangeRate, userBalances) => {
  const getMaxUserBalances = (currency) => userBalances.find((item) => item.currency === currency);
  const maxUserKeksBalances = getMaxUserBalances(KEKS);
  const maxUserRublesBalances = getMaxUserBalances(RUB);
  const maxUserRublesAmount = maxUserKeksBalances.amount * exchangeRate;
  if (status === 'buyer') {
    return Math.min(balance.amount, maxUserRublesAmount);
  }
  if (status === 'seller') {
    const maxAmountForSeller = balance.amount * exchangeRate;
    return Math.min(maxAmountForSeller, maxUserRublesBalances.amount);
  }
};

const setCurrentRublesValue = (exchangeRate) => {
  rublesAmount.value = keksAmount.value * exchangeRate;
};

const setCurrentKeksValue = (exchangeRate) => {
  keksAmount.value = rublesAmount.value / exchangeRate;
};

let pristine;

const initValidation = (contractorData, userData) => {
  pristine = new Pristine(form, {
    classTo: 'form-validation',
    errorTextParent: 'form-validation',
    errorTextClass: 'custom-input__error',
  }, false);

  const {status, balance, exchangeRate, minAmount } = contractorData;
  const maxRublesAmount = getMaxRublesAmount(status, balance, exchangeRate, userData.balances);
  rublesAmount.name = (status === 'buyer') ? 'receivingAmount' : 'sendingAmount';
  keksAmount.name = (status === 'buyer') ? 'sendingAmount' : 'receivingAmount';

  const maxKeksAmount = maxRublesAmount / exchangeRate;
  const minKeksAmount = minAmount / exchangeRate;

  pristine.addValidator (
    rublesAmount,
    (value) => value <= maxRublesAmount,
    `Максимальная сумма — ${maxRublesAmount} ₽`
  );

  pristine.addValidator (
    rublesAmount,
    (value) => value.length > 0 && value >= minAmount,
    `Минимальная сумма — ${minAmount} ₽`
  );

  pristine.addValidator (
    keksAmount,
    (value) => value <= maxKeksAmount,
    `Максимальная сумма — ${maxKeksAmount} КЕКС`
  );

  pristine.addValidator (
    keksAmount,
    (value) => value.length > 0 && value >= minKeksAmount,
    `Минимальная сумма — ${minKeksAmount} КЕКС`
  );

  pristine.addValidator (
    form.paymentMethod,
    (value) => value !== PAYMENT_METHOD_HEADER,
    messages.paymentMethod
  );

  pristine.addValidator (
    form.paymentPassword,
    (value) => Number(value) === PASSWORD,
    messages.password
  );

  form.addEventListener('input', (event) => {
    switch (event.target.id) {
      case 'rubles-amount':
        setCurrentKeksValue(exchangeRate);
        pristine.validate(keksAmount);
        pristine.validate(rublesAmount);
        break;
      case 'keks-amount':
        setCurrentRublesValue(exchangeRate);
        pristine.validate(rublesAmount);
        pristine.validate(keksAmount);
        break;
    }
  });

  exchangeAllButton.addEventListener('click', () => {
    if (status === 'seller') {
      rublesAmount.value = maxRublesAmount;
      setCurrentKeksValue(exchangeRate);
    }
    if (status === 'buyer') {
      keksAmount.value = maxKeksAmount;
      setCurrentRublesValue(exchangeRate);
    }
    pristine.validate(keksAmount);
    pristine.validate(rublesAmount);
  });
};

const checkValidity = () => pristine.validate();
const resetValidity = () => pristine.destroy();

const hideMessages = () => {
  errorMessage.style.display = 'none';
  successMessage.style.display = 'none';
};

const showErrorMessage = () => {
  successMessage.style.display = 'none';
  errorMessage.style.display = 'flex';
};

const showSuccessMessage = () => {
  errorMessage.style.display = 'none';
  successMessage.style.display = 'flex';
};

export { initValidation, checkValidity, resetValidity, showErrorMessage, showSuccessMessage, hideMessages };
