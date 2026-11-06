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

// Helpers for clean HTML snippets without deep template nesting
function renderKeywords(keywords) {
  if (!keywords || !Array.isArray(keywords) || keywords.length === 0) return '';
  const pills = keywords.map(kw => `<span class="text-[10px] bg-slate-900/90 text-slate-300 border border-slate-800 px-2.5 py-0.5 rounded-full">#${kw}</span>`).join('');
  return `<div class="flex flex-wrap justify-center gap-1.5 mt-3 max-w-2xl mx-auto">${pills}</div>`;
}

function renderIndicators(indicators) {
  if (!indicators || typeof indicators !== 'object') return '';
  const items = Object.entries(indicators).map(([key, val]) => `
    <div class="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 min-w-0 overflow-hidden">
        <div class="text-[9px] uppercase font-bold text-slate-400 tracking-wider truncate">${key}</div>
        <div class="font-serif text-xs sm:text-base font-bold text-amber-300 mt-0.5 truncate">${val}</div>
    </div>
  `).join('');
  return `
    <div class="bg-slate-950/90 p-4 sm:p-5 rounded-2xl border border-rose-400/30 shadow-inner min-w-0">
        <span class="text-[11px] font-bold uppercase tracking-wider text-pink-300 block mb-3 flex items-center gap-1.5">
            <i class="fa-solid fa-chart-simple"></i> Character Indicators &amp; Attributes
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
    <div class="bg-slate-900 p-2 rounded-xl border border-slate-800 flex justify-between items-center min-w-0">
        <span class="capitalize text-slate-300 font-medium truncate mr-1">${item.replace(/_/g, ' ')}:</span>
        <span class="text-amber-300 font-bold">${count} Hidden</span>
    </div>
  `).join('');
  return `
    <div class="bg-slate-950/80 p-3.5 sm:p-4 rounded-2xl border border-amber-400/30 flex flex-col gap-2 min-w-0">
        <span class="text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
            <i class="fa-solid fa-magnifying-glass"></i> Hidden Collector Hunt (On Physical Card)
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
    <details class="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 group min-w-0">
        <summary class="cursor-pointer text-xs font-bold text-slate-300 flex justify-between items-center select-none">
            <span class="flex items-center gap-1.5"><i class="fa-solid fa-wand-magic-sparkles text-pink-400"></i> Generative Prompts &amp; Specs</span>
            <span class="text-slate-400 group-open:rotate-180 transition-transform">&darr;</span>
        </summary>
        <div class="mt-3 flex flex-col gap-2.5 text-xs border-t border-slate-800/80 pt-3 min-w-0">
            <div>
                <span class="font-bold text-slate-400 block mb-1">Front Artwork Prompt:</span>
                <div class="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 text-slate-300 font-mono text-[11px] leading-relaxed break-words whitespace-pre-wrap">
                    ${prompts.prompt_front_artwork}
                </div>
            </div>
            <div>
                <span class="font-bold text-slate-400 block mb-1">Motion Video Prompt:</span>
                <div class="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 text-slate-300 font-mono text-[11px] leading-relaxed break-words whitespace-pre-wrap">
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
    <div class="mt-3.5 w-full bg-slate-900/95 border border-pink-400/40 rounded-2xl p-3.5 sm:p-4 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 min-w-0">
        <div class="flex items-start gap-3 min-w-0 flex-1">
            <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-amber-400 flex-shrink-0 flex items-center justify-center text-slate-950 font-black text-xs shadow">
                <i class="fa-solid fa-volume-high"></i>
            </div>
            <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2">
                    <span class="text-[10px] uppercase font-bold text-amber-300 tracking-wider">Voice Dialogue</span>
                    <div id="audioWave" class="hidden items-center gap-1 h-4">
                        <div class="wave-bar"></div>
                        <div class="wave-bar"></div>
                        <div class="wave-bar"></div>
                        <div class="wave-bar"></div>
                        <div class="wave-bar"></div>
                    </div>
                </div>
                <p class="text-xs sm:text-sm text-slate-100 italic leading-snug mt-1 break-words">
                    &ldquo;${dialogue}&rdquo;
                </p>
            </div>
        </div>
        <button onclick="speakDialogue()" class="bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow flex-shrink-0 transition-transform hover:scale-105" title="Listen Aloud">
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

// Common HTML Head template
function getHeadHtml(title, cardStyle = null, isSubdir = false, seoData = null, mediaData = null, cardUrl = '') {
  const relPath = isSubdir ? '../' : './';
  
  const colors = cardStyle?.colors || {
    bg_obsidian_midnight: '#070A14',
    bg_frosted_ice_blue: '#E0F7FA',
    accent_blush_pink: '#FFD1DC',
    accent_champagne_gold: '#F4E0A5',
    border_rose_gold: '#B76E79',
    text_charcoal: '#2B2B2B',
    text_white: '#FFFFFF',
    neon_halo_glow: '#FF69B4'
  };

  const metaDesc = seoData?.seo_meta_desc || 'TapGreetings smart NFC video greeting cards that come alive with a single smartphone tap.';
  const metaKeywords = (seoData?.keywords || ['tapgreetings', 'nfc card', 'smart greeting card', 'video card', 'tapthingy']).join(', ');
  const pageTitle = `${safe(title, 'TapGreetings')} | TapGreetings by TapThingy`;
  const ogImg = mediaData?.front_image_url || 'https://tapgreetings.com/assets/img/01-front.jpg';
  const ogVideo = mediaData?.video_url || 'https://tapgreetings.com/assets/video/01-video.mp4';

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
                        midnight: '${colors.bg_obsidian_midnight}',
                        iceBlue: '${colors.bg_frosted_ice_blue}',
                        blushPink: '${colors.accent_blush_pink}',
                        champagneGold: '${colors.accent_champagne_gold}',
                        roseGold: '${colors.border_rose_gold}',
                        neonGlow: '${colors.neon_halo_glow}',
                        brand: {
                            50: '#fdf4ff',
                            100: '#fae8ff',
                            200: '#f5d0fe',
                            400: '#e879f9',
                            500: '#d946ef',
                            600: '#c026d3',
                            700: '#a21caf',
                            900: '#4a044e',
                            950: '#1b051f'
                        }
                    },
                    fontFamily: {
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
    <!-- Canvas Confetti Library for Celebratory Micro-interactions -->
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js"></script>

    <style>
        :root {
            --card-midnight: ${colors.bg_obsidian_midnight};
            --card-ice: ${colors.bg_frosted_ice_blue};
            --card-pink: ${colors.accent_blush_pink};
            --card-gold: ${colors.accent_champagne_gold};
            --card-rose-gold: ${colors.border_rose_gold};
            --card-neon: ${colors.neon_halo_glow};
        }
        * {
            box-sizing: border-box;
        }
        html, body {
            overflow-x: hidden;
            width: 100%;
            max-width: 100vw;
        }
        .break-anywhere {
            overflow-wrap: anywhere;
            word-break: break-word;
        }
        .glow-neon {
            box-shadow: 0 0 35px -5px ${colors.neon_halo_glow}40;
        }
        .glow-gold {
            box-shadow: 0 0 30px -5px ${colors.accent_champagne_gold}45;
        }
        .starburst-corner {
            position: absolute;
            width: 18px;
            height: 18px;
            color: ${colors.accent_champagne_gold};
            font-size: 15px;
            line-height: 1;
            user-select: none;
            pointer-events: none;
            filter: drop-shadow(0 0 5px ${colors.accent_champagne_gold});
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
        /* Sound wave bar animations */
        @keyframes soundWave {
            0%, 100% { height: 4px; }
            50% { height: 18px; }
        }
        .wave-bar {
            width: 3px;
            border-radius: 9999px;
            background-color: #F4E0A5;
            animation: soundWave 0.8s ease-in-out infinite;
        }
        .wave-bar:nth-child(1) { animation-delay: 0.1s; }
        .wave-bar:nth-child(2) { animation-delay: 0.3s; }
        .wave-bar:nth-child(3) { animation-delay: 0.2s; }
        .wave-bar:nth-child(4) { animation-delay: 0.4s; }
        .wave-bar:nth-child(5) { animation-delay: 0.15s; }
    </style>
</head>
<body class="font-sans bg-[#070A14] text-slate-100 min-h-screen transition-colors duration-300 selection:bg-pink-500 selection:text-white flex flex-col justify-between overflow-x-hidden">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-[#070A14]/95 backdrop-blur-md border-b border-rose-400/25 px-4 sm:px-8 py-3.5 flex justify-between items-center shadow-xl w-full">
        <a href="${relPath}index.html" class="font-header text-lg sm:text-2xl font-bold text-white flex items-center gap-2 sm:gap-2.5 drop-shadow-[0_0_15px_rgba(255,105,180,0.5)] flex-shrink-0">
            <span class="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-600 via-rose-500 to-amber-300 flex items-center justify-center text-xs sm:text-sm font-black text-white shadow-md">TG</span>
            <span class="tracking-tight">TapGreetings</span>
        </a>
        <div class="flex items-center gap-3 sm:gap-6">
            <nav class="hidden md:flex gap-6 text-sm font-semibold text-slate-300">
                <a href="${relPath}index.html" class="hover:text-pink-300 transition-colors">Home</a>
                <a href="${relPath}index.html#collection" class="hover:text-pink-300 transition-colors">Cards Gallery</a>
                <a href="${meta.custom_designer_url}" target="_blank" class="hover:text-amber-300 transition-colors">Custom Studio</a>
                <a href="${meta.tools_url}" target="_blank" class="hover:text-pink-300 transition-colors">NFC Tools</a>
            </nav>
            <a href="${meta.shop_url}" target="_blank" class="bg-gradient-to-r from-pink-600 to-amber-500 hover:from-pink-500 hover:to-amber-400 text-white text-xs font-bold px-3 sm:px-4 py-2 rounded-xl shadow transition-transform hover:scale-105 flex items-center gap-1.5">
                <i class="fa-solid fa-cart-shopping"></i> <span class="hidden sm:inline">Shop</span> Cards
            </a>
            <button onclick="toggleTheme()" class="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-900 border border-rose-400/30 text-amber-300 flex items-center justify-center shadow hover:scale-105 transition-transform" title="Toggle Light/Dark Mode">
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
                    particleCount: 70,
                    spread: 60,
                    origin: { y: 0.7 },
                    colors: ['#FF69B4', '#F4E0A5', '#E0F7FA', '#B76E79']
                });
            }
        }
    </script>
`;
}

