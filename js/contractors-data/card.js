const template = document.querySelector('#map-baloon__template');

const createCard = (properties) => {
  const card = template.content.querySelector('.user-card').cloneNode(true);
  const paymentMethodItems = card.querySelectorAll('.user-card__badges-item');
  const { userName, isVerified, balance, exchangeRate, minAmount, paymentMethods } = properties;
  card.querySelector('.user-card__user-name span').textContent = userName;
  card.querySelector('.user-card__cash-data-currency').textContent = balance.currency;
  card.querySelector('.user-card__cash-data-exchangerate').textContent = `${Math.round(exchangeRate)} ₽`;
  const maxAmount = Math.round(balance.amount * exchangeRate);
  card.querySelector('.user-card__cash-data-cashlimit').textContent = `${minAmount} ₽ - ${maxAmount} ₽`;
  if (!isVerified) {
    card.querySelector('.user-card__user-name svg').remove();
  }
  paymentMethodItems.forEach((methodItem) => {
    const isNecessary = paymentMethods.some((method) => method.provider === methodItem.dataset.paymentMethod);
    if (!isNecessary) {
      methodItem.remove();
    }
  });
  card.querySelector('.user-card__change-btn').addEventListener('click', () => {
    document.dispatchEvent(new CustomEvent('contractorSelect', {detail: properties}));
  });
  return card;
};

export { createCard };
