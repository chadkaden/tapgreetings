const fs = require('fs');
const path = require('path');

const masterDataPath = path.join(__dirname, '../data/greetings_master.json');
const db = JSON.parse(fs.readFileSync(masterDataPath, 'utf8'));
const cards = db.cards;
const meta = db.series_metadata;

const projectRoot = path.join(__dirname, '..');

// Social links for footer
const socialChannels = [
  { name: 'Instagram', icon: 'fa-brands fa-instagram', url: 'https://instagram.com/tapgreetings' },
  { name: 'TikTok', icon: 'fa-brands fa-tiktok', url: 'https://tiktok.com/@tapgreetings' },
  { name: 'Twitter / X', icon: 'fa-brands fa-twitter', url: 'https://twitter.com/tapgreetings' },
  { name: 'YouTube', icon: 'fa-brands fa-youtube', url: 'https://youtube.com/@tapthingy' }
];

function safe(val, fallback = '') {
  if (val === undefined || val === null || val === 'undefined') return fallback;
  return val;
}

function resolveAssetPath(filePath, isSubdir = false) {
  if (!filePath) return '';
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
    const match = filePath.match(/https?:\/\/(?:www\.)?tapgreetings\.com(\/.*)/i);
    if (match) {
      const rel = match[1];
      return isSubdir ? '..' + rel : '.' + rel;
    }
    return filePath;
  }
  if (filePath.startsWith('/')) {
    return isSubdir ? '..' + filePath : '.' + filePath;
  }
  return isSubdir ? '../' + filePath : './' + filePath;
}

