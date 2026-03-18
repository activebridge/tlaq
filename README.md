# Tlaquepaque Arts & Shopping Village

Jekyll site for Tlaquepaque Arts & Shopping Village in Sedona, AZ —
showcasing shops, galleries, dining, events, and wedding services.

## Requirements

- Ruby + Bundler
- Node.js (for image optimization, if applicable)

## Getting Started

```bash
bundle install
bundle exec jekyll serve
```

Open http://localhost:4000

## Structure

| Directory | Description |
|-----------|-------------|
| `_shops/` | Retail shop pages (31) |
| `_galleries/` | Art gallery pages (15) |
| `_foods/` | Dining & food pages (9) |
| `_events/` | Event pages |
| `_weddings/` | Wedding venue/service pages |
| `_layouts/` | Page templates |
| `_data/` | Site config, form settings |
| `assets/` | CSS, JS, images |

## Content

Each vendor is a Markdown file with front matter (`title`, `subtitle`, `date`, `slug`, `hours`, etc.).
Images live in `assets/images/` as `.webp` at 480/960/1440px sizes.

## Tech

- Jekyll ~4.3
- `jekyll-seo-tag`, `jekyll-sitemap`
- Vanilla JS (search, calendar, hours, contact form)
- Custom CSS with CSS variables (no framework)

## Admin / CMS

The site uses [Sveltia CMS](https://github.com/sveltia/sveltia-cms), a Git-based headless CMS.

**Access:** `https://<your-domain>/admin/`

Log in with GitHub credentials. Only users with write access to the `activebridge/tlaq` repository can make changes. All edits are committed directly to `main` and trigger an automatic build.

### Managed Collections

| Collection | Folder | Description |
|------------|--------|-------------|
| Shops | `_shops/` | Retail shop pages |
| Food & Dining | `_foods/` | Dining pages |
| Galleries | `_galleries/` | Art gallery pages |
| Events | `_events/` | Event pages with scheduling |
| Weddings | `_weddings/` | Wedding venue/service pages |
| Landing Sections | `_landing/` | Homepage section content (banner, calendar, what's new, etc.) |
| Pages | `pages/` | Static HTML pages (About, Hours, History, etc.) |

### Settings

- **Homepage** — Navigation structure and site settings (`index.md`)
- **Site Configuration** — Global settings (`_data/site.yml`): app name, description, footer, directions/weather links
- **Default Store Hours** — Weekly hour templates (`_data/store/hours_defaults.yml`)

### Media

Images are uploaded through the CMS to `assets/images/` and referenced automatically.

## Deployment

Hosted on GitHub Pages via the built-in Jekyll deployment.

Push to `main` to trigger an automatic build and deploy.

The site is live at: https://activebridge.github.io/tlaq/
