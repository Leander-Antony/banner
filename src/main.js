import './style.css';

// Handcrafted Developer Dark Themes
const THEMES = {
  nordic_navy: {
    name: 'Nordic Slate',
    bg1: '#0b1329', bg2: '#111c3d', bg3: '#070c1a',
    primary: '#38bdf8', secondary: '#818cf8',
    glowA: '#38bdf8', glowB: '#818cf8',
    cardBg: '#182752', termBg: '#111c3d', termHeader: '#1d2e61',
    pillBorderA: '#38bdf8', pillBorderB: '#818cf8'
  },
  titanium: {
    name: 'Minimalist Titanium',
    bg1: '#09090b', bg2: '#121215', bg3: '#050506',
    primary: '#e4e4e7', secondary: '#9ca3af',
    glowA: '#71717a', glowB: '#52525b',
    cardBg: '#18181b', termBg: '#121215', termHeader: '#1c1c20',
    pillBorderA: '#e4e4e7', pillBorderB: '#71717a'
  },
  emerald_slate: {
    name: 'Forest Emerald',
    bg1: '#090e17', bg2: '#0f1726', bg3: '#060910',
    primary: '#10b981', secondary: '#38bdf8',
    glowA: '#10b981', glowB: '#38bdf8',
    cardBg: '#152033', termBg: '#0f1726', termHeader: '#1a273d',
    pillBorderA: '#10b981', pillBorderB: '#38bdf8'
  },
  monokai_matte: {
    name: 'Monokai Warm',
    bg1: '#141315', bg2: '#1e1c21', bg3: '#0d0c0e',
    primary: '#ffd866', secondary: '#a9dc76',
    glowA: '#ffd866', glowB: '#a9dc76',
    cardBg: '#26242b', termBg: '#1e1c21', termHeader: '#2f2d36',
    pillBorderA: '#ffd866', pillBorderB: '#a9dc76'
  },
  obsidian_violet: {
    name: 'Midnight Obsidian',
    bg1: '#0a0814', bg2: '#120f24', bg3: '#06050d',
    primary: '#a78bfa', secondary: '#f472b6',
    glowA: '#a78bfa', glowB: '#f472b6',
    cardBg: '#1a1633', termBg: '#120f24', termHeader: '#221c42',
    pillBorderA: '#a78bfa', pillBorderB: '#f472b6'
  }
};

const state = {
  layout: 'bento',
  theme: 'nordic_navy',
  name: 'Leander Antony',
  primaryRole: 'AI & Data Science Student',
  subtitle: '// AI/ML student & full-stack dev',
  statusText: 'available for opportunities',
  avatarUrl: 'https://github.com/Leander-Antony.png',
  avatarDataUrl: '',
  terminalTitle: '~/leander-antony — zsh',
  headline: "Hi, I'm Leander Antony",
  location: 'India',
  education: 'B.Tech, Artificial Intelligence & Data Science',
  focus: 'LLM Text Game & Advanced ML Tools',
  githubUser: 'Leander-Antony',
  email: 'leander.antony2023@gmail.com',
  quote: 'When you decided to go to the sea, it was your own decision.',
  quoteAuthor: 'Roronoa Zoro (One Piece)',
  selectedSkills: ['Python', 'PyTorch', 'TensorFlow', 'JavaScript', 'React', 'Svelte', 'MySQL', 'Docker', 'Git', 'Pandas', 'Flask'],
  availableSkills: [
    'Python', 'PyTorch', 'TensorFlow', 'JavaScript', 'TypeScript', 'React', 'Svelte', 'Vue',
    'Node.js', 'Flask', 'Django', 'FastAPI', 'MySQL', 'PostgreSQL', 'MongoDB', 'Docker',
    'AWS', 'Git', 'C', 'C++', 'Java', 'Rust', 'Go', 'Pandas', 'NumPy', 'Scikit-Learn'
  ]
};

// Convert image URL to Base64 Data URL so SVG image tags render inside GitHub READMEs
async function fetchAvatarAsBase64(url) {
  if (!url) return '';
  if (url.startsWith('data:image/')) return url;

  try {
    const res = await fetch(url, { mode: 'cors' });
    if (res.ok) {
      const blob = await res.blob();
      return await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result || url);
        reader.onerror = () => resolve(url);
        reader.readAsDataURL(blob);
      });
    }
  } catch (e) {
    // console.warn('CORS / fetch avatar failed, using canvas fallback...', e);
  }

  try {
    return await new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || 200;
          canvas.height = img.naturalHeight || 200;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        } catch (err) {
          resolve(url);
        }
      };
      img.onerror = () => resolve(url);
      img.src = url;
    });
  } catch (err) {
    return url;
  }
}

async function syncAvatarBase64() {
  if (!state.avatarUrl) {
    state.avatarDataUrl = '';
    updatePreview();
    return;
  }
  const base64 = await fetchAvatarAsBase64(state.avatarUrl);
  if (base64) {
    state.avatarDataUrl = base64;
    updatePreview();
  }
}

