const fs = require('fs');
const path = require('path');

const greetingsFilePath = path.join(__dirname, '../data/greetings_master.json');
const outputCsvPath = path.join(__dirname, '../data/tapgreetings_shopify_products.csv');

const rawData = fs.readFileSync(greetingsFilePath, 'utf8');
const parsed = JSON.parse(rawData);
const greetings = parsed.cards || [];

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

greetings.forEach((card, idx) => {
  const char = card.character || {};
  const media = card.media || {};
  const seo = card.seo || {};
  const comm = card.commerce || {};
  const descObj = card.descriptions || {};

  const handle = `tapgreeting-${card.slug}`;
  const title = `${char.name || card.slug} - Smart NFC Video Greeting Card`;
  const bodyHtml = descObj.shopify_full_html || `<p>${char.micro_lore || ''}</p>`;
  const frontImg = media.front_image_url || `https://tapgreetings.com/assets/img/${card.slug}-front.png`;
  const tags = ['TapGreetings', card.series_id || 'Winter Glamour', seo.primary_occasion, ...(seo.keywords || []), char.rarity_tier].filter(Boolean).join(', ');

  rows.push([
    escapeCsvField(handle),
    escapeCsvField(title),
    escapeCsvField(bodyHtml),
    escapeCsvField('TapGreetings'),
    escapeCsvField('Office Supplies > Paper Products > Greeting Cards'),
    escapeCsvField('NFC Greeting Card'),
    escapeCsvField(tags),
    escapeCsvField('TRUE'),
    escapeCsvField('Title'),
    escapeCsvField('Default Title'),
    escapeCsvField(comm.sku || `TG-CARD-${card.slug}`),
    escapeCsvField('15'),
    escapeCsvField('shopify'),
    escapeCsvField(comm.inventory_qty || 100),
    escapeCsvField('deny'),
    escapeCsvField('manual'),
    escapeCsvField((comm.price || 29.99).toFixed(2)),
    escapeCsvField((comm.compare_at_price || 39.99).toFixed(2)),
    escapeCsvField('TRUE'),
    escapeCsvField('TRUE'),
    escapeCsvField(frontImg),
    escapeCsvField('1'),
    escapeCsvField(`${char.name || card.slug} Front Card Artwork`),
    escapeCsvField('FALSE'),
    escapeCsvField(seo.seo_title || title),
    escapeCsvField(seo.seo_meta_desc || char.micro_lore || ''),
    escapeCsvField('active')
  ].join(','));
});

fs.writeFileSync(outputCsvPath, rows.join('\n'), 'utf8');
console.log(`Successfully generated Shopify CSV with ${rows.length - 1} products at: ${outputCsvPath}`);
