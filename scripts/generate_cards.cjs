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

// Assign category to each card for filtering
function getCardCategory(code) {
  const num = parseInt(code, 10);
  if ([1, 2, 3, 10].includes(num)) return 'classic';
  if ([4, 7, 14, 15].includes(num)) return 'magic';
  if ([5, 6, 8, 9].includes(num)) return 'hearth';
  if ([11, 12, 13, 16].includes(num)) return 'friends';
  return 'all';
}

function getCategoryName(category) {
  switch (category) {
    case 'classic': return 'Classic Icons';
    case 'magic': return 'Winter Magic';
    case 'hearth': return 'Hearth & Holiday';
    case 'friends': return 'Festive Friends';
    default: return 'All Cards';
  }
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

        /* Custom scrollbar for horizontal card slider */
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }

        /* Zoom modal magnification */
        .zoomed-magnify {
            transform: scale(1.85);
            cursor: zoom-out !important;
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
                <a href="/#collection" class="hover:text-amber-300 transition-colors">Series 1 (001–016)</a>
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

// 1. Generate Individual Card Pages (001 - 016)
console.log(`Generating Series 1 card pages (001 - ${cards.length})...`);
cards.forEach((card, index) => {
  const prevCard = index > 0 ? cards[index - 1] : cards[cards.length - 1];
  const nextCard = index < cards.length - 1 ? cards[index + 1] : cards[0];
  const prevChar = prevCard.character || {};
  const nextChar = nextCard.character || {};

  const char = card.character || {};
  const media = card.media || {};
  const nfc = card.nfc_config || {};
  const prompts = card.prompts || {};
  const seo = card.seo || {};
  const comm = card.commerce || {};

  // Clean root-relative paths
  const frontImg = resolveAssetPath(media.local_front_image_path || media.front_image_url);
  const backImg = resolveAssetPath(media.local_back_image_path || media.back_image_url);
  const videoSrc = resolveAssetPath(media.local_video_path || media.video_url);

  const cardPageHtml = `${getHeadHtml(seo.seo_title || `${char.name} (${char.title})`, card.style_tokens, seo, media, card.web_address)}
    <main class="w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-8 flex-grow">
        <!-- Main Card Container with Amber Glow -->
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
                        SERIES 1 &bull; CARD #${card.card_code} OF 016
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
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-start w-full min-w-0">
                
                <!-- COLUMN 1: VIDEO FIRST, CONTROLS, PREV/NEXT, AND SHARE BUTTON -->
                <div class="order-1 flex flex-col items-center w-full min-w-0">
                    
                    <!-- Compact Mobile Header directly above video -->
                    <div class="lg:hidden w-full flex justify-between items-center mb-2 px-1">
                        <span class="text-xs font-bold uppercase tracking-wider text-amber-300 bg-[#1F140E] px-3 py-1 rounded-full border border-amber-700/40">
                            #${card.card_code} &bull; ${char.name}
                        </span>
                        <span class="text-xs font-bold text-rose-300 uppercase tracking-wider">
                            ${card.event_greeting || 'Happy Holidays!'}
                        </span>
                    </div>

                    <!-- Video Frame - Larger, Edge-to-Edge Without Enclosing Container or Unmute Overlay -->
                    <div class="relative w-full max-w-[440px] sm:max-w-[480px] lg:max-w-[500px] aspect-[9/16] rounded-3xl overflow-hidden bg-black shadow-2xl ring-1 ring-amber-500/30 flex justify-center items-center cursor-pointer group" onclick="toggleMute()">
                        <video id="cardVideo" autoplay loop playsinline poster="${frontImg}" class="w-full h-full object-cover">
                            <source src="${videoSrc}" type="video/mp4">
                            Your browser does not support HTML5 video.
                        </video>
                    </div>

                    <!-- Video Controls Row: Replay & Sound Toggle -->
                    <div class="mt-3 w-full max-w-[440px] sm:max-w-[480px] lg:max-w-[500px] flex items-center justify-between px-2 text-xs font-semibold text-amber-200">
                        <button onclick="restartVideo()" class="flex items-center gap-1.5 text-amber-300 hover:text-white transition-colors bg-[#1A110C] px-3 py-1.5 rounded-xl border border-amber-900/40">
                            <i class="fa-solid fa-rotate-left"></i> <span>Replay</span>
                        </button>
                        <button onclick="toggleMute()" id="soundToggleBtn" class="flex items-center gap-1.5 text-amber-300 hover:text-white transition-colors bg-[#1A110C] px-3 py-1.5 rounded-xl border border-amber-900/40">
                            <i id="muteIcon" class="fa-solid fa-volume-high text-rose-400"></i> <span id="muteStatusLabel">Sound: Unmuted</span>
                        </button>
                    </div>

                    <!-- PREV / NEXT NAVIGATION DIRECTLY UNDER VIDEO -->
                    <div class="mt-4 w-full max-w-[440px] sm:max-w-[480px] lg:max-w-[500px] flex items-center justify-between gap-2 text-xs font-bold">
                        <a href="/${prevCard.card_code}/" class="flex-1 bg-[#1F140E] hover:bg-rose-700 text-amber-200 hover:text-white px-3 py-2.5 rounded-2xl flex items-center justify-center gap-1.5 transition-all shadow border border-amber-800/40 truncate">
                            <i class="fa-solid fa-arrow-left"></i> <span class="truncate">#${prevCard.card_code} ${prevChar.name}</span>
                        </a>
                        <a href="/#collection" class="bg-[#180E09] hover:bg-[#281810] text-amber-300 px-3.5 py-2.5 rounded-2xl flex items-center justify-center gap-1.5 transition-all shadow border border-amber-800/40 whitespace-nowrap">
                            <i class="fa-solid fa-boxes-stacked"></i> <span class="hidden sm:inline">All</span> 16
                        </a>
                        <a href="/${nextCard.card_code}/" class="flex-1 bg-[#1F140E] hover:bg-rose-700 text-amber-200 hover:text-white px-3 py-2.5 rounded-2xl flex items-center justify-center gap-1.5 transition-all shadow border border-amber-800/40 truncate">
                            <span class="truncate">#${nextCard.card_code} ${nextChar.name}</span> <i class="fa-solid fa-arrow-right"></i>
                        </a>
                    </div>

                    <!-- SHARE BUTTON DIRECTLY UNDER PREV / NEXT -->
                    <button onclick="shareGreeting()" class="w-full max-w-[440px] sm:max-w-[480px] lg:max-w-[500px] mt-2.5 bg-[#20140D] hover:bg-[#2C1C13] text-amber-200 hover:text-white font-bold py-3 px-4 rounded-2xl border border-amber-800/40 shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] text-xs sm:text-sm">
                        <i class="fa-solid fa-share-nodes text-rose-400"></i> <span>Share This Keepsake Card ✦</span>
                    </button>
                </div>

                <!-- COLUMN 2: Details + Physical Smart Card 3D Flip (Front/Back) + Fullscreen Zoom + Order Button -->
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

                    <!-- Interactive Flippable 3D Physical Keepsake Card (Front & Back - CLEAN ARTWORK WITH NO OVERLAYS) -->
                    <div class="bg-[#150D09]/95 p-4 sm:p-5 rounded-3xl border border-amber-700/30 shadow-xl flex flex-col items-center min-w-0">
                        <div class="w-full flex justify-between items-center mb-3">
                            <span class="text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                                <i class="fa-solid fa-id-card text-rose-400"></i> Physical CR80 Smart Card
                            </span>
                            <div class="flex items-center gap-2">
                                <button onclick="openCardZoom()" class="bg-[#241710] hover:bg-[#301F15] text-amber-300 text-xs font-bold px-3 py-1.5 rounded-xl border border-amber-600/40 flex items-center gap-1.5 transition-all shadow" title="Open Fullscreen Zoom Lightbox">
                                    <i class="fa-solid fa-expand text-rose-400"></i> Zoom
                                </button>
                                <button onclick="toggleCardFlip()" class="bg-[#241710] hover:bg-[#301F15] text-amber-300 text-xs font-bold px-3 py-1.5 rounded-xl border border-amber-600/40 flex items-center gap-1.5 transition-all shadow">
                                    <i class="fa-solid fa-arrows-rotate"></i> Flip
                                </button>
                            </div>
                        </div>

                        <!-- 3D Card Container (Clean, zero text overlays on the artwork) -->
                        <div class="perspective-container w-full max-w-[280px] sm:max-w-[320px] aspect-[9/16] cursor-pointer group my-1" onclick="toggleCardFlip()">
                            <div id="physicalCard3d" class="card-3d shadow-2xl border-[2px] border-amber-600/70 rounded-2xl bg-[#140D08]">
                                <!-- Front Face (Pure Art, No Overlays) -->
                                <div class="card-face card-face-front bg-[#120C08]">
                                    <img src="${frontImg}" alt="${char.name} Front Artwork" class="w-full h-full object-cover">
                                </div>
                                <!-- Back Face (Pure Art, No Overlays) -->
                                <div class="card-face card-face-back bg-[#120C08]">
                                    <img src="${backImg}" alt="${char.name} Collector Back" class="w-full h-full object-cover">
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center justify-center gap-3 mt-2 text-[11px] text-amber-200/80 italic text-center">
                            <span>Tap card to flip</span>
                            <span>&bull;</span>
                            <button onclick="openCardZoom()" class="text-rose-400 hover:text-amber-300 font-bold not-italic underline decoration-dotted">Fullscreen Zoom 🔍</button>
                        </div>
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

                    <!-- Primary Full-Width Order Keepsake Card Button -->
                    <div class="pt-2 min-w-0">
                        <a href="${meta.shop_url}" target="_blank" class="w-full bg-gradient-to-r from-rose-700 via-rose-600 to-amber-600 hover:from-rose-600 hover:to-amber-500 text-white font-bold py-3.5 sm:py-4 px-6 rounded-2xl shadow-xl shadow-rose-900/40 text-center flex items-center justify-center gap-2.5 transition-transform hover:scale-[1.01] text-sm sm:text-base">
                            <i class="fa-solid fa-cart-shopping"></i> <span>Order Keepsake Card &bull; $${comm.price ? comm.price.toFixed(2) : '14.99'}</span>
                        </a>
                    </div>

                </div>
            </div>

        </div>
    </main>

    <!-- FULLSCREEN CARD ART ZOOM LIGHTBOX MODAL (Front & Back High-Resolution View) -->
    <div id="cardZoomModal" class="hidden fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col justify-between p-3 sm:p-6 transition-opacity duration-300 select-none" onclick="if(event.target === this) closeCardZoom()">
        <!-- Lightbox Header -->
        <div class="w-full max-w-4xl mx-auto flex items-center justify-between gap-3 text-white">
            <div class="flex items-center gap-2 sm:gap-3 min-w-0">
                <span class="bg-[#241710] text-amber-300 text-xs font-bold px-2.5 py-1 rounded-lg border border-amber-700/40">#${card.card_code}</span>
                <h2 class="font-clayTitle text-base sm:text-xl font-bold truncate">${char.name}</h2>
                <span id="zoomSideBadge" class="text-[10px] sm:text-xs bg-rose-900/50 text-rose-300 border border-rose-800/40 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">Front Art</span>
            </div>
            <div class="flex items-center gap-2">
                <button onclick="toggleZoomFlip()" class="bg-[#20140D] hover:bg-[#301F15] text-amber-300 text-xs font-bold px-3 py-1.5 rounded-xl border border-amber-600/40 flex items-center gap-1.5 transition-all shadow">
                    <i class="fa-solid fa-arrows-rotate"></i> <span class="hidden sm:inline">Flip Front/Back</span><span class="sm:hidden">Flip</span>
                </button>
                <button onclick="closeCardZoom()" class="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-rose-900/70 hover:bg-rose-700 text-white flex items-center justify-center text-sm font-bold shadow transition-all" title="Close (Esc)">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
        </div>

        <!-- Lightbox Image Stage with Magnify Toggle -->
        <div class="relative flex-grow flex items-center justify-center my-2 sm:my-4 overflow-hidden cursor-zoom-in" onclick="toggleZoomMagnify()">
            <img id="zoomImage" src="${frontImg}" alt="${char.name} Fullscreen" class="max-h-[76vh] sm:max-h-[82vh] max-w-[92vw] object-contain rounded-2xl shadow-2xl transition-transform duration-300 border-[2px] border-amber-600/40">
        </div>

        <!-- Lightbox Bottom Toolbar -->
        <div class="w-full max-w-md mx-auto flex items-center justify-center gap-2.5 text-xs font-bold text-amber-200">
            <button onclick="toggleZoomFlip()" class="flex-1 bg-[#20140D] hover:bg-rose-700 text-white py-2 px-3 rounded-xl border border-amber-800/40 flex items-center justify-center gap-1.5 shadow transition-all">
                <i class="fa-solid fa-arrows-rotate"></i> Flip to <span id="zoomFlipTargetText">Back</span>
            </button>
            <button onclick="toggleZoomMagnify()" id="zoomMagnifyBtn" class="flex-1 bg-[#20140D] hover:bg-[#301F15] text-amber-300 py-2 px-3 rounded-xl border border-amber-800/40 flex items-center justify-center gap-1.5 shadow transition-all">
                <i class="fa-solid fa-magnifying-glass-plus"></i> <span id="zoomMagnifyText">2x Zoom</span>
            </button>
            <button onclick="closeCardZoom()" class="bg-[#140D08] hover:bg-[#20140D] text-amber-200/80 py-2 px-3 rounded-xl border border-amber-900/40 shadow transition-all">
                Close (Esc)
            </button>
        </div>
    </div>

    <script>
        var currentCardSide = 'front';
        var isZoomMagnified = false;
        var frontImgUrl = "${frontImg}";
        var backImgUrl = "${backImg}";

        function toggleCardFlip() {
            var card = document.getElementById('physicalCard3d');
            if (card) {
                card.classList.toggle('flipped');
                triggerConfetti();
            }
        }

        // Fullscreen Lightbox Zoom Controls
        function openCardZoom() {
            var modal = document.getElementById('cardZoomModal');
            var img = document.getElementById('zoomImage');
            var card3d = document.getElementById('physicalCard3d');
            
            // Check if 3d card is currently flipped
            var isFlipped = card3d && card3d.classList.contains('flipped');
            currentCardSide = isFlipped ? 'back' : 'front';
            updateZoomImage();

            if (modal) {
                modal.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            }
        }

        function closeCardZoom() {
            var modal = document.getElementById('cardZoomModal');
            if (modal) {
                modal.classList.add('hidden');
                document.body.style.overflow = '';
            }
            if (isZoomMagnified) toggleZoomMagnify();
        }

        function toggleZoomFlip() {
            currentCardSide = (currentCardSide === 'front') ? 'back' : 'front';
            updateZoomImage();
            triggerConfetti();
        }

        function updateZoomImage() {
            var img = document.getElementById('zoomImage');
            var sideBadge = document.getElementById('zoomSideBadge');
            var flipTarget = document.getElementById('zoomFlipTargetText');
            if (!img) return;

            if (currentCardSide === 'front') {
                img.src = frontImgUrl;
                if (sideBadge) sideBadge.innerText = 'Front Artwork';
                if (flipTarget) flipTarget.innerText = 'Back Design';
            } else {
                img.src = backImgUrl;
                if (sideBadge) sideBadge.innerText = 'Back Collector Design';
                if (flipTarget) flipTarget.innerText = 'Front Artwork';
            }
        }

        function toggleZoomMagnify() {
            var img = document.getElementById('zoomImage');
            var btnText = document.getElementById('zoomMagnifyText');
            if (!img) return;

            isZoomMagnified = !isZoomMagnified;
            if (isZoomMagnified) {
                img.classList.add('zoomed-magnify');
                if (btnText) btnText.innerText = 'Fit Screen';
            } else {
                img.classList.remove('zoomed-magnify');
                if (btnText) btnText.innerText = '2x Zoom';
            }
        }

        // Keyboard navigation for Zoom (Esc to close, F/Space to flip, Z to zoom)
        document.addEventListener('keydown', function(e) {
            var modal = document.getElementById('cardZoomModal');
            if (modal && !modal.classList.contains('hidden')) {
                if (e.key === 'Escape') closeCardZoom();
                if (e.key === ' ' || e.key === 'f' || e.key === 'F') {
                    e.preventDefault();
                    toggleZoomFlip();
                }
                if (e.key === 'z' || e.key === 'Z') {
                    toggleZoomMagnify();
                }
            }
        });

        // PERSISTENT UNMUTED SOUND & SEAMLESS NAVIGATION
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
            if (!vid.muted) triggerConfetti();
        }

        function updateSoundUI(isMuted) {
            var icon = document.getElementById('muteIcon');
            var statusLabel = document.getElementById('muteStatusLabel');
            if (isMuted) {
                if (icon) icon.className = 'fa-solid fa-volume-xmark text-amber-300';
                if (statusLabel) statusLabel.innerText = 'Sound: Muted (Tap to Play)';
            } else {
                if (icon) icon.className = 'fa-solid fa-volume-high text-rose-400';
                if (statusLabel) statusLabel.innerText = 'Sound: Playing 🔊';
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

        document.addEventListener('DOMContentLoaded', function() {
            initVideoPlayback();
        });
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

// Generate pre-rendered static HTML cards for the collection grid (CLEAN, NO OVERLAYS ON ART)
const renderedCardsHtml = cards.map((c, idx) => {
  const ch = c.character || {};
  const front = resolveAssetPath(c.media?.local_front_image_path || c.media?.front_image_url);
  const back = resolveAssetPath(c.media?.local_back_image_path || c.media?.back_image_url);
  const keywords = (c.seo?.keywords || []).join(' ').toLowerCase();
  const category = getCardCategory(c.card_code);

  return `
    <a href="/${c.card_code}/" class="card-item group bg-[#1A110C]/95 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-amber-800/40 hover:border-amber-500/70 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between glow-amber min-w-0" data-index="${idx}" data-code="${c.card_code}" data-name="${(ch.name || '').toLowerCase()}" data-greeting="${(c.event_greeting || '').toLowerCase()}" data-keywords="${keywords}" data-lore="${(ch.micro_lore || '').toLowerCase()}" data-category="${category}" data-front="${front}" data-back="${back}">
        <!-- Clean Image Box - 100% Unobstructed Art -->
        <div class="relative w-full aspect-[9/16] bg-[#120C08] overflow-hidden flex items-center justify-center">
            <img src="${front}" alt="${ch.name}" class="card-img w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
            <div class="absolute top-2 right-2 bg-black/85 backdrop-blur-sm text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-lg border border-amber-600/50 text-amber-300">
                #${c.card_code}
            </div>
        </div>
        <!-- Card Details Footer -->
        <div class="p-2.5 sm:p-4 flex flex-col gap-1 sm:gap-1.5 flex-grow justify-between min-w-0">
            <div class="min-w-0">
                <div class="flex justify-between items-center mb-0.5 sm:mb-1 gap-1">
                    <span class="text-[9px] sm:text-[10px] font-bold text-rose-300 tracking-wider uppercase truncate">${c.event_greeting || 'Happy Holidays!'}</span>
                    <span class="text-[8px] sm:text-[9px] bg-[#140D08] text-amber-200/90 px-1.5 sm:px-2 py-0.5 rounded-full border border-amber-800/40 flex-shrink-0">${getCategoryName(category)}</span>
                </div>
                <div class="font-clayTitle text-xs sm:text-base lg:text-lg font-bold text-white group-hover:text-amber-300 transition-colors leading-snug truncate">${ch.name}</div>
                <div class="text-[10px] sm:text-xs text-amber-200/80 italic truncate mt-0.5">${ch.title}</div>
            </div>
            <div class="mt-2 pt-1.5 sm:pt-2 border-t border-amber-900/40 flex justify-between items-center text-[10px] sm:text-xs font-bold text-amber-300">
                <span class="flex items-center gap-1 text-[10px] sm:text-[11px] text-amber-300"><i class="fa-solid fa-play text-rose-400"></i> Video &amp; NFC</span>
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
                
                <!-- MOBILE VIDEO FIRST: Video shows at the very top of hero on mobile (No Unmute Overlay) -->
                <div class="lg:col-span-5 flex flex-col items-center justify-center w-full min-w-0 order-1 lg:order-2">
                    <div class="relative group block w-60 sm:w-72 aspect-[9/16] rounded-3xl overflow-hidden border-[2px] border-amber-500/70 shadow-2xl bg-black glow-amber transition-transform hover:scale-[1.02] cursor-pointer" onclick="toggleHeroMute()">
                        <video id="heroVideo" autoplay loop playsinline poster="${featuredFront}" class="w-full h-full object-cover">
                            <source src="${featuredVideo}" type="video/mp4">
                        </video>
                    </div>
                    <!-- Clean Hero Sound Toggle Button -->
                    <div class="mt-2.5 flex items-center justify-center gap-3">
                        <button onclick="toggleHeroMute()" id="heroSoundBtn" class="bg-[#140D08] hover:bg-[#20140D] text-amber-300 text-xs font-bold px-3 py-1.5 rounded-xl border border-amber-800/40 flex items-center gap-1.5 transition-all shadow">
                            <i id="heroMuteIcon" class="fa-solid fa-volume-high text-rose-400"></i> <span id="heroMuteText">Sound: Playing</span>
                        </button>
                        <a href="/001/" class="text-xs text-amber-200/80 hover:text-amber-300 font-semibold flex items-center gap-1">
                            <span>Open Santa (001)</span> &rarr;
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
                            16 Handcrafted Characters
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
                            <i class="fa-solid fa-boxes-stacked"></i> Explore All 16 Cards
                        </a>
                    </div>
                </div>

            </div>
        </div>

        <!-- Collection Section: Filters, Sorts, Slider & Responsive Grid (3-column mobile enabled, display rows removed) -->
        <section id="collection" class="mb-14">
            
            <!-- Filter & Sort Control Hub -->
            <div class="bg-[#1C120C]/90 rounded-3xl p-4 sm:p-6 mb-6 shadow-xl border border-amber-700/40 backdrop-blur-md flex flex-col gap-4 w-full">
                
                <!-- Row 1: Header, Search, and Front/Back Toggle -->
                <div class="flex flex-col lg:flex-row gap-4 items-center justify-between w-full">
                    <div class="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-start">
                        <h2 class="font-clayTitle text-xl sm:text-2xl font-bold text-white whitespace-nowrap flex items-center gap-2">
                            <i class="fa-solid fa-boxes-stacked text-amber-400"></i> Series 1 Gallery
                        </h2>
                        <span id="cardCountBadge" class="bg-[#140D08] text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-700/40">
                            ${cards.length} Cards (001&ndash;${cards[cards.length - 1].card_code})
                        </span>
                    </div>

                    <div class="flex flex-wrap gap-2.5 sm:gap-3 w-full lg:w-auto items-center justify-between lg:justify-end">
                        <!-- Search Input -->
                        <div class="relative flex-grow sm:flex-grow-0 w-full sm:w-64">
                            <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-300/50 text-xs"></i>
                            <input type="text" id="searchInput" placeholder="Search characters, mottos, stats..." oninput="filterCards()" class="w-full bg-[#140D08] text-amber-100 placeholder-amber-200/50 text-xs sm:text-sm pl-9 pr-3.5 py-2 rounded-xl border border-amber-800/40 focus:outline-none focus:ring-2 focus:ring-amber-500">
                        </div>

                        <!-- Sort Dropdown -->
                        <div class="relative flex-grow sm:flex-grow-0">
                            <select id="sortSelect" onchange="sortCards()" class="w-full sm:w-auto bg-[#140D08] text-amber-200 text-xs font-bold px-3 py-2 rounded-xl border border-amber-800/40 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer">
                                <option value="num-asc">Sort: Card # (001 &rarr; 016)</option>
                                <option value="num-desc">Sort: Card # (016 &rarr; 001)</option>
                                <option value="name-asc">Sort: Name (A &rarr; Z)</option>
                                <option value="name-desc">Sort: Name (Z &rarr; A)</option>
                            </select>
                        </div>

                        <!-- Front / Back Toggle -->
                        <div class="flex bg-[#140D08] p-1 rounded-xl border border-amber-800/40">
                            <button onclick="setGridSide('front')" id="btnFront" class="px-3 py-1 text-xs font-bold rounded-lg bg-rose-700 text-white shadow transition-all">Front</button>
                            <button onclick="setGridSide('back')" id="btnBack" class="px-3 py-1 text-xs font-bold rounded-lg text-amber-200/70 transition-all">Back</button>
                        </div>
                    </div>
                </div>

                <!-- Row 2: Category Filter Pills -->
                <div class="flex flex-wrap gap-2 items-center pt-2 border-t border-amber-900/30">
                    <span class="text-xs font-bold text-amber-300/80 mr-1 flex items-center gap-1.5">
                        <i class="fa-solid fa-filter text-rose-400"></i> Categories:
                    </span>
                    <button onclick="setCategoryFilter('all')" class="cat-pill active px-3 py-1 text-xs font-bold rounded-xl bg-amber-500 text-[#120C08] border border-amber-400 shadow transition-all" data-cat="all">All 16</button>
                    <button onclick="setCategoryFilter('classic')" class="cat-pill px-3 py-1 text-xs font-bold rounded-xl bg-[#140D08] text-amber-200 hover:text-white border border-amber-800/40 transition-all" data-cat="classic">Classic Icons</button>
                    <button onclick="setCategoryFilter('magic')" class="cat-pill px-3 py-1 text-xs font-bold rounded-xl bg-[#140D08] text-amber-200 hover:text-white border border-amber-800/40 transition-all" data-cat="magic">Winter Magic</button>
                    <button onclick="setCategoryFilter('hearth')" class="cat-pill px-3 py-1 text-xs font-bold rounded-xl bg-[#140D08] text-amber-200 hover:text-white border border-amber-800/40 transition-all" data-cat="hearth">Hearth &amp; Holiday</button>
                    <button onclick="setCategoryFilter('friends')" class="cat-pill px-3 py-1 text-xs font-bold rounded-xl bg-[#140D08] text-amber-200 hover:text-white border border-amber-800/40 transition-all" data-cat="friends">Festive Friends</button>
                </div>

                <!-- Row 3: Columns Selector (1 to 4 cols with Mobile 3-Column Support; Display Rows Filter Removed) -->
                <div class="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-amber-900/30 text-xs font-bold text-amber-200">
                    
                    <!-- Columns Selector & Slider (Supports Mobile 3-Columns Wide!) -->
                    <div class="flex flex-wrap items-center gap-2.5">
                        <span class="text-amber-300 flex items-center gap-1">
                            <i class="fa-solid fa-table-columns text-amber-400"></i> Columns:
                        </span>
                        <div class="flex items-center gap-1 bg-[#140D08] p-1 rounded-xl border border-amber-800/40">
                            <button onclick="setColumns(1)" id="colBtn1" class="col-btn px-2.5 py-0.5 rounded-lg text-amber-200/80 hover:text-white transition-all">1</button>
                            <button onclick="setColumns(2)" id="colBtn2" class="col-btn px-2.5 py-0.5 rounded-lg text-amber-200/80 hover:text-white transition-all">2</button>
                            <button onclick="setColumns(3)" id="colBtn3" class="col-btn px-2.5 py-0.5 rounded-lg text-amber-200/80 hover:text-white transition-all">3</button>
                            <button onclick="setColumns(4)" id="colBtn4" class="col-btn px-2.5 py-0.5 rounded-lg text-amber-200/80 hover:text-white transition-all">4</button>
                        </div>
                        <input type="range" id="colSlider" min="1" max="4" value="4" oninput="setColumns(parseInt(this.value))" class="w-20 accent-amber-500 cursor-pointer hidden sm:inline-block">
                    </div>

                    <!-- Horizontal Carousel Slider Mode Toggle -->
                    <div class="flex items-center gap-2">
                        <button onclick="toggleSliderView()" id="btnSliderView" class="px-3 py-1 rounded-xl bg-[#140D08] text-amber-300 hover:text-white border border-amber-800/40 flex items-center gap-1.5 transition-all shadow">
                            <i class="fa-solid fa-arrows-left-right text-rose-400"></i> <span id="sliderModeLabel">Carousel Mode</span>
                        </button>
                    </div>

                </div>
            </div>

            <!-- Pre-rendered Static Cards Grid Container (Clean All 16 Cards Displayed Without Row Limiters) -->
            <div id="gridWrapper" class="w-full relative transition-all duration-300">
                <div id="cardsGrid" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 w-full transition-all duration-300">
                    ${renderedCardsHtml}
                </div>

                <!-- Carousel Navigation Arrows (Shown when in Carousel Slider Mode) -->
                <button id="sliderPrevBtn" onclick="slideCards(-1)" class="hidden absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-10 h-10 rounded-full bg-black/90 text-amber-300 border border-amber-600/50 shadow-2xl items-center justify-center hover:scale-110 active:scale-95 transition-all z-20">
                    <i class="fa-solid fa-chevron-left"></i>
                </button>
                <button id="sliderNextBtn" onclick="slideCards(1)" class="hidden absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-10 h-10 rounded-full bg-black/90 text-amber-300 border border-amber-600/50 shadow-2xl items-center justify-center hover:scale-110 active:scale-95 transition-all z-20">
                    <i class="fa-solid fa-chevron-right"></i>
                </button>
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
        function initHeroVideo() {
            var vid = document.getElementById('heroVideo');
            if (!vid) return;

            var soundPref = null;
            try { soundPref = localStorage.getItem('tg_sound'); } catch (e) {}

            if (soundPref === 'muted') {
                vid.muted = true;
                updateHeroSoundUI(true);
            } else {
                vid.muted = false;
                var promise = vid.play();
                if (promise !== undefined) {
                    promise.catch(function(e) {
                        vid.muted = true;
                        vid.play();
                        updateHeroSoundUI(true);
                    }).then(function() {
                        updateHeroSoundUI(vid.muted);
                    });
                }
            }
        }

        function toggleHeroMute() {
            var vid = document.getElementById('heroVideo');
            if (!vid) return;

            vid.muted = !vid.muted;
            try {
                localStorage.setItem('tg_sound', vid.muted ? 'muted' : 'unmuted');
            } catch (e) {}
            updateHeroSoundUI(vid.muted);
        }

        function updateHeroSoundUI(isMuted) {
            var icon = document.getElementById('heroMuteIcon');
            var text = document.getElementById('heroMuteText');
            if (isMuted) {
                if (icon) icon.className = 'fa-solid fa-volume-xmark text-amber-300';
                if (text) text.innerText = 'Sound: Muted';
            } else {
                if (icon) icon.className = 'fa-solid fa-volume-high text-rose-400';
                if (text) text.innerText = 'Sound: Playing 🔊';
            }
        }

        var currentGridSide = 'front';
        var currentCategory = 'all';
        var currentColumns = 4;
        var isCarouselMode = false;

        // Responsive initial defaults (Desktop = 4 cols, Mobile = 2 cols)
        function initGridDefaults() {
            var isMobile = window.innerWidth < 768;
            currentColumns = isMobile ? 2 : 4;
            setColumns(currentColumns);
            initHeroVideo();
        }

        // ALLOWS MOBILE TO GO 3 COLUMNS WIDE!
        function setColumns(cols) {
            currentColumns = Math.max(1, Math.min(4, cols));
            var grid = document.getElementById('cardsGrid');
            var slider = document.getElementById('colSlider');
            if (slider) slider.value = currentColumns;

            // Update button styles
            for (var i = 1; i <= 4; i++) {
                var btn = document.getElementById('colBtn' + i);
                if (btn) {
                    if (i === currentColumns) {
                        btn.className = 'col-btn px-2.5 py-0.5 rounded-lg bg-amber-500 text-[#120C08] font-bold shadow transition-all';
                    } else {
                        btn.className = 'col-btn px-2.5 py-0.5 rounded-lg text-amber-200/80 hover:text-white transition-all';
                    }
                }
            }

            if (grid && !isCarouselMode) {
                if (currentColumns === 1) {
                    grid.className = 'grid grid-cols-1 max-w-md mx-auto gap-4 sm:gap-6 w-full transition-all duration-300';
                } else if (currentColumns === 2) {
                    grid.className = 'grid grid-cols-2 gap-3 sm:gap-6 w-full transition-all duration-300';
                } else if (currentColumns === 3) {
                    // Mobile 3 Columns Wide with tight, comfortable spacing!
                    grid.className = 'grid grid-cols-3 gap-2 sm:gap-4 lg:gap-6 w-full transition-all duration-300';
                } else {
                    grid.className = 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 w-full transition-all duration-300';
                }
            }
        }

        function toggleSliderView() {
            isCarouselMode = !isCarouselMode;
            var grid = document.getElementById('cardsGrid');
            var label = document.getElementById('sliderModeLabel');
            var btnPrev = document.getElementById('sliderPrevBtn');
            var btnNext = document.getElementById('sliderNextBtn');
            var btn = document.getElementById('btnSliderView');

            if (isCarouselMode) {
                grid.className = 'flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 no-scrollbar scroll-smooth w-full';
                document.querySelectorAll('.card-item').forEach(function(c) {
                    c.classList.add('flex-shrink-0', 'w-60', 'sm:w-72', 'snap-center');
                });
                if (btnPrev) btnPrev.classList.remove('hidden');
                if (btnNext) btnNext.classList.remove('hidden');
                if (label) label.innerText = 'Grid Mode';
                if (btn) btn.className = 'px-3 py-1 rounded-xl bg-amber-500 text-[#120C08] font-bold border border-amber-400 flex items-center gap-1.5 transition-all shadow';
            } else {
                document.querySelectorAll('.card-item').forEach(function(c) {
                    c.classList.remove('flex-shrink-0', 'w-60', 'sm:w-72', 'snap-center');
                });
                setColumns(currentColumns);
                if (btnPrev) btnPrev.classList.add('hidden');
                if (btnNext) btnNext.classList.add('hidden');
                if (label) label.innerText = 'Carousel Mode';
                if (btn) btn.className = 'px-3 py-1 rounded-xl bg-[#140D08] text-amber-300 hover:text-white border border-amber-800/40 flex items-center gap-1.5 transition-all shadow';
            }
        }

        function slideCards(direction) {
            var grid = document.getElementById('cardsGrid');
            if (grid) {
                grid.scrollBy({ left: direction * 300, behavior: 'smooth' });
            }
        }

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

        function setCategoryFilter(cat) {
            currentCategory = cat;
            document.querySelectorAll('.cat-pill').forEach(function(btn) {
                if (btn.getAttribute('data-cat') === cat) {
                    btn.className = 'cat-pill active px-3 py-1 text-xs font-bold rounded-xl bg-amber-500 text-[#120C08] border border-amber-400 shadow transition-all';
                } else {
                    btn.className = 'cat-pill px-3 py-1 text-xs font-bold rounded-xl bg-[#140D08] text-amber-200 hover:text-white border border-amber-800/40 transition-all';
                }
            });
            filterCards();
        }

        function sortCards() {
            var grid = document.getElementById('cardsGrid');
            var sortMode = document.getElementById('sortSelect')?.value || 'num-asc';
            var cards = Array.from(document.querySelectorAll('.card-item'));

            cards.sort(function(a, b) {
                var codeA = parseInt(a.getAttribute('data-code') || '0', 10);
                var codeB = parseInt(b.getAttribute('data-code') || '0', 10);
                var nameA = (a.getAttribute('data-name') || '').toLowerCase();
                var nameB = (b.getAttribute('data-name') || '').toLowerCase();

                if (sortMode === 'num-asc') return codeA - codeB;
                if (sortMode === 'num-desc') return codeB - codeA;
                if (sortMode === 'name-asc') return nameA.localeCompare(nameB);
                if (sortMode === 'name-desc') return nameB.localeCompare(nameA);
                return 0;
            });

            cards.forEach(function(card) {
                grid.appendChild(card);
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
                var category = card.getAttribute('data-category') || '';

                var matchesCat = currentCategory === 'all' || category === currentCategory;
                var matchesSearch = !query || name.includes(query) || greeting.includes(query) || keywords.includes(query) || lore.includes(query);

                if (matchesCat && matchesSearch) {
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

        // Initialize on load
        document.addEventListener('DOMContentLoaded', function() {
            initGridDefaults();
        });
    </script>
${getFooterHtml()}`;

fs.writeFileSync(path.join(projectRoot, 'index.html'), mainIndexHtml, 'utf8');
console.log(`Successfully generated Series 1 main gallery index.html with ${cards.length} characters pre-rendered!`);
