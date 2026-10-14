/**
 * High-fidelity, self-contained SVG book covers formatted in 3:2 portrait aspect ratio (600x900).
 * Stored as persistent Data URLs so they work 100% offline in IndexedDB without external network latency.
 */

export const FRANKENSTEIN_COVER = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 900" width="600" height="900">
  <defs>
    <linearGradient id="bgFrank" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#020c14" />
      <stop offset="40%" stop-color="#08202e" />
      <stop offset="70%" stop-color="#04121a" />
      <stop offset="100%" stop-color="#01060a" />
    </linearGradient>
    <linearGradient id="goldText" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#f5e6b3" />
      <stop offset="50%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#d4af37" />
    </linearGradient>
    <linearGradient id="electricGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.9" />
      <stop offset="50%" stop-color="#0284c7" stop-opacity="0.4" />
      <stop offset="100%" stop-color="#08202e" stop-opacity="0" />
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <!-- Background Base -->
  <rect width="600" height="900" fill="url(#bgFrank)" />
  
  <!-- Outer Double Border (Victorian Gothic) -->
  <rect x="25" y="25" width="550" height="850" rx="4" fill="none" stroke="#0284c7" stroke-width="1.5" stroke-opacity="0.4" />
  <rect x="35" y="35" width="530" height="830" rx="2" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-opacity="0.7" />
  
  <!-- Corner Ornaments -->
  <path d="M35 75 L75 35 M35 85 L85 35 M565 75 L525 35 M565 85 L515 35 M35 825 L75 865 M35 815 L85 865 M565 825 L525 865 M565 815 L515 865" stroke="#38bdf8" stroke-width="1.5" stroke-opacity="0.5" />

  <!-- Atmospheric Lightning / Sparks of Life -->
  <path d="M300 120 L285 240 L315 280 L290 390 L320 440 L270 560" fill="none" stroke="#38bdf8" stroke-width="3" filter="url(#glow)" opacity="0.8" />
  <path d="M290 390 L340 430 L320 500" fill="none" stroke="#7dd3fc" stroke-width="1.5" opacity="0.6" />
  
  <!-- Silhouette of Castle / Lab Crags -->
  <path d="M100 680 L180 590 L240 630 L300 550 L360 620 L420 580 L500 680 L500 700 L100 700 Z" fill="#030d14" opacity="0.9" />

  <!-- Author Header -->
  <text x="300" y="110" font-family="serif" font-size="18" font-weight="600" letter-spacing="6" fill="#94a3b8" text-anchor="middle">MARY WOLLSTONECRAFT SHELLEY</text>
  <line x1="200" y1="125" x2="400" y2="125" stroke="#38bdf8" stroke-width="1" stroke-opacity="0.5" />

  <!-- Main Title -->
  <text x="300" y="270" font-family="'Cinzel', Georgia, serif" font-size="44" font-weight="bold" letter-spacing="4" fill="url(#goldText)" text-anchor="middle" filter="url(#glow)">FRANKENSTEIN</text>
  
  <text x="300" y="315" font-family="serif" font-style="italic" font-size="16" letter-spacing="3" fill="#7dd3fc" text-anchor="middle">OR, THE MODERN PROMETHEUS</text>

  <!-- Creature Silhouette inside glowing circle -->
  <circle cx="300" cy="460" r="75" fill="#021522" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4 2" opacity="0.9" />
  <path d="M280 430 Q300 410 320 430 Q330 460 320 490 Q300 510 280 490 Q270 460 280 430 Z" fill="#01060a" />
  <circle cx="295" cy="445" r="3" fill="#38bdf8" filter="url(#glow)" />
  <circle cx="312" cy="445" r="3" fill="#38bdf8" filter="url(#glow)" />

  <!-- Decorative Separator -->
  <path d="M220 620 Q300 600 380 620" stroke="#38bdf8" stroke-width="1.5" fill="none" opacity="0.5" />

  <!-- Footnote / Edition details -->
  <text x="300" y="780" font-family="serif" font-size="13" letter-spacing="4" fill="#64748b" text-anchor="middle">THE 1818 TEXT</text>
  <text x="300" y="810" font-family="sans-serif" font-size="11" letter-spacing="2" fill="#0284c7" text-anchor="middle">CORN READER CLASSICS</text>
  
  <!-- Left Spine Simulation Shadow -->
  <rect x="0" y="0" width="20" height="900" fill="black" opacity="0.35" />
  <line x1="20" y1="0" x2="20" y2="900" stroke="#ffffff" stroke-width="1" stroke-opacity="0.1" />
