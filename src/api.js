const API_BASE = 'http://localhost:3001/api';

// --- Social ---
export const fetchFeed = async () => {
  const res = await fetch(`${API_BASE}/feed`);
  return res.json();
};

export const createPost = async (content, storyworldId) => {
  const res = await fetch(`${API_BASE}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, storyworldId }),
  });
  return res.json();
};

export const updatePost = async (id, content) => {
  const res = await fetch(`${API_BASE}/posts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  return res.json();
};

export const fetchJournals = async () => {
  const res = await fetch(`${API_BASE}/journals`);
  return res.json();
};

export const createJournal = async (title, content) => {
  const res = await fetch(`${API_BASE}/journals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content }),
  });
  return res.json();
};

export const updateJournal = async (id, title, content) => {
  const res = await fetch(`${API_BASE}/journals/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content }),
  });
  return res.json();
};

export const fetchAsks = async () => {
  const res = await fetch(`${API_BASE}/asks`);
  return res.json();
};

export const answerAsk = async (id, answer, isPublic) => {
  const res = await fetch(`${API_BASE}/asks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answer, isPublic }),
  });
  return res.json();
};

// --- Circles ---
export const fetchCircles = async () => {
  const res = await fetch(`${API_BASE}/circles`);
  return res.json();
};

export const joinCircle = async (circleId) => {
  const res = await fetch(`${API_BASE}/circles/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ circleId }),
  });
  return res.json();
};

// --- Customization ---
export const fetchCustomization = async () => {
  const res = await fetch(`${API_BASE}/user/customization`);
  return res.json();
};

export const updateCustomization = async (customization) => {
  const res = await fetch(`${API_BASE}/user/customization`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(customization),
  });
  return res.json();
};

// --- Worldbuilding ---
export const fetchStoryworlds = async () => {
  const res = await fetch(`${API_BASE}/storyworlds`);
  return res.json();
};

export const fetchStoryworld = async (id) => {
  const res = await fetch(`${API_BASE}/storyworlds/${id}`);
  return res.json();
};

export const createStoryworld = async (name, description) => {
  const res = await fetch(`${API_BASE}/storyworlds`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description }),
  });
  return res.json();
};

export const updateStoryworld = async (id, name, description) => {
  const res = await fetch(`${API_BASE}/storyworlds/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description }),
  });
  return res.json();
};

// Characters
export const fetchCharacters = async (storyworldId) => {
  const res = await fetch(`${API_BASE}/storyworlds/${storyworldId}/characters`);
  return res.json();
};

export const createCharacter = async (storyworldId, name, description, data) => {
  const res = await fetch(`${API_BASE}/storyworlds/${storyworldId}/characters`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description, data }),
  });
  return res.json();
};

export const updateCharacter = async (id, name, description, data) => {
  const res = await fetch(`${API_BASE}/characters/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description, data }),
  });
  return res.json();
};

// Lore
export const fetchLore = async (storyworldId) => {
  const res = await fetch(`${API_BASE}/storyworlds/${storyworldId}/lore`);
  return res.json();
};

export const createLore = async (storyworldId, title, content, data) => {
  const res = await fetch(`${API_BASE}/storyworlds/${storyworldId}/lore`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content, data }),
  });
  return res.json();
};

export const updateLore = async (id, title, content, data) => {
  const res = await fetch(`${API_BASE}/lore/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content, data }),
  });
  return res.json();
};

// Secrets
export const fetchSecrets = async (storyworldId) => {
  const res = await fetch(`${API_BASE}/storyworlds/${storyworldId}/secrets`);
  if (res.status === 403) throw new Error('Architect/Collective tier required');
  return res.json();
};

export const createSecret = async (storyworldId, title, content) => {
  const res = await fetch(`${API_BASE}/storyworlds/${storyworldId}/secrets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content }),
  });
  if (res.status === 403) throw new Error('Architect/Collective tier required');
  return res.json();
};

export const updateSecret = async (id, title, content) => {
  const res = await fetch(`${API_BASE}/secrets/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content }),
  });
  if (res.status === 403) throw new Error('Architect/Collective tier required');
  return res.json();
};

// Tension
export const fetchTensionMaps = async (storyworldId) => {
  const res = await fetch(`${API_BASE}/storyworlds/${storyworldId}/tension`);
  if (res.status === 403) throw new Error('Architect/Collective tier required');
  return res.json();
};

export const updateTensionMap = async (id, data) => {
  const res = await fetch(`${API_BASE}/tension/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data }),
  });
  if (res.status === 403) throw new Error('Architect/Collective tier required');
  return res.json();
};

// Timelines
export const fetchTimelines = async (storyworldId) => {
  const res = await fetch(`${API_BASE}/storyworlds/${storyworldId}/timelines`);
  if (res.status === 403) throw new Error('Architect/Collective tier required');
  return res.json();
};

export const updateTimeline = async (id, title, events) => {
  const res = await fetch(`${API_BASE}/timelines/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, events }),
  });
  if (res.status === 403) throw new Error('Architect/Collective tier required');
  return res.json();
};
