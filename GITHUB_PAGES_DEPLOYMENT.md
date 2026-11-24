# GitHub Pages Deployment

This project is built with Vite, not Jekyll. Use the workflow below at `.github/workflows/deploy.yml`.

It runs on pushes to `main`, installs dependencies with `npm ci`, builds `dist/`, uploads that folder as a Pages artifact, and deploys it with GitHub Pages.

```yaml
name: Deploy Vite site to GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v5
```

Before the first deployment, open repository Settings → Pages and set **Build and deployment → Source** to **GitHub Actions**.

The deployment output is the GitHub Pages URL shown in the workflow run and in the `github-pages` environment. Build output is generated in `dist/`.

Asset paths are relative via `base: './'` in `vite.config.js`, and the CV is linked as `./Prashanna_Sharma.pdf`, so the site works at both `https://username.github.io/repository/` and custom domains.
