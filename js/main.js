import { renderContractors } from './contractors-information/index.js';
import { request } from './api.js';

const BASE_URL = 'https://cryptostar.grading.htmlacademy.pro/';
const USER_URL = 'user';
const CONTRACTORS_URL = 'contractors';

try {
  renderContractors(await request(`${BASE_URL}${CONTRACTORS_URL}`));
} catch {
  // renderStatus('data-error', {autoHide: 5000});
  console.log('Ошибка');
}
