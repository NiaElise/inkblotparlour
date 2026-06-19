export type UserTier = 'Draftsman' | 'Architect' | 'Collective';

export interface User {
  id: string;
  username: string;
  email?: string;
  password?: string;
  role: 'admin' | 'user';
  tier: UserTier;
  customization?: string; // JSON string for aesthetic customization
  avatar?: string;
  banner?: string;
  created_at: string;
}

export interface Storyworld {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  created_at: string;
}

export interface Character {
  id: string;
  storyworld_id: string;
  name: string;
  description?: string;
  data?: string; // JSON string for arbitrary character data
  created_at: string;
}

export interface Lore {
  id: string;
  storyworld_id: string;
  title: string;
  content?: string;
  data?: string;
  is_archived: boolean;
  created_at: string;
}

export interface Secret {
  id: string;
  storyworld_id: string;
  title: string;
  content: string;
  created_at: string;
}

export interface TensionMap {
  id: string;
  storyworld_id: string;
  data: string; // JSON string for tension map visualization
  created_at: string;
}

export interface Timeline {
  id: string;
  storyworld_id: string;
  title: string;
  events: string; // JSON string for timeline events
  created_at: string;
}

export interface SecretSociety {
  id: string;
  storyworld_id: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  storyworld_id?: string;
  lore_id?: string;
  character_id?: string;
  content: string;
  is_archived: boolean;
  created_at: string;
}

export interface Ask {
  id: string;
  sender_id: string;
  recipient_id: string;
  question: string;
  answer?: string;
  is_public: boolean;
  created_at: string;
}

export interface Journal {
  id: string;
  user_id: string;
  title: string;
  content: string;
  type: 'standalone' | 'story';
  chapter_number?: number;
  parent_id?: string;
  created_at: string;
}

export interface SupportMessage {
  id: string;
  user_id: string;
  message: string;
  sender: 'user' | 'librarian';
  created_at: string;
}

export interface WriterCircle {
  id: string;
  creator_id: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface CircleMember {
  circle_id: string;
  user_id: string;
  joined_at: string;
}

export interface StoryworldMember {
  storyworld_id: string;
  user_id: string;
  role: string;
  joined_at: string;
}

export interface LoreTemplate {
  id: string;
  name: string;
  genre?: string;
  description?: string;
  created_at: string;
}

export interface LoreTemplateFragment {
  id: string;
  template_id: string;
  title: string;
  content: string;
  category?: string;
}

export interface LoreTemplateCharacter {
  id: string;
  template_id: string;
  name: string;
  role?: string;
  description?: string;
}

export interface WritingRoom {
  id: string;
  circle_id: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface HiddenPost {
  id: string;
  user_id: string;
  post_id: string;
  created_at: string;
}

export interface FlaggedPost {
  id: string;
  user_id: string;
  post_id: string;
  reason?: string;
  status: 'pending' | 'reviewed' | 'resolved';
  created_at: string;
}
