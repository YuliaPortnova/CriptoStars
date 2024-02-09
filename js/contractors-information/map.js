import { createCard } from './card.js';

const TILE_LAYER = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const COPYRIGHT = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const ZOOM = 9;
const startCoordinate = {
  lat: 59.92749,
  lng: 30.31127,
};

const iconConfig = {
  url: {notVerified: '../img/pin.svg', verified: '../img/pin-verified.svg'},
  width: 36,
  height: 46,
  anchorX: 18,
  anchorY: 46,
};

const container = document.querySelector('.container--map');

const map = L.map('map').setView(startCoordinate, ZOOM);

L.tileLayer(TILE_LAYER, {
  attribution: COPYRIGHT
}).addTo(map);

const createIcon = (url) => L.icon({
  iconUrl: url,
  iconSize: [iconConfig.width, iconConfig.height],
  iconAnchor: [iconConfig.anchorX, iconConfig.anchorY],
});

const notVerifiedIcon = createIcon(iconConfig.url.notVerified);

const notVerifiedMarkerGroup = L.layerGroup().addTo(map);

const createNotVerifiedMarker = (point, data) => {
  const {lat, lng} = point;
  const marker = L.marker(
    {
      lat,
      lng,
    },
    {
      icon: notVerifiedIcon,
    },
  );
  marker
    .addTo(notVerifiedMarkerGroup)
    .bindPopup(createCard(data));
};

const createNotVerifiedMarkers = (contractors) => {
  notVerifiedMarkerGroup.clearLayers();
  contractors.forEach((contractor) => {
    createNotVerifiedMarker(contractor.coords, contractor);
  });
};

const verifiedIcon = createIcon(iconConfig.url.verified);

const verifiedMarkerGroup = L.layerGroup().addTo(map);

const createVerifiedMarker = (point, data) => {
  const {lat, lng} = point;
  const marker = L.marker(
    {
      lat,
      lng,
    },
    {
      icon: verifiedIcon,
    },
  );
  marker
    .addTo(verifiedMarkerGroup)
    .bindPopup(createCard(data));
};

const createVerifiedMarkers = (contractors) => {
  verifiedMarkerGroup.clearLayers();
  contractors.forEach((contractor) => {
    createVerifiedMarker(contractor.coords, contractor);
  });
};

const renderMap = (verifiedContractors, notVerifiedContractors) => {
  container.style.display = 'block';

  createNotVerifiedMarkers(notVerifiedContractors);
  createVerifiedMarkers(verifiedContractors);
  map.invalidateSize(false);
};

const hideNotVerifiedMarkers = () => {
  notVerifiedMarkerGroup.clearLayers();
};

const showNotVerifiedMarkers = (notVerifiedContractors) => {
  createNotVerifiedMarkers(notVerifiedContractors);
};

const closeMap = () => {
  container.style.display = 'none';
};

export { renderMap, closeMap, hideNotVerifiedMarkers, showNotVerifiedMarkers };
