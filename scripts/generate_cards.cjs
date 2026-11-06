const fs = require('fs');
const path = require('path');

// Load Single Source of Truth Master Data
const masterFilePath = path.join(__dirname, '../data/greetings_master.json');
const rawData = fs.readFileSync(masterFilePath, 'utf8');
const masterData = JSON.parse(rawData);

const projectRoot = path.join(__dirname, '..');
const cards = masterData.cards || [];
const meta = masterData.series_metadata || {};

function safe(str, fallback = '') {
  return str || fallback;
}

// Convert any path or full URL into a clean root-relative web path
function resolveAssetPath(filePath) {
  if (!filePath) return '';
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
    const match = filePath.match(/https?:\/\/[^\/]+(\/assets\/.*)$/i);
    if (match) return match[1];
    return filePath;
  }
  if (filePath.startsWith('/')) return filePath;
  return '/' + filePath.replace(/^\.\//, '');
}

// Clean HTML snippet helpers
function renderKeywords(keywords) {
  if (!keywords || !Array.isArray(keywords) || keywords.length === 0) return '';
  const pills = keywords.map(kw => `<span class="text-[10px] bg-[#231710]/90 text-amber-200/90 border border-amber-900/40 px-2.5 py-0.5 rounded-full font-medium">#${kw}</span>`).join('');
  return `<div class="flex flex-wrap justify-center gap-1.5 mt-2.5 max-w-2xl mx-auto">${pills}</div>`;
}

function renderIndicators(indicators) {
  if (!indicators || typeof indicators !== 'object') return '';
  const items = Object.entries(indicators).map(([key, val]) => `
    <div class="bg-[#1C120C]/90 p-2.5 rounded-2xl border border-amber-800/30 min-w-0 overflow-hidden shadow-inner">
        <div class="text-[9px] uppercase font-bold text-amber-200/80 tracking-wider truncate">${key.replace(/_/g, ' ')}</div>
        <div class="font-sans text-xs sm:text-sm font-bold text-amber-300 mt-1 tracking-wider truncate">${val}</div>
    </div>
  `).join('');
  return `
    <div class="bg-[#150D09]/95 p-4 sm:p-5 rounded-3xl border border-amber-700/30 shadow-xl min-w-0">
        <span class="text-[11px] font-bold uppercase tracking-wider text-amber-300 block mb-3 flex items-center gap-1.5">
            <i class="fa-solid fa-star text-amber-400"></i> Festive Indicators &amp; Character Stats
        </span>
        <div class="grid grid-cols-3 gap-2 text-center min-w-0">
            ${items}
        </div>
    </div>
  `;
}

function renderPromptsAccordion(prompts) {
  if (!prompts || !prompts.prompt_front_artwork) return '';
  return `
    <details class="bg-[#150D09]/70 p-4 rounded-2xl border border-amber-900/40 group min-w-0">
        <summary class="cursor-pointer text-xs font-bold text-amber-200/90 flex justify-between items-center select-none">
            <span class="flex items-center gap-1.5"><i class="fa-solid fa-wand-magic-sparkles text-rose-400"></i> Artisan Clay Prompts &amp; Specs</span>
            <span class="text-amber-400 group-open:rotate-180 transition-transform">&darr;</span>
        </summary>
        <div class="mt-3 flex flex-col gap-2.5 text-xs border-t border-amber-900/40 pt-3 min-w-0">
            <div>
                <span class="font-bold text-amber-300 block mb-1">Front Miniature Studio Prompt:</span>
                <div class="bg-[#1A100B] p-2.5 rounded-xl border border-amber-950 text-slate-300 font-mono text-[11px] leading-relaxed break-words whitespace-pre-wrap">
                    ${prompts.prompt_front_artwork}
                </div>
            </div>
            ${prompts.prompt_motion_video ? `
            <div>
                <span class="font-bold text-amber-300 block mb-1">Stop-Motion Claymation Video Prompt:</span>
                <div class="bg-[#1A100B] p-2.5 rounded-xl border border-amber-950 text-slate-300 font-mono text-[11px] leading-relaxed break-words whitespace-pre-wrap">
                    ${prompts.prompt_motion_video}
                </div>
            </div>
            ` : ''}
        </div>
    </details>
  `;
}

