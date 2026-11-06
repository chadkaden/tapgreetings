const fs = require('fs');
const path = require('path');

const generateCardsPath = path.join(__dirname, 'generate_cards.cjs');
let code = fs.readFileSync(generateCardsPath, 'utf8').replace(/\r\n/g, '\n');

// 1. Navigation Logo
const oldNavLogo = `        <!-- Brand / TapThingy Logo Button that triggers Menu -->
        <div class="flex items-center gap-2 sm:gap-3">
            <button onclick="toggleNavDrawer()" class="flex items-center gap-2 group text-left focus:outline-none cursor-pointer" title="Open Series &amp; Collections Menu" aria-label="Open Navigation Menu">
                <div class="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden shadow-md flex items-center justify-center p-0.5 bg-black border border-amber-600/40 group-hover:scale-105 transition-transform flex-shrink-0">
                    <img src="/assets/img/tapthingy-logo-white.png" alt="TapThingy" class="w-full h-full object-contain dark-logo">
                    <img src="/assets/img/tapthingy-logo-black.png" alt="TapThingy" class="w-full h-full object-contain light-logo hidden">
                </div>
                <div class="flex flex-col">
                    <div class="flex items-center gap-1.5">
                        <span class="font-header text-base sm:text-xl font-black text-white group-hover:text-amber-300 transition-colors tracking-tight">TapGreetings</span>
                        <i class="fa-solid fa-chevron-down text-[10px] sm:text-xs text-amber-400 group-hover:text-amber-200 transition-colors"></i>
                    </div>
                    <span class="text-[9px] text-amber-300 uppercase tracking-widest font-semibold hidden sm:inline leading-none">Collections Menu</span>
                </div>
            </button>
        </div>`;

const newNavLogo = `        <!-- Brand / TapThingy Logo linking to Home -->
        <div class="flex items-center gap-2 sm:gap-3">
            <a href="/" class="flex items-center gap-2 group text-left focus:outline-none" title="TapGreetings Home" aria-label="TapGreetings Home">
                <div class="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden shadow-md flex items-center justify-center p-0.5 bg-black border border-amber-600/40 group-hover:scale-105 transition-transform flex-shrink-0">
                    <img src="/assets/img/tapthingy-logo-white.png" alt="TapThingy" class="w-full h-full object-contain dark-logo">
                    <img src="/assets/img/tapthingy-logo-black.png" alt="TapThingy" class="w-full h-full object-contain light-logo hidden">
                </div>
                <span class="font-header text-base sm:text-xl font-black text-white group-hover:text-amber-300 transition-colors tracking-tight">TapGreetings</span>
            </a>
            <!-- Dedicated Collections Menu Button -->
            <button onclick="toggleNavDrawer()" class="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-[#20140D] hover:bg-[#2C1910] text-amber-300 hover:text-white border border-amber-800/40 text-xs font-bold transition-all cursor-pointer" title="Browse Collections &amp; Series">
                <i class="fa-solid fa-bars text-[11px] sm:text-xs text-amber-400"></i>
                <span class="text-[11px] sm:text-xs font-semibold">Menu</span>
            </button>
        </div>`;

if (code.includes(oldNavLogo)) {
  code = code.replace(oldNavLogo, newNavLogo);
  console.log('✅ 1. Navigation Logo updated to link to /');
} else {
  console.error('❌ Could not find oldNavLogo');
}

// 2. Add Pinkoween cards loading at top if not present
if (!code.includes('pinkoweenCards')) {
  const insertTarget = 'const draftCards = masterData.draft_cards || [];';
  const pinkSnippet = `const pinkoweenJsonPath = path.resolve(__dirname, '../../pinkoween/data/cards.json');
let pinkoweenCards = [];
if (fs.existsSync(pinkoweenJsonPath)) {
  try {
    pinkoweenCards = JSON.parse(fs.readFileSync(pinkoweenJsonPath, 'utf8'));
  } catch (e) {
    console.error('Failed reading pinkoween cards:', e.message);
  }
}`;
  code = code.replace(insertTarget, `${insertTarget}\n${pinkSnippet}`);
  console.log('✅ 2. Injected pinkoweenCards loader');
}

