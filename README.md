# Portfolio Prash

A dynamic, single-page portfolio generated from one editable Markdown file using Vite and React.

## Update the site

Edit `content/portfolio.md`.

- YAML frontmatter controls site metadata, profile details, contact links, social links, and navigation.
- `## Heading` creates a page section.
- `### Heading` creates a card inside that section.
- Lines like `**Category:** Robotics · **Tags:** Control` become card metadata.
- Bullet lists under a card become pills.

After editing:

```bash
npm run dev
```

For a production build:

```bash
npm run build
npm run preview
```

The deployable static site is generated in `dist/`.

## Commands

```bash
npm install
npm run dev
npm run lint
npm run build
npm run preview
```

## Content file

`content/portfolio.md` is the single source of truth for page content. The site is regenerated whenever this file changes and a new build is produced.

The CV is served from `public/Prashanna_Sharma.pdf`.

## Deployment

Pushes to `main` build and deploy the site with GitHub Actions. The workflow is in `.github/workflows/deploy.yml`, with setup notes in `GITHUB_PAGES_DEPLOYMENT.md`.

Set repository Settings → Pages → Build and deployment → Source to **GitHub Actions** before the first deploy.
# PrashannaSharma.github.io
# PrashannaSharma.github.io
# PrashannaSharma.github.io
