const fs = require('fs');
const path = require('path');

const genCardsPath = path.join(__dirname, 'generate_cards.cjs');
let code = fs.readFileSync(genCardsPath, 'utf8');

// 1. Add matching immersion CSS in <style>
const extraStyles = `
        /* Centered Luxury Card Immersion Layout (Matches shop.tapthingy.com/pages) */
        .tghh-experience-wrap {
            font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background: #140C08 !important;
            color: #FFF8E7 !important;
            border-radius: 28px !important;
            padding: 24px 16px 40px !important;
            max-width: 680px !important;
            margin: 12px auto 36px !important;
            box-shadow: 0 12px 50px rgba(0,0,0,0.7), 0 0 35px rgba(251,191,36,0.18) !important;
            border: 2px solid rgba(251,191,36,0.4) !important;
            position: relative;
            overflow: hidden;
        }
        @media (min-width: 640px) {
            .tghh-experience-wrap {
                padding: 32px 24px 48px !important;
            }
        }
        .tghh-corner {
            position: absolute;
            color: #FBBF24;
            font-size: 14px;
            opacity: 0.85;
            text-shadow: 0 0 8px rgba(251,191,36,0.7);
            user-select: none;
            animation: cornerTwinkle 3s ease-in-out infinite alternate;
        }
        .tghh-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: linear-gradient(135deg, #9E1B32, #D62839, #E65100, #FBBF24, #9E1B32) !important;
            background-size: 300% 300% !important;
            animation: badgeSweep 6s ease infinite !important;
            color: #FFFFFF !important;
            padding: 7px 20px;
            border-radius: 999px;
            font-weight: 800;
            font-size: 0.82rem;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            box-shadow: 0 4px 18px rgba(214,40,57,0.45);
            margin-bottom: 12px;
        }
        .tghh-dyn-title {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 2.3rem;
            font-weight: 900;
            color: #FFFFFF !important;
            margin: 4px 0 6px;
            line-height: 1.2;
            text-shadow: 0 2px 12px rgba(0,0,0,0.6);
        }
        @media (min-width: 640px) {
            .tghh-dyn-title {
                font-size: 2.8rem;
            }
        }
        .tghh-dyn-subtitle {
            font-size: 1.05rem;
            color: #FBBF24 !important;
            font-weight: 700;
            margin-bottom: 18px;
        }
        .tghh-video-box {
            position: relative;
            width: 100%;
            max-width: 440px;
            margin: 0 auto 16px;
            border-radius: 22px;
            overflow: hidden;
            background: #000;
            aspect-ratio: 9/16;
            border: 2.5px solid #FBBF24;
            box-shadow: 0 10px 40px rgba(0,0,0,0.8), 0 0 25px rgba(251,191,36,0.25);
            animation: mediaAuraPulse 4s ease-in-out infinite;
        }
        .tghh-video-box video {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }
        .tghh-sound-btn {
            position: absolute;
            bottom: 14px;
            right: 14px;
            z-index: 10;
            background: rgba(20,12,8,0.85);
            border: 1.5px solid #FBBF24;
            color: #FBBF24;
            border-radius: 50%;
            width: 44px;
            height: 44px;
            font-size: 1.15rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(6px);
            transition: transform 0.2s;
        }
        .tghh-sound-btn:hover {
            transform: scale(1.1);
        }
        .tghh-nav-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 12px 0 16px;
            padding: 0 4px;
            font-size: 0.9rem;
            font-weight: 700;
        }
        .tghh-nav-row a {
            color: #FBBF24;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 6px 12px;
            border-radius: 12px;
            background: rgba(255,255,255,0.04);
            border: 1px solid rgba(251,191,36,0.25);
            transition: background 0.2s, transform 0.2s;
        }
        .tghh-nav-row a:hover {
            background: rgba(251,191,36,0.15);
            transform: translateY(-1px);
        }
        .tghh-lore-card {
            background: rgba(255,255,255,0.03) !important;
            border: 1px solid rgba(251,191,36,0.2) !important;
            border-radius: 18px;
            padding: 18px;
            margin: 18px 0;
            font-size: 0.95rem;
            line-height: 1.65;
            color: #FFF8E7;
        }
        .tghh-card-flip-wrap {
            perspective: 1000px;
            width: 100%;
            max-width: 320px;
            aspect-ratio: 53.98/85.60;
            margin: 18px auto;
            cursor: pointer;
        }
        .tghh-card-inner {
            position: relative;
            width: 100%;
            height: 100%;
            transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            transform-style: preserve-3d;
        }
        .tghh-card-inner.flipped {
            transform: rotateY(180deg);
        }
        .tghh-card-face {
            position: absolute;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            border-radius: 16px;
            overflow: hidden;
            border: 2px solid #FBBF24;
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
        .tghh-atc-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            width: 100%;
            max-width: 440px;
            background: linear-gradient(135deg, #9E1B32, #D62839, #E65100, #FBBF24, #D62839) !important;
            background-size: 250% 250% !important;
            animation: btnGlowShimmer 4s ease infinite !important;
            color: #FFFFFF !important;
            border: none;
            padding: 16px 24px;
            border-radius: 30px;
            font-size: 1.15rem;
            font-weight: 900;
            cursor: pointer;
            text-decoration: none;
            box-shadow: 0 6px 25px rgba(214,40,57,0.45);
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .tghh-atc-btn:hover {
            transform: translateY(-2px) scale(1.02);
            box-shadow: 0 8px 35px rgba(214,40,57,0.8), 0 0 30px rgba(251,191,36,0.6);
        }
`;

