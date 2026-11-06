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
  const version = '2024-07';

  console.log('========================================================================');
  console.log('🚀 DEPLOYING HAPPY HOLIDAYS SERIES 1 SET PRODUCT & THEME TEMPLATES');
  console.log('========================================================================');

  // 1. Upload sections/tapgreetings-set-product-page.liquid
  const setSection = fs.readFileSync(path.join(__dirname, '../theme/sections/tapgreetings-set-product-page.liquid'), 'utf8');
  await uploadThemeAsset('sections/tapgreetings-set-product-page.liquid', setSection, token, themeId, store);

  // 2. Upload templates/product.tapgreetings-set.json
  const setTemplate = fs.readFileSync(path.join(__dirname, '../theme/templates/product.tapgreetings-set.json'), 'utf8');
  await uploadThemeAsset('templates/product.tapgreetings-set.json', setTemplate, token, themeId, store);

  // 3. Upload default templates/product.json (points to tapgreetings-product-page instead of pinkoween)
  const defaultProdTemplate = fs.readFileSync(path.join(__dirname, '../theme/templates/product.json'), 'utf8');
  await uploadThemeAsset('templates/product.json', defaultProdTemplate, token, themeId, store);

  // 4. Update Pink-O-Ween products to use template_suffix: 'pinkoween'
  console.log('\nEnsuring Pink-O-Ween products use template_suffix: "pinkoween"...');
  const prodsRes = await fetch(`https://${store}/admin/api/${version}/products.json?limit=250`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const { products } = await prodsRes.json();
  const pinkProducts = products.filter(p => p.tags.includes('Pink-O-Ween') || p.tags.includes('Pinkoween'));
  for (const p of pinkProducts) {
    if (p.template_suffix !== 'pinkoween') {
      await fetch(`https://${store}/admin/api/${version}/products/${p.id}.json`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': token
        },
        body: JSON.stringify({
          product: {
            id: p.id,
            template_suffix: 'pinkoween'
          }
        })
      });
      console.log(`  ✓ Updated Pink-O-Ween product ${p.id} to template_suffix: 'pinkoween'`);
    }
  }

  // 5. Update Master Set Product
  console.log('\n🎁 Updating Happy Holidays Series 1 Master Collection Product...');
  const masterProdId = 15504742416706;
  const updateProdRes = await fetch(`https://${store}/admin/api/${version}/products/${masterProdId}.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      product: {
        id: masterProdId,
        title: 'Happy Holidays Series 1: Master Collector Box Set & Complete Card Selection (All 16 Cards)',
        handle: 'happy-holidays-series-1',
        template_suffix: 'tapgreetings-set',
        tags: 'Series 1, TapGreetings, Master Collection, Full Set, Box Set, NFC Card, Smart Keepsake Card, Holiday, Complete Set, Happy Holidays Series 1'
      }
    })
  });

  const updatedData = await updateProdRes.json();
  if (updatedData.product) {
    console.log(` ✅ Product ${masterProdId} updated successfully!`);
    console.log(` Title: ${updatedData.product.title}`);
    console.log(` Handle: ${updatedData.product.handle}`);
    console.log(` Template Suffix: ${updatedData.product.template_suffix}`);
    console.log(` Live URL: https://${store}/products/${updatedData.product.handle}`);
  } else {
    console.error(' ❌ Failed to update product:', JSON.stringify(updatedData));
  }

  console.log('\n🎉 ALL SET PRODUCT THEME UPDATES DEPLOYED TO SHOPIFY!');
}

main().catch(console.error);
