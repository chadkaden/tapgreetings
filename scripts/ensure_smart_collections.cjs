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

async function ensureSmartCollection(title, handle, ruleTag) {
  const token = await getAccessToken();
  const store = process.env.SHOPIFY_STORE_DOMAIN;
  const version = '2024-07';

  const res = await fetch(`https://${store}/admin/api/${version}/smart_collections.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const { smart_collections } = await res.json();
  const existing = smart_collections.find(c => c.handle === handle);
  if (existing) {
    console.log(`Smart collection already exists: ${handle} (ID: ${existing.id})`);
    return existing.id;
  }

  console.log(`Creating smart collection: ${title} (${handle})...`);
  const createRes = await fetch(`https://${store}/admin/api/${version}/smart_collections.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      smart_collection: {
        title,
        handle,
        rules: [
          {
            column: 'tag',
            relation: 'equals',
            condition: ruleTag
          }
        ]
      }
    })
  });

  const created = await createRes.json();
  console.log(` ✅ Created smart collection: ${created.smart_collection.title} (ID: ${created.smart_collection.id})`);
  return created.smart_collection.id;
}

async function main() {
  await ensureSmartCollection('Draft Series: The Original Concept Edition', 'draft-series', 'Draft Series');
  await ensureSmartCollection('Pink-O-Ween: The Complete Haunted Collection', 'pink-o-ween-collection', 'Pink-O-Ween');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
