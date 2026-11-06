const fs = require('fs');
const path = require('path');

const masterData = {
  series_metadata: {
    series_id: "winter-glamour-2026",
    series_name: "TapGreetings Series 1: Winter Glamour & All Occasions",
    total_cards: 12,
    tagline: "Smart NFC Keepsake Greeting Cards That Come Alive with a Single Tap",
    publisher: "TapGreetings by TapThingy",
    website: "https://tapgreetings.com",
    shop_url: "https://shop.tapthingy.com/collections/tapgreetings",
    custom_designer_url: "https://shop.tapthingy.com/products/tap-thingy-nfc-custom-pvc-card",
    tools_url: "https://shop.tapthingy.com/pages/tap-thingy-tools-nfc-reprogram-webtool-and-guide",
    contact_email: "support@tapthingy.com",
    version: "2.0.0"
  },
  cards: [
    // CARD 01: Delphine - Winter Gala (PIONEER RECORD)
    {
      card_id: "holidays-delphine-01",
      series_id: "winter-glamour-2026",
      card_number: 1,
      slug: "delphine-holidays",
      aliases_slugs: ["01", "holidays"],
      event_greeting: "Happy Holidays!",
      web_address: "https://TapGreetings.com/holidays",
      character: {
        name: "Delphine",
        title: "The Ice Starlet",
        aliases: ["Delphine", "The Glacial Siren", "Gala Hostess"],
        profile_theme: "The High-Fashion Starlet",
        motto: "Shine under your own spotlight and make every entrance unforgettable.",
        micro_lore: "Stepping onto the frosted red carpet at dusk, Delphine sparkles under flashbulbs, spreading warm cheer and champagne wishes across the winter gala. Her signature champagne-boba in hand, she invites guests into an evening of high-fashion holiday enchantment.",
        indicators: {
          glamour: "100/100",
          sparkle: "99/100",
          signature: "Champagne-Boba"
        },
        rarity_tier: "Spectrum Common"
      },
      prompts: {
        prompt_front_artwork: "High-fashion glamour portrait of Delphine, The Ice Starlet, standing elegantly on a frosted velvet red carpet at dusk outside a snow-dusted luxury palace gala. Holding a crystal stemmed glass filled with sparkling champagne-boba pearls with a rose gold bow. Wearing an haute couture crystalline ice-blue and obsidian silk evening gown embroidered with micro-sequins and 4-point gold starburst filigree. Warm paparazzi camera flashbulbs glowing in background, cinematic depth of field, 8k resolution, photorealistic, elegant rim lighting.",
        prompt_back_design: "Collector trading card back layout, deep obsidian midnight background #0A0E1A, sharp rectangular rose gold border #B76E79 with 1.5pt vector stroke. Four-point gold starburst filigrees in each corner. Central shimmering gold star target with ⟡ TAP HERE ⟡ NFC symbol. Elegant typography in Playfair Display and Montserrat.",
        prompt_motion_video: "9:16 vertical video. Slow push-in on Delphine on the winter gala red carpet at night. Flashbulbs popping in soft bokeh. She gently tilts her crystal champagne-boba flute toward camera, winks with sparkling ice-blue eyeshadow, and smiles warmly as snow crystals drift gently through golden light. High frame rate, cinematic lighting, luxury party atmosphere.",
        prompt_voice_dialogue: "Vocal style: Playful, elegant, warm transatlantic starlet tone. 'Champagne in hand, glitz on full display! Delphine here to invite you to the most glamorous party of the season—Happy Holidays!'",
        prompt_negative: "blurry, low resolution, cartoon, distorted fingers, extra limbs, bad anatomy, muddy colors, oversaturated neon, flat lighting"
      },
      descriptions: {
        shopify_short_desc: "• High-Definition 9:16 Motion Tap-to-Video\\n• Embedded NTAG215 Rewritable NFC Microchip\\n• Premium CR80 30mil Waterproof PVC with Gold Filigree\\n• Interactive Speech Dialogue & RSVP Utility",
        shopify_full_html: `<div class="tg-product-desc"><h3>❄️ Happy Holidays from Delphine, The Ice Starlet</h3><p>Step onto the frosted red carpet with this collector-grade smart NFC greeting card. Tap with any iPhone or Android smartphone to unlock Delphine's exclusive 4K holiday video, champagne toast, and interactive gala RSVP.</p><ul><li><strong>Card Format:</strong> CR80 30mil Waterproof PVC with rose-gold metallic border.</li><li><strong>Embedded NFC:</strong> High-speed NTAG215 microchip programmed for instant tap playback.</li><li><strong>Dual Experience:</strong> Physical collectible card + dynamic digital media layer.</li></ul></div>`,
        social_share_caption: "Delphine invites you to the Winter Gala! ❄️ Tap to experience this smart NFC holiday greeting card: https://TapGreetings.com/delphine-holidays"
      },
      seo: {
        primary_occasion: "Holiday",
        keywords: ["winter gala", "holiday greeting card", "nfc card", "delphine", "ice starlet", "champagne", "high fashion", "christmas", "smart card", "tapthingy"],
        seo_title: "Delphine - The Ice Starlet | Winter Gala NFC Video Greeting Card",
        seo_meta_desc: "Step onto the frosted red carpet with Delphine. Tap this smart NFC keepsake card to experience an exclusive 4K holiday video, audio toast, and winter gala RSVP."
      },
      media: {
        aspect_ratio: "9:16",
        video_url: "https://TapGreetings.com/assets/video/delphine-holidays.mp4",
        local_video_path: "/assets/video/delphine-holidays.mp4",
        video_duration_seconds: 10,
        audio_dialogue: "Champagne in hand, glitz on full display! Delphine here to invite you to the most glamorous party of the season—Happy Holidays!",
        front_image_url: "https://TapGreetings.com/assets/img/delphine-front.png",
        local_front_image_path: "/assets/img/delphine-front.jpg",
        back_image_url: "https://TapGreetings.com/assets/img/delphine-back.png",
        local_back_image_path: "/assets/img/delphine-back.jpg"
      },
      style_tokens: {
        theme_name: "Magical Midnight Glacial Glamour",
        colors: {
          bg_obsidian_midnight: "#0A0E1A",
          bg_frosted_ice_blue: "#E0F7FA",
          accent_blush_pink: "#FFD1DC",
          accent_champagne_gold: "#F4E0A5",
          border_rose_gold: "#B76E79",
          text_charcoal: "#2B2B2B",
          text_white: "#FFFFFF",
          neon_halo_glow: "#FF69B4"
        },
        typography: {
          greeting_bubble_font: "'Cooper Black', 'Recraft', 'Arial Black', display",
          card_title_font: "'Playfair Display', 'Cormorant Garamond', serif",
          header_sans_font: "'Montserrat', sans-serif",
          body_lore_font: "'Poppins', 'Inter', sans-serif"
        },
        borders: {
          vector_stroke_width: "1.5pt",
          corner_style: "sharp_rectangular",
          filigree_accents: "4_point_gold_starbursts"
        }
      },
      nfc_config: {
        target_shape: "star",
        tap_label: "⟡ TAP HERE ⟡",
        instruction: "Tap with NFC enabled phone or device",
        hidden_items_count: {
          rose_gold_bows: 10,
          boba_pearls: 15
        }
      },
      utility_action: {
        action_type: "GALA_INVITATION_RSVP",
        button_text: "RSVP to Winter Gala",
        target_url: "https://TapGreetings.com/events/winter-gala-2026"
      },
      commerce: {
        price: 29.99,
        compare_at_price: 39.99,
        sku: "TG-CARD-delphine-holidays",
        inventory_qty: 100,
        card_format: "CR80 30mil Waterproof PVC",
        nfc_chip: "NTAG215 (504 Bytes Rewritable)"
      }
    },

    // CARD 02: Noelle - Black Friday Shopping Spree
    {
      card_id: "shopping-noelle-02",
      series_id: "winter-glamour-2026",
      card_number: 2,
      slug: "02",
      aliases_slugs: ["black-friday-spree", "black-friday"],
      event_greeting: "VIP Deals & Holiday Joy!",
      web_address: "https://TapGreetings.com/02",
      character: {
        name: "Noelle",
        title: "The Midnight Shopper",
        aliases: ["Noelle", "The Retail Maven", "The Door-Buster Queen"],
        profile_theme: "The Chic Trendsetter",
        motto: "Life is short—buy the bag, unlock the deal, and celebrate in style.",
        micro_lore: "Dressed in an electric magenta coat amidst neon city storefronts, Noelle holds designer metallic shopping totes. With a sly wink, she taps into an exclusive holiday haul, granting her friends VIP early-bird access to seasonal treasures.",
        indicators: {
          style: "100/100",
          savings: "98/100",
          signature: "Gold-Stitched Tote"
        },
        rarity_tier: "Holiday Premier"
      },
      prompts: {
        prompt_front_artwork: "Fashion editorial portrait of Noelle, stylish girl in glossy magenta winter trench coat and black velvet beret holding metallic gold and rose-gold shopping gift bags on a bustling neon-lit luxury shopping street at midnight. Holiday lights and glowing storefronts reflecting on wet cobblestones, bokeh sparkles, vibrant modern aesthetic, 8k resolution.",
        prompt_back_design: "Sleek retail VIP pass layout, obsidian black background #0A0E1A, sharp rectangular hot pink border #D946EF with 1.5pt vector stroke. Shopping bag ribbon filigrees in corners. Central barcode and star NFC target with ⟡ TAP HERE ⟡ symbol.",
        prompt_motion_video: "9:16 vertical video. Dynamic fashion walk through luxury storefronts at night. Noelle twirls holding ribbon-tied shopping totes, smiles at camera, and reveals a gold VIP card with a wink. Confetti and neon light flares float across the screen.",
        prompt_voice_dialogue: "Vocal style: Upbeat, energetic, confident best-friend vibe. 'Ready to unlock the best deals of the year? Noelle's got the VIP list—tap in and let's shop!'",
        prompt_negative: "cluttered, ugly bags, disfigured hands, cartoon, lowres, dull lighting"
      },
      descriptions: {
        shopify_short_desc: "• Instant Black Friday & Holiday Shopping Pass\\n• Tap-to-Video 9:16 Motion Reel\\n• Embedded NTAG215 NFC Microchip\\n• Exclusive VIP Gift Unlock Utility",
        shopify_full_html: `<div class="tg-product-desc"><h3>🛍️ Noelle's Black Friday VIP Spree</h3><p>Give the gift of celebration and retail excitement with Noelle's smart NFC shopping pass. Tap to unlock exclusive holiday discounts, custom gift lists, and interactive motion greetings.</p></div>`,
        social_share_caption: "Ready for the holiday shopping spree? Tap Noelle's NFC card to unlock VIP holiday deals: https://TapGreetings.com/02"
      },
      seo: {
        primary_occasion: "Black Friday",
        keywords: ["black friday", "holiday shopping", "vip deals", "noelle", "nfc gift card", "luxury shopping", "smart card"],
        seo_title: "Noelle - Black Friday VIP Spree | NFC Smart Greeting Card",
        seo_meta_desc: "Unlock VIP holiday door-busters with Noelle. Tap this smart NFC card for instant shopping motion reels, exclusive deals, and digital gift unlock."
      },
      media: {
        aspect_ratio: "9:16",
        video_url: "https://TapGreetings.com/assets/video/02_black_friday.mp4",
        local_video_path: "/assets/video/delphine-holidays.mp4",
        video_duration_seconds: 10,
        audio_dialogue: "Ready to unlock the best deals of the year? Noelle's got the VIP list—tap in and let's shop!",
        front_image_url: "https://TapGreetings.com/public/cards/02_front.jpg",
        local_front_image_path: "/public/cards/02_front.jpg",
        back_image_url: "https://TapGreetings.com/public/cards/02_back.jpg",
        local_back_image_path: "/public/cards/02_back.jpg"
      },
      style_tokens: {
        theme_name: "Midnight Retail Glitz",
        colors: {
          bg_obsidian_midnight: "#0A0E1A",
          bg_frosted_ice_blue: "#FCE7F3",
          accent_blush_pink: "#F472B6",
          accent_champagne_gold: "#FDE047",
          border_rose_gold: "#D946EF",
          text_charcoal: "#1F2937",
          text_white: "#FFFFFF",
          neon_halo_glow: "#E879F9"
        },
        typography: {
          greeting_bubble_font: "'Cooper Black', 'Arial Black', display",
          card_title_font: "'Playfair Display', serif",
          header_sans_font: "'Montserrat', sans-serif",
          body_lore_font: "'Poppins', sans-serif"
        },
        borders: {
          vector_stroke_width: "1.5pt",
          corner_style: "sharp_rectangular",
          filigree_accents: "ribbon_bows"
        }
      },
      nfc_config: {
        target_shape: "star",
        tap_label: "⟡ TAP FOR DEALS ⟡",
        instruction: "Tap with NFC phone to unlock VIP deals",
        hidden_items_count: {
          shopping_bags: 12,
          gift_tags: 8
        }
      },
      utility_action: {
        action_type: "CLAIM_VIP_DEAL",
        button_text: "Unlock VIP Holiday Deals",
        target_url: "https://shop.tapthingy.com/collections/all"
      },
      commerce: {
        price: 29.99,
        compare_at_price: 39.99,
        sku: "TG-CARD-02",
        inventory_qty: 100,
        card_format: "CR80 30mil Waterproof PVC",
        nfc_chip: "NTAG215 (504 Bytes Rewritable)"
      }
    },

    // CARD 03: Aria - Warm Winter Wishes & Starlight
    {
      card_id: "winter-aria-lantern-03",
      series_id: "winter-glamour-2026",
      card_number: 3,
      slug: "03",
      aliases_slugs: ["warm-winter-wishes", "aria-lantern"],
      event_greeting: "Warm Winter Wishes!",
      web_address: "https://TapGreetings.com/03",
      character: {
        name: "Aria, The Lantern Maiden",
        title: "Warm Winter Wishes & Starlight",
        aliases: ["Aria", "The Lantern Maiden", "Winter Guide"],
        profile_theme: "The Guiding Light",
        motto: "May warmth and gentle light guide your winter nights.",
        micro_lore: "Holding a glowing amber lantern as fresh snow blankets a peaceful mountain village, Aria brings comforting holiday cheer and warm winter wishes across the distance.",
        indicators: {
          warmth: "100/100",
          wonder: "99/100",
          signature: "Amber Lantern"
        },
        rarity_tier: "Holiday Premier"
      },
      prompts: {
        prompt_front_artwork: "Girl in cozy winter ballgown and wool cape holding a glowing warm lantern in a snow-covered village at twilight, falling snow flurries, ambient golden lantern glow, 8k resolution, 9:16 portrait",
        prompt_back_design: "Collector trading card back layout, deep sapphire snow background, warm golden vector border, starburst filigree corners and central star NFC tap target.",
        prompt_motion_video: "9:16 vertical video. Gentle snowfall in alpine village at dusk. The girl lifts her glowing lantern toward camera, smiling warmly as snowflakes dance in golden light.",
        prompt_voice_dialogue: "Vocal style: Gentle, warm, comforting winter tone. 'May your winter days be warm, peaceful, and filled with the brightest light. Sending you warm winter wishes!'",
        prompt_negative: "blurry, dark, low resolution, deformed fingers, cartoon"
      },
      descriptions: {
        shopify_short_desc: "• 9:16 Motion Video Tap Card\\n• 1080p Snowfall & Lantern Ambient Audio\\n• Embedded NTAG215 Rewritable NFC Chip\\n• Collector CR80 PVC Keepsake Format",
        shopify_full_html: `<div class="tg-product-desc"><h3>❄️ Aria, The Lantern Maiden - Warm Winter Wishes</h3><p>Send a comforting beacon of warmth. Tap with any smartphone for an enchanting winter village snowfall video and heartfelt voice message.</p></div>`,
        social_share_caption: "Sending warm winter wishes your way! ❄️🏮 Tap to experience Aria's smart NFC card: https://TapGreetings.com/03"
      },
      seo: {
        primary_occasion: "Holiday",
        keywords: ["warm winter wishes", "snow lantern", "winter village", "nfc holiday card", "smart card", "cozy winter", "aria"],
        seo_title: "Aria, The Lantern Maiden | Warm Winter Wishes NFC Video Card",
        seo_meta_desc: "Send warmth this winter with Aria's smart NFC greeting card. Features 1080p snowfall motion video, glowing lantern audio toast, and rewritable NTAG215 chip."
      },
      media: {
        aspect_ratio: "9:16",
        video_url: "https://TapGreetings.com/assets/video/03-lantern-snow.mp4",
        local_video_path: "/assets/video/03-lantern-snow.mp4",
        video_duration_seconds: 12,
        audio_dialogue: "May your winter days be warm, peaceful, and filled with the brightest light. Sending you warm winter wishes!",
        front_image_url: "https://TapGreetings.com/assets/img/03-front.jpg",
        local_front_image_path: "/assets/img/03-front.jpg",
        back_image_url: "https://TapGreetings.com/assets/img/03-back.jpg",
        local_back_image_path: "/assets/img/03-back.jpg"
      },
      style_tokens: {
        theme_name: "Alpine Hearth Glow",
        colors: {
          bg_obsidian_midnight: "#0F172A",
          bg_frosted_ice_blue: "#FEF3C7",
          accent_blush_pink: "#FBBF24",
          accent_champagne_gold: "#D97706",
          border_rose_gold: "#B45309",
          text_charcoal: "#1E293B",
          text_white: "#FFFFFF",
          neon_halo_glow: "#F59E0B"
        },
        typography: {
          greeting_bubble_font: "'Cooper Black', serif",
          card_title_font: "'Playfair Display', serif",
          header_sans_font: "'Montserrat', sans-serif",
          body_lore_font: "'Poppins', sans-serif"
        },
        borders: {
          vector_stroke_width: "1.5pt",
          corner_style: "sharp_rectangular",
          filigree_accents: "pinecone_holly"
        }
      },
      nfc_config: {
        target_shape: "star",
        tap_label: "⟡ TAP FOR WARMTH ⟡",
        instruction: "Tap with NFC phone for fireside video",
        hidden_items_count: {
          marshmallows: 10,
          pinecones: 8
        }
      },
      utility_action: {
        action_type: "PLAY_HOLIDAY_TUNE",
        button_text: "Listen to Fireside Melody",
        target_url: "https://TapGreetings.com/03"
      },
      commerce: {
        price: 29.99,
        compare_at_price: 39.99,
        sku: "TG-CARD-03",
        inventory_qty: 100,
        card_format: "CR80 30mil Waterproof PVC",
        nfc_chip: "NTAG215 (504 Bytes Rewritable)"
      }
    },

    // CARD 04: Midnight Fireworks & New Horizons 2026 (HORIZONTAL LANDSCAPE)
    {
      card_id: "newyear-fireworks-04",
      series_id: "winter-glamour-2026",
      card_number: 4,
      slug: "04",
      aliases_slugs: ["new-year-2026", "midnight-fireworks"],
      event_greeting: "Happy New Year 2026!",
      web_address: "https://TapGreetings.com/04",
      character: {
        name: "The Midnight Horizon",
        title: "Spectacular Midnight Fireworks",
        aliases: ["New Horizons", "Midnight Countdown"],
        profile_theme: "The Grand Celebration",
        motto: "Turn the page, ignite your spark, and welcome 365 brand new possibilities.",
        micro_lore: "As the clock strikes midnight, vibrant cascades of gold and cyan pyrotechnics light up the harbor skyline. Crystal flutes ring out in celebration of fresh beginnings, bold dreams, and triumph in 2026.",
        indicators: {
          energy: "100/100",
          anticipation: "100/100",
          signature: "Gold Pyrotechnic Rain"
        },
        rarity_tier: "Limited Edition"
      },
      prompts: {
        prompt_front_artwork: "Widescreen 16:9 landscape view of a breathtaking midnight fireworks display over a grand metropolis harbor at New Year 2026. Towering golden willow pyrotechnics and electric cyan bursts illuminating water reflections and cheering rooftop crowds in evening wear. 8k photorealistic, volumetric smoke, glittering reflection ripples.",
        prompt_back_design: "Landscape layout with deep obsidian midnight background #050814, electric cyan border #06B6D4 with 1.5pt vector stroke. 4-point starburst accents and golden countdown dial in center for NFC tap target.",
        prompt_motion_video: "16:9 widescreen motion video. Epic synchronized fireworks erupting in night sky at midnight with spatial celebration audio. Camera tilts up from gleaming skyscraper skyline into a kaleidoscope of gold and cyan sparks.",
        prompt_voice_dialogue: "Vocal style: Euphoric, celebratory crowd countdown. 'Ten, nine... Happy New Year 2026! May this year bring your biggest breakthroughs and happiest memories!'",
        prompt_negative: "daylight, rain, dull colors, smoke obstruction, cartoon"
      },
      descriptions: {
        shopify_short_desc: "• 16:9 Widescreen New Year Countdown Tap Card\\n• Spectacular 4K Midnight Fireworks Motion Video\\n• Embedded NTAG215 Rewritable NFC Chip\\n• Digital Countdown & Celebration Wall",
        shopify_full_html: `<div class="tg-product-desc"><h3>🎆 Midnight Fireworks 2026 (Horizontal Edition)</h3><p>Rings in 2026 with uninhibited grandeur. Tap to unleash high-definition fireworks, spatial celebration audio, and an interactive digital resolution tracker.</p></div>`,
        social_share_caption: "Cheers to 2026! 🥂🎆 Tap this smart NFC card to ring in the New Year with fireworks: https://TapGreetings.com/04"
      },
      seo: {
        primary_occasion: "New Year",
        keywords: ["new year 2026", "new year greeting card", "midnight fireworks", "nfc smart card", "celebration card", "horizontal card"],
        seo_title: "Midnight Fireworks & New Horizons 2026 | NFC Video Greeting Card",
        seo_meta_desc: "Welcome 2026 with brilliant fireworks! Tap this smart NFC card for instant midnight pyrotechnic motion video, celebration audio, and digital resolution wall."
      },
      media: {
        aspect_ratio: "16:9",
        video_url: "https://TapGreetings.com/assets/video/04_new_year.mp4",
        local_video_path: "/assets/video/delphine-holidays.mp4",
        video_duration_seconds: 12,
        audio_dialogue: "Three, two, one... Happy New Year 2026! May this year bring your biggest breakthroughs and happiest memories!",
        front_image_url: "https://TapGreetings.com/public/cards/04_front.svg",
        local_front_image_path: "/public/cards/04_front.svg",
        back_image_url: "https://TapGreetings.com/public/cards/04_back.svg",
        local_back_image_path: "/public/cards/04_back.svg"
      },
      style_tokens: {
        theme_name: "Midnight Pyrotechnic Sparkle",
        colors: {
          bg_obsidian_midnight: "#050814",
          bg_frosted_ice_blue: "#E0F2FE",
          accent_blush_pink: "#38BDF8",
          accent_champagne_gold: "#FDE047",
          border_rose_gold: "#0284C7",
          text_charcoal: "#0F172A",
          text_white: "#FFFFFF",
          neon_halo_glow: "#00E5FF"
        },
        typography: {
          greeting_bubble_font: "'Arial Black', sans-serif",
          card_title_font: "'Playfair Display', serif",
          header_sans_font: "'Montserrat', sans-serif",
          body_lore_font: "'Poppins', sans-serif"
        },
        borders: {
          vector_stroke_width: "1.5pt",
          corner_style: "sharp_rectangular",
          filigree_accents: "pyrotechnic_starbursts"
        }
      },
      nfc_config: {
        target_shape: "star",
        tap_label: "⟡ TAP FOR 2026 ⟡",
        instruction: "Tap with NFC phone for countdown celebration",
        hidden_items_count: {
          golden_flutes: 8,
          starburst_rockets: 16
        }
      },
      utility_action: {
        action_type: "COUNTDOWN_2026",
        button_text: "Join 2026 Celebration Wall",
        target_url: "https://TapGreetings.com/04"
      },
      commerce: {
        price: 29.99,
        compare_at_price: 39.99,
        sku: "TG-CARD-04",
        inventory_qty: 100,
        card_format: "CR80 30mil Waterproof PVC",
        nfc_chip: "NTAG215 (504 Bytes Rewritable)"
      }
    },

    // CARDS 05-12 (Birthday, Anniversary, Thank You, Champion, Thinking of You, Baby, Wedding, Custom)
    {
      card_id: "birthday-glow-05",
      series_id: "winter-glamour-2026",
      card_number: 5,
      slug: "05",
      aliases_slugs: ["birthday-glow", "neon-birthday"],
      event_greeting: "Happy Birthday!",
      web_address: "https://TapGreetings.com/05",
      character: {
        name: "The Birthday Luminary",
        title: "Neon Glow Celebration",
        aliases: ["Glow Bash", "Party Starter"],
        profile_theme: "The Life of the Party",
        motto: "Make a wish, blow out the candles, and let your light fill the room.",
        micro_lore: "Under vibrant iridescent party spotlights, glowing confetti rains down as candles flicker atop a multi-tiered cake. Today celebrates another fantastic trip around the sun.",
        indicators: { joy: "100/100", fun: "100/100", signature: "Sparkler Candle" },
        rarity_tier: "Spectrum Common"
      },
      prompts: {
        prompt_front_artwork: "Vibrant neon birthday party scene, glowing multi-tiered pastel birthday cake with sparkling sparklers emitting gold glitter trails, confetti floating in air, upbeat modern luxury party aesthetic, 8k resolution.",
        prompt_back_design: "Neon party pass card back, deep violet background, hot pink and cyan vector border with balloon and candle filigrees.",
        prompt_motion_video: "9:16 vertical motion video of blowing out glowing candles with slow-motion confetti explosion and cheerful ambient party music.",
        prompt_voice_dialogue: "Vocal style: Upbeat, joyful cheer. 'Happy Birthday! Blow out the candles and make your biggest wish yet!'",
        prompt_negative: "dark, sad, dull colors, low quality"
      },
      descriptions: {
        shopify_short_desc: "• Interactive Birthday Tap-to-Video\\n• Embedded Rewritable NFC Microchip\\n• Dynamic Candle Blow-Out Easter Egg\\n• Premium CR80 Keepsake Card",
        shopify_full_html: `<div class="tg-product-desc"><h3>🎂 Neon Birthday Glow Smart Card</h3><p>Give the ultimate birthday card that never gets thrown away. Tap with any phone to blow out the candles and watch a vibrant celebration unfold.</p></div>`,
        social_share_caption: "Wishing you the happiest birthday! 🎂✨ Tap this smart NFC card to celebrate: https://TapGreetings.com/05"
      },
      seo: {
        primary_occasion: "Birthday",
        keywords: ["birthday card", "smart birthday card", "nfc greeting card", "birthday celebration", "party keepsakes"],
        seo_title: "Neon Birthday Glow Bash | NFC Video Birthday Card",
        seo_meta_desc: "Make their birthday unforgettable. Tap this smart NFC card for interactive candle blow-out video, glowing confetti, and festive sound."
      },
      media: {
        aspect_ratio: "9:16",
        video_url: "https://TapGreetings.com/assets/video/05_birthday.mp4",
        local_video_path: "/assets/video/delphine-holidays.mp4",
        video_duration_seconds: 10,
        audio_dialogue: "Happy Birthday! Blow out the candles and make your biggest wish yet!",
        front_image_url: "https://TapGreetings.com/public/cards/05_front.svg",
        local_front_image_path: "/public/cards/05_front.svg",
        back_image_url: "https://TapGreetings.com/public/cards/05_back.svg",
        local_back_image_path: "/public/cards/05_back.svg"
      },
      style_tokens: {
        theme_name: "Neon Glow Festivity",
        colors: {
          bg_obsidian_midnight: "#13091B",
          bg_frosted_ice_blue: "#FDF4FF",
          accent_blush_pink: "#F472B6",
          accent_champagne_gold: "#FDE047",
          border_rose_gold: "#C026D3",
          text_charcoal: "#1E1B4B",
          text_white: "#FFFFFF",
          neon_halo_glow: "#E879F9"
        },
        typography: {
          greeting_bubble_font: "'Arial Black', sans-serif",
          card_title_font: "'Playfair Display', serif",
          header_sans_font: "'Montserrat', sans-serif",
          body_lore_font: "'Poppins', sans-serif"
        },
        borders: {
          vector_stroke_width: "1.5pt",
          corner_style: "sharp_rectangular",
          filigree_accents: "balloons_candles"
        }
      },
      nfc_config: { target_shape: "star", tap_label: "⟡ BLOW OUT CANDLES ⟡", instruction: "Tap with NFC phone to make a wish", hidden_items_count: { candles: 10, balloons: 12 } },
      utility_action: { action_type: "PARTY_PLAYLIST", button_text: "Play Birthday Song", target_url: "https://TapGreetings.com/05" },
      commerce: { price: 29.99, compare_at_price: 39.99, sku: "TG-CARD-05", inventory_qty: 100, card_format: "CR80 30mil Waterproof PVC", nfc_chip: "NTAG215 (504 Bytes Rewritable)" }
    },

    // CARD 06: Anniversary
    {
      card_id: "anniversary-gold-06",
      series_id: "winter-glamour-2026",
      card_number: 6,
      slug: "06",
      aliases_slugs: ["anniversary-love", "golden-romance"],
      event_greeting: "Happy Anniversary!",
      web_address: "https://TapGreetings.com/06",
      character: {
        name: "The Eternal Flame",
        title: "Golden Hour Romance",
        aliases: ["Timeless Love", "Golden Hour"],
        profile_theme: "The Romantic Keepsake",
        motto: "Grow old along with me; the best is yet to be.",
        micro_lore: "A golden sunset bathes rolling vineyards and rose gardens in tender light. Two hands intertwine as champagne flutes clink, marking another year of unconditional devotion.",
        indicators: { devotion: "100/100", romance: "100/100", signature: "Rose-Gold Vow" },
        rarity_tier: "Golden Rare"
      },
      prompts: {
        prompt_front_artwork: "Romantic golden hour scene with interlocking wedding rings, soft blush garden roses, champagne flutes, warm golden sunset rays, cinematic luxury romance aesthetic, 8k photorealistic.",
        prompt_back_design: "Elegant love letter stationery card back, champagne gold filigree borders, interlocking ring target for NFC tap.",
        prompt_motion_video: "9:16 vertical motion video of golden sunlight shimmering through champagne flutes with soft piano melody and drifting rose petals.",
        prompt_voice_dialogue: "Vocal style: Tender, heartfelt romantic tone. 'To another year of laughter, devotion, and our greatest adventure together. Happy Anniversary my love.'",
        prompt_negative: "harsh shadows, cartoon, sad, cold lighting"
      },
      descriptions: {
        shopify_short_desc: "• Romantic Video Tap-to-Memory Card\\n• Embedded Rewritable NFC Microchip\\n• Golden Hour Aesthetic with Rose Gold Edges\\n• Lifetime Keepsake for Couples",
        shopify_full_html: `<div class="tg-product-desc"><h3>💍 Golden Romance Anniversary Keepsake</h3><p>Honor your love story with a permanent physical card that plays your favorite video memory with a single tap.</p></div>`,
        social_share_caption: "Celebrating another year of true love! 🥂🌹 Tap this smart NFC card: https://TapGreetings.com/06"
      },
      seo: {
        primary_occasion: "Anniversary",
        keywords: ["anniversary card", "couples gift", "romantic greeting card", "nfc love card", "smart keepsake"],
        seo_title: "Golden Hour Romance Anniversary Card | NFC Smart Keepsake",
        seo_meta_desc: "Celebrate your love story with the Golden Hour Romance smart NFC anniversary card. Tap to unlock cherished couple video memories and romantic piano audio."
      },
      media: {
        aspect_ratio: "9:16",
        video_url: "https://TapGreetings.com/assets/video/06_anniversary.mp4",
        local_video_path: "/assets/video/delphine-holidays.mp4",
        video_duration_seconds: 12,
        audio_dialogue: "To another year of laughter, devotion, and our greatest adventure together. Happy Anniversary my love.",
        front_image_url: "https://TapGreetings.com/public/cards/06_front.svg",
        local_front_image_path: "/public/cards/06_front.svg",
        back_image_url: "https://TapGreetings.com/public/cards/06_back.svg",
        local_back_image_path: "/public/cards/06_back.svg"
      },
      style_tokens: {
        theme_name: "Golden Hour Romance",
        colors: {
          bg_obsidian_midnight: "#120B0A",
          bg_frosted_ice_blue: "#FEF2F2",
          accent_blush_pink: "#FECDD3",
          accent_champagne_gold: "#FDE047",
          border_rose_gold: "#E11D48",
          text_charcoal: "#1F2937",
          text_white: "#FFFFFF",
          neon_halo_glow: "#FB7185"
        },
        typography: {
          greeting_bubble_font: "'Playfair Display', serif",
          card_title_font: "'Playfair Display', serif",
          header_sans_font: "'Montserrat', sans-serif",
          body_lore_font: "'Poppins', sans-serif"
        },
        borders: {
          vector_stroke_width: "1.5pt",
          corner_style: "sharp_rectangular",
          filigree_accents: "interlocking_rings_roses"
        }
      },
      nfc_config: { target_shape: "heart", tap_label: "⟡ TAP FOR OUR STORY ⟡", instruction: "Tap with NFC phone to watch our love story", hidden_items_count: { rose_petals: 14, rings: 2 } },
      utility_action: { action_type: "LOVE_STORY_ALBUM", button_text: "Open Anniversary Album", target_url: "https://TapGreetings.com/06" },
      commerce: { price: 29.99, compare_at_price: 39.99, sku: "TG-CARD-06", inventory_qty: 100, card_format: "CR80 30mil Waterproof PVC", nfc_chip: "NTAG215 (504 Bytes Rewritable)" }
    },

    // CARD 07: Thank You
    {
      card_id: "thankyou-botanical-07",
      series_id: "winter-glamour-2026",
      card_number: 7,
      slug: "07",
      aliases_slugs: ["thank-you", "botanical-gratitude"],
      event_greeting: "With Deepest Gratitude",
      web_address: "https://TapGreetings.com/07",
      character: {
        name: "The Botanical Bloom",
        title: "Heartfelt Gratitude",
        aliases: ["Graceful Garden", "Sincere Thanks"],
        profile_theme: "The Expression of Thanks",
        motto: "Gratitude turns what we have into more than enough.",
        micro_lore: "Lush eucalyptus and golden olive branches frame words of appreciation. A heartfelt token of gratitude that lasts far longer than flowers.",
        indicators: { sincerity: "100/100", elegance: "98/100", signature: "Gilded Olive Branch" },
        rarity_tier: "Spectrum Common"
      },
      prompts: {
        prompt_front_artwork: "Botanical luxury stationery design with water-colored sage eucalyptus leaves, white blossoms, delicate gold leaf accents on handmade textured paper, 8k resolution, serene natural lighting.",
        prompt_back_design: "Crisp botanical border card back, forest green and champagne gold vector frame with leaf filigrees and central NFC target.",
        prompt_motion_video: "9:16 vertical motion video of blooming white petals and gold dust sparkling across eucalyptus leaves with gentle acoustic guitar audio.",
        prompt_voice_dialogue: "Vocal style: Warm, genuine, sincere thankfulness. 'Thank you from the bottom of my heart for your kindness, support, and friendship.'",
        prompt_negative: "messy, modern tech, neon, loud"
      },
      descriptions: {
        shopify_short_desc: "• Elegant Botanical Gratitude Card\\n• Embedded Rewritable NFC Microchip\\n• Personalized Video & Audio Thank-You\\n• Permanent CR80 PVC Smart Keepsake",
        shopify_full_html: `<div class="tg-product-desc"><h3>🌿 Heartfelt Botanical Gratitude Card</h3><p>Say thank you in a way they will never forget. Tap to play a personal recorded message of thanks.</p></div>`,
        social_share_caption: "Thank you so much! 🌿✨ Tap this smart NFC card to view my gratitude message: https://TapGreetings.com/07"
      },
      seo: {
        primary_occasion: "Thank You",
        keywords: ["thank you card", "gratitude card", "botanical card", "nfc thank you", "smart keepsake"],
        seo_title: "Heartfelt Botanical Gratitude | NFC Thank You Card",
        seo_meta_desc: "Express sincere thanks with the Botanical Gratitude smart NFC card. Tap with any smartphone for personal video and audio thank you messages."
      },
      media: {
        aspect_ratio: "9:16",
        video_url: "https://TapGreetings.com/assets/video/07_thankyou.mp4",
        local_video_path: "/assets/video/delphine-holidays.mp4",
        video_duration_seconds: 10,
        audio_dialogue: "Thank you from the bottom of my heart for your kindness, support, and friendship.",
        front_image_url: "https://TapGreetings.com/public/cards/07_front.svg",
        local_front_image_path: "/public/cards/07_front.svg",
        back_image_url: "https://TapGreetings.com/public/cards/07_back.svg",
        local_back_image_path: "/public/cards/07_back.svg"
      },
      style_tokens: {
        theme_name: "Botanical Grace",
        colors: {
          bg_obsidian_midnight: "#0A120E",
          bg_frosted_ice_blue: "#ECFDF5",
          accent_blush_pink: "#A7F3D0",
          accent_champagne_gold: "#FDE047",
          border_rose_gold: "#059669",
          text_charcoal: "#064E3B",
          text_white: "#FFFFFF",
          neon_halo_glow: "#34D399"
        },
        typography: {
          greeting_bubble_font: "'Playfair Display', serif",
          card_title_font: "'Playfair Display', serif",
          header_sans_font: "'Montserrat', sans-serif",
          body_lore_font: "'Poppins', sans-serif"
        },
        borders: {
          vector_stroke_width: "1.5pt",
          corner_style: "sharp_rectangular",
          filigree_accents: "eucalyptus_leaves"
        }
      },
      nfc_config: { target_shape: "circle", tap_label: "⟡ TAP FOR THANKS ⟡", instruction: "Tap with NFC phone to read thank you message", hidden_items_count: { olive_leaves: 12, gold_buds: 6 } },
      utility_action: { action_type: "SEND_THANK_YOU", button_text: "Reply to Gratitude Note", target_url: "https://TapGreetings.com/07" },
      commerce: { price: 29.99, compare_at_price: 39.99, sku: "TG-CARD-07", inventory_qty: 100, card_format: "CR80 30mil Waterproof PVC", nfc_chip: "NTAG215 (504 Bytes Rewritable)" }
    },

    // CARD 08: Champion & Victory (HORIZONTAL LANDSCAPE)
    {
      card_id: "congrats-champion-08",
      series_id: "winter-glamour-2026",
      card_number: 8,
      slug: "08",
      aliases_slugs: ["champion-victory", "congratulations"],
      event_greeting: "Congratulations Champion!",
      web_address: "https://TapGreetings.com/08",
      character: {
        name: "The Triumph Laurels",
        title: "Victory & Milestone",
        aliases: ["Champion", "Golden Laurels"],
        profile_theme: "The Victorious Moment",
        motto: "Dedication, grit, and perseverance always lead to greatness.",
        micro_lore: "A golden trophy gleams beneath stadium floodlights. Golden confetti drifts through the arena as victorious cheers echo for milestones achieved through tireless dedication.",
        indicators: { achievement: "100/100", resilience: "100/100", signature: "Gilded Trophy" },
        rarity_tier: "Limited Edition"
      },
      prompts: {
        prompt_front_artwork: "Wide 16:9 landscape scene of a gleaming sculpted gold trophy cup and laurel wreath beneath dramatic sports stadium floodlights, golden ticker-tape confetti swirling through air, triumph atmosphere, 8k resolution photorealistic.",
        prompt_back_design: "Horizontal landscape card back, metallic black and gold laurel leaf borders, central gold shield target for NFC tap.",
        prompt_motion_video: "16:9 widescreen video of confetti cannon explosion over championship trophy with triumphant orchestral brass fanfare.",
        prompt_voice_dialogue: "Vocal style: Inspiring, powerful announcer tone. 'You worked for it, you earned it, and today you hold the trophy. Congratulations Champion!'",
        prompt_negative: "failure, gloomy, cartoon, low contrast"
      },
      descriptions: {
        shopify_short_desc: "• 16:9 Widescreen Milestone & Trophy Card\\n• Embedded Rewritable NFC Microchip\\n• Triumphant Orchestral Fanfare Video\\n• Permanent CR80 PVC Keepsake Format",
        shopify_full_html: `<div class="tg-product-desc"><h3>🏆 Golden Laurels & Victory Anthem (Horizontal)</h3><p>Celebrate graduation, career promotion, athletic championship, or major life milestone with a permanent trophy card.</p></div>`,
        social_share_caption: "Huge congratulations on your triumph! 🏆🎉 Tap this smart NFC card to celebrate: https://TapGreetings.com/08"
      },
      seo: {
        primary_occasion: "Congratulations",
        keywords: ["congratulations card", "champion card", "milestone keepsake", "graduation gift", "nfc trophy card", "horizontal card"],
        seo_title: "Golden Laurels & Victory Anthem | Horizontal NFC Milestone Card",
        seo_meta_desc: "Honor their greatest achievement with the Golden Laurels smart NFC victory card. Tap with any smartphone for triumphant fanfare video."
      },
      media: {
        aspect_ratio: "16:9",
        video_url: "https://TapGreetings.com/assets/video/08_champion.mp4",
        local_video_path: "/assets/video/delphine-holidays.mp4",
        video_duration_seconds: 12,
        audio_dialogue: "You worked for it, you earned it, and today you hold the trophy. Congratulations Champion!",
        front_image_url: "https://TapGreetings.com/public/cards/08_front.svg",
        local_front_image_path: "/public/cards/08_front.svg",
        back_image_url: "https://TapGreetings.com/public/cards/08_back.svg",
        local_back_image_path: "/public/cards/08_back.svg"
      },
      style_tokens: {
        theme_name: "Championship Gold",
        colors: {
          bg_obsidian_midnight: "#0F1206",
          bg_frosted_ice_blue: "#FEFCE8",
          accent_blush_pink: "#FDE047",
          accent_champagne_gold: "#EAB308",
          border_rose_gold: "#CA8A04",
          text_charcoal: "#1C1917",
          text_white: "#FFFFFF",
          neon_halo_glow: "#FACC15"
        },
        typography: {
          greeting_bubble_font: "'Arial Black', sans-serif",
          card_title_font: "'Playfair Display', serif",
          header_sans_font: "'Montserrat', sans-serif",
          body_lore_font: "'Poppins', sans-serif"
        },
        borders: {
          vector_stroke_width: "1.5pt",
          corner_style: "sharp_rectangular",
          filigree_accents: "laurel_wreaths"
        }
      },
      nfc_config: { target_shape: "shield", tap_label: "⟡ TAP FOR VICTORY ⟡", instruction: "Tap with NFC phone to view trophy", hidden_items_count: { gold_trophies: 5, laurel_leaves: 18 } },
      utility_action: { action_type: "TROPHY_ROOM", button_text: "View Milestone Hall of Fame", target_url: "https://TapGreetings.com/08" },
      commerce: { price: 29.99, compare_at_price: 39.99, sku: "TG-CARD-08", inventory_qty: 100, card_format: "CR80 30mil Waterproof PVC", nfc_chip: "NTAG215 (504 Bytes Rewritable)" }
    },

    // CARD 09: Thinking of You
    {
      card_id: "everyday-lavender-09",
      series_id: "winter-glamour-2026",
      card_number: 9,
      slug: "09",
      aliases_slugs: ["thinking-of-you", "lavender-calm"],
      event_greeting: "Thinking of You Always",
      web_address: "https://TapGreetings.com/09",
      character: {
        name: "The Serene Horizon",
        title: "Gentle Lavender Skies",
        aliases: ["Calm Skies", "Warm Hugs"],
        profile_theme: "The Caring Presence",
        motto: "No matter the distance, you are always close in heart and thought.",
        micro_lore: "A gentle breeze ripples through purple lavender fields under pastel violet dusk. A quiet reminder that someone cares deeply, holding you in their fondest thoughts.",
        indicators: { tenderness: "100/100", peace: "99/100", signature: "Lavender Sprig" },
        rarity_tier: "Spectrum Common"
      },
      prompts: {
        prompt_front_artwork: "Serene lavender field in Provence at sunset, soft violet and pastel pink clouds, gentle warm twilight breeze rippling purple flowers, relaxing tranquil landscape, 8k resolution.",
        prompt_back_design: "Minimalist pastel card back, soft lilac background with thin rose gold border and calming cloud NFC target.",
        prompt_motion_video: "9:16 vertical motion video of lavender swaying in evening breeze with soothing ambient chime audio.",
        prompt_voice_dialogue: "Vocal style: Gentle, comforting, soothing presence. 'Just a gentle reminder that you are loved, appreciated, and never far from my thoughts.'",
        prompt_negative: "stormy, loud, dark, harsh colors"
      },
      descriptions: {
        shopify_short_desc: "• Everyday 'Thinking of You' Tap Keepsake\\n• Soothing Ambient Nature & Chime Video\\n• Embedded Rewritable NFC Microchip\\n• Waterproof CR80 Keepsake Card",
        shopify_full_html: `<div class="tg-product-desc"><h3>💜 Lavender Calm Thinking of You Card</h3><p>Send a warm, reassuring hug across any distance. Tap with any smartphone for an instant calming video and voice note.</p></div>`,
        social_share_caption: "Thinking of you today! 💜🌾 Tap this smart NFC card for a gentle calming message: https://TapGreetings.com/09"
      },
      seo: {
        primary_occasion: "Everyday",
        keywords: ["thinking of you", "sympathy card", "get well card", "comfort card", "nfc greeting card", "smart keepsake"],
        seo_title: "Lavender Calm & Gentle Skies | NFC Thinking of You Card",
        seo_meta_desc: "Send comfort and care with the Lavender Calm smart NFC card. Tap to unlock soothing nature video, tranquil chimes, and heartfelt voice note."
      },
      media: {
        aspect_ratio: "9:16",
        video_url: "https://TapGreetings.com/assets/video/09_thinkingofyou.mp4",
        local_video_path: "/assets/video/delphine-holidays.mp4",
        video_duration_seconds: 10,
        audio_dialogue: "Just a gentle reminder that you are loved, appreciated, and never far from my thoughts.",
        front_image_url: "https://TapGreetings.com/public/cards/09_front.svg",
        local_front_image_path: "/public/cards/09_front.svg",
        back_image_url: "https://TapGreetings.com/public/cards/09_back.svg",
        local_back_image_path: "/public/cards/09_back.svg"
      },
      style_tokens: {
        theme_name: "Lavender Tranquility",
        colors: {
          bg_obsidian_midnight: "#0F0A19",
          bg_frosted_ice_blue: "#F5F3FF",
          accent_blush_pink: "#DDD6FE",
          accent_champagne_gold: "#FDE047",
          border_rose_gold: "#8B5CF6",
          text_charcoal: "#312E81",
          text_white: "#FFFFFF",
          neon_halo_glow: "#A78BFA"
        },
        typography: {
          greeting_bubble_font: "'Playfair Display', serif",
          card_title_font: "'Playfair Display', serif",
          header_sans_font: "'Montserrat', sans-serif",
          body_lore_font: "'Poppins', sans-serif"
        },
        borders: {
          vector_stroke_width: "1.5pt",
          corner_style: "sharp_rectangular",
          filigree_accents: "lavender_sprigs"
        }
      },
      nfc_config: { target_shape: "circle", tap_label: "⟡ TAP FOR CALM ⟡", instruction: "Tap with NFC phone for gentle message", hidden_items_count: { lavender_blooms: 15, dusk_stars: 7 } },
      utility_action: { action_type: "CALM_MEDITATION", button_text: "Listen to Gentle Melody", target_url: "https://TapGreetings.com/09" },
      commerce: { price: 29.99, compare_at_price: 39.99, sku: "TG-CARD-09", inventory_qty: 100, card_format: "CR80 30mil Waterproof PVC", nfc_chip: "NTAG215 (504 Bytes Rewritable)" }
    },

    // CARD 10: Baby Arrival & Starlight (HORIZONTAL LANDSCAPE)
    {
      card_id: "baby-starlight-10",
      series_id: "winter-glamour-2026",
      card_number: 10,
      slug: "10",
      aliases_slugs: ["baby-arrival", "sweet-dreams"],
      event_greeting: "Welcome Little Wonder!",
      web_address: "https://TapGreetings.com/10",
      character: {
        name: "The Starlight Cradle",
        title: "Clouds & Sweet Dreams",
        aliases: ["Baby Arrival", "Starlight Lullaby"],
        profile_theme: "The Newborn Arrival",
        motto: "A tiny hand to hold, a whole new world to discover, and love beyond measure.",
        micro_lore: "A golden crescent moon cradles fluffy pastel clouds as silver stars twinkle softly. A precious new life begins, wrapped in endless love, wonder, and lullabies.",
        indicators: { innocence: "100/100", joy: "100/100", signature: "Moonbeam Mobile" },
        rarity_tier: "Spectrum Common"
      },
      prompts: {
        prompt_front_artwork: "Wide 16:9 landscape nursery scene of a golden crescent moon resting in dreamy clouds with hanging silver stars and warm glowing fairy lights, pastel mint, peach, and cloud-white tones, cozy enchanting nursery dreamscape, 8k resolution.",
        prompt_back_design: "Horizontal landscape card back, cloud and star vector borders in pastel gold, central moon NFC tap target.",
        prompt_motion_video: "16:9 widescreen video of gentle drifting clouds and twinkling stars with soothing nursery music box lullaby audio.",
        prompt_voice_dialogue: "Vocal style: Gentle, tender whisper tone. 'Welcome to the world, precious little one. You are loved more than all the stars in the sky.'",
        prompt_negative: "dark, scary, loud, harsh lines"
      },
      descriptions: {
        shopify_short_desc: "• 16:9 Widescreen Baby Arrival & Shower Card\\n• Music Box Lullaby & Starlight Motion Video\\n• Embedded Rewritable NFC Microchip\\n• Lifetime Keepsake for Nursery Memory Box",
        shopify_full_html: `<div class="tg-product-desc"><h3>🌙 Starlight Clouds Baby Arrival Card (Horizontal)</h3><p>A timeless keepsake for new parents and baby showers. Tap to play the baby's first milestones or lullaby motion video.</p></div>`,
        social_share_caption: "Welcome to the world little one! 👶⭐ Tap this smart NFC card to view the baby arrival video: https://TapGreetings.com/10"
      },
      seo: {
        primary_occasion: "Everyday",
        keywords: ["baby card", "baby shower gift", "new baby arrival", "nfc baby keepsake", "lullaby video card", "horizontal card"],
        seo_title: "Starlight Clouds & Sweet Dreams | Horizontal NFC Baby Arrival Card",
        seo_meta_desc: "Welcome the precious new arrival with the Starlight Clouds smart NFC baby card. Tap with any smartphone for gentle lullaby motion video and milestone album."
      },
      media: {
        aspect_ratio: "16:9",
        video_url: "https://TapGreetings.com/assets/video/10_baby.mp4",
        local_video_path: "/assets/video/delphine-holidays.mp4",
        video_duration_seconds: 12,
        audio_dialogue: "Welcome to the world, precious little one. You are loved more than all the stars in the sky.",
        front_image_url: "https://TapGreetings.com/public/cards/10_front.svg",
        local_front_image_path: "/public/cards/10_front.svg",
        back_image_url: "https://TapGreetings.com/public/cards/10_back.svg",
        local_back_image_path: "/public/cards/10_back.svg"
      },
      style_tokens: {
        theme_name: "Starlight Lullaby",
        colors: {
          bg_obsidian_midnight: "#0A0F1D",
          bg_frosted_ice_blue: "#EFF6FF",
          accent_blush_pink: "#BFDBFE",
          accent_champagne_gold: "#FDE047",
          border_rose_gold: "#3B82F6",
          text_charcoal: "#1E3A8A",
          text_white: "#FFFFFF",
          neon_halo_glow: "#60A5FA"
        },
        typography: {
          greeting_bubble_font: "'Playfair Display', serif",
          card_title_font: "'Playfair Display', serif",
          header_sans_font: "'Montserrat', sans-serif",
          body_lore_font: "'Poppins', sans-serif"
        },
        borders: {
          vector_stroke_width: "1.5pt",
          corner_style: "sharp_rectangular",
          filigree_accents: "stars_moons"
        }
      },
      nfc_config: { target_shape: "star", tap_label: "⟡ TAP FOR LULLABY ⟡", instruction: "Tap with NFC phone for music box lullaby", hidden_items_count: { hanging_stars: 12, golden_clouds: 6 } },
      utility_action: { action_type: "BABY_REGISTRY", button_text: "View Baby Milestone Registry", target_url: "https://TapGreetings.com/10" },
      commerce: { price: 29.99, compare_at_price: 39.99, sku: "TG-CARD-10", inventory_qty: 100, card_format: "CR80 30mil Waterproof PVC", nfc_chip: "NTAG215 (504 Bytes Rewritable)" }
    },

    // CARD 11: Wedding Forever Vows
    {
      card_id: "wedding-forever-11",
      series_id: "winter-glamour-2026",
      card_number: 11,
      slug: "11",
      aliases_slugs: ["wedding-vows", "forever-love"],
      event_greeting: "Two Hearts, One Journey",
      web_address: "https://TapGreetings.com/11",
      character: {
        name: "The Eternal Arch",
        title: "Eucalyptus & Gilded Vows",
        aliases: ["Wedding Arch", "Forever Vows"],
        profile_theme: "The Wedding Celebration",
        motto: "Today two lives become one grand adventure.",
        micro_lore: "Beneath a majestic floral arch draped in cream chiffon and gold leaf, promises of forever are exchanged. A sacred milestone etched in love, shared with all who bear witness.",
        indicators: { commitment: "100/100", grace: "100/100", signature: "Gilded Wedding Arch" },
        rarity_tier: "Mythic Keepsake"
      },
      prompts: {
        prompt_front_artwork: "Stunning outdoor luxury garden wedding arch draped in cream chiffon silk, cascading white orchids, blush roses, eucalyptus foliage with gold leaf details, soft romantic natural sunlight, 8k photorealistic wedding photography.",
        prompt_back_design: "Sophisticated wedding invitation card back with gold foil vector border, intertwining monograms, and central gold ring NFC tap target.",
        prompt_motion_video: "9:16 vertical video of white orchid petals drifting in sunlight with romantic string quartet wedding march audio.",
        prompt_voice_dialogue: "Vocal style: Reverent, emotional wedding toast. 'May your journey together be blessed with endless happiness, patience, and unwavering love. Congratulations on your wedding!'",
        prompt_negative: "casual, messy, dark, cartoon"
      },
      descriptions: {
        shopify_short_desc: "• Luxury Wedding Smart Keepsake Card\\n• Embedded Rewritable NFC Microchip\\n• Video Vows & String Quartet Audio\\n• Permanent CR80 PVC Memory for Bride & Groom",
        shopify_full_html: `<div class="tg-product-desc"><h3>👰 Forever Vows & Wedding Elegance</h3><p>An exquisite smart keepsake for weddings and bridal parties. Tap to watch the couple's wedding highlight video or access the digital guestbook.</p></div>`,
        social_share_caption: "Congratulations to the happy couple! 💍👰 Tap this smart NFC card to view their wedding highlights: https://TapGreetings.com/11"
      },
      seo: {
        primary_occasion: "Wedding",
        keywords: ["wedding card", "wedding gift", "bridal keepsake", "nfc wedding card", "smart guestbook"],
        seo_title: "Forever Vows & Wedding Elegance | NFC Video Wedding Card",
        seo_meta_desc: "Celebrate eternal love with the Forever Vows smart NFC wedding card. Tap with any smartphone for wedding highlight reel, vows video, and digital registry."
      },
      media: {
        aspect_ratio: "9:16",
        video_url: "https://TapGreetings.com/assets/video/11_wedding.mp4",
        local_video_path: "/assets/video/delphine-holidays.mp4",
        video_duration_seconds: 12,
        audio_dialogue: "May your journey together be blessed with endless happiness, patience, and unwavering love. Congratulations on your wedding!",
        front_image_url: "https://TapGreetings.com/public/cards/11_front.svg",
        local_front_image_path: "/public/cards/11_front.svg",
        back_image_url: "https://TapGreetings.com/public/cards/11_back.svg",
        local_back_image_path: "/public/cards/11_back.svg"
      },
      style_tokens: {
        theme_name: "Gilded Wedding Grace",
        colors: {
          bg_obsidian_midnight: "#0D0F0D",
          bg_frosted_ice_blue: "#F0FDF4",
          accent_blush_pink: "#BBF7D0",
          accent_champagne_gold: "#FDE047",
          border_rose_gold: "#16A34A",
          text_charcoal: "#14532D",
          text_white: "#FFFFFF",
          neon_halo_glow: "#4ADE80"
        },
        typography: {
          greeting_bubble_font: "'Playfair Display', serif",
          card_title_font: "'Playfair Display', serif",
          header_sans_font: "'Montserrat', sans-serif",
          body_lore_font: "'Poppins', sans-serif"
        },
        borders: {
          vector_stroke_width: "1.5pt",
          corner_style: "sharp_rectangular",
          filigree_accents: "wedding_rings_vows"
        }
      },
      nfc_config: { target_shape: "heart", tap_label: "⟡ TAP FOR VOWS ⟡", instruction: "Tap with NFC phone to watch wedding highlights", hidden_items_count: { gold_rings: 2, white_orchids: 15 } },
      utility_action: { action_type: "WEDDING_RSVP", button_text: "View Wedding Gallery & Registry", target_url: "https://TapGreetings.com/11" },
      commerce: { price: 29.99, compare_at_price: 39.99, sku: "TG-CARD-11", inventory_qty: 100, card_format: "CR80 30mil Waterproof PVC", nfc_chip: "NTAG215 (504 Bytes Rewritable)" }
    },

    // CARD 12: Custom Card Studio
    {
      card_id: "custom-studio-card-12",
      series_id: "winter-glamour-2026",
      card_number: 12,
      slug: "custom",
      aliases_slugs: ["12", "studio"],
      event_greeting: "Your Story, Your Keepsake",
      web_address: "https://TapGreetings.com/custom",
      character: {
        name: "TapGreetings Custom Studio",
        title: "Bespoke NFC Smart Keepsake",
        aliases: ["Custom Keepsake", "Creator Studio"],
        profile_theme: "The Infinite Canvas",
        motto: "Turn any memory, video, or celebration into a permanent high-tech keepsake.",
        micro_lore: "Design your own physical smart card in seconds. Upload your personal photos for front and back, connect any YouTube, Vimeo, or personal video link, and receive a commercial-grade PVC card with embedded NTAG215 chip.",
        indicators: { customization: "100/100", quality: "100/100", signature: "In-House UV Print" },
        rarity_tier: "Mythic Keepsake"
      },
      prompts: {
        prompt_front_artwork: "3D render of a personalized holographic credit card with custom user artwork floating above a sleek creator workbench, studio softbox lighting, high-tech NFC waves radiating, 8k resolution.",
        prompt_back_design: "Custom card back with user-designated text, NFC antenna traces in silver foil, and dynamic QR code backup.",
        prompt_motion_video: "9:16 vertical video showing a smartphone tapping a custom physical PVC card and instantly launching a heartwarming personalized video montage.",
        prompt_voice_dialogue: "Vocal style: Enthusiastic creator studio voice. 'Your memories deserve more than a text message. Design your own TapGreeting card today!'",
        prompt_negative: "generic, boring, flat, lowres"
      },
      descriptions: {
        shopify_short_desc: "• 100% Custom Front & Back Artwork Upload\\n• Any Video Link or File Supported\\n• Embedded High-Speed NTAG215 NFC Microchip\\n• Commercial-Grade Waterproof CR80 PVC",
        shopify_full_html: `<div class="tg-product-desc"><h3>⚡ Custom NFC Video TapGreeting Card</h3><p>Upload your own photos and attach your video. We print and encode your physical PVC keepsake card and ship it directly to your door.</p></div>`,
        social_share_caption: "Design your own custom NFC video greeting card! ⚡💌 https://TapGreetings.com/custom"
      },
      seo: {
        primary_occasion: "Custom",
        keywords: ["custom nfc card", "personalized video card", "custom greeting card", "nfc gift", "tapthingy studio"],
        seo_title: "Custom NFC Video Greeting Card Studio | TapGreetings",
        seo_meta_desc: "Create a personalized smart NFC video card with your own photos and videos. Commercial-grade CR80 PVC card with rewritable NTAG215 microchip."
      },
      media: {
        aspect_ratio: "9:16",
        video_url: "https://TapGreetings.com/assets/video/custom_demo.mp4",
        local_video_path: "/assets/video/delphine-holidays.mp4",
        video_duration_seconds: 10,
        audio_dialogue: "Your memories deserve more than a text message. Design your own TapGreeting card today!",
        front_image_url: "https://TapGreetings.com/assets/img/delphine-front.png",
        local_front_image_path: "/assets/img/delphine-front.jpg",
        back_image_url: "https://TapGreetings.com/assets/img/delphine-back.png",
        local_back_image_path: "/assets/img/delphine-back.jpg"
      },
      style_tokens: {
        theme_name: "Creator Studio Holo",
        colors: {
          bg_obsidian_midnight: "#0B0F19",
          bg_frosted_ice_blue: "#F0FDFA",
          accent_blush_pink: "#99F6E4",
          accent_champagne_gold: "#FDE047",
          border_rose_gold: "#0D9488",
          text_charcoal: "#134E4A",
          text_white: "#FFFFFF",
          neon_halo_glow: "#14B8A6"
        },
        typography: {
          greeting_bubble_font: "'Space Grotesk', sans-serif",
          card_title_font: "'Space Grotesk', sans-serif",
          header_sans_font: "'Montserrat', sans-serif",
          body_lore_font: "'Poppins', sans-serif"
        },
        borders: {
          vector_stroke_width: "1.5pt",
          corner_style: "sharp_rectangular",
          filigree_accents: "holographic_chips"
        }
      },
      nfc_config: { target_shape: "star", tap_label: "⟡ CUSTOM NFC CHIP ⟡", instruction: "Program with any link or video", hidden_items_count: { microchips: 1, memories: 999 } },
      utility_action: { action_type: "LAUNCH_STUDIO", button_text: "Open Live Custom Studio", target_url: "https://shop.tapthingy.com/products/tap-thingy-nfc-custom-pvc-card" },
      commerce: { price: 29.99, compare_at_price: 39.99, sku: "TG-CUSTOM-01", inventory_qty: 999, card_format: "CR80 30mil Waterproof PVC", nfc_chip: "NTAG215 (504 Bytes Rewritable)" }
    }
  ]
};

const masterPath = path.join(__dirname, '../data/greetings_master.json');
fs.writeFileSync(masterPath, JSON.stringify(masterData, null, 2), 'utf8');
console.log(`Successfully generated master sheet with ${masterData.cards.length} cards at: ${masterPath}`);
