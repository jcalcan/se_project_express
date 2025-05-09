const isValidUrl = (url) => {
  const urlRegex = /^https?:\/\/\S+$/i;
  return urlRegex.test(url);
};

module.exports = { isValidUrl };
