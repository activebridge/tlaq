document.addEventListener('DOMContentLoaded', function() {
  var days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  var today = days[new Date().getDay()];
  var todayHoursEl = document.getElementById('todayHours');
  window.storeHours.querySelectorAll('[data-day], [data-days]').forEach(function(el) {
    var match = el.dataset.day === today ||
      (el.dataset.days && el.dataset.days.split(' ').indexOf(today) !== -1);
    if (match) {
      el.classList.add('today');
      if (todayHoursEl) todayHoursEl.textContent = el.dataset.hours;
    }
  });
});
