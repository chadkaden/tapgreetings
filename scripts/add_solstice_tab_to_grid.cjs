const fs = require('fs');
const path = require('path');

const gridPath = path.join(__dirname, '../theme/sections/tapgreetings-collection-grid.liquid');
let content = fs.readFileSync(gridPath, 'utf8');

if (!content.includes('solstice-magic')) {
  const solsticeChip = `      <a href="/collections/solstice-magic" class="tg-filter-chip {% if collection.handle == 'solstice-magic' %}active{% endif %}" style="{% if collection.handle == 'solstice-magic' %}background: linear-gradient(90deg, #065F46, #10B981) !important; border-color: #34D399 !important;{% endif %}">
        <i class="fa-solid fa-moon"></i> Series 3: Solstice Magic (8)
      </a>\n`;
  content = content.replace(
    '<a href="/collections/series-1-festive-friends"',
    `${solsticeChip}      <a href="/collections/series-1-festive-friends"`
  );
  fs.writeFileSync(gridPath, content, 'utf8');
  console.log('? Added Solstice Magic tab to tapgreetings-collection-grid.liquid');
} else {
  console.log('Solstice Magic tab already present');
}
