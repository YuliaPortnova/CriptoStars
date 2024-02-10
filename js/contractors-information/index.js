import { renderTable } from './table.js';
import { renderMap, closeMap, hideNotVerifiedMarkers, showNotVerifiedMarkers } from './map.js';
import { renderContractors } from './contractors.js';

const errorContainer = document.querySelector('.container--error-message');
const contractorsContainer = document.querySelector('.container--contractors');

const initContractorsInformation = (contractorsData) => {
  renderContractors(contractorsData, renderTable, renderMap, closeMap, hideNotVerifiedMarkers, showNotVerifiedMarkers);
};

const renderErrorContainer = () => {
  errorContainer.style.display = 'block';
  contractorsContainer.style.display = 'none';
};

export { initContractorsInformation, renderErrorContainer };
