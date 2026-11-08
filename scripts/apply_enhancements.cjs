const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'generate_cards.cjs.bak');
let code = fs.readFileSync(srcPath, 'utf8');

// 1. Add holidayOfficialData load
const importTarget = "const meta = masterData.series_metadata || {};";
const importAddition = `const meta = masterData.series_metadata || {};

// Load official holiday series text and indicators
const holidayOfficialPath = path.join(__dirname, '../data/holiday_series_official.json');
let holidayOfficialData = {};
if (fs.existsSync(holidayOfficialPath)) {
  try {
    holidayOfficialData = JSON.parse(fs.readFileSync(holidayOfficialPath, 'utf8'));
  } catch (e) {
    console.error('Failed reading holiday_series_official:', e.message);
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeJson(str) {
  if (!str) return '';
  return String(str)
    .replace(/\\\\/g, '\\\\\\\\')
    .replace(/"/g, '\\\\"')
    .replace(/\\n/g, '\\\\n')
    .replace(/\\r/g, '\\\\r')
    .replace(/\\t/g, '\\\\t');
}

// Exciting Animated Motto / Living Creed Card
function renderLivingCreed(char) {
  if (!char.motto) return '';
  return \`
    <div class="tghh-quote-card my-3 p-5 sm:p-6 rounded-3xl border border-amber-500/40 shadow-2xl relative overflow-hidden bg-gradient-to-br from-[#20120B] via-[#160D08] to-[#25130A]">
      <div class="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
      <div class="flex items-center gap-2 mb-2">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm animate-pulse">
          ✦ LIVING CREED &amp; MOTTO ✦
        </span>
      </div>
      <div class="relative">
        <span class="text-4xl sm:text-5xl font-serif text-amber-500/30 absolute -top-4 -left-2 select-none">&ldquo;</span>
        <p class="font-clayTitle text-lg sm:text-2xl font-bold bg-gradient-to-r from-amber-100 via-amber-200 to-rose-200 bg-clip-text text-transparent italic leading-relaxed pl-6 pr-2 pt-1 break-words">
          \${escapeHtml(char.motto)}
        </p>
      </div>
    </div>
  \`;
}

// Animated Special Abilities & Features
function renderSpecialAbilities(char) {
  if (!char.abilities) return '';
  return \`
    <div class="tghh-ability-card bg-gradient-to-br from-[#1C120C] to-[#140C08] p-4 sm:p-5 rounded-3xl border border-amber-600/40 shadow-xl relative overflow-hidden">
      <div class="flex items-center gap-2 mb-2">
        <span class="w-7 h-7 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 text-sm shadow-sm animate-bounce">
          ⚡
        </span>
        <span class="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-amber-300">
          Special Abilities &amp; Features
        </span>
      </div>
      <p class="text-base sm:text-lg text-amber-100/90 leading-relaxed font-body pl-1 break-words">
        \${escapeHtml(char.abilities)}
      </p>
    </div>
  \`;
}

// Animated NFC Tap Target Motif Card
function renderNfcMotif(char) {
  if (!char.nfcMotif) return '';
  return \`
    <div class="tghh-nfc-motif-card bg-gradient-to-br from-[#1A100B] to-[#120B07] p-4 sm:p-5 rounded-3xl border border-amber-600/40 shadow-xl relative overflow-hidden">
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-2">
          <div class="relative w-7 h-7 flex items-center justify-center">
            <span class="absolute w-full h-full rounded-full bg-rose-500/20 border border-rose-500/40 animate-ping"></span>
            <i class="fa-solid fa-satellite-dish text-rose-400 text-sm relative z-10"></i>
          </div>
          <span class="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-amber-300">
            NFC Tap Target Motif
          </span>
        </div>
        <span class="text-[10px] font-bold uppercase tracking-wider text-amber-400/80 bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-800/40">
          Contactless Chip
        </span>
      </div>
      <p class="text-base sm:text-lg text-amber-100/90 leading-relaxed font-body pl-1 break-words">
        \${escapeHtml(char.nfcMotif)}
      </p>
      <div class="mt-2.5 pt-2 border-t border-amber-900/40 text-xs sm:text-sm text-amber-300/80 flex items-center gap-2">
        <i class="fa-solid fa-mobile-screen text-rose-400"></i>
        <span>Touch smartphone to physical card motif to launch animation instantly.</span>
      </div>
    </div>
  \`;
}

// Animated Festive Character Indicators with Twinkling Stars & Meters
function renderOfficialIndicators(indicators) {
  if (!indicators || !Array.isArray(indicators)) return '';
  const itemsHtml = indicators.map(ind => {
    const starList = (ind.stars || '★★★★★').split('');
    const starsHtml = starList.map((st, i) => {
      const isGold = st === '★';
      const delayClass = \`star-twinkle-\${(i % 5) + 1}\`;
      return \`<span class="inline-block \${isGold ? delayClass + ' text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]' : 'text-amber-900/60'}">\${st}</span>\`;
    }).join(' ');

    const pct = Math.min(100, (ind.score || 5) * 20);

    return \`
      <div class="bg-[#1C120C]/90 p-3 sm:p-4 rounded-2xl border border-amber-800/40 shadow-inner flex flex-col justify-between">
        <div class="text-xs uppercase font-extrabold text-amber-200/90 tracking-wider truncate mb-1">
          \${escapeHtml(ind.name)}
        </div>
        <div class="flex items-center gap-1 text-base sm:text-lg font-bold my-1 tracking-widest">
          \${starsHtml}
        </div>
        <div class="w-full bg-[#100A06] h-2 rounded-full overflow-hidden border border-amber-900/50 mt-1">
          <div class="tghh-meter-fill h-full bg-gradient-to-r from-amber-500 via-rose-500 to-amber-300 rounded-full" style="width: \${pct}%;"></div>
        </div>
      </div>
    \`;
  }).join('');

  return \`
    <div class="bg-[#150D09]/95 p-4 sm:p-5 rounded-3xl border border-amber-700/40 shadow-xl min-w-0">
      <div class="flex items-center justify-between mb-3 border-b border-amber-900/40 pb-2">
        <span class="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
          <i class="fa-solid fa-chart-simple text-rose-400"></i> Festive Character Indicators
        </span>
        <span class="text-[10px] uppercase font-bold text-amber-400/80 tracking-widest bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-800/40">
          ★ Master Ratings ★
        </span>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        \${itemsHtml}
      </div>
    </div>
  \`;
}
`;

