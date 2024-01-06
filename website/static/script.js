document.querySelectorAll(".card").forEach((card) => {
  const toggleButton = card.querySelector(".toggleButton");

  if (toggleButton) {
    toggleButton.addEventListener("click", () => {
      card.classList.toggle("active");
    });
  }
});

function deleteRecipe(recipe_id) {
  if (confirm('Are you sure you want to delete this recipe?')) {
      window.location.href = '/delete_recipe/' + recipe_id;
  }
}
