
// Fake login logic
function handleLogin() {
  // Disable the form to prevent multiple submissions
  disableForm();

  // Show login animation
  showLoginAnimation(document.getElementById("username").value);

  // Simulate a delay before redirecting (replace with actual logic)
  setTimeout(function () {
    redirectToProfile();
  }, 2000);

  // Prevent the form from submitting (we handle the redirection manually)
  return false;
}

function showLoginAnimation(username) {
  const loginMessage = document.getElementById("login-message");
  loginMessage.textContent = `${username}, you're logging in...`;
  loginMessage.style.display = "block";

  setTimeout(() => {
    loginMessage.style.display = "none";
  }, 2000); // Hide the message after 2 seconds
}

// card toggle
document.querySelectorAll(".card").forEach((card) => {
  const toggleButton = card.querySelector(".toggleButton");

  if (toggleButton) {
    toggleButton.addEventListener("click", () => {
      card.classList.toggle("active");
    });
  }
});

// Delete recipe
function deleteRecipe(recipe_id) {
  if (confirm("Are you sure you want to delete this recipe?")) {
    window.location.href = "/delete_recipe/" + recipe_id;
  }
}