// Common HTML Head template with comprehensive Dark & Light Mode Support
function getHeadHtml(title, cardStyle = null, seoData = null, mediaData = null, canonicalUrl = '') {
  const metaDesc = seoData?.seo_meta_desc || 'TapGreetings Series 1: Handcrafted polymer clay and needle-felt smart NFC holiday greeting cards.';
  const metaKeywords = (seoData?.keywords || ['tapgreetings', 'series 1', 'clay holiday card', 'needle felt', 'polymer clay', 'nfc card']).join(', ');
  const pageTitle = `${safe(title, 'TapGreetings')} | TapGreetings Series 1`;
  const ogImg = resolveAssetPath(mediaData?.front_image_url || '/assets/img/001-front.jpg');
  const ogVideo = resolveAssetPath(mediaData?.video_url || '/assets/video/001-video.mp4');

  return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">
    <title>${pageTitle}</title>
    
    <!-- Instant Theme Detection Before Render -->
    <script>
        (function() {
            try {
                var saved = localStorage.getItem('tg_theme');
                if (saved === 'light') {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                } else {
                    document.documentElement.classList.remove('light');
                    document.documentElement.classList.add('dark');
                }
            } catch (e) {}
        })();
    </script>

    <!-- Primary SEO Meta Tags -->
    <meta name="title" content="${pageTitle}">
    <meta name="description" content="${metaDesc}">
    <meta name="keywords" content="${metaKeywords}">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="${canonicalUrl || 'https://tapgreetings.com'}">

    <!-- Open Graph / Facebook / WhatsApp -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="${canonicalUrl || 'https://tapgreetings.com'}">
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${metaDesc}">
    <meta property="og:image" content="${ogImg}">
    <meta property="og:video" content="${ogVideo}">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="${canonicalUrl || 'https://tapgreetings.com'}">
    <meta property="twitter:title" content="${pageTitle}">
    <meta property="twitter:description" content="${metaDesc}">
    <meta property="twitter:image" content="${ogImg}">

    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        mocha: '#241711',
                        cranberry: '#9E1B32',
                        forest: '#23412B',
                        buttercream: '#FFF8E7',
                        cherry: '#D62839',
                        mint: '#A8DADC',
                        goldFoil: '#FBBF24'
                    },
                    fontFamily: {
                        clayTitle: ['"Cooper Black"', '"Recraft"', '"Playfair Display"', 'serif'],
                        serif: ['"Playfair Display"', 'Georgia', 'serif'],
                        sans: ['"Montserrat"', '"Plus Jakarta Sans"', 'sans-serif'],
                        body: ['"Poppins"', 'Inter', 'sans-serif']
                    }
                }
            }
        }
    </script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,700;1,400&family=Montserrat:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;0,900;1,400&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <!-- Canvas Confetti Library -->
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js"></script>

    <style>
        * {
            box-sizing: border-box;
        }
        html, body {
            overflow-x: hidden;
            width: 100%;
            max-width: 100vw;
            background-color: #120C08;
            transition: background-color 0.3s ease, color 0.3s ease;
        }
        .break-anywhere {
            overflow-wrap: anywhere;
            word-break: break-word;
        }
        .glow-amber {
            box-shadow: 0 0 35px -5px rgba(251, 191, 36, 0.25);
        }
        .glow-rose {
            box-shadow: 0 0 35px -5px rgba(244, 63, 94, 0.35);
        }
        .clay-corner {
            position: absolute;
            width: 18px;
            height: 18px;
            color: #FBBF24;
            font-size: 15px;
            line-height: 1;
            user-select: none;
            pointer-events: none;
            filter: drop-shadow(0 0 4px #F59E0B);
        }
        /* Bulletproof 3D Perspective Flip */
        .perspective-container {
            perspective: 1200px;
            -webkit-perspective: 1200px;
        }
        .card-3d {
            position: relative;
            width: 100%;
            height: 100%;
            transform-style: preserve-3d;
            -webkit-transform-style: preserve-3d;
            transition: transform 0.65s cubic-bezier(0.4, 0.2, 0.2, 1);
        }
        .card-3d.flipped {
            transform: rotateY(180deg);
            -webkit-transform: rotateY(180deg);
        }
        .card-face {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
            border-radius: 1.25rem;
            overflow: hidden;
        }
        .card-face-front {
            transform: rotateY(0deg);
            -webkit-transform: rotateY(0deg);
        }
        .card-face-back {
            transform: rotateY(180deg);
            -webkit-transform: rotateY(180deg);
        }

        /* COMPREHENSIVE LIGHT MODE THEME OVERRIDES */
        html.light {
            color-scheme: light;
        }
        html.light body {
            background-color: #FAF6F0 !important;
            color: #26160F !important;
        }
        html.light header {
            background-color: rgba(255, 253, 249, 0.96) !important;
            border-color: #E6D7C8 !important;
        }
        html.light header a,
        html.light header nav a {
            color: #3D2214 !important;
        }
        html.light header nav a:hover {
            color: #B91C1C !important;
        }
        html.light .bg-\[\#120C08\],
        html.light .bg-\[\#140D08\] {
            background-color: #FAF4EB !important;
            border-color: #E2D2C0 !important;
        }
        html.light .bg-\[\#160E09\]\/95,
        html.light .bg-\[\#160E09\] {
            background-color: #FFFDF9 !important;
            border-color: #E2D2C0 !important;
        }
        html.light .bg-\[\#1A110C\]\/95,
        html.light .bg-\[\#1A110C\] {
            background-color: #FFFFFF !important;
            border-color: #E8DACB !important;
            box-shadow: 0 10px 25px -5px rgba(60, 30, 10, 0.08) !important;
        }
        html.light .bg-\[\#150D09\]\/95,
        html.light .bg-\[\#150D09\],
        html.light .bg-\[\#150D09\]\/70 {
            background-color: #F8F2E8 !important;
            border-color: #E5D5C4 !important;
        }
        html.light .bg-\[\#1C120C\]\/90,
        html.light .bg-\[\#1C120C\] {
            background-color: #F3ECE0 !important;
            border-color: #E0CFC0 !important;
        }
        html.light .bg-\[\#241710\] {
            background-color: #EFE4D6 !important;
            border-color: #D8C3B0 !important;
        }
        html.light .bg-\[\#20140D\] {
            background-color: #EFE5D8 !important;
            border-color: #D8C3B0 !important;
        }
        html.light .bg-\[\#1F140E\] {
            background-color: #F3ECE0 !important;
            border-color: #E0CFC0 !important;
        }
        html.light .bg-\[\#0E0704\] {
            background-color: #F5EFEB !important;
            border-color: #E2D2C0 !important;
        }
        html.light .text-white {
            color: #1F1108 !important;
        }
        html.light .text-amber-50,
        html.light .text-amber-100,
        html.light .text-amber-100\/90,
        html.light .text-amber-100\/80 {
            color: #382012 !important;
        }
        html.light .text-amber-200,
        html.light .text-amber-200\/95,
        html.light .text-amber-200\/90,
        html.light .text-amber-200\/80,
        html.light .text-amber-200\/70 {
            color: #5C3214 !important;
        }
        html.light .text-amber-300 {
            color: #8C430B !important;
        }
        html.light .text-amber-400 {
            color: #A34E0E !important;
        }
        html.light .border-amber-600\/40,
        html.light .border-amber-600\/50,
        html.light .border-amber-600\/70,
        html.light .border-amber-700\/30,
        html.light .border-amber-700\/40,
        html.light .border-amber-800\/30,
        html.light .border-amber-800\/40,
        html.light .border-amber-900\/40 {
            border-color: #E2D2C0 !important;
        }
        html.light .glow-amber {
            box-shadow: 0 0 25px 0 rgba(217, 119, 6, 0.12) !important;
        }
        html.light footer {
            background-color: #F5EFEB !important;
            border-color: #E5D6C8 !important;
        }
        html.light footer .text-slate-200 {
            color: #24140B !important;
        }
        html.light footer .text-slate-400,
        html.light footer .text-slate-500 {
            color: #6C5240 !important;
        }
        html.light #searchInput {
            background-color: #FFFFFF !important;
            color: #24140B !important;
            border-color: #DAC7B5 !important;
        }
        html.light #searchInput::placeholder {
            color: #9C7D68 !important;
        }
    </style>
</head>
<body class="font-sans bg-[#120C08] text-amber-50 min-h-screen transition-colors duration-300 selection:bg-rose-600 selection:text-white flex flex-col justify-between overflow-x-hidden">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-[#160E09]/95 backdrop-blur-md border-b border-amber-900/40 px-4 sm:px-8 py-3.5 flex justify-between items-center shadow-xl w-full">
        <a href="/" class="font-header text-lg sm:text-2xl font-bold text-white flex items-center gap-2 sm:gap-2.5 drop-shadow-[0_0_15px_rgba(251,191,36,0.35)] flex-shrink-0">
            <span class="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-700 via-amber-600 to-amber-300 flex items-center justify-center text-xs sm:text-sm font-black text-white shadow-md">TG</span>
            <div class="flex flex-col">
                <span class="tracking-tight leading-none">TapGreetings</span>
                <span class="text-[9px] text-amber-300 uppercase tracking-widest font-semibold mt-0.5">Series 1 &bull; Clay &amp; Needle Felt</span>
            </div>
        </a>
        <div class="flex items-center gap-3 sm:gap-6">
            <nav class="hidden md:flex gap-6 text-sm font-semibold text-amber-200/90">
                <a href="/" class="hover:text-amber-300 transition-colors">Home</a>
                <a href="/#collection" class="hover:text-amber-300 transition-colors">Series 1 (001–010)</a>
                <a href="${meta.custom_designer_url}" target="_blank" class="hover:text-amber-300 transition-colors">Custom Keepsake</a>
                <a href="${meta.tools_url}" target="_blank" class="hover:text-amber-300 transition-colors">NFC Webtool</a>
            </nav>
            <a href="${meta.shop_url}" target="_blank" class="bg-gradient-to-r from-rose-700 via-rose-600 to-amber-600 hover:from-rose-600 hover:to-amber-500 text-white text-xs font-bold px-3 sm:px-4 py-2 rounded-xl shadow transition-transform hover:scale-105 flex items-center gap-1.5">
                <i class="fa-solid fa-cart-shopping"></i> <span class="hidden sm:inline">Shop</span> Series 1
            </a>
            <button onclick="toggleTheme()" class="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#20140D] border border-amber-800/40 text-amber-300 flex items-center justify-center shadow hover:scale-105 transition-transform" title="Toggle Light/Dark Mode">
                <i class="fa-solid fa-moon" id="themeIcon"></i>
            </button>
        </div>
    </header>
    <script>
        function toggleTheme() {
            var html = document.documentElement;
            var icon = document.getElementById('themeIcon');
            if (html.classList.contains('light')) {
                html.classList.remove('light');
                html.classList.add('dark');
                try { localStorage.setItem('tg_theme', 'dark'); } catch (e) {}
                if (icon) icon.className = 'fa-solid fa-moon';
            } else {
                html.classList.remove('dark');
                html.classList.add('light');
                try { localStorage.setItem('tg_theme', 'light'); } catch (e) {}
                if (icon) icon.className = 'fa-solid fa-sun';
            }
        }
        document.addEventListener('DOMContentLoaded', function() {
            var isLight = document.documentElement.classList.contains('light');
            var icon = document.getElementById('themeIcon');
            if (icon) icon.className = isLight ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        });
    </script>
`;
}

// Clean Reverted Footer with LLC and specified text removed
function getFooterHtml() {
  return `
    <footer class="w-full text-center py-10 px-4 text-xs sm:text-sm text-slate-400 border-t border-slate-800/80 mt-14 sm:mt-20 flex flex-col items-center gap-5 bg-[#0E0704]">
        <div class="flex flex-wrap justify-center gap-6 text-xl text-rose-400">
            <a href="https://tiktok.com/@tapthingy" target="_blank" class="hover:text-amber-300 transition-transform hover:scale-110" title="TikTok"><i class="fa-brands fa-tiktok"></i></a>
            <a href="https://instagram.com/tapthingy" target="_blank" class="hover:text-amber-300 transition-transform hover:scale-110" title="Instagram"><i class="fa-brands fa-instagram"></i></a>
            <a href="https://youtube.com/@tapthingy" target="_blank" class="hover:text-amber-300 transition-transform hover:scale-110" title="YouTube"><i class="fa-brands fa-youtube"></i></a>
            <a href="https://x.com/tapthingy" target="_blank" class="hover:text-amber-300 transition-transform hover:scale-110" title="X / Twitter"><i class="fa-brands fa-x-twitter"></i></a>
        </div>
        <div class="max-w-xl text-center space-y-1.5 px-2">
            <p class="font-bold text-slate-200">
                TapGreetings &bull; Smart NFC Living Keepsake Greeting Cards
            </p>
            <p class="leading-relaxed text-slate-400 text-xs">
                Powered by <a href="https://tapthingy.com" target="_blank" class="text-rose-400 font-bold hover:underline">TapThingy</a>.
            </p>
        </div>
        <div class="flex flex-wrap justify-center gap-4 text-xs text-slate-400">
            <a href="https://shop.tapthingy.com/collections/all" target="_blank" class="hover:text-amber-300">Shop Collection</a>
            <span>&bull;</span>
            <a href="https://shop.tapthingy.com/products/tap-thingy-nfc-custom-pvc-card" target="_blank" class="hover:text-amber-300">Custom Video Studio</a>
            <span>&bull;</span>
            <a href="https://shop.tapthingy.com/pages/tap-thingy-tools-nfc-reprogram-webtool-and-guide" target="_blank" class="hover:text-rose-300">NFC Tools Guide</a>
        </div>
        <p class="text-[11px] text-slate-500">
            &copy; 2026 TapGreetings &bull; TapThingy. All rights reserved.
        </p>
    </footer>
</body>
</html>
`;
}

// 1. Generate Individual Card Pages (001 - 010)
console.log(`Generating Series 1 card pages (001 - ${cards.length})...`);
cards.forEach((card, index) => {
  const prevCard = index > 0 ? cards[index - 1] : cards[cards.length - 1];
  const nextCard = index < cards.length - 1 ? cards[index + 1] : cards[0];

  const char = card.character || {};
  const media = card.media || {};
  const nfc = card.nfc_config || {};
  const utility = card.utility_action || {};
  const prompts = card.prompts || {};
  const seo = card.seo || {};
  const comm = card.commerce || {};

  // Clean root-relative paths
  const frontImg = resolveAssetPath(media.local_front_image_path || media.front_image_url);
  const backImg = resolveAssetPath(media.local_back_image_path || media.back_image_url);
  const videoSrc = resolveAssetPath(media.local_video_path || media.video_url);

  const cardPageHtml = `${getHeadHtml(seo.seo_title || `${char.name} (${char.title})`, card.style_tokens, seo, media, card.web_address)}
    <main class="w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-8 flex-grow">
        <!-- Main Card Container with Clay Embossed Borders and Amber Glow -->
        <div class="relative bg-[#1A110C]/95 rounded-3xl p-3 sm:p-8 shadow-2xl border-[2px] border-amber-600/40 backdrop-blur-md flex flex-col gap-4 sm:gap-6 glow-amber w-full overflow-hidden">
            
            <!-- 4-Point Gold Starburst Filigree Accents in Corners -->
            <span class="clay-corner top-3 left-3">✦</span>
            <span class="clay-corner top-3 right-3">✦</span>
            <span class="clay-corner bottom-3 left-3">✦</span>
            <span class="clay-corner bottom-3 right-3">✦</span>

            <!-- DESKTOP TOP BANNER (Hidden on Mobile so Video is #1 on phone screen) -->
            <div class="hidden lg:block text-center pt-1 w-full max-w-full">
                <div class="flex flex-wrap justify-center items-center gap-2 mb-2">
                    <span class="inline-block bg-gradient-to-r from-rose-700 via-rose-600 to-amber-600 text-white text-[11px] sm:text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-widest shadow-md">
                        ${card.event_greeting || 'Happy Holidays!'}
                    </span>
                    <span class="inline-block bg-[#241710] text-amber-300 border border-amber-600/40 text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        SERIES 1 &bull; CARD #${card.card_code} OF 010
                    </span>
                    <span class="inline-block bg-[#241710] text-rose-300 border border-rose-600/40 text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        ${char.rarity_tier || 'Series 1 Premier'}
                    </span>
                </div>
                
                <h1 class="font-clayTitle text-2xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-amber-100 via-amber-200 to-rose-200 bg-clip-text text-transparent drop-shadow-md break-words">
                    ${char.name}
                </h1>
                <p class="font-sans text-xs sm:text-sm text-amber-300 font-semibold tracking-wide mt-1 break-words">
                    ${char.title} &bull; <span class="text-rose-300 italic font-serif">${char.profile_theme}</span>
                </p>
                <p class="text-xs sm:text-sm text-amber-100/90 italic max-w-xl mx-auto mt-2 px-2 leading-relaxed break-words">
                    &ldquo;${char.motto}&rdquo;
                </p>

                <!-- Keywords / SEO Tag Pills -->
                ${renderKeywords(seo.keywords)}
            </div>

            <!-- MAIN CONTENT: On Mobile, Video is at the very top! -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8 items-start w-full min-w-0">
                
                <!-- COLUMN 1: VIDEO FIRST (Top on Mobile, Left Column on Desktop) -->
                <div class="order-1 flex flex-col items-center justify-center bg-black/95 rounded-3xl p-2.5 sm:p-4 border-[2px] border-amber-600/50 ring-2 ring-rose-500/20 shadow-2xl relative overflow-hidden group w-full min-w-0">
                    
                    <!-- Compact Mobile Header directly above video -->
                    <div class="lg:hidden w-full flex justify-between items-center mb-2 px-1">
                        <span class="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-[#1F140E] px-2.5 py-1 rounded-full border border-amber-700/40">
                            #${card.card_code} &bull; ${char.name}
                        </span>
                        <span class="text-[10px] font-bold text-rose-300 uppercase tracking-wider">
                            ${card.event_greeting || 'Happy Holidays!'}
                        </span>
                    </div>

                    <!-- Video Frame with Big Unmute Button -->
                    <div class="relative w-full max-w-[320px] sm:max-w-[360px] mx-auto rounded-2xl overflow-hidden bg-black flex justify-center shadow-inner cursor-pointer" onclick="toggleMute()">
                        <video id="cardVideo" autoplay loop muted playsinline poster="${frontImg}" class="aspect-[9/16] w-full max-h-[66vh] sm:max-h-[70vh] object-cover rounded-2xl">
                            <source src="${videoSrc}" type="video/mp4">
                            Your browser does not support HTML5 video.
                        </video>

                        <!-- Big Prominent Unmute Button -->
                        <button id="unmuteBtn" onclick="event.stopPropagation(); toggleMute();" class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-rose-700 via-rose-600 to-amber-600 hover:from-rose-600 hover:to-amber-500 text-white font-bold px-5 py-2.5 rounded-full shadow-2xl shadow-rose-950/80 flex items-center gap-2 text-xs sm:text-sm tracking-wide transition-all hover:scale-105 active:scale-95 animate-pulse border border-amber-300/40 z-20 whitespace-nowrap">
                            <i id="muteIcon" class="fa-solid fa-volume-xmark text-amber-200"></i>
                            <span id="muteText">Tap to Unmute Video</span>
                        </button>
                    </div>

                    <!-- Video Controls Row -->
                    <div class="mt-2.5 w-full flex items-center justify-between px-2 text-xs font-semibold text-amber-200">
                        <button onclick="restartVideo()" class="flex items-center gap-1.5 text-amber-300 hover:text-white transition-colors">
                            <i class="fa-solid fa-rotate-left"></i> <span>Replay</span>
                        </button>
                        <button onclick="toggleMute()" class="flex items-center gap-1.5 text-amber-300 hover:text-white transition-colors">
                            <i class="fa-solid fa-volume-high text-rose-400"></i> <span id="muteStatusLabel">Sound: Muted (Tap to Play)</span>
                        </button>
                    </div>
                </div>

                <!-- COLUMN 2: Details + Physical Smart Card 3D Flip (Front/Back) + Lore & Actions -->
                <div class="order-2 flex flex-col gap-4 sm:gap-6 w-full min-w-0">
                    
                    <!-- MOBILE TITLE & MOTTO (Displayed right under video on mobile) -->
                    <div class="lg:hidden text-center bg-[#150D09]/95 p-3.5 rounded-2xl border border-amber-700/30">
                        <h1 class="font-clayTitle text-2xl font-extrabold bg-gradient-to-r from-amber-100 via-amber-200 to-rose-200 bg-clip-text text-transparent break-words">
                            ${char.name}
                        </h1>
                        <p class="font-sans text-xs text-amber-300 font-semibold tracking-wide mt-0.5">
                            ${char.title} &bull; <span class="text-rose-300 italic font-serif">${char.profile_theme}</span>
                        </p>
                        <p class="text-xs text-amber-100/90 italic mt-1.5 px-1 leading-relaxed break-words">
                            &ldquo;${char.motto}&rdquo;
                        </p>
                        ${renderKeywords(seo.keywords)}
                    </div>

                    <!-- Interactive Flippable 3D Physical Keepsake Card (Front & Back) -->
                    <div class="bg-[#150D09]/95 p-4 sm:p-5 rounded-3xl border border-amber-700/30 shadow-xl flex flex-col items-center min-w-0">
                        <div class="w-full flex justify-between items-center mb-3">
                            <span class="text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                                <i class="fa-solid fa-id-card text-rose-400"></i> Physical CR80 Smart Card
                            </span>
                            <button onclick="toggleCardFlip()" class="bg-[#241710] hover:bg-[#301F15] text-amber-300 text-xs font-bold px-3 py-1.5 rounded-xl border border-amber-600/40 flex items-center gap-1.5 transition-all shadow">
                                <i class="fa-solid fa-arrows-rotate"></i> Flip (Front / Back)
                            </button>
                        </div>

                        <!-- 3D Card Container -->
                        <div class="perspective-container w-full max-w-[260px] sm:max-w-[290px] aspect-[9/16] cursor-pointer group my-1" onclick="toggleCardFlip()">
                            <div id="physicalCard3d" class="card-3d shadow-2xl border-[2px] border-amber-600/70 rounded-2xl bg-[#140D08]">
                                <!-- Front Face -->
                                <div class="card-face card-face-front bg-[#120C08]">
                                    <img src="${frontImg}" alt="${char.name} Front Artwork" class="w-full h-full object-contain">
                                    <div class="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-sm text-center py-1 text-[10px] font-bold text-amber-300 uppercase tracking-widest rounded-lg">
                                        Front Artwork &bull; Tap to Flip ↻
                                    </div>
                                </div>
                                <!-- Back Face (Clean Artwork Display) -->
                                <div class="card-face card-face-back bg-[#120C08]">
                                    <img src="${backImg}" alt="${char.name} Collector Back" class="w-full h-full object-contain">
                                    <div class="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-sm text-center py-1 text-[10px] font-bold text-amber-300 uppercase tracking-widest rounded-lg">
                                        Back Collector Design &bull; Tap to Flip ↻
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p class="text-[11px] text-amber-200/70 mt-2 italic text-center">Click or tap card to flip between front sculpture and back NFC antenna layout</p>
                    </div>

                    <!-- Micro Lore Box -->
                    <div class="bg-[#150D09]/95 p-4 sm:p-5 rounded-3xl border border-amber-700/30 shadow-xl relative min-w-0">
                        <span class="text-[11px] font-bold uppercase tracking-wider text-amber-300 block mb-1.5 flex items-center gap-1.5">
                            <i class="fa-solid fa-feather-pointed text-rose-400"></i> Clay Artisan Craft &amp; Lore
                        </span>
                        <p class="text-xs sm:text-sm text-amber-100/90 leading-relaxed font-body break-words">
                            ${char.micro_lore}
                        </p>
                    </div>

                    <!-- Festive Indicators / Character Stats -->
                    ${renderIndicators(char.indicators)}

                    <!-- Prompts Accordion -->
                    ${renderPromptsAccordion(prompts)}

                    <!-- Utility Action & Order Buttons -->
                    <div class="flex flex-col gap-3 pt-1 min-w-0">
                        ${utility.button_text ? `
                        <a href="${utility.target_url || '#'}" target="_blank" onclick="triggerConfetti()" class="w-full bg-gradient-to-r from-rose-700 via-rose-600 to-amber-600 hover:from-rose-600 hover:to-amber-500 text-white font-bold py-3.5 px-4 rounded-2xl shadow-xl shadow-rose-900/40 text-center flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] text-sm">
                            <i class="fa-solid fa-sparkles"></i> <span>${utility.button_text}</span> &rarr;
                        </a>
                        ` : ''}

                        <div class="flex flex-col sm:flex-row gap-2.5">
                            <a href="${meta.shop_url}" target="_blank" class="flex-1 bg-[#20140D] hover:bg-[#2C1C13] text-amber-300 font-bold py-3 px-4 rounded-2xl border border-amber-600/40 shadow-lg text-center flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] text-xs sm:text-sm">
                                <i class="fa-solid fa-cart-shopping"></i> Order Keepsake Card &bull; $${comm.price ? comm.price.toFixed(2) : '14.99'}
                            </a>
                            <button onclick="shareGreeting()" class="bg-[#20140D] hover:bg-[#2C1C13] text-white font-bold py-3 px-4 rounded-2xl border border-amber-800/40 shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] text-xs sm:text-sm">
                                <i class="fa-solid fa-share-nodes text-rose-400"></i> Share
                            </button>
                        </div>
                    </div>

                    <!-- Navigation Footer (Root-Relative Links) -->
                    <div class="flex justify-between items-center pt-4 border-t border-amber-900/40 text-xs">
                        <a href="/${prevCard.card_code}/" class="bg-[#20140D] hover:bg-rose-700 text-white font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow border border-amber-800/40">
                            <i class="fa-solid fa-arrow-left"></i> #${prevCard.card_code}
                        </a>
                        <a href="/#collection" class="bg-[#20140D] hover:bg-rose-700 text-white font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow border border-amber-800/40">
                            <i class="fa-solid fa-boxes-stacked"></i> All Cards
                        </a>
                        <a href="/${nextCard.card_code}/" class="bg-[#20140D] hover:bg-rose-700 text-white font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow border border-amber-800/40">
                            #${nextCard.card_code} <i class="fa-solid fa-arrow-right"></i>
                        </a>
                    </div>

                </div>
            </div>

        </div>
    </main>

    <script>
        function toggleCardFlip() {
            var card = document.getElementById('physicalCard3d');
            if (card) {
                card.classList.toggle('flipped');
                triggerConfetti();
            }
        }

        function toggleMute() {
            var vid = document.getElementById('cardVideo');
            var icon = document.getElementById('muteIcon');
            var text = document.getElementById('muteText');
            var btn = document.getElementById('unmuteBtn');
            var statusLabel = document.getElementById('muteStatusLabel');
            if (!vid) return;

            if (vid.muted) {
                vid.muted = false;
                vid.play();
                if (icon) icon.className = 'fa-solid fa-volume-high text-white';
                if (text) text.innerText = 'Sound Playing (Tap to Mute)';
                if (btn) btn.classList.remove('animate-pulse');
                if (statusLabel) statusLabel.innerText = 'Sound: Playing 🔊';
                triggerConfetti();
            } else {
                vid.muted = true;
                if (icon) icon.className = 'fa-solid fa-volume-xmark text-amber-200';
                if (text) text.innerText = 'Tap to Unmute Video';
                if (btn) btn.classList.add('animate-pulse');
                if (statusLabel) statusLabel.innerText = 'Sound: Muted (Tap to Play)';
            }
        }

        function restartVideo() {
            var vid = document.getElementById('cardVideo');
            if (vid) {
                vid.currentTime = 0;
                vid.play();
            }
        }

        function triggerConfetti() {
            if (typeof confetti === 'function') {
                confetti({
                    particleCount: 40,
                    spread: 60,
                    origin: { y: 0.7 },
                    colors: ['#FBBF24', '#F87171', '#9E1B32', '#FFF8E7']
                });
            }
        }

        function shareGreeting() {
            var shareData = {
                title: "${char.name} | TapGreetings Series 1",
                text: "${char.name} (${char.title}): '${char.motto}'",
                url: "${card.web_address || 'https://tapgreetings.com/' + card.card_code}"
            };
            if (navigator.share) {
                navigator.share(shareData).catch(function() {});
            } else {
                navigator.clipboard.writeText(shareData.url).then(function() {
                    alert('Greeting card link copied to clipboard! ✦');
                });
            }
        }
    </script>
${getFooterHtml()}`;

  // Write card page in 3-digit folder
  const cardDir = path.join(projectRoot, card.card_code);
  if (!fs.existsSync(cardDir)) fs.mkdirSync(cardDir, { recursive: true });
  fs.writeFileSync(path.join(cardDir, 'index.html'), cardPageHtml, 'utf8');
  console.log(`Generated Card Page: ${card.card_code}/index.html`);

  // Also write aliases if any
  if (card.aliases_slugs && Array.isArray(card.aliases_slugs)) {
    card.aliases_slugs.forEach(alias => {
      const aliasDir = path.join(projectRoot, alias);
      if (!fs.existsSync(aliasDir)) fs.mkdirSync(aliasDir, { recursive: true });
      fs.writeFileSync(path.join(aliasDir, 'index.html'), cardPageHtml, 'utf8');
      console.log(`Generated Alias Page: ${alias}/index.html`);
    });
  }
});

// 2. Generate Main Gallery index.html
console.log('Generating Series 1 main gallery index.html...');

const featuredCard = cards[0]; // Santa 001
const featuredChar = featuredCard.character || {};
const featuredMedia = featuredCard.media || {};
const featuredFront = resolveAssetPath(featuredMedia.local_front_image_path || featuredMedia.front_image_url);
const featuredVideo = resolveAssetPath(featuredMedia.local_video_path || featuredMedia.video_url);

// Generate pre-rendered static HTML cards for the collection grid
const renderedCardsHtml = cards.map(c => {
  const ch = c.character || {};
  const front = resolveAssetPath(c.media?.local_front_image_path || c.media?.front_image_url);
  const back = resolveAssetPath(c.media?.local_back_image_path || c.media?.back_image_url);
  const keywords = (c.seo?.keywords || []).join(' ').toLowerCase();

  return `
    <a href="/${c.card_code}/" class="card-item group bg-[#1A110C]/95 rounded-3xl overflow-hidden shadow-xl border border-amber-800/40 hover:border-amber-500/70 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between glow-amber min-w-0" data-name="${(ch.name || '').toLowerCase()}" data-greeting="${(c.event_greeting || '').toLowerCase()}" data-keywords="${keywords}" data-lore="${(ch.micro_lore || '').toLowerCase()}" data-front="${front}" data-back="${back}">
        <div class="relative w-full aspect-[9/16] bg-[#120C08] overflow-hidden flex items-center justify-center">
            <img src="${front}" alt="${ch.name}" class="card-img w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" loading="lazy">
            <div class="absolute top-2.5 right-2.5 bg-black/85 backdrop-blur-sm text-[10px] font-bold px-2 py-0.5 rounded-md border border-amber-600/50 text-amber-300">
                #${c.card_code}
            </div>
            <div class="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-sm text-center py-1 text-[10px] font-bold text-amber-300 uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                Tap to View Card &rarr;
            </div>
        </div>
        <div class="p-4 flex flex-col gap-1.5 flex-grow justify-between min-w-0">
            <div class="min-w-0">
                <div class="flex justify-between items-center mb-1 gap-2">
                    <span class="text-[10px] font-bold text-rose-300 tracking-wider uppercase truncate">${c.event_greeting || 'Happy Holidays!'}</span>
                    <span class="text-[9px] bg-[#140D08] text-amber-200/90 px-2 py-0.5 rounded-full border border-amber-800/40 flex-shrink-0">Series 1</span>
                </div>
                <div class="font-clayTitle text-base sm:text-lg font-bold text-white group-hover:text-amber-300 transition-colors leading-snug truncate">${ch.name}</div>
                <div class="text-xs text-amber-200/80 italic truncate mt-0.5">${ch.title}</div>
            </div>
            <div class="mt-3 pt-2.5 border-t border-amber-900/40 flex justify-between items-center text-xs font-bold text-amber-300">
                <span class="flex items-center gap-1 text-[11px] text-amber-300"><i class="fa-solid fa-play text-rose-400"></i> Video &amp; NFC</span>
                <span class="group-hover:translate-x-1 transition-transform">View &rarr;</span>
            </div>
        </div>
    </a>
  `;
}).join('\n');

const mainIndexHtml = `${getHeadHtml('TapGreetings Series 1: The Clay & Needle-Felt Holiday Collection', featuredCard.style_tokens, featuredCard.seo, featuredCard.media, 'https://tapgreetings.com')}
    <main class="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-10 flex-grow overflow-hidden">
        
        <!-- Hero Spotlight Section Featuring Santa (Card 001) -->
        <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1E130D] via-[#2A1A12] to-[#3B191D] p-4 sm:p-10 lg:p-12 mb-8 sm:mb-10 shadow-2xl border-[2px] border-amber-600/50 backdrop-blur-md glow-amber w-full">
            <span class="clay-corner top-4 left-4">✦</span>
            <span class="clay-corner top-4 right-4">✦</span>
            <span class="clay-corner bottom-4 left-4">✦</span>
            <span class="clay-corner bottom-4 right-4">✦</span>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center w-full">
                
                <!-- MOBILE VIDEO FIRST: Video shows at the very top of hero on mobile -->
                <div class="lg:col-span-5 flex flex-col items-center justify-center w-full min-w-0 order-1 lg:order-2">
                    <div class="relative group block w-60 sm:w-72 aspect-[9/16] rounded-3xl overflow-hidden border-[2px] border-amber-500/70 shadow-2xl bg-black glow-amber transition-transform hover:scale-[1.02] cursor-pointer" onclick="toggleHeroMute()">
                        <video id="heroVideo" autoplay loop muted playsinline poster="${featuredFront}" class="w-full h-full object-cover">
                            <source src="${featuredVideo}" type="video/mp4">
                        </video>
                        <!-- Big Prominent Unmute Button -->
                        <button id="heroUnmuteBtn" onclick="event.stopPropagation(); toggleHeroMute();" class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-rose-700 via-rose-600 to-amber-600 hover:from-rose-600 hover:to-amber-500 text-white font-bold px-4 py-2 rounded-full shadow-2xl shadow-rose-950/80 flex items-center gap-2 text-xs tracking-wide transition-all hover:scale-105 animate-pulse border border-amber-300/40 z-20 whitespace-nowrap">
                            <i id="heroMuteIcon" class="fa-solid fa-volume-xmark text-amber-200"></i>
                            <span id="heroMuteText">Tap to Unmute</span>
                        </button>
                    </div>
                    <div class="mt-2 text-center text-xs text-amber-200/80">
                        <a href="/001/" class="hover:text-amber-300 font-semibold flex items-center gap-1 justify-center">
                            <span>Open Santa (001) Page</span> &rarr;
                        </a>
                    </div>
                </div>

                <!-- Hero Text & CTA: Order 2 on mobile, Order 1 on desktop -->
                <div class="lg:col-span-7 flex flex-col items-start text-left min-w-0 order-2 lg:order-1">
                    <div class="flex flex-wrap items-center gap-2 mb-2 sm:mb-3">
                        <span class="bg-gradient-to-r from-rose-700 via-rose-600 to-amber-600 text-white text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow">
                            🎅 SERIES 1 &bull; CLAY &amp; NEEDLE-FELT
                        </span>
                        <span class="bg-[#1C120B] text-amber-300 border border-amber-600/40 text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                            10 Handcrafted Characters
                        </span>
                    </div>

                    <h1 class="font-clayTitle text-3xl sm:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-amber-100 via-amber-200 to-rose-200 bg-clip-text text-transparent mb-2 sm:mb-3 drop-shadow-[0_0_30px_rgba(251,191,36,0.3)] break-words">
                        TapGreetings
                    </h1>
                    
                    <h2 class="font-sans text-base sm:text-2xl font-bold text-amber-200 mb-2 sm:mb-3 break-words">
                        ${featuredChar.name} &mdash; <span class="text-rose-300 font-serif italic">${featuredChar.title}</span>
                    </h2>

                    <p class="text-xs sm:text-sm lg:text-base text-amber-100/90 max-w-xl mb-3 sm:mb-4 leading-relaxed break-words">
                        ${featuredChar.micro_lore}
                    </p>

                    <blockquote class="text-xs sm:text-sm italic text-amber-200/95 border-l-2 border-amber-400 pl-3 mb-5 max-w-xl break-words">
                        &ldquo;${featuredChar.motto}&rdquo;
                    </blockquote>

                    <div class="flex flex-wrap gap-3 w-full sm:w-auto">
                        <a href="/001/" class="bg-gradient-to-r from-rose-700 via-rose-600 to-amber-600 hover:from-rose-600 hover:to-amber-500 text-white font-bold px-5 sm:px-8 py-2.5 sm:py-3 rounded-2xl shadow-xl shadow-rose-950/50 transition-transform hover:scale-105 flex items-center justify-center gap-2 text-xs sm:text-sm flex-1 sm:flex-initial">
                            <i class="fa-solid fa-play"></i> Experience Santa (001)
                        </a>
                        <a href="#collection" class="bg-[#20140D] hover:bg-[#2C1C13] text-amber-200 border border-amber-600/40 font-bold px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl shadow-lg transition-transform hover:scale-105 flex items-center justify-center gap-2 text-xs sm:text-sm flex-1 sm:flex-initial">
                            <i class="fa-solid fa-boxes-stacked"></i> Explore All 10 Cards
                        </a>
                    </div>
                </div>

            </div>
        </div>

        <!-- Collection Section: Controls & 10 Pre-Rendered Cards -->
        <section id="collection" class="mb-14">
            <div class="bg-[#1C120C]/90 rounded-3xl p-4 sm:p-6 mb-8 shadow-xl border border-amber-700/40 backdrop-blur-md flex flex-col md:flex-row gap-4 items-center justify-between w-full">
                <div class="flex items-center gap-3 w-full md:w-auto">
                    <h2 class="font-clayTitle text-xl sm:text-2xl font-bold text-white whitespace-nowrap flex items-center gap-2">
                        <i class="fa-solid fa-boxes-stacked text-amber-400"></i> Series 1 Gallery
                    </h2>
                    <span id="cardCountBadge" class="bg-[#140D08] text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-700/40">
                        ${cards.length} Cards (001&ndash;${cards[cards.length - 1].card_code})
                    </span>
                </div>

                <div class="flex flex-wrap gap-2.5 sm:gap-3 w-full md:w-auto items-center justify-start md:justify-end">
                    <!-- Search Input -->
                    <div class="relative flex-grow sm:flex-grow-0 w-full sm:w-auto">
                        <input type="text" id="searchInput" placeholder="Search characters, mottos, stats..." oninput="filterCards()" class="w-full sm:w-64 bg-[#140D08] text-amber-100 placeholder-amber-200/50 text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-amber-800/40 focus:outline-none focus:ring-2 focus:ring-amber-500">
                    </div>

                    <!-- Front / Back Toggle -->
                    <div class="flex bg-[#140D08] p-1 rounded-xl border border-amber-800/40">
                        <button onclick="setGridSide('front')" id="btnFront" class="px-3 py-1 text-xs font-bold rounded-lg bg-rose-700 text-white shadow transition-all">Front</button>
                        <button onclick="setGridSide('back')" id="btnBack" class="px-3 py-1 text-xs font-bold rounded-lg text-amber-200/70 transition-all">Back</button>
                    </div>
                </div>
            </div>

            <!-- Pre-rendered Static Cards Grid (Instant View, Zero Blank State) -->
            <div id="cardsGrid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 w-full">
                ${renderedCardsHtml}
            </div>
            
            <div id="noResults" class="hidden text-center py-16 text-amber-200/60 font-clayTitle text-base sm:text-lg">
                No matching Series 1 characters found ✦
            </div>
        </section>

        <!-- Web NFC Reprogrammer Tool Feature -->
        <div class="mt-12 sm:mt-18 bg-gradient-to-r from-[#1E130D] via-[#261710] to-[#1E130D] rounded-3xl p-6 sm:p-10 border-[2px] border-amber-600/40 glow-amber text-center max-w-4xl mx-auto w-full">
            <span class="inline-block bg-rose-900/30 text-rose-300 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider mb-3 border border-rose-800/40">
                ✦ TapThingy NFC Web Reprogrammer Tool ✦
            </span>
            <h3 class="font-clayTitle text-xl sm:text-3xl font-bold text-white mb-2">
                Reprogram or Update Any Series 1 Card Anytime
            </h3>
            <p class="text-amber-100/90 text-xs sm:text-sm max-w-xl mx-auto mb-6 leading-relaxed">
                Every physical Series 1 card contains an embedded high-speed NTAG215 microchip. Want to customize where your card links? Open our free Web NFC Tool directly in Chrome on Android or using NFC Tools on iPhone.
            </p>
            <div class="flex flex-wrap justify-center gap-3">
                <a href="${meta.tools_url}" target="_blank" class="bg-gradient-to-r from-rose-700 to-amber-600 hover:from-rose-600 hover:to-amber-500 text-white font-bold px-6 py-3 rounded-2xl shadow-lg transition-transform hover:scale-105 inline-flex items-center gap-2 text-xs sm:text-sm">
                    <i class="fa-solid fa-bolt"></i> Open Reprogrammer Webtool (/tools) &rarr;
                </a>
                <a href="${meta.custom_designer_url}" target="_blank" class="bg-[#140D08] hover:bg-[#20140D] text-amber-300 border border-amber-600/40 font-bold px-6 py-3 rounded-2xl shadow-lg transition-transform hover:scale-105 inline-flex items-center gap-2 text-xs sm:text-sm">
                    <i class="fa-solid fa-wand-magic-sparkles"></i> Custom Keepsake Studio &rarr;
                </a>
            </div>
        </div>

    </main>

    <script>
        function toggleHeroMute() {
            var vid = document.getElementById('heroVideo');
            var icon = document.getElementById('heroMuteIcon');
            var text = document.getElementById('heroMuteText');
            var btn = document.getElementById('heroUnmuteBtn');
            if (!vid) return;

            if (vid.muted) {
                vid.muted = false;
                vid.play();
                if (icon) icon.className = 'fa-solid fa-volume-high text-white';
                if (text) text.innerText = 'Sound Playing';
                if (btn) btn.classList.remove('animate-pulse');
            } else {
                vid.muted = true;
                if (icon) icon.className = 'fa-solid fa-volume-xmark text-amber-200';
                if (text) text.innerText = 'Tap to Unmute';
                if (btn) btn.classList.add('animate-pulse');
            }
        }

        var currentGridSide = 'front';

        function setGridSide(side) {
            currentGridSide = side;
            var btnF = document.getElementById('btnFront');
            var btnB = document.getElementById('btnBack');
            if (side === 'front') {
                btnF.className = 'px-3 py-1 text-xs font-bold rounded-lg bg-rose-700 text-white shadow transition-all';
                btnB.className = 'px-3 py-1 text-xs font-bold rounded-lg text-amber-200/70 transition-all';
            } else {
                btnB.className = 'px-3 py-1 text-xs font-bold rounded-lg bg-rose-700 text-white shadow transition-all';
                btnF.className = 'px-3 py-1 text-xs font-bold rounded-lg text-amber-200/70 transition-all';
            }

            document.querySelectorAll('.card-item').forEach(function(card) {
                var img = card.querySelector('.card-img');
                if (img) {
                    var src = side === 'back' ? card.getAttribute('data-back') : card.getAttribute('data-front');
                    if (src) img.src = src;
                }
            });
        }

        function filterCards() {
            var query = (document.getElementById('searchInput')?.value || '').toLowerCase().trim();
            var cards = document.querySelectorAll('.card-item');
            var noResults = document.getElementById('noResults');
            var badge = document.getElementById('cardCountBadge');
            var visibleCount = 0;

            cards.forEach(function(card) {
                var name = card.getAttribute('data-name') || '';
                var greeting = card.getAttribute('data-greeting') || '';
                var keywords = card.getAttribute('data-keywords') || '';
                var lore = card.getAttribute('data-lore') || '';

                var matches = !query || name.includes(query) || greeting.includes(query) || keywords.includes(query) || lore.includes(query);
                if (matches) {
                    card.style.display = 'flex';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            if (badge) badge.innerText = visibleCount + ' Cards';
            if (noResults) {
                noResults.className = visibleCount === 0 ? 'text-center py-16 text-amber-200/60 font-clayTitle text-base sm:text-lg block' : 'hidden';
            }
        }
    </script>
${getFooterHtml()}`;

fs.writeFileSync(path.join(projectRoot, 'index.html'), mainIndexHtml, 'utf8');
console.log(`Successfully generated Series 1 main gallery index.html with ${cards.length} characters pre-rendered!`);
