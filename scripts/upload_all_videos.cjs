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

async function uploadVideos() {
  const token = await getAccessToken();
  const store = process.env.SHOPIFY_STORE_DOMAIN;
  const themeId = 193427177794;

  const masterData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/greetings_master.json'), 'utf8'));
  const cards = masterData.cards || [];

  // Check which assets already exist
  const listRes = await fetch(`https://${store}/admin/api/2024-07/themes/${themeId}/assets.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const listData = await listRes.json();
  const existingAssets = new Set(listData.assets.map(a => a.key));

  console.log(`Checking videos for ${cards.length} cards...`);

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const assetKey = `assets/tapgreeting_${card.card_code}.mp4`;

    if (existingAssets.has(assetKey)) {
      console.log(`[${i + 1}/${cards.length}] ${assetKey} already exists. Skipping.`);
      continue;
    }

    const localVideo = path.join(__dirname, `../assets/video/${card.card_code}-video.mp4`);
    if (!fs.existsSync(localVideo)) {
      console.warn(`[${i + 1}/${cards.length}] ⚠️ File not found: ${localVideo}`);
      continue;
    }

    const sizeMb = (fs.statSync(localVideo).size / 1024 / 1024).toFixed(2);
    console.log(`[${i + 1}/${cards.length}] Uploading ${assetKey} (${sizeMb} MB)...`);

    const base64 = fs.readFileSync(localVideo).toString('base64');
    const putRes = await fetch(`https://${store}/admin/api/2024-07/themes/${themeId}/assets.json`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token
      },
      body: JSON.stringify({
        asset: {
          key: assetKey,
          attachment: base64
        }
      })
    });

    if (!putRes.ok) {
      const err = await putRes.text();
      console.error(` ❌ Upload failed for ${assetKey}:`, err);
    } else {
      const resJson = await putRes.json();
      console.log(` ✅ ${assetKey} uploaded! URL: ${resJson.asset.public_url}`);
    }

    // Rate-limiting delay
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log('\n🎉 Video upload process finished!');
}

uploadVideos().catch(console.error);
