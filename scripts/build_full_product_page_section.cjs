const fs = require('fs');
const path = require('path');

const holidayOfficial = require('../data/holiday_series_official.json');
const setSectionPath = path.join(__dirname, '../theme/sections/tapgreetings-product-page.liquid');

// Create the complete lively themed product section
const sectionCode = `{% comment %}
  TapGreetings: Official Themed Product Sales & Keepsake Page
  Supports Happy Holidays Series 1 & 2 (001-016) and Series 3: Solstice Magic (017-024)
  Features:
    - 9:16 Portrait and 16:9 Landscape Video Hero with persistent sound
    - Exciting Animated Living Creed / Motto Card
    - Animated Special Abilities & Features Card
    - Animated Sonar NFC Tap Target Motif Card
    - Animated Power Stats Indicator Meters
    - 3D Interactive CR80 Credit Card Flip
    - Add to Cart, Quantity Selector, and Live Web Experience Links
{% endcomment %}

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Inter:wght@400;500;600;700;800&family=Outfit:wght@600;700;800;900&family=Playfair+Display:ital,wght@0,700;1,700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

{% assign card_code = '001' %}
{% assign is_landscape = false %}
{% assign is_solstice = false %}

{% for tag in product.tags %}
  {% if tag contains 'card-' %}
    {% assign card_code = tag | remove: 'card-' %}
  {% elsif tag contains '#' %}
    {% assign tag_parts = tag | split: '#' %}
    {% if tag_parts.size > 1 %}
      {% assign card_code = tag_parts[1] | strip %}
    {% endif %}
  {% endif %}
{% endfor %}

{% if card_code == '001' and product.title contains '#' %}
  {% assign title_parts = product.title | split: '#' %}
  {% assign num_part = title_parts[1] | split: ' ' %}
  {% assign card_code = num_part[0] | strip %}
{% endif %}

{% assign card_num = card_code | plus: 0 %}

{% if card_num >= 17 %}
  {% assign is_solstice = true %}
{% endif %}

{% if card_code == '021' or card_code == '023' or card_code == '024' %}
  {% assign is_landscape = true %}
{% endif %}

{% assign front_img_url = 'https://tapgreetings.com/assets/img/cr80/' | append: card_code | append: '-front.jpg?v=cr80' %}
{% assign back_img_url = 'https://tapgreetings.com/assets/img/cr80/' | append: card_code | append: '-back.jpg?v=cr80' %}
{% assign video_url = 'https://tapgreetings.com/assets/video/' | append: card_code | append: '-video.mp4' %}
{% assign tap_demo_url = 'https://tapgreetings.com/multimedia/card_01_tap.mp4' %}
{% assign web_portal_url = 'https://tapgreetings.com/' | append: card_code | append: '/' %}
{% assign shopify_entertainment_page_url = 'https://shop.tapthingy.com/pages/tghh' | append: card_code %}

<style>
  .tg-product-wrapper {
    font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: {% if is_solstice %}radial-gradient(ellipse at top, #0A1128 0%, #060913 70%, #03050A 100%){% else %}#140C08{% endif %};
    color: #FFF8E7;
    min-height: 100vh;
    padding: 20px 16px 60px;
    box-sizing: border-box;
  }
  .tg-container {
    max-width: 680px;
    margin: 0 auto;
    position: relative;
    background: {% if is_solstice %}rgba(10, 17, 40, 0.85){% else %}rgba(20, 12, 8, 0.9){% endif %};
    border: 2px solid {% if is_solstice %}rgba(16, 185, 129, 0.45){% else %}rgba(251, 191, 36, 0.4){% endif %};
    border-radius: 28px;
    padding: 24px 18px 40px;
    box-shadow: 0 12px 50px rgba(0,0,0,0.7), 0 0 35px {% if is_solstice %}rgba(16, 185, 129, 0.22){% else %}rgba(251, 191, 36, 0.18){% endif %};
    overflow: hidden;
  }
  .tg-corner {
    position: absolute;
    color: {% if is_solstice %}#34D399{% else %}#FBBF24{% endif %};
    font-size: 14px;
    opacity: 0.85;
    text-shadow: 0 0 8px {% if is_solstice %}#34D399{% else %}#FBBF24{% endif %};
    user-select: none;
    animation: cornerTwinkle 3s ease-in-out infinite alternate;
  }
  @keyframes cornerTwinkle {
    0% { opacity: 0.35; transform: scale(0.85); }
    100% { opacity: 1; transform: scale(1.22); filter: drop-shadow(0 0 8px {% if is_solstice %}#34D399{% else %}#FBBF24{% endif %}); }
  }

  /* Video Hero Box */
  .tg-media-box {
    position: relative;
    width: 100%;
    max-width: {% if is_landscape %}580px{% else %}440px{% endif %};
    margin: 0 auto 16px;
    border-radius: 22px;
    overflow: hidden;
    background: #000;
    aspect-ratio: {% if is_landscape %}16 / 9{% else %}9 / 16{% endif %};
    border: 2.5px solid {% if is_solstice %}#10B981{% else %}#FBBF24{% endif %};
    box-shadow: 0 10px 40px rgba(0,0,0,0.8), 0 0 25px {% if is_solstice %}rgba(16, 185, 129, 0.35){% else %}rgba(251, 191, 36, 0.25){% endif %};
  }
  .tg-media-box.is-card {
    aspect-ratio: 53.98 / 85.60;
    max-width: 320px;
  }
  .tg-slide {
    width: 100%;
    height: 100%;
    display: none;
    position: relative;
  }
  .tg-slide.active-slide {
    display: block;
  }
  .tg-slide video, .tg-slide img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .tg-sound-toggle-btn {
    position: absolute;
    bottom: 14px;
    right: 14px;
    z-index: 10;
    background: rgba(10, 17, 40, 0.85);
    border: 1.5px solid {% if is_solstice %}#10B981{% else %}#FBBF24{% endif %};
    color: {% if is_solstice %}#10B981{% else %}#FBBF24{% endif %};
    border-radius: 50%;
    width: 46px;
    height: 46px;
    font-size: 1.25rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(6px);
    transition: transform 0.2s, background 0.2s;
  }
  .tg-sound-toggle-btn:hover {
    transform: scale(1.1);
    background: rgba(251, 191, 36, 0.2);
  }

  /* Thumbnails */
  .tg-thumb-reel {
    display: flex;
    gap: 8px;
    justify-content: center;
    margin: 0 auto 18px;
    max-width: 440px;
  }
  .tg-thumb-btn {
    flex: 1;
    max-width: 80px;
    height: 64px;
    border-radius: 12px;
    background: rgba(255,255,255,0.05);
    border: 2px solid {% if is_solstice %}rgba(16, 185, 129, 0.3){% else %}rgba(251, 191, 36, 0.3){% endif %};
    cursor: pointer;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #FFF;
    font-size: 0.72rem;
    font-weight: 700;
    transition: transform 0.2s, border-color 0.2s;
  }
  .tg-thumb-btn.active {
    border-color: {% if is_solstice %}#10B981{% else %}#FBBF24{% endif %};
    background: rgba(251, 191, 36, 0.15);
    transform: translateY(-2px);
  }
  .tg-thumb-btn img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* Badge and Header */
  .tg-header-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: {% if is_solstice %}linear-gradient(135deg, #0F172A, #065F46, #047857, #10B981, #0F172A){% else %}linear-gradient(90deg, #9E1B32, #D62839){% endif %};
    color: #FFFFFF;
    padding: 6px 18px;
    border-radius: 999px;
    font-weight: 800;
    font-size: 0.82rem;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    box-shadow: 0 4px 15px rgba(0,0,0,0.4);
    margin-bottom: 12px;
    border: 1px solid rgba(255,255,255,0.2);
  }
  .tg-title {
    font-family: 'Playfair Display', serif;
    font-size: 2.2rem;
    font-weight: 900;
    color: #FFFFFF;
    margin: 4px 0 6px;
    text-align: center;
    text-shadow: 0 2px 10px rgba(0,0,0,0.5);
  }
  .tg-subtitle {
    font-size: 1.05rem;
    color: {% if is_solstice %}#10B981{% else %}#FBBF24{% endif %};
    font-weight: 700;
    font-style: italic;
    text-align: center;
  }
  .tg-series-tag {
    font-size: 0.78rem;
    color: #D1BDB0;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin-top: 4px;
    text-align: center;
  }

  /* Quick Nav */
  .tg-nav-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 14px 0;
    font-size: 0.88rem;
    font-weight: 700;
  }
  .tg-nav-row a {
    color: {% if is_solstice %}#10B981{% else %}#FBBF24{% endif %};
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  /* Animated Creed */
  .tghh-quote-card {
    position: relative;
    background: {% if is_solstice %}radial-gradient(circle at 50% 0%, rgba(16,185,129,0.18), rgba(10,17,40,0.95) 75%){% else %}radial-gradient(circle at 50% 0%, rgba(251,191,36,0.18), rgba(20,12,8,0.95) 75%){% endif %};
    border: 1.5px solid {% if is_solstice %}rgba(16,185,129,0.5){% else %}rgba(251,191,36,0.5){% endif %};
    border-radius: 20px;
    padding: 24px 20px 20px;
    margin: 22px 0 18px;
    text-align: center;
    box-shadow: 0 0 25px {% if is_solstice %}rgba(16,185,129,0.2){% else %}rgba(251,191,36,0.2){% endif %};
  }
  .tghh-quote-badge {
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    background: {% if is_solstice %}linear-gradient(90deg, #059669, #10B981){% else %}linear-gradient(90deg, #F59E0B, #E65100){% endif %};
    color: #FFFFFF;
    font-size: 0.72rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    padding: 3px 14px;
    border-radius: 999px;
  }
  .tghh-quote-text {
    font-size: 1.25rem;
    font-weight: 700;
    color: #FFFDF8;
    line-height: 1.55;
    font-style: italic;
  }

  /* Animated Ability */
  .tghh-ability-card {
    background: {% if is_solstice %}linear-gradient(135deg, rgba(16,185,129,0.1), rgba(10,17,40,0.8)){% else %}linear-gradient(135deg, rgba(251,191,36,0.08), rgba(20,12,8,0.7)){% endif %};
    border: 1.5px solid {% if is_solstice %}rgba(16,185,129,0.35){% else %}rgba(251,191,36,0.35){% endif %};
    border-radius: 20px;
    padding: 18px 20px;
    margin: 18px 0;
  }
  .tghh-ability-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: {% if is_solstice %}#10B981{% else %}#FBBF24{% endif %};
    font-weight: 800;
    margin-bottom: 8px;
  }
  .tghh-ability-body {
    font-size: 1.02rem;
    line-height: 1.6;
    color: #FFF8E7;
  }

  /* Animated Sonar NFC */
  .tghh-nfc-card {
    background: {% if is_solstice %}linear-gradient(135deg, rgba(15,23,42,0.9), rgba(6,78,59,0.4)){% else %}linear-gradient(135deg, rgba(20,12,8,0.9), rgba(158,27,50,0.3)){% endif %};
    border: 1.5px solid {% if is_solstice %}rgba(16,185,129,0.4){% else %}rgba(251,191,36,0.35){% endif %};
    border-radius: 20px;
    padding: 16px 20px;
    margin: 18px 0;
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .tghh-nfc-sonar {
    width: 48px;
    height: 48px;
    min-width: 48px;
    border-radius: 50%;
    background: {% if is_solstice %}radial-gradient(circle, #10B981 0%, #064E3B 100%){% else %}radial-gradient(circle, #FBBF24 0%, #B45309 100%){% endif %};
    display: flex;
    align-items: center;
    justify-content: center;
    color: #FFFFFF;
    font-size: 1.35rem;
    animation: sonarPulse 2s infinite ease-out;
  }
  @keyframes sonarPulse {
    0% { transform: scale(0.96); box-shadow: 0 0 0 0 {% if is_solstice %}rgba(16,185,129,0.7){% else %}rgba(251,191,36,0.7){% endif %}; }
    70% { transform: scale(1.04); box-shadow: 0 0 0 14px rgba(0,0,0,0); }
    100% { transform: scale(0.96); box-shadow: 0 0 0 0 rgba(0,0,0,0); }
  }

  /* Animated Indicators Grid */
  .tghh-indicators-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
    gap: 12px;
    margin: 20px 0;
  }
  .tghh-stat-tile {
    background: {% if is_solstice %}rgba(10,17,40,0.7){% else %}rgba(20,12,8,0.7){% endif %};
    border: 1px solid {% if is_solstice %}rgba(16,185,129,0.3){% else %}rgba(251,191,36,0.3){% endif %};
    border-radius: 16px;
    padding: 12px 14px;
    text-align: center;
  }
  .tghh-stat-name {
    font-size: 0.72rem;
    text-transform: uppercase;
    color: {% if is_solstice %}#10B981{% else %}#FBBF24{% endif %};
    font-weight: 800;
  }
  .tghh-star-row {
    display: inline-flex;
    gap: 2px;
    margin: 4px 0 6px;
  }
  .tghh-star-anim {
    display: inline-block;
    font-size: 0.95rem;
    color: {% if is_solstice %}#34D399{% else %}#FBBF24{% endif %};
    animation: starTwinkle 2.4s infinite ease-in-out;
  }
  .tghh-meter-bg {
    width: 100%;
    height: 4px;
    background: rgba(255,255,255,0.08);
    border-radius: 999px;
    overflow: hidden;
  }
  .tghh-meter-fill {
    height: 100%;
    background: {% if is_solstice %}linear-gradient(90deg, #059669, #10B981, #34D399){% else %}linear-gradient(90deg, #D62839, #F59E0B){% endif %};
    border-radius: 999px;
  }

  /* 3D Physical Card Flip */
  .tghh-card-flip-wrap {
    perspective: 1000px;
    width: 100%;
    max-width: 320px;
    aspect-ratio: 53.98/85.60;
    margin: 16px auto;
    cursor: pointer;
  }
  .tghh-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    transform-style: preserve-3d;
  }
  .tghh-card-flip-wrap.flipped .tghh-card-inner {
    transform: rotateY(180deg);
  }
  .tghh-card-face {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border-radius: 16px;
    overflow: hidden;
    border: 2px solid {% if is_solstice %}#10B981{% else %}#FBBF24{% endif %};
    box-shadow: 0 8px 30px rgba(0,0,0,0.6);
  }
  .tghh-card-face img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .tghh-card-back {
    transform: rotateY(180deg);
  }

  /* Add to Cart CTA */
  .tg-atc-section {
    margin-top: 28px;
    padding-top: 20px;
    border-top: 1px solid rgba(255,255,255,0.12);
    text-align: center;
  }
  .tg-atc-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    max-width: 440px;
    background: {% if is_solstice %}linear-gradient(90deg, #047857, #10B981, #059669){% else %}linear-gradient(90deg, #D62839, #E65100){% endif %};
    color: #FFFFFF;
    border: none;
    padding: 16px 24px;
    border-radius: 30px;
    font-size: 1.1rem;
    font-weight: 900;
    cursor: pointer;
    box-shadow: 0 6px 25px {% if is_solstice %}rgba(16,185,129,0.45){% else %}rgba(214,40,57,0.45){% endif %};
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .tg-atc-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px {% if is_solstice %}rgba(16,185,129,0.6){% else %}rgba(214,40,57,0.6){% endif %};
  }
  .tg-live-link-box {
    margin-top: 18px;
    text-align: center;
  }
  .tg-live-link-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(255,255,255,0.08);
    border: 1.5px solid {% if is_solstice %}#10B981{% else %}#FBBF24{% endif %};
    color: {% if is_solstice %}#10B981{% else %}#FBBF24{% endif %};
    padding: 10px 20px;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 800;
    text-decoration: none;
    transition: transform 0.2s;
  }
  .tg-live-link-btn:hover {
    transform: scale(1.04);
  }
</style>

<div class="tg-product-wrapper">
  <div class="tg-container">
    <div class="tg-corner" style="top: 14px; left: 16px;">&#10022;</div>
    <div class="tg-corner" style="top: 14px; right: 16px;">&#10022;</div>
    <div class="tg-corner" style="bottom: 14px; left: 16px;">&#10022;</div>
    <div class="tg-corner" style="bottom: 14px; right: 16px;">&#10022;</div>

    <!-- 1. Top Video First (Entertainment Hero) -->
    <div id="tg-media-box" class="tg-media-box is-video">
      <div id="tg-slide-1" class="tg-slide active-slide">
        <video id="tg-hero-video" loop muted playsinline autoplay poster="{{ front_img_url }}">
          <source src="{{ video_url }}" type="video/mp4">
        </video>
        <button id="tg-sound-btn" class="tg-sound-toggle-btn" onclick="toggleTgSound()" title="Toggle Audio">
          &#128264;
        </button>
      </div>

      <div id="tg-slide-2" class="tg-slide">
        <img src="{{ front_img_url }}" alt="{{ product.title }} Front Artwork" loading="lazy">
      </div>

      <div id="tg-slide-3" class="tg-slide">
        <img src="{{ back_img_url }}" alt="{{ product.title }} Back Design & NFC Antenna" loading="lazy">
      </div>

      <div id="tg-slide-4" class="tg-slide">
        <video id="tg-tap-video" loop muted playsinline poster="{{ front_img_url }}">
          <source src="{{ tap_demo_url }}" type="video/mp4">
        </video>
      </div>
    </div>

    <!-- 4 Media Thumbnails -->
    <div class="tg-thumb-reel">
      <button class="tg-thumb-btn active" onclick="switchTgSlide(1)" title="Stop-Motion Video">
        <span style="font-size: 1.2rem;">&#9654;</span>
        <span>Video</span>
      </button>
      <button class="tg-thumb-btn" onclick="switchTgSlide(2)" title="Front Artwork">
        <img src="{{ front_img_url }}" alt="Front Thumbnail">
      </button>
      <button class="tg-thumb-btn" onclick="switchTgSlide(3)" title="Collector Back">
        <img src="{{ back_img_url }}" alt="Back Thumbnail">
      </button>
      <button class="tg-thumb-btn" onclick="switchTgSlide(4)" title="Mobile Tap Demo">
        <span style="font-size: 1.2rem;">&#128246;</span>
        <span>Tap Demo</span>
      </button>
    </div>

    <!-- Header Section -->
    <div style="text-align: center; margin: 20px 0 14px;">
      <div class="tg-header-badge">
        &#10022; {% if is_solstice %}Series 3: Solstice Magic{% else %}TapGreetings Series 1{% endif %} &bull; Card #{{ card_code }} of 024 &#10022;
      </div>
      <h1 class="tg-title" id="tg-dyn-title">
        {{ product.title | split: ' - ' | first }}
      </h1>
      <div class="tg-subtitle" id="tg-dyn-subtitle">
        {% if is_solstice %}The Celestial Clockwork Solstice{% else %}Handcrafted Polymer Clay &amp; Needle Felt{% endif %}
      </div>
      <div class="tg-series-tag" id="tg-dyn-craft">
        Smart NFC Video Keepsake Card &bull; Instant Phone Tap
      </div>
    </div>

    <!-- 2. EXCITING ANIMATED MOTTO / LIVING CREED -->
    <div class="tghh-quote-card">
      <span class="tghh-quote-badge">&#10022; Official Keepsake Motto &#10022;</span>
      <div class="tghh-quote-text" id="tg-dyn-motto">
        &ldquo;{{ product.description | strip_html | truncate: 120 }}&rdquo;
      </div>
    </div>

    <!-- 3. ANIMATED SPECIAL ABILITIES & FEATURES -->
    <div class="tghh-ability-card">
      <div class="tghh-ability-header">
        <span style="font-size: 1.1rem;">&#10024;</span> Special Abilities &amp; Features
      </div>
      <div class="tghh-ability-body" id="tg-dyn-abilities">
        Tap against any smartphone to stream the 1080p stop-motion animation and voice greeting instantly.
      </div>
    </div>

    <!-- 4. ANIMATED NFC TAP TARGET MOTIF -->
    <div class="tghh-nfc-card">
      <div class="tghh-nfc-sonar">
        &#128246;
      </div>
      <div>
        <div style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 1.5px; color: {% if is_solstice %}#10B981{% else %}#FBBF24{% endif %}; font-weight: 800; margin-bottom: 2px;">
          NFC Tap Target Motif
        </div>
        <div style="font-size: 0.95rem; color: #FFF; font-weight: 600;" id="tg-dyn-nfc-motif">
          Embedded NTAG215 Microchip &bull; Tap the icon on the card reverse.
        </div>
      </div>
    </div>

    <!-- 5. POWER INDICATORS -->
    <div style="margin: 22px 0 16px;">
      <div style="text-align: center; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 2px; color: {% if is_solstice %}#10B981{% else %}#FBBF24{% endif %}; font-weight: 800; margin-bottom: 10px;">
        &#10022; Keepsake Power Stats &#10022;
      </div>
      <div class="tghh-indicators-grid" id="tg-dyn-indicators">
        <!-- Rendered dynamically by JS from CARD_LORE_MAP -->
      </div>
    </div>

    <!-- 6. Physical Keepsake 3D Card Flip (CR80) -->
    <div style="text-align: center; margin: 24px 0 10px;">
      <div style="font-size: 0.85rem; font-weight: 700; color: {% if is_solstice %}#10B981{% else %}#FBBF24{% endif %}; margin-bottom: 6px;">
        &#128179; Physical Smart Keepsake Card (Click to Flip Front/Back)
      </div>
      <div class="tghh-card-flip-wrap" onclick="this.classList.toggle('flipped')" title="Click to Flip">
        <div class="tghh-card-inner">
          <div class="tghh-card-face tghh-card-front">
            <img id="tg-flip-front" src="{{ front_img_url }}" alt="{{ product.title }} Front Card" loading="lazy">
          </div>
          <div class="tghh-card-face tghh-card-back">
            <img id="tg-flip-back" src="{{ back_img_url }}" alt="{{ product.title }} Back Card & NFC Target" loading="lazy">
          </div>
        </div>
      </div>
      <div style="font-size: 0.75rem; color: #D1BDB0;">
        Standard CR80 30mil Waterproof PVC &bull; Embedded NTAG215 Microchip
      </div>
    </div>

    <!-- 7. Rewritable NFC Microchip Feature -->
    <div style="background: {% if is_solstice %}rgba(16,185,129,0.07){% else %}rgba(251,191,36,0.06){% endif %}; border: 1px solid {% if is_solstice %}rgba(16,185,129,0.3){% else %}rgba(251,191,36,0.25){% endif %}; border-radius: 16px; padding: 14px 18px; margin: 20px 0; font-size: 0.85rem; line-height: 1.6; color: #D1BDB0;">
      <strong style="color: {% if is_solstice %}#10B981{% else %}#FBBF24{% endif %};">&#10024; Rewritable NFC Microchip:</strong> This physical card comes pre-linked to this exclusive video portal, but can be reprogrammed anytime to link to your own family video, audio note, or custom greeting using our free tool at <a href="/pages/tap-thingy-tools-nfc-reprogram-webtool-and-guide" style="color: {% if is_solstice %}#10B981{% else %}#FBBF24{% endif %}; font-weight: 700; text-decoration: underline;">/tools</a>.
    </div>

    <!-- 8. Single Elegant Add to Cart Section -->
    <div class="tg-atc-section">
      <div style="font-size: 0.82rem; color: #34D399; font-weight: 700; margin-bottom: 12px;">
        &#10004; In Stock &bull; Collectible Smart Card Ready to Ship
      </div>
      {% form 'product', product, id: 'tg-buy-form' %}
        <input type="hidden" name="id" value="{{ product.selected_or_first_available_variant.id }}">
        <div style="display: flex; gap: 10px; justify-content: center; align-items: center; margin-bottom: 14px;">
          <label style="font-size: 0.9rem; font-weight: 700;">Qty:</label>
          <input type="number" name="quantity" value="1" min="1" style="width: 70px; background: rgba(255,255,255,0.08); border: 1.5px solid {% if is_solstice %}#10B981{% else %}#FBBF24{% endif %}; color: #FFF; padding: 8px 12px; border-radius: 12px; text-align: center; font-weight: 800;">
        </div>
        <button type="submit" name="add" class="tg-atc-btn">
          <span>&#128722; Order Physical Keepsake Card &bull; {{ product.selected_or_first_available_variant.price | money }}</span>
        </button>
      {% endform %}
    </div>

    <!-- 9. Live Web Experience Link -->
    <div class="tg-live-link-box">
      <a href="{{ shopify_entertainment_page_url }}" target="_blank" class="tg-live-link-btn">
        <i class="fa-solid fa-sparkles"></i> <span>View Interactive Live Web Experience &rarr;</span>
      </a>
    </div>

  </div>
</div>

<script>
  var CARD_LORE_MAP = ${JSON.stringify(holidayOfficial, null, 2)};

  function populateCardLore() {
    var code = '{{ card_code }}';
    var data = CARD_LORE_MAP[code];
    if (!data) return;

    var mottoEl = document.getElementById('tg-dyn-motto');
    var abilitiesEl = document.getElementById('tg-dyn-abilities');
    var nfcMotifEl = document.getElementById('tg-dyn-nfc-motif');
    var indicatorsEl = document.getElementById('tg-dyn-indicators');

    if (mottoEl && data.motto) mottoEl.innerHTML = '&ldquo;' + data.motto + '&rdquo;';
    if (abilitiesEl && data.abilities) abilitiesEl.innerHTML = data.abilities;
    if (nfcMotifEl && data.nfcMotif) nfcMotifEl.innerHTML = data.nfcMotif;

    if (indicatorsEl && data.indicators && data.indicators.length > 0) {
      var html = '';
      data.indicators.forEach(function(ind) {
        var score = ind.score || 5;
        html += '<div class="tghh-stat-tile">';
        html += '<div class="tghh-stat-name">' + ind.name + '</div>';
        html += '<div class="tghh-star-row">';
        for (var s = 0; s < 4; s++) {
          html += '<span class="tghh-star-anim">&#9733;</span>';
        }
        html += '<span class="tghh-star-anim">' + (score >= 5 ? '&#9733;' : '&#9734;') + '</span>';
        html += '</div>';
        html += '<div class="tghh-meter-bg">';
        html += '<div class="tghh-meter-fill" style="width: ' + (score * 20) + '%;"></div>';
        html += '</div></div>';
      });
      indicatorsEl.innerHTML = html;
    }
  }

  function switchTgSlide(index) {
    var mediaBox = document.getElementById('tg-media-box');
    var slides = document.querySelectorAll('.tg-slide');
    var thumbs = document.querySelectorAll('.tg-thumb-btn');

    if (mediaBox) {
      if (index === 1 || index === 4) {
        mediaBox.classList.remove('is-card');
        mediaBox.classList.add('is-video');
      } else {
        mediaBox.classList.remove('is-video');
        mediaBox.classList.add('is-card');
      }
    }

    slides.forEach(function(s, i) {
      if (i === (index - 1)) {
        s.classList.add('active-slide');
      } else {
        s.classList.remove('active-slide');
      }
    });

    thumbs.forEach(function(t, i) {
      if (i === (index - 1)) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });

    var heroVideo = document.getElementById('tg-hero-video');
    var tapVideo = document.getElementById('tg-tap-video');

    if (heroVideo) {
      if (index === 1) { heroVideo.play().catch(function(){}); } else { heroVideo.pause(); }
    }
    if (tapVideo) {
      if (index === 4) { tapVideo.play().catch(function(){}); } else { tapVideo.pause(); }
    }
  }

  function toggleTgSound() {
    var video = document.getElementById('tg-hero-video');
    var btn = document.getElementById('tg-sound-btn');
    if (!video) return;

    if (video.muted) {
      video.muted = false;
      localStorage.setItem('tg_sound', 'unmuted');
      if (btn) btn.innerHTML = '&#128266;';
    } else {
      video.muted = true;
      localStorage.setItem('tg_sound', 'muted');
      if (btn) btn.innerHTML = '&#128264;';
    }
  }

  (function initTgSound() {
    var saved = localStorage.getItem('tg_sound');
    var video = document.getElementById('tg-hero-video');
    var btn = document.getElementById('tg-sound-btn');
    if (saved === 'unmuted' && video) {
      video.muted = false;
      if (btn) btn.innerHTML = '&#128266;';
    }
  })();

  document.addEventListener('DOMContentLoaded', function() {
    populateCardLore();
  });
</script>
`;

fs.writeFileSync(setSectionPath, sectionCode, 'utf8');
console.log('? Successfully generated new lively themed tapgreetings-product-page.liquid!');
