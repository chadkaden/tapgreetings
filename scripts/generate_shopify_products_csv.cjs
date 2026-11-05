const fs = require('fs');
const path = require('path');

const greetingsFilePath = path.join(__dirname, '../data/greetings_master.json');
const outputCsvPath = path.join(__dirname, '../data/tapgreetings_shopify_products.csv');

const rawData = fs.readFileSync(greetingsFilePath, 'utf8');
const parsed = JSON.parse(rawData);
const greetings = Array.isArray(parsed) ? parsed : (parsed.cards || []);

function escapeCsvField(val) {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

const headers = [
  'Handle',
  'Title',
  'Body (HTML)',
  'Vendor',
  'Product Category',
  'Type',
  'Tags',
  'Published',
  'Option1 Name',
  'Option1 Value',
  'Variant SKU',
  'Variant Grams',
  'Variant Inventory Tracker',
  'Variant Inventory Qty',
  'Variant Inventory Policy',
  'Variant Fulfillment Service',
  'Variant Price',
  'Variant Compare At Price',
  'Variant Requires Shipping',
  'Variant Taxable',
  'Image Src',
  'Image Position',
  'Image Alt Text',
  'Gift Card',
  'SEO Title',
  'SEO Description',
  'Status'
];

const rows = [headers.map(escapeCsvField).join(',')];

// 1. Add Custom TapGreeting Card Product Row
const customHandle = 'custom-nfc-tapgreeting-card';
const customTitle = 'Custom NFC Video TapGreeting Card (Front & Back Upload)';
const customDesc = `
<div class="tapgreeting-product-description" style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6; color: #1e293b;">
  <h3>✨ Tap-to-Video NFC Custom Greeting Card</h3>
  <p>Turn your cherished videos, photos, and personal greetings into an unforgettable keepsake. Tap with any smartphone to instantly launch your personalized video experience.</p>
  <ul>
    <li><strong>Full Custom Artwork:</strong> Upload your own front & back design.</li>
    <li><strong>Embedded Microchip:</strong> High performance NTAG213/215 chip encoded with dynamic OTA redirection.</li>
    <li><strong>Premium Build:</strong> Commercial-grade CR80 PVC card with UV scratch-resistant finish.</li>
    <li><strong>No App Needed:</strong> Works natively with iPhone and Android NFC readers.</li>
  </ul>
</div>
`.trim();

rows.push([
  escapeCsvField(customHandle),
  escapeCsvField(customTitle),
  escapeCsvField(customDesc),
  escapeCsvField('TapGreetings'),
  escapeCsvField('Office Supplies > Paper Products > Greeting Cards'),
  escapeCsvField('NFC Greeting Card'),
  escapeCsvField('TapGreetings, Custom Card, NFC Card, Video Greeting, TapThingy'),
  escapeCsvField('TRUE'),
  escapeCsvField('Title'),
  escapeCsvField('Default Title'),
  escapeCsvField('TG-CUSTOM-01'),
  escapeCsvField('15'),
  escapeCsvField('shopify'),
  escapeCsvField('999'),
  escapeCsvField('deny'),
  escapeCsvField('manual'),
  escapeCsvField('29.99'),
  escapeCsvField('39.99'),
  escapeCsvField('TRUE'),
  escapeCsvField('TRUE'),
  escapeCsvField('https://tapgreetings.com/public/custom_card_preview.jpg'),
  escapeCsvField('1'),
  escapeCsvField('Custom TapGreeting Card Preview'),
  escapeCsvField('FALSE'),
  escapeCsvField('Custom NFC Video TapGreeting Card | TapGreetings'),
  escapeCsvField('Upload your personal photos and videos onto a custom high-end NFC PVC greeting card. Ships in premium packaging.'),
  escapeCsvField('active')
].join(','));

// 2. Add Pre-Made Flow Greetings
greetings.forEach((card, idx) => {
  const char = card.character || {};
  const media = card.media || {};
  const cardTitle = char.name ? `${char.name} - ${char.title || 'TapGreeting Card'}` : (card.title || `TapGreeting #${card.slug}`);
  const cardMessage = char.micro_lore || card.message || (card.narrative && card.narrative.card_back_lore) || '';
  const frontImg = media.front_image_url || card.frontImage || (card.assets && card.assets.front_image) || '';
  const handle = `tapgreeting-${card.slug}`;
  const isLandscape = media.aspect_ratio === '16:9' || media.aspect_ratio === 'landscape' || card.aspect === 'landscape';
  
  const desc = `
<div class="tapgreeting-card-desc" style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6; color: #1e293b;">
  <h3>${card.event_greeting || card.headline || cardTitle}</h3>
  <p>${cardMessage}</p>
  <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-top: 14px;">
    <strong>⚡ NFC Instant Unlock:</strong> Includes pre-programmed digital interactive video and audio memory card (${isLandscape ? 'Horizontal 16:9' : 'Vertical 9:16'}).
  </div>
</div>
  `.trim();

  const tags = ['TapGreetings', card.series_id || 'Winter Glamour', card.event_greeting, isLandscape ? 'Landscape' : 'Portrait', char.rarity_tier].filter(Boolean).join(', ');

  rows.push([
    escapeCsvField(handle),
    escapeCsvField(`${cardTitle} - NFC Keepsake Card`),
    escapeCsvField(desc),
    escapeCsvField('TapGreetings'),
    escapeCsvField('Office Supplies > Paper Products > Greeting Cards'),
    escapeCsvField('NFC Greeting Card'),
    escapeCsvField(tags),
    escapeCsvField('TRUE'),
    escapeCsvField('Title'),
    escapeCsvField('Default Title'),
    escapeCsvField(`TG-CARD-${card.slug}`),
    escapeCsvField('15'),
    escapeCsvField('shopify'),
    escapeCsvField('100'),
    escapeCsvField('deny'),
    escapeCsvField('manual'),
    escapeCsvField('29.99'),
    escapeCsvField('39.99'),
    escapeCsvField('TRUE'),
    escapeCsvField('TRUE'),
    escapeCsvField(frontImg.startsWith('http') ? frontImg : `https://tapgreetings.com${frontImg}`),
    escapeCsvField('1'),
    escapeCsvField(`${cardTitle} Front Artwork`),
    escapeCsvField('FALSE'),
    escapeCsvField(`${cardTitle} | TapGreetings NFC Card`),
    escapeCsvField(cardMessage),
    escapeCsvField('active')
  ].join(','));
});

fs.writeFileSync(outputCsvPath, rows.join('\n'), 'utf8');
console.log(`Generated Shopify CSV with ${rows.length - 1} products at: ${outputCsvPath}`);
