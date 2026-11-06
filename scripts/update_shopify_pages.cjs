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

async function updatePages() {
  const token = await getAccessToken();
  const store = process.env.SHOPIFY_STORE_DOMAIN;
  const version = '2024-07';

  const pagesRes = await fetch(`https://${store}/admin/api/${version}/pages.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const { pages } = await pagesRes.json();
  const pagesByHandle = new Map(pages.map(p => [p.handle, p]));

  const files = [
    { handle: 'tapgreetings-series-1', file: 'series-1-holiday-keepsakes.html', title: 'TapGreetings Series 1: The Clay & Needle-Felt Holiday Collection' },
    { handle: 'how-tapgreetings-nfc-works', file: 'how-it-works-nfc.html', title: 'How TapGreetings NFC Smart Cards Work' }
  ];

  for (const item of files) {
    const existing = pagesByHandle.get(item.handle);
    if (!existing) {
      console.warn(`Page not found for handle: ${item.handle}`);
      continue;
    }
    const htmlPath = path.join(__dirname, '../data/shopify_pages', item.file);
    const body_html = fs.readFileSync(htmlPath, 'utf8');

    console.log(`Updating page "${existing.title}" (ID: ${existing.id})...`);
    const updateRes = await fetch(`https://${store}/admin/api/${version}/pages/${existing.id}.json`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token
      },
      body: JSON.stringify({
        page: {
          id: existing.id,
          title: item.title,
          body_html,
          published: true
        }
      })
    });

    if (updateRes.ok) {
      console.log(` ✅ Updated page "${item.handle}" successfully!`);
    } else {
      console.error(` ❌ Failed to update page "${item.handle}":`, await updateRes.text());
    }
  }
}

updatePages().catch(console.error);
