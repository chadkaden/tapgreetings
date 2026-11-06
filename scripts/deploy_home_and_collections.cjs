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
    body: JSON.stringify({
      asset: {
        key,
        value: content
      }
    })
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

  console.log('========================================================================');
  console.log('🚀 DEPLOYING UPDATED HOME, COLLECTIONS/ALL & CR80 GRID');
  console.log('========================================================================');

  // 1. Upload updated sections
  const spotlightSection = fs.readFileSync(path.join(__dirname, '../theme/sections/tapgreetings-spotlight.liquid'), 'utf8');
  await uploadThemeAsset('sections/tapgreetings-spotlight.liquid', spotlightSection, token, themeId, store);

  const colGridSection = fs.readFileSync(path.join(__dirname, '../theme/sections/tapgreetings-collection-grid.liquid'), 'utf8');
  await uploadThemeAsset('sections/tapgreetings-collection-grid.liquid', colGridSection, token, themeId, store);

  const prodSection = fs.readFileSync(path.join(__dirname, '../theme/sections/tapgreetings-product-page.liquid'), 'utf8');
  await uploadThemeAsset('sections/tapgreetings-product-page.liquid', prodSection, token, themeId, store);

  // 2. Upload collection.pinkoween.json for backward compatibility
  await uploadThemeAsset('templates/collection.pinkoween.json', JSON.stringify({
    sections: {
      main: {
        type: 'pinkoween-collection-grid',
        settings: {}
      }
    },
    order: ['main']
  }, null, 2), token, themeId, store);

  // 3. Upload updated templates/collection.json (so /collections/all uses tapgreetings)
  const colTemplate = fs.readFileSync(path.join(__dirname, '../theme/templates/collection.json'), 'utf8');
  await uploadThemeAsset('templates/collection.json', colTemplate, token, themeId, store);

  // 4. Upload updated templates/index.json (so Home uses tapgreetings-spotlight)
  const indexTemplate = fs.readFileSync(path.join(__dirname, '../theme/templates/index.json'), 'utf8');
  await uploadThemeAsset('templates/index.json', indexTemplate, token, themeId, store);

  // 5. Update Pink-O-Ween custom collections to use template_suffix: 'pinkoween'
  const customColsRes = await fetch(`https://${store}/admin/api/2024-07/custom_collections.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const { custom_collections } = await customColsRes.json();
  for (const c of custom_collections) {
    if (c.handle.includes('pink-o-ween')) {
      console.log(`Setting template_suffix: 'pinkoween' on "${c.title}" (ID: ${c.id})...`);
      await fetch(`https://${store}/admin/api/2024-07/custom_collections/${c.id}.json`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': token
        },
        body: JSON.stringify({
          custom_collection: {
            id: c.id,
            template_suffix: 'pinkoween'
          }
        })
      });
      console.log(`  ✓ Updated ${c.handle}`);
    }
  }

  console.log('\n🎉 ALL UPDATES DEPLOYED TO SHOPIFY SUCCESSFULLY!');
}

main().catch(console.error);