</svg>
`)}`;

export const TIME_MACHINE_COVER = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 900" width="600" height="900">
  <defs>
    <linearGradient id="bgTime" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#180e04" />
      <stop offset="35%" stop-color="#2a1608" />
      <stop offset="70%" stop-color="#140802" />
      <stop offset="100%" stop-color="#080301" />
    </linearGradient>
    <linearGradient id="brassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="40%" stop-color="#eab308" />
      <stop offset="80%" stop-color="#ca8a04" />
      <stop offset="100%" stop-color="#854d0e" />
    </linearGradient>
    <linearGradient id="cyanPortal" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="50%" stop-color="#6366f1" />
      <stop offset="100%" stop-color="#ec4899" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="600" height="900" fill="url(#bgTime)" />

  <!-- Steampunk Gears & Time Dial Borders -->
  <rect x="25" y="25" width="550" height="850" rx="6" fill="none" stroke="url(#brassGrad)" stroke-width="2" stroke-opacity="0.6" />
  <rect x="36" y="36" width="528" height="828" rx="4" fill="none" stroke="#eab308" stroke-width="1" stroke-opacity="0.3" />

  <!-- Author Header -->
  <text x="300" y="115" font-family="'Cinzel', Georgia, serif" font-size="20" font-weight="600" letter-spacing="7" fill="#fef08a" text-anchor="middle">H. G. WELLS</text>
  <line x1="220" y1="130" x2="380" y2="130" stroke="url(#brassGrad)" stroke-width="2" />

  <!-- Large Roman Clock Dial Centerpiece -->
  <g transform="translate(300, 430)">
    <!-- Outer Gear Wheel -->
    <circle r="160" fill="none" stroke="url(#brassGrad)" stroke-width="4" stroke-opacity="0.7" />
    <circle r="145" fill="#180e04" stroke="#ca8a04" stroke-width="1.5" stroke-dasharray="6 3" />
    
    <!-- Time Vortex Rings -->
    <ellipse rx="120" ry="60" fill="none" stroke="url(#cyanPortal)" stroke-width="2.5" opacity="0.8" transform="rotate(25)" />
    <ellipse rx="120" ry="60" fill="none" stroke="url(#cyanPortal)" stroke-width="2" opacity="0.7" transform="rotate(-35)" />
    <ellipse rx="90" ry="90" fill="none" stroke="#38bdf8" stroke-width="1.5" opacity="0.6" />

    <!-- Clock Numbers -->
    <text y="-120" font-family="serif" font-size="22" font-weight="bold" fill="#fef08a" text-anchor="middle">XII</text>
    <text x="125" y="8" font-family="serif" font-size="22" font-weight="bold" fill="#fef08a" text-anchor="middle">III</text>
    <text y="135" font-family="serif" font-size="22" font-weight="bold" fill="#fef08a" text-anchor="middle">VI</text>
    <text x="-125" y="8" font-family="serif" font-size="22" font-weight="bold" fill="#fef08a" text-anchor="middle">IX</text>

    <!-- Hour & Minute Clock Hands -->
    <line x1="0" y1="0" x2="50" y2="-65" stroke="#fef08a" stroke-width="4" stroke-linecap="round" />
    <line x1="0" y1="0" x2="-70" y2="20" stroke="#fef08a" stroke-width="2.5" stroke-linecap="round" />
    <circle r="9" fill="url(#brassGrad)" />
  </g>

  <!-- Title Section -->
  <text x="300" y="210" font-family="'Cinzel', Georgia, serif" font-size="22" letter-spacing="8" fill="#ca8a04" text-anchor="middle">AN INVENTION</text>
  <text x="300" y="260" font-family="'Cinzel', Georgia, serif" font-size="44" font-weight="bold" letter-spacing="3" fill="url(#brassGrad)" text-anchor="middle">THE TIME</text>
  <text x="300" y="310" font-family="'Cinzel', Georgia, serif" font-size="44" font-weight="bold" letter-spacing="3" fill="url(#brassGrad)" text-anchor="middle">MACHINE</text>

  <!-- Subtitle -->
  <text x="300" y="660" font-family="sans-serif" font-size="13" letter-spacing="4" fill="#a1a1aa" text-anchor="middle">YEAR 802,701 A.D.</text>
  <text x="300" y="685" font-family="serif" font-style="italic" font-size="14" letter-spacing="2" fill="#ca8a04" text-anchor="middle">The Eloi and The Morlocks</text>

  <rect x="220" y="730" width="160" height="32" rx="6" fill="#2a1608" stroke="#ca8a04" stroke-width="1" />
  <text x="300" y="751" font-family="sans-serif" font-size="11" font-weight="bold" letter-spacing="2" fill="#fef08a" text-anchor="middle">ORIGINAL 1895</text>

  <!-- Spine Shadow -->
  <rect x="0" y="0" width="20" height="900" fill="black" opacity="0.35" />
  <line x1="20" y1="0" x2="20" y2="900" stroke="#ffffff" stroke-width="1" stroke-opacity="0.1" />
