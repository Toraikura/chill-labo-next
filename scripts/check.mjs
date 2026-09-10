import { readFile, access, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
const root = fileURLToPath(new URL('../', import.meta.url));
for (const [file, lang] of [['index.html', 'ja'], ['en/index.html', 'en']]) {
  const html = await readFile(path.join(root, file), 'utf8');
  assert(html.includes(`<html lang="${lang}">`), `${file}: language`);
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `${file}: one H1`);
  assert(html.includes('Japanese Sake Bar'), `${file}: descriptive title`);
  assert(!/4時間|4-hour|4 hour/i.test(html), `${file}: removed old plan`);
  for (const amount of ['3,300', '1,100', '6,600', '8,800', '550']) assert(html.includes(amount), `${file}: missing price ${amount}`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(new Set(ids).size, ids.length, `${file}: duplicate IDs`);
  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const url = m[1].replaceAll('&amp;', '&');
    if (url.startsWith('#')) assert(ids.includes(url.slice(1)), `${file}: broken anchor ${url}`);
    else if (!/^(https?:|tel:)/.test(url)) await access(path.resolve(root, path.dirname(file), url.split(/[?#]/)[0]));
  }
  for (const img of html.matchAll(/<img\b[^>]+>/g)) {
    assert(/alt="[^"]+"/.test(img[0]), `${file}: image needs description`);
    assert(/width="\d+"/.test(img[0]) && /height="\d+"/.test(img[0]), `${file}: image layout dimensions`);
  }
  for (const link of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) assert(/rel="noopener noreferrer"/.test(link[0]), `${file}: external link rel`);
  const schema = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
  assert.equal(schema['@type'], 'BarOrPub');
  assert.equal(schema.telephone, '+81-80-8700-8528');
  assert(!schema.aggregateRating && !schema.review && !schema.geo, `${file}: no unverified rating or coordinates`);
  const canonical = html.match(/rel="canonical" href="([^"]+)"/)[1];
  assert.equal(schema.url, canonical);
  assert(canonical.endsWith(lang === 'en' ? '/en/' : '/'));
  for (const locale of ['ja', 'en', 'x-default']) assert(html.includes(`hreflang="${locale}"`));
  if (canonical.includes('github.io')) assert(html.includes('content="noindex,follow"'), 'Preview must remain noindex');
  assert(await stat(path.join(root, file)).then(s => s.size < 100_000), `${file}: HTML size budget`);
  console.log(`PASS ${file}: metadata, prices, structured data, anchors, assets`);
}
console.log('Static publication checks passed. Browser/device QA is separate.');
const homepage = await readFile(path.join(root, 'index.html'), 'utf8');
const origin = homepage.match(/rel="canonical" href="([^"]+)"/)[1].replace(/\/$/, '');
for (const [route, target] of [['sakebar_chilllaboakasaka', '/en/'], ['archives/129', '/'], ['archives/132', '/en/'], ['page/2', '/']]) {
  const html = await readFile(path.join(root, route, 'index.html'), 'utf8');
  assert(html.includes(`rel="canonical" href="${origin}${target}"`), `${route}: wrong destination`);
  assert(html.includes('noindex,follow') && html.includes('http-equiv="refresh"'), `${route}: static compatibility policy`);
}
if (origin === 'https://chilllabo.tokyo') {
  for (const file of ['index.html', 'en/index.html']) assert((await readFile(path.join(root, file), 'utf8')).includes('content="index,follow"'), `${file}: production must be indexable`);
  assert((await readFile(path.join(root, 'robots.txt'), 'utf8')).includes('Sitemap: https://chilllabo.tokyo/sitemap.xml'));
}
console.log('Legacy route and production-mode checks passed.');
