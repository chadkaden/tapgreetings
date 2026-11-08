const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'generate_cards.cjs');
let code = fs.readFileSync(filePath, 'utf8');

// 1. Ensure .tghh-video-box.is-landscape CSS exists
if (!code.includes('.tghh-video-box.is-landscape')) {
  code = code.replace(
    '.tghh-video-box {',
    `.tghh-video-box.is-landscape {
            aspect-ratio: 16/9 !important;
            max-width: 580px !important;
        }
        .tghh-video-box {`
  );
  console.log('? Added .tghh-video-box.is-landscape CSS');
}

// 2. Video element: Add is-landscape class if card is landscape
if (!code.includes('isLandscape ? \'is-landscape\' : \'\'')) {
  // Check where <div class="tghh-video-box" onclick="toggleMute()"> is
  code = code.replace(
    '<div class="tghh-video-box" onclick="toggleMute()">',
    '<div class="tghh-video-box ${isLandscape ? \'is-landscape\' : \'\'}" onclick="toggleMute()">'
  );
  // Also inject const isLandscape right before cardPageHtml
  code = code.replace(
    'const extraData = {',
    'const isLandscape = (official && official.is_landscape) || card.is_landscape || (official && official.aspect_ratio === \'16/9\');\n  const extraData = {'
  );
  console.log('? Injected isLandscape handling in video hero');
}

// 3. Make card count dynamic (instead of # of 016)
code = code.replace(
  /#\$\{card\.card_code\} of 016/g,
  '#${card.card_code} of ${String(cards.length).padStart(3, \'0\')}'
);
code = code.replace(
  /&#10022; TapGreetings Series 1 &bull; Card #\$\{card\.card_code\} of 016 &#10022;/g,
  '&#10022; ${escapeHtml(card.series_name || \'TapGreetings Series\')} &bull; Card #${card.card_code} of ${String(cards.length).padStart(3, \'0\')} &#10022;'
);

// 4. Update getCardCategory to include 'solstice' for cards 17-24
if (!code.includes("num >= 17 && num <= 24) return 'solstice'")) {
  code = code.replace(
    'const num = parseInt(code, 10);',
    'const num = parseInt(code, 10);\n  if (num >= 17 && num <= 24) return \'solstice\';'
  );
  console.log('? Updated getCardCategory with solstice');
}

// 5. Update collectionsData to include series-3 and solstice-magic hubs if not present
if (!code.includes("slug: 'solstice-magic'")) {
  const solsticeColls = `  {
    slug: 'series-3',
    category: 'solstice',
    title: 'TapGreetings Series 3: The Celestial Clockwork Solstice (Cards 017–024)',
    heading: 'Series 3: Solstice Magic',
    subtitle: 'Nordic Folklore, Starlight & Clockwork Automata (Cards 017–024)',
    description: 'Blending Scandinavian birchwood, astronomical starlight, and vintage brass clockwork into physical and digital NFC keepsakes. Featuring Orrery Stag (#017), Tomte (#018), Julbock (#019), Astrolabe Owl (#020), Lucia Automaton (#021), Cuckoo Horologe (#022), Aurora Hare (#023), and Sunstone Locomotive (#024).',
    filter: c => [17, 18, 19, 20, 21, 22, 23, 24].includes(parseInt(c.card_code, 10))
  },
  {
    slug: 'solstice-magic',
    category: 'solstice',
    title: 'Solstice Magic! Series 3 | TapGreetings',
    heading: 'Solstice Magic! Collection Hub',
    subtitle: 'The Celestial Clockwork Solstice Collection (Cards 017–024)',
    description: 'Nordic winter folklore meets astronomical clockwork. Tap to align the stars, listen to crystal carillons, and journey across the aurora.',
    filter: c => [17, 18, 19, 20, 21, 22, 23, 24].includes(parseInt(c.card_code, 10))
  },
`;
  code = code.replace('const collectionsData = [', `const collectionsData = [\n${solsticeColls}`);
  console.log('? Added series-3 and solstice-magic to collectionsData');
}

fs.writeFileSync(filePath, code, 'utf8');
console.log('Successfully upgraded generate_cards.cjs!');
