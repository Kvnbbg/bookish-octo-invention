import test from 'node:test';
import assert from 'node:assert/strict';
import questService, { ACTION_TYPES, createAnonymousUserId } from '../src/gamification/questService.js';

test('initial progress exposes default quests', () => {
  questService.resetAll();
  const userId = createAnonymousUserId();
  const state = questService.getProgress(userId);

  assert.equal(state.level, 1);
  assert.equal(state.totalXP, 0);
  assert.ok(Array.isArray(state.questProgress));
  assert.ok(state.questProgress.length > 0);
});

test('recipe creation action increases XP and quest progress', () => {
  questService.resetAll();
  const userId = createAnonymousUserId();

  const result = questService.recordAction(userId, ACTION_TYPES.RECIPE_CREATED, {
    recipeName: 'Galactic ramen'
  });

  assert.ok(result.state.totalXP > 0);
  const recipeQuest = result.state.questProgress.find((quest) => quest.id === 'quest-recipe-hero');
  assert.ok(recipeQuest);
  assert.equal(recipeQuest.progress, 1);
  assert.equal(recipeQuest.completed, true);
});

test('sustainability quest completes after required actions', () => {
  questService.resetAll();
  const userId = createAnonymousUserId();

  questService.recordAction(userId, ACTION_TYPES.SUSTAINABILITY_ACTION, { count: 1 });
  const result = questService.recordAction(userId, ACTION_TYPES.SUSTAINABILITY_ACTION, { count: 1 });

  const greenQuest = result.state.questProgress.find((quest) => quest.id === 'quest-green-guardian');
  assert.ok(greenQuest.completed);
  assert.ok(result.events.some((event) => event.type === 'quest-completed'));
});

test('mixed actions update streak and award rewards', () => {
  questService.resetAll();
  const userId = createAnonymousUserId();

  const syncResult = questService.recordAction(userId, ACTION_TYPES.SIEBEL_SYNC);
  const cookResult = questService.recordAction(userId, ACTION_TYPES.COOKING_CHALLENGE, { multiplier: 1.5 });

  assert.ok(syncResult.state.totalXP >= 0);
  assert.ok(cookResult.state.totalXP > syncResult.state.totalXP);
  assert.ok(cookResult.state.streak >= 1);
});
