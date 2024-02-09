import { renderTable } from './table.js';
import { renderMap, closeMap, hideNotVerifiedMarkers, showNotVerifiedMarkers } from './map.js';

const sellersControl = document.querySelector('.tabs__control--sellers');
const buyersControl = document.querySelector('.tabs__control--buyers');
const listControl = document.querySelector('.tabs__control--list');
const mapControl = document.querySelector('.tabs__control--map');
const usersList = document.querySelector('.users-list');
const verifiedContractorsToggle = document.querySelector('#checked-users');
const noDataContainer = document.querySelector('.container--no-data');
const errorContainer = document.querySelector('.container--error-message');
const contractorsContainer = document.querySelector('.container--contractors');

const getSellers = (data) => data.filter((contractor) => contractor.status === 'seller');
const getBuyers = (data) => data.filter((contractor) => contractor.status === 'buyer');
const getVerifiedContractors = (data) => data.filter((contractor) => contractor.isVerified === true);
const getNotVerifiedContractors = (data) => data.filter((contractor) => contractor.isVerified === false);

const switchClass = (fromControl, toControl) => {
  toControl.classList.add('is-active');
  fromControl.classList.remove('is-active');
};

const repaintContractors = (sellers, buyers, cashSellers) => {
  const isVerified = verifiedContractorsToggle.checked;
  const isList = listControl.classList.contains('is-active');
  const isMap = mapControl.classList.contains('is-active');
  const isSellers = sellersControl.classList.contains('is-active');
  const isBuyers = buyersControl.classList.contains('is-active');

  if (isVerified && isList && isSellers) {
    renderTable(getVerifiedContractors(sellers));
  }
  if (!isVerified && isList && isSellers) {
    renderTable(sellers);
  }
  if (isVerified && isList && isBuyers) {
    renderTable(getVerifiedContractors(buyers));
  }
  if (!isVerified && isList && isBuyers) {
    renderTable(buyers);
  }

  if (isVerified && isMap) {
    hideNotVerifiedMarkers();
  }

  if (!isVerified && isMap) {
    showNotVerifiedMarkers(getNotVerifiedContractors(cashSellers));
  }
};

const renderContractors = (contractors) => {
  if (!contractors) {
    noDataContainer.style.display = 'block';
  }
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
    repaintContractors(sellers, buyers, cashSellers);
  });

  listControl.addEventListener('click', () => {
    switchClass(mapControl, listControl);
    usersList.hidden = false;
    closeMap();
    repaintContractors(sellers, buyers, cashSellers);
  });

  verifiedContractorsToggle.addEventListener('change', () => repaintContractors(sellers, buyers, cashSellers));

  renderTable(sellers);
};

const renderErrorContainer = () => {
  errorContainer.style.display = 'block';
  contractorsContainer.style.display = 'none';
};

export { renderContractors, renderErrorContainer };
