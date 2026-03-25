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

## Events Management

Events live in `_events/` (Markdown + YAML front matter), and are shown in:

- Annual cards block on `events/index`
- Monthly calendar (`_includes/calendar.html`)

### Event fields

Required/common fields:

- `title`, `slug`, `starts_at`, `location`, `image`, `subtitle`
- `annual` (`true`/`false`)
  - `true` = **annual event** (repeats every year on the same date/time)
    - shown in annual cards block on `events/index`
    - calendar treats it as yearly and **ignores** `schedule_type`, `recurs_until`, and weekday fields (if someone sets them by mistake)
  - `false` = normal event (calendar uses `schedule_type`)
- `schedule_type` (`single`, `range`, `recurring`)

Optional fields by schedule:

- `single`: optional `ends_at` (same-day time range)
- `range`: required `ends_at` (inclusive date range, rendered daily)
- `recurring`: required `recurs_until` + `weekdays`
  - `weekdays` format: `[mon, thu]`
  - supported day values: `sun`, `mon`, `tue`, `wed`, `thu`, `fri`, `sat`

### Examples

Single-day event:

```yaml
starts_at: '2025-12-14 17:00:00'
ends_at: '2025-12-14 21:00:00'
annual: false
schedule_type: single
```

Date range event (daily cards generated):

```yaml
starts_at: '2025-11-29 10:00:00'
ends_at: '2025-12-05 17:00:00'
annual: false
schedule_type: range
```

Recurring weekly event:

```yaml
starts_at: '2025-11-01 11:00:00'
ends_at: '2025-11-01 17:00:00'
recurs_until: '2026-12-31 23:59:59'
weekdays: [mon, thu, fri]
annual: true
schedule_type: recurring
```

### Calendar implementation

- Source content stays in `_events/*.md` (YAML front matter), not JSON files.
- `_includes/calendar.html` outputs a JSON payload into the page (`calendar-events-data` script tag).
- `assets/js/calendar.js` reads that payload, generates occurrences, sorts by day, and renders cards.
- Month filter options are generated in JS from occurrences and default to current month when available.

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
