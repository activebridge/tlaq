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
  Repeats weekly from `starts_at` until `recurs_until` on the first day in `recurrence_weekdays`. If multiple weekdays are provided, they are used as display text only (for example, `SUNDAY - TUESDAY`).

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

### Managing Store Map Pins

Each shop, gallery, and food entry can appear as a pin on the interactive village map. There are two ways to place a pin:

**Option A — Suite number (recommended)**

Set the **Suite** field to the store's suite code, e.g. `a208`. The pin will automatically appear at the center of that building on the map. You do not need to fill in Coordinates.

- If you don't know the suite code, check the building label on the village map or ask a manager.
- Suite codes are case-sensitive lowercase letters followed by numbers: `a101`, `b3`, `e205`, etc.

**Option B — Manual coordinates**

Leave Suite empty and fill in the **Coordinates** field in the format `-111.76260, 34.86350` (longitude, latitude). Use Google Maps to find the exact coordinates: right-click a point on the map and copy the coordinates shown.

**If both are filled in**, Suite takes priority and coordinates are ignored for pin placement.

**If neither is filled in**, the store will not appear on the map.

**Two stores in the same suite**

If two stores share the same suite (e.g. both set `a208`), their pins will be placed slightly apart so both are visible and clickable.

**Changes go live** after saving in the admin panel — the site rebuilds automatically within a minute or two.

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

---

## Site Handover / Migration Guide

When transferring site management to a new person, the following third-party accounts and credentials must be replaced. No secrets are stored in this repository — all values are either hardcoded in source files or configured in `_data/site.yml`.

---

### 1. Mapbox

**What it does:** Powers the interactive village map with store pins.

**Values to replace:**

| Value | Location |
|-------|----------|
| `mapbox_token` | `_data/site.yml` (also editable via CMS → Settings → Site Configuration) |
| `mapbox_style` | `_data/site.yml` (also editable via CMS → Settings → Site Configuration) |

**Steps:**
1. Create account at [mapbox.com](https://mapbox.com)
2. Create a new public token — required scopes: `styles:read`, `tiles:read`
3. In Mapbox Studio, duplicate the existing map style (request share link from current owner) or create a new one
4. Update `mapbox_token` and `mapbox_style` in `_data/site.yml` or via the CMS
5. Revoke the old token in the original Mapbox account

---

### 2. Cloudflare

**What it does:** CDN image optimization (via `tlaq.ab.team`) and three serverless Workers.

#### 2a. CDN / Image Optimization

Images are transformed via Cloudflare's `/cdn-cgi/image/...` URLs served from `tlaq.ab.team`.

| Value | Location |
|-------|----------|
| `cdn_url` | `_config.yml` |

**Steps:**
1. Add the domain to a new Cloudflare account
2. Enable Cloudflare Image Resizing (available on Pro plan or higher)
3. Update `cdn_url` in `_config.yml` to the new domain

#### 2b. Cloudflare Workers

Three Workers are referenced in `_data/site.yml`:

| Key | Current URL | Purpose |
|-----|------------|---------|
| `submission_worker_url` | `https://sweet-salad-9b35.alexsstorchak.workers.dev` | Call-for-submission photo uploads |
| `newsletter_worker_url` | `https://tlaq-contacts.pwt.workers.dev/` | Email newsletter subscriptions |
| `weather_widget_url` | `https://weather.pwt.workers.dev/widget.svg` | Weather widget SVG |

> **Note:** Worker source code is **not** in this repository. Request it from the current developer before proceeding.

**Steps:**
1. Create a Cloudflare account and set up Workers
2. Deploy each Worker from source
3. Update all three URLs in `_data/site.yml`

---

### 3. SendGrid

**What it does:** Sends newsletter subscription confirmation emails. Used inside the `tlaq-contacts` Cloudflare Worker — not referenced directly in this repo.

**Steps:**
1. Create account at [sendgrid.com](https://sendgrid.com)
2. Verify your sender domain
3. Generate an API key with `Mail Send` permission
4. Add the key to the new newsletter Worker's environment variables in the Cloudflare dashboard

---

### 4. Flipsnack

**What it does:** Embeds the digital magazine viewer on the homepage and in the footer.

**Values to replace:**

| Value | Location |
|-------|----------|
| Embed hash in iframe `src` | `_includes/footer.html` (search for `flipsnack.com`) |
| Embed hash in iframe `src` | `_includes/landing/magazine.html` |

**Steps:**
1. Log in to [flipsnack.com](https://flipsnack.com) — the current account holds the publication
2. **Preferred:** Transfer the Flipsnack account directly to the new owner
3. **Alternative:** Re-upload the magazine PDF to a new account, get the new embed hash from the Flipsnack embed dialog, and replace the hash value in both files above

---

### 5. GitHub Repository & CMS Access

**What it does:** Hosts source code and serves as the CMS backend (Sveltia CMS authenticates via GitHub write access).

**Current repo:** `activebridge/tlaq` — configured in `admin/config.yml`

**Steps:**
1. Transfer the repository: GitHub repo → **Settings → Transfer**
2. Update the `repo` field in `admin/config.yml` to match the new `owner/repo` path
3. Ensure the new owner has **write access** to the repo (required for CMS login at `/admin/`)
4. Update GitHub Pages settings if a custom domain is in use

---

### 6. External Media (cdn-website.com)

**What it does:** Hosts wedding brochure PDFs and video files referenced by the site.

**Account ID in URLs:** `164890e9`

**Files referencing these URLs:**
- `_data/weddings.yml` — brochure PDFs and wedding videos
- `_data/magazines.yml` — magazine issue files

**Steps:**
1. Request access to the cdn-website.com account from the current owner
2. **Or:** Download all files and re-host elsewhere (Cloudflare R2 is a good fit since Cloudflare is already in use)
3. If re-hosting, update all matching URLs in `_data/weddings.yml` and `_data/magazines.yml`

---

### Handover Checklist

| Service | Files to Update | Action Required |
|---------|----------------|-----------------|
| Mapbox | `_config.yml` (`mapbox_token`, `mapbox_style`) | New account → new token + new style URL |
| Cloudflare CDN | `_config.yml` (`cdn_url`) | Transfer domain or recreate Cloudflare zone |
| Cloudflare Workers (×3) | `_data/site.yml` | Redeploy workers from source, update 3 URLs |
| SendGrid | Inside Cloudflare Worker env vars | New API key |
| Flipsnack | `_includes/footer.html`, `_includes/landing/magazine.html` | Transfer account or replace embed hash |
| GitHub repo | `admin/config.yml` (`repo`) | Transfer repo + grant write access |
| cdn-website.com | `_data/weddings.yml`, `_data/magazines.yml` | Transfer account or re-host all files |