// 3. Inject Rail Styles into head
const railStyles = `
        /* L2R Rails & Skin Styles (Matching Shop Homepage) */
        .tg-rail-section {
            max-width: 1280px;
            margin: 0 auto 44px auto;
            padding: 0 12px;
        }
        .tg-rail-header {
            display: flex;
            flex-direction: column;
            gap: 6px;
            margin-bottom: 16px;
        }
        @media (min-width: 768px) {
            .tg-rail-header {
                flex-direction: row;
                justify-content: space-between;
                align-items: flex-end;
            }
        }
        .tg-rail-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-size: 0.72rem;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            padding: 4px 12px;
            border-radius: 999px;
            margin-bottom: 8px;
        }
        .tg-rail-title {
            font-family: 'Outfit', 'Playfair Display', serif;
            font-size: 1.8rem;
            font-weight: 900;
            margin: 0;
            line-height: 1.2;
        }
        .tg-rail-sub {
            font-size: 0.88rem;
            margin: 4px 0 0 0;
            line-height: 1.4;
        }
        .tg-rail-controls {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .tg-scroll-btn {
            width: 38px;
            height: 38px;
            border-radius: 50%;
            background: #1C120C;
            border: 1.5px solid rgba(251, 191, 36, 0.4);
            color: #FDE68A;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s;
            font-size: 0.85rem;
        }
        .tg-scroll-btn:hover {
            transform: scale(1.1);
            background: #2D1A10;
            border-color: #F59E0B;
        }
        .tg-rail-track-wrap {
            position: relative;
            width: 100%;
        }
        .tg-rail-track {
            display: flex;
            gap: 16px;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            padding: 12px 4px 20px 4px;
            scrollbar-width: thin;
            -webkit-overflow-scrolling: touch;
        }
        .tg-card-item-rail {
            flex: 0 0 190px;
            width: 190px;
            scroll-snap-align: start;
            border-radius: 20px;
            border: 2px solid;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            text-decoration: none;
            transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
        }
        @media (min-width: 640px) {
            .tg-card-item-rail {
                flex: 0 0 215px;
                width: 215px;
            }
        }
        .tg-card-item-rail:hover {
            transform: translateY(-4px);
        }
        .tg-card-art-box {
            position: relative;
            width: 100%;
            aspect-ratio: 54/86;
            background: #000;
            overflow: hidden;
        }
        .tg-card-art-box img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            transition: transform 0.4s ease;
        }
        .tg-card-item-rail:hover .tg-card-art-box img {
            transform: scale(1.04);
        }
        .tg-card-badge-top {
            position: absolute;
            top: 8px;
            right: 8px;
            background: rgba(0, 0, 0, 0.78);
            border: 1px solid;
            backdrop-filter: blur(4px);
            font-size: 0.68rem;
            font-weight: 800;
            padding: 3px 8px;
            border-radius: 8px;
            letter-spacing: 0.5px;
        }
        .tg-card-info {
            padding: 10px 12px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            flex-grow: 1;
            gap: 8px;
        }
        .tg-card-title-rail {
            font-size: 0.92rem;
            font-weight: 800;
            line-height: 1.25;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .tg-card-sub-rail {
            font-size: 0.75rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-top: 2px;
        }
        .tg-card-action-rail {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-top: 6px;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
        }
        .tg-card-price-rail {
            font-size: 0.95rem;
            font-weight: 800;
        }
        .tg-card-btn-view-rail {
            font-size: 0.72rem;
            font-weight: 700;
            padding: 4px 10px;
            border-radius: 8px;
        }

        /* Holiday Series Skin */
        .tg-skin-holiday .tg-rail-badge {
            background: #451A03;
            color: #FDE68A;
            border: 1px solid #D97706;
        }
        .tg-skin-holiday .tg-rail-title { color: #FFFBEB; }
        .tg-skin-holiday .tg-rail-sub { color: #FEF3C7; }
        .tg-skin-holiday .tg-card-item-rail {
            background: #180F0A;
            border-color: rgba(217, 119, 6, 0.35);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
        }
        .tg-skin-holiday .tg-card-item-rail:hover {
            border-color: #F59E0B;
            box-shadow: 0 12px 30px rgba(217, 119, 6, 0.25);
        }
        .tg-skin-holiday .tg-card-title-rail { color: #FFFFFF; }
        .tg-skin-holiday .tg-card-sub-rail { color: #FDE68A; }
        .tg-skin-holiday .tg-card-price-rail { color: #FBBF24; }
        .tg-skin-holiday .tg-card-btn-view-rail {
            background: linear-gradient(90deg, #9E1B32, #D97706);
            color: #FFFFFF;
        }
        .tg-box-set-holiday {
            border-color: #F59E0B !important;
            background: linear-gradient(180deg, #2D1409 0%, #170A04 100%) !important;
            box-shadow: 0 8px 30px rgba(245, 158, 11, 0.35) !important;
        }

        /* Draft Concept Series Skin */
        .tg-skin-draft .tg-rail-badge {
            background: #2E1065;
            color: #E9D5FF;
            border: 1px solid #A855F7;
        }
        .tg-skin-draft .tg-rail-title { color: #FAF5FF; }
        .tg-skin-draft .tg-rail-sub { color: #E9D5FF; }
        .tg-skin-draft .tg-card-item-rail {
            background: #150B1C;
            border-color: rgba(168, 85, 247, 0.35);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
        }
        .tg-skin-draft .tg-card-item-rail:hover {
            border-color: #C084FC;
            box-shadow: 0 12px 30px rgba(168, 85, 247, 0.25);
        }
        .tg-skin-draft .tg-card-title-rail { color: #FFFFFF; }
        .tg-skin-draft .tg-card-sub-rail { color: #D8B4FE; }
        .tg-skin-draft .tg-card-price-rail { color: #E9D5FF; }
        .tg-skin-draft .tg-card-btn-view-rail {
            background: linear-gradient(90deg, #7E22CE, #EC4899);
            color: #FFFFFF;
        }

        /* Pink-O-Ween Skin */
        .tg-skin-pink .tg-rail-badge {
            background: #3B0720;
            color: #FCE7F3;
            border: 1px solid #EC4899;
        }
        .tg-skin-pink .tg-rail-title { color: #FFF1F2; }
        .tg-skin-pink .tg-rail-sub { color: #FCE7F3; }
        .tg-skin-pink .tg-card-item-rail {
            background: #140816;
            border-color: rgba(236, 72, 153, 0.35);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
        }
        .tg-skin-pink .tg-card-item-rail:hover {
            border-color: #F472B6;
            box-shadow: 0 12px 30px rgba(236, 72, 153, 0.25);
        }
        .tg-skin-pink .tg-card-title-rail { color: #FFFFFF; }
        .tg-skin-pink .tg-card-sub-rail { color: #FBCFE8; }
        .tg-skin-pink .tg-card-price-rail { color: #F472B6; }
        .tg-skin-pink .tg-card-btn-view-rail {
            background: linear-gradient(90deg, #DB2777, #7C3AED);
            color: #FFFFFF;
        }
        .tg-box-set-pink {
            border-color: #EC4899 !important;
            background: linear-gradient(180deg, #2D0820 0%, #12040E 100%) !important;
            box-shadow: 0 8px 30px rgba(236, 72, 153, 0.35) !important;
        }
`;

