document.addEventListener('DOMContentLoaded', function () {
  const amountInput = document.getElementById('amount');
  const sendButton = document.getElementById('send-button');
  const message = document.getElementById('message');
  const addButton = document.getElementById('addButton');
  const itemsSection = document.querySelector('.items');
  const chatBox = document.getElementById('chat-box');
  const chatInput = document.getElementById('chat-input');
  const chatSend = document.getElementById('chat-send');
  const toggleLangButton = document.getElementById('toggle-lang');

  let currentLanguage = 'en'; // Default to English

  // Language dictionary
  const dictionary = {
    en: {
      amountPlaceholder: "Enter Galactic Units",
      sendButton: "Send Units",
      addItem: "Add Galactic Recipe",
      chatPlaceholder: "Type your recipe message...",
      sendingMessage: "Sending Galactic Units...",
      sentMessage: "Sent",
      errorAmount: "Please enter a valid amount.",
      errorItem: "Please enter a recipe name.",
      successAmount: "Galactic Units Sent",
      newItemAdded: "New Galactic Recipe added",
      errorEmptyMessage: "Please enter a message.",
      langToggle: "🇺🇸 English / 🇫🇷 Français"
    },
    fr: {
      amountPlaceholder: "Entrez les Unités Galactiques",
      sendButton: "Envoyer les Unités",
      addItem: "Ajouter une Recette Galactique",
      chatPlaceholder: "Tapez votre message de recette...",
      sendingMessage: "Envoi des Unités Galactiques...",
      sentMessage: "Envoyé",
      errorAmount: "Veuillez entrer un montant valide.",
      errorItem: "Veuillez entrer un nom de recette.",
      successAmount: "Unités Galactiques Envoyées",
      newItemAdded: "Nouvelle Recette Galactique ajoutée",
      errorEmptyMessage: "Veuillez entrer un message.",
      langToggle: "🇺🇸 English / 🇫🇷 Français"
    }
  };

  function translate() {
    amountInput.placeholder = dictionary[currentLanguage].amountPlaceholder;
    sendButton.textContent = dictionary[currentLanguage].sendButton;
    addButton.textContent = dictionary[currentLanguage].addItem;
    chatInput.placeholder = dictionary[currentLanguage].chatPlaceholder;
    toggleLangButton.textContent = dictionary[currentLanguage].langToggle;
  }

  // Language toggle function
  toggleLangButton.addEventListener('click', function () {
    currentLanguage = currentLanguage === 'en' ? 'fr' : 'en';
    translate();
  });

  translate(); // Initial translation

  sendButton.addEventListener('click', function () {
    const amount = parseFloat(amountInput.value);

    if (isNaN(amount) || amount <= 0) {
      message.textContent = dictionary[currentLanguage].errorAmount;
      toastr.error(dictionary[currentLanguage].errorAmount);
      return;
    }

    message.textContent = dictionary[currentLanguage].sendingMessage;

    // Animation logic
    let currentAmount = 0;
    const animationDuration = 1000; // milliseconds
    const intervalId = setInterval(() => {
      currentAmount += amount / (animationDuration / 10);
      amountInput.value = currentAmount.toFixed(2);

      if (currentAmount >= amount) {
        clearInterval(intervalId);
        message.textContent = `${dictionary[currentLanguage].sentMessage} ${amount.toFixed(2)} U.G.`;
        toastr.success(`${dictionary[currentLanguage].successAmount}: ${amount.toFixed(2)} U.G.`);
        playAlarmSound();
      }
    }, 10);
  });

  function createRecipe(recipeName) {
    const recipe = document.createElement('div');
    recipe.classList.add('item');
    recipe.textContent = recipeName;
    return recipe;
  }

  function addNewRecipe() {
    const newRecipeName = prompt(dictionary[currentLanguage].addItem);
    if (newRecipeName) {
      const newRecipe = createRecipe(newRecipeName);
      itemsSection.appendChild(newRecipe);
      toastr.info(`${dictionary[currentLanguage].newItemAdded}: ${newRecipeName}`);
    } else {
      toastr.error(dictionary[currentLanguage].errorItem);
    }
  }

  addButton.addEventListener('click', addNewRecipe);

  chatSend.addEventListener('click', function () {
    const message = chatInput.value.trim();
    if (message) {
      addMessageToChat("You", message);
      chatInput.value = '';
    } else {
      toastr.error(dictionary[currentLanguage].errorEmptyMessage);
    }
  });

  chatInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      chatSend.click();
    }
  });

  function addMessageToChat(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.textContent = `${sender}: ${message}`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function playAlarmSound() {
    try {
      const audio = new Audio('siren.mp3');
      audio.play();
    } catch (error) {
      toastr.error("Failed to play alarm sound.");
    }
  }
});

