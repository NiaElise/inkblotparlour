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
    const worlds = StoryworldService.getUserStoryworlds(CURRENT_USER.id);
    res.json(worlds);
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

const PORT = 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server running on http://0.0.0.0:${PORT}`);
});
