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
        const suite = card.dataset.suite ?? "";
        card.classList.toggle("hidden", !!query && !title.includes(query) && !tags.includes(query) && !suite.includes(query));
      });
    };

    document.startViewTransition(update);
  });
});
