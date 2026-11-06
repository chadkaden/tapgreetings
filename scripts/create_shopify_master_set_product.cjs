const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const match = line.trim().match(/^([^=]+)=(.*)$/);
    if (match) process.env[match[1]] = match[2].trim();
  });
}

async function getAccessToken() {
  const store = process.env.SHOPIFY_STORE_DOMAIN;
  const tokenUrl = `https://${store}/admin/oauth/access_token`;
  const res = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.SHOPIFY_CLIENT_ID,
      client_secret: process.env.SHOPIFY_CLIENT_SECRET,
      grant_type: 'client_credentials'
    })
  });
  const data = await res.json();
  return data.access_token;
}

const characters = [
  { code: '001', name: 'Santa', title: 'The Master Artisan' },
  { code: '002', name: 'Frosty', title: 'The Snowbound Joy' },
  { code: '003', name: 'Rudolph', title: 'The Beacon of Light' },
  { code: '004', name: 'Jack Frost', title: 'The Frost Sprite' },
  { code: '005', name: 'Nutcracker', title: 'The Hearth Sentry' },
  { code: '006', name: 'The Tree', title: 'The Evergreen Hearth' },
  { code: '007', name: 'Snowflake', title: 'The Celestial Crystal' },
  { code: '008', name: 'Gift', title: 'The Surprise Box' },
  { code: '009', name: 'Gingerbread Man', title: 'The Sweet Reveler' },
  { code: '010', name: 'Mrs. Claus', title: 'The Hearth Matron' },
  { code: '011', name: 'Workshop Elf', title: 'The Toymaker' },
  { code: '012', name: 'Polar Bear', title: 'The Gentle Giant' },
  { code: '013', name: 'Penguin', title: 'The Ice Dancer' },
  { code: '014', name: 'Sugar Plum Fairy', title: 'The Twilight Sprite' },
  { code: '015', name: 'Snow Monster', title: 'The Frost Guardian' },
  { code: '016', name: 'Stocking Puppy', title: 'The Little Surprise' }
];

