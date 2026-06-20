import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchSeries, fetchStoryChapters, createJournal } from '../api';

const mockSeries = [
  {
    id: 1, title: 'The Forgotten City', icon: '⬗', status: 'Ongoing',
    description: 'A cartographer searches for a city that should not exist. Each chapter reveals a new layer of the conspiracy.',
    chapters: 12, words: 45200, lastUpdated: '2h ago',
    cover: null,
    tags: ['dark-fantasy', 'mystery', 'gothic'],
  },
  {
    id: 2, title: 'The Bloodline Pact', icon: '◉', status: 'Ongoing',
    description: 'Blood binds. Secrets unravel. A family saga written in ink and sacrifice.',
    chapters: 7, words: 21300, lastUpdated: '1d ago',
    cover: null,
    tags: ['family-saga', 'dark-fantasy'],
  },
  {
    id: 3, title: 'Echoes of Ash', icon: '✦', status: 'Hiatus',
    description: 'From the ashes of an old world, a new one rises. Currently on hiatus while the author rebuilds the outline.',
    chapters: 4, words: 8700, lastUpdated: '5d ago',
    cover: null,
    tags: ['post-apocalyptic', 'rebirth'],
  },
];

const mockChapters = [
  { id: 1, title: 'The Arrival', status: 'published', words: 2450, updated: '2 days ago', summary: 'Elias arrives at the edge of the Forgotten City. The gates are open. They should not be.' },
  { id: 2, title: 'Threads in the Dark', status: 'published', words: 3800, updated: '2 days ago', summary: 'The Weaver threads are everywhere. Elias begins to see the pattern.' },
  { id: 3, title: 'Clara\'s Letter', status: 'draft', words: 2100, updated: '1 day ago', summary: 'A letter arrives that changes everything Elias thought he knew.' },
  { id: 4, title: 'The Weaver\'s Loom', status: 'draft', words: 620, updated: '3h ago', summary: 'The heart of the city. The source of the threads.' },
  { id: 5, title: 'The Third Sun', status: 'idea', words: 0, updated: 'Just now', summary: 'A chapter about the third sun - its fall and what it means.' },
];

