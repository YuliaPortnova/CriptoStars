const errorContainer = document.querySelector('.container--error-message');
const contractorsContainer = document.querySelector('.container--contractors');
const userContainer = document.querySelector('.user-profile');

const request = async (url, options) => {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(response.status);
  }
  return response.json();
};

const renderDataError = () => {
  errorContainer.style.display = 'block';
  contractorsContainer.style.display = 'none';
  userContainer.style.display = 'none';
};

export { request, renderDataError };
