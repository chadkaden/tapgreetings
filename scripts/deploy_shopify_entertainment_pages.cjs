const fs = require('fs');
const path = require('path');

// 1. Load Environment Variables
const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const match = line.trim().match(/^([^=]+)=(.*)$/);
    if (match) process.env[match[1]] = match[2].trim();
  });
}

const greetingsMaster = require('../data/greetings_master.json');
const pinkCards = require('G:/Server/projects/pinkoween/data/cards.json');
const powMapped = require('./pow_mapped_variants.json');

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

// Map variant IDs for Happy Holidays Series 1
const HH_VARIANTS = {
  '001': { variantId: 68065549713730, price: '14.99', name: 'Santa — The Master Artisan' },
  '002': { variantId: 68065549877570, price: '14.99', name: 'Frosty — The Snowbound Joy' },
  '003': { variantId: 68065550303554, price: '14.99', name: 'Rudolph — The Beacon of Light' },
  '004': { variantId: 68065550729538, price: '14.99', name: 'Jack Frost — The Frost Sprite' },
  '005': { variantId: 68065551057218, price: '14.99', name: 'Nutcracker — The Hearth Sentry' },
  '006': { variantId: 68065551352130, price: '14.99', name: 'The Tree — The Evergreen Hearth' },
  '007': { variantId: 68065551614274, price: '14.99', name: 'Snowflake — The Celestial Crystal' },
  '008': { variantId: 68065552204098, price: '14.99', name: 'Gift — The Surprise Box' },
  '009': { variantId: 68065552662850, price: '14.99', name: 'Gingerbread Man — The Sweet Reveler' },
  '010': { variantId: 68065553416514, price: '14.99', name: 'Mrs. Claus — The Hearth Matron' },
  '011': { variantId: 68065553645890, price: '14.99', name: 'Workshop Elf — The Toymaker' },
  '012': { variantId: 68065553940802, price: '14.99', name: 'Polar Bear — The Gentle Giant' },
  '013': { variantId: 68065554661698, price: '14.99', name: 'Penguin — The Ice Dancer' },
  '014': { variantId: 68065555480898, price: '14.99', name: 'Sugar Plum Fairy — The Twilight Sprite' },
  '015': { variantId: 68065556365634, price: '14.99', name: 'Snow Monster — The Frost Guardian' },
  '016': { variantId: 68065557315906, price: '14.99', name: 'Stocking Puppy — The Little Surprise' }
};

const POW_BOX_SET_VARIANT = 67585254555970;

// Common Immersion CSS to hide site header, announcement bar, and theme default H1 title
const IMMERSION_CSS = `
  /* 1. HIDE ALL DEFAULT SHOPIFY THEME HEADERS & NAV ON ENTERTAINMENT PAGES */
  header,
  sticky-header,
  .header-wrapper,
  #shopify-section-header,
  #shopify-section-sections--28819598901570__header_section,
  #shopify-section-sections--28819598901570__header_announcements_9jGBFp,
  [id*="__header_section"],
  [id*="__header_announcements"],
  .announcement-bar,
  header-actions {
    display: none !important;
  }

  /* 2. HIDE DEFAULT THEME PAGE TITLE H1 BLOCK */
  .section-content-wrapper > .text-block:first-child,
  .text-block--AMWl2ZDJIZDFPUjlHU__heading,
  [class*="__heading"]:has(h1),
  .page-header,
  .main-page-title,
  h1.main-page-title {
    display: none !important;
  }

  /* 3. REMOVE EXCESS MARGIN & PADDING ABOVE THE VIDEO HERO */
  #MainContent,
  .section.page-width-content,
  .section-content-wrapper {
    padding-top: 0px !important;
    margin-top: 0px !important;
    --padding-block-start: 0px !important;
  }
`;

