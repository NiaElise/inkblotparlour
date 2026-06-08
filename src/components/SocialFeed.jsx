import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { fetchFeed } from '../api';

export default function SocialFeed() {
  const [activeTab, setActiveTab] = useState('feed');
  const [expandedPost, setExpandedPost] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeTab === 'feed') {
      setLoading(true);
      fetchFeed().then(data => {
        // Map backend Post to frontend feedPost structure
        const mappedPosts = data.map(p => ({
          id: p.id,
          author: p.user_id === 'user_dev_1' ? 'The Architect' : 'Unknown Writer',
          handle: p.user_id === 'user_dev_1' ? '@architect' : '@writer',
          tier: 'Collective', // In a real app, fetch user tier
          time: new Date(p.created_at).toLocaleTimeString(),
          content: p.content,
          tags: ['#worldbuilding'], // Backend doesn't store tags yet in posts table, or we can parse them from content
          likes: 0,
          asks: 0
        }));
        setPosts(mappedPosts);
        setLoading(false);
      }).catch(err => {
        console.error(err);
        setLoading(false);
      });
    }
  }, [activeTab]);

  return (
    <section id="feed" className="relative py-24 px-6">
      {/* Subtle bg */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ink-well/30 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-sepia/40" />
            <span className="text-ornament">THE SOCIAL LOOP</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif text-parchment-light mb-4">
            Where fragments become{' '}
            <span className="italic text-sepia/70">conversations</span>
          </h2>
          <p className="text-parchment/50 max-w-xl font-light leading-relaxed">
            A feed of vignettes, questions, and discoveries. Every tier has its own loop — 
            Draftsman, Architect, or Collective. Find your circle.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-12 gap-8">
          {/* Left — Feed / Tabs */}
          <div className="md:col-span-8">
            {/* Tab bar */}
            <div className="flex items-center border-b border-parchment/10 mb-6">
              {[
                { id: 'feed', label: 'The Feed', icon: '☰' },
                { id: 'asks', label: 'Asks', icon: '?' },
                { id: 'journals', label: 'Journals', icon: '✦' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`desk-tab flex items-center gap-2 ${activeTab === tab.id ? 'active' : ''}`}
                >
                  <span className="text-xs">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}

              <div className="flex-1" />

              <button className="text-xs text-sepia/50 hover:text-sepia transition-colors tracking-wider uppercase">
                + New Post
              </button>
            </div>

            {/* Feed Content */}
            {activeTab === 'feed' && (
              <div className="post-feed-scroll scroll-fade">
                {loading ? (
                  <div className="text-center py-12 text-parchment/30 animate-pulse">Retrieving fragments from the void...</div>
                ) : posts.length === 0 ? (
                  <div className="text-center py-12 text-parchment/30 italic">The feed is silent. Write the first fragment.</div>
                ) : (
                  posts.map((post, i) => (
                    <motion.div
                      key={post.id}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    viewport={{ once: true }}
                    className="vignette-card group cursor-pointer"
                    onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                  >
                    {/* Post Header */}
                    <div className="flex items-start justify-between mb-3 relative z-10">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sepia/30 to-ink-warm border border-parchment/10 flex items-center justify-center text-xs font-serif text-parchment/60">
                          {post.author[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-parchment/80">{post.author}</span>
                            <span className="lore-badge text-[8px]">{post.tier}</span>
                          </div>
                          <div className="text-xs text-parchment/30">{post.handle} · {post.time}</div>
                        </div>
                      </div>
                      <button className="text-parchment/20 hover:text-parchment/50 transition-colors">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                          <circle cx="7" cy="2" r="1.5" />
                          <circle cx="7" cy="7" r="1.5" />
                          <circle cx="7" cy="12" r="1.5" />
                        </svg>
                      </button>
                    </div>

                    {/* Post Content */}
                    <div className="relative z-10">
                      <p className="text-sm text-parchment/70 leading-relaxed font-light">
                        {post.content}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] text-sepia/50 hover:text-sepia/80 transition-colors cursor-pointer"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Expanded Details */}
                      {expandedPost === post.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-4 pt-4 border-t border-parchment/8"
                        >
                          <div className="flex items-center gap-6 text-xs text-parchment/40">
                            <button className="flex items-center gap-1.5 hover:text-parchment/70 transition-colors">
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2">
                                <path d="M7 1v12M1 7h12" />
                              </svg>
                              {post.likes} echoes
                            </button>
                            <button className="flex items-center gap-1.5 hover:text-parchment/70 transition-colors">
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2">
                                <path d="M3 5l4 4 4-4" />
                              </svg>
                              {post.asks} asks
                            </button>
                            <button className="flex items-center gap-1.5 hover:text-parchment/70 transition-colors">
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2">
                                <path d="M1 4l6 3 6-3M1 7l6 3 6-3" />
                              </svg>
                              Thread
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )))}
              </div>
            )}

            {/* Asks Tab */}
            {activeTab === 'asks' && (
              <div className="space-y-4">
                {[
                  {
                    from: '@inkweaver',
                    to: 'Elias Thorne',
                    question: `How do you keep the tension alive when your protagonist and antagonist haven't met yet?`,
                    answer: `Absence creates its own tension. The Weaver's influence is felt in every corrupted street, every broken law. The reader fears the meeting more than the conflict itself.`,
                    time: '3h ago',
                  },
                  {
                    from: '@novicebuilder',
                    to: 'Clara Vale',
                    question: 'Tips for building a magic system that feels organic?',
                    answer: `Start with the cost, not the power. Every spell should take something the caster isn't willing to lose.`,
                    time: '7h ago',
                  },
                  {
                    from: '@lorekeeper',
                    to: 'The Weaver',
                    question: 'The Forgotten City has three suns in your worldbuilding doc but two in Ch 4 — intentional?',
                    answer: `The third sun set permanently when the Bloodline Pact was broken. It's a subtle continuity marker for those paying attention.`,
                    time: '1d ago',
                  },
                ].map((ask, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="ask-bubble"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-sepia/60 text-lg font-serif italic">Q:</span>
                      <div>
                        <div className="flex items-center gap-2 text-xs text-parchment/40 mb-1">
                          <span className="text-parchment/60">{ask.from}</span>
                          <span>asked</span>
                          <span className="text-parchment/60">{ask.to}</span>
                          <span>· {ask.time}</span>
                        </div>
                        <p className="text-sm text-parchment/70 italic">&ldquo;{ask.question}&rdquo;</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 pl-6 border-l border-sepia/20">
                      <span className="text-sepia/60 text-lg font-serif italic">A:</span>
                      <p className="text-sm text-parchment/60">&ldquo;{ask.answer}&rdquo;</p>
                    </div>
                    <div className="mt-3 flex items-center gap-3 text-[10px] text-parchment/30">
                      <button className="hover:text-sepia/60 transition-colors">♡ Echo</button>
                      <button className="hover:text-sepia/60 transition-colors">↺ Re-ask</button>
                      <span className="flex-1" />
                      <span>{Math.floor(Math.random() * 20 + 5)} echoes</span>
                    </div>
                  </motion.div>
                ))}

                {/* Ask CTA */}
                <div className="text-center pt-4">
                  <p className="text-xs text-parchment/40 mb-3">
                    Architects can send and receive Asks. Draftsmen can read the public feed.
                  </p>
                  <button className="btn-ink text-xs">
                    Send an Ask
                  </button>
                </div>
              </div>
            )}

            {/* Journals Tab */}
            {activeTab === 'journals' && (
              <div className="space-y-5">
                {[
                  {
                    title: 'On the Architecture of Suspense',
                    author: 'Elias Thorne',
                    excerpt: 'Suspense is not the absence of information — it is the precise arrangement of it. I am learning that revelation, like墨水 on paper, must be applied in layers. Too much and the page bleeds. Too little and nothing takes shape...',
                    date: 'Journal Entry · 12 Mar 2025',
                    tags: ['craft', 'suspense'],
                  },
                  {
                    title: 'Letters from the Weaving Room',
                    author: 'The Weaver',
                    excerpt: 'Today I mapped the thread-count between Act I and Act III. Eleven threads carry the weight of the entire narrative arc. Eleven. The number feels significant, though I cannot yet say why. Perhaps the eleventh thread is the one that breaks...',
                    date: 'Journal Entry · 10 Mar 2025',
                    tags: ['process', 'plotting'],
                  },
                  {
                    title: `Clara's Field Notes: On Naming the Unnameable`,
                    author: 'Clara Vale',
                    excerpt: 'Names are the first magic. Before there was fire or flight, there was the act of naming. To name a thing is to claim it. To rename it is to remake it. In the Forgotten City, the old names still echo through the empty streets...',
                    date: 'Journal Entry · 8 Mar 2025',
                    tags: ['worldbuilding', 'language'],
                  },
                ].map((entry, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="journal-entry group cursor-pointer"
                  >
                    <div className="flex items-center gap-2 text-xs text-parchment/30 mb-2">
                      <span className="text-parchment/50">{entry.date}</span>
                      <span className="text-parchment/20">·</span>
                      <span className="text-sepia/40">{entry.author}</span>
                    </div>
                    <h4 className="text-base font-serif text-parchment/80 mb-2 group-hover:text-parchment transition-colors">
                      {entry.title}
                    </h4>
                    <p className="text-sm text-parchment/50 leading-relaxed font-light">
                      {entry.excerpt}
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      {entry.tags.map((tag) => (
                        <span key={tag} className="text-[10px] text-sepia/40">{`#${tag}`}</span>
                      ))}
                      <span className="flex-1" />
                      <span className="text-xs text-parchment/20 group-hover:text-parchment/40 transition-colors">
                        Read more →
                      </span>
                    </div>
                  </motion.div>
                ))}

                <div className="text-center pt-4 border-t border-parchment/8">
                  <p className="text-xs text-parchment/30 italic">Journals are private by default. Share with your loop when ready.</p>
                </div>
              </div>
            )}
          </div>

          {/* Right — Sidebar (Worldbuilding preview) */}
          <div className="md:col-span-4 space-y-6">
            {/* Character Cabinet */}
            <WorldbuildingModule
              title="Character Cabinet"
              icon="👤"
            >
              <div className="space-y-3">
                {[
                  { name: 'Elias Thorne', role: 'Protagonist', status: 'In Peril', tension: 92 },
                  { name: 'The Weaver', role: 'Antagonist', status: 'Hidden', tension: 87 },
                  { name: 'Clara Vale', role: 'Mentor', status: 'Departed', tension: 45 },
                  { name: 'The Forgotten King', role: 'Unknown', status: 'Awakening', tension: 76 },
                ].map((char, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 bg-ink-warm/40 border border-parchment/5 rounded-sm hover:bg-ink-warm/60 transition-colors cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-sepia/20 to-ink-well border border-parchment/8 flex items-center justify-center text-[8px] text-parchment/50">
                        {char.name[0]}
                      </div>
                      <div>
                        <div className="text-xs text-parchment/70">{char.name}</div>
                        <div className="text-[9px] text-parchment/30">{char.role}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-sm border ${
                        char.status === 'Hidden' ? 'border-blood/30 text-blood/60' :
                        char.status === 'In Peril' ? 'border-blood/40 text-blood/70' :
                        char.status === 'Awakening' ? 'border-sepia/30 text-sepia/60' :
                        'border-parchment/15 text-parchment/40'
                      }`}>
                        {char.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-3 text-xs text-sepia/50 hover:text-sepia transition-colors flex items-center gap-1">
                <span>+ Add Character</span>
              </button>
            </WorldbuildingModule>

            {/* Tension Map */}
            <WorldbuildingModule
              title="Tension Map"
              icon="⚡"
            >
              <div className="space-y-4">
                {[
                  { pair: 'Elias vs. The Weaver', value: 92 },
                  { pair: `Clara's Betrayal Arc`, value: 45 },
                  { pair: 'Forgotten King Rising', value: 76 },
                  { pair: 'Bloodline Pact', value: 31 },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-parchment/60">{item.pair}</span>
                      <span className={`text-xs ${
                        item.value > 80 ? 'text-blood/60' :
                        item.value > 60 ? 'text-sepia/60' :
                        'text-parchment/30'
                      }`}>{item.value}%</span>
                    </div>
                    <div className="tension-bar">
                      <div className="tension-fill" style={{ width: `${item.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </WorldbuildingModule>

            {/* Timeline Orchestration */}
            <WorldbuildingModule
              title="Timeline Orchestration"
              icon="◈"
              badge="Architect+"
            >
              <div className="space-y-2">
                {[
                  { event: 'Bloodline Pact Signed', chapter: 'Ch 3', era: 'Age of Accord' },
                  { event: 'First Sun Sets', chapter: 'Ch 4', era: 'Age of Shadows' },
                  { event: 'Weaver Emerges', chapter: 'Ch 7', era: 'Age of Shadows' },
                  { event: 'Elias Enters City', chapter: 'Ch 12', era: 'Present Day' },
                ].map((event, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 bg-ink-warm/30 border-l-2 border-sepia/30 hover:bg-ink-warm/50 transition-colors cursor-pointer">
                    <div className="w-1 h-1 rounded-full bg-sepia/40" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-parchment/70 truncate">{event.event}</div>
                      <div className="text-[9px] text-parchment/30">{event.era}</div>
                    </div>
                    <span className="text-[9px] text-parchment/30 font-mono">{event.chapter}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[10px] text-parchment/30 text-center italic">
                Connect events across timelines. Track causality.
              </p>
            </WorldbuildingModule>
          </div>
        </div>
      </div>
    </section>
  );
}

function WorldbuildingModule({ title, icon, badge, children }) {
  return (
    <div className="card-paper rounded-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="flex items-center gap-2 text-sm font-serif text-parchment/80">
          <span className="text-xs">{icon}</span>
          {title}
        </h3>
        {badge && (
          <span className="text-[8px] uppercase tracking-widest text-sepia/50 border border-sepia/20 px-1.5 py-0.5 rounded-sm">
            {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}