code = code.replace(importTarget, importAddition);

// 2. Update getHeadHtml definition and head tags
const headTarget = `function getHeadHtml(title, cardStyle = null, seoData = null, mediaData = null, canonicalUrl = '', isCardPage = false) {
  const metaDesc = seoData?.seo_meta_desc || 'TapGreetings: Handcrafted smart NFC living keepsake greeting cards.';
  const metaKeywords = (seoData?.keywords || ['tapgreetings', 'series 1', 'clay holiday card', 'needle felt', 'polymer clay', 'nfc card']).join(', ');
  const pageTitle = \`\${safe(title, 'TapGreetings')} | TapGreetings\`;
  const ogImg = resolveAssetPath(mediaData?.front_image_url || '/assets/img/cr80/001-front.jpg');
  const ogVideo = resolveAssetPath(mediaData?.video_url || '/assets/video/001-video.mp4');`;

const headReplacement = `function getHeadHtml(title, cardStyle = null, seoData = null, mediaData = null, canonicalUrl = '', isCardPage = false, extraData = null) {
  const metaDesc = seoData?.seo_meta_desc || 'TapGreetings: Handcrafted smart NFC living keepsake greeting cards.';
  const metaKeywords = (seoData?.keywords || ['tapgreetings', 'series 1', 'clay holiday card', 'needle felt', 'polymer clay', 'nfc card']).join(', ');
  const pageTitle = \`\${safe(title, 'TapGreetings')} | TapGreetings\`;
  const ogImg = resolveAssetPath(mediaData?.front_image_url || '/assets/img/cr80/001-front.jpg');
  const ogVideo = resolveAssetPath(mediaData?.video_url || '/assets/video/001-video.mp4');
  const char = extraData?.char || {};
  const card = extraData?.card || {};`;

code = code.replace(headTarget, headReplacement);

// 3. Add AI / AEO Meta Tags & Schema.org JSON-LD before </head>
const endHeadTarget = `        html.light #searchInput::placeholder {
            color: #9C7D68 !important;
        }
    </style>
</head>`;

