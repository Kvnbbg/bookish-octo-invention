import express from 'express';

const router = express.Router();

const allowedStatuses = [
  'New',
  'Qualified',
  'Quote sent',
  'Awaiting response',
  'Won',
  'Lost'
];

const bookings = [
  {
    id: 'bk-1001',
    client: 'Maison Dupont',
    service: 'Deep clean + windows',
    date: '2024-10-18',
    value: 640,
    status: 'Quote sent',
    owner: 'Amira',
    source: 'Instagram',
    nextStep: 'Follow-up call'
  },
  {
    id: 'bk-1002',
    client: 'Lumière Offices',
    service: 'Weekly maintenance',
    date: '2024-10-21',
    value: 1200,
    status: 'Qualified',
    owner: 'Thomas',
    source: 'Referral',
    nextStep: 'Prepare contract'
  },
  {
    id: 'bk-1003',
    client: 'Cafe Nouvelle',
    service: 'Kitchen sanitation',
    date: '2024-10-16',
    value: 420,
    status: 'Awaiting response',
    owner: 'Lina',
    source: 'Website',
    nextStep: 'Send reminder'
  },
  {
    id: 'bk-1004',
    client: 'Residences Alto',
    service: 'Move-out clean',
    date: '2024-10-12',
    value: 980,
    status: 'Won',
    owner: 'Amira',
    source: 'Google Ads',
    nextStep: 'Schedule team'
  }
];

const tasks = [
  {
    id: 'task-1',
    title: {
      en: 'Follow up Maison Dupont after quote',
      fr: 'Relancer Maison Dupont après devis'
    },
    owner: 'Amira',
    due: 'Today'
  },
  {
    id: 'task-2',
    title: {
      en: 'Prep site visit for Lumière Offices',
      fr: 'Préparer la visite Lumière Offices'
    },
    owner: 'Thomas',
    due: 'Tomorrow'
  },
  {
    id: 'task-3',
    title: {
      en: 'Send kickoff checklist',
      fr: 'Envoyer la check-list de démarrage'
    },
    owner: 'Lina',
    due: 'Friday'
  }
];

const formatCurrency = (value) => {
  const numericValue = Number(value) || 0;
  return Number.isNaN(numericValue) ? 0 : numericValue;
};

const buildPipeline = (data) => {
  const total = data.length || 0;
  return allowedStatuses.map((status) => {
    const count = data.filter((booking) => booking.status === status).length;
    const percent = total ? Math.round((count / total) * 100) : 0;
    return { status, count, percent };
  });
};

const buildMetrics = (data) => {
  const activeLeads = data.filter((booking) => !['Won', 'Lost'].includes(booking.status)).length;
  const quotesPending = data.filter((booking) => ['Quote sent', 'Awaiting response'].includes(booking.status)).length;
  const revenueAtRisk = data
    .filter((booking) => ['Quote sent', 'Awaiting response'].includes(booking.status))
    .reduce((sum, booking) => sum + formatCurrency(booking.value), 0);
  const wonDeals = data.filter((booking) => booking.status === 'Won').length;
  const conversionRate = data.length ? Math.round((wonDeals / data.length) * 100) : 0;

  return {
    activeLeads,
    quotesPending,
    revenueAtRisk,
    conversionRate
  };
};

const buildOverview = () => ({
  metrics: buildMetrics(bookings),
  pipeline: buildPipeline(bookings),
  tasks,
  bookings
});

const createId = () => `bk-${Math.random().toString(36).slice(2, 8)}`;

router.get('/overview', (_req, res) => {
  res.json(buildOverview());
});

router.get('/bookings', (_req, res) => {
  res.json({ bookings });
});

router.post('/bookings', (req, res) => {
  const { client, service, date, value, status, owner, source, nextStep } = req.body || {};

  if (!client || !service || !date || !owner) {
    return res.status(400).json({ error: 'Missing required booking fields.' });
  }

  const safeStatus = allowedStatuses.includes(status) ? status : 'New';
  const booking = {
    id: createId(),
    client: String(client).trim(),
    service: String(service).trim(),
    date: String(date).trim(),
    value: Number(value) || 0,
    status: safeStatus,
    owner: String(owner).trim(),
    source: source ? String(source).trim() : 'Website',
    nextStep: nextStep ? String(nextStep).trim() : 'Follow-up'
  };

  bookings.unshift(booking);
  return res.status(201).json({ booking });
});

router.put('/bookings/:id', (req, res) => {
  const { id } = req.params;
  const bookingIndex = bookings.findIndex((booking) => booking.id === id);

  if (bookingIndex === -1) {
    return res.status(404).json({ error: 'Booking not found.' });
  }

  const current = bookings[bookingIndex];
  const { client, service, date, value, status, owner, source, nextStep } = req.body || {};

  bookings[bookingIndex] = {
    ...current,
    client: client !== undefined ? String(client).trim() : current.client,
    service: service !== undefined ? String(service).trim() : current.service,
    date: date !== undefined ? String(date).trim() : current.date,
    value: value !== undefined ? Number(value) || 0 : current.value,
    status: status && allowedStatuses.includes(status) ? status : current.status,
    owner: owner !== undefined ? String(owner).trim() : current.owner,
    source: source !== undefined ? String(source).trim() : current.source,
    nextStep: nextStep !== undefined ? String(nextStep).trim() : current.nextStep
  };

  return res.json({ booking: bookings[bookingIndex] });
});

router.delete('/bookings/:id', (req, res) => {
  const { id } = req.params;
  const bookingIndex = bookings.findIndex((booking) => booking.id === id);

  if (bookingIndex === -1) {
    return res.status(404).json({ error: 'Booking not found.' });
  }

  const [removed] = bookings.splice(bookingIndex, 1);
  return res.json({ booking: removed });
});

export default router;
