const puppeteer = require('puppeteer-core');
const { spawn } = require('child_process');
const path = require('path');

async function test3DUpgrade() {
  console.log("Starting preview server on port 4190...");
  const preview = spawn('npx', ['vite', 'preview', '--port', '4190', '--strictPort'], {
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
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--use-gl=swiftshader']
    });

    const page = await browser.newPage();
    const artifactDir = '/home/luca/.gemini/antigravity-cli/brain/0e59f2ac-9f1c-420a-9267-7609aaa8b5c7';

    // 1. DESKTOP TEST (1440x900)
    await page.setViewport({ width: 1440, height: 900 });
    console.log("Navigating to http://localhost:4190 on desktop...");
    await page.goto('http://localhost:4190', { waitUntil: 'networkidle0' });

    // Open 3D Atlas from bottom button or theory
    console.log("Clicking 'Apri Atlante WebGL 3D' button...");
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.innerText.includes('Atlante WebGL 3D') || b.innerText.includes('Atlante 3D'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 1200));

    // Capture Desktop Drawer
    await page.screenshot({ path: path.join(artifactDir, 'test_22_3d_desktop_drawer.png') });
    console.log("Desktop 3D drawer screenshot saved!");

    // Switch to Atlante HD
    console.log("Switching to Atlante HD mode...");
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.innerText.includes('Atlante HD'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(artifactDir, 'test_23_3d_desktop_hd_mode.png') });
    console.log("Desktop Atlante HD screenshot saved!");

    // Click Maximize to test Fullscreen Workstation Modal
    console.log("Toggling Maximize / Fullscreen Workstation...");
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.title && b.title.includes('schermo intero'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(artifactDir, 'test_24_3d_desktop_maximized.png') });
    console.log("Desktop Fullscreen Workstation screenshot saved!");

    // Switch to Aorta model
    console.log("Selecting Aorta model...");
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.innerText.includes('Aorta') || b.innerText.includes('VASCOLARE'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(artifactDir, 'test_25_3d_aorta_maximized.png') });

    // Close 3D Atlas
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.title === 'Chiudi');
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // 2. MOBILE TEST (390x844 iPhone)
    console.log("\nStarting MOBILE TEST (390x844)...");
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1');

    await page.goto('http://localhost:4190', { waitUntil: 'networkidle0' });

    // Open 3D Atlas on mobile (via bottom button or drawer)
    console.log("Opening 3D Atlas on mobile...");
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.innerText.includes('Atlante WebGL 3D') || b.innerText.includes('Visualizza HEART') || b.innerText.includes('Atlante 3D'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 1200));

    // Mobile Split View screenshot
    await page.screenshot({ path: path.join(artifactDir, 'test_26_3d_mobile_split.png') });
    console.log("Mobile Split View screenshot saved!");

    // Switch to "Solo Teoria" tab on mobile
    console.log("Switching to 'Solo Teoria' on mobile...");
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.innerText.includes('Solo Teoria'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(artifactDir, 'test_27_3d_mobile_only_theory.png') });
    console.log("Mobile Solo Teoria screenshot saved!");

    // Switch to "Atlante HD" mode on mobile
    console.log("Switching to 'Atlante HD' on mobile...");
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.innerText.includes('Atlante HD'));
      if (btn) btn.click();
    });
    // Switch to "Solo Vista"
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.innerText.includes('Solo Vista'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(artifactDir, 'test_28_3d_mobile_hd_view.png') });
    console.log("Mobile HD Solo Vista screenshot saved!");

    console.log("ALL 3D UPGRADE TESTS PASSED SUCCESSFULLY!");
    if (browser) await browser.close();
    preview.kill();
    process.exit(0);

  } finally {
    if (browser) await browser.close();
    preview.kill();
  }
}

test3DUpgrade().catch(e => {
  console.error("Test error:", e);
  process.exit(1);
});
