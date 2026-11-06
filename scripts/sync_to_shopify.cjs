const fs = require('fs');
const path = require('path');

// Auto-load .env if present
const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const match = line.trim().match(/^([^=]+)=(.*)$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].trim();
    }
  });
}

const STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || 'tapthingy.myshopify.com';
const API_VERSION = '2024-07';
const CLIENT_ID = process.env.SHOPIFY_CLIENT_ID || '';
const CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET || '';

let cachedToken = process.env.SHOPIFY_ADMIN_API_TOKEN || null;

async function getAccessToken() {
  if (cachedToken) return cachedToken;
  console.log('🔑 Authenticating via Shopify Client Credentials...');
  const res = await fetch(`https://${STORE_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials'
    })
  });
  const data = await res.json();
  if (!data.access_token) {
    throw new Error('Failed to obtain access token: ' + JSON.stringify(data));
  }
  cachedToken = data.access_token;
  console.log('✅ Access Token obtained successfully.');
  return cachedToken;
}

async function shopifyRequest(endpoint, method = 'GET', body = null, retries = 3) {
  const token = await getAccessToken();
  const url = `https://${STORE_DOMAIN}/admin/api/${API_VERSION}/${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    }
  };
  if (body) {
    options.body = JSON.stringify(body);
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, options);
      const text = await res.text();
      if (res.status === 429) {
        console.warn(`   ⚠️ Rate limit reached (429). Retrying in 3s (attempt ${attempt}/${retries})...`);
        await new Promise(r => setTimeout(r, 3000));
        continue;
      }
      if (!res.ok) {
        throw new Error(`[${res.status}] ${text}`);
      }
      try {
        return JSON.parse(text);
      } catch (e) {
        return text;
      }
    } catch (err) {
      if (attempt === retries) throw err;
      console.warn(`   ⚠️ Request error: ${err.message}. Retrying in 2s...`);
      await new Promise(r => setTimeout(r, 2000));
    }
  }
}

