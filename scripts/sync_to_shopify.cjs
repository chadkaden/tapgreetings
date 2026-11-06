const fs = require('fs');
const path = require('path');

const STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || 'tapthingy.myshopify.com';
const API_VERSION = '2024-07';

// Token can be passed via env var or command line argument: node sync_to_shopify.cjs <token>
const ACCESS_TOKEN = process.argv[2] || process.env.SHOPIFY_ADMIN_API_TOKEN || '';

if (!ACCESS_TOKEN) {
  console.log('========================================================================');
  console.log('🛍️ TAPGREETINGS SHOPIFY DIRECT API SYNC TOOL');
  console.log('========================================================================');
  console.log('This script connects directly to Shopify Admin API to automatically:');
  console.log('  1. Create/Update all 16 Series 1 Products (with Front & Back 2K art)');
  console.log('  2. Create Master Collection (Series 1) and 4 Subcollections:');
  console.log('     • Classic Icons, Winter Magic, Hearth & Holiday, Festive Friends');
  console.log('  3. Create 2 Storefront Pages:');
  console.log('     • Series 1 Showcase Page & How NFC Works Guide');
  console.log('\nUsage:');
  console.log('  node scripts/sync_to_shopify.cjs <YOUR_SHOPIFY_ADMIN_TOKEN>');
  console.log('Or:');
  console.log('  $env:SHOPIFY_ADMIN_API_TOKEN="shpat_xxxx"; node scripts/sync_to_shopify.cjs');
  console.log('\nAlternative: You can also use the 1-click CSV import via Shopify Admin:');
  console.log('  • Products: data/tapgreetings_shopify_products.csv');
  console.log('  • Collections: data/shopify_collections.csv');
  console.log('  • Storefront Pages: data/shopify_pages/*.html');
  console.log('========================================================================');
  process.exit(0);
}

const masterData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/greetings_master.json'), 'utf8'));
const cards = masterData.cards || [];

