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
  console.log('🎨 DEPLOYING TAPGREETINGS SERIES 1 THEME ASSETS & TEMPLATES');
  console.log('========================================================================');

  // 1. Upload Sections
  const prodSection = fs.readFileSync(path.join(__dirname, '../theme/sections/tapgreetings-product-page.liquid'), 'utf8');
  await uploadThemeAsset('sections/tapgreetings-product-page.liquid', prodSection, token, themeId, store);

  const colSection = fs.readFileSync(path.join(__dirname, '../theme/sections/tapgreetings-collection-grid.liquid'), 'utf8');
  await uploadThemeAsset('sections/tapgreetings-collection-grid.liquid', colSection, token, themeId, store);

  // 2. Upload Templates
  const prodTemplate = fs.readFileSync(path.join(__dirname, '../theme/templates/product.tapgreetings.json'), 'utf8');
  await uploadThemeAsset('templates/product.tapgreetings.json', prodTemplate, token, themeId, store);

  const colTemplate = fs.readFileSync(path.join(__dirname, '../theme/templates/collection.tapgreetings.json'), 'utf8');
  await uploadThemeAsset('templates/collection.tapgreetings.json', colTemplate, token, themeId, store);

  // 3. Update all 16 TapGreetings Products to use template_suffix: 'tapgreetings'
  console.log('\n📦 Updating Products with template_suffix: "tapgreetings"...');
  const prodsRes = await fetch(`https://${store}/admin/api/2024-07/products.json?limit=250`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const { products } = await prodsRes.json();
  const tgProducts = products.filter(p => p.tags.includes('Series 1') || p.tags.includes('TapGreetings'));

  console.log(`Found ${tgProducts.length} TapGreetings products to update.`);
  for (const prod of tgProducts) {
    const updateRes = await fetch(`https://${store}/admin/api/2024-07/products/${prod.id}.json`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token
      },
      body: JSON.stringify({
        product: {
          id: prod.id,
          template_suffix: 'tapgreetings'
        }
      })
    });
    if (updateRes.ok) {
      console.log(`  ✓ Product ${prod.id} (${prod.title.split(' ')[0]}) set to template_suffix: 'tapgreetings'`);
    } else {
      console.error(`  ❌ Failed product ${prod.id}:`, await updateRes.text());
    }
  }

  // 4. Update all 5 Smart Collections to use template_suffix: 'tapgreetings'
  console.log('\n🏷️ Updating Smart Collections with template_suffix: "tapgreetings"...');
  const smartRes = await fetch(`https://${store}/admin/api/2024-07/smart_collections.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const { smart_collections } = await smartRes.json();
  const tgCollections = smart_collections.filter(c => 
    c.handle.includes('series-1') || 
    c.handle.includes('tapgreetings') ||
    c.title.includes('Series 1')
  );

  console.log(`Found ${tgCollections.length} TapGreetings collections to update.`);
  for (const col of tgCollections) {
    const updateRes = await fetch(`https://${store}/admin/api/2024-07/smart_collections/${col.id}.json`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token
      },
      body: JSON.stringify({
        smart_collection: {
          id: col.id,
          template_suffix: 'tapgreetings'
        }
      })
    });
    if (updateRes.ok) {
      console.log(`  ✓ Collection ${col.id} ("${col.title}") set to template_suffix: 'tapgreetings'`);
    } else {
      console.error(`  ❌ Failed collection ${col.id}:`, await updateRes.text());
    }
  }

  console.log('\n🎉 ALL TAPGREETINGS THEME TEMPLATES & SUFFIXES DEPLOYED!');
}

main().catch(console.error);
