const PAGE_SIZE = 5;

module.exports = async function newsProxy(req, res) {
  const pageSize = Number(req.query.pageSize) || PAGE_SIZE;
  const mode = req.query.mode || 'headlines';
  const apiKey = process.env.NEWSAPI_KEY;

  let url;
  if (mode === 'headlines') {
    url = `https://newsapi.org/v2/top-headlines?country=us&pageSize=${pageSize}&apiKey=${apiKey}`;
  } else {
    url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(mode)}&pageSize=${pageSize}&apiKey=${apiKey}`;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.set('Access-Control-Allow-Origin', '*');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
