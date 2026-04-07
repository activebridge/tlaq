document.addEventListener("DOMContentLoaded", () => {
  const input = window.storeSearch;
  if (!input) return;

  const cards = [...window.storeItem];

  input.addEventListener("input", () => {
    const query = input.value.toLowerCase().trim();

    const update = () => {
      cards.forEach((card) => {
        const title = card.querySelector("h3")?.textContent.toLowerCase() ?? "";
        const tags = card.dataset.tags ?? "";
        card.classList.toggle("hidden", !!query && !title.includes(query) && !tags.includes(query));
      });
    };

    document.startViewTransition(update);
  });
});
