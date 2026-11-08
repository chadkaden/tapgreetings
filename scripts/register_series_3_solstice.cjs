const fs = require('fs');
const path = require('path');

const officialPath = path.join(__dirname, '../data/holiday_series_official.json');
let official = JSON.parse(fs.readFileSync(officialPath, 'utf8'));

const series3Data = {
  "017": {
    "name": "The Solstice Orrery Stag",
    "title": "The Armillary Sovereign",
    "series": "Series 3: The Celestial Clockwork Solstice",
    "subcollection": "Solstice Magic",
    "abilities": "Articulated brass ball joints and rotating armillary sphere antler rack cradling glowing opalescent solstice stars and a spinning sunstone.",
    "motto": "Through every winding cycle of the cosmos, dawn unfailingly finds its way.",
    "nfcMotif": "An interlocking brass gear sunburst labeled \"TAP TO ALIGN THE STARS\".",
    "printFinish": "Soft-touch matte birchwood texture with metallic gold cold-foil stamping on the armillary antlers and gearwork.",
    "is_landscape": false,
    "aspect_ratio": "9/16",
    "indicators": [
      { "name": "Orbit Precision", "stars": "★★★★★", "score": 5 },
      { "name": "Majesty", "stars": "★★★★★", "score": 5 },
      { "name": "Solstice Lumens", "stars": "★★★★★", "score": 5 }
    ]
  },
  "018": {
    "name": "The Star-Keeper Tomte",
    "title": "The Chronologer Nisse",
    "series": "Series 3: The Celestial Clockwork Solstice",
    "subcollection": "Solstice Magic",
    "abilities": "Tending the smallest homestead hearth while timing falling snowflakes with an illuminated miniature brass star-sextant.",
    "motto": "Mind the quiet gears, tend the smallest hearth, and guide the night forward.",
    "nfcMotif": "An antique brass winding key flanked by celestial compass dots.",
    "printFinish": "Matte soft-touch finish on the woolen cap with raised gloss UV on the brass sextant and lantern glow.",
    "is_landscape": false,
    "aspect_ratio": "9/16",
    "indicators": [
      { "name": "Diligence", "stars": "★★★★★", "score": 5 },
      { "name": "Starlight", "stars": "★★★★★", "score": 5 },
      { "name": "Hygge", "stars": "★★★★★", "score": 5 }
    ]
  },
  "019": {
    "name": "The Clockwork Julbock",
    "title": "The Braided Straw Automaton",
    "series": "Series 3: The Celestial Clockwork Solstice",
    "subcollection": "Solstice Magic",
    "abilities": "Ticking brass gears and copper clockwork ribs that hum with soft astral bioluminescence, standing over frosted astronomical charts.",
    "motto": "Bound in ancient craft, driven by the steady heartbeat of joy.",
    "nfcMotif": "A stamped crimson-and-brass knot medallion.",
    "printFinish": "Rough tactile matte paper base with spot-gloss UV on the polished brass clockwork skeleton.",
    "is_landscape": false,
    "aspect_ratio": "9/16",
    "indicators": [
      { "name": "Heritage", "stars": "★★★★★", "score": 5 },
      { "name": "Torque", "stars": "★★★★★", "score": 5 },
      { "name": "Astral Spirit", "stars": "★★★★☆", "score": 4 }
    ]
  },
  "020": {
    "name": "The Astrolabe Owl",
    "title": "The Celestial Watcher",
    "series": "Series 3: The Celestial Clockwork Solstice",
    "subcollection": "Solstice Magic",
    "abilities": "Articulated etched-brass wing pinions perched upon a Victorian brass astrolabe ring, tracking northern aurora ribbons.",
    "motto": "Wisdom tracks the motion of the heavens and listens to the quiet forest.",
    "nfcMotif": "A concentric brass astrolabe dial labeled \"TAP FOR ASTRAL SIGHT\".",
    "printFinish": "Midnight-navy matte background with holographic foil accents on the aurora ribbons and brass wing feathers.",
    "is_landscape": false,
    "aspect_ratio": "9/16",
    "indicators": [
      { "name": "Navigation", "stars": "★★★★★", "score": 5 },
      { "name": "Vision", "stars": "★★★★★", "score": 5 },
      { "name": "Precision", "stars": "★★★★★", "score": 5 }
    ]
  },
  "021": {
    "name": "The Lucia Automaton",
    "title": "Maiden of the Solstice Dawn",
    "series": "Series 3: The Celestial Clockwork Solstice",
    "subcollection": "Solstice Magic",
    "abilities": "Rotating brass crown bearing glowing candles and celestial crystal prisms that cast prismatic dawn light across long winter shadows.",
    "motto": "A single steady flame turns the tide against the longest night.",
    "nfcMotif": "A rotating star-candle gear medallion.",
    "printFinish": "Pearlescent base cardstock with selective high-build gloss UV over the glowing candle flames.",
    "is_landscape": true,
    "aspect_ratio": "16/9",
    "indicators": [
      { "name": "Radiance", "stars": "★★★★★", "score": 5 },
      { "name": "Harmony", "stars": "★★★★★", "score": 5 },
      { "name": "Dawn Hope", "stars": "★★★★★", "score": 5 }
    ]
  },
  "022": {
    "name": "The Solstice Cuckoo Horologe",
    "title": "The Birch Chalet",
    "series": "Series 3: The Celestial Clockwork Solstice",
    "subcollection": "Solstice Magic",
    "abilities": "Twin brass chalet doors swing open to reveal a mechanized celestial hare under a revolving moon-phase globe and swinging pinecone weights.",
    "motto": "Count the winter hours in warmth, laughter, and fellowship around the fire.",
    "nfcMotif": "A swinging brass pendulum disc engraved with solar solstice runes.",
    "printFinish": "Soft-touch wood-grain texture with embossed metallic copper foil on the pendulum and pinecone weights.",
    "is_landscape": false,
    "aspect_ratio": "9/16",
    "indicators": [
      { "name": "Craftsmanship", "stars": "★★★★★", "score": 5 },
      { "name": "Tradition", "stars": "★★★★★", "score": 5 },
      { "name": "Wonder", "stars": "★★★★★", "score": 5 }
    ]
  },
  "023": {
    "name": "The Aurora Music Hare",
    "title": "The Astral Melodist",
    "series": "Series 3: The Celestial Clockwork Solstice",
    "subcollection": "Solstice Magic",
    "abilities": "Turns the antique hand-crank of an open walnut music box, striking steel tines to project spiraling aurora ribbons of light and sound.",
    "motto": "Spin wonder from simple stillness, and fill the quiet dark with song.",
    "nfcMotif": "A revolving music-cylinder icon with musical note pips.",
    "printFinish": "Velvety flocked finish on the hare’s body with raised clear spot UV on the music cylinder and aurora trails.",
    "is_landscape": true,
    "aspect_ratio": "16/9",
    "indicators": [
      { "name": "Melody", "stars": "★★★★★", "score": 5 },
      { "name": "Mystic Power", "stars": "★★★★★", "score": 5 },
      { "name": "Whimsy", "stars": "★★★★★", "score": 5 }
    ]
  },
  "024": {
    "name": "The Sunstone Locomotive",
    "title": "The Midwinter Express",
    "series": "Series 3: The Celestial Clockwork Solstice",
    "subcollection": "Solstice Magic",
    "abilities": "Faceted raw golden sunstone boiler lamp casting piercing warm rays forward across frosted tracks toward the returning dawn.",
    "motto": "Full steam toward the returning light; every winding track leads home.",
    "nfcMotif": "The glowing sunstone headlamp encircled by radar radio waves.",
    "printFinish": "Dark emerald soft-touch base with high-gloss lacquer on the enamel panels and gold foil on the brass boiler fittings.",
    "is_landscape": true,
    "aspect_ratio": "16/9",
    "indicators": [
      { "name": "Momentum", "stars": "★★★★★", "score": 5 },
      { "name": "Solstice Lumens", "stars": "★★★★★", "score": 5 },
      { "name": "Hearth Warmth", "stars": "★★★★★", "score": 5 }
    ]
  }
};

