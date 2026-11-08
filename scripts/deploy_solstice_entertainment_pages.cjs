const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const match = line.trim().match(/^([^=]+)=(.*)$/);
    if (match) process.env[match[1]] = match[2].trim();
  });
}

const holidayOfficial = require('../data/holiday_series_official.json');
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

function generateHolidayCardHtml(code) {
  const card = holidayOfficial[code];
  const pInfo = holidayMapped[code] || { variantId: 68065549713730, price: '14.99' };
  const num = parseInt(code, 10);
  const totalCards = 24;
  const prevNum = num === 1 ? totalCards : num - 1;
  const nextNum = num === totalCards ? 1 : num + 1;
  const prevCode = String(prevNum).padStart(3, '0');
  const nextCode = String(nextNum).padStart(3, '0');

  const videoUrl = `https://tapgreetings.com/assets/video/${code}-video.mp4`;
  const frontImg = `https://tapgreetings.com/assets/img/cr80/${code}-front.jpg?v=cr80`;
  const backImg = `https://tapgreetings.com/assets/img/cr80/${code}-back.jpg?v=cr80`;

  const isLandscape = Boolean(card.is_landscape || card.aspect_ratio === '16/9');
  const isSeries3 = num >= 17;

  const wrapBg = isSeries3 
    ? 'radial-gradient(ellipse at top, #0A1128 0%, #060913 70%, #03050A 100%)' 
    : '#140C08';
  const wrapBorder = isSeries3 
    ? '2px solid rgba(16, 185, 129, 0.45)' 
    : '2px solid rgba(251, 191, 36, 0.4)';
  const wrapShadow = isSeries3 
    ? '0 12px 50px rgba(0,0,0,0.85), 0 0 35px rgba(16, 185, 129, 0.22)' 
    : '0 12px 50px rgba(0,0,0,0.7), 0 0 35px rgba(251,191,36,0.18)';
  const accentColor = isSeries3 ? '#10B981' : '#FBBF24';
  const starAccent = isSeries3 ? '#34D399' : '#FBBF24';

  const badgeGradient = isSeries3 
    ? 'linear-gradient(135deg, #0F172A, #065F46, #047857, #10B981, #0F172A)' 
    : 'linear-gradient(90deg, #9E1B32, #D62839)';
  const badgeText = isSeries3 
    ? `&#10022; Series 3: Solstice Magic &bull; Card #${code} of ${String(totalCards).padStart(3, '0')} &#10022;` 
    : `&#10022; TapGreetings Series 1 &bull; Card #${code} of ${String(totalCards).padStart(3, '0')} &#10022;`;

  return `
<style>
  ${IMMERSION_CSS}

  .tghh-experience-wrap {
    font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background: ${wrapBg};
    color: #FFF8E7;
    border-radius: 28px;
    padding: 24px 16px 44px;
    max-width: 680px;
    margin: 0 auto 36px;
    box-shadow: ${wrapShadow};
    border: ${wrapBorder};
    position: relative;
    overflow: hidden;
  }
  .tghh-corner {
    position: absolute;
    color: ${starAccent};
    font-size: 14px;
    opacity: 0.85;
    text-shadow: 0 0 8px ${starAccent};
    user-select: none;
  }
  .tghh-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: ${badgeGradient};
    color: #FFFFFF;
    padding: 6px 18px;
    border-radius: 999px;
    font-weight: 800;
    font-size: 0.82rem;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    box-shadow: 0 4px 15px rgba(0,0,0,0.4);
    margin-bottom: 12px;
    border: 1px solid rgba(255,255,255,0.2);
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
    border: 2.5px solid ${accentColor};
    box-shadow: 0 10px 40px rgba(0,0,0,0.8), 0 0 25px ${isSeries3 ? 'rgba(16,185,129,0.3)' : 'rgba(251,191,36,0.25)'};
  }
  .tghh-video-box.is-landscape {
    aspect-ratio: 16/9 !important;
    max-width: 580px !important;
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
    background: rgba(10,17,40,0.85);
    border: 1.5px solid ${accentColor};
    color: ${accentColor};
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
    background: rgba(16,185,129,0.25);
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
    color: ${accentColor};
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
    background: ${isSeries3 ? 'radial-gradient(circle at 50% 0%, rgba(16,185,129,0.18), rgba(10,17,40,0.95) 75%)' : 'radial-gradient(circle at 50% 0%, rgba(251,191,36,0.18), rgba(20,12,8,0.95) 75%)'};
    border: 1.5px solid ${isSeries3 ? 'rgba(16,185,129,0.5)' : 'rgba(251,191,36,0.5)'};
    border-radius: 20px;
    padding: 24px 20px 20px;
    margin: 24px 0 20px;
    text-align: center;
    box-shadow: 0 0 25px ${isSeries3 ? 'rgba(16,185,129,0.2)' : 'rgba(251,191,36,0.2)'};
    overflow: visible;
    animation: quoteGlowPulse 4s infinite alternate ease-in-out;
  }
  @keyframes quoteGlowPulse {
    0% {
      border-color: ${isSeries3 ? 'rgba(16,185,129,0.4)' : 'rgba(251,191,36,0.4)'};
      box-shadow: 0 0 20px ${isSeries3 ? 'rgba(16,185,129,0.15)' : 'rgba(251,191,36,0.15)'};
    }
    100% {
      border-color: ${isSeries3 ? 'rgba(16,185,129,0.85)' : 'rgba(251,191,36,0.85)'};
      box-shadow: 0 0 35px ${isSeries3 ? 'rgba(16,185,129,0.4)' : 'rgba(251,191,36,0.38)'};
    }
  }
  .tghh-quote-badge {
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    background: ${isSeries3 ? 'linear-gradient(90deg, #059669, #10B981)' : 'linear-gradient(90deg, #F59E0B, #E65100)'};
    color: #FFFFFF;
    font-size: 0.72rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    padding: 3px 14px;
    border-radius: 999px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.5);
    white-space: nowrap;
  }
  .tghh-quote-text {
    font-family: 'Outfit', sans-serif;
    font-size: 1.28rem;
    font-weight: 700;
    color: #FFFDF8;
    line-height: 1.55;
    font-style: italic;
    text-shadow: 0 2px 10px rgba(0,0,0,0.5);
    margin-top: 4px;
  }
  .tghh-quote-mark {
    color: ${accentColor};
    font-family: serif;
    font-size: 1.8rem;
    line-height: 0;
    vertical-align: -0.25em;
    margin: 0 3px;
  }

  /* ANIMATED SPECIAL ABILITIES CARD */
  .tghh-ability-card {
    background: ${isSeries3 ? 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(10,17,40,0.8))' : 'linear-gradient(135deg, rgba(251,191,36,0.08), rgba(20,12,8,0.7))'};
    border: 1.5px solid ${isSeries3 ? 'rgba(16,185,129,0.35)' : 'rgba(251,191,36,0.35)'};
    border-radius: 20px;
    padding: 18px 20px;
    margin: 18px 0;
    box-shadow: 0 8px 30px rgba(0,0,0,0.4);
    position: relative;
    overflow: hidden;
  }
  .tghh-ability-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: ${accentColor};
    font-weight: 800;
    margin-bottom: 8px;
  }
  .tghh-ability-body {
    font-size: 1.02rem;
    line-height: 1.6;
    color: #FFF8E7;
  }

  /* ANIMATED NFC TAP TARGET MOTIF */
  .tghh-nfc-card {
    background: ${isSeries3 ? 'linear-gradient(135deg, rgba(15,23,42,0.9), rgba(6,78,59,0.4))' : 'linear-gradient(135deg, rgba(20,12,8,0.9), rgba(158,27,50,0.3))'};
    border: 1.5px solid ${isSeries3 ? 'rgba(16,185,129,0.4)' : 'rgba(251,191,36,0.35)'};
    border-radius: 20px;
    padding: 16px 20px;
    margin: 18px 0;
    box-shadow: 0 8px 30px rgba(0,0,0,0.4);
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .tghh-nfc-sonar {
    width: 48px;
    height: 48px;
    min-width: 48px;
    border-radius: 50%;
    background: ${isSeries3 ? 'radial-gradient(circle, #10B981 0%, #064E3B 100%)' : 'radial-gradient(circle, #FBBF24 0%, #B45309 100%)'};
    display: flex;
    align-items: center;
    justify-content: center;
    color: #FFFFFF;
    font-size: 1.35rem;
    box-shadow: 0 0 20px ${isSeries3 ? 'rgba(16,185,129,0.6)' : 'rgba(251,191,36,0.6)'};
    animation: sonarPulse 2s infinite ease-out;
  }
  @keyframes sonarPulse {
    0% { transform: scale(0.96); box-shadow: 0 0 0 0 ${isSeries3 ? 'rgba(16,185,129,0.7)' : 'rgba(251,191,36,0.7)'}; }
    70% { transform: scale(1.04); box-shadow: 0 0 0 14px rgba(0,0,0,0); }
    100% { transform: scale(0.96); box-shadow: 0 0 0 0 rgba(0,0,0,0); }
  }

  /* ANIMATED INDICATORS GRID */
  .tghh-indicators-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
    gap: 12px;
    margin: 20px 0;
  }
  .tghh-stat-tile {
    background: ${isSeries3 ? 'rgba(10,17,40,0.7)' : 'rgba(20,12,8,0.7)'};
    border: 1px solid ${isSeries3 ? 'rgba(16,185,129,0.3)' : 'rgba(251,191,36,0.3)'};
    border-radius: 16px;
    padding: 12px 14px;
    text-align: center;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
  }
  .tghh-stat-name {
    font-size: 0.72rem;
    text-transform: uppercase;
    color: ${accentColor};
    font-weight: 800;
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
    color: ${starAccent};
    filter: drop-shadow(0 0 2px ${starAccent});
    animation: starTwinkle 2.4s infinite ease-in-out;
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
    background: ${isSeries3 ? 'linear-gradient(90deg, #059669, #10B981, #34D399)' : 'linear-gradient(90deg, #D62839, #F59E0B)'};
    border-radius: 999px;
    box-shadow: 0 0 8px ${accentColor};
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
    border: 2px solid ${accentColor};
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
    max-width: 440px;
    background: ${isSeries3 ? 'linear-gradient(90deg, #047857, #10B981, #059669)' : 'linear-gradient(90deg, #D62839, #E65100)'};
    color: #FFFFFF;
    border: none;
    padding: 16px 24px;
    border-radius: 30px;
    font-size: 1.1rem;
    font-weight: 900;
    cursor: pointer;
    box-shadow: 0 6px 25px ${isSeries3 ? 'rgba(16,185,129,0.45)' : 'rgba(214,40,57,0.45)'};
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .tghh-atc-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px ${isSeries3 ? 'rgba(16,185,129,0.6)' : 'rgba(214,40,57,0.6)'};
  }
</style>

<div class="tghh-experience-wrap">
  <div class="tghh-corner" style="top: 14px; left: 16px;">&#10022;</div>
  <div class="tghh-corner" style="top: 14px; right: 16px;">&#10022;</div>
  <div class="tghh-corner" style="bottom: 14px; left: 16px;">&#10022;</div>
  <div class="tghh-corner" style="bottom: 14px; right: 16px;">&#10022;</div>

  <!-- Top Video First (Entertainment Hero) -->
  <div class="tghh-video-box ${isLandscape ? 'is-landscape' : ''}">
    <video id="tghh-video-${code}" loop muted playsinline autoplay poster="${frontImg}">
      <source src="${videoUrl}" type="video/mp4">
    </video>
    <button class="tghh-sound-btn" onclick="tghhToggleSound('${code}')" title="Toggle Sound">
      &#128264;
    </button>
  </div>

  <!-- Quick Nav with Audio State Preservation -->
  <div class="tghh-nav-row">
    <a href="/pages/tghh${prevCode}" onclick="preserveAudio(this, event, '/pages/tghh${prevCode}')">&larr; #${prevCode} Prev Card</a>
    <span style="font-size: 0.8rem; color: #D1BDB0; text-transform: uppercase; letter-spacing: 1px; font-weight: 800;">
      #${code} of ${String(totalCards).padStart(3, '0')}
    </span>
    <a href="/pages/tghh${nextCode}" onclick="preserveAudio(this, event, '/pages/tghh${nextCode}')">#${nextCode} Next &rarr;</a>
  </div>

  <!-- Header Section -->
  <div style="text-align: center; margin: 20px 0 14px;">
    <div class="tghh-badge">
      ${badgeText}
    </div>
    <h1 style="font-size: 2.2rem; font-weight: 900; color: #FFF; margin: 4px 0 6px; font-family: 'Playfair Display', serif;">
      ${card.name}
    </h1>
    <div style="font-size: 1.05rem; color: ${accentColor}; font-weight: 700; font-style: italic;">
      ${card.title}
    </div>
    <div style="font-size: 0.78rem; color: #D1BDB0; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 4px;">
      ${card.series} &bull; ${card.subcollection || 'Solstice Magic'}
    </div>
  </div>

  <!-- EXCITING ANIMATED MOTTO / LIVING CREED -->
  <div class="tghh-quote-card">
    <span class="tghh-quote-badge">&#10022; Official Keepsake Motto &#10022;</span>
    <div class="tghh-quote-text">
      <span class="tghh-quote-mark">&ldquo;</span>${card.motto}<span class="tghh-quote-mark">&rdquo;</span>
    </div>
  </div>

  <!-- ANIMATED SPECIAL ABILITIES & FEATURES -->
  <div class="tghh-ability-card">
    <div class="tghh-ability-header">
      <span style="font-size: 1.1rem;">&#10024;</span> Special Abilities &amp; Features
    </div>
    <div class="tghh-ability-body">
      ${card.abilities}
    </div>
  </div>

  <!-- ANIMATED NFC TAP TARGET MOTIF -->
  <div class="tghh-nfc-card">
    <div class="tghh-nfc-sonar">
      &#128246;
    </div>
    <div>
      <div style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 1.5px; color: ${accentColor}; font-weight: 800; margin-bottom: 2px;">
        NFC Tap Target Motif
      </div>
      <div style="font-size: 0.95rem; color: #FFF; font-weight: 600;">
        ${card.nfcMotif}
      </div>
    </div>
  </div>

  <!-- FESTIVE / SOLSTICE POWER INDICATORS -->
  <div style="margin: 22px 0 16px;">
    <div style="text-align: center; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 2px; color: ${accentColor}; font-weight: 800; margin-bottom: 10px;">
      &#10022; ${isSeries3 ? 'Solstice Clockwork Power Stats' : 'Holiday Power Stats'} &#10022;
    </div>
    <div class="tghh-indicators-grid">
      ${card.indicators.map(ind => `
      <div class="tghh-stat-tile">
        <div class="tghh-stat-name">${ind.name}</div>
        <div class="tghh-star-row">
          <span class="tghh-star-anim">&#9733;</span>
          <span class="tghh-star-anim">&#9733;</span>
          <span class="tghh-star-anim">&#9733;</span>
          <span class="tghh-star-anim">&#9733;</span>
          <span class="tghh-star-anim">${ind.score >= 5 ? '&#9733;' : '&#9734;'}</span>
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
    <div style="font-size: 0.85rem; font-weight: 700; color: ${accentColor}; margin-bottom: 6px;">
      &#128179; Physical Smart Keepsake Card (Click to Flip Front/Back)
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
      Standard CR80 30mil Waterproof PVC &bull; Embedded NTAG215 Microchip &bull; ${card.printFinish || 'Soft-touch matte with metallic cold-foil stamping.'}
    </div>
  </div>

  <!-- Share Keepsake Button -->
  <div style="margin: 22px 0; text-align: center;">
    <button onclick="tghhShareCard('${card.name}', '${card.title}')" style="background: rgba(255,255,255,0.08); border: 1.5px solid ${accentColor}; color: ${accentColor}; padding: 12px 24px; border-radius: 20px; font-weight: 800; font-size: 0.95rem; cursor: pointer; display: inline-flex; align-items: center; gap: 8px;">
      &#128279; Share Keepsake Experience
    </button>
  </div>

  <!-- Rewritable NFC Feature Info -->
  <div style="background: ${isSeries3 ? 'rgba(16,185,129,0.07)' : 'rgba(251,191,36,0.06)'}; border: 1px solid ${isSeries3 ? 'rgba(16,185,129,0.3)' : 'rgba(251,191,36,0.25)'}; border-radius: 16px; padding: 14px 18px; margin: 20px 0; font-size: 0.85rem; line-height: 1.6; color: #D1BDB0;">
    <strong style="color: ${accentColor};">&#10024; Rewritable NFC Microchip:</strong> This physical card comes pre-linked to this exclusive video portal, but can be reprogrammed anytime to link to your own family video, audio note, or custom greeting using our free tool at <a href="/pages/tap-thingy-tools-nfc-reprogram-webtool-and-guide" style="color: ${accentColor}; font-weight: 700; text-decoration: underline;">/tools</a>.
  </div>

  <!-- Single Elegant Add to Cart Button at the Bottom -->
  <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.12); text-align: center;">
    <div style="font-size: 0.82rem; color: #34D399; font-weight: 700; margin-bottom: 12px;">
      &#10004; In Stock &bull; Collectible Smart Card Ready to Ship
    </div>
    <button class="tghh-atc-btn" onclick="tghhAddToCart(${pInfo.variantId}, this)">
      <span>&#128722; Order Physical Keepsake Card &bull; $${pInfo.price || '14.99'}</span>
    </button>
    <div id="tghh-atc-msg-${code}" style="display:none; color: #34D399; font-weight: 700; font-size: 0.9rem; margin-top: 10px;">
      &#10004; Added to your cart! <a href="/cart" style="color: ${accentColor}; text-decoration: underline;">View Cart &rarr;</a>
    </div>
  </div>
