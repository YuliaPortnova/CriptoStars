import { initContractorsData } from './contractors-data/index.js';
import { request, renderDataError } from './api/index.js';
import { initTransaction, setSubmitDisabled, showMessage, resetTransaction } from './transaction/index.js';
import { renderUserData } from './user-data/index.js';

const BASE_URL = 'https://cryptostar.grading.htmlacademy.pro/';
const USER_URL = 'user';
const CONTRACTORS_URL = 'contractors';

(async () => {
  try {
    const contractorsData = await request(`${BASE_URL}${CONTRACTORS_URL}`);
    initContractorsData(contractorsData);
    const userData = await request(`${BASE_URL}${USER_URL}`);
    renderUserData(userData);
    document.addEventListener('contractorSelect', (event) => {
      initTransaction(event.detail, userData);
    });
  } catch (error) {
    renderDataError();
  }
})();

document.addEventListener('formdata', async (event) => {
  try {
    setSubmitDisabled(true);
    await request(BASE_URL, {method: 'post', body: event.formData});
    resetTransaction();
    showMessage('success');
  } catch (error) {
    showMessage('error');
  } finally {
    setSubmitDisabled(false);
  }
});
