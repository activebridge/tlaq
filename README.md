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

- Main event cards block on `events/index` (yearly events)
- Monthly calendar (`_includes/calendar.html`)

### Event fields

Common fields:

- `title`, `slug`, `starts_at`, `location`, `subtitle`
- `image` (optional)
- `ends_at`
  - for `single`, `weekly`, `monthly`, `yearly`: optional, used as the end time for the event instance (usually same date as `starts_at`, different time)
  - for `range`: required, because it defines the final day/time of the date span
- `schedule_type` (required): `single`, `range`, `weekly`, `monthly`, `yearly`

Recurrence fields:

- `recurs_until` (required for `weekly` and `monthly`, optional for others)
- `recurrence_weekdays` (required for `weekly` and `monthly`)
  - format: `[mon, thu]`
  - supported values: `sun`, `mon`, `tue`, `wed`, `thu`, `fri`, `sat`

### `schedule_type` behavior

- `single`
  One event instance at `starts_at`.

- `range`
  Creates one card per day from `starts_at` through `ends_at` (inclusive), preserving time-of-day.

- `weekly`
  Repeats on `recurrence_weekdays` every week from `starts_at` until `recurs_until`.

- `monthly`
  Repeats on the **first matching weekday(s)** of each month (based on `recurrence_weekdays`) until `recurs_until`.

- `yearly`
  Repeats on the same month/day/time each year. Weekday fields are ignored for yearly logic.
  `recurs_until` is not required for yearly events.

### Examples

Single-day event:

```yaml
starts_at: '2025-12-14 17:00:00'
ends_at: '2025-12-14 21:00:00'
schedule_type: single
```

Date range event (daily cards generated):

```yaml
starts_at: '2025-11-29 10:00:00'
ends_at: '2025-12-05 17:00:00'
schedule_type: range
```

Weekly recurring event:

```yaml
starts_at: '2025-11-01 11:00:00'
ends_at: '2025-11-01 17:00:00'
recurs_until: '2026-12-31 23:59:59'
recurrence_weekdays: [mon, thu, fri]
schedule_type: weekly
```

Monthly recurring event (first matching weekdays):

```yaml
starts_at: '2025-11-01 11:00:00'
ends_at: '2025-11-01 17:00:00'
recurs_until: '2026-12-31 23:59:59'
recurrence_weekdays: [sat]
schedule_type: monthly
```

Yearly event:

```yaml
starts_at: '2025-11-02 10:00:00'
ends_at: '2025-11-02 16:00:00'
schedule_type: yearly
```

### Calendar implementation

- Source content stays in `_events/*.md` (YAML front matter), not JSON files in the repo.
- `_includes/calendar.html` serializes event front matter into a JSON payload in the page (`calendarEventsData` script tag).
- `assets/js/calendar.js` reads that payload, generates occurrences, sorts by day, and renders cards.
- Calendar output is limited to the current month through 12 months ahead.
- Month filter options are generated in JS from occurrences and default to current month when available.

### Notes for editors

- Use `weekly` for repeat-on-weekdays patterns.
- Use `monthly` only when you want the first matching weekday(s) each month.
- Use `yearly` for same date each year (no weekday setup needed, no `recurs_until` required).
- Keep `recurs_until` filled for `weekly` and `monthly`, or those recurrences will not generate instances.

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
