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

async function uploadThemeAsset(key, content, token, themeId, store, isBase64 = false) {
  console.log(`Uploading theme asset: ${key}...`);
  const body = isBase64
    ? { asset: { key, attachment: content } }
    : { asset: { key, value: content } };

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
  console.log(` ✅ ${key} uploaded successfully!`);
}

async function main() {
  const token = await getAccessToken();
  const store = process.env.SHOPIFY_STORE_DOMAIN;
  const themeId = 193427177794;

  console.log('Deploying updated Set Product section with touch swipe...');
  const setSection = fs.readFileSync(path.join(__dirname, '../theme/sections/tapgreetings-set-product-page.liquid'), 'utf8');
  await uploadThemeAsset('sections/tapgreetings-set-product-page.liquid', setSection, token, themeId, store);

  console.log('Uploading TapThingy Logo assets to Shopify Theme...');
  const logoWhite = fs.readFileSync(path.join(__dirname, '../assets/img/tapthingy-logo-white.png')).toString('base64');
  await uploadThemeAsset('assets/tapthingy-logo-white.png', logoWhite, token, themeId, store, true);

  const logoBlack = fs.readFileSync(path.join(__dirname, '../assets/img/tapthingy-logo-black.png')).toString('base64');
  await uploadThemeAsset('assets/tapthingy-logo-black.png', logoBlack, token, themeId, store, true);

  console.log('🎉 All Shopify theme assets deployed successfully!');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
