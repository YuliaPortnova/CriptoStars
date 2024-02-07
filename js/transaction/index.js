import { renderForm, resetForm } from './form.js';
import { initValidation, checkValidity, resetValidity } from './validation.js';

const form = document.querySelector('.modal-form');
const closeButton = document.querySelector('.modal__close-btn');

const resetTransaction = () => {
  resetForm();
  resetValidity();
};

const initTransaction = (contractorData, userData) => {
  renderForm(contractorData, userData);
  initValidation(contractorData);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (checkValidity(contractorData)) {
      new FormData(form);
      console.log('форма отправлена');
    } else {
      console.log('форма не отправлена');
    }
  });

  closeButton.addEventListener('click', () => resetTransaction());
};

export { initTransaction };
