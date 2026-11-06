const fs = require('fs');
const path = require('path');

const masterData = {
  series_metadata: {
    series_id: "holiday-series-1",
    series_name: "TapGreetings Series 1: The Clay & Needle-Felt Holiday Collection",
    series_number: 1,
    total_cards: 10,
    tagline: "Handcrafted Polymer Clay & Needle-Felt Keepsakes That Come Alive with a Smartphone Tap",
    publisher: "TapGreetings by TapThingy",
    website: "https://tapgreetings.com",
    shop_url: "https://shop.tapthingy.com/collections/all",
    custom_designer_url: "https://shop.tapthingy.com/products/tap-thingy-nfc-custom-pvc-card",
    tools_url: "https://shop.tapthingy.com/pages/tap-thingy-tools-nfc-reprogram-webtool-and-guide",
    contact_email: "support@tapthingy.com",
    version: "3.0.0",
    aesthetic: {
      materials: "Matte polymer clay bodies, needle-felted wool accents, cast-resin translucent ice, and tiny gold-foil stamped hardware",
      lighting: "Cinematic miniature studio photography, warm amber rim lighting, soft depth-of-field drop-off, glowing internal luminescence",
      palette: "Mocha Mousse, Cranberry Red, Pinecone Forest Green, Warm Buttercream, Cherry Glaze, Frosted Mint",
      typography: "Chunky 3D sculpted marshmallow clay and embossed felt lettering"
    }
  },
  cards: [
    // CARD 001: Santa (The Master Artisan)
    {
      card_id: "holiday-santa-001",
      series_id: "holiday-series-1",
      card_number: 1,
      card_code: "001",
      slug: "001",
      aliases_slugs: ["santa", "master-artisan"],
      event_greeting: "Happy Holidays!",
      web_address: "https://TapGreetings.com/001",
      character: {
        name: "Santa",
        title: "The Master Artisan",
        aliases: ["Santa", "The Master Artisan", "Clay Santa"],
        profile_theme: "Matte Polymer Clay & Needle Felt",
        motto: "Every heart has a spark of magic—share yours generously!",
        micro_lore: "A round, plump clay Santa with soft thumbprint textures, sporting a matte cranberry coat with needle-felted wool collar and cuffs. He cradles a glowing gold-leaf key while winking from his cozy workshop shelf surrounded by wooden toys and fairy lights.",
        indicators: {
          cheer: "★★★★★",
          warmth: "★★★★★",
          wonder: "★★★★☆"
        },
        rarity_tier: "Series 1 Premier"
      },
      prompts: {
        prompt_front_artwork: "Cinematic miniature studio photography of a round, plump polymer clay Santa with soft thumbprint textures, sporting a matte cranberry red coat with needle-felted wool collar and cuffs. Cradling a glowing gold-leaf key while winking. Soft-focus wooden workshop shelf in background with wooden toys and glowing warm fairy lights. Warm amber rim lighting, shallow depth of field, 8k resolution, 9:16 vertical.",
        prompt_back_design: "Collector trading card back layout in rich Mocha Mousse and Cranberry Red, sculpted golden sleigh bell with concentric sonar waves as central NFC tap target, warm buttercream typography, 1.5pt gold foil vector border.",
        prompt_motion_video: "9:16 vertical video. Clay Santa winks warmly, lifts the glowing gold-leaf key which pulses with golden sparkle dust. Subtle camera push-in as fairy lights twinkle warmly in the background. Stop-motion tactile claymation style.",
        prompt_voice_dialogue: "Vocal style: Jolly, deep, heartwarming artisan Santa. 'Ho ho ho! Every heart has a spark of magic—share yours generously this season. Happy Holidays!'",
        prompt_negative: "blurry, dark, low resolution, deformed fingers, cartoon, CGI plastic"
      },
      descriptions: {
        shopify_short_desc: "✦ Handcrafted Polymer Clay & Needle-Felt Santa Keepsake\n✦ 1080p Stop-Motion Workshop Video & Voice Dialogue\n✦ Embedded NTAG215 Rewritable NFC Chip\n✦ Premium CR80 30mil Waterproof PVC with Gold Foil Detailing",
        shopify_full_html: `<div class="tg-product-desc"><h3>🎅✨ Santa (The Master Artisan) - Series 1</h3><p>Celebrate the holidays with Santa, handcrafted in textured polymer clay and needle-felted wool. Tap with any smartphone to open his magical workshop video and listen to his warm holiday voice blessing.</p><ul><li><strong>Material Aesthetic:</strong> Matte clay with wool felt collar and gold-leaf key.</li><li><strong>Embedded NFC:</strong> High-speed NTAG215 microchip programmed for instant tap playback.</li><li><strong>Dual Experience:</strong> Physical collectible card + dynamic digital media layer.</li></ul></div>`,
        social_share_caption: "Every heart has a spark of magic! 🎅✨ Tap to experience Santa (The Master Artisan) smart NFC card: https://TapGreetings.com/001"
      },
      seo: {
        primary_occasion: "Winter Holidays",
        keywords: ["santa card", "clay santa", "polymer clay", "needle felt", "nfc holiday card", "master artisan", "happy holidays", "smart card"],
        seo_title: "Santa (The Master Artisan) | Series 1 NFC Holiday Card",
        seo_meta_desc: "Experience Santa, crafted in polymer clay & needle felt. Tap this smart NFC card for instant 1080p stop-motion workshop video and voice greeting."
      },
      media: {
        aspect_ratio: "9:16",
        video_url: "https://TapGreetings.com/assets/video/001-video.mp4",
        local_video_path: "/assets/video/001-video.mp4",
        video_duration_seconds: 8,
        audio_dialogue: "Ho ho ho! Every heart has a spark of magic—share yours generously this season. Happy Holidays!",
        front_image_url: "https://TapGreetings.com/assets/img/001-front.jpg",
        local_front_image_path: "/assets/img/001-front.jpg",
        back_image_url: "https://TapGreetings.com/assets/img/001-back.jpg",
        local_back_image_path: "/assets/img/001-back.jpg"
      },
      style_tokens: {
        theme_name: "Cranberry & Mocha Artisan",
        colors: {
          bg_obsidian_midnight: "#180F0B",
          bg_frosted_ice_blue: "#FFF8E7",
          accent_blush_pink: "#F87171",
          accent_champagne_gold: "#FBBF24",
          border_rose_gold: "#9E1B32",
          text_charcoal: "#2A1810",
          text_white: "#FFFFFF",
          neon_halo_glow: "#DC2626"
        },
        typography: {
          greeting_bubble_font: "'Cooper Black', 'Playfair Display', serif",
          card_title_font: "'Playfair Display', serif",
          header_sans_font: "'Montserrat', sans-serif",
          body_lore_font: "'Poppins', sans-serif"
        },
        borders: {
          vector_stroke_width: "1.5pt",
          corner_style: "clay_rounded",
          filigree_accents: "sleigh_bells"
        }
      },
      nfc_config: {
        target_shape: "sleigh_bell",
        tap_label: "⟡ TAP SLEIGH BELL ⟡",
        instruction: "Tap phone to golden sleigh bell to unlock Santa's workshop",
        hidden_items_count: {
          gold_keys: 3,
          felt_cuffs: 2
        }
      },
      utility_action: {
        action_type: "SANTA_WORKSHOP_UNLOCK",
        button_text: "Unlock Santa's Workshop",
        target_url: "https://TapGreetings.com/001"
      },
      commerce: {
        price: 29.99,
        compare_at_price: 39.99,
        sku: "TG-S1-001",
        inventory_qty: 100,
        card_format: "CR80 30mil Waterproof PVC",
        nfc_chip: "NTAG215 (504 Bytes Rewritable)"
      }
    },

    // CARD 002: Frosty (The Snowbound Joy)
    {
      card_id: "holiday-frosty-002",
      series_id: "holiday-series-1",
      card_number: 2,
      card_code: "002",
      slug: "002",
      aliases_slugs: ["frosty", "snowbound-joy"],
      event_greeting: "Happy Holidays!",
      web_address: "https://TapGreetings.com/002",
      character: {
        name: "Frosty",
        title: "The Snowbound Joy",
        aliases: ["Frosty", "The Snowbound Joy", "Clay Snowman"],
        profile_theme: "Textured Snow-Clay & Wool Knit",
        motto: "Stay cool, melt barriers, and always bring the sunshine with you!",
        micro_lore: "A pear-shaped, granulated-sugar clay snowman wearing an oversized cable-knit mustard-yellow scarf with real yarn texture and a rustic charcoal top hat. He balances a tiny red-breasted clay robin on his twig hand under a gentle swirl of soft felt snowflakes.",
        indicators: {
          chill_factor: "★★★★★",
          whimsy: "★★★★★",
          heart: "★★★★★"
        },
        rarity_tier: "Series 1 Premier"
      },
      prompts: {
        prompt_front_artwork: "Cinematic miniature studio photography of a pear-shaped granulated-sugar clay snowman wearing an oversized cable-knit mustard-yellow wool scarf and rustic charcoal top hat. Balancing a tiny red-breasted clay robin on his twig hand under a gentle swirl of soft felt snowflakes. Warm studio rim lighting, 8k resolution, 9:16 vertical.",
        prompt_back_design: "Collector card back in sugar white and warm mustard, glowing clay carrot nose medallion NFC target with concentric rings, felt border stitch accents.",
        prompt_motion_video: "9:16 vertical claymation. Frosty gently tilts his head with a wide coal-smile as the tiny clay robin flutters its wings. Felt snowflakes drift in stop-motion.",
        prompt_voice_dialogue: "Vocal style: Cheerful, bubbly, wholesome winter voice. 'Stay cool, melt barriers, and always bring the sunshine with you! Warmest holiday wishes from my snowy yard to your home!'",
        prompt_negative: "blurry, dark, CGI cartoon, flat lighting"
      },
      descriptions: {
        shopify_short_desc: "✦ Granulated Sugar Clay Snowman with Cable-Knit Wool Scarf\n✦ 1080p Stop-Motion Snowfall Video & Cheerful Greeting\n✦ Embedded NTAG215 Rewritable NFC Chip\n✦ Collector CR80 Waterproof PVC Keepsake",
        shopify_full_html: `<div class="tg-product-desc"><h3>⛄🧣 Frosty (The Snowbound Joy) - Series 1</h3><p>Bring cheerful winter sunshine indoors with Frosty! Sculpted in sugar-textured clay and wearing real yarn-knit mustard scarf, this smart NFC card comes alive when tapped with any smartphone.</p></div>`,
        social_share_caption: "Stay cool and melt barriers! ⛄❄️ Tap to experience Frosty (The Snowbound Joy): https://TapGreetings.com/002"
      },
      seo: {
        primary_occasion: "Winter Holidays",
        keywords: ["frosty card", "clay snowman", "snowbound joy", "cable knit scarf", "nfc holiday card", "smart card", "tapgreetings"],
        seo_title: "Frosty (The Snowbound Joy) | Series 1 NFC Holiday Card",
        seo_meta_desc: "Meet Frosty in granulated sugar clay and knitted wool. Tap this smart NFC card for instant stop-motion snowfall video and wholesome voice blessing."
      },
      media: {
        aspect_ratio: "9:16",
        video_url: "https://TapGreetings.com/assets/video/002-video.mp4",
        local_video_path: "/assets/video/002-video.mp4",
        video_duration_seconds: 8,
        audio_dialogue: "Stay cool, melt barriers, and always bring the sunshine with you! Warmest holiday wishes from my snowy yard to your home!",
        front_image_url: "https://TapGreetings.com/assets/img/002-front.jpg",
        local_front_image_path: "/assets/img/002-front.jpg",
        back_image_url: "https://TapGreetings.com/assets/img/002-back.jpg",
        local_back_image_path: "/assets/img/002-back.jpg"
      },
      style_tokens: {
        theme_name: "Sugar White & Mustard Knit",
        colors: {
          bg_obsidian_midnight: "#121A1B",
          bg_frosted_ice_blue: "#F0FDFA",
          accent_blush_pink: "#FDE047",
          accent_champagne_gold: "#EAB308",
          border_rose_gold: "#CA8A04",
          text_charcoal: "#1E293B",
          text_white: "#FFFFFF",
          neon_halo_glow: "#FACC15"
        },
        typography: {
          greeting_bubble_font: "'Cooper Black', 'Playfair Display', serif",
          card_title_font: "'Playfair Display', serif",
          header_sans_font: "'Montserrat', sans-serif",
          body_lore_font: "'Poppins', sans-serif"
        },
        borders: {
          vector_stroke_width: "1.5pt",
          corner_style: "clay_rounded",
          filigree_accents: "knitted_stitches"
        }
      },
      nfc_config: {
        target_shape: "carrot",
        tap_label: "⟡ TAP CARROT NOSE ⟡",
        instruction: "Tap phone to glowing clay carrot nose medallion",
        hidden_items_count: {
          clay_robins: 1,
          felt_snowflakes: 12
        }
      },
      utility_action: {
        action_type: "PLAY_SNOW_SONG",
        button_text: "Listen to Winter Tune",
        target_url: "https://TapGreetings.com/002"
      },
      commerce: {
        price: 29.99,
        compare_at_price: 39.99,
        sku: "TG-S1-002",
        inventory_qty: 100,
        card_format: "CR80 30mil Waterproof PVC",
        nfc_chip: "NTAG215 (504 Bytes Rewritable)"
      }
    },

    // CARD 003: Rudolph (The Beacon of Light)
    {
      card_id: "holiday-rudolph-003",
      series_id: "holiday-series-1",
      card_number: 3,
      card_code: "003",
      slug: "003",
      aliases_slugs: ["rudolph", "beacon-of-light"],
      event_greeting: "Happy Holidays!",
      web_address: "https://TapGreetings.com/003",
      character: {
        name: "Rudolph",
        title: "The Beacon of Light",
        aliases: ["Rudolph", "The Beacon of Light", "Clay Reindeer"],
        profile_theme: "Flocked Felt & Translucent Ruby",
        motto: "Never dim your light—it is the very compass someone needs to find their way.",
        micro_lore: "A velvety caramel-brown flocked reindeer sitting cozy in a snowbank, wearing a moss-green knitted collar with tiny brass bells. His nose is a translucent ruby-red resin sphere emitting an amber, atmospheric glow illuminating his face and the snow around him.",
        indicators: {
          lumens: "★★★★★",
          bravery: "★★★★★",
          cheer: "★★★★☆"
        },
        rarity_tier: "Series 1 Premier"
      },
      prompts: {
        prompt_front_artwork: "Cinematic miniature studio photography of a velvety caramel-brown flocked reindeer sitting cozy in a deep snowbank, wearing a moss-green knitted wool collar with tiny brass bells. Translucent ruby-red resin nose emitting an amber atmospheric glow that illuminates his cute face and the snow around him. 8k resolution, 9:16 portrait.",
        prompt_back_design: "Card back design in caramel and forest pine, glowing ruby sphere icon labeled 'TAP THE RED NOSE', brass bell filigree corners.",
        prompt_motion_video: "9:16 vertical video. Rudolph sits comfortably in soft snow, winks playfully as his glowing ruby-red nose pulses with a warm atmospheric amber beam, lighting up drifting snow flurries.",
        prompt_voice_dialogue: "Vocal style: Gentle, endearing, inspiring reindeer tone. 'Never dim your light—it is the very compass someone needs to find their way! Happy Holidays!'",
        prompt_negative: "blurry, low resolution, deformed antlers, cartoon"
      },
      descriptions: {
        shopify_short_desc: "✦ Flocked Felt Reindeer with Translucent Ruby Glowing Nose\n✦ Atmospheric Stop-Motion Glowing Nose Video & Voice Dialogue\n✦ Embedded NTAG215 Rewritable NFC Chip\n✦ Collector CR80 Waterproof PVC Keepsake",
        shopify_full_html: `<div class="tg-product-desc"><h3>🦌🔴 Rudolph (The Beacon of Light) - Series 1</h3><p>Brighten someone's world with Rudolph! Designed in velvety caramel flocked felt with a glowing translucent ruby nose, this keepsake brings comforting light and courage across the distance.</p></div>`,
        social_share_caption: "Never dim your light! 🦌🔴 Tap to experience Rudolph (The Beacon of Light): https://TapGreetings.com/003"
      },
      seo: {
        primary_occasion: "Winter Holidays",
        keywords: ["rudolph card", "flocked reindeer", "beacon of light", "red nose", "nfc holiday card", "smart card", "tapgreetings"],
        seo_title: "Rudolph (The Beacon of Light) | Series 1 NFC Holiday Card",
        seo_meta_desc: "Meet Rudolph in flocked felt and glowing ruby resin. Tap this smart NFC card for instant atmospheric video and heartfelt voice message."
      },
      media: {
        aspect_ratio: "9:16",
        video_url: "https://TapGreetings.com/assets/video/003-video.mp4",
        local_video_path: "/assets/video/003-video.mp4",
        video_duration_seconds: 8,
        audio_dialogue: "Never dim your light—it is the very compass someone needs to find their way! Happy Holidays!",
        front_image_url: "https://TapGreetings.com/assets/img/003-front.jpg",
        local_front_image_path: "/assets/img/003-front.jpg",
        back_image_url: "https://TapGreetings.com/assets/img/003-back.jpg",
        local_back_image_path: "/assets/img/003-back.jpg"
      },
      style_tokens: {
        theme_name: "Caramel & Forest Pine",
        colors: {
          bg_obsidian_midnight: "#18120B",
          bg_frosted_ice_blue: "#FEF3C7",
          accent_blush_pink: "#F87171",
          accent_champagne_gold: "#F59E0B",
          border_rose_gold: "#B45309",
          text_charcoal: "#291809",
          text_white: "#FFFFFF",
          neon_halo_glow: "#EF4444"
        },
        typography: {
          greeting_bubble_font: "'Cooper Black', 'Playfair Display', serif",
          card_title_font: "'Playfair Display', serif",
          header_sans_font: "'Montserrat', sans-serif",
          body_lore_font: "'Poppins', sans-serif"
        },
        borders: {
          vector_stroke_width: "1.5pt",
          corner_style: "clay_rounded",
          filigree_accents: "brass_bells"
        }
      },
      nfc_config: {
        target_shape: "ruby_nose",
        tap_label: "⟡ TAP THE RED NOSE ⟡",
        instruction: "Hold phone to glowing ruby nose target",
        hidden_items_count: {
          brass_bells: 4,
          pinecones: 6
        }
      },
      utility_action: {
        action_type: "LIGHT_THE_BEACON",
        button_text: "Light Rudolph's Beacon",
        target_url: "https://TapGreetings.com/003"
      },
      commerce: {
        price: 29.99,
        compare_at_price: 39.99,
        sku: "TG-S1-003",
        inventory_qty: 100,
        card_format: "CR80 30mil Waterproof PVC",
        nfc_chip: "NTAG215 (504 Bytes Rewritable)"
      }
    },

    // CARD 004: Jack Frost (The Frost Sprite)
    {
      card_id: "holiday-jackfrost-004",
      series_id: "holiday-series-1",
      card_number: 4,
      card_code: "004",
      slug: "004",
      aliases_slugs: ["jack-frost", "frost-sprite"],
      event_greeting: "Happy Holidays!",
      web_address: "https://TapGreetings.com/004",
      character: {
        name: "Jack Frost",
        title: "The Frost Sprite",
        aliases: ["Jack Frost", "The Frost Sprite", "Clay Sprite"],
        profile_theme: "Frosted Glass Resin & Periwinkle Clay",
        motto: "Winter’s chill only makes the fireside laughter that much sweeter.",
        micro_lore: "A sleek, mischievous elfin sprite sculpted in periwinkle clay with crystalline translucent frosted-glass hair and spiky frost wings. He holds a slender clay wand, blowing miniature glowing fractal frost plumes toward the viewer across an icy gradient slate.",
        indicators: {
          frost_magic: "★★★★★",
          agility: "★★★★★",
          spark: "★★★★☆"
        },
        rarity_tier: "Series 1 Premier"
      },
      prompts: {
        prompt_front_artwork: "Cinematic miniature studio photography of an elfin sprite sculpted in periwinkle clay with crystalline translucent frosted-glass hair and spiky frost wings. Holding a slender clay wand, blowing miniature glowing fractal frost plumes toward the camera across an icy gradient slate. Volumetric frost lighting, 8k resolution, 9:16 portrait.",
        prompt_back_design: "Card back in glacial blue and deep indigo, carved six-point ice crystal badge as NFC tap target, geometric beveled vector borders.",
        prompt_motion_video: "9:16 vertical video. Jack Frost hovers with flapping crystal wings, blows magical shimmering fractal frost clouds straight toward the viewer with a cheeky smile.",
        prompt_voice_dialogue: "Vocal style: Playful, spirited, crisp winter sprite voice. 'Brrr! Winter's chill only makes the fireside laughter that much sweeter! Wishing you pure frosty magic!'",
        prompt_negative: "blurry, dark, low resolution, cartoon"
      },
      descriptions: {
        shopify_short_desc: "✦ Sculpted Periwinkle Clay Sprite with Translucent Frosted Glass Hair\n✦ 1080p Crystalline Frost Video & Playful Voiceover\n✦ Embedded NTAG215 Rewritable NFC Chip\n✦ Collector CR80 Waterproof PVC Keepsake",
        shopify_full_html: `<div class="tg-product-desc"><h3>❄️✨ Jack Frost (The Frost Sprite) - Series 1</h3><p>Unleash playful winter enchantment with Jack Frost! Sculpted in periwinkle clay and translucent frosted glass, tap this smart NFC card to experience mesmerizing crystal frost plumes and winter cheer.</p></div>`,
        social_share_caption: "Winter's chill makes the fireside sweeter! ❄️🌬️ Tap to experience Jack Frost (The Frost Sprite): https://TapGreetings.com/004"
      },
      seo: {
        primary_occasion: "Winter Holidays",
        keywords: ["jack frost card", "frost sprite", "frosted glass resin", "periwinkle clay", "nfc holiday card", "smart card", "tapgreetings"],
        seo_title: "Jack Frost (The Frost Sprite) | Series 1 NFC Holiday Card",
        seo_meta_desc: "Meet Jack Frost in periwinkle clay and translucent glass. Tap this smart NFC card for instant fractal frost motion video and magical voiceover."
      },
      media: {
        aspect_ratio: "9:16",
        video_url: "https://TapGreetings.com/assets/video/004-video.mp4",
        local_video_path: "/assets/video/004-video.mp4",
        video_duration_seconds: 8,
        audio_dialogue: "Winter's chill only makes the fireside laughter that much sweeter! Wishing you pure frosty magic this season!",
        front_image_url: "https://TapGreetings.com/assets/img/004-front.jpg",
        local_front_image_path: "/assets/img/004-front.jpg",
        back_image_url: "https://TapGreetings.com/assets/img/004-back.jpg",
        local_back_image_path: "/assets/img/004-back.jpg"
      },
      style_tokens: {
        theme_name: "Glacial Blue & Indigo",
        colors: {
          bg_obsidian_midnight: "#0A1024",
          bg_frosted_ice_blue: "#E0F2FE",
          accent_blush_pink: "#7DD3FC",
          accent_champagne_gold: "#38BDF8",
          border_rose_gold: "#0284C7",
          text_charcoal: "#0C1E3A",
          text_white: "#FFFFFF",
          neon_halo_glow: "#38BDF8"
        },
        typography: {
          greeting_bubble_font: "'Cooper Black', 'Playfair Display', serif",
          card_title_font: "'Playfair Display', serif",
          header_sans_font: "'Montserrat', sans-serif",
          body_lore_font: "'Poppins', sans-serif"
        },
        borders: {
          vector_stroke_width: "1.5pt",
          corner_style: "clay_rounded",
          filigree_accents: "ice_fractals"
        }
      },
      nfc_config: {
        target_shape: "ice_crystal",
        tap_label: "⟡ TAP ICE CRYSTAL ⟡",
        instruction: "Tap phone to carved six-point ice crystal",
        hidden_items_count: {
          frost_plumes: 8,
          crystal_spires: 5
        }
      },
      utility_action: {
        action_type: "BLOW_FROST",
        button_text: "Unleash Frost Magic",
        target_url: "https://TapGreetings.com/004"
      },
      commerce: {
        price: 29.99,
        compare_at_price: 39.99,
        sku: "TG-S1-004",
        inventory_qty: 100,
        card_format: "CR80 30mil Waterproof PVC",
        nfc_chip: "NTAG215 (504 Bytes Rewritable)"
      }
    },

    // CARD 005: Nutcracker (The Hearth Sentry)
    {
      card_id: "holiday-nutcracker-005",
      series_id: "holiday-series-1",
      card_number: 5,
      card_code: "005",
      slug: "005",
      aliases_slugs: ["nutcracker", "hearth-sentry"],
      event_greeting: "Happy Holidays!",
      web_address: "https://TapGreetings.com/005",
      character: {
        name: "Nutcracker",
        title: "The Hearth Sentry",
        aliases: ["Nutcracker", "The Hearth Sentry", "Toy Soldier"],
        profile_theme: "Gloss Lacquer & Porcelain Clay",
        motto: "Stand tall in purpose, guard what you cherish, and march toward joy!",
        micro_lore: "A regal toy soldier crafted in polished lacquer wood and porcelain-finish clay. He wears an imperial navy and gold-trimmed ceremonial coat with tiny brass buttons and a velvet shako hat, standing at attention next to a miniature wrapped drum.",
        indicators: {
          loyalty: "★★★★★",
          valor: "★★★★★",
          splendor: "★★★★☆"
        },
        rarity_tier: "Series 1 Premier"
      },
      prompts: {
        prompt_front_artwork: "Cinematic miniature studio photography of a regal Nutcracker toy soldier crafted in polished lacquer wood and porcelain-finish clay. Wearing an imperial navy and gold-trimmed ceremonial coat with tiny brass buttons and a velvet shako hat, standing at attention next to a miniature wrapped snare drum. Warm hearth glow, 8k resolution, 9:16 vertical.",
        prompt_back_design: "Card back in imperial navy and gold, royal golden crest with crossed drumsticks as NFC target, crisp heraldic serif framing.",
        prompt_motion_video: "9:16 vertical video. The Nutcracker snaps to attention, twirls his miniature drumsticks with precision, and plays an energetic holiday roll as gold confetti sprinkles down.",
        prompt_voice_dialogue: "Vocal style: Noble, stately, crisp ceremonial soldier. 'Stand tall in purpose, guard what you cherish, and march boldly toward joy! Happy Holidays!'",
        prompt_negative: "blurry, dark, plastic, lowres"
      },
      descriptions: {
        shopify_short_desc: "✦ Polished Lacquer Wood & Porcelain-Finish Clay Nutcracker\n✦ 1080p Drum-Roll Motion Video & Noble Holiday Toast\n✦ Embedded NTAG215 Rewritable NFC Chip\n✦ Collector CR80 Waterproof PVC Keepsake",
        shopify_full_html: `<div class="tg-product-desc"><h3>💂‍♂️🥁 Nutcracker (The Hearth Sentry) - Series 1</h3><p>Honor holiday tradition with the Nutcracker! Crafted in polished lacquer wood and porcelain clay with imperial navy coat and brass buttons, tap to unlock his ceremonial drum-roll greeting.</p></div>`,
        social_share_caption: "Stand tall in purpose and march toward joy! 💂‍♂️🥁 Tap to experience the Nutcracker (The Hearth Sentry): https://TapGreetings.com/005"
      },
      seo: {
        primary_occasion: "Winter Holidays",
        keywords: ["nutcracker card", "hearth sentry", "toy soldier", "porcelain clay", "nfc holiday card", "smart card", "tapgreetings"],
        seo_title: "Nutcracker (The Hearth Sentry) | Series 1 NFC Holiday Card",
        seo_meta_desc: "Meet the Nutcracker in lacquer wood and porcelain clay. Tap this smart NFC card for instant drum-roll motion video and noble holiday voice blessing."
      },
      media: {
        aspect_ratio: "9:16",
        video_url: "https://TapGreetings.com/assets/video/005-video.mp4",
        local_video_path: "/assets/video/005-video.mp4",
        video_duration_seconds: 8,
        audio_dialogue: "Stand tall in purpose, guard what you cherish, and march boldly toward joy! Happy Holidays!",
        front_image_url: "https://TapGreetings.com/assets/img/005-front.jpg",
        local_front_image_path: "/assets/img/005-front.jpg",
        back_image_url: "https://TapGreetings.com/assets/img/005-back.jpg",
        local_back_image_path: "/assets/img/005-back.jpg"
      },
      style_tokens: {
        theme_name: "Imperial Navy & Gold",
        colors: {
          bg_obsidian_midnight: "#0B1120",
          bg_frosted_ice_blue: "#FEF3C7",
          accent_blush_pink: "#FBBF24",
          accent_champagne_gold: "#F59E0B",
          border_rose_gold: "#D97706",
          text_charcoal: "#1E293B",
          text_white: "#FFFFFF",
          neon_halo_glow: "#F59E0B"
        },
        typography: {
          greeting_bubble_font: "'Cooper Black', 'Playfair Display', serif",
          card_title_font: "'Playfair Display', serif",
          header_sans_font: "'Montserrat', sans-serif",
          body_lore_font: "'Poppins', sans-serif"
        },
        borders: {
          vector_stroke_width: "1.5pt",
          corner_style: "clay_rounded",
          filigree_accents: "crossed_drumsticks"
        }
      },
      nfc_config: {
        target_shape: "royal_crest",
        tap_label: "⟡ TAP ROYAL CREST ⟡",
        instruction: "Tap phone to golden sentry crest",
        hidden_items_count: {
          drumsticks: 2,
          gold_buttons: 8
        }
      },
      utility_action: {
        action_type: "PLAY_DRUM_ROLL",
        button_text: "Play Ceremonial Roll",
        target_url: "https://TapGreetings.com/005"
      },
      commerce: {
        price: 29.99,
        compare_at_price: 39.99,
        sku: "TG-S1-005",
        inventory_qty: 100,
        card_format: "CR80 30mil Waterproof PVC",
        nfc_chip: "NTAG215 (504 Bytes Rewritable)"
      }
    },

    // CARD 006: The Tree (The Evergreen Hearth)
    {
      card_id: "holiday-tree-006",
      series_id: "holiday-series-1",
      card_number: 6,
      card_code: "006",
      slug: "006",
      aliases_slugs: ["the-tree", "evergreen-hearth"],
      event_greeting: "Happy Holidays!",
      web_address: "https://TapGreetings.com/006",
      character: {
        name: "The Tree",
        title: "The Evergreen Hearth",
        aliases: ["The Tree", "The Evergreen Hearth", "Felt Tree"],
        profile_theme: "Scalloped Layered Wool Felt",
        motto: "Deeply rooted in love, reaching endlessly toward the light.",
        micro_lore: "A tiered, rounded Scandinavian folk tree composed of overlapping scalloped forest-green felt leaves. Decorated with tiny wooden baubles, clay popcorn garlands, and topped with an internal-glowing buttercream star that casts volumetric light downward.",
        indicators: {
          hearth_glow: "★★★★★",
          tradition: "★★★★★",
          wonder: "★★★★★"
        },
        rarity_tier: "Series 1 Premier"
      },
      prompts: {
        prompt_front_artwork: "Cinematic miniature studio photography of a tiered Scandinavian folk Christmas tree sculpted with overlapping scalloped forest-green felt leaves. Decorated with tiny wooden baubles and clay popcorn garlands, topped with an internal-glowing buttercream star casting warm volumetric light downward. Warm cozy holiday ambiance, 8k resolution, 9:16 vertical.",
        prompt_back_design: "Card back in spruce green and buttercream, radiant eight-pointed hearth star NFC target, carved cedar-wood filigree accents.",
        prompt_motion_video: "9:16 vertical video. The Scandinavian felt tree gently sways in a warm breeze as its golden buttercream star glows intensely, showering warm light and floating golden sparks across the baubles.",
        prompt_voice_dialogue: "Vocal style: Serene, peaceful, warm holiday blessing. 'Deeply rooted in love, reaching endlessly toward the light. May peace and comfort fill your home this season!'",
        prompt_negative: "blurry, artificial plastic, harsh neon"
      },
      descriptions: {
        shopify_short_desc: "✦ Scandinavian Tiered Wool Felt Tree with Glowing Buttercream Star\n✦ 1080p Hearth Glow Motion Video & Serene Holiday Blessing\n✦ Embedded NTAG215 Rewritable NFC Chip\n✦ Collector CR80 Waterproof PVC Keepsake",
        shopify_full_html: `<div class="tg-product-desc"><h3>🎄⭐ The Tree (The Evergreen Hearth) - Series 1</h3><p>Bring the timeless peace of the evergreen into your celebrations. Crafted in scalloped Scandinavian wool felt with an internal-glowing star, tap with any phone to experience warm volumetric hearth light.</p></div>`,
        social_share_caption: "Deeply rooted in love! 🎄⭐ Tap to experience The Tree (The Evergreen Hearth): https://TapGreetings.com/006"
      },
      seo: {
        primary_occasion: "Winter Holidays",
        keywords: ["holiday tree card", "evergreen hearth", "scandinavian felt tree", "wool felt", "nfc holiday card", "smart card", "tapgreetings"],
        seo_title: "The Tree (The Evergreen Hearth) | Series 1 NFC Holiday Card",
        seo_meta_desc: "Experience The Tree in tiered Scandinavian wool felt. Tap this smart NFC card for instant hearth glow motion video and peaceful holiday blessing."
      },
      media: {
        aspect_ratio: "9:16",
        video_url: "https://TapGreetings.com/assets/video/006-video.mp4",
        local_video_path: "/assets/video/006-video.mp4",
        video_duration_seconds: 8,
        audio_dialogue: "Deeply rooted in love, reaching endlessly toward the light. May peace and comfort fill your home this season!",
        front_image_url: "https://TapGreetings.com/assets/img/006-front.jpg",
        local_front_image_path: "/assets/img/006-front.jpg",
        back_image_url: "https://TapGreetings.com/assets/img/006-back.jpg",
        local_back_image_path: "/assets/img/006-back.jpg"
      },
      style_tokens: {
        theme_name: "Spruce Green & Buttercream",
        colors: {
          bg_obsidian_midnight: "#0D1812",
          bg_frosted_ice_blue: "#F0FDF4",
          accent_blush_pink: "#86EFAC",
          accent_champagne_gold: "#FDE047",
          border_rose_gold: "#15803D",
          text_charcoal: "#052E16",
          text_white: "#FFFFFF",
          neon_halo_glow: "#22C55E"
        },
        typography: {
          greeting_bubble_font: "'Cooper Black', 'Playfair Display', serif",
          card_title_font: "'Playfair Display', serif",
          header_sans_font: "'Montserrat', sans-serif",
          body_lore_font: "'Poppins', sans-serif"
        },
        borders: {
          vector_stroke_width: "1.5pt",
          corner_style: "clay_rounded",
          filigree_accents: "hearth_stars"
        }
      },
      nfc_config: {
        target_shape: "hearth_star",
        tap_label: "⟡ TAP HEARTH STAR ⟡",
        instruction: "Tap phone to radiant eight-pointed star",
        hidden_items_count: {
          popcorn_strands: 5,
          wooden_baubles: 14
        }
      },
      utility_action: {
        action_type: "LIGHT_THE_TREE",
        button_text: "Illuminate Hearth Star",
        target_url: "https://TapGreetings.com/006"
      },
      commerce: {
        price: 29.99,
        compare_at_price: 39.99,
        sku: "TG-S1-006",
        inventory_qty: 100,
        card_format: "CR80 30mil Waterproof PVC",
        nfc_chip: "NTAG215 (504 Bytes Rewritable)"
      }
    },

    // CARD 007: Snowflake (The Celestial Crystal)
    {
      card_id: "holiday-snowflake-007",
      series_id: "holiday-series-1",
      card_number: 7,
      card_code: "007",
      slug: "007",
      aliases_slugs: ["snowflake", "celestial-crystal"],
      event_greeting: "Happy Holidays!",
      web_address: "https://TapGreetings.com/007",
      character: {
        name: "Snowflake",
        title: "The Celestial Crystal",
        aliases: ["Snowflake", "The Celestial Crystal", "Living Snowflake"],
        profile_theme: "Opalescent Resin & Pearl Clay",
        motto: "Unique in every angle, fleeting in time, infinite in beauty.",
        micro_lore: "A macro focal characterization of a living crystalline snowflake: sculpted layered opalescent resin and pearl clay, floating weightlessly against a deep indigo twilight sky. Its core glows with soft cyan bioluminescence, surrounded by micro-particles of frost dust.",
        indicators: {
          pure_magic: "★★★★★",
          peace: "★★★★★",
          precision: "★★★★★"
        },
        rarity_tier: "Series 1 Premier"
      },
      prompts: {
        prompt_front_artwork: "Cinematic macro studio photography of a living crystalline snowflake character sculpted in layered opalescent resin and pearl clay, floating weightlessly against a deep indigo twilight sky. Internal core glowing with soft cyan bioluminescence, surrounded by floating micro-particles of frost dust. Slender spun-sugar typography, 8k resolution, 9:16 vertical.",
        prompt_back_design: "Card back in cyan and twilight slate, intricate embossed hexagonal snowflake core as NFC tap target, delicate diamond-dust vector border.",
        prompt_motion_video: "9:16 vertical video. The opalescent crystal snowflake rotates slowly in weightless motion, its bioluminescent cyan core pulsing with starlight as shimmering frost particles expand in slow motion.",
        prompt_voice_dialogue: "Vocal style: Whispering, ethereal, crystalline beauty. 'Unique in every angle, fleeting in time, infinite in beauty. Wishing you a season of peaceful wonder!'",
        prompt_negative: "blurry, dark, noisy, lowres"
      },
      descriptions: {
        shopify_short_desc: "✦ Layered Opalescent Resin & Pearl Clay Living Snowflake\n✦ Bioluminescent 1080p Motion Video & Ethereal Whisper Voiceover\n✦ Embedded NTAG215 Rewritable NFC Chip\n✦ Collector CR80 Waterproof PVC Keepsake",
        shopify_full_html: `<div class="tg-product-desc"><h3>❄️💎 Snowflake (The Celestial Crystal) - Series 1</h3><p>Celebrate pure winter wonder with Snowflake! Sculpted in opalescent resin and pearl clay with an ethereal bioluminescent core, tap to unlock mesmerizing macro crystalline floating video.</p></div>`,
        social_share_caption: "Unique in every angle, infinite in beauty! ❄️💎 Tap to experience Snowflake (The Celestial Crystal): https://TapGreetings.com/007"
      },
      seo: {
        primary_occasion: "Winter Holidays",
        keywords: ["snowflake card", "celestial crystal", "opalescent resin", "pearl clay", "nfc holiday card", "smart card", "tapgreetings"],
        seo_title: "Snowflake (The Celestial Crystal) | Series 1 NFC Holiday Card",
        seo_meta_desc: "Discover Snowflake in opalescent resin and pearl clay. Tap this smart NFC card for instant bioluminescent crystal video and peaceful holiday whisper."
      },
      media: {
        aspect_ratio: "9:16",
        video_url: "https://TapGreetings.com/assets/video/007-video.mp4",
        local_video_path: "/assets/video/007-video.mp4",
        video_duration_seconds: 8,
        audio_dialogue: "Unique in every angle, fleeting in time, infinite in beauty. Wishing you a season of peaceful wonder!",
        front_image_url: "https://TapGreetings.com/assets/img/007-front.jpg",
        local_front_image_path: "/assets/img/007-front.jpg",
        back_image_url: "https://TapGreetings.com/assets/img/007-back.jpg",
        local_back_image_path: "/assets/img/007-back.jpg"
      },
      style_tokens: {
        theme_name: "Cyan & Twilight Slate",
        colors: {
          bg_obsidian_midnight: "#0A1128",
          bg_frosted_ice_blue: "#E0F2FE",
          accent_blush_pink: "#67E8F9",
          accent_champagne_gold: "#38BDF8",
          border_rose_gold: "#0891B2",
          text_charcoal: "#083344",
          text_white: "#FFFFFF",
          neon_halo_glow: "#06B6D4"
        },
        typography: {
          greeting_bubble_font: "'Cooper Black', 'Playfair Display', serif",
          card_title_font: "'Playfair Display', serif",
          header_sans_font: "'Montserrat', sans-serif",
          body_lore_font: "'Poppins', sans-serif"
        },
        borders: {
          vector_stroke_width: "1.5pt",
          corner_style: "clay_rounded",
          filigree_accents: "hexagonal_crystals"
        }
      },
      nfc_config: {
        target_shape: "hex_crystal",
        tap_label: "⟡ TAP CRYSTAL CORE ⟡",
        instruction: "Tap phone to embossed hexagonal crystal",
        hidden_items_count: {
          crystal_facets: 6,
          frost_particles: 24
        }
      },
      utility_action: {
        action_type: "SPARK_CRYSTAL",
        button_text: "Activate Crystal Core",
        target_url: "https://TapGreetings.com/007"
      },
      commerce: {
        price: 29.99,
        compare_at_price: 39.99,
        sku: "TG-S1-007",
        inventory_qty: 100,
        card_format: "CR80 30mil Waterproof PVC",
        nfc_chip: "NTAG215 (504 Bytes Rewritable)"
      }
    },

    // CARD 008: Gift (The Surprise Box)
    {
      card_id: "holiday-gift-008",
      series_id: "holiday-series-1",
      card_number: 8,
      card_code: "008",
      slug: "008",
      aliases_slugs: ["gift", "surprise-box"],
      event_greeting: "Happy Holidays!",
      web_address: "https://TapGreetings.com/008",
      character: {
        name: "Gift",
        title: "The Surprise Box",
        aliases: ["Gift", "The Surprise Box", "Living Present"],
        profile_theme: "Ribbed Craft Paper & Satin Ribbon",
        motto: "The sweetest presents aren’t tied in ribbons, but wrapped in presence.",
        micro_lore: "An expressive, living gift box wrapped in ribbed sage-green craft paper, cinched with an oversized, bouncy cherry-red satin felt bow. The lid is cracked open just enough to allow a beam of warm golden light, magical ribbons, and star dust to burst out into the foreground.",
        indicators: {
          anticipation: "★★★★★",
          delight: "★★★★★",
          mystery: "★★★★★"
        },
        rarity_tier: "Series 1 Premier"
      },
      prompts: {
        prompt_front_artwork: "Cinematic miniature studio photography of an expressive living gift box wrapped in textured ribbed sage-green craft paper, cinched with an oversized bouncy cherry-red satin felt ribbon bow. The lid is slightly cracked open, allowing a beam of warm golden volumetric light, magical ribbons, and sparkling star dust to burst out into foreground. 8k resolution, 9:16 vertical.",
        prompt_back_design: "Card back in sage green and cherry red, center knot of the satin ribbon bow as NFC tap target, playful confetti borders.",
        prompt_motion_video: "9:16 vertical video. The sage gift box wiggles with joyful anticipation, its cherry-red bow bounces, and the lid cracks open wider as a brilliant blast of golden starlight and confetti illuminates the frame.",
        prompt_voice_dialogue: "Vocal style: Playful, joyful, bubbling with excitement. 'The sweetest presents aren't tied in ribbons, but wrapped in presence! Open your heart to the season—Happy Holidays!'",
        prompt_negative: "blurry, plain box, flat colors"
      },
      descriptions: {
        shopify_short_desc: "✦ Ribbed Sage-Green Craft Paper Gift Box with Bouncy Satin Bow\n✦ 1080p Starlight Burst Motion Video & Heartwarming Voice Greeting\n✦ Embedded NTAG215 Rewritable NFC Chip\n✦ Collector CR80 Waterproof PVC Keepsake",
        shopify_full_html: `<div class="tg-product-desc"><h3>🎁✨ Gift (The Surprise Box) - Series 1</h3><p>Deliver the pure joy of anticipation with Gift! Wrapped in ribbed sage craft paper and crowned with an oversized cherry-red satin felt bow, tap with any smartphone for an explosion of warm starlight and festive cheer.</p></div>`,
        social_share_caption: "The sweetest presents are wrapped in presence! 🎁✨ Tap to experience Gift (The Surprise Box): https://TapGreetings.com/008"
      },
      seo: {
        primary_occasion: "Winter Holidays",
        keywords: ["gift box card", "surprise box", "sage craft paper", "satin felt bow", "nfc holiday card", "smart card", "tapgreetings"],
        seo_title: "Gift (The Surprise Box) | Series 1 NFC Holiday Card",
        seo_meta_desc: "Discover Gift, wrapped in sage craft paper with a bouncy red bow. Tap this smart NFC card for instant starlight burst motion video and joyful voice toast."
      },
      media: {
        aspect_ratio: "9:16",
        video_url: "https://TapGreetings.com/assets/video/008-video.mp4",
        local_video_path: "/assets/video/008-video.mp4",
        video_duration_seconds: 8,
        audio_dialogue: "The sweetest presents aren't tied in ribbons, but wrapped in presence! Open your heart to the season—Happy Holidays!",
        front_image_url: "https://TapGreetings.com/assets/img/008-front.jpg",
        local_front_image_path: "/assets/img/008-front.jpg",
        back_image_url: "https://TapGreetings.com/assets/img/008-back.jpg",
        local_back_image_path: "/assets/img/008-back.jpg"
      },
      style_tokens: {
        theme_name: "Sage & Cherry Red",
        colors: {
          bg_obsidian_midnight: "#141712",
          bg_frosted_ice_blue: "#F5F5F4",
          accent_blush_pink: "#F87171",
          accent_champagne_gold: "#FBBF24",
          border_rose_gold: "#DC2626",
          text_charcoal: "#1C1917",
          text_white: "#FFFFFF",
          neon_halo_glow: "#EF4444"
        },
        typography: {
          greeting_bubble_font: "'Cooper Black', 'Playfair Display', serif",
          card_title_font: "'Playfair Display', serif",
          header_sans_font: "'Montserrat', sans-serif",
          body_lore_font: "'Poppins', sans-serif"
        },
        borders: {
          vector_stroke_width: "1.5pt",
          corner_style: "clay_rounded",
          filigree_accents: "ribbon_knots"
        }
      },
      nfc_config: {
        target_shape: "bow_knot",
        tap_label: "⟡ TAP RIBBON KNOT ⟡",
        instruction: "Tap phone to center satin bow knot",
        hidden_items_count: {
          ribbon_loops: 4,
          magic_sparks: 18
        }
      },
      utility_action: {
        action_type: "OPEN_GIFT",
        button_text: "Open Surprise Gift Box",
        target_url: "https://TapGreetings.com/008"
      },
      commerce: {
        price: 14.99,
        compare_at_price: 24.99,
        sku: "TG-S1-008",
        inventory_qty: 100,
        card_format: "CR80 30mil Waterproof PVC",
        nfc_chip: "NTAG215 (504 Bytes Rewritable)"
      }
    },
    // CARD 009: Gingerbread Man (The Sweet Reveler)
    {
      card_id: "holiday-gingerbread-009",
      series_id: "holiday-series-1",
      card_number: 9,
      card_code: "009",
      slug: "009",
      aliases_slugs: ["gingerbread", "gingerbread-man"],
      event_greeting: "Happy Holidays!",
      web_address: "https://TapGreetings.com/009",
      character: {
        name: "Gingerbread Man",
        title: "The Sweet Reveler",
        aliases: ["Gingerbread Man", "The Sweet Reveler", "Clay Gingerbread"],
        profile_theme: "Warm Spiced Clay & Royal Icing",
        motto: "Run toward joy, catch every sweet moment, and spice up the season!",
        micro_lore: "A cheerful, baked gingerbread man sculpted in warm cinnamon-spiced polymer clay with dimensional white royal icing piping and gumdrop buttons, waving happily from a flour-dusted holiday kitchen table.",
        indicators: {
          sweetness: "★★★★★",
          agility: "★★★★★",
          cheer: "★★★★★"
        },
        rarity_tier: "Series 1 Sweet Treat"
      },
      prompts: {
        prompt_front_artwork: "Cinematic miniature studio photography of a cheerful polymer clay Gingerbread Man with warm cinnamon dough texture, white puffy royal icing trims, and tiny gumdrop buttons. Waving excitedly on a flour-dusted kitchen surface next to candy canes and anise stars. Warm ambient lighting, shallow depth of field, 8k resolution, 9:16 vertical.",
        prompt_back_design: "Collector card back in warm Gingerbread Cinnamon and Royal Frosting White, royal icing piping filigree, central icing swirl NFC antenna target.",
        prompt_motion_video: "9:16 vertical video. Clay Gingerbread Man springs to life, does a cute cheerful hop and wave as cookie crumbs sprinkle with sugar sparkle dust. Stop-motion claymation.",
        prompt_voice_dialogue: "Vocal style: Playful, speedy, sweet holiday joy. 'Catch me if you can—bringing all the sweet holiday cheer your way! Happy Holidays!'",
        prompt_negative: "blurry, low quality, cartoon, deformed"
      },
      descriptions: {
        shopify_short_desc: "✦ Handcrafted Polymer Clay & Royal Icing Gingerbread Keepsake\n✦ 1080p Stop-Motion Motion Video\n✦ Embedded NTAG215 Rewritable NFC Chip\n✦ Premium CR80 30mil Waterproof PVC",
        shopify_full_html: `<div class="tg-product-desc"><h3>🍪✨ Gingerbread Man (The Sweet Reveler) - Series 1</h3><p>Spice up the holidays with Gingerbread Man, crafted in warm cinnamon-spiced clay and dimensional royal icing. Tap with any smartphone for instant claymation video celebration.</p></div>`,
        social_share_caption: "Run toward joy! 🍪✨ Tap to experience Gingerbread Man (The Sweet Reveler) smart NFC card: https://TapGreetings.com/009"
      },
      seo: {
        primary_occasion: "Winter Holidays",
        keywords: ["gingerbread card", "gingerbread man", "clay gingerbread", "royal icing", "nfc holiday card", "smart card", "tapgreetings"],
        seo_title: "Gingerbread Man (The Sweet Reveler) | Series 1 NFC Holiday Card",
        seo_meta_desc: "Discover Gingerbread Man, crafted in cinnamon clay and royal icing. Tap this smart NFC card for instant holiday stop-motion video greeting."
      },
      media: {
        aspect_ratio: "9:16",
        video_url: "https://TapGreetings.com/assets/video/009-video.mp4",
        local_video_path: "/assets/video/009-video.mp4",
        video_duration_seconds: 8,
        audio_dialogue: "Catch me if you can—bringing all the sweet holiday cheer your way! Happy Holidays!",
        front_image_url: "https://TapGreetings.com/assets/img/009-front.jpg",
        local_front_image_path: "/assets/img/009-front.jpg",
        back_image_url: "https://TapGreetings.com/assets/img/009-back.jpg",
        local_back_image_path: "/assets/img/009-back.jpg"
      },
      style_tokens: {
        theme_name: "Cinnamon & Royal Icing",
        colors: {
          bg_obsidian_midnight: "#1A1009",
          bg_frosted_ice_blue: "#FFFBF0",
          accent_blush_pink: "#F87171",
          accent_champagne_gold: "#FBBF24",
          border_rose_gold: "#D97706",
          text_charcoal: "#29180E",
          text_white: "#FFFFFF",
          neon_halo_glow: "#F59E0B"
        }
      },
      nfc_config: {
        target_shape: "icing_swirl",
        tap_label: "⟡ TAP TO CRUNCH ⟡",
        instruction: "Tap phone to royal icing medallion",
        hidden_items_count: {}
      },
      utility_action: {
        action_type: "SWEET_TREAT",
        button_text: "Unwrap Sweet Holiday Treat",
        target_url: "https://TapGreetings.com/009"
      },
      commerce: {
        price: 14.99,
        compare_at_price: 24.99,
        sku: "TG-S1-009",
        inventory_qty: 100,
        card_format: "CR80 30mil Waterproof PVC",
        nfc_chip: "NTAG215 (504 Bytes Rewritable)"
      }
    },
    // CARD 010: Mrs. Claus (The Hearth Matron)
    {
      card_id: "holiday-mrsclaus-010",
      series_id: "holiday-series-1",
      card_number: 10,
      card_code: "010",
      slug: "010",
      aliases_slugs: ["mrs-claus", "hearth-matron"],
      event_greeting: "Happy Holidays!",
      web_address: "https://TapGreetings.com/010",
      character: {
        name: "Mrs. Claus",
        title: "The Hearth Matron",
        aliases: ["Mrs. Claus", "The Hearth Matron", "Clay Mrs. Claus"],
        profile_theme: "Flocked Wool & Warm Oven Clay",
        motto: "A dash of kindness and a home full of warmth bake the sweetest memories.",
        micro_lore: "A warm, grandmotherly Mrs. Claus in cozy crimson wool and a lace-trimmed apron, presenting a steaming tray of golden star cookies straight from the North Pole oven with a loving smile.",
        indicators: {
          warmth: "★★★★★",
          comfort: "★★★★★",
          cheer: "★★★★★"
        },
        rarity_tier: "Series 1 Hearth Edition"
      },
      prompts: {
        prompt_front_artwork: "Cinematic miniature studio photography of a gentle, smiling polymer clay Mrs. Claus wearing miniature wire-rim spectacles, a red needle-felted dress, and white lace apron. She holds a tiny tray of star-shaped butter cookies. Warm kitchen oven glow in background, shallow depth of field, 8k resolution, 9:16 vertical.",
        prompt_back_design: "Collector card back in Cranberry and Warm Cream, scalloped cookie edge borders, star cookie NFC target.",
        prompt_motion_video: "9:16 vertical video. Clay Mrs. Claus smiles lovingly and offers a star cookie toward the camera, warm steam gently rising. Stop-motion claymation.",
        prompt_voice_dialogue: "Vocal style: Tender, warm, caring holiday matron. 'From our warm hearth to yours, may your holidays be filled with joy and sweetness. Happy Holidays, dear!'",
        prompt_negative: "blurry, low quality, cartoon, deformed"
      },
      descriptions: {
        shopify_short_desc: "✦ Handcrafted Polymer Clay Mrs. Claus Keepsake\n✦ 1080p Stop-Motion Kitchen Video\n✦ Embedded NTAG215 Rewritable NFC Chip\n✦ Premium CR80 30mil Waterproof PVC",
        shopify_full_html: `<div class="tg-product-desc"><h3>🍪❤️ Mrs. Claus (The Hearth Matron) - Series 1</h3><p>Bring the warmth of the North Pole kitchen to your holiday celebrations with Mrs. Claus. Tap with any smartphone for instant heartfelt claymation video blessing.</p></div>`,
        social_share_caption: "A dash of kindness! 🍪❤️ Tap to experience Mrs. Claus (The Hearth Matron) smart NFC card: https://TapGreetings.com/010"
      },
      seo: {
        primary_occasion: "Winter Holidays",
        keywords: ["mrs claus card", "mrs claus", "clay mrs claus", "needle felt", "nfc holiday card", "smart card", "tapgreetings"],
        seo_title: "Mrs. Claus (The Hearth Matron) | Series 1 NFC Holiday Card",
        seo_meta_desc: "Experience Mrs. Claus, sculpted in warm clay and needle-felted crimson wool. Tap this smart NFC card for instant warm holiday motion video greeting."
      },
      media: {
        aspect_ratio: "9:16",
        video_url: "https://TapGreetings.com/assets/video/010-video.mp4",
        local_video_path: "/assets/video/010-video.mp4",
        video_duration_seconds: 8,
        audio_dialogue: "From our warm hearth to yours, may your holidays be filled with joy and sweetness. Happy Holidays, dear!",
        front_image_url: "https://TapGreetings.com/assets/img/010-front.jpg",
        local_front_image_path: "/assets/img/010-front.jpg",
        back_image_url: "https://TapGreetings.com/assets/img/010-back.jpg",
        local_back_image_path: "/assets/img/010-back.jpg"
      },
      style_tokens: {
        theme_name: "Warm Oven & Crimson Wool",
        colors: {
          bg_obsidian_midnight: "#180E0B",
          bg_frosted_ice_blue: "#FFF8F0",
          accent_blush_pink: "#F87171",
          accent_champagne_gold: "#FBBF24",
          border_rose_gold: "#BE123C",
          text_charcoal: "#28170F",
          text_white: "#FFFFFF",
          neon_halo_glow: "#E11D48"
        }
      },
      nfc_config: {
        target_shape: "star_cookie",
        tap_label: "⟡ TAP FOR WARMTH ⟡",
        instruction: "Tap phone to warm cookie medallion",
        hidden_items_count: {}
      },
      utility_action: {
        action_type: "HEARTH_BLESSING",
        button_text: "Receive Hearth Cookie Blessing",
        target_url: "https://TapGreetings.com/010"
      },
      commerce: {
        price: 14.99,
        compare_at_price: 24.99,
        sku: "TG-S1-010",
        inventory_qty: 100,
        card_format: "CR80 30mil Waterproof PVC",
        nfc_chip: "NTAG215 (504 Bytes Rewritable)"
      }
    }
  ]
};

const masterPath = path.join(__dirname, '../data/greetings_master.json');
fs.writeFileSync(masterPath, JSON.stringify(masterData, null, 2), 'utf8');
console.log(`Successfully generated master sheet with ${masterData.cards.length} cards at: ${masterPath}`);