const endHeadReplacement = `        html.light #searchInput::placeholder {
            color: #9C7D68 !important;
        }

        /* Star Twinkle Animations for Festive Indicators */
        @keyframes starTwinkle {
            0%, 100% { transform: scale(1); opacity: 0.85; }
            50% { transform: scale(1.3); opacity: 1; filter: drop-shadow(0 0 8px rgba(251, 191, 36, 1)); }
        }
        .star-twinkle-1 { animation: starTwinkle 2s ease-in-out infinite; }
        .star-twinkle-2 { animation: starTwinkle 2s ease-in-out infinite 0.25s; }
        .star-twinkle-3 { animation: starTwinkle 2s ease-in-out infinite 0.5s; }
        .star-twinkle-4 { animation: starTwinkle 2s ease-in-out infinite 0.75s; }
        .star-twinkle-5 { animation: starTwinkle 2s ease-in-out infinite 1s; }

        /* Progress Meter Glow Bar */
        @keyframes meterPulse {
            0%, 100% { opacity: 0.9; }
            50% { opacity: 1; box-shadow: 0 0 10px rgba(251, 191, 36, 0.6); }
        }
        .tghh-meter-fill {
            animation: meterPulse 2.5s ease-in-out infinite;
            transition: width 1s ease-out;
        }

        /* Card Glow Pulsing Border */
        @keyframes cardGlowPulse {
            0%, 100% { border-color: rgba(217, 119, 6, 0.35); box-shadow: 0 10px 25px -5px rgba(217, 119, 6, 0.1); }
            50% { border-color: rgba(245, 158, 11, 0.65); box-shadow: 0 15px 30px -5px rgba(245, 158, 11, 0.25); }
        }
        .tghh-quote-card, .tghh-ability-card, .tghh-nfc-motif-card {
            animation: cardGlowPulse 4s ease-in-out infinite;
        }
    </style>

    <!-- AI & Answer Engine Optimization (AEO) Meta Tags -->
    <meta name="ai-content-type" content="Physical Smart NFC Keepsake Greeting Card, CR80 Claymation Art, Living Audio/Video Experience">
    \${extraData && extraData.char ? \`
    <meta name="ai-character-name" content="\${escapeHtml(char.name || '')}">
    <meta name="ai-character-title" content="\${escapeHtml(char.title || '')}">
    <meta name="ai-character-series" content="\${escapeHtml(extraData.seriesName || 'Happy Holidays Series 1')}">
    <meta name="ai-character-motto" content="\${escapeHtml(char.motto || '')}">
    <meta name="ai-character-abilities" content="\${escapeHtml(char.abilities || '')}">
    <meta name="ai-character-nfc-motif" content="\${escapeHtml(char.nfcMotif || '')}">
    <meta name="ai-product-sku" content="TG-HH-\${card.card_code || '001'}">
    <meta name="ai-summary" content="\${escapeHtml(char.name)} (\${escapeHtml(char.title)}) - \${escapeHtml(char.motto)}. Handcrafted physical CR80 smart keepsake card by TapGreetings. Tap smartphone against card to instantly stream exclusive claymation animation and holiday greeting. Rewritable anytime with custom media.">
    \` : \`
    <meta name="ai-summary" content="TapGreetings: Handcrafted physical smart NFC living keepsake greeting cards. Tap any smartphone to stream exclusive claymation animation and audio greetings.">
    \`}

    <!-- Schema.org Structured Data (JSON-LD) for AI & Semantic Engines -->
    \${extraData && extraData.char ? \`
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Product",
          "@id": "\${canonicalUrl || 'https://tapgreetings.com'}#product",
          "name": "\${escapeJson(char.name)} (\${escapeJson(char.title)}) - TapGreetings Smart Keepsake Card",
          "description": "\${escapeJson(metaDesc)}",
          "image": "\${ogImg}",
          "brand": {
            "@type": "Brand",
            "name": "TapGreetings"
          },
          "sku": "TG-HH-\${card.card_code || '001'}",
          "category": "Greeting Cards > Smart Keepsake Cards",
          "offers": {
            "@type": "Offer",
            "price": "\${card.commerce?.price ? card.commerce.price.toFixed(2) : '14.99'}",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "url": "\${extraData.purchaseUrl || 'https://shop.tapthingy.com/products/happy-holidays-series-1'}"
          }
        },
        {
          "@type": "CreativeWork",
          "@id": "\${canonicalUrl || 'https://tapgreetings.com'}#creativework",
          "name": "\${escapeJson(char.name)} - \${escapeJson(char.title)}",
          "headline": "\${escapeJson(char.motto || '')}",
          "description": "\${escapeJson(char.micro_lore || metaDesc)}",
          "creator": {
            "@type": "Organization",
            "name": "TapGreetings",
            "url": "https://tapgreetings.com"
          },
          "genre": "Holiday Art, Claymation, Augmented Reality Keepsake",
          "keywords": "\${escapeJson(metaKeywords)}"
        },
        {
          "@type": "VideoObject",
          "@id": "\${canonicalUrl || 'https://tapgreetings.com'}#video",
          "name": "\${escapeJson(char.name)} Living Animation",
          "description": "\${escapeJson(char.motto || metaDesc)}",
          "thumbnailUrl": "\${ogImg}",
          "contentUrl": "\${ogVideo}",
          "embedUrl": "\${canonicalUrl || 'https://tapgreetings.com'}",
          "uploadDate": "2024-11-01T00:00:00Z"
        }
      ]
    }
    </script>
    \` : \`
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": "https://tapgreetings.com/#website",
      "url": "https://tapgreetings.com",
      "name": "TapGreetings",
      "description": "TapGreetings - Living Keepsake Smart NFC Greeting Cards. Tap any smartphone to stream exclusive claymation animation and audio greetings.",
      "publisher": {
        "@type": "Organization",
        "name": "TapGreetings",
        "url": "https://tapgreetings.com",
        "logo": "https://tapgreetings.com/assets/img/tapthingy-logo-white.png"
      }
    }
    </script>
    \`}
</head>`;

