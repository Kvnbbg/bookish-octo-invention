    // === Security & Cookie Functions ===
    const securityConfig = {
      sanitizeInput: input => input.replace(/<[^>]*>?/gm, '')
    };

    function setCookie(name, value, days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      const expires = "expires=" + date.toUTCString();
      document.cookie = `${name}=${value};${expires};path=/;Secure;SameSite=Strict`;
    }

    function getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    }

    // === User Management ===
    let users = JSON.parse(getCookie('users') || '[{"name":"Katia Rachon"}]');
    let currentUser = users[0];

    function updateUserUI() {
      document.getElementById('current-user').textContent = currentUser.name;
    }

    function showUserForm() {
      const name = prompt('Nom du nouvel utilisateur:');
      if (name) {
        const sanitized = securityConfig.sanitizeInput(name);
        const newUser = { name: sanitized };
        users.push(newUser);
        setCookie('users', JSON.stringify(users), 365);
        currentUser = newUser;
        updateUserUI();
      }
    }

    function changeUser() {
      const name = prompt("Entrez le nouveau nom d'utilisateur:");
      if (name) {
        const sanitized = securityConfig.sanitizeInput(name);
        currentUser = { name: sanitized };
        updateUserUI();
      }
    }

    // === Siebel Connection Manager (Mock Implementation) ===
    class SiebelConnection {
      constructor() {
        this.isConnected = false;
      }
      connect() {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            if (Math.random() < 0.9) {
              this.isConnected = true;
              resolve();
            } else {
              reject('Erreur de connexion à Siebel');
            }
          }, 1500);
        });
      }
      disconnect() {
        this.isConnected = false;
        return Promise.resolve();
      }
      syncData() {
        return new Promise(resolve => {
          setTimeout(() => {
            this.generateFakeSiebelData();
            resolve();
          }, 2000);
        });
      }
      generateFakeSiebelData() {
        const categories = ['entrée', 'plat', 'dessert'];
        const fakeData = Array.from({ length: 5 }, (_, i) => ({
          id: `SIEBEL-${Date.now()}-${i}`,
          title: `Recette Siebel ${i + 1}`,
          content: `Ingrédients:\n- Exemple 1\n- Exemple 2\n\nÉtapes:\n1. Étape 1\n2. Étape 2`,
          category: categories[Math.floor(Math.random() * categories.length)],
          source: 'Siebel CRM',
          lastSynced: new Date().toLocaleString()
        }));
        fakeData.forEach(recipe => {
          if (!recipes.some(r => r.id === recipe.id)) {
            recipes.push(recipe);
          }
        });
        displayRecipes();
      }
    }
    const siebelConnection = new SiebelConnection();

    function updateConnectionStatus() {
      const statusIndicator = document.getElementById('statusIndicator');
      const statusText = document.getElementById('connectionStatus');
      const connectButton = document.getElementById('connectButton');
      if (siebelConnection.isConnected) {
        statusIndicator.classList.add('connected');
        statusText.textContent = 'Connecté à Siebel';
        connectButton.querySelector('.button-text').textContent = 'Déconnexion';
        document.getElementById('syncButton').disabled = false;
      } else {
        statusIndicator.classList.remove('connected');
        statusText.textContent = 'Déconnecté';
        connectButton.querySelector('.button-text').textContent = 'Connexion Siebel';
        document.getElementById('syncButton').disabled = true;
      }
    }

    async function toggleSiebelConnection() {
      const button = document.getElementById('connectButton');
      button.disabled = true;
      button.querySelector('.loading-spinner').style.display = 'inline-block';
      try {
        if (siebelConnection.isConnected) {
          await siebelConnection.disconnect();
        } else {
          await siebelConnection.connect();
        }
        updateConnectionStatus();
      } catch (error) {
        showNotification(`Erreur: ${error}`);
      } finally {
        button.disabled = false;
        button.querySelector('.loading-spinner').style.display = 'none';
      }
    }

    async function syncWithSiebel() {
      const statusElement = document.getElementById('syncStatus');
      statusElement.textContent = 'Synchronisation en cours...';
      statusElement.style.color = 'var(--accent-color)';
      try {
        await siebelConnection.syncData();
        statusElement.textContent = `Dernière synchronisation: ${new Date().toLocaleTimeString()}`;
        statusElement.style.color = 'var(--success-color)';
      } catch (error) {
        statusElement.textContent = 'Échec de synchronisation';
        statusElement.style.color = 'var(--danger-color)';
      }
    }

    // === Recipe Management ===
    let recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    function saveRecipe(e) {
      e.preventDefault();
      const newRecipe = {
        id: Date.now(),
        title: document.getElementById('recipeTitle').value,
        content: document.getElementById('recipeContent').value,
        category: document.getElementById('recipeCategory').value,
        created: new Date().toLocaleString()
      };
      recipes.push(newRecipe);
      localStorage.setItem('recipes', JSON.stringify(recipes));
      displayRecipes();
      e.target.reset();
    }

    function displayRecipes() {
      const container = document.getElementById('recipeContainer');
      container.innerHTML = recipes.map(recipe => `
        <div class="recipe-card">
          <h3>${recipe.title}</h3>
          <p>${recipe.content.replace(/\n/g, '<br>')}</p>
          <div class="recipe-meta">
            <span class="category">${recipe.category.toUpperCase()}</span>
            <span class="source">${recipe.source || 'Local'}</span>
            <button onclick="deleteRecipe('${recipe.id}')">🗑️</button>
          </div>
        </div>
      `).join('');
    }

    function deleteRecipe(id) {
      recipes = recipes.filter(recipe => recipe.id != id);
      localStorage.setItem('recipes', JSON.stringify(recipes));
      displayRecipes();
    }

    function generateSmartRecipe() {
      const categories = ['Française', 'Italienne', 'Asiatique', 'Végétarienne'];
      const proteins = ['poulet', 'boeuf', 'poisson', 'tofu'];
      const styles = ['classique', 'moderne', 'fusion'];
      const generatedRecipe = {
        title: `Recette ${categories[Math.floor(Math.random() * categories.length)]} au ${proteins[Math.floor(Math.random() * proteins.length)]}`,
        content: `Une délicieuse recette ${styles[Math.floor(Math.random() * styles.length)]} combinant des saveurs uniques...`,
        category: ['entrée', 'plat', 'dessert'][Math.floor(Math.random() * 3)]
      };
      document.getElementById('recipeTitle').value = generatedRecipe.title;
      document.getElementById('recipeContent').value = generatedRecipe.content;
      document.getElementById('recipeCategory').value = generatedRecipe.category;
    }

    function simulateRandomData() {
      for (let i = 0; i < 3; i++) {
        const randomTitle = "Recette Aléatoire " + Math.floor(Math.random() * 1000);
        const randomContent = "Contenu généré aléatoirement: " + Math.random().toString(36).substring(7);
        const randomCategory = ["entrée", "plat", "dessert"][Math.floor(Math.random() * 3)];
        const simulatedRecipe = {
          id: Date.now() + i,
          title: randomTitle,
          content: randomContent,
          category: randomCategory,
          created: new Date().toLocaleString()
        };
        recipes.push(simulatedRecipe);
      }
      localStorage.setItem('recipes', JSON.stringify(recipes));
      displayRecipes();
      showNotification("Données aléatoires générées !");
    }

    // === Recipe Quest Mini-Game ===
    class RecipeGame {
      constructor() {
        this.xp = 0;
        this.level = 1;
        this.gold = 0;
        this.gems = 0;
        this.gameLoop();
      }
      gameLoop() {
        setInterval(() => {
          // Placeholder for periodic game updates (e.g., daily quests)
        }, 60000);
      }
      addXP(amount) {
        this.xp += amount;
        if (this.xp >= this.getRequiredXP()) {
          this.levelUp();
        }
        this.createConfetti(10);
        this.animateXPBar();
        updateGameHUD();
      }
      getRequiredXP() {
        return 100; // Simple threshold; you can make this dynamic per level.
      }
      levelUp() {
        this.level++;
        this.xp = 0;
        showAchievementPopup(`Niveau ${this.level} atteint!`);
        updateGameHUD();
      }
      createConfetti(count) {
        for (let i = 0; i < count; i++) {
          const confetti = document.createElement('div');
          confetti.className = 'confetti';
          confetti.style.left = Math.random() * 100 + 'vw';
          confetti.style.animationDelay = Math.random() * 1 + 's';
          document.body.appendChild(confetti);
          setTimeout(() => confetti.remove(), 2000);
        }
      }
      animateXPBar() {
        const xpBar = document.querySelector('.xp-progress');
        const percentage = (this.xp / this.getRequiredXP()) * 100;
        xpBar.style.width = percentage + '%';
      }
    }
    const game = new RecipeGame();

    function updateGameHUD() {
      document.getElementById('gameLevel').textContent = "Level " + game.level;
      document.getElementById('goldCount').textContent = "★ " + game.gold;
      document.getElementById('gemsCount').textContent = "♦ " + game.gems;
    }

    // Cooking mini-game button
    document.querySelector('.cook-button').addEventListener('click', () => {
      // For simplicity, assume all ingredient slots are filled
      game.addXP(50);
      showAchievementPopup("Recette parfaite!");
      animateCookButton();
    });

    function animateCookButton() {
      const button = document.querySelector('.cook-button');
      button.style.transform = 'scale(1.2)';
      setTimeout(() => button.style.transform = 'scale(1)', 200);
    }

    function showAchievementPopup(text) {
      const popup = document.getElementById('achievementPopup');
      document.getElementById('achievementText').textContent = text;
      popup.style.right = '20px';
      setTimeout(() => { popup.style.right = '-300px'; }, 3000);
    }

    // === Notifications ===
    function showNotification(message) {
      alert(message);
    }

    // === Initialization ===
    function init() {
      updateUserUI();
      displayRecipes();
      updateConnectionStatus();
      updateGameHUD();
      // Auto-sync Siebel every 30 seconds if connected
      setInterval(() => {
        if (siebelConnection.isConnected) {
          siebelConnection.syncData();
        }
      }, 30000);
    }

    window.onload = init;
