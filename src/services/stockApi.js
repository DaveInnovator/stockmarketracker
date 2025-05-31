const ALPHA_KEY = 'OE7Q2M190FO3L9B5'; // Replace with your real key
const FINNHUB_KEY = 'd0t3srhr01qid5qcjc20d0t3srhr01qid5qcjc2g';

export const getStockQuote = async (symbol) => {
  try {
    const alphaRes = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_KEY}`
    );
    const alphaData = await alphaRes.json();

    if (
      alphaData['Global Quote'] &&
      alphaData['Global Quote']['01. symbol']
    ) {
      return alphaData['Global Quote'];
    }

    console.warn('Alpha Vantage failed, falling back to Finnhub');

    const fallbackRes = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_KEY}`
    );
    const fallbackData = await fallbackRes.json();

    if (!fallbackData || !fallbackData.c || fallbackData.c === 0) {
      return null;
    }

    return {
      '01. symbol': symbol,
      '05. price': fallbackData.c,
      '09. change': (fallbackData.c - fallbackData.pc).toFixed(2),
      '10. change percent':
        (((fallbackData.c - fallbackData.pc) / fallbackData.pc) * 100).toFixed(2) + '%',
      '07. latest trading day': new Date().toISOString().split('T')[0],
    };
  } catch (err) {
    console.error('Error fetching stock quote:', err);
    return null;
  }
};

export const getStockHistory = async (symbol) => {
  try {
    const res = await fetch(
      `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=D&count=7&token=${FINNHUB_KEY}`
    );
    const data = await res.json();
    if (data.s !== 'ok') return null;

    return {
      labels: data.t.map((ts) =>
        new Date(ts * 1000).toLocaleDateString()
      ),
      prices: data.c,
    };
  } catch (err) {
    console.error('Error fetching stock history:', err);
    return null;
  }
};

export const searchStock = async (query) => {
  try {
    // Primary: Alpha Vantage
    const res = await fetch(
      `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${ALPHA_KEY}`
    );
    const data = await res.json();

    if (data.bestMatches && data.bestMatches.length > 0) {
      return data.bestMatches.map((match) => ({
        symbol: match['1. symbol'],
        name: match['2. name'],
        region: match['4. region'],
      }));
    }

    console.warn('Alpha Vantage search failed, falling back to Finnhub');

    // Fallback: Finnhub
    const fallbackRes = await fetch(
      `https://finnhub.io/api/v1/search?q=${query}&token=${FINNHUB_KEY}`
    );
    const fallbackData = await fallbackRes.json();

    if (!fallbackData || !fallbackData.result || fallbackData.result.length === 0) {
      return [];
    }

    return fallbackData.result
      .filter((item) => item.type === 'Common Stock') // optional filter
      .map((item) => ({
        symbol: item.symbol,
        name: item.description,
        region: item.displaySymbol || 'Global',
      }));
  } catch (error) {
    console.error('Error searching stocks:', error);
    return [];
  }
};
