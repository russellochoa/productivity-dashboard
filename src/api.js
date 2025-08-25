import { CONFIG } from "./config.js";

export async function loadStock() {
  const r = await fetch(`${CONFIG.apiBase}/api/stock`);
  if (!r.ok) throw new Error("stock fetch failed");
  return r.json(); // { price, change, changePct }
}

export async function loadNews(mode = "headlines") {
  const r = await fetch(`${CONFIG.apiBase}/api/news?mode=${encodeURIComponent(mode)}`);
  if (!r.ok) throw new Error("news fetch failed");
  return r.json(); // [ { title, url, source, publishedAt }, ... ]
}

export async function loadQuote() {
  const r = await fetch(`${CONFIG.apiBase}/api/quote`);
  if (!r.ok) throw new Error("quote fetch failed");
  return r.json(); // { text, author }
}
