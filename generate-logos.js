const fs = require('fs');

function generateLogoSvg(isWhite = false) {
  const textColor = isWhite ? '#ffffff' : '#071e3d';
  const subtitleColor = isWhite ? '#93c5fd' : '#0b2b5c';
  const taglineColor = isWhite ? '#38bdf8' : '#0284c7';
  const lineColor = isWhite ? '#38bdf8' : '#0ea5e9';
  const foundationFill = '#00a8cc';
  const foundationStroke = isWhite ? '#38bdf8' : '#1e40af';

  const numLayers = 8;
  const leftLayers = [];
  const rightLayers = [];

  for (let i = 0; i < numLayers; i++) {
    const t0 = i / numLayers;
    const t1 = (i + 1) / numLayers;

    const yLeft0 = 17 + t0 * 33;
    const yLeft1 = 17 + t1 * 33;
    const ySpine0 = 5 + t0 * 37;
    const ySpine1 = 5 + t1 * 37;

    const yRight0 = 17 + t0 * 33;
    const yRight1 = 17 + t1 * 33;

    // Alternating rich blue and bright cyan layers with white separation lines
    const leftFill = i % 2 === 0 ? '#3b5cb8' : '#68a0f0';
    const rightFill = i % 2 === 0 ? '#2642a0' : '#4d8ee5';

    leftLayers.push(`
      <polygon points="6,${yLeft0.toFixed(2)} 32,${ySpine0.toFixed(2)} 32,${ySpine1.toFixed(2)} 6,${yLeft1.toFixed(2)}" fill="${leftFill}" stroke="#ffffff" stroke-width="0.5"/>
    `);

    rightLayers.push(`
      <polygon points="32,${ySpine0.toFixed(2)} 58,${yRight0.toFixed(2)} 58,${yRight1.toFixed(2)} 32,${ySpine1.toFixed(2)}" fill="${rightFill}" stroke="#ffffff" stroke-width="0.5"/>
    `);
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 64" fill="none" class="skytech-brand-logo${isWhite ? '-white' : ''}">
  <defs>
    <filter id="logoShadow${isWhite ? 'W' : ''}" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="1.5" stdDeviation="2" flood-color="${isWhite ? '#38bdf8' : '#0284c7'}" flood-opacity="${isWhite ? '0.3' : '0.2'}"/>
    </filter>
  </defs>

  <!-- Official SkyTech 3D Layered Isometric Building Mark (Exact Match to Official Artwork) -->
  <g transform="translate(2, 0)" filter="url(#logoShadow${isWhite ? 'W' : ''})">
    <!-- Left Face Layer Bands -->
    <g id="leftFaceLayers${isWhite ? 'W' : ''}">
      ${leftLayers.join('')}
    </g>

    <!-- Right Face Layer Bands -->
    <g id="rightFaceLayers${isWhite ? 'W' : ''}">
      ${rightLayers.join('')}
    </g>

    <!-- Center Ridge Highlight Line -->
    <line x1="32" y1="5" x2="32" y2="42" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round"/>

    <!-- Left Outer Edge Line -->
    <line x1="6" y1="17" x2="6" y2="50" stroke="#1e3a8a" stroke-width="0.7"/>

    <!-- Right Outer Edge Line -->
    <line x1="58" y1="17" x2="58" y2="50" stroke="#172554" stroke-width="0.7"/>

    <!-- Bottom Foundation Pedestal / Base Slab -->
    <polygon points="10,50 32,60 54,50 32,43" fill="${foundationFill}" stroke="${foundationStroke}" stroke-width="1" stroke-linejoin="round"/>
    <polyline points="10,50 32,60 54,50" fill="none" stroke="#67e8f9" stroke-width="0.8"/>
  </g>

  <!-- Official Typography Section (High Legibility & Prominent Tagline) -->
  <g transform="translate(74, 0)">
    <!-- Main Wordmark: TheSkyTech -->
    <text x="0" y="27" font-family="'Cinzel', 'Playfair Display', 'Times New Roman', 'Georgia', serif" font-size="25" font-weight="900" fill="${textColor}" letter-spacing="1.5">TheSkyTech</text>

    <!-- Subtitle: STRUCTURAL CONSULTANT -->
    <text x="1" y="43" font-family="'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" font-size="10.5" font-weight="800" fill="${subtitleColor}" letter-spacing="2.0">STRUCTURAL CONSULTANT</text>

    <!-- Prominent Tagline: —— QUALITY MATTERS —— -->
    <g transform="translate(1, 57)">
      <line x1="0" y1="-3" x2="24" y2="-3" stroke="${lineColor}" stroke-width="1.5" stroke-linecap="round"/>
      <text x="32" y="0" font-family="'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" font-size="10" font-weight="900" fill="${taglineColor}" letter-spacing="3.0">QUALITY MATTERS</text>
      <line x1="195" y1="-3" x2="220" y2="-3" stroke="${lineColor}" stroke-width="1.5" stroke-linecap="round"/>
    </g>
  </g>
</svg>`;
}

const svgColor = generateLogoSvg(false);
const svgWhite = generateLogoSvg(true);

fs.writeFileSync('assets/images/skytech-logo.svg', svgColor, 'utf8');
fs.writeFileSync('public/skytech-logo.svg', svgColor, 'utf8');
fs.writeFileSync('assets/images/skytech-logo-white.svg', svgWhite, 'utf8');
fs.writeFileSync('public/skytech-logo-white.svg', svgWhite, 'utf8');

console.log('Successfully generated improved logos with prominent QUALITY MATTERS tagline.');
