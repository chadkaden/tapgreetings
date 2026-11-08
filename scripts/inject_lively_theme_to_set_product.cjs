const fs = require('fs');
const path = require('path');

const masterData = require('../data/greetings_master.json');
const holidayOfficial = require('../data/holiday_series_official.json');

// Build CARD_LORE_MAP
const loreMap = {};

// Box Set
loreMap['box'] = {
  code: 'box',
  name: 'Happy Holidays Master Collection',
  title: 'The Complete 16-Card Masterpiece Collection',
  craft: 'Handcrafted Polymer Clay & Needle-Felt Holiday Set',
  motto: 'Bring the warmth of handcrafted holiday wonder home—one magical tap at a time!',
  lore: 'The premier 16-card holiday keepsake master collection. Every card features handcrafted polymer clay characters, gold-foil detailing, and embedded NTAG215 rewritable smart chips nestled inside a luxury velvet-lined display box.',
  signatureMotif: 'Collector Velvet Box Set with Gold Foil Filigree & Certificate of Authenticity.',
  abilities: 'Unlocks the full 16-character digital archive, VIP collector updates, and all stop-motion animations in glorious 1080p.',
  nfcMotif: 'Dual NFC Master Target on the Collector Box Lid & All 16 Individual Cards.',
  indicators: [
    { name: 'Cheer', stars: '★★★★★', score: 5 },
    { name: 'Warmth', stars: '★★★★★', score: 5 },
    { name: 'Wonder', stars: '★★★★★', score: 5 }
  ]
};

// 16 Cards
masterData.cards.forEach(c => {
  const code = c.card_code;
  const off = holidayOfficial[code] || {};
  loreMap[code] = {
    code: code,
    name: off.name || c.character.name,
    title: off.title || c.character.title,
    craft: c.character.profile_theme || 'Handcrafted Polymer Clay & Needle Felt',
    motto: off.motto || c.character.motto,
    lore: c.character.micro_lore || '',
    signatureMotif: off.nfcMotif || c.character.signature_motif || '',
    abilities: off.abilities || '',
    nfcMotif: off.nfcMotif || '',
    indicators: off.indicators || [
      { name: 'Cheer', stars: '★★★★★', score: 5 },
      { name: 'Warmth', stars: '★★★★★', score: 5 },
      { name: 'Wonder', stars: '★★★★☆', score: 4 }
    ]
  };
});

const setSectionPath = path.join(__dirname, '../theme/sections/tapgreetings-set-product-page.liquid');
let content = fs.readFileSync(setSectionPath, 'utf8');