// Helper to generate Holiday Card HTML
function generateHolidayCardHtml(card) {
  const code = card.card_code; // '001'
  const vInfo = HH_VARIANTS[code] || { variantId: 68065549713730, price: '14.99' };
  const prevCode = String(card.card_number === 1 ? 16 : card.card_number - 1).padStart(3, '0');
  const nextCode = String(card.card_number === 16 ? 1 : card.card_number + 1).padStart(3, '0');

  const videoUrl = `https://tapgreetings.com/assets/video/${code}-video.mp4`;
  const frontImg = `https://tapgreetings.com/assets/img/cr80/${code}-front.jpg?v=cr80`;
  const backImg = `https://tapgreetings.com/assets/img/cr80/${code}-back.jpg?v=cr80`;

  return `
<style>
  ${IMMERSION_CSS}

  .tghh-experience-wrap {
    font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background: #140C08;
    color: #FFF8E7;
    border-radius: 28px;
    padding: 24px 16px 44px;
    max-width: 680px;
    margin: 0 auto 36px;
    box-shadow: 0 12px 50px rgba(0,0,0,0.7), 0 0 35px rgba(251,191,36,0.18);
    border: 2px solid rgba(251,191,36,0.4);
    position: relative;
    overflow: hidden;
  }
  .tghh-corner {
    position: absolute;
    color: #FBBF24;
    font-size: 14px;
    opacity: 0.85;
    text-shadow: 0 0 8px rgba(251,191,36,0.7);
    user-select: none;
  }
  .tghh-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: linear-gradient(90deg, #9E1B32, #D62839);
    color: #FFFFFF;
    padding: 6px 18px;
    border-radius: 999px;
    font-weight: 800;
    font-size: 0.82rem;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    box-shadow: 0 4px 15px rgba(214,40,57,0.4);
    margin-bottom: 12px;
  }
  .tghh-video-box {
    position: relative;
    width: 100%;
    max-width: 440px;
    margin: 0 auto 16px;
    border-radius: 22px;
    overflow: hidden;
    background: #000;
    aspect-ratio: 9/16;
    border: 2.5px solid #FBBF24;
    box-shadow: 0 10px 40px rgba(0,0,0,0.8), 0 0 25px rgba(251,191,36,0.25);
  }
  .tghh-video-box video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .tghh-sound-btn {
    position: absolute;
    bottom: 14px;
    right: 14px;
    z-index: 10;
    background: rgba(20,12,8,0.85);
    border: 1.5px solid #FBBF24;
    color: #FBBF24;
    border-radius: 50%;
    width: 44px;
    height: 44px;
    font-size: 1.15rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(6px);
  }
  .tghh-card-flip-wrap {
    perspective: 1000px;
    width: 100%;
    max-width: 320px;
    aspect-ratio: 53.98/85.60;
    margin: 16px auto;
    cursor: pointer;
  }
  .tghh-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    transform-style: preserve-3d;
  }
  .tghh-card-flip-wrap.flipped .tghh-card-inner {
    transform: rotateY(180deg);
  }
  .tghh-card-face {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border-radius: 16px;
    overflow: hidden;
    border: 2px solid #FBBF24;
    box-shadow: 0 8px 30px rgba(0,0,0,0.6);
  }
  .tghh-card-face img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .tghh-card-back {
    transform: rotateY(180deg);
  }
  .tghh-quote-box {
    border-left: 4px solid #FBBF24;
    background: rgba(251,191,36,0.08);
    padding: 14px 18px;
    border-radius: 0 14px 14px 0;
    margin: 18px 0;
    font-style: italic;
    color: #FDE68A;
    font-size: 1.05rem;
    line-height: 1.5;
  }
  .tghh-stats-row {
    display: flex;
    justify-content: space-around;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(251,191,36,0.25);
    border-radius: 16px;
    padding: 12px;
    margin: 16px 0;
    text-align: center;
  }
  .tghh-nav-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 14px;
    padding: 0 4px;
    font-size: 0.88rem;
    font-weight: 700;
  }
  .tghh-nav-row a {
    color: #FBBF24;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
  .tghh-order-box {
    margin-top: 28px;
    padding-top: 20px;
    border-top: 1px solid rgba(251,191,36,0.3);
    text-align: center;
  }
  .tghh-atc-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    max-width: 420px;
    background: linear-gradient(90deg, #D62839, #E65100);
    color: #FFFFFF;
    border: none;
    padding: 16px 24px;
    border-radius: 30px;
    font-size: 1.1rem;
    font-weight: 900;
    cursor: pointer;
    box-shadow: 0 6px 25px rgba(214,40,57,0.45);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .tghh-atc-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(214,40,57,0.6);
  }
</style>

<div class="tghh-experience-wrap">
  <div class="tghh-corner" style="top: 14px; left: 16px;">✦</div>
  <div class="tghh-corner" style="top: 14px; right: 16px;">✦</div>
  <div class="tghh-corner" style="bottom: 14px; left: 16px;">✦</div>
  <div class="tghh-corner" style="bottom: 14px; right: 16px;">✦</div>

  <!-- Top Video First (Entertainment Hero) -->
  <div class="tghh-video-box">
    <video id="tghh-video-${code}" loop muted playsinline autoplay poster="${frontImg}">
      <source src="${videoUrl}" type="video/mp4">
    </video>
    <button class="tghh-sound-btn" onclick="tghhToggleSound('${code}')" title="Toggle Sound">
      🔇
    </button>
  </div>

  <!-- Quick Nav -->
  <div class="tghh-nav-row">
    <a href="/pages/tghh${prevCode}">&larr; #${prevCode} Prev Card</a>
    <span style="font-size: 0.8rem; color: #D1BDB0; text-transform: uppercase; letter-spacing: 1px;">
      #${code} of 016
    </span>
    <a href="/pages/tghh${nextCode}">#${nextCode} Next &rarr;</a>
  </div>

  <!-- Header Section -->
  <div style="text-align: center; margin: 20px 0 14px;">
    <div class="tghh-badge">
      ✦ TapGreetings Series 1 &bull; Card #${code} ✦
    </div>
    <h1 style="font-size: 2.2rem; font-weight: 900; color: #FFF; margin: 4px 0 6px; font-family: 'Playfair Display', serif;">
      ${card.character.name}
    </h1>
    <div style="font-size: 1.05rem; color: #FBBF24; font-weight: 700; font-style: italic;">
      ${card.character.title} &bull; ${card.character.craft_style}
    </div>
  </div>

  <!-- Character Motto / Greeting -->
  <div class="tghh-quote-box">
    &ldquo;${card.character.greeting_quote || card.character.greeting_headline}&rdquo;
  </div>

  <!-- Lore & Backstory -->
  <div style="background: rgba(255,255,255,0.03); border-radius: 16px; padding: 16px; margin: 18px 0; font-size: 0.95rem; line-height: 1.65; color: #FFF8E7;">
    <p style="margin: 0 0 10px;">${card.character.lore_backstory || card.character.description}</p>
    <p style="margin: 0; font-size: 0.88rem; color: #D1BDB0;">
      <strong style="color: #FBBF24;">Signature Motif:</strong> ${card.character.signature_motif || 'Handcrafted detail & golden foil.'}
    </p>
  </div>

  <!-- Festive Indicators Stats -->
  <div class="tghh-stats-row">
    <div>
      <div style="font-size: 0.72rem; text-transform: uppercase; color: #FBBF24; font-weight: 800;">Cheer</div>
      <div style="font-size: 0.95rem; color: #FBBF24; margin-top: 2px;">${card.character.indicators?.cheer || '★★★★★'}</div>
    </div>
    <div style="border-left: 1px solid rgba(251,191,36,0.2); height: 28px;"></div>
    <div>
      <div style="font-size: 0.72rem; text-transform: uppercase; color: #FBBF24; font-weight: 800;">Warmth</div>
      <div style="font-size: 0.95rem; color: #FBBF24; margin-top: 2px;">${card.character.indicators?.warmth || '★★★★★'}</div>
    </div>
    <div style="border-left: 1px solid rgba(251,191,36,0.2); height: 28px;"></div>
    <div>
      <div style="font-size: 0.72rem; text-transform: uppercase; color: #FBBF24; font-weight: 800;">Wonder</div>
      <div style="font-size: 0.95rem; color: #FBBF24; margin-top: 2px;">${card.character.indicators?.wonder || '★★★★☆'}</div>
    </div>
  </div>

  <!-- Physical Keepsake 3D Card Flip (Front / Back) -->
  <div style="text-align: center; margin: 24px 0 10px;">
    <div style="font-size: 0.85rem; font-weight: 700; color: #FBBF24; margin-bottom: 6px;">
      🎴 Physical Smart Keepsake Card (Click to Flip Front/Back)
    </div>
    <div class="tghh-card-flip-wrap" onclick="this.classList.toggle('flipped')" title="Click to Flip">
      <div class="tghh-card-inner">
        <div class="tghh-card-face tghh-card-front">
          <img src="${frontImg}" alt="${card.character.name} Front Card" loading="lazy">
        </div>
        <div class="tghh-card-face tghh-card-back">
          <img src="${backImg}" alt="${card.character.name} Back Card & NFC Target" loading="lazy">
        </div>
      </div>
    </div>
    <div style="font-size: 0.75rem; color: #D1BDB0;">
      Standard CR80 30mil Waterproof PVC &bull; Embedded NTAG215 Microchip
    </div>
  </div>

  <!-- Share Keepsake Button -->
  <div style="margin: 22px 0; text-align: center;">
    <button onclick="tghhShareCard('${card.character.name}', '${card.character.title}')" style="background: rgba(255,255,255,0.08); border: 1.5px solid #FBBF24; color: #FBBF24; padding: 12px 24px; border-radius: 20px; font-weight: 800; font-size: 0.95rem; cursor: pointer; display: inline-flex; align-items: center; gap: 8px;">
      ✨ Share Keepsake Experience
    </button>
  </div>

  <!-- Rewritable NFC Feature Info -->
  <div style="background: rgba(251,191,36,0.06); border: 1px solid rgba(251,191,36,0.25); border-radius: 16px; padding: 14px 18px; margin: 20px 0; font-size: 0.85rem; line-height: 1.6; color: #D1BDB0;">
    <strong style="color: #FBBF24;">⚡ Rewritable NFC Microchip:</strong> This physical card comes pre-linked to this exclusive video portal, but can be reprogrammed anytime to link to your own family video, audio note, or custom greeting using our free tool at <a href="/pages/tap-thingy-tools-nfc-reprogram-webtool-and-guide" style="color: #FBBF24; font-weight: 700; text-decoration: underline;">/tools</a>.
  </div>

  <!-- Single Elegant Add to Cart Button at the Bottom -->
  <div class="tghh-order-box">
    <div style="font-size: 0.82rem; color: #4ADE80; font-weight: 700; margin-bottom: 12px;">
      &#10004; In Stock &bull; Collectible Smart Card Ready to Ship
    </div>
    <button class="tghh-atc-btn" onclick="tghhAddToCart(${vInfo.variantId}, this)">
      <span>🛒 Order Physical Keepsake Card &bull; $${vInfo.price}</span>
    </button>
    <div id="tghh-atc-msg-${code}" style="display:none; color: #4ADE80; font-weight: 700; font-size: 0.9rem; margin-top: 10px;">
      ✨ Added to your cart! <a href="/cart" style="color: #FBBF24; text-decoration: underline;">View Cart &rarr;</a>
    </div>
  </div>
</div>

<script>
  function tghhToggleSound(code) {
    var vid = document.getElementById('tghh-video-' + code);
    var btn = event.currentTarget;
    if (!vid) return;
    if (vid.muted) {
      vid.muted = false;
      if (btn) btn.textContent = '🔊';
    } else {
      vid.muted = true;
      if (btn) btn.textContent = '🔇';
    }
  }

  function tghhShareCard(name, title) {
    var shareData = {
      title: name + ' (' + title + ') — TapGreetings Experience',
      text: 'Check out the ' + name + ' smart keepsake card experience from TapGreetings!',
      url: window.location.href
    };
    if (navigator.share) {
      navigator.share(shareData).catch(function(){});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).then(function() {
        alert('Keepsake link copied to clipboard!');
      });
    } else {
      prompt('Share this keepsake link:', window.location.href);
    }
  }

  function tghhAddToCart(variantId, btn) {
    var originalText = btn.innerHTML;
    btn.innerHTML = '<span>⏳ Adding...</span>';
    btn.disabled = true;

    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: variantId, quantity: 1 })
    })
    .then(function(res) { return res.json(); })
    .then(function(item) {
      btn.innerHTML = '<span>✅ Added to Cart!</span>';
      var msg = document.getElementById('tghh-atc-msg-' + '${code}');
      if (msg) msg.style.display = 'block';
      setTimeout(function() {
        btn.innerHTML = originalText;
        btn.disabled = false;
      }, 2500);
    })
    .catch(function(err) {
      btn.innerHTML = originalText;
      btn.disabled = false;
      window.location.href = '/cart/add?id=' + variantId + '&quantity=1';
    });
  }
</script>
`;
}

