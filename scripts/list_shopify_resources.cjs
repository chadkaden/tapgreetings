const fs = require('fs');
const path = require('path');

// Auto-load .env if present
const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const match = line.trim().match(/^([^=]+)=(.*)$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].trim();
    }
  });
}

const STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || 'tapthingy.myshopify.com';
const API_VERSION = '2024-07';
const CLIENT_ID = process.env.SHOPIFY_CLIENT_ID || '';
const CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET || '';

async function getAccessToken() {
  const tokenUrl = `https://${STORE_DOMAIN}/admin/oauth/access_token`;
  const res = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials'
    })
  });
  const data = await res.json();
  if (!data.access_token) {
    throw new Error('Failed to get access token: ' + JSON.stringify(data));
  }
  return data.access_token;
}

async function shopifyRequest(endpoint, token) {
  const url = `https://${STORE_DOMAIN}/admin/api/${API_VERSION}/${endpoint}`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    }
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`[${res.status}] ${text}`);
  return JSON.parse(text);
}

async function main() {
  const token = await getAccessToken();
  console.log('✅ Access Token acquired.');

  const productsData = await shopifyRequest('products.json?limit=50', token);
  console.log(`\n📦 Existing Products (${productsData.products.length}):`);
  productsData.products.forEach(p => {
    console.log(` - ID: ${p.id} | Title: "${p.title}" | Handle: "${p.handle}" | Images: ${p.images.length}`);
  });

  const smartCollections = await shopifyRequest('smart_collections.json?limit=50', token);
  console.log(`\n🏷️ Existing Smart Collections (${smartCollections.smart_collections.length}):`);
  smartCollections.smart_collections.forEach(c => {
    console.log(` - ID: ${c.id} | Title: "${c.title}" | Handle: "${c.handle}"`);
  });

  const customCollections = await shopifyRequest('custom_collections.json?limit=50', token);
  console.log(`\n🏷️ Existing Custom Collections (${customCollections.custom_collections.length}):`);
  customCollections.custom_collections.forEach(c => {
    console.log(` - ID: ${c.id} | Title: "${c.title}" | Handle: "${c.handle}"`);
  });

  const pagesData = await shopifyRequest('pages.json?limit=50', token);
  console.log(`\n📄 Existing Pages (${pagesData.pages.length}):`);
  pagesData.pages.forEach(p => {
    console.log(` - ID: ${p.id} | Title: "${p.title}" | Handle: "${p.handle}"`);
  });
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
