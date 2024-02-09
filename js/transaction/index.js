import { renderForm, resetForm } from './form.js';
import { initValidation, checkValidity, resetValidity, showMessage, hideMessages } from './validation.js';

const form = document.querySelector('.modal-form');
const closeButton = document.querySelector('.modal__close-btn');
const submitButton = document.querySelector('.modal__submit');

let onFormSubmit;
let onCloseButtonClick;

const resetTransaction = () => {
  resetForm();
  resetValidity();
  hideMessages();
  form.removeEventListener('submit', onFormSubmit);
  onFormSubmit = undefined;
  closeButton.removeEventListener('click', onCloseButtonClick);
  onCloseButtonClick = undefined;
};

const initTransaction = (contractorData, userData) => {
  renderForm(contractorData, userData);
  initValidation(contractorData, userData);

  onFormSubmit = (event) => {
    event.preventDefault();
    if (checkValidity(contractorData)) {
      new FormData(form);
    }
  };

  onCloseButtonClick = resetTransaction;

  form.addEventListener('submit', onFormSubmit);
  closeButton.addEventListener('click', onCloseButtonClick);
};

const setSubmitDisabled = (flag) => {
  submitButton.disabled = flag;
  submitButton.textContent = flag ? 'Обменять...' : 'Обменять!';
};

export { initTransaction, setSubmitDisabled, showMessage, resetTransaction };
