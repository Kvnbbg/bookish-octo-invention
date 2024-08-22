document.addEventListener('DOMContentLoaded', function () {
  const amountInput = document.getElementById('amount');
  const sendButton = document.getElementById('send-button');
  const message = document.getElementById('message');
  const addButton = document.getElementById('addButton');
  const itemsSection = document.querySelector('.items');
  const chatBox = document.getElementById('chat-box');
  const chatInput = document.getElementById('chat-input');
  const chatSend = document.getElementById('chat-send');

  // Check if elements are correctly loaded
  if (!amountInput || !sendButton || !message || !addButton || !itemsSection || !chatBox || !chatInput || !chatSend) {
    toastr.error("One or more elements are not loaded correctly. Please check your HTML structure.");
    return;
  }

  sendButton.addEventListener('click', function () {
    const amount = parseFloat(amountInput.value);

    if (isNaN(amount) || amount <= 0) {
      message.textContent = "Please enter a valid amount.";
      toastr.error("Please enter a valid amount.");
      return;
    }

    message.textContent = "Sending...";

    // Animation logic
    let currentAmount = 0;
    const animationDuration = 1000; // milliseconds
    const intervalId = setInterval(() => {
      currentAmount += amount / (animationDuration / 10);
      amountInput.value = currentAmount.toFixed(2);

      if (currentAmount >= amount) {
        clearInterval(intervalId);
        message.textContent = "Sent $" + amount.toFixed(2);
        toastr.success("Amount Sent: $" + amount.toFixed(2));
        playAlarmSound();
      }
    }, 10);
  });

  // Function to create a new item element
  function createItem(itemName) {
    const item = document.createElement('div');
    item.classList.add('item'); // Add a class for styling
    item.textContent = itemName;
    return item;
  }

  // Function to add a new item
  function addNewItem() {
    const newItemName = prompt("Enter item name:"); // Get user input
    if (newItemName) { // Check if user entered a name
      const newItem = createItem(newItemName);
      itemsSection.appendChild(newItem);
      toastr.info("New item added: " + newItemName);
    } else {
      toastr.error("Please enter an item name.");
    }
  }

  // Add click event listener to the button
  addButton.addEventListener('click', addNewItem);

  // Chat functionality
  chatSend.addEventListener('click', function () {
    const message = chatInput.value.trim();
    if (message) {
      addMessageToChat("You", message);
      chatInput.value = '';
    } else {
      toastr.error("Please enter a message.");
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