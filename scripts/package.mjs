import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, '_site');
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const item of ['index.html', 'en', 'story', 'guide', 'assets', '404.html', '.nojekyll', 'robots.txt', 'sitemap.xml', 'sakebar_chilllaboakasaka', 'archives', 'page']) {
  await cp(path.join(root, item), path.join(output, item), { recursive: true });
}

// Content-addressed URLs prevent new HTML from using an older cached CSS/JS.
// Keep the original files as well, so previously published URLs still resolve.
const assets = ['assets/css/styles.css', 'assets/css/booking-layout.css', 'assets/js/site.js'];
const manifest = {};
for (const asset of assets) {
  const bytes = await readFile(path.join(output, asset));
  const digest = createHash('sha256').update(bytes).digest('hex').slice(0, 16);
  const extension = path.posix.extname(asset);
  const versioned = `${asset.slice(0, -extension.length)}.${digest}${extension}`;
  await writeFile(path.join(output, versioned), bytes);
  manifest[asset] = versioned;
}

let updatedPages = 0;
async function versionHtml(directory) {
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const filename = path.join(directory, item.name);
    if (item.isDirectory()) {
      await versionHtml(filename);
      continue;
    }
    if (!item.isFile() || !item.name.endsWith('.html')) continue;
    let html = await readFile(filename, 'utf8');
    let foundStylesheet = false;
    html = html.replace(/<link\b[^>]*\bhref=(['"])([^'"]*assets\/css\/styles\.css(?:\?[^'"]*)?)\1[^>]*>/gi, (tag, quote, url) => {
      foundStylesheet = true;
      const prefix = url.slice(0, url.indexOf('assets/css/styles.css'));
      const stylesheet = tag.replace(url, `${prefix}${manifest['assets/css/styles.css']}`);
      return `${stylesheet}<link rel="stylesheet" href="${prefix}${manifest['assets/css/booking-layout.css']}">`;
    });
    html = html.replace(/\bsrc=(['"])([^'"]*assets\/js\/site\.js(?:\?[^'"]*)?)\1/gi, (attribute, quote, url) => {
      const prefix = url.slice(0, url.indexOf('assets/js/site.js'));
      return `src=${quote}${prefix}${manifest['assets/js/site.js']}${quote}`;
    });
    if (foundStylesheet) updatedPages++;
    await writeFile(filename, html);
  }
}
await versionHtml(output);
if (updatedPages < 4) throw new Error('Expected fingerprinted styles on all four public pages');
await writeFile(path.join(output, 'assets/asset-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Packaged public files in _site/; fingerprinted assets on ${updatedPages} pages`);
