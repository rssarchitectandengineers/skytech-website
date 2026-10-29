const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

async function generatePortfolio() {
  const pdfDoc = await PDFDocument.create();
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const primaryBlue = rgb(0.008, 0.518, 0.78); // #0284c7
  const darkNavy = rgb(0.043, 0.082, 0.137);   // #0b1523
  const skyCyan = rgb(0.055, 0.647, 0.914);    // #0ea5e9
  const textDark = rgb(0.06, 0.09, 0.16);
  const textMuted = rgb(0.39, 0.45, 0.55);
  const bgLight = rgb(0.97, 0.98, 0.99);

  // -------------------------------------------------------------
  // PAGE 1: COVER PAGE
  // -------------------------------------------------------------
  const page1 = pdfDoc.addPage([595.28, 841.89]); // A4
  const { width, height } = page1.getSize();

  // Top Accent Bar
  page1.drawRectangle({
    x: 0,
    y: height - 12,
    width: width,
    height: 12,
    color: primaryBlue,
  });

  // Dark Hero Header Block
  page1.drawRectangle({
    x: 0,
    y: height - 340,
    width: width,
    height: 328,
    color: darkNavy,
  });

  // Architectural Grid Lines
  for (let i = 40; i < width; i += 60) {
    page1.drawLine({
      start: { x: i, y: height - 340 },
      end: { x: i, y: height - 12 },
      color: rgb(0.1, 0.18, 0.28),
      thickness: 0.5,
    });
  }

  // Company Name & Brand
  page1.drawText('SKYTECH', {
    x: 50,
    y: height - 100,
    size: 42,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  page1.drawText('STRUCTURAL CONSULTANT', {
    x: 52,
    y: height - 128,
    size: 14,
    font: fontBold,
    color: skyCyan,
  });

  page1.drawText('QUALITY MATTERS', {
    x: 52,
    y: height - 146,
    size: 10,
    font: fontRegular,
    color: rgb(0.8, 0.85, 0.9),
  });

  // Accent Line
  page1.drawLine({
    start: { x: 50, y: height - 165 },
    end: { x: 300, y: height - 165 },
    color: skyCyan,
    thickness: 2,
  });

  // Main Cover Title
  page1.drawText('CORPORATE CAPABILITY PROFILE &', {
    x: 50,
    y: height - 210,
    size: 16,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  page1.drawText('STRUCTURAL ENGINEERING PORTFOLIO', {
    x: 50,
    y: height - 236,
    size: 18,
    font: fontBold,
    color: skyCyan,
  });

  page1.drawText('Comprehensive Structural Design, Analysis, Value Engineering & Auditing Solutions', {
    x: 50,
    y: height - 270,
    size: 11,
    font: fontRegular,
    color: rgb(0.85, 0.9, 0.95),
  });

  // Lower Section on Cover
  page1.drawText('ABOUT SKYTECH CONSULTANT', {
    x: 50,
    y: height - 390,
    size: 14,
    font: fontBold,
    color: darkNavy,
  });

  const introText = [
    'SkyTech is a premier structural engineering consultancy based in Jaipur, Rajasthan,',
    'delivering safe, optimized, and economical engineering solutions across India. With over',
    '13 years of technical leadership and 50+ landmark projects, we specialize in RCC, structural',
    'steel, pre-engineered buildings (PEB), structural stability assessments, and building cost reduction.'
  ];

  let yPos = height - 415;
  introText.forEach(line => {
    page1.drawText(line, { x: 50, y: yPos, size: 10.5, font: fontRegular, color: textDark, lineHeight: 14 });
    yPos -= 18;
  });

  // 4 Metrics Highlights Box
  const metricBoxY = height - 560;
  page1.drawRectangle({
    x: 50,
    y: metricBoxY,
    width: width - 100,
    height: 65,
    color: bgLight,
    borderColor: rgb(0.85, 0.9, 0.95),
    borderWidth: 1,
  });

  const metrics = [
    { num: '13+ Years', label: 'Engineering Experience' },
    { num: '50+ Landmark', label: 'Projects Completed' },
    { num: '100% Client', label: 'Satisfaction Record' },
    { num: '15-25%', label: 'Steel Cost Reduction' },
  ];

  metrics.forEach((m, idx) => {
    const xOffset = 65 + idx * 122;
    page1.drawText(m.num, { x: xOffset, y: metricBoxY + 38, size: 13, font: fontBold, color: primaryBlue });
    page1.drawText(m.label, { x: xOffset, y: metricBoxY + 18, size: 8, font: fontRegular, color: textMuted });
  });

  // Contact Strip at Bottom of Cover
  page1.drawRectangle({
    x: 50,
    y: 50,
    width: width - 100,
    height: 75,
    color: darkNavy,
  });

  page1.drawText('HEADQUARTERS & CONSULTATION CONTACT', {
    x: 65,
    y: 100,
    size: 9,
    font: fontBold,
    color: skyCyan,
  });

  page1.drawText('Phone: +91-7737243812   |   Email: skytechjpr@gmail.com', {
    x: 65,
    y: 82,
    size: 9.5,
    font: fontRegular,
    color: rgb(1, 1, 1),
  });

  page1.drawText('Office: Jaipur, Rajasthan, India   |   Web: skytech-consultant.com', {
    x: 65,
    y: 65,
    size: 9.5,
    font: fontRegular,
    color: rgb(0.85, 0.9, 0.95),
  });

  // -------------------------------------------------------------
  // PAGE 2: SERVICES SPECTRUM & IS CODES COMPLIANCE
  // -------------------------------------------------------------
  const page2 = pdfDoc.addPage([595.28, 841.89]);
  
  // Header bar
  page2.drawRectangle({ x: 0, y: height - 50, width: width, height: 50, color: darkNavy });
  page2.drawText('SKYTECH STRUCTURAL CONSULTANT', { x: 50, y: height - 32, size: 12, font: fontBold, color: rgb(1, 1, 1) });
  page2.drawText('PORTFOLIO & SERVICE CATALOGUE', { x: width - 240, y: height - 32, size: 10, font: fontBold, color: skyCyan });

  page2.drawText('OUR 10 CORE STRUCTURAL ENGINEERING SERVICES', {
    x: 50,
    y: height - 85,
    size: 14,
    font: fontBold,
    color: primaryBlue,
  });

  const services = [
    { title: '1. RCC Structural Design', desc: 'Design of multi-storey foundations, shear walls, flat slabs & transfer girders per IS 456 & IS 13920.' },
    { title: '2. Steel Structure Design', desc: 'Industrial sheds, heavy portal frames, pipe racks, lattice towers & trusses engineered to IS 800:2007.' },
    { title: '3. Building Cost Reduction (Approved Drawings)', desc: 'Value re-engineering of existing drawings to trim 15-25% steel tonnage while preserving 100% structural safety.' },
    { title: '4. Pre-Engineered Building (PEB) Design', desc: 'High-efficiency industrial warehouses, logistics parks, cold storage and manufacturing plant enclosures.' },
    { title: '5. Structural Audit and Assessment', desc: 'Non-Destructive Testing (NDT), rebound hammer, UPV testing, crack propagation mapping and fitness certification.' },
    { title: '6. Structural Stability Assessment', desc: 'Third-party peer reviews, load capacity assessments, stability certification for municipal and statutory compliance.' },
    { title: '7. Retrofitting & Structural Strengthening', desc: 'Seismic retrofitting, RCC column jacketing, carbon fiber (CFRP) wrapping, and steel beam beam-enhancements.' },
    { title: '8. Project Management Consultancy (PMC)', desc: 'Site quality surveillance, bar bending schedule (BBS) validation, contractor oversight & timeline adherence.' },
    { title: '9. Quality Control & Assurance', desc: 'Material testing audits, slump cone monitoring, cube compressive strength verification & pour inspections.' },
    { title: '10. Soil Investigation & Geotechnical Consultancy', desc: 'Standard Penetration Testing (SPT), safe bearing capacity (SBC) reports, and foundation recommendations.' },
  ];

  let servY = height - 115;
  services.forEach(s => {
    page2.drawRectangle({
      x: 50,
      y: servY - 32,
      width: width - 100,
      height: 44,
      color: bgLight,
      borderColor: rgb(0.9, 0.93, 0.96),
      borderWidth: 1,
    });

    page2.drawText(s.title, { x: 62, y: servY - 6, size: 10, font: fontBold, color: darkNavy });
    page2.drawText(s.desc, { x: 62, y: servY - 22, size: 8.5, font: fontRegular, color: textMuted });
    servY -= 50;
  });

  // IS Codes Section
  page2.drawText('INDIAN STANDARD (IS) COMPLIANCE BENCHMARKS', {
    x: 50,
    y: 165,
    size: 11,
    font: fontBold,
    color: darkNavy,
  });

  const codesText = 'IS 456:2000 (Plain and Reinforced Concrete) | IS 800:2007 (General Construction in Steel) | IS 1893:2016 (Earthquake Resistant Design) | IS 13920:2016 (Ductile Detailing) | IS 875:Part 1-5 (Design Loads & Wind Code) | NBC 2016 (National Building Code)';
  page2.drawText(codesText, {
    x: 50,
    y: 145,
    size: 8,
    font: fontRegular,
    color: textMuted,
  });

  // Footer page 2
  page2.drawText('SkyTech Structural Consultant   •   Confidential & Proprietary', {
    x: 50,
    y: 30,
    size: 8,
    font: fontRegular,
    color: textMuted,
  });
  page2.drawText('Page 2 of 3', { x: width - 90, y: 30, size: 8, font: fontRegular, color: textMuted });

  // -------------------------------------------------------------
  // PAGE 3: FEATURED PROJECTS & ENGAGEMENT METHODOLOGY
  // -------------------------------------------------------------
  const page3 = pdfDoc.addPage([595.28, 841.89]);
  
  page3.drawRectangle({ x: 0, y: height - 50, width: width, height: 50, color: darkNavy });
  page3.drawText('SKYTECH STRUCTURAL CONSULTANT', { x: 50, y: height - 32, size: 12, font: fontBold, color: rgb(1, 1, 1) });
  page3.drawText('PROJECT SHOWCASE & METHODOLOGY', { x: width - 250, y: height - 32, size: 10, font: fontBold, color: skyCyan });

  page3.drawText('KEY COMPLETED PROJECTS', {
    x: 50,
    y: height - 85,
    size: 14,
    font: fontBold,
    color: primaryBlue,
  });

  const projects = [
    {
      title: 'Commercial Complex - The Rajmahal Tower',
      loc: 'Jaipur, Rajasthan',
      type: 'Commercial RCC Framed Structure',
      specs: '12 Floors, 145,000 sq ft built-up area. Designed with earthquake-resistant shear wall core and post-tensioned beam layout, cutting concrete volume by 12%.'
    },
    {
      title: 'Mega Industrial Warehouse & Logistics Park',
      loc: 'Sitapura Industrial Area, Rajasthan',
      type: 'Pre-Engineered Building (PEB)',
      specs: '45-meter clear span portal framing with tapered columns, high-tensile steel roofing and integrated 10T overhead crane beams. Delivered 18 days ahead of schedule.'
    },
    {
      title: 'The Emerald Heights Residential Towers',
      loc: 'Mansarovar Extension, Jaipur',
      type: 'High-Rise Residential (G+14)',
      specs: 'Twin residential towers featuring optimized foundation design on variable strata, raft foundation with ground anchors, and full IS 13920 ductile detailing.'
    },
    {
      title: 'Samrat Ashoka University Academic Campus',
      loc: 'Rajasthan',
      type: 'Institutional Complex',
      specs: 'Auditorium with 28m clear architectural concrete arches, faculty towers, and underground archives designed for maximum durability and low thermal stress.'
    }
  ];

  let prjY = height - 110;
  projects.forEach(p => {
    page3.drawRectangle({
      x: 50,
      y: prjY - 60,
      width: width - 100,
      height: 70,
      color: bgLight,
      borderColor: rgb(0.85, 0.9, 0.95),
      borderWidth: 1,
    });

    page3.drawText(p.title, { x: 65, y: prjY - 8, size: 11, font: fontBold, color: darkNavy });
    page3.drawText(`${p.type}  •  Location: ${p.loc}`, { x: 65, y: prjY - 24, size: 8.5, font: fontBold, color: primaryBlue });
    page3.drawText(p.specs, { x: 65, y: prjY - 42, size: 8.5, font: fontRegular, color: textMuted });

    prjY -= 82;
  });

  // Engagement Process Section
  page3.drawText('OUR 4-STEP ENGINEERING WORKFLOW', {
    x: 50,
    y: 280,
    size: 12,
    font: fontBold,
    color: darkNavy,
  });

  const steps = [
    { s: '01. Consultation', d: 'Architectural drawing review, site condition study, client budgeting & structural criteria formulation.' },
    { s: '02. Analysis & Design', d: '3D FEA modeling, load combinations (gravity, seismic, wind), rebar optimization & value engineering.' },
    { s: '03. Drawings & BBS', d: 'Execution-ready GFC drawings, detailed bar bending schedules, and contractor coordination.' },
    { s: '04. Site Audits', d: 'Periodic pour inspections, reinforcement verification, concrete cube checks, and stability sign-off.' }
  ];

  let stpY = 255;
  steps.forEach(st => {
    page3.drawText(`•  ${st.s}:`, { x: 55, y: stpY, size: 9.5, font: fontBold, color: primaryBlue });
    page3.drawText(st.d, { x: 155, y: stpY, size: 9, font: fontRegular, color: textDark });
    stpY -= 22;
  });

  // Final Call to Action Block
  page3.drawRectangle({
    x: 50,
    y: 75,
    width: width - 100,
    height: 75,
    color: darkNavy,
  });

  page3.drawText('REQUEST A STRUCTURAL CONSULTATION OR DRAWING AUDIT', {
    x: 65,
    y: 125,
    size: 10,
    font: fontBold,
    color: skyCyan,
  });

  page3.drawText('Speak with our senior structural consultants today for drawing optimization or new projects.', {
    x: 65,
    y: 108,
    size: 9,
    font: fontRegular,
    color: rgb(1, 1, 1),
  });

  page3.drawText('Call / WhatsApp: +91-7737243812   |   Email: skytechjpr@gmail.com   |   Jaipur, Rajasthan', {
    x: 65,
    y: 90,
    size: 8.5,
    font: fontBold,
    color: rgb(0.85, 0.9, 0.95),
  });

  page3.drawText('SkyTech Structural Consultant   •   Confidential & Proprietary', {
    x: 50,
    y: 30,
    size: 8,
    font: fontRegular,
    color: textMuted,
  });
  page3.drawText('Page 3 of 3', { x: width - 90, y: 30, size: 8, font: fontRegular, color: textMuted });

  const pdfBytes = await pdfDoc.save();

  // Save to root and assets/docs
  fs.writeFileSync(path.join(__dirname, 'SkyTech-Structural-Consultancy-Portfolio.pdf'), pdfBytes);
  fs.writeFileSync(path.join(__dirname, 'assets', 'docs', 'SkyTech-Structural-Consultancy-Portfolio.pdf'), pdfBytes);
  console.log('Portfolio PDF successfully generated!');
}

generatePortfolio().catch(err => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});