if (!code.includes('.tg-rail-section')) {
  code = code.replace('/* Fullscreen Lightbox Zoom Styles */', `${railStyles}\n        /* Fullscreen Lightbox Zoom Styles */`);
  console.log('✅ 3. Injected Rail Styles');
}

// 4. Exact Share button replacement
const s1OldShare = `        function shareGreeting() {
            if (navigator.share) {
                navigator.share({
                    title: document.title,
                    text: "\${char.name} (\${char.title}) - TapGreetings Keepsake Card",
                    url: window.location.href
                }).catch(function() {});
            } else {
                navigator.clipboard.writeText(window.location.href).then(function() {
                    alert('Keepsake Card link copied to clipboard!');
                });
            }
        }`;

const s1NewShare = `        function shareGreeting() {
            var shareData = {
                title: document.title,
                text: "\${char.name} (\${char.title}) - TapGreetings Keepsake Card",
                url: window.location.href
            };
            if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                navigator.share(shareData).catch(function(err) {
                    if (err && err.name !== 'AbortError') {
                        copyUrlToClipboard();
                    }
                });
            } else {
                copyUrlToClipboard();
            }
        }

        function copyUrlToClipboard() {
            var url = window.location.href;
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(url).then(function() {
                    showShareToast('Keepsake link copied to clipboard! ✨');
                }).catch(function() {
                    fallbackCopyText(url);
                });
            } else {
                fallbackCopyText(url);
            }
        }

        function fallbackCopyText(text) {
            var textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = "fixed";
            textArea.style.top = "0";
            textArea.style.left = "0";
            textArea.style.opacity = "0";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                showShareToast('Keepsake link copied to clipboard! ✨');
            } catch (err) {
                prompt('Copy this keepsake link:', text);
            }
            document.body.removeChild(textArea);
        }

        function showShareToast(msg) {
            var existing = document.getElementById('tg-share-toast');
            if (existing) existing.remove();
            var toast = document.createElement('div');
            toast.id = 'tg-share-toast';
            toast.innerText = msg;
            toast.style.position = 'fixed';
            toast.style.bottom = '24px';
            toast.style.left = '50%';
            toast.style.transform = 'translateX(-50%)';
            toast.style.backgroundColor = '#180E09';
            toast.style.color = '#FDE68A';
            toast.style.border = '2px solid #F59E0B';
            toast.style.padding = '12px 24px';
            toast.style.borderRadius = '999px';
            toast.style.boxShadow = '0 10px 30px rgba(0,0,0,0.8), 0 0 15px rgba(245,158,11,0.4)';
            toast.style.zIndex = '9999';
            toast.style.fontWeight = 'bold';
            toast.style.fontSize = '0.9rem';
            toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            document.body.appendChild(toast);
            setTimeout(function() {
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(-50%) translateY(10px)';
                setTimeout(function() { toast.remove(); }, 300);
            }, 3000);
        }`;

if (code.includes(s1OldShare)) {
  code = code.replace(s1OldShare, s1NewShare);
  console.log('✅ 4. Replaced Series 1 shareGreeting');
} else {
  console.error('❌ Could not find s1OldShare');
}