code = code.replace(endHeadTarget, endHeadReplacement);

// 4. Update Series 1 loop to merge holidayOfficialData, render living creed, abilities, motif, indicators, remove 2nd button, and audio persistence
const loopSearchTarget = `  const setVariantId = SERIES1_SET_VARIANTS[card.card_code];
  const setCardPurchaseUrl = setVariantId ? \`\${MASTER_SET_URL}?variant=\${setVariantId}\` : MASTER_SET_URL;

  const cardPageHtml = \`\${getHeadHtml(seo.seo_title || \`\${char.name} (\${char.title})\`, card.style_tokens, seo, media, card.web_address, true)}`;

const loopReplacement = `  const setVariantId = SERIES1_SET_VARIANTS[card.card_code];
  const setCardPurchaseUrl = setVariantId ? \`\${MASTER_SET_URL}?variant=\${setVariantId}\` : MASTER_SET_URL;

  // Merge official holiday series copy and metrics
  const official = holidayOfficialData[card.card_code];
  if (official) {
    if (official.name) char.name = official.name;
    if (official.title) char.title = official.title;
    if (official.motto) char.motto = official.motto;
    char.abilities = official.abilities;
    char.nfcMotif = official.nfcMotif;
    char.officialIndicators = official.indicators;
    if (official.series) card.series_name = official.series;
  }

  const extraData = {
    char,
    card,
    purchaseUrl: setCardPurchaseUrl,
    seriesName: card.series_name || 'Happy Holidays Series 1'
  };

  const cardPageHtml = \`\${getHeadHtml(seo.seo_title || \`\${char.name} (\${char.title})\`, card.style_tokens, seo, media, card.web_address, true, extraData)}`;

code = code.replace(loopSearchTarget, loopReplacement);

// 5. Update Desktop top banner typography to be larger
const desktopBannerTarget = `                <h1 class="font-clayTitle text-2xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-amber-100 via-amber-200 to-rose-200 bg-clip-text text-transparent drop-shadow-md break-words">
                    \${char.name}
                </h1>
                <p class="font-sans text-sm sm:text-base text-amber-300 font-semibold tracking-wide mt-1.5 break-words">
                    \${char.title} &bull; <span class="text-rose-300 italic font-serif">\${char.profile_theme}</span>
                </p>
                <p class="text-sm sm:text-base text-amber-100/90 italic max-w-xl mx-auto mt-2 px-2 leading-relaxed break-words">
                    &ldquo;\${char.motto}&rdquo;
                </p>`;

