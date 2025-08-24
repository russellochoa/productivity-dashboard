const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the project root
app.use(express.static('.'));

app.get('/api/proxy', async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).send('Missing url parameter');
  }
  try {
    const response = await fetch(targetUrl);
    const body = await response.text();
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Content-Type', response.headers.get('content-type') || 'application/json');
    res.status(response.status).send(body);
  } catch (err) {
    res.status(500).send(`Proxy request failed: ${err.message}`);
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
