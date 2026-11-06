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
  const series1ColId = '528606003522';

  console.log(`Fetching products in Series 1 collection (${series1ColId})...`);
  const colRes = await fetch(`https://${store}/admin/api/2024-07/collections/${series1ColId}/products.json?limit=50`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const colData = await colRes.json();
  const products = colData.products || [];
  console.log(`Found ${products.length} products.`);

  for (const prod of products) {
    let body = prod.body_html || '';
    let changed = false;

    // 1. Remove Museum-Grade Hardware list item
    const museumRegex = /<li>\s*<strong>\s*Museum-Grade Hardware:\s*<\/strong>[\s\S]*?<\/li>/gi;
    if (museumRegex.test(body)) {
      body = body.replace(museumRegex, '');
      changed = true;
    }

    // 2. Update Category Box styling for perfect dark mode support
    const oldCatBoxRegex = /<div style="background:\s*#FFF8E7;[^"]*">[\s\S]*?🏷️\s*<strong>\s*Category:\s*<\/strong>\s*Arts &amp; Entertainment &gt; Party &amp; Celebration &gt; Gift Giving &gt; Greeting Cards[\s\S]*?<\/div>/gi;
    const newCatBox = `<div class="tg-category-box" style="background: rgba(251, 191, 36, 0.08); border: 1px solid rgba(251, 191, 36, 0.35); border-radius: 12px; padding: 14px 18px; margin-top: 24px;">
    <p style="margin: 0; font-size: 13px; color: #FBBF24; font-weight: 600;">
      🏷️ <strong style="color: #FBBF24;">Category:</strong> Arts &amp; Entertainment &gt; Party &amp; Celebration &gt; Gift Giving &gt; Greeting Cards
    </p>
  </div>`;

    if (oldCatBoxRegex.test(body)) {
      body = body.replace(oldCatBoxRegex, newCatBox);
      changed = true;
    } else if (body.includes('#FFF8E7') && body.includes('Category:')) {
      // Fallback replacement if specific regex didn't catch due to whitespace
      body = body.replace(/<div style="background:\s*#FFF8E7;[\s\S]*?<\/div>/i, newCatBox);
      changed = true;
    }

    if (changed) {
      console.log(`Updating product ${prod.id} (${prod.title})...`);
      const updateRes = await fetch(`https://${store}/admin/api/2024-07/products/${prod.id}.json`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': token
        },
        body: JSON.stringify({
          product: {
            id: prod.id,
            body_html: body
          }
        })
      });
      if (updateRes.ok) {
        console.log(`  ✅ Product ${prod.id} updated successfully!`);
      } else {
        console.error(`  ❌ Failed to update ${prod.id}:`, await updateRes.text());
      }
    } else {
      console.log(`Product ${prod.id} (${prod.title}) had no matches or was already updated.`);
    }
  }

  console.log('\nAll products checked and updated!');
}

run().catch(console.error);
