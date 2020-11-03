// cache to re-use exchange rates retrieved within 15min
const rateCache = {};

/**
 * Gets an exchange rate
 * 
 * @param {string} baseCurrency     ISO 4217 string of starting currency, e.g. USD
 * @param {string} targetCurrency   ISO 4217 string of target currency, e.g. EUR
 * @returns {Promise}               Promise object represents the exchange rate, as floating-point number
 */
const getRate = (baseCurrency, targetCurrency) => {
  if (rateCache[baseCurrency] && rateCache[baseCurrency][targetCurrency]) {

    const currentUnixTime = Math.round(Date.now() / 1000);
    const cacheLength = 900; // 15 minutes * 60 seconds

    if (currentUnixTime - cacheLength < rateCache[baseCurrency][targetCurrency].time) {
      return Promise.resolve(rateCache[baseCurrency][targetCurrency].rate);
    }
  }

  return fetch(`https://api.exchangeratesapi.io/latest?base=${baseCurrency}&symbols=${targetCurrency}`)
    .then(r => r.json())
    .then(r => {
      const fetchedRate = r.rates[targetCurrency];

      if (!rateCache[baseCurrency]) rateCache[baseCurrency] = {};
      rateCache[baseCurrency][targetCurrency] = {
        time: Math.round(Date.now() / 1000),
        rate: fetchedRate,
      };

      return fetchedRate;
    });
};

export default getRate;
