# Production cutover checklist

Do not skip these steps when `chilllabo.tokyo` moves to the new site.

1. Replace remote WordPress image URLs with approved local assets in `assets/images/`.
2. Remove `<meta name="robots" content="noindex,nofollow">` from both language pages.
3. Replace `robots.txt` with production crawl rules and add the production sitemap location.
4. Add `sitemap.xml` containing at least `/` and `/en/`.
5. Confirm canonical and hreflang URLs resolve on `https://chilllabo.tokyo/`.
6. Add a 301 redirect from the legacy English URL `/sakebar_chilllaboakasaka` to `/en/`.
7. Inventory all other indexed legacy URLs and create a redirect map before WordPress is retired.
8. Verify the Instagram direct-DM CTA on iPhone, Android and desktop.
9. Verify the Google Maps destination and phone link.
10. Verify opening hours, prices, address and payment methods again on cutover day.
11. Confirm GA4/GTM receives `reserve_click`, `maps_click`, `phone_click`, `sat_outbound_click`, and `playground_outbound_click` from `window.dataLayer`.
12. Enable GitHub Pages custom domain / DNS only after the above checks pass.
13. Test 390px iPhone-width layout and a desktop viewport after the custom domain is live.
14. Submit the final sitemap in Google Search Console and re-check structured data.