// 1. Add Themed Showcase CSS
const themedShowcaseStyles = `
  /* --- LIVELY THEMED CHARACTER SHOWCASE (MATCHES SHOP.TAPTHINGY.COM/PAGES) --- */
  .tghh-experience-wrap {
    font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background: #140C08 !important;
    color: #FFF8E7 !important;
    border-radius: 28px !important;
    padding: 28px 20px 40px !important;
    max-width: 680px;
    margin: 24px auto 36px;
    box-shadow: 0 12px 50px rgba(0,0,0,0.7), 0 0 35px rgba(251,191,36,0.18) !important;
    border: 2px solid rgba(251,191,36,0.4) !important;
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
    animation: cornerTwinkle 3s ease-in-out infinite alternate;
  }
  .tghh-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: linear-gradient(135deg, #9E1B32, #D62839, #E65100, #FBBF24, #9E1B32) !important;
    background-size: 300% 300% !important;
    animation: badgeSweep 6s ease infinite !important;
    color: #FFFFFF !important;
    padding: 7px 20px;
    border-radius: 999px;
    font-weight: 800;
    font-size: 0.82rem;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    box-shadow: 0 4px 18px rgba(214,40,57,0.45);
    margin-bottom: 12px;
  }
  .tghh-dyn-title {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 2.3rem;
    font-weight: 900;
    color: #FFFFFF !important;
    margin: 4px 0 6px;
    line-height: 1.2;
    text-shadow: 0 2px 12px rgba(0,0,0,0.6);
  }
  .tghh-dyn-subtitle {
    font-size: 1.05rem;
    color: #FBBF24 !important;
    font-weight: 700;
    margin-bottom: 18px;
  }
  .tghh-quote-box {
    border-left: 4px solid #FBBF24 !important;
    background: rgba(251,191,36,0.08) !important;
    padding: 16px 20px;
    border-radius: 0 16px 16px 0;
    margin: 20px 0;
    font-style: italic;
    color: #FDE68A !important;
    font-size: 1.1rem;
    line-height: 1.55;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    position: relative;
  }
  .tghh-quote-mark {
    font-size: 2.8rem;
    color: rgba(251,191,36,0.25);
    position: absolute;
    top: -8px;
    left: 8px;
    user-select: none;
    font-family: serif;
  }
  .tghh-lore-card {
    background: rgba(255,255,255,0.03) !important;
    border: 1px solid rgba(251,191,36,0.2) !important;
    border-radius: 18px;
    padding: 18px;
    margin: 18px 0;
    font-size: 0.95rem;
    line-height: 1.65;
    color: #FFF8E7;
  }
  .tghh-stats-row {
    display: flex;
    justify-content: space-around;
    align-items: center;
    background: rgba(255,255,255,0.04) !important;
    border: 1px solid rgba(251,191,36,0.3) !important;
    border-radius: 18px;
    padding: 14px 16px;
    margin: 20px 0;
    box-shadow: 0 4px 16px rgba(0,0,0,0.4);
  }
  .tghh-card-flip-wrap {
    perspective: 1000px;
    width: 100%;
    max-width: 320px;
    aspect-ratio: 53.98/85.60;
    margin: 18px auto;
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
  .tghh-ability-box {
    background: linear-gradient(135deg, rgba(28, 18, 12, 0.95), rgba(20, 12, 8, 0.95)) !important;
    border: 1.5px solid rgba(251, 191, 36, 0.35) !important;
    border-radius: 18px;
    padding: 16px 20px;
    margin: 16px 0;
    box-shadow: 0 6px 20px rgba(0,0,0,0.35);
  }
  .tghh-nfc-motif-box {
    background: linear-gradient(135deg, rgba(26, 16, 11, 0.95), rgba(18, 11, 7, 0.95)) !important;
    border: 1.5px solid rgba(251, 191, 36, 0.35) !important;
    border-radius: 18px;
    padding: 16px 20px;
    margin: 16px 0;
    box-shadow: 0 6px 20px rgba(0,0,0,0.35);
  }
  .tghh-radar-rings {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
  .tghh-radar-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #FBBF24;
    animation: liveDotPulse 1.8s infinite;
  }
  .tghh-radar-ring {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 1.5px solid #FBBF24;
    animation: liveDotPulse 1.8s infinite 0.3s;
  }
`;

if (!content.includes('tghh-experience-wrap')) {
  content = content.replace('</style>', `${themedShowcaseStyles}\n</style>`);
}

