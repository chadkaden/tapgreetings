const fs = require('fs');
const path = require('path');

// 1. Update tapgreetings-product-page.liquid
const prodPagePath = path.join(__dirname, '../theme/sections/tapgreetings-product-page.liquid');
let prodContent = fs.readFileSync(prodPagePath, 'utf8');

// Ensure shopify_entertainment_page_url is assigned
if (!prodContent.includes('shopify_entertainment_page_url')) {
  prodContent = prodContent.replace(
    "{% assign web_portal_url = 'https://tapgreetings.com/' | append: card_code | append: '/' %}",
    `{% assign web_portal_url = 'https://tapgreetings.com/' | append: card_code | append: '/' %}
{% if product.tags contains 'pinkoween' or product.handle contains 'pink-o-ween' %}
  {% assign shopify_entertainment_page_url = 'https://shop.tapthingy.com/pages/tgpow-' | append: card_code %}
{% else %}
  {% assign shopify_entertainment_page_url = 'https://shop.tapthingy.com/pages/tghh' | append: card_code %}
{% endif %}`
  );
}

// Add Spectacular Animation CSS to tapgreetings-product-page.liquid
const animationStyles = `
  /* --- SPECTACULAR ANIMATIONS & AMBIENT AURA --- */
  @keyframes mediaAuraPulse {
    0%, 100% {
      box-shadow: 0 10px 35px var(--tg-shadow), 0 0 25px rgba(251, 191, 36, 0.25), inset 0 0 15px rgba(251, 191, 36, 0.15);
      border-color: rgba(251, 191, 36, 0.45);
    }
    50% {
      box-shadow: 0 16px 50px rgba(0, 0, 0, 0.7), 0 0 45px rgba(214, 40, 57, 0.45), 0 0 70px rgba(251, 191, 36, 0.35), inset 0 0 25px rgba(251, 191, 36, 0.3);
      border-color: #FBBF24;
    }
  }

  @keyframes cornerTwinkle {
    0% { opacity: 0.35; transform: scale(0.85); }
    100% { opacity: 1; transform: scale(1.22); filter: drop-shadow(0 0 8px #FBBF24); }
  }

  @keyframes badgeSweep {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  @keyframes btnGlowShimmer {
    0% {
      background-position: 0% 50%;
      box-shadow: 0 4px 20px rgba(214, 40, 57, 0.45), 0 0 0 rgba(251, 191, 36, 0);
    }
    50% {
      background-position: 100% 50%;
      box-shadow: 0 8px 32px rgba(214, 40, 57, 0.75), 0 0 28px rgba(251, 191, 36, 0.55);
    }
    100% {
      background-position: 0% 50%;
      box-shadow: 0 4px 20px rgba(214, 40, 57, 0.45), 0 0 0 rgba(251, 191, 36, 0);
    }
  }

  @keyframes thumbGlowPulse {
    0%, 100% {
      box-shadow: 0 0 10px rgba(251, 191, 36, 0.5);
      border-color: #FBBF24;
    }
    50% {
      box-shadow: 0 0 24px rgba(251, 191, 36, 0.95), 0 0 10px rgba(214, 40, 57, 0.65);
      border-color: #FFF8E7;
    }
  }

  @keyframes liveDotPulse {
    0%, 100% { opacity: 0.4; transform: scale(0.85); }
    50% { opacity: 1; transform: scale(1.25); box-shadow: 0 0 14px #4ADE80; }
  }

  .tg-corner-filigree {
    position: absolute;
    width: 24px;
    height: 24px;
    pointer-events: none;
    z-index: 15;
    color: #FBBF24;
    font-size: 18px;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: cornerTwinkle 3s ease-in-out infinite alternate;
  }
  .tg-corner-filigree.top-left { top: 10px; left: 10px; }
  .tg-corner-filigree.top-right { top: 10px; right: 10px; animation-delay: 0.75s; }
  .tg-corner-filigree.bottom-left { bottom: 10px; left: 10px; animation-delay: 1.5s; }
  .tg-corner-filigree.bottom-right { bottom: 10px; right: 10px; animation-delay: 2.25s; }

  .tg-spectacular-experience-banner {
    display: block;
    text-decoration: none;
    position: relative;
    border-radius: 20px;
    overflow: hidden;
    padding: 18px 22px;
    background: linear-gradient(135deg, rgba(158, 27, 50, 0.5), rgba(20, 12, 8, 0.9), rgba(251, 191, 36, 0.25));
    border: 2px solid var(--tg-gold);
    box-shadow: 0 6px 25px rgba(251, 191, 36, 0.3), inset 0 0 20px rgba(251, 191, 36, 0.18);
    margin: 20px auto;
    max-width: 650px;
    text-align: center;
    transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  }
  .tg-spectacular-experience-banner:hover {
    transform: translateY(-3px) scale(1.015);
    box-shadow: 0 10px 36px rgba(251, 191, 36, 0.6), inset 0 0 30px rgba(251, 191, 36, 0.35);
    border-color: #FFF8E7;
  }
  .tg-exp-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 0.78rem;
    font-weight: 800;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #FBBF24;
    margin-bottom: 6px;
  }
  .tg-live-dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: #4ADE80;
    display: inline-block;
    box-shadow: 0 0 8px #4ADE80;
    animation: liveDotPulse 1.5s ease-in-out infinite;
  }
  .tg-exp-title {
    font-family: 'Cinzel', serif;
    font-size: 1.18rem;
    font-weight: 900;
    color: #FFF8E7;
    letter-spacing: 0.5px;
    margin-bottom: 5px;
    text-shadow: 0 2px 10px rgba(0,0,0,0.6);
  }
  .tg-exp-subtitle {
    font-size: 0.9rem;
    color: #D1BDB0;
    line-height: 1.45;
  }
`;

