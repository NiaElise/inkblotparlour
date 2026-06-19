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
const auth = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const userId = authHeader.substring(7);
    try {
      const user = await UserService.getUser(userId);
      if (user) {
        req.user = user;
        return next();
      }
    } catch (err) {
      console.error('Auth middleware error:', err);
    }
  }
  // Optional: bypass for login/signup
  if (req.path === '/api/login' || req.path === '/api/signup' || req.path === '/api/feed') {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized' });
};

// Admin only middleware
const adminOnly = (req: any, res: any, next: any) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Admin access required' });
  }
};

const genId = () => Math.random().toString(36).substring(2, 11);

// --- Auth Loop ---
app.post('/api/signup', async (req, res) => {
  try {
    const { username, email, password, tier } = req.body;
    const existing = await UserService.getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    const id = 'user_' + genId();
    await UserService.createUser(id, username, tier || 'Draftsman', email, password);
    const newUser = await UserService.getUser(id);
    res.json(newUser);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserService.getUserByEmail(email);
    if (user && user.password === password) {
      res.json(user);
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await UserService.getUser(req.params.id);
    if (user) {
      const { password, ...safeUser } = user;
      res.json(safeUser);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.get('/api/users/:id/storyworlds', async (req, res) => {
  try {
    const worlds = await StoryworldService.getStoryworlds(req.params.id);
    res.json(worlds);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.get('/api/users/:id/posts', async (req, res) => {
  try {
    const posts = await SocialService.getUserPosts(req.params.id);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.put('/api/me/profile', auth, async (req: any, res) => {
  try {
    await UserService.updateProfile(req.user.id, req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.put('/api/me/security', auth, async (req: any, res) => {
  try {
    await UserService.updateSecurity(req.user.id, req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.put('/api/me/customization', auth, async (req: any, res) => {
  try {
    await UserService.updateCustomization(req.user.id, req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// --- Admin Loop ---
app.get('/api/admin/users', auth, adminOnly, async (req, res) => {
  try {
    const users = await UserService.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.get('/api/admin/storyworlds', auth, adminOnly, async (req, res) => {
  try {
    const worlds = await StoryworldService.getAllStoryworlds();
    res.json(worlds);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.get('/api/admin/posts', auth, adminOnly, async (req, res) => {
  try {
    const posts = await SocialService.getAllPosts();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// --- Social Loop ---
app.get('/api/feed', auth, async (req: any, res) => {
  try {
    const feed = await SocialService.getFeed(req.user?.id);
    res.json(feed);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.post('/api/posts', auth, async (req: any, res) => {
  try {
    const id = genId();
    await SocialService.createPost(req.user.id, id, req.body.content, req.body.storyworldId, req.body.loreId, req.body.characterId);
    res.json({ id, content: req.body.content });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Post Governance
app.post('/api/posts/:id/archive', auth, async (req: any, res) => {
  try {
    await SocialService.archivePost(req.params.id, req.body.isArchived);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.post('/api/posts/:id/hide', auth, async (req: any, res) => {
  try {
    await SocialService.hidePost(req.user.id, req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.post('/api/posts/:id/flag', auth, async (req: any, res) => {
  try {
    await SocialService.flagPost(req.user.id, req.params.id, req.body.reason);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.post('/api/lore/:id/archive', auth, async (req: any, res) => {
  try {
    await WorldbuildingService.archiveLore(req.user.id, req.params.id, req.body.isArchived);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.get('/api/asks', auth, async (req: any, res) => {
  try {
    const asks = await SocialService.getAllAsks(req.user.id);
    res.json(asks);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.post('/api/asks', auth, async (req: any, res) => {
  try {
    const id = genId();
    await SocialService.createAsk(req.user.id, req.body.recipientId, id, req.body.question);
    res.json({ id, question: req.body.question });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.post('/api/asks/:id/answer', auth, async (req: any, res) => {
  try {
    await SocialService.answerAsk(req.user.id, req.params.id, req.body.answer, req.body.isPublic);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.get('/api/journals', auth, async (req: any, res) => {
  try {
    const journals = await SocialService.getJournals(req.user.id, req.query.type as any);
    res.json(journals);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.post('/api/journals', auth, async (req: any, res) => {
  try {
    const id = genId();
    await SocialService.createJournal(
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

app.get('/api/journals/:parentId/chapters', auth, async (req: any, res) => {
  try {
    const chapters = await SocialService.getStoryChapters(req.params.parentId);
    res.json(chapters);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Dictionary Lookup
app.get('/api/dictionary/lookup', auth, async (req: any, res) => {
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
app.get('/api/support/messages', auth, async (req: any, res) => {
  try {
    const messages = await SocialService.getSupportMessages(req.user.id);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.post('/api/support/messages', auth, async (req: any, res) => {
  try {
    await SocialService.createSupportMessage(req.user.id, req.body.message, req.body.sender || 'user');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// --- Writer Circles ---
app.get('/api/circles', async (req, res) => {
  try {
    const circles = await CircleService.getCircles();
    res.json(circles);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.post('/api/circles', auth, async (req: any, res) => {
  try {
    const id = genId();
    await CircleService.createCircle(req.user.id, id, req.body.name, req.body.description);
    res.json({ id, name: req.body.name });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.post('/api/circles/:id/join', auth, async (req: any, res) => {
  try {
    await CircleService.joinCircle(req.user.id, req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.get('/api/circles/:id/members', async (req, res) => {
  try {
    const members = await CircleService.getMembers(req.params.id);
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Writing Rooms
app.get('/api/circles/:id/writing-rooms', auth, async (req: any, res) => {
  try {
    const rooms = await CircleService.getWritingRooms(req.params.id);
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.post('/api/circles/:id/writing-rooms', auth, async (req: any, res) => {
  try {
    const id = genId();
    await CircleService.createWritingRoom(req.user.id, req.params.id, id, req.body.name, req.body.description);
    res.json({ id, name: req.body.name });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// --- Worldbuilding Loop ---
app.get('/api/storyworlds', auth, async (req: any, res) => {
  try {
    const worlds = await StoryworldService.getStoryworlds(req.user.id);
    res.json(worlds);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.post('/api/storyworlds', auth, async (req: any, res) => {
  try {
    const id = genId();
    await StoryworldService.createStoryworld(req.user.id, id, req.body.title, req.body.description);
    res.json({ id, title: req.body.title });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.post('/api/storyworlds/:id/members', auth, async (req: any, res) => {
  try {
    await StoryworldService.addMember(req.user.id, req.params.id, req.body.userId, req.body.role);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.post('/api/storyworlds/:id/invite', auth, async (req: any, res) => {
  try {
    await StoryworldService.inviteMember(req.user.id, req.params.id, req.body.identifier, req.body.role);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.delete('/api/storyworlds/:id/members/:userId', auth, async (req: any, res) => {
  try {
    await StoryworldService.removeMember(req.user.id, req.params.id, req.params.userId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Characters
app.get('/api/storyworlds/:id/characters', auth, async (req: any, res) => {
  try {
    const characters = await WorldbuildingService.getCharacters(req.user.id, req.params.id);
    res.json(characters);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.post('/api/storyworlds/:id/characters', auth, async (req: any, res) => {
  try {
    const id = genId();
    await WorldbuildingService.createCharacter(req.user.id, req.params.id, id, req.body.name, req.body.description, req.body.data);
    res.json({ id, name: req.body.name });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Lore
app.get('/api/storyworlds/:id/lore', auth, async (req: any, res) => {
  try {
    const lore = await WorldbuildingService.getLore(req.user.id, req.params.id);
    res.json(lore);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.post('/api/storyworlds/:id/lore', auth, async (req: any, res) => {
  try {
    const id = genId();
    await WorldbuildingService.createLore(req.user.id, req.params.id, id, req.body.title, req.body.content, req.body.data);
    res.json({ id, title: req.body.title });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Lore Templates
app.get('/api/lore-templates', auth, async (req: any, res) => {
  try {
    const templates = await WorldbuildingService.getLoreTemplates();
    res.json(templates);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.post('/api/storyworlds/:id/apply-template', auth, async (req: any, res) => {
  try {
    await WorldbuildingService.applyTemplate(req.user.id, req.params.id, req.body.templateId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Admin Templates
app.post('/api/admin/lore-templates', auth, async (req: any, res) => {
  try {
    if (req.user.role !== 'admin') throw new Error('Unauthorized');
    const id = genId();
    await WorldbuildingService.createLoreTemplate(id, req.body.name, req.body.genre, req.body.description);
    res.json({ id, name: req.body.name });
  } catch (err) {
    res.status(403).json({ error: (err as Error).message });
  }
});

app.post('/api/admin/lore-templates/:id/fragments', auth, async (req: any, res) => {
  try {
    if (req.user.role !== 'admin') throw new Error('Unauthorized');
    const id = genId();
    await WorldbuildingService.addTemplateFragment(id, req.params.id, req.body.title, req.body.content, req.body.category);
    res.json({ id, title: req.body.title });
  } catch (err) {
    res.status(403).json({ error: (err as Error).message });
  }
});

app.post('/api/admin/lore-templates/:id/characters', auth, async (req: any, res) => {
  try {
    if (req.user.role !== 'admin') throw new Error('Unauthorized');
    const id = genId();
    await WorldbuildingService.addTemplateCharacter(id, req.params.id, req.body.name, req.body.role, req.body.description);
    res.json({ id, name: req.body.name });
  } catch (err) {
    res.status(403).json({ error: (err as Error).message });
  }
});

// Gated Features (Secrets, Tension, Timelines)
app.get('/api/storyworlds/:id/secrets', auth, async (req: any, res) => {
  try {
    const secrets = await WorldbuildingService.getSecrets(req.user.id, req.params.id);
    res.json(secrets);
  } catch (err) {
    res.status(403).json({ error: (err as Error).message });
  }
});

app.post('/api/storyworlds/:id/secrets', auth, async (req: any, res) => {
  try {
    const id = genId();
    await WorldbuildingService.createSecret(req.user.id, req.params.id, id, req.body.title, req.body.content);
    res.json({ id, title: req.body.title });
  } catch (err) {
    res.status(403).json({ error: (err as Error).message });
  }
});

app.get('/api/storyworlds/:id/tension', auth, async (req: any, res) => {
  try {
    const maps = await WorldbuildingService.getTensionMaps(req.user.id, req.params.id);
    res.json(maps);
  } catch (err) {
    res.status(403).json({ error: (err as Error).message });
  }
});

app.get('/api/storyworlds/:id/timelines', auth, async (req: any, res) => {
  try {
    const timelines = await WorldbuildingService.getTimelines(req.user.id, req.params.id);
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
