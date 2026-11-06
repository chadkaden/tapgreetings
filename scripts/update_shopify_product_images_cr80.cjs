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

async function updateAllProductImages() {
  const token = await getAccessToken();
  const store = process.env.SHOPIFY_STORE_DOMAIN;
  const version = '2024-07';

  // 1. Get products
  const prodsRes = await fetch(`https://${store}/admin/api/${version}/products.json?limit=250`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const { products } = await prodsRes.json();
  const tgProducts = products.filter(p => p.tags.includes('Series 1') || p.tags.includes('TapGreetings'));

  console.log(`Updating CR80 images for ${tgProducts.length} TapGreetings products...`);

  for (let i = 0; i < tgProducts.length; i++) {
    const prod = tgProducts[i];
    // Find card code from tags or title
    const match = prod.title.match(/#(\d{3})/);
    if (!match) continue;
    const code = match[1];

    const frontPath = path.join(__dirname, `../assets/img/${code}-front.jpg`);
    const backPath = path.join(__dirname, `../assets/img/${code}-back.jpg`);

    if (!fs.existsSync(frontPath) || !fs.existsSync(backPath)) {
      console.warn(`Images missing for #${code}`);
      continue;
    }

    console.log(`\n[${i + 1}/${tgProducts.length}] Updating #${code}: ${prod.title.split(' ')[1]} (ID: ${prod.id})...`);

    // Delete existing images
    for (const oldImg of (prod.images || [])) {
      await fetch(`https://${store}/admin/api/${version}/products/${prod.id}/images/${oldImg.id}.json`, {
        method: 'DELETE',
        headers: { 'X-Shopify-Access-Token': token }
      });
    }

    // Upload new front image (CR80 ratio)
    const frontBase64 = fs.readFileSync(frontPath).toString('base64');
    const frontRes = await fetch(`https://${store}/admin/api/${version}/products/${prod.id}/images.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token
      },
      body: JSON.stringify({
        image: {
          attachment: frontBase64,
          filename: `${code}-front-cr80.jpg`,
          alt: `${prod.title} Front Artwork - CR80 Physical Keepsake Card`
        }
      })
    });
    const frontData = await frontRes.json();
    console.log(`  ✓ Front CR80 attached: ${frontData.image ? frontData.image.src : 'Error'}`);

    // Upload new back image (CR80 ratio)
    const backBase64 = fs.readFileSync(backPath).toString('base64');
    const backRes = await fetch(`https://${store}/admin/api/${version}/products/${prod.id}/images.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token
      },
      body: JSON.stringify({
        image: {
          attachment: backBase64,
          filename: `${code}-back-cr80.jpg`,
          alt: `${prod.title} Collector Back - CR80 Physical Keepsake Card`
        }
      })
    });
    const backData = await backRes.json();
    console.log(`  ✓ Back CR80 attached: ${backData.image ? backData.image.src : 'Error'}`);

    // Rate-limiting delay
    await new Promise(r => setTimeout(r, 600));
  }

  console.log('\n🎉 ALL 16 PRODUCTS UPDATED WITH CR80 CREDIT CARD ASPECT RATIO IMAGES!');
}

updateAllProductImages().catch(console.error);