async function createOrUpdateMasterSet() {
  const token = await getAccessToken();
  const store = process.env.SHOPIFY_STORE_DOMAIN;
  const version = '2024-07';

  console.log('========================================================================');
  console.log('🎁 CREATING / UPDATING TAPGREETINGS SERIES 1 MASTER COLLECTION PRODUCT');
  console.log('========================================================================');

  // Check if product already exists
  const prodsRes = await fetch(`https://${store}/admin/api/${version}/products.json?limit=250`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const { products } = await prodsRes.json();
  const existing = products.find(p => 
    p.title.includes('TapGreetings Series 1: Master Collection') ||
    p.handle === 'tapgreetings-series-1-master-collection'
  );

  const productTitle = 'NFC Tap-to-Video PVC Greeting Card TapGreetings Series 1: Master Collection (16 Card Selection & Full Box Set)';
  const productHandle = 'tapgreetings-series-1-master-collection';

  const bodyHtml = `
<div class="tg-master-desc">
  <p><strong>✦ TapGreetings Series 1: The Clay &amp; Needle-Felt Holiday Collection ✦</strong></p>
  <p>Experience the entire award-winning holiday keepsake line in one definitive master collection, or select your favorite individual character cards from the dropdown above!</p>
  
  <h3>✨ Choose Your Option:</h3>
  <ul>
    <li><strong>FULL 16-CARD COMPLETE MASTER COLLECTOR BOX SET ($199.00 - Save $40.84!):</strong> Includes all 16 physical CR80 smart keepsake cards (#001 through #016) housed in a premium collector presentation box with individual protective archival sleeves.</li>
    <li><strong>INDIVIDUAL CHARACTER SMART CARDS ($14.99 each):</strong> Select any single character from our 16 artisan claymation holiday roster.</li>
  </ul>

  <h3>📱 Instant NFC Tap-to-Video Experience:</h3>
  <ul>
    <li>Tap the card with any modern smartphone (iPhone XS-16 &amp; all Android devices).</li>
    <li>Zero app download required &bull; Works right through phone cases.</li>
    <li>Instantly plays the exclusive 1080p 60fps stop-motion holiday video animation and synchronized character voice greeting.</li>
  </ul>

  <h3>🛡️ Premium Physical Card Specs:</h3>
  <ul>
    <li>Standard CR80 Credit Card Dimensions (85.60mm &times; 53.98mm &times; 0.76mm / 30 mil).</li>
    <li>Waterproof, fade-resistant high-gloss laminate PVC construction.</li>
    <li>Embedded high-speed NTAG215 NFC microchip (reprogrammable anytime via our free web tool at /tools).</li>
  </ul>
</div>
  `.trim();

  // Build variants
  const variants = [
    {
      title: 'FULL 16-CARD COMPLETE MASTER COLLECTOR BOX SET',
      option1: 'FULL 16-CARD COMPLETE MASTER COLLECTOR BOX SET',
      price: '199.00',
      compare_at_price: '239.84',
      sku: 'TG-S1-BOX-SET-16',
      inventory_policy: 'deny',
      requires_shipping: true
    }
  ];

  characters.forEach(c => {
    variants.push({
      title: `#${c.code} ${c.name} (${c.title})`,
      option1: `#${c.code} ${c.name} (${c.title})`,
      price: '14.99',
      compare_at_price: null,
      sku: `TG-S1-VAR-${c.code}`,
      inventory_policy: 'deny',
      requires_shipping: true
    });
  });

  const productPayload = {
    title: productTitle,
    handle: productHandle,
    body_html: bodyHtml,
    vendor: 'TapThingy',
    product_type: 'TapGreetings Cards',
    tags: 'Series 1, TapGreetings, Master Collection, Full Set, Box Set, NFC Card, Smart Keepsake Card, Holiday, Complete Set',
    options: [
      {
        name: 'Card Selection'
      }
    ],
    variants
  };

  let productId;

  if (existing) {
    console.log(`Found existing product (ID: ${existing.id}). Updating...`);
    productId = existing.id;
    const updateRes = await fetch(`https://${store}/admin/api/${version}/products/${existing.id}.json`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token
      },
      body: JSON.stringify({ product: productPayload })
    });
    const updateData = await updateRes.json();
    console.log(`Product updated: ${updateData.product ? updateData.product.id : JSON.stringify(updateData)}`);
  } else {
    console.log('Creating new Master Collection product...');
    const createRes = await fetch(`https://${store}/admin/api/${version}/products.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token
      },
      body: JSON.stringify({ product: productPayload })
    });
    const createData = await createRes.json();
    if (!createData.product) {
      throw new Error(`Failed to create product: ${JSON.stringify(createData)}`);
    }
    productId = createData.product.id;
    console.log(`✅ Product created! ID: ${productId}`);
  }

  // Upload Images
  console.log('\nAttaching high-resolution CR80 showcase images...');
  
  // 1. Box Set Hero Image
  const boxSetPath = path.join(__dirname, '../assets/img/cr80/master-collection-box-set.jpg');
  if (fs.existsSync(boxSetPath)) {
    console.log('Uploading Master Box Set hero collage...');
    const b64 = fs.readFileSync(boxSetPath).toString('base64');
    await fetch(`https://${store}/admin/api/${version}/products/${productId}/images.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token
      },
      body: JSON.stringify({
        image: {
          attachment: b64,
          filename: 'master-collection-box-set-hero.jpg',
          alt: 'TapGreetings Series 1: Complete 16-Card Master Collector Box Set'
        }
      })
    });
    console.log('  ✓ Hero collage uploaded');
  }

  // 2. Upload front artwork for cards
  for (let i = 0; i < characters.length; i++) {
    const c = characters[i];
    const imgPath = path.join(__dirname, `../assets/img/cr80/${c.code}-front.jpg`);
    if (fs.existsSync(imgPath)) {
      const b64 = fs.readFileSync(imgPath).toString('base64');
      await fetch(`https://${store}/admin/api/${version}/products/${productId}/images.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': token
        },
        body: JSON.stringify({
          image: {
            attachment: b64,
            filename: `${c.code}-front-cr80.jpg`,
            alt: `#${c.code} ${c.name} (${c.title}) - CR80 Physical Keepsake Card`
          }
        })
      });
      console.log(`  ✓ Uploaded image for #${c.code} ${c.name}`);
      await new Promise(r => setTimeout(r, 400));
    }
  }

  console.log(`\n🎉 MASTER COLLECTION BOX SET PRODUCT READY! ID: ${productId}`);
  console.log(`URL: https://${store}/products/${productHandle}`);
}

createOrUpdateMasterSet().catch(console.error);
