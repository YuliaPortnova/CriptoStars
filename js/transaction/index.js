import { renderForm, closeForm } from './form.js';
import { initValidation, checkValidity, resetValidity, showErrorMessage, showSuccessMessage, hideMessages } from './validation.js';

const form = document.querySelector('.modal-form');
const closeButton = document.querySelector('.modal__close-btn');
const submitButton = document.querySelector('.modal__submit');

let onFormSubmit;

const onCloseButtonClick = () => {
  closeForm();
  resetValidity();
  hideMessages();
  form.removeEventListener('submit', onFormSubmit);
  onFormSubmit = undefined;
  closeButton.removeEventListener('click', onCloseButtonClick);
};

const resetTransaction = () => {
  form.reset();
  resetValidity();
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

  form.addEventListener('submit', onFormSubmit);
  closeButton.addEventListener('click', onCloseButtonClick);
};

const setSubmitDisabled = (flag) => {
  submitButton.disabled = flag;
  submitButton.textContent = flag ? 'Обменять...' : 'Обменять!';
};

export { initTransaction, setSubmitDisabled, showErrorMessage, showSuccessMessage, resetTransaction };