// Insert animation styles if not already present
if (!prodContent.includes('@keyframes mediaAuraPulse')) {
  prodContent = prodContent.replace('</style>', `${animationStyles}\n</style>`);
}

// Enhance .tg-media-box with animation
prodContent = prodContent.replace(
  'box-shadow: 0 10px 35px var(--tg-shadow);\n    transition: max-width 0.35s cubic-bezier(0.4, 0, 0.2, 1), aspect-ratio 0.35s cubic-bezier(0.4, 0, 0.2, 1);',
  'box-shadow: 0 10px 35px var(--tg-shadow);\n    animation: mediaAuraPulse 4s ease-in-out infinite;\n    transition: max-width 0.35s cubic-bezier(0.4, 0, 0.2, 1), aspect-ratio 0.35s cubic-bezier(0.4, 0, 0.2, 1);'
);

// Enhance .tg-header-badge with animated gradient sweep
prodContent = prodContent.replace(
  'background: linear-gradient(90deg, #9E1B32, #D62839) !important;\n    color: #FFFFFF !important;\n    padding: 6px 18px;\n    border-radius: 999px;\n    font-weight: 800;\n    font-size: 0.82rem;\n    letter-spacing: 1.5px;\n    text-transform: uppercase;\n    box-shadow: 0 4px 15px rgba(214, 40, 57, 0.35);',
  'background: linear-gradient(135deg, #9E1B32, #D62839, #E65100, #FBBF24, #9E1B32) !important;\n    background-size: 300% 300% !important;\n    animation: badgeSweep 6s ease infinite !important;\n    color: #FFFFFF !important;\n    padding: 7px 20px;\n    border-radius: 999px;\n    font-weight: 800;\n    font-size: 0.82rem;\n    letter-spacing: 1.5px;\n    text-transform: uppercase;\n    box-shadow: 0 4px 18px rgba(214, 40, 57, 0.45);'
);

// Enhance .tg-add-to-cart-btn with animated shimmer
prodContent = prodContent.replace(
  'background: linear-gradient(90deg, #D62839, #E65100) !important;\n    color: #FFFFFF !important;\n    border: none;\n    padding: 16px 24px;\n    border-radius: 30px;\n    font-family: \'Outfit\', sans-serif;\n    font-weight: 900;\n    font-size: 1.15rem;\n    cursor: pointer;\n    box-shadow: 0 4px 20px rgba(214, 40, 57, 0.4);',
  'background: linear-gradient(135deg, #9E1B32, #D62839, #E65100, #FBBF24, #D62839) !important;\n    background-size: 250% 250% !important;\n    animation: btnGlowShimmer 4s ease infinite !important;\n    color: #FFFFFF !important;\n    border: none;\n    padding: 16px 24px;\n    border-radius: 30px;\n    font-family: \'Outfit\', sans-serif;\n    font-weight: 900;\n    font-size: 1.15rem;\n    cursor: pointer;\n    box-shadow: 0 4px 20px rgba(214, 40, 57, 0.45);'
);

