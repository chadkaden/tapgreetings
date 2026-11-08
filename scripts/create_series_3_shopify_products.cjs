const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const match = line.trim().match(/^([^=]+)=(.*)$/);
    if (match) process.env[match[1]] = match[2].trim();
  });
}

const holidayOfficial = require('../data/holiday_series_official.json');
const holidayMappedPath = path.join(__dirname, 'holiday_mapped_products.json');
let holidayMapped = {};
if (fs.existsSync(holidayMappedPath)) {
  holidayMapped = JSON.parse(fs.readFileSync(holidayMappedPath, 'utf8'));
}

async function getAccessToken() {
  const store = process.env.SHOPIFY_STORE_DOMAIN;
  const res = await fetch(`https://${store}/admin/oauth/access_token`, {
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

async function main() {
  const token = await getAccessToken();
  const store = process.env.SHOPIFY_STORE_DOMAIN;
  const version = '2024-07';

  console.log('Checking existing Shopify products to avoid duplicates...');
  const existingRes = await fetch(`https://${store}/admin/api/${version}/products.json?limit=250`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const { products } = await existingRes.json();
  const existingHandles = new Set(products.map(p => p.handle));

  const series3Codes = ['017', '018', '019', '020', '021', '022', '023', '024'];

  for (const code of series3Codes) {
    const card = holidayOfficial[code];
    if (!card) continue;

    const handle = `tapgreeting-series3-${code}`;
    const title = `#${code} ${card.name} (${card.title}) - Smart NFC Video Keepsake Card`;

    // Check if product already exists in shopify
    const existing = products.find(p => p.handle === handle || p.title.startsWith(`#${code} `));
    if (existing) {
      console.log(`Product already exists: #${code} -> ${existing.id}`);
      holidayMapped[code] = {
        productId: existing.id,
        variantId: existing.variants[0].id,
        title: existing.title,
        handle: existing.handle,
        existingTags: existing.tags ? existing.tags.split(', ') : []
      };
      continue;
    }

    console.log(`Creating Series 3 Product #${code}: ${card.name}...`);
    const frontImgPath = path.join(__dirname, `../assets/img/cr80/${code}-front.jpg`);
    const backImgPath = path.join(__dirname, `../assets/img/cr80/${code}-back.jpg`);

    const images = [];
    if (fs.existsSync(frontImgPath)) {
      images.push({
        attachment: fs.readFileSync(frontImgPath).toString('base64'),
        filename: `${code}-front.jpg`
      });
    }
    if (fs.existsSync(backImgPath)) {
      images.push({
        attachment: fs.readFileSync(backImgPath).toString('base64'),
        filename: `${code}-back.jpg`
      });
    }

    const bodyHtml = `
      <p><strong>${card.name} (${card.title})</strong> &bull; <em>${card.series}</em></p>
      <p>&ldquo;${card.motto}&rdquo;</p>
      <p><strong>Special Abilities &amp; Features:</strong> ${card.abilities}</p>
      <p><strong>NFC Tap Target Motif:</strong> ${card.nfcMotif}</p>
      <p><strong>Print Finish:</strong> ${card.printFinish}</p>
      <p>Tap this physical smart NFC card against any smartphone (iPhone or Android) to instantly stream the 1080p motion video and solstice lore celebration&mdash;zero app download required. Can also be reprogrammed anytime to play your own custom holiday video or voice greeting!</p>
      <p><strong>Series:</strong> Series 3: The Celestial Clockwork Solstice &bull; Solstice Magic</p>
    `;

    const tags = [
      `#${code}`,
      `card-${code}`,
      'Series 3',
      'Solstice Magic',
      'The Celestial Clockwork Solstice',
      'Nordic Folklore',
      'Clockwork Automata',
      'Smart NFC Card',
      'TapGreetings',
      'NTAG215',
      'CR80 PVC',
      'Holiday 2026',
      'Greeting Card',
      'Living Keepsake',
      card.name,
      card.title
    ].join(', ');

    const payload = {
      product: {
        title,
        handle,
        body_html: bodyHtml,
        vendor: 'TapGreetings',
        product_type: 'Physical Smart NFC Greeting Card',
        tags,
        images,
        variants: [
          {
            price: '14.99',
            sku: `TG-S03-${code}`,
            inventory_management: null,
            requires_shipping: true
          }
        ]
      }
    };

    const createRes = await fetch(`https://${store}/admin/api/${version}/products.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token
      },
      body: JSON.stringify(payload)
    });

    const resData = await createRes.json();
    if (resData.product) {
      console.log(`? Successfully created Product #${code}: ID ${resData.product.id}, Variant ${resData.product.variants[0].id}`);
      holidayMapped[code] = {
        productId: resData.product.id,
        variantId: resData.product.variants[0].id,
        title: resData.product.title,
        handle: resData.product.handle,
        existingTags: tags.split(', ')
      };
    } else {
      console.error(`? Failed to create Product #${code}:`, JSON.stringify(resData));
    }

    // Rate-limit pause
    await new Promise(r => setTimeout(r, 600));
  }

  fs.writeFileSync(holidayMappedPath, JSON.stringify(holidayMapped, null, 2), 'utf8');
  console.log(`\nUpdated ${holidayMappedPath} with all mapped products!`);
}

main().catch(console.error);
