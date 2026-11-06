const fs = require('fs');
const path = require('path');

// Load Single Source of Truth Master Data
const masterFilePath = path.join(__dirname, '../data/greetings_master.json');
const rawData = fs.readFileSync(masterFilePath, 'utf8');
const masterData = JSON.parse(rawData);

const projectRoot = path.join(__dirname, '..');
const cards = masterData.cards || [];
const meta = masterData.series_metadata || {};

// Social channels
const socialChannels = [
  { name: 'TikTok', icon: 'fa-brands fa-tiktok', url: 'https://tiktok.com/@tapthingy' },
  { name: 'Instagram', icon: 'fa-brands fa-instagram', url: 'https://instagram.com/tapthingy' },
  { name: 'YouTube', icon: 'fa-brands fa-youtube', url: 'https://youtube.com/@tapthingy' },
  { name: 'X / Twitter', icon: 'fa-brands fa-x-twitter', url: 'https://x.com/tapthingy' }
];

function safe(str, fallback = '') {
  return str || fallback;
}

function resolveAssetPath(filePath, isSubdir = false) {
  if (!filePath) return '';
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
    if (filePath.includes('TapGreetings.com/assets/') || filePath.includes('tapgreetings.com/assets/')) {
      const idx = filePath.indexOf('/assets/');
      const rel = filePath.substring(idx);
      return isSubdir ? '..' + rel : '.' + rel;
    }
    if (filePath.includes('TapGreetings.com/public/') || filePath.includes('tapgreetings.com/public/')) {
      const idx = filePath.indexOf('/public/');
      const rel = filePath.substring(idx);
      return isSubdir ? '..' + rel : '.' + rel;
    }
    return filePath;
  }
  if (filePath.startsWith('/')) {
    return isSubdir ? '..' + filePath : '.' + filePath;
  }
  return isSubdir ? '../' + filePath : './' + filePath;
}

