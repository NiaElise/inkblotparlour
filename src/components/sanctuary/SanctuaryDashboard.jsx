import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const storyworlds = [
  { id: 'the-forgotten-city', name: 'The Forgotten City', icon: '⌗', status: 'Active', progress: 68, chars: 8, lore: 23, lastEdited: '2h ago', proseCount: 45000 },
  { id: 'the-bloodline-pact', name: 'The Bloodline Pact', icon: '◉', status: 'Active', progress: 34, chars: 5, lore: 12, lastEdited: '1d ago', proseCount: 21000 },
  { id: 'echoes-of-ash', name: 'Echoes of Ash', icon: '✦', status: 'Draft', progress: 12, chars: 3, lore: 7, lastEdited: '5d ago', proseCount: 8700 },
];

const recentAsks = [
  { from: '@inkweaver', question: 'How do you handle POV transitions in multi-character chapters?', time: '3h ago' },
  { from: '@novicebuilder', question: 'Your timeline mentions three suns — is the third one visible from the Eastern Reach?', time: '1d ago' },
  { from: '@lorekeeper', question: 'Can you share your method for tracking secret reveals across acts?', time: '2d ago' },
];

const recentNotifications = [
  { type: 'ask', text: 'New ask from @inkweaver', time: '3h ago' },
  { type: 'circle', text: 'The Lamp-Lit Covenant has a new fragment', time: '5h ago' },
  { type: 'tension', text: 'Tension spike: Elias vs The Weaver at 92%', time: '8h ago' },
];

export default function SanctuaryDashboard() {
  const navigate = useNavigate();
  const [greeting] = useState(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Morning';
    if (h < 18) return 'Afternoon';
    return 'Evening';
  });

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="h-px w-6 bg-sepia/40" />
          <span className="text-ornament">Good {greeting}, Architect</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-serif text-parchment-light">
          Your <span className="italic text-sepia/70">Sanctuary</span>
        </h1>
        <p className="text-parchment/40 text-sm mt-2 font-light max-w-xl">
          Your worlds, your threads, your continuity. Everything you need to build the architecture of fiction.
        </p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Worlds', value: '3', icon: '◈' },
          { label: 'Total Characters', value: '16', icon: '♟' },
          { label: 'Lore Entries', value: '42', icon: '⌇' },
          { label: 'Words Written', value: '74.7K', icon: '✎' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="card-paper rounded-sm p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sepia/50 text-sm">{stat.icon}</span>
              <span className="text-[9px] uppercase tracking-widest text-parchment/30">{stat.label}</span>
            </div>
            <div className="text-2xl font-serif text-parchment/80">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Storyworlds */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xs uppercase tracking-widest text-parchment/30 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-sepia/40" />
            Your Storyworlds
          </h2>

          {storyworlds.map((world, i) => (
            <motion.div
              key={world.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card-paper rounded-sm p-4 group hover:border-parchment/15 transition-all cursor-pointer"
              onClick={() => navigate(`/sanctuary/studio/${world.id}`)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="society-seal w-10 h-10 text-lg">{world.icon}</div>
                  <div>
                    <h3 className="text-sm font-serif text-parchment/80 group-hover:text-parchment transition-colors">
                      {world.name}
                    </h3>
                    <div className="flex items-center gap-3 text-[10px] text-parchment/30 mt-0.5">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-sm border ${
                        world.status === 'Active' ? 'border-emerald-500/30 text-emerald-500/60' : 'border-sepia/30 text-sepia/60'
                      }`}>
                        {world.status}
                      </span>
                      <span>{world.chars} characters</span>
                      <span>{world.lore} lore entries</span>
                      <span>{world.proseCount.toLocaleString()} words</span>
                    </div>
                  </div>
                </div>
                <span className="text-[9px] text-parchment/20">{world.lastEdited}</span>
              </div>

              {/* Progress */}
              <div className="flex items-center gap-3">
                <div className="tension-bar flex-1">
                  <div className="tension-fill" style={{ width: `${world.progress}%` }} />
                </div>
                <span className="text-[10px] text-parchment/30 font-mono">{world.progress}%</span>
                <button className="text-[9px] text-sepia/40 hover:text-sepia transition-colors opacity-0 group-hover:opacity-100">
                  Open Studio →
                </button>
              </div>
            </motion.div>
          ))}

          <button className="w-full py-3 border border-dashed border-parchment/10 rounded-sm text-xs text-parchment/30 hover:text-parchment/60 hover:border-parchment/20 transition-all">
            + New Storyworld
          </button>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Recent Notifications */}
          <div className="card-paper rounded-sm p-4">
            <h3 className="text-[10px] uppercase tracking-widest text-parchment/30 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sepia/40" />
              Recent Threads
            </h3>
            <div className="space-y-3">
              {recentNotifications.map((notif, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-parchment/50 hover:bg-ink-warm/30 rounded-sm p-2 -mx-2 transition-colors cursor-pointer">
                  <span className={`text-[10px] mt-0.5 ${
                    notif.type === 'ask' ? 'text-sepia/50' :
                    notif.type === 'circle' ? 'text-emerald-500/40' : 'text-blood/40'
                  }`}>
                    {notif.type === 'ask' ? '?' : notif.type === 'circle' ? '◈' : '⚡'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="truncate">{notif.text}</p>
                    <p className="text-[9px] text-parchment/20">{notif.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Asks */}
          <div className="card-paper rounded-sm p-4">
            <h3 className="text-[10px] uppercase tracking-widest text-parchment/30 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sepia/40" />
              Pending Asks
            </h3>
            <div className="space-y-3">
              {recentAsks.map((ask, i) => (
                <div key={i} className="text-xs text-parchment/50 hover:bg-ink-warm/30 rounded-sm p-2 -mx-2 transition-colors cursor-pointer">
                  <div className="flex items-center gap-1.5 text-[9px] text-parchment/20 mb-1">
                    <span className="text-parchment/40">{ask.from}</span>
                    <span>· {ask.time}</span>
                  </div>
                  <p className="truncate text-parchment/60">&ldquo;{ask.question}&rdquo;</p>
                </div>
              ))}
            </div>
            <button className="mt-3 text-[9px] uppercase tracking-widest text-sepia/40 hover:text-sepia transition-colors">
              View All Asks →
            </button>
          </div>

          {/* Quick Write */}
          <div className="card-paper rounded-sm p-4">
            <h3 className="text-[10px] uppercase tracking-widest text-parchment/30 mb-3">Quick Fragment</h3>
            <textarea
              placeholder="A line, a thought, a fragment..."
              className="w-full bg-ink-warm/40 border border-parchment/8 rounded-sm p-3 text-xs text-parchment/60 placeholder:text-parchment/20 resize-none h-20 focus:outline-none focus:border-sepia/30 transition-colors"
            />
            <button className="mt-2 text-[9px] uppercase tracking-widest text-sepia/40 hover:text-sepia transition-colors">
              Save to Journal →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}