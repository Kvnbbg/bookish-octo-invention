/* Translation toggle */
const techLanguageContent = {
  en: {
    langToggle: "🇺🇸 English", 
  },
  fr: {
    langToggle: "🇫🇷 Français",
  }
};

let currentLanguage = "en"; 

function toggleLanguage() {
  currentLanguage = currentLanguage === "en" ? "fr" : "en";
  updatePageContent();
}

function updatePageContent() {
  document.querySelectorAll("[data-lang]").forEach((element) => {
    const key = element.getAttribute("data-lang");
    if (techLanguageContent[currentLanguage][key]) {
      element.textContent = techLanguageContent[currentLanguage][key];
    }
  });
}

// Event listener for language toggle
const langToggle = document.querySelector('[data-lang="langToggle"]');
if (langToggle) {
  langToggle.addEventListener('click', (event) => {
    event.preventDefault();
    toggleLanguage();
  });
}

// Initial page load
updatePageContent();

const GAMIFICATION_ACTIONS = {
  RECIPE_CREATED: 'RECIPE_CREATED',
  SUSTAINABILITY_ACTION: 'SUSTAINABILITY_ACTION',
  SIEBEL_SYNC: 'SIEBEL_SYNC',
  SESSION_LOGIN: 'SESSION_LOGIN',
  COOKING_CHALLENGE: 'COOKING_CHALLENGE',
  SESSION_MILESTONE: 'SESSION_MILESTONE',
  CARBON_OFFSET: 'CARBON_OFFSET',
  REGION_DISCOVERY: 'REGION_DISCOVERY',
  ASTEROID_SCAN: 'ASTEROID_SCAN'
};

const defaultGamificationState = {
  level: 1,
  totalXP: 0,
  xpIntoLevel: 0,
  xpToNextLevel: 100,
  gold: 0,
  gems: 0,
  streak: 0,
  questProgress: []
};

class GamificationClient {
  constructor() {
    this.state = { ...defaultGamificationState };
  }

  async init() {
    try {
      const response = await fetch('/api/gamification/progress');
      if (!response.ok) return;
      const payload = await response.json();
      if (payload.state) {
        this.state = payload.state;
        renderGamificationState(this.state);
        renderQuestList(this.state.questProgress);
      }
    } catch (error) {
      console.warn('Failed to initialise gamification', error);
    }
  }

  async recordAction(actionType, metadata = {}) {
    if (!actionType) {
      return;
    }

    try {
      const response = await fetch('/api/gamification/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionType, metadata })
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.error || `Action ${actionType} indisponible`);
      }

      const payload = await response.json();
      if (payload.state) {
        this.state = payload.state;
        renderGamificationState(this.state);
        renderQuestList(this.state.questProgress);
      }

      if (payload.events?.length) {
        announceGamificationEvents(payload.events);
      }

      return payload;
    } catch (error) {
      console.error('Gamification error:', error);
      toastr.error(error.message || 'Impossible de valider cette action.');
      throw error;
    }
  }
}

const gamificationClient = new GamificationClient();

function renderGamificationState(state) {
  if (!state) return;

  const levelDisplay = document.getElementById('levelDisplay');
  const goldDisplay = document.getElementById('goldDisplay');
  const gemDisplay = document.getElementById('gemDisplay');
  const streakDisplay = document.getElementById('streakDisplay');
  const xpSummary = document.getElementById('xpSummary');
  const xpProgress = document.getElementById('xpProgress');

  if (levelDisplay) levelDisplay.textContent = state.level ?? 1;
  if (goldDisplay) goldDisplay.textContent = state.gold ?? 0;
  if (gemDisplay) gemDisplay.textContent = state.gems ?? 0;
  if (streakDisplay) streakDisplay.textContent = state.streak ?? 0;

  if (xpSummary) {
    const xpToNext = state.xpToNextLevel || 100;
    xpSummary.textContent = `${state.xpIntoLevel ?? 0} / ${xpToNext} XP`;
  }

  if (xpProgress) {
    const xpToNext = state.xpToNextLevel || 100;
    const progress = xpToNext ? Math.min(100, Math.round(((state.xpIntoLevel || 0) / xpToNext) * 100)) : 0;
    xpProgress.style.width = `${progress}%`;
  }
}

