    // === Security & Cookie Functions ===
    const securityConfig = {
      sanitizeInput: input => {
        let previous;
        do {
          previous = input;
          input = input.replace(/<[^>]*>?/gm, '');
        } while (input !== previous);
        return input;
      }
    };

    // Proper HTML escaping function to encode meta-characters
    function escapeHtml(string) {
      if (!string) return '';
      return String(string)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/`/g, '&#96;');
    }
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

    const dom = {
      currentUser: document.getElementById('current-user'),
      changeUserBtn: document.getElementById('changeUserBtn'),
      loginBtn: document.getElementById('loginBtn'),
      logoutBtn: document.getElementById('logoutBtn'),
      loginForm: document.getElementById('loginForm'),
      loginGoogleBtn: document.getElementById('loginGoogleBtn'),
      loginGithubBtn: document.getElementById('loginGithubBtn'),
      closeLoginModalBtn: document.getElementById('closeLoginModalBtn'),
      sessionSustainability: document.getElementById('sessionSustainability'),
      statusIndicator: document.getElementById('statusIndicator'),
      connectionStatus: document.getElementById('connectionStatus'),
      connectButton: document.getElementById('connectButton'),
      syncButton: document.getElementById('syncButton'),
      simulateDataBtn: document.getElementById('simulateDataBtn'),
      quickGenerateBtn: document.getElementById('quickGenerateBtn'),
      panelGenerateBtn: document.getElementById('panelGenerateBtn'),
      recipeForm: document.getElementById('recipeForm'),
      offsetCarbonBtn: document.getElementById('offsetCarbonBtn'),
      syncStatus: document.getElementById('syncStatus'),
      recipeContainer: document.getElementById('recipeContainer'),
      whiteoutOverlay: document.getElementById('whiteoutOverlay'),
      whiteoutText: document.getElementById('whiteoutText'),
      recipeCount: document.getElementById('recipeCount'),
      overviewGameLevel: document.getElementById('overviewGameLevel'),
      overviewEcoCount: document.getElementById('overviewEcoCount')
    };

    const ingredientPool = ['Basilic', 'Tomate', 'Citron', 'Safran', 'Truffe', 'Miel', 'Piment', 'Menthe'];
    const experienceSettingsKey = 'experienceSettings';
    const interactionToggles = {
      focus: 'focus',
      compact: 'compact',
      ambient: 'ambient'
    };

    // === User Management ===
    let users = JSON.parse(getCookie('users') || '[{"name":"Katia Rachon"}]');
    let currentUser = users[0];

    function updateUserUI() {
      dom.currentUser.textContent = currentUser.name;
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
      if (siebelConnection.isConnected) {
        dom.statusIndicator.classList.add('connected');
        dom.connectionStatus.textContent = 'Connecté à Siebel';
        dom.connectButton.querySelector('.button-text').textContent = 'Déconnexion';
        dom.syncButton.disabled = false;
      } else {
        dom.statusIndicator.classList.remove('connected');
        dom.connectionStatus.textContent = 'Déconnecté';
        dom.connectButton.querySelector('.button-text').textContent = 'Connexion Siebel';
        dom.syncButton.disabled = true;
      }
    }

    async function toggleSiebelConnection() {
      await withBusyState(dom.connectButton, async () => {
        if (siebelConnection.isConnected) {
          await siebelConnection.disconnect();
        } else {
          await siebelConnection.connect();
        }
        updateConnectionStatus();
      }, 'Connexion sécurisée en cours...');
    }

    async function syncWithSiebel() {
      dom.syncStatus.textContent = 'Synchronisation en cours...';
      dom.syncStatus.style.color = 'var(--accent-color)';
      await withBusyState(dom.syncButton, async () => {
        await siebelConnection.syncData();
        dom.syncStatus.textContent = `Dernière synchronisation: ${new Date().toLocaleTimeString()}`;
        dom.syncStatus.style.color = 'var(--success-color)';
      }, 'Synchronisation des données...').catch(() => {
        dom.syncStatus.textContent = 'Échec de synchronisation';
        dom.syncStatus.style.color = 'var(--danger-color)';
      });
    }

    // === Recipe Management ===
    let recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    let recipeFilter = 'all';
    let recipeSort = 'recent';
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
      flashWhiteout('Recette sauvegardée ✅');
      displayRecipes();
      e.target.reset();
    }

    function displayRecipes() {
      const filteredRecipes = recipes.filter(recipe => (
        recipeFilter === 'all' ? true : recipe.category === recipeFilter
      ));
      const sortedRecipes = [...filteredRecipes].sort((a, b) => {
        if (recipeSort === 'title') {
          return a.title.localeCompare(b.title);
        }
        return b.id - a.id;
      });

      dom.recipeContainer.innerHTML = sortedRecipes.map(recipe => {
        // Sanitize and escape all fields before inserting into HTML
        const safeTitle = escapeHtml(securityConfig.sanitizeInput(recipe.title || ''));
        const safeContent = escapeHtml(securityConfig.sanitizeInput(recipe.content || ''));
        const safeCategory = escapeHtml(securityConfig.sanitizeInput(recipe.category || ''));
        const safeSource = escapeHtml(securityConfig.sanitizeInput(recipe.source || 'Local'));
        const safeId = escapeHtml(String(recipe.id)); // encode as string, just in case.
        return `
          <div class="recipe-card">
            <h3>${safeTitle}</h3>
            <p>${safeContent.replace(/\n/g, '<br>')}</p>
            <div class="recipe-meta">
              <span class="category">${safeCategory.toUpperCase()}</span>
              <span class="source">${safeSource}</span>
              <button type="button" class="delete-recipe-btn" data-recipe-id="${safeId}" aria-label="Supprimer ${safeTitle}">🗑️</button>
            </div>
          </div>
        `;
      }).join('');
      dom.recipeContainer.querySelectorAll('.delete-recipe-btn').forEach(button => {
        button.addEventListener('click', () => deleteRecipe(button.dataset.recipeId));
      });
      if (dom.recipeCount) {
        dom.recipeCount.textContent = sortedRecipes.length.toString();
      }
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
      flashWhiteout('Idée IA générée ✨', 500);
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
      flashWhiteout('Simulation terminée ⚡', 650);
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
      if (dom.overviewGameLevel) {
        dom.overviewGameLevel.textContent = "Level " + game.level;
      }
      document.getElementById('goldCount').textContent = "★ " + game.gold;
      document.getElementById('gemsCount').textContent = "♦ " + game.gems;
    }

    function setupIngredientSlots() {
      const slots = document.querySelectorAll('.ingredient-slots .slot');
      slots.forEach((slot, index) => {
        const ingredient = ingredientPool[index % ingredientPool.length];
        setSlotIngredient(slot, ingredient);
        slot.addEventListener('click', () => cycleIngredient(slot));
      });
    }

    function setSlotIngredient(slot, ingredient) {
      slot.dataset.ingredient = ingredient;
      slot.textContent = ingredient;
      slot.classList.remove('flip');
      requestAnimationFrame(() => slot.classList.add('flip'));
    }

    function cycleIngredient(slot) {
      const currentIndex = ingredientPool.indexOf(slot.dataset.ingredient);
      const nextIndex = (currentIndex + 1) % ingredientPool.length;
      setSlotIngredient(slot, ingredientPool[nextIndex]);
    }

    function shuffleIngredients() {
      document.querySelectorAll('.ingredient-slots .slot').forEach(slot => {
        const ingredient = ingredientPool[Math.floor(Math.random() * ingredientPool.length)];
        setSlotIngredient(slot, ingredient);
      });
      flashWhiteout('Ingrédients mélangés!', 450);
    }

    function autoCook() {
      shuffleIngredients();
      game.addXP(35);
      showAchievementPopup("Combo aromatique!");
      animateCookButton();
    }

    // Cooking mini-game button
    document.querySelector('.cook-button').addEventListener('click', () => {
      game.addXP(50);
      showAchievementPopup("Recette parfaite!");
      animateCookButton();
    });

    function animateCookButton() {
      const button = document.querySelector('.cook-button');
      button.style.transform = 'scale(1.2)';
      setTimeout(() => button.style.transform = 'scale(1)', 200);
      flashWhiteout('Cuisson en cours...', 350);
    }

    function showAchievementPopup(text) {
      const popup = document.getElementById('achievementPopup');
      document.getElementById('achievementText').textContent = text;
      popup.style.right = '20px';
      setTimeout(() => { popup.style.right = '-300px'; }, 3000);
    }

    function setToggleState(toggleButton, isActive) {
      toggleButton.classList.toggle('active', isActive);
    }

    // === Login Modal Functions ===
    function showLoginModal() {
      document.getElementById('loginModal').style.display = 'block';
    }
    
    function closeLoginModal() {
      document.getElementById('loginModal').style.display = 'none';
    }
    
    function handleLogin(event) {
      event.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      // Simple validation
      if (email && password) {
        // Mock login - in a real app, this would validate against a backend
        loginSuccess({
          name: email.split('@')[0],
          email: email,
          id: Date.now(),
          authMethod: 'email'
        });
        closeLoginModal();
      }
    }
    
    function loginWithGoogle() {
      // Mock Google OAuth login
      loginSuccess({
        name: 'Google User',
        email: 'user@gmail.com',
        id: 'google-' + Date.now(),
        authMethod: 'google'
      });
      closeLoginModal();
    }
    
    function loginWithGithub() {
      // Mock GitHub OAuth login
      loginSuccess({
        name: 'GitHub User',
        email: 'user@github.com',
        id: 'github-' + Date.now(),
        authMethod: 'github'
      });
      closeLoginModal();
    }
    
    function loginSuccess(user) {
      // Store user in localStorage
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      // Update UI
      dom.currentUser.textContent = user.name;
      dom.loginBtn.style.display = 'none';
      dom.logoutBtn.style.display = 'block';
      
      // Show sustainability section
      dom.sessionSustainability.style.display = 'block';
      
      // Start session timer
      startSessionTimer();
      
      // Show welcome notification
      showNotification(`Bienvenue, ${user.name}!`);
      
      // Add XP for logging in
      game.addXP(10);
    }
    
    function logout() {
      // Clear user from localStorage
      localStorage.removeItem('currentUser');
      
      // Update UI
      dom.currentUser.textContent = 'Invité';
      dom.loginBtn.style.display = 'block';
      dom.logoutBtn.style.display = 'none';
      
      // Hide sustainability section
      dom.sessionSustainability.style.display = 'none';
      
      // Stop session timer
      stopSessionTimer();
      
      showNotification('Vous avez été déconnecté.');
    }
    
    // === South Button Functionality ===
    document.addEventListener('DOMContentLoaded', function() {
      const southBtn = document.getElementById('southBtn');
      southBtn.addEventListener('click', function(e) {
        e.preventDefault();
        showSouthContent();
      });
    });
    
    function showSouthContent() {
      // Create a popup for South content
      const popup = document.createElement('div');
      popup.className = 'south-popup';
      popup.innerHTML = `
        <div class="south-popup-content">
          <span class="close south-close" role="button" tabindex="0">&times;</span>
          <h2>Découvrez le Sud</h2>
          <div class="south-content">
            <div class="south-image" aria-hidden="true">🌿</div>
            <div class="south-info">
              <h3>Cuisine Méditerranéenne</h3>
              <p>Explorez les saveurs ensoleillées de la cuisine méditerranéenne, riche en huile d'olive, herbes fraîches, et produits de la mer.</p>
              <ul class="south-features">
                <li>Recettes traditionnelles provençales</li>
                <li>Ingrédients de saison du marché</li>
                <li>Techniques de cuisson authentiques</li>
              </ul>
              <button type="button" class="explore-south-btn">Explorer les recettes</button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(popup);
      const closeSouthPopup = () => popup.remove();
      const closeBtn = popup.querySelector('.south-close');
      closeBtn.addEventListener('click', closeSouthPopup);
      closeBtn.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          closeSouthPopup();
        }
      });
      popup.querySelector('.explore-south-btn').addEventListener('click', exploreSouthRecipes);
    }
    
    function exploreSouthRecipes() {
      // Add some Mediterranean recipes to the collection
      const southRecipes = [
        {
          id: 'south-' + Date.now(),
          title: 'Ratatouille Provençale',
          content: 'Ingrédients:\n- 1 aubergine\n- 2 courgettes\n- 1 poivron rouge\n- 1 poivron jaune\n- 3 tomates\n- 2 oignons\n- 3 gousses d\'ail\n- Herbes de Provence\n- Huile d\'olive\n\nInstructions:\n1. Couper tous les légumes en dés\n2. Faire revenir les oignons et l\'ail dans l\'huile d\'olive\n3. Ajouter les autres légumes et les herbes\n4. Cuire à feu doux pendant 45 minutes',
          category: 'plat',
          created: new Date().toLocaleString(),
          region: 'Sud'
        },
        {
          id: 'south-' + (Date.now() + 1),
          title: 'Salade Niçoise',
          content: 'Ingrédients:\n- Laitue\n- Tomates\n- Œufs durs\n- Thon\n- Olives noires\n- Anchois\n- Haricots verts\n- Poivron\n- Huile d\'olive\n- Vinaigre balsamique\n\nInstructions:\n1. Cuire les haricots verts et les œufs\n2. Couper tous les ingrédients\n3. Mélanger et assaisonner avec huile d\'olive et vinaigre',
          category: 'entrée',
          created: new Date().toLocaleString(),
          region: 'Sud'
        }
      ];
      
      // Add recipes to the collection
      recipes = [...recipes, ...southRecipes];
      localStorage.setItem('recipes', JSON.stringify(recipes));
      displayRecipes();
      
      // Close the popup
      document.querySelector('.south-popup').remove();
      
      // Show notification
      showNotification('Recettes méditerranéennes ajoutées!');
      
      // Add XP for exploring
      game.addXP(25);
      
      // Update eco recipe count
      updateEcoRecipeCount();
    }
    
    // === Session Sustainability Features ===
    let sessionTimer;
    let sessionSeconds = 0;
    
    function startSessionTimer() {
      sessionTimer = setInterval(() => {
        sessionSeconds++;
        updateSessionTime();
        updateSessionProgress();
      }, 1000);
    }
    
    function stopSessionTimer() {
      clearInterval(sessionTimer);
      sessionSeconds = 0;
      updateSessionTime();
      updateSessionProgress();
    }
    
    function updateSessionTime() {
      const hours = Math.floor(sessionSeconds / 3600);
      const minutes = Math.floor((sessionSeconds % 3600) / 60);
      const seconds = sessionSeconds % 60;
      
      const timeString = [
        hours.toString().padStart(2, '0'),
        minutes.toString().padStart(2, '0'),
        seconds.toString().padStart(2, '0')
      ].join(':');
      
      document.getElementById('sessionTime').textContent = timeString;
    }
    
    function updateSessionProgress() {
      // Calculate progress percentage (max 100% at 30 minutes)
      const maxSeconds = 30 * 60;
      const progress = Math.min((sessionSeconds / maxSeconds) * 100, 100);
      document.getElementById('sessionProgress').style.width = progress + '%';
      
      // Award XP for every 5 minutes of session time
      if (sessionSeconds > 0 && sessionSeconds % 300 === 0) {
        game.addXP(5);
        updatePeopleHelped();
      }
    }
    
    function updateEcoRecipeCount() {
      // Count recipes with eco-friendly ingredients or methods
      const ecoKeywords = ['local', 'bio', 'saison', 'durable', 'écologique', 'méditerranéen'];
      const ecoRecipes = recipes.filter(recipe => 
        ecoKeywords.some(keyword => 
          recipe.title.toLowerCase().includes(keyword) || 
          recipe.content.toLowerCase().includes(keyword) ||
          (recipe.region && recipe.region === 'Sud')
        )
      );
      
      document.getElementById('ecoRecipeCount').textContent = ecoRecipes.length;
      if (dom.overviewEcoCount) {
        dom.overviewEcoCount.textContent = ecoRecipes.length;
      }
      
      // Update carbon footprint based on eco recipes
      updateCarbonFootprint(ecoRecipes.length);
    }
    
    function updateCarbonFootprint(ecoRecipeCount) {
      // Mock calculation: total recipes - eco recipes = carbon footprint in kg
      const carbonFootprint = Math.max(0, recipes.length - ecoRecipeCount);
      document.getElementById('carbonFootprint').textContent = carbonFootprint + ' kg CO₂';
    }
    
    function offsetCarbon() {
      // Mock carbon offset action
      showNotification('Empreinte carbone compensée!');
      document.getElementById('carbonFootprint').textContent = '0 kg CO₂';
      game.addXP(15);
    }
    
    function completeAction(actionType) {
      // Handle different sustainability actions
      switch(actionType) {
        case 'local':
          showNotification('Action "Recettes Locales" complétée! +20 XP');
          game.addXP(20);
          break;
        case 'zerowaste':
          showNotification('Action "Zéro Déchet" complétée! +25 XP');
          game.addXP(25);
          break;
        case 'seasonal':
          showNotification('Action "Saisonnier" complétée! +15 XP');
          game.addXP(15);
          break;
      }
      
      // Update people helped
      updatePeopleHelped();
    }
    
    function updatePeopleHelped() {
      // Mock calculation based on user activity
      const currentHelped = parseInt(document.getElementById('peopleHelped').textContent);
      const newHelped = currentHelped + Math.floor(Math.random() * 5) + 1;
      document.getElementById('peopleHelped').textContent = newHelped;
    }
    
    function showWhiteout(message = 'Chargement...') {
      dom.whiteoutText.textContent = message;
      dom.whiteoutOverlay.classList.add('active');
      dom.whiteoutOverlay.setAttribute('aria-hidden', 'false');
    }

    function hideWhiteout() {
      dom.whiteoutOverlay.classList.remove('active');
      dom.whiteoutOverlay.setAttribute('aria-hidden', 'true');
    }

    function flashWhiteout(message, duration = 700) {
      showWhiteout(message);
      setTimeout(hideWhiteout, duration);
    }

    async function withBusyState(button, action, overlayMessage) {
      button.disabled = true;
      const spinner = button.querySelector('.loading-spinner');
      if (spinner) {
        spinner.style.display = 'inline-block';
      }
      showWhiteout(overlayMessage);
      try {
        await action();
      } catch (error) {
        showNotification(`Erreur: ${error}`);
        throw error;
      } finally {
        hideWhiteout();
        button.disabled = false;
        if (spinner) {
          spinner.style.display = 'none';
        }
      }
    }

    // === Improved Notifications ===
    function showNotification(message) {
      // Create a custom notification instead of using alert
      const notification = document.createElement('div');
      notification.className = 'custom-notification';
      notification.textContent = message;
      document.body.appendChild(notification);
      
      // Remove notification after 3 seconds
      setTimeout(() => {
        notification.remove();
      }, 3000);
    }
    
    // === Initialization ===
    function init() {
      updateUserUI();
      displayRecipes();
      updateConnectionStatus();
      updateGameHUD();
      setupIngredientSlots();
      
      // Check if user is already logged in
      const savedUser = JSON.parse(localStorage.getItem('currentUser'));
      if (savedUser) {
        dom.currentUser.textContent = savedUser.name;
        dom.loginBtn.style.display = 'none';
        dom.logoutBtn.style.display = 'block';
        dom.sessionSustainability.style.display = 'block';
        startSessionTimer();
      }
      
      // Initialize eco recipe count
      updateEcoRecipeCount();
      
      // Auto-sync Siebel every 30 seconds if connected
      setInterval(() => {
        if (siebelConnection.isConnected) {
          siebelConnection.syncData();
        }
      }, 30000);
      
      // Add event listener for window closing to save session data
      window.addEventListener('beforeunload', function() {
        if (localStorage.getItem('currentUser')) {
          // Save session data
          localStorage.setItem('sessionSeconds', sessionSeconds);
        }
      });

      document.querySelectorAll('.chip[data-filter]').forEach(button => {
        button.addEventListener('click', () => {
          document.querySelectorAll('.chip[data-filter]').forEach(chip => chip.classList.remove('active'));
          button.classList.add('active');
          recipeFilter = button.dataset.filter;
          displayRecipes();
        });
      });

      document.querySelectorAll('.chip[data-sort]').forEach(button => {
        button.addEventListener('click', () => {
          document.querySelectorAll('.chip[data-sort]').forEach(chip => chip.classList.remove('active'));
          button.classList.add('active');
          recipeSort = button.dataset.sort;
          displayRecipes();
        });
      });

      dom.changeUserBtn?.addEventListener('click', changeUser);
      dom.loginBtn?.addEventListener('click', showLoginModal);
      dom.logoutBtn?.addEventListener('click', logout);
      dom.connectButton?.addEventListener('click', toggleSiebelConnection);
      dom.syncButton?.addEventListener('click', syncWithSiebel);
      dom.simulateDataBtn?.addEventListener('click', simulateRandomData);
      dom.quickGenerateBtn?.addEventListener('click', generateSmartRecipe);
      dom.panelGenerateBtn?.addEventListener('click', generateSmartRecipe);
      dom.recipeForm?.addEventListener('submit', saveRecipe);
      dom.offsetCarbonBtn?.addEventListener('click', offsetCarbon);
      document.querySelectorAll('[data-action]').forEach(button => {
        button.addEventListener('click', () => completeAction(button.dataset.action));
      });
      dom.closeLoginModalBtn?.addEventListener('click', closeLoginModal);
      dom.closeLoginModalBtn?.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          closeLoginModal();
        }
      });
      dom.loginForm?.addEventListener('submit', handleLogin);
      dom.loginGoogleBtn?.addEventListener('click', loginWithGoogle);
      dom.loginGithubBtn?.addEventListener('click', loginWithGithub);

      let savedExperience = JSON.parse(localStorage.getItem(experienceSettingsKey) || '{}');
      Object.entries(savedExperience).forEach(([key, value]) => {
        document.body.dataset[key] = String(value);
      });
      document.querySelectorAll('.toggle-btn').forEach(button => {
        const toggleKey = interactionToggles[button.dataset.toggle];
        const isActive = document.body.dataset[toggleKey] === 'true';
        setToggleState(button, isActive);
        button.addEventListener('click', () => {
          const nextState = document.body.dataset[toggleKey] !== 'true';
          document.body.dataset[toggleKey] = String(nextState);
          setToggleState(button, nextState);
          savedExperience = {
            ...savedExperience,
            [toggleKey]: nextState
          };
          localStorage.setItem(experienceSettingsKey, JSON.stringify(savedExperience));
        });
      });

      document.getElementById('shuffleIngredients').addEventListener('click', shuffleIngredients);
      document.getElementById('autoCook').addEventListener('click', autoCook);
    }

    window.onload = init;