// Helper to generate Pink-O-Ween Hub & Card HTML
function generatePinkoweenCardHtml(card) {
  const cardId = card.id; // '01'
  const vInfo = powMapped[cardId] || { variantId: 56260398088514, price: '19.99' };
  const num = parseInt(cardId, 10);
  const prevNum = num === 1 ? 31 : num - 1;
  const nextNum = num === 31 ? 1 : num + 1;
  const prevId = String(prevNum).padStart(2, '0');
  const nextId = String(nextNum).padStart(2, '0');

  // Real faststart CDN video and high-res card artwork from pink-o-ween.com
  const videoUrl = `https://pink-o-ween.com/multimedia/videos/card_${cardId}.mp4`;
  const frontImg = `https://pink-o-ween.com/multimedia/cards/card_${cardId}_front.png`;
  const backImg = `https://pink-o-ween.com/multimedia/cards/card_${cardId}_back.png`;

  return `
<style>
  ${IMMERSION_CSS}

  .tgpow-experience-wrap {
    font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background: #0F0510;
    color: #FFF0F5;
    border-radius: 28px;
    padding: 24px 16px 44px;
    max-width: 680px;
    margin: 0 auto 36px;
    box-shadow: 0 12px 50px rgba(0,0,0,0.8), 0 0 35px rgba(255,105,180,0.25);
    border: 2px solid rgba(255,105,180,0.5);
    position: relative;
    overflow: hidden;
  }
  .tgpow-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: linear-gradient(135deg, #FF69B4, #C71585);
    color: #FFFFFF;
    padding: 6px 18px;
    border-radius: 999px;
    font-weight: 800;
    font-size: 0.82rem;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    box-shadow: 0 4px 15px rgba(255,105,180,0.4);
    margin-bottom: 12px;
  }
  .tgpow-video-box {
    position: relative;
    width: 100%;
    max-width: 440px;
    margin: 0 auto 16px;
    border-radius: 22px;
    overflow: hidden;
    background: #000;
    aspect-ratio: 9/16;
    border: 2.5px solid #FF69B4;
    box-shadow: 0 10px 40px rgba(0,0,0,0.8), 0 0 25px rgba(255,105,180,0.3);
  }
  .tgpow-video-box video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .tgpow-sound-btn {
    position: absolute;
    bottom: 14px;
    right: 14px;
    z-index: 10;
    background: rgba(15,5,16,0.85);
    border: 1.5px solid #FF69B4;
    color: #FF69B4;
    border-radius: 50%;
    width: 44px;
    height: 44px;
    font-size: 1.15rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(6px);
  }
  .tgpow-card-flip-wrap {
    perspective: 1000px;
    width: 100%;
    max-width: 320px;
    aspect-ratio: 53.98/85.60;
    margin: 16px auto;
    cursor: pointer;
  }
  .tgpow-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    transform-style: preserve-3d;
  }
  .tgpow-card-flip-wrap.flipped .tgpow-card-inner {
    transform: rotateY(180deg);
  }
  .tgpow-card-face {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border-radius: 16px;
    overflow: hidden;
    border: 2px solid #FF69B4;
    box-shadow: 0 8px 30px rgba(0,0,0,0.6);
  }
  .tgpow-card-face img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .tgpow-card-back {
    transform: rotateY(180deg);
  }
  .tgpow-quote-box {
    border-left: 4px solid #FF69B4;
    background: rgba(255,105,180,0.08);
    padding: 14px 18px;
    border-radius: 0 14px 14px 0;
    margin: 18px 0;
    font-style: italic;
    color: #FFB6C1;
    font-size: 1.05rem;
    line-height: 1.5;
  }
  .tgpow-stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,105,180,0.25);
    border-radius: 16px;
    padding: 14px;
    margin: 16px 0;
  }
  .tgpow-stat-item {
    font-size: 0.85rem;
  }
  .tgpow-stat-label {
    text-transform: uppercase;
    font-size: 0.7rem;
    color: #FF69B4;
    font-weight: 800;
  }
  .tgpow-stat-val {
    font-size: 0.95rem;
    font-weight: 700;
    color: #FFF;
    margin-top: 2px;
  }
  .tgpow-atc-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    max-width: 420px;
    background: linear-gradient(135deg, #FF69B4, #C71585);
    color: #FFFFFF;
    border: none;
    padding: 16px 24px;
    border-radius: 30px;
    font-size: 1.1rem;
    font-weight: 900;
    cursor: pointer;
    box-shadow: 0 6px 25px rgba(255,105,180,0.45);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .tgpow-atc-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(255,105,180,0.6);
  }
</style>

<div class="tgpow-experience-wrap">
  <!-- Top Video First (Entertainment Hero) -->
  <div class="tgpow-video-box">
    <video id="tgpow-video-${cardId}" loop muted playsinline autoplay poster="${frontImg}">
      <source src="${videoUrl}" type="video/mp4">
    </video>
    <button class="tgpow-sound-btn" onclick="tgpowToggleSound('${cardId}')" title="Toggle Sound">
      🔇
    </button>
  </div>

  <!-- Quick Nav (Continuous Looping 01 to 31) -->
  <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 14px; padding: 0 4px; font-size: 0.88rem; font-weight: 700;">
    <a href="/pages/tgpow-${prevId}" style="color: #FF69B4; text-decoration: none;">&larr; #${prevId} Prev</a>
    <a href="/pages/tgpow-s01" style="font-size: 0.8rem; color: #D8B4FE; text-transform: uppercase; letter-spacing: 1px; text-decoration: underline;">
      ${card.headerDisplay || `OCTOBER ${cardId} OF 31`}
    </a>
    <a href="/pages/tgpow-${nextId}" style="color: #FF69B4; text-decoration: none;">#${nextId} Next &rarr;</a>
  </div>

  <!-- Header Section -->
  <div style="text-align: center; margin: 20px 0 14px;">
    <div class="tgpow-badge">
      👻 Pink-O-Ween Series 1 &bull; ${card.rarity || 'Spectrum Common'} 👻
    </div>
    <h1 style="font-size: 2.2rem; font-weight: 900; color: #FFF; margin: 4px 0 8px; font-family: 'Playfair Display', serif;">
      ${card.title}
    </h1>
    <div style="font-size: 1.05rem; color: #FF9EBB; font-weight: 700; font-style: italic;">
      ${card.alias || card.title}
    </div>
  </div>

  <!-- Motto Quote -->
  <div class="tgpow-quote-box">
    &ldquo;${card.mottoQuote || 'Happy Pink-O-Ween!'}&rdquo;
  </div>

  <!-- Lore & Visual Action -->
  <div style="background: rgba(255,255,255,0.03); border-radius: 16px; padding: 16px; margin: 18px 0; font-size: 0.95rem; line-height: 1.65; color: #FFF0F5;">
    <p style="margin: 0 0 10px;">${card.lore || 'An exclusive collectible spectral video experience from Pink-O-Ween.'}</p>
    <p style="margin: 0; font-size: 0.88rem; color: #D8B4FE;">
      <strong style="color: #FF69B4;">Spooky Action:</strong> ${card.visualAction || 'Animated loop with ambient sound.'}
    </p>
  </div>

  <!-- Spectral Stats Grid -->
  <div class="tgpow-stats-grid">
    <div class="tgpow-stat-item">
      <div class="tgpow-stat-label">Spook Rating</div>
      <div class="tgpow-stat-val">${card.spookRating || '15 / 100'}</div>
    </div>
    <div class="tgpow-stat-item">
      <div class="tgpow-stat-label">Sweetness Index</div>
      <div class="tgpow-stat-val">${card.sweetnessIndex || '95 / 100'}</div>
    </div>
    <div class="tgpow-stat-item">
      <div class="tgpow-stat-label">Signature Item</div>
      <div class="tgpow-stat-val" style="font-size:0.82rem;">${card.signatureItem || 'Enchanted Keepsake'}</div>
    </div>
    <div class="tgpow-stat-item">
      <div class="tgpow-stat-label">Special Ability</div>
      <div class="tgpow-stat-val" style="font-size:0.82rem;">${card.specialAbility || 'Pastel Charm'}</div>
    </div>
  </div>

  <!-- Physical Keepsake 3D Card Flip (Front / Back) -->
  <div style="text-align: center; margin: 24px 0 10px;">
    <div style="font-size: 0.85rem; font-weight: 700; color: #FF69B4; margin-bottom: 6px;">
      🎴 Physical Smart Keepsake Card (Click to Flip Front/Back)
    </div>
    <div class="tgpow-card-flip-wrap" onclick="this.classList.toggle('flipped')" title="Click to Flip">
      <div class="tgpow-card-inner">
        <div class="tgpow-card-face tgpow-card-front">
          <img src="${frontImg}" alt="${card.title} Front Card" loading="lazy">
        </div>
        <div class="tgpow-card-face tgpow-card-back">
          <img src="${backImg}" alt="${card.title} Back Collector Design" loading="lazy">
        </div>
      </div>
    </div>
    <div style="font-size: 0.75rem; color: #D8B4FE;">
      Standard CR80 30mil Waterproof PVC &bull; Embedded NTAG215 Microchip
    </div>
  </div>

  <!-- Share Keepsake Button -->
  <div style="margin: 22px 0; text-align: center;">
    <button onclick="tgpowShareCard('${card.title}')" style="background: rgba(255,255,255,0.08); border: 1.5px solid #FF69B4; color: #FF69B4; padding: 12px 24px; border-radius: 20px; font-weight: 800; font-size: 0.95rem; cursor: pointer; display: inline-flex; align-items: center; gap: 8px;">
      ✨ Share Keepsake Experience
    </button>
  </div>

  <!-- Rewritable NFC Feature Info -->
  <div style="background: rgba(255,105,180,0.06); border: 1px solid rgba(255,105,180,0.25); border-radius: 16px; padding: 14px 18px; margin: 20px 0; font-size: 0.85rem; line-height: 1.6; color: #E9D5FF;">
    <strong style="color: #FF69B4;">⚡ Rewritable NFC Microchip:</strong> This physical card comes pre-linked to this exclusive video portal, but can be reprogrammed anytime to link to your own video, social profile, or custom message using our free web tool at <a href="/pages/tap-thingy-tools-nfc-reprogram-webtool-and-guide" style="color: #FF69B4; font-weight: 700; text-decoration: underline;">/tools</a>.
  </div>

  <!-- Single Elegant Add to Cart Button at the Bottom -->
  <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid rgba(255,105,180,0.3); text-align: center;">
    <div style="font-size: 0.82rem; color: #4ADE80; font-weight: 700; margin-bottom: 12px;">
      &#10004; In Stock &bull; Collectible Smart Card Ready to Ship
    </div>
    <button class="tgpow-atc-btn" onclick="tgpowAddToCart(${vInfo.variantId}, this)">
      <span>🛒 Order Physical Keepsake Card &bull; $${vInfo.price || '19.99'}</span>
    </button>
    <div id="tgpow-atc-msg-${cardId}" style="display:none; color: #4ADE80; font-weight: 700; font-size: 0.9rem; margin-top: 10px;">
      ✨ Added to your cart! <a href="/cart" style="color: #FF69B4; text-decoration: underline;">View Cart &rarr;</a>
    </div>
  </div>
</div>

<script>
  function tgpowToggleSound(cardId) {
    var vid = document.getElementById('tgpow-video-' + cardId);
    var btn = event.currentTarget;
    if (!vid) return;
    if (vid.muted) {
      vid.muted = false;
      if (btn) btn.textContent = '🔊';
    } else {
      vid.muted = true;
      if (btn) btn.textContent = '🔇';
    }
  }

  function tgpowShareCard(title) {
    var shareData = {
      title: title + ' — Pink-O-Ween Keepsake Experience',
      text: 'Check out ' + title + ' from Pink-O-Ween Series 1!',
      url: window.location.href
    };
    if (navigator.share) {
      navigator.share(shareData).catch(function(){});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).then(function() {
        alert('Keepsake link copied to clipboard!');
      });
    } else {
      prompt('Share this keepsake link:', window.location.href);
    }
  }

  function tgpowAddToCart(variantId, btn) {
    var originalText = btn.innerHTML;
    btn.innerHTML = '<span>⏳ Adding...</span>';
    btn.disabled = true;

    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: variantId, quantity: 1 })
    })
    .then(function(res) { return res.json(); })
    .then(function(item) {
      btn.innerHTML = '<span>✅ Added to Cart!</span>';
      var msg = document.getElementById('tgpow-atc-msg-' + '${cardId}');
      if (msg) msg.style.display = 'block';
      setTimeout(function() {
        btn.innerHTML = originalText;
        btn.disabled = false;
      }, 2500);
    })
    .catch(function(err) {
      btn.innerHTML = originalText;
      btn.disabled = false;
      window.location.href = '/cart/add?id=' + variantId + '&quantity=1';
    });
  }
</script>
`;
}

