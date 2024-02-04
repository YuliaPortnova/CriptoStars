import { renderTable } from './table.js';

const sellersControl = document.querySelector('.tabs__control-sellers');
const buyersControl = document.querySelector('.tabs__control-buyers');

const getSellers = (data) => data.filter((contractor) => contractor.status === 'seller');
const getBuyers = (data) => data.filter((contractor) => contractor.status === 'buyer');

const renderContractors = (contractors) => {
  const sellers = getSellers(contractors);
  const buyers = getBuyers(contractors);
  sellersControl.addEventListener('click', () => {
    sellersControl.classList.add('is-active');
    buyersControl.classList.remove('is-active');
    renderTable(sellers);
  });
  buyersControl.addEventListener('click', () => {
    buyersControl.classList.add('is-active');
    sellersControl.classList.remove('is-active');
    renderTable(buyers);
  });
  sellersControl.click();
};

export { renderContractors };
