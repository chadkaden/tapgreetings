async function verify() {
  console.log('Fetching live homepage from https://shop.tapthingy.com/...');
  const homeRes = await fetch('https://shop.tapthingy.com/', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  console.log('Homepage status:', homeRes.status);
  const homeHtml = await homeRes.text();

  const checks = [
    { name: 'Headline text', ok: homeHtml.includes('TAPGREETINGS - PVC NFC TAP to greetings video') },
    { name: 'Ghost tap video demo', ok: homeHtml.includes('card_01_tap.mp4') },
    { name: 'Custom card feature', ok: homeHtml.includes('Design Your Custom TapGreeting PVC Card') },
    { name: 'Holiday Series 1 Rail', ok: homeHtml.includes('Happy Holidays Series 1') },
    { name: 'Draft Concept Series Rail', ok: homeHtml.includes('Draft Concept Series') },
    { name: 'Pink-O-Ween Rail', ok: homeHtml.includes('Pink-O-Ween Series') },
    { name: 'Holiday Master Set badge', ok: homeHtml.includes('MASTER BOX SET') },
    { name: 'Pink-O-Ween Set badge', ok: homeHtml.includes('FULL 31-CARD SET') }
  ];

  checks.forEach(c => {
    console.log(`  ${c.ok ? '✅' : '❌'} ${c.name}`);
  });

  console.log('\nFetching live Set product page from https://shop.tapthingy.com/products/happy-holidays-series-1...');
  const setRes = await fetch('https://shop.tapthingy.com/products/happy-holidays-series-1', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  console.log('Set product status:', setRes.status);
  const setHtml = await setRes.text();

  const setChecks = [
    { name: 'Set Title present', ok: setHtml.includes('Happy Holidays') },
    { name: '1st Add to Cart button removed', ok: !setHtml.includes('tg-atc-top-box') },
    { name: 'Click card variant banner removed', ok: !setHtml.includes('tg-var-banner') },
    { name: 'Simplified video wording', ok: !setHtml.includes('1080p 60fps') },
    { name: 'Materials & Finish removed from specs', ok: !setHtml.includes('Solid waterproof PVC core, scratch-resistant matte tactile finish') },
    { name: 'Embedded Microchip removed from specs', ok: !setHtml.includes('NXP NTAG215 High-Speed NFC Chip (504 Bytes rewritable memory') }
  ];

  setChecks.forEach(c => {
    console.log(`  ${c.ok ? '✅' : '❌'} ${c.name}`);
  });
}

verify().catch(console.error);
