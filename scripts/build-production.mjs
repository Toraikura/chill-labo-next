// Produce the official-domain bundle locally without changing live DNS or Pages.
process.env.SITE_ORIGIN = 'https://chilllabo.tokyo';
process.env.SITE_INDEXABLE = 'true';
await import('./build.mjs');