// Enhance .tg-thumb-btn.active with thumbGlowPulse
prodContent = prodContent.replace(
  '.tg-thumb-btn.active {\n    border-color: var(--tg-border-active) !important;\n    box-shadow: 0 0 16px var(--tg-gold-glow) !important;\n    transform: translateY(-2px);\n  }',
  `.tg-thumb-btn.active {
    border-color: var(--tg-border-active) !important;
    animation: thumbGlowPulse 2.5s ease-in-out infinite alternate !important;
    transform: translateY(-2px);
  }`
);

// Add corner starbursts inside tg-media-box
if (!prodContent.includes('tg-corner-filigree')) {
  prodContent = prodContent.replace(
    '<div id="tg-media-box" class="tg-media-box is-video">',
    `<div id="tg-media-box" class="tg-media-box is-video">
      <!-- Twinkling Corner Starburst Filigrees -->
      <span class="tg-corner-filigree top-left" aria-hidden="true">&#10022;</span>
      <span class="tg-corner-filigree top-right" aria-hidden="true">&#10022;</span>
      <span class="tg-corner-filigree bottom-left" aria-hidden="true">&#10022;</span>
      <span class="tg-corner-filigree bottom-right" aria-hidden="true">&#10022;</span>`
  );
}

// Add the Spectacular Experience Banner below the post-media header
if (!prodContent.includes('tg-spectacular-experience-banner')) {
  prodContent = prodContent.replace(
    `      <div>
        <span class="tg-subcol-pill">
          {{ subcol_emoji }} {{ subcol_name }} &bull; Smart NFC Keepsake Card
        </span>
      </div>
    </div>`,
    `      <div>
        <span class="tg-subcol-pill">
          {{ subcol_emoji }} {{ subcol_name }} &bull; Smart NFC Keepsake Card
        </span>
      </div>

      <!-- Spectacular Live Interactive Experience Callout Banner -->
      <a href="{{ shopify_entertainment_page_url }}" target="_blank" rel="noopener noreferrer" class="tg-spectacular-experience-banner">
        <div class="tg-exp-badge">
          <span class="tg-live-dot"></span> LIVE WEB EXPERIENCE &bull; CARD #{{ card_code }}
        </div>
        <div class="tg-exp-title">
          &#10022; Launch Full Interactive Living Card Experience &#10022;
        </div>
        <div class="tg-exp-subtitle">
          Explore character lore, special abilities, festive indicators &amp; uninterrupted stop-motion video on shop.tapthingy.com &rarr;
        </div>
      </a>
    </div>`
  );
}

// Update the specs table to display both Live Web Experiences
const oldSpecsLive = `<tr style="border-bottom: 1px solid var(--tg-border);">
              <td style="padding: 10px 0; font-weight: 700; color: var(--tg-gold);">Live Web Experience:</td>
              <td style="padding: 10px 0; color: var(--tg-text);">
                <a href="{{ web_portal_url }}" target="_blank" style="color: var(--tg-gold); font-weight: 700; text-decoration: underline;">
                  {{ web_portal_url }}
                </a>
              </td>
            </tr>`;

const newSpecsLive = `<tr style="border-bottom: 1px solid var(--tg-border);">
              <td style="padding: 12px 0; font-weight: 700; color: var(--tg-gold); vertical-align: top;">Live Web Experience:</td>
              <td style="padding: 12px 0; color: var(--tg-text);">
                <div style="display: flex; flex-direction: column; gap: 8px;">
                  <div>
                    <span style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--tg-text-muted); font-weight: 700;">TapGreetings Portal:</span><br>
                    <a href="{{ web_portal_url }}" target="_blank" style="color: var(--tg-gold); font-weight: 700; text-decoration: underline; word-break: break-all;">
                      {{ web_portal_url }}
                    </a>
                  </div>
                  <div>
                    <span style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--tg-text-muted); font-weight: 700;">Shop Living Experience Page:</span><br>
                    <a href="{{ shopify_entertainment_page_url }}" target="_blank" style="color: #60A5FA; font-weight: 800; text-decoration: underline; word-break: break-all;">
                      {{ shopify_entertainment_page_url }}
                    </a>
                  </div>
                </div>
              </td>
            </tr>`;

prodContent = prodContent.replace(oldSpecsLive, newSpecsLive);
fs.writeFileSync(prodPagePath, prodContent, 'utf8');
console.log('✅ tapgreetings-product-page.liquid updated!');

// 2. Update tapgreetings-set-product-page.liquid
const setPagePath = path.join(__dirname, '../theme/sections/tapgreetings-set-product-page.liquid');
let setContent = fs.readFileSync(setPagePath, 'utf8');

