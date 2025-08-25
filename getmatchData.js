const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('https://www.xscores.com/soccer/match/rapid-bucuresti-vs-fc-fcsb/17-08-2025/2512517', {
    waitUntil: 'networkidle2'
  });

  // Extragem tokenul din scripturi
  const token = await page.evaluate(() => {
    const scripts = Array.from(document.querySelectorAll('script'));
    for (let s of scripts) {
      const m = s.textContent.match(/const\s+access_token\s*=\s*"([^"]+)"/);
      if (m) return m[1];
    }
    return null;
  });

  console.log("Access Token:", token ? token : "⚠️ Nu a fost găsit tokenul");

  await browser.close();
})();
