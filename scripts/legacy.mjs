import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const legacyRoutes = [
  ['sakebar_chilllaboakasaka', '/en/'],
  ['archives/129', '/'],
  ['archives/132', '/en/'],
  ['page/2', '/'],
];

const legacyHashes = {
  prices: 'pricing',
  'nearby-hotels': 'access',
  experience: 'experience',
  food: 'courses',
  hours: 'access',
  about: 'discover',
  faq: 'faq',
};

const escapeHtml = value => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');

function renderLegacy(destination) {
  const href = escapeHtml(destination);
  const scriptDestination = JSON.stringify(destination).replaceAll('<', '\\u003c');
  return `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,follow">
<link rel="canonical" href="${href}">
<title>ページが移動しました | Chill Labo Akasaka</title>
<script>
(() => {
  const destination = ${scriptDestination};
  const hashes = ${JSON.stringify(legacyHashes)};
  let previousHash = '';
  try { previousHash = decodeURIComponent(window.location.hash.slice(1)); } catch {}
  const mappedHash = Object.prototype.hasOwnProperty.call(hashes, previousHash) ? hashes[previousHash] : '';
  window.location.replace(destination + (mappedHash ? '#' + mappedHash : ''));
})();
</script>
<noscript><meta http-equiv="refresh" content="0;url=${href}"></noscript>
<style>body{font-family:system-ui,sans-serif;line-height:1.7;max-width:40rem;margin:4rem auto;padding:0 1.25rem;color:#302029;background:#faf8f0}a{display:inline-block;padding:.75rem 0;color:inherit;text-underline-offset:.2em}a:focus-visible{outline:2px solid currentColor;outline-offset:4px}</style>
</head>
<body>
<main>
<p>CHILL LABO AKASAKA</p>
<h1>ページが移動しました。</h1>
<p>自動で移動しない場合は、下のリンクを開いてください。</p>
<p><a href="${href}">新しいページを開く →</a></p>
<p lang="en">This page has moved. If you are not redirected automatically, use the link below.</p>
<p lang="en"><a href="${href}">Open the new page →</a></p>
</main>
</body>
</html>
`;
}

// These are static compatibility pages, not HTTP 301 redirects.
// No other former article URLs are generated here; they keep the normal 404 response.
export async function buildLegacy({ root, origin }) {
  const base = String(origin).replace(/\/+$/, '');
  const parsed = new URL(base);
  if (parsed.protocol !== 'https:' || parsed.username || parsed.password || parsed.search || parsed.hash) {
    throw new Error('Legacy page origin must be an HTTPS URL without credentials, query or hash');
  }
  for (const [route, target] of legacyRoutes) {
    const directory = path.join(root, route);
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, 'index.html'), renderLegacy(base + target));
  }
}