// Insert animation styles if not already present
if (!setContent.includes('@keyframes mediaAuraPulse')) {
  setContent = setContent.replace('</style>', `${animationStyles}\n</style>`);
}

// Enhance .tg-media-viewport with animation
setContent = setContent.replace(
  'box-shadow: 0 10px 35px var(--tg-shadow);',
  'box-shadow: 0 10px 35px var(--tg-shadow);\n    animation: mediaAuraPulse 4s ease-in-out infinite;'
);

// Enhance .tg-set-badge with animated gradient sweep
setContent = setContent.replace(
  'background: linear-gradient(90deg, #9E1B32, #D62839) !important;\n    color: #FFFFFF !important;\n    padding: 6px 18px;\n    border-radius: 999px;\n    font-weight: 800;\n    font-size: 0.82rem;\n    letter-spacing: 1.5px;\n    text-transform: uppercase;\n    box-shadow: 0 4px 15px rgba(214, 40, 57, 0.35);',
  'background: linear-gradient(135deg, #9E1B32, #D62839, #E65100, #FBBF24, #9E1B32) !important;\n    background-size: 300% 300% !important;\n    animation: badgeSweep 6s ease infinite !important;\n    color: #FFFFFF !important;\n    padding: 7px 20px;\n    border-radius: 999px;\n    font-weight: 800;\n    font-size: 0.82rem;\n    letter-spacing: 1.5px;\n    text-transform: uppercase;\n    box-shadow: 0 4px 18px rgba(214, 40, 57, 0.45);'
);

// Enhance .tg-btn-atc with animated shimmer
setContent = setContent.replace(
  'background: linear-gradient(90deg, #9E1B32, #D62839);\n    color: #FFFFFF !important;\n    font-family: \'Outfit\', sans-serif;\n    font-size: 1.15rem;\n    font-weight: 800;\n    padding: 16px 20px;\n    border: none;\n    border-radius: 16px;\n    cursor: pointer;\n    box-shadow: 0 6px 22px rgba(214, 40, 57, 0.45);',
  'background: linear-gradient(135deg, #9E1B32, #D62839, #E65100, #FBBF24, #D62839) !important;\n    background-size: 250% 250% !important;\n    animation: btnGlowShimmer 4s ease infinite !important;\n    color: #FFFFFF !important;\n    font-family: \'Outfit\', sans-serif;\n    font-size: 1.15rem;\n    font-weight: 800;\n    padding: 16px 20px;\n    border: none;\n    border-radius: 16px;\n    cursor: pointer;\n    box-shadow: 0 6px 22px rgba(214, 40, 57, 0.45);'
);

// Enhance .tg-media-thumb-btn.active and .tg-var-btn.active
setContent = setContent.replace(
  '.tg-media-thumb-btn.active {\n    border-color: var(--tg-border-active) !important;\n    box-shadow: 0 0 16px var(--tg-gold-glow) !important;\n    transform: translateY(-2px);\n  }',
  `.tg-media-thumb-btn.active {
    border-color: var(--tg-border-active) !important;
    animation: thumbGlowPulse 2.5s ease-in-out infinite alternate !important;
    transform: translateY(-2px);
  }`
);

setContent = setContent.replace(
  '.tg-var-btn.active {\n    border-color: var(--tg-gold) !important;\n    box-shadow: 0 0 14px var(--tg-gold-glow) !important;\n    transform: scale(1.05);\n  }',
  `.tg-var-btn.active {
    border-color: var(--tg-gold) !important;
    animation: thumbGlowPulse 2.5s ease-in-out infinite alternate !important;
    transform: scale(1.05);
  }`
);

// Add corner starbursts inside tg-media-viewport
if (!setContent.includes('tg-corner-filigree')) {
  setContent = setContent.replace(
    '<div class="tg-media-viewport" id="tg-media-box">',
    `<div class="tg-media-viewport" id="tg-media-box">
        <!-- Twinkling Corner Starburst Filigrees -->
        <span class="tg-corner-filigree top-left" aria-hidden="true">&#10022;</span>
        <span class="tg-corner-filigree top-right" aria-hidden="true">&#10022;</span>
        <span class="tg-corner-filigree bottom-left" aria-hidden="true">&#10022;</span>
        <span class="tg-corner-filigree bottom-right" aria-hidden="true">&#10022;</span>`
  );
}

