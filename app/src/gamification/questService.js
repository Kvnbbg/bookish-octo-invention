import crypto from 'crypto';

export const ACTION_TYPES = {
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

const DEFAULT_QUESTS = [
  {
    id: 'quest-recipe-hero',
    title: 'Cuisinier créatif',
    description: 'Ajoutez une nouvelle recette originale à votre carnet.',
    action: ACTION_TYPES.RECIPE_CREATED,
    target: 1,
    xpReward: 40,
    goldReward: 12,
    gemsReward: 0
  },
  {
    id: 'quest-green-guardian',
    title: 'Gardien vert',
    description: 'Réalisez deux actions durables pour votre communauté.',
    action: ACTION_TYPES.SUSTAINABILITY_ACTION,
    target: 2,
    xpReward: 65,
    goldReward: 15,
    gemsReward: 1
  },
  {
    id: 'quest-sync-champion',
    title: 'Pilote synchronisé',
    description: 'Synchronisez vos données Siebel au moins une fois.',
    action: ACTION_TYPES.SIEBEL_SYNC,
    target: 1,
    xpReward: 45,
    goldReward: 10,
    gemsReward: 0
  },
  {
    id: 'quest-morning-boost',
    title: 'Connexion inspirée',
    description: 'Connectez-vous pour démarrer une nouvelle journée de missions.',
    action: ACTION_TYPES.SESSION_LOGIN,
    target: 1,
    xpReward: 30,
    goldReward: 6,
    gemsReward: 0
  },
  {
    id: 'quest-chef-duel',
    title: 'Défi cuisson',
    description: 'Réussissez un challenge de cuisson dans le mini-jeu.',
    action: ACTION_TYPES.COOKING_CHALLENGE,
    target: 1,
    xpReward: 50,
    goldReward: 14,
    gemsReward: 1
  }
];

const ACTION_REWARDS = {
  [ACTION_TYPES.RECIPE_CREATED]: { xp: 25, gold: 5, gems: 0 },
  [ACTION_TYPES.SUSTAINABILITY_ACTION]: { xp: 30, gold: 8, gems: 0 },
  [ACTION_TYPES.SIEBEL_SYNC]: { xp: 20, gold: 6, gems: 0 },
  [ACTION_TYPES.SESSION_LOGIN]: { xp: 18, gold: 4, gems: 0 },
  [ACTION_TYPES.COOKING_CHALLENGE]: { xp: 28, gold: 7, gems: 1 },
  [ACTION_TYPES.SESSION_MILESTONE]: { xp: 14, gold: 4, gems: 0 },
  [ACTION_TYPES.CARBON_OFFSET]: { xp: 22, gold: 6, gems: 0 },
  [ACTION_TYPES.REGION_DISCOVERY]: { xp: 26, gold: 7, gems: 0 },
  [ACTION_TYPES.ASTEROID_SCAN]: { xp: 16, gold: 5, gems: 0 }
};

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

class QuestService {
  constructor(quests = DEFAULT_QUESTS) {
    this.quests = quests;
    this.userState = new Map();
  }

  listQuests() {
    return [...this.quests];
  }

  resetAll() {
    this.userState.clear();
  }

  getProgress(userId) {
    const state = this.#getUserState(userId);
    this.#refreshDailyQuests(state);
    return this.#formatState(state);
  }

  recordAction(userId, actionType, metadata = {}) {
    if (!ACTION_REWARDS[actionType]) {
      throw new Error(`Unsupported action type: ${actionType}`);
    }

    const state = this.#getUserState(userId);
    this.#refreshDailyQuests(state);

    const events = [];
    const reward = this.#calculateReward(actionType, metadata);
    const previousLevel = state.level;

    this.#applyReward(state, reward);

    if (state.level > previousLevel) {
      events.push({ type: 'level-up', message: `Niveau ${state.level} atteint !` });
    }

    this.#updateStreak(state);
    this.#updateQuestProgress(state, actionType, metadata, events);

    const formatted = this.#formatState(state);
    return { state: formatted, events };
  }

  #calculateReward(actionType, metadata) {
    const baseReward = ACTION_REWARDS[actionType];
    const multiplier = Number.isFinite(metadata.multiplier) ? Math.max(metadata.multiplier, 0) : 1;
    const bonusXp = Number.isFinite(metadata.bonusXp) ? metadata.bonusXp : 0;
    return {
      xp: Math.max(0, Math.round((baseReward.xp + bonusXp) * multiplier)),
      gold: Math.max(0, Math.round(baseReward.gold * multiplier)),
      gems: Math.max(0, Math.round(baseReward.gems * multiplier))
    };
  }

  #applyReward(state, reward) {
    state.totalXP += reward.xp;
    state.gold += reward.gold;
    state.gems += reward.gems;

    const levelData = this.#calculateLevel(state.totalXP);
    state.level = levelData.level;
    state.xpIntoLevel = levelData.xpIntoLevel;
    state.xpToNextLevel = levelData.xpToNextLevel;
    state.lastUpdated = new Date().toISOString();
  }

  #updateQuestProgress(state, actionType, metadata, events) {
    const increment = Number.isFinite(metadata.count) ? Math.max(0, metadata.count) : 1;
    this.quests
      .filter((quest) => quest.action === actionType)
      .forEach((quest) => {
        const questState = state.quests.get(quest.id);
        if (!questState.completed) {
          questState.progress = Math.min(quest.target, questState.progress + increment);
          if (questState.progress >= quest.target) {
            questState.completed = true;
            questState.completedAt = new Date().toISOString();
            this.#applyReward(state, {
              xp: quest.xpReward,
              gold: quest.goldReward,
              gems: quest.gemsReward
            });
            events.push({
              type: 'quest-completed',
              message: `Quête terminée : ${quest.title}`
            });
          }
        }
      });
  }

  #updateStreak(state) {
    const today = todayKey();
    if (state.lastActionDay === today) {
      return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = yesterday.toISOString().slice(0, 10);

    if (state.lastActionDay === yesterdayKey) {
      state.streak += 1;
    } else {
      state.streak = 1;
    }

    state.lastActionDay = today;
  }

  #refreshDailyQuests(state) {
    const today = todayKey();
    if (state.dailyResetKey === today) {
      return;
    }

    state.dailyResetKey = today;
    this.quests.forEach((quest) => {
      const questState = state.quests.get(quest.id);
      questState.progress = 0;
      questState.completed = false;
      questState.completedAt = null;
    });
  }

  #getUserState(userId) {
    if (!this.userState.has(userId)) {
      const questStates = new Map();
      this.quests.forEach((quest) => {
        questStates.set(quest.id, {
          progress: 0,
          completed: false,
          completedAt: null
        });
      });

      this.userState.set(userId, {
        id: userId,
        totalXP: 0,
        xpIntoLevel: 0,
        xpToNextLevel: 100,
        level: 1,
        gold: 0,
        gems: 0,
        streak: 0,
        lastActionDay: null,
        dailyResetKey: todayKey(),
        lastUpdated: new Date().toISOString(),
        quests: questStates
      });
    }

    return this.userState.get(userId);
  }

  #calculateLevel(totalXP) {
    const baseXp = 100;
    const level = Math.floor(totalXP / baseXp) + 1;
    const xpIntoLevel = totalXP % baseXp;
    const xpToNextLevel = baseXp - xpIntoLevel || baseXp;
    return { level, xpIntoLevel, xpToNextLevel };
  }

  #formatState(state) {
    return {
      id: state.id,
      level: state.level,
      totalXP: state.totalXP,
      xpIntoLevel: state.xpIntoLevel,
      xpToNextLevel: state.xpToNextLevel,
      gold: state.gold,
      gems: state.gems,
      streak: state.streak,
      lastUpdated: state.lastUpdated,
      questProgress: this.quests.map((quest) => {
        const questState = state.quests.get(quest.id);
        const progressPercent = Math.round((questState.progress / quest.target) * 100);
        return {
          id: quest.id,
          title: quest.title,
          description: quest.description,
          action: quest.action,
          target: quest.target,
          progress: questState.progress,
          progressPercent,
          completed: questState.completed,
          xpReward: quest.xpReward,
          goldReward: quest.goldReward,
          gemsReward: quest.gemsReward,
          completedAt: questState.completedAt
        };
      })
    };
  }
}

const questService = new QuestService();

export function createAnonymousUserId() {
  return `anon-${crypto.randomBytes(10).toString('hex')}`;
}

export default questService;