async function runSync() {
  console.log('========================================================================');
  console.log(`🛍️ TAPGREETINGS SHOPIFY DIRECT SYNC ENGINE`);
  console.log(`Connecting to: ${STORE_DOMAIN}`);
  console.log('========================================================================');

  const shopData = await shopifyRequest('shop.json');
  console.log(`✅ Connected to Store: "${shopData.shop.name}" (${shopData.shop.domain})`);

  // --- Step 1: Ensure Collections Exist ---
  console.log(`\n🏷️ [1/3] Verifying Smart Collections...`);
  const collectionsConfig = [
    {
      title: 'TapGreetings Series 1: The Clay & Needle-Felt Holiday Collection',
      handle: 'tapgreetings-series-1',
      body_html: '<p>The complete 16-card Series 1 holiday collection featuring miniature polymer clay sculptures and needle-felted keepsakes with embedded smartphone NFC video streaming.</p>',
      sort_order: 'manual',
      rules: [{ column: 'tag', relation: 'equals', condition: 'Series 1' }]
    },
    {
      title: 'Series 1 • Classic Icons',
      handle: 'series-1-classic-icons',
      body_html: '<p>Timeless holiday icons sculpted in warm polymer clay: Santa (#001), Frosty (#002), Rudolph (#003), and Mrs. Claus (#010).</p>',
      sort_order: 'manual',
      rules: [{ column: 'tag', relation: 'equals', condition: 'Classic Icons' }]
    },
    {
      title: 'Series 1 • Winter Magic',
      handle: 'series-1-winter-magic',
      body_html: '<p>Crystalline, celestial, and enchanted winter spirits: Jack Frost (#004), Snowflake (#007), Sugar Plum Fairy (#014), and Snow Monster / Yeti (#015).</p>',
      sort_order: 'manual',
      rules: [{ column: 'tag', relation: 'equals', condition: 'Winter Magic' }]
    },
    {
      title: 'Series 1 • Hearth & Holiday',
      handle: 'series-1-hearth-holiday',
      body_html: '<p>Cozy fireside traditions and sweet treats: Nutcracker (#005), The Tree (#006), Surprise Gift (#008), and Gingerbread Man (#009).</p>',
      sort_order: 'manual',
      rules: [{ column: 'tag', relation: 'equals', condition: 'Hearth & Holiday' }]
    },
    {
      title: 'Series 1 • Festive Friends',
      handle: 'series-1-festive-friends',
      body_html: '<p>Adorable holiday companions and playful creatures: Workshop Elf (#011), Polar Bear (#012), Penguin (#013), and Stocking Puppy (#016).</p>',
      sort_order: 'manual',
      rules: [{ column: 'tag', relation: 'equals', condition: 'Festive Friends' }]
    }
  ];

  const smartColsData = await shopifyRequest('smart_collections.json?limit=50');
  const existingCols = new Map();
  smartColsData.smart_collections.forEach(c => existingCols.set(c.handle, c));

  for (const col of collectionsConfig) {
    if (existingCols.has(col.handle)) {
      console.log(`  ✓ Smart Collection already active: "${col.title}" (ID: ${existingCols.get(col.handle).id})`);
    } else {
      try {
        const res = await shopifyRequest('smart_collections.json', 'POST', { smart_collection: col });
        console.log(`  ✅ Created Smart Collection: "${col.title}" (ID: ${res.smart_collection.id})`);
      } catch (e) {
        console.error(`  ❌ Error creating collection ${col.title}:`, e.message);
      }
    }
  }

  // --- Step 2: Ensure Storefront Pages Exist ---
  console.log(`\n📄 [2/3] Verifying Storefront Pages...`);
  const pageFiles = [
    {
      title: 'TapGreetings Series 1: The Clay & Needle-Felt Holiday Collection',
      handle: 'tapgreetings-series-1',
      file: 'series-1-holiday-keepsakes.html'
    },
    {
      title: 'How TapGreetings NFC Smart Cards Work',
      handle: 'how-tapgreetings-nfc-works',
      file: 'how-it-works-nfc.html'
    }
  ];

  const pagesData = await shopifyRequest('pages.json?limit=50');
  const existingPages = new Map();
  pagesData.pages.forEach(p => existingPages.set(p.handle, p));

  for (const p of pageFiles) {
    if (existingPages.has(p.handle)) {
      console.log(`  ✓ Page already active: "${p.title}" (/pages/${p.handle})`);
    } else {
      const filePath = path.join(__dirname, '../data/shopify_pages', p.file);
      if (fs.existsSync(filePath)) {
        const body_html = fs.readFileSync(filePath, 'utf8');
        try {
          const res = await shopifyRequest('pages.json', 'POST', {
            page: {
              title: p.title,
              handle: p.handle,
              body_html,
              published: true
            }
          });
          console.log(`  ✅ Created Page: "${p.title}" (ID: ${res.page.id})`);
        } catch (e) {
          console.error(`  ❌ Error creating page ${p.title}:`, e.message);
        }
      }
    }
  }

  // --- Step 3: Fetch Existing Products & Upload Cards ---
  console.log(`\n📦 [3/3] Uploading 16 Series 1 Products with 2K Front & Back Artwork...`);
  const masterData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/greetings_master.json'), 'utf8'));
  const cards = masterData.cards || [];

  // Query existing products
  const existingProdsData = await shopifyRequest('products.json?limit=250');
  const prodsByCode = new Map();
  existingProdsData.products.forEach(p => {
    // Check if title or handle matches #001 or card-001
    const match = p.title.match(/#(\d{3})/);
    if (match) {
      prodsByCode.set(match[1], p);
    }
  });

  const syncResults = [];

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const char = card.character || {};
    const comm = card.commerce || {};
    const seo = card.seo || {};

    const handle = `tapgreeting-series1-${card.card_code}-${card.slug}`;
    const title = `#${card.card_code} ${char.name} (${char.title}) - Smart NFC Video Keepsake Card`;
    const subcolName = card.subcollection || 'Classic Icons';
    const subcolHandle = card.subcollection_handle || 'classic-icons';

    const tags = [
      'TapGreetings',
      'Series 1',
      'series-1',
      'Holiday 2026',
      subcolName,
      `subcollection:${subcolHandle}`,
      `card-${card.card_code}`,
      `#${card.card_code}`,
      char.name,
      char.title,
      'Smart NFC Card',
      'Living Keepsake',
      'Polymer Clay',
      'Needle Felt',
      'CR80 PVC',
      'NTAG215',
      'Christmas',
      'Holiday',
      'Greeting Card',
      'Collectibles',
      ...(seo.keywords || [])
    ].filter(Boolean).join(', ');

    const videoPortalUrl = `https://tapgreetings.com/${card.card_code}/`;

    const indicatorsHtml = Object.entries(char.indicators || {})
      .map(([k, v]) => `<li><strong>${k.charAt(0).toUpperCase() + k.slice(1)}:</strong> ${v}</li>`)
      .join('');

    const bodyHtml = `
<div class="tapgreetings-product" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6;">
  <p style="color: #9E1B32; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; font-size: 12px; margin-bottom: 4px;">
    TapGreetings Series 1 &bull; Card #${card.card_code} of 016 &bull; ${subcolName}
  </p>
  <h2 style="margin-top: 0; color: #1E130D;">${char.name} &mdash; ${char.title}</h2>
  
  <blockquote style="border-left: 4px solid #FBBF24; margin: 16px 0; padding: 10px 16px; background: #FFFDF7; font-style: italic; color: #5C3214; font-size: 15px;">
    &ldquo;${char.motto}&rdquo;
  </blockquote>

  <p style="color: #4A3326; font-size: 14px;">
    ${char.micro_lore}
  </p>

  <h3 style="color: #1E130D; margin-top: 24px; font-size: 17px;">✨ Festive Indicators</h3>
  <ul style="color: #5C3214; font-size: 14px; padding-left: 20px;">
    ${indicatorsHtml}
  </ul>

  <h3 style="color: #1E130D; margin-top: 24px; font-size: 17px;">📱 Smart NFC Keepsake Features</h3>
  <ul style="color: #4A3326; font-size: 14px; padding-left: 20px; line-height: 1.7;">
    <li><strong>Dual-Experience Keepsake:</strong> Physical collectible trading card crafted in high-definition polymer clay & needle-felt texture, paired with an instant 1080p motion video greeting.</li>
    <li><strong>Embedded NTAG215 Microchip:</strong> Built-in rewritable high-speed NFC antenna. Works instantly with all modern iPhone and Android devices—zero app installation needed!</li>
    <li><strong>Tap-to-Stream Portal:</strong> Tapping the card opens <a href="${videoPortalUrl}" target="_blank" style="color: #9E1B32; font-weight: 700;">${videoPortalUrl}</a> featuring full-screen holiday animation and voice blessings.</li>
    <li><strong>Museum-Grade Hardware:</strong> Standard CR80 30mil waterproof PVC (standard credit card dimensions: 85.6mm &times; 53.98mm) with gold-foil filigree borders and collector back layout.</li>
    <li><strong>Subcollection:</strong> Part of the 4-card <em>${subcolName}</em> set within TapGreetings Series 1.</li>
  </ul>

  <div style="background: #FFF8E7; border: 1px solid #FDE68A; border-radius: 12px; padding: 14px 18px; margin-top: 24px;">
    <p style="margin: 0; font-size: 13px; color: #92400E;">
      🏷️ <strong>Category:</strong> Arts &amp; Entertainment &gt; Party &amp; Celebration &gt; Gift Giving &gt; Greeting Cards
    </p>
  </div>
</div>
`.trim();

    // Read local images for base64 upload
    const frontImgPath = path.join(__dirname, `../assets/img/${card.card_code}-front.jpg`);
    const backImgPath = path.join(__dirname, `../assets/img/${card.card_code}-back.jpg`);

    let existingProduct = prodsByCode.get(card.card_code);
    let productId = null;

    if (existingProduct) {
      console.log(`\n[${i + 1}/${cards.length}] Card #${card.card_code} (${char.name}) already exists (ID: ${existingProduct.id}). Updating metadata...`);
      productId = existingProduct.id;

      // Update product metadata & tags
      await shopifyRequest(`products/${productId}.json`, 'PUT', {
        product: {
          id: productId,
          title,
          body_html: bodyHtml,
          tags,
          product_type: 'Smart NFC Greeting Card',
          vendor: 'TapGreetings',
          status: 'active'
        }
      });
      console.log(`   ✓ Metadata updated.`);
    } else {
      console.log(`\n[${i + 1}/${cards.length}] Creating Card #${card.card_code}: ${char.name}...`);
      
      const frontBase64 = fs.existsSync(frontImgPath) ? fs.readFileSync(frontImgPath).toString('base64') : null;
      
      const createPayload = {
        product: {
          title,
          handle,
          body_html: bodyHtml,
          vendor: 'TapGreetings',
          product_type: 'Smart NFC Greeting Card',
          tags,
          status: 'active',
          variants: [
            {
              price: (comm.price || 14.99).toFixed(2),
              compare_at_price: (comm.compare_at_price || 24.99).toFixed(2),
              sku: comm.sku || `TG-S1-${card.card_code}`,
              inventory_management: 'shopify',
              inventory_policy: 'continue',
              requires_shipping: true
            }
          ]
        }
      };

      if (frontBase64) {
        createPayload.product.images = [
          {
            attachment: frontBase64,
            filename: `${card.card_code}-front.jpg`,
            alt: `${char.name} Front Artwork - Series 1 Smart NFC Keepsake Card`
          }
        ];
      }

      const created = await shopifyRequest('products.json', 'POST', createPayload);
      productId = created.product.id;
      existingProduct = created.product;
      console.log(`   ✅ Product Created! ID: ${productId}`);
    }

    // Check images count for product
    const currentProd = await shopifyRequest(`products/${productId}.json`);
    const imgCount = currentProd.product.images ? currentProd.product.images.length : 0;
    console.log(`   📸 Product has ${imgCount} image(s).`);

    // If back image is missing (or less than 2 images), upload back image
    if (imgCount < 2 && fs.existsSync(backImgPath)) {
      console.log(`   ⬆️ Uploading collector back image (${(fs.statSync(backImgPath).size / 1024 / 1024).toFixed(2)} MB)...`);
      const backBase64 = fs.readFileSync(backImgPath).toString('base64');
      const imgRes = await shopifyRequest(`products/${productId}/images.json`, 'POST', {
        image: {
          attachment: backBase64,
          filename: `${card.card_code}-back.jpg`,
          alt: `${char.name} Collector Back & NFC Antenna Design - Series 1`
        }
      });
      console.log(`   ✅ Back image attached: ${imgRes.image.src}`);
    }

    syncResults.push({
      card_code: card.card_code,
      name: char.name,
      subcollection: subcolName,
      product_id: productId,
      url: `https://${STORE_DOMAIN}/products/${existingProduct ? existingProduct.handle : handle}`
    });

    // Pacing pause to remain well within API rate limit
    await new Promise(r => setTimeout(r, 600));
  }

  console.log('\n========================================================================');
  console.log('🎉 ALL 16 SERIES 1 PRODUCTS SUCCESSFULLY SYNCED TO SHOPIFY!');
  console.log('========================================================================');
  console.table(syncResults);

  // Save report to data/shopify_sync_report.json
  const reportPath = path.join(__dirname, '../data/shopify_sync_report.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    synced_at: new Date().toISOString(),
    store: STORE_DOMAIN,
    total_products: syncResults.length,
    products: syncResults
  }, null, 2));
  console.log(`\nSaved sync report to: ${reportPath}`);
}

runSync().catch(err => {
  console.error('\n❌ Fatal Sync Error:', err);
  process.exit(1);
});