const desktopBannerReplacement = `                <h1 class="font-clayTitle text-3xl sm:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-amber-100 via-amber-200 to-rose-200 bg-clip-text text-transparent drop-shadow-md break-words">
                    \${char.name}
                </h1>
                <p class="font-sans text-base sm:text-lg text-amber-300 font-semibold tracking-wide mt-2 break-words">
                    \${char.title} &bull; <span class="text-rose-300 italic font-serif">\${char.profile_theme || card.series_name || 'Happy Holidays Series 1'}</span>
                </p>
                <p class="text-base sm:text-lg text-amber-100/90 italic max-w-2xl mx-auto mt-2 px-2 leading-relaxed break-words">
                    &ldquo;\${char.motto}&rdquo;
                </p>`;

code = code.replace(desktopBannerTarget, desktopBannerReplacement);

// 6. Update Swipe links to preserve audio
const swipeTarget = `                        <a href="/\${prevCard.card_code}/" class="hover:text-white flex items-center gap-1">
                            <i class="fa-solid fa-chevron-left text-rose-400"></i> Swipe Right: #\${prevCard.card_code}
                        </a>
                        <span class="text-[9px] uppercase tracking-wider text-amber-400/60 font-semibold flex items-center gap-1">
                            <i class="fa-solid fa-arrows-left-right text-amber-400"></i> Swipe Video
                        </span>
                        <a href="/\${nextCard.card_code}/" class="hover:text-white flex items-center gap-1">
                            Swipe Left: #\${nextCard.card_code} <i class="fa-solid fa-chevron-right text-rose-400"></i>
                        </a>`;

const swipeReplacement = `                        <a href="/\${prevCard.card_code}/" onclick="preserveAudio(this, event)" class="hover:text-white flex items-center gap-1">
                            <i class="fa-solid fa-chevron-left text-rose-400"></i> Swipe Right: #\${prevCard.card_code}
                        </a>
                        <span class="text-[9px] uppercase tracking-wider text-amber-400/60 font-semibold flex items-center gap-1">
                            <i class="fa-solid fa-arrows-left-right text-amber-400"></i> Swipe Video
                        </span>
                        <a href="/\${nextCard.card_code}/" onclick="preserveAudio(this, event)" class="hover:text-white flex items-center gap-1">
                            Swipe Left: #\${nextCard.card_code} <i class="fa-solid fa-chevron-right text-rose-400"></i>
                        </a>`;

code = code.replace(swipeTarget, swipeReplacement);

// 7. Update Column 2 with exact match
const col2Start = '<!-- COLUMN 2: Details + Physical Smart Card 3D Flip (Front/Back) + Fullscreen Zoom + Order Button -->';
const col2End = '<a href="${MASTER_SET_URL}" target="_blank" class="w-full bg-[#180E09] hover:bg-[#281810] text-amber-300 font-bold py-2.5 px-4 rounded-xl border border-amber-600/40 text-center flex items-center justify-center gap-2 transition-all text-xs sm:text-sm">\n                            <i class="fa-solid fa-boxes-stacked text-rose-400"></i> <span>Or Order Complete 16-Card Master Box Set &bull; $199.00 (Save $40)</span>\n                        </a>\n                    </div>';

const col2StartIdx = code.indexOf(col2Start);
const col2EndIdx = code.indexOf(col2End);

