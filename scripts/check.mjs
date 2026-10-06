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
  for (const amount of ['3,300', '6,600', '8,800', '550']) assert(html.includes(amount), `${file}: missing price ${amount}`);
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
  const gaMeasurementId = 'G-GL74MVB738';
  if (canonical.startsWith('https://chilllabo.tokyo/')) {
    assert(html.includes(`googletagmanager.com/gtag/js?id=${gaMeasurementId}`), `${file}: GA4 loader`);
    assert(html.includes(`gtag('config','${gaMeasurementId}')`), `${file}: GA4 config`);
  } else {
    assert(!html.includes('googletagmanager.com/gtag/js'), `${file}: preview must not send production analytics`);
  }
  for (const locale of ['ja', 'en', 'x-default']) assert(html.includes(`hreflang="${locale}"`));
  if (canonical.includes('github.io')) assert(html.includes('content="noindex,follow"'), 'Preview must remain noindex');
  assert(await stat(path.join(root, file)).then(s => s.size < 100_000), `${file}: HTML size budget`);
  console.log(`PASS ${file}: metadata, prices, structured data, anchors, assets`);
}
console.log('Static publication checks passed. Browser/device QA is separate.');
const siteJs = await readFile(path.join(root, 'assets/js/site.js'), 'utf8');
assert(siteJs.includes("window.gtag('event'"), 'site.js: tracked intent events must be sent to GA4');
assert(siteJs.includes('link.dataset.track'), 'site.js: data-track events must be wired');
const homepage = await readFile(path.join(root, 'index.html'), 'utf8');
for (const eventName of ['reservation_outbound', 'maps_outbound', 'course_outbound', 'tabelog_outbound', 'tablecheck_outbound', 'phone_click']) {
  assert(homepage.includes(`data-track="${eventName}"`), `index.html: missing ${eventName}`);
}
assert(homepage.includes('tabelog.com/tokyo/A1308/A130801/13261005/'), 'index.html: Tabelog booking link');
assert(homepage.includes('tablecheck.com/ja/chilllabo-tokyo'), 'index.html: TableCheck booking link');
const origin = homepage.match(/rel="canonical" href="([^"]+)"/)[1].replace(/\/$/, '');
for (const [route, target, lang] of [['sakebar_chilllaboakasaka', '/en/', 'en'], ['archives/129', '/', 'ja'], ['archives/132', '/en/', 'en'], ['page/2', '/', 'ja'], ['archives/689', '/story/', 'ja'], ['archives/709', '/guide/sake-karakuchi/', 'ja']]) {
  const html = await readFile(path.join(root, route, 'index.html'), 'utf8');
  assert(html.includes(`<html lang="${lang}">`), `${route}: legacy language`);
  assert(html.includes(`rel="canonical" href="${origin}${target}"`), `${route}: wrong destination`);
  assert(html.includes(`<meta http-equiv="refresh" content="0;url=${origin}${target}">`), `${route}: immediate meta redirect`);
  assert(html.includes('noindex,follow'), `${route}: legacy page must be noindex`);
  assert(!html.includes('<noscript><meta http-equiv="refresh"'), `${route}: redirect must not depend on noscript`);
}
for (const [file, expectedPath, needsFaq] of [
  ['story/index.html', '/story/', false],
  ['guide/sake-karakuchi/index.html', '/guide/sake-karakuchi/', true],
]) {
  const html = await readFile(path.join(root, file), 'utf8');
  assert(html.includes('<html lang="ja">'), `${file}: language`);
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `${file}: one H1`);
  assert(html.includes(`rel="canonical" href="${origin}${expectedPath}"`), `${file}: canonical`);
  assert(html.includes('content="index,follow"') === (origin === 'https://chilllabo.tokyo'), `${file}: indexability follows production mode`);
  assert(html.includes('G-GL74MVB738') === (origin === 'https://chilllabo.tokyo'), `${file}: analytics only in production`);
  const schema = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
  assert(Array.isArray(schema['@graph']), `${file}: schema graph`);
  assert(schema['@graph'].some(node => node['@type'] === 'Article'), `${file}: Article schema`);
  assert(schema['@graph'].some(node => node['@type'] === 'BreadcrumbList'), `${file}: breadcrumb schema`);
  if (needsFaq) {
    assert(schema['@graph'].some(node => node['@type'] === 'FAQPage'), `${file}: FAQ schema`);
    assert(html.includes('japansake.or.jp'), `${file}: authoritative sake references`);
    assert(html.includes('日本酒度') && html.includes('酸') && html.includes('後味'), `${file}: dry-sake explanatory factors`);
  } else {
    assert(!html.includes('『1400』') && !html.includes('毎年30蔵'), `${file}: stale brewery statistics removed`);
    assert(html.includes('/guide/sake-karakuchi/'), `${file}: guide internal link`);
  }
  assert(await stat(path.join(root, file)).then(s => s.size < 100_000), `${file}: HTML size budget`);
}
const sitemap = await readFile(path.join(root, 'sitemap.xml'), 'utf8');
for (const pathName of ['/', '/en/', '/story/', '/guide/sake-karakuchi/']) {
  assert(sitemap.includes(`<loc>${origin}${pathName}</loc>`), `sitemap missing ${pathName}`);
}
if (origin === 'https://chilllabo.tokyo') {
  for (const file of ['index.html', 'en/index.html', 'story/index.html', 'guide/sake-karakuchi/index.html']) assert((await readFile(path.join(root, file), 'utf8')).includes('content="index,follow"'), `${file}: production must be indexable`);
  assert((await readFile(path.join(root, 'robots.txt'), 'utf8')).includes('Sitemap: https://chilllabo.tokyo/sitemap.xml'));
}
console.log('Legacy route, editorial page and production-mode checks passed.');
