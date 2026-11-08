const fs = require('fs');
const path = require('path');

const homePath = path.join(__dirname, '../theme/sections/tapgreetings-homepage.liquid');
let content = fs.readFileSync(homePath, 'utf8');

// 1. Assign solstice_col
if (!content.includes('solstice_col')) {
  content = content.replace(
    "{% assign holiday_col = collections['tapgreetings-series-1'] %}",
    "{% assign holiday_col = collections['tapgreetings-series-1'] %}\n{% assign solstice_col = collections['solstice-magic'] %}"
  );
  console.log('? Added assign solstice_col');
}

// 2. Add tg-skin-solstice CSS
const solsticeSkinCss = `
  /* 4. SOLSTICE MAGIC SERIES 3 SKIN */
  .tg-skin-solstice .tg-rail-badge {
    background: #064E3B;
    color: #6EE7B7;
    border: 1px solid #10B981;
  }
  .tg-skin-solstice .tg-rail-title {
    color: #ECFDF5;
  }
  .tg-skin-solstice .tg-rail-sub {
    color: #A7F3D0;
  }
  .tg-skin-solstice .tg-rail-track::-webkit-scrollbar-thumb {
    background: #10B981;
  }
  .tg-skin-solstice .tg-card-item {
    background: #0A1128;
    border-color: rgba(16, 185, 129, 0.4);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  }
  .tg-skin-solstice .tg-card-item:hover {
    border-color: #34D399;
    box-shadow: 0 12px 30px rgba(16, 185, 129, 0.35);
  }
  .tg-skin-solstice .tg-card-title {
    color: #FFFFFF;
  }
  .tg-skin-solstice .tg-card-sub {
    color: #6EE7B7;
  }
  .tg-skin-solstice .tg-card-price {
    color: #FBBF24;
  }
  .tg-skin-solstice .tg-card-btn-view {
    background: linear-gradient(90deg, #059669, #10B981);
    color: #FFFFFF;
  }
`;

if (!content.includes('.tg-skin-solstice')) {
  content = content.replace('/* 1. HOLIDAY SERIES 1 SKIN */', `${solsticeSkinCss}\n  /* 1. HOLIDAY SERIES 1 SKIN */`);
  console.log('? Added .tg-skin-solstice CSS');
}

// 3. Add Solstice Rail markup
const solsticeRailHtml = `
  <!-- SERIES 3: SOLSTICE MAGIC (L2R SCROLL - CELESTIAL CLOCKWORK SKIN) -->
  <section id="solstice-section" class="tg-rail-section tg-skin-solstice">
    <div class="tg-rail-header">
      <div>
        <span class="tg-rail-badge">
          <i class="fa-solid fa-moon"></i> Series 3 &bull; Solstice Magic
        </span>
        <h2 class="tg-rail-title">The Celestial Clockwork Solstice</h2>
        <p class="tg-rail-sub">Nordic winter folklore, astronomical starlight &amp; vintage mechanical clockwork &bull; Cards #017 to #024</p>
      </div>
      <div class="tg-rail-controls">
        <button onclick="scrollRail('solstice-track', -320)" class="tg-scroll-btn" aria-label="Scroll left"><i class="fa-solid fa-chevron-left"></i></button>
        <button onclick="scrollRail('solstice-track', 320)" class="tg-scroll-btn" aria-label="Scroll right"><i class="fa-solid fa-chevron-right"></i></button>
        <a href="/collections/solstice-magic" class="tg-view-all-link" style="color: #6EE7B7;">View Collection &rarr;</a>
      </div>
    </div>

    <div class="tg-rail-track-wrap">
      <div id="solstice-track" class="tg-rail-track">
        {% for prod in solstice_col.products %}
          {% assign card_code = '' %}
          {% if prod.title contains '#' %}
            {% assign parts = prod.title | split: '#' %}
            {% assign subparts = parts[1] | split: ' ' %}
            {% assign card_code = subparts[0] %}
          {% endif %}
          <a href="{{ prod.url }}" class="tg-card-item">
            <div class="tg-card-art-box">
              {% if prod.images.size > 0 %}
                <img src="{{ prod.images[0] | image_url: width: 500 }}" alt="{{ prod.title }}" loading="lazy">
              {% endif %}
              {% if card_code != '' %}
                <span class="tg-card-badge-top" style="color: #A7F3D0; border-color: #10B981;">#{{ card_code }}</span>
              {% endif %}
            </div>
            <div class="tg-card-info">
              <div>
                <div class="tg-card-title">{{ prod.title | split: ' - ' | first }}</div>
                <div class="tg-card-sub" style="color: #6EE7B7;">Series 3 &bull; Solstice Magic</div>
              </div>
              <div class="tg-card-action">
                <span class="tg-card-price">{{ prod.price | money }}</span>
                <span class="tg-card-btn-view">View &bull; {{ prod.price | money }}</span>
              </div>
            </div>
          </a>
        {% endfor %}
      </div>
    </div>
  </section>
`;

if (!content.includes('id="solstice-section"')) {
  content = content.replace(
    '<!-- 4. DRAFT CONCEPT SERIES',
    `${solsticeRailHtml}\n  <!-- 4. DRAFT CONCEPT SERIES`
  );
  console.log('? Added solstice-section rail markup');
}

fs.writeFileSync(homePath, content, 'utf8');
console.log('? Successfully updated tapgreetings-homepage.liquid!');