function ChapterRow({ chapter, index, isActive, onSelect }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-center gap-4 p-3 rounded-sm border transition-all cursor-pointer ${
        isActive ? 'bg-sepia/10 border-sepia/30' : 'bg-ink-warm/20 border-parchment/5 hover:bg-ink-warm/40 hover:border-parchment/15'
      }`}
      onClick={() => onSelect(chapter.id)}
    >
      {/* Chapter Number */}
      <div className="w-8 h-8 rounded-full bg-ink-warm/50 border border-parchment/10 flex items-center justify-center text-[10px] font-serif text-parchment/40 shrink-0">
        {String(index + 1).padStart(2, '0')}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-serif text-parchment/70 truncate">{chapter.title}</span>
          <span className={`text-[8px] px-1.5 py-0.5 rounded-sm border uppercase tracking-wider shrink-0 ${
            chapter.status === 'published' ? 'border-emerald-500/30 text-emerald-500/60' :
            chapter.status === 'draft' ? 'border-sepia/30 text-sepia/60' :
            'border-parchment/10 text-parchment/30'
          }`}>{chapter.status}</span>
        </div>
        <p className="text-[10px] text-parchment/40 mt-0.5 truncate">{chapter.summary}</p>
      </div>

      {/* Stats */}
      <div className="text-right text-[9px] text-parchment/30 shrink-0">
        <div>{chapter.words.toLocaleString()} words</div>
        <div className="text-parchment/20">{chapter.updated}</div>
      </div>

      {/* Actions */}
      <button className="text-parchment/20 hover:text-parchment/50 transition-colors p-1" title="Edit chapter">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M8 1l3 3L4 11H1V8l7-7z"/>
        </svg>
      </button>
    </motion.div>
  );
}

function CreateSeriesForm({ onCancel, onSubmit }) {
  const [form, setForm] = useState({ title: '', description: '', tags: '', icon: '◉' });
  const handleChange = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));
  const handleSubmit = (e) => { e.preventDefault(); if (form.title.trim()) { onSubmit({ ...form, id: Date.now(), chapters: 0, words: 0, lastUpdated: 'Just now', status: 'Ongoing', tags: form.tags.split(',').map(t => t.trim()) }); } };
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-paper rounded-sm border border-parchment/10 p-6">
      <h3 className="text-base font-serif text-parchment/80 mb-4">New Story Series</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-[9px] uppercase tracking-widest text-parchment/30 block mb-1.5">Title</label>
          <input type="text" value={form.title} onChange={handleChange('title')} placeholder="e.g. The Sunless Sea" className="w-full bg-ink-warm/50 border border-parchment/10 rounded-sm px-3 py-2 text-xs text-parchment/60 placeholder:text-parchment/20 focus:outline-none focus:border-sepia/30" required />
        </div>
        <div>
          <label className="text-[9px] uppercase tracking-widest text-parchment/30 block mb-1.5">Description</label>
          <textarea value={form.description} onChange={handleChange('description')} placeholder="What is this story series about?" className="w-full bg-ink-warm/50 border border-parchment/10 rounded-sm px-3 py-2 text-xs text-parchment/60 placeholder:text-parchment/20 resize-none h-20 focus:outline-none focus:border-sepia/30" />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-[9px] uppercase tracking-widest text-parchment/30 block mb-1.5">Icon</label>
            <input type="text" value={form.icon} onChange={handleChange('icon')} className="w-16 bg-ink-warm/50 border border-parchment/10 rounded-sm px-3 py-2 text-center text-lg focus:outline-none focus:border-sepia/30" maxLength={2} />
          </div>
          <div className="flex-[3]">
            <label className="text-[9px] uppercase tracking-widest text-parchment/30 block mb-1.5">Tags (comma-separated)</label>
            <input type="text" value={form.tags} onChange={handleChange('tags')} placeholder="dark-fantasy, mystery" className="w-full bg-ink-warm/50 border border-parchment/10 rounded-sm px-3 py-2 text-xs text-parchment/60 placeholder:text-parchment/20 focus:outline-none focus:border-sepia/30" />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded-sm text-[10px] text-parchment/30 hover:text-parchment/60 uppercase tracking-wider">Cancel</button>
          <button type="submit" className="px-5 py-2 rounded-sm bg-sepia/15 border border-sepia/20 text-[10px] text-sepia/60 hover:bg-sepia/25 uppercase tracking-wider">Create Series</button>
        </div>
      </form>
    </motion.div>
  );
}

function SeriesCard({ series, isActive, onSelect, onDelete }) {
  return (
    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className={`card-paper rounded-sm p-4 border transition-all cursor-pointer group ${
        isActive ? 'border-sepia/30' : 'border-parchment/8 hover:border-parchment/15'
      }`}
      onClick={() => onSelect(series.id)}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sepia/20 to-inkwell border border-parchment/10 flex items-center justify-center text-lg shrink-0">
          {series.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-serif text-parchment/80 truncate group-hover:text-parchment transition-colors">{series.title}</h3>
            <span className={`text-[8px] px-1.5 py-0.5 rounded-sm border uppercase tracking-wider shrink-0 ${
              series.status === 'Ongoing' ? 'border-emerald-500/30 text-emerald-500/60' : 'border-sepia/30 text-sepia/60'
            }`}>{series.status}</span>
          </div>
          <p className="text-[10px] text-parchment/40 mt-1 line-clamp-2">{series.description}</p>
          <div className="flex items-center gap-3 mt-2 text-[9px] text-parchment/30">
            <span>{series.chapters} chapters</span>
            <span className="w-px h-3 bg-parchment/10" />
            <span>{series.words.toLocaleString()} words</span>
            <span className="w-px h-3 bg-parchment/10" />
            <span>{series.lastUpdated}</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {series.tags.map(t => <span key={t} className="text-[8px] text-sepia/50 border border-sepia/15 px-1 py-0.5 rounded-sm">#{t}</span>)}
          </div>
        </div>
        <button onClick={(e) => { e.stopPropagation(); onDelete(series.id); }}
          className="text-parchment/10 hover:text-blood/50 transition-colors opacity-0 group-hover:opacity-100 p-1 shrink-0">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M2 3h8M4 3V1h4v2M3 3l1 8h4l1-8"/>
          </svg>
        </button>
      </div>
    </motion.div>
  );
}

export default function StorySeriesManager() {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSeries, setActiveSeries] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [view, setView] = useState('overview'); // overview | chapters
  const [chapters, setChapters] = useState([]);
  const [activeChapter, setActiveChapter] = useState(null);

  useEffect(() => {
    loadSeries();
  }, []);

  const loadSeries = async () => {
    try {
      setLoading(true);
      const data = await fetchSeries();
      setSeries(data.map(s => ({
        ...s,
        icon: '⌇',
        status: 'Ongoing',
        description: s.content || 'No description provided.',
        chapters: 0, // Would need another query or join
        words: s.content?.length || 0,
        lastUpdated: new Date(s.created_at).toLocaleDateString(),
        tags: []
      })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeSeries && view === 'chapters') {
      loadChapters(activeSeries);
    }
  }, [activeSeries, view]);

  const loadChapters = async (parentId) => {
    try {
      const data = await fetchStoryChapters(parentId);
      setChapters(data);
    } catch (err) {
      console.error(err);
    }
  };

  const currentSeries = series.find(s => s.id === activeSeries);

  const handleCreateSeries = async (newSeries) => {
    try {
      await createJournal(newSeries.title, newSeries.description, 'story');
      setShowCreate(false);
      loadSeries();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteSeries = (id) => {
    setSeries(prev => prev.filter(s => s.id !== id));
    if (activeSeries === id) setActiveSeries(series[0]?.id || null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="h-px w-6 bg-sepia/40" />
        <span className="text-ornament">SERIES MANAGEMENT</span>
      </div>

      {view === 'overview' && (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-serif text-parchment-light">Your Story Series</h2>
              <p className="text-sm text-parchment/40 font-light mt-1">{series.length} series · {series.reduce((a, s) => a + s.chapters, 0)} total chapters</p>
            </div>
            <button onClick={() => setShowCreate(true)} className="btn-ink text-[10px] flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 1v10M1 6h10"/></svg>
              New Series
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {series.map(s => <SeriesCard key={s.id} series={s} isActive={activeSeries === s.id} onSelect={(id) => { setActiveSeries(id); setView('chapters'); }} onDelete={handleDeleteSeries} />)}
          </div>

          {series.length === 0 && (
            <div className="text-center py-16 card-paper rounded-sm border border-dashed border-parchment/10">
              <p className="text-parchment/20 text-3xl mb-3">⌇</p>
              <p className="text-sm text-parchment/30 italic mb-4">No story series yet.</p>
              <button onClick={() => setShowCreate(true)} className="btn-ink text-xs">Create Your First Series</button>
            </div>
          )}

          <AnimatePresence>{showCreate && <CreateSeriesForm onCancel={() => setShowCreate(false)} onSubmit={handleCreateSeries} />}</AnimatePresence>
        </>
      )}

      {view === 'chapters' && currentSeries && (
        <>
          <button onClick={() => setView('overview')} className="flex items-center gap-1.5 text-[10px] text-parchment/30 hover:text-parchment/60 transition-colors uppercase tracking-widest">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M7 2L3 6l4 4"/></svg>
            Back to Series
          </button>

          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sepia/20 to-inkwell border border-parchment/10 flex items-center justify-center text-xl">{currentSeries.icon}</div>
              <div>
                <h2 className="text-2xl font-serif text-parchment-light">{currentSeries.title}</h2>
                <div className="flex items-center gap-3 text-xs text-parchment/30 mt-1">
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-sm border uppercase tracking-wider ${currentSeries.status === 'Ongoing' ? 'border-emerald-500/30 text-emerald-500/60' : 'border-sepia/30 text-sepia/60'}`}>{currentSeries.status}</span>
                  <span>{chapters.length} chapters</span>
                  <span>{chapters.reduce((a, c) => a + c.words, 0).toLocaleString()} words total</span>
                </div>
              </div>
            </div>
            <button className="btn-ink text-[10px] flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 1v10M1 6h10"/></svg>
              Add Chapter
            </button>
          </div>

          {/* Chapter list */}
          <div className="space-y-2 mt-6">
            {chapters.map((ch, i) => (
              <ChapterRow key={ch.id} chapter={ch} index={i} isActive={activeChapter === ch.id} onSelect={setActiveChapter} />
            ))}
          </div>

          {/* Chapter detail */}
          {activeChapter && (() => {
            const ch = chapters.find(c => c.id === activeChapter);
            if (!ch) return null;
            return (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-paper rounded-sm p-5 border border-parchment/10 mt-4">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 text-[10px] text-parchment/30 mb-1">
                      <span className="text-parchment/50">Chapter {chapters.findIndex(c => c.id === activeChapter) + 1}</span>
                      <span className="w-px h-3 bg-parchment/10" />
                      <span>{ch.words.toLocaleString()} words</span>
                      <span className="w-px h-3 bg-parchment/10" />
                      <span>{ch.updated}</span>
                    </div>
                    <h3 className="text-lg font-serif text-parchment/80">{ch.title}</h3>
                  </div>
                  <span className={`text-[8px] px-1.5 py-0.5 rounded-sm border uppercase tracking-wider ${
                    ch.status === 'published' ? 'border-emerald-500/30 text-emerald-500/60' :
                    ch.status === 'draft' ? 'border-sepia/30 text-sepia/60' :
                    'border-parchment/10 text-parchment/30'
                  }`}>{ch.status}</span>
                </div>

                <div className="border-l-2 border-sepia/20 pl-4 py-1 mb-4">
                  <p className="text-xs text-parchment/50 italic leading-relaxed">{ch.summary}</p>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-parchment/8">
                  <button className="flex items-center gap-1.5 text-[10px] text-sepia/50 hover:text-sepia transition-colors uppercase tracking-wider">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M8 1l3 3L4 11H1V8l7-7z"/></svg>
                    Edit
                  </button>
                  <button className="flex items-center gap-1.5 text-[10px] text-parchment/30 hover:text-parchment/60 transition-colors uppercase tracking-wider">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M2 3h8M4 3V1h4v2"/></svg>
                    Delete
                  </button>
                  <button className="flex items-center gap-1.5 text-[10px] text-parchment/30 hover:text-parchment/60 transition-colors uppercase tracking-wider">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M4 4h6a2 2 0 012 2v4a2 2 0 01-2 2H6l-3 2V6a2 2 0 012-2z"/></svg>
                    Notes
                  </button>
                </div>
              </motion.div>
            );
          })()}

          <div className="text-center mt-6">
            <div className="old-paper inline-block rounded-sm px-4 py-2 border border-parchment/8">
              <p className="text-[9px] text-parchment/20 italic">Chapters are numbered sequentially. Drag to reorder coming soon.</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