if (col2StartIdx !== -1 && col2EndIdx !== -1) {
  const oldCol2 = code.substring(col2StartIdx, col2EndIdx + col2End.length);
  const newCol2 = `<!-- COLUMN 2: 3D CARD, LIVING CREED, ABILITIES, MOTIF, ARTISAN LORE, STATS, PURCHASE -->
                <div class="order-2 flex flex-col gap-4 sm:gap-6 w-full min-w-0">
                    
                    <!-- Mobile Compact Title & Banner (Above 3D Card on phone) -->
                    <div class="lg:hidden text-center bg-[#150D09]/95 p-4 rounded-2xl border border-amber-700/40">
                        <span class="inline-block bg-gradient-to-r from-rose-700 to-amber-600 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                            SERIES 1 &bull; CARD #\${card.card_code} OF 016
                        </span>
                        <h1 class="font-clayTitle text-3xl font-extrabold bg-gradient-to-r from-amber-100 via-amber-200 to-rose-200 bg-clip-text text-transparent break-words">
                            \${char.name}
                        </h1>
                        <p class="font-sans text-base text-amber-300 font-semibold tracking-wide mt-1">
                            \${char.title} &bull; <span class="text-rose-300 italic font-serif">\${char.profile_theme || card.series_name || 'Happy Holidays Series 1'}</span>
                        </p>
                        \${renderKeywords(seo.keywords)}
                    </div>

                    <!-- Living Creed & Motto Card (Exciting Animated) -->
                    \${renderLivingCreed(char)}

                    <!-- Interactive Flippable 3D Physical Keepsake Card (Front & Back - CLEAN ARTWORK WITH NO OVERLAYS) -->
                    <div class="bg-[#150D09]/95 p-4 sm:p-5 rounded-3xl border border-amber-700/30 shadow-xl flex flex-col items-center min-w-0">
                        <div class="w-full flex justify-between items-center mb-3">
                            <span class="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                                <i class="fa-solid fa-id-card text-rose-400"></i> Physical CR80 Smart Card
                            </span>
                            <div class="flex items-center gap-2">
                                <button onclick="openCardZoom()" class="bg-[#241710] hover:bg-[#301F15] text-amber-300 text-xs sm:text-sm font-bold px-3 py-1.5 rounded-xl border border-amber-600/40 flex items-center gap-1.5 transition-all shadow" title="Open Fullscreen Zoom Lightbox">
                                    <i class="fa-solid fa-expand text-rose-400"></i> Zoom
                                </button>
                                <button onclick="toggleCardFlip()" class="bg-[#241710] hover:bg-[#301F15] text-amber-300 text-xs sm:text-sm font-bold px-3 py-1.5 rounded-xl border border-amber-600/40 flex items-center gap-1.5 transition-all shadow">
                                    <i class="fa-solid fa-arrows-rotate"></i> Flip
                                </button>
                            </div>
                        </div>

                        <!-- 3D Card Container (Clean, zero text overlays on the artwork - CR80 ratio) -->
                        <div class="perspective-container w-full max-w-[280px] sm:max-w-[320px] aspect-[54/86] cursor-pointer group my-1" onclick="toggleCardFlip()">
                            <div id="physicalCard3d" class="flip-card-inner relative w-full h-full shadow-2xl rounded-2xl">
                                <!-- FRONT FACE (Art Only) -->
                                <div class="flip-face bg-[#120C08] border-[2px] border-amber-600/40 flex items-center justify-center overflow-hidden">
                                    <img src="\${frontImg}" alt="\${char.name} Front Artwork" class="w-full h-full object-cover">
                                </div>
                                <!-- BACK FACE (Collectible Card Back Only) -->
                                <div class="flip-face flip-back bg-[#120C08] border-[2px] border-amber-600/40 flex items-center justify-center overflow-hidden">
                                    <img src="\${backImg}" alt="\${char.name} Back Design" class="w-full h-full object-cover">
                                </div>
                            </div>
                        </div>

                        <!-- Micro caption explaining tap to flip & zoom -->
                        <div class="mt-3 text-center flex items-center gap-2 text-xs sm:text-sm text-amber-200/70">
                            <span class="flex items-center gap-1"><i class="fa-solid fa-hand-pointer text-rose-400"></i> Tap card to flip</span>
                            <span>&bull;</span>
                            <span class="flex items-center gap-1 cursor-pointer hover:text-amber-300" onclick="openCardZoom()"><i class="fa-solid fa-magnifying-glass-plus text-amber-400"></i> Zoom fullscreen</span>
                        </div>
                    </div>

                    <!-- Special Abilities & Features -->
                    \${renderSpecialAbilities(char)}

                    <!-- NFC Tap Target Motif -->
                    \${renderNfcMotif(char)}

                    <!-- Festive Indicators / Character Stats -->
                    \${char.officialIndicators ? renderOfficialIndicators(char.officialIndicators) : renderIndicators(char.indicators)}

                    <!-- Living Keepsake & Artisan Craft Details (Larger Text) -->
                    <div class="bg-[#150D09]/95 p-4 sm:p-6 rounded-3xl border border-amber-700/30 shadow-xl relative min-w-0 flex flex-col gap-3.5">
                        <div>
                            <span class="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-300 block mb-1.5 flex items-center gap-1.5">
                                <i class="fa-solid fa-wand-magic-sparkles text-rose-400"></i> Smart Keepsake Experience
                            </span>
                            <p class="text-base sm:text-lg text-amber-100/90 leading-relaxed font-body break-words">
                                Tap this physical <strong>\${char.name}</strong> card against any smartphone (iPhone or Android) to instantly view the exclusive 1080p claymation video and character greeting—zero app download required. This card can also be reprogrammed anytime to play your own custom video message, family photos, voice note, or personal web link using our free NFC Web Tool at <a href="\${meta.tools_url}" target="_blank" class="text-rose-400 underline font-semibold hover:text-amber-300">/tools</a>!
                            </p>
                        </div>
                        <div class="pt-3 border-t border-amber-900/40">
                            <span class="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-400 block mb-1.5 flex items-center gap-1.5">
                                <i class="fa-solid fa-feather-pointed text-rose-400"></i> Clay Artisan Craft &amp; Lore
                            </span>
                            <p class="text-base sm:text-lg text-amber-100/80 leading-relaxed font-body italic break-words">
                                \${char.micro_lore}
                            </p>
                        </div>
                    </div>

                    <!-- Prompts Accordion -->
                    \${renderPromptsAccordion(prompts)}

                    <!-- Primary Full-Width Order Keepsake Card Button (Single Button, Removed 16-card set option) -->
                    <div class="pt-2 min-w-0 flex flex-col gap-2.5">
                        <a href="\${setCardPurchaseUrl}" target="_blank" class="w-full bg-gradient-to-r from-rose-700 via-rose-600 to-amber-600 hover:from-rose-600 hover:to-amber-500 text-white font-bold py-4 px-6 rounded-2xl shadow-xl shadow-rose-900/40 text-center flex items-center justify-center gap-2.5 transition-transform hover:scale-[1.01] text-base sm:text-lg">
                            <i class="fa-solid fa-cart-shopping"></i> <span>Order #\${card.card_code} in Happy Holidays Set &bull; $\${comm.price ? comm.price.toFixed(2) : '14.99'}</span>
                        </a>
                    </div>`;
  code = code.replace(oldCol2, newCol2);
  console.log('Successfully replaced Column 2!');
} else {
  console.error('Could not locate Column 2 target indices:', { col2StartIdx, col2EndIdx });
}

