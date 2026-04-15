document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("storeSearch");
  if (!input) return;

  const cards = [...document.querySelectorAll('[data="store-item"]')];

  input.addEventListener("input", () => {
    const query = input.value.toLowerCase().trim();

    const update = () => {
      cards.forEach((card) => {
        const title = card.dataset.title ?? "";
        const tags = card.dataset.tags ?? "";
        const suite = card.dataset.suite ?? "";
        card.classList.toggle("hidden", !!query && !title.includes(query) && !tags.includes(query) && !suite.includes(query));
      });
    };

    if (document.startViewTransition) {
      document.startViewTransition(update);
    } else {
      update();
    }
  });
});
