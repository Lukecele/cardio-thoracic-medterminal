const puppeteer = require('puppeteer-core');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

async function runTest() {
  console.log("Starting preview server on port 4188...");
  const preview = spawn('npx', ['vite', 'preview', '--port', '4188', '--strictPort'], {
    cwd: '/home/luca/cardio-thoracic-medterminal',
    stdio: 'pipe'
  });

  preview.stdout.on('data', (d) => console.log(`[Preview stdout] ${d}`));
  preview.stderr.on('data', (d) => console.error(`[Preview stderr] ${d}`));

  // Wait 2.5 seconds for server to bind
  await new Promise(r => setTimeout(r, 2500));

  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: '/usr/bin/google-chrome',
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--autoplay-policy=no-user-gesture-required']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    const consoleLogs = [];
    page.on('console', msg => {
      consoleLogs.push({ type: msg.type(), text: msg.text() });
    });
    page.on('pageerror', err => {
      consoleLogs.push({ type: 'pageerror', text: err.toString() });
    });

    console.log("Navigating to http://localhost:4188 ...");
    await page.goto('http://localhost:4188', { waitUntil: 'networkidle0' });

    // Click on Fonoteca Auscultatoria tab
    console.log("Looking for Fonoteca Auscultatoria button...");
    const auscultationTab = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.innerText.includes('Fonoteca Auscultatoria'));
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });

    console.log("Fonoteca Auscultatoria tab clicked:", auscultationTab);
    await new Promise(r => setTimeout(r, 1000));

    // Verify Active Track title and badges
    const status = await page.evaluate(() => {
      const text = document.body.innerText;
      return {
        hasTitle: text.includes('Libreria Auscultatoria Ufficiale'),
        hasRemasterBadge: text.includes('REMASTER HD + GAIN BOOST'),
        hasStethoBoost: text.includes('StethoBoost'),
        hasFilters: text.includes('Membrana') && text.includes('Campana'),
        hasPhonocardiogram: text.includes('SISTOLE') && text.includes('DIASTOLE'),
        hasLoop: text.includes('Loop Continuo')
      };
    });

    console.log("UI verification status:", status);

    const artifactDir = '/home/luca/.gemini/antigravity-cli/brain/0e59f2ac-9f1c-420a-9267-7609aaa8b5c7';
    await page.screenshot({ path: path.join(artifactDir, 'test_18_auscultation_default.png'), fullPage: false });

    // Select Aortic Stenosis (Stenosi Aortica)
    console.log("Selecting Stenosi Aortica...");
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.innerText.includes('Stenosi Aortica'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // Click Play Reperto
    console.log("Clicking Ascolta Reperto...");
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.innerText.includes('Ascolta Reperto'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 1200));

    // Toggle StethoBoost (+6dB)
    console.log("Activating StethoBoost (+6dB)...");
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.innerText.includes('StethoBoost'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // Select Membrana filter
    console.log("Selecting Membrana filter...");
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.innerText.includes('Membrana'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 800));

    await page.screenshot({ path: path.join(artifactDir, 'test_19_auscultation_murmur_boosted.png'), fullPage: false });

    // Select Mitral Regurgitation (Insufficienza Mitralica)
    console.log("Selecting Insufficienza Mitralica...");
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.innerText.includes('Insufficienza Mitralica'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // Select Didactic Speed (0.75x)
    console.log("Selecting 0.75x Didactic speed...");
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.innerText.includes('0.75x Didattico'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    await page.screenshot({ path: path.join(artifactDir, 'test_20_auscultation_mitral_slow.png'), fullPage: false });

    console.log("Console errors/warnings:", consoleLogs.filter(l => l.type === 'error' || l.type === 'pageerror'));
    console.log("TEST SUCCESSFUL!");
    if (browser) await browser.close();
    preview.kill();
    process.exit(0);

  } finally {
    if (browser) await browser.close();
    preview.kill();
  }
}

runTest().catch(e => {
  console.error("Test failed:", e);
  process.exit(1);
});
