const fs = require('fs');
const path = require('path');

const masterData = require('../data/greetings_master.json');
const holidayOfficial = require('../data/holiday_series_official.json');

// Build CARD_LORE_MAP with all 24 cards
const loreMap = {};

// Box Set
loreMap['box'] = {
  code: 'box',
  name: 'Happy Holidays Master Collection',
  title: 'The Complete Masterpiece Collection',
  craft: 'Handcrafted Polymer Clay & Nordic Clockwork Set',
  motto: 'Bring the warmth of handcrafted holiday wonder home—one magical tap at a time!',
  lore: 'The premier holiday keepsake master collection. Every card features handcrafted characters, gold-foil detailing, and embedded NTAG215 rewritable smart chips nestled inside a luxury display box.',
  signatureMotif: 'Collector Velvet Box Set with Gold Foil Filigree & Certificate of Authenticity.',
  abilities: 'Unlocks the full digital archive, VIP collector updates, and all stop-motion animations in glorious 1080p.',
  nfcMotif: 'Dual NFC Master Target on the Collector Box Lid & All Individual Cards.',
  is_landscape: false,
  aspect_ratio: '9/16',
  indicators: [
    { name: 'Cheer', stars: '?????', score: 5 },
    { name: 'Warmth', stars: '?????', score: 5 },
    { name: 'Wonder', stars: '?????', score: 5 }
  ]
};

// All 24 Cards
masterData.cards.forEach(c => {
  const code = c.card_code;
  const off = holidayOfficial[code] || {};
  loreMap[code] = {
    code: code,
    name: off.name || c.character.name,
    title: off.title || c.character.title,
    craft: off.series || c.character.profile_theme || 'Handcrafted Keepsake',
    motto: off.motto || c.character.motto,
    lore: c.character.micro_lore || off.abilities || '',
    signatureMotif: off.nfcMotif || c.character.signature_motif || '',
    abilities: off.abilities || '',
    nfcMotif: off.nfcMotif || '',
    is_landscape: Boolean(off.is_landscape || c.is_landscape),
    aspect_ratio: off.aspect_ratio || '9/16',
    indicators: off.indicators || [
      { name: 'Cheer', stars: '?????', score: 5 },
      { name: 'Warmth', stars: '?????', score: 5 },
      { name: 'Wonder', stars: '?????', score: 4 }
    ]
  };
});

const setSectionPath = path.join(__dirname, '../theme/sections/tapgreetings-set-product-page.liquid');
let content = fs.readFileSync(setSectionPath, 'utf8');

// Ensure .tg-media-viewport.is-landscape CSS exists
if (!content.includes('.tg-media-viewport.is-landscape')) {
  content = content.replace(
    '.tg-media-viewport {',
    `.tg-media-viewport.is-landscape {
    aspect-ratio: 16 / 9 !important;
    max-width: 580px !important;
  }
  .tg-media-viewport {`
  );
  console.log('? Added .tg-media-viewport.is-landscape CSS');
}

// Update CARD_LORE_MAP in the script
const loreMapJson = JSON.stringify(loreMap, null, 2);
const mapStartMarker = 'var CARD_LORE_MAP =';
const mapEndMarker = 'function updateLivingCardShowcase';

const sIdx = content.indexOf(mapStartMarker);
const eIdx = content.indexOf(mapEndMarker);

if (sIdx !== -1 && eIdx !== -1) {
  content = content.substring(0, sIdx) + `var CARD_LORE_MAP = ${loreMapJson};\n\n  ` + content.substring(eIdx);
  console.log('? Updated CARD_LORE_MAP with all 24 cards!');
} else {
  console.warn('Could not locate CARD_LORE_MAP boundaries');
}

// In updateLivingCardShowcase, ensure is-landscape toggle is present
if (!content.includes('mediaViewport.classList.add(\'is-landscape\')')) {
  content = content.replace(
    'var indicatorsEl = document.getElementById(\'tg-dyn-indicators\');',
    `var indicatorsEl = document.getElementById('tg-dyn-indicators');
    var mediaViewport = document.querySelector('.tg-media-viewport');
    if (mediaViewport) {
      if (data.is_landscape || data.aspect_ratio === '16/9') {
        mediaViewport.classList.add('is-landscape');
      } else {
        mediaViewport.classList.remove('is-landscape');
      }
    }`
  );
  console.log('? Injected landscape class toggle in updateLivingCardShowcase');
}

fs.writeFileSync(setSectionPath, content, 'utf8');
console.log('Successfully saved tapgreetings-set-product-page.liquid!');
