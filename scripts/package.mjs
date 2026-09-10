import { cp, mkdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, '_site');
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const item of ['index.html', 'en', 'assets', '404.html', '.nojekyll', 'robots.txt', 'sitemap.xml', 'sakebar_chilllaboakasaka', 'archives', 'page']) {
  await cp(path.join(root, item), path.join(output, item), { recursive: true });
}
console.log('Packaged public files in _site/');
