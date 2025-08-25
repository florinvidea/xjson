const http = require('http');
const fetchToken = require('./getToken');
const fetch = require('node-fetch'); // npm install node-fetch@2

const PORT = 3000;
const REST_URL = 'https://g4bc49070c2f126-florinatp.adb.eu-frankfurt-1.oraclecloudapps.com/ords/florin/save-json/access/';

const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.url === '/') {
    res.end(JSON.stringify({ message: '✅ Server Node.js rulează! Accesează /token pentru token.' }));
    return;
  }

  if (req.url === '/token') {
    try {
      const token = await fetchToken();

      const payload = { token };

      // Trimitem token-ul la REST Oracle
      const response = await fetch(REST_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.text();

      // Returnăm token-ul și răspunsul REST
      res.end(JSON.stringify({ token, restResponse: result }));

    } catch (err) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  res.statusCode = 404;
  res.end(JSON.stringify({ error: 'Endpoint necunoscut' }));
});

server.listen(PORT, () => {
  console.log(`Server pornit pe http://localhost:${PORT}`);
});