// Common Footer template
function getFooterHtml() {
  return `
    <footer class="w-full text-center py-12 px-4 text-xs sm:text-sm text-slate-400 border-t border-slate-800/80 mt-16 sm:mt-24 flex flex-col items-center gap-6 bg-[#05070E]">
        <div class="flex flex-wrap justify-center gap-6 text-xl text-rose-400">
            ${socialChannels.map(s => `<a href="${s.url}" target="_blank" class="hover:text-amber-300 transition-transform hover:scale-110" title="${s.name}"><i class="${s.icon}"></i></a>`).join('')}
        </div>
        <div class="max-w-xl text-center space-y-2 px-2">
            <p class="font-bold text-slate-200">
                TapGreetings &bull; Smart NFC Living Keepsake Greeting Cards
            </p>
            <p class="leading-relaxed text-slate-400 text-xs">
                Featuring rewritable NTAG215 waterproof CR80 PVC hardware, 1080p motion video streaming, and instant over-the-air reprogrammability. Powered by <a href="https://tapthingy.com" target="_blank" class="text-pink-400 font-bold hover:underline">TapThingy</a>.
            </p>
        </div>
        <div class="flex flex-wrap justify-center gap-4 text-xs text-slate-400">
            <a href="https://shop.tapthingy.com/collections/all" target="_blank" class="hover:text-amber-300">Shop Collection</a>
            <span>&bull;</span>
            <a href="https://shop.tapthingy.com/products/tap-thingy-nfc-custom-pvc-card" target="_blank" class="hover:text-amber-300">Custom Video Studio</a>
            <span>&bull;</span>
            <a href="https://shop.tapthingy.com/pages/tap-thingy-tools-nfc-reprogram-webtool-and-guide" target="_blank" class="hover:text-pink-300">NFC Tools Guide</a>
        </div>
        <p class="text-[11px] text-slate-400">
            &copy; 2026 TapGreetings &bull; TapThingy LLC. All rights reserved.
        </p>
    </footer>
</body>
</html>
`;
}

