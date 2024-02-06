import { renderTable } from './table.js';
import { renderMap, closeMap } from './map.js';

const sellersControl = document.querySelector('.tabs__control--sellers');
const buyersControl = document.querySelector('.tabs__control--buyers');
const listControl = document.querySelector('.tabs__control--list');
const mapControl = document.querySelector('.tabs__control--map');
const usersList = document.querySelector('.users-list');
const verifiedContractorsToggle = document.querySelector('#checked-users');

const getSellers = (data) => data.filter((contractor) => contractor.status === 'seller');
const getBuyers = (data) => data.filter((contractor) => contractor.status === 'buyer');
const getVerifiedContractors = (data) => data.filter((contractor) => contractor.isVerified === true);
const getNotVerifiedContractors = (data) => data.filter((contractor) => contractor.isVerified === false);

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
    if (verifiedContractorsToggle.checked) {
      renderTable(getVerifiedContractors(sellers));
    } else {
      renderTable(sellers);
    }
  });

  buyersControl.addEventListener('click', () => {
    switchClass(sellersControl, buyersControl);
    if (verifiedContractorsToggle.checked) {
      renderTable(getVerifiedContractors(buyers));
    } else {
      renderTable(buyers);
    }
  });

  mapControl.addEventListener('click', () => {
    switchClass(listControl, mapControl);
    usersList.hidden = true;
    renderMap(getVerifiedContractors(cashSellers), getNotVerifiedContractors(cashSellers));
  });

  listControl.addEventListener('click', () => {
    switchClass(mapControl, listControl);
    usersList.hidden = false;
    closeMap();
  });
  renderTable(sellers);

  verifiedContractorsToggle.addEventListener('change', () => {
    if (verifiedContractorsToggle.checked && listControl.classList.contains('is-active') && sellersControl.classList.contains('is-active')) {
      renderTable(getVerifiedContractors(sellers));
    }
    if (!verifiedContractorsToggle.checked && listControl.classList.contains('is-active') && sellersControl.classList.contains('is-active')) {
      renderTable(sellers);
    }
    if (verifiedContractorsToggle.checked && listControl.classList.contains('is-active') && buyersControl.classList.contains('is-active')) {
      renderTable(getVerifiedContractors(buyers));
    }
    if (!verifiedContractorsToggle.checked && listControl.classList.contains('is-active') && buyersControl.classList.contains('is-active')) {
      renderTable(buyers);
    }
  });
};

export { renderContractors };
