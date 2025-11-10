import express from 'express';
import questService, { ACTION_TYPES, createAnonymousUserId } from '../gamification/questService.js';

const router = express.Router();

function resolveUserId(req) {
  if (req.user?.id) {
    return `user-${req.user.id}`;
  }

  if (!req.session.gamificationUserId) {
    const base = req.sessionID || req.ip || createAnonymousUserId();
    req.session.gamificationUserId = `session-${base}`;
  }

  return req.session.gamificationUserId;
}

router.get('/progress', (req, res) => {
  const userId = resolveUserId(req);
  const state = questService.getProgress(userId);
  res.json({ state });
});

router.get('/quests', (req, res) => {
  const userId = resolveUserId(req);
  const state = questService.getProgress(userId);
  res.json({ quests: state.questProgress });
});

router.post('/actions', (req, res) => {
  const { actionType, metadata } = req.body || {};

  if (!actionType) {
    return res.status(400).json({ error: 'actionType is required' });
  }

  try {
    const userId = resolveUserId(req);
    const result = questService.recordAction(userId, actionType, metadata || {});
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/actions', (_req, res) => {
  res.json({ supportedActions: { ...ACTION_TYPES } });
});

export default router;