// 1. Generate Individual Card Pages
console.log('Generating individual card pages...');
cards.forEach((card, index) => {
  const prevCard = index > 0 ? cards[index - 1] : cards[cards.length - 1];
  const nextCard = index < cards.length - 1 ? cards[index + 1] : cards[0];

  const colors = card.style_tokens?.colors || {};
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

  const cardPageHtml = `${getHeadHtml(seo.seo_title || `${char.name} - ${card.event_greeting}`, card.style_tokens, true, seo, media, card.web_address)}
    <main class="w-full max-w-5xl mx-auto px-3 sm:px-6 py-6 sm:py-10 flex-grow">
        <!-- Main Card Container with Sharp Rectangular Borders and Filigree Stroke -->
        <div class="relative bg-[#0A0E1A]/95 rounded-2xl p-4 sm:p-8 shadow-2xl border-[1.5pt] border-rose-400/40 backdrop-blur-md flex flex-col gap-6 sm:gap-8 glow-neon w-full overflow-hidden">
            
            <!-- 4-Point Gold Starburst Filigree Accents in Corners -->
            <span class="starburst-corner top-3 left-3">✦</span>
            <span class="starburst-corner top-3 right-3">✦</span>
            <span class="starburst-corner bottom-3 left-3">✦</span>
            <span class="starburst-corner bottom-3 right-3">✦</span>

            <!-- Top Event & Series Banner -->
            <div class="text-center pt-1 w-full max-w-full">
                <div class="flex flex-wrap justify-center items-center gap-2 mb-3">
                    <span class="inline-block bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 text-white text-[11px] sm:text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-widest shadow-md">
                        ${card.event_greeting || 'Happy Holidays!'}
                    </span>
                    <span class="inline-block bg-slate-900 text-amber-300 border border-amber-400/40 text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        CARD #${card.card_number || (index + 1)} OF ${cards.length}
                    </span>
                    <span class="inline-block bg-slate-900 text-pink-300 border border-pink-400/40 text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        ${char.rarity_tier || 'Holiday Premier'}
                    </span>
                </div>
                
                <h1 class="font-serif text-2xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-white via-rose-200 to-amber-200 bg-clip-text text-transparent drop-shadow-md break-words">
                    ${char.name}
                </h1>
                <p class="font-sans text-xs sm:text-sm text-rose-300 font-semibold tracking-wide mt-1.5 break-words">
                    ${char.title} &bull; <span class="text-amber-200 italic font-serif">${char.profile_theme}</span>
                </p>
                <p class="text-xs sm:text-sm text-slate-300 italic max-w-xl mx-auto mt-2 px-2 leading-relaxed break-words">
                    &ldquo;${char.motto}&rdquo;
                </p>

                <!-- Keywords / SEO Tag Pills -->
                ${renderKeywords(seo.keywords)}
            </div>

            <!-- Main Layout: Video Player Column + Interactive Experience Column -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start w-full min-w-0">
                
                <!-- Left: 4K Motion Video Player with Interactive Tap -->
                <div class="flex flex-col items-center justify-center bg-black/90 rounded-2xl p-2 sm:p-3 border-[1.5pt] border-rose-400/50 ring-2 ring-pink-500/20 shadow-2xl relative overflow-hidden group w-full min-w-0">
                    <div class="relative w-full max-w-[340px] sm:max-w-[400px] mx-auto rounded-xl overflow-hidden bg-black flex justify-center">
                        <video id="cardVideo" autoplay loop muted playsinline controls poster="${frontImg}" class="aspect-[9/16] w-full max-h-[68vh] sm:max-h-[72vh] object-contain rounded-xl shadow-inner bg-black">
                            <source src="${videoSrc}" type="video/mp4">
                            Your browser does not support HTML5 video.
                        </video>
                    </div>

                    <div class="mt-3 w-full flex items-center justify-between px-2 text-xs font-semibold text-slate-300">
                        <button onclick="simulateNfcTap()" class="flex items-center gap-1.5 text-pink-300 hover:text-amber-300 transition-colors">
                            <i class="fa-solid fa-bolt text-amber-400 animate-pulse"></i> <span>NFC Tap-to-Video</span>
                        </button>
                        <span class="px-2.5 py-0.5 rounded-full bg-slate-900 border border-rose-400/40 text-[11px] font-mono text-amber-300">
                            ${media.aspect_ratio || '9:16'} &bull; ${media.video_duration_seconds || 10}s HD
                        </span>
                    </div>

                    <!-- Audio Dialogue Speech & Voiceover Box -->
                    ${renderDialogueBox(media.audio_dialogue)}
                </div>

                <!-- Right: Lore, Indicators, Physical Card 3D Flip, & Utility Action -->
                <div class="flex flex-col gap-5 sm:gap-6 w-full min-w-0">
                    
                    <!-- Micro Lore Box -->
                    <div class="bg-slate-950/90 p-4 sm:p-5 rounded-2xl border-[1.5pt] border-rose-400/40 shadow-sm relative min-w-0">
                        <span class="text-[11px] font-bold uppercase tracking-wider text-amber-300 block mb-1.5 flex items-center gap-1.5">
                            <i class="fa-solid fa-feather-pointed"></i> Story &amp; Micro-Lore
                        </span>
                        <p class="text-xs sm:text-sm text-slate-200 leading-relaxed font-body break-words">
                            ${char.micro_lore}
                        </p>
                    </div>

                    <!-- Indicators / Collector Metrics -->
                    ${renderIndicators(char.indicators)}

                    <!-- Interactive Flippable 3D Physical Keepsake Card -->
                    <div class="bg-slate-950/90 p-4 sm:p-5 rounded-2xl border border-rose-400/30 shadow-inner flex flex-col items-center min-w-0">
                        <div class="w-full flex justify-between items-center mb-3">
                            <span class="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                                <i class="fa-solid fa-id-card"></i> Physical CR80 PVC Card
                            </span>
                            <button onclick="toggleCardFlip()" class="bg-slate-900 hover:bg-slate-800 text-pink-300 text-xs font-bold px-3 py-1.5 rounded-xl border border-pink-400/40 flex items-center gap-1.5 transition-all">
                                <i class="fa-solid fa-arrows-rotate"></i> Flip (Front/Back)
                            </button>
                        </div>

                        <!-- 3D Card Container -->
                        <div id="card3dContainer" class="perspective-1000 w-full max-w-[260px] sm:max-w-[300px] aspect-[9/16] cursor-pointer group my-1" onclick="toggleCardFlip()">
                            <div class="flip-card-inner relative w-full h-full transform-style-3d shadow-2xl rounded-2xl border-[1.5pt] border-rose-400/70 overflow-hidden bg-slate-900">
                                <!-- Front Face -->
                                <div class="absolute inset-0 backface-hidden">
                                    <img src="${frontImg}" alt="${char.name} Front" class="w-full h-full object-contain bg-slate-950">
                                    <div class="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-sm text-center py-1 text-[10px] font-bold text-amber-300 uppercase tracking-widest rounded-lg">
                                        Front Artwork &bull; Tap to Flip ↻
                                    </div>
                                </div>
                                <!-- Back Face with NFC Target Star -->
                                <div class="absolute inset-0 backface-hidden rotate-y-180 bg-slate-950 flex flex-col justify-between p-3" style="transform: rotateY(180deg);">
                                    <img src="${backImg}" alt="${char.name} Back" class="w-full h-full object-contain">
                                    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none w-11/12 text-center">
                                        <div class="w-14 h-14 rounded-full border-2 border-dashed border-amber-300/80 bg-pink-500/25 backdrop-blur-sm flex items-center justify-center text-amber-300 text-lg font-bold shadow-lg animate-pulse">
                                            ⟡
                                        </div>
                                        <span class="text-[9px] font-bold text-amber-200 mt-1 drop-shadow bg-black/75 px-2 py-0.5 rounded-full">${nfc.tap_label || '⟡ TAP HERE ⟡'}</span>
                                        <span class="text-[8px] text-slate-300 drop-shadow mt-0.5 bg-black/60 px-1.5 py-0.5 rounded">${nfc.instruction || 'Tap with NFC phone'}</span>
                                    </div>
                                    <div class="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-sm text-center py-1 text-[10px] font-bold text-pink-300 uppercase tracking-widest rounded-lg">
                                        Back Antenna Target &bull; Tap to Flip ↻
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p class="text-[11px] text-slate-400 mt-2 italic text-center">Click or tap card to flip between front artwork and back NFC chip layout</p>
                    </div>

                    <!-- Hidden Collector Items Easter Egg -->
                    ${renderHiddenItems(nfc.hidden_items_count)}

                    <!-- AI Creative Prompts Accordion (Container-safe with break-all) -->
                    ${renderPromptsAccordion(prompts)}

                    <!-- Utility Action & Order Buttons -->
                    <div class="flex flex-col gap-3 pt-1 min-w-0">
                        ${utility.button_text ? `
                        <a href="${utility.target_url || '#'}" target="_blank" onclick="triggerConfetti()" class="w-full bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 hover:from-pink-500 hover:to-amber-400 text-white font-bold py-3.5 px-4 rounded-2xl shadow-xl shadow-pink-600/30 text-center flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] text-sm">
                            <i class="fa-solid fa-sparkles"></i> <span>${utility.button_text}</span> &rarr;
                        </a>
                        ` : ''}

                        <div class="flex flex-col sm:flex-row gap-2.5">
                            <a href="${meta.shop_url}" target="_blank" class="flex-1 bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold py-3 px-4 rounded-2xl border border-amber-400/40 shadow-lg text-center flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] text-xs sm:text-sm">
                                <i class="fa-solid fa-cart-shopping"></i> Order Keepsake Card &bull; $${comm.price ? comm.price.toFixed(2) : '29.99'}
                            </a>
                            <button onclick="shareGreeting()" class="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-2xl border border-slate-700 shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] text-xs sm:text-sm">
                                <i class="fa-solid fa-share-nodes text-pink-400"></i> Share
                            </button>
                        </div>
                    </div>

                    <!-- Navigation Footer -->
                    <div class="flex justify-between items-center pt-4 border-t border-slate-800 text-xs">
                        <a href="../${prevCard.slug}/index.html" class="bg-slate-900 hover:bg-pink-600 text-white font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow border border-slate-800">
                            <i class="fa-solid fa-arrow-left"></i> Prev Card
                        </a>
                        <a href="../index.html" class="bg-slate-900 hover:bg-pink-600 text-white font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow border border-slate-800">
                            <i class="fa-solid fa-home"></i> All Cards
                        </a>
                        <a href="../${nextCard.slug}/index.html" class="bg-slate-900 hover:bg-pink-600 text-white font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow border border-slate-800">
                            Next Card <i class="fa-solid fa-arrow-right"></i>
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

  // Write to primary slug directory
  const primaryDir = path.join(projectRoot, card.slug);
  if (!fs.existsSync(primaryDir)) fs.mkdirSync(primaryDir, { recursive: true });
  fs.writeFileSync(path.join(primaryDir, 'index.html'), cardPageHtml, 'utf8');
  console.log(`Generated Card Page: ${card.slug}/index.html`);

  // Also write to any alias directories (e.g. '01', 'holidays')
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
console.log('Generating main gallery index.html...');

const featuredCard = cards[0]; // Delphine
const featuredChar = featuredCard.character || {};
const featuredMedia = featuredCard.media || {};
const featuredFront = resolveAssetPath(featuredMedia.local_front_image_path || featuredMedia.front_image_url, false);
const featuredVideo = resolveAssetPath(featuredMedia.local_video_path || featuredMedia.video_url, false);

const mainIndexHtml = `${getHeadHtml('TapGreetings - Smart NFC Video Keepsake Greeting Cards', featuredCard.style_tokens, false, featuredCard.seo, featuredCard.media, 'https://tapgreetings.com')}
    <main class="w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-12 flex-grow overflow-hidden">
        
        <!-- Hero Spotlight Section Featuring Delphine (Card 01) -->
        <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#070A14] via-[#0E1326] to-[#1F0E23] p-5 sm:p-10 lg:p-12 mb-10 shadow-2xl border-[1.5pt] border-rose-400/40 backdrop-blur-md glow-neon w-full">
            <span class="starburst-corner top-4 left-4">✦</span>
            <span class="starburst-corner top-4 right-4">✦</span>
            <span class="starburst-corner bottom-4 left-4">✦</span>
            <span class="starburst-corner bottom-4 right-4">✦</span>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
                <!-- Hero Left: Text & CTA -->
                <div class="lg:col-span-7 flex flex-col items-start text-left min-w-0">
                    <div class="flex flex-wrap items-center gap-2 mb-3">
                        <span class="bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 text-white text-[11px] sm:text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-widest shadow">
                            ❄️ HOLIDAY PREMIER &bull; SERIES 1
                        </span>
                        <span class="bg-slate-900 text-amber-300 border border-amber-400/40 text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                            ${featuredCard.event_greeting}
                        </span>
                    </div>

                    <h1 class="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-white via-rose-200 to-amber-200 bg-clip-text text-transparent mb-3 drop-shadow-[0_0_30px_rgba(255,105,180,0.4)] break-words">
                        TapGreetings
                    </h1>
                    
                    <h2 class="font-sans text-lg sm:text-2xl font-bold text-rose-300 mb-3 break-words">
                        ${featuredChar.name} &mdash; <span class="text-amber-200 font-serif italic">${featuredChar.title}</span>
                    </h2>

                    <p class="text-xs sm:text-sm lg:text-base text-slate-300 max-w-xl mb-4 leading-relaxed break-words">
                        ${featuredChar.micro_lore}
                    </p>

                    <blockquote class="text-xs sm:text-sm italic text-amber-200/95 border-l-2 border-amber-400 pl-3 mb-6 max-w-xl break-words">
                        &ldquo;${featuredChar.motto}&rdquo;
                    </blockquote>

                    <div class="flex flex-wrap gap-3 w-full sm:w-auto">
                        <a href="./${featuredCard.slug}/index.html" class="bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 hover:from-pink-500 hover:to-amber-400 text-white font-bold px-6 sm:px-8 py-3 rounded-2xl shadow-xl shadow-pink-600/30 transition-transform hover:scale-105 flex items-center justify-center gap-2 text-xs sm:text-sm flex-1 sm:flex-initial">
                            <i class="fa-solid fa-play"></i> Experience ${featuredChar.name}
                        </a>
                        <a href="#collection" class="bg-slate-900 hover:bg-slate-800 text-white border border-rose-400/40 font-bold px-5 sm:px-6 py-3 rounded-2xl shadow-lg transition-transform hover:scale-105 flex items-center justify-center gap-2 text-xs sm:text-sm flex-1 sm:flex-initial">
                            <i class="fa-solid fa-boxes-stacked"></i> Explore Gallery (${cards.length})
                        </a>
                    </div>
                </div>

                <!-- Hero Right: Live Video Tap Preview -->
                <div class="lg:col-span-5 flex justify-center w-full min-w-0">
                    <a href="./${featuredCard.slug}/index.html" class="relative group block w-60 sm:w-72 aspect-[9/16] rounded-2xl overflow-hidden border-[1.5pt] border-rose-400/70 shadow-2xl bg-black glow-gold transition-transform hover:scale-105">
                        <video autoplay loop muted playsinline poster="${featuredFront}" class="w-full h-full object-cover">
                            <source src="${featuredVideo}" type="video/mp4">
                        </video>
                        <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex flex-col justify-end p-4">
                            <span class="text-[10px] uppercase font-bold text-amber-300 tracking-wider">Tap to View Card &rarr;</span>
                            <span class="font-serif text-base sm:text-lg font-bold text-white">${featuredChar.name}</span>
                            <span class="text-xs text-rose-300">${featuredCard.event_greeting}</span>
                        </div>
                    </a>
                </div>
            </div>

            <!-- Stats Bar -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 sm:mt-10 pt-6 border-t border-rose-400/30 max-w-4xl mx-auto text-center">
                <div class="bg-slate-950/70 p-3 rounded-xl border border-rose-400/20">
                    <div class="font-serif text-xl sm:text-2xl font-bold text-rose-300">${cards.length} Cards</div>
                    <div class="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider font-semibold">Curated Q4 Series</div>
                </div>
                <div class="bg-slate-950/70 p-3 rounded-xl border border-rose-400/20">
                    <div class="font-serif text-xl sm:text-2xl font-bold text-amber-300">1080p HD</div>
                    <div class="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider font-semibold">Motion Video &amp; Voice</div>
                </div>
                <div class="bg-slate-950/70 p-3 rounded-xl border border-rose-400/20">
                    <div class="font-serif text-xl sm:text-2xl font-bold text-white">NTAG215</div>
                    <div class="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider font-semibold">Rewritable PVC</div>
                </div>
                <div class="bg-slate-950/70 p-3 rounded-xl border border-rose-400/20">
                    <div class="font-serif text-xl sm:text-2xl font-bold text-cyan-300">Tap-to-Play</div>
                    <div class="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider font-semibold">No App Needed</div>
                </div>
            </div>
        </div>

        <!-- NEW HOMEPAGE INTRO: What Types of Greetings We Have -->
        <section class="mb-12 w-full">
            <div class="text-center max-w-3xl mx-auto mb-8 px-2">
                <span class="text-xs font-bold uppercase tracking-widest text-amber-300 bg-amber-400/10 border border-amber-400/30 px-3.5 py-1.5 rounded-full inline-block mb-3">
                    ✦ Next-Generation Living Cards ✦
                </span>
                <h2 class="font-serif text-2xl sm:text-4xl font-bold text-white tracking-tight">
                    Smart NFC Video Greetings For Every Moment
                </h2>
                <p class="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                    From sparkling winter galas to cozy family Thanksgiving feasts, TapGreetings pairs physical waterproof collector PVC cards with living high-definition video memories. Simply tap your phone to watch, listen, and celebrate.
                </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                
                <!-- Category 1: Winter Holidays & Galas -->
                <div class="bg-gradient-to-br from-slate-900/90 to-slate-950/90 p-5 rounded-2xl border border-pink-500/30 hover:border-pink-500/60 shadow-lg transition-all hover:-translate-y-1">
                    <div class="flex items-center gap-3 mb-3">
                        <div class="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-400/40 text-pink-300 flex items-center justify-center text-lg">
                            ❄️
                        </div>
                        <div>
                            <span class="text-[10px] uppercase font-bold text-pink-300 tracking-wider">Universal Seasonal</span>
                            <h3 class="font-serif text-lg font-bold text-white">Winter Holidays &amp; Galas</h3>
                        </div>
                    </div>
                    <p class="text-xs text-slate-300 leading-relaxed mb-3">
                        Glamorous frosted red carpets, sparkling champagne-boba toasts, and high-fashion holiday celebrations. Featured card: <strong>Delphine, The Ice Starlet</strong>.
                    </p>
                    <div class="text-[11px] text-amber-200/90 font-semibold flex items-center gap-1.5">
                        <i class="fa-solid fa-sparkles text-amber-400"></i> Perfect for: Holiday galas, corporate clients, and luxury festive gifting.
                    </div>
                </div>

                <!-- Category 2: Thanksgiving & Harvest Gratitude -->
                <div class="bg-gradient-to-br from-slate-900/90 to-slate-950/90 p-5 rounded-2xl border border-amber-500/30 hover:border-amber-500/60 shadow-lg transition-all hover:-translate-y-1">
                    <div class="flex items-center gap-3 mb-3">
                        <div class="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center text-lg">
                            🍂
                        </div>
                        <div>
                            <span class="text-[10px] uppercase font-bold text-amber-300 tracking-wider">Seasonal Harvest</span>
                            <h3 class="font-serif text-lg font-bold text-white">Thanksgiving &amp; Gratitude</h3>
                        </div>
                    </div>
                    <p class="text-xs text-slate-300 leading-relaxed mb-3">
                        Steaming spiced cider toasts, rich golden maple leaves, and heartfelt gratitude for family and friends. Featured card: <strong>Autumn Warmth &amp; Gratitude</strong>.
                    </p>
                    <div class="text-[11px] text-amber-200/90 font-semibold flex items-center gap-1.5">
                        <i class="fa-solid fa-sparkles text-amber-400"></i> Perfect for: Thanksgiving dinner favors, hostess gifts, and friendsgiving.
                    </div>
                </div>

                <!-- Category 3: Cozy Winter Wishes -->
                <div class="bg-gradient-to-br from-slate-900/90 to-slate-950/90 p-5 rounded-2xl border border-sky-500/30 hover:border-sky-500/60 shadow-lg transition-all hover:-translate-y-1">
                    <div class="flex items-center gap-3 mb-3">
                        <div class="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/40 text-sky-300 flex items-center justify-center text-lg">
                            🏮
                        </div>
                        <div>
                            <span class="text-[10px] uppercase font-bold text-sky-300 tracking-wider">Cozy Comfort</span>
                            <h3 class="font-serif text-lg font-bold text-white">Warm Winter Wishes</h3>
                        </div>
                    </div>
                    <p class="text-xs text-slate-300 leading-relaxed mb-3">
                        Peaceful alpine snowfalls, glowing amber lanterns, and comforting messages sent to loved ones near and far. Featured card: <strong>Aria, The Lantern Maiden</strong>.
                    </p>
                    <div class="text-[11px] text-amber-200/90 font-semibold flex items-center gap-1.5">
                        <i class="fa-solid fa-sparkles text-amber-400"></i> Perfect for: Long-distance family, winter birthdays, and heartwarming care packages.
                    </div>
                </div>

                <!-- Category 4: Black Friday & VIP Spree -->
                <div class="bg-gradient-to-br from-slate-900/90 to-slate-950/90 p-5 rounded-2xl border border-fuchsia-500/30 hover:border-fuchsia-500/60 shadow-lg transition-all hover:-translate-y-1">
                    <div class="flex items-center gap-3 mb-3">
                        <div class="w-10 h-10 rounded-xl bg-fuchsia-500/20 border border-fuchsia-400/40 text-fuchsia-300 flex items-center justify-center text-lg">
                            🛍️
                        </div>
                        <div>
                            <span class="text-[10px] uppercase font-bold text-fuchsia-300 tracking-wider">Retail Glitz</span>
                            <h3 class="font-serif text-lg font-bold text-white">Black Friday &amp; VIP Spree</h3>
                        </div>
                    </div>
                    <p class="text-xs text-slate-300 leading-relaxed mb-3">
                        Neon city shopping walks, metallic totes, and instant door-buster access with secret promo unlocks. Featured card: <strong>Cyber Starlet (Noelle)</strong>.
                    </p>
                    <div class="text-[11px] text-amber-200/90 font-semibold flex items-center gap-1.5">
                        <i class="fa-solid fa-sparkles text-amber-400"></i> Perfect for: Holiday gift passes, promotional brand events, and retail surprises.
                    </div>
                </div>

                <!-- Category 5: New Year Midnight Countdown 2026 -->
                <div class="bg-gradient-to-br from-slate-900/90 to-slate-950/90 p-5 rounded-2xl border border-teal-500/30 hover:border-teal-500/60 shadow-lg transition-all hover:-translate-y-1">
                    <div class="flex items-center gap-3 mb-3">
                        <div class="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/40 text-teal-300 flex items-center justify-center text-lg">
                            🎆
                        </div>
                        <div>
                            <span class="text-[10px] uppercase font-bold text-teal-300 tracking-wider">New Year 2026</span>
                            <h3 class="font-serif text-lg font-bold text-white">Midnight Toast 2026</h3>
                        </div>
                    </div>
                    <p class="text-xs text-slate-300 leading-relaxed mb-3">
                        Midnight pyrotechnics, effervescent champagne flutes, golden confetti drops, and welcoming 365 brand new possibilities. Featured card: <strong>Midnight Horizon</strong>.
                    </p>
                    <div class="text-[11px] text-amber-200/90 font-semibold flex items-center gap-1.5">
                        <i class="fa-solid fa-sparkles text-amber-400"></i> Perfect for: New Year's Eve party invitations, midnight toasts, and fresh resolutions.
                    </div>
                </div>

                <!-- Category 6: Custom Video Keepsake Studio -->
                <div class="bg-gradient-to-br from-slate-900/90 to-slate-950/90 p-5 rounded-2xl border border-purple-500/30 hover:border-purple-500/60 shadow-lg transition-all hover:-translate-y-1">
                    <div class="flex items-center gap-3 mb-3">
                        <div class="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/40 text-purple-300 flex items-center justify-center text-lg">
                            🎨
                        </div>
                        <div>
                            <span class="text-[10px] uppercase font-bold text-purple-300 tracking-wider">Custom Bespoke</span>
                            <h3 class="font-serif text-lg font-bold text-white">Custom Keepsake Studio</h3>
                        </div>
                    </div>
                    <p class="text-xs text-slate-300 leading-relaxed mb-3">
                        Upload your personal family video, vacation montage, proposal, or anniversary vows onto a waterproof PVC smart card. Reprogram anytime over-the-air.
                    </p>
                    <div class="text-[11px] text-amber-200/90 font-semibold flex items-center gap-1.5">
                        <i class="fa-solid fa-sparkles text-amber-400"></i> Perfect for: Weddings, baby milestones, memorial tributes, and bespoke memories.
                    </div>
                </div>

            </div>
        </section>

        <!-- Collection Controls: Search, Front/Back, Category Filters -->
        <div id="collection" class="bg-slate-900/90 rounded-2xl p-4 sm:p-6 mb-8 shadow-xl border border-rose-400/30 backdrop-blur-md flex flex-col md:flex-row gap-4 items-center justify-between w-full">
            <div class="flex items-center gap-3 w-full md:w-auto">
                <h2 class="font-serif text-xl sm:text-2xl font-bold text-white whitespace-nowrap flex items-center gap-2">
                    <i class="fa-solid fa-boxes-stacked text-rose-400"></i> Cards Gallery
                </h2>
                <span id="cardCountBadge" class="bg-slate-800 text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-rose-400/30">
                    ${cards.length} Cards
                </span>
            </div>

            <div class="flex flex-wrap gap-2.5 sm:gap-3 w-full md:w-auto items-center justify-start md:justify-end">
                <!-- Search Input -->
                <div class="relative flex-grow sm:flex-grow-0 w-full sm:w-auto">
                    <input type="text" id="searchInput" placeholder="Search cards, prompts..." oninput="filterCards()" class="w-full sm:w-60 bg-slate-950 text-white placeholder-slate-400 text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-500">
                </div>

                <!-- Front / Back Toggle -->
                <div class="flex bg-slate-950 p-1 rounded-xl border border-slate-700">
                    <button onclick="setSide('front')" id="btnFront" class="px-3 py-1 text-xs font-bold rounded-lg bg-pink-600 text-white shadow transition-all">Front</button>
                    <button onclick="setSide('back')" id="btnBack" class="px-3 py-1 text-xs font-bold rounded-lg text-slate-400 transition-all">Back</button>
                </div>

                <!-- Category Filter Dropdown -->
                <select id="occasionFilter" onchange="filterCards()" class="bg-slate-950 text-white text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-500">
                    <option value="">All Categories</option>
                    <option value="Winter Holidays">❄️ Winter Holidays</option>
                    <option value="Thanksgiving">🍂 Thanksgiving</option>
                    <option value="Cozy Winter Wishes">🏮 Cozy Winter Wishes</option>
                    <option value="Black Friday">🛍️ Black Friday</option>
                    <option value="New Year">🎆 New Year 2026</option>
                    <option value="Custom Keepsakes">✨ Custom Studio</option>
                </select>
            </div>
        </div>

        <!-- Cards Grid Container -->
        <div id="cardsGrid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 w-full">
            <!-- Dynamically populated via JS -->
        </div>

        <!-- Web NFC Reprogrammer Tool Feature -->
        <div class="mt-14 sm:mt-20 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 rounded-3xl p-6 sm:p-10 border-[1.5pt] border-rose-400/40 glow-neon text-center max-w-4xl mx-auto w-full">
            <span class="inline-block bg-pink-500/20 text-pink-300 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider mb-3 border border-pink-500/30">
                ✦ TapThingy NFC Web Reprogrammer Tool ✦
            </span>
            <h3 class="font-serif text-xl sm:text-3xl font-bold text-white mb-2">
                Reprogram or Update Any Card Anytime
            </h3>
            <p class="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto mb-6 leading-relaxed">
                Want to change your card's video destination? Launch our Web NFC Tool directly in Chrome on Android, or use the free NFC Tools app on iPhone.
            </p>
            <div class="flex flex-wrap justify-center gap-3">
                <a href="${meta.tools_url}" target="_blank" class="bg-gradient-to-r from-pink-600 to-amber-500 hover:from-pink-500 hover:to-amber-400 text-white font-bold px-6 py-3 rounded-2xl shadow-lg transition-transform hover:scale-105 inline-flex items-center gap-2 text-xs sm:text-sm">
                    <i class="fa-solid fa-bolt"></i> Open Reprogrammer Webtool (/tools) &rarr;
                </a>
                <a href="${meta.custom_designer_url}" target="_blank" class="bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-400/40 font-bold px-6 py-3 rounded-2xl shadow-lg transition-transform hover:scale-105 inline-flex items-center gap-2 text-xs sm:text-sm">
                    <i class="fa-solid fa-wand-magic-sparkles"></i> Custom Keepsake Studio &rarr;
                </a>
            </div>
        </div>

    </main>

    <script>
        const cardsData = ${JSON.stringify(cards.map((c, idx) => {
          const char = c.character || {};
          const media = c.media || {};
          const seo = c.seo || {};
          const front = resolveAssetPath(media.local_front_image_path || media.front_image_url, false);
          const back = resolveAssetPath(media.local_back_image_path || media.back_image_url, false);
          return {
            index: idx,
            id: c.card_id || ('card-' + idx),
            number: c.card_number || (idx + 1),
            slug: c.slug,
            name: char.name || c.slug,
            title: char.title || '',
            greeting: c.event_greeting || 'Happy Holidays!',
            frontImg: front,
            backImg: back,
            lore: char.micro_lore || '',
            motto: char.motto || '',
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
                btnF.className = 'px-3 py-1 text-xs font-bold rounded-lg bg-pink-600 text-white shadow transition-all';
                btnB.className = 'px-3 py-1 text-xs font-bold rounded-lg text-slate-400 transition-all';
            } else {
                btnB.className = 'px-3 py-1 text-xs font-bold rounded-lg bg-pink-600 text-white shadow transition-all';
                btnF.className = 'px-3 py-1 text-xs font-bold rounded-lg text-slate-400 transition-all';
            }
            filterCards();
        }

        function renderCards(data) {
            const grid = document.getElementById('cardsGrid');
            const badge = document.getElementById('cardCountBadge');
            badge.innerText = data.length + ' Cards';

            if (data.length === 0) {
                grid.innerHTML = '<div class="col-span-full text-center py-16 text-slate-400 font-serif text-base sm:text-lg">No matching greeting cards found ✦</div>';
                return;
            }

            let html = '';
            data.forEach(c => {
                const imgSrc = currentSide === 'back' && c.backImg ? c.backImg : c.frontImg;

                html += \`
                    <a href="./\${c.slug}/index.html" class="group bg-slate-900/90 rounded-2xl overflow-hidden shadow-xl border border-slate-800 hover:border-rose-400/60 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between glow-neon min-w-0">
                        <div class="relative w-full aspect-[9/16] bg-slate-950 overflow-hidden flex items-center justify-center">
                            <img src="\${imgSrc}" alt="\${c.name}" class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500">
                            <div class="absolute top-2.5 right-2.5 bg-slate-950/85 backdrop-blur-sm text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-700 text-pink-300">
                                Card #\${c.number}
                            </div>
                            <div class="absolute bottom-2 left-2 right-2 bg-black/75 backdrop-blur-sm text-center py-1 text-[10px] font-bold text-amber-300 uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                Tap to View Living Card &rarr;
                            </div>
                        </div>
                        <div class="p-4 flex flex-col gap-1.5 flex-grow justify-between min-w-0">
                            <div class="min-w-0">
                                <div class="flex justify-between items-center mb-1 gap-2">
                                    <span class="text-[10px] font-bold text-amber-300 tracking-wider uppercase truncate">\${c.greeting}</span>
                                    <span class="text-[9px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700 flex-shrink-0">\${c.occasion}</span>
                                </div>
                                <div class="font-serif text-base sm:text-lg font-bold text-white group-hover:text-rose-300 transition-colors leading-snug truncate">\${c.name}</div>
                                <div class="text-xs text-slate-400 italic truncate mt-0.5">\${c.title}</div>
                            </div>
                            <div class="mt-3 pt-2.5 border-t border-slate-800 flex justify-between items-center text-xs font-bold text-rose-300">
                                <span class="flex items-center gap-1 text-[11px] text-amber-300"><i class="fa-solid fa-bolt"></i> NFC Video</span>
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
            const occ = document.getElementById('occasionFilter')?.value || '';

            let filtered = cardsData.filter(c => {
                const matchQuery = !query || c.name.toLowerCase().includes(query) || c.greeting.toLowerCase().includes(query) || c.keywords.includes(query) || c.lore.toLowerCase().includes(query);
                const matchOcc = !occ || c.occasion.toLowerCase().includes(occ.toLowerCase());
                return matchQuery && matchOcc;
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
console.log('Successfully generated main gallery index.html with Homepage Intro & 6 Curated Cards!');
