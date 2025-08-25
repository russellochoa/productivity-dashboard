import { CONFIG } from "./config.js";
import { loadStock, loadNews, loadQuote } from "./api.js";

// ----- RENDER HELPERS -----
function renderStock(data) {
  const priceEl = document.getElementById("stock-price");
  const deltaEl = document.getElementById("stock-delta");
  if (!data) return;
  const { price, change, changePct } = data;
  priceEl.textContent = price != null ? Number(price).toFixed(2) : "--";
  deltaEl.textContent =
    change != null && changePct != null ? `${Number(change).toFixed(2)} (${Number(changePct).toFixed(2)}%)` : "--";

  const card = document.getElementById("stock-card");
  card.classList.remove("up", "down");
  if (change > 0) card.classList.add("up");
  if (change < 0) card.classList.add("down");
}

function renderNews(items) {
  const ul = document.getElementById("news-list");
  ul.innerHTML = "";
  (items || []).forEach((a) => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="${a.url}" target="_blank" rel="noopener">${a.title}</a> <span class="src">${a.source || ""}</span>`;
    ul.appendChild(li);
  });
}

function renderQuote(q) {
  document.getElementById("quote-text").textContent = q?.text || "—";
  document.getElementById("quote-author").textContent = q?.author ? `— ${q.author}` : "";
}

// ----- LOADERS + INTERVALS -----
async function refreshStock() { try { renderStock(await loadStock()); } catch {} }
async function refreshNews(mode) { try { renderNews(await loadNews(mode)); } catch {} }
async function refreshQuote() { try { renderQuote(await loadQuote()); } catch {} }

async function init() {
  // initial
  await refreshStock();
  await refreshNews("headlines");
  await refreshQuote();

  // intervals
  setInterval(refreshStock, CONFIG.refreshMs.stock);
  setInterval(refreshQuote, CONFIG.refreshMs.quote);

  // news toggle
  const select = document.getElementById("news-mode");
  if (select) {
    select.addEventListener("change", (e) => refreshNews(e.target.value));
  }
}
init();
