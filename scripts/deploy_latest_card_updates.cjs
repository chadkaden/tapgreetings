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

async function uploadThemeAsset(key, content, token, themeId, store) {
  console.log(`Uploading theme asset: ${key}...`);
  const res = await fetch(`https://${store}/admin/api/2024-07/themes/${themeId}/assets.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({ asset: { key, value: content } })
  });
  if (!res.ok) {
    throw new Error(`Failed to upload ${key}: [${res.status}] ${await res.text()}`);
  }
  console.log(` ✅ ${key} uploaded successfully!`);
}

async function main() {
  const token = await getAccessToken();
  const store = process.env.SHOPIFY_STORE_DOMAIN;
  const themeId = 193427177794;

  console.log('1. Deploying sections/tapgreetings-product-page.liquid...');
  const cardSection = fs.readFileSync(path.join(__dirname, '../theme/sections/tapgreetings-product-page.liquid'), 'utf8');
  await uploadThemeAsset('sections/tapgreetings-product-page.liquid', cardSection, token, themeId, store);

  console.log('2. Deploying sections/tapgreetings-set-product-page.liquid...');
  const setSection = fs.readFileSync(path.join(__dirname, '../theme/sections/tapgreetings-set-product-page.liquid'), 'utf8');
  await uploadThemeAsset('sections/tapgreetings-set-product-page.liquid', setSection, token, themeId, store);

  console.log('3. Deploying sections/pinkoween-product-page.liquid...');
  const pinkSection = fs.readFileSync('G:/Server/projects/pinkoween/theme/sections/pinkoween-product-page.liquid', 'utf8');
  await uploadThemeAsset('sections/pinkoween-product-page.liquid', pinkSection, token, themeId, store);

  console.log('\nAll theme sections uploaded successfully to theme ' + themeId + '!');
}

main().catch(console.error);