const draftOldShare = `        function shareGreeting() {
            if (navigator.share) {
                navigator.share({
                    title: document.title,
                    text: "\${char.name} (\${char.title}) - TapGreetings Draft Concept",
                    url: window.location.href
                }).catch(function() {});
            } else {
                navigator.clipboard.writeText(window.location.href).then(function() {
                    alert('Concept Card link copied to clipboard!');
                });
            }
        }`;

const draftNewShare = s1NewShare.replace('Keepsake Card', 'Draft Concept');

if (code.includes(draftOldShare)) {
  code = code.replace(draftOldShare, draftNewShare);
  console.log('✅ 5. Replaced Draft shareGreeting');
} else {
  console.error('❌ Could not find draftOldShare');
}

// 5. Increase Typography on Card Pages
code = code.replace(
  'p class="text-xs sm:text-sm text-amber-100/90 leading-relaxed font-body break-words"',
  'p class="text-sm sm:text-base text-amber-100/90 leading-relaxed font-body break-words"'
);
code = code.replace(
  'p class="text-xs sm:text-sm text-amber-100/80 leading-relaxed font-body italic break-words"',
  'p class="text-sm sm:text-base text-amber-100/80 leading-relaxed font-body italic break-words"'
);
code = code.replace(
  'p class="font-sans text-xs sm:text-sm text-amber-300 font-semibold tracking-wide mt-1 break-words"',
  'p class="font-sans text-sm sm:text-base text-amber-300 font-semibold tracking-wide mt-1.5 break-words"'
);
code = code.replace(
  'p class="text-xs sm:text-sm text-amber-100/90 italic max-w-xl mx-auto mt-2 px-2 leading-relaxed break-words"',
  'p class="text-sm sm:text-base text-amber-100/90 italic max-w-xl mx-auto mt-2 px-2 leading-relaxed break-words"'
);
code = code.replace(
  'p class="font-sans text-xs text-amber-300 font-semibold tracking-wide mt-0.5"',
  'p class="font-sans text-sm text-amber-300 font-semibold tracking-wide mt-1"'
);
code = code.replace(
  'p class="text-xs text-amber-100/90 italic mt-1.5 px-1 leading-relaxed break-words"',
  'p class="text-sm text-amber-100/90 italic mt-1.5 px-1 leading-relaxed break-words"'
);

// Scale up indicator text
code = code.replace(
  'text-[9px] uppercase font-bold text-amber-200/80 tracking-wider truncate',
  'text-[11px] uppercase font-bold text-amber-200/80 tracking-wider truncate'
);
code = code.replace(
  'font-sans text-xs sm:text-sm font-bold text-amber-300 mt-1 tracking-wider truncate',
  'font-sans text-sm sm:text-base font-bold text-amber-300 mt-1 tracking-wider truncate'
);
code = code.replace(
  'text-[11px] text-amber-200/70',
  'text-xs sm:text-sm text-amber-200/70'
);
code = code.replace(
  'text-[11px] font-bold uppercase tracking-wider text-amber-300 block mb-1.5 flex items-center gap-1.5',
  'text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-300 block mb-1.5 flex items-center gap-1.5'
);
code = code.replace(
  'text-[11px] font-bold uppercase tracking-wider text-amber-400 block mb-1.5 flex items-center gap-1.5',
  'text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-400 block mb-1.5 flex items-center gap-1.5'
);
console.log('✅ 6. Scaled up typography on card pages');

