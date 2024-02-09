import { renderContractors } from './contractors-information/index.js';
import { request } from './api.js';
import { initTransaction, setSubmitDisabled, showMessage } from './transaction/index.js';

const BASE_URL = 'https://cryptostar.grading.htmlacademy.pro/';
const USER_URL = 'user';
const CONTRACTORS_URL = 'contractors';

try {
  (async () => {
    const contractorsData = await request(`${BASE_URL}${CONTRACTORS_URL}`);
    renderContractors(contractorsData);
    const userData = await request(`${BASE_URL}${USER_URL}`);
    document.addEventListener('contractorSelect', (event) => {
      initTransaction(event.detail, userData);
    });
  })();
} catch (error) {
  // renderStatus('data-error', {autoHide: 5000});
  console.log('Ошибка');
}

document.addEventListener('formdata', async (event) => {
  try {
    setSubmitDisabled(true);
    await request(BASE_URL, {method: 'post', body: event.formData});
    // resetForm();
    showMessage('success');
  } catch (error) {
    showMessage('error');
  } finally {
    setSubmitDisabled(false);
  }
});
