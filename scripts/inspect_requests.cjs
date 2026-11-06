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

async function run() {
  const token = await getAccessToken();
  const store = process.env.SHOPIFY_STORE_DOMAIN;
  const themeId = 193427177794;

  // 1. Inspect Pink-O-Ween Master Product
  console.log('=== Checking Pink-O-Ween Master Collection Product ===');
  const pinkRes = await fetch(`https://${store}/admin/api/2024-07/products/15395168682306.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const pinkData = await pinkRes.json();
  console.log('Pink-O-Ween template_suffix:', pinkData.product.template_suffix);
  console.log('Pink-O-Ween body_html includes Click Card Variant?:', pinkData.product.body_html?.includes('Click Card Variant'));

  // 2. Fetch theme assets for product templates
  console.log('\n=== Checking Theme Assets on Theme 193427177794 ===');
  const assetsRes = await fetch(`https://${store}/admin/api/2024-07/themes/${themeId}/assets.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const assetsData = await assetsRes.json();
  const productTemplates = assetsData.assets.filter(a => a.key.includes('product'));
  console.log('Product templates & sections in theme:');
  productTemplates.forEach(a => console.log('  ', a.key));

  // 3. Search for "Museum-Grade Hardware" in local and remote
  console.log('\n=== Searching for "Museum-Grade Hardware" ===');
  // Check local files
  const searchDirs = ['G:/Server/projects/tapgreetings', 'G:/Server/projects/pinkoween'];
  for (const d of searchDirs) {
    function search(dir) {
      if (!fs.existsSync(dir)) return;
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const e of entries) {
        if (e.name === 'node_modules' || e.name === '.git') continue;
        const full = path.join(dir, e.name);
        if (e.isDirectory()) search(full);
        else if (/\.(liquid|json|html|js|cjs)$/.test(e.name)) {
          const content = fs.readFileSync(full, 'utf8');
          if (content.includes('Museum-Grade') || content.includes('Arts & Entertainment') || content.includes('Click Card Variant')) {
            console.log('Match in file:', full);
          }
        }
      }
    }
    search(d);
  }

  // Check product #001 Santa
  console.log('\n=== Checking Product #001 Santa on Shopify ===');
  const santaRes = await fetch(`https://${store}/admin/api/2024-07/products/15504664363330.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const santaData = await santaRes.json();
  console.log('Santa template_suffix:', santaData.product.template_suffix);
  console.log('Santa body_html:\n', santaData.product.body_html);
}

run().catch(console.error);
