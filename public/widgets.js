import { loadConfig } from '../src/config.js';

let proxyBaseUrl = '';

async function fetchStock() {
  const priceEl = document.getElementById('spy-price');
  const changeEl = document.getElementById('spy-change');

  try {
    const response = await fetch(`${proxyBaseUrl}/api/stock`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    const price = Number(data.price);
    const change = Number(data.change);
    const changePercent = Number(data.changePercent);

    if (isFinite(price) && isFinite(change) && isFinite(changePercent)) {
      const sign = change > 0 ? '+' : '';
      priceEl.textContent = price.toFixed(2);
      changeEl.textContent = `${sign}${change.toFixed(2)} (${sign}${changePercent.toFixed(2)}%)`;
      return;
    }
    throw new Error('Invalid data format');
  } catch (err) {
    priceEl.textContent = '--';
    changeEl.textContent = '--';
  }
}

export { fetchStock };

document.addEventListener('DOMContentLoaded', async () => {
  const config = await loadConfig();
  proxyBaseUrl = config.proxyBaseUrl || '';
  await fetchStock();
  setInterval(fetchStock, 60_000);
});
