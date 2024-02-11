const userName = document.querySelector('.user-profile__name span');
const userCryptoBalance = document.querySelector('#user-crypto-balance');
const userFiatBalance = document.querySelector('#user-fiat-balance');

const renderUserData = (userData) => {
  userName.textContent = userData.userName;
  const getBalance = (currency) => userData.balances.find((balance) => balance.currency === currency);
  userCryptoBalance.textContent = getBalance('KEKS').amount;
  userFiatBalance.textContent = getBalance('RUB').amount;
};

export { renderUserData };

