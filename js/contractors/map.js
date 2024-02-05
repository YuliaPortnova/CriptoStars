const TILE_LAYER = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const COPYRIGHT = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const ZOOM = 9;
const startCoordinate = {
  lat: 59.92749,
  lng: 30.31127,
};

const iconConfig = {
  url: {normal: '../img/pin.svg', verified: '../img/pin-verified.svg'},
  width: 36,
  height: 46,
  anchorX: 18,
  anchorY: 46,
};

const container = document.querySelector('.container--map');
const template = document.querySelector('#map-baloon__template');

const map = L.map('map').setView(startCoordinate, ZOOM);

L.tileLayer(TILE_LAYER, {
  attribution: COPYRIGHT
}).addTo(map);

const icon = L.icon({
  iconUrl: iconConfig.url.normal,
  iconSize: [iconConfig.width, iconConfig.height],
  iconAnchor: [iconConfig.anchorX, iconConfig.anchorY],
});

const markerGroup = L.layerGroup().addTo(map);

const createCard = (properties) => {
  const card = template.content.querySelector('.user-card').cloneNode(true);
  const { userName, balance, exchangeRate, minAmount, paymentMethods } = properties;
  card.querySelector('.user-card__user-name span').textContent = userName;
  card.querySelector('.user-card__cash-data-currency').textContent = balance.currency;
  card.querySelector('.user-card__cash-data-exchangerate').textContent = `${Math.round(exchangeRate)} ₽`;
  const maxAmount = Math.round(balance.amount * exchangeRate);
  card.querySelector('.user-card__cash-data-cashlimit').textContent = `${minAmount} ₽ - ${maxAmount} ₽`;
  return card;
};

const createMarker = (point, data) => {
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

const createMarkers = (contractors) => {
  markerGroup.clearLayers();
  contractors.forEach((contractor) => {
    createMarker(contractor.coords, contractor);
  });
};

const renderMap = (contractors) => {
  container.hidden = false;
  createMarkers(contractors);
};

const closeMap = () => {
  container.hidden = true;
};

// const resetMap = () => {
//   getMainPinMarker().setLatLng(startCoordinate);
//   getMap().setView(startCoordinate, ZOOM);
//   getMap().closePopup();
//   document.dispatchEvent(coordinateSelectionEvent);
// };

// export { initMap, resetMap, createMarkers, setMainPinMarker};

export { renderMap, closeMap };
