// Vercel Serverless API Endpoint: /api/banner?username=octocat&layout=bento&theme=nordic_navy

export default async function handler(req, res) {
  const {
    username = 'octocat',
    name = 'Alex Rivera',
    subtitle = '// Full-stack dev & open source creator',
    statusText = 'available for opportunities',
    layout = 'bento',
    theme = 'nordic_navy',
    location = 'San Francisco, CA',
    education = 'B.S. Computer Science & Engineering',
    focus = 'Distributed Systems & Modern Web Frameworks'
  } = req.query;

  const avatarUrl = `https://github.com/${username}.png`;
  const avatarDataUrl = await fetchAvatarBase64(avatarUrl);

  const svg = `<svg width="1180" height="610" viewBox="0 0 1180 610" xmlns="http://www.w3.org/2000/svg" role="img">
<defs>
  <linearGradient id="bentoBg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0b1329"/><stop offset="50%" stop-color="#111c3d"/><stop offset="100%" stop-color="#070c1a"/></linearGradient>
  <filter id="glowSoft"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <clipPath id="mainClip"><rect width="1180" height="610" rx="20"/></clipPath>
  <clipPath id="avatarCircle"><circle cx="75" cy="75" r="70"/></clipPath>
</defs>
<g clip-path="url(#mainClip)">
  <rect width="1180" height="610" fill="url(#bentoBg)"/>
  <rect x="2" y="2" width="1176" height="606" rx="18" fill="none" stroke="rgba(255,255,255,.07)" stroke-width="1.5"/>

  <!-- Hero Card -->
  <g transform="translate(24, 24)">
    <rect width="740" height="260" rx="18" fill="#182752" opacity="0.85" stroke="rgba(255,255,255,.08)" stroke-width="1"/>
    <g transform="translate(32, 32)">
      <g>
        <circle cx="75" cy="75" r="78" fill="none" stroke="#38bdf8" stroke-width="2.5" opacity="0.9" filter="url(#glowSoft)"/>
        <g clip-path="url(#avatarCircle)">
          <rect width="150" height="150" fill="#111c3d"/>
          <image href="${avatarDataUrl}" width="150" height="150" preserveAspectRatio="xMidYMid slice"/>
        </g>
      </g>
      <g transform="translate(180, 20)">
        <rect width="210" height="26" rx="13" fill="rgba(56,189,248,0.12)" stroke="#38bdf8" stroke-width="1"/>
        <text x="28" y="17" font-family="'Consolas', monospace" font-size="11.5" font-weight="600" fill="#38bdf8">${escapeXML(statusText.toUpperCase())}</text>
        <text x="0" y="65" font-family="'Outfit', sans-serif" font-size="34" font-weight="800" fill="#ffffff">${escapeXML(name)}</text>
        <text x="0" y="94" font-family="'Fira Code', monospace" font-size="15" font-weight="600" fill="#38bdf8">✦ ${escapeXML(username)}</text>
        <text x="0" y="124" font-family="'Inter', sans-serif" font-size="13" fill="#9ca3af">${escapeXML(subtitle)}</text>
      </g>
    </g>
  </g>

  <!-- Focus Card -->
  <g transform="translate(788, 24)">
    <rect width="368" height="260" rx="18" fill="#182752" opacity="0.85" stroke="rgba(255,255,255,.08)" stroke-width="1"/>
    <g transform="translate(24, 24)">
      <text x="0" y="16" font-family="'Fira Code', monospace" font-size="11" font-weight="700" fill="#818cf8">CURRENT FOCUS</text>
      <text x="0" y="48" font-family="'Outfit', sans-serif" font-size="19" font-weight="700" fill="#ffffff">${escapeXML(focus)}</text>
      <text x="0" y="72" font-family="'Inter', sans-serif" font-size="12" fill="#9ca3af">Education: ${escapeXML(education)}</text>
    </g>
  </g>

  <!-- Skills Card -->
  <g transform="translate(24, 308)">
    <rect width="480" height="278" rx="18" fill="#182752" opacity="0.85" stroke="rgba(255,255,255,.08)" stroke-width="1"/>
    <g transform="translate(24, 24)">
      <text x="0" y="16" font-family="'Fira Code', monospace" font-size="11" font-weight="700" fill="#38bdf8">TECH MATRIX</text>
      <text x="0" y="200" font-family="'Inter', sans-serif" font-size="12" fill="#9ca3af">Location: ${escapeXML(location)}</text>
    </g>
  </g>

  <!-- Philosophy Card -->
  <g transform="translate(520, 308)">
    <rect width="350" height="278" rx="18" fill="#182752" opacity="0.85" stroke="rgba(255,255,255,.08)" stroke-width="1"/>
    <g transform="translate(24, 24)">
      <text x="0" y="16" font-family="'Fira Code', monospace" font-size="11" font-weight="700" fill="#38bdf8">PERSONAL PHILOSOPHY</text>
      <text x="0" y="66" font-family="'Georgia', serif" font-style="italic" font-size="14.5" fill="#f0f6fc">"When you decided to go to</text>
      <text x="0" y="90" font-family="'Georgia', serif" font-style="italic" font-size="14.5" fill="#f0f6fc">the sea, it was your own decision."</text>
      <text x="0" y="124" font-family="'Inter', sans-serif" font-size="12.5" fill="#38bdf8">— Roronoa Zoro (One Piece)</text>
    </g>
  </g>

  <!-- Connect Card -->
  <g transform="translate(886, 308)">
    <rect width="270" height="278" rx="18" fill="#182752" opacity="0.85" stroke="rgba(255,255,255,.08)" stroke-width="1"/>
    <g transform="translate(20, 24)">
      <text x="0" y="16" font-family="'Fira Code', monospace" font-size="11" font-weight="700" fill="#818cf8">CONNECT</text>
      <text x="0" y="55" font-family="'Fira Code', monospace" font-size="11.5" fill="#ffffff">github.com/${escapeXML(username)}</text>
    </g>
  </g>
</g>
</svg>`;

  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
  return res.status(200).send(svg);
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

async function fetchAvatarBase64(url) {
  if (!url) return '';
  try {
    if (typeof fetch === 'function') {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'GitHub-Banner-Studio' }
      });
      if (res.ok) {
        const mime = res.headers.get('content-type') || 'image/png';
        const arrayBuf = await res.arrayBuffer();
        const base64 = Buffer.from(arrayBuf).toString('base64');
        return `data:${mime};base64,${base64}`;
      }
    }
  } catch (e) {
    // fallback below
  }

  return new Promise((resolve) => {
    try {
      const https = require('https');
      const request = (targetUrl) => {
        https.get(targetUrl, { headers: { 'User-Agent': 'GitHub-Banner-Studio' } }, (res) => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            return request(res.headers.location);
          }
          if (res.statusCode !== 200) return resolve(url);
          const chunks = [];
          res.on('data', chunk => chunks.push(chunk));
          res.on('end', () => {
            const buf = Buffer.concat(chunks);
            const mime = res.headers['content-type'] || 'image/png';
            resolve(`data:${mime};base64,${buf.toString('base64')}`);
          });
        }).on('error', () => resolve(url));
      };
      request(url);
    } catch (e) {
      resolve(url);
    }
  });
}

