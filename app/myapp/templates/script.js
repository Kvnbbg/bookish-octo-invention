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