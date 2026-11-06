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

const master = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/greetings_master.json'), 'utf8'));
const drafts = master.draft_cards || [];

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

  for (let i = 0; i < drafts.length; i++) {
    const d = drafts[i];
    const padNum = String(i + 1).padStart(2, '0');
    const ch = d.character || {};
    const handle = `draft-series-${padNum}-${ch.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

    if (existingHandles.has(handle)) {
      console.log(`Product already exists: ${handle}`);
      continue;
    }

    console.log(`Creating Draft Product #${padNum}: ${ch.name}...`);
    const frontImgPath = path.join(__dirname, `../assets/img/cr80/draft-${padNum}-front.jpg`);
    const backImgPath = path.join(__dirname, `../assets/img/cr80/draft-${padNum}-back.jpg`);

    const images = [];
    if (fs.existsSync(frontImgPath)) {
      images.push({
        attachment: fs.readFileSync(frontImgPath).toString('base64'),
        filename: `draft-${padNum}-front.jpg`
      });
    }
    if (fs.existsSync(backImgPath)) {
      images.push({
        attachment: fs.readFileSync(backImgPath).toString('base64'),
        filename: `draft-${padNum}-back.jpg`
      });
    }

    const bodyHtml = `
      <p><strong>${ch.name} (${ch.title})</strong> &bull; <em>${d.event_greeting}</em></p>
      <p>&ldquo;${ch.motto}&rdquo;</p>
      <p>Tap this physical smart NFC card against any smartphone (iPhone or Android) to instantly stream the exclusive motion video and seasonal character greeting—zero app download required. Can also be reprogrammed anytime to play your own custom family video or voice message!</p>
      <p><strong>Series:</strong> Original Draft Concept Series (Pre-Clay Edition)</p>
    `;

    const payload = {
      product: {
        title: `Draft #${padNum} ${ch.name} (${ch.title}) - Pre-Clay Concept Keepsake Card`,
        body_html: bodyHtml,
        vendor: 'TapGreetings',
        product_type: 'Smart NFC Greeting Card',
        handle,
        template_suffix: 'tapgreetings',
        tags: `Draft Series, Draft Concept, TapGreetings, Pre-Clay, Smart NFC Card, ${ch.name}, ${d.event_greeting}`,
        variants: [
          {
            price: '14.99',
            sku: `TG-DRAFT-${padNum}`,
            inventory_management: null,
            requires_shipping: true
          }
        ],
        images
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

    if (!createRes.ok) {
      console.error(`Failed to create ${handle}:`, await createRes.text());
    } else {
      const created = await createRes.json();
      console.log(` ✅ Created ${created.product.title} (ID: ${created.product.id})`);
    }
  }

  console.log('Finished creating Draft Series products on Shopify!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
