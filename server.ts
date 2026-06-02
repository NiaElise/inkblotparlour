import express from 'express';
import cors from 'cors';
import { SocialService } from './backend-src/services/SocialService.js';
import { CircleService } from './backend-src/services/CircleService.js';
import { UserService } from './backend-src/services/UserService.js';
import { StoryworldService } from './backend-src/services/StoryworldService.js';
import { WorldbuildingService } from './backend-src/services/WorldbuildingService.js';

const app = express();
app.use(cors());
app.use(express.json());

// Mock Auth
const CURRENT_USER = {
  id: 'user_dev_1',
  username: 'The Architect',
  tier: 'Collective'
};

const genId = () => Math.random().toString(36).substring(2, 11);

// --- Social Loop ---
app.get('/api/feed', (req, res) => {
  try {
    const feed = SocialService.getFeed();
    res.json(feed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/posts', (req, res) => {
  try {
    const id = genId();
    SocialService.createPost(CURRENT_USER.id, id, req.body.content, req.body.storyworldId);
    res.json({ id, content: req.body.content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/posts/:id', (req, res) => {
  try {
    SocialService.updatePost(req.params.id, req.body.content);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/journals', (req, res) => {
  try {
    const journals = SocialService.getJournals(CURRENT_USER.id);
    res.json(journals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/journals', (req, res) => {
  try {
    const id = genId();
    SocialService.createJournal(CURRENT_USER.id, id, req.body.title, req.body.content);
    res.json({ id, title: req.body.title });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/journals/:id', (req, res) => {
  try {
    SocialService.updateJournal(req.params.id, req.body.title, req.body.content);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/asks', (req, res) => {
  try {
    const asks = SocialService.getAllAsks(CURRENT_USER.id);
    res.json(asks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/asks/:id', (req, res) => {
  try {
    SocialService.answerAsk(req.params.id, req.body.answer, req.body.isPublic);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Writer Circles ---
app.get('/api/circles', (req, res) => {
  try {
    const circles = CircleService.getCircles();
    res.json(circles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/circles', (req, res) => {
  try {
    const id = genId();
    CircleService.createCircle(CURRENT_USER.id, id, req.body.name, req.body.description);
    res.json({ id, name: req.body.name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/circles/join', (req, res) => {
  try {
    CircleService.joinCircle(CURRENT_USER.id, req.body.circleId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- User / Aesthetic ---
app.get('/api/user/customization', (req, res) => {
  try {
    const user = UserService.getUser(CURRENT_USER.id);
    res.json(user?.customization ? JSON.parse(user.customization) : {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/user/customization', (req, res) => {
  try {
    UserService.updateCustomization(CURRENT_USER.id, JSON.stringify(req.body));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Worldbuilding ---
app.get('/api/storyworlds', (req, res) => {
  try {
    const worlds = StoryworldService.getStoryworlds(CURRENT_USER.id);
    res.json(worlds);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/storyworlds/:id', (req, res) => {
  try {
    const world = StoryworldService.getStoryworld(req.params.id);
    res.json(world);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/storyworlds', (req, res) => {
  try {
    const id = genId();
    StoryworldService.createStoryworld(CURRENT_USER.id, id, req.body.name, req.body.description);
    res.json({ id, name: req.body.name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/storyworlds/:id', (req, res) => {
  try {
    StoryworldService.updateStoryworld(req.params.id, req.body.name, req.body.description);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Characters
app.get('/api/storyworlds/:id/characters', (req, res) => {
  try {
    const characters = WorldbuildingService.getCharacters(req.params.id);
    res.json(characters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/storyworlds/:id/characters', (req, res) => {
  try {
    const id = genId();
    WorldbuildingService.createCharacter(req.params.id, id, req.body.name, req.body.description, req.body.data);
    res.json({ id, name: req.body.name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/characters/:id', (req, res) => {
  try {
    WorldbuildingService.updateCharacter(req.params.id, req.body.name, req.body.description, req.body.data);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Lore
app.get('/api/storyworlds/:id/lore', (req, res) => {
  try {
    const lore = WorldbuildingService.getLore(req.params.id);
    res.json(lore);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/storyworlds/:id/lore', (req, res) => {
  try {
    const id = genId();
    WorldbuildingService.createLore(req.params.id, id, req.body.title, req.body.content, req.body.data);
    res.json({ id, title: req.body.title });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/lore/:id', (req, res) => {
  try {
    WorldbuildingService.updateLore(req.params.id, req.body.title, req.body.content, req.body.data);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Secrets
app.get('/api/storyworlds/:id/secrets', (req, res) => {
  try {
    const secrets = WorldbuildingService.getSecrets(CURRENT_USER.id, req.params.id);
    res.json(secrets);
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
});

app.post('/api/storyworlds/:id/secrets', (req, res) => {
  try {
    const id = genId();
    WorldbuildingService.createSecret(CURRENT_USER.id, req.params.id, id, req.body.title, req.body.content);
    res.json({ id, title: req.body.title });
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
});

app.put('/api/secrets/:id', (req, res) => {
  try {
    WorldbuildingService.updateSecret(CURRENT_USER.id, req.params.id, req.body.title, req.body.content);
    res.json({ success: true });
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
});

// Tension Maps
app.get('/api/storyworlds/:id/tension', (req, res) => {
  try {
    const maps = WorldbuildingService.getTensionMaps(CURRENT_USER.id, req.params.id);
    res.json(maps);
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
});

app.post('/api/storyworlds/:id/tension', (req, res) => {
  try {
    const id = genId();
    WorldbuildingService.createTensionMap(CURRENT_USER.id, req.params.id, id, req.body.data);
    res.json({ id });
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
});

app.put('/api/tension/:id', (req, res) => {
  try {
    WorldbuildingService.updateTensionMap(CURRENT_USER.id, req.params.id, req.body.data);
    res.json({ success: true });
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
});

// Timelines
app.get('/api/storyworlds/:id/timelines', (req, res) => {
  try {
    const timelines = WorldbuildingService.getTimelines(CURRENT_USER.id, req.params.id);
    res.json(timelines);
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
});

app.post('/api/storyworlds/:id/timelines', (req, res) => {
  try {
    const id = genId();
    WorldbuildingService.createTimeline(CURRENT_USER.id, req.params.id, id, req.body.title, req.body.events);
    res.json({ id, title: req.body.title });
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
});

app.put('/api/timelines/:id', (req, res) => {
  try {
    WorldbuildingService.updateTimeline(CURRENT_USER.id, req.params.id, req.body.title, req.body.events);
    res.json({ success: true });
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
});

const PORT = 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server running on http://0.0.0.0:${PORT}`);
});
