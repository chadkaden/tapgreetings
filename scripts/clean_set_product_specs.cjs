const fs = require('fs');
const path = require('path');

// 1. Update tapgreetings-set-product-page.liquid
const setPath = path.join(__dirname, '../theme/sections/tapgreetings-set-product-page.liquid');
let setCode = fs.readFileSync(setPath, 'utf8');

// A. Remove 1st Add to Cart button
const oldAtcTop = `      <!-- Quick Add to Cart Button Directly Below Multimedia -->
      <div class="tg-atc-top-box">
        <button type="button" onclick="submitActiveForm()" class="tg-btn-atc">
          <span>Add to Cart</span>
          <span>&bull;</span>
          <span id="tg-btn-price-top">{{ product.selected_or_first_available_variant.price | money }}</span>
        </button>
      </div>`;

// Check regex if exact string varies slightly
const atcRegex = /<!-- Quick Add to Cart Button Directly Below Multimedia -->[\s\S]*?<\/div>/m;
if (atcRegex.test(setCode)) {
  setCode = setCode.replace(atcRegex, '');
  console.log('Removed 1st Add to Cart button from set page');
} else {
  console.log('Warning: atcRegex not matched in set page');
}

// B. Remove the "Click card varient below..." text banner
const bannerRegex = /<div class="tg-var-banner">[\s\S]*?<\/div>/m;
if (bannerRegex.test(setCode)) {
  setCode = setCode.replace(bannerRegex, '');
  console.log('Removed "Click card variant below" banner from set page');
} else {
  console.log('Warning: bannerRegex not matched in set page');
}

// C. Remove 1080p details -> simplify to video
setCode = setCode.replace(/1080p Stop-Motion Video/g, 'Video');
setCode = setCode.replace(/exclusive 1080p stop-motion holiday video and voice greeting/g, 'exclusive holiday video and voice greeting');
setCode = setCode.replace(/1080p 60fps/gi, 'video');

// D. Remove Materials & Finish and Embedded Microchip rows
const specsRegex = /<tr style="border-bottom: 1px solid var\(--tg-border\);">\s*<td[^>]*>Materials &amp; Finish:<\/td>[\s\S]*?<\/tr>\s*<tr style="border-bottom: 1px solid var\(--tg-border\);">\s*<td[^>]*>Embedded Microchip:<\/td>[\s\S]*?<\/tr>/m;

if (specsRegex.test(setCode)) {
  setCode = setCode.replace(specsRegex, '');
  console.log('Removed Materials & Finish and Embedded Microchip rows from set page');
} else {
  console.log('Warning: specsRegex not matched in set page');
}

fs.writeFileSync(setPath, setCode, 'utf8');
console.log('Updated tapgreetings-set-product-page.liquid');


// 2. Update tapgreetings-product-page.liquid
const prodPath = path.join(__dirname, '../theme/sections/tapgreetings-product-page.liquid');
let prodCode = fs.readFileSync(prodPath, 'utf8');

prodCode = prodCode.replace(/1080p Stop-Motion Video/g, 'Video');
prodCode = prodCode.replace(/exclusive 1080p stop-motion holiday video and voice greeting/g, 'exclusive holiday video and voice greeting');
prodCode = prodCode.replace(/Direct link to stream the 1080p stop-motion holiday video experience:/g, 'Direct link to stream the holiday video experience:');

const prodSpecsRegex = /<tr style="border-bottom: 1px solid var\(--tg-border\);">\s*<td[^>]*>Materials &amp; Finish:<\/td>[\s\S]*?<\/tr>\s*<tr style="border-bottom: 1px solid var\(--tg-border\);">\s*<td[^>]*>Embedded Microchip:<\/td>[\s\S]*?<\/tr>/m;

if (prodSpecsRegex.test(prodCode)) {
  prodCode = prodCode.replace(prodSpecsRegex, '');
  console.log('Removed Materials & Finish and Embedded Microchip rows from standard product page');
} else {
  console.log('Warning: prodSpecsRegex not matched in standard product page');
}

fs.writeFileSync(prodPath, prodCode, 'utf8');
console.log('Updated tapgreetings-product-page.liquid');