if (!code.includes('.tghh-experience-wrap {')) {
  code = code.replace('</style>', `${extraStyles}\n    </style>`);
}

// 2. Locate cardPageHtml in generate_cards.cjs and replace the main body layout
const oldMainRegex = /<main class="w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-8 flex-grow">[\s\S]*?<\/main>/;

const newMainHtml = `<main class="w-full max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-8 flex-grow">
        <!-- Luxury Centered Card Immersion Frame (Matches shop.tapthingy.com/pages) -->
        <div class="tghh-experience-wrap">
            <!-- 4 Corner Starburst Accents -->
            <div class="tghh-corner" style="top: 14px; left: 16px;">&#10022;</div>
            <div class="tghh-corner" style="top: 14px; right: 16px;">&#10022;</div>
            <div class="tghh-corner" style="bottom: 14px; left: 16px;">&#10022;</div>
            <div class="tghh-corner" style="bottom: 14px; right: 16px;">&#10022;</div>

            <!-- 1. Top Video First (Entertainment Hero) -->
            <div class="tghh-video-box" onclick="toggleMute()">
                <video id="cardVideo" autoplay loop playsinline poster="\${frontImg}">
                    <source src="\${videoSrc}" type="video/mp4">
                    Your browser does not support HTML5 video.
                </video>
                <button class="tghh-sound-btn" onclick="event.stopPropagation(); toggleMute();" id="soundToggleBtn" title="Toggle Sound">
                    <i id="muteIcon" class="fa-solid fa-volume-high"></i>
                </button>
            </div>

            <!-- 2. Quick Nav Row Directly Beneath Video -->
            <div class="tghh-nav-row">
                <a href="/\${prevCard.card_code}/" onclick="preserveAudio(this, event)">
                    <i class="fa-solid fa-arrow-left"></i> #\${prevCard.card_code} Prev
                </a>
                <span style="font-size: 0.85rem; color: #D1BDB0; text-transform: uppercase; letter-spacing: 1px; font-weight: 800;">
                    #\${card.card_code} of 016
                </span>
                <a href="/\${nextCard.card_code}/" onclick="preserveAudio(this, event)">
                    Next #\${nextCard.card_code} <i class="fa-solid fa-arrow-right"></i>
                </a>
            </div>

            <!-- 3. Header Section -->
            <div style="text-align: center; margin: 20px 0 16px;">
                <div class="tghh-badge">
                    &#10022; TapGreetings Series 1 &bull; Card #\${card.card_code} of 016 &#10022;
                </div>
                <h1 class="tghh-dyn-title">
                    \${char.name}
                </h1>
                <div class="tghh-dyn-subtitle">
                    \${char.title} &bull; <span style="font-style: italic; color: #FDE68A;">\${char.profile_theme || card.series_name || 'Happy Holidays Series 1'}</span>
                </div>
            </div>

            <!-- 4. Living Creed / Motto Card -->
            \${renderLivingCreed(char)}

            <!-- 5. Lore & Backstory Card -->
            <div class="tghh-lore-card">
                <div style="font-size: 0.78rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: #FBBF24; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                    <span>&#10022;</span> <span>Artisan Craft &amp; Lore</span>
                </div>
                <p style="margin: 0 0 12px; font-size: 0.98rem; line-height: 1.7; color: #FFF8E7;">
                    \${char.micro_lore || char.description || ''}
                </p>
                <p style="margin: 0; font-size: 0.9rem; color: #D1BDB0;">
                    <strong style="color: #FBBF24;">Signature Motif:</strong> \${char.nfcMotif || char.signature_motif || 'Handcrafted detail & golden foil.'}
                </p>
            </div>

            <!-- 6. Festive Indicators Stats Row -->
            \${char.officialIndicators ? renderOfficialIndicators(char.officialIndicators) : renderIndicators(char.indicators)}

            <!-- 7. Interactive Physical Keepsake 3D Card Flip (Front / Back) -->
            <div style="text-align: center; margin: 24px 0 16px;">
                <div style="font-size: 0.85rem; font-weight: 700; color: #FBBF24; margin-bottom: 8px; display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <span><i class="fa-solid fa-id-card text-rose-400"></i> Physical CR80 Smart Card</span>
                    <button onclick="openCardZoom()" class="bg-[#241710] hover:bg-[#301F15] text-amber-300 text-xs font-bold px-3 py-1 rounded-xl border border-amber-600/40 inline-flex items-center gap-1.5 transition-all shadow">
                        <i class="fa-solid fa-expand text-rose-400"></i> Zoom
                    </button>
                </div>
                <div class="tghh-card-flip-wrap" onclick="toggleCardFlip()" title="Click to Flip Front/Back">
                    <div id="physicalCard3d" class="tghh-card-inner">
                        <div class="tghh-card-face tghh-card-front">
                            <img src="\${frontImg}" alt="\${char.name} Front Artwork" loading="lazy">
                        </div>
                        <div class="tghh-card-face tghh-card-back">
                            <img src="\${backImg}" alt="\${char.name} Back Design" loading="lazy">
                        </div>
                    </div>
                </div>
                <div style="font-size: 0.8rem; color: #D1BDB0; margin-top: 6px;">
                    &#128070; Tap card above to flip between Front Artwork &amp; Collector Back
                </div>
            </div>

            <!-- 8. Special Abilities & Features -->
            \${renderSpecialAbilities(char)}

            <!-- 9. NFC Tap Target Motif -->
            \${renderNfcMotif(char)}

            <!-- 10. Smart Keepsake Experience & Rewritable NFC Callout -->
            <div style="background: rgba(251, 191, 36, 0.08); border: 1.5px solid #FBBF24; border-radius: 18px; padding: 18px; margin: 20px 0 10px;">
                <h4 style="margin: 0 0 8px 0; color: #FBBF24; font-size: 1rem; font-weight: 800; display: flex; align-items: center; gap: 8px;">
                    <span><i class="fa-solid fa-wand-magic-sparkles text-rose-400"></i></span> <span>Tap to Stream &bull; Rewritable to Your Own Message Anytime!</span>
                </h4>
                <p style="margin: 0 0 10px 0; font-size: 0.92rem; line-height: 1.6; color: #FFF8E7;">
                    <strong>Tap this card</strong> against the top edge of your iPhone or Android to instantly stream the exclusive 1080p claymation video and character greeting&mdash;zero app download required.
                </p>
                <p style="margin: 0; font-size: 0.88rem; line-height: 1.5; color: #D1BDB0;">
                    <strong><i class="fa-solid fa-microchip text-rose-400"></i> Rewritable NTAG215 Microchip:</strong> Want to personalize this card? It can easily be reprogrammed to link to your own custom family holiday video, voice note, photos, or personalized greeting anytime using our free Web NFC Tool at <a href="\${meta.tools_url}" target="_blank" style="color: #FBBF24; font-weight: 700; text-decoration: underline;">/tools</a>!
                </p>
            </div>

            <!-- 11. Prompts Accordion (Hidden inside collapsible) -->
            \${renderPromptsAccordion(prompts)}

            <!-- 12. Single Sleek Glowing Order Button (Direct to Shopify) -->
            <div style="margin-top: 28px; text-align: center;">
                <a href="\${setCardPurchaseUrl}" target="_blank" class="tghh-atc-btn">
                    <i class="fa-solid fa-cart-shopping"></i>
                    <span>Order #\${card.card_code} Keepsake Card &bull; $\${comm.price ? comm.price.toFixed(2) : '14.99'}</span>
                </a>
            </div>

            <!-- Share Button -->
            <div style="margin-top: 14px; text-align: center;">
                <button onclick="shareGreeting()" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(251,191,36,0.3); color: #FDE68A; padding: 10px 20px; border-radius: 16px; font-size: 0.88rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
                    <i class="fa-solid fa-share-nodes text-rose-400"></i> Share This Keepsake Card &#10022;
                </button>
            </div>

        </div>
    </main>`;

if (oldMainRegex.test(code)) {
  code = code.replace(oldMainRegex, newMainHtml);
  fs.writeFileSync(genCardsPath, code, 'utf8');
  console.log('✅ scripts/generate_cards.cjs upgraded with centered luxury layout!');
} else {
  console.log('Could not match oldMainRegex in generate_cards.cjs');
}
