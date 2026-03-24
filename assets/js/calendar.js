document.addEventListener('DOMContentLoaded', function() {
  let ge = (e) => { return document.getElementById(e); }
  const select = ge('calendar-select');
  const container = ge('calendar-items');
  const dataNode = ge('calendar-events-data');
  if (!select || !container || !dataNode) return;

  let parseDateTime = (value) => {
    if (!value) return null;
    const raw = String(value).trim();
    const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?/);
    if (match) {
      const year = Number(match[1]);
      const month = Number(match[2]) - 1;
      const day = Number(match[3]);
      const hour = Number(match[4]);
      const minute = Number(match[5]);
      const second = Number(match[6] || '0');
      return new Date(year, month, day, hour, minute, second);
    }
    return new Date(raw);
  }
  let toMonthKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return year + '-' + month;
  }
  let formatDay = (date) => { return date.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase(); }
  let formatMonthDay = (date) => { const mon = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(); return mon + ' ' + date.getDate(); }
  let formatTime = (date) => {
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const hour24 = date.getHours();
    const hour12 = hour24 % 12 || 12;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    return hour12 + ':' + minutes + ' ' + ampm;
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function normalizeWeekdays(values) {
    if (!Array.isArray(values)) return [];
    return values.map(function(day) { return String(day).toLowerCase().slice(0, 3); });
  }

  function inferScheduleType(event, startDate, endDate) {
    if (event.schedule_type) return event.schedule_type;
    const weekdays = Array.isArray(event.weekdays) && event.weekdays.length ? event.weekdays : event.recurrence_weekdays;
    if (event.recurs_until && Array.isArray(weekdays) && weekdays.length) {
      return 'recurring';
    }
    if (endDate && startDate.toDateString() !== endDate.toDateString()) return 'range';
    return 'single';
  }

  function buildOccurrences(event) {
    const startDate = parseDateTime(event.starts_at);
    if (!startDate) return [];

    const endDate = parseDateTime(event.ends_at) || new Date(startDate.getTime());
    const scheduleType = inferScheduleType(event, startDate, endDate);
    const occurrences = [];

    if (scheduleType === 'recurring') {
      const until = parseDateTime(event.recurs_until);
      const weekdaysSource = Array.isArray(event.weekdays) && event.weekdays.length ? event.weekdays : event.recurrence_weekdays;
      const weekdays = normalizeWeekdays(weekdaysSource);
      if (!until || !weekdays.length) return [];

      const durationMs = Math.max(0, endDate.getTime() - startDate.getTime());
      const occurrenceStart = new Date(startDate.getTime());
      for (let i = 0; i <= 730; i += 1) {
        if (occurrenceStart > until) break;
        const weekday = occurrenceStart.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase().slice(0, 3);
        if (weekdays.includes(weekday)) {
          occurrences.push({
            event: event,
            start: new Date(occurrenceStart.getTime()),
            end: new Date(occurrenceStart.getTime() + durationMs)
          });
        }
        occurrenceStart.setDate(occurrenceStart.getDate() + 1);
      }

      return occurrences;
    }

    if (scheduleType === 'range') {
      const startClockMs = (startDate.getHours() * 60 + startDate.getMinutes()) * 60000;
      const endClockMs = (endDate.getHours() * 60 + endDate.getMinutes()) * 60000;
      let dailyDurationMs = endClockMs - startClockMs;
      if (dailyDurationMs <= 0) dailyDurationMs += 86400000;

      const dayStart = new Date(startDate.getTime());
      for (let d = 0; d <= 730; d += 1) {
        if (dayStart > endDate) break;
        occurrences.push({
          event: event,
          start: new Date(dayStart.getTime()),
          end: new Date(dayStart.getTime() + dailyDurationMs)
        });
        dayStart.setDate(dayStart.getDate() + 1);
      }

      return occurrences;
    }

    occurrences.push({ event: event, start: startDate, end: endDate });
    return occurrences;
  }

  function renderOccurrence(item) {
    const event = item.event;
    const subtitle = event.subtitle ? '<p class="calendar-item-subtitle">' + escapeHtml(event.subtitle) + '</p>' : '';
    return '' +
      '<a href="' + escapeHtml(event.url) + '" class="calendar-item" data-month="' + toMonthKey(item.start) + '">' +
        '<div class="calendar-item-content">' +
          '<div class="calendar-item-image">' +
            '<img src="' + escapeHtml(event.image) + '" alt="' + escapeHtml(event.title) + '">' +
          '</div>' +
          '<div class="calendar-item-details">' +
            '<div class="calendar-item-date">' +
              '<span>' + formatDay(item.start) + '</span>' +
              '<span>,&nbsp;</span>' +
              '<span>' + formatMonthDay(item.start) + '</span>' +
            '</div>' +
            '<h3 class="calendar-item-title">' + escapeHtml(event.title) + '</h3>' +
            subtitle +
            '<div class="calendar-item-time">' + formatTime(item.start) + ' - ' + formatTime(item.end) + '</div>' +
          '</div>' +
        '</div>' +
      '</a>';
  }

  function buildMonths(occurrences) {
    const monthMap = new Map();
    occurrences.forEach(function(item) {
      const key = toMonthKey(item.start);
      if (!monthMap.has(key)) {
        const label = item.start.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase();
        monthMap.set(key, label);
      }
    });
    return Array.from(monthMap.entries()).sort(function(a, b) { return a[0].localeCompare(b[0]); });
  }

  function renderMonthOptions(months) {
    select.innerHTML = months.map(function(entry) {
      return '<option value="' + entry[0] + '">' + escapeHtml(entry[1]) + '</option>';
    }).join('');
  }

  function renderByMonth(allOccurrences, monthKey) {
    const visible = allOccurrences.filter(function(item) {
      return !monthKey || toMonthKey(item.start) === monthKey;
    }).sort(function(a, b) {
      return a.start.getTime() - b.start.getTime();
    });
    container.innerHTML = visible.map(renderOccurrence).join('');
  }

  const sourceEvents = JSON.parse(dataNode.textContent || '[]');
  const allOccurrences = sourceEvents
    .flatMap(buildOccurrences)
    .sort(function(a, b) { return a.start.getTime() - b.start.getTime(); });

  const months = buildMonths(allOccurrences);
  if (!months.length) return;

  renderMonthOptions(months);
  const currentMonth = toMonthKey(new Date());
  const hasCurrentMonth = months.some(function(entry) { return entry[0] === currentMonth; });
  if (hasCurrentMonth) {
    select.value = currentMonth;
  }

  let handleFilter = () => { return renderByMonth(allOccurrences, select.value); }
  select.addEventListener('change', handleFilter);
  window.addEventListener('pageshow', handleFilter);
  handleFilter();
});
