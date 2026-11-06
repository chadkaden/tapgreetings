const fs = require('fs');
const path = require('path');

const masterPath = path.join(__dirname, '../data/greetings_master.json');
const data = JSON.parse(fs.readFileSync(masterPath, 'utf8'));

// Tag series 1 cards explicitly
data.cards.forEach(c => {
  c.series = 'series-1';
  c.series_name = 'Happy Holidays Series 1';
});

const draftCards = [
  {
    card_id: "draft-01-delphine",
    card_code: "draft-01",
    series: "draft",
    series_name: "Draft Series (Winter Glamour)",
    character: {
      name: "Delphine",
      title: "The Ice Starlet",
      motto: "Shine under your own spotlight and make every entrance unforgettable.",
      micro_lore: "Stepping onto the frosted red carpet at dusk outside a luxury gala, Delphine sparkles under flashbulbs, spreading warm cheer and champagne wishes across the winter gala.",
      indicators: { glamour: "100/100", sparkle: "99/100", signature: "Champagne-Boba" }
    },
    event_greeting: "Happy Holidays!",
    category: "occasions",
    media: {
      aspect_ratio: "CR80 (53.98:85.60)",
      front_image_url: "/assets/img/cr80/draft-01-front.jpg?v=cr80",
      local_front_image_path: "/assets/img/cr80/draft-01-front.jpg?v=cr80",
      back_image_url: "/assets/img/cr80/draft-01-back.jpg?v=cr80",
      local_back_image_path: "/assets/img/cr80/draft-01-back.jpg?v=cr80",
      video_url: "/assets/video/draft-01-video.mp4",
      local_video_path: "/assets/video/draft-01-video.mp4"
    },
    seo: {
      keywords: ["delphine", "ice starlet", "draft series", "winter glamour", "champagne", "gala"]
    }
  },
  {
    card_id: "draft-02-thanksgiving",
    card_code: "draft-02",
    series: "draft",
    series_name: "Draft Series (Autumn Gratitude)",
    character: {
      name: "Autumn Gratitude",
      title: "The Hearth Gatherer",
      motto: "Warm mugs, grateful hearts, and golden leaves.",
      micro_lore: "Surrounded by crisp November foliage, she raises a warm seasonal brew in celebration of family, abundance, and heartfelt togetherness.",
      indicators: { warmth: "98/100", gratitude: "100/100", signature: "Spiced Cider" }
    },
    event_greeting: "Happy Thanksgiving!",
    category: "occasions",
    media: {
      aspect_ratio: "CR80 (53.98:85.60)",
      front_image_url: "/assets/img/cr80/draft-02-front.jpg?v=cr80",
      local_front_image_path: "/assets/img/cr80/draft-02-front.jpg?v=cr80",
      back_image_url: "/assets/img/cr80/draft-02-back.jpg?v=cr80",
      local_back_image_path: "/assets/img/cr80/draft-02-back.jpg?v=cr80",
      video_url: "/assets/video/draft-02-video.mp4",
      local_video_path: "/assets/video/draft-02-video.mp4"
    },
    seo: {
      keywords: ["autumn gratitude", "thanksgiving", "draft series", "hearth gatherer", "warm brew"]
    }
  },
  {
    card_id: "draft-03-aria",
    card_code: "draft-03",
    series: "draft",
    series_name: "Draft Series (Winter Lantern)",
    character: {
      name: "Aria",
      title: "The Village Lantern",
      motto: "May your path be bright and your winter filled with peace.",
      micro_lore: "Holding an ornate brass lantern in a snow-cloaked alpine village, Aria guides travelers home with a soft, steady amber glow.",
      indicators: { radiance: "99/100", serenity: "100/100", signature: "Amber Glow" }
    },
    event_greeting: "Warm Winter Wishes",
    category: "occasions",
    media: {
      aspect_ratio: "CR80 (53.98:85.60)",
      front_image_url: "/assets/img/cr80/draft-03-front.jpg?v=cr80",
      local_front_image_path: "/assets/img/cr80/draft-03-front.jpg?v=cr80",
      back_image_url: "/assets/img/cr80/draft-03-back.jpg?v=cr80",
      local_back_image_path: "/assets/img/cr80/draft-03-back.jpg?v=cr80",
      video_url: "/assets/video/draft-03-video.mp4",
      local_video_path: "/assets/video/draft-03-video.mp4"
    },
    seo: {
      keywords: ["aria", "village lantern", "draft series", "winter wishes", "snow village"]
    }
  },
  {
    card_id: "draft-04-cyber",
    card_code: "draft-04",
    series: "draft",
    series_name: "Draft Series (Cyber Starlet)",
    character: {
      name: "Cyber Starlet",
      title: "The Neon Shopper",
      motto: "Deals unlocked, style upgraded, future arriving now.",
      micro_lore: "Under shimmering neon holograms, she strides through the futuristic holiday shopping district with metallic totes and glowing deals.",
      indicators: { speed: "97/100", energy: "100/100", signature: "Holo-Tote" }
    },
    event_greeting: "Black Friday Spree!",
    category: "occasions",
    media: {
      aspect_ratio: "CR80 (53.98:85.60)",
      front_image_url: "/assets/img/cr80/draft-04-front.jpg?v=cr80",
      local_front_image_path: "/assets/img/cr80/draft-04-front.jpg?v=cr80",
      back_image_url: "/assets/img/cr80/draft-04-back.jpg?v=cr80",
      local_back_image_path: "/assets/img/cr80/draft-04-back.jpg?v=cr80",
      video_url: "/assets/video/draft-04-video.mp4",
      local_video_path: "/assets/video/draft-04-video.mp4"
    },
    seo: {
      keywords: ["cyber starlet", "black friday", "draft series", "neon shopper", "deals"]
    }
  },
  {
    card_id: "draft-05-midnight",
    card_code: "draft-05",
    series: "draft",
    series_name: "Draft Series (Midnight Toast)",
    character: {
      name: "Midnight Toast",
      title: "The New Year Sovereign",
      motto: "To fresh starts, bold dreams, and unforgettable nights.",
      micro_lore: "As the clock strikes midnight and golden fireworks cascade across the skyline, she raises a crystal flute to toast the promise of 2026.",
      indicators: { celebration: "100/100", elegance: "98/100", signature: "Midnight Flute" }
    },
    event_greeting: "Happy New Year 2026!",
    category: "occasions",
    media: {
      aspect_ratio: "CR80 (53.98:85.60)",
      front_image_url: "/assets/img/cr80/draft-05-front.jpg?v=cr80",
      local_front_image_path: "/assets/img/cr80/draft-05-front.jpg?v=cr80",
      back_image_url: "/assets/img/cr80/draft-05-back.jpg?v=cr80",
      local_back_image_path: "/assets/img/cr80/draft-05-back.jpg?v=cr80",
      video_url: "/assets/video/draft-05-video.mp4",
      local_video_path: "/assets/video/draft-05-video.mp4"
    },
    seo: {
      keywords: ["midnight toast", "new year 2026", "draft series", "fireworks", "celebration"]
    }
  }
];

data.draft_cards = draftCards;

fs.writeFileSync(masterPath, JSON.stringify(data, null, 2), 'utf8');
console.log(`Merged 5 Draft Series cards into greetings_master.json! Total cards: ${data.cards.length} Series 1 + ${data.draft_cards.length} Draft Series.`);
