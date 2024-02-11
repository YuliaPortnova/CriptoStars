import { renderTable } from './table.js';
import { renderMap, closeMap, hideNotVerifiedMarkers, showNotVerifiedMarkers } from './map.js';

const CASH_METHOD = 'Cash in person';

const sellersControl = document.querySelector('.tabs__control--sellers');
const buyersControl = document.querySelector('.tabs__control--buyers');
const listControl = document.querySelector('.tabs__control--list');
const mapControl = document.querySelector('.tabs__control--map');
const usersList = document.querySelector('.users-list');
const verifiedContractorsToggle = document.querySelector('#checked-users');
const noDataContainer = document.querySelector('.container--no-data');
const tableBody = document.querySelector('.users-list__table-body');

const getSellers = (data) => data && data.length && data.filter((contractor) => contractor.status === 'seller');
const getBuyers = (data) => data && data.length && data.filter((contractor) => contractor.status === 'buyer');
const filterVerifiedContractors = (data, isVerified) => {
  if (!data || data.length === 0) {
    return [];
  }
  return data.filter((contractor) => contractor.isVerified === isVerified);
};

const switchClass = (fromControl, toControl) => {
  toControl.classList.add('is-active');
  fromControl.classList.remove('is-active');
};

const showNoDataContainer = () => {
  tableBody.style.display = 'none';
  noDataContainer.style.display = 'block';
};

const hideNoDataContainer = () => {
  tableBody.style.display = 'block';
  noDataContainer.style.display = 'none';
};

const repaintContractors = (sellers, buyers, cashSellers) => {
  const isVerifiedOnly = verifiedContractorsToggle.checked;
  const isList = listControl.classList.contains('is-active');
  const isMap = mapControl.classList.contains('is-active');
  const isSellers = sellersControl.classList.contains('is-active');

  if (isList) {
    const data = (isSellers) ? sellers : buyers;
    const currentContractors = (isVerifiedOnly) ? filterVerifiedContractors(data, true) : data;
    if (currentContractors.length === 0) {
      showNoDataContainer();
    } else {
      hideNoDataContainer();
      renderTable(currentContractors);
    }
  }

  if (isMap) {
    hideNoDataContainer();
    if (isVerifiedOnly) {
      hideNotVerifiedMarkers();
    } else {
      showNotVerifiedMarkers(filterVerifiedContractors(cashSellers, false));
    }
  }
};

const addEventListeners = (sellers, buyers, cashSellers) => {
  sellersControl.addEventListener('click', () => {
    switchClass(buyersControl, sellersControl);
    repaintContractors (sellers, buyers, cashSellers);
  });

  buyersControl.addEventListener('click', () => {
    switchClass(sellersControl, buyersControl);
    repaintContractors (sellers, buyers, cashSellers);
  });

  mapControl.addEventListener('click', () => {
    switchClass(listControl, mapControl);
    usersList.hidden = true;
    if (!buyers && !sellers) {
      noDataContainer.style.display = 'none';
      renderMap(null, null);
    } else {
      renderMap(filterVerifiedContractors(cashSellers, true), filterVerifiedContractors(cashSellers, false));
      repaintContractors(sellers, buyers, cashSellers);
    }
  });

  listControl.addEventListener('click', () => {
    switchClass(mapControl, listControl);
    usersList.hidden = false;
    closeMap();
    repaintContractors (sellers, buyers, cashSellers);
  });
};

const initContractorsData = (contractors) => {
  let sellers;
  let buyers;
  let cashSellers;

  if (contractors.length > 0) {
    sellers = getSellers(contractors);
    buyers = getBuyers(contractors);
    cashSellers = sellers.filter((seller) => seller.paymentMethods.some((method) => method.provider === CASH_METHOD));
  }

  addEventListeners(sellers, buyers, cashSellers);

  if (contractors.length === 0) {
    noDataContainer.style.display = 'block';
    return;
  }

  verifiedContractorsToggle.addEventListener('change', () => repaintContractors(sellers, buyers, cashSellers, renderTable, hideNotVerifiedMarkers, showNotVerifiedMarkers));

  if (sellers.length === 0) {
    showNoDataContainer();
  } else {
    renderTable(sellers);
  }
};

export { initContractorsData };
