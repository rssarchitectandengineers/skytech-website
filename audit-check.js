const fs = require('fs');
const path = require('path');

const htmlFiles = [
  'index.html',
  'services.html',
  'projects.html',
  'blog.html',
  'contact.html',
  'privacy.html',
  'terms.html',
  'dpdp.html',
  'sitemap.html'
];

let totalErrors = 0;
console.log('--- STARTING EXHAUSTIVE VERIFICATION ---');

for (const file of htmlFiles) {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) {
    console.error(`[ERROR] File missing: ${file}`);
    totalErrors++;
    continue;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  console.log(`\nVerifying: ${file}`);

  // 1. Phone links
  const telMatches = content.match(/tel:[^"'\s>]+/g) || [];
  for (const tel of telMatches) {
    if (tel !== 'tel:+917737243812') {
      console.error(`  [FAIL] Invalid tel link: ${tel}`);
      totalErrors++;
    }
  }
  console.log(`  ✓ Checked ${telMatches.length} tel links (all tel:+917737243812)`);

  // 2. Mailto links
  const mailMatches = content.match(/mailto:[^"'\s>]+/g) || [];
  for (const m of mailMatches) {
    if (m !== 'mailto:skytechjpr@gmail.com') {
      console.error(`  [FAIL] Invalid mailto link: ${m}`);
      totalErrors++;
    }
  }
  console.log(`  ✓ Checked ${mailMatches.length} mailto links (all mailto:skytechjpr@gmail.com)`);

  // 3. WhatsApp links
  const waMatches = content.match(/https:\/\/wa\.me\/[^"'\s>]+/g) || [];
  for (const wa of waMatches) {
    if (!wa.startsWith('https://wa.me/917737243812')) {
      console.error(`  [FAIL] Invalid WhatsApp link: ${wa}`);
      totalErrors++;
    }
  }
  console.log(`  ✓ Checked ${waMatches.length} WhatsApp links (all targeting 917737243812)`);

  // 4. Check for obsolete branding or search redirects
  if (/tespro/i.test(content)) {
    console.error(`  [FAIL] Obsolete TESPRO reference found!`);
    totalErrors++;
  }
  if (/google\.com\/search/i.test(content)) {
    console.error(`  [FAIL] Google Search redirect found!`);
    totalErrors++;
  }

  // 5. Check consultation modal & CTAs on main functional pages
  if (['index.html', 'services.html', 'projects.html', 'blog.html', 'contact.html'].includes(file)) {
    const hasModal = content.includes('id="consultationPopupModal"');
    const hasConsultationBtn = content.includes('data-open-consultation');
    const hasFloating = content.includes('floating-actions-container');
    const hasFloatingCall = content.includes('floating-call');
    const hasFloatingWA = content.includes('floating-whatsapp');
    const hasAiWidget = content.includes('id="aiAssistantWidget"');

    if (!hasModal) { console.error(`  [FAIL] Missing consultation modal!`); totalErrors++; }
    if (!hasConsultationBtn) { console.error(`  [FAIL] Missing data-open-consultation CTA!`); totalErrors++; }
    if (!hasFloating || !hasFloatingCall || !hasFloatingWA) { console.error(`  [FAIL] Incomplete floating buttons!`); totalErrors++; }
    if (!hasAiWidget) { console.error(`  [FAIL] Missing AI widget!`); totalErrors++; }

    console.log(`  ✓ Core interactive components verified: Modal=${hasModal}, CTAs=${hasConsultationBtn}, FloatingCall/WA=${hasFloatingCall && hasFloatingWA}, AI=${hasAiWidget}`);
  }

  // 6. Check logo alt text
  const logoImgs = content.match(/<img[^>]*skytech-logo[^>]*>/gi) || [];
  for (const img of logoImgs) {
    if (!img.includes('alt="SkyTech Structural Consultant — Quality Matters"')) {
      console.error(`  [FAIL] Logo img missing exact required alt text: ${img}`);
      totalErrors++;
    }
  }
  console.log(`  ✓ Checked ${logoImgs.length} logo images for required alt text`);
}

console.log(`\n========================================`);
if (totalErrors === 0) {
  console.log('✅ ALL CHECKS PASSED: 0 ERRORS FOUND!');
} else {
  console.error(`❌ AUDIT FAILED WITH ${totalErrors} ERRORS!`);
}
process.exit(totalErrors === 0 ? 0 : 1);
