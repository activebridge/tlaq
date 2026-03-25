document.addEventListener('DOMContentLoaded', () => {
  // All result rows rendered server-side inside <ul id="searchResults">
  const rows = [...searchResults.querySelectorAll('li')];
  let visible = [];

  // Toggle data-hidden attribute — CSS uses this to show/hide rows with transition
  const setHidden = (el, hide) => hide ? (el.dataset.hidden = '') : delete el.dataset.hidden;

  // Clear input, hide all rows and reset aria state — called on dialog close
  function reset() {
    searchInput.value = '';
    searchInput.setAttribute('aria-expanded', 'false');
    rows.forEach(r => { setHidden(r, true); r.setAttribute('aria-selected', 'false'); });
    delete searchResults.dataset.noResults;
    visible = [];
  }

  function onInput() {
    const q = searchInput.value.trim().toLowerCase();

    // Hide everything and collapse results list for short queries
    if (q.length < 2) {
      rows.forEach(r => setHidden(r, true));
      delete searchResults.dataset.noResults;
      searchInput.setAttribute('aria-expanded', 'false');
      visible = [];
      return;
    }

    // For each group header, show only items whose data-search contains the query,
    // then hide the header itself if no items in its group matched
    rows.filter(r => r.classList.contains('search-result-group-header')).forEach(h => {
      let next = h.nextElementSibling, count = 0;
      while (next && !next.classList.contains('search-result-group-header')) {
        const matches = next.dataset.search?.includes(q);
        setHidden(next, !matches);
        if (matches) count++;
        next = next.nextElementSibling;
      }
      setHidden(h, count === 0);
    });

    // Show "no results" message if nothing matched
    visible = rows.filter(r => r.role === 'option' && !('hidden' in r.dataset));
    visible.length ? delete searchResults.dataset.noResults : (searchResults.dataset.noResults = '');

    searchInput.setAttribute('aria-expanded', 'true');
  }

  searchInput.oninput   = onInput;
  searchInput.onkeydown = e => {
    if (searchInput.getAttribute('aria-expanded') !== 'true') return;

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const cur  = visible.findIndex(r => r.getAttribute('aria-selected') === 'true');
      // Ignore ArrowUp when nothing is selected yet
      if (cur === -1 && e.key === 'ArrowUp') return;
      const next = e.key === 'ArrowDown' ? Math.min(cur + 1, visible.length - 1) : Math.max(cur - 1, 0);
      visible.forEach((r, i) => r.setAttribute('aria-selected', i === next ? 'true' : 'false'));
      // Keep selected item in view
      searchResults.scrollTop = visible[next].offsetTop - searchResults.offsetTop;
    } else if (e.key === 'Enter') {
      visible.find(r => r.getAttribute('aria-selected') === 'true')?.querySelector('a')?.click();
    }
  };

  searchDialog.addEventListener('click', e => { if (e.target === searchDialog) searchDialog.close(); });
  searchDialog.addEventListener('toggle', e => { if (e.newState === 'closed') reset(); });
});