// Pink-O-Ween Series 1 Hub Page HTML
function generatePinkoweenHubHtml() {
  return `
<style>
  ${IMMERSION_CSS}

  .tgpow-hub-wrap {
    font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background: #0B040C;
    color: #FFF0F5;
    border-radius: 28px;
    padding: 28px 18px 48px;
    max-width: 900px;
    margin: 0 auto 40px;
    box-shadow: 0 12px 50px rgba(0,0,0,0.8), 0 0 40px rgba(255,105,180,0.3);
    border: 2px solid rgba(255,105,180,0.5);
  }
  .tgpow-hub-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
    margin: 28px 0;
  }
  .tgpow-hub-card {
    background: #18091B;
    border: 1.5px solid rgba(255,105,180,0.35);
    border-radius: 18px;
    overflow: hidden;
    transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
    text-decoration: none;
    color: inherit;
    display: flex;
    flex-direction: column;
  }
  .tgpow-hub-card:hover {
    transform: translateY(-4px);
    border-color: #FF69B4;
    box-shadow: 0 10px 30px rgba(255,105,180,0.35);
  }
  .tgpow-hub-card img {
    width: 100%;
    aspect-ratio: 53.98/85.60;
    object-fit: cover;
    display: block;
  }
  .tgpow-hub-info {
    padding: 14px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
</style>

<div class="tgpow-hub-wrap">
  <div style="text-align: center; margin-bottom: 28px;">
    <div style="display: inline-block; background: linear-gradient(135deg, #FF69B4, #C71585); color: #FFF; font-weight: 800; font-size: 0.82rem; padding: 6px 18px; border-radius: 999px; text-transform: uppercase; letter-spacing: 1.5px; box-shadow: 0 4px 15px rgba(255,105,180,0.4); margin-bottom: 12px;">
      👻 Pink-O-Ween Series 1 Master Archive 👻
    </div>
    <h1 style="font-size: 2.6rem; font-weight: 900; color: #FFF; margin: 0 0 10px; font-family: 'Playfair Display', serif;">
      Pink-O-Ween Series 1 Keepsake Hub
    </h1>
    <p style="font-size: 1.05rem; color: #FFB6C1; max-width: 600px; margin: 0 auto; line-height: 1.6;">
      Tap your Pink-O-Ween smart card to open its video, story, and interactive portal. Explore the entire 31-card coquette spooky collection below!
    </p>
  </div>

  <div class="tgpow-hub-grid">
    ${pinkCards.map(card => {
      const id = card.id;
      const v = powMapped[id] || { price: '19.99' };
      const frontImg = `https://pink-o-ween.com/multimedia/cards/card_${id}_front.png`;
      return `
      <a href="/pages/tgpow-${id}" class="tgpow-hub-card">
        <img src="${frontImg}" alt="${card.title}" loading="lazy">
        <div class="tgpow-hub-info">
          <div>
            <div style="font-size: 0.72rem; color: #FF69B4; font-weight: 800; text-transform: uppercase;">October ${id} of 31</div>
            <div style="font-size: 1.05rem; font-weight: 900; color: #FFF; margin: 4px 0 2px;">${card.title}</div>
            <div style="font-size: 0.8rem; color: #D8B4FE; font-style: italic;">${card.alias || card.title}</div>
          </div>
          <div style="margin-top: 12px; font-size: 0.85rem; font-weight: 800; color: #FF69B4; display: flex; align-items: center; justify-content: space-between;">
            <span>Tap Experience &rarr;</span>
            <span style="color: #4ADE80;">$${v.price || '19.99'}</span>
          </div>
        </div>
      </a>
      `;
    }).join('')}
  </div>

  <div style="text-align: center; margin-top: 36px; padding-top: 24px; border-top: 1px solid rgba(255,105,180,0.3);">
    <a href="https://shop.tapthingy.com/products/nfc-tap-to-video-pvc-greeting-card-pink-o-ween-master-collection" style="display: inline-block; background: linear-gradient(135deg, #FF69B4, #C71585); color: #FFF; text-decoration: none; font-weight: 900; font-size: 1.15rem; padding: 16px 36px; border-radius: 30px; box-shadow: 0 8px 30px rgba(255,105,180,0.45);">
      🎃 Order Complete 31-Card Master Box Set &bull; $399
    </a>
  </div>
