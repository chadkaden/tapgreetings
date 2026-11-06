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
  const res = await fetch(`https://${STORE_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials'
    })
  });
  const data = await res.json();
  return data.access_token;
}

async function run() {
  const token = await getAccessToken();
  const smartRes = await fetch(`https://${STORE_DOMAIN}/admin/api/${API_VERSION}/smart_collections.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const { smart_collections } = await smartRes.json();
  
  console.log('--- VERIFYING SMART COLLECTIONS ---');
  for (const c of smart_collections) {
    const prodsRes = await fetch(`https://${STORE_DOMAIN}/admin/api/${API_VERSION}/collections/${c.id}/products.json`, {
      headers: { 'X-Shopify-Access-Token': token }
    });
    const prods = await prodsRes.json();
    console.log(`Collection: "${c.title}" (${c.handle})`);
    console.log(`  Products count: ${prods.products ? prods.products.length : 0}`);
    if (prods.products) {
      console.log(`  Products: ${prods.products.map(p => p.title.split(' ')[0]).join(', ')}`);
    }
  }
}

run().catch(console.error);
