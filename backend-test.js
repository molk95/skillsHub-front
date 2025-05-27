const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:49243', 'http://localhost:49454'],
  credentials: true
}));
app.use(express.json());

// Données de test
const sampleCommunities = [
  {
    _id: '6803bfa3af763b96bbb56cd9',
    name: 'Développeurs JavaScript',
    description: 'Communauté pour les passionnés de JavaScript et Node.js',
    creator: '64f8b8e55a1c9b1c5e8b4567',
    members: ['64f8b8e55a1c9b1c5e8b4567', '64f8b8e55a1c9b1c5e8b4568'],
    createdAt: '2024-01-15T10:00:00Z',
    tags: ['javascript', 'nodejs', 'web']
  },
  {
    _id: '6831bbdc6f8a325afede1885',
    name: 'Designers UI/UX',
    description: 'Échanges et partages autour du design d\'interface',
    creator: '64f8b8e55a1c9b1c5e8b4569',
    members: ['64f8b8e55a1c9b1c5e8b4569', '64f8b8e55a1c9b1c5e8b4567'],
    createdAt: '2024-01-20T14:30:00Z',
    tags: ['design', 'ui', 'ux']
  },
  {
    _id: '6831bbdc6f8a325afede1886',
    name: 'Data Scientists',
    description: 'Communauté dédiée à la science des données et l\'IA',
    creator: '64f8b8e55a1c9b1c5e8b4567',
    members: ['64f8b8e55a1c9b1c5e8b4567'],
    createdAt: '2024-01-25T09:15:00Z',
    tags: ['data', 'ai', 'python']
  }
];

const sampleEvents = [
  {
    _id: '67dea87c2f7de52f2ddfb22e',
    id: '67dea87c2f7de52f2ddfb22e',
    title: 'Workshop JavaScript Avancé',
    description: 'Apprenez les concepts avancés de JavaScript',
    location: 'Paris, France',
    date: '2024-03-15',
    startTime: '14:00',
    endTime: '17:00',
    organizer: '64f8b8e55a1c9b1c5e8b4567',
    creator: '67dea87c2f7de52f2ddfb22e',
    community: '6803bfa3af763b96bbb56cd9',
    participants: ['64f8b8e55a1c9b1c5e8b4567'],
    maxParticipants: 50,
    imageUrl: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=400',
    tags: ['javascript', 'workshop'],
    isOnline: false,
    meetingLink: ''
  },
  {
    _id: '67dea87c2f7de52f2ddfb22f',
    id: '67dea87c2f7de52f2ddfb22f',
    title: 'Conférence Design Thinking',
    description: 'Découvrez les méthodes de design thinking',
    location: 'Lyon, France',
    date: '2024-03-20',
    startTime: '10:00',
    endTime: '16:00',
    organizer: '64f8b8e55a1c9b1c5e8b4569',
    creator: '67dea87c2f7de52f2ddfb22f',
    community: '6831bbdc6f8a325afede1885',
    participants: [],
    maxParticipants: 100,
    imageUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400',
    tags: ['design', 'thinking'],
    isOnline: true,
    meetingLink: 'https://meet.google.com/abc-def-ghi'
  }
];

const sampleForums = [
  {
    id: 'forum-1',
    _id: 'forum-1',
    title: 'Meilleures pratiques JavaScript 2024',
    content: 'Quelles sont selon vous les meilleures pratiques à adopter en JavaScript cette année ?',
    creator: '64f8b8e55a1c9b1c5e8b4567',
    community: '6803bfa3af763b96bbb56cd9',
    created_at: '2024-01-16T10:00:00Z',
    viewCount: 45,
    likeCount: 12,
    tags: ['javascript', 'best-practices']
  },
  {
    id: 'forum-2',
    _id: 'forum-2',
    title: 'Tendances UI/UX 2024',
    content: 'Parlons des nouvelles tendances en design d\'interface pour cette année.',
    creator: '64f8b8e55a1c9b1c5e8b4569',
    community: '6831bbdc6f8a325afede1885',
    created_at: '2024-01-21T15:30:00Z',
    viewCount: 67,
    likeCount: 23,
    tags: ['ui', 'ux', 'trends']
  }
];

// Routes pour les communautés
app.get('/api/communities', (req, res) => {
  console.log('📋 GET /api/communities appelé');
  res.json({
    success: true,
    data: sampleCommunities,
    message: 'Communautés récupérées avec succès'
  });
});

app.get('/api/communities/:id', (req, res) => {
  console.log('🔍 GET /api/communities/:id appelé pour ID:', req.params.id);
  const community = sampleCommunities.find(c => c._id === req.params.id);

  if (!community) {
    return res.status(404).json({
      success: false,
      message: 'Communauté non trouvée'
    });
  }

  res.json({
    success: true,
    data: community,
    message: 'Communauté récupérée avec succès'
  });
});

