const fs = require('fs');
const path = require('path');

const genPath = path.join(__dirname, 'generate_cards.cjs');
let code = fs.readFileSync(genPath, 'utf8');

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

if (!code.includes('const solsticeRailHtml =')) {
  code = code.replace(
    '// 2. Draft Concept Series Rail HTML',
    `${solsticeRailDef}\n// 2. Draft Concept Series Rail HTML`
  );
  fs.writeFileSync(genPath, code, 'utf8');
  console.log('? Defined solsticeRailHtml before draftRailHtml');
}
