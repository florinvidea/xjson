#!/bin/bash
set -e

echo "🔹 Actualizare repo și instalare pachete necesare pentru Puppeteer..."
sudo apt update
sudo apt install -y \
  ca-certificates fonts-liberation libasound2 libatk-bridge2.0-0 \
  libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 \
  libgcc1 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 \
  libnss3 libpango-1.0-0 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 \
  libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 \
  libxrender1 libxss1 libxtst6 wget xdg-utils

echo "🔹 Instalare Puppeteer..."
npm install puppeteer@24

echo "🔹 Testare Puppeteer..."
node -e "
const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.goto('https://example.com');
  console.log('✅ Puppeteer funcționează, titlul paginii:', await page.title());
  await browser.close();
})();
"

echo "🎉 Totul e gata!"
