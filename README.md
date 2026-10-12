# Patryk Szewczuk — game development portfolio

A static HTML portfolio built around three full-width game scenes: ThawStroke, Flower Shop and SaveTheWorld. Dark styling, locally compiled Tailwind CSS, and a small vanilla JavaScript playback controller. No backend, runtime CDN, external fonts or framework.

## Run locally

Use Node.js 24 and npm (matching the deployment workflow).

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:4173. The dev script builds once and serves `dist/`. After editing, run `npm run build` and refresh. `npm run preview` serves the latest build.

## Build

```sh
npm run build
```

The production output is `dist/`. No environment variables are required.

## GitHub Pages deployment

Repository: `PatrykSzewczuk/PatrykSzewczuk.github.io`.
Production URL: https://patrykszewczuk.github.io/

In the repository's **Settings → Pages → Build and deployment**, select **GitHub Actions** as the source. Push the source files, `package-lock.json`, and `.github/workflows/deploy.yml` to `main`. Every push to `main` then installs dependencies with `npm ci`, runs `npm run build`, and deploys only `dist/`. The workflow can also be run manually from the Actions tab. It uses GitHub's built-in deployment credentials; no personal access token or environment secrets are needed.

This is a static HTML site with Tailwind CSS and vanilla JavaScript, with no framework router or base-path setting. `dist/index.html` is deployed directly at `/`, with no repository-name prefix. Project pages remain real files at `/projects/thawstroke.html`, `/projects/flower-shop.html`, and `/projects/save-the-world.html`, so direct links and refreshes work without rewrite rules or an SPA fallback. Keep the `.html` suffix in project links.

The build copies the complete `assets/` directory, including images, video clips, original gameplay videos, JavaScript, compiled CSS, and the CV. Fonts use system font stacks and require no font downloads. Existing document-relative links resolve from both the homepage and project pages.

`node_modules/`, `dist/`, `.env` files, and common local credential files are ignored by Git. Commit the lockfile, not installed dependencies. Ignore rules do not remove files already tracked by Git; inspect `git status` before committing.

## Structure

- `index.html`: sequential game showcases, compact software entries, About, contact and CV.
- `projects/*.html`: cinematic opening, project facts, original development chapters, gameplay still and next-project navigation.
- `src/styles.css`: source styles and responsive layouts. Edit this rather than generated `assets/styles.css`.
- `assets/site.js`: lazy loading and background playback.
- `assets/<project>/ambient.mp4`: optimized 1280px, 24fps, silent background excerpts (14 seconds for ThawStroke; 24 seconds for the others).
- `assets/<project>/showcase-poster.jpg`: immediate poster fallback.
- `assets/<project>/story-still.jpg`: actual gameplay frame extracted from the original recording, not a historical development image.

The original showcase videos remain unchanged and are accessible through each scene's “Full gameplay” link. Background video uses `object-fit: cover` and may crop the frame, especially on mobile; the original recording and story images preserve the whole frame.

## Playback and accessibility

Background clips are muted, loop and play inline. JavaScript attaches their source only near the viewport, plays them when at least 25% visible, pauses them offscreen or when the document is hidden, and preserves manual pauses. A custom keyboard-accessible play/pause button is available on each scene; full video links open the original files with browser playback controls.

Reduced-motion and data-saving preferences default to static posters with optional manual playback. Browser autoplay restrictions also leave the poster and play control available. With JavaScript disabled, posters and full-video links remain usable. Navigation includes a skip link, focus outlines and semantic headings. No scrolling is hijacked.

## Content

The supplied project writing is retained. The Flower Shop-specific paragraph has been removed from About and remains in the Flower Shop case study. Software projects retain their existing descriptions and inactive status where applicable. No personal traits, achievements or motivations have been invented.

Game links still point to the supplied itch.io profile; direct playable URLs were not supplied. Flower Shop has no fabricated demo or repository link. The empty development-image placeholder has been replaced by an accurately labelled gameplay still. The supplied CV is unchanged at `assets/cv.pdf`.

To update a clip, retain the original file and regenerate `ambient.mp4` with H.264, no audio, an even frame size and MP4 fast-start metadata. Update the corresponding poster and story still as needed. FFmpeg is only needed to regenerate media, not to build or serve the site.
