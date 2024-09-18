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
});const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
    },

    email: {
      type: String,
    },

    password: {
      type: String,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
    let genSalt = 10;
    let hashedPass = await bcrypt.hash(this.password, genSalt);
    this.password = hashedPass;
    next();
  });

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
"use strict";

const techLanguageContent = {
  en: {
    welcome: "Welcome to My Digital Universe✨",
    aboutMe: "Developer Profile",
    latestPostTitle: "Latest Post: The Future of Web Development",
    latestPostDesc: "Open my latest article discussing emerging trends in web development, the transformative impact of AI, and future web technologies.",
    trendingPostTitle: "Trending Post: The Rise of AI in Web Design",
    trendingPostDesc: "Discover how AI is revolutionizing UX design, its various applications, and the future of AI-driven web development.",
    location: "Geographical Node: France",
    languages: "Programming Dialects: Intermediate proficiency in CSS, PHP, SQL, React, Flutter, Python, JavaScript, and a myriad of other programming languages to meet client needs and advance research initiatives.",
    switchTo: "Initiate communication with my virtual clone via the chat interface! (I assure you, my virtual clone is just as friendly as I am 👍!)",
    biography: "Driven by passion, my trajectory in the digital sphere took off with the design of basic Shell or Python scripts. This initial spark transformed into an unwavering quest for technological research in the metaverse.",
    currentlyOn: "Current Ventures",
    activities: "My journey encompasses web development using frameworks such as Flask, three.js, PHP, Node.js, React, and Flutter with Dart, indulging in data science with libraries like NumPy, Pandas, and TensorFlow; cloud computing, using platforms like Heroku to architect scalable and resilient web applications; the DevOps realm, utilizing tools like Jira, Trello for Agile Scrum, VS CODE, Docker, Kubernetes, and Jenkins for continuous integration and deployment, ensuring high availability and seamless application delivery; UX/UI design, crafting engaging interfaces using Figma and Canva. I also appreciate various operating systems, including Linux, Windows, and Apple.",
    githubInsights: "🚀 GitHub Insights",
    topLanguages: "Top Languages",
    githubStats: "GitHub Stats",
    connect: "Connect",
    leisureContact: "Interests & Leisure",
    professionalContact: "Professional Contact",
    reachOut: "Feel free to reach out to me via my social media or leave a comment.",
    year: `© ${new Date().getFullYear()} Portfolio of Kevin, J MARVILLE`,
  },
  fr: {
    welcome: "Bienvenue dans Mon Univers Numérique✨",
    aboutMe: "Profil de Développeur",
    latestPostTitle: "Dernier Article : L'avenir du Développement Web",
    latestPostDesc: "Ouvrez mon dernier article discutant des tendances émergentes en développement web, de l'impact transformateur de l'IA et des technologies web futures.",
    trendingPostTitle: "Article Tendance: L'Ascension de l'IA dans le Design Web",
    trendingPostDesc: "Découvrez comment l'IA révolutionne le design UX, ses diverses applications et l'avenir du développement web piloté par l'IA.",
    location: "Noeud Géographique : France",
    languages: "Dialectes de Programmation : Compétence intermédiaire en CSS, PHP, SQL, React, Flutter, Python, JavaScript, et une myriade d'autres langages de programmation pour répondre aux besoins des clients et faire avancer les initiatives de recherche.",
    switchTo: "Entamer la communication avec mon clone virtuel via l'interface de chat ! (Je vous assure, mon clone virtuel est aussi sympathique que moi 👍!)",
    biography: "Poussé par la passion, ma trajectoire dans la sphère numérique a pris son envol avec la conception de scripts Shell ou Python élémentaires. Cette étincelle initiale s'est transformée en une quête inébranlable de recherche technologique dans le metaverse.",
    currentlyOn: "Entreprises Actuelles",
    activities: "Mon parcours englobe le développement web, utilisant des frameworks tels que Flask, three.js, PHP, Node.js, React, et Flutter avec Dart, pour m'adonner à la science des données avec des bibliothèques comme NumPy, Pandas et TensorFlow; le cloud computing, en utilisant des plateformes comme Heroku pour architecturer des applications web évolutives et résilientes; le domaine du DevOps, j'utilise des outils comme Jira, Trello pour Agile Scrum, VS CODE, Docker, Kubernetes et Jenkins pour l'intégration et le déploiement continus, garantissant une haute disponibilité et une livraison transparente des applications; le design UX/UI, je crée des interfaces engageantes en utilisant Figma et Canva. J'apprécie également divers systèmes d'exploitation, y compris Linux, Windows et Apple.",
    githubInsights: "🚀 Insights GitHub",
    topLanguages: "Lexiques Dominants",
    githubStats: "Analyses Statistiques",
    connect: "Établir le Contact",
    leisureContact: "Intérêts & Loisirs",
    professionalContact: "Liaison Professionnelle",
    reachOut: "N'hésitez pas à me contacter via mes réseaux sociaux ou en y laissant un commentaire.",
    year: `© ${new Date().getFullYear()} Portfolio de Kevin, J MARVILLE`,
  },
};

let currentLanguage = "en"; // Default language set to English

function toggleLanguage() {
  currentLanguage = currentLanguage === "en" ? "fr" : "en";
  updatePageContent();
}

function updatePageContent() {
  // Query all elements with a 'data-lang' attribute to update their content
  document.querySelectorAll("[data-lang]").forEach((element) => {
    const key = element.getAttribute("data-lang");
    if (techLanguageContent[currentLanguage][key]) {
      element.textContent = techLanguageContent[currentLanguage][key];
    }
  });

  // Update language switch button appearance
  updateLanguageSwitchAppearance();
}

function updateLanguageSwitchAppearance() {
  // Remove 'active' class from all language switches
  document.querySelectorAll(".language-switch").forEach((element) => {
    element.classList.remove("active");
  });
  // Add 'active' class to the current language switch
  const activeSwitch = Array.from(
    document.querySelectorAll(".language-switch")
  ).find((element) =>
    element.textContent
      .trim()
      .includes(currentLanguage === "en" ? "English" : "Français")
  );
  if (activeSwitch) {
    activeSwitch.classList.add("active");
  }
}

// Initialize event listeners for language switching
function initializeLanguageSwitchListeners() {
  document.querySelectorAll(".language-switch").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent default link action
      toggleLanguage(); // Toggle the page language
    });
  });
}

// DOMContentLoaded to ensure the DOM is fully loaded before attaching listeners
document.addEventListener("DOMContentLoaded", () => {
  initializeLanguageSwitchListeners(); // Set up the event listeners for language switching
  updatePageContent(); // Initial call to set the page content based on the default language
});
document.getElementById('contact-form').addEventListener('submit', function (e) {
  e.preventDefault();
  var name = document.getElementById('name').value;
  var email = document.getElementById('email').value;
  var message = document.getElementById('message').value;

  if (name && email && message) {
    // Simulate successful form submission (you should handle actual form submission to your backend here)
    toastr.success('Your message has been sent successfully!');
    document.getElementById('form-message').innerText = 'Thank you for contacting us, ' + name + '. We will get back to you soon!';
    document.getElementById('contact-form').reset();
  } else {
    toastr.error('Please fill in all fields.');
  }
});