// Standalone function for toggling languages if not dependent on HTML DOMContentLoaded
(function () {
  const toggleLangButton = document.getElementById('toggle-lang');

  if (toggleLangButton) {
    let currentLanguage = 'en';

    toggleLangButton.addEventListener('click', function () {
      currentLanguage = currentLanguage === 'en' ? 'fr' : 'en';
      document.documentElement.lang = currentLanguage; // Update the HTML lang attribute
    });
  }
})();
    // Placeholder for the OAuth2 token (if implemented)
    let authToken = '';

    // Helper function for secure API call with improved error handling
    async function secureFetch(url) {
        try {
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error during fetch:', error);
            toastr.error('Failed to fetch data. Please try again later.');
            throw error;
        }
    }

    // Fetch asteroids and update UI with better performance and validation
    async function fetchAsteroids() {
        const date = document.getElementById('dateInput').value;
        if (!date) {
            toastr.warning('Please select a date.');
            return;
        }

        const apiKey = 'DEMO_KEY'; // Replace with your actual NASA API key
        const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${date}&end_date=${date}&api_key=${apiKey}`;
        const asteroidResults = document.getElementById('asteroid-results');

        asteroidResults.innerHTML = '<p>Loading asteroids...</p>';

        try {
            const data = await secureFetch(url);
            asteroidResults.innerHTML = '';
            const asteroids = data.near_earth_objects[date];

            if (asteroids && asteroids.length > 0) {
                asteroids.forEach(asteroid => {
                    // Calculate the average diameter securely
                    const diameter = (parseFloat(asteroid.estimated_diameter.meters.estimated_diameter_min) + parseFloat(asteroid.estimated_diameter.meters.estimated_diameter_max)) / 2;
                    const velocity = parseFloat(asteroid.close_approach_data[0].relative_velocity.kilometers_per_hour).toFixed(2);
                    const missDistance = parseFloat(asteroid.close_approach_data[0].miss_distance.kilometers).toFixed(2);

                    const asteroidDiv = document.createElement('div');
                    asteroidDiv.className = 'result-item';
                    asteroidDiv.innerHTML = `
                        <h3>${asteroid.name}</h3>
                        <p>Diameter: ${diameter.toFixed(2)} meters</p>
                                                <p>Velocity: ${velocity} km/h</p>
                    <p>Miss Distance: ${missDistance} km</p>
                `;
                asteroidResults.appendChild(asteroidDiv);
            });
        } else {
            asteroidResults.innerHTML = '<p>No asteroids found for this date.</p>';
        }
    } catch (error) {
        console.error('Error fetching asteroids:', error);
        asteroidResults.innerHTML = '<p>Error retrieving data. Please try again later.</p>';
    }
}

// Search for recipes with better validation and user experience
function searchRecipes() {
    const query = document.getElementById('recipeInput').value.trim();
    const recipeResults = document.getElementById('recipe-results');

    if (query === '') {
        toastr.warning('Please enter a recipe name.');
        return;
    }

    recipeResults.innerHTML = '<p>Loading recipes...</p>';

    setTimeout(() => {
        recipeResults.innerHTML = '';
        const mockRecipes = [
            { name: 'Galactic Pie', ingredients: 'Flour, Sugar, Space Berries', steps: 'Mix, Bake, Enjoy' },
            { name: 'Nebula Soup', ingredients: 'Water, Star Dust, Cosmic Herbs', steps: 'Boil, Stir, Serve' }
        ];

        mockRecipes.forEach(recipe => {
            const recipeDiv = document.createElement('div');
            recipeDiv.className = 'result-item';
            recipeDiv.innerHTML = `
                <h3>${recipe.name}</h3>
                <p>Ingredients: ${recipe.ingredients}</p>
                <p>Steps: ${recipe.steps}</p>
            `;
            recipeResults.appendChild(recipeDiv);
        });
    }, 1000);
}

// Placeholder function for OAuth2 authentication (server-side implementation needed)
function authenticateUser() {
    // Redirect to OAuth2 provider (Google, GitHub, etc.) and obtain a token
    // Store the token in authToken variable
    authToken = 'example_token'; // This would come from the OAuth2 flow
}

// Call this function to authenticate the user
authenticateUser();

document.getElementById('login-form').addEventListener('submit', function (e) {
  e.preventDefault();
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;

  if (email && password) {
    // Simulate successful login (you should handle actual login authentication here)
    toastr.success('Login successful!');
    document.getElementById('form-message').innerText = 'Welcome back!';
  } else {
    toastr.error('Please fill in all fields.');
  }
});