// Common HTML Head template with Dynamic SEO & Social Graph Meta Tags
function getHeadHtml(title, cardStyle = null, isSubdir = false, seoData = null, mediaData = null, cardUrl = '') {
  const relPath = isSubdir ? '../' : './';
  
  const colors = cardStyle?.colors || {
    bg_obsidian_midnight: '#0A0E1A',
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
  const ogImg = mediaData?.front_image_url || 'https://tapgreetings.com/assets/img/delphine-front.png';
  const ogVideo = mediaData?.video_url || 'https://tapgreetings.com/assets/video/delphine-holidays.mp4';

  return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
                        },
                        cyanAccent: {
                            400: '#22d3ee',
                            500: '#06b6d4',
                            600: '#0891b2'
                        }
                    },
                    fontFamily: {
                        bubble: [${cardStyle?.typography?.greeting_bubble_font || "'Cooper Black', 'Arial Black', display"}],
                        title: [${cardStyle?.typography?.card_title_font || "'Playfair Display', serif"}],
                        header: [${cardStyle?.typography?.header_sans_font || "'Montserrat', sans-serif"}],
                        body: [${cardStyle?.typography?.body_lore_font || "'Poppins', 'Inter', sans-serif"}],
                        serif: ['"Playfair Display"', 'Georgia', 'serif'],
                        sans: ['"Montserrat"', '"Plus Jakarta Sans"', 'sans-serif']
                    }
                }
            }
        }
    </script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,700;1,400&family=Montserrat:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;0,900;1,400&family=Poppins:wght@300;400;500;600;700&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        :root {
            --card-midnight: ${colors.bg_obsidian_midnight};
            --card-ice: ${colors.bg_frosted_ice_blue};
            --card-pink: ${colors.accent_blush_pink};
            --card-gold: ${colors.accent_champagne_gold};
            --card-rose-gold: ${colors.border_rose_gold};
            --card-neon: ${colors.neon_halo_glow};
        }
        .glow-neon {
            box-shadow: 0 0 35px -5px ${colors.neon_halo_glow}55;
        }
        .glow-gold {
            box-shadow: 0 0 25px -5px ${colors.accent_champagne_gold}55;
        }
        .starburst-corner {
            position: absolute;
            width: 18px;
            height: 18px;
            color: ${colors.accent_champagne_gold};
            font-size: 16px;
            line-height: 1;
            user-select: none;
            pointer-events: none;
            filter: drop-shadow(0 0 4px ${colors.accent_champagne_gold});
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
            transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .flipped .flip-card-inner {
            transform: rotateY(180deg);
        }
    </style>
</head>
<body class="font-sans bg-[#0A0E1A] text-slate-100 min-h-screen transition-colors duration-300 selection:bg-pink-500 selection:text-white">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-[#0A0E1A]/95 backdrop-blur-md border-b border-rose-400/30 px-4 sm:px-8 py-3.5 flex justify-between items-center shadow-lg">
        <a href="${relPath}index.html" class="font-header text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5 drop-shadow-[0_0_15px_rgba(255,105,180,0.5)]">
            <span class="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-600 via-rose-500 to-amber-300 flex items-center justify-center text-sm font-black text-white shadow-md">TG</span>
            <span>TapGreetings</span>
        </a>
        <div class="flex items-center gap-5">
            <nav class="hidden sm:flex gap-6 text-sm font-semibold text-slate-300">
                <a href="${relPath}index.html" class="hover:text-pink-300 transition-colors">Home</a>
                <a href="${relPath}index.html#collection" class="hover:text-pink-300 transition-colors">All Cards</a>
                <a href="${meta.custom_designer_url}" target="_blank" class="hover:text-amber-300 transition-colors">Custom Studio</a>
                <a href="${meta.tools_url}" target="_blank" class="hover:text-pink-300 transition-colors">NFC Tools</a>
            </nav>
            <button onclick="toggleTheme()" class="w-9 h-9 rounded-full bg-gradient-to-r from-rose-600 to-amber-500 text-white flex items-center justify-center shadow-md hover:scale-105 transition-transform" title="Toggle Light/Dark Mode">
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
    </script>
`;
}

// Common Footer template
function getFooterHtml() {
  return `
    <footer class="text-center py-12 px-4 text-xs sm:text-sm text-slate-400 border-t border-slate-800/80 mt-20 flex flex-col items-center gap-6">
        <div class="flex flex-wrap justify-center gap-6 text-xl text-rose-400">
            ${socialChannels.map(s => `<a href="${s.url}" target="_blank" class="hover:text-amber-300 transition-transform hover:scale-110" title="${s.name}"><i class="${s.icon}"></i></a>`).join('')}
        </div>
        <p class="max-w-md leading-relaxed text-slate-400">
            &copy; 2026 TapGreetings. Powered by <a href="https://tapthingy.com" target="_blank" class="text-pink-400 font-bold hover:underline">TapThingy</a> smart NFC hardware &amp; OTA dynamic cloud routing.
        </p>
    </footer>
</body>
</html>
`;
}

// 1. Generate Individual Card Pages
console.log('Generating individual card pages...');
cards.forEach((card, index) => {
  const isLandscape = card.media?.aspect_ratio === '16:9' || card.media?.aspect_ratio === 'landscape';
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

  // Video container aspect classes
  const videoAspectClass = isLandscape ? 'aspect-[16/9] w-full max-h-[60vh]' : 'aspect-[9/16] w-full max-h-[75vh]';
  const cardPreviewAspectClass = isLandscape ? 'aspect-[3/2] w-64 sm:w-80' : 'aspect-[9/16] w-52 sm:w-64';

  const cardPageHtml = `${getHeadHtml(seo.seo_title || `${char.name} - ${card.event_greeting}`, card.style_tokens, true, seo, media, card.web_address)}
    <main class="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        <!-- Main Card Container with Sharp Rectangular Borders and Rose Gold Stroke -->
        <div class="relative bg-[#0A0E1A]/95 rounded-2xl p-6 sm:p-10 shadow-2xl border-[1.5pt] border-rose-400/40 backdrop-blur-md flex flex-col gap-8 glow-neon">
            
            <!-- 4-Point Gold Starburst Filigree Accents in Corners -->
            <span class="starburst-corner top-3 left-3">⟡</span>
            <span class="starburst-corner top-3 right-3">⟡</span>
            <span class="starburst-corner bottom-3 left-3">⟡</span>
            <span class="starburst-corner bottom-3 right-3">⟡</span>

            <!-- Top Event & Series Banner -->
            <div class="text-center pt-2">
                <div class="flex flex-wrap justify-center items-center gap-2 mb-3">
                    <span class="inline-block bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-md">
                        ${card.event_greeting || 'Happy Holidays!'}
                    </span>
                    <span class="inline-block bg-slate-900 text-amber-300 border border-amber-400/40 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        ${card.series_id || 'Winter Glamour 2026'} &bull; CARD #${card.card_number || (index + 1)}
                    </span>
                    <span class="inline-block bg-slate-900 text-pink-300 border border-pink-400/40 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        ${char.rarity_tier || 'Spectrum Common'}
                    </span>
                </div>
                
                <h1 class="font-serif text-3xl sm:text-5xl font-bold bg-gradient-to-r from-white via-rose-200 to-amber-200 bg-clip-text text-transparent drop-shadow-md">
                    ${char.name}
                </h1>
                <p class="font-header text-sm sm:text-base text-rose-300/90 font-medium tracking-wide mt-1">
                    ${char.title} &bull; <span class="text-amber-200/90 italic">${char.profile_theme}</span>
                </p>
                <p class="text-xs sm:text-sm text-slate-400 italic max-w-xl mx-auto mt-2">
                    &ldquo;${char.motto}&rdquo;
                </p>

                <!-- Keywords / SEO Tag Pills -->
                ${seo.keywords && seo.keywords.length > 0 ? `
                <div class="flex flex-wrap justify-center gap-1.5 mt-3">
                    ${seo.keywords.map(kw => `<span class="text-[10px] bg-slate-900/80 text-slate-400 border border-slate-800 px-2.5 py-0.5 rounded-full">#${kw}</span>`).join('')}
                </div>
                ` : ''}
            </div>

            <!-- Main Layout: Video Player Column + Interactive Experience Column -->
            <div class="grid grid-cols-1 ${isLandscape ? 'lg:grid-cols-1' : 'lg:grid-cols-2'} gap-8 items-start">
                
                <!-- Left: 4K Video Player with Tap Indicator -->
                <div class="flex flex-col items-center justify-center bg-black rounded-2xl p-2.5 border-[1.5pt] border-rose-400/60 ring-2 ring-pink-500/20 shadow-2xl relative overflow-hidden group">
                    <video autoplay loop muted playsinline controls poster="${frontImg}" class="${videoAspectClass} object-contain rounded-xl shadow-inner bg-black">
                        <source src="${videoSrc}" type="video/mp4">
                        Your browser does not support HTML5 video.
                    </video>
                    <div class="mt-3 w-full flex items-center justify-between px-2 text-xs font-semibold text-slate-300">
                        <span class="flex items-center gap-1.5 text-pink-300">
                            <i class="fa-solid fa-bolt text-amber-400 animate-pulse"></i> NFC Tap-to-Video
                        </span>
                        <span class="px-2.5 py-0.5 rounded-full bg-slate-900 border border-rose-400/40 text-[11px] font-mono text-amber-300">
                            ${media.aspect_ratio || '9:16'} &bull; ${media.video_duration_seconds || 10}s
                        </span>
                    </div>

                    <!-- Audio Dialogue Speech Bubble -->
                    ${media.audio_dialogue ? `
                    <div class="mt-4 w-full bg-slate-900/95 border border-pink-400/40 rounded-2xl p-4 shadow-lg flex items-start gap-3">
                        <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-amber-400 flex-shrink-0 flex items-center justify-center text-slate-950 font-black text-sm shadow">
                            <i class="fa-solid fa-volume-high"></i>
                        </div>
                        <div class="flex-grow">
                            <span class="text-[10px] uppercase font-bold text-amber-300 tracking-wider block">Dialogue &amp; Voiceover</span>
                            <p class="text-xs sm:text-sm text-slate-100 italic leading-relaxed mt-0.5">
                                &ldquo;${media.audio_dialogue}&rdquo;
                            </p>
                        </div>
                        <button onclick="speakDialogue()" class="bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow transition-transform hover:scale-105" title="Listen Aloud">
                            <i class="fa-solid fa-play"></i> Listen
                        </button>
                    </div>
                    <script>
                        function speakDialogue() {
                            if ('speechSynthesis' in window) {
                                window.speechSynthesis.cancel();
                                const u = new SpeechSynthesisUtterance(${JSON.stringify(media.audio_dialogue)});
                                u.rate = 0.95;
                                u.pitch = 1.05;
                                window.speechSynthesis.speak(u);
                            } else {
                                alert(${JSON.stringify(media.audio_dialogue)});
                            }
                        }
                    </script>
                    ` : ''}
                </div>

                <!-- Right: Lore, Indicators, Physical Card 3D Flip, & Utility Action -->
                <div class="flex flex-col gap-6 ${isLandscape ? 'max-w-3xl mx-auto w-full' : ''}">
                    
                    <!-- Micro Lore Box -->
                    <div class="bg-slate-950/90 p-5 rounded-2xl border-[1.5pt] border-rose-400/40 shadow-sm relative">
                        <span class="text-[11px] font-bold uppercase tracking-wider text-amber-300 block mb-1">
                            <i class="fa-solid fa-feather-pointed"></i> Story &amp; Micro-Lore
                        </span>
                        <p class="text-sm text-slate-200 leading-relaxed font-body">
                            ${char.micro_lore}
                        </p>
                    </div>

                    <!-- Indicators / Collector Metrics -->
                    <div class="bg-slate-950/90 p-5 rounded-2xl border border-rose-400/30 shadow-inner">
                        <span class="text-[11px] font-bold uppercase tracking-wider text-pink-300 block mb-3">
                            <i class="fa-solid fa-chart-simple"></i> Character Indicators &amp; Attributes
                        </span>
                        <div class="grid grid-cols-3 gap-3 text-center">
                            ${char.indicators ? Object.entries(char.indicators).map(([key, val]) => `
                                <div class="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                                    <div class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">${key}</div>
                                    <div class="font-serif text-base sm:text-lg font-bold text-amber-300 mt-0.5">${val}</div>
                                </div>
                            `).join('') : ''}
                        </div>
                    </div>

                    <!-- Interactive Flippable 3D Physical Keepsake Card -->
                    <div class="bg-slate-950/90 p-5 rounded-2xl border border-rose-400/30 shadow-inner flex flex-col items-center">
                        <div class="w-full flex justify-between items-center mb-4">
                            <span class="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                                <i class="fa-solid fa-id-card"></i> Physical CR80 PVC Smart Card
                            </span>
                            <button onclick="toggleCardFlip()" class="bg-slate-900 hover:bg-slate-800 text-pink-300 text-xs font-bold px-3 py-1 rounded-xl border border-pink-400/40 flex items-center gap-1.5 transition-all">
                                <i class="fa-solid fa-arrows-rotate"></i> Flip Card (Front/Back)
                            </button>
                        </div>

                        <!-- 3D Card Container -->
                        <div id="card3dContainer" class="perspective-1000 ${cardPreviewAspectClass} cursor-pointer group" onclick="toggleCardFlip()">
                            <div class="flip-card-inner relative w-full h-full transform-style-3d shadow-2xl rounded-2xl border-[1.5pt] border-rose-400/70 overflow-hidden bg-slate-900">
                                <!-- Front Face -->
                                <div class="absolute inset-0 backface-hidden">
                                    <img src="${frontImg}" alt="${char.name} Front" class="w-full h-full object-contain bg-slate-950">
                                    <div class="absolute bottom-2 left-2 right-2 bg-black/75 backdrop-blur-sm text-center py-1 text-[10px] font-bold text-amber-300 uppercase tracking-widest rounded-lg">
                                        Card Front &bull; Tap to Flip ↻
                                    </div>
                                </div>
                                <!-- Back Face with NFC Target Star -->
                                <div class="absolute inset-0 backface-hidden rotate-y-180 bg-slate-950 flex flex-col justify-between p-3" style="transform: rotateY(180deg);">
                                    <img src="${backImg}" alt="${char.name} Back" class="w-full h-full object-contain">
                                    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
                                        <div class="w-16 h-16 rounded-full border-2 border-dashed border-amber-300/80 bg-pink-500/20 backdrop-blur-sm flex items-center justify-center text-amber-300 text-xl font-bold shadow-lg animate-pulse">
                                            ${nfc.target_shape === 'heart' ? '♥' : (nfc.target_shape === 'shield' ? '🛡' : '★')}
                                        </div>
                                        <span class="text-[10px] font-bold text-amber-200 mt-1 drop-shadow bg-black/60 px-2 py-0.5 rounded-full">${nfc.tap_label || '⟡ TAP HERE ⟡'}</span>
                                        <span class="text-[8px] text-slate-300 drop-shadow">${nfc.instruction || 'Tap with NFC enabled phone or device'}</span>
                                    </div>
                                    <div class="absolute bottom-2 left-2 right-2 bg-black/75 backdrop-blur-sm text-center py-1 text-[10px] font-bold text-pink-300 uppercase tracking-widest rounded-lg">
                                        Card Back &bull; Tap to Flip ↺
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p class="text-[11px] text-slate-400 mt-2 italic text-center">Click card to flip between front artwork and back NFC target</p>
                    </div>

                    <!-- Hidden Collector Items Easter Egg -->
                    ${nfc.hidden_items_count ? `
                    <div class="bg-slate-950/80 p-4 rounded-2xl border border-amber-400/30 flex flex-col gap-2">
                        <span class="text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                            <i class="fa-solid fa-magnifying-glass"></i> Hidden Collector Hunt (On Physical Card)
                        </span>
                        <div class="grid grid-cols-2 gap-3 text-xs">
                            ${Object.entries(nfc.hidden_items_count).map(([item, count]) => `
                                <div class="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center">
                                    <span class="capitalize text-slate-300 font-medium">${item.replace(/_/g, ' ')}:</span>
                                    <span class="font-bold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-lg border border-amber-400/30">${count} Hidden</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    ` : ''}

                    <!-- Creator AI Prompts & Specs Drawer -->
                    ${prompts.prompt_front_artwork ? `
                    <details class="bg-slate-950/80 rounded-2xl border border-amber-400/30 p-4 group transition-all">
                        <summary class="font-header text-xs font-bold text-amber-300 cursor-pointer flex justify-between items-center uppercase tracking-wider select-none">
                            <span><i class="fa-solid fa-wand-magic-sparkles text-pink-400 mr-1.5"></i> Creative AI Prompts &amp; Specs</span>
                            <span class="text-slate-400 group-open:rotate-180 transition-transform">&darr;</span>
                        </summary>
                        <div class="mt-4 flex flex-col gap-3 text-xs border-t border-slate-800 pt-3">
                            <div>
                                <span class="font-bold text-slate-400 block mb-1">🎨 Front Artwork Prompt:</span>
                                <div class="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-slate-300 font-mono text-[11px] leading-relaxed relative group/btn">
                                    ${prompts.prompt_front_artwork}
                                </div>
                            </div>
                            <div>
                                <span class="font-bold text-slate-400 block mb-1">🎬 Motion Video Prompt:</span>
                                <div class="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-slate-300 font-mono text-[11px] leading-relaxed">
                                    ${prompts.prompt_motion_video}
                                </div>
                            </div>
                            <div>
                                <span class="font-bold text-slate-400 block mb-1">🎙️ Dialogue &amp; Vocal Prompt:</span>
                                <div class="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-slate-300 font-mono text-[11px] leading-relaxed">
                                    ${prompts.prompt_voice_dialogue}
                                </div>
                            </div>
                        </div>
                    </details>
                    ` : ''}

                    <!-- Utility Action & Order Buttons -->
                    <div class="flex flex-col gap-3 pt-2">
                        ${utility.button_text ? `
                        <a href="${utility.target_url || '#'}" target="_blank" class="w-full bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 hover:from-pink-500 hover:to-amber-400 text-white font-bold py-3.5 px-6 rounded-2xl shadow-xl shadow-pink-600/30 text-center flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]">
                            <i class="fa-solid fa-sparkles"></i> ${utility.button_text} &rarr;
                        </a>
                        ` : ''}

                        <div class="flex flex-col sm:flex-row gap-3">
                            <a href="${meta.shop_url}" target="_blank" class="flex-1 bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold py-3.5 px-6 rounded-2xl border border-amber-400/40 shadow-lg text-center flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]">
                                <i class="fa-solid fa-cart-shopping"></i> Order Keepsake Card &bull; $${comm.price ? comm.price.toFixed(2) : '29.99'}
                            </a>
                            <button onclick="shareGreeting()" class="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-6 rounded-2xl border border-slate-700 shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]">
                                <i class="fa-solid fa-share-nodes text-pink-400"></i> Share
                            </button>
                        </div>
                    </div>

                    <!-- Navigation Footer -->
                    <div class="flex justify-between items-center pt-6 mt-2 border-t border-slate-800">
                        <a href="../${prevCard.slug}/index.html" class="bg-slate-900 hover:bg-pink-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors shadow border border-slate-800">
                            <i class="fa-solid fa-arrow-left"></i> Prev Card
                        </a>
                        <a href="../index.html" class="bg-slate-900 hover:bg-pink-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors shadow border border-slate-800">
                            <i class="fa-solid fa-home"></i> All Cards
                        </a>
                        <a href="../${nextCard.slug}/index.html" class="bg-slate-900 hover:bg-pink-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors shadow border border-slate-800">
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

        function shareGreeting() {
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

const mainIndexHtml = `${getHeadHtml('TapGreetings - Smart NFC Keepsake Greeting Cards', featuredCard.style_tokens, false, featuredCard.seo, featuredCard.media, 'https://tapgreetings.com')}
    <main class="max-w-7xl mx-auto px-4 py-12">
        
        <!-- Hero Spotlight Section Featuring Delphine (Card 01) -->
        <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0A0E1A] via-slate-900 to-rose-950/60 p-8 sm:p-14 mb-12 shadow-2xl border-[1.5pt] border-rose-400/40 backdrop-blur-md glow-neon">
            <span class="starburst-corner top-4 left-4">⟡</span>
            <span class="starburst-corner top-4 right-4">⟡</span>
            <span class="starburst-corner bottom-4 left-4">⟡</span>
            <span class="starburst-corner bottom-4 right-4">⟡</span>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <!-- Hero Left: Text & CTA -->
                <div class="lg:col-span-7 flex flex-col items-start text-left">
                    <div class="flex flex-wrap items-center gap-2 mb-4">
                        <span class="bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow">
                            ❄️ HOLIDAY PREMIER &bull; SERIES 1
                        </span>
                        <span class="bg-slate-900 text-amber-300 border border-amber-400/40 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                            ${featuredCard.event_greeting}
                        </span>
                    </div>

                    <h1 class="font-serif text-4xl sm:text-6xl font-extrabold bg-gradient-to-r from-white via-rose-200 to-amber-200 bg-clip-text text-transparent mb-4 drop-shadow-[0_0_30px_rgba(255,105,180,0.5)]">
                        TapGreetings
                    </h1>
                    
                    <h2 class="font-header text-xl sm:text-2xl font-bold text-rose-300 mb-3">
                        ${featuredChar.name} — <span class="text-amber-200 font-serif italic">${featuredChar.title}</span>
                    </h2>

                    <p class="text-sm sm:text-base text-slate-300 max-w-xl mb-6 leading-relaxed">
                        ${featuredChar.micro_lore}
                    </p>

                    <blockquote class="text-xs sm:text-sm italic text-amber-200/90 border-l-2 border-amber-400 pl-3 mb-6">
                        &ldquo;${featuredChar.motto}&rdquo;
                    </blockquote>

                    <div class="flex flex-wrap gap-4">
                        <a href="./${featuredCard.slug}/index.html" class="bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 hover:from-pink-500 hover:to-amber-400 text-white font-bold px-8 py-3.5 rounded-2xl shadow-xl shadow-pink-600/30 transition-transform hover:scale-105 flex items-center gap-2">
                            <i class="fa-solid fa-play"></i> Experience ${featuredChar.name} TapGreeting
                        </a>
                        <a href="#collection" class="bg-slate-900 hover:bg-slate-800 text-white border border-rose-400/40 font-bold px-6 py-3.5 rounded-2xl shadow-lg transition-transform hover:scale-105 flex items-center gap-2">
                            <i class="fa-solid fa-boxes-stacked"></i> Explore All Cards (${cards.length})
                        </a>
                    </div>
                </div>

                <!-- Hero Right: Live Video Tap Preview -->
                <div class="lg:col-span-5 flex justify-center">
                    <a href="./${featuredCard.slug}/index.html" class="relative group block w-64 sm:w-72 aspect-[9/16] rounded-2xl overflow-hidden border-[1.5pt] border-rose-400/70 shadow-2xl bg-black glow-gold transition-transform hover:scale-105">
                        <video autoplay loop muted playsinline poster="${featuredFront}" class="w-full h-full object-cover">
                            <source src="${featuredVideo}" type="video/mp4">
                        </video>
                        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                            <span class="text-[10px] uppercase font-bold text-amber-300 tracking-wider">Tap to View Card &rarr;</span>
                            <span class="font-serif text-lg font-bold text-white">${featuredChar.name}</span>
                            <span class="text-xs text-rose-300">${featuredCard.event_greeting}</span>
                        </div>
                    </a>
                </div>
            </div>

            <!-- Stats Bar -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-8 border-t border-rose-400/30 max-w-4xl mx-auto text-center">
                <div class="bg-slate-950/70 p-3.5 rounded-2xl border border-rose-400/20">
                    <div class="font-serif text-2xl sm:text-3xl font-bold text-rose-300">${cards.length}</div>
                    <div class="text-xs text-slate-400 uppercase tracking-wider font-semibold">Keepsake Cards</div>
                </div>
                <div class="bg-slate-950/70 p-3.5 rounded-2xl border border-rose-400/20">
                    <div class="font-serif text-2xl sm:text-3xl font-bold text-amber-300">4K Motion</div>
                    <div class="text-xs text-slate-400 uppercase tracking-wider font-semibold">Video &amp; Audio</div>
                </div>
                <div class="bg-slate-950/70 p-3.5 rounded-2xl border border-rose-400/20">
                    <div class="font-serif text-2xl sm:text-3xl font-bold text-white">NTAG215</div>
                    <div class="text-xs text-slate-400 uppercase tracking-wider font-semibold">Rewritable PVC</div>
                </div>
                <div class="bg-slate-950/70 p-3.5 rounded-2xl border border-rose-400/20">
                    <div class="font-serif text-2xl sm:text-3xl font-bold text-rose-300">Dual Aspect</div>
                    <div class="text-xs text-slate-400 uppercase tracking-wider font-semibold">9:16 &amp; 16:9</div>
                </div>
            </div>
        </div>

        <!-- Collection Controls: Search, Front/Back, Aspect, Occasions, Sort -->
        <div id="collection" class="bg-slate-900/90 rounded-2xl p-6 mb-8 shadow-xl border border-rose-400/30 backdrop-blur-md flex flex-col md:flex-row gap-4 items-center justify-between">
            <div class="flex items-center gap-3 w-full md:w-auto">
                <h2 class="font-serif text-2xl font-bold text-white whitespace-nowrap flex items-center gap-2">
                    <i class="fa-solid fa-boxes-stacked text-rose-400"></i> Cards Gallery
                </h2>
                <span id="cardCountBadge" class="bg-slate-800 text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-rose-400/30">
                    ${cards.length} Cards
                </span>
            </div>

            <div class="flex flex-wrap gap-3 w-full md:w-auto items-center justify-end">
                <!-- Keyword & Character Search Input -->
                <div class="relative flex-grow sm:flex-grow-0">
                    <input type="text" id="searchInput" placeholder="Search keywords, prompts, lore..." oninput="filterCards()" class="w-full sm:w-64 bg-slate-950 text-white placeholder-slate-400 text-sm px-4 py-2 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-500">
                </div>

                <!-- Front / Back Toggle -->
                <div class="flex bg-slate-950 p-1 rounded-xl border border-slate-700">
                    <button onclick="setSide('front')" id="btnFront" class="px-3 py-1 text-xs font-bold rounded-lg bg-pink-600 text-white shadow transition-all">Front</button>
                    <button onclick="setSide('back')" id="btnBack" class="px-3 py-1 text-xs font-bold rounded-lg text-slate-400 transition-all">Back</button>
                </div>

                <!-- Orientation / Aspect Filter -->
                <select id="aspectFilter" onchange="filterCards()" class="bg-slate-950 text-white text-sm px-3.5 py-2 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-500">
                    <option value="">All Orientations</option>
                    <option value="portrait">↕ Vertical (9:16)</option>
                    <option value="landscape">↔ Horizontal (16:9)</option>
                </select>

                <!-- Occasions Filter -->
                <select id="occasionFilter" onchange="filterCards()" class="bg-slate-950 text-white text-sm px-3.5 py-2 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-500">
                    <option value="">All Occasions</option>
                    <option value="Holiday">🎄 Holiday &amp; Winter</option>
                    <option value="Black Friday">🛍️ Black Friday</option>
                    <option value="New Year">🎆 New Year 2026</option>
                    <option value="Birthday">🎂 Birthday</option>
                    <option value="Anniversary">💍 Anniversary</option>
                    <option value="Thank You">🙏 Thank You</option>
                    <option value="Congratulations">🏆 Congratulations</option>
                    <option value="Wedding">👰 Wedding</option>
                    <option value="Everyday">💜 Thinking of You &amp; Baby</option>
                    <option value="Custom">⚡ Custom Studio</option>
                </select>

                <!-- Sort Order -->
                <select id="sortSelect" onchange="filterCards()" class="bg-slate-950 text-white text-sm px-3.5 py-2 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-500">
                    <option value="featured" selected>Featured (Delphine First)</option>
                    <option value="title-asc">Name (A &rarr; Z)</option>
                </select>
            </div>
        </div>

        <!-- Cards Grid Container -->
        <div id="cardsGrid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
            <!-- Dynamically populated via JS -->
        </div>

        <!-- Web NFC Reprogrammer Tool Feature -->
        <div class="mt-16 bg-slate-900/90 rounded-3xl p-8 sm:p-12 border-[1.5pt] border-rose-400/40 glow-neon text-center max-w-4xl mx-auto">
            <span class="inline-block bg-pink-500/20 text-pink-300 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider mb-4 border border-pink-500/30">
                ⚡ TapThingy NFC Web Reprogrammer Tool
            </span>
            <h3 class="font-serif text-2xl sm:text-3xl font-bold text-white mb-3">
                Update or Rewrite Any Card in Seconds
            </h3>
            <p class="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-6 leading-relaxed">
                Want to change where your card links? Open our Web NFC Tool directly in your browser on Android Chrome, or use free NFC Tools on iPhone.
            </p>
            <div class="flex flex-wrap justify-center gap-4">
                <a href="${meta.tools_url}" target="_blank" class="bg-gradient-to-r from-pink-600 to-amber-500 hover:from-pink-500 hover:to-amber-400 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg transition-transform hover:scale-105 inline-flex items-center gap-2">
                    <i class="fa-solid fa-bolt"></i> Open Reprogrammer Webtool (/tools) ↗
                </a>
            </div>
        </div>

    </main>

    <script>
        const cardsData = ${JSON.stringify(cards.map((c, idx) => {
          const char = c.character || {};
          const media = c.media || {};
          const seo = c.seo || {};
          const isLand = media.aspect_ratio === '16:9' || media.aspect_ratio === 'landscape';
          const front = resolveAssetPath(media.local_front_image_path || media.front_image_url, false);
          const back = resolveAssetPath(media.local_back_image_path || media.back_image_url, false);
          return {
            index: idx,
            id: c.card_id || ('card-' + idx),
            slug: c.slug,
            name: char.name || c.slug,
            title: char.title || '',
            greeting: c.event_greeting || 'Happy Holidays!',
            aspect: isLand ? 'landscape' : 'portrait',
            frontImg: front,
            backImg: back,
            lore: char.micro_lore || '',
            motto: char.motto || '',
            occasion: seo.primary_occasion || 'Holiday',
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
                grid.innerHTML = '<div class="col-span-full text-center py-16 text-slate-400 font-serif text-lg">No matching greeting cards found ✨</div>';
                return;
            }

            let html = '';
            data.forEach(c => {
                const isLand = c.aspect === 'landscape';
                const imgSrc = currentSide === 'back' && c.backImg ? c.backImg : c.frontImg;
                const aspectClass = isLand ? 'aspect-[3/2]' : 'aspect-[9/16]';

                html += \`
                    <a href="./\${c.slug}/index.html" class="group bg-slate-900 rounded-2xl overflow-hidden shadow-xl border border-slate-800 hover:border-rose-400/60 transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between glow-neon">
                        <div class="relative w-full \${aspectClass} bg-slate-950 overflow-hidden">
                            <img src="\${imgSrc}" alt="\${c.name}" class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500">
                            <div class="absolute top-2.5 right-2.5 bg-slate-950/80 backdrop-blur-sm text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-700 \${isLand ? 'text-cyanAccent-300' : 'text-pink-300'}">
                                \${isLand ? '↔ Horizontal' : '↕ Vertical'}
                            </div>
                        </div>
                        <div class="p-4 flex flex-col gap-1.5 flex-grow justify-between">
                            <div>
                                <div class="flex justify-between items-center mb-1">
                                    <span class="text-[10px] font-bold text-amber-300 tracking-wider uppercase">\${c.greeting}</span>
                                    <span class="text-[9px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-750">\${c.occasion}</span>
                                </div>
                                <div class="font-serif text-lg font-bold text-white group-hover:text-rose-300 transition-colors leading-snug">\${c.name}</div>
                                <div class="text-xs text-slate-400 italic line-clamp-1">\${c.title}</div>
                            </div>
                            <div class="mt-3 pt-2.5 border-t border-slate-800 flex justify-between items-center text-xs font-bold text-rose-300">
                                <span>View TapGreeting &rarr;</span>
                                <span class="text-white bg-pink-600/30 px-2 py-0.5 rounded-md text-[11px] border border-pink-500/30">$29.99</span>
                            </div>
                        </div>
                    </a>
                \`;
            });
            grid.innerHTML = html;
        }

        function filterCards() {
            const query = document.getElementById('searchInput').value.toLowerCase();
            const aspect = document.getElementById('aspectFilter').value;
            const occasion = document.getElementById('occasionFilter').value;
            const sort = document.getElementById('sortSelect').value;

            let filtered = cardsData.filter(c => {
                const matchesQuery = c.name.toLowerCase().includes(query) || 
                                     c.title.toLowerCase().includes(query) || 
                                     c.greeting.toLowerCase().includes(query) || 
                                     c.lore.toLowerCase().includes(query) || 
                                     c.keywords.includes(query);
                const matchesAspect = aspect === '' || c.aspect === aspect;
                const matchesOccasion = occasion === '' || c.occasion === occasion;
                return matchesQuery && matchesAspect && matchesOccasion;
            });

            if (sort === 'featured') {
                filtered.sort((a, b) => a.index - b.index);
            } else if (sort === 'title-asc') {
                filtered.sort((a, b) => a.name.localeCompare(b.name));
            }

            renderCards(filtered);
        }

        // Initial render
        filterCards();
    </script>
${getFooterHtml()}
`;

fs.writeFileSync(path.join(projectRoot, 'index.html'), mainIndexHtml, 'utf8');
console.log('Successfully generated tapgreetings.com index.html and all card pages with SEO & Creative Prompts!');
