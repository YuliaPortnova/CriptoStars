import { renderTable } from './table.js';
import { renderMap, closeMap } from './map.js';

const sellersControl = document.querySelector('.tabs__control--sellers');
const buyersControl = document.querySelector('.tabs__control--buyers');
const listControl = document.querySelector('.tabs__control--list');
const mapControl = document.querySelector('.tabs__control--map');
const usersList = document.querySelector('.users-list');

const getSellers = (data) => data.filter((contractor) => contractor.status === 'seller');
const getBuyers = (data) => data.filter((contractor) => contractor.status === 'buyer');

const switchClass = (fromControl, toControl) => {
  toControl.classList.add('is-active');
  fromControl.classList.remove('is-active');
};

const renderContractors = (contractors) => {
  const sellers = getSellers(contractors);
  const buyers = getBuyers(contractors);
  const cashSellers = sellers.filter((seller) => seller.paymentMethods.some((method) => method.provider === 'Cash in person'));

  sellersControl.addEventListener('click', () => {
    switchClass(buyersControl, sellersControl);
    renderTable(sellers);
  });

  buyersControl.addEventListener('click', () => {
    switchClass(sellersControl, buyersControl);
    renderTable(buyers);
  });

  mapControl.addEventListener('click', () => {
    switchClass(listControl, mapControl);
    usersList.hidden = true;
    renderMap(cashSellers);
  });

  listControl.addEventListener('click', () => {
    switchClass(mapControl, listControl);
    usersList.hidden = false;
    closeMap();
    // renderTable(buyers);
  });
  renderTable(sellers);
};

export { renderContractors };