</svg>
`)}`;

export const ALICE_COVER = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 900" width="600" height="900">
  <defs>
    <linearGradient id="bgAlice" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e102d" />
      <stop offset="40%" stop-color="#341247" />
      <stop offset="80%" stop-color="#180724" />
      <stop offset="100%" stop-color="#0a0210" />
    </linearGradient>
    <linearGradient id="roseGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbcfe8" />
      <stop offset="50%" stop-color="#f472b6" />
      <stop offset="100%" stop-color="#db2777" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="600" height="900" fill="url(#bgAlice)" />

  <!-- Borders with playing card suit symbols -->
  <rect x="25" y="25" width="550" height="850" rx="8" fill="none" stroke="#f472b6" stroke-width="2" stroke-opacity="0.5" />
  <rect x="36" y="36" width="528" height="828" rx="6" fill="none" stroke="#ec4899" stroke-width="1" stroke-opacity="0.25" />

  <!-- Corner Card Suits -->
  <text x="50" y="65" font-size="20" fill="#f43f5e" text-anchor="middle">♥</text>
  <text x="550" y="65" font-size="20" fill="#cbd5e1" text-anchor="middle">♠</text>
  <text x="50" y="855" font-size="20" fill="#cbd5e1" text-anchor="middle">♣</text>
  <text x="550" y="855" font-size="20" fill="#f43f5e" text-anchor="middle">♦</text>

  <!-- Author Header -->
  <text x="300" y="115" font-family="'Cinzel', Georgia, serif" font-size="18" font-weight="600" letter-spacing="6" fill="#fbcfe8" text-anchor="middle">LEWIS CARROLL</text>
  <line x1="220" y1="130" x2="380" y2="130" stroke="#f472b6" stroke-width="1.5" stroke-opacity="0.6" />

  <!-- Title -->
  <text x="300" y="210" font-family="'Cinzel', Georgia, serif" font-size="44" font-weight="bold" letter-spacing="3" fill="#ffffff" text-anchor="middle">ALICE'S</text>
  <text x="300" y="255" font-family="'Cinzel', Georgia, serif" font-size="30" font-weight="600" letter-spacing="4" fill="url(#roseGold)" text-anchor="middle">ADVENTURES IN</text>
  <text x="300" y="305" font-family="'Cinzel', Georgia, serif" font-size="40" font-weight="bold" letter-spacing="4" fill="#ffffff" text-anchor="middle">WONDERLAND</text>

  <!-- Centerpiece Keyhole & White Rabbit Silhouette -->
  <g transform="translate(300, 480)">
    <!-- Golden Keyhole Glow -->
    <path d="M-40 -40 A 50 50 0 1 1 40 -40 L 60 70 L -60 70 Z" fill="#240e36" stroke="#f472b6" stroke-width="3" />
    
    <!-- White Rabbit with Watch Silhouette -->
    <!-- Ears -->
    <path d="M-15 -35 Q -25 -75 -18 -100 Q -10 -75 -8 -35 Z" fill="#fdf2f8" />
    <path d="M5 -35 Q 15 -75 22 -95 Q 12 -75 10 -35 Z" fill="#fdf2f8" />
    <!-- Head & Body -->
    <ellipse cx="0" cy="-20" rx="20" ry="22" fill="#fdf2f8" />
    <ellipse cx="5" cy="25" rx="32" ry="36" fill="#fdf2f8" />
    <!-- Pocket Watch dangle -->
    <circle cx="-25" cy="20" r="14" fill="#fbbf24" stroke="#d97706" stroke-width="2" />
    <line x1="-25" y1="20" x2="-22" y2="13" stroke="#78350f" stroke-width="2" />
    <path d="M-5 10 Q -15 15 -25 10" fill="none" stroke="#fbbf24" stroke-width="2" />
  </g>

  <!-- Teacup / Drink Me Silhouette -->
  <text x="300" y="650" font-family="serif" font-style="italic" font-size="16" letter-spacing="3" fill="#f472b6" text-anchor="middle">"Curiouser and curiouser!"</text>
  <text x="300" y="740" font-family="sans-serif" font-size="12" letter-spacing="4" fill="#94a3b8" text-anchor="middle">DOWN THE RABBIT HOLE</text>
  <text x="300" y="770" font-family="sans-serif" font-size="10" letter-spacing="2" fill="#ec4899" text-anchor="middle">ILLUSTRATED CLASSICS</text>

  <!-- Spine Shadow -->
  <rect x="0" y="0" width="20" height="900" fill="black" opacity="0.35" />
  <line x1="20" y1="0" x2="20" y2="900" stroke="#ffffff" stroke-width="1" stroke-opacity="0.1" />