// 6. Rails generator definition before mainIndexHtml
const railsDef = `
// ============================================================================
// Generate Shop-Themed L2R Rails for Main Homepage
// ============================================================================

// 1. Holiday Series 1 Rail HTML (Box Set Listed First, then #001 to #016)
const holidayRailHtml = \`
<section id="holiday-section" class="tg-rail-section tg-skin-holiday">
  <div class="tg-rail-header">
    <div>
      <span class="tg-rail-badge"><i class="fa-solid fa-snowflake"></i> Series 1 &bull; The Clay Anthology</span>
      <h2 class="tg-rail-title">Happy Holidays Series 1</h2>
      <p class="tg-rail-sub">Complete 16-card handcrafted polymer clay &amp; needle-felt collection &bull; Master Box Set listed first</p>
    </div>
    <div class="tg-rail-controls">
      <button onclick="scrollRail('holiday-track', -300)" class="tg-scroll-btn" aria-label="Scroll left"><i class="fa-solid fa-chevron-left"></i></button>
      <button onclick="scrollRail('holiday-track', 300)" class="tg-scroll-btn" aria-label="Scroll right"><i class="fa-solid fa-chevron-right"></i></button>
      <a href="\${MASTER_SET_URL}" target="_blank" style="font-size: 0.82rem; font-weight: 700; color: #FBBF24; text-decoration: underline; margin-left: 8px;">View Master Set</a>
    </div>
  </div>
  <div class="tg-rail-track-wrap">
    <div id="holiday-track" class="tg-rail-track">
      <!-- 1st Item: Master Box Set -->
      <a href="\${MASTER_SET_URL}" target="_blank" class="tg-card-item-rail tg-box-set-holiday">
        <div class="tg-card-art-box">
          <img src="/assets/img/cr80/master-collection-box-set.jpg" alt="Happy Holidays Master Box Set" loading="lazy">
          <span class="tg-card-badge-top" style="color: #FDE68A; border-color: #F59E0B;">
            <i class="fa-solid fa-crown text-amber-400"></i> MASTER BOX SET
          </span>
        </div>
        <div class="tg-card-info">
          <div>
            <div class="tg-card-title-rail">Happy Holidays Box Set</div>
            <div class="tg-card-sub-rail" style="color: #FBBF24;">All 16 Cards Included</div>
          </div>
          <div class="tg-card-action-rail">
            <span class="tg-card-price-rail">$199.00</span>
            <span class="tg-card-btn-view-rail" style="background: linear-gradient(90deg, #F59E0B, #D97706); color: #000; font-weight: 900;">Order Set &rarr;</span>
          </div>
        </div>
      </a>

      <!-- Cards #001 to #016 -->
      \${cards.map(c => {
        const ch = c.character || {};
        const front = resolveAssetPath(c.media?.local_front_image_path || c.media?.front_image_url);
        return \`
        <a href="/\${c.card_code}/" class="tg-card-item-rail">
          <div class="tg-card-art-box">
            <img src="\${front}" alt="\${ch.name}" loading="lazy">
            <span class="tg-card-badge-top" style="color: #FDE68A; border-color: #D97706;">#\${c.card_code}</span>
          </div>
          <div class="tg-card-info">
            <div>
              <div class="tg-card-title-rail">\${ch.name}</div>
              <div class="tg-card-sub-rail">\${ch.title}</div>
            </div>
            <div class="tg-card-action-rail">
              <span class="tg-card-price-rail">$14.99</span>
              <span class="tg-card-btn-view-rail">View &bull; $14.99</span>
            </div>
          </div>
        </a>
        \`;
      }).join('\\n')}
    </div>
  </div>
</section>
\`;

// 2. Draft Concept Series Rail HTML (#01 to #05)
const draftRailHtml = \`
<section id="draft-section" class="tg-rail-section tg-skin-draft">
  <div class="tg-rail-header">
    <div>
      <span class="tg-rail-badge"><i class="fa-solid fa-palette"></i> Pre-Clay Glamour Edition</span>
      <h2 class="tg-rail-title">Draft Concept Series</h2>
      <p class="tg-rail-sub">5 Original glamour keepsakes celebrating special seasonal occasions with exclusive video</p>
    </div>
    <div class="tg-rail-controls">
      <button onclick="scrollRail('draft-track', -300)" class="tg-scroll-btn" aria-label="Scroll left"><i class="fa-solid fa-chevron-left"></i></button>
      <button onclick="scrollRail('draft-track', 300)" class="tg-scroll-btn" aria-label="Scroll right"><i class="fa-solid fa-chevron-right"></i></button>
      <a href="/draft/" style="font-size: 0.82rem; font-weight: 700; color: #C084FC; text-decoration: underline; margin-left: 8px;">Explore All 5</a>
    </div>
  </div>
  <div class="tg-rail-track-wrap">
    <div id="draft-track" class="tg-rail-track">
      \${draftCards.map((c, idx) => {
        const pad = String(idx + 1).padStart(2, '0');
        const ch = c.character || {};
        const front = resolveAssetPath(c.media?.local_front_image_path || c.media?.front_image_url);
        return \`
        <a href="/draft/\${pad}/" class="tg-card-item-rail">
          <div class="tg-card-art-box">
            <img src="\${front}" alt="\${ch.name}" loading="lazy">
            <span class="tg-card-badge-top" style="color: #E9D5FF; border-color: #A855F7;">
              <i class="fa-solid fa-wand-magic-sparkles text-purple-400"></i> DRAFT #\${pad}
            </span>
          </div>
          <div class="tg-card-info">
            <div>
              <div class="tg-card-title-rail">\${ch.name}</div>
              <div class="tg-card-sub-rail">\${ch.title}</div>
            </div>
            <div class="tg-card-action-rail">
              <span class="tg-card-price-rail">$14.99</span>
              <span class="tg-card-btn-view-rail">Explore &bull; $14.99</span>
            </div>
          </div>
        </a>
        \`;
      }).join('\\n')}
    </div>
  </div>
</section>
\`;

// 3. Pink-O-Ween Rail HTML (Box Set Listed First, then Oct 01 to 31)
const pinkRailHtml = \`
<section id="pink-section" class="tg-rail-section tg-skin-pink">
  <div class="tg-rail-header">
    <div>
      <span class="tg-rail-badge"><i class="fa-solid fa-ghost"></i> The Haunted Pastel Collection</span>
      <h2 class="tg-rail-title">Pink-O-Ween Series</h2>
      <p class="tg-rail-sub">31 Days of spooky pastel glamour &bull; Full Box Set listed first, then Cards 01 to 31</p>
    </div>
    <div class="tg-rail-controls">
      <button onclick="scrollRail('pink-track', -300)" class="tg-scroll-btn" aria-label="Scroll left"><i class="fa-solid fa-chevron-left"></i></button>
      <button onclick="scrollRail('pink-track', 300)" class="tg-scroll-btn" aria-label="Scroll right"><i class="fa-solid fa-chevron-right"></i></button>
      <a href="https://shop.tapthingy.com/collections/pink-o-ween-collection" target="_blank" style="font-size: 0.82rem; font-weight: 700; color: #F472B6; text-decoration: underline; margin-left: 8px;">View All 31</a>
    </div>
  </div>
  <div class="tg-rail-track-wrap">
    <div id="pink-track" class="tg-rail-track">
      <!-- 1st Item: Pink-O-Ween Complete Coven Box Set -->
      <a href="https://shop.tapthingy.com/products/nfc-tap-to-video-pvc-greeting-card-pink-o-ween-master-collection" target="_blank" class="tg-card-item-rail tg-box-set-pink">
        <div class="tg-card-art-box">
          <img src="/assets/img/pinkoween/card_01_front.png" alt="Pink-O-Ween Full Box Set" loading="lazy">
          <span class="tg-card-badge-top" style="color: #FCE7F3; border-color: #EC4899;">
            <i class="fa-solid fa-box-open text-pink-400"></i> FULL 31-CARD SET
          </span>
        </div>
        <div class="tg-card-info">
          <div>
            <div class="tg-card-title-rail">Pink-O-Ween Box Set</div>
            <div class="tg-card-sub-rail" style="color: #F472B6;">Complete 31-Card Master Set</div>
          </div>
          <div class="tg-card-action-rail">
            <span class="tg-card-price-rail">$399.00</span>
            <span class="tg-card-btn-view-rail" style="background: linear-gradient(90deg, #EC4899, #DB2777); color: #fff;">Order Box Set &rarr;</span>
          </div>
        </div>
      </a>

      <!-- Cards 01 to 31 -->
      \${pinkoweenCards.map(c => \`
      <a href="https://shop.tapthingy.com/collections/pink-o-ween-collection" target="_blank" class="tg-card-item-rail">
        <div class="tg-card-art-box">
          <img src="/assets/img/pinkoween/card_\${c.id}_front.png" alt="\${c.title}" loading="lazy">
          <span class="tg-card-badge-top" style="color: #FCE7F3; border-color: #EC4899;">Oct \${c.id}</span>
        </div>
        <div class="tg-card-info">
          <div>
            <div class="tg-card-title-rail">\${c.title}</div>
            <div class="tg-card-sub-rail">\${c.alias || 'October ' + c.id + ' of 31'}</div>
          </div>
          <div class="tg-card-action-rail">
            <span class="tg-card-price-rail">$19.99</span>
            <span class="tg-card-btn-view-rail">View &bull; $19.99</span>
          </div>
        </div>
      </a>
      \`).join('\\n')}
    </div>
  </div>
</section>
\`;
`;

