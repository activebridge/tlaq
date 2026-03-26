document.addEventListener('DOMContentLoaded', function() {
  const select = window.calendarSelect;
  const container = window.calendarItems;
  const dataNode = window.calendarEventsData;
  if (!select || !container || !dataNode) return;

  const toMonthKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return year + '-' + month;
  }
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

  function buildOccurrences(event) {
    const startDate = new Date(event.starts_at);
    const endDate = new Date(event.ends_at) || new Date(startDate.getTime());
    const scheduleType = event.schedule_type;
    const occurrences = [];

    if (scheduleType === 'yearly') {
      // Yearly events: ignore recurs_until/recurrence_weekdays and repeat every year
      // on the same start/end day+time. (We generate two years for the calendar.)
      const durationMs = Math.max(0, endDate.getTime() - startDate.getTime());
      const startYear = startDate.getFullYear();

      for (let y = 0; y <= 1; y += 1) {
        const year = startYear + y;
        const occStart = new Date(startDate.getTime());
        occStart.setFullYear(year);
        occurrences.push({
          event: event,
          start: occStart,
          end: new Date(occStart.getTime() + durationMs)
        });
      }

      return occurrences;
    }

    if (scheduleType === 'weekly') {
      // Weekly events: create occurrences for each week by recurrence_weekdays until recurs_until.
      const until = new Date(event.recurs_until);
      const weekdays = event.recurrence_weekdays;
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

    if (scheduleType === 'monthly') {
      // Monthly events: create occurrences for each month in the first week
      // that matches recurrence_weekdays until recurs_until.
      const until = new Date(event.recurs_until);
      const weekdays = event.recurrence_weekdays;
      if (!until || !weekdays || !weekdays.length) return [];

      const durationMs = Math.max(0, endDate.getTime() - startDate.getTime());
      const yearStart = startDate.getFullYear();
      const monthStart = startDate.getMonth();

      for (let offset = 0; offset <= 24; offset += 1) {
        const monthDate = new Date(yearStart, monthStart + offset, 1);
        if (monthDate > until) break;

        weekdays.forEach((weekdayCode) => {
          const target = String(weekdayCode).toLowerCase().slice(0, 3);
          const first = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
          while (first.getMonth() === monthDate.getMonth()) {
            const weekday = first.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase().slice(0, 3);
            if (weekday === target) {
              const occStart = new Date(first.getTime());
              if (occStart <= until) {
                occurrences.push({
                  event: event,
                  start: occStart,
                  end: new Date(occStart.getTime() + durationMs)
                });
              }
              break;
            }
            first.setDate(first.getDate() + 1);
          }
        });
      }

      return occurrences;
    }

    if (scheduleType === 'range') {
      // Range events: create occurrences for each day in the range.
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
    const subtitle = event.subtitle ? '<p>' + event.subtitle + '</p>' : '';
    return '' +
      '<a href="' + event.url + '" data-month="' + toMonthKey(item.start) + '">' +
        '<div class="calendar-item-content">' +
          '<div class="calendar-item-image">' +
            '<img src="' + event.image + '" alt="' + event.title + '">' +
          '</div>' +
          '<div class="calendar-item-details">' +
            '<div class="calendar-item-date">' +
              '<span>' + formatDay(item.start) + '</span>' +
              '<span>,&nbsp;</span>' +
              '<span>' + formatMonthDay(item.start) + '</span>' +
            '</div>' +
            '<h3>' + event.title + '</h3>' +
            subtitle +
            '<div class="calendar-item-time">' + formatTime(item.start) + ' - ' + formatTime(item.end) + '</div>' +
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
    const visible = allOccurrences.filter((item) => !monthKey || toMonthKey(item.start) === monthKey);
    container.innerHTML = visible.map(renderOccurrence).join('');
  }

  const sourceEvents = JSON.parse(dataNode.textContent || '[]');
  const allOccurrences = sourceEvents
    .flatMap(buildOccurrences)
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
