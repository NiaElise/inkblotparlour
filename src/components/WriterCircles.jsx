import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { fetchCircles, joinCircle } from '../api';


  const FEATURED_CIRCLES = [
    {
      id: 'the-archivists',
    name: 'The Archivists',
    tagline: 'Keepers of the forgotten lore.',
    description: `A lore-deepening circle where members share worldbuilding bibles, create collaborative mythologies, and preserve each other's continuity across sagas. We are the memory of the Parlour.`,
    seal: '⌇',
    members: 27,
    online: 4,
    tier: 'Collective',
    tags: ['lore', 'worldbuilding', 'continuity'],
    founders: ['Clara Vale', 'The Weaver'],
    mood: 'Ancient library, dust and vellum.',
    rules: ['Every submission archived', 'Respect canon', 'Cite your sources'],
    created: 'Autumn 2024',
  },
  {
    id: 'the-plot-garret',
    name: 'The Plot Garret',
    tagline: 'Where structure meets serendipity.',
    description: 'For Architects who plot with precision but leave room for the muse. Weekly plotting sprints, tension-map reviews, and collective troubleshooting for stuck narratives.',
    seal: '⚙',
    members: 33,
    online: 12,
    tier: 'Architect',
    tags: ['plotting', 'structure', 'sprints'],
    founders: ['R. Ashford', 'L. Morningstar'],
    mood: 'Blueprints scattered across a mahogany table.',
    rules: ['Share your outline', 'Respect the synopsis', 'Help untangle knots'],
    created: 'Winter 2024',
  },
  {
    id: 'the-red-ink-society',
    name: 'The Red Ink Society',
    tagline: 'Critique that cuts clean.',
    description: 'A Collective-tier circle for serious critique partners. Line-edit exchanges, structural reviews, and honest feedback delivered with craftsmanship. No praise without precision.',
    seal: '✎',
    members: 19,
    online: 3,
    tier: 'Collective',
    tags: ['critique', 'editing', 'beta-exchange'],
    founders: ['E. Thorne', 'Clara Vale', 'The Weaver'],
    mood: 'Red ink on cream paper. Clean cuts.',
    rules: ['One critique in, one critique out', 'No line edits on drafts under 10K', 'Be precise. Be kind.'],
    created: 'Spring 2025',
  },
  {
    id: 'the-hearth',
    name: 'The Hearth',
    tagline: 'A fire for the weary storyteller.',
    description: 'A low-pressure circle for writers in rest periods. Share what brings you joy, read for pleasure, and recharge without the pressure of production. Burnout has no place here.',
    seal: '🔥',
    members: 52,
    online: 15,
    tier: 'Architect',
    tags: ['rest', 'joy', 'community'],
    founders: ['M. Harrow', 'The Weaver'],
    mood: 'Crackling fire, wool blankets, tea.',
    rules: ['No word count goals', 'Share something beautiful', 'Rest is part of the craft'],
    created: 'Winter 2024',
  },
];

const defaultForm = {
  name: '',
  tagline: '',
  description: '',
  seal: '◈',
  tags: '',
  rules: '',
  mood: '',
};

// --- Sub-components ---

