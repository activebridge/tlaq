document.addEventListener('DOMContentLoaded', function() {
  var days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  var today = days[new Date().getDay()];
  window.storeHours.querySelectorAll('tr').forEach(function(el) {
    if (el.dataset.day === today) el.classList.add('today');
  });
});
