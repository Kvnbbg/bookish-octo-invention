// ***************** HEADER ANIMATON ***********
/***
 * This script dynamically extracts the file name from the current HTML page, removes the .html extension, 
 * and then constructs the image URL using the myapp/images/ directory. 
 ***/
document.addEventListener("DOMContentLoaded", function() {
// Get the current HTML file name
  var currentPage = location.pathname.split("/").slice(-1)[0];
  // Extract the file name without the extension
  var fileName = currentPage.replace(/\.html$/, "");
  // Set the background image of the header
  document.getElementById("header").style.backgroundImage = "url('myapp/images/" + fileName + ".png')";
});

// ***************** DROP ANIMATON ***********
/***
 * The dropdown is triggered only by the image with the class dropdown-trigger
 ***/
// LOGIN LOGIC
document.addEventListener("DOMContentLoaded", function() {
  var loginTrigger = document.getElementById("login-trigger");
  var loginDropdownContainer = document.getElementById("login-dropdown-container");
  loginTrigger.addEventListener("click", function() {
    loginDropdownContainer.classList.toggle("show");
  });
  // Close the login dropdown if the user clicks outside of it
  window.addEventListener("click", function(event) {
    if (!event.target.matches("#login-trigger")) {
      if (loginDropdownContainer.classList.contains("show")) {
        loginDropdownContainer.classList.remove("show");
      }
    }
  });
  // TODO: Below add similar logic for other triggers and containers
});

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
