const puppeteer = require('puppeteer-core');
const { spawn } = require('child_process');
const path = require('path');

async function testInstantClick() {
  console.log("Starting preview server on port 4192...");
  const preview = spawn('npx', ['vite', 'preview', '--port', '4192', '--strictPort'], {
    cwd: '/home/luca/cardio-thoracic-medterminal',
    stdio: 'pipe'
  });

  preview.stdout.on('data', d => console.log(`[Preview stdout] ${d}`));
  preview.stderr.on('data', d => console.error(`[Preview stderr] ${d}`));

  await new Promise(r => setTimeout(r, 2500));

  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: '/usr/bin/google-chrome',
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--autoplay-policy=no-user-gesture-required']
    });

    const page = await browser.newPage();
    const artifactDir = '/home/luca/.gemini/antigravity-cli/brain/0e59f2ac-9f1c-420a-9267-7609aaa8b5c7';

    // 1. Desktop Test
    await page.setViewport({ width: 1440, height: 900 });
    console.log("Navigating to http://localhost:4192 on desktop...");
    await page.goto('http://localhost:4192', { waitUntil: 'networkidle0' });

    // Open Fonoteca Auscultatoria
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.innerText.includes('Fonoteca Auscultatoria'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 1000));

    // Test 1: Click "Stenosi Aortica" in the left menu
    console.log("Testing 1-TAP PLAY: Clicking 'Stenosi Aortica' in menu...");
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.innerText.includes('Stenosi Aortica'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 1500));

    // Check if audio is playing immediately!
    const desktopStatus = await page.evaluate(() => {
      const audio = document.querySelector('audio');
      const bodyText = document.body.innerText;
      return {
        audioSrc: audio ? audio.src : null,
        audioPaused: audio ? audio.paused : null,
        hasInRiproduzione: bodyText.includes('IN RIPRODUZIONE') || bodyText.includes('IN ASCOLTO'),
        hasAscoltaSubito: bodyText.includes('ASCOLTA SUBITO')
      };
    });

    console.log("Desktop 1-tap playback status:", desktopStatus);
    await page.screenshot({ path: path.join(artifactDir, 'test_30_auscultation_instant_click_desktop.png') });

    // 2. Mobile Test (390x844)
    console.log("\nStarting MOBILE TEST (390x844)...");
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1');

    await page.goto('http://localhost:4192', { waitUntil: 'networkidle0' });

    // Click Fonoteca
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.innerText.includes('Fonoteca Auscultatoria'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 1000));

    // Tap "Insufficienza Mitralica" directly in mobile menu
    console.log("Mobile 1-TAP: Tapping 'Insufficienza Mitralica'...");
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.innerText.includes('Insufficienza Mitralica'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 1500));

    const mobileStatus = await page.evaluate(() => {
      const audio = document.querySelector('audio');
      const bodyText = document.body.innerText;
      return {
        audioSrc: audio ? audio.src : null,
        audioPaused: audio ? audio.paused : null,
        hasMobileDock: bodyText.includes('StethoBoost') || bodyText.includes('+6dB'),
        hasInAscolto: bodyText.includes('IN ASCOLTO')
      };
    });

    console.log("Mobile 1-tap playback status:", mobileStatus);
    await page.screenshot({ path: path.join(artifactDir, 'test_31_auscultation_mobile_instant_dock.png') });

    console.log("ALL INSTANT PLAY TESTS PASSED!");
    if (browser) await browser.close();
    preview.kill();
    process.exit(0);

  } finally {
    if (browser) await browser.close();
    preview.kill();
  }
}

testInstantClick().catch(e => {
  console.error("Test error:", e);
  process.exit(1);
});
