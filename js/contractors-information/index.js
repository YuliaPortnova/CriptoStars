import { renderTable } from './table.js';
import { renderMap, closeMap, hideNotVerifiedMarkers, showNotVerifiedMarkers } from './map.js';
import { renderContractors } from './contractors.js';

const initContractorsInformation = (contractorsData) => {
  renderContractors(contractorsData, renderTable, renderMap, closeMap, hideNotVerifiedMarkers, showNotVerifiedMarkers);
};

export { initContractorsInformation };