</svg>
`)}`;

export const GUIDE_COVER = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 900" width="600" height="900">
  <defs>
    <linearGradient id="bgGuide" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0284c7" />
      <stop offset="40%" stop-color="#0369a1" />
      <stop offset="80%" stop-color="#0c4a6e" />
      <stop offset="100%" stop-color="#082f49" />
    </linearGradient>
    <linearGradient id="acrylicGlass" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.05" />
    </linearGradient>
    <linearGradient id="cornGlow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="100%" stop-color="#eab308" />
    </linearGradient>
  </defs>

  <!-- Background Base -->
  <rect width="600" height="900" fill="url(#bgGuide)" />

  <!-- Luminous Ambient Orbs -->
  <circle cx="500" cy="200" r="160" fill="#38bdf8" opacity="0.3" filter="blur(60px)" />
  <circle cx="100" cy="650" r="140" fill="#0284c7" opacity="0.4" filter="blur(50px)" />

  <!-- Acrylic Frosted Card in Center -->
  <rect x="50" y="60" width="500" height="780" rx="24" fill="url(#acrylicGlass)" stroke="#ffffff" stroke-width="2" stroke-opacity="0.3" />
  
  <!-- Windows 11 Fluent 4-Pane Badge -->
  <g transform="translate(300, 150)">
    <rect x="-32" y="-32" width="28" height="28" rx="4" fill="#38bdf8" />
    <rect x="4" y="-32" width="28" height="28" rx="4" fill="#0284c7" />
    <rect x="-32" y="4" width="28" height="28" rx="4" fill="#0369a1" />
    <rect x="4" y="4" width="28" height="28" rx="4" fill="#7dd3fc" />
  </g>

  <!-- Header Text -->
  <text x="300" y="240" font-family="'Segoe UI', system-ui, sans-serif" font-size="14" font-weight="bold" letter-spacing="5" fill="#bae6fd" text-anchor="middle">WINDOWS 10 & 11</text>
  
  <!-- Main Title -->
  <text x="300" y="300" font-family="'Segoe UI', system-ui, sans-serif" font-size="44" font-weight="900" letter-spacing="2" fill="#ffffff" text-anchor="middle">CORN READER</text>
  <text x="300" y="345" font-family="'Segoe UI', system-ui, sans-serif" font-size="22" font-weight="600" letter-spacing="4" fill="url(#cornGlow)" text-anchor="middle">OFFICIAL USER MANUAL</text>

  <!-- Open Book Fluent Icon in Center -->
  <g transform="translate(300, 480)">
    <!-- Book Pages Glow -->
    <path d="M-100 -40 C-60 -55 -20 -45 0 -25 C20 -45 60 -55 100 -40 L90 80 C50 65 20 70 0 90 C-20 70 -50 65 -90 80 Z" fill="#0f172a" stroke="#38bdf8" stroke-width="3" />
    <path d="M-85 -30 C-50 -42 -15 -35 0 -18 L0 75 C-15 58 -50 52 -85 65 Z" fill="#f8fafc" />
    <path d="M85 -30 C50 -42 15 -35 0 -18 L0 75 C15 58 50 52 85 65 Z" fill="#e2e8f0" />
    <line x1="0" y1="-18" x2="0" y2="75" stroke="#0284c7" stroke-width="3" />
  </g>

  <!-- Feature Pill Tags -->
  <g transform="translate(300, 640)">
    <rect x="-180" y="-14" width="110" height="28" rx="14" fill="#ffffff" fill-opacity="0.15" stroke="#ffffff" stroke-width="1" stroke-opacity="0.3" />
    <text x="-125" y="4" font-family="sans-serif" font-size="10" font-weight="bold" fill="#ffffff" text-anchor="middle">FROSTED GLASS</text>

    <rect x="-55" y="-14" width="110" height="28" rx="14" fill="#ffffff" fill-opacity="0.15" stroke="#ffffff" stroke-width="1" stroke-opacity="0.3" />
    <text x="0" y="4" font-family="sans-serif" font-size="10" font-weight="bold" fill="#ffffff" text-anchor="middle">OFFLINE DB</text>

    <rect x="70" y="-14" width="110" height="28" rx="14" fill="#ffffff" fill-opacity="0.15" stroke="#ffffff" stroke-width="1" stroke-opacity="0.3" />
    <text x="125" y="4" font-family="sans-serif" font-size="10" font-weight="bold" fill="#ffffff" text-anchor="middle">CLOUD SYNC</text>
  </g>

  <!-- Footer Edition -->
  <text x="300" y="740" font-family="'Segoe UI', sans-serif" font-size="12" letter-spacing="3" fill="#bae6fd" text-anchor="middle">KEYBOARD SHORTCUTS & PERFORMANCE GUIDE</text>
  <text x="300" y="770" font-family="'Segoe UI', sans-serif" font-size="11" font-weight="600" letter-spacing="1" fill="#7dd3fc" text-anchor="middle">EDITION 2026 • HIGH-DPI ACCELERATED</text>

  <!-- Spine Shadow -->
  <rect x="0" y="0" width="20" height="900" fill="black" opacity="0.35" />
  <line x1="20" y1="0" x2="20" y2="900" stroke="#ffffff" stroke-width="1" stroke-opacity="0.1" />
