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

const holidayOfficial = require('../data/holiday_series_official.json');
const pinkCards = require('G:/Server/projects/pinkoween/data/cards.json');
const powMapped = require('./pow_mapped_variants.json');
const holidayMapped = require('./holiday_mapped_products.json');

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

// Common Immersion CSS: Hides header, announcement bar, and theme default H1 title
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

// Helper to generate Holiday Card HTML with exciting animated Motto, Indicators, Abilities, and Sonar NFC
function generateHolidayCardHtml(code) {
  const card = holidayOfficial[code];
  const pInfo = holidayMapped[code] || { variantId: 68065549713730, price: '14.99' };
  const num = parseInt(code, 10);
  const prevNum = num === 1 ? 16 : num - 1;
  const nextNum = num === 16 ? 1 : num + 1;
  const prevCode = String(prevNum).padStart(3, '0');
  const nextCode = String(nextNum).padStart(3, '0');

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
    width: 46px;
    height: 46px;
    font-size: 1.25rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(6px);
    transition: transform 0.2s, background 0.2s;
  }
  .tghh-sound-btn:hover {
    transform: scale(1.1);
    background: rgba(251,191,36,0.2);
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
    transition: transform 0.15s;
  }
  .tghh-nav-row a:hover {
    transform: scale(1.04);
  }

  /* EXCITING ANIMATED MOTTO / QUOTE CARD */
  .tghh-quote-card {
    position: relative;
    background: radial-gradient(circle at 50% 0%, rgba(251,191,36,0.18), rgba(20,12,8,0.95) 75%);
    border: 1.5px solid rgba(251,191,36,0.5);
    border-radius: 20px;
    padding: 24px 20px 20px;
    margin: 24px 0 20px;
    text-align: center;
    box-shadow: 0 0 25px rgba(251,191,36,0.2), inset 0 0 20px rgba(251,191,36,0.06);
    overflow: visible;
    animation: quoteGlowPulse 4s infinite alternate ease-in-out;
  }
  @keyframes quoteGlowPulse {
    0% {
      border-color: rgba(251,191,36,0.4);
      box-shadow: 0 0 20px rgba(251,191,36,0.15), inset 0 0 15px rgba(251,191,36,0.04);
    }
    100% {
      border-color: rgba(251,191,36,0.85);
      box-shadow: 0 0 35px rgba(251,191,36,0.38), 0 0 15px rgba(214,40,57,0.3), inset 0 0 25px rgba(251,191,36,0.12);
    }
  }
  .tghh-quote-badge {
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(90deg, #9E1B32, #D62839, #F59E0B);
    background-size: 200% auto;
    animation: shimmerGold 3s linear infinite;
    color: #FFF;
    font-size: 0.72rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 2px;
    padding: 3px 18px;
    border-radius: 999px;
    box-shadow: 0 3px 12px rgba(214,40,57,0.5);
    white-space: nowrap;
  }
  @keyframes shimmerGold {
    0% { background-position: 0% 50%; }
    100% { background-position: 200% 50%; }
  }
  .tghh-quote-text {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1.18rem;
    line-height: 1.55;
    font-style: italic;
    font-weight: 700;
    background: linear-gradient(135deg, #FFFFFF 0%, #FFF8E7 40%, #FDE68A 70%, #FBBF24 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 2px 15px rgba(251,191,36,0.3);
    margin: 8px 0 0;
  }

  /* ANIMATED SPECIAL ABILITIES & FEATURES CARD */
  .tghh-ability-card {
    background: linear-gradient(135deg, rgba(214,40,57,0.14), rgba(251,191,36,0.06));
    border: 1px solid rgba(251,191,36,0.35);
    border-left: 4px solid #D62839;
    border-radius: 16px;
    padding: 15px 18px;
    margin: 18px 0;
    position: relative;
    box-shadow: 0 4px 20px rgba(0,0,0,0.4);
    text-align: left;
  }
  .tghh-ability-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.78rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: #FBBF24;
    margin-bottom: 6px;
  }
  .tghh-ability-pulse-icon {
    display: inline-block;
    animation: iconPulse 1.8s infinite ease-in-out;
  }
  @keyframes iconPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.3); filter: drop-shadow(0 0 6px #FBBF24); }
  }

  /* ANIMATED NFC TAP TARGET MOTIF CARD */
  .tghh-nfc-motif-card {
    background: linear-gradient(135deg, rgba(251,191,36,0.08), rgba(20,12,8,0.7));
    border: 1.5px dashed rgba(251,191,36,0.45);
    border-radius: 16px;
    padding: 14px 18px;
    margin: 18px 0;
    display: flex;
    align-items: center;
    gap: 14px;
    text-align: left;
  }
  .tghh-nfc-ripple-icon {
    position: relative;
    width: 44px;
    height: 44px;
    min-width: 44px;
    border-radius: 50%;
    background: rgba(251,191,36,0.15);
    border: 1.5px solid #FBBF24;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    color: #FBBF24;
  }
  .tghh-nfc-ripple-icon::after {
    content: '';
    position: absolute;
    inset: -6px;
    border-radius: 50%;
    border: 1.5px solid #FBBF24;
    opacity: 0;
    animation: rippleSonar 2.2s infinite cubic-bezier(0, 0.2, 0.8, 1);
  }
  @keyframes rippleSonar {
    0% { transform: scale(0.85); opacity: 0.9; }
    100% { transform: scale(1.6); opacity: 0; }
  }

  /* ANIMATED FESTIVE INDICATORS / RATINGS */
  .tghh-indicators-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin: 18px 0;
  }
  .tghh-stat-tile {
    background: rgba(255,255,255,0.035);
    border: 1px solid rgba(251,191,36,0.25);
    border-radius: 14px;
    padding: 10px 8px 12px;
    text-align: center;
    position: relative;
    overflow: hidden;
    transition: transform 0.2s, border-color 0.2s;
  }
  .tghh-stat-tile:hover {
    transform: translateY(-2px);
    border-color: #FBBF24;
  }
  .tghh-stat-name {
    font-size: 0.72rem;
    text-transform: uppercase;
    font-weight: 800;
    color: #FBBF24;
    letter-spacing: 1px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .tghh-star-row {
    display: inline-flex;
    gap: 2px;
    margin: 4px 0 6px;
  }
  .tghh-star-anim {
    display: inline-block;
    font-size: 0.95rem;
    color: #FBBF24;
    filter: drop-shadow(0 0 2px rgba(251,191,36,0.6));
    animation: starTwinkle 2.4s infinite ease-in-out;
  }
  .tghh-star-anim:nth-child(1) { animation-delay: 0.1s; }
  .tghh-star-anim:nth-child(2) { animation-delay: 0.25s; }
  .tghh-star-anim:nth-child(3) { animation-delay: 0.4s; }
  .tghh-star-anim:nth-child(4) { animation-delay: 0.55s; }
  .tghh-star-anim:nth-child(5) { animation-delay: 0.7s; }
  @keyframes starTwinkle {
    0%, 100% { transform: scale(1); filter: drop-shadow(0 0 2px rgba(251,191,36,0.5)); }
    50% { transform: scale(1.22); color: #FFF; filter: drop-shadow(0 0 7px rgba(251,191,36,1)); }
  }
  .tghh-meter-bg {
    width: 100%;
    height: 4px;
    background: rgba(255,255,255,0.08);
    border-radius: 999px;
    overflow: hidden;
  }
  .tghh-meter-fill {
    height: 100%;
    background: linear-gradient(90deg, #D62839, #F59E0B);
    border-radius: 999px;
    box-shadow: 0 0 8px #F59E0B;
  }

  /* 3D KEEPSAKE CARD FLIP */
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

  <!-- Quick Nav with Audio State Preservation -->
  <div class="tghh-nav-row">
    <a href="/pages/tghh${prevCode}" onclick="preserveAudio(this, event, '/pages/tghh${prevCode}')">&larr; #${prevCode} Prev Card</a>
    <span style="font-size: 0.8rem; color: #D1BDB0; text-transform: uppercase; letter-spacing: 1px;">
      #${code} of 016
    </span>
    <a href="/pages/tghh${nextCode}" onclick="preserveAudio(this, event, '/pages/tghh${nextCode}')">#${nextCode} Next &rarr;</a>
  </div>

  <!-- Header Section -->
  <div style="text-align: center; margin: 20px 0 14px;">
    <div class="tghh-badge">
      ✦ TapGreetings &bull; Card #${code} ✦
    </div>
    <h1 style="font-size: 2.2rem; font-weight: 900; color: #FFF; margin: 4px 0 6px; font-family: 'Playfair Display', serif;">
      ${card.name}
    </h1>
    <div style="font-size: 1.05rem; color: #FBBF24; font-weight: 700; font-style: italic;">
      ${card.title}
    </div>
    <div style="font-size: 0.78rem; color: #D1BDB0; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 4px;">
      ${card.series}
    </div>
  </div>

  <!-- EXCITING ANIMATED MOTTO / LIVING CREED -->
  <div class="tghh-quote-card">
    <span class="tghh-quote-badge">✨ Official Keepsake Motto ✨</span>
    <div class="tghh-quote-text">
      <span class="tghh-quote-mark">&ldquo;</span>${card.motto}<span class="tghh-quote-mark">&rdquo;</span>
    </div>
  </div>

  <!-- ANIMATED SPECIAL ABILITIES & FEATURES -->
  <div class="tghh-ability-card">
    <div class="tghh-ability-header">
      <span class="tghh-ability-pulse-icon">⚡</span>
      <span>Special Abilities &amp; Features</span>
    </div>
    <div style="font-size: 0.95rem; line-height: 1.6; color: #FFF8E7;">
      ${card.abilities}
    </div>
  </div>

  <!-- ANIMATED NFC TAP TARGET MOTIF -->
  <div class="tghh-nfc-motif-card">
    <div class="tghh-nfc-ripple-icon">
      <i class="fa-solid fa-satellite-dish"></i>
    </div>
    <div>
      <div style="font-size: 0.75rem; font-weight: 800; color: #FBBF24; text-transform: uppercase; letter-spacing: 1.2px;">
        NFC Tap Target Motif
      </div>
      <div style="font-size: 0.92rem; color: #FFF8E7; font-weight: 600; margin-top: 2px;">
        ${card.nfcMotif}
      </div>
    </div>
  </div>

  <!-- ANIMATED FESTIVE INDICATORS -->
  <div style="margin: 22px 0 10px;">
    <div style="font-size: 0.8rem; font-weight: 800; text-transform: uppercase; color: #FBBF24; letter-spacing: 1.5px; margin-bottom: 8px; text-align: center;">
      ✦ Festive Indicators &bull; Holiday Power Stats ✦
    </div>
    <div class="tghh-indicators-grid">
      ${card.indicators.map(ind => `
      <div class="tghh-stat-tile">
        <div class="tghh-stat-name">${ind.name}</div>
        <div class="tghh-star-row">
          <span class="tghh-star-anim">★</span>
          <span class="tghh-star-anim">★</span>
          <span class="tghh-star-anim">★</span>
          <span class="tghh-star-anim">★</span>
          <span class="tghh-star-anim">${ind.score >= 5 ? '★' : '☆'}</span>
        </div>
        <div class="tghh-meter-bg">
          <div class="tghh-meter-fill" style="width: ${ind.score * 20}%;"></div>
        </div>
      </div>
      `).join('')}
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
          <img src="${frontImg}" alt="${card.name} Front Card" loading="lazy">
        </div>
        <div class="tghh-card-face tghh-card-back">
          <img src="${backImg}" alt="${card.name} Back Card & NFC Target" loading="lazy">
        </div>
      </div>
    </div>
    <div style="font-size: 0.75rem; color: #D1BDB0;">
      Standard CR80 30mil Waterproof PVC &bull; Embedded NTAG215 Microchip
    </div>
  </div>

  <!-- Share Keepsake Button -->
  <div style="margin: 22px 0; text-align: center;">
    <button onclick="tghhShareCard('${card.name}', '${card.title}')" style="background: rgba(255,255,255,0.08); border: 1.5px solid #FBBF24; color: #FBBF24; padding: 12px 24px; border-radius: 20px; font-weight: 800; font-size: 0.95rem; cursor: pointer; display: inline-flex; align-items: center; gap: 8px;">
      ✨ Share Keepsake Experience
    </button>
  </div>

  <!-- Rewritable NFC Feature Info -->
  <div style="background: rgba(251,191,36,0.06); border: 1px solid rgba(251,191,36,0.25); border-radius: 16px; padding: 14px 18px; margin: 20px 0; font-size: 0.85rem; line-height: 1.6; color: #D1BDB0;">
    <strong style="color: #FBBF24;">⚡ Rewritable NFC Microchip:</strong> This physical card comes pre-linked to this exclusive video portal, but can be reprogrammed anytime to link to your own family video, audio note, or custom greeting using our free tool at <a href="/pages/tap-thingy-tools-nfc-reprogram-webtool-and-guide" style="color: #FBBF24; font-weight: 700; text-decoration: underline;">/tools</a>.
  </div>

  <!-- Single Elegant Add to Cart Button at the Bottom -->
  <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid rgba(251,191,36,0.3); text-align: center;">
    <div style="font-size: 0.82rem; color: #4ADE80; font-weight: 700; margin-bottom: 12px;">
      &#10004; In Stock &bull; Collectible Smart Card Ready to Ship
    </div>
    <button class="tghh-atc-btn" onclick="tghhAddToCart(${pInfo.variantId}, this)">
      <span>🛒 Order Physical Keepsake Card &bull; $${pInfo.price || '14.99'}</span>
    </button>
    <div id="tghh-atc-msg-${code}" style="display:none; color: #4ADE80; font-weight: 700; font-size: 0.9rem; margin-top: 10px;">
      ✨ Added to your cart! <a href="/cart" style="color: #FBBF24; text-decoration: underline;">View Cart &rarr;</a>
    </div>
  </div>
</div>

<script>
  // AUDIO PERSISTENCE & AUTO-PLAY UNMUTED
  function initAudioState() {
    var isUnmuted = localStorage.getItem('tapgreetings_unmuted') === '1' || window.location.search.includes('sound=1');
    var vid = document.getElementById('tghh-video-' + '${code}') || document.querySelector('video');
    var btn = document.querySelector('.tghh-sound-btn');
    if (!vid) return;

    if (isUnmuted) {
      vid.muted = false;
      if (btn) btn.innerHTML = '🔊';
      var p = vid.play();
      if (p !== undefined) {
        p.catch(function(err) {
          console.log('Unmuted autoplay prevented; waiting for first interaction:', err);
          vid.muted = true;
          if (btn) btn.innerHTML = '🔇';
          function unlock() {
            vid.muted = false;
            vid.play();
            if (btn) btn.innerHTML = '🔊';
            localStorage.setItem('tapgreetings_unmuted', '1');
            document.removeEventListener('click', unlock);
            document.removeEventListener('touchstart', unlock);
          }
          document.addEventListener('click', unlock, { once: true });
          document.addEventListener('touchstart', unlock, { once: true });
        });
      }
    }
  }

  function tghhToggleSound(code) {
    var vid = document.getElementById('tghh-video-' + code) || document.querySelector('video');
    var btn = event.currentTarget;
    if (!vid) return;
    if (vid.muted) {
      vid.muted = false;
      if (btn) btn.innerHTML = '🔊';
      localStorage.setItem('tapgreetings_unmuted', '1');
    } else {
      vid.muted = true;
      if (btn) btn.innerHTML = '🔇';
      localStorage.setItem('tapgreetings_unmuted', '0');
    }
  }

  function preserveAudio(link, e, targetUrl) {
    var vid = document.querySelector('video');
    var isUnmuted = vid && !vid.muted;
    if (isUnmuted) {
      localStorage.setItem('tapgreetings_unmuted', '1');
      if (e) e.preventDefault();
      window.location.href = targetUrl + (targetUrl.includes('?') ? '&' : '?') + 'sound=1';
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAudioState);
  } else {
    initAudioState();
  }
</script>
`;
}

// Helper to generate Pink-O-Ween Card HTML with exciting animated Motto, Indicators, Abilities, and Audio persistence
function generatePinkoweenCardHtml(card) {
  const cardId = card.id; // '01'
  const vInfo = powMapped[cardId] || { variantId: 56260398088514, price: '19.99' };
  const num = parseInt(cardId, 10);
  const prevNum = num === 1 ? 31 : num - 1;
  const nextNum = num === 31 ? 1 : num + 1;
  const prevId = String(prevNum).padStart(2, '0');
  const nextId = String(nextNum).padStart(2, '0');

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
    width: 46px;
    height: 46px;
    font-size: 1.25rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(6px);
    transition: transform 0.2s;
  }
  .tgpow-sound-btn:hover {
    transform: scale(1.1);
  }

  /* EXCITING ANIMATED MOTTO CARD FOR PINK-O-WEEN */
  .tgpow-quote-card {
    position: relative;
    background: radial-gradient(circle at 50% 0%, rgba(255,105,180,0.22), rgba(15,5,16,0.95) 75%);
    border: 1.5px solid rgba(255,105,180,0.55);
    border-radius: 20px;
    padding: 24px 20px 20px;
    margin: 24px 0 20px;
    text-align: center;
    box-shadow: 0 0 25px rgba(255,105,180,0.25), inset 0 0 20px rgba(255,105,180,0.06);
    animation: pinkGlowPulse 4s infinite alternate ease-in-out;
  }
  @keyframes pinkGlowPulse {
    0% {
      border-color: rgba(255,105,180,0.4);
      box-shadow: 0 0 20px rgba(255,105,180,0.18), inset 0 0 15px rgba(255,105,180,0.04);
    }
    100% {
      border-color: rgba(255,105,180,0.9);
      box-shadow: 0 0 35px rgba(255,105,180,0.45), 0 0 15px rgba(199,21,133,0.35), inset 0 0 25px rgba(255,105,180,0.12);
    }
  }
  .tgpow-quote-badge {
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #FF69B4, #C71585);
    color: #FFF;
    font-size: 0.72rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 2px;
    padding: 3px 18px;
    border-radius: 999px;
    box-shadow: 0 3px 12px rgba(255,105,180,0.5);
    white-space: nowrap;
  }
  .tgpow-quote-text {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1.18rem;
    line-height: 1.55;
    font-style: italic;
    font-weight: 700;
    background: linear-gradient(135deg, #FFFFFF 0%, #FFF0F5 40%, #FFB6C1 70%, #FF69B4 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 2px 15px rgba(255,105,180,0.3);
    margin: 8px 0 0;
  }

  /* ANIMATED ABILITY & SIGNATURE ITEM TILES */
  .tgpow-ability-card {
    background: linear-gradient(135deg, rgba(255,105,180,0.14), rgba(15,5,16,0.6));
    border: 1px solid rgba(255,105,180,0.35);
    border-left: 4px solid #FF69B4;
    border-radius: 16px;
    padding: 15px 18px;
    margin: 18px 0;
    text-align: left;
    box-shadow: 0 4px 20px rgba(0,0,0,0.4);
  }
  .tgpow-ability-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.78rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: #FF69B4;
    margin-bottom: 6px;
  }
  .tgpow-pulse-sparkle {
    display: inline-block;
    animation: sparklePulse 1.8s infinite ease-in-out;
  }
  @keyframes sparklePulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.3); filter: drop-shadow(0 0 6px #FF69B4); }
  }

  /* ANIMATED NFC RADAR RIPPLE */
  .tgpow-nfc-motif-card {
    background: linear-gradient(135deg, rgba(255,105,180,0.08), rgba(15,5,16,0.7));
    border: 1.5px dashed rgba(255,105,180,0.45);
    border-radius: 16px;
    padding: 14px 18px;
    margin: 18px 0;
    display: flex;
    align-items: center;
    gap: 14px;
    text-align: left;
  }
  .tgpow-nfc-ripple-icon {
    position: relative;
    width: 44px;
    height: 44px;
    min-width: 44px;
    border-radius: 50%;
    background: rgba(255,105,180,0.15);
    border: 1.5px solid #FF69B4;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    color: #FF69B4;
  }
  .tgpow-nfc-ripple-icon::after {
    content: '';
    position: absolute;
    inset: -6px;
    border-radius: 50%;
    border: 1.5px solid #FF69B4;
    opacity: 0;
    animation: rippleSonarPink 2.2s infinite cubic-bezier(0, 0.2, 0.8, 1);
  }
  @keyframes rippleSonarPink {
    0% { transform: scale(0.85); opacity: 0.9; }
    100% { transform: scale(1.6); opacity: 0; }
  }

  /* SPECTRAL STATS GRID WITH ANIMATED METER */
  .tgpow-stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin: 18px 0;
  }
  .tgpow-stat-tile {
    background: rgba(255,255,255,0.035);
    border: 1px solid rgba(255,105,180,0.25);
    border-radius: 14px;
    padding: 12px;
    text-align: center;
  }
  .tgpow-stat-label {
    text-transform: uppercase;
    font-size: 0.72rem;
    color: #FF69B4;
    font-weight: 800;
    letter-spacing: 1px;
  }
  .tgpow-stat-val {
    font-size: 1.15rem;
    font-weight: 900;
    color: #FFF;
    margin: 4px 0 6px;
    text-shadow: 0 0 10px rgba(255,105,180,0.5);
  }

  /* 3D KEEPSAKE CARD FLIP */
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

  <!-- Quick Nav (Continuous Looping with Audio Preservation) -->
  <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 14px; padding: 0 4px; font-size: 0.88rem; font-weight: 700;">
    <a href="/pages/tgpow-${prevId}" onclick="preserveAudio(this, event, '/pages/tgpow-${prevId}')" style="color: #FF69B4; text-decoration: none;">&larr; #${prevId} Prev</a>
    <a href="/pages/tgpow-s01" style="font-size: 0.8rem; color: #D8B4FE; text-transform: uppercase; letter-spacing: 1px; text-decoration: underline;">
      ${card.headerDisplay || `OCTOBER ${cardId} OF 31`}
    </a>
    <a href="/pages/tgpow-${nextId}" onclick="preserveAudio(this, event, '/pages/tgpow-${nextId}')" style="color: #FF69B4; text-decoration: none;">#${nextId} Next &rarr;</a>
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
    <div style="font-size: 0.78rem; color: #D8B4FE; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 4px;">
      ${card.creatureClass || 'Prism-Light Ethereal'}
    </div>
  </div>

  <!-- EXCITING ANIMATED MOTTO / SPOOKY CREED -->
  <div class="tgpow-quote-card">
    <span class="tgpow-quote-badge">👻 Coven Keepsake Motto 👻</span>
    <div class="tgpow-quote-text">
      &ldquo;${card.mottoQuote || 'Happy Pink-O-Ween!'}&rdquo;
    </div>
  </div>

  <!-- ANIMATED SPECIAL ABILITIES & FEATURES -->
  <div class="tgpow-ability-card">
    <div class="tgpow-ability-header">
      <span class="tgpow-pulse-sparkle">✨</span>
      <span>Special Ability: ${card.specialAbility || 'Pastel Charm'}</span>
    </div>
    <div style="font-size: 0.95rem; line-height: 1.6; color: #FFF0F5;">
      ${card.lore || 'An exclusive collectible spectral video experience from Pink-O-Ween.'}
    </div>
    <div style="font-size: 0.85rem; color: #FFB6C1; margin-top: 8px;">
      <strong style="color: #FF69B4;">Spooky Action:</strong> ${card.visualAction || 'Animated loop with ambient sound.'}
    </div>
  </div>

  <!-- ANIMATED SIGNATURE ITEM & NFC MOTIF -->
  <div class="tgpow-nfc-motif-card">
    <div class="tgpow-nfc-ripple-icon">
      <i class="fa-solid fa-wand-magic-sparkles"></i>
    </div>
    <div>
      <div style="font-size: 0.75rem; font-weight: 800; color: #FF69B4; text-transform: uppercase; letter-spacing: 1.2px;">
        Signature Item &bull; NFC Radar Motif
      </div>
      <div style="font-size: 0.92rem; color: #FFF0F5; font-weight: 600; margin-top: 2px;">
        ${card.signatureItem || 'Enchanted Keepsake'}
      </div>
    </div>
  </div>

  <!-- SPECTRAL INDICATORS / STATS -->
  <div class="tgpow-stats-grid">
    <div class="tgpow-stat-tile">
      <div class="tgpow-stat-label">Spook Rating</div>
      <div class="tgpow-stat-val">${card.spookRating || '15 / 100'}</div>
      <div style="width: 100%; height: 4px; background: rgba(255,255,255,0.08); border-radius: 999px; overflow: hidden;">
        <div style="height: 100%; width: ${parseInt(card.spookRating || '15', 10)}%; background: linear-gradient(90deg, #FF69B4, #C71585); border-radius: 999px;"></div>
      </div>
    </div>
    <div class="tgpow-stat-tile">
      <div class="tgpow-stat-label">Sweetness Index</div>
      <div class="tgpow-stat-val">${card.sweetnessIndex || '95 / 100'}</div>
      <div style="width: 100%; height: 4px; background: rgba(255,255,255,0.08); border-radius: 999px; overflow: hidden;">
        <div style="height: 100%; width: ${parseInt(card.sweetnessIndex || '95', 10)}%; background: linear-gradient(90deg, #4ADE80, #FF69B4); border-radius: 999px;"></div>
      </div>
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
  function initAudioState() {
    var isUnmuted = localStorage.getItem('tapgreetings_unmuted') === '1' || window.location.search.includes('sound=1');
    var vid = document.getElementById('tgpow-video-' + '${cardId}') || document.querySelector('video');
    var btn = document.querySelector('.tgpow-sound-btn');
    if (!vid) return;

    if (isUnmuted) {
      vid.muted = false;
      if (btn) btn.innerHTML = '🔊';
      var p = vid.play();
      if (p !== undefined) {
        p.catch(function(err) {
          console.log('Unmuted autoplay prevented; waiting for first interaction:', err);
          vid.muted = true;
          if (btn) btn.innerHTML = '🔇';
          function unlock() {
            vid.muted = false;
            vid.play();
            if (btn) btn.innerHTML = '🔊';
            localStorage.setItem('tapgreetings_unmuted', '1');
            document.removeEventListener('click', unlock);
            document.removeEventListener('touchstart', unlock);
          }
          document.addEventListener('click', unlock, { once: true });
          document.addEventListener('touchstart', unlock, { once: true });
        });
      }
    }
  }

  function tgpowToggleSound(cardId) {
    var vid = document.getElementById('tgpow-video-' + cardId) || document.querySelector('video');
    var btn = event.currentTarget;
    if (!vid) return;
    if (vid.muted) {
      vid.muted = false;
      if (btn) btn.innerHTML = '🔊';
      localStorage.setItem('tapgreetings_unmuted', '1');
    } else {
      vid.muted = true;
      if (btn) btn.innerHTML = '🔇';
      localStorage.setItem('tapgreetings_unmuted', '0');
    }
  }

  function preserveAudio(link, e, targetUrl) {
    var vid = document.querySelector('video');
    var isUnmuted = vid && !vid.muted;
    if (isUnmuted) {
      localStorage.setItem('tapgreetings_unmuted', '1');
      if (e) e.preventDefault();
      window.location.href = targetUrl + (targetUrl.includes('?') ? '&' : '?') + 'sound=1';
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAudioState);
  } else {
    initAudioState();
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

  console.log('=== Step 1: Enrich Product Tags for Filtering on Shopify ===');
  // Enrich Holiday Cards
  for (const code of Object.keys(holidayOfficial)) {
    const card = holidayOfficial[code];
    const pInfo = holidayMapped[code];
    if (!pInfo) continue;

    const baseTags = pInfo.existingTags || [];
    const richTags = [
      ...baseTags,
      'Series:Happy Holidays',
      `Subseries:${card.series}`,
      `Character:${card.name}`,
      `Role:${card.title}`,
      `Card:#${code}`,
      'Format:Smart NFC Card',
      'Format:CR80 Waterproof PVC',
      'Feature:Living Video Keepsake',
      'Feature:Rewritable NFC',
      'Tech:NTAG215',
      'Holiday:Christmas',
      'Holiday:Winter Season',
      'Finish:Polymer Clay & Needle Felt',
      'Filter:Collectible Cards',
      'Filter:In Stock',
      ...card.indicators.map(ind => `Indicator:${ind.name}`)
    ];
    const uniqueTags = Array.from(new Set(richTags)).join(', ');

    console.log(`Updating tags for #${code} ${card.name}...`);
    await fetch(`https://${store}/admin/api/2024-07/products/${pInfo.productId}.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
      body: JSON.stringify({ product: { id: pInfo.productId, tags: uniqueTags } })
    });
  }

  // Enrich Pink-O-Ween Cards
  for (const card of pinkCards) {
    const pInfo = powMapped[card.id];
    if (!pInfo) continue;

    const richTags = [
      'Series:Pink-O-Ween',
      'Subseries:Coquette Spooky Coven',
      `Character:${card.title}`,
      `Alias:${card.alias || card.title}`,
      `Class:${card.creatureClass || 'Ethereal'}`,
      `Item:${card.signatureItem || 'Keepsake'}`,
      `Ability:${card.specialAbility || 'Pastel Magic'}`,
      `Rarity:${card.rarity || 'Spectrum Common'}`,
      `Card:Oct ${card.id}`,
      'Format:Smart NFC Card',
      'Format:CR80 Waterproof PVC',
      'Feature:Living Video Keepsake',
      'Feature:Rewritable NFC',
      'Tech:NTAG215',
      'Holiday:Halloween',
      'Occasion:Pink-O-Ween',
      'Filter:Collectible Cards',
      'Filter:In Stock'
    ];
    const uniqueTags = Array.from(new Set(richTags)).join(', ');

    console.log(`Updating tags for Oct ${card.id} ${card.title}...`);
    await fetch(`https://${store}/admin/api/2024-07/products/${pInfo.productId}.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
      body: JSON.stringify({ product: { id: pInfo.productId, tags: uniqueTags } })
    });
  }

  console.log('\n=== Step 2: Fetch Existing Shopify Pages ===');
  const existingPagesRes = await fetch(`https://${store}/admin/api/2024-07/pages.json?limit=250`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const existingPages = (await existingPagesRes.json()).pages || [];
  const pageMap = {};
  existingPages.forEach(p => pageMap[p.handle] = p);

  console.log('\n=== Step 3: Deploy Upgraded Happy Holidays Pages (TGHH001 - TGHH016) ===');
  for (const code of Object.keys(holidayOfficial)) {
    const card = holidayOfficial[code];
    const handle = `tghh${code}`;
    const title = `#${code} ${card.name} (${card.title}) — TapGreetings Keepsake Experience`;
    const bodyHtml = generateHolidayCardHtml(code);

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

  console.log('\n=== Step 4: Deploy Upgraded Pink-O-Ween Hub Page (TGPOW-S01) ===');
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
  }

  console.log('\n=== Step 5: Deploy Upgraded All 31 Pink-O-Ween Individual Card Pages (TGPOW-01 to TGPOW-31) ===');
  for (const card of pinkCards) {
    const cardId = card.id;
    const handle = `tgpow-${cardId}`;
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
    }
  }

  console.log('\n🎉 ALL ENTERTAINMENT PAGES, ANIMATED MOTTO/STATS/ABILITIES, AUDIO PERSISTENCE & SHOPIFY TAGS DEPLOYED SUCCESSFULLY!');
}

main().catch(console.error);
