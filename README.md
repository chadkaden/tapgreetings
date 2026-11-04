# TapGreetings 💌⚡

> Interactive Digital & NFC Physical Video Greeting Cards powered by [TapThingy](https://tapthingy.com).

TapGreetings pairs high-definition physical CR80 PVC cards (with integrated NTAG213/215 NFC microchips) with an interactive 9:16 vertical video & rich audio greeting layer. 

---

## Architecture & Ecosystem

```text
TapGreetings.com (Web Experience & Creator Studio)
       │
       ├── Pre-Made AI / Motion Greetings (Google Flow / Generated)
       ├── User Custom Card & Video Studio (Front/Back preview + specs)
       └── NFC Edge Redirect Routing (tapgreetings.com/{slug})
                 │
                 ▼
Shop.TapGreetings.com  ──▶  Shop.TapThingy.com / Collections / TapGreetings
                                   │
                                   └── Custom Tap Card Product ($29.99)
                                       - Front/Back custom user upload
                                       - Orientation & placement tools
                                       - In-house CR80 PVC production
```

## Setup & Local Development

1. **Serve locally:**
   ```bash
   npx serve .
   ```
2. **Deploy to Edge (Cloudflare Pages):**
   ```bash
   npx wrangler pages deploy .
   ```

## Shopify Theme Files
The Shopify integration files are available in `theme/`:
- `theme/templates/product.custom-greeting.json`: Product template for the custom greeting card.
- `theme/sections/tapgreetings-custom-card-designer.liquid`: Interactive live card studio section with artwork upload, rotation, scaling, orientation toggle, and AJAX add-to-cart.
- `theme/snippets/`: TapThingy global header & department navigation bars.