// 2. Build the HTML for the Lively Themed Showcase
const livelyThemedShowcaseHtml = `
    <!-- 3. Navigation (Back to Collection & View All) -->
    <div style="text-align: center; margin: 0 auto 20px; max-width: 720px;">
      <div class="tg-set-nav" style="margin-bottom: 14px; justify-content: center;">
        <a href="/collections/tapgreetings-series-1">
          &larr; Back to Series 1 Collection
        </a>
        <a href="https://tapgreetings.com/#collection" target="_blank">
          &#10022; View All 21 Cards on TapGreetings &rarr;
        </a>
      </div>
    </div>

    <!-- 4. Spectacular Lively Themed Character Showcase (Matches shop.tapthingy.com/pages/tghh001) -->
    <div class="tghh-experience-wrap">
      <!-- 4 Corner Starburst Accents -->
      <div class="tghh-corner" style="top: 14px; left: 16px;">&#10022;</div>
      <div class="tghh-corner" style="top: 14px; right: 16px;">&#10022;</div>
      <div class="tghh-corner" style="bottom: 14px; left: 16px;">&#10022;</div>
      <div class="tghh-corner" style="bottom: 14px; right: 16px;">&#10022;</div>

      <!-- Header Section -->
      <div style="text-align: center; margin: 0 0 16px;">
        <div id="tg-dyn-badge" class="tghh-badge">
          &#10022; TapGreetings Series 1 &bull; Card #001 of 016 &#10022;
        </div>
        <h2 id="tg-dyn-title" class="tghh-dyn-title">
          Santa
        </h2>
        <div id="tg-dyn-subtitle" class="tghh-dyn-subtitle">
          The Master Artisan &bull; <span style="font-style: italic; color: #FDE68A;">Matte Polymer Clay &amp; Needle Felt</span>
        </div>
      </div>

      <!-- Living Creed / Official Motto Quote Box -->
      <div class="tghh-quote-box">
        <span class="tghh-quote-mark">&ldquo;</span>
        <div style="position: relative; z-index: 2; padding-left: 20px;">
          <div style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: #FBBF24; margin-bottom: 4px;">
            &#10022; LIVING CREED &amp; MOTTO &#10022;
          </div>
          <p id="tg-dyn-motto" style="margin: 0; font-size: 1.15rem; font-weight: 700; line-height: 1.5; color: #FFF8E7;">
            &ldquo;Every heart has a spark of magic—share yours generously!&rdquo;
          </p>
        </div>
      </div>

      <!-- Character Lore & Artisan Backstory -->
      <div class="tghh-lore-card">
        <div style="font-size: 0.78rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: #FBBF24; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
          <span>&#10022;</span> <span>Artisan Craft &amp; Lore</span>
        </div>
        <p id="tg-dyn-lore" style="margin: 0 0 12px; font-size: 0.98rem; line-height: 1.7; color: #FFF8E7;">
          A round, plump clay Santa with soft thumbprint textures, sporting a matte cranberry coat with needle-felted wool collar and cuffs. He cradles a glowing gold-leaf key while winking from his cozy workshop shelf surrounded by wooden toys and fairy lights.
        </p>
        <p style="margin: 0; font-size: 0.9rem; color: #D1BDB0;">
          <strong style="color: #FBBF24;">Signature Motif:</strong> <span id="tg-dyn-motif">A sculpted golden sleigh bell with concentric sonar waves.</span>
        </p>
      </div>

      <!-- Festive Indicators Stats Row -->
      <div id="tg-dyn-indicators" class="tghh-stats-row">
        <div style="flex: 1; text-align: center;">
          <div style="font-size: 0.76rem; text-transform: uppercase; color: #FBBF24; font-weight: 800;">Cheer</div>
          <div style="font-size: 1.05rem; color: #FBBF24; margin-top: 2px;">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
        </div>
        <div style="border-left: 1px solid rgba(251,191,36,0.25); height: 32px;"></div>
        <div style="flex: 1; text-align: center;">
          <div style="font-size: 0.76rem; text-transform: uppercase; color: #FBBF24; font-weight: 800;">Warmth</div>
          <div style="font-size: 1.05rem; color: #FBBF24; margin-top: 2px;">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
        </div>
        <div style="border-left: 1px solid rgba(251,191,36,0.25); height: 32px;"></div>
        <div style="flex: 1; text-align: center;">
          <div style="font-size: 0.76rem; text-transform: uppercase; color: #FBBF24; font-weight: 800;">Wonder</div>
          <div style="font-size: 1.05rem; color: #FBBF24; margin-top: 2px;">&#9733;&#9733;&#9733;&#9733;&#9734;</div>
        </div>
      </div>

      <!-- Physical Keepsake 3D Card Flip (Front / Back) -->
      <div style="text-align: center; margin: 24px 0 16px;">
        <div style="font-size: 0.85rem; font-weight: 700; color: #FBBF24; margin-bottom: 8px;">
          &#128179; Physical Smart Keepsake Card (Click to Flip Front/Back)
        </div>
        <div class="tghh-card-flip-wrap" onclick="this.classList.toggle('flipped')" title="Click to Flip Front/Back">
          <div class="tghh-card-inner">
            <div class="tghh-card-face tghh-card-front">
              <img id="tg-dyn-flip-front" src="{{ product.images[1] | image_url: width: 800 }}" alt="Front Card Artwork" loading="lazy">
            </div>
            <div class="tghh-card-face tghh-card-back">
              <img id="tg-dyn-flip-back" src="{{ '001-back.jpg' | asset_url }}" alt="Back Card Artwork" loading="lazy">
            </div>
          </div>
        </div>
        <div style="font-size: 0.8rem; color: #D1BDB0; margin-top: 6px;">
          &#128070; Tap card above to flip between Front Artwork &amp; Collector Back
        </div>
      </div>

      <!-- Special Abilities & Features -->
      <div class="tghh-ability-box">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
          <span style="font-size: 1.1rem; color: #FBBF24;">&#9889;</span>
          <span style="font-size: 0.82rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #FBBF24;">
            Special Abilities &amp; Features
          </span>
        </div>
        <p id="tg-dyn-abilities" style="margin: 0; font-size: 0.94rem; line-height: 1.6; color: #FFF8E7;">
          Winks with a subtle magical twinkle; cradles a glowing gold-leaf key that unlocks holiday cheer.
        </p>
      </div>

      <!-- NFC Tap Target Motif -->
      <div class="tghh-nfc-motif-box">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 1.1rem; color: #FBBF24;">&#128246;</span>
            <span style="font-size: 0.82rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #FBBF24;">
              NFC Tap Target Motif
            </span>
          </div>
          <div class="tghh-radar-rings">
            <span class="tghh-radar-dot"></span>
            <span class="tghh-radar-ring"></span>
          </div>
        </div>
        <p id="tg-dyn-nfc-motif" style="margin: 0; font-size: 0.94rem; line-height: 1.6; color: #FFF8E7;">
          A sculpted golden sleigh bell with concentric sonar waves.
        </p>
      </div>

      <!-- Smart NFC Reprogrammability Lore Callout -->
      <div style="background: rgba(251, 191, 36, 0.08); border: 1.5px solid var(--tg-gold); border-radius: 18px; padding: 18px; margin: 20px 0 10px;">
        <h4 style="margin: 0 0 8px 0; color: var(--tg-gold); font-size: 1rem; font-weight: 800; display: flex; align-items: center; gap: 8px;">
          <span>&#128241;</span> <span>Tap to Stream &bull; Rewritable to Your Own Message Anytime!</span>
        </h4>
        <p style="margin: 0 0 10px 0; font-size: 0.92rem; line-height: 1.6; color: var(--tg-text);">
          <strong>Tap this card</strong> against the top edge of your iPhone or Android to instantly stream the 1080p claymation video and character greeting&mdash;zero app download required.
        </p>
        <p style="margin: 0; font-size: 0.88rem; line-height: 1.5; color: var(--tg-text-muted);">
          <strong>&#128260; Rewritable NTAG215 Microchip:</strong> Want to personalize this card? It can easily be reprogrammed to link to your own custom family holiday video, voice note, photos, or personalized greeting anytime using our free Web NFC Tool at <a href="https://shop.tapthingy.com/pages/tap-thingy-tools-nfc-reprogram-webtool-and-guide" target="_blank" style="color: var(--tg-gold); font-weight: 700; text-decoration: underline;">/tools</a>!
        </p>
      </div>

      <!-- Hardware Specs & Compatibility Table -->
      <div style="margin-top: 24px; padding-top: 18px; border-top: 1px solid rgba(251,191,36,0.25);">
        <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem; text-align: left;">
          <tbody>
            <tr style="border-bottom: 1px solid var(--tg-border);">
              <td style="padding: 10px 0; font-weight: 700; color: var(--tg-gold); width: 38%;">Smartphone Compatibility:</td>
              <td style="padding: 10px 0; color: var(--tg-text);">100% Compatible with iPhone (XS through 16 Pro) &amp; all NFC-enabled Android devices (Zero app required).</td>
            </tr>
            <tr style="border-bottom: 1px solid var(--tg-border);">
              <td style="padding: 10px 0; font-weight: 700; color: var(--tg-gold);">Card Format &amp; Specs:</td>
              <td style="padding: 10px 0; color: var(--tg-text);">Standard CR80 Credit Card Proportions (85.6mm &times; 53.98mm &times; 0.76mm / 30 mil).</td>
            </tr>
            <tr style="border-bottom: 1px solid var(--tg-border);">
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
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Bottom Order Button inside Showcase -->
      <div style="text-align: center; margin-top: 28px;">
        <button type="button" onclick="submitActiveForm()" class="tg-btn-atc" style="max-width: 440px; margin: 0 auto;">
          <span>&#128722; Order Selected Keepsake &bull; </span>
          <span id="tg-btn-price-bottom-showcase">{{ product.selected_or_first_available_variant.price | money }}</span>
        </button>
      </div>

    </div>
`;