// Helpers for clean HTML snippets
function renderKeywords(keywords) {
  if (!keywords || !Array.isArray(keywords) || keywords.length === 0) return '';
  const pills = keywords.map(kw => `<span class="text-[10px] bg-[#231710]/90 text-amber-200/90 border border-amber-900/40 px-2.5 py-0.5 rounded-full font-medium">#${kw}</span>`).join('');
  return `<div class="flex flex-wrap justify-center gap-1.5 mt-3 max-w-2xl mx-auto">${pills}</div>`;
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

function renderHiddenItems(hiddenItems) {
  if (!hiddenItems || typeof hiddenItems !== 'object') return '';
  const items = Object.entries(hiddenItems).map(([item, count]) => `
    <div class="bg-[#1C120C] p-2.5 rounded-xl border border-amber-900/40 flex justify-between items-center min-w-0">
        <span class="capitalize text-slate-300 font-medium truncate mr-1">${item.replace(/_/g, ' ')}:</span>
        <span class="text-amber-300 font-bold">${count} Hidden</span>
    </div>
  `).join('');
  return `
    <div class="bg-[#150D09]/85 p-3.5 sm:p-4 rounded-2xl border border-amber-600/30 flex flex-col gap-2 min-w-0">
        <span class="text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
            <i class="fa-solid fa-magnifying-glass text-rose-400"></i> Hidden Clay Collector Hunt (On Physical Card)
        </span>
        <div class="grid grid-cols-2 gap-2 text-xs">
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
            <div>
                <span class="font-bold text-amber-300 block mb-1">Stop-Motion Claymation Video Prompt:</span>
                <div class="bg-[#1A100B] p-2.5 rounded-xl border border-amber-950 text-slate-300 font-mono text-[11px] leading-relaxed break-words whitespace-pre-wrap">
                    ${prompts.prompt_motion_video || ''}
                </div>
            </div>
        </div>
    </details>
  `;
}

function renderDialogueBox(dialogue) {
  if (!dialogue) return '';
  return `
    <div class="mt-3.5 w-full bg-[#1B110B]/95 border border-rose-500/40 rounded-2xl p-3.5 sm:p-4 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 min-w-0">
        <div class="flex items-start gap-3 min-w-0 flex-1">
            <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-600 to-amber-400 flex-shrink-0 flex items-center justify-center text-white font-black text-xs shadow-md">
                <i class="fa-solid fa-volume-high"></i>
            </div>
            <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2">
                    <span class="text-[10px] uppercase font-bold text-amber-300 tracking-wider">Holiday Voiceover Line</span>
                    <div id="audioWave" class="hidden items-center gap-1 h-4">
                        <div class="wave-bar"></div>
                        <div class="wave-bar"></div>
                        <div class="wave-bar"></div>
                        <div class="wave-bar"></div>
                        <div class="wave-bar"></div>
                    </div>
                </div>
                <p class="text-xs sm:text-sm text-amber-100 italic leading-snug mt-1 break-words">
                    &ldquo;${dialogue}&rdquo;
                </p>
            </div>
        </div>
        <button onclick="speakDialogue()" class="bg-gradient-to-r from-rose-700 to-amber-600 hover:from-rose-600 hover:to-amber-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow flex-shrink-0 transition-transform hover:scale-105" title="Listen Aloud">
            <i class="fa-solid fa-play"></i> Listen Voice
        </button>
    </div>
    <script>
        function speakDialogue() {
            triggerConfetti();
            const wave = document.getElementById('audioWave');
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const u = new SpeechSynthesisUtterance(${JSON.stringify(dialogue)});
                u.rate = 0.95;
                u.pitch = 1.05;
                if (wave) {
                    wave.classList.remove('hidden');
                    wave.classList.add('flex');
                }
                u.onend = () => {
                    if (wave) {
                        wave.classList.add('hidden');
                        wave.classList.remove('flex');
                    }
                };
                window.speechSynthesis.speak(u);
            } else {
                alert(${JSON.stringify(dialogue)});
            }
        }
    </script>
  `;
}

// Common HTML Head template for Clay & Needle-Felt Holiday theme
function getHeadHtml(title, cardStyle = null, isSubdir = false, seoData = null, mediaData = null, cardUrl = '') {
  const relPath = isSubdir ? '../' : './';
  
  const colors = cardStyle?.colors || {
    bg_obsidian_midnight: '#180F0B',
    bg_frosted_ice_blue: '#FFF8E7',
    accent_blush_pink: '#F87171',
    accent_champagne_gold: '#FBBF24',
    border_rose_gold: '#9E1B32',
    text_charcoal: '#2A1810',
    text_white: '#FFFFFF',
    neon_halo_glow: '#DC2626'
  };

  const metaDesc = seoData?.seo_meta_desc || 'TapGreetings Series 1: Handcrafted polymer clay and needle-felt smart NFC holiday greeting cards.';
  const metaKeywords = (seoData?.keywords || ['tapgreetings', 'series 1', 'clay holiday card', 'needle felt', 'polymer clay', 'nfc card']).join(', ');
  const pageTitle = `${safe(title, 'TapGreetings')} | TapGreetings Series 1`;
  const ogImg = mediaData?.front_image_url || 'https://tapgreetings.com/assets/img/001-front.jpg';
  const ogVideo = mediaData?.video_url || 'https://tapgreetings.com/assets/video/001-video.mp4';

  return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">
    <title>${pageTitle}</title>
    
    <!-- Primary SEO Meta Tags -->
    <meta name="title" content="${pageTitle}">
    <meta name="description" content="${metaDesc}">
    <meta name="keywords" content="${metaKeywords}">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="${cardUrl || 'https://tapgreetings.com'}">

    <!-- Open Graph / Facebook / WhatsApp -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="${cardUrl || 'https://tapgreetings.com'}">
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${metaDesc}">
    <meta property="og:image" content="${ogImg}">
    <meta property="og:video" content="${ogVideo}">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="${cardUrl || 'https://tapgreetings.com'}">
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
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,700;1,400&family=Montserrat:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;0,900;1,400&family=Poppins:wght@300;400;500;600;700&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <!-- Canvas Confetti Library -->
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js"></script>

    <style>
        :root {
            --mocha-base: #180F0B;
            --cranberry: #9E1B32;
            --buttercream: #FFF8E7;
            --gold-foil: #FBBF24;
        }
        * {
            box-sizing: border-box;
        }
        html, body {
            overflow-x: hidden;
            width: 100%;
            max-width: 100vw;
            background-color: #120C08;
        }
        .break-anywhere {
            overflow-wrap: anywhere;
            word-break: break-word;
        }
        .glow-amber {
            box-shadow: 0 0 35px -5px rgba(251, 191, 36, 0.25);
        }
        .glow-cranberry {
            box-shadow: 0 0 35px -5px rgba(158, 27, 50, 0.35);
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
        .perspective-1000 {
            perspective: 1000px;
        }
        .transform-style-3d {
            transform-style: preserve-3d;
        }
        .backface-hidden {
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
        }
        .flip-card-inner {
            transition: transform 0.65s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .flipped .flip-card-inner {
            transform: rotateY(180deg);
        }
        @keyframes soundWave {
            0%, 100% { height: 4px; }
            50% { height: 18px; }
        }
        .wave-bar {
            width: 3px;
            border-radius: 9999px;
            background-color: #FBBF24;
            animation: soundWave 0.8s ease-in-out infinite;
        }
        .wave-bar:nth-child(1) { animation-delay: 0.1s; }
        .wave-bar:nth-child(2) { animation-delay: 0.3s; }
        .wave-bar:nth-child(3) { animation-delay: 0.2s; }
        .wave-bar:nth-child(4) { animation-delay: 0.4s; }
        .wave-bar:nth-child(5) { animation-delay: 0.15s; }
    </style>
</head>
<body class="font-sans bg-[#120C08] text-amber-50 min-h-screen transition-colors duration-300 selection:bg-rose-600 selection:text-white flex flex-col justify-between overflow-x-hidden">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-[#160E09]/95 backdrop-blur-md border-b border-amber-900/40 px-4 sm:px-8 py-3.5 flex justify-between items-center shadow-xl w-full">
        <a href="${relPath}index.html" class="font-header text-lg sm:text-2xl font-bold text-white flex items-center gap-2 sm:gap-2.5 drop-shadow-[0_0_15px_rgba(251,191,36,0.35)] flex-shrink-0">
            <span class="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-700 via-amber-600 to-amber-300 flex items-center justify-center text-xs sm:text-sm font-black text-white shadow-md">TG</span>
            <div class="flex flex-col">
                <span class="tracking-tight leading-none">TapGreetings</span>
                <span class="text-[9px] text-amber-300 uppercase tracking-widest font-semibold mt-0.5">Series 1 &bull; Clay &amp; Needle Felt</span>
            </div>
        </a>
        <div class="flex items-center gap-3 sm:gap-6">
            <nav class="hidden md:flex gap-6 text-sm font-semibold text-amber-200/90">
                <a href="${relPath}index.html" class="hover:text-amber-300 transition-colors">Home</a>
                <a href="${relPath}index.html#collection" class="hover:text-amber-300 transition-colors">Series 1 (001–008)</a>
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
            const html = document.documentElement;
            const icon = document.getElementById('themeIcon');
            if (html.classList.contains('dark')) {
                html.classList.remove('dark');
                html.classList.add('light');
                icon.className = 'fa-solid fa-sun';
                localStorage.setItem('tapgreetings_theme', 'light');
            } else {
                html.classList.remove('light');
                html.classList.add('dark');
                icon.className = 'fa-solid fa-moon';
                localStorage.setItem('tapgreetings_theme', 'dark');
            }
        }
        const savedTheme = localStorage.getItem('tapgreetings_theme') || 'dark';
        if (savedTheme === 'light') {
            document.documentElement.classList.remove('dark');
            document.documentElement.classList.add('light');
            document.addEventListener('DOMContentLoaded', () => {
                const icon = document.getElementById('themeIcon');
                if (icon) icon.className = 'fa-solid fa-sun';
            });
        }
        function triggerConfetti() {
            if (typeof confetti === 'function') {
                confetti({
                    particleCount: 65,
                    spread: 60,
                    origin: { y: 0.7 },
                    colors: ['#FBBF24', '#9E1B32', '#FFF8E7', '#23412B', '#A8DADC']
                });
            }
        }
    </script>
`;
}

// Common Footer template
function getFooterHtml() {
  return `
    <footer class="w-full text-center py-12 px-4 text-xs sm:text-sm text-amber-200/70 border-t border-amber-900/40 mt-16 sm:mt-24 flex flex-col items-center gap-6 bg-[#0E0704]">
        <div class="flex flex-wrap justify-center gap-6 text-xl text-amber-400">
            ${socialChannels.map(s => `<a href="${s.url}" target="_blank" class="hover:text-rose-400 transition-transform hover:scale-110" title="${s.name}"><i class="${s.icon}"></i></a>`).join('')}
        </div>
        <div class="max-w-xl text-center space-y-2 px-2">
            <p class="font-bold text-amber-100 text-sm">
                TapGreetings &bull; Series 1: The Clay &amp; Needle-Felt Holiday Collection
            </p>
            <p class="leading-relaxed text-amber-200/80 text-xs">
                Crafted in textured polymer clay, needle-felted wool, cast translucent resin ice, and stamped gold-foil hardware. Embedded with high-speed rewritable NTAG215 microchips. Powered by <a href="https://tapthingy.com" target="_blank" class="text-amber-300 font-bold hover:underline">TapThingy</a>.
            </p>
        </div>
        <div class="flex flex-wrap justify-center gap-4 text-xs text-amber-200/70">
            <a href="https://shop.tapthingy.com/collections/all" target="_blank" class="hover:text-amber-300">Shop Collection</a>
            <span>&bull;</span>
            <a href="https://shop.tapthingy.com/products/tap-thingy-nfc-custom-pvc-card" target="_blank" class="hover:text-amber-300">Custom Keepsake Studio</a>
            <span>&bull;</span>
            <a href="https://shop.tapthingy.com/pages/tap-thingy-tools-nfc-reprogram-webtool-and-guide" target="_blank" class="hover:text-amber-300">NFC Tools Guide</a>
        </div>
        <p class="text-[11px] text-amber-200/50">
            &copy; 2026 TapGreetings &bull; TapThingy LLC. Handcrafted in Polymer Clay &amp; Needle Felt.
        </p>
    </footer>
</body>
</html>
`;
}

// 1. Generate Individual Card Pages (001 - 008)
console.log('Generating Series 1 card pages (001 - 008)...');
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

  // Resolve assets
  const frontImg = resolveAssetPath(media.local_front_image_path || media.front_image_url, true);
  const backImg = resolveAssetPath(media.local_back_image_path || media.back_image_url, true);
  const videoSrc = resolveAssetPath(media.local_video_path || media.video_url, true);

  const cardPageHtml = `${getHeadHtml(seo.seo_title || `${char.name} (${char.title})`, card.style_tokens, true, seo, media, card.web_address)}
    <main class="w-full max-w-5xl mx-auto px-3 sm:px-6 py-6 sm:py-10 flex-grow">
        <!-- Main Card Container with Clay Embossed Borders and Amber Glow -->
        <div class="relative bg-[#1A110C]/95 rounded-3xl p-4 sm:p-8 shadow-2xl border-[2px] border-amber-600/40 backdrop-blur-md flex flex-col gap-6 sm:gap-8 glow-amber w-full overflow-hidden">
            
            <!-- 4-Point Gold Starburst Filigree Accents in Corners -->
            <span class="clay-corner top-3 left-3">✦</span>
            <span class="clay-corner top-3 right-3">✦</span>
            <span class="clay-corner bottom-3 left-3">✦</span>
            <span class="clay-corner bottom-3 right-3">✦</span>

            <!-- Top Event & Series Banner -->
            <div class="text-center pt-1 w-full max-w-full">
                <div class="flex flex-wrap justify-center items-center gap-2 mb-3">
                    <span class="inline-block bg-gradient-to-r from-rose-700 via-rose-600 to-amber-600 text-white text-[11px] sm:text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-widest shadow-md">
                        ${card.event_greeting || 'Happy Holidays!'}
                    </span>
                    <span class="inline-block bg-[#241710] text-amber-300 border border-amber-600/40 text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        SERIES 1 &bull; CARD #${card.card_code || ('00' + card.card_number)} OF 008
                    </span>
                    <span class="inline-block bg-[#241710] text-rose-300 border border-rose-600/40 text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        ${char.rarity_tier || 'Series 1 Premier'}
                    </span>
                </div>
                
                <h1 class="font-clayTitle text-2xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-amber-100 via-amber-200 to-rose-200 bg-clip-text text-transparent drop-shadow-md break-words">
                    ${char.name}
                </h1>
                <p class="font-sans text-xs sm:text-sm text-amber-300 font-semibold tracking-wide mt-1.5 break-words">
                    ${char.title} &bull; <span class="text-rose-300 italic font-serif">${char.profile_theme}</span>
                </p>
                <p class="text-xs sm:text-sm text-amber-100/90 italic max-w-xl mx-auto mt-2 px-2 leading-relaxed break-words">
                    &ldquo;${char.motto}&rdquo;
                </p>

                <!-- Keywords / SEO Tag Pills -->
                ${renderKeywords(seo.keywords)}
            </div>

            <!-- Main Layout: Video Player Column + Interactive Experience Column -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start w-full min-w-0">
                
                <!-- Left: 1080p Stop-Motion Video Player with Interactive Tap -->
                <div class="flex flex-col items-center justify-center bg-black/95 rounded-3xl p-2 sm:p-3 border-[2px] border-amber-600/50 ring-2 ring-rose-500/20 shadow-2xl relative overflow-hidden group w-full min-w-0">
                    <div class="relative w-full max-w-[340px] sm:max-w-[400px] mx-auto rounded-2xl overflow-hidden bg-black flex justify-center">
                        <video id="cardVideo" autoplay loop muted playsinline controls poster="${frontImg}" class="aspect-[9/16] w-full max-h-[68vh] sm:max-h-[72vh] object-contain rounded-2xl shadow-inner bg-black">
                            <source src="${videoSrc}" type="video/mp4">
                            Your browser does not support HTML5 video.
                        </video>
                    </div>

                    <div class="mt-3 w-full flex items-center justify-between px-2 text-xs font-semibold text-amber-200">
                        <button onclick="simulateNfcTap()" class="flex items-center gap-1.5 text-amber-300 hover:text-white transition-colors">
                            <i class="fa-solid fa-bolt text-rose-400 animate-pulse"></i> <span>NFC Tap-to-Video</span>
                        </button>
                        <span class="px-2.5 py-0.5 rounded-full bg-[#1F140E] border border-amber-700/50 text-[11px] font-mono text-amber-300">
                            ${media.aspect_ratio || '9:16'} &bull; ${media.video_duration_seconds || 8}s HD Claymation
                        </span>
                    </div>

                    <!-- Audio Dialogue Speech & Voiceover Box -->
                    ${renderDialogueBox(media.audio_dialogue)}
                </div>

                <!-- Right: Lore, Indicators, Physical Card 3D Flip, & Utility Action -->
                <div class="flex flex-col gap-5 sm:gap-6 w-full min-w-0">
                    
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

                    <!-- Interactive Flippable 3D Physical Keepsake Card -->
                    <div class="bg-[#150D09]/95 p-4 sm:p-5 rounded-3xl border border-amber-700/30 shadow-xl flex flex-col items-center min-w-0">
                        <div class="w-full flex justify-between items-center mb-3">
                            <span class="text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                                <i class="fa-solid fa-id-card text-rose-400"></i> Physical CR80 PVC Smart Card
                            </span>
                            <button onclick="toggleCardFlip()" class="bg-[#241710] hover:bg-[#301F15] text-amber-300 text-xs font-bold px-3 py-1.5 rounded-xl border border-amber-600/40 flex items-center gap-1.5 transition-all">
                                <i class="fa-solid fa-arrows-rotate"></i> Flip (Front/Back)
                            </button>
                        </div>

                        <!-- 3D Card Container -->
                        <div id="card3dContainer" class="perspective-1000 w-full max-w-[260px] sm:max-w-[300px] aspect-[9/16] cursor-pointer group my-1" onclick="toggleCardFlip()">
                            <div class="flip-card-inner relative w-full h-full transform-style-3d shadow-2xl rounded-2xl border-[2px] border-amber-600/70 overflow-hidden bg-[#180F0B]">
                                <!-- Front Face -->
                                <div class="absolute inset-0 backface-hidden">
                                    <img src="${frontImg}" alt="${char.name} Front" class="w-full h-full object-contain bg-[#120C08]">
                                    <div class="absolute bottom-2 left-2 right-2 bg-black/85 backdrop-blur-sm text-center py-1 text-[10px] font-bold text-amber-300 uppercase tracking-widest rounded-lg">
                                        Front Artwork &bull; Tap to Flip ↻
                                    </div>
                                </div>
                                <!-- Back Face with NFC Target -->
                                <div class="absolute inset-0 backface-hidden rotate-y-180 bg-[#120C08] flex flex-col justify-between p-3" style="transform: rotateY(180deg);">
                                    <img src="${backImg}" alt="${char.name} Back" class="w-full h-full object-contain">
                                    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none w-11/12 text-center">
                                        <div class="w-14 h-14 rounded-full border-2 border-dashed border-amber-300/80 bg-rose-600/30 backdrop-blur-sm flex items-center justify-center text-amber-300 text-lg font-bold shadow-lg animate-pulse">
                                            ⟡
                                        </div>
                                        <span class="text-[9px] font-bold text-amber-200 mt-1 drop-shadow bg-black/75 px-2 py-0.5 rounded-full">${nfc.tap_label || '⟡ TAP HERE ⟡'}</span>
                                        <span class="text-[8px] text-amber-100 drop-shadow mt-0.5 bg-black/60 px-1.5 py-0.5 rounded">${nfc.instruction || 'Tap with NFC phone'}</span>
                                    </div>
                                    <div class="absolute bottom-2 left-2 right-2 bg-black/85 backdrop-blur-sm text-center py-1 text-[10px] font-bold text-amber-300 uppercase tracking-widest rounded-lg">
                                        Back Antenna Target &bull; Tap to Flip ↻
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p class="text-[11px] text-amber-200/70 mt-2 italic text-center">Click or tap card to inspect front sculpture and back NFC antenna layout</p>
                    </div>

                    <!-- Hidden Collector Items Easter Egg -->
                    ${renderHiddenItems(nfc.hidden_items_count)}

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
                                <i class="fa-solid fa-cart-shopping"></i> Order Keepsake Card &bull; $${comm.price ? comm.price.toFixed(2) : '29.99'}
                            </a>
                            <button onclick="shareGreeting()" class="bg-[#20140D] hover:bg-[#2C1C13] text-white font-bold py-3 px-4 rounded-2xl border border-amber-800/40 shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] text-xs sm:text-sm">
                                <i class="fa-solid fa-share-nodes text-rose-400"></i> Share
                            </button>
                        </div>
                    </div>

                    <!-- Navigation Footer -->
                    <div class="flex justify-between items-center pt-4 border-t border-amber-900/40 text-xs">
                        <a href="../${prevCard.slug}/index.html" class="bg-[#20140D] hover:bg-rose-700 text-white font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow border border-amber-800/40">
                            <i class="fa-solid fa-arrow-left"></i> #${prevCard.card_code || prevCard.slug}
                        </a>
                        <a href="../index.html" class="bg-[#20140D] hover:bg-rose-700 text-white font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow border border-amber-800/40">
                            <i class="fa-solid fa-home"></i> Series 1 Gallery
                        </a>
                        <a href="../${nextCard.slug}/index.html" class="bg-[#20140D] hover:bg-rose-700 text-white font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow border border-amber-800/40">
                            #${nextCard.card_code || nextCard.slug} <i class="fa-solid fa-arrow-right"></i>
                        </a>
                    </div>

                </div>
            </div>

        </div>
    </main>

    <script>
        function toggleCardFlip() {
            const container = document.getElementById('card3dContainer');
            container.classList.toggle('flipped');
        }

        function simulateNfcTap() {
            triggerConfetti();
            const vid = document.getElementById('cardVideo');
            if (vid) {
                vid.currentTime = 0;
                vid.muted = false;
                vid.play().catch(() => {
                    vid.muted = true;
                    vid.play();
                });
            }
        }

        function shareGreeting() {
            triggerConfetti();
            const shareData = {
                title: ${JSON.stringify(char.name + ' - ' + card.event_greeting)},
                text: ${JSON.stringify(card.descriptions?.social_share_caption || (char.name + ' - ' + card.event_greeting))},
                url: window.location.href
            };
            if (navigator.share) {
                navigator.share(shareData).catch(console.error);
            } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Greeting link copied to clipboard!');
            }
        }
    </script>
${getFooterHtml()}
`;

  // Write to primary slug directory (e.g. '001')
  const primaryDir = path.join(projectRoot, card.slug);
  if (!fs.existsSync(primaryDir)) fs.mkdirSync(primaryDir, { recursive: true });
  fs.writeFileSync(path.join(primaryDir, 'index.html'), cardPageHtml, 'utf8');
  console.log(`Generated Card Page: ${card.slug}/index.html`);

  // Write to any alias directories (e.g. 'santa')
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
const featuredFront = resolveAssetPath(featuredMedia.local_front_image_path || featuredMedia.front_image_url, false);
const featuredVideo = resolveAssetPath(featuredMedia.local_video_path || featuredMedia.video_url, false);

const mainIndexHtml = `${getHeadHtml('TapGreetings Series 1: The Clay & Needle-Felt Holiday Collection', featuredCard.style_tokens, false, featuredCard.seo, featuredCard.media, 'https://tapgreetings.com')}
    <main class="w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-12 flex-grow overflow-hidden">
        
        <!-- Hero Spotlight Section Featuring Santa (Card 001) -->
        <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1E130D] via-[#2A1A12] to-[#3B191D] p-5 sm:p-10 lg:p-12 mb-10 shadow-2xl border-[2px] border-amber-600/50 backdrop-blur-md glow-amber w-full">
            <span class="clay-corner top-4 left-4">✦</span>
            <span class="clay-corner top-4 right-4">✦</span>
            <span class="clay-corner bottom-4 left-4">✦</span>
            <span class="clay-corner bottom-4 right-4">✦</span>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
                <!-- Hero Left: Text & CTA -->
                <div class="lg:col-span-7 flex flex-col items-start text-left min-w-0">
                    <div class="flex flex-wrap items-center gap-2 mb-3">
                        <span class="bg-gradient-to-r from-rose-700 via-rose-600 to-amber-600 text-white text-[11px] sm:text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-widest shadow">
                            🎅 SERIES 1 &bull; THE CLAY &amp; NEEDLE-FELT COLLECTION
                        </span>
                        <span class="bg-[#1C120B] text-amber-300 border border-amber-600/40 text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                            8 Handcrafted Characters
                        </span>
                    </div>

                    <h1 class="font-clayTitle text-3xl sm:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-amber-100 via-amber-200 to-rose-200 bg-clip-text text-transparent mb-3 drop-shadow-[0_0_30px_rgba(251,191,36,0.3)] break-words">
                        TapGreetings
                    </h1>
                    
                    <h2 class="font-sans text-lg sm:text-2xl font-bold text-amber-200 mb-3 break-words">
                        ${featuredChar.name} &mdash; <span class="text-rose-300 font-serif italic">${featuredChar.title}</span>
                    </h2>

                    <p class="text-xs sm:text-sm lg:text-base text-amber-100/90 max-w-xl mb-4 leading-relaxed break-words">
                        ${featuredChar.micro_lore}
                    </p>

                    <blockquote class="text-xs sm:text-sm italic text-amber-200/95 border-l-2 border-amber-400 pl-3 mb-6 max-w-xl break-words">
                        &ldquo;${featuredChar.motto}&rdquo;
                    </blockquote>

                    <div class="flex flex-wrap gap-3 w-full sm:w-auto">
                        <a href="./${featuredCard.slug}/index.html" class="bg-gradient-to-r from-rose-700 via-rose-600 to-amber-600 hover:from-rose-600 hover:to-amber-500 text-white font-bold px-6 sm:px-8 py-3 rounded-2xl shadow-xl shadow-rose-950/50 transition-transform hover:scale-105 flex items-center justify-center gap-2 text-xs sm:text-sm flex-1 sm:flex-initial">
                            <i class="fa-solid fa-play"></i> Experience ${featuredChar.name} (001)
                        </a>
                        <a href="#collection" class="bg-[#20140D] hover:bg-[#2C1C13] text-amber-200 border border-amber-600/40 font-bold px-5 sm:px-6 py-3 rounded-2xl shadow-lg transition-transform hover:scale-105 flex items-center justify-center gap-2 text-xs sm:text-sm flex-1 sm:flex-initial">
                            <i class="fa-solid fa-boxes-stacked"></i> Explore All 8 Characters
                        </a>
                    </div>
                </div>

                <!-- Hero Right: Live Stop-Motion Video Tap Preview -->
                <div class="lg:col-span-5 flex justify-center w-full min-w-0">
                    <a href="./${featuredCard.slug}/index.html" class="relative group block w-60 sm:w-72 aspect-[9/16] rounded-3xl overflow-hidden border-[2px] border-amber-600/70 shadow-2xl bg-black glow-amber transition-transform hover:scale-105">
                        <video autoplay loop muted playsinline poster="${featuredFront}" class="w-full h-full object-cover">
                            <source src="${featuredVideo}" type="video/mp4">
                        </video>
                        <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-4">
                            <span class="text-[10px] uppercase font-bold text-amber-300 tracking-wider">Tap to View Card &rarr;</span>
                            <span class="font-clayTitle text-base sm:text-lg font-bold text-white">${featuredChar.name}</span>
                            <span class="text-xs text-rose-300">${featuredCard.event_greeting}</span>
                        </div>
                    </a>
                </div>
            </div>

            <!-- Stats Bar -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 sm:mt-10 pt-6 border-t border-amber-800/40 max-w-4xl mx-auto text-center">
                <div class="bg-[#180F0B]/80 p-3 rounded-2xl border border-amber-700/30">
                    <div class="font-clayTitle text-xl sm:text-2xl font-bold text-amber-200">001 &ndash; 008</div>
                    <div class="text-[10px] sm:text-xs text-amber-300/80 uppercase tracking-wider font-semibold">Series 1 Cards</div>
                </div>
                <div class="bg-[#180F0B]/80 p-3 rounded-2xl border border-amber-700/30">
                    <div class="font-clayTitle text-xl sm:text-2xl font-bold text-rose-300">Polymer Clay</div>
                    <div class="text-[10px] sm:text-xs text-amber-300/80 uppercase tracking-wider font-semibold">&amp; Needle-Felt Wool</div>
                </div>
                <div class="bg-[#180F0B]/80 p-3 rounded-2xl border border-amber-700/30">
                    <div class="font-clayTitle text-xl sm:text-2xl font-bold text-amber-200">NTAG215</div>
                    <div class="text-[10px] sm:text-xs text-amber-300/80 uppercase tracking-wider font-semibold">Rewritable PVC</div>
                </div>
                <div class="bg-[#180F0B]/80 p-3 rounded-2xl border border-amber-700/30">
                    <div class="font-clayTitle text-xl sm:text-2xl font-bold text-emerald-300">Tap-to-Video</div>
                    <div class="text-[10px] sm:text-xs text-amber-300/80 uppercase tracking-wider font-semibold">No App Required</div>
                </div>
            </div>
        </div>

        <!-- SERIES 1 DESIGN MATRIX & THEME SHOWCASE -->
        <section class="mb-12 w-full">
            <div class="text-center max-w-3xl mx-auto mb-8 px-2">
                <span class="text-xs font-bold uppercase tracking-widest text-amber-300 bg-amber-500/10 border border-amber-600/30 px-3.5 py-1.5 rounded-full inline-block mb-3">
                    ✦ Handcrafted Tactile Artistry ✦
                </span>
                <h2 class="font-clayTitle text-2xl sm:text-4xl font-bold text-amber-100 tracking-tight">
                    The Clay &amp; Needle-Felt Holiday Collection
                </h2>
                <p class="text-xs sm:text-sm text-amber-200/80 mt-2 leading-relaxed">
                    Sculpted in matte polymer clay bodies with soft thumbprint textures, needle-felted wool accents, cast-resin translucent ice, and tiny gold-foil hardware. Captured in miniature studio photography with warm amber rim lighting.
                </p>
            </div>

            <!-- Series 1 8-Card Showcase Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                ${cards.map(c => {
                  const ch = c.character || {};
                  const n = c.nfc_config || {};
                  return `
                    <div class="bg-gradient-to-br from-[#1C120C]/95 to-[#241710]/95 p-4 rounded-3xl border border-amber-700/30 hover:border-amber-500/60 shadow-lg transition-all hover:-translate-y-1 flex flex-col justify-between">
                        <div>
                            <div class="flex justify-between items-center mb-2">
                                <span class="text-[10px] uppercase font-bold text-amber-300 bg-[#140D08] px-2 py-0.5 rounded-md border border-amber-800/40">Card #${c.card_code}</span>
                                <span class="text-[10px] text-rose-300 font-semibold">${c.style_tokens?.theme_name || ''}</span>
                            </div>
                            <h3 class="font-clayTitle text-lg font-bold text-white">${ch.name}</h3>
                            <div class="text-xs text-amber-200/90 italic mb-2">${ch.title}</div>
                            <p class="text-[11px] text-amber-100/80 leading-relaxed mb-3 line-clamp-3">
                                ${ch.micro_lore}
                            </p>
                        </div>
                        <div class="pt-3 border-t border-amber-900/40 text-[11px] flex justify-between items-center text-amber-300 font-semibold">
                            <span>Target: ${n.target_shape?.replace(/_/g, ' ')}</span>
                            <a href="./${c.slug}/index.html" class="text-rose-400 hover:text-rose-300 font-bold">Inspect &rarr;</a>
                        </div>
                    </div>
                  `;
                }).join('')}
            </div>
        </section>

        <!-- Collection Controls: Search, Front/Back, Sort -->
        <div id="collection" class="bg-[#1C120C]/90 rounded-3xl p-4 sm:p-6 mb-8 shadow-xl border border-amber-700/40 backdrop-blur-md flex flex-col md:flex-row gap-4 items-center justify-between w-full">
            <div class="flex items-center gap-3 w-full md:w-auto">
                <h2 class="font-clayTitle text-xl sm:text-2xl font-bold text-white whitespace-nowrap flex items-center gap-2">
                    <i class="fa-solid fa-boxes-stacked text-amber-400"></i> Series 1 Gallery
                </h2>
                <span id="cardCountBadge" class="bg-[#140D08] text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-700/40">
                    ${cards.length} Cards (001&ndash;008)
                </span>
            </div>

            <div class="flex flex-wrap gap-2.5 sm:gap-3 w-full md:w-auto items-center justify-start md:justify-end">
                <!-- Search Input -->
                <div class="relative flex-grow sm:flex-grow-0 w-full sm:w-auto">
                    <input type="text" id="searchInput" placeholder="Search cards, clay materials, mottos..." oninput="filterCards()" class="w-full sm:w-64 bg-[#140D08] text-amber-100 placeholder-amber-200/50 text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-amber-800/40 focus:outline-none focus:ring-2 focus:ring-amber-500">
                </div>

                <!-- Front / Back Toggle -->
                <div class="flex bg-[#140D08] p-1 rounded-xl border border-amber-800/40">
                    <button onclick="setSide('front')" id="btnFront" class="px-3 py-1 text-xs font-bold rounded-lg bg-rose-700 text-white shadow transition-all">Front</button>
                    <button onclick="setSide('back')" id="btnBack" class="px-3 py-1 text-xs font-bold rounded-lg text-amber-200/70 transition-all">Back</button>
                </div>
            </div>
        </div>

        <!-- Cards Grid Container (All 8 Cards 001 - 008) -->
        <div id="cardsGrid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
            <!-- Dynamically populated via JS -->
        </div>

        <!-- Web NFC Reprogrammer Tool Feature -->
        <div class="mt-14 sm:mt-20 bg-gradient-to-r from-[#1E130D] via-[#261710] to-[#1E130D] rounded-3xl p-6 sm:p-10 border-[2px] border-amber-600/40 glow-amber text-center max-w-4xl mx-auto w-full">
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
        const cardsData = ${JSON.stringify(cards.map((c, idx) => {
          const ch = c.character || {};
          const m = c.media || {};
          const seo = c.seo || {};
          const front = resolveAssetPath(m.local_front_image_path || m.front_image_url, false);
          const back = resolveAssetPath(m.local_back_image_path || m.back_image_url, false);
          return {
            index: idx,
            id: c.card_id || ('card-' + idx),
            number: c.card_number || (idx + 1),
            code: c.card_code || ('00' + (idx + 1)),
            slug: c.slug,
            name: ch.name || c.slug,
            title: ch.title || '',
            greeting: c.event_greeting || 'Happy Holidays!',
            theme: ch.profile_theme || '',
            frontImg: front,
            backImg: back,
            lore: ch.micro_lore || '',
            motto: ch.motto || '',
            occasion: seo.primary_occasion || 'Winter Holidays',
            keywords: (seo.keywords || []).join(' ').toLowerCase()
          };
        }))};

        let currentSide = 'front';

        function setSide(side) {
            currentSide = side;
            const btnF = document.getElementById('btnFront');
            const btnB = document.getElementById('btnBack');
            if (side === 'front') {
                btnF.className = 'px-3 py-1 text-xs font-bold rounded-lg bg-rose-700 text-white shadow transition-all';
                btnB.className = 'px-3 py-1 text-xs font-bold rounded-lg text-amber-200/70 transition-all';
            } else {
                btnB.className = 'px-3 py-1 text-xs font-bold rounded-lg bg-rose-700 text-white shadow transition-all';
                btnF.className = 'px-3 py-1 text-xs font-bold rounded-lg text-amber-200/70 transition-all';
            }
            filterCards();
        }

        function renderCards(data) {
            const grid = document.getElementById('cardsGrid');
            const badge = document.getElementById('cardCountBadge');
            badge.innerText = data.length + ' Cards';

            if (data.length === 0) {
                grid.innerHTML = '<div class="col-span-full text-center py-16 text-amber-200/60 font-clayTitle text-base sm:text-lg">No matching Series 1 characters found ✦</div>';
                return;
            }

            let html = '';
            data.forEach(c => {
                const imgSrc = currentSide === 'back' && c.backImg ? c.backImg : c.frontImg;

                html += \`
                    <a href="./\${c.slug}/index.html" class="group bg-[#1A110C]/95 rounded-3xl overflow-hidden shadow-xl border border-amber-800/40 hover:border-amber-500/70 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between glow-amber min-w-0">
                        <div class="relative w-full aspect-[9/16] bg-[#120C08] overflow-hidden flex items-center justify-center">
                            <img src="\${imgSrc}" alt="\${c.name}" class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500">
                            <div class="absolute top-2.5 right-2.5 bg-black/85 backdrop-blur-sm text-[10px] font-bold px-2 py-0.5 rounded-md border border-amber-600/50 text-amber-300">
                                #\${c.code}
                            </div>
                            <div class="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-sm text-center py-1 text-[10px] font-bold text-amber-300 uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                Tap to View Card &rarr;
                            </div>
                        </div>
                        <div class="p-4 flex flex-col gap-1.5 flex-grow justify-between min-w-0">
                            <div class="min-w-0">
                                <div class="flex justify-between items-center mb-1 gap-2">
                                    <span class="text-[10px] font-bold text-rose-300 tracking-wider uppercase truncate">\${c.greeting}</span>
                                    <span class="text-[9px] bg-[#140D08] text-amber-200/90 px-2 py-0.5 rounded-full border border-amber-800/40 flex-shrink-0">Series 1</span>
                                </div>
                                <div class="font-clayTitle text-base sm:text-lg font-bold text-white group-hover:text-amber-300 transition-colors leading-snug truncate">\${c.name}</div>
                                <div class="text-xs text-amber-200/80 italic truncate mt-0.5">\${c.title}</div>
                            </div>
                            <div class="mt-3 pt-2.5 border-t border-amber-900/40 flex justify-between items-center text-xs font-bold text-amber-300">
                                <span class="flex items-center gap-1 text-[11px] text-amber-300"><i class="fa-solid fa-bolt text-rose-400"></i> NFC Video</span>
                                <span class="group-hover:translate-x-1 transition-transform">Explore &rarr;</span>
                            </div>
                        </div>
                    </a>
                \`;
            });

            grid.innerHTML = html;
        }

        function filterCards() {
            const query = (document.getElementById('searchInput')?.value || '').toLowerCase().trim();

            let filtered = cardsData.filter(c => {
                const matchQuery = !query || c.name.toLowerCase().includes(query) || c.greeting.toLowerCase().includes(query) || c.keywords.includes(query) || c.lore.toLowerCase().includes(query) || c.theme.toLowerCase().includes(query);
                return matchQuery;
            });

            renderCards(filtered);
        }

        document.addEventListener('DOMContentLoaded', () => {
            renderCards(cardsData);
        });
    </script>
${getFooterHtml()}
`;

fs.writeFileSync(path.join(projectRoot, 'index.html'), mainIndexHtml, 'utf8');
console.log('Successfully generated Series 1 main gallery index.html with all 8 characters!');