</svg>
`)}`;

export const CRIMSON_ROYAL_COVER = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 900" width="600" height="900">
  <defs>
    <linearGradient id="bgCrimson" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4c0519" />
      <stop offset="50%" stop-color="#881337" />
      <stop offset="100%" stop-color="#1c030a" />
    </linearGradient>
    <linearGradient id="goldGlow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="100%" stop-color="#d97706" />
    </linearGradient>
  </defs>
  <rect width="600" height="900" fill="url(#bgCrimson)" />
  <rect x="30" y="30" width="540" height="840" rx="8" fill="none" stroke="#fef08a" stroke-width="2" stroke-opacity="0.4" />
  <rect x="42" y="42" width="516" height="816" rx="6" fill="none" stroke="#f59e0b" stroke-width="1" stroke-opacity="0.3" />
  <circle cx="300" cy="380" r="140" fill="none" stroke="#fef08a" stroke-width="1.5" stroke-opacity="0.3" stroke-dasharray="6,6" />
  <circle cx="300" cy="380" r="110" fill="#4c0519" fill-opacity="0.6" stroke="#fbbf24" stroke-width="2" />
  <polygon points="300,290 320,350 380,350 330,390 350,450 300,410 250,450 270,390 220,350 280,350" fill="url(#goldGlow)" />
  <text x="300" y="160" font-family="serif" font-size="16" letter-spacing="6" fill="#fbcfe8" text-anchor="middle">SPECIAL EDITION</text>
  <text x="300" y="580" font-family="'Cinzel', Georgia, serif" font-size="38" font-weight="bold" letter-spacing="3" fill="#ffffff" text-anchor="middle">CRIMSON ROYAL</text>
  <text x="300" y="630" font-family="serif" font-style="italic" font-size="18" letter-spacing="2" fill="#fde047" text-anchor="middle">Corn Reader Library</text>
  <rect x="0" y="0" width="20" height="900" fill="black" opacity="0.35" />