// Merge into holiday_series_official.json
Object.assign(official, series3Data);
fs.writeFileSync(officialPath, JSON.stringify(official, null, 2), 'utf8');
console.log('✅ Updated data/holiday_series_official.json with Series 3 (017–024)');

// Update data/greetings_master.json
const masterPath = path.join(__dirname, '../data/greetings_master.json');
let master = JSON.parse(fs.readFileSync(masterPath, 'utf8'));

// Filter out any existing 017-024 to allow idempotent updates
master.cards = master.cards.filter(c => !series3Data[c.card_code]);

// Append 017-024 to master.cards
for (let i = 17; i <= 24; i++) {
  const code = String(i).padStart(3, '0');
  const s = series3Data[code];
  const isLand = s.is_landscape;

  const cardObj = {
    card_id: `solstice-${code}`,
    series_id: "solstice-series-3",
    card_number: i,
    card_code: code,
    slug: code,
    aliases_slugs: [
      s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      s.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    ],
    event_greeting: "Solstice Magic!",
    web_address: `https://tapgreetings.com/${code}/`,
    character: {
      name: s.name,
      title: s.title,
      profile_theme: "Nordic Birch, Starlight Gold & Clockwork Brass",
      motto: s.motto,
      micro_lore: s.abilities,
      signature_motif: s.nfcMotif,
      rarity_tier: "Series 3 Celestial Edition",
      indicators: {
        cheer: s.indicators[0].stars,
        warmth: s.indicators[1].stars,
        wonder: s.indicators[2].stars
      },
      officialIndicators: s.indicators,
      is_landscape: isLand
    },
    seo: {
      primary_occasion: "Winter Solstice & Holiday",
      keywords: [
        s.name.toLowerCase(),
        "solstice magic",
        "clockwork solstice",
        "nfc holiday card",
        "smart card",
        "astronomical keepsake",
        "series 3"
      ],
      seo_title: `${s.name} (${s.title}) | Solstice Magic NFC Keepsake Card`,
      seo_meta_desc: `Experience ${s.name}, handcrafted in pale birch, starlight gold & clockwork brass. Tap smartphone to unlock 1080p animation and sound.`
    },
    media: {
      aspect_ratio: isLand ? "16:9" : "CR80 (53.98:85.60)",
      is_landscape: isLand,
      video_url: `https://tapgreetings.com/assets/video/${code}-video.mp4`,
      local_video_path: `/assets/video/${code}-video.mp4`,
      video_duration_seconds: 8,
      front_image_url: `https://tapgreetings.com/assets/img/cr80/${code}-front.jpg?v=cr80`,
      local_front_image_path: `/assets/img/cr80/${code}-front.jpg?v=cr80`,
      back_image_url: `https://tapgreetings.com/assets/img/cr80/${code}-back.jpg?v=cr80`,
      local_back_image_path: `/assets/img/cr80/${code}-back.jpg?v=cr80`
    },
    style_tokens: {
      theme_name: "Celestial Clockwork Solstice",
      colors: {
        bg_obsidian_midnight: "#0A1128",
        bg_frosted_ice_blue: "#E6DACB",
        accent_blush_pink: "#F59E0B",
        accent_champagne_gold: "#FBBF24",
        border_rose_gold: "#CD7F32",
        text_charcoal: "#0E1626",
        text_white: "#FFFFFF",
        neon_halo_glow: "#10B981"
      }
    },
    commerce: {
      price: 14.99,
      compare_at_price: 24.99,
      sku: `TG-S3-${code}`,
      inventory_qty: 100,
      card_format: "CR80 30mil Waterproof PVC",
      nfc_chip: "NTAG215 (504 Bytes Rewritable)"
    },
    subcollection: "Solstice Magic",
    subcollection_handle: "solstice-magic",
    series: "series-3",
    series_name: "Series 3: The Celestial Clockwork Solstice"
  };

  master.cards.push(cardObj);
}

fs.writeFileSync(masterPath, JSON.stringify(master, null, 2), 'utf8');
console.log(`✅ Updated data/greetings_master.json (Total cards now: ${master.cards.length})`);
