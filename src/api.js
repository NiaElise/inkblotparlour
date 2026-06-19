const API_BASE = '/api';

// Helper to get auth token
const getAuthToken = () => localStorage.getItem('inkblot_token');

// Helper for fetch with auth
const authFetch = async (url, options = {}) => {
  const token = getAuthToken();
  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(url, { ...options, headers });
  if (res.status === 401 && !url.endsWith('/login') && !url.endsWith('/signup')) {
    // Optional: handle unauthorized
    localStorage.removeItem('inkblot_token');
    window.location.href = '/login';
  }
  return res;
};

// Auth
export const login = async (email, password) => {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Login failed');
  }
  const user = await res.json();
  localStorage.setItem('inkblot_token', user.id);
  return user;
};

export const signup = async (username, email, password, tier) => {
  const res = await fetch(`${API_BASE}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password, tier }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Signup failed');
  }
  const user = await res.json();
  localStorage.setItem('inkblot_token', user.id);
  return user;
};

export const logout = () => {
  localStorage.removeItem('inkblot_token');
  window.location.href = '/';
};

export const fetchMe = async () => {
  const res = await authFetch(`${API_BASE}/me`);
  return res.json();
};

// Admin
export const fetchAdminUsers = async () => {
  const res = await authFetch(`${API_BASE}/admin/users`);
  if (!res.ok) throw new Error('Admin access required');
  return res.json();
};

export const fetchAdminStoryworlds = async () => {
  const res = await authFetch(`${API_BASE}/admin/storyworlds`);
  if (!res.ok) throw new Error('Admin access required');
  return res.json();
};

export const fetchAdminPosts = async () => {
  const res = await authFetch(`${API_BASE}/admin/posts`);
  if (!res.ok) throw new Error('Admin access required');
  return res.json();
};

// Social Loop
export const fetchFeed = async () => {
  const res = await authFetch(`${API_BASE}/feed`);
  return res.json();
};

export const createPost = async (content, storyworldId, loreId, characterId) => {
  const res = await authFetch(`${API_BASE}/posts`, {
    method: 'POST',
    body: JSON.stringify({ content, storyworldId, loreId, characterId }),
  });
  return res.json();
};

export const fetchAsks = async () => {
  const res = await authFetch(`${API_BASE}/asks`);
  return res.json();
};

export const createAsk = async (recipientId, question) => {
  const res = await authFetch(`${API_BASE}/asks`, {
    method: 'POST',
    body: JSON.stringify({ recipientId, question }),
  });
  return res.json();
};

export const answerAsk = async (askId, answer, isPublic) => {
  const res = await authFetch(`${API_BASE}/asks/${askId}/answer`, {
    method: 'POST',
    body: JSON.stringify({ answer, isPublic }),
  });
  return res.json();
};

export const fetchJournals = async (type) => {
  const url = type ? `${API_BASE}/journals?type=${type}` : `${API_BASE}/journals`;
  const res = await authFetch(url);
  return res.json();
};

export const createJournal = async (title, content, type = 'standalone', chapterNumber, parentId) => {
  const res = await authFetch(`${API_BASE}/journals`, {
    method: 'POST',
    body: JSON.stringify({ title, content, type, chapterNumber, parentId }),
  });
  return res.json();
};

export const fetchStoryChapters = async (parentId) => {
  const res = await authFetch(`${API_BASE}/journals/${parentId}/chapters`);
  return res.json();
};

// Dictionary
export const lookupDictionary = async (word) => {
  const res = await authFetch(`${API_BASE}/dictionary/lookup?word=${encodeURIComponent(word)}`);
  return res.json();
};

// Support
export const fetchSupportMessages = async () => {
  const res = await authFetch(`${API_BASE}/support/messages`);
  return res.json();
};

export const sendSupportMessage = async (message, sender = 'user') => {
  const res = await authFetch(`${API_BASE}/support/messages`, {
    method: 'POST',
    body: JSON.stringify({ message, sender }),
  });
  return res.json();
};

// Collaboration
export const inviteStoryworldMember = async (storyworldId, identifier, role = 'member') => {
  const res = await authFetch(`${API_BASE}/storyworlds/${storyworldId}/invite`, {
    method: 'POST',
    body: JSON.stringify({ identifier, role }),
  });
  return res.json();
};

export const removeStoryworldMember = async (storyworldId, userId) => {
  const res = await authFetch(`${API_BASE}/storyworlds/${storyworldId}/members/${userId}`, {
    method: 'DELETE',
  });
  return res.json();
};

// Writer Circles
export const fetchCircles = async () => {
  const res = await authFetch(`${API_BASE}/circles`);
  return res.json();
};

export const createCircle = async (name, description) => {
  const res = await authFetch(`${API_BASE}/circles`, {
    method: 'POST',
    body: JSON.stringify({ name, description }),
  });
  return res.json();
};

export const joinCircle = async (id) => {
  const res = await authFetch(`${API_BASE}/circles/${id}/join`, {
    method: 'POST',
  });
  return res.json();
};

export const fetchCircleMembers = async (id) => {
  const res = await authFetch(`${API_BASE}/circles/${id}/members`);
  return res.json();
};

export const fetchWritingRooms = async (circleId) => {
  const res = await authFetch(`${API_BASE}/circles/${circleId}/writing-rooms`);
  return res.json();
};

export const createWritingRoom = async (circleId, name, description) => {
  const res = await authFetch(`${API_BASE}/circles/${circleId}/writing-rooms`, {
    method: 'POST',
    body: JSON.stringify({ name, description }),
  });
  return res.json();
};

// Worldbuilding Loop
export const fetchStoryworlds = async () => {
  const res = await authFetch(`${API_BASE}/storyworlds`);
  return res.json();
};

export const createStoryworld = async (title, description) => {
  const res = await authFetch(`${API_BASE}/storyworlds`, {
    method: 'POST',
    body: JSON.stringify({ title, description }),
  });
  return res.json();
};

export const addStoryworldMember = async (storyworldId, userId, role) => {
  const res = await authFetch(`${API_BASE}/storyworlds/${storyworldId}/members`, {
    method: 'POST',
    body: JSON.stringify({ userId, role }),
  });
  return res.json();
};

// Characters
export const fetchCharacters = async (storyworldId) => {
  const res = await authFetch(`${API_BASE}/storyworlds/${storyworldId}/characters`);
  return res.json();
};

export const createCharacter = async (storyworldId, name, description, data) => {
  const res = await authFetch(`${API_BASE}/storyworlds/${storyworldId}/characters`, {
    method: 'POST',
    body: JSON.stringify({ name, description, data }),
  });
  return res.json();
};

export const updateCharacter = async (id, name, description, data) => {
  const res = await authFetch(`${API_BASE}/characters/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ name, description, data }),
  });
  return res.json();
};

