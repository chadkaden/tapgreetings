const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '../data/greetings_master.json');
const csvPath = path.join(__dirname, '../data/greetings_master.csv');

function escapeCsv(val) {
  if (val === null || val === undefined) return '""';
  if (Array.isArray(val)) {
    val = val.join(', ');
  } else if (typeof val === 'object') {
    val = JSON.stringify(val);
  }
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

function parseCsvLine(text) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (inQuotes && text[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      result.push(cur);
      cur = '';
    } else {
      cur += c;
    }
  }
  result.push(cur);
  return result;
}

const columns = [
  'card_id',
  'series_id',
  'card_number',
  'slug',
  'aliases_slugs',
  'event_greeting',
  'character_name',
  'character_title',
  'character_profile_theme',
  'motto',
  'micro_lore',
  'rarity_tier',
  'prompt_front_artwork',
  'prompt_back_design',
  'prompt_motion_video',
  'prompt_voice_dialogue',
  'prompt_negative',
  'primary_occasion',
  'keywords',
  'seo_title',
  'seo_meta_desc',
  'aspect_ratio',
  'video_url',
  'front_image_url',
  'back_image_url',
  'audio_dialogue',
  'theme_name',
  'bg_obsidian_midnight',
  'accent_blush_pink',
  'accent_champagne_gold',
  'border_rose_gold',
  'neon_halo_glow',
  'nfc_target_shape',
  'nfc_tap_label',
  'utility_action_type',
  'utility_button_text',
  'utility_target_url',
  'price',
  'compare_at_price',
  'sku'
];

function exportJsonToCsv() {
  const db = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const cards = db.cards;

  const lines = [columns.map(escapeCsv).join(',')];

  cards.forEach(c => {
    const char = c.character || {};
    const prompts = c.prompts || {};
    const seo = c.seo || {};
    const media = c.media || {};
    const style = c.style_tokens || {};
    const colors = style.colors || {};
    const nfc = c.nfc_config || {};
    const util = c.utility_action || {};
    const comm = c.commerce || {};

    const row = [
      c.card_id,
      c.series_id,
      c.card_number,
      c.slug,
      (c.aliases_slugs || []).join(','),
      c.event_greeting,
      char.name,
      char.title,
      char.profile_theme,
      char.motto,
      char.micro_lore,
      char.rarity_tier,
      prompts.prompt_front_artwork,
      prompts.prompt_back_design,
      prompts.prompt_motion_video,
      prompts.prompt_voice_dialogue,
      prompts.prompt_negative,
      seo.primary_occasion,
      (seo.keywords || []).join(','),
      seo.seo_title,
      seo.seo_meta_desc,
      media.aspect_ratio,
      media.video_url,
      media.front_image_url,
      media.back_image_url,
      media.audio_dialogue,
      style.theme_name,
      colors.bg_obsidian_midnight,
      colors.accent_blush_pink,
      colors.accent_champagne_gold,
      colors.border_rose_gold,
      colors.neon_halo_glow,
      nfc.target_shape,
      nfc.tap_label,
      util.action_type,
      util.button_text,
      util.target_url,
      comm.price,
      comm.compare_at_price,
      comm.sku
    ];

    lines.push(row.map(escapeCsv).join(','));
  });

  fs.writeFileSync(csvPath, lines.join('\n'), 'utf8');
  console.log(`Exported ${cards.length} cards to: ${csvPath}`);
}