const mainIndexTarget = "const mainIndexHtml = `${getHeadHtml('TapGreetings: Living Keepsake Smart Greeting Cards (21 Cards)'";
code = code.replace(mainIndexTarget, `${railsDef}\n\n${mainIndexTarget}`);
console.log('✅ 7. Injected Rails definitions');

// 7. Replace the old Santa hero box on the homepage
const oldHeroBanner = `        <!-- Hero Spotlight Section Featuring Santa (Card 001) -->
        <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1E130D] via-[#2A1A12] to-[#3B191D] p-4 sm:p-10 lg:p-12 mb-8 sm:mb-10 shadow-2xl border-[2px] border-amber-600/50 backdrop-blur-md glow-amber w-full">
            <span class="clay-corner top-4 left-4">✦</span>
            <span class="clay-corner top-4 right-4">✦</span>
            <span class="clay-corner bottom-4 left-4">✦</span>
            <span class="clay-corner bottom-4 right-4">✦</span>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center w-full">
                
                <!-- MOBILE VIDEO FIRST: Video shows at the very top of hero on mobile (No Unmute Overlay) -->
                <div class="lg:col-span-5 flex flex-col items-center justify-center w-full min-w-0 order-1 lg:order-2">
                    <div class="relative group block w-60 sm:w-72 aspect-[9/16] rounded-3xl overflow-hidden border-[2px] border-amber-500/70 shadow-2xl bg-black glow-amber transition-transform hover:scale-[1.02] cursor-pointer" onclick="toggleHeroMute()">
                        <video id="heroVideo" autoplay loop playsinline poster="\${featuredFront}" class="w-full h-full object-cover">
                            <source src="\${featuredVideo}" type="video/mp4">
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
                            🎅 LIVING SMART KEEPSAKES
                        </span>
                        <span class="bg-[#1C120B] text-amber-300 border border-amber-600/40 text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                            21 Handcrafted Characters &bull; Series 1 + Draft
                        </span>
                    </div>

                    <h1 class="font-clayTitle text-3xl sm:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-amber-100 via-amber-200 to-rose-200 bg-clip-text text-transparent mb-2 sm:mb-3 drop-shadow-[0_0_30px_rgba(251,191,36,0.3)] break-words">
                        TapGreetings
                    </h1>
                    
                    <h2 class="font-sans text-base sm:text-2xl font-bold text-amber-200 mb-2 sm:mb-3 break-words">
                        \${featuredChar.name} &mdash; <span class="text-rose-300 font-serif italic">\${featuredChar.title}</span>
                    </h2>

                    <p class="text-xs sm:text-sm lg:text-base text-amber-100/90 max-w-xl mb-3 sm:mb-4 leading-relaxed break-words">
                        \${featuredChar.micro_lore}
                    </p>

                    <blockquote class="text-xs sm:text-sm italic text-amber-200/95 border-l-2 border-amber-400 pl-3 mb-5 max-w-xl break-words">
                        &ldquo;\${featuredChar.motto}&rdquo;
                    </blockquote>

                    <div class="flex flex-wrap gap-3 w-full sm:w-auto">
                        <a href="/001/" class="bg-gradient-to-r from-rose-700 via-rose-600 to-amber-600 hover:from-rose-600 hover:to-amber-500 text-white font-bold px-5 sm:px-8 py-2.5 sm:py-3 rounded-2xl shadow-xl shadow-rose-950/50 transition-transform hover:scale-105 flex items-center justify-center gap-2 text-xs sm:text-sm flex-1 sm:flex-initial">
                            <i class="fa-solid fa-play"></i> Experience Santa (001)
                        </a>
                        <a href="#collection" class="bg-[#20140D] hover:bg-[#2C1C13] text-amber-200 border border-amber-600/40 font-bold px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl shadow-lg transition-transform hover:scale-105 flex items-center justify-center gap-2 text-xs sm:text-sm flex-1 sm:flex-initial">
                            <i class="fa-solid fa-boxes-stacked"></i> Explore All 21 Cards
                        </a>
                    </div>
                </div>

            </div>
        </div>`;

