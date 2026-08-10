const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');

// Ensure directories exist
const dirs = [
  'public/branding',
  'src/assets/branding'
];
dirs.forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// 1. Full Horizontal Logo SVG (Transparent Background)
// Dimensions: 500x130 (Aspect ratio ~3.85:1)
const horizontalLogoSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 140" width="520" height="140">
  <defs>
    <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFA033" />
      <stop offset="100%" stop-color="#FF6B00" />
    </linearGradient>
    <linearGradient id="orangeShadowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E05500" />
      <stop offset="100%" stop-color="#B83A00" />
    </linearGradient>
    <filter id="subtleGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#FF6B00" flood-opacity="0.25" />
    </filter>
  </defs>

  <!-- Group for Logo Icon -->
  <g transform="translate(10, 5)">
    <!-- Tap Ripple Arc 1 (Outer) -->
    <path d="M 28 42 A 38 38 0 0 1 82 12" fill="none" stroke="url(#orangeGrad)" stroke-width="7" stroke-linecap="round" />
    <!-- Tap Ripple Arc 2 (Inner) -->
    <path d="M 38 48 A 24 24 0 0 1 72 28" fill="none" stroke="url(#orangeGrad)" stroke-width="6.5" stroke-linecap="round" />

    <!-- Cursor Pointer Arrow with 3D Bevel -->
    <!-- Left / Top Light Face -->
    <path d="M 54 48 L 118 112 L 92 112 L 102 142 L 86 148 L 74 120 L 54 136 Z" fill="url(#orangeGrad)" filter="url(#subtleGlow)" />
    <!-- Right / Bottom Shadow Face -->
    <path d="M 54 48 L 118 112 L 92 112 L 102 142 L 86 148 Z" fill="url(#orangeShadowGrad)" opacity="0.45" />
  </g>

  <!-- Wordmark Text -->
  <g transform="translate(170, 96)">
    <text font-family="'Plus Jakarta Sans', 'Inter', 'Outfit', system-ui, sans-serif" font-weight="800" font-size="78" letter-spacing="-1.5">
      <tspan fill="#FFFFFF">Tool</tspan><tspan fill="#FF7A00">Tap</tspan>
    </text>
  </g>
</svg>
`;

// 2. Icon Only SVG (Transparent Background)
// Dimensions: 160x160
const iconOnlySvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
  <defs>
    <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFA033" />
      <stop offset="100%" stop-color="#FF6B00" />
    </linearGradient>
    <linearGradient id="orangeShadowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E05500" />
      <stop offset="100%" stop-color="#B83A00" />
    </linearGradient>
    <filter id="iconGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="#FF6B00" flood-opacity="0.3" />
    </filter>
  </defs>

  <g transform="translate(10, 10)">
    <!-- Tap Ripple Arc 1 (Outer) -->
    <path d="M 32 46 A 42 42 0 0 1 92 14" fill="none" stroke="url(#orangeGrad)" stroke-width="8" stroke-linecap="round" />
    <!-- Tap Ripple Arc 2 (Inner) -->
    <path d="M 44 54 A 26 26 0 0 1 82 32" fill="none" stroke="url(#orangeGrad)" stroke-width="7.5" stroke-linecap="round" />

    <!-- Cursor Pointer Arrow -->
    <path d="M 60 52 L 130 122 L 100 122 L 112 154 L 94 160 L 80 130 L 60 148 Z" fill="url(#orangeGrad)" filter="url(#iconGlow)" />
    <path d="M 60 52 L 130 122 L 100 122 L 112 154 L 94 160 Z" fill="url(#orangeShadowGrad)" opacity="0.45" />
  </g>
</svg>
`;

