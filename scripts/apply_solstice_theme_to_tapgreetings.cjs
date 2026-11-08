const fs = require('fs');
const path = require('path');

const genPath = path.join(__dirname, 'generate_cards.cjs');
let code = fs.readFileSync(genPath, 'utf8');

// 1. In individual card generation, add isSolstice and solstice-theme class
if (!code.includes('const isSolstice = parseInt(card.card_code, 10) >= 17;')) {
  code = code.replace(
    'const isLandscape = (official && official.is_landscape) || card.is_landscape || (official && official.aspect_ratio === \'16/9\');',
    `const isLandscape = (official && official.is_landscape) || card.is_landscape || (official && official.aspect_ratio === '16/9');
  const isSolstice = parseInt(card.card_code, 10) >= 17;`
  );
  code = code.replace(
    '<div class="tghh-experience-wrap">',
    '<div class="tghh-experience-wrap ${isSolstice ? \'solstice-theme\' : \'\'}">'
  );
  console.log('? Injected solstice-theme class on card page wrapper');
}

// 2. Add Solstice Theme CSS
const solsticeThemeCss = `
        /* Solstice Magic Theme for Series 3 (Cards 017-024) */
        .tghh-experience-wrap.solstice-theme {
            background: radial-gradient(ellipse at top, #0A1128 0%, #060913 70%, #03050A 100%) !important;
            border: 2px solid rgba(16, 185, 129, 0.45) !important;
            box-shadow: 0 12px 50px rgba(0,0,0,0.85), 0 0 35px rgba(16, 185, 129, 0.22) !important;
        }
        .tghh-experience-wrap.solstice-theme .tghh-corner {
            color: #34D399 !important;
            text-shadow: 0 0 8px #34D399 !important;
        }
        .tghh-experience-wrap.solstice-theme .tghh-badge {
            background: linear-gradient(135deg, #0F172A, #065F46, #047857, #10B981, #0F172A) !important;
            border: 1px solid #10B981 !important;
            color: #E6FFFA !important;
        }
        .tghh-experience-wrap.solstice-theme .tghh-dyn-subtitle {
            color: #10B981 !important;
        }
        .tghh-experience-wrap.solstice-theme .tghh-nav-row a {
            color: #10B981 !important;
        }
        .tghh-experience-wrap.solstice-theme .tghh-video-box {
            border: 2.5px solid #10B981 !important;
            box-shadow: 0 10px 40px rgba(0,0,0,0.8), 0 0 25px rgba(16,185,129,0.3) !important;
        }
        .tghh-experience-wrap.solstice-theme .tghh-sound-btn {
            border: 1.5px solid #10B981 !important;
            color: #10B981 !important;
            background: rgba(10,17,40,0.85) !important;
        }
        .tghh-experience-wrap.solstice-theme .tghh-quote-card {
            background: radial-gradient(circle at 50% 0%, rgba(16,185,129,0.18), rgba(10,17,40,0.95) 75%) !important;
            border: 1.5px solid rgba(16,185,129,0.5) !important;
            box-shadow: 0 0 25px rgba(16,185,129,0.2) !important;
        }
        .tghh-experience-wrap.solstice-theme .tghh-ability-card {
            background: linear-gradient(135deg, rgba(16,185,129,0.1), rgba(10,17,40,0.8)) !important;
            border: 1.5px solid rgba(16,185,129,0.35) !important;
        }
        .tghh-experience-wrap.solstice-theme .tghh-nfc-motif-card,
        .tghh-experience-wrap.solstice-theme .tghh-nfc-card {
            background: linear-gradient(135deg, rgba(15,23,42,0.9), rgba(6,78,59,0.4)) !important;
            border: 1.5px solid rgba(16,185,129,0.4) !important;
        }
        .tghh-experience-wrap.solstice-theme .tghh-atc-btn {
            background: linear-gradient(90deg, #047857, #10B981, #059669) !important;
            box-shadow: 0 6px 25px rgba(16,185,129,0.45) !important;
        }
`;

