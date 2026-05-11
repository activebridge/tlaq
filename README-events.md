# Events Admin Manual

Step-by-step guide for adding and editing events on the Tlaquepaque website through the Sveltia CMS admin. No coding required.

---

## 1. Fields That Apply to Every Event

These fields appear on every event, no matter the type.

| Field | Required? | What to enter |
|---|---|---|
| **Title** | Yes | The event name shown on the calendar card and detail page. For recurring annual events with shifting dates created as separate entries each year, include the year (e.g. *"Day of the Dead 2027"*). |
| **Slug** | Yes | The URL-friendly identifier. Lowercase letters and hyphens only (e.g. `cinco-de-mayo`). **There is no automatic validation** — type it carefully. **Do not change the slug after the event is published — it breaks the public URL and any external links to it.** |
| **Published** | Yes | Toggle ON to show the event. Toggle OFF to hide it without deleting. Default is ON. |
| **Starts At** | Yes | The date and time the event begins. For recurring events (weekly/monthly), this is the **first occurrence** — the recurrence runs forward from this date. |
| **Ends At** | Optional* | Same date as Starts At with a later end time. *Required when **Schedule Type = Range** — it defines the last day of the multi-day span. |
| **Location** | Yes | Where the event happens (e.g. *"Tlaquepaque Village"*, *"Patio De Las Campanas"*). |
| **Image** | Optional | Hero photo shown on the card and at the top of the detail page. JPG, PNG, or WebP. **Filename must NOT start with an underscore (`_`)** — Jekyll treats underscore-prefixed files as special and will not publish them. |
| **Video URL** | Optional | If filled in, the event detail page tries to play a looping background video instead of (or behind) the hero image. See section 4d. |
| **Intro (Subtitle)** | Yes | 1–2 sentence teaser shown under the title on the calendar card and detail page. Plain text, no HTML. |
| **Schedule Type** | Yes | One of: **single**, **range**, **weekly**, **monthly**, **yearly**. Determines how the event repeats. See section 3. |
| **Annual Event** | Optional | Toggle that places the event in the **Annual Events** section on the `/events/` page. Use for events that happen once a year on a date that **shifts** each year. Default is OFF. See section 3f. |
| **Recurrence Until** | Conditional | **Required for weekly and monthly** schedule types. The last date on which the event is allowed to occur. Leave empty for single/range/yearly. |
| **Recurrence Weekdays** | Conditional | **Required for weekly and monthly** (at least one weekday). Pick from Sun–Sat. Leave empty for single/range/yearly. **Important quirk:** weekly events use ONLY the **first** selected weekday; monthly events use **every** selected weekday. |
| **Description** | Yes | The full event write-up shown on the detail page. Markdown is supported via the toolbar — bold, italic, headings, lists, links. |

### Optional contact fields

Add any that apply — they show as buttons or links on the detail page.

- **Phone** — free format, e.g. `928-862-4140`
- **Website** — must start with `https://`
- **Email** — shown as a clickable mailto link
- **Facebook** — full URL, e.g. `https://www.facebook.com/tlaqsedona/`
- **Instagram** — full URL, e.g. `https://www.instagram.com/tlaqsedona/`

---

## 2. Walkthroughs by Schedule Type