// Replace sections 3 & 4 with livelyThemedShowcaseHtml
const targetOldSectionRegex = /<!-- 3\. Navigation & Header Section[\s\S]*?<\/details>\s*<\/div>/;
if (targetOldSectionRegex.test(content)) {
  content = content.replace(targetOldSectionRegex, livelyThemedShowcaseHtml);
} else {
  console.log('Regex did not match exactly, searching by landmark markers...');
  const startIdx = content.indexOf('<!-- 3. Navigation & Header Section');
  const endMarker = '<!-- 4. Detailed Accordions with Enhanced Reprogrammability Lore -->';
  const endIdx = content.indexOf('</div>\n\n  </div>\n</div>\n\n<script>');
  if (startIdx !== -1 && endIdx !== -1) {
    content = content.substring(0, startIdx) + livelyThemedShowcaseHtml + content.substring(endIdx);
  }
}

// 3. Inject CARD_LORE_MAP into the <script>
const loreMapJson = JSON.stringify(loreMap, null, 2);
const loreScript = `
  // Full Card Lore, Motto, Abilities, Motif & Indicators Map
  var CARD_LORE_MAP = ${loreMapJson};

  function updateLivingCardShowcase(code, variantId) {
    var data = CARD_LORE_MAP[code] || CARD_LORE_MAP['001'];
    if (!data) return;

    var badgeEl = document.getElementById('tg-dyn-badge');
    var titleEl = document.getElementById('tg-dyn-title');
    var subEl = document.getElementById('tg-dyn-subtitle');
    var mottoEl = document.getElementById('tg-dyn-motto');
    var loreEl = document.getElementById('tg-dyn-lore');
    var motifEl = document.getElementById('tg-dyn-motif');
    var abilitiesEl = document.getElementById('tg-dyn-abilities');
    var nfcMotifEl = document.getElementById('tg-dyn-nfc-motif');
    var indicatorsEl = document.getElementById('tg-dyn-indicators');
    var flipFrontEl = document.getElementById('tg-dyn-flip-front');
    var flipBackEl = document.getElementById('tg-dyn-flip-back');

    if (badgeEl) {
      badgeEl.innerText = (code === 'box') ? '✦ TAPGREETINGS SERIES 1 • MASTER COLLECTION ✦' : '✦ TAPGREETINGS SERIES 1 • CARD #' + code + ' OF 016 ✦';
    }
    if (titleEl) titleEl.innerText = data.name;
    if (subEl) {
      subEl.innerHTML = data.title + ' &bull; <span style="font-style: italic; color: #FDE68A;">' + data.craft + '</span>';
    }
    if (mottoEl) mottoEl.innerText = '“' + data.motto + '”';
    if (loreEl) loreEl.innerText = data.lore;
    if (motifEl) motifEl.innerText = data.signatureMotif;
    if (abilitiesEl) abilitiesEl.innerText = data.abilities;
    if (nfcMotifEl) nfcMotifEl.innerText = data.nfcMotif;

    // Render Indicators
    if (indicatorsEl && data.indicators) {
      var indHtml = '';
      data.indicators.forEach(function(ind, idx) {
        if (idx > 0) {
          indHtml += '<div style="border-left: 1px solid rgba(251,191,36,0.25); height: 32px;"></div>';
        }
        indHtml += '<div style="flex: 1; text-align: center;">';
        indHtml += '<div style="font-size: 0.76rem; text-transform: uppercase; color: #FBBF24; font-weight: 800;">' + ind.name + '</div>';
        indHtml += '<div style="font-size: 1.05rem; color: #FBBF24; margin-top: 2px; text-shadow: 0 0 10px rgba(251,191,36,0.6);">' + ind.stars + '</div>';
        indHtml += '</div>';
      });
      indicatorsEl.innerHTML = indHtml;
    }

    // Update 3D Flip Card Images
    var meta = variantMeta[variantId];
    if (meta) {
      if (flipFrontEl && meta.front) flipFrontEl.src = meta.front;
      if (flipBackEl && meta.back) flipBackEl.src = meta.back;
    }
  }
`;

