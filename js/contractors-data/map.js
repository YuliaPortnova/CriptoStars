import { createCard } from './card.js';

const TILE_LAYER = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const COPYRIGHT = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const ZOOM = 9;
const startCoordinate = {
  lat: 59.92749,
  lng: 30.31127,
};

const container = document.querySelector('.container--map');
const pinSrc = container.querySelector('.map__pin').src;
const pinVerifiedSrc = container.querySelector('.map__pin-verified').src;

const iconConfig = {
  url: {notVerified: pinSrc, verified: pinVerifiedSrc},
  width: 36,
  height: 46,
  anchorX: 18,
  anchorY: 46,
};

const map = L.map('map').setView(startCoordinate, ZOOM);

L.tileLayer(TILE_LAYER, {
  attribution: COPYRIGHT
}).addTo(map);

const getIcon = (url) => L.icon({
  iconUrl: url,
  iconSize: [iconConfig.width, iconConfig.height],
  iconAnchor: [iconConfig.anchorX, iconConfig.anchorY],
});

const notVerifiedIcon = getIcon(iconConfig.url.notVerified);
const verifiedIcon = getIcon(iconConfig.url.verified);

const notVerifiedMarkerGroup = L.layerGroup().addTo(map);
const verifiedMarkerGroup = L.layerGroup().addTo(map);

const createMarker = (point, data, isVerified) => {
  const icon = isVerified ? verifiedIcon : notVerifiedIcon;
  const markerGroup = isVerified ? verifiedMarkerGroup : notVerifiedMarkerGroup;

  const {lat, lng} = point;
  const marker = L.marker(
    {
      lat,
      lng,
    },
    {
      icon,
    },
  );
  marker
    .addTo(markerGroup)
    .bindPopup(createCard(data));
};

const createMarkers = (contractors, isVerified) => {
  const markerGroup = isVerified ? verifiedMarkerGroup : notVerifiedMarkerGroup;
  markerGroup.clearLayers();
  contractors.forEach((contractor) => {
    createMarker(contractor.coords, contractor, isVerified);
  });
};

const renderMap = (verifiedContractors, notVerifiedContractors) => {
  container.style.display = 'block';
  if (notVerifiedContractors) {
    createMarkers(notVerifiedContractors, false);
  }
  if (verifiedContractors) {
    createMarkers(verifiedContractors, true);
  }
  map.invalidateSize(false);
};

const hideNotVerifiedMarkers = () => {
  notVerifiedMarkerGroup.clearLayers();
};

const showNotVerifiedMarkers = (notVerifiedContractors) => {
  createMarkers(notVerifiedContractors, false);
};

const closeMap = () => {
  container.style.display = 'none';
};

export { renderMap, closeMap, hideNotVerifiedMarkers, showNotVerifiedMarkers };
