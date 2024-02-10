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
const getVerifiedContractors = (data) => {
  if (!data || !data.length) {
    return [];
  }
  return data.filter((contractor) => contractor.isVerified === true);
};
const getNotVerifiedContractors = (data) => {
  if (!data || !data.length) {
    return [];
  }
  return data.filter((contractor) => contractor.isVerified === false);
};

const switchClass = (fromControl, toControl) => {
  toControl.classList.add('is-active');
  fromControl.classList.remove('is-active');
};

const toggleNoDataContainer = (displayValue) => {
  const oppositeValue = (displayValue === 'none') ? 'block' : 'none';
  tableBody.style.display = oppositeValue;
  noDataContainer.style.display = displayValue;
};

const repaintContractors = (sellers, buyers, cashSellers, renderTable, hideNotVerifiedMarkers, showNotVerifiedMarkers) => {
  const isVerified = verifiedContractorsToggle.checked;
  const isList = listControl.classList.contains('is-active');
  const isMap = mapControl.classList.contains('is-active');
  const isSellers = sellersControl.classList.contains('is-active');
  const isBuyers = buyersControl.classList.contains('is-active');
  const isSellersListEmpty = !sellers || !sellers.length;
  const isBuyersListEmpty = !buyers || !buyers.length;

  if (isVerified && isList && isSellers) {
    if (!getVerifiedContractors(sellers).length) {
      toggleNoDataContainer('block');
    } else {
      toggleNoDataContainer('none');
      renderTable(getVerifiedContractors(sellers));
    }
  }
  if (!isVerified && isList && isSellers) {
    if (isSellersListEmpty) {
      toggleNoDataContainer('block');
    } else {
      toggleNoDataContainer('none');
      renderTable(sellers);
    }
  }
  if (isVerified && isList && isBuyers) {
    console.log(getVerifiedContractors(buyers).length);
    if (!getVerifiedContractors(buyers).length) {
      toggleNoDataContainer('block');
    } else {
      toggleNoDataContainer('none');
      renderTable(getVerifiedContractors(buyers));
    }
  }
  if (!isVerified && isList && isBuyers) {
    if (isBuyersListEmpty) {
      toggleNoDataContainer('block');
    } else {
      toggleNoDataContainer('none');
      renderTable(buyers);
    }
  }

  if (isVerified && isMap) {
    toggleNoDataContainer('none');
    hideNotVerifiedMarkers();
  }

  if (!isVerified && isMap) {
    toggleNoDataContainer('none');
    showNotVerifiedMarkers(getNotVerifiedContractors(cashSellers));
  }
};

const addEventListeners = (renderTable, renderMap, closeMap, hideNotVerifiedMarkers, showNotVerifiedMarkers, buyers, sellers, cashSellers) => {
  sellersControl.addEventListener('click', () => {
    switchClass(buyersControl, sellersControl);
    repaintContractors (sellers, buyers, cashSellers, renderTable, hideNotVerifiedMarkers, showNotVerifiedMarkers);
  });

  buyersControl.addEventListener('click', () => {
    switchClass(sellersControl, buyersControl);
    repaintContractors (sellers, buyers, cashSellers, renderTable, hideNotVerifiedMarkers, showNotVerifiedMarkers);
  });

  mapControl.addEventListener('click', () => {
    switchClass(listControl, mapControl);
    usersList.hidden = true;
    if (!buyers && !sellers) {
      noDataContainer.style.display = 'none';
      renderMap(null, null);
    } else {
      renderMap(getVerifiedContractors(cashSellers), getNotVerifiedContractors(cashSellers));
      repaintContractors(sellers, buyers, cashSellers, renderTable, hideNotVerifiedMarkers, showNotVerifiedMarkers);
    }
  });

  listControl.addEventListener('click', () => {
    switchClass(mapControl, listControl);
    usersList.hidden = false;
    closeMap();
    repaintContractors (sellers, buyers, cashSellers, renderTable, hideNotVerifiedMarkers, showNotVerifiedMarkers);
  });
};

const renderContractors = (contractors, renderTable, renderMap, closeMap, hideNotVerifiedMarkers, showNotVerifiedMarkers) => {
  let sellers;
  let buyers;
  let cashSellers;

  if (contractors.length) {
    sellers = getSellers(contractors);
    buyers = getBuyers(contractors);
    cashSellers = sellers.filter((seller) => seller.paymentMethods.some((method) => method.provider === 'Cash in person'));
  }

  addEventListeners(renderTable, renderMap, closeMap, hideNotVerifiedMarkers, showNotVerifiedMarkers, buyers, sellers, cashSellers);

  if (!contractors.length) {
    noDataContainer.style.display = 'block';
    return;
  }

  verifiedContractorsToggle.addEventListener('change', () => repaintContractors(sellers, buyers, cashSellers, renderTable, hideNotVerifiedMarkers, showNotVerifiedMarkers));

  if (!sellers.length) {
    toggleNoDataContainer('block');
  } else {
    renderTable(sellers);
  }
};

export { renderContractors };