function importCsvToJson() {
  if (!fs.existsSync(csvPath)) {
    console.error(`CSV file not found at: ${csvPath}`);
    process.exit(1);
  }

  const db = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const csvContent = fs.readFileSync(csvPath, 'utf8');
  const rawLines = csvContent.split(/\r?\n/).filter(l => l.trim().length > 0);
  
  if (rawLines.length < 2) {
    console.error('CSV has no data rows.');
    process.exit(1);
  }

  const headerCols = parseCsvLine(rawLines[0]);
  const colIndex = {};
  headerCols.forEach((col, idx) => {
    colIndex[col.replace(/^"|"$/g, '').trim()] = idx;
  });

  const updatedCards = [];

  for (let i = 1; i < rawLines.length; i++) {
    const vals = parseCsvLine(rawLines[i]);
    const get = (key) => {
      const idx = colIndex[key];
      return idx !== undefined ? vals[idx] : '';
    };

    const cardId = get('card_id');
    const existing = db.cards.find(c => c.card_id === cardId) || {};

    const card = {
      card_id: cardId,
      series_id: get('series_id') || 'winter-glamour-2026',
      card_number: parseInt(get('card_number') || i),
      slug: get('slug'),
      aliases_slugs: (get('aliases_slugs') || '').split(',').map(s => s.trim()).filter(Boolean),
      event_greeting: get('event_greeting'),
      web_address: `https://TapGreetings.com/${get('slug')}`,
      character: {
        name: get('character_name'),
        title: get('character_title'),
        aliases: [get('character_name'), get('character_title')],
        profile_theme: get('character_profile_theme'),
        motto: get('motto'),
        micro_lore: get('micro_lore'),
        indicators: existing.character?.indicators || { charm: '100/100', magic: '99/100', warmth: '98/100' },
        rarity_tier: get('rarity_tier') || 'Spectrum Common'
      },
      prompts: {
        prompt_front_artwork: get('prompt_front_artwork'),
        prompt_back_design: get('prompt_back_design'),
        prompt_motion_video: get('prompt_motion_video'),
        prompt_voice_dialogue: get('prompt_voice_dialogue'),
        prompt_negative: get('prompt_negative')
      },
      descriptions: {
        shopify_short_desc: existing.descriptions?.shopify_short_desc || '',
        shopify_full_html: existing.descriptions?.shopify_full_html || `<p>${get('micro_lore')}</p>`,
        social_share_caption: `${get('character_name')} - ${get('event_greeting')} https://TapGreetings.com/${get('slug')}`
      },
      seo: {
        primary_occasion: get('primary_occasion') || 'Holiday',
        keywords: (get('keywords') || '').split(',').map(k => k.trim()).filter(Boolean),
        seo_title: get('seo_title') || `${get('character_name')} | TapGreetings`,
        seo_meta_desc: get('seo_meta_desc') || get('micro_lore').slice(0, 155)
      },
      media: {
        aspect_ratio: get('aspect_ratio') || '9:16',
        video_url: get('video_url'),
        local_video_path: existing.media?.local_video_path || `/assets/video/${get('slug')}.mp4`,
        video_duration_seconds: existing.media?.video_duration_seconds || 10,
        audio_dialogue: get('audio_dialogue'),
        front_image_url: get('front_image_url'),
        local_front_image_path: existing.media?.local_front_image_path || `/assets/img/${get('slug')}-front.jpg`,
        back_image_url: get('back_image_url'),
        local_back_image_path: existing.media?.local_back_image_path || `/assets/img/${get('slug')}-back.jpg`
      },
      style_tokens: {
        theme_name: get('theme_name') || 'Glacial Glamour',
        colors: {
          bg_obsidian_midnight: get('bg_obsidian_midnight') || '#0A0E1A',
          bg_frosted_ice_blue: existing.style_tokens?.colors?.bg_frosted_ice_blue || '#E0F7FA',
          accent_blush_pink: get('accent_blush_pink') || '#FFD1DC',
          accent_champagne_gold: get('accent_champagne_gold') || '#F4E0A5',
          border_rose_gold: get('border_rose_gold') || '#B76E79',
          text_charcoal: '#2B2B2B',
          text_white: '#FFFFFF',
          neon_halo_glow: get('neon_halo_glow') || '#FF69B4'
        },
        typography: existing.style_tokens?.typography || {
          greeting_bubble_font: "'Cooper Black', 'Arial Black', display",
          card_title_font: "'Playfair Display', serif",
          header_sans_font: "'Montserrat', sans-serif",
          body_lore_font: "'Poppins', sans-serif"
        },
        borders: existing.style_tokens?.borders || {
          vector_stroke_width: '1.5pt',
          corner_style: 'sharp_rectangular',
          filigree_accents: '4_point_gold_starbursts'
        }
      },
      nfc_config: {
        target_shape: get('nfc_target_shape') || 'star',
        tap_label: get('nfc_tap_label') || '⟡ TAP HERE ⟡',
        instruction: 'Tap with NFC enabled phone or device',
        hidden_items_count: existing.nfc_config?.hidden_items_count || { stars: 10, bows: 5 }
      },
      utility_action: {
        action_type: get('utility_action_type') || 'VIEW_CARD',
        button_text: get('utility_button_text') || 'Experience TapGreeting',
        target_url: get('utility_target_url') || `https://TapGreetings.com/${get('slug')}`
      },
      commerce: {
        price: parseFloat(get('price')) || 29.99,
        compare_at_price: parseFloat(get('compare_at_price')) || 39.99,
        sku: get('sku') || `TG-CARD-${get('slug')}`,
        inventory_qty: 100,
        card_format: 'CR80 30mil Waterproof PVC',
        nfc_chip: 'NTAG215 (504 Bytes Rewritable)'
      }
    };

    updatedCards.push(card);
  }

  db.cards = updatedCards;
  db.series_metadata.total_cards = updatedCards.length;
  fs.writeFileSync(jsonPath, JSON.stringify(db, null, 2), 'utf8');
  console.log(`Successfully imported ${updatedCards.length} cards from CSV into ${jsonPath}`);
}

const isImport = process.argv.includes('--import');
if (isImport) {
  importCsvToJson();
} else {
  exportJsonToCsv();
}
