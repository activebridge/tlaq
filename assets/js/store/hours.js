document.addEventListener('DOMContentLoaded', function() {
  var days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  var today = days[new Date().getDay()];
  var todayHoursEl = document.getElementById('todayHours');
  window.storeHours.querySelectorAll('tr').forEach(function(el) {
    if (el.dataset.day === today) {
      el.classList.add('today');
      if (todayHoursEl) todayHoursEl.textContent = el.dataset.hours;
    }
  });
});