function renderQuestList(quests = []) {
  const questList = document.getElementById('questList');
  if (!questList) return;

  if (!quests.length) {
    questList.innerHTML = '<p class="quest-empty">Aucune quête disponible pour le moment.</p>';
    return;
  }

  questList.innerHTML = quests.map((quest) => {
    const progressText = `${quest.progress}/${quest.target}`;
    const statusClass = quest.completed ? 'quest-status completed' : 'quest-status';
    const statusText = quest.completed ? 'Terminé' : `En cours (${progressText})`;
    const progressWidth = Math.min(100, quest.progressPercent || 0);

    return `
      <div class="quest-card">
        <h3>${quest.title}</h3>
        <p>${quest.description}</p>
        <div class="quest-progress-bar"><span style="width: ${progressWidth}%"></span></div>
        <div class="quest-rewards">
          <span>+${quest.xpReward} XP</span>
          <span>+${quest.goldReward}💰</span>
          ${quest.gemsReward ? `<span>+${quest.gemsReward}💎</span>` : ''}
        </div>
        <span class="${statusClass}">${statusText}</span>
      </div>
    `;
  }).join('');
}

function announceGamificationEvents(events = []) {
  events.forEach((event) => {
    const message = typeof event === 'string' ? event : event.message;
    if (message) {
      toastr.success(message);
    }
  });
}

/* Chat */
document.addEventListener('DOMContentLoaded', function () {
  // Cache DOM elements for better performance
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

  gamificationClient.init();

  // Language dictionary for internationalization (i18n)
  const dictionary = {
    en: {
      amountPlaceholder: "Enter Galactic Units",
      sendButton: "Send Units",
      addItem: "Add Galactic Recipe",
      chatPlaceholder: "Type your recipe message </div>...",
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

  // Translate the interface
  function translate() {
    amountInput.placeholder = dictionary[currentLanguage].amountPlaceholder;
    sendButton.textContent = dictionary[currentLanguage].sendButton;
    addButton.textContent = dictionary[currentLanguage].addItem;
    chatInput.placeholder = dictionary[currentLanguage].chatPlaceholder;
    toggleLangButton.textContent = dictionary[currentLanguage].langToggle;
  }

  // Language toggle function with fallback
  toggleLangButton.addEventListener('click', function () {
    currentLanguage = currentLanguage === 'en' ? 'fr' : 'en';
    translate();
  });

  translate(); // Initial translation for the default language

  // Send button click handler for sending units
  sendButton.addEventListener('click', function () {
    const amount = parseFloat(amountInput.value);

    if (isNaN(amount) || amount <= 0) {
      message.textContent = dictionary[currentLanguage].errorAmount;
      toastr.error(dictionary[currentLanguage].errorAmount);
      return;
    }

    message.textContent = dictionary[currentLanguage].sendingMessage;

    // Optimized animation logic
    let currentAmount = 0;
    const stepAmount = amount / 100; // Divide by 100 for a smooth transition
    const animationDuration = 1000; // milliseconds

    const intervalId = setInterval(() => {
      currentAmount = Math.min(currentAmount + stepAmount, amount);
      amountInput.value = currentAmount.toFixed(2);

      if (currentAmount >= amount) {
        clearInterval(intervalId);
        message.textContent = `${dictionary[currentLanguage].sentMessage} ${amount.toFixed(2)} U.G.`;
        toastr.success(`${dictionary[currentLanguage].successAmount}: ${amount.toFixed(2)} U.G.`);
        gamificationClient
          .recordAction(GAMIFICATION_ACTIONS.SUSTAINABILITY_ACTION, {
            bonusXp: Math.round(amount / 5),
            count: 1
          })
          .catch((error) => console.warn('Unable to record sustainability action', error));
      }
    }, animationDuration / 100); // Small intervals for smooth animation
  });

  // Create a new recipe
  function createRecipe(recipeName) {
    const recipe = document.createElement('div');
    recipe.classList.add('item');
    recipe.textContent = recipeName;
    return recipe;
  }

  // Add a new recipe to the items section
  async function addNewRecipe() {
    const newRecipeName = prompt(dictionary[currentLanguage].addItem);
    if (newRecipeName) {
      const newRecipe = createRecipe(newRecipeName);
      itemsSection.appendChild(newRecipe);
      toastr.info(`${dictionary[currentLanguage].newItemAdded}: ${newRecipeName}`);
      try {
        await gamificationClient.recordAction(GAMIFICATION_ACTIONS.RECIPE_CREATED, {
          recipeName: newRecipeName
        });
      } catch (error) {
        console.warn('Recipe quest update failed', error);
      }
    } else {
      toastr.error(dictionary[currentLanguage].errorItem);
    }
  }

  addButton.addEventListener('click', addNewRecipe);

  // Chat send button functionality
  chatSend.addEventListener('click', function () {
    const message = chatInput.value.trim();
    if (message) {
      addMessageToChat("You", message);
      chatInput.value = ''; // Clear input
    } else {
      toastr.error(dictionary[currentLanguage].errorEmptyMessage);
    }
  });

  // Send chat message on 'Enter' key press
  chatInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      chatSend.click();
    }
  });

  // Add message to the chat box
  function addMessageToChat(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.textContent = `${sender}: ${message}`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto scroll to the latest message
  }
});