function CircleSeal({ seal, size = 'md' }) {
  const sizeClasses = {
    sm: 'w-10 h-10 text-base',
    md: 'w-14 h-14 text-xl',
    lg: 'w-20 h-20 text-3xl',
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full border border-parchment/15 flex items-center justify-center
                  bg-gradient-to-br from-ink-warm to-ink-light shadow-[0_0_20px_rgba(139,111,71,0.08)]
                  group-hover:border-sepia/30 group-hover:shadow-[0_0_25px_rgba(139,111,71,0.15)]
                  transition-all duration-500`}
    >
      {seal}
    </div>
  );
}

function CircleCard({ circle, onJoin, onView, userTier = 'Architect' }) {
  const canJoin = userTier === 'Architect' || userTier === 'Collective';
  const isCollectiveOnly = circle.tier === 'Collective';
  const hasAccess = userTier === 'Collective' || (userTier === 'Architect' && !isCollectiveOnly);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group card-paper rounded-sm p-5 border border-parchment/8 hover:border-parchment/15 transition-all duration-500 cursor-pointer"
      onClick={() => onView(circle.id)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <CircleSeal seal={circle.seal} size="md" />
        <div className="flex flex-col items-end gap-1.5">
          <span className={`text-[8px] uppercase tracking-[0.2em] px-1.5 py-0.5 rounded-sm border ${
            circle.tier === 'Collective'
              ? 'border-parchment/20 bg-parchment/5 text-parchment/50'
              : 'border-sepia/20 bg-sepia/10 text-sepia/60'
          }`}>
            {circle.tier}
          </span>
          <span className="text-[9px] text-parchment/30">{circle.members} members</span>
          <div className="flex items-center gap-1 text-[9px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 animate-pulse" />
            <span className="text-parchment/30">{circle.online} online</span>
          </div>
        </div>
      </div>

      {/* Name & Tagline */}
      <h3 className="text-base font-serif text-parchment/80 mb-1 group-hover:text-parchment transition-colors">
        {circle.name}
      </h3>
      <p className="text-xs text-sepia/50 italic mb-3">&ldquo;{circle.tagline}&rdquo;</p>

      {/* Description */}
      <p className="text-xs text-parchment/50 leading-relaxed font-light mb-4 line-clamp-3">
        {circle.description}
      </p>

      {/* Mood */}
      <div className="flex items-center gap-2 mb-4 text-[10px] text-parchment/30 italic">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1" className="text-sepia/40">
          <circle cx="5" cy="5" r="4" />
          <path d="M5 2v3l2 1" />
        </svg>
        {circle.mood}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {circle.tags.map((tag) => (
          <span key={tag} className="text-[9px] text-sepia/50 border border-sepia/15 px-1.5 py-0.5 rounded-sm">
            #{tag}
          </span>
        ))}
      </div>

      {/* Footer: Founders + Action */}
      <div className="flex items-center justify-between pt-4 border-t border-parchment/8">
        <div className="flex -space-x-2">
          {circle.founders.map((f, i) => (
            <div
              key={f}
              className={`w-6 h-6 rounded-full border-2 border-ink bg-gradient-to-br from-sepia/20 to-inkwell
                          flex items-center justify-center text-[6px] text-parchment/50 font-serif`}
              style={{ zIndex: circle.founders.length - i }}
            >
              {f[0]}
            </div>
          ))}
          <span className="text-[9px] text-parchment/30 ml-2 self-center">by {circle.founders.join(', ')}</span>
        </div>

        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          {hasAccess ? (
            <button
              onClick={() => onJoin(circle.id)}
              className="text-[9px] uppercase tracking-widest text-sepia/50 hover:text-sepia transition-colors border border-sepia/20 hover:border-sepia/40 px-3 py-1.5 rounded-sm"
            >
              Request Seal
            </button>
          ) : (
            <span className="text-[8px] text-parchment/20 italic px-2 py-1">
              {circle.tier} only
            </span>
          )}
          <button
            onClick={() => onView(circle.id)}
            className="text-[9px] uppercase tracking-widest text-parchment/30 hover:text-parchment/60 transition-colors px-2 py-1.5"
          >
            Peek →
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function CircleDetail({ circle, onBack, onJoin, userTier }) {
  const isMember = false; // Mock — would check actual membership
  const canJoin = userTier === 'Architect' || userTier === 'Collective';
  const isCollectiveOnly = circle.tier === 'Collective';
  const hasAccess = userTier === 'Collective' || (userTier === 'Architect' && !isCollectiveOnly);

  // Mock recent activity
  const recentActivity = [
    { type: 'fragment', author: 'E. Thorne', preview: 'The candle burned low, but the words kept coming. I think this is what they mean by flow...' },
    { type: 'question', author: 'M. Harrow', preview: 'Anyone else struggle with act breaks in multi-POV narratives?' },
    { type: 'journal', author: 'The Weaver', preview: 'Journal Entry: On the architecture of suspense in epistolary fiction...' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="card-paper rounded-sm border border-parchment/10 overflow-hidden"
    >
      {/* Detail Header */}
      <div className="relative p-6 md:p-8 border-b border-parchment/8">
        <div className="ink-bleed-decoration top-0 right-0" />

        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-[10px] text-parchment/30 hover:text-parchment/60 transition-colors mb-6 uppercase tracking-widest"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M7 2L3 6l4 4" />
          </svg>
          Back to Circles
        </button>

        <div className="flex items-start gap-6">
          <CircleSeal seal={circle.seal} size="lg" />
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-serif text-parchment-light mb-1">{circle.name}</h2>
                <p className="text-sm text-sepia/60 italic">&ldquo;{circle.tagline}&rdquo;</p>
              </div>
              <span className={`text-[9px] uppercase tracking-[0.2em] px-2 py-1 rounded-sm border ${
                circle.tier === 'Collective'
                  ? 'border-parchment/20 bg-parchment/5 text-parchment/50'
                  : 'border-sepia/20 bg-sepia/10 text-sepia/60'
              }`}>
                {circle.tier}
              </span>
            </div>

            <p className="text-sm text-parchment/50 leading-relaxed font-light mt-4 max-w-2xl">
              {circle.description}
            </p>

            {/* Stats row */}
            <div className="flex items-center gap-6 mt-5 text-xs text-parchment/40">
              <div className="flex items-center gap-1.5">
                <span className="text-parchment/60 font-medium">{circle.members}</span> members
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 animate-pulse" />
                <span className="text-parchment/60">{circle.online}</span> online
              </div>
              <div className="text-parchment/20">·</div>
              <div className="text-parchment/30">Founded {circle.created}</div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mt-4">
              {circle.tags.map((tag) => (
                <span key={tag} className="text-[10px] text-sepia/50 border border-sepia/15 px-2 py-0.5 rounded-sm">#{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detail Body */}
      <div className="grid md:grid-cols-3 gap-0">
        {/* Left — Activity Feed */}
        <div className="md:col-span-2 p-6 md:p-8 border-r border-parchment/8">
          <h4 className="text-[10px] uppercase tracking-widest text-parchment/30 mb-5 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-sepia/40" />
            Recent Murmurs
          </h4>

          <div className="space-y-4">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-ink-warm/30 rounded-sm border border-parchment/5 hover:bg-ink-warm/50 transition-colors cursor-pointer">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sepia/20 to-inkwell border border-parchment/8 flex items-center justify-center text-[8px] text-parchment/50 shrink-0 mt-0.5">
                  {activity.author[0]}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-[10px] text-parchment/30 mb-1">
                    <span className="text-parchment/50">{activity.author}</span>
                    <span className="text-parchment/20">·</span>
                    <span className="text-sepia/40 capitalize">{activity.type}</span>
                  </div>
                  <p className="text-xs text-parchment/60 leading-relaxed truncate">
                    {activity.preview}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button className="mt-5 text-[10px] uppercase tracking-widest text-sepia/50 hover:text-sepia transition-colors">
            View full circle feed →
          </button>
        </div>

        {/* Right — Sidebar */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Rules */}
          <div>
            <h4 className="text-[10px] uppercase tracking-widest text-parchment/30 mb-3">The Covenant</h4>
            <ul className="space-y-2">
              {circle.rules.map((rule, i) => (
                <li key={i} className="flex items-start gap-2 text-[11px] text-parchment/50 leading-relaxed">
                  <span className="text-sepia/40 mt-0.5">—</span>
                  {rule}
                </li>
              ))}
            </ul>
          </div>

          {/* Mood */}
          <div className="pt-4 border-t border-parchment/8">
            <h4 className="text-[10px] uppercase tracking-widest text-parchment/30 mb-2">Mood</h4>
            <p className="text-xs text-parchment/40 italic">{circle.mood}</p>
          </div>

          {/* Founders */}
          <div className="pt-4 border-t border-parchment/8">
            <h4 className="text-[10px] uppercase tracking-widest text-parchment/30 mb-3">Keepers of the Circle</h4>
            <div className="space-y-2">
              {circle.founders.map((f) => (
                <div key={f} className="flex items-center gap-2 text-xs text-parchment/50">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-sepia/20 to-inkwell border border-parchment/8 flex items-center justify-center text-[7px] text-parchment/50">
                    {f[0]}
                  </div>
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* Action */}
          <div className="pt-4 border-t border-parchment/8">
            {hasAccess ? (
              <>
                <button
                  onClick={() => onJoin(circle.id)}
                  className="w-full py-2.5 rounded-sm text-xs uppercase tracking-widest border border-sepia/30 text-sepia/70 hover:bg-sepia/10 transition-all"
                >
                  {isMember ? 'Enter the Circle →' : 'Request Seal'}
                </button>
                {!isMember && (
                  <p className="text-[9px] text-parchment/20 text-center mt-2 italic">
                    Your request will be reviewed by the Keepers
                  </p>
                )}
              </>
            ) : (
              <div className="text-center">
                <p className="text-xs text-parchment/30 italic mb-2">
                  This circle requires {circle.tier} tier
                </p>
                <button className="btn-ink text-[10px] w-full">Upgrade to {circle.tier}</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function CreateCircleForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState(defaultForm);
  const [step, setStep] = useState(1);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCircle = {
      ...form,
      id: form.name.toLowerCase().replace(/\s+/g, '-'),
      members: 1,
      online: 1,
      tier: 'Collective',
      founders: ['You'],
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      rules: form.rules.split('\n').filter(Boolean),
      created: new Date().toLocaleDateString('en-US', { year: 'numeric', season: 'numeric' }).replace(',', ''),
      mood: form.mood,
    };
    onSubmit(newCircle);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-paper rounded-sm border border-parchment/10 p-6 md:p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">◈</span>
        <div>
          <h3 className="text-lg font-serif text-parchment-light">Found a New Circle</h3>
          <p className="text-xs text-parchment/40">Collective tier — create a sanctuary for your people</p>
        </div>
        <span className="text-[8px] uppercase tracking-widest text-parchment/30 border border-parchment/10 px-2 py-0.5 rounded-sm ml-auto self-start">
          Collective+
        </span>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-[9px] transition-all ${
              step >= s ? 'border-sepia/50 bg-sepia/10 text-sepia/60' : 'border-parchment/10 text-parchment/20'
            }`}>
              {s}
            </div>
            {s < 3 && <div className={`w-8 h-px transition-colors ${step > s ? 'bg-sepia/30' : 'bg-parchment/8'}`} />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-parchment/30 mb-2">Circle Name</label>
              <input
                type="text"
                value={form.name}
                onChange={handleChange('name')}
                placeholder="e.g. The Night Scribes"
                className="input-inkwell w-full"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-parchment/30 mb-2">Tagline</label>
              <input
                type="text"
                value={form.tagline}
                onChange={handleChange('tagline')}
                placeholder="e.g. For those who write by starlight"
                className="input-inkwell w-full"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-parchment/30 mb-2">Seal (emoji or symbol)</label>
              <input
                type="text"
                value={form.seal}
                onChange={handleChange('seal')}
                placeholder="◈ ✦ ⌗ ⚜"
                className="input-inkwell w-24 text-center text-xl"
                maxLength={2}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-parchment/30 mb-2">Description</label>
              <textarea
                value={form.description}
                onChange={handleChange('description')}
                placeholder="What is this circle's purpose? Who is it for?"
                className="input-inkwell w-full h-24 resize-none"
                required
              />
            </div>
            <div className="flex justify-end">
              <button type="button" onClick={() => setStep(2)} className="btn-ink text-xs">
                Next: Character →
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-parchment/30 mb-2">Mood (one line)</label>
              <input
                type="text"
                value={form.mood}
                onChange={handleChange('mood')}
                placeholder="e.g. Candlelight and old paper"
                className="input-inkwell w-full"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-parchment/30 mb-2">Tags (comma-separated)</label>
              <input
                type="text"
                value={form.tags}
                onChange={handleChange('tags')}
                placeholder="fantasy, critique, late-night"
                className="input-inkwell w-full"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-parchment/30 mb-2">Circle Rules (one per line)</label>
              <textarea
                value={form.rules}
                onChange={handleChange('rules')}
                placeholder="Be respectful&#10;Share at least once per moon&#10;No unsolicited critique"
                className="input-inkwell w-full h-20 resize-none"
              />
            </div>
            <div className="flex justify-between">
              <button type="button" onClick={() => setStep(1)} className="text-xs text-parchment/40 hover:text-parchment/70 transition-colors">
                ← Back
              </button>
              <button type="button" onClick={() => setStep(3)} className="btn-ink text-xs">
                Review →
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            <div className="bg-ink-warm/40 border border-parchment/8 rounded-sm p-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full border border-parchment/15 flex items-center justify-center text-xl bg-gradient-to-br from-ink-warm to-ink-light">
                  {form.seal || '◈'}
                </div>
                <div>
                  <div className="text-sm font-serif text-parchment/80">{form.name || 'Untitled Circle'}</div>
                  <div className="text-xs text-sepia/50 italic">&ldquo;{form.tagline || 'A new sanctuary'}&rdquo;</div>
                </div>
              </div>
              <p className="text-xs text-parchment/50 leading-relaxed mb-3">{form.description || 'No description yet.'}</p>
              {form.mood && (
                <div className="text-[10px] text-parchment/30 italic mb-2">Mood: {form.mood}</div>
              )}
              {form.tags && (
                <div className="flex gap-1.5">
                  {form.tags.split(',').filter(Boolean).map((t) => (
                    <span key={t} className="text-[9px] text-sepia/50 border border-sepia/15 px-1.5 py-0.5 rounded-sm">#{t.trim()}</span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <button type="button" onClick={() => setStep(2)} className="text-xs text-parchment/40 hover:text-parchment/70 transition-colors">
                ← Edit
              </button>
              <button
                type="submit"
                className="btn-blood text-xs flex items-center gap-2"
              >
                <span>Found the Circle</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M1 6h10M6 1l5 5-5 5" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </form>
    </motion.div>
  );
}

function MembershipCard({ circle, status }) {
  return (
    <div className="flex items-center justify-between p-3 bg-ink-warm/40 border border-parchment/8 rounded-sm hover:bg-ink-warm/60 transition-colors group">
      <div className="flex items-center gap-3">
        <CircleSeal seal={circle.seal} size="sm" />
        <div>
          <div className="text-xs text-parchment/70">{circle.name}</div>
          <div className="text-[9px] text-parchment/30">{circle.members} members</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-[9px] px-1.5 py-0.5 rounded-sm border ${
          status === 'active' ? 'border-emerald-500/30 text-emerald-500/60' :
          status === 'pending' ? 'border-sepia/30 text-sepia/60' :
          'border-parchment/10 text-parchment/30'
        }`}>
          {status}
        </span>
        <button className="text-[9px] text-parchment/20 hover:text-parchment/50 transition-colors opacity-0 group-hover:opacity-100">
          ✕
        </button>
      </div>
    </div>
  );
}

// --- Main Component ---

export default function WriterCircles() {
  const [circles, setCircles] = useState(FEATURED_CIRCLES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchCircles().then(data => {
      const mapped = data.map(c => ({
        ...c,
        tagline: c.tagline || 'A new sanctuary for writers.',
        seal: c.seal || '◈',
        members: Math.floor(Math.random() * 50) + 1,
        online: Math.floor(Math.random() * 10),
        tier: c.tier || 'Architect',
        tags: c.tags || ['community'],
        founders: c.founders || ['The Architect'],
        mood: c.mood || 'New ink on fresh paper.',
        rules: c.rules || ['Be kind', 'Write often'],
        created: c.created || 'Today'
      }));
      // Filter out mocks if they are already in the data (by ID)
      const existingIds = new Set(mapped.map(c => c.id));
      const uniqueMocks = FEATURED_CIRCLES.filter(c => !existingIds.has(c.id));
      setCircles([...uniqueMocks, ...mapped]);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const [view, setView] = useState('browse'); // browse | detail | create | my-circles
  const [selectedCircle, setSelectedCircle] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [joinedCircles, setJoinedCircles] = useState([]);
  const [userTier, setUserTier] = useState('Architect'); // Mock tier
  const [filterTier, setFilterTier] = useState('all');

  const filteredCircles = filterTier === 'all'
    ? circles
    : circles.filter((c) => c.tier === filterTier);

  const handleJoin = (circleId) => {
    if (!joinedCircles.includes(circleId)) {
      setJoinedCircles([...joinedCircles, circleId]);
    }
  };

  const handleView = (circleId) => {
    const circle = circles.find((c) => c.id === circleId);
    setSelectedCircle(circle);
    setView('detail');
  };

  const handleCreateCircle = (newCircle) => {
    console.log('New circle created:', newCircle);
    setShowCreateForm(false);
    setView('browse');
    // In real implementation, this would save to DB
  };

  const myCircles = circles.filter((c) => joinedCircles.includes(c.id));

  return (
    <section className="relative py-24 px-6 bg-gradient-to-b from-transparent via-inkwell/20 to-transparent" id="circles">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.015] mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: "url('/assets/paper-texture.webp')" }}
      />

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
            <span className="text-ornament">WRITER CIRCLES</span>
            <span className="text-[8px] uppercase tracking-widest text-parchment/30 border border-parchment/10 px-1.5 py-0.5 rounded-sm">
              Architect+
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif text-parchment-light mb-4">
                Private <span className="italic text-sepia/70">lounges</span> for the devoted
              </h2>
              <p className="text-parchment/50 max-w-xl font-light leading-relaxed">
                Exclusive writer circles — intimate communities within the Parlour. 
                Architects find their circle. Collectives build them.
              </p>
            </div>

            {/* Tier switcher */}
            <div className="flex items-center gap-2 bg-ink-warm/60 border border-parchment/8 rounded-sm p-1">
              {[
                { id: 'all', label: 'All Circles' },
                { id: 'Architect', label: 'Architect' },
                { id: 'Collective', label: 'Collective' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setFilterTier(t.id)}
                  className={`text-[10px] px-3 py-1.5 rounded-sm uppercase tracking-wider transition-all ${
                    filterTier === t.id
                      ? 'bg-sepia/20 text-sepia/70 border border-sepia/20'
                      : 'text-parchment/30 hover:text-parchment/60 border border-transparent'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* View routing */}
        <AnimatePresence mode="wait">
          {view === 'detail' && selectedCircle ? (
            <CircleDetail
              key="detail"
              circle={selectedCircle}
              onBack={() => setView('browse')}
              onJoin={handleJoin}
              userTier={userTier}
            />
          ) : view === 'browse' && showCreateForm ? (
            <CreateCircleForm
              key="create"
              onSubmit={handleCreateCircle}
              onCancel={() => setShowCreateForm(false)}
            />
          ) : (
            <motion.div key="browse" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* User's Circles */}
              {joinedCircles.length > 0 && (
                <div className="mb-10">
                  <h4 className="text-xs uppercase tracking-widest text-parchment/30 mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/40" />
                    Your Circles
                    <span className="text-parchment/20 text-[9px]">({joinedCircles.length})</span>
                  </h4>
                  <div className="grid md:grid-cols-3 gap-3">
                    {myCircles.map((circle) => (
                      <MembershipCard key={circle.id} circle={circle} status="active" />
                    ))}
                  </div>
                  <div className="mt-6 ink-divider" />
                </div>
              )}

              {/* Browse Circles */}
              <div className="grid md:grid-cols-2 gap-5">
                {filteredCircles.map((circle) => (
                  <CircleCard
                    key={circle.id}
                    circle={circle}
                    onJoin={handleJoin}
                    onView={handleView}
                    userTier={userTier}
                  />
                ))}
              </div>

              {filteredCircles.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-full border border-parchment/10 flex items-center justify-center text-2xl mx-auto mb-4 text-parchment/20">
                    ◈
                  </div>
                  <p className="text-sm text-parchment/30 italic">No circles in this tier yet.</p>
                </div>
              )}

              {/* Create Circle CTA */}
              {userTier === 'Collective' && !showCreateForm && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="mt-10 card-paper rounded-sm border border-dashed border-parchment/10 p-6 text-center group hover:border-sepia/20 transition-all cursor-pointer"
                  onClick={() => setShowCreateForm(true)}
                >
                  <div className="society-seal mx-auto mb-4 text-xl group-hover:border-sepia/30 transition-all">
                    +
                  </div>
                  <h3 className="text-base font-serif text-parchment/70 mb-2 group-hover:text-parchment transition-colors">
                    Found a New Circle
                  </h3>
                  <p className="text-xs text-parchment/40 font-light max-w-md mx-auto">
                    As a Collective member, you can create private writer circles. 
                    Design the seal. Write the covenant. Curate the company.
                  </p>
                  <button className="btn-ink text-xs mt-5">
                    Create Your Circle
                  </button>
                </motion.div>
              )}

              {/* Upgrade prompt for Architects */}
              {userTier === 'Architect' && !showCreateForm && (
                <div className="mt-10 text-center">
                  <div className="old-paper inline-block rounded-sm px-6 py-4 border border-parchment/8">
                    <p className="text-xs text-parchment/30">
                      <span className="text-parchment/50">Architects</span> can join any Architect-tier circle.{' '}
                      <span className="text-parchment/50">Collective</span> members can create and manage them.
                    </p>
                    <button className="text-[10px] uppercase tracking-widest text-sepia/50 hover:text-sepia transition-colors mt-3">
                      Upgrade to Collective →
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom note */}
        <div className="text-center mt-10">
          <div className="flex items-center justify-center gap-4 text-[10px] text-parchment/20">
            <span>✦ Circles are invite-only sanctuaries</span>
            <span className="w-px h-3 bg-parchment/10" />
            <span>Your membership is private</span>
            <span className="w-px h-3 bg-parchment/10" />
            <span>Keepers control the covenant</span>
          </div>
        </div>
      </div>
    </section>
  );
}