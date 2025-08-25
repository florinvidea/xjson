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

      if (!token) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: '⚠️ Nu am găsit tokenul.' }));
        return;
      }

      // Pregătim payload-ul JSON
      const payload = { token };

      // Trimitem tokenul la REST-ul Oracle
      const response = await fetch(REST_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
        redirect: 'follow'
      });

      const text = await response.text();

      // Returnăm răspuns JSON către client
      res.end(JSON.stringify({ token }));

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
