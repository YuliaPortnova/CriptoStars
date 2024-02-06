const container = document.querySelector('.users-list__table-body');
const template = document.querySelector('#user-table-row__template');

const createContractorClickHandler = (properties) => () => {
  document.dispatchEvent(new CustomEvent('contractorSelect', {detail: properties}));
};

const createRows = (contractorsData) => contractorsData.map((properties) => {
  const tableRow = template.content.querySelector('.users-list__table-row').cloneNode(true);
  const {status, userName, isVerified, balance, exchangeRate, minAmount, paymentMethods } = properties;

  const openButton = tableRow.querySelector('.btn--modal-open');

  tableRow.querySelector('.users-list__table-name span').textContent = userName;
  if (!isVerified) {
    tableRow.querySelector('.users-list__table-name svg').remove();
  }
  tableRow.querySelector('.users-list__table-currency').textContent = balance.currency;
  tableRow.querySelector('.users-list__table-exchangerate').textContent = `${Math.round(exchangeRate)} ₽`;

  const maxAmount = (status === 'seller') ? Math.round(balance.amount * exchangeRate) : balance.amount;
  tableRow.querySelector('.users-list__table-cashlimit').textContent = `${minAmount} ₽ - ${maxAmount} ₽`;

  const paymentsList = tableRow.querySelector('.users-list__badges-list');
  paymentsList.innerHTML = '';
  if (paymentMethods) {
    paymentMethods.forEach((paymentMethod) => {
      const method = document.createElement('li');
      method.classList.add('users-list__badges-item');
      method.classList.add('badge');
      method.textContent = paymentMethod.provider;
      paymentsList.appendChild(method);
    });
  }

  openButton.addEventListener ('click', createContractorClickHandler(properties));
  return tableRow;
});

const renderTable = (contractorsData) => {
  container.innerHTML = '';
  container.append(...createRows(contractorsData));
};

export { renderTable };
