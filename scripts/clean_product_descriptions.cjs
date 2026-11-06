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

  // 1. Update Set Product body_html
  console.log('Fetching set product 15504742416706...');
  const setRes = await fetch(`https://${store}/admin/api/2024-07/products/15504742416706.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const setData = await setRes.json();
  let setHtml = setData.product.body_html;
  
  // Replace 1080p 60fps stop-motion holiday video animation with just video
  setHtml = setHtml.replace(/1080p\s*60fps\s*stop-motion\s*holiday\s*video\s*animation/gi, 'video');
  setHtml = setHtml.replace(/1080p\s*60fps/gi, 'video');
  setHtml = setHtml.replace(/1080p\s*Stop-Motion\s*Video/gi, 'Video');

  const updateSetRes = await fetch(`https://${store}/admin/api/2024-07/products/15504742416706.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      product: {
        id: 15504742416706,
        body_html: setHtml
      }
    })
  });
  if (updateSetRes.ok) {
    console.log(' ✅ Set product body_html updated successfully!');
  } else {
    console.error(' ❌ Failed to update set product:', await updateSetRes.text());
  }

  // 2. Check and update the 16 individual products in series 1
  console.log('\nChecking all products in Series 1 collection...');
  const colRes = await fetch(`https://${store}/admin/api/2024-07/collections/528606003522/products.json?limit=50`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const colData = await colRes.json();
  for (const prod of colData.products) {
    if (prod.body_html && (prod.body_html.includes('1080p') || prod.body_html.includes('60fps'))) {
      console.log(`Updating product ${prod.id} (${prod.title})...`);
      let updatedHtml = prod.body_html
        .replace(/1080p\s*60fps\s*stop-motion\s*holiday\s*video\s*animation/gi, 'video')
        .replace(/1080p\s*60fps/gi, 'video')
        .replace(/1080p\s*Stop-Motion\s*Video/gi, 'Video');
      
      const updateRes = await fetch(`https://${store}/admin/api/2024-07/products/${prod.id}.json`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': token
        },
        body: JSON.stringify({
          product: {
            id: prod.id,
            body_html: updatedHtml
          }
        })
      });
      if (updateRes.ok) {
        console.log(`  ✅ Product ${prod.id} updated!`);
      }
    }
  }

  console.log('\nDone updating all descriptions!');
}

run().catch(console.error);