app.post('/api/communities/:id/members/:userId', (req, res) => {
  console.log('➕ POST /api/communities/:id/members/:userId appelé');
  const { id, userId } = req.params;
  const community = sampleCommunities.find(c => c._id === id);

  if (!community) {
    return res.status(404).json({
      success: false,
      message: 'Communauté non trouvée'
    });
  }

  if (!community.members.includes(userId)) {
    community.members.push(userId);
  }

  res.json({
    success: true,
    data: community,
    message: 'Membre ajouté avec succès'
  });
});

app.put('/api/communities/:id', (req, res) => {
  console.log('✏️ PUT /api/communities/:id appelé pour ID:', req.params.id);
  const community = sampleCommunities.find(c => c._id === req.params.id);

  if (!community) {
    return res.status(404).json({
      success: false,
      message: 'Communauté non trouvée'
    });
  }

  // Mettre à jour les champs
  if (req.body.name) community.name = req.body.name;
  if (req.body.description) community.description = req.body.description;

  res.json({
    success: true,
    data: community,
    message: 'Communauté mise à jour avec succès'
  });
});

app.delete('/api/communities/:id', (req, res) => {
  console.log('🗑️ DELETE /api/communities/:id appelé pour ID:', req.params.id);
  res.json({
    success: true,
    message: 'Communauté supprimée avec succès'
  });
});

// Routes pour les événements
app.get('/api/events', (req, res) => {
  console.log('📅 GET /api/events appelé');
  res.json({
    success: true,
    data: sampleEvents,
    message: 'Événements récupérés avec succès'
  });
});

app.get('/api/events/:id', (req, res) => {
  console.log('🔍 GET /api/events/:id appelé pour ID:', req.params.id);
  const event = sampleEvents.find(e => e._id === req.params.id || e.id === req.params.id);

  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Événement non trouvé'
    });
  }

  res.json({
    success: true,
    data: event,
    message: 'Événement récupéré avec succès'
  });
});

app.put('/api/events/:id', (req, res) => {
  console.log('✏️ PUT /api/events/:id appelé pour ID:', req.params.id);
  const event = sampleEvents.find(e => e._id === req.params.id || e.id === req.params.id);

  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Événement non trouvé'
    });
  }

  // Mettre à jour les champs
  Object.keys(req.body).forEach(key => {
    if (req.body[key] !== undefined) {
      event[key] = req.body[key];
    }
  });

  res.json({
    success: true,
    data: event,
    message: 'Événement mis à jour avec succès'
  });
});

app.delete('/api/events/:id', (req, res) => {
  console.log('🗑️ DELETE /api/events/:id appelé pour ID:', req.params.id);
  res.json({
    success: true,
    message: 'Événement supprimé avec succès'
  });
});

// Routes pour les forums
app.get('/api/forums', (req, res) => {
  console.log('💬 GET /api/forums appelé');
  res.json({
    success: true,
    data: sampleForums,
    message: 'Forums récupérés avec succès'
  });
});

app.get('/api/forums/:id', (req, res) => {
  console.log('🔍 GET /api/forums/:id appelé pour ID:', req.params.id);
  const forum = sampleForums.find(f => f.id === req.params.id || f._id === req.params.id);

  if (!forum) {
    return res.status(404).json({
      success: false,
      message: 'Forum non trouvé'
    });
  }

  res.json({
    success: true,
    data: forum,
    message: 'Forum récupéré avec succès'
  });
});

app.post('/api/forums', (req, res) => {
  console.log('➕ POST /api/forums appelé');
  const newForum = {
    id: 'forum-' + Date.now(),
    _id: 'forum-' + Date.now(),
    ...req.body,
    created_at: new Date().toISOString(),
    viewCount: 0,
    likeCount: 0
  };

  sampleForums.push(newForum);

  res.json({
    success: true,
    data: newForum,
    message: 'Forum créé avec succès'
  });
});

app.put('/api/forums/:id', (req, res) => {
  console.log('✏️ PUT /api/forums/:id appelé pour ID:', req.params.id);
  const forumIndex = sampleForums.findIndex(f => f.id === req.params.id || f._id === req.params.id);

  if (forumIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Forum non trouvé'
    });
  }

  // Mettre à jour les champs
  Object.keys(req.body).forEach(key => {
    if (req.body[key] !== undefined) {
      sampleForums[forumIndex][key] = req.body[key];
    }
  });

  res.json({
    success: true,
    data: sampleForums[forumIndex],
    message: 'Forum mis à jour avec succès'
  });
});

app.delete('/api/forums/:id', (req, res) => {
  console.log('🗑️ DELETE /api/forums/:id appelé pour ID:', req.params.id);
  const forumIndex = sampleForums.findIndex(f => f.id === req.params.id || f._id === req.params.id);

  if (forumIndex !== -1) {
    sampleForums.splice(forumIndex, 1);
  }

  res.json({
    success: true,
    message: 'Forum supprimé avec succès'
  });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur de test démarré sur http://localhost:${PORT}`);
  console.log(`📋 ${sampleCommunities.length} communautés disponibles`);
  console.log(`📅 ${sampleEvents.length} événements disponibles`);
  console.log(`💬 ${sampleForums.length} forums disponibles`);
});