// Lore
export const fetchLore = async (storyworldId) => {
  const res = await authFetch(`${API_BASE}/storyworlds/${storyworldId}/lore`);
  return res.json();
};

export const createLore = async (storyworldId, title, content, data) => {
  const res = await authFetch(`${API_BASE}/storyworlds/${storyworldId}/lore`, {
    method: 'POST',
    body: JSON.stringify({ title, content, data }),
  });
  return res.json();
};

export const updateLore = async (id, title, content, data) => {
  const res = await authFetch(`${API_BASE}/lore/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ title, content, data }),
  });
  return res.json();
};

// Secrets
export const fetchSecrets = async (storyworldId) => {
  const res = await authFetch(`${API_BASE}/storyworlds/${storyworldId}/secrets`);
  if (res.status === 403) throw new Error('Architect/Collective tier required');
  return res.json();
};

export const createSecret = async (storyworldId, title, content) => {
  const res = await authFetch(`${API_BASE}/storyworlds/${storyworldId}/secrets`, {
    method: 'POST',
    body: JSON.stringify({ title, content }),
  });
  if (res.status === 403) throw new Error('Architect/Collective tier required');
  return res.json();
};

export const updateSecret = async (id, title, content) => {
  const res = await authFetch(`${API_BASE}/secrets/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ title, content }),
  });
  if (res.status === 403) throw new Error('Architect/Collective tier required');
  return res.json();
};

// Tension
export const fetchTensionMaps = async (storyworldId) => {
  const res = await authFetch(`${API_BASE}/storyworlds/${storyworldId}/tension`);
  if (res.status === 403) throw new Error('Architect/Collective tier required');
  return res.json();
};

export const updateTensionMap = async (id, data) => {
  const res = await authFetch(`${API_BASE}/tension/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ data }),
  });
  if (res.status === 403) throw new Error('Architect/Collective tier required');
  return res.json();
};

// Stats
export const fetchStats = async () => {
  const res = await authFetch(`${API_BASE}/stats`);
  if (!res.ok) return { storyworlds: 0, characters: 0, fragments: 0 };
  return res.json();
};

export const fetchStoryworld = async (id) => {
  const res = await authFetch(`${API_BASE}/storyworlds/${id}`);
  return res.json();
};

export const updateCustomization = async (data) => {
  const res = await authFetch(`${API_BASE}/me/customization`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return res.json();
};


export const fetchTimelines = async (storyworldId) => {
  const res = await authFetch(`${API_BASE}/storyworlds/${storyworldId}/timelines`);
  if (res.status === 403) throw new Error('Architect/Collective tier required');
  return res.json();
};

// Lore Templates
export const fetchLoreTemplates = async () => {
  const res = await authFetch(`${API_BASE}/lore-templates`);
  return res.json();
};

export const applyLoreTemplate = async (storyworldId, templateId) => {
  const res = await authFetch(`${API_BASE}/storyworlds/${storyworldId}/apply-template`, {
    method: 'POST',
    body: JSON.stringify({ templateId }),
  });
  return res.json();
};

// Post Governance
export const archivePost = async (id, isArchived) => {
  const res = await authFetch(`${API_BASE}/posts/${id}/archive`, {
    method: 'POST',
    body: JSON.stringify({ isArchived }),
  });
  return res.json();
};

export const hidePost = async (id) => {
  const res = await authFetch(`${API_BASE}/posts/${id}/hide`, {
    method: 'POST',
  });
  return res.json();
};

export const flagPost = async (id, reason) => {
  const res = await authFetch(`${API_BASE}/posts/${id}/flag`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
  return res.json();
};

export const archiveLore = async (id, isArchived) => {
  const res = await authFetch(`${API_BASE}/lore/${id}/archive`, {
    method: 'POST',
    body: JSON.stringify({ isArchived }),
  });
  return res.json();
};
