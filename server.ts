import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { SocialService } from './backend-src/services/SocialService.js';
import { CircleService } from './backend-src/services/CircleService.js';
import { UserService } from './backend-src/services/UserService.js';
import { StoryworldService } from './backend-src/services/StoryworldService.js';
import { WorldbuildingService } from './backend-src/services/WorldbuildingService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));

// Middleware to get current user from Authorization header
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const userId = authHeader.substring(7);
    const user = UserService.getUser(userId);
    if (user) {
      req.user = user;
      return next();
    }
  }
  // Optional: bypass for login/signup
  if (req.path === '/api/login' || req.path === '/api/signup' || req.path === '/api/feed') {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized' });
};

// Admin only middleware
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Admin access required' });
  }
};

const genId = () => Math.random().toString(36).substring(2, 11);

// --- Auth Loop ---
app.post('/api/signup', (req, res) => {
  const { username, email, password, tier } = req.body;
  if (UserService.getUserByEmail(email)) {
    return res.status(400).json({ error: 'Email already registered' });
  }
  const id = 'user_' + genId();
  UserService.createUser(id, username, tier || 'Draftsman', email, password);
  const newUser = UserService.getUser(id);
  res.json(newUser);
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = UserService.getUserByEmail(email);
  if (user && user.password === password) {
    res.json(user);
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.get('/api/me', auth, (req, res) => {
  res.json(req.user);
});

// --- Admin Loop ---
app.get('/api/admin/users', auth, adminOnly, (req, res) => {
  res.json(UserService.getAllUsers());
});

app.get('/api/admin/storyworlds', auth, adminOnly, (req, res) => {
  res.json(StoryworldService.getAllStoryworlds());
});

app.get('/api/admin/posts', auth, adminOnly, (req, res) => {
  res.json(SocialService.getAllPosts());
});

// --- Social Loop ---
app.get('/api/feed', (req, res) => {
  try {
    const feed = SocialService.getFeed(req.user?.id);
    res.json(feed);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.post('/api/posts', auth, (req, res) => {
  try {
    const id = genId();
    SocialService.createPost(req.user.id, id, req.body.content, req.body.storyworldId, req.body.loreId, req.body.characterId);
    res.json({ id, content: req.body.content });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Post Governance
app.post('/api/posts/:id/archive', auth, (req, res) => {
  try {
    SocialService.archivePost(req.params.id, req.body.isArchived);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.post('/api/posts/:id/hide', auth, (req, res) => {
  try {
    SocialService.hidePost(req.user.id, req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.post('/api/posts/:id/flag', auth, (req, res) => {
  try {
    SocialService.flagPost(req.user.id, req.params.id, req.body.reason);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.post('/api/lore/:id/archive', auth, (req, res) => {
  try {
    WorldbuildingService.archiveLore(req.user.id, req.params.id, req.body.isArchived);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.get('/api/asks', auth, (req, res) => {
  try {
    const asks = SocialService.getAllAsks(req.user.id);
    res.json(asks);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.post('/api/asks', auth, (req, res) => {
  try {
    const id = genId();
    SocialService.createAsk(req.user.id, req.body.recipientId, id, req.body.question);
    res.json({ id, question: req.body.question });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.post('/api/asks/:id/answer', auth, (req, res) => {
  try {
    SocialService.answerAsk(req.user.id, req.params.id, req.body.answer, req.body.isPublic);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.get('/api/journals', auth, (req, res) => {
  try {
    const journals = SocialService.getJournals(req.user.id, req.query.type as any);
    res.json(journals);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.post('/api/journals', auth, (req, res) => {
  try {
    const id = genId();
    SocialService.createJournal(
      req.user.id, 
      id, 
      req.body.title, 
      req.body.content, 
      req.body.type, 
      req.body.chapterNumber, 
      req.body.parentId
    );
    res.json({ id, title: req.body.title });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.get('/api/journals/:parentId/chapters', auth, (req, res) => {
  try {
    const chapters = SocialService.getStoryChapters(req.params.parentId);
    res.json(chapters);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Dictionary Lookup
app.get('/api/dictionary/lookup', auth, async (req, res) => {
  try {
    const word = req.query.word;
    if (!word) return res.status(400).json({ error: 'Word required' });
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Support Messages
app.get('/api/support/messages', auth, (req, res) => {
  try {
    const messages = SocialService.getSupportMessages(req.user.id);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.post('/api/support/messages', auth, (req, res) => {
  try {
    SocialService.createSupportMessage(req.user.id, req.body.message, req.body.sender || 'user');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// --- Writer Circles ---
app.get('/api/circles', (req, res) => {
  try {
    const circles = CircleService.getCircles();
    res.json(circles);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.post('/api/circles', auth, (req, res) => {
  try {
    const id = genId();
    CircleService.createCircle(req.user.id, id, req.body.name, req.body.description);
    res.json({ id, name: req.body.name });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.post('/api/circles/:id/join', auth, (req, res) => {
  try {
    CircleService.joinCircle(req.user.id, req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.get('/api/circles/:id/members', (req, res) => {
  try {
    const members = CircleService.getMembers(req.params.id);
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Writing Rooms
app.get('/api/circles/:id/writing-rooms', auth, (req, res) => {
  try {
    const rooms = CircleService.getWritingRooms(req.params.id);
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.post('/api/circles/:id/writing-rooms', auth, (req, res) => {
  try {
    const id = genId();
    CircleService.createWritingRoom(req.user.id, req.params.id, id, req.body.name, req.body.description);
    res.json({ id, name: req.body.name });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// --- Worldbuilding Loop ---
app.get('/api/storyworlds', auth, (req, res) => {
  try {
    const worlds = StoryworldService.getStoryworlds(req.user.id);
    res.json(worlds);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.post('/api/storyworlds', auth, (req, res) => {
  try {
    const id = genId();
    StoryworldService.createStoryworld(req.user.id, id, req.body.title, req.body.description);
    res.json({ id, title: req.body.title });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.post('/api/storyworlds/:id/members', auth, (req, res) => {
  try {
    StoryworldService.addMember(req.user.id, req.params.id, req.body.userId, req.body.role);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.post('/api/storyworlds/:id/invite', auth, (req, res) => {
  try {
    StoryworldService.inviteMember(req.user.id, req.params.id, req.body.identifier, req.body.role);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.delete('/api/storyworlds/:id/members/:userId', auth, (req, res) => {
  try {
    StoryworldService.removeMember(req.user.id, req.params.id, req.params.userId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Characters
app.get('/api/storyworlds/:id/characters', auth, (req, res) => {
  try {
    const characters = WorldbuildingService.getCharacters(req.user.id, req.params.id);
    res.json(characters);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.post('/api/storyworlds/:id/characters', auth, (req, res) => {
  try {
    const id = genId();
    WorldbuildingService.createCharacter(req.user.id, req.params.id, id, req.body.name, req.body.description, req.body.data);
    res.json({ id, name: req.body.name });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Lore
app.get('/api/storyworlds/:id/lore', auth, (req, res) => {
  try {
    const lore = WorldbuildingService.getLore(req.user.id, req.params.id);
    res.json(lore);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.post('/api/storyworlds/:id/lore', auth, (req, res) => {
  try {
    const id = genId();
    WorldbuildingService.createLore(req.user.id, req.params.id, id, req.body.title, req.body.content, req.body.data);
    res.json({ id, title: req.body.title });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Lore Templates
app.get('/api/lore-templates', auth, (req, res) => {
  try {
    const templates = WorldbuildingService.getLoreTemplates();
    res.json(templates);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.post('/api/storyworlds/:id/apply-template', auth, (req, res) => {
  try {
    WorldbuildingService.applyTemplate(req.user.id, req.params.id, req.body.templateId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Admin Templates
app.post('/api/admin/lore-templates', auth, (req, res) => {
  try {
    if (req.user.role !== 'admin') throw new Error('Unauthorized');
    const id = genId();
    WorldbuildingService.createLoreTemplate(id, req.body.name, req.body.genre, req.body.description);
    res.json({ id, name: req.body.name });
  } catch (err) {
    res.status(403).json({ error: (err as Error).message });
  }
});

app.post('/api/admin/lore-templates/:id/fragments', auth, (req, res) => {
  try {
    if (req.user.role !== 'admin') throw new Error('Unauthorized');
    const id = genId();
    WorldbuildingService.addTemplateFragment(id, req.params.id, req.body.title, req.body.content, req.body.category);
    res.json({ id, title: req.body.title });
  } catch (err) {
    res.status(403).json({ error: (err as Error).message });
  }
});

app.post('/api/admin/lore-templates/:id/characters', auth, (req, res) => {
  try {
    if (req.user.role !== 'admin') throw new Error('Unauthorized');
    const id = genId();
    WorldbuildingService.addTemplateCharacter(id, req.params.id, req.body.name, req.body.role, req.body.description);
    res.json({ id, name: req.body.name });
  } catch (err) {
    res.status(403).json({ error: (err as Error).message });
  }
});

// Gated Features (Secrets, Tension, Timelines)
app.get('/api/storyworlds/:id/secrets', auth, (req, res) => {
  try {
    const secrets = WorldbuildingService.getSecrets(req.user.id, req.params.id);
    res.json(secrets);
  } catch (err) {
    res.status(403).json({ error: (err as Error).message });
  }
});

app.post('/api/storyworlds/:id/secrets', auth, (req, res) => {
  try {
    const id = genId();
    WorldbuildingService.createSecret(req.user.id, req.params.id, id, req.body.title, req.body.content);
    res.json({ id, title: req.body.title });
  } catch (err) {
    res.status(403).json({ error: (err as Error).message });
  }
});

app.get('/api/storyworlds/:id/tension', auth, (req, res) => {
  try {
    const maps = WorldbuildingService.getTensionMaps(req.user.id, req.params.id);
    res.json(maps);
  } catch (err) {
    res.status(403).json({ error: (err as Error).message });
  }
});

app.get('/api/storyworlds/:id/timelines', auth, (req, res) => {
  try {
    const timelines = WorldbuildingService.getTimelines(req.user.id, req.params.id);
    res.json(timelines);
  } catch (err) {
    res.status(403).json({ error: (err as Error).message });
  }
});

// Catch-all route to serve the frontend for any non-API requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Backend server running on http://0.0.0.0:${PORT}`);
});
