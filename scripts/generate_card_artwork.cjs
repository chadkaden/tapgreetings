const fs = require('fs');
const path = require('path');

const cardsDir = path.join(__dirname, '../public/cards');
if (!fs.existsSync(cardsDir)) fs.mkdirSync(cardsDir, { recursive: true });

const cards = [
  {
    id: '03',
    title: 'Cozy Fireside Hearth',
    occasion: 'Christmas & Winter Holiday',
    aspect: 'landscape',
    accent: '#fbbf24',
    icon: '🔥🎄✨',
    desc: 'Crackling Pine Logs • Warm Cocoa • Winter Hearth'
  },
  {
    id: '04',
    title: 'Midnight Fireworks',
    occasion: 'New Year Celebration',
    aspect: 'landscape',
    accent: '#38bdf8',
    icon: '🥂🎆✨',
    desc: 'Champagne Flutes • Golden Midnight • 365 New Days'
  },
  {
    id: '05',
    title: 'Neon Birthday Glow',
    occasion: 'Birthday Celebration',
    aspect: 'portrait',
    accent: '#f472b6',
    icon: '🎂🎈⚡',
    desc: 'Neon Glow • Holographic Balloons • Birthday Beats'
  },
  {
    id: '06',
    title: 'Golden Anniversary',
    occasion: 'Milestone Anniversary',
    aspect: 'portrait',
    accent: '#fbbf24',
    icon: '💍🥂✨',
    desc: 'Embossed Gold Foil • Forever Vows • Shared Journey'
  },
  {
    id: '07',
    title: 'Botanical Gratitude',
    occasion: 'Heartfelt Thank You',
    aspect: 'portrait',
    accent: '#6ee7b7',
    icon: '🌿🌸💌',
    desc: 'Eucalyptus Blooms • Sincere Appreciation • Deep Thanks'
  },
  {
    id: '08',
    title: 'Champion & Victory',
    occasion: 'Congratulations',
    aspect: 'landscape',
    accent: '#60a5fa',
    icon: '🏆🎖️🌟',
    desc: 'The Pinnacle of Triumph • Hard Work Conquered • Bold Win'
  },
  {
    id: '09',
    title: 'Thinking of You',
    occasion: 'Comfort & Love Across Miles',
    aspect: 'portrait',
    accent: '#c084fc',
    icon: '💜☁️🕊️',
    desc: 'A Pocket Hug • Always in My Thoughts • Unconditional Love'
  },
  {
    id: '10',
    title: 'Sweet Baby Arrival',
    occasion: 'New Baby & Welcome',
    aspect: 'landscape',
    accent: '#5eead4',
    icon: '👶⭐🍼',
    desc: 'Starlight Glow • Ten Tiny Toes • A Precious Miracle'
  },
  {
    id: '11',
    title: 'Forever Wedding Vows',
    occasion: 'Wedding Day & Nuptials',
    aspect: 'portrait',
    accent: '#fef08a',
    icon: '👰🤵💐',
    desc: 'Champagne Silk • Pure Peonies • Two Hearts United'
  }
];

cards.forEach(c => {
  const isLand = c.aspect === 'landscape';
  const w = isLand ? 900 : 600;
  const h = isLand ? 600 : 900;

  // Front SVG
  const frontSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="grad_${c.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0c0d14" />
      <stop offset="50%" stop-color="#141829" />
      <stop offset="100%" stop-color="#1e1430" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" rx="36" fill="url(#grad_${c.id})" stroke="${c.accent}" stroke-width="5"/>
  <rect x="18" y="18" width="${w - 36}" height="${h - 36}" rx="26" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="2"/>
  
  <text x="40" y="65" fill="${c.accent}" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="22" letter-spacing="2">TAPGREETINGS</text>
  <text x="${w - 40}" y="65" fill="rgba(255,255,255,0.7)" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="16" text-anchor="end">CARD #${c.id} ${isLand ? '↔ HORIZONTAL' : '↕ VERTICAL'}</text>
  
  <text x="${w/2}" y="${h/2 - 40}" font-size="76" text-anchor="middle">${c.icon}</text>
  <text x="${w/2}" y="${h/2 + 35}" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="32" text-anchor="middle">${c.title}</text>
  <text x="${w/2}" y="${h/2 + 75}" fill="${c.accent}" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="18" text-anchor="middle">${c.occasion}</text>
  <text x="${w/2}" y="${h/2 + 115}" fill="rgba(255,255,255,0.8)" font-family="system-ui, -apple-system, sans-serif" font-size="15" text-anchor="middle">${c.desc}</text>
  
  <rect x="${w/2 - 150}" y="${h - 75}" width="300" height="38" rx="19" fill="rgba(255,255,255,0.08)" stroke="${c.accent}" stroke-width="1.5"/>
  <text x="${w/2}" y="${h - 50}" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="13" text-anchor="middle">⚡ NTAG215 • 30MIL CR80 PVC</text>
</svg>`;

  // Back SVG
  const backSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" rx="36" fill="#090d16" stroke="${c.accent}" stroke-width="5"/>
  <rect x="18" y="18" width="${w - 36}" height="${h - 36}" rx="26" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>
  
  <text x="40" y="65" fill="${c.accent}" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="20" letter-spacing="2">CARD BACK LORE</text>
  <text x="${w - 40}" y="65" fill="rgba(255,255,255,0.7)" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="15" text-anchor="end">TAPGREETINGS.COM/${c.id}</text>
  
  <circle cx="${w/2}" cy="${h/2 - 45}" r="45" fill="rgba(255,255,255,0.06)" stroke="${c.accent}" stroke-width="2"/>
  <text x="${w/2}" y="${h/2 - 35}" font-size="38" text-anchor="middle">📡</text>
  <text x="${w/2}" y="${h/2 + 35}" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="20" text-anchor="middle">TAP CARD TO BACK OF PHONE</text>
  <text x="${w/2}" y="${h/2 + 65}" fill="rgba(255,255,255,0.7)" font-family="system-ui, -apple-system, sans-serif" font-size="14" text-anchor="middle">Launches Personalized 4K Video Experience</text>
  
  <text x="${w/2}" y="${h - 50}" fill="${c.accent}" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="13" text-anchor="middle">POWERED BY TAPTHINGY • 100% WATERPROOF &amp; REWRITABLE</text>
</svg>`;

  fs.writeFileSync(path.join(cardsDir, `${c.id}_front.svg`), frontSvg);
  fs.writeFileSync(path.join(cardsDir, `${c.id}_back.svg`), backSvg);
  console.log(`Created artwork for Card ${c.id} (${c.aspect})`);
});