// 3. Square Favicon SVG (Dark Squircle with Orange Border)
// Dimensions: 512x512
const squareFaviconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFA033" />
      <stop offset="100%" stop-color="#FF6B00" />
    </linearGradient>
    <linearGradient id="orangeShadowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E05500" />
      <stop offset="100%" stop-color="#B83A00" />
    </linearGradient>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1A1B20" />
      <stop offset="100%" stop-color="#121316" />
    </linearGradient>
    <filter id="favGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="12" flood-color="#FF6B00" flood-opacity="0.35" />
    </filter>
  </defs>

  <!-- Dark Background Squircle -->
  <rect x="24" y="24" width="464" height="464" rx="110" fill="url(#bgGrad)" stroke="#FF7A00" stroke-width="18" />

  <!-- Center Content -->
  <g transform="translate(68, 62) scale(2.4)">
    <!-- Tap Ripple Arc 1 (Outer) -->
    <path d="M 32 46 A 42 42 0 0 1 92 14" fill="none" stroke="url(#orangeGrad)" stroke-width="8" stroke-linecap="round" />
    <!-- Tap Ripple Arc 2 (Inner) -->
    <path d="M 44 54 A 26 26 0 0 1 82 32" fill="none" stroke="url(#orangeGrad)" stroke-width="7.5" stroke-linecap="round" />

    <!-- Cursor Pointer Arrow -->
    <path d="M 60 52 L 130 122 L 100 122 L 112 154 L 94 160 L 80 130 L 60 148 Z" fill="url(#orangeGrad)" filter="url(#favGlow)" />
    <path d="M 60 52 L 130 122 L 100 122 L 112 154 L 94 160 Z" fill="url(#orangeShadowGrad)" opacity="0.45" />
  </g>
</svg>
`;

// Write SVGs to files
fs.writeFileSync('public/branding/tooltap-logo.svg', horizontalLogoSvg.trim());
fs.writeFileSync('src/assets/branding/tooltap-logo.svg', horizontalLogoSvg.trim());

fs.writeFileSync('public/branding/tooltap-icon.svg', iconOnlySvg.trim());
fs.writeFileSync('src/assets/branding/tooltap-icon.svg', iconOnlySvg.trim());

fs.writeFileSync('public/branding/tooltap-favicon.svg', squareFaviconSvg.trim());

// Render SVGs to PNGs
async function renderPng(svgContent, targetPath, fitWidth, fitHeight) {
  const opts = { fitTo: {} };
  if (fitWidth) opts.fitTo.mode = 'width', opts.fitTo.value = fitWidth;
  if (fitHeight) opts.fitTo.mode = 'height', opts.fitTo.value = fitHeight;
  if (!fitWidth && !fitHeight) opts.fitTo.mode = 'original';

  const resvg = new Resvg(svgContent, opts);
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();
  fs.writeFileSync(targetPath, pngBuffer);
  console.log(`Generated: ${targetPath} (${pngData.width}x${pngData.height})`);
}

async function buildAll() {
  // Horizontal logo PNGs
  await renderPng(horizontalLogoSvg, 'public/branding/tooltap-logo.png', 520);
  await renderPng(horizontalLogoSvg, 'src/assets/branding/tooltap-logo.png', 520);

  // Icon PNGs
  await renderPng(iconOnlySvg, 'public/branding/tooltap-icon.png', 320);
  await renderPng(iconOnlySvg, 'src/assets/branding/tooltap-icon.png', 320);

  // Favicons & Touch Icons
  await renderPng(squareFaviconSvg, 'public/favicon.png', 64);
  await renderPng(squareFaviconSvg, 'public/favicon-16x16.png', 16);
  await renderPng(squareFaviconSvg, 'public/favicon-32x32.png', 32);
  await renderPng(squareFaviconSvg, 'public/apple-touch-icon.png', 180);
  await renderPng(squareFaviconSvg, 'public/android-chrome-192x192.png', 192);
  await renderPng(squareFaviconSvg, 'public/android-chrome-512x512.png', 512);

  // Copy favicon to dist if exists
  if (fs.existsSync('dist')) {
    fs.copyFileSync('public/favicon.png', 'dist/favicon.png');
  }

  console.log('All brand assets generated successfully!');
}

buildAll().catch(err => {
  console.error(err);
  process.exit(1);
});
