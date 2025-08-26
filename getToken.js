const puppeteer = require('puppeteer');

async function fetchToken() {
  const TARGET_URL = 'https://www.xscores.com/soccer/match/rapid-bucuresti-vs-fc-fcsb/17-08-2025/2512517';

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: null
  });

  const page = await browser.newPage();

  // Setăm un timeout rezonabil
  await page.goto(TARGET_URL, { waitUntil: 'networkidle2', timeout: 30000 });


  console.log('⏳ Așteptăm tokenul să fie generat de pagina web...');

  const token = await page.evaluate(() => {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        const html = document.documentElement.innerHTML;
        const match = html.match(/const\s+access_token\s*=\s*"([^"]+)"/);
        if (match) {
          clearInterval(interval);
          resolve(match[1]);
        }
      }, 500);
    });
  });


  await browser.close();

  if (!token) throw new Error('Tokenul nu a fost găsit în pagină.');
  return token;
}

// Permite rularea direct din Node
if (require.main === module) {
  fetchToken()
    .then(token => console.log('✅ Token găsit:', token))
    .catch(err => console.error('❌ Eroare:', err.message));
}

module.exports = fetchToken;