</svg>
`)}`;

export const EMERALD_FOREST_COVER = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 900" width="600" height="900">
  <defs>
    <linearGradient id="bgEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#022c22" />
      <stop offset="60%" stop-color="#064e3b" />
      <stop offset="100%" stop-color="#021f18" />
    </linearGradient>
  </defs>
  <rect width="600" height="900" fill="url(#bgEmerald)" />
  <rect x="30" y="30" width="540" height="840" rx="10" fill="none" stroke="#34d399" stroke-width="2" stroke-opacity="0.4" />
  <path d="M300 240 L380 400 L220 400 Z M300 320 L400 480 L200 480 Z M300 400 L420 580 L180 580 Z" fill="#047857" opacity="0.5" stroke="#6ee7b7" stroke-width="2" />
  <text x="300" y="160" font-family="serif" font-size="15" letter-spacing="5" fill="#a7f3d0" text-anchor="middle">VERDANT CHRONICLES</text>
  <text x="300" y="660" font-family="'Cinzel', Georgia, serif" font-size="36" font-weight="bold" letter-spacing="3" fill="#ffffff" text-anchor="middle">EMERALD WILDS</text>
  <text x="300" y="705" font-family="serif" font-style="italic" font-size="16" letter-spacing="2" fill="#6ee7b7" text-anchor="middle">Illustrated Volume</text>
  <rect x="0" y="0" width="20" height="900" fill="black" opacity="0.35" />
</svg>
`)}`;

export const OBSIDIAN_NOIR_COVER = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 900" width="600" height="900">
  <defs>
    <linearGradient id="bgNoir" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#09090b" />
      <stop offset="50%" stop-color="#18181b" />
      <stop offset="100%" stop-color="#000000" />
    </linearGradient>
  </defs>
  <rect width="600" height="900" fill="url(#bgNoir)" />
  <rect x="35" y="35" width="530" height="830" rx="4" fill="none" stroke="#71717a" stroke-width="1.5" stroke-opacity="0.5" />
  <circle cx="300" cy="380" r="120" fill="none" stroke="#a1a1aa" stroke-width="1" stroke-opacity="0.3" />
  <polygon points="300,280 390,440 210,440" fill="none" stroke="#e4e4e7" stroke-width="2" />
  <text x="300" y="180" font-family="sans-serif" font-size="14" font-weight="600" letter-spacing="8" fill="#a1a1aa" text-anchor="middle">MODERN ARCHIVE</text>
  <text x="300" y="560" font-family="'Cinzel', Georgia, serif" font-size="40" font-weight="900" letter-spacing="4" fill="#fafafa" text-anchor="middle">OBSIDIAN</text>
  <text x="300" y="610" font-family="sans-serif" font-size="13" letter-spacing="4" fill="#71717a" text-anchor="middle">COMPLETE ANTHOLOGY</text>
  <rect x="0" y="0" width="20" height="900" fill="black" opacity="0.4" />
</svg>
`)}`;

export const CYBER_NEON_COVER = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 900" width="600" height="900">
  <defs>
    <linearGradient id="bgCyber" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="50%" stop-color="#1e1b4b" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
    <linearGradient id="cyberText" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#06b6d4" />
      <stop offset="50%" stop-color="#ec4899" />
      <stop offset="100%" stop-color="#8b5cf6" />
    </linearGradient>
  </defs>
  <rect width="600" height="900" fill="url(#bgCyber)" />
  <rect x="30" y="30" width="540" height="840" rx="12" fill="none" stroke="#06b6d4" stroke-width="2" stroke-opacity="0.5" />
  <path d="M100 450 L300 250 L500 450 L300 650 Z" fill="none" stroke="#ec4899" stroke-width="2" stroke-opacity="0.6" />
  <circle cx="300" cy="450" r="70" fill="#06b6d4" fill-opacity="0.2" stroke="#8b5cf6" stroke-width="3" />
  <text x="300" y="150" font-family="'JetBrains Mono', monospace" font-size="14" letter-spacing="6" fill="#38bdf8" text-anchor="middle">CYBERNETIC ARCHIVE</text>
  <text x="300" y="740" font-family="system-ui, sans-serif" font-size="38" font-weight="900" letter-spacing="3" fill="url(#cyberText)" text-anchor="middle">SYNAPSE PROTOCOL</text>
  <rect x="0" y="0" width="20" height="900" fill="black" opacity="0.35" />