// Add the Spectacular Experience Banner below the header section
if (!setContent.includes('tg-spectacular-experience-banner')) {
  setContent = setContent.replace(
    `      <div class="tg-set-subtitle">
        Choose the Complete 16-Card Box Set or Select Any Individual Card Keepsake
      </div>
    </div>`,
    `      <div class="tg-set-subtitle">
        Choose the Complete 16-Card Box Set or Select Any Individual Card Keepsake
      </div>

      <!-- Spectacular Live Interactive Experience Callout Banner -->
      <a id="tg-set-banner-link" href="https://shop.tapthingy.com/pages/tghh001" target="_blank" rel="noopener noreferrer" class="tg-spectacular-experience-banner">
        <div class="tg-exp-badge">
          <span class="tg-live-dot"></span> LIVE WEB EXPERIENCE &bull; CARD #001
        </div>
        <div class="tg-exp-title">
          &#10022; Launch Full Interactive Living Card Experience &#10022;
        </div>
        <div class="tg-exp-subtitle">
          Explore character lore, special abilities, festive indicators &amp; uninterrupted stop-motion video on shop.tapthingy.com &rarr;
        </div>
      </a>
    </div>`
  );
}

// Update the specs table in set page
const oldSetSpecsLive = `              <tr>
                <td style="padding: 10px 0; font-weight: 700; color: var(--tg-gold);">Web Video Portal:</td>
                <td style="padding: 10px 0; color: var(--tg-text);">
                  <a href="https://tapgreetings.com" target="_blank" style="color: var(--tg-gold); font-weight: 700; text-decoration: underline;">
                    https://tapgreetings.com
                  </a>
                </td>
              </tr>`;

const newSetSpecsLive = `              <tr style="border-bottom: 1px solid var(--tg-border);">
                <td style="padding: 12px 0; font-weight: 700; color: var(--tg-gold); vertical-align: top;">Live Web Experience:</td>
                <td style="padding: 12px 0; color: var(--tg-text);">
                  <div style="display: flex; flex-direction: column; gap: 8px;">
                    <div>
                      <span style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--tg-text-muted); font-weight: 700;">TapGreetings Portal:</span><br>
                      <a id="tg-set-specs-portal-link" href="https://tapgreetings.com/001/" target="_blank" style="color: var(--tg-gold); font-weight: 700; text-decoration: underline; word-break: break-all;">
                        https://tapgreetings.com/001/
                      </a>
                    </div>
                    <div>
                      <span style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--tg-text-muted); font-weight: 700;">Shop Living Experience Page:</span><br>
                      <a id="tg-set-specs-shop-link" href="https://shop.tapthingy.com/pages/tghh001" target="_blank" style="color: #60A5FA; font-weight: 800; text-decoration: underline; word-break: break-all;">
                        https://shop.tapthingy.com/pages/tghh001
                      </a>
                    </div>
                  </div>
                </td>
              </tr>`;

setContent = setContent.replace(oldSetSpecsLive, newSetSpecsLive);

// Update JavaScript selectVariantById to dynamically update portal and shop links
if (!setContent.includes('tg-set-specs-shop-link')) {
  setContent = setContent.replace(
    'if (cardVid && vidSource && meta.video) {',
    `// Update live experience links and banner
    var code = (meta && meta.code && meta.code !== 'box') ? meta.code : '001';
    var portalUrl = (meta && meta.code === 'box') ? 'https://tapgreetings.com/#collection' : 'https://tapgreetings.com/' + code + '/';
    var shopUrl = 'https://shop.tapthingy.com/pages/tghh' + code;
    var bannerBadge = document.querySelector('#tg-set-banner-link .tg-exp-badge');
    var portalLink = document.getElementById('tg-set-specs-portal-link');
    var shopLink = document.getElementById('tg-set-specs-shop-link');
    var bannerLink = document.getElementById('tg-set-banner-link');

    if (portalLink) { portalLink.href = portalUrl; portalLink.innerText = portalUrl; }
    if (shopLink) { shopLink.href = shopUrl; shopLink.innerText = shopUrl; }
    if (bannerLink) { bannerLink.href = shopUrl; }
    if (bannerBadge) {
      bannerBadge.innerHTML = '<span class="tg-live-dot"></span> LIVE WEB EXPERIENCE &bull; ' + (meta && meta.code === 'box' ? 'MASTER COLLECTION' : 'CARD #' + code);
    }

    if (cardVid && vidSource && meta.video) {`
  );
}

fs.writeFileSync(setPagePath, setContent, 'utf8');
console.log('✅ tapgreetings-set-product-page.liquid updated!');
