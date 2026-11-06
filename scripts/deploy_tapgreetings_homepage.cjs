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
  if (!data.access_token) throw new Error('Failed to get token: ' + JSON.stringify(data));
  return data.access_token;
}

async function uploadThemeAsset(key, content, token, themeId, store) {
  console.log(`Uploading theme asset: ${key}...`);
  const body = { asset: { key, value: content } };

  const res = await fetch(`https://${store}/admin/api/2024-07/themes/${themeId}/assets.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    throw new Error(`Failed to upload ${key}: [${res.status}] ${await res.text()}`);
  }
  console.log(`  ✅ ${key} uploaded successfully!`);
}

async function main() {
  const token = await getAccessToken();
  const store = process.env.SHOPIFY_STORE_DOMAIN;
  const themeId = 193427177794;

  console.log(`=== Deploying to Shopify Store: ${store} (Theme: ${themeId}) ===\n`);

  // 1. Upload sections/tapgreetings-homepage.liquid
  const homeSection = fs.readFileSync(path.join(__dirname, '../theme/sections/tapgreetings-homepage.liquid'), 'utf8');
  await uploadThemeAsset('sections/tapgreetings-homepage.liquid', homeSection, token, themeId, store);

  // 2. Upload templates/index.json
  const indexTemplate = fs.readFileSync(path.join(__dirname, '../theme/templates/index.json'), 'utf8');
  await uploadThemeAsset('templates/index.json', indexTemplate, token, themeId, store);

  // 3. Upload sections/tapgreetings-set-product-page.liquid
  const setSection = fs.readFileSync(path.join(__dirname, '../theme/sections/tapgreetings-set-product-page.liquid'), 'utf8');
  await uploadThemeAsset('sections/tapgreetings-set-product-page.liquid', setSection, token, themeId, store);

  // 4. Upload sections/tapgreetings-product-page.liquid
  const cardSection = fs.readFileSync(path.join(__dirname, '../theme/sections/tapgreetings-product-page.liquid'), 'utf8');
  await uploadThemeAsset('sections/tapgreetings-product-page.liquid', cardSection, token, themeId, store);

  console.log('\n🎉 All theme files deployed to live Shopify store successfully!');
}

main().catch(err => {
  console.error('Deployment error:', err);
  process.exit(1);
});
