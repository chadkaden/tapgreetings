const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../dlimages');
const imgDir = path.join(__dirname, '../assets/img');
const cr80Dir = path.join(__dirname, '../assets/img/cr80');
const vidDir = path.join(__dirname, '../assets/video');

[imgDir, cr80Dir, vidDir].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

const fileMap = {
  // 017
  '017-front': '017-front-Stag_with_brass_armillary_sphere_7d077588_2K.jpg',
  '017-back': '017-back-Solstice_orrery_stag_collector_card_8bf8610b_2K.jpg',
  '017-video': '017-video-Birchwood_stag_rotating_brass_ar._0b91e7c7_1080p.mp4',

  // 018
  '018-front': '018-front-Tomte_holding_star-sextant_in_snow_d469f205_2K.jpg',
  '018-back': '018-back-Star_Keeper_Tomte_card_back_df9e325d_2K.jpg',
  '018-video': '018-video-Gnome_adjusts_brass_star-sextant_27f7e4ba_1080p.mp4',

  // 019
  '019-front': '019-front-Yule_goat_with_brass_gears_59fa0589_2K.jpg',
  '019-back': '019-back-Collector_card_back_design_ccbd70aa_2K.jpg',
  '019-video': '019-video-Clockwork_Yule_goat_stands_proudly_c4b67e02_1080p.mp4',

  // 020
  '020-front': '020-front-Owl_holding_key_on_astrolabe_0745d43e_2K.jpg',
  '020-back': '020-back-Astrolabe_owl_collector_card_back_7d2bc3a7_2K.jpg',
  '020-video': '020-video-Carved_wooden_owl_holding_key_05f4fc30_1080p.mp4',

  // 021 (Landscape Video)
  '021-front': '021-front-Wooden_maiden_automaton_with_crown_0ceec9ae_2K.jpg',
  '021-back': '021-back-Automaton_card_back_design_04781934_2K.jpg',
  '021-video': '021-video-land-gemini_generated_video_a91db094.mp4',

  // 022 (Clock Chalet)
  '022-front': '22-front-Whittled_wood_cuckoo_clock_chalet_e11b3754_2K.jpg',
  '022-back': '022-back-Collector_card_back_design_9ddbea9a_2K.jpg',
  '022-video': '021-video-Celestial_hare_emerges_from_chalet_5e67ad2d_1080p.mp4',

  // 023 (Landscape Video)
  '023-front': '023-front-Snow_hare_turning_music_crank_7398d0f7_2K.jpg',
  '023-back': '023-back-Aurora_music_hare_card_layout_bc6a628b_2K.jpg',
  '023-video': '023-video-land-gemini_generated_video_14cbd4f5.mp4',

  // 024 (Landscape Video)
  '024-front': '024-front-Ornate_mirror_reflecting_norther._b2b6cd3f_2K.jpg',
  '024-back': '024-back-Collector_card_back_design_dce2cccd_2K.jpg',
  '024-video': '024-video-land-solstice magic 1gemini_generated_video_767b97a0.mp4'
};

console.log('Copying and standardizing Series 3 Solstice Magic assets...');

const allFiles = fs.readdirSync(srcDir);

function findMatchingFile(code, type) {
  if (type === 'video') {
    if (code === '022') {
      return allFiles.find(f => f.startsWith('021-video-Celestial_hare') || f.startsWith('022-video'));
    }
    return allFiles.find(f => f.startsWith(`${code}-video`));
  } else if (type === 'front') {
    if (code === '022') {
      return allFiles.find(f => f.startsWith('22-front') || f.startsWith('022-front'));
    }
    return allFiles.find(f => f.startsWith(`${code}-front`));
  } else if (type === 'back') {
    if (code === '019') {
      return allFiles.find(f => f.startsWith('019-back') || f.startsWith('19-back'));
    }
    return allFiles.find(f => f.startsWith(`${code}-back`));
  }
}

for (let i = 17; i <= 24; i++) {
  const code = String(i).padStart(3, '0');
  for (const type of ['front', 'back', 'video']) {
    const matched = findMatchingFile(code, type);
    if (!matched) {
      console.error(`MISSING SOURCE for ${code}-${type}`);
      continue;
    }
    const srcPath = path.join(srcDir, matched);
    if (type === 'video') {
      const dest = path.join(vidDir, `${code}-video.mp4`);
      fs.copyFileSync(srcPath, dest);
      console.log(` ✅ Copied Video (${code}): ${matched} -> ${dest}`);
    } else {
      const dest1 = path.join(imgDir, `${code}-${type}.jpg`);
      const dest2 = path.join(cr80Dir, `${code}-${type}.jpg`);
      fs.copyFileSync(srcPath, dest1);
      fs.copyFileSync(srcPath, dest2);
      console.log(` ✅ Copied Image (${code}-${type}): ${matched} -> ${dest1}`);
    }
  }
}

console.log('🎉 All available Series 3 media files standardized!');
