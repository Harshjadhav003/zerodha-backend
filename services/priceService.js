const stocks = ["INFY", "TCS", "WIPRO", "ONGC", "QUICKHEAL" ,"KPITTECH","M&M","HUL","RELIANCE"];

let prices = {
  INFY: 100,
  TCS: 200,
  WIPRO: 50,
  ONGC: 80,
  QUICKHEAL: 30,
  KPITTECH: 40,
  "M&M": 60,
  HUL: 70,
  RELIANCE: 90,
};

function startPriceFeed(io) {
  setInterval(() => {
    stocks.forEach((stock) => {
      const change = (Math.random() - 0.5) * 2;
      prices[stock] = +(prices[stock] + change).toFixed(2);
    });

    io.emit("price_update", prices);
  }, 1000);
}

module.exports = { startPriceFeed };