window.gamifyAction = (actionType, metadata) => gamificationClient.recordAction(actionType, metadata);
window.gamificationState = () => ({ ...gamificationClient.state });

// Secure API call function with better error handling and optimization
async function secureFetch(url, authToken = '') {
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    toastr.error('Failed to fetch data. Try again later.');
    throw error;
  }
}

// Fetch asteroid data and display results
async function fetchAsteroids() {
  const date = document.getElementById('dateInput').value;
  if (!date) {
    toastr.warning('Please select a date.');
    return;
  }

  const apiKey = 'DEMO_KEY'; // Replace with your NASA API key
  const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${date}&end_date=${date}&api_key=${apiKey}`;
  const asteroidResults = document.getElementById('asteroid-results');

  asteroidResults.innerHTML = '<p>Loading asteroids...</p>';

  try {
    const data = await secureFetch(url);
    asteroidResults.innerHTML = '';
    const asteroids = data.near_earth_objects[date];

    if (asteroids && asteroids.length > 0) {
      asteroids.forEach(asteroid => {
        const diameter = ((+asteroid.estimated_diameter.meters.estimated_diameter_min + +asteroid.estimated_diameter.meters.estimated_diameter_max) / 2).toFixed(2);
        const velocity = (+asteroid.close_approach_data[0].relative_velocity.kilometers_per_hour).toFixed(2);
        const missDistance = (+asteroid.close_approach_data[0].miss_distance.kilometers).toFixed(2);

        const asteroidDiv = document.createElement('div');
        asteroidDiv.className = 'result-item';
        asteroidDiv.innerHTML = `
          <h3>${asteroid.name}</h3>
          <p>Diameter: ${diameter} meters</p>
          <p>Velocity: ${velocity} km/h</p>
          <p>Miss Distance: ${missDistance} km</p>
        `;
        asteroidResults.appendChild(asteroidDiv);
      });
      gamificationClient
        .recordAction(GAMIFICATION_ACTIONS.ASTEROID_SCAN, { count: asteroids.length })
        .catch((error) => console.warn('Asteroid quest update failed', error));
    } else {
      asteroidResults.innerHTML = '<p>No asteroids found for this date.</p>';
    }
  } catch (error) {
    asteroidResults.innerHTML = '<p>Error retrieving data. Please try again later.</p>';
  }
}