There are **five Schedule Types** plus one extra **Annual** toggle. Pick the type that matches how the event repeats (or doesn't).

### 2a. Single — one-time event

**Use when:** the event happens on **one specific day** only.

**Required fields:** Title, Slug, Starts At, Location, Intro, Description, Schedule Type = **single**.
**Leave empty:** Recurrence Until, Recurrence Weekdays.

**Steps:**
1. Click **+ Create New** in the Events collection.
2. Fill in **Title**, **Slug**, **Intro**, **Location**, **Image**.
3. Set **Starts At** — pick the date and start time.
4. Set **Ends At** — same date, end time (optional but recommended; if omitted only the start time shows).
5. **Schedule Type** → choose **single**.
6. Write the **Description**.
7. Make sure **Published** is ON.
8. Click **Save**.

**Real example:** a one-night concert on May 15 from 7:00 PM to 10:00 PM.

---

### 2b. Range — multi-day event

**Use when:** the event runs **across several consecutive days**, with similar daily hours.

**Required fields:** Title, Slug, Starts At, **Ends At (required)**, Location, Intro, Description, Schedule Type = **range**.
**Leave empty:** Recurrence Until, Recurrence Weekdays.

**Steps:**
1. **+ Create New**.
2. Fill basics (Title, Slug, Intro, Location, Image).
3. **Starts At** → first day's date and **daily start time**.
4. **Ends At** → **last day's** date and the **daily end time**. *Ends At must be a later day than Starts At — otherwise it's not a range, use Single.*
5. **Schedule Type** → **range**.
6. Description, Save.

The site emits one calendar card per day in the span; each card shows the same daily start–end times taken from Starts At / Ends At.

**Real example:** *Dance Into Beauty*, May 9 → May 10, performances daily 1 PM & 3 PM. See [`_events/dance-into-beauty.md`](_events/dance-into-beauty.md).

---

### 2c. Weekly — repeats every week

**Use when:** the event happens on **the same weekday every week** for a stretch of time.

**Required fields:** Title, Slug, Starts At, **Recurrence Until**, **Recurrence Weekdays (exactly one used)**, Location, Intro, Description, Schedule Type = **weekly**.

**Steps:**
1. **+ Create New**.
2. Fill basics.
3. **Starts At** → date and time of the **first** occurrence.
4. **Ends At** → same date as Starts At, end time.
5. **Schedule Type** → **weekly**.
6. **Recurrence Until** → the last date on which the event can occur. The repeats stop after this date.
7. **Recurrence Weekdays** → pick the weekday. **Quirk: weekly events use only the FIRST selected weekday**, even if you tick more. To repeat on multiple weekdays per week, create **separate weekly events** — one per weekday.
8. Save.

**Real example:** *Tequila Thursdays*, every Thursday, starts March 26 2026, recurs until March 26 2027. See [`_events/tequila-thursdays.md`](_events/tequila-thursdays.md).

---

### 2d. Monthly — first weekday of each month

**Use when:** the event happens on the **first specific weekday of every month** (e.g. *First Friday*, *First Sunday*). You can pick more than one weekday — the system emits the **first occurrence of each selected weekday in every month**.

**Required fields:** Title, Slug, Starts At, **Recurrence Until**, **Recurrence Weekdays (at least one)**, Location, Intro, Description, Schedule Type = **monthly**.

**Steps:**
1. **+ Create New**.
2. Fill basics.
3. **Starts At** → first occurrence date and time.
4. **Ends At** → same date, end time.
5. **Schedule Type** → **monthly**.
6. **Recurrence Until** → last allowed date.
7. **Recurrence Weekdays** → pick one or more weekdays. For each weekday picked, the calendar shows ONE occurrence per month (the first time that weekday appears in that month).
8. Save.

**Real example:** *First Friday in Galleries*, first Friday of every month. See [`_events/first-friday-in-the-galleries.md`](_events/first-friday-in-the-galleries.md).

---

### 2e. Yearly — fixed annual date

**Use when:** the event happens on the **same calendar date every year** (date never changes). Example: a tree lighting always on December 4.

**Required fields:** Title, Slug, Starts At, Location, Intro, Description, Schedule Type = **yearly**.
**Ends At:** optional. If set, the detail page shows the date range (handy for multi-day annual events that always span the same dates).
**Leave empty:** Recurrence Until, Recurrence Weekdays.

**Steps:**
1. **+ Create New**.
2. Fill basics.
3. **Starts At** → the date (the year you enter is the first year of occurrences — the system shows it every year after that as well).
4. **Ends At** → end time on the same date, or a later date if it spans multiple days each year.
5. **Schedule Type** → **yearly**.
6. Save.

Yearly events automatically appear in the **Annual Events** section on the `/events/` page.

**Real example:** *Tree Lighting*, December every year. See [`_events/tree_lighting.md`](_events/tree_lighting.md).

---

### 2f. Annual toggle — shifting yearly date

**Use when:** the event happens **once per year but the date moves** each year (e.g. tied to a holiday or moon phase that shifts).

**How to set up:**
1. **Schedule Type** → **single** (this is the recommended pairing).
2. Turn the **Annual Event** toggle **ON**.
3. **Starts At** / **Ends At** → this year's actual date and time.
4. **Slug** → include the year, e.g. `day-of-the-dead-2027`.
5. **Title** → include the year too, e.g. *"Day of the Dead 2027"*.

Each year, either:
- update the date on the existing entry and change the year in the title, OR
- create a **new entry** with the new year in the title and slug (and unpublish the old one, or leave it as an archive).

The Annual toggle works with any schedule_type, but **single + Annual ON** is the intended pattern. Events with Annual ON also appear in the Annual Events section on `/events/`.

**Real example:** *Day of the Dead* — Schedule Type single, Annual ON, date updated each year. See [`_events/day-of-the-dead.md`](_events/day-of-the-dead.md).

---

## 3. Advanced Fields (optional)

### 3a. Schedule — multi-location performances

**Use when:** a festival or multi-stage event has **performances at several locations**.

**How to fill in:**
1. Scroll to the **Schedule** section in the editor.
2. Click **+ Add** to add a location entry.
3. **Location** → name of the stage / venue (e.g. *Main Stage*, *Patio del Norte*, *Chapel*).
4. Under that location, click **+ Add** in **Performances** to add a performer.
5. **Name** → performer or act name.
6. **Time** → free-form time, e.g. `1:00 P.M. and 3:00 P.M.` or `11:30 A.M. to 2:30 P.M.`
7. Repeat for each act, then repeat for each location.

The detail page renders each location as a heading with its performances listed underneath, separated by horizontal rules.

> **Where it renders:** the multi-location Schedule block renders on the event detail page for Yearly events and events with Annual ON. For Single/Range/Weekly/Monthly events the block is saved but not displayed.

**Real example (Day of the Dead):**
- *Tlaquepaque North* → Ballet Folklorico De Colores, 1:00 P.M. and 3:00 P.M.
- *Chapel* → Patrick Ki, 11:30 A.M. to 2:30 P.M.

---

### 3b. Display Dates Override — custom date label per month

**Use when:** you want to **replace the auto-generated date row** with your own wording on the calendar card and detail page. Useful for irregular schedules or to phrase a weekly recurrence more naturally.

**How it behaves:**

| Where | Behavior |
|---|---|
| **Calendar** | For every month that has a matching override entry, only **ONE card** is shown for this event in that month, with your custom text in place of the date row. The weekly date-range hint is hidden for that month. Months without an entry keep the default rendering. |
| **Detail page** | The date row shows ALL override entries joined with ` · ` in uppercase. The time row is hidden. |

**How to fill in:**
1. Scroll to **Display Dates Override** in the editor.
2. Click **+ Add**.
3. **Month** → pick a three-letter code: `jan`, `feb`, `mar`, `apr`, `may`, `jun`, `jul`, `aug`, `sep`, `oct`, `nov`, `dec`.
4. **Text** → free text, e.g. `Every Thursday`, `May 2, May 9, May 16`.
5. Add one entry per month as needed. **At most one entry per month** — duplicates are ignored, only the first one wins.

**Real example (Tequila Thursdays):**
- month: `may` → text: `Every Thursday`

---

### 3c. Map — call-to-action block on the detail page

**Use when:** you want a **button on the event page** that links to a map, parking guide, or downloadable PDF.

**Fields in the admin form:**
1. **Title** → heading above the button (e.g. *Altar Map*, *Parking & Directions*).
2. **Description** → short paragraph explaining what the button does.
3. **Button Label** → the button text (capitals work well, e.g. *DOWNLOAD THE ALTAR MAP*, *VIEW MAP*).

> **⚠ Two important limitations** (until a developer addresses them):
>
> 1. **The URL field is missing from the Sveltia admin form.** You can fill in Title, Description, and Button Label, but the button needs a `url:` line added directly to the event's markdown file by a developer. Ask a developer to add `url: https://...` under the Map block in the event's frontmatter.
> 2. **The Map block only renders on Yearly events or events with Annual ON.** If you add a Map to a Single, Range, Weekly, or Monthly event, the fields will save but the block won't show on the public detail page.

**Real example (Day of the Dead):**
- Title: *Altar Map*
- Description: *Use this map to learn about the symbolism…*
- Button Label: *DOWNLOAD THE ALTAR MAP*
- URL (added by developer in frontmatter): `https://discover.tlaq.com/day-of-the-dead-altar-map/full-view.html`

---

### 3d. Video URL — looping hero video on the detail page

**Use when:** you want a **looping video** at the top of the detail page instead of (or behind) the still image.

**How to fill in:**
1. Upload your video to a CDN / video host and copy the full URL ending in `.mp4` (e.g. `https://vid.cdn-website.com/…mp4`).
2. Paste the URL into the **Video URL** field.
3. **Still set the Image field.** The image is used as the poster/fallback while the video loads, and is shown if the browser fails to play the video.
4. Save.

**Where it works:** Video URL is rendered on **every event type** — Single, Range, Weekly, Monthly, and Yearly. (The Sveltia field hint mentions yearly events, but the code path actually applies it to all events.)

If Video URL is empty, the image is used as the hero.

---

## 4. Cheatsheet — Required Fields by Schedule Type

| Schedule Type | Starts At | Ends At | Recurrence Until | Recurrence Weekdays | Annual toggle |
|---|---|---|---|---|---|
| **single** | ✅ | optional | — | — | optional |
| **range** | ✅ | ✅ **required** | — | — | — |
| **weekly** | ✅ | optional | ✅ **required** | ✅ **at least one (only first is used)** | — |
| **monthly** | ✅ | optional | ✅ **required** | ✅ **at least one (all are used)** | — |
| **yearly** | ✅ | optional | — | — | optional |
| **single + Annual ON** | ✅ (this year's date) | optional | — | — | ✅ ON |

---

## 5. Common Mistakes & Troubleshooting

- **Slug changed after publishing** → breaks the public URL and any external links. Pick the slug carefully the first time and leave it alone.
- **Weekly/Monthly with no Recurrence Until or no Recurrence Weekdays** → the event won't appear on the calendar at all. Both fields are required.
- **Weekly with multiple weekdays selected** → only the **first** weekday is used. To run on multiple weekdays per week, create **separate weekly events** — one per weekday.
- **Range event with Ends At on the same day as Starts At** → not a range. Use Single instead.
- **Image filename starts with `_`** → Jekyll treats it as a special file and it won't publish. Rename the file before uploading.
- **Website URL without `https://`** → link breaks. Always include the full URL.
- **Display Dates → two entries for the same month** → the second one is ignored. Only one entry per month wins.
- **Map block added to a non-yearly/non-annual event** → won't appear on the page. Map renders only on Yearly events or events with Annual ON.
- **Map button has no link** → the `url:` line must be added to the event's frontmatter by a developer (the admin form doesn't expose this field yet).
- **Event not showing on the site** → check that **Published** is ON, then wait 1–2 minutes for the rebuild. If still missing, double-check Schedule Type required fields against the cheatsheet in section 4.

---

## 6. Saving and Publishing

1. Click **Save** at the top right of the admin form.
2. Wait **1–2 minutes** for the site to rebuild automatically.
