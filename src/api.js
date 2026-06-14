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

export const fetchJournals = async () => {
  const res = await authFetch(`${API_BASE}/journals`);
  return res.json();
};

export const createJournal = async (title, content) => {
  const res = await authFetch(`${API_BASE}/journals`, {
    method: 'POST',
    body: JSON.stringify({ title, content }),
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

// Timelines
export const fetchTimelines = async (storyworldId) => {
  const res = await authFetch(`${API_BASE}/storyworlds/${storyworldId}/timelines`);
  if (res.status === 403) throw new Error('Architect/Collective tier required');
  return res.json();
};

export const updateTimeline = async (id, title, events) => {
  const res = await authFetch(`${API_BASE}/timelines/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ title, events }),
  });
  if (res.status === 403) throw new Error('Architect/Collective tier required');
  return res.json();
};