if (!code.includes('.tghh-experience-wrap.solstice-theme')) {
  code = code.replace(
    '/* Centered Luxury Card Immersion Layout',
    `${solsticeThemeCss}\n        /* Centered Luxury Card Immersion Layout`
  );
  console.log('? Added .tghh-experience-wrap.solstice-theme CSS');
}

// 3. Define solsticeRailHtml and insert on homepage
if (!code.includes('const solsticeRailHtml =')) {
  const solsticeRailDef = `
// 1b. Solstice Magic Series 3 Rail HTML (Cards #017 to #024)
const solsticeRailHtml = \`
<section id="solstice-section" class="tg-rail-section tg-skin-solstice" style="margin-bottom: 24px;">
  <div class="tg-rail-header">
    <div>
      <span class="tg-rail-badge" style="background: #064E3B; color: #6EE7B7; border: 1px solid #10B981;"><i class="fa-solid fa-moon"></i> Series 3 &bull; Solstice Magic</span>
      <h2 class="tg-rail-title" style="color: #ECFDF5;">The Celestial Clockwork Solstice</h2>
      <p class="tg-rail-sub" style="color: #A7F3D0;">Nordic winter folklore, astronomical starlight &amp; vintage brass clockwork &bull; Cards #017 to #024</p>
    </div>
    <div class="tg-rail-controls">
      <button onclick="scrollRail('solstice-track', -300)" class="tg-scroll-btn" aria-label="Scroll left"><i class="fa-solid fa-chevron-left"></i></button>
      <button onclick="scrollRail('solstice-track', 300)" class="tg-scroll-btn" aria-label="Scroll right"><i class="fa-solid fa-chevron-right"></i></button>
      <a href="/solstice-magic/" style="font-size: 0.82rem; font-weight: 700; color: #10B981; text-decoration: underline; margin-left: 8px;">View Solstice Hub</a>
    </div>
  </div>
  <div class="tg-rail-track-wrap">
    <div id="solstice-track" class="tg-rail-track">
      \${cards.slice(16, 24).map(c => {
        const ch = c.character || {};
        const front = resolveAssetPath(c.media?.local_front_image_path || c.media?.front_image_url);
        return \`
        <a href="/\${c.card_code}/" class="tg-card-item-rail" style="background: #0A1128; border-color: rgba(16, 185, 129, 0.4);">
          <div class="tg-card-art-box">
            <img src="\${front}" alt="\${ch.name}" loading="lazy">
            <span class="tg-card-badge-top" style="color: #A7F3D0; border-color: #10B981;">#\${c.card_code}</span>
          </div>
          <div class="tg-card-info">
            <div>
              <div class="tg-card-title-rail" style="color: #FFF;">\${ch.name}</div>
              <div class="tg-card-sub-rail" style="color: #6EE7B7;">\${ch.title}</div>
            </div>
            <div class="tg-card-action-rail">
              <span class="tg-card-price-rail" style="color: #FBBF24;">$14.99</span>
              <span class="tg-card-btn-view-rail" style="background: linear-gradient(90deg, #059669, #10B981); color: #FFF;">View &bull; $14.99</span>
            </div>
          </div>
        </a>
        \`;
      }).join('')}
    </div>
  </div>
</section>
\`;
`;
  code = code.replace(
    '// 2. Draft Series Rail HTML',
    `${solsticeRailDef}\n// 2. Draft Series Rail HTML`
  );

  // Restrict holidayRailHtml to cards.slice(0, 16)
  code = code.replace(
    '${cards.map(c => {',
    '${cards.slice(0, 16).map(c => {'
  );

  // Insert solsticeRailHtml into homepage
  code = code.replace(
    '<!-- 4. DRAFT CONCEPT SERIES',
    `<!-- 3b. SERIES 3: SOLSTICE MAGIC (L2R RAIL) -->\n        \${solsticeRailHtml}\n\n        <!-- 4. DRAFT CONCEPT SERIES`
  );
  console.log('? Defined and injected solsticeRailHtml on homepage');
}

fs.writeFileSync(genPath, code, 'utf8');
console.log('? Successfully upgraded generate_cards.cjs with Solstice Theme & Section!');
