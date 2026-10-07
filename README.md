# UlamHub Landing Page

The marketing site for UlamHub — static HTML/CSS/vanilla JS, no build step,
no framework. Built from the app's real screens and design tokens
(`mobile/src/theme/theme.ts` in the main UlamHub repo).

## Preview locally

```bash
npx serve . -l 8420
```

Then open http://localhost:8420.

## Deploy

This is a plain static site, so any static host works. Fastest path with
[Vercel](https://vercel.com):

```bash
npx vercel login      # one-time, opens a browser to sign in
npx vercel --prod      # deploys this folder
```

Vercel will print a `*.vercel.app` URL immediately. To use the real domain
(`www.ulamhub.com`):

1. In the Vercel dashboard → the project → **Settings → Domains**, add `www.ulamhub.com`.
2. At your domain registrar, add the DNS record Vercel shows you (typically
   a `CNAME` for `www` pointing at `cname.vercel-dns.com`).
3. DNS can take a few minutes to a few hours to propagate.

## Structure

- `index.html` — the page
- `styles.css` — all styles (design tokens at the top of the file)
- `script.js` — mobile nav + scroll-reveal animation (~70 lines, no dependencies)
- `assets/screenshots/` — real app screenshots, resized and compressed
- `assets/icons/` — app icon/logo, favicon, OG image

Screenshots should be refreshed whenever the corresponding app screen
changes meaningfully — see the "modified functionalities" updates in this
repo's commit history for the pattern (resize to 750px wide, JPEG quality
82, via `sips`).