const newHeroAndRails = `        <!-- 1. TOP HERO SECTION (Matching Shop: Headline + Video Demo + Jump Pills) -->
        <section class="relative max-w-5xl mx-auto my-6 px-4 py-8 sm:py-12 rounded-3xl bg-gradient-to-r from-[#1C100A] via-[#29170E] to-[#3B161B] border-2 border-amber-500/50 shadow-2xl text-center overflow-hidden">
            <span class="clay-corner top-4 left-4">✦</span>
            <span class="clay-corner top-4 right-4">✦</span>
            <span class="clay-corner bottom-4 left-4">✦</span>
            <span class="clay-corner bottom-4 right-4">✦</span>

            <div class="inline-flex items-center gap-2 bg-gradient-to-r from-rose-800 to-amber-700 text-white text-xs font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 shadow">
                <i class="fa-solid fa-microchip"></i> PVC NFC Video Keepsakes
            </div>
            
            <h1 class="text-3xl sm:text-5xl lg:text-6xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-rose-200 mb-4 tracking-tight drop-shadow">
                TAPGREETINGS - PVC NFC TAP to greetings video
            </h1>

            <p class="text-sm sm:text-base text-amber-100/90 max-w-2xl mx-auto mb-6 leading-relaxed font-medium">
                Handcrafted physical smart NFC keepsake cards. Tap any smartphone (iPhone or Android) against the card to instantly stream exclusive character video and voice greetings—zero app download required. Fully rewritable with our free NFC web tool!
            </p>

            <!-- Tap-to-Video Ghost Tap Demo Frame -->
            <div class="relative w-64 sm:w-72 aspect-[9/16] mx-auto rounded-3xl overflow-hidden border-2 border-amber-500/60 shadow-2xl bg-black mb-6">
                <video loop muted playsinline autoplay poster="/assets/img/cr80/001-front.jpg" class="w-full h-full object-cover">
                    <source src="/assets/video/card_01_tap.mp4" type="video/mp4">
                </video>
            </div>

            <!-- Quick Navigation Jump Pills -->
            <div class="flex flex-wrap justify-center gap-2.5">
                <a href="#custom-section" class="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#2A173B] text-purple-200 border border-purple-500 hover:scale-105 transition-transform flex items-center gap-1.5 shadow">
                    <i class="fa-solid fa-wand-magic-sparkles text-purple-400"></i> Custom Card Studio
                </a>
                <a href="#holiday-section" class="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#2C180E] text-amber-200 border border-amber-500 hover:scale-105 transition-transform flex items-center gap-1.5 shadow">
                    <i class="fa-solid fa-snowflake text-amber-400"></i> Happy Holidays Series 1 (16)
                </a>
                <a href="#draft-section" class="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#1C122C] text-purple-200 border border-purple-600 hover:scale-105 transition-transform flex items-center gap-1.5 shadow">
                    <i class="fa-solid fa-palette text-purple-400"></i> Draft Concept Series (5)
                </a>
                <a href="#pink-section" class="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#250C1B] text-pink-200 border border-pink-500 hover:scale-105 transition-transform flex items-center gap-1.5 shadow">
                    <i class="fa-solid fa-ghost text-pink-400"></i> Pink-O-Ween (31)
                </a>
                <a href="#collection" class="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#1C120B] text-amber-300 border border-amber-600/50 hover:scale-105 transition-transform flex items-center gap-1.5 shadow">
                    <i class="fa-solid fa-boxes-stacked text-amber-400"></i> All 21 Cards Gallery
                </a>
            </div>
        </section>

        <!-- 2. CUSTOM CARD FEATURE SECTION -->
        <section id="custom-section" class="max-w-5xl mx-auto my-10 p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-[#180D25] via-[#241238] to-[#150921] border-2 border-purple-500/50 shadow-2xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div class="md:col-span-7 flex flex-col items-start text-left">
                <span class="inline-block bg-gradient-to-r from-purple-700 to-pink-600 text-white text-[11px] font-extrabold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-3 shadow">
                    <i class="fa-solid fa-star"></i> Featured Personalization
                </span>
                <h2 class="font-clayTitle text-2xl sm:text-4xl font-extrabold text-white mb-3">
                    Design Your Custom TapGreeting PVC Card
                </h2>
                <p class="text-xs sm:text-sm text-purple-200 leading-relaxed mb-5 font-medium">
                    Turn your family holiday photo, wedding video, baby announcement, or company greeting into a permanent living keepsake. We print your custom artwork directly onto solid CR80 waterproof PVC and encode an embedded rewritable NFC chip with your personal video or message link.
                </p>
                <ul class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-purple-200 mb-6 w-full">
                    <li class="flex items-center gap-2"><i class="fa-solid fa-check text-purple-400"></i> Standard CR80 Credit Card Size</li>
                    <li class="flex items-center gap-2"><i class="fa-solid fa-check text-purple-400"></i> iPhone &amp; Android Compatible</li>
                    <li class="flex items-center gap-2"><i class="fa-solid fa-check text-purple-400"></i> Rewritable NTAG215 Microchip</li>
                    <li class="flex items-center gap-2"><i class="fa-solid fa-check text-purple-400"></i> Zero App Download Required</li>
                </ul>
                <a href="https://shop.tapthingy.com/products/tap-thingy-nfc-custom-pvc-card" target="_blank" class="bg-gradient-to-r from-purple-700 via-pink-600 to-rose-600 hover:from-purple-600 hover:to-rose-500 text-white font-extrabold px-6 py-3.5 rounded-2xl shadow-xl transition-transform hover:scale-105 inline-flex items-center gap-2 text-sm">
                    <i class="fa-solid fa-palette"></i> <span>Customize &amp; Order &bull; $35.00</span> &rarr;
                </a>
            </div>
            <div class="md:col-span-5 flex justify-center">
                <div class="w-56 aspect-[54/86] rounded-2xl overflow-hidden border-2 border-purple-400/60 shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                    <img src="/assets/img/cr80/001-front.jpg" alt="Custom PVC Card Preview" class="w-full h-full object-cover">
                </div>
            </div>
        </section>

        <!-- 3. HAPPY HOLIDAYS SERIES 1 (L2R RAIL - BOX SET FIRST) -->
        \${holidayRailHtml}

        <!-- 4. DRAFT CONCEPT SERIES (L2R RAIL - PURPLE/NEON SKIN) -->
        \${draftRailHtml}

        <!-- 5. PINK-O-WEEN SERIES (L2R RAIL - SPOOKY HOT-PINK SKIN) -->
        \${pinkRailHtml}
`;

if (code.includes(oldHeroBanner)) {
  code = code.replace(oldHeroBanner, newHeroAndRails);
  console.log('✅ 8. Replaced Santa Hero Banner with Shop-Themed Hero + Rails');
} else {
  console.error('❌ Could not find oldHeroBanner');
}

// 8. Add scrollRail helper function to page scripts
const scrollRailDef = `
        function scrollRail(id, distance) {
            var el = document.getElementById(id);
            if (el) {
                el.scrollBy({ left: distance, behavior: 'smooth' });
            }
        }
`;
if (!code.includes('function scrollRail(')) {
  const insertBefore = 'function initHeroVideo()';
  code = code.replace(insertBefore, `${scrollRailDef}\n        ${insertBefore}`);
  console.log('✅ 9. Added scrollRail helper function');
}

fs.writeFileSync(generateCardsPath, code, 'utf8');
console.log('🎉 Successfully finished building all TapGreetings features in generate_cards.cjs!');
