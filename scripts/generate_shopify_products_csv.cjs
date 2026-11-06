const fs = require('fs');
const path = require('path');

const greetingsFilePath = path.join(__dirname, '../data/greetings_master.json');
const outputProductsCsvPath = path.join(__dirname, '../data/tapgreetings_shopify_products.csv');
const outputCollectionsCsvPath = path.join(__dirname, '../data/shopify_collections.csv');
const outputGuidePath = path.join(__dirname, '../data/shopify_collections_guide.md');

const rawData = fs.readFileSync(greetingsFilePath, 'utf8');
const parsed = JSON.parse(rawData);
const greetings = parsed.cards || [];

function escapeCsvField(val) {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

// 1. GENERATE SHOPIFY PRODUCTS CSV (Standard Shopify Format with Multi-Image Support)
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

greetings.forEach((card) => {
  const char = card.character || {};
  const media = card.media || {};
  const seo = card.seo || {};
  const comm = card.commerce || {};
  const descObj = card.descriptions || {};

  const handle = `tapgreeting-series1-${card.card_code}-${card.slug}`;
  const title = `#${card.card_code} ${char.name} (${char.title}) - Smart NFC Video Greeting Card`;
  
  const subcolName = card.subcollection || 'Classic Icons';
  const subcolHandle = card.subcollection_handle || 'classic-icons';

  // Comprehensive Shopify Tags for Smart Collection Matching
  const tagList = [
    'TapGreetings',
    'Series 1',
    'series-1',
    'Holiday 2026',
    subcolName,
    `subcollection:${subcolHandle}`,
    `card-${card.card_code}`,
    `#${card.card_code}`,
    char.name,
    char.title,
    'Smart NFC Card',
    'Living Keepsake',
    'Polymer Clay',
    'Needle Felt',
    'CR80 PVC',
    'NTAG215',
    'Stop-Motion Video',
    'Christmas',
    'Holiday',
    char.rarity_tier || 'Series 1 Premier',
    ...(seo.keywords || [])
  ];
  const tagsFormatted = Array.from(new Set(tagList)).filter(Boolean).join(', ');

  const frontImg = `https://tapgreetings.com/assets/img/${card.card_code}-front.jpg`;
  const backImg = `https://tapgreetings.com/assets/img/${card.card_code}-back.jpg`;
  const videoUrl = `https://tapgreetings.com/${card.card_code}/`;

  const bodyHtml = `
<div class="tapgreetings-product">
  <p class="tg-lead"><strong>TapGreetings Series 1 &bull; Card #${card.card_code} of 016</strong></p>
  <h3>${char.name} &mdash; ${char.title}</h3>
  <p class="tg-theme"><em>${char.profile_theme || 'Handcrafted Polymer Clay & Needle-Felt'}</em></p>
  <blockquote style="border-left: 3px solid #FBBF24; padding-left: 10px; font-style: italic;">
    &ldquo;${char.motto}&rdquo;
  </blockquote>
  <p>${char.micro_lore}</p>
  
  <h4>✨ Product Highlights &amp; Smart Features</h4>
  <ul>
    <li><strong>Dual-Experience Keepsake:</strong> Museum-grade physical collectible card paired with a 1080p stop-motion claymation video experience.</li>
    <li><strong>High-Speed NTAG215 Chip:</strong> Embedded rewritable NFC microchip compatible with all modern iPhones and Android smartphones (zero app download required).</li>
    <li><strong>Living Video Web Portal:</strong> Direct link to <a href="${videoUrl}" target="_blank">${videoUrl}</a> with cinematic sound, artisan prompts, and stats.</li>
    <li><strong>CR80 30mil Hardware:</strong> Standard credit-card size (85.6mm &times; 53.98mm) waterproof PVC with rich gloss finish and gold-foil filigree accents.</li>
    <li><strong>Subcollection:</strong> ${subcolName} (TapGreetings Series 1).</li>
  </ul>
</div>
`.trim();

  // ROW 1: Main Product + Variant + Image 1 (Front Artwork)
  rows.push([
    escapeCsvField(handle),
    escapeCsvField(title),
    escapeCsvField(bodyHtml),
    escapeCsvField('TapGreetings'),
    escapeCsvField('Arts & Entertainment > Party & Celebration > Gift Giving > Greeting Cards'),
    escapeCsvField('Smart NFC Greeting Card'),
    escapeCsvField(tagsFormatted),
    escapeCsvField('TRUE'),
    escapeCsvField('Title'),
    escapeCsvField('Standard Physical Smart Card'),
    escapeCsvField(comm.sku || `TG-S1-${card.card_code}`),
    escapeCsvField('15'),
    escapeCsvField('shopify'),
    escapeCsvField(comm.inventory_qty || 100),
    escapeCsvField('deny'),
    escapeCsvField('manual'),
    escapeCsvField((comm.price || 14.99).toFixed(2)),
    escapeCsvField((comm.compare_at_price || 24.99).toFixed(2)),
    escapeCsvField('TRUE'),
    escapeCsvField('TRUE'),
    escapeCsvField(frontImg),
    escapeCsvField('1'),
    escapeCsvField(`${char.name} Front Artwork - Series 1 TapGreetings Smart Card`),
    escapeCsvField('FALSE'),
    escapeCsvField(seo.seo_title || `${char.name} (${char.title}) | TapGreetings Series 1`),
    escapeCsvField(seo.seo_meta_desc || char.micro_lore || ''),
    escapeCsvField('active')
  ].join(','));

  // ROW 2: Image 2 (Back Collector Design & NFC Target)
  rows.push([
    escapeCsvField(handle),
    escapeCsvField(''), // Title empty on secondary image rows
    escapeCsvField(''),
    escapeCsvField(''),
    escapeCsvField(''),
    escapeCsvField(''),
    escapeCsvField(''),
    escapeCsvField(''),
    escapeCsvField(''),
    escapeCsvField(''),
    escapeCsvField(''),
    escapeCsvField(''),
    escapeCsvField(''),
    escapeCsvField(''),
    escapeCsvField(''),
    escapeCsvField(''),
    escapeCsvField(''),
    escapeCsvField(''),
    escapeCsvField(''),
    escapeCsvField(''),
    escapeCsvField(backImg),
    escapeCsvField('2'),
    escapeCsvField(`${char.name} Collector Back & NFC Antenna Design - Series 1`),
    escapeCsvField(''),
    escapeCsvField(''),
    escapeCsvField(''),
    escapeCsvField('')
  ].join(','));
});

fs.writeFileSync(outputProductsCsvPath, rows.join('\n'), 'utf8');
console.log(`Successfully generated Shopify CSV with ${greetings.length} products (32 image rows) at: ${outputProductsCsvPath}`);

// 2. GENERATE SHOPIFY COLLECTIONS CSV
const collectionHeaders = [
  'Handle',
  'Title',
  'Body (HTML)',
  'Sort Order',
  'Rule: Column',
  'Rule: Relation',
  'Rule: Condition',
  'Published'
];

const collectionRows = [collectionHeaders.map(escapeCsvField).join(',')];

const collectionsConfig = [
  {
    handle: 'tapgreetings-series-1',
    title: 'TapGreetings Series 1: The Clay & Needle-Felt Holiday Collection',
    body: '<p>The complete 16-card Series 1 holiday collection featuring miniature polymer clay sculptures and needle-felted keepsakes with embedded smartphone NFC video streaming.</p>',
    sort: 'manual',
    ruleCol: 'tag',
    ruleRel: 'equals',
    ruleCond: 'Series 1'
  },
  {
    handle: 'series-1-classic-icons',
    title: 'Series 1 &bull; Classic Icons',
    body: '<p>Timeless holiday icons sculpted in warm polymer clay: Santa (#001), Frosty (#002), Rudolph (#003), and Mrs. Claus (#010).</p>',
    sort: 'manual',
    ruleCol: 'tag',
    ruleRel: 'equals',
    ruleCond: 'Classic Icons'
  },
  {
    handle: 'series-1-winter-magic',
    title: 'Series 1 &bull; Winter Magic',
    body: '<p>Crystalline, celestial, and enchanted winter spirits: Jack Frost (#004), Snowflake (#007), Sugar Plum Fairy (#014), and Snow Monster / Yeti (#015).</p>',
    sort: 'manual',
    ruleCol: 'tag',
    ruleRel: 'equals',
    ruleCond: 'Winter Magic'
  },
  {
    handle: 'series-1-hearth-holiday',
    title: 'Series 1 &bull; Hearth & Holiday',
    body: '<p>Cozy fireside traditions and sweet treats: Nutcracker (#005), The Tree (#006), Surprise Gift (#008), and Gingerbread Man (#009).</p>',
    sort: 'manual',
    ruleCol: 'tag',
    ruleRel: 'equals',
    ruleCond: 'Hearth & Holiday'
  },
  {
    handle: 'series-1-festive-friends',
    title: 'Series 1 &bull; Festive Friends',
    body: '<p>Adorable holiday companions and playful creatures: Workshop Elf (#011), Polar Bear (#012), Penguin (#013), and Stocking Puppy (#016).</p>',
    sort: 'manual',
    ruleCol: 'tag',
    ruleRel: 'equals',
    ruleCond: 'Festive Friends'
  }
];

collectionsConfig.forEach(col => {
  collectionRows.push([
    escapeCsvField(col.handle),
    escapeCsvField(col.title),
    escapeCsvField(col.body),
    escapeCsvField(col.sort),
    escapeCsvField(col.ruleCol),
    escapeCsvField(col.ruleRel),
    escapeCsvField(col.ruleCond),
    escapeCsvField('TRUE')
  ].join(','));
});

fs.writeFileSync(outputCollectionsCsvPath, collectionRows.join('\n'), 'utf8');
console.log(`Successfully generated Shopify Collections CSV at: ${outputCollectionsCsvPath}`);

// 3. GENERATE COLLECTIONS SETUP GUIDE
const guideMarkdown = `# TapGreetings Shopify Collections & Tagging Architecture

This guide details the exact collection structure, automated smart rules, and subcollection categorization for TapGreetings Series 1.

## 1. Master Collection: Series 1
* **Title**: TapGreetings Series 1: The Clay & Needle-Felt Holiday Collection
* **Handle**: \`tapgreetings-series-1\`
* **Type**: Automated (Smart Collection)
* **Conditions**:
  * Product tag **equals** \`Series 1\`
* **Contains**: All 16 cards (#001 through #016)

---

## 2. Series 1 Subcollections

### A. Classic Icons
* **Handle**: \`series-1-classic-icons\`
* **Condition**: Product tag **equals** \`Classic Icons\`
* **Cards**:
  1. #001 Santa (*The Master Artisan*)
  2. #002 Frosty (*The Snowbound Joy*)
  3. #003 Rudolph (*The Beacon of Light*)
  4. #010 Mrs. Claus (*The Hearth Matron*)

### B. Winter Magic
* **Handle**: \`series-1-winter-magic\`
* **Condition**: Product tag **equals** \`Winter Magic\`
* **Cards**:
  1. #004 Jack Frost (*The Frost Sprite*)
  2. #007 Snowflake (*The Celestial Crystal*)
  3. #014 Sugar Plum Fairy (*The Twilight Sprite*)
  4. #015 Snow Monster / Yeti (*The Frost Guardian*)

### C. Hearth & Holiday
* **Handle**: \`series-1-hearth-holiday\`
* **Condition**: Product tag **equals** \`Hearth & Holiday\`
* **Cards**:
  1. #005 Nutcracker (*The Hearth Sentry*)
  2. #006 The Tree (*The Evergreen Hearth*)
  3. #008 Gift (*The Surprise Box*)
  4. #009 Gingerbread Man (*The Sweet Reveler*)

### D. Festive Friends
* **Handle**: \`series-1-festive-friends\`
* **Condition**: Product tag **equals** \`Festive Friends\`
* **Cards**:
  1. #011 Workshop Elf (*The Little Toymaker*)
  2. #012 Polar Bear (*The Gentle Lantern-Bearer*)
  3. #013 Penguin (*The Festive Ice Dancer*)
  4. #016 Stocking Puppy (*The Little Holiday Surprise*)

---

## 3. Product Specifications & Taxonomies
* **Standard Category**: \`Arts & Entertainment > Party & Celebration > Gift Giving > Greeting Cards\`
* **Product Type**: \`Smart NFC Greeting Card\`
* **Vendor**: \`TapGreetings\`
* **Retail Price**: $14.99 USD
* **Compare At Price**: $24.99 USD
* **Hardware**: CR80 30mil Waterproof PVC with NTAG215 microchip
* **Digital Integration**: Dual-image product listings (Front + Back) with live links to 1080p stop-motion video streaming.
`;

fs.writeFileSync(outputGuidePath, guideMarkdown, 'utf8');
console.log(`Successfully generated Shopify Collections Guide at: ${outputGuidePath}`);
