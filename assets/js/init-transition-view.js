// Enable element transitions only when clicking links marked data-link="transition",
// by setting view-transition-name from their URL so browser can morph them into the matching section on the next page.
// Only animate when clicking specific links marked data-link="transition", not on normal page navigation.

window.onload = () => {
  const transition_links = document.querySelectorAll('[data-link="transition"]')

  transition_links.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      const href = e.currentTarget.href;
      const name = href.split('/').filter(word => word !== '').pop();
      link.style.setProperty('view-transition-name', name);
      window.location.href = href;
    });
  });
}
