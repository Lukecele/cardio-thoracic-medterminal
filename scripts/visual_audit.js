import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve('public/screenshots');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function runAudit() {
  console.log("Launching headless Chrome...");
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
      console.log('Console error:', msg.text());
    }
  });
  page.on('pageerror', err => {
    consoleErrors.push(err.toString());
    console.log('Page error:', err.toString());
  });

  // Desktop Viewport
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  console.log("Navigating to http://127.0.0.1:4173/...");
  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle0', timeout: 15000 });

  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '01_desktop_theory.png') });
  console.log("Saved 01_desktop_theory.png");

  // Open 3D Atlas
  console.log("Opening 3D Atlas drawer...");
  const atlasBtn = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && b.textContent.includes('Atlante WebGL 3D'));
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });
  if (atlasBtn) {
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: path.join(outDir, '02_desktop_3d_atlas.png') });
    console.log("Saved 02_desktop_3d_atlas.png");
  }

  // Navigate to ECG
  console.log("Navigating to Monitor ECG...");
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && b.textContent.includes('Monitor ECG'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '03_desktop_ecg.png') });
  console.log("Saved 03_desktop_ecg.png");

  // Navigate to PFR
  console.log("Navigating to Spirometria PFR...");
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && b.textContent.includes('Spirometria PFR'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '04_desktop_pfr.png') });
  console.log("Saved 04_desktop_pfr.png");

  // Navigate to EGA
  console.log("Navigating to EGA Arteriosa...");
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && b.textContent.includes('EGA Arteriosa'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '05_desktop_ega.png') });
  console.log("Saved 05_desktop_ega.png");

  // Navigate to TNM
  console.log("Navigating to Stadiazione TNM...");
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && b.textContent.includes('Stadiazione TNM'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '06_desktop_tnm.png') });
  console.log("Saved 06_desktop_tnm.png");

  // Navigate to Fonoteca Auscultatoria
  console.log("Navigating to Fonoteca Auscultatoria...");
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && b.textContent.includes('Fonoteca Auscultatoria'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '07_desktop_auscultation.png') });
  console.log("Saved 07_desktop_auscultation.png");

  // Mobile Viewport
  console.log("Setting mobile viewport (375x812)...");
  await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2, isMobile: true });
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && b.textContent.includes('Teoria Integrale'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '08_mobile_home.png') });
  console.log("Saved 08_mobile_home.png");

  await browser.close();
  console.log("Audit complete. Console errors count:", consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.log("Errors:", consoleErrors);
  }
}

runAudit().catch(err => {
  console.error("Audit failed:", err);
  process.exit(1);
});
