# Chill Labo Akasaka — Next Generation Website P0

Greenfield rebuild of the Chill Labo Akasaka official website.

## P0 objective

The P0 release stays conversion-first:

1. Immediately explain what Chill Labo is.
2. Show Akasaka location, price, 100+ sake tasting and reservation path early.
3. Use Instagram DM as the single primary reservation destination.
4. Keep Google Maps as a separate transaction CTA.
5. Introduce the 1F Bottle Shop only after the core visit information.
6. Keep SAKE ART TOKYO / FERMENTATION PLAYGROUND as a small late-page discovery layer.
7. No inventory claims, no embedded games, no CMS and no heavy JavaScript.

## Current verified operating information used in P0

Verified against `https://chilllabo.tokyo/` and its English page on 2026-09-10:

- 100+ sake selections
- First hour: ¥3,300 tax included
- Each additional hour: ¥1,100, automatic extension
- 4-hour plan: ¥6,600
- No table charge with the tasting plan; ¥550 per person for à la carte only
- Mon–Fri 17:00–23:00, L.O. 22:00
- Sat 15:00–22:00, L.O. 21:15
- Sun closed
- 2F, 4-3-27 Akasaka, Minato-ku, Tokyo 107-0052
- About 5 minutes from Akasaka-mitsuke and Akasaka stations
- Primary reservation: Instagram DM `@CHILLLABOTOKYO` via `https://ig.me/m/CHILLLABOTOKYO`
- Phone alternative: 080-8700-8528 / +81 80 8700 8528
- Cash, major credit cards and PayPay
- English support / beginners / solo guests welcome

## Structure

- `index.html` — Japanese P0
- `en/index.html` — English P0
- `assets/css/styles.css` — mobile-first visual system
- `assets/js/site.js` — mobile nav, sticky CTA and analytics hooks
- `.github/workflows/pages.yml` — GitHub Pages deployment
- `GO_LIVE.md` — required production cutover checklist

## Local preview

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080/` and `http://localhost:8080/en/`.

## Important: preview is intentionally noindex

Both HTML pages contain `noindex,nofollow`, and `robots.txt` blocks crawling. This is intentional while the old production site remains live and the GitHub version is only a preview.

Do **not** point `chilllabo.tokyo` at this build until the production steps in `GO_LIVE.md` are completed.

## Images

P0 temporarily references existing Chill Labo WordPress image URLs so the greenfield build can use real store photography immediately. Before retiring the old WordPress hosting, copy the approved originals into `assets/images/` and change the HTML references to local paths.
