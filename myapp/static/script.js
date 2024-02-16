document.addEventListener("DOMContentLoaded", function () {
  // ***************** HEADER ANIMATION ***********
  setHeaderBackground();

  // ***************** DROPDOWN ANIMATION ***********
  initializeDropdown("login", "login-trigger", "login-dropdown-container");
  initializeDropdown("register", "register-trigger", "register-dropdown-container");
  initializeDropdown("logout", "logout-trigger", "logout-dropdown-container");
  initializeDropdown("my-services", "my-services-trigger", "my-services-dropdown-container");
  initializeDropdown("recipe", "recipe-trigger", "recipe-dropdown-container");
  initializeDropdown("about", "about-trigger", "about-dropdown-container");

  // TODO: Add similar logic for other dropdown triggers and containers
});

function setHeaderBackground() {
  var currentPage = location.pathname.split("/").slice(-1)[0];
  var fileName = currentPage.replace(/\.html$/, "");
  document.getElementById("header").style.backgroundImage =
    "url('myapp/images/" + fileName + ".png')";
}

function initializeDropdown(name, triggerId, containerId) {
  var trigger = document.getElementById(triggerId);
  var dropdownContainer = document.getElementById(containerId);

  if (!trigger || !dropdownContainer) {
    console.error(`Dropdown initialization failed for ${name}. Trigger or container not found.`);
    return;
  }

  trigger.addEventListener("click", function (event) {
    event.stopPropagation(); // Prevents closing dropdown when trigger is clicked

    dropdownContainer.classList.toggle("show");
  });

  document.addEventListener("click", function (event) {
    if (!event.target.matches(`#${triggerId}`) && dropdownContainer.classList.contains("show")) {
      dropdownContainer.classList.remove("show");
    }
  });

  // Close dropdown on ESC key press
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && dropdownContainer.classList.contains("show")) {
      dropdownContainer.classList.remove("show");
    }
  });
}

function handleLogin() {
  try {
    disableForm();
    showLoginAnimation(document.getElementById("username").value);

    setTimeout(function () {
      redirectToProfile();
    }, 2000);

    return false;
  } catch (error) {
    console.error("An error occurred in handleLogin:", error);
    return false;
  }
}

function showLoginAnimation(username) {
  const loginMessage = document.getElementById("login-message");

  if (!loginMessage) {
    console.error("Login message element not found.");
    return;
  }

  loginMessage.textContent = `${username}, you're logging in...`;
  loginMessage.style.display = "block";

  setTimeout(() => {
    loginMessage.style.display = "none";
  }, 2000);
}

document.querySelectorAll(".card").forEach((card) => {
  const toggleButton = card.querySelector(".toggleButton");

  if (toggleButton) {
    toggleButton.addEventListener("click", () => {
      card.classList.toggle("active");
    });
  }
});

function deleteRecipe(recipe_id) {
  if (confirm("Are you sure you want to delete this recipe?")) {
    window.location.href = "/delete_recipe/" + recipe_id;
  }
}
