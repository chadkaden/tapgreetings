# TapGreetings & Smart NFC Keepsake: Product Onboarding Standard Operating Procedure (SOP)

This document is the complete, repeatable end-to-end guide for turning raw multimedia assets (illustrations, videos, and lore) into live, purchasable physical smart NFC keepsake products on **Shopify** and interactive web experiences on **Cloudflare**.

---

## 1. Asset Preparation & Standard Dimensions

When source art and animation videos arrive from creative/3D rendering:

### A. Static Physical Card Artwork (CR80 Credit Card Standard)
* **Standard CR80 Specs**: $53.98\text{ mm} \times 85.60\text{ mm}$ (Aspect ratio: `53.98 / 85.60 ≈ 0.6306` or `54/86`).
* **Target 2K Resolution**: `1735 × 2752 px` at 300+ DPI.
* **Naming Standard**:
  * Front: `assets/img/cr80/0XX-front.jpg`
  * Back (with NFC Target Icon): `assets/img/cr80/0XX-back.jpg`
* **Auto-Resize Script**: Use PowerShell's native `System.Drawing` bicubic resampling:
  ```powershell
  powershell -ExecutionPolicy Bypass -File scripts/resize_series3_to_cr80.ps1
  ```

### B. Motion Video Optimization
* **Formats**:
  * **Portrait (Standard 9:16)**: `1080 × 1920 px`
  * **Landscape (Cinematic 16:9)**: `1280 × 720 px` (or `1920 × 1080 px`)
* **Codec**: H.264 video, AAC audio, MP4 container with `moov` atom at the front (`faststart`) for instant streaming without buffering.
* **Naming Standard**: `assets/video/0XX-video.mp4`

---

## 2. Metadata & Lore Registration

Every card must be cataloged in `data/holiday_series_official.json` and `data/greetings_master.json`.

### Required Fields Schema:
```json
{
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
  }
}
```

> [!IMPORTANT]
> If the video is landscape (`16/9`), set `"is_landscape": true` and `"aspect_ratio": "16/9"`. This dynamically engages `.is-landscape` CSS (`aspect-ratio: 16/9 !important; max-width: 580px !important;`) on web pages, preventing portrait letterboxing.

---

## 3. Web Platform & Static Card Generation (`tapgreetings.com`)

Run `node scripts/generate_cards.cjs` to generate:
1. **Direct Card Pages**: `/{code}/index.html` (e.g., `/017/index.html`).
2. **SEO Alias Pages**: Derived from character name & title (e.g., `/the-solstice-orrery-stag/index.html`).
3. **Dedicated Collection Hubs**: `/solstice-magic/index.html` and `/series-3/index.html`.
4. **Main Storefront Rails & Gallery**: Updates `index.html` with horizontal scroll rails and category filter pills (`All (29)`, `Series 1 & 2 (16)`, `Series 3 (8)`, `Draft (5)`).
5. **Slide-Over Navigation Drawer**: Updated with direct links to every series and subcollection.

### Theme Styling by Series:
* **Series 1 & 2 (Clay Anthology)**: Warm mocha (`#140C08`), cherry crimson (`#9E1B32`), and holiday gold (`#FBBF24`).
* **Series 3 (Solstice Magic)**: Deep celestial midnight navy (`#0A1128`), starlight gold (`#FBBF24`), clockwork brass, and aurora emerald (`#10B981` / `#34D399`).

---

## 4. Shopify Storefront & Product Creation

To allow physical ordering of new cards:

### A. Create Products via Admin REST API (`POST /admin/api/2024-07/products.json`)
Run `node scripts/create_series_3_shopify_products.cjs`:
* **Title**: `#{code} {Name} ({Title}) - Smart NFC Video Keepsake Card`
* **Price**: `$14.99`
* **SKU**: `TG-S03-{code}`
* **Tags**: `#0XX`, `card-0XX`, `Series 3`, `Solstice Magic`, `Smart NFC Card`, `TapGreetings`
* **Media**: Auto-uploads both `0XX-front.jpg` and `0XX-back.jpg` (CR80 sized).
* **Smart Collection**: Auto-groups into `/collections/solstice-magic` via the `Series 3` tag rule.

### B. Deploy Entertainment Pages (`/pages/tghh0XX`)
Run `node scripts/deploy_solstice_entertainment_pages.cjs`:
* Injects CSS that suppresses Shopify's default header, announcement bar, and theme default H1.
* Puts the video hero at the very top.
* Persistent audio toggle (`preserveAudio()` attaches `?sound=1` and stores preference in `localStorage`).
* Animated Living Creed / Motto box, Special Abilities card, NFC Sonar card, and Power Indicator stats.
* Interactive 3D CR80 Card Flip.
* Direct AJAX Add to Cart CTA (`/cart/add.js`) with instant confirmation.

### C. Update Shopify Theme Sections
Upload the updated Liquid templates to theme `193427177794`:
1. `sections/tapgreetings-product-page.liquid`: Renders individual product pages with matching lively themed design and landscape video support.
2. `sections/tapgreetings-homepage.liquid`: Adds the horizontal scroll rail for the new series on the homepage.
3. `sections/tapgreetings-collection-grid.liquid`: Adds filter chips and subcollection views.

---

## 5. Cloudflare Serverless Edge Deployment (Zero Local Server)

Unlike traditional setups requiring a local Docker container and Cloudflare Tunnel:

1. **Configure `wrangler.jsonc`**:
   ```jsonc
   {
     "name": "tapgreetings",
     "compatibility_date": "2026-11-03",
     "assets": {
       "directory": ".",
       "html_handling": "auto-trailing-slash",
       "exclude": [".git", "node_modules", "dlimages", "scripts", "theme"]
     }
   }
   ```
2. **DNS Setup**:
   * Apex domain: `AAAA tapgreetings.com -> 100::` (Proxied via Cloudflare Edge)
   * Subdomain: `CNAME www.tapgreetings.com -> tapgreetings.com` (Proxied)
3. **Deploy with Wrangler**:
   ```powershell
   $env:CLOUDFLARE_API_KEY = "your-api-key"
   $env:CLOUDFLARE_EMAIL = "your-email@domain.com"
   $env:CLOUDFLARE_ACCOUNT_ID = "your-account-id"
   npx.cmd wrangler deploy
   ```
4. **Worker Route**:
   Route `*.tapgreetings.com/*` and `tapgreetings.com/*` to Worker `tapgreetings`.

The site is served directly from Cloudflare's global edge cache (<20ms response worldwide) with **100% uptime** and **zero dependency on local servers or tunnels**.
