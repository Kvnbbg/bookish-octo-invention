document.querySelectorAll(".card").forEach((card, index) => {
  const toggleButton = card.querySelector(".toggleButton");
  const hiddenSection = card.querySelector(".hidden");

  toggleButton.addEventListener("click", () => {
      card.classList.toggle("active");
  });
});