</div>

<script>
  // AUDIO PERSISTENCE & AUTO-PLAY UNMUTED
  function initAudioState() {
    var vid = document.getElementById('tghh-video-' + '${code}') || document.querySelector('video');
    var btn = document.querySelector('.tghh-sound-btn');
    if (!vid) return;

    var urlParams = new URLSearchParams(window.location.search);
    var soundParam = urlParams.get('sound');
    var storedSound = localStorage.getItem('tapgreetings_unmuted');

    if (soundParam === '1' || storedSound === '1') {
      vid.muted = false;
      if (btn) btn.innerHTML = '&#128266;';
      var p = vid.play();
      if (p !== undefined) {
        p.catch(function(err) {
          console.log('Unmuted autoplay prevented; waiting for first interaction:', err);
          vid.muted = true;
          if (btn) btn.innerHTML = '&#128264;';
          function unlock() {
            vid.muted = false;
            vid.play();
            if (btn) btn.innerHTML = '&#128266;';
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
      if (btn) btn.innerHTML = '&#128266;';
      localStorage.setItem('tapgreetings_unmuted', '1');
    } else {
      vid.muted = true;
      if (btn) btn.innerHTML = '&#128264;';
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
      title: name + ' (' + title + ') &bull; TapGreetings Experience',
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
    btn.innerHTML = '<span>&#8987; Adding...</span>';
    btn.disabled = true;

    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: variantId, quantity: 1 })
    })
    .then(function(res) { return res.json(); })
    .then(function(item) {
      btn.innerHTML = '<span>&#10004; Added to Cart!</span>';
      var msg = document.getElementById('tghh-atc-msg-' + '${code}');
      if (msg) msg.style.display = 'block';
      setTimeout(function() {
        btn.innerHTML = originalText;
        btn.disabled = false;
      }, 3500);
    })
    .catch(function(err) {
      console.error(err);
      btn.innerHTML = '<span>&#9888; Error</span>';
      setTimeout(function() {
        btn.innerHTML = originalText;
        btn.disabled = false;
      }, 3000);
    });
  }

  document.addEventListener('DOMContentLoaded', function() {
    initAudioState();
  });
</script>
  `;
}

async function main() {
  const token = await getAccessToken();
  const store = process.env.SHOPIFY_STORE_DOMAIN;
  const version = '2024-07';

  console.log('Fetching existing Shopify pages...');
  const existingPagesRes = await fetch(`https://${store}/admin/api/${version}/pages.json?limit=250`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const existingPages = (await existingPagesRes.json()).pages || [];
  const pageMap = {};
  existingPages.forEach(p => pageMap[p.handle] = p);

  console.log('\nDeploying entertainment pages tghh001 - tghh024...');
  const allCodes = Object.keys(holidayOfficial);

  for (const code of allCodes) {
    const card = holidayOfficial[code];
    const handle = `tghh${code}`;
    const title = `#${code} ${card.name} (${card.title}) - TapGreetings Keepsake Experience`;
    const bodyHtml = generateHolidayCardHtml(code);

    if (pageMap[handle]) {
      console.log(`Updating /pages/${handle}...`);
      const res = await fetch(`https://${store}/admin/api/${version}/pages/${pageMap[handle].id}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
        body: JSON.stringify({ page: { id: pageMap[handle].id, title, body_html: bodyHtml } })
      });
      if (res.ok) {
        console.log(`  ? /pages/${handle} successfully updated!`);
      } else {
        console.error(`  ? Error updating /pages/${handle}:`, await res.text());
      }
    } else {
      console.log(`Creating /pages/${handle}...`);
      const res = await fetch(`https://${store}/admin/api/${version}/pages.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
        body: JSON.stringify({ page: { title, handle, body_html: bodyHtml } })
      });
      if (res.ok) {
        console.log(`  ? /pages/${handle} successfully created!`);
      } else {
        console.error(`  ? Error creating /pages/${handle}:`, await res.text());
      }
    }

    // Rate-limit pause
    await new Promise(r => setTimeout(r, 400));
  }

  console.log('\nAll 24 entertainment pages deployed successfully to Shopify!');
}

main().catch(console.error);
