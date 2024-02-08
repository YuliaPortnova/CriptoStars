import { renderForm, resetForm } from './form.js';
import { initValidation, checkValidity, resetValidity, showMessage } from './validation.js';

const form = document.querySelector('.modal-form');
const closeButton = document.querySelector('.modal__close-btn');
const submitButton = document.querySelector('.modal__submit');

const resetTransaction = () => {
  resetForm();
  resetValidity();
};

const initTransaction = (contractorData, userData) => {
  renderForm(contractorData, userData);
  initValidation(contractorData, userData);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (checkValidity(contractorData)) {
      new FormData(form);
      showMessage('success');
    }
  });

  closeButton.addEventListener('click', () => resetTransaction());
};

const setSubmitDisabled = (flag) => {
  submitButton.disabled = flag;
  submitButton.textContent = flag ? 'Обменять...' : 'Обменять!';
};

export { initTransaction, setSubmitDisabled };