if (!content.includes('CARD_LORE_MAP')) {
  content = content.replace('var variantMeta = {', `${loreScript}\n  var variantMeta = {`);
}

// 4. Update selectVariantById to call updateLivingCardShowcase and update showcase atc price
const oldSelectEnd = `    var btnPriceTop = document.getElementById('tg-btn-price-top');
    var btnPriceBottom = document.getElementById('tg-btn-price-bottom');`;

const newSelectEnd = `    var btnPriceTop = document.getElementById('tg-btn-price-top');
    var btnPriceBottom = document.getElementById('tg-btn-price-bottom');
    var btnPriceShowcase = document.getElementById('tg-btn-price-bottom-showcase');`;

content = content.replace(oldSelectEnd, newSelectEnd);
content = content.replace(
  "if (btnPriceBottom) btnPriceBottom.innerText = price;",
  "if (btnPriceBottom) btnPriceBottom.innerText = price;\n        if (btnPriceShowcase) btnPriceShowcase.innerText = price;"
);

// Call updateLivingCardShowcase inside selectVariantById
if (!content.includes('updateLivingCardShowcase(code, variantId);')) {
  content = content.replace(
    "if (bannerBadge) {",
    "updateLivingCardShowcase(code, variantId);\n\n    if (bannerBadge) {"
  );
}

fs.writeFileSync(setSectionPath, content, 'utf8');
console.log('✅ tapgreetings-set-product-page.liquid successfully upgraded with lively themed showcase!');