</svg>
`)}`;

export interface PresetCoverOption {
  id: string;
  name: string;
  category: string;
  coverUrl: string;
}

export const PRESET_COVERS: PresetCoverOption[] = [
  { id: 'frankenstein', name: 'Victorian Gothic', category: 'Classic Literature', coverUrl: FRANKENSTEIN_COVER },
  { id: 'time-machine', name: 'Time Warp Gold', category: 'Sci-Fi', coverUrl: TIME_MACHINE_COVER },
  { id: 'alice', name: 'Wonderland Dream', category: 'Fantasy', coverUrl: ALICE_COVER },
  { id: 'guide', name: 'Corn Fluent Blue', category: 'Guides', coverUrl: GUIDE_COVER },
  { id: 'crimson', name: 'Crimson Royal', category: 'Fiction', coverUrl: CRIMSON_ROYAL_COVER },
  { id: 'emerald', name: 'Emerald Wilds', category: 'Adventure', coverUrl: EMERALD_FOREST_COVER },
  { id: 'obsidian', name: 'Obsidian Noir', category: 'Mystery', coverUrl: OBSIDIAN_NOIR_COVER },
  { id: 'cyber', name: 'Cyber Neon', category: 'Sci-Fi', coverUrl: CYBER_NEON_COVER },
];

/**
 * Dynamically generates a customized 3:2 portrait SVG cover Data URL using the given title, author, and tint.
 */
export function generateCustomCoverUrl(
  title: string, 
  author: string, 
  colorTheme: 'sky' | 'rose' | 'amber' | 'emerald' | 'purple' = 'sky'
): string {
  const themes = {
    sky: { bg1: '#082f49', bg2: '#0284c7', bg3: '#030712', accent: '#38bdf8', text: '#bae6fd' },
    rose: { bg1: '#4c0519', bg2: '#9f1239', bg3: '#0f0206', accent: '#fb7185', text: '#fecdd3' },
    amber: { bg1: '#451a03', bg2: '#b45309', bg3: '#120500', accent: '#fbbf24', text: '#fef3c7' },
    emerald: { bg1: '#022c22', bg2: '#047857', bg3: '#01140e', accent: '#34d399', text: '#a7f3d0' },
    purple: { bg1: '#2e1065', bg2: '#7c3aed', bg3: '#080214', accent: '#c084fc', text: '#ede9fe' },
  };

  const t = themes[colorTheme];
  const safeTitle = (title || 'Untitled Book').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const safeAuthor = (author || 'Unknown Author').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 900" width="600" height="900">
  <defs>
    <linearGradient id="dynBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${t.bg1}" />
      <stop offset="45%" stop-color="${t.bg2}" />
      <stop offset="100%" stop-color="${t.bg3}" />
    </linearGradient>
    <linearGradient id="glass" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.18" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.04" />
    </linearGradient>
  </defs>
  <rect width="600" height="900" fill="url(#dynBg)" />
  <rect x="35" y="35" width="530" height="830" rx="16" fill="url(#glass)" stroke="#ffffff" stroke-width="1.5" stroke-opacity="0.25" />
  <circle cx="300" cy="360" r="110" fill="none" stroke="${t.accent}" stroke-width="2" stroke-opacity="0.4" />
  <path d="M260 360 L300 320 L340 360 L300 400 Z" fill="${t.accent}" fill-opacity="0.7" />
  <text x="300" y="160" font-family="'Cinzel', Georgia, serif" font-size="15" font-weight="600" letter-spacing="5" fill="${t.text}" text-anchor="middle">${safeAuthor.toUpperCase()}</text>
  <text x="300" y="560" font-family="'Cinzel', Georgia, serif" font-size="34" font-weight="bold" fill="#ffffff" text-anchor="middle">${safeTitle}</text>
  <text x="300" y="620" font-family="sans-serif" font-size="14" font-weight="600" letter-spacing="3" fill="${t.accent}" text-anchor="middle">CORN READER EDITION</text>
  <rect x="0" y="0" width="20" height="900" fill="black" opacity="0.35" />
  <line x1="20" y1="0" x2="20" y2="900" stroke="#ffffff" stroke-width="1" stroke-opacity="0.1" />
</svg>
`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

