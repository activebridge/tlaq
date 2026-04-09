document.addEventListener('DOMContentLoaded', function() {
  const select = window.calendarSelect;
  const container = window.calendarItems;
  const dataNode = window.calendarEventsData;
  if (!select || !container || !dataNode) return;
  const limit = parseInt(container.dataset.limit, 10) || 0;
  const DAY_NAMES = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const WEEKDAY_INDEX = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };
  const MAX_DAYS = 730;
  const MAX_MONTHS = 24;
  const getVisibleRange = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 13, 1);
    return { start: start, end: end };
  };
  const VISIBLE_RANGE = getVisibleRange();

  const toMonthKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return year + '-' + month;
  };
  const sanitizeTransitionToken = (value) => String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const getEventSlug = (event) => {
    const path = String(event.url || '').split('?')[0];
    const parts = path.split('/').filter(Boolean);
    const slug = parts.length ? parts[parts.length - 1] : '';
    return sanitizeTransitionToken(slug || event.title || 'event');
  };
  const buildTransitionBase = (event, startDate) => {
    const eventToken = getEventSlug(event);
    return eventToken + '-' + startDate.getTime();
  };
  const appendTransitionParam = (url, transitionBase) => {
    const separator = url.includes('?') ? '&' : '?';
    return url + separator + 'vt=' + encodeURIComponent(transitionBase);
  };
  const formatDay = (date) => date.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  const formatMonthDay = (date) => {
    const mon = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    return mon + ' ' + date.getDate();
  };
  const formatTime = (date) => {
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const hour24 = date.getHours();
    const hour12 = hour24 % 12 || 12;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    return hour12 + ':' + minutes + ' ' + ampm;
  };
  const getDurationMs = (startDate, endDate) => Math.max(0, endDate.getTime() - startDate.getTime());
  const createOccurrence = (event, start, durationMs) => ({
    event: event,
    start: start,
    end: new Date(start.getTime() + durationMs)
  });
  const getWeekdayCode = (date) => DAY_NAMES[date.getDay()];

  function buildYearlyOccurrences(event, startDate, endDate) {
    const occurrences = [];
    const durationMs = getDurationMs(startDate, endDate);
    const startYear = startDate.getFullYear();
    const firstVisibleYear = Math.max(startYear, VISIBLE_RANGE.start.getFullYear());
    const lastVisibleYear = VISIBLE_RANGE.end.getFullYear();

    for (let y = firstVisibleYear; y <= lastVisibleYear; y += 1) {
      const occStart = new Date(startDate.getTime());
      occStart.setFullYear(y);
      occurrences.push(createOccurrence(event, occStart, durationMs));
    }

    return occurrences;
  }

  function buildWeeklyOccurrences(event, startDate, endDate) {
    const until = new Date(event.recurs_until);
    const weekdays = event.recurrence_weekdays;
    if (!until || !weekdays || !weekdays.length) return [];

    const occurrences = [];
    const durationMs = getDurationMs(startDate, endDate);
    const occurrenceStart = new Date(startDate.getTime());

    for (let i = 0; i <= MAX_DAYS; i += 1) {
      if (occurrenceStart > until) break;
      if (weekdays.includes(getWeekdayCode(occurrenceStart))) {
        occurrences.push(createOccurrence(event, new Date(occurrenceStart.getTime()), durationMs));
      }
      occurrenceStart.setDate(occurrenceStart.getDate() + 1);
    }

    return occurrences;
  }

  function buildMonthlyOccurrences(event, startDate, endDate) {
    const until = new Date(event.recurs_until);
    const weekdays = event.recurrence_weekdays;
    if (!until || !weekdays || !weekdays.length) return [];

    const occurrences = [];
    const durationMs = getDurationMs(startDate, endDate);
    const yearStart = startDate.getFullYear();
    const monthStart = startDate.getMonth();

    for (let offset = 0; offset <= MAX_MONTHS; offset += 1) {
      const monthDate = new Date(yearStart, monthStart + offset, 1);
      if (monthDate > until) break;

      const firstDay = monthDate.getDay();
      weekdays.forEach((weekdayCode) => {
        const target = WEEKDAY_INDEX[String(weekdayCode).toLowerCase().slice(0, 3)];
        if (target === undefined) return;

        const dayOffset = (target - firstDay + 7) % 7;
        const occStart = new Date(monthDate.getTime());
        occStart.setDate(1 + dayOffset);
        occStart.setHours(
          startDate.getHours(),
          startDate.getMinutes(),
          startDate.getSeconds()
        );

        if (occStart <= until) {
          occurrences.push(createOccurrence(event, occStart, durationMs));
        }
      });
    }

    return occurrences;
  }

  function buildRangeOccurrences(event, startDate, endDate) {
    const occurrences = [];
    const startClockMs = (startDate.getHours() * 60 + startDate.getMinutes()) * 60000;
    const endClockMs = (endDate.getHours() * 60 + endDate.getMinutes()) * 60000;
    let dailyDurationMs = endClockMs - startClockMs;
    if (dailyDurationMs <= 0) dailyDurationMs += 86400000;

    const dayStart = new Date(startDate.getTime());
    for (let d = 0; d <= MAX_DAYS; d += 1) {
      if (dayStart > endDate) break;
      occurrences.push(createOccurrence(event, new Date(dayStart.getTime()), dailyDurationMs));
      dayStart.setDate(dayStart.getDate() + 1);
    }

    return occurrences;
  }

  function buildOccurrences(event) {
    const startDate = new Date(event.starts_at);
    const endDate = event.ends_at ? new Date(event.ends_at) : new Date(startDate.getTime());
    const scheduleType = event.schedule_type;
    if (scheduleType === 'yearly') return buildYearlyOccurrences(event, startDate, endDate);
    if (scheduleType === 'weekly') return buildWeeklyOccurrences(event, startDate, endDate);
    if (scheduleType === 'monthly') return buildMonthlyOccurrences(event, startDate, endDate);
    if (scheduleType === 'range') return buildRangeOccurrences(event, startDate, endDate);
    return [{ event: event, start: startDate, end: endDate }];
  }

  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  function renderOccurrence(item) {
    const image = isMobile ? item.event.mobile_image : item.event.image;
    const event = item.event;
    const transitionBase = buildTransitionBase(event, item.start);
    const href = appendTransitionParam(event.url, transitionBase);
    const subtitle = event.subtitle ? '<p>' + event.subtitle + '</p>' : '';
    const timeText = event.ends_at
      ? formatTime(item.start) + ' - ' + formatTime(item.end)
      : formatTime(item.start);
    return '' +
      '<a href="' + href + '" data-month="' + toMonthKey(item.start) + '">' +
        '<div class="calendar-item-content">' +
          '<div class="calendar-item-image">' +
            '<img src="' + image + '" alt="' + event.title + '" data-event-image style="view-transition-name: ' + transitionBase + '-image;">' +
          '</div>' +
          '<div class="calendar-item-details">' +
            '<div class="calendar-item-date">' +
              '<span>' + formatDay(item.start) + '</span>' +
              '<span>,&nbsp;</span>' +
              '<span>' + formatMonthDay(item.start) + '</span>' +
            '</div>' +
            '<h3 data-event-title style="view-transition-name: ' + transitionBase + '-title;">' + event.title + '</h3>' +
            subtitle +
            '<div class="calendar-item-time">' + timeText + '</div>' +
          '</div>' +
        '</div>' +
      '</a>';
  }

  function buildMonths(occurrences) {
    const monthMap = new Map();
    occurrences.forEach((item) => {
      const key = toMonthKey(item.start);
      if (!monthMap.has(key)) {
        const label = item.start.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase();
        monthMap.set(key, label);
      }
    });
    return Array.from(monthMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }

  function renderMonthOptions(months) {
    select.innerHTML = months
      .map(([value, label]) => '<option value="' + value + '">' + label + '</option>')
      .join('');
  }

  function renderByMonth(allOccurrences, monthKey) {
    let visible = allOccurrences.filter((item) => !monthKey || toMonthKey(item.start) === monthKey);
    if (limit) visible = visible.slice(0, limit);
    container.innerHTML = visible.map(renderOccurrence).join('');
  }

  const sourceEvents = JSON.parse(dataNode.textContent || '[]');
  const allOccurrences = sourceEvents
    .flatMap(buildOccurrences)
    .filter((item) => (
      item.start >= VISIBLE_RANGE.start &&
      item.start < VISIBLE_RANGE.end
    ))
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  const months = buildMonths(allOccurrences);
  if (!months.length) return;

  renderMonthOptions(months);
  const currentMonth = toMonthKey(new Date());
  const hasCurrentMonth = months.some((entry) => entry[0] === currentMonth);
  if (hasCurrentMonth) {
    select.value = currentMonth;
  }

  const handleFilter = () => renderByMonth(allOccurrences, select.value);
  select.addEventListener('change', handleFilter);
  handleFilter();
});
