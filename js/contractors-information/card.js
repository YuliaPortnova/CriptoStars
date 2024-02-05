const template = document.querySelector('#map-baloon__template');

const createCard = (properties) => {
  const card = template.content.querySelector('.user-card').cloneNode(true);
  const { userName, isVerified, balance, exchangeRate, minAmount, paymentMethods } = properties;
  card.querySelector('.user-card__user-name span').textContent = userName;
  card.querySelector('.user-card__cash-data-currency').textContent = balance.currency;
  card.querySelector('.user-card__cash-data-exchangerate').textContent = `${Math.round(exchangeRate)} ₽`;
  const maxAmount = Math.round(balance.amount * exchangeRate);
  card.querySelector('.user-card__cash-data-cashlimit').textContent = `${minAmount} ₽ - ${maxAmount} ₽`;
  if (!isVerified) {
    card.querySelector('.user-card__user-name svg').remove();
  }
  return card;
};

export { createCard };
