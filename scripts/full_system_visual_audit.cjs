const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const outDir = path.resolve('public/screenshots/audit_v2');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function audit() {
  console.log("Launching Chrome with WebGL...");
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--use-gl=swiftshader']
  });

  const page = await browser.newPage();
  const consoleLogs = [];
  page.on('console', msg => {
    consoleLogs.push({ type: msg.type(), text: msg.text() });
    if (msg.type() === 'error') {
      console.error('[BROWSER ERROR]:', msg.text());
    }
  });

  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });
  console.log("Navigating to http://127.0.0.1:4173/...");
  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle0', timeout: 15000 });
  await new Promise(r => setTimeout(r, 1000));

  const scrollMain = async (distance) => {
    await page.evaluate((d) => {
      const scrollEl = document.querySelector('main > div.overflow-y-auto');
      if (scrollEl) scrollEl.scrollTop += d;
    }, distance);
    await new Promise(r => setTimeout(r, 600));
  };

  const scrollMainTo = async (pos) => {
    await page.evaluate((p) => {
      const scrollEl = document.querySelector('main > div.overflow-y-auto');
      if (scrollEl) scrollEl.scrollTop = p;
    }, pos);
    await new Promise(r => setTimeout(r, 600));
  };

  // Helper to click navigation tab by text
  const clickNavTab = async (tabText) => {
    return page.evaluate((text) => {
      const btns = Array.from(document.querySelectorAll('aside button, nav button, header button'));
      const found = btns.find(b => b.textContent && b.textContent.includes(text));
      if (found) {
        found.click();
        return true;
      }
      return false;
    }, tabText);
  };

  // 1. Theory Tab - Top
  await page.screenshot({ path: path.join(outDir, '01_theory_top.png') });
  
  // 1b. Theory Tab - Scroll to 4 Quadrants & Exam traps
  await scrollMain(600);
  await page.screenshot({ path: path.join(outDir, '02_theory_quadrants.png') });

  // 1c. Theory Tab - Scroll down to Lossless Text (Lorenzo Pessetti)
  await scrollMain(800);
  await page.screenshot({ path: path.join(outDir, '03_theory_fulltext_header.png') });

  // 1d. Theory Tab - Deep scroll inside text
  await scrollMain(1200);
  await page.screenshot({ path: path.join(outDir, '04_theory_fulltext_content.png') });

  // 2. Select another chapter (e.g., Sindromi Coronariche)
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.textContent && b.textContent.includes('Sindromi Coronariche'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 800));
  await scrollMainTo(1200);
  await page.screenshot({ path: path.join(outDir, '05_theory_chapter2_text.png') });

  // 2b. Test Cross-Link Theory -> Quiz
  console.log("Testing direct cross-link: Theory -> Quiz Database Scritti...");
  await scrollMainTo(0);
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const quizBtn = btns.find(b => b.textContent && b.textContent.includes('Quiz Database Scritti'));
    if (quizBtn) quizBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '05b_quiz_crosslink_success.png') });

  // 3. Quiz Simulator
  console.log("Navigating to Database Scritti (Quiz)...");
  await clickNavTab('Database Scritti');
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, '06_quiz_overview.png') });

  // 4. Oral Exam Cases
  console.log("Navigating to Simulatore Orali...");
  await clickNavTab('Simulatore Orali');
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, '07_oral_cases.png') });

  // 5. Diagnostic Scanner
  console.log("Navigating to Scanner Diagnostico...");
  await clickNavTab('Scanner Diagnostico');
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, '08_diagnostic_scanner.png') });

  // 6. Calcolatori Clinici
  console.log("Navigating to Score Clinici...");
  await clickNavTab('Score Clinici');
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, '09_calculators.png') });

  // 7. Specialist: ECG
  console.log("Navigating to Monitor ECG...");
  await clickNavTab('Monitor ECG');
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, '10_ecg_simulator.png') });

  // 8. Specialist: PFR
  console.log("Navigating to Spirometria PFR...");
  await clickNavTab('Spirometria PFR');
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, '11_pfr_spirometry.png') });

  // 9. Specialist: EGA
  console.log("Navigating to EGA Arteriosa...");
  await clickNavTab('EGA Arteriosa');
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, '12_ega_interpreter.png') });

  // 10. Specialist: TNM
  console.log("Navigating to Stadiazione TNM...");
  await clickNavTab('Stadiazione TNM');
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, '13_tnm_staging.png') });

  // 11. Specialist: Flowcharts
  console.log("Navigating to Algoritmi Decisionali...");
  await clickNavTab('Algoritmi Decisionali');
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, '14_flowcharts.png') });

  // 12. Specialist: Pharma
  console.log("Navigating to Prontuario Farmaci...");
  await clickNavTab('Prontuario Farmaci');
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, '15_pharma.png') });

  // 13. Specialist: Imaging
  console.log("Navigating to Atlante Imaging...");
  await clickNavTab('Atlante Imaging');
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, '16_imaging.png') });

  // 14. 3D Anatomy Drawer
  console.log("Opening 3D Atlas drawer...");
  await clickNavTab('Apri Atlante WebGL 3D');
  await new Promise(r => setTimeout(r, 4500));
  await page.screenshot({ path: path.join(outDir, '17_anatomy_3d_heart.png') });

  // Switch 3D Model to Aorta
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && b.textContent.includes('Aorta'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 4000));
  await page.screenshot({ path: path.join(outDir, '18_anatomy_3d_aorta.png') });

  // Switch 3D Model to Bronchial Tree / Polmoni
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && b.textContent.includes('Albero'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 4000));
  await page.screenshot({ path: path.join(outDir, '19_anatomy_3d_lungs.png') });

  // Close 3D Modal
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.title === 'Chiudi modal' || (b.textContent && b.textContent.includes('Chiudi')));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  // 15. Fonoteca Auscultatoria Dock
  console.log("Opening Auscultation Dock...");
  await clickNavTab('Fonoteca Auscultatoria');
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '20_auscultation_dock.png') });

  // 16. Mobile View (iPhone 12 / 375x812)
  console.log("Switching to Mobile Viewport...");
  await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2, isMobile: true });
  await clickNavTab('Teoria Integrale');
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, '21_mobile_theory.png') });

  await browser.close();
  console.log("Audit complete! Saved 21 screenshots to public/screenshots/audit_v2");
  fs.writeFileSync(path.join(outDir, 'logs.json'), JSON.stringify(consoleLogs, null, 2));
}

audit().catch(e => {
  console.error("Audit error:", e);
  process.exit(1);
});