// SVG Text Line Wrapping Helper
function wrapText(text, maxCharsPerLine = 32) {
  if (!text) return [];
  const words = text.trim().split(/\s+/);
  const lines = [];
  let currentLine = '';

  words.forEach(word => {
    if ((currentLine + ' ' + word).trim().length <= maxCharsPerLine) {
      currentLine = (currentLine + ' ' + word).trim();
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  });
  if (currentLine) lines.push(currentLine);
  return lines;
}

// Render ALL selected skills dynamically with flex wrapping
function renderAllSkillPills(skills, startX, startY, containerWidth = 430, rowHeight = 34, primaryColor = '#38bdf8', secondaryColor = '#818cf8') {
  let currentX = startX;
  let currentY = startY;
  const pillElements = [];

  skills.forEach((skill, idx) => {
    const textLen = skill.length;
    const pillWidth = Math.max(textLen * 7.5 + 24, 52);
    
    if (currentX + pillWidth > startX + containerWidth) {
      currentX = startX;
      currentY += rowHeight;
    }

    const strokeColor = idx % 2 === 0 ? primaryColor : secondaryColor;
    const fillColor = idx % 2 === 0 ? `rgba(${hexToRgb(primaryColor)}, 0.12)` : `rgba(${hexToRgb(secondaryColor)}, 0.12)`;

    pillElements.push(`<g transform="translate(${currentX}, ${currentY})">
      <rect width="${pillWidth}" height="26" rx="10" fill="${fillColor}" stroke="${strokeColor}" stroke-width="1"/>
      <text x="${pillWidth / 2}" y="17" text-anchor="middle" font-family="'Fira Code', monospace" font-size="11" font-weight="600" fill="#ffffff">${escapeXML(skill)}</text>
    </g>`);

    currentX += pillWidth + 8;
  });

  return pillElements.join('\n');
}

function generateSVG(data) {
  const t = THEMES[data.theme] || THEMES.nordic_navy;

  switch (data.layout) {
    case 'bento': return generateBentoSVG(data, t);
    case 'hud': return generateHUDSVG(data, t);
    case 'vscode': return generateVSCodeSVG(data, t);
    case 'synthwave': return generateSynthwaveSVG(data, t);
    case 'terminal':
    default:
      return generateTerminalSVG(data, t);
  }
}

// 1. BENTO GRID ARCHITECTURE LAYOUT
function generateBentoSVG(data, t) {
  const allSkillsElements = renderAllSkillPills(data.selectedSkills, 0, 36, 430, 34, t.primary, t.secondary);

  const quoteLines = wrapText(`"${data.quote}"`, 30);
  const quoteTSpan = quoteLines.map((line, i) => `<text x="0" y="${64 + i * 22}">${escapeXML(line)}</text>`).join('\n');
  const authorY = 64 + quoteLines.length * 22 + 10;

  const emailLen = (data.email || '').length;
  const emailFontSize = emailLen > 24 ? (emailLen > 30 ? 9.5 : 10.5) : 11.5;

  const avatarSrc = data.avatarDataUrl || data.avatarUrl;

  return `<svg width="1180" height="610" viewBox="0 0 1180 610" xmlns="http://www.w3.org/2000/svg" role="img">
<defs>
  <linearGradient id="bentoBg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${t.bg1}"/><stop offset="50%" stop-color="${t.bg2}"/><stop offset="100%" stop-color="${t.bg3}"/></linearGradient>
  <radialGradient id="orbA" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="${t.glowA}" stop-opacity="0.25"/><stop offset="100%" stop-color="${t.glowA}" stop-opacity="0"/></radialGradient>
  <radialGradient id="orbB" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="${t.glowB}" stop-opacity="0.2"/><stop offset="100%" stop-color="${t.glowB}" stop-opacity="0"/></radialGradient>
  <filter id="glowSoft"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="blurBg"><feGaussianBlur stdDeviation="50"/></filter>
  <clipPath id="mainClip"><rect width="1180" height="610" rx="20"/></clipPath>
  <clipPath id="avatarCircle"><circle cx="75" cy="75" r="70"/></clipPath>
</defs>
<g clip-path="url(#mainClip)">
  <rect width="1180" height="610" fill="url(#bentoBg)"/>
  <circle cx="200" cy="150" r="280" fill="url(#orbA)" filter="url(#blurBg)"/>
  <circle cx="950" cy="450" r="300" fill="url(#orbB)" filter="url(#blurBg)"/>
  <rect x="2" y="2" width="1176" height="606" rx="18" fill="none" stroke="rgba(255,255,255,.07)" stroke-width="1.5"/>

  <!-- TILE 1: MAIN HERO CARD -->
  <g transform="translate(24, 24)">
    <rect width="740" height="260" rx="18" fill="${t.cardBg}" opacity="0.85" stroke="rgba(255,255,255,.08)" stroke-width="1"/>
    <g transform="translate(32, 32)">
      <g>
        <circle cx="75" cy="75" r="78" fill="none" stroke="${t.primary}" stroke-width="2.5" opacity="0.9" filter="url(#glowSoft)"/>
        <circle cx="75" cy="75" r="72" fill="none" stroke="${t.secondary}" stroke-width="1" opacity="0.4"/>
        <g clip-path="url(#avatarCircle)">
          <rect width="150" height="150" fill="${t.bg2}"/>
          <image href="${escapeXML(avatarSrc)}" width="150" height="150" preserveAspectRatio="xMidYMid slice"/>
        </g>
      </g>
      <g transform="translate(180, 20)">
        <g>
          <rect width="210" height="26" rx="13" fill="rgba(${hexToRgb(t.primary)},0.12)" stroke="${t.primary}" stroke-width="1"/>
          <circle cx="16" cy="13" r="4" fill="${t.primary}" filter="url(#glowSoft)"><animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite"/></circle>
          <text x="28" y="17" font-family="'Consolas', 'Fira Code', monospace" font-size="11.5" font-weight="600" fill="${t.primary}">${escapeXML(data.statusText.toUpperCase())}</text>
        </g>
        <text x="0" y="65" font-family="'Outfit', sans-serif" font-size="32" font-weight="800" fill="#ffffff">${escapeXML(data.name)}</text>
        <text x="0" y="94" font-family="'Fira Code', monospace" font-size="14.5" font-weight="600" fill="${t.primary}">✦ ${escapeXML(data.primaryRole)}</text>
        <text x="0" y="124" font-family="'Inter', sans-serif" font-size="13" fill="#9ca3af">${escapeXML(data.subtitle)}</text>
      </g>
    </g>
  </g>

  <!-- TILE 2: FOCUS CARD -->
  <g transform="translate(788, 24)">
    <rect width="368" height="260" rx="18" fill="${t.cardBg}" opacity="0.85" stroke="rgba(255,255,255,.08)" stroke-width="1"/>
    <g transform="translate(24, 24)">
      <text x="0" y="16" font-family="'Fira Code', monospace" font-size="11" font-weight="700" fill="${t.secondary}" letter-spacing="0.1em">CURRENT FOCUS &amp; PROJECTS</text>
      <text x="0" y="48" font-family="'Outfit', sans-serif" font-size="18" font-weight="700" fill="#ffffff">${escapeXML(data.focus)}</text>
      <text x="0" y="74" font-family="'Inter', sans-serif" font-size="12" fill="#9ca3af">Education: ${escapeXML(data.education)}</text>
      <g transform="translate(0, 105)">
        <rect width="320" height="8" rx="4" fill="#0d1117"/>
        <rect width="240" height="8" rx="4" fill="${t.primary}"/>
        <text x="0" y="28" font-family="'Fira Code', monospace" font-size="11" fill="#9ca3af">Active Progress: <tspan fill="${t.primary}" font-weight="700">In Development</tspan></text>
      </g>
    </g>
  </g>

  <!-- TILE 3: TECH MATRIX -->
  <g transform="translate(24, 308)">
    <rect width="480" height="278" rx="18" fill="${t.cardBg}" opacity="0.85" stroke="rgba(255,255,255,.08)" stroke-width="1"/>
    <g transform="translate(24, 24)">
      <text x="0" y="16" font-family="'Fira Code', monospace" font-size="11" font-weight="700" fill="${t.primary}" letter-spacing="0.1em">TECH MATRIX &amp; SKILLS</text>
      <g>${allSkillsElements}</g>
      <text x="0" y="215" font-family="'Inter', sans-serif" font-size="12" fill="#9ca3af">Location: ${escapeXML(data.location)} • github.com/${escapeXML(data.githubUser)}</text>
    </g>
  </g>

  <!-- TILE 4: PHILOSOPHY TILE -->
  <g transform="translate(520, 308)">
    <rect width="350" height="278" rx="18" fill="${t.cardBg}" opacity="0.85" stroke="rgba(255,255,255,.08)" stroke-width="1"/>
    <g transform="translate(24, 24)">
      <text x="0" y="16" font-family="'Fira Code', monospace" font-size="11" font-weight="700" fill="${t.primary}" letter-spacing="0.1em">PERSONAL PHILOSOPHY</text>
      <line x1="0" y1="30" x2="302" y2="30" stroke="${t.primary}" stroke-width="1.5" opacity="0.6"/>
      <g font-family="'Georgia', serif" font-style="italic" font-size="14" fill="#f0f6fc">
        ${quoteTSpan}
      </g>
      <text x="0" y="${authorY}" font-family="'Inter', sans-serif" font-size="12" font-weight="600" fill="${t.primary}">— ${escapeXML(data.quoteAuthor)}</text>
    </g>
  </g>

  <!-- TILE 5: SOCIALS -->
  <g transform="translate(886, 308)">
    <rect width="270" height="278" rx="18" fill="${t.cardBg}" opacity="0.85" stroke="rgba(255,255,255,.08)" stroke-width="1"/>
    <g transform="translate(20, 24)">
      <text x="0" y="16" font-family="'Fira Code', monospace" font-size="11" font-weight="700" fill="${t.secondary}" letter-spacing="0.1em">CONNECT &amp; LINKS</text>
      <g transform="translate(0, 36)">
        <rect width="230" height="34" rx="10" fill="#111c3d"/>
        <text x="15" y="21" font-family="'Fira Code', monospace" font-size="11" fill="#ffffff">github.com/${escapeXML(data.githubUser)}</text>
        
        <rect y="46" width="230" height="34" rx="10" fill="#111c3d"/>
        <text x="15" y="67" font-family="'Fira Code', monospace" font-size="${emailFontSize}" fill="#ffffff">${escapeXML(data.email)}</text>

        <rect y="92" width="230" height="34" rx="10" fill="#111c3d"/>
        <text x="15" y="113" font-family="'Fira Code', monospace" font-size="11" fill="${t.primary}">${escapeXML(data.location)}</text>
      </g>
    </g>
  </g>
</g>
</svg>`;
}

// 2. ENRICHED SCI-FI TELEMETRY HUD LAYOUT
function generateHUDSVG(data, t) {
  const allSkillsElements = renderAllSkillPills(data.selectedSkills, 0, 5, 630, 30, t.secondary, t.primary);

  const quoteLines = wrapText(`"${data.quote}"`, 42);
  const quoteTSpan = quoteLines.map((line, i) => `<text x="0" y="${i * 18}">${escapeXML(line)}</text>`).join('\n');

  const avatarSrc = data.avatarDataUrl || data.avatarUrl;

  return `<svg width="1180" height="610" viewBox="0 0 1180 610" xmlns="http://www.w3.org/2000/svg" role="img">
<defs>
  <linearGradient id="hudBg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${t.bg1}"/><stop offset="50%" stop-color="${t.bg2}"/><stop offset="100%" stop-color="${t.bg3}"/></linearGradient>
  <filter id="neonGlow"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <clipPath id="cardClipHUD"><rect width="1180" height="610" rx="20"/></clipPath>
  <clipPath id="avatarHex"><circle cx="210" cy="220" r="105"/></clipPath>
</defs>
<g clip-path="url(#cardClipHUD)">
  <rect width="1180" height="610" fill="url(#hudBg)"/>

  <circle cx="210" cy="220" r="150" fill="none" stroke="${t.secondary}" stroke-width="1" opacity="0.25"><animate attributeName="r" values="150;185;150" dur="4s" repeatCount="indefinite"/></circle>
  <circle cx="210" cy="220" r="130" fill="none" stroke="${t.primary}" stroke-width="1.5" stroke-dasharray="8 8" opacity="0.4"><animateTransform attributeName="transform" type="rotate" from="0 210 220" to="360 210 220" dur="15s" repeatCount="indefinite"/></circle>

  <g stroke="${t.secondary}" stroke-width="2" fill="none" opacity="0.6">
    <path d="M 24 54 L 24 24 L 54 24"/><path d="M 1126 24 L 1156 24 L 1156 54"/>
    <path d="M 24 556 L 24 586 L 54 586"/><path d="M 1126 586 L 1156 586 L 1156 556"/>
  </g>

  <g transform="translate(45, 45)">
    <text font-family="'Fira Code', monospace" font-size="11" font-weight="700" fill="${t.secondary}" letter-spacing="0.12em">[ OPERATOR_PROTOCOL: NEURAL_ENGINE_v3.8 ]</text>
    <text x="860" font-family="'Fira Code', monospace" font-size="11" fill="${t.primary}">SYSTEM STATUS: ONLINE (100%)</text>
    <line x1="0" y1="14" x2="1090" y2="14" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
  </g>

  <g transform="translate(45, 80)">
    <circle cx="210" cy="220" r="118" fill="none" stroke="${t.secondary}" stroke-width="2.5" opacity="0.8" filter="url(#neonGlow)"/>
    <g clip-path="url(#avatarHex)">
      <rect x="105" y="115" width="210" height="210" fill="${t.bg2}"/>
      <image href="${escapeXML(avatarSrc)}" x="105" y="115" width="210" height="210" preserveAspectRatio="xMidYMid slice"/>
      <rect x="105" y="115" width="210" height="2" fill="${t.secondary}" opacity="0.7"><animate attributeName="y" values="115;325;115" dur="3s" repeatCount="indefinite"/></rect>
    </g>
    <text x="210" y="362" text-anchor="middle" font-family="'Fira Code', monospace" font-size="20" font-weight="700" fill="#ffffff">${escapeXML(data.name.toUpperCase())}</text>
    <text x="210" y="385" text-anchor="middle" font-family="'Fira Code', monospace" font-size="11.5" fill="${t.secondary}">&lt; OPERATOR ID: #${escapeXML(data.githubUser)} &gt;</text>
  </g>

  <g transform="translate(480, 95)">
    <rect width="170" height="24" rx="6" fill="rgba(${hexToRgb(t.secondary)},0.12)" stroke="${t.secondary}" stroke-width="1"/>
    <text x="85" y="16" text-anchor="middle" font-family="'Fira Code', monospace" font-size="11" font-weight="700" fill="${t.secondary}">SYSTEM TELEMETRY</text>
    
    <text x="0" y="60" font-family="'Fira Code', monospace" font-size="24" font-weight="700" fill="#ffffff">${escapeXML(data.primaryRole.toUpperCase())}</text>
    <text x="0" y="84" font-family="'Fira Code', monospace" font-size="13" fill="${t.primary}">&gt; ${escapeXML(data.subtitle)}</text>

    <g transform="translate(0, 115)">
      <text font-family="'Fira Code', monospace" font-size="11.5" fill="#9ca3af">EDUCATION: ${escapeXML(data.education.toUpperCase())}</text>
      <text x="630" text-anchor="end" font-family="'Fira Code', monospace" font-size="11.5" font-weight="700" fill="${t.secondary}">95% SYNC</text>
      <rect y="10" width="630" height="6" rx="3" fill="#131d2e"/><rect y="10" width="598" height="6" rx="3" fill="${t.secondary}"/>

      <text y="38" font-family="'Fira Code', monospace" font-size="11.5" fill="#9ca3af">CURRENT FOCUS: ${escapeXML(data.focus.toUpperCase())}</text>
      <text x="630" y="38" text-anchor="end" font-family="'Fira Code', monospace" font-size="11.5" font-weight="700" fill="${t.primary}">88% ACTIVE</text>
      <rect y="48" width="630" height="6" rx="3" fill="#131d2e"/><rect y="48" width="554" height="6" rx="3" fill="${t.primary}"/>
    </g>

    <g transform="translate(0, 215)">
      <text y="-8" font-family="'Fira Code', monospace" font-size="11" font-weight="700" fill="${t.primary}" letter-spacing="0.1em">SYSTEM TECH MODULES</text>
      <g transform="translate(0, 5)">${allSkillsElements}</g>
    </g>

    <g transform="translate(0, 290)">
      <rect width="630" height="70" rx="10" fill="rgba(19, 29, 46, 0.9)" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
      <text x="16" y="20" font-family="'Fira Code', monospace" font-size="10.5" font-weight="700" fill="${t.secondary}">OPERATOR MOTTO:</text>
      <g transform="translate(16, 38)" font-family="'Georgia', serif" font-style="italic" font-size="12" fill="#f0f6fc">
        ${quoteTSpan}
      </g>
      <text x="614" y="58" text-anchor="end" font-family="'Fira Code', monospace" font-size="10.5" fill="${t.primary}">— ${escapeXML(data.quoteAuthor)}</text>
    </g>

    <g transform="translate(0, 395)">
      <text font-family="'Fira Code', monospace" font-size="11" fill="#9ca3af">LINK: <tspan fill="${t.secondary}">github.com/${escapeXML(data.githubUser)}</tspan> | EMAIL: <tspan fill="#ffffff">${escapeXML(data.email)}</tspan> | LOC: <tspan fill="${t.primary}">${escapeXML(data.location)}</tspan></text>
    </g>
  </g>
</g>
</svg>`;
}

// 3. TERMINAL SPLIT LAYOUT
function generateTerminalSVG(data, t) {
  const rolesList = [data.primaryRole, 'Full-Stack Web Developer', 'AI/ML Innovator', 'Open Source Builder'];
  const roleCount = rolesList.length;
  const roleInterval = 100 / roleCount;
  const roleElements = rolesList.map((role, idx) => {
    const startRatio = (idx * roleInterval) / 100;
    const fadeRatio = 0.012;
    const endRatio = ((idx + 1) * roleInterval - 1.2) / 100;
    const nextStartRatio = ((idx + 1) * roleInterval) / 100;
    const keyTimes = `0;${startRatio.toFixed(3)};${(startRatio + fadeRatio).toFixed(3)};${endRatio.toFixed(3)};${nextStartRatio.toFixed(3)};1`;
    return `<text x="490" y="164" fill="${t.primary}" opacity="0">&gt; ${escapeXML(role)}<animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="${keyTimes}" dur="15s" repeatCount="indefinite"/></text>`;
  }).join('\n      ');

  const allSkillPills = renderAllSkillPills(data.selectedSkills, 490, 385, 630, 32, t.primary, t.secondary);

  const avatarSrc = data.avatarDataUrl || data.avatarUrl;

  return `<svg width="1180" height="610" viewBox="0 0 1180 610" xmlns="http://www.w3.org/2000/svg" role="img">
<defs>
  <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${t.bg1}"/><stop offset="50%" stop-color="${t.bg2}"/><stop offset="100%" stop-color="${t.bg3}"/></linearGradient>
  <filter id="softGlow"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <clipPath id="cardClip"><rect x="0" y="0" width="1180" height="610" rx="20"/></clipPath>
  <clipPath id="leftClip"><rect x="24" y="24" width="412" height="562" rx="18"/></clipPath>
  <clipPath id="avatarClip"><circle cx="230" cy="225" r="110"/></clipPath>
  <clipPath id="typeClip"><rect x="490" y="84" width="0" height="28"><animate attributeName="width" values="0;430" dur="1.5s" begin="0.3s" fill="freeze" calcMode="linear"/></rect></clipPath>
</defs>
<g clip-path="url(#cardClip)">
  <rect width="1180" height="610" fill="url(#bgGrad)"/>
  <rect x="1.5" y="1.5" width="1177" height="607" rx="19" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="1.5"/>
  <g>
    <rect x="24" y="24" width="412" height="562" rx="18" fill="${t.cardBg}" opacity="0.8"/>
    <g clip-path="url(#leftClip)">
      <g>
        <circle cx="230" cy="225" r="124" fill="none" stroke="${t.primary}" stroke-width="2.5" opacity="0.9" filter="url(#softGlow)"/>
        <g clip-path="url(#avatarClip)">
          <rect x="110" y="105" width="240" height="240" fill="${t.bg2}"/>
          <image href="${escapeXML(avatarSrc)}" x="120" y="115" width="220" height="220" preserveAspectRatio="xMidYMid slice"/>
        </g>
      </g>
      <g transform="translate(58, 386)">
        <circle cx="0" cy="0" r="4.5" fill="${t.primary}"><animate attributeName="opacity" values="1;0.4;1" dur="1.8s" repeatCount="indefinite"/></circle>
        <text x="14" y="4" font-family="'Consolas', 'Fira Code', monospace" font-size="12.5" fill="#9ca3af">${escapeXML(data.statusText)}</text>
      </g>
    </g>
    <text x="58" y="512" font-family="'Consolas', 'Fira Code', monospace" font-size="24" font-weight="700" fill="${t.primary}">${escapeXML(data.name)}</text>
    <text x="58" y="538" font-family="'Consolas', 'Fira Code', monospace" font-size="12" fill="#8b949e">${escapeXML(data.subtitle)}</text>
  </g>
  <g>
    <rect x="460" y="24" width="696" height="562" rx="18" fill="${t.termBg}" opacity="0.9"/>
    <rect x="460" y="24" width="696" height="42" rx="18" fill="${t.termHeader}"/><rect x="460" y="46" width="696" height="20" fill="${t.termHeader}"/>
    <circle cx="486" cy="45" r="6" fill="#ff5f56" opacity="0.9"/><circle cx="506" cy="45" r="6" fill="#ffbd2e" opacity="0.9"/><circle cx="526" cy="45" r="6" fill="#27c93f" opacity="0.9"/>
    <text x="808" y="50" text-anchor="middle" font-family="'Consolas', monospace" font-size="12" fill="#8b949e">${escapeXML(data.terminalTitle)}</text>
    <text x="490" y="102" font-family="'Consolas', monospace" font-size="21" font-weight="700" fill="#f0f6fc" clip-path="url(#typeClip)">${escapeXML(data.headline)}</text>
    <rect x="490" y="85" width="9" height="22" fill="${t.primary}"><animate attributeName="x" values="490;920" dur="1.5s" begin="0.3s" fill="freeze"/><animate attributeName="opacity" values="1;1;0;0" keyTimes="0;0.5;0.51;1" dur="0.9s" begin="1.8s" repeatCount="indefinite"/></rect>
    <text x="490" y="136" font-family="'Consolas', monospace" font-size="14" fill="#8b949e">$ whoami --role</text>
    <g font-family="'Consolas', monospace" font-size="16.5" font-weight="600">${roleElements}</g>
    <line x1="490" y1="188" x2="1126" y2="188" stroke="rgba(255,255,255,.08)" stroke-width="1"/>
    <g opacity="0"><animate attributeName="opacity" values="0;1" dur="0.4s" begin="2.2s" fill="freeze"/><circle cx="496" cy="215" r="3" fill="${t.primary}"/><text x="510" y="220" font-family="'Consolas', monospace" font-size="13" fill="#8b949e">Location:</text><text x="650" y="220" font-family="'Consolas', monospace" font-size="13" font-weight="600" fill="#f0f6fc">${escapeXML(data.location)}</text></g>
    <g opacity="0"><animate attributeName="opacity" values="0;1" dur="0.4s" begin="2.5s" fill="freeze"/><circle cx="496" cy="242" r="3" fill="${t.primary}"/><text x="510" y="247" font-family="'Consolas', monospace" font-size="13" fill="#8b949e">Education:</text><text x="650" y="247" font-family="'Consolas', monospace" font-size="13" font-weight="600" fill="#f0f6fc">${escapeXML(data.education)}</text></g>
    <g opacity="0"><animate attributeName="opacity" values="0;1" dur="0.4s" begin="2.8s" fill="freeze"/><circle cx="496" cy="269" r="3" fill="${t.primary}"/><text x="510" y="274" font-family="'Consolas', monospace" font-size="13" fill="#8b949e">Current Focus:</text><text x="650" y="274" font-family="'Consolas', monospace" font-size="13" font-weight="600" fill="#f0f6fc">${escapeXML(data.focus)}</text></g>
    <g opacity="0"><animate attributeName="opacity" values="0;1" dur="0.4s" begin="3.1s" fill="freeze"/><circle cx="496" cy="296" r="3" fill="${t.primary}"/><text x="510" y="301" font-family="'Consolas', monospace" font-size="13" fill="#8b949e">GitHub:</text><text x="650" y="301" font-family="'Consolas', monospace" font-size="13" font-weight="600" fill="${t.secondary}">github.com/${escapeXML(data.githubUser)}</text></g>
    <text x="490" y="365" font-family="'Consolas', monospace" font-size="13.5" fill="#8b949e">$ ls ./tech-stack</text>
    ${allSkillPills}
  </g>
</g>
</svg>`;
}

// 4. VS CODE IDE EDITOR LAYOUT
function generateVSCodeSVG(data, t) {
  const skillsArrayString = JSON.stringify(data.selectedSkills);

  return `<svg width="1180" height="610" viewBox="0 0 1180 610" xmlns="http://www.w3.org/2000/svg" role="img">
<defs><clipPath id="vsClip"><rect width="1180" height="610" rx="16"/></clipPath></defs>
<g clip-path="url(#vsClip)">
  <rect width="1180" height="610" fill="#1e1e1e"/>
  <rect width="1180" height="38" fill="#323233"/>
  <circle cx="20" cy="19" r="6" fill="#ff5f56"/><circle cx="40" cy="19" r="6" fill="#ffbd2e"/><circle cx="60" cy="19" r="6" fill="#27c93f"/>
  <text x="590" y="24" text-anchor="middle" font-family="'Consolas', monospace" font-size="12" fill="#cccccc">${escapeXML(data.githubUser)} — main.py — Visual Studio Code</text>
  <rect y="38" width="50" height="572" fill="#252526"/>
  <rect x="50" y="38" width="200" height="572" fill="#252526"/>
  <text x="65" y="60" font-family="'Segoe UI', sans-serif" font-size="11" font-weight="700" fill="#bbbbbb">EXPLORER</text>
  <rect x="50" y="78" width="200" height="24" fill="#37373d"/>
  <text x="75" y="94" font-family="'Consolas', monospace" font-size="12" fill="#38bdf8">main.py</text>
  <text x="75" y="122" font-family="'Consolas', monospace" font-size="12" fill="#9ca3af">bio.md</text>
  <text x="75" y="150" font-family="'Consolas', monospace" font-size="12" fill="#9ca3af">skills.json</text>

  <rect x="250" y="38" width="930" height="35" fill="#2d2d2d"/>
  <rect x="250" y="38" width="160" height="35" fill="#1e1e1e"/>
  <text x="270" y="60" font-family="'Consolas', monospace" font-size="12" fill="#ffffff">main.py</text>
  
  <g transform="translate(250, 90)" font-family="'Consolas', monospace" font-size="12.5">
    <text x="25" y="22" fill="#858585">1</text><text x="55" y="22" fill="#6A9955"># Developer Profile: ${escapeXML(data.name)}</text>
    <text x="25" y="44" fill="#858585">2</text><text x="55" y="44"><tspan fill="#569CD6">class</tspan> <tspan fill="#4EC9B0">DeveloperProfile</tspan>:</text>
    <text x="25" y="66" fill="#858585">3</text><text x="85" y="66"><tspan fill="#569CD6">def</tspan> <tspan fill="#DCDCAA">__init__</tspan>(<tspan fill="#9CDCFE">self</tspan>):</text>
    <text x="25" y="88" fill="#858585">4</text><text x="115" y="88"><tspan fill="#9CDCFE">self</tspan>.name = <tspan fill="#CE9178">"${escapeXML(data.name)}"</tspan></text>
    <text x="25" y="110" fill="#858585">5</text><text x="115" y="110"><tspan fill="#9CDCFE">self</tspan>.role = <tspan fill="#CE9178">"${escapeXML(data.primaryRole)}"</tspan></text>
    <text x="25" y="132" fill="#858585">6</text><text x="115" y="132"><tspan fill="#9CDCFE">self</tspan>.education = <tspan fill="#CE9178">"${escapeXML(data.education)}"</tspan></text>
    <text x="25" y="154" fill="#858585">7</text><text x="115" y="154"><tspan fill="#9CDCFE">self</tspan>.location = <tspan fill="#CE9178">"${escapeXML(data.location)}"</tspan></text>
    <text x="25" y="176" fill="#858585">8</text><text x="115" y="176"><tspan fill="#9CDCFE">self</tspan>.skills = <tspan fill="#CE9178">${escapeXML(skillsArrayString)}</tspan></text>
    <text x="25" y="198" fill="#858585">9</text>
    <text x="25" y="220" fill="#858585">10</text><text x="85" y="220"><tspan fill="#569CD6">def</tspan> <tspan fill="#DCDCAA">get_current_focus</tspan>(<tspan fill="#9CDCFE">self</tspan>):</text>
    <text x="25" y="242" fill="#858585">11</text><text x="115" y="242"><tspan fill="#C586C0">return</tspan> <tspan fill="#CE9178">"${escapeXML(data.focus)}"</tspan></text>
    <text x="25" y="264" fill="#858585">12</text>
    <text x="25" y="286" fill="#858585">13</text><text x="85" y="286"><tspan fill="#569CD6">def</tspan> <tspan fill="#DCDCAA">philosophy</tspan>(<tspan fill="#9CDCFE">self</tspan>):</text>
    <text x="25" y="308" fill="#858585">14</text><text x="115" y="308"><tspan fill="#C586C0">return</tspan> <tspan fill="#CE9178">"${escapeXML(data.quote)} — ${escapeXML(data.quoteAuthor)}"</tspan></text>
  </g>

  <rect x="250" y="440" width="930" height="170" fill="#181818"/>
  <rect x="250" y="440" width="930" height="26" fill="#252526"/>
  <text x="270" y="457" font-family="'Consolas', monospace" font-size="11" font-weight="700" fill="#cccccc">TERMINAL</text>

  <g transform="translate(270, 484)" font-family="'Consolas', monospace" font-size="12">
    <text y="0" fill="#38bdf8">dev@machine:~$ <tspan fill="#ffffff">python3 main.py</tspan></text>
    <text y="22" fill="${t.primary}">[STATUS] ${escapeXML(data.statusText.toUpperCase())}</text>
    <text y="44" fill="#cccccc">Developer: ${escapeXML(data.name)} (${escapeXML(data.primaryRole)})</text>
    <text y="66" fill="#9ca3af">Focus: ${escapeXML(data.focus)} | Contact: ${escapeXML(data.email)}</text>
  </g>
</g>
</svg>`;
}

// 5. RICH RETRO SYNTHWAVE LAYOUT
function generateSynthwaveSVG(data, t) {
  const allSkillsElements = renderAllSkillPills(data.selectedSkills, 0, 8, 910, 32, '#38bdf8', '#ec4899');

  const avatarSrc = data.avatarDataUrl || data.avatarUrl;

  return `<svg width="1180" height="610" viewBox="0 0 1180 610" xmlns="http://www.w3.org/2000/svg" role="img">
<defs>
  <linearGradient id="synthSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0c0716"/><stop offset="60%" stop-color="#180b2a"/><stop offset="100%" stop-color="#281040"/></linearGradient>
  <linearGradient id="synthSun" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#f59e0b"/><stop offset="60%" stop-color="#ec4899"/><stop offset="100%" stop-color="#8b5cf6"/></linearGradient>
  <filter id="synthGlow"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <clipPath id="synthClip"><rect width="1180" height="610" rx="20"/></clipPath>
  <clipPath id="synthAvatarClip"><circle cx="100" cy="100" r="65"/></clipPath>
</defs>
<g clip-path="url(#synthClip)">
  <rect width="1180" height="610" fill="url(#synthSky)"/>
  <circle cx="590" cy="220" r="110" fill="url(#synthSun)" opacity="0.8" filter="url(#synthGlow)"/>
  <g transform="translate(590, 220)" fill="#180b2a">
    <rect x="-120" y="0" width="240" height="4"/><rect x="-120" y="14" width="240" height="6"/>
    <rect x="-120" y="32" width="240" height="8"/><rect x="-120" y="54" width="240" height="11"/>
    <rect x="-120" y="78" width="240" height="15"/>
  </g>
  <g transform="translate(0, 330)">
    <line x1="0" y1="0" x2="1180" y2="0" stroke="#38bdf8" stroke-width="1.5" opacity="0.6"/>
    <g stroke="rgba(56, 189, 248, 0.18)" stroke-width="1.2">
      <line x1="590" y1="0" x2="-100" y2="280"/><line x1="590" y1="0" x2="150" y2="280"/>
      <line x1="590" y1="0" x2="400" y2="280"/><line x1="590" y1="0" x2="600" y2="280"/>
      <line x1="590" y1="0" x2="780" y2="280"/><line x1="590" y1="0" x2="1030" y2="280"/><line x1="590" y1="0" x2="1280" y2="280"/>
    </g>
    <g stroke="rgba(236, 72, 153, 0.35)" stroke-width="1">
      <line x1="0" y1="20" x2="1180" y2="20"/><line x1="0" y1="50" x2="1180" y2="50"/><line x1="0" y1="90" x2="1180" y2="90"/><line x1="0" y1="145" x2="1180" y2="145"/><line x1="0" y1="215" x2="1180" y2="215"/>
    </g>
  </g>
  <g transform="translate(90, 55)">
    <rect width="1000" height="500" rx="20" fill="rgba(18, 10, 32, 0.85)" stroke="rgba(236, 72, 153, 0.4)" stroke-width="1.5"/>
    <g transform="translate(45, 40)">
      <circle cx="100" cy="100" r="72" fill="none" stroke="#ec4899" stroke-width="2.5" filter="url(#synthGlow)"/>
      <g clip-path="url(#synthAvatarClip)">
        <rect x="35" y="35" width="130" height="130" fill="#180b2a"/>
        <image href="${escapeXML(avatarSrc)}" x="35" y="35" width="130" height="130" preserveAspectRatio="xMidYMid slice"/>
      </g>
      <g transform="translate(0, 190)">
        <rect width="200" height="24" rx="12" fill="rgba(16,185,129,0.15)" stroke="#10b981" stroke-width="1"/>
        <circle cx="15" cy="12" r="4" fill="#10b981"/>
        <text x="28" y="16" font-family="'Fira Code', monospace" font-size="10.5" font-weight="600" fill="#10b981">${escapeXML(data.statusText.toUpperCase())}</text>
      </g>
    </g>
    <g transform="translate(280, 45)">
      <text font-family="'Outfit', sans-serif" font-size="34" font-weight="900" fill="#ffffff" letter-spacing="0.04em">${escapeXML(data.name.toUpperCase())}</text>
      <text y="28" font-family="'Fira Code', monospace" font-size="14" font-weight="600" fill="#38bdf8">✦ ${escapeXML(data.primaryRole)}</text>
      <text y="50" font-family="'Inter', sans-serif" font-size="12.5" fill="#9ca3af">${escapeXML(data.subtitle)}</text>
    </g>
    <g transform="translate(280, 140)" font-family="'Fira Code', monospace" font-size="12">
      <text y="0" fill="#9ca3af">Education: <tspan fill="#ffffff" font-weight="600">${escapeXML(data.education)}</tspan></text>
      <text y="24" fill="#9ca3af">Location:  <tspan fill="#ffffff" font-weight="600">${escapeXML(data.location)}</tspan></text>
      <text y="48" fill="#9ca3af">Current Focus: <tspan fill="#ec4899" font-weight="600">${escapeXML(data.focus)}</tspan></text>
      <text y="72" fill="#9ca3af">GitHub:    <tspan fill="#38bdf8" font-weight="600">github.com/${escapeXML(data.githubUser)}</tspan></text>
      <text y="96" fill="#9ca3af">Email:     <tspan fill="#ffffff" font-weight="600">${escapeXML(data.email)}</tspan></text>
    </g>
    <g transform="translate(45, 290)">
      <rect width="910" height="52" rx="10" fill="#110722" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
      <text x="20" y="24" font-family="'Georgia', serif" font-style="italic" font-size="13.5" fill="#f0f6fc">"${escapeXML(data.quote)}"</text>
      <text x="20" y="42" font-family="'Fira Code', monospace" font-size="11" font-weight="600" fill="#ec4899">— ${escapeXML(data.quoteAuthor)}</text>
    </g>
    <g transform="translate(45, 360)">
      <text y="-8" font-family="'Fira Code', monospace" font-size="11" font-weight="700" fill="#38bdf8" letter-spacing="0.1em">TECH STACK &amp; TOOLKIT</text>
      <g transform="translate(0, 8)">${allSkillsElements}</g>
    </g>
  </g>
</g>
</svg>`;
}

function escapeXML(str) {
  return String(str || '').replace(/[<>&'"]/g, c => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r}, ${g}, ${b}`;
}

function showToast(msg) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3200);
}

// SMART GITHUB PROFILE & README AUTO-PARSER
async function fetchGitHubProfile(query) {
  if (!query) return;
  
  let username = query.trim();
  if (username.includes('github.com/')) {
    username = username.split('github.com/')[1].split('/')[0];
  }
  username = username.replace('@', '');

  showToast(`Fetching @${username} profile & README...`);

  try {
    // 1. Fetch User Metadata
    const userRes = await fetch(`https://api.github.com/users/${username}`);
    if (!userRes.ok) {
      throw new Error(`User not found (${userRes.status})`);
    }
    const userData = await userRes.json();

    // 2. Fetch User Profile README.md
    let readmeText = '';
    try {
      const readmeRes = await fetch(`https://raw.githubusercontent.com/${username}/${username}/main/README.md`);
      if (readmeRes.ok) {
        readmeText = await readmeRes.text();
      } else {
        const masterRes = await fetch(`https://raw.githubusercontent.com/${username}/${username}/master/README.md`);
        if (masterRes.ok) {
          readmeText = await masterRes.text();
        }
      }
    } catch (e) {
      console.warn('Could not fetch README', e);
    }

    // 3. Fetch Top Repository Languages
    const repoRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=15`);
    let detectedLanguages = [];
    if (repoRes.ok) {
      const repos = await repoRes.json();
      const langs = repos.map(r => r.language).filter(Boolean);
      detectedLanguages = Array.from(new Set(langs));
    }

    // Assign core profile metadata
    state.githubUser = userData.login || username;
    state.name = userData.name || userData.login || 'Developer';
    state.avatarUrl = userData.avatar_url || `https://github.com/${username}.png`;
    state.location = userData.location || 'Global';
    state.email = userData.email || `${username}@users.noreply.github.com`;
    state.subtitle = userData.bio ? `// ${userData.bio}` : '// Building software & solving problems';
    state.headline = `Hi, I'm ${state.name}`;
    state.terminalTitle = `~/${username.toLowerCase()} — zsh`;
    state.primaryRole = userData.company || 'Software Engineer';
    state.education = userData.company || 'Computer Science & Software Development';
    state.focus = 'Open Source & Web Engineering';

    // 4. Parse README Details if available
    if (readmeText) {
      const parsed = parseReadmeDetails(readmeText);
      if (parsed.subtitle) state.subtitle = parsed.subtitle;
      if (parsed.primaryRole) state.primaryRole = parsed.primaryRole;
      if (parsed.focus) state.focus = parsed.focus;
      if (parsed.quote) state.quote = parsed.quote;
      if (parsed.quoteAuthor) state.quoteAuthor = parsed.quoteAuthor;
      if (parsed.education) state.education = parsed.education;
      if (parsed.location) state.location = parsed.location;

      if (parsed.skills && parsed.skills.length > 0) {
        parsed.skills.forEach(s => {
          if (!detectedLanguages.includes(s)) detectedLanguages.push(s);
        });
      }
    }

    // 5. Populate Skills
    if (detectedLanguages.length > 0) {
      state.selectedSkills = [];
      detectedLanguages.forEach(lang => {
        if (!state.availableSkills.includes(lang)) {
          state.availableSkills.push(lang);
        }
        if (!state.selectedSkills.includes(lang)) {
          state.selectedSkills.push(lang);
        }
      });
    }

    const readmeNotice = readmeText ? ' & Profile README parsed!' : '!';
    showToast(`Successfully imported @${username}${readmeNotice}`);
    await syncAvatarBase64();
    renderApp();
  } catch (err) {
    showToast(`Could not fetch @${username}: ${err.message}`);
  }
}

function parseReadmeDetails(markdown) {
  const result = {
    subtitle: '',
    primaryRole: '',
    focus: '',
    quote: '',
    quoteAuthor: '',
    education: '',
    location: '',
    skills: []
  };

  const lines = markdown.split('\n').map(l => l.trim()).filter(Boolean);

  // Extract Quotes (> ...)
  const quoteLine = lines.find(l => l.startsWith('>') && l.length > 10);
  if (quoteLine) {
    const rawQuote = quoteLine.replace(/^>\s*/, '').replace(/^"|"$/g, '').trim();
    if (rawQuote.includes('—') || rawQuote.includes('-')) {
      const parts = rawQuote.split(/—|-/);
      result.quote = parts[0].trim();
      result.quoteAuthor = parts.slice(1).join('-').trim();
    } else {
      result.quote = rawQuote;
      result.quoteAuthor = 'GitHub Profile Bio';
    }
  }

  // Extract Focus / Working On (🔭 I’m currently working on ..., 🌱 I'm learning ...)
  const focusLine = lines.find(l => /🔭|🌱|⚡|working on|building|focus|learning/i.test(l) && !l.includes('<img') && !l.includes('<a href'));
  if (focusLine) {
    const cleanFocus = focusLine.replace(/<[^>]*>/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[*_#`~]/g, '').replace(/^[-*>]|\s*(🔭|🌱|⚡|💬|📫|😄)\s*/gi, '').trim();
    if (cleanFocus.length > 5) {
      result.focus = cleanFocus.slice(0, 55);
    }
  }

  // Extract Bio / Role
  const bioLine = lines.find(l => /I'm a|software engineer|developer|student|architect|creator|designer/i.test(l) && !l.startsWith('>') && !l.includes('<img') && !l.includes('<a href'));
  if (bioLine) {
    const cleanBio = bioLine.replace(/<[^>]*>/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[*_#`~]/g, '').replace(/^[-*#>]|\s*(👋|✨|🚀)\s*/gi, '').trim();
    if (cleanBio.length > 5) {
      result.subtitle = cleanBio.startsWith('//') ? cleanBio : `// ${cleanBio.slice(0, 65)}`;
    }
  }

  // Common Skills Keywords in README
  const knownTech = [
    'Python', 'PyTorch', 'TensorFlow', 'JavaScript', 'TypeScript', 'React', 'Svelte', 'Vue',
    'Node.js', 'Flask', 'Django', 'FastAPI', 'MySQL', 'PostgreSQL', 'MongoDB', 'Docker',
    'AWS', 'Git', 'C', 'C++', 'C#', 'Java', 'Rust', 'Go', 'Pandas', 'NumPy', 'Scikit-Learn', 'Tailwind',
    'GraphQL', 'Kubernetes', 'Linux', 'PHP', 'HTML', 'CSS', 'Ruby', 'Kotlin', 'Swift'
  ];

  knownTech.forEach(tech => {
    const escaped = tech.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?:^|[^a-zA-Z0-9_])${escaped}(?:$|[^a-zA-Z0-9_])`, 'i');
    if (regex.test(markdown)) {
      result.skills.push(tech);
    }
  });

  return result;
}

function renderApp() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <header class="header">
      <div class="brand">
        <div class="brand-icon">&lt;/&gt;</div>
        <div class="brand-text">
          <div class="brand-text-container">
            <h1>GitHub Banner Studio</h1>
            <span class="badge-version">v2.0 LIVE</span>
          </div>
          <p>Handcrafted Dynamic Developer Profile Cards</p>
        </div>
      </div>
      <div class="actions-bar">
        <a href="https://github.com/Leander-Antony/banner" target="_blank" class="btn btn-secondary" style="text-decoration:none;">
          GitHub Repo
        </a>
        <button class="btn btn-secondary" id="btnCopyCode">Copy SVG Code</button>
        <button class="btn btn-primary" id="btnDownload">Download SVG</button>
      </div>
    </header>

    <div class="main-container">
      <div class="preview-card">
        <div class="preview-header">
          <div class="preview-title"><span class="preview-badge"></span> Live Canvas Preview</div>
          <span style="font-size:0.75rem; color:var(--text-muted); font-family:var(--font-mono)">1180 × 610 px • SVG Vector</span>
        </div>
        <div class="svg-wrapper" id="svgPreview"></div>
      </div>

      <div class="editor-card">
        <!-- GITHUB PROFILE IMPORT FEATURE -->
        <div class="editor-section" style="background: rgba(16, 185, 129, 0.08); border-color: rgba(16, 185, 129, 0.25);">
          <div class="section-title" style="color:#10b981;">
            Import Any GitHub Profile
          </div>
          <p style="font-size:0.75rem; color:var(--text-muted);">Auto-fetch profile identity, avatar, bio &amp; Profile README in 1-click!</p>
          <div style="display:flex; gap:0.5rem;">
            <input type="text" class="form-control" id="inputGithubFetch" placeholder="e.g. torvalds, octocat, or github.com/..." style="flex:1;" />
            <button class="btn btn-primary" id="btnFetchProfile" style="padding:0.55rem 0.95rem; font-size:0.8rem;">Import Profile</button>
          </div>
        </div>

        <div class="editor-section">
          <div class="section-title">Card Layout Architecture</div>
          <div class="preset-grid">
            <button class="preset-btn ${state.layout==='bento'?'active':''}" data-layout="bento">Bento Grid</button>
            <button class="preset-btn ${state.layout==='hud'?'active':''}" data-layout="hud">Sci-Fi Telemetry</button>
            <button class="preset-btn ${state.layout==='terminal'?'active':''}" data-layout="terminal">Terminal Split</button>
            <button class="preset-btn ${state.layout==='vscode'?'active':''}" data-layout="vscode">VS Code IDE</button>
            <button class="preset-btn ${state.layout==='synthwave'?'active':''}" data-layout="synthwave" style="grid-column: span 2;">Retro Synthwave</button>
          </div>
        </div>

        <div class="editor-section">
          <div class="section-title">Refined Dark Themes</div>
          <div class="preset-grid">
            <button class="preset-btn ${state.theme==='nordic_navy'?'active':''}" data-theme="nordic_navy">Nordic Slate</button>
            <button class="preset-btn ${state.theme==='titanium'?'active':''}" data-theme="titanium">Titanium Zinc</button>
            <button class="preset-btn ${state.theme==='emerald_slate'?'active':''}" data-theme="emerald_slate">Forest Emerald</button>
            <button class="preset-btn ${state.theme==='monokai_matte'?'active':''}" data-theme="monokai_matte">Monokai Warm</button>
            <button class="preset-btn ${state.theme==='obsidian_violet'?'active':''}" data-theme="obsidian_violet" style="grid-column: span 2;">Midnight Obsidian</button>
          </div>
        </div>

        <div class="editor-section">
          <div class="section-title">Profile Identity</div>
          <div class="form-group">
            <label>Full Name</label>
            <input type="text" class="form-control" id="inputName" value="${escapeXML(state.name)}" />
          </div>
          <div class="form-group">
            <label>Primary Role / Specialty</label>
            <input type="text" class="form-control" id="inputPrimaryRole" value="${escapeXML(state.primaryRole)}" />
          </div>
          <div class="form-group">
            <label>Subtitle / Bio / Motto</label>
            <input type="text" class="form-control" id="inputSubtitle" value="${escapeXML(state.subtitle)}" />
          </div>
          <div class="form-group">
            <label>Status Badge Text</label>
            <input type="text" class="form-control" id="inputStatus" value="${escapeXML(state.statusText)}" />
          </div>
          <div class="form-group">
            <label>Avatar Image URL</label>
            <input type="text" class="form-control" id="inputAvatar" value="${escapeXML(state.avatarUrl)}" />
          </div>
        </div>

        <div class="editor-section">
          <div class="section-title">Background &amp; Details</div>
          <div class="form-group">
            <label>Location</label>
            <input type="text" class="form-control" id="inputLocation" value="${escapeXML(state.location)}" />
          </div>
          <div class="form-group">
            <label>Education / Company</label>
            <input type="text" class="form-control" id="inputEducation" value="${escapeXML(state.education)}" />
          </div>
          <div class="form-group">
            <label>Current Focus &amp; Projects</label>
            <input type="text" class="form-control" id="inputFocus" value="${escapeXML(state.focus)}" />
          </div>
          <div class="form-group">
            <label>GitHub Username</label>
            <input type="text" class="form-control" id="inputGithub" value="${escapeXML(state.githubUser)}" />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="text" class="form-control" id="inputEmail" value="${escapeXML(state.email)}" />
          </div>
        </div>

        <div class="editor-section">
          <div class="section-title">Personal Philosophy &amp; Quote</div>
          <div class="form-group">
            <label>Quote / Motto</label>
            <input type="text" class="form-control" id="inputQuote" value="${escapeXML(state.quote)}" />
          </div>
          <div class="form-group">
            <label>Quote Author / Source</label>
            <input type="text" class="form-control" id="inputQuoteAuthor" value="${escapeXML(state.quoteAuthor)}" />
          </div>
        </div>

        <div class="editor-section">
          <div style="display:flex; align-items:center; justify-content:space-between;">
            <div class="section-title" style="margin:0;">Tech Stack Skills</div>
            <span class="badge-skills-count">${state.selectedSkills.length} Selected</span>
          </div>
          <p style="font-size:0.75rem; color:var(--text-muted);">Click pills to toggle on/off, or add a custom skill below.</p>

          <div style="display:flex; gap:0.5rem; margin-top:0.25rem;">
            <input type="text" class="form-control" id="inputAddSkill" placeholder="Add custom skill (e.g. GraphQL, Tailwind)..." style="flex:1;" />
            <button class="btn btn-secondary" id="btnAddSkill" style="padding:0.55rem 0.85rem; font-size:0.8rem;">+ Add</button>
          </div>

          <div class="pills-container" id="skillsContainer">
            ${state.availableSkills.map(skill => {
              const isSel = state.selectedSkills.includes(skill);
              return `<span class="pill-tag ${isSel ? 'selected' : ''}" data-skill="${escapeXML(skill)}">${escapeXML(skill)}</span>`;
            }).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  updatePreview();
  attachEvents();
}

function updatePreview() {
  const svgCode = generateSVG(state);
  document.getElementById('svgPreview').innerHTML = svgCode;
}

function attachEvents() {
  const btnFetch = document.getElementById('btnFetchProfile');
  const inputFetch = document.getElementById('inputGithubFetch');
  if (btnFetch && inputFetch) {
    btnFetch.addEventListener('click', () => fetchGitHubProfile(inputFetch.value));
    inputFetch.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') fetchGitHubProfile(inputFetch.value);
    });
  }

  const btnAddSkill = document.getElementById('btnAddSkill');
  const inputAddSkill = document.getElementById('inputAddSkill');
  const addSkillFunc = () => {
    const val = inputAddSkill.value.trim();
    if (val) {
      if (!state.availableSkills.includes(val)) {
        state.availableSkills.push(val);
      }
      if (!state.selectedSkills.includes(val)) {
        state.selectedSkills.push(val);
      }
      inputAddSkill.value = '';
      showToast(`Added custom skill: ${val}`);
      renderApp();
    }
  };
  if (btnAddSkill && inputAddSkill) {
    btnAddSkill.addEventListener('click', addSkillFunc);
    inputAddSkill.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') addSkillFunc();
    });
  }

  document.querySelectorAll('.preset-btn[data-layout]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.preset-btn[data-layout]').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      state.layout = e.target.dataset.layout;
      updatePreview();
    });
  });

  document.querySelectorAll('.preset-btn[data-theme]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.preset-btn[data-theme]').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      state.theme = e.target.dataset.theme;
      updatePreview();
    });
  });

  const bindInput = (id, key) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', (e) => {
        state[key] = e.target.value;
        updatePreview();
      });
    }
  };

  bindInput('inputName', 'name');
  bindInput('inputPrimaryRole', 'primaryRole');
  bindInput('inputSubtitle', 'subtitle');
  bindInput('inputStatus', 'statusText');
  
  const avatarEl = document.getElementById('inputAvatar');
  if (avatarEl) {
    avatarEl.addEventListener('input', (e) => {
      state.avatarUrl = e.target.value;
      syncAvatarBase64();
    });
  }

  bindInput('inputLocation', 'location');
  bindInput('inputEducation', 'education');
  bindInput('inputFocus', 'focus');
  bindInput('inputGithub', 'githubUser');
  bindInput('inputEmail', 'email');
  bindInput('inputQuote', 'quote');
  bindInput('inputQuoteAuthor', 'quoteAuthor');

  document.querySelectorAll('.pill-tag').forEach(tag => {
    tag.addEventListener('click', (e) => {
      const skill = e.target.dataset.skill;
      if (state.selectedSkills.includes(skill)) {
        state.selectedSkills = state.selectedSkills.filter(s => s !== skill);
        e.target.classList.remove('selected');
      } else {
        state.selectedSkills.push(skill);
        e.target.classList.add('selected');
      }
      renderApp();
    });
  });

  document.getElementById('btnCopyCode').addEventListener('click', () => {
    const svgCode = generateSVG(state);
    navigator.clipboard.writeText(svgCode).then(() => {
      showToast('SVG Code copied to clipboard!');
    });
  });

  document.getElementById('btnDownload').addEventListener('click', () => {
    const svgCode = generateSVG(state);
    const blob = new Blob([svgCode], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.name.toLowerCase().replace(/\s+/g, '-')}-${state.layout}-banner.svg`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${state.layout} SVG banner!`);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderApp();
  syncAvatarBase64();
});
