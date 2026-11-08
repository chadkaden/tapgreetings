const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const match = line.trim().match(/^([^=]+)=(.*)$/);
    if (match) process.env[match[1]] = match[2].trim();
  });
}

const holidayMapped = require('./holiday_mapped_products.json');

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

  const s3Codes = ['017', '018', '019', '020', '021', '022', '023', '024'];

  for (const code of s3Codes) {
    const pInfo = holidayMapped[code];
    if (!pInfo || !pInfo.productId) continue;

    console.log(`Updating CR80 images for Product #${code} (ID: ${pInfo.productId})...`);
    const frontPath = path.join(__dirname, `../assets/img/cr80/${code}-front.jpg`);
    const backPath = path.join(__dirname, `../assets/img/cr80/${code}-back.jpg`);

    const images = [];
    if (fs.existsSync(frontPath)) {
      images.push({
        attachment: fs.readFileSync(frontPath).toString('base64'),
        filename: `${code}-front-cr80.jpg`
      });
    }
    if (fs.existsSync(backPath)) {
      images.push({
        attachment: fs.readFileSync(backPath).toString('base64'),
        filename: `${code}-back-cr80.jpg`
      });
    }

    const res = await fetch(`https://${store}/admin/api/${version}/products/${pInfo.productId}.json`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token
      },
      body: JSON.stringify({
        product: {
          id: pInfo.productId,
          images
        }
      })
    });

    if (res.ok) {
      console.log(`  ? Product #${code} images updated to CR80!`);
    } else {
      console.error(`  ? Error updating #${code}:`, await res.text());
    }

    await new Promise(r => setTimeout(r, 600));
  }
}

main().catch(console.error);
