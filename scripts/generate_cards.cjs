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

// Common HTML Head template
function getHeadHtml(title, isSubdir = false) {
  const relPath = isSubdir ? '../' : './';
  return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${safe(title, 'TapGreetings')} | TapGreetings by TapThingy</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
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
                        serif: ['"Playfair Display"', 'Georgia', 'serif'],
                        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
                        display: ['"Space Grotesk"', 'sans-serif']
                    }
                }
            }
        }
    </script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,900;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        .glow-card {
            box-shadow: 0 10px 40px -10px rgba(217, 70, 239, 0.35);
        }
        .glow-cyan {
            box-shadow: 0 10px 40px -10px rgba(6, 182, 212, 0.4);
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
    </style>
</head>
<body class="font-sans bg-slate-950 text-slate-100 min-h-screen transition-colors duration-300 selection:bg-brand-500 selection:text-white">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-brand-500/30 px-4 sm:px-8 py-3.5 flex justify-between items-center shadow-lg">
        <a href="${relPath}index.html" class="font-display text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5 drop-shadow-[0_0_15px_rgba(217,70,239,0.5)]">
            <span class="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-500 flex items-center justify-center text-sm font-black text-white shadow-md">TG</span>
            <span>TapGreetings</span>
        </a>
        <div class="flex items-center gap-5">
            <nav class="hidden sm:flex gap-6 text-sm font-semibold text-slate-300">
                <a href="${relPath}index.html" class="hover:text-brand-400 transition-colors">Home</a>
                <a href="${relPath}index.html#collection" class="hover:text-brand-400 transition-colors">All Cards</a>
                <a href="${meta.custom_designer_url}" target="_blank" class="hover:text-cyanAccent-400 transition-colors">Custom Studio</a>
                <a href="${meta.tools_url}" target="_blank" class="hover:text-brand-400 transition-colors">NFC Tools</a>
            </nav>
            <button onclick="toggleTheme()" class="w-9 h-9 rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 text-white flex items-center justify-center shadow-md hover:scale-105 transition-transform" title="Toggle Light/Dark Mode">
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
        <div class="flex flex-wrap justify-center gap-6 text-xl text-brand-400">
            ${socialChannels.map(s => `<a href="${s.url}" target="_blank" class="hover:text-cyanAccent-400 transition-transform hover:scale-110" title="${s.name}"><i class="${s.icon}"></i></a>`).join('')}
        </div>
        <p class="max-w-md leading-relaxed text-slate-400">
            &copy; 2026 TapGreetings. Powered by <a href="https://tapthingy.com" target="_blank" class="text-brand-400 font-bold hover:underline">TapThingy</a> smart hardware & OTA dynamic cloud routing.
        </p>
    </footer>
</body>
</html>
`;
}

// 1. Generate Individual Card Pages
console.log('Generating individual card pages...');
cards.forEach((card, index) => {
  const isLandscape = card.aspect === 'landscape';
  const prevCard = index > 0 ? cards[index - 1] : cards[cards.length - 1];
  const nextCard = index < cards.length - 1 ? cards[index + 1] : cards[0];

  const cardDir = path.join(projectRoot, card.slug);
  if (!fs.existsSync(cardDir)) {
    fs.mkdirSync(cardDir, { recursive: true });
  }

  // Determine image paths
  let frontImg = card.assets.front_image.startsWith('/') ? '..' + card.assets.front_image : '../' + card.assets.front_image;
  let backImg = card.assets.back_image ? (card.assets.back_image.startsWith('/') ? '..' + card.assets.back_image : '../' + card.assets.back_image) : '';

  // Video container styling depending on aspect ratio
  const videoAspectClass = isLandscape ? 'aspect-[16/9] w-full max-h-[60vh]' : 'aspect-[9/16] w-full max-h-[75vh]';
  const cardPreviewAspectClass = isLandscape ? 'aspect-[3/2] w-56 sm:w-64' : 'aspect-[2/3] w-48 sm:w-56';

  const cardPageHtml = `${getHeadHtml(card.title, true)}
    <main class="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        <div class="bg-slate-900/95 dark:bg-slate-900/95 rounded-3xl p-6 sm:p-10 shadow-2xl border-2 border-brand-500/40 backdrop-blur-md flex flex-col gap-8 glow-card">
            
            <!-- Banner / Headline -->
            <div class="text-center">
                <span class="inline-block bg-gradient-to-r from-brand-600 to-cyanAccent-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-md mb-2">
                    ${card.occasion}
                </span>
                <h2 class="font-serif text-2xl sm:text-4xl font-bold bg-gradient-to-r from-brand-400 via-pink-300 to-cyan-300 bg-clip-text text-transparent drop-shadow">
                    ${card.headline}
                </h2>
            </div>

            <!-- Main Layout: Dynamic Video Player + Details -->
            <div class="grid grid-cols-1 ${isLandscape ? 'lg:grid-cols-1' : 'lg:grid-cols-2'} gap-8 items-start">
                
                <!-- Video Player Container (Supports 16:9 Landscape or 9:16 Portrait) -->
                <div class="flex flex-col items-center justify-center bg-black rounded-3xl p-3 border-4 border-brand-500 ring-4 ring-brand-500/20 shadow-2xl relative overflow-hidden group">
                    <video autoplay loop muted playsinline controls poster="${frontImg}" class="${videoAspectClass} object-contain rounded-2xl shadow-inner bg-black">
                        <source src="${card.assets.video_url}" type="video/mp4">
                        Your browser does not support HTML5 video.
                    </video>
                    <div class="mt-2 text-xs font-bold text-slate-400 flex items-center gap-2">
                        <span>⚡ Mobile NFC Tap-to-Video Experience</span>
                        <span class="px-2 py-0.5 rounded-md ${isLandscape ? 'bg-cyan-500/20 text-cyan-300' : 'bg-brand-500/20 text-brand-300'} font-mono">${isLandscape ? '16:9 Landscape' : '9:16 Portrait'}</span>
                    </div>
                </div>

                <!-- Features, Specs & Narrative Column -->
                <div class="flex flex-col gap-5 ${isLandscape ? 'max-w-3xl mx-auto w-full' : ''}">
                    <div class="flex flex-wrap items-center gap-2">
                        <span class="inline-block bg-gradient-to-r from-brand-600 to-indigo-600 text-white text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow">
                            ${card.rarity}
                        </span>
                        <span class="inline-block bg-slate-800 text-brand-300 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider border border-brand-500/30">
                            ${card.header_display}
                        </span>
                        <span class="inline-block ${isLandscape ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30' : 'bg-purple-500/10 text-purple-300 border-purple-500/30'} text-xs font-bold px-3 py-1 rounded-full border">
                            ${isLandscape ? '↔ Horizontal Format' : '↕ Vertical Format'}
                        </span>
                    </div>

                    <h1 class="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
                        ${card.title}
                    </h1>
                    <p class="text-sm sm:text-base text-slate-300 italic -mt-2">
                        ${card.alias}
                    </p>

                    <!-- Specs Grid -->
                    <div class="grid grid-cols-2 gap-3 bg-slate-950/80 p-4 rounded-2xl border border-brand-500/20 shadow-inner">
                        <div class="spec-item">
                            <span class="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Card Format</span>
                            <span class="text-sm font-semibold text-white">${safe(card.specs.card_format, 'CR80 30mil PVC')}</span>
                        </div>
                        <div class="spec-item">
                            <span class="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">NFC Chip Standard</span>
                            <span class="text-sm font-semibold text-cyanAccent-400">${safe(card.specs.nfc_chip, 'NTAG215 (504B)')}</span>
                        </div>
                        <div class="spec-item">
                            <span class="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Orientation</span>
                            <span class="text-sm font-semibold text-white">${safe(card.specs.orientation, isLandscape ? 'Landscape' : 'Portrait')}</span>
                        </div>
                        <div class="spec-item">
                            <span class="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Warmth Rating</span>
                            <span class="text-sm font-semibold text-brand-300">${safe(card.specs.warmth_index, '98 / 100')}</span>
                        </div>
                    </div>

                    <!-- Card Back Lore / Message Box -->
                    <div class="bg-slate-950/90 p-5 rounded-2xl border-l-4 border-brand-500 shadow-sm">
                        <h3 class="font-serif text-lg font-bold text-brand-400 mb-1">Card Message & Lore</h3>
                        <p class="text-sm text-slate-200 leading-relaxed mb-3">${card.narrative.card_back_lore}</p>
                        <blockquote class="text-xs italic text-cyanAccent-300 border-t border-slate-800 pt-2">
                            "${card.narrative.quote}"
                        </blockquote>
                    </div>

                    <!-- Buy Physical Card CTA & Share -->
                    <div class="flex flex-col sm:flex-row gap-3 pt-2">
                        <a href="${card.shopify_product_url}" target="_blank" class="flex-1 bg-gradient-to-r from-brand-600 via-pink-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-brand-600/30 transition-transform hover:scale-[1.02]">
                            <i class="fa-solid fa-cart-shopping"></i> Order Physical NFC Card • $29.99
                        </a>
                        <button onclick="shareCard()" class="bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 border border-slate-700 shadow-lg transition-transform hover:scale-[1.02]">
                            <i class="fa-solid fa-share-nodes"></i> Share
                        </button>
                    </div>
                    <script>
                        function shareCard() {
                            if (navigator.share) {
                                navigator.share({
                                    title: '${card.title}',
                                    text: 'Tap to view ${card.title} on TapGreetings!',
                                    url: window.location.href
                                }).catch(console.error);
                            } else {
                                navigator.clipboard.writeText(window.location.href);
                                alert('Link copied to clipboard!');
                            }
                        }
                    </script>

                    <!-- Navigation Footer -->
                    <div class="flex justify-between items-center pt-6 mt-2 border-t border-slate-800">
                        <a href="../${prevCard.slug}/index.html" class="bg-slate-800 hover:bg-brand-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors shadow">
                            <i class="fa-solid fa-arrow-left"></i> Prev (#${prevCard.id})
                        </a>
                        <a href="../index.html" class="bg-slate-800 hover:bg-brand-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors shadow">
                            <i class="fa-solid fa-home"></i> All Cards
                        </a>
                        <a href="../${nextCard.slug}/index.html" class="bg-slate-800 hover:bg-brand-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors shadow">
                            Next (#${nextCard.id}) <i class="fa-solid fa-arrow-right"></i>
                        </a>
                    </div>

                </div>
            </div>

            <!-- Swipeable & Scrollable Card Artwork Gallery (Front & Back) -->
            <div class="mt-4 pt-8 border-t border-brand-500/30">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="font-serif text-xl font-bold text-brand-300 flex items-center gap-2">
                        <i class="fa-solid fa-id-card"></i> Physical CR80 PVC Card Artwork (Front & Back)
                    </h3>
                    <span class="text-xs text-slate-400 italic">Click to view high-res &rarr;</span>
                </div>

                <div class="flex overflow-x-auto gap-5 pb-4 pt-2 snap-x snap-mandatory">
                    <!-- Front View -->
                    <div class="flex-shrink-0 ${cardPreviewAspectClass} snap-center rounded-2xl overflow-hidden border-2 border-brand-500/60 shadow-xl bg-slate-950 cursor-pointer transition-transform hover:scale-105" onclick="openLightbox('${frontImg}')">
                        <img src="${frontImg}" alt="${card.title} - Front" class="w-full h-full object-contain">
                        <div class="bg-slate-950/90 text-center py-1.5 text-xs text-brand-300 font-bold uppercase tracking-wider">Card Front</div>
                    </div>

                    <!-- Back View -->
                    ${backImg ? `
                    <div class="flex-shrink-0 ${cardPreviewAspectClass} snap-center rounded-2xl overflow-hidden border-2 border-brand-500/60 shadow-xl bg-slate-950 cursor-pointer transition-transform hover:scale-105" onclick="openLightbox('${backImg}')">
                        <img src="${backImg}" alt="${card.title} - Back" class="w-full h-full object-contain">
                        <div class="bg-slate-950/90 text-center py-1.5 text-xs text-cyanAccent-400 font-bold uppercase tracking-wider">Card Back</div>
                    </div>` : ''}
                </div>
            </div>

        </div>
    </main>

    <!-- Lightbox Modal -->
    <div id="lightbox" class="fixed inset-0 z-50 bg-black/90 hidden items-center justify-center p-4 cursor-pointer" onclick="closeLightbox()">
        <button class="absolute top-5 right-8 text-white text-4xl font-bold focus:outline-none">&times;</button>
        <img id="lightboxImg" src="" alt="Enlarged Artwork" class="max-w-[90vw] max-h-[90vh] rounded-2xl border-2 border-brand-500 shadow-2xl object-contain">
    </div>
    <script>
        function openLightbox(src) {
            const lb = document.getElementById('lightbox');
            const lbImg = document.getElementById('lightboxImg');
            lbImg.src = src;
            lb.classList.remove('hidden');
            lb.classList.add('flex');
        }
        function closeLightbox() {
            const lb = document.getElementById('lightbox');
            lb.classList.remove('flex');
            lb.classList.add('hidden');
        }
    </script>
${getFooterHtml()}
`;

  fs.writeFileSync(path.join(cardDir, 'index.html'), cardPageHtml, 'utf8');
  console.log(`Generated Card Page: ${card.slug}/index.html (${card.aspect})`);
});

// 2. Generate Main Gallery index.html
console.log('Generating main gallery index.html...');

const mainIndexHtml = `${getHeadHtml('TapGreetings - Smart NFC Keepsake Greeting Cards', false)}
    <main class="max-w-7xl mx-auto px-4 py-12">
        
        <!-- Hero Section -->
        <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-brand-950/60 p-8 sm:p-16 mb-12 shadow-2xl border-2 border-brand-500/40 text-center backdrop-blur-md glow-card">
            <div class="absolute -right-8 -bottom-8 opacity-15 pointer-events-none text-9xl">💌</div>
            <div class="absolute -left-8 -top-8 opacity-15 pointer-events-none text-9xl">⚡</div>
            
            <span class="inline-block bg-brand-500/20 text-brand-300 border border-brand-400/40 text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4 shadow">
                ❄️ Holiday Season &amp; All Occasions &bull; Series 1
            </span>
            
            <h1 class="font-serif text-4xl sm:text-6xl lg:text-7xl font-extrabold bg-gradient-to-r from-white via-pink-200 to-cyan-300 bg-clip-text text-transparent mb-6 drop-shadow-[0_0_30px_rgba(217,70,239,0.7)]">
                TapGreetings
            </h1>
            
            <p class="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed">
                Smart credit card-sized NFC keepsake greeting cards that come alive with a single smartphone tap. Immersive 4K video greetings, customizable artwork, and rewritable NTAG215 microchips.
            </p>

            <div class="flex flex-wrap justify-center gap-4">
                <a href="#collection" class="bg-gradient-to-r from-brand-600 via-pink-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold px-8 py-3.5 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center gap-2">
                    <i class="fa-solid fa-gift"></i> Explore All Greeting Cards
                </a>
                <a href="${meta.custom_designer_url}" target="_blank" class="bg-slate-900 hover:bg-slate-800 text-cyanAccent-300 border border-cyan-400/50 font-bold px-8 py-3.5 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center gap-2">
                    <i class="fa-solid fa-wand-magic-sparkles"></i> Create Custom Card Studio
                </a>
                <a href="${meta.tools_url}" target="_blank" class="bg-slate-900 hover:bg-slate-800 text-brand-300 border border-brand-500/40 font-bold px-6 py-3.5 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center gap-2">
                    <i class="fa-solid fa-bolt"></i> NFC Reprogrammer (/tools)
                </a>
            </div>

            <!-- Stats Bar -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-8 border-t border-brand-500/30 max-w-3xl mx-auto text-center">
                <div class="bg-slate-950/70 p-3.5 rounded-2xl border border-brand-500/20">
                    <div class="font-serif text-2xl sm:text-3xl font-bold text-brand-300">${cards.length}</div>
                    <div class="text-xs text-slate-400 uppercase tracking-wider font-semibold">Keepsake Cards</div>
                </div>
                <div class="bg-slate-950/70 p-3.5 rounded-2xl border border-brand-500/20">
                    <div class="font-serif text-2xl sm:text-3xl font-bold text-cyanAccent-400">4K</div>
                    <div class="text-xs text-slate-400 uppercase tracking-wider font-semibold">Motion Video &amp; Sound</div>
                </div>
                <div class="bg-slate-950/70 p-3.5 rounded-2xl border border-brand-500/20">
                    <div class="font-serif text-2xl sm:text-3xl font-bold text-white">NTAG215</div>
                    <div class="text-xs text-slate-400 uppercase tracking-wider font-semibold">100% Rewritable Chip</div>
                </div>
                <div class="bg-slate-950/70 p-3.5 rounded-2xl border border-brand-500/20">
                    <div class="font-serif text-2xl sm:text-3xl font-bold text-brand-300">Dual Aspect</div>
                    <div class="text-xs text-slate-400 uppercase tracking-wider font-semibold">Vertical &amp; Horizontal</div>
                </div>
            </div>
        </div>

        <!-- Controls Section: Search, Filters, Orientation Toggle, Sort -->
        <div id="collection" class="bg-slate-900/90 rounded-2xl p-6 mb-8 shadow-xl border border-brand-500/30 backdrop-blur-md flex flex-col md:flex-row gap-4 items-center justify-between">
            <div class="flex items-center gap-3 w-full md:w-auto">
                <h2 class="font-serif text-2xl font-bold text-white whitespace-nowrap flex items-center gap-2">
                    <i class="fa-solid fa-boxes-stacked text-brand-400"></i> Collection
                </h2>
                <span id="cardCountBadge" class="bg-slate-800 text-brand-300 text-xs font-bold px-3 py-1 rounded-full border border-brand-500/30">
                    ${cards.length} Cards
                </span>
            </div>

            <div class="flex flex-wrap gap-3 w-full md:w-auto items-center justify-end">
                <!-- Search Input -->
                <div class="relative flex-grow sm:flex-grow-0">
                    <input type="text" id="searchInput" placeholder="Search cards, occasions..." oninput="filterCards()" class="w-full sm:w-52 bg-slate-950 text-white placeholder-slate-400 text-sm px-4 py-2 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500">
                </div>

                <!-- Front / Back Toggle -->
                <div class="flex bg-slate-950 p-1 rounded-xl border border-slate-700">
                    <button onclick="setSide('front')" id="btnFront" class="px-3 py-1 text-xs font-bold rounded-lg bg-brand-600 text-white shadow transition-all">Front</button>
                    <button onclick="setSide('back')" id="btnBack" class="px-3 py-1 text-xs font-bold rounded-lg text-slate-400 transition-all">Back</button>
                </div>

                <!-- Orientation / Aspect Filter -->
                <select id="aspectFilter" onchange="filterCards()" class="bg-slate-950 text-white text-sm px-3.5 py-2 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500">
                    <option value="">All Orientations</option>
                    <option value="portrait">↕ Vertical (Portrait)</option>
                    <option value="landscape">↔ Horizontal (Landscape)</option>
                </select>

                <!-- Occasion Filter -->
                <select id="categoryFilter" onchange="filterCards()" class="bg-slate-950 text-white text-sm px-3.5 py-2 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500">
                    <option value="">All Occasions</option>
                    <option value="Holiday">🎄 Holiday &amp; Winter</option>
                    <option value="Black Friday">🛍️ Black Friday</option>
                    <option value="Birthday">🎂 Birthday</option>
                    <option value="Anniversary">💍 Anniversary</option>
                    <option value="Thank You">🙏 Thank You</option>
                    <option value="Congratulations">🎉 Congratulations</option>
                    <option value="Wedding">👰 Wedding</option>
                    <option value="Everyday">💜 Thinking of You / Baby</option>
                </select>

                <!-- Sort Order -->
                <select id="sortSelect" onchange="filterCards()" class="bg-slate-950 text-white text-sm px-3.5 py-2 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500">
                    <option value="id-asc" selected>Card # (01 &rarr; 12)</option>
                    <option value="id-desc">Card # (12 &rarr; 01)</option>
                    <option value="title-asc">Title (A &rarr; Z)</option>
                </select>
            </div>
        </div>

        <!-- Cards Grid Container -->
        <div id="cardsGrid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
            <!-- Dynamically populated via JS -->
        </div>

        <!-- Dedicated Web NFC Reprogrammer Feature Box -->
        <div class="mt-16 bg-slate-900/90 rounded-3xl p-8 sm:p-12 border-2 border-cyan-500/40 glow-cyan text-center max-w-4xl mx-auto">
            <span class="inline-block bg-cyan-500/20 text-cyan-300 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider mb-4 border border-cyan-500/30">
                ⚡ TapThingy NFC Web Reprogrammer Tool
            </span>
            <h3 class="font-serif text-2xl sm:text-3xl font-bold text-white mb-3">
                Update or Rewrite Any Card in Seconds
            </h3>
            <p class="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-6 leading-relaxed">
                Want to change where your card links? Open our Web NFC Tool directly in your browser on Android Chrome, or use free NFC Tools on iPhone.
            </p>
            <div class="flex flex-wrap justify-center gap-4">
                <a href="${meta.tools_url}" target="_blank" class="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-8 py-3.5 rounded-2xl shadow-lg shadow-cyan-500/30 transition-transform hover:scale-105 inline-flex items-center gap-2">
                    <i class="fa-solid fa-bolt"></i> Open Reprogrammer Webtool (/tools) ↗
                </a>
            </div>
        </div>

    </main>

    <script>
        const cardsData = ${JSON.stringify(cards.map(c => ({
          id: c.id,
          slug: c.slug,
          title: c.title,
          alias: c.alias,
          header: c.header_display,
          category: c.category,
          occasion: c.occasion,
          aspect: c.aspect,
          frontImg: c.assets.front_image.startsWith('/') ? '.' + c.assets.front_image : c.assets.front_image,
          backImg: c.assets.back_image ? (c.assets.back_image.startsWith('/') ? '.' + c.assets.back_image : c.assets.back_image) : '',
          shopifyUrl: c.shopify_product_url
        })))};

        let currentSide = 'front';

        function setSide(side) {
            currentSide = side;
            const btnF = document.getElementById('btnFront');
            const btnB = document.getElementById('btnBack');
            if (side === 'front') {
                btnF.className = 'px-3 py-1 text-xs font-bold rounded-lg bg-brand-600 text-white shadow transition-all';
                btnB.className = 'px-3 py-1 text-xs font-bold rounded-lg text-slate-400 transition-all';
            } else {
                btnB.className = 'px-3 py-1 text-xs font-bold rounded-lg bg-brand-600 text-white shadow transition-all';
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
                const aspectClass = isLand ? 'aspect-[3/2]' : 'aspect-[2/3]';

                html += \`
                    <a href="./\${c.slug}/index.html" class="group bg-slate-900 rounded-2xl overflow-hidden shadow-xl border border-slate-800 hover:border-brand-500 transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between glow-card">
                        <div class="relative w-full \${aspectClass} bg-slate-950 overflow-hidden">
                            <img src="\${imgSrc}" alt="\${c.title}" class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500">
                            <div class="absolute top-2.5 right-2.5 bg-slate-950/80 backdrop-blur-sm text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-700 \${isLand ? 'text-cyanAccent-300' : 'text-brand-300'}">
                                \${isLand ? '↔ Horizontal' : '↕ Vertical'}
                            </div>
                        </div>
                        <div class="p-4 flex flex-col gap-1.5 flex-grow justify-between">
                            <div>
                                <div class="flex justify-between items-center mb-1">
                                    <span class="text-[10px] font-bold text-brand-400 tracking-wider uppercase">\${c.header}</span>
                                    <span class="text-[9px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-semibold border border-slate-700">\${c.category}</span>
                                </div>
                                <div class="font-serif text-lg font-bold text-white group-hover:text-brand-300 transition-colors leading-snug">\${c.title}</div>
                                <div class="text-xs text-slate-400 italic line-clamp-1">\${c.alias}</div>
                            </div>
                            <div class="mt-3 pt-2.5 border-t border-slate-800 flex justify-between items-center text-xs font-bold text-cyanAccent-400">
                                <span>View TapGreeting &rarr;</span>
                                <span class="text-white bg-brand-600/30 px-2 py-0.5 rounded-md text-[11px]">$29.99</span>
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
            const category = document.getElementById('categoryFilter').value;
            const sort = document.getElementById('sortSelect').value;

            let filtered = cardsData.filter(c => {
                const matchesQuery = c.title.toLowerCase().includes(query) || c.alias.toLowerCase().includes(query) || c.category.toLowerCase().includes(query) || c.occasion.toLowerCase().includes(query);
                const matchesAspect = aspect === '' || c.aspect === aspect;
                const matchesCategory = category === '' || c.category === category || c.occasion.includes(category);
                return matchesQuery && matchesAspect && matchesCategory;
            });

            if (sort === 'id-asc') {
                filtered.sort((a, b) => parseInt(a.id || 0) - parseInt(b.id || 0));
            } else if (sort === 'id-desc') {
                filtered.sort((a, b) => parseInt(b.id || 0) - parseInt(a.id || 0));
            } else if (sort === 'title-asc') {
                filtered.sort((a, b) => a.title.localeCompare(b.title));
            }

            renderCards(filtered);
        }

        // Initial render
        filterCards();
    </script>
${getFooterHtml()}
`;

fs.writeFileSync(path.join(projectRoot, 'index.html'), mainIndexHtml, 'utf8');
console.log('Successfully generated tapgreetings.com index.html and all card pages!');
