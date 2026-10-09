const puppeteer = require('puppeteer-core');

async function testMobileWebGL() {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--enable-webgl',
      '--use-gl=swiftshader'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1');

  const models = [
    { key: 'heart', url: 'https://sketchfab.com/models/9f48eaa481cc4a43baeb9e1f03882cff/embed' },
    { key: 'beating', url: 'https://sketchfab.com/models/09ce20e146b24f71943b13dcdf099db9/embed' },
    { key: 'lungs', url: 'https://sketchfab.com/models/250911151757489da1cf5501b791f363/embed' },
    { key: 'aorta', url: 'https://sketchfab.com/models/bcf37e4072de48b0aabd2e62db815cbd/embed' },
    { key: 'coronary', url: 'https://sketchfab.com/models/00b5f4ec0b984325b453f8df07cd0cb5/embed' },
  ];

  for (const m of models) {
    console.log(`\nTesting mobile load for ${m.key}...`);
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    try {
      await page.goto(m.url, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await new Promise(r => setTimeout(r, 3000));
      const hasErrorEl = await page.evaluate(() => {
        const bodyText = document.body.innerText;
        const webglError = bodyText.includes('WebGL') || bodyText.includes('context lost') || bodyText.includes('not supported') || bodyText.includes('Could not');
        return { webglError, bodyPreview: bodyText.slice(0, 200) };
      });
      console.log(`${m.key} status:`, hasErrorEl);
      if (errors.length) console.log(`${m.key} console errors:`, errors.slice(0, 3));
    } catch (e) {
      console.error(`${m.key} failed:`, e.message);
    }
  }

  await browser.close();
}

testMobileWebGL().catch(console.error);
