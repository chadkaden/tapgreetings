const fs = require('fs');
const path = require('path');
const envPath = path.join(__dirname, '../.env');
fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
  const match = line.trim().match(/^([^=]+)=(.*)$/);
  if (match) process.env[match[1]] = match[2].trim();
});

async function run() {
  const store = process.env.SHOPIFY_STORE_DOMAIN;
  const tokenUrl = 'https://' + store + '/admin/oauth/access_token';
  const res = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.SHOPIFY_CLIENT_ID,
      client_secret: process.env.SHOPIFY_CLIENT_SECRET,
      grant_type: 'client_credentials'
    })
  });
  const { access_token: token } = await res.json();
  const pRes = await fetch('https://' + store + '/admin/api/2024-07/products/15504742416706.json', {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const { product } = await pRes.json();
  console.log('Product ID:', product.id, 'Handle:', product.handle);
  const variantMap = {};
  product.variants.forEach(v => {
    console.log(`Variant ID: ${v.id} | SKU: ${v.sku} | Title: "${v.title}" | Price: $${v.price}`);
    const match = v.title.match(/#(\d{3})/);
    if (match) {
      variantMap[match[1]] = v.id;
    } else {
      variantMap['full_set'] = v.id;
    }
  });
  console.log('\nVariant Map JSON:');
  console.log(JSON.stringify(variantMap, null, 2));
}
run();
