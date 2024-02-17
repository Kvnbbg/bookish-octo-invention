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

// *********** CONTACT.HTML ***************
// Disabling form submissions if there are invalid fields
(function () {
  'use strict';
  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll('.needs-validation');

  // Loop over them and prevent submission
  Array.from(forms).forEach(function (form) {
    form.addEventListener('submit', function (event) {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });
})();