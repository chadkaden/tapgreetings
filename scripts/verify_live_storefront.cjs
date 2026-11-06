const fs = require('fs');

async function testPages() {
  const urls = [
    'https://shop.tapthingy.com/collections/tapgreetings-series-1',
    'https://shop.tapthingy.com/collections/series-1-classic-icons',
    'https://shop.tapthingy.com/products/tapgreeting-series1-001-001',
    'https://shop.tapthingy.com/pages/tapgreetings-series-1',
    'https://shop.tapthingy.com/pages/how-tapgreetings-nfc-works'
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      console.log(`[${res.status}] ${url}`);
      const text = await res.text();
      const hasTapGreetings = text.includes('tg-product-wrapper') || text.includes('tg-col-wrapper') || text.includes('tapgreetings-shopify-landing') || text.includes('tapgreetings-nfc-guide');
      const hasGhostTap = text.includes('card_01_tap.mp4');
      const hasVideo = text.includes('tapgreeting_');
      console.log(`   -> Includes TapGreetings theme: ${hasTapGreetings} | Ghost Tap: ${hasGhostTap} | Video: ${hasVideo}`);
    } catch (e) {
      console.error(`   -> Error fetching ${url}:`, e.message);
    }
  }
}

testPages().catch(console.error);