async function shopifyRequest(endpoint, method = 'GET', body = null) {
  const url = `https://${STORE_DOMAIN}/admin/api/${API_VERSION}/${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': ACCESS_TOKEN
    }
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  const res = await fetch(url, options);
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`[${res.status}] ${text}`);
  }
  try {
    return JSON.parse(text);
  } catch (e) {
    return text;
  }
}

async function runSync() {
  console.log(`Connecting to ${STORE_DOMAIN}...`);
  try {
    const shopData = await shopifyRequest('shop.json');
    console.log(`✅ Connected successfully to: "${shopData.shop.name}" (${shopData.shop.domain})`);
  } catch (e) {
    console.error(`❌ Connection failed:`, e.message);
    process.exit(1);
  }

  // 1. Create / Update Smart Collections
  console.log(`\n🏷️ Creating / Verifying Shopify Collections...`);
  const collectionsConfig = [
    {
      title: 'TapGreetings Series 1: The Clay & Needle-Felt Holiday Collection',
      body_html: '<p>The complete 16-card Series 1 holiday collection featuring miniature polymer clay sculptures and needle-felted keepsakes with embedded smartphone NFC video streaming.</p>',
      rules: [{ column: 'tag', relation: 'equals', condition: 'Series 1' }]
    },
    {
      title: 'Series 1 • Classic Icons',
      body_html: '<p>Timeless holiday icons sculpted in warm polymer clay: Santa (#001), Frosty (#002), Rudolph (#003), and Mrs. Claus (#010).</p>',
      rules: [{ column: 'tag', relation: 'equals', condition: 'Classic Icons' }]
    },
    {
      title: 'Series 1 • Winter Magic',
      body_html: '<p>Crystalline, celestial, and enchanted winter spirits: Jack Frost (#004), Snowflake (#007), Sugar Plum Fairy (#014), and Snow Monster / Yeti (#015).</p>',
      rules: [{ column: 'tag', relation: 'equals', condition: 'Winter Magic' }]
    },
    {
      title: 'Series 1 • Hearth & Holiday',
      body_html: '<p>Cozy fireside traditions and sweet treats: Nutcracker (#005), The Tree (#006), Surprise Gift (#008), and Gingerbread Man (#009).</p>',
      rules: [{ column: 'tag', relation: 'equals', condition: 'Hearth & Holiday' }]
    },
    {
      title: 'Series 1 • Festive Friends',
      body_html: '<p>Adorable holiday companions and playful creatures: Workshop Elf (#011), Polar Bear (#012), Penguin (#013), and Stocking Puppy (#016).</p>',
      rules: [{ column: 'tag', relation: 'equals', condition: 'Festive Friends' }]
    }
  ];

  for (const col of collectionsConfig) {
    try {
      const res = await shopifyRequest('smart_collections.json', 'POST', { smart_collection: col });
      console.log(`  ✅ Collection Created: "${col.title}" (ID: ${res.smart_collection.id})`);
    } catch (e) {
      console.log(`  ℹ️ Collection note (${col.title}): ${e.message}`);
    }
  }

  // 2. Create Storefront Pages
  console.log(`\n📄 Creating Shopify Storefront Pages...`);
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

  for (const p of pageFiles) {
    try {
      const filePath = path.join(__dirname, '../data/shopify_pages', p.file);
      if (fs.existsSync(filePath)) {
        const body_html = fs.readFileSync(filePath, 'utf8');
        const res = await shopifyRequest('pages.json', 'POST', {
          page: {
            title: p.title,
            handle: p.handle,
            body_html,
            published: true
          }
        });
        console.log(`  ✅ Storefront Page Created: "${p.title}" (URL: /pages/${p.handle})`);
      }
    } catch (e) {
      console.log(`  ℹ️ Page note (${p.title}): ${e.message}`);
    }
  }

  // 3. Upload / Create Products
  console.log(`\n📦 Uploading 16 Series 1 Products with Dual Images...`);
  let prodSuccess = 0;
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const char = card.character || {};
    const comm = card.commerce || {};
    const seo = card.seo || {};

    const handle = `tapgreeting-series1-${card.card_code}-${card.slug}`;
    const title = `#${card.card_code} ${char.name} (${char.title}) - Smart NFC Video Greeting Card`;
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
      ...(seo.keywords || [])
    ].filter(Boolean).join(', ');

    const frontImg = `https://tapgreetings.com/assets/img/${card.card_code}-front.jpg`;
    const backImg = `https://tapgreetings.com/assets/img/${card.card_code}-back.jpg`;
    const videoUrl = `https://tapgreetings.com/${card.card_code}/`;

    const bodyHtml = `
<div class="tapgreetings-product">
  <p><strong>TapGreetings Series 1 &bull; Card #${card.card_code} of 016</strong></p>
  <h3>${char.name} &mdash; ${char.title}</h3>
  <blockquote style="border-left: 3px solid #FBBF24; padding-left: 10px; font-style: italic;">
    &ldquo;${char.motto}&rdquo;
  </blockquote>
  <p>${char.micro_lore}</p>
  <h4>✨ Product Highlights &amp; Smart Features</h4>
  <ul>
    <li><strong>Dual-Experience Keepsake:</strong> Museum-grade physical collectible card paired with a 1080p stop-motion claymation video experience.</li>
    <li><strong>High-Speed NTAG215 Chip:</strong> Embedded rewritable NFC microchip compatible with all modern smartphones (zero app download required).</li>
    <li><strong>Living Video Web Portal:</strong> Direct link to <a href="${videoUrl}" target="_blank">${videoUrl}</a>.</li>
    <li><strong>CR80 30mil Hardware:</strong> Standard credit-card size waterproof PVC with gold-foil filigree accents.</li>
    <li><strong>Subcollection:</strong> ${subcolName} (TapGreetings Series 1).</li>
  </ul>
</div>
`.trim();

    const productPayload = {
      product: {
        title,
        handle,
        body_html: bodyHtml,
        vendor: 'TapGreetings',
        product_type: 'Smart NFC Greeting Card',
        tags,
        images: [
          { src: frontImg, alt: `${char.name} Front Artwork - Series 1` },
          { src: backImg, alt: `${char.name} Collector Back & NFC Antenna Design` }
        ],
        variants: [
          {
            price: (comm.price || 14.99).toFixed(2),
            compare_at_price: (comm.compare_at_price || 24.99).toFixed(2),
            sku: comm.sku || `TG-S1-${card.card_code}`,
            inventory_management: 'shopify',
            inventory_policy: 'deny',
            requires_shipping: true
          }
        ]
      }
    };

    try {
      console.log(`[${i + 1}/${cards.length}] Uploading #${card.card_code}: ${char.name}...`);
      const res = await shopifyRequest('products.json', 'POST', productPayload);
      console.log(`   ✅ Created Product ID: ${res.product.id}`);
      prodSuccess++;
      await new Promise(r => setTimeout(r, 400));
    } catch (e) {
      console.log(`   ❌ Product note (#${card.card_code}):`, e.message);
    }
  }

  console.log(`\n🎉 Shopify Sync Completed! Successfully uploaded ${prodSuccess}/${cards.length} products to ${STORE_DOMAIN}.`);
}

runSync();