// 8. Update video audio persistence in script tag
const videoScriptTarget = `        // PERSISTENT UNMUTED SOUND & SEAMLESS NAVIGATION
        function initVideoPlayback() {
            var vid = document.getElementById('cardVideo');
            if (!vid) return;

            var soundPref = null;
            try { soundPref = localStorage.getItem('tg_sound'); } catch (e) {}

            // If user has unmuted anywhere or default on navigation, try unmuted playback
            if (soundPref === 'muted') {
                vid.muted = true;
                updateSoundUI(true);
            } else {
                vid.muted = false;
                var promise = vid.play();
                if (promise !== undefined) {
                    promise.catch(function(err) {
                        // Browser policy blocked unmuted autoplay; smoothly fallback to muted without intrusive overlay
                        vid.muted = true;
                        vid.play();
                        updateSoundUI(true);
                    }).then(function() {
                        updateSoundUI(vid.muted);
                    });
                }
            }
        }

        function toggleMute() {
            var vid = document.getElementById('cardVideo');
            if (!vid) return;

            vid.muted = !vid.muted;
            try {
                localStorage.setItem('tg_sound', vid.muted ? 'muted' : 'unmuted');
            } catch (e) {}
            updateSoundUI(vid.muted);
        }`;

const videoScriptReplacement = `        // PERSISTENT UNMUTED SOUND & SEAMLESS NAVIGATION
        function initVideoPlayback() {
            var vid = document.getElementById('cardVideo');
            if (!vid) return;

            var urlParams = new URLSearchParams(window.location.search);
            var soundParam = urlParams.get('sound');
            if (soundParam === '1') {
                try { localStorage.setItem('tg_sound', 'unmuted'); } catch (e) {}
            }

            var soundPref = null;
            try { soundPref = localStorage.getItem('tg_sound'); } catch (e) {}

            var wantsSound = (soundParam === '1' || soundPref === 'unmuted');

            if (wantsSound) {
                vid.muted = false;
                vid.removeAttribute('muted');
                var promise = vid.play();
                if (promise !== undefined) {
                    promise.then(function() {
                        updateSoundUI(false);
                    }).catch(function(err) {
                        console.log('Autoplay unmuted blocked by policy, will unmute on interaction:', err);
                        vid.muted = true;
                        vid.setAttribute('muted', '');
                        vid.play().catch(function() {});
                        updateSoundUI(true);
                        setupInteractionUnmute();
                    });
                }
            } else {
                vid.muted = true;
                vid.setAttribute('muted', '');
                vid.play().catch(function(e) {});
                updateSoundUI(true);
            }
        }

        var interactionListenerAttached = false;
        function setupInteractionUnmute() {
            if (interactionListenerAttached) return;
            interactionListenerAttached = true;
            function unlock() {
                var vid = document.getElementById('cardVideo');
                if (vid && vid.muted) {
                    vid.muted = false;
                    vid.removeAttribute('muted');
                    vid.play().then(function() {
                        updateSoundUI(false);
                    }).catch(function(e) {});
                }
                window.removeEventListener('click', unlock);
                window.removeEventListener('touchstart', unlock);
                window.removeEventListener('keydown', unlock);
                interactionListenerAttached = false;
            }
            window.addEventListener('click', unlock, { once: true, passive: true });
            window.addEventListener('touchstart', unlock, { once: true, passive: true });
            window.addEventListener('keydown', unlock, { once: true, passive: true });
        }

        function toggleMute() {
            var vid = document.getElementById('cardVideo');
            if (!vid) return;

            vid.muted = !vid.muted;
            if (vid.muted) {
                vid.setAttribute('muted', '');
            } else {
                vid.removeAttribute('muted');
            }
            try {
                localStorage.setItem('tg_sound', vid.muted ? 'muted' : 'unmuted');
            } catch (e) {}
            updateSoundUI(vid.muted);
        }

        function preserveAudio(link, e) {
            var vid = document.getElementById('cardVideo');
            var isUnmuted = (vid && !vid.muted) || (localStorage.getItem('tg_sound') === 'unmuted');
            if (isUnmuted) {
                var href = link.getAttribute('href');
                if (href && !href.includes('sound=1')) {
                    link.href = href + (href.includes('?') ? '&' : '?') + 'sound=1';
                }
            }
        }

        function navigatePreservingAudio(url) {
            var vid = document.getElementById('cardVideo');
            var isUnmuted = (vid && !vid.muted) || (localStorage.getItem('tg_sound') === 'unmuted');
            if (isUnmuted) {
                url += (url.includes('?') ? '&' : '?') + 'sound=1';
            }
            window.location.href = url;
        }`;

code = code.replace(videoScriptTarget, videoScriptReplacement);

// 9. Update touch swipe in script
const swipeTouchTarget = `                            if (deltaX < 0) {
                                // Swipe LEFT -> Go to NEXT Card
                                window.location.href = '/\${nextCard.card_code}/';
                            } else {
                                // Swipe RIGHT -> Go to PREVIOUS Card
                                window.location.href = '/\${prevCard.card_code}/';
                            }`;

const swipeTouchReplacement = `                            if (deltaX < 0) {
                                // Swipe LEFT -> Go to NEXT Card
                                navigatePreservingAudio('/\${nextCard.card_code}/');
                            } else {
                                // Swipe RIGHT -> Go to PREVIOUS Card
                                navigatePreservingAudio('/\${prevCard.card_code}/');
                            }`;

code = code.replace(swipeTouchTarget, swipeTouchReplacement);

// Write to generate_cards.cjs
const targetPath = path.join(__dirname, 'generate_cards.cjs');
fs.writeFileSync(targetPath, code, 'utf8');
console.log('Successfully wrote updated generate_cards.cjs!');