</div>
`;
}

async function main() {
  const token = await getAccessToken();
  const store = process.env.SHOPIFY_STORE_DOMAIN;

  console.log('=== Step 1: Fetch Existing Shopify Pages ===');
  const existingPagesRes = await fetch(`https://${store}/admin/api/2024-07/pages.json?limit=250`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const existingPages = (await existingPagesRes.json()).pages || [];
  const pageMap = {};
  existingPages.forEach(p => pageMap[p.handle] = p);
  console.log(`Found ${existingPages.length} existing pages on Shopify.`);

  console.log('\n=== Step 2: Deploy Happy Holidays Series 1 Entertainment Pages (TGHH001 - TGHH016) ===');
  for (const card of greetingsMaster.cards) {
    const handle = `tghh${card.card_code}`; // 'tghh001'
    const title = `#${card.card_code} ${card.character.name} (${card.character.title}) — TapGreetings Keepsake Experience`;
    const bodyHtml = generateHolidayCardHtml(card);

    if (pageMap[handle]) {
      console.log(`Updating existing page: /pages/${handle}...`);
      await fetch(`https://${store}/admin/api/2024-07/pages/${pageMap[handle].id}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
        body: JSON.stringify({ page: { id: pageMap[handle].id, title, body_html: bodyHtml } })
      });
      console.log(`  ✅ /pages/${handle} updated!`);
    } else {
      console.log(`Creating new page: /pages/${handle}...`);
      await fetch(`https://${store}/admin/api/2024-07/pages.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
        body: JSON.stringify({ page: { title, handle, body_html: bodyHtml } })
      });
      console.log(`  ✅ /pages/${handle} created!`);
    }
  }

  console.log('\n=== Step 3: Deploy Pink-O-Ween Hub Page (TGPOW-S01) ===');
  const powHubHandle = 'tgpow-s01';
  const powHubTitle = 'Pink-O-Ween Series 1: The Coquette Spooky Keepsake Experience Hub';
  const powHubHtml = generatePinkoweenHubHtml();

  if (pageMap[powHubHandle]) {
    console.log(`Updating /pages/${powHubHandle}...`);
    await fetch(`https://${store}/admin/api/2024-07/pages/${pageMap[powHubHandle].id}.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
      body: JSON.stringify({ page: { id: pageMap[powHubHandle].id, title: powHubTitle, body_html: powHubHtml } })
    });
    console.log(`  ✅ /pages/${powHubHandle} updated!`);
  } else {
    console.log(`Creating /pages/${powHubHandle}...`);
    await fetch(`https://${store}/admin/api/2024-07/pages.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
      body: JSON.stringify({ page: { title: powHubTitle, handle: powHubHandle, body_html: powHubHtml } })
    });
    console.log(`  ✅ /pages/${powHubHandle} created!`);
  }

  console.log('\n=== Step 4: Deploy All 31 Pink-O-Ween Individual Card Pages (TGPOW-01 to TGPOW-31) ===');
  for (const card of pinkCards) {
    const cardId = card.id; // '01' to '31'
    const handle = `tgpow-${cardId}`; // 'tgpow-01'
    const title = `${card.title} — Pink-O-Ween Series 1 Keepsake Experience`;
    const bodyHtml = generatePinkoweenCardHtml(card);

    if (pageMap[handle]) {
      console.log(`Updating /pages/${handle}...`);
      await fetch(`https://${store}/admin/api/2024-07/pages/${pageMap[handle].id}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
        body: JSON.stringify({ page: { id: pageMap[handle].id, title, body_html: bodyHtml } })
      });
      console.log(`  ✅ /pages/${handle} updated!`);
    } else {
      console.log(`Creating /pages/${handle}...`);
      await fetch(`https://${store}/admin/api/2024-07/pages.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
        body: JSON.stringify({ page: { title, handle, body_html: bodyHtml } })
      });
      console.log(`  ✅ /pages/${handle} created!`);
    }
  }

  console.log('\n=== Step 5: Setup Root URL Redirects ===');
  const redirectsRes = await fetch(`https://${store}/admin/api/2024-07/redirects.json?limit=250`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const existingRedirects = (await redirectsRes.json()).redirects || [];
  const redirectPaths = new Set(existingRedirects.map(r => r.path.toLowerCase()));

  const desiredRedirects = [];

  // Holiday series: TGHH001 through TGHH016
  for (const card of greetingsMaster.cards) {
    const code = card.card_code; // '001'
    desiredRedirects.push({ path: `/TGHH${code}`, target: `/pages/tghh${code}` });
    desiredRedirects.push({ path: `/${code}`, target: `/pages/tghh${code}` });
  }

  // Pink-O-Ween Hub aliases
  desiredRedirects.push({ path: '/TGPOW-S01', target: '/pages/tgpow-s01' });
  desiredRedirects.push({ path: '/TGPOW', target: '/pages/tgpow-s01' });
  desiredRedirects.push({ path: '/pages/pink-o-ween', target: '/pages/tgpow-s01' });
  desiredRedirects.push({ path: '/pink-o-ween', target: '/pages/tgpow-s01' });

  // Pink-O-Ween cards: 01 to 31
  for (const card of pinkCards) {
    const id = card.id;
    desiredRedirects.push({ path: `/TGPOW${id}`, target: `/pages/tgpow-${id}` });
    desiredRedirects.push({ path: `/TGPOW-${id}`, target: `/pages/tgpow-${id}` });
  }

  for (const r of desiredRedirects) {
    if (redirectPaths.has(r.path.toLowerCase())) {
      continue;
    }
    console.log(`Creating redirect: ${r.path} -> ${r.target}...`);
    try {
      const res = await fetch(`https://${store}/admin/api/2024-07/redirects.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
        body: JSON.stringify({ redirect: { path: r.path, target: r.target } })
      });
      const data = await res.json();
      if (res.ok) {
        console.log(`  ✅ Redirect ${r.path} created!`);
        redirectPaths.add(r.path.toLowerCase());
      } else {
        console.log(`  ⚠️ Notice for ${r.path}:`, JSON.stringify(data));
      }
    } catch (e) {
      console.error(`  ❌ Error ${r.path}:`, e.message);
    }
  }

  console.log('\n🎉 ALL ENTERTAINMENT PAGES, MEDIA, & REDIRECTS DEPLOYED SUCCESSFULLY!');
}

main().catch(console.error);
