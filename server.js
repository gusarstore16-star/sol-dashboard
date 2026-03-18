const express = require('express');
const https = require('https');
const path = require('path');
const app = express();

app.use(express.static('public'));

function fetchBinance(endpoint) {
  return new Promise((resolve, reject) => {
    const url = 'https://api.binance.com' + endpoint;
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch(e) { reject(new Error('Parse error')); }
      });
    }).on('error', reject);
  });
}

app.get('/api/klines', async (req, res) => {
  try {
    const data = await fetchBinance('/api/v3/klines?symbol=SOLUSDT&interval=15m&limit=120');
    res.json(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/ticker', async (req, res) => {
  try {
    const data = await fetchBinance('/api/v3/ticker/24hr?symbol=SOLUSDT');
    res.json(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`SOL Dashboard running on port ${PORT}`));
