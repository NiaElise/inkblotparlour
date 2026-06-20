import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchJournals, createJournal, lookupDictionary, fetchStoryChapters } from '../../api';
import StorySeriesManager from '../StorySeriesManager';

export default function SanctuaryJournal() {
  const [journals, setJournals] = useState([]);
  const [activeType, setActiveType] = useState('standalone');
  const [isWriting, setIsWriting] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Editor State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('standalone');
  const [parentId, setParentId] = useState('');
  const [chapterNumber, setChapterNumber] = useState('');
  
  // Dictionary State
  const [lookupWord, setLookupWord] = useState('');
  const [definition, setDefinition] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const [series, setSeries] = useState([]);

  useEffect(() => {
    loadJournals();
    if (activeType === 'story') {
      fetchSeries().then(setSeries).catch(console.error);
    }
  }, [activeType]);

  const loadJournals = async () => {
    try {
      setLoading(true);
      const data = await fetchJournals(activeType);
      setJournals(data);
    } catch (err) {
      console.error('Failed to load journals', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createJournal(title, content, type, chapterNumber || undefined, parentId || undefined);
      setIsWriting(false);
      setTitle('');
      setContent('');
      loadJournals();
    } catch (err) {
      alert(err.message || 'Failed to save journal');
    }
  };

  const handleLookup = async () => {
    if (!lookupWord.trim()) return;
    setIsSearching(true);
    setDefinition(null);
    try {
      const data = await lookupDictionary(lookupWord);
      if (Array.isArray(data)) {
        setDefinition(data[0]);
      } else {
        setDefinition({ word: lookupWord, meanings: [{ partOfSpeech: 'Error', definitions: [{ definition: 'No definition found.' }] }] });
      }
    } catch (err) {
      console.error('Lookup failed', err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-8">
      <header className="border-b border-parchment/10 pb-6 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] text-sepia/60 mb-3">
            <span>Sanctuary</span>
            <span className="opacity-30">/</span>
            <span>Journal</span>
          </div>
          <h1 className="text-4xl font-serif text-parchment/90">The <span className="italic text-sepia/70">Chronicler's</span> Desk</h1>
        </div>
        <button 
          onClick={() => setIsWriting(true)}
          className="px-6 py-2 bg-sepia/20 border border-sepia/30 text-sepia text-[10px] uppercase tracking-widest hover:bg-sepia/30 transition-all"
        >
          New Entry
        </button>
      </header>

      <nav className="flex items-center gap-8 border-b border-parchment/5">
        {['standalone', 'story'].map((t) => (
          <button
            key={t}
            onClick={() => setActiveType(t)}
            className={`pb-4 text-[11px] uppercase tracking-widest transition-all relative ${
              activeType === t ? 'text-sepia' : 'text-parchment/30 hover:text-parchment/60'
            }`}
          >
            {t === 'standalone' ? 'Fragments & Reflections' : 'Story Series'}
            {activeType === t && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sepia/50" />
            )}
          </button>
        ))}
      </nav>

      {isWriting ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              <input 
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Entry Title..."
                className="w-full bg-transparent border-b border-parchment/10 py-2 text-xl font-serif text-parchment/80 placeholder:text-parchment/10 focus:outline-none focus:border-sepia/40"
              />
              
              <div className="flex gap-4">
                <select 
                  value={type}
                  onChange={e => setType(e.target.value)}
                  className="bg-ink-well/40 border border-parchment/10 rounded-sm px-2 py-1 text-[10px] text-parchment/60 outline-none"
                >
                  <option value="standalone">Standalone Fragment</option>
                  <option value="story">Story Chapter</option>
                </select>
                
                {type === 'story' && (
                  <>
                    <select 
                      value={parentId}
                      onChange={e => setParentId(e.target.value)}
                      className="bg-ink-well/40 border border-parchment/10 rounded-sm px-2 py-1 text-[10px] text-parchment/60 outline-none max-w-[150px]"
                    >
                      <option value="">Select Series...</option>
                      {series.map(s => (
                        <option key={s.id} value={s.id}>{s.title}</option>
                      ))}
                    </select>
                    <input 
                      type="number"
                      value={chapterNumber}
                      onChange={e => setChapterNumber(e.target.value)}
                      placeholder="Ch #"
                      className="w-16 bg-ink-well/40 border border-parchment/10 rounded-sm px-2 py-1 text-[10px] text-parchment/60 outline-none"
                    />
                  </>
                )}
              </div>

              <textarea 
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Spill your ink here..."
                className="w-full h-96 bg-ink-warm/10 border border-parchment/5 rounded-sm p-6 text-sm text-parchment/60 leading-relaxed placeholder:text-parchment/5 focus:outline-none focus:border-parchment/10 resize-none"
              />
            </div>

            <div className="flex justify-end gap-4">
              <button 
                onClick={() => setIsWriting(false)}
                className="px-6 py-2 text-[10px] uppercase tracking-widest text-parchment/30 hover:text-parchment/60 transition-all"
              >
                Discard
              </button>
              <button 
                onClick={handleCreate}
                className="px-8 py-2 bg-sepia/60 text-void text-[10px] font-bold uppercase tracking-widest hover:bg-sepia transition-all"
              >
                Inscribe
              </button>
            </div>
          </div>

          {/* Dictionary Sidebar */}
          <div className="space-y-6">
            <div className="p-6 bg-ink-well/40 border border-parchment/10 rounded-sm space-y-4">
              <h3 className="text-[10px] uppercase tracking-widest text-sepia/60 border-b border-parchment/5 pb-2">The Lexicon</h3>
              <div className="flex gap-2">
                <input 
                  value={lookupWord}
                  onChange={e => setLookupWord(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLookup()}
                  placeholder="Define a word..."
                  className="flex-1 bg-void/50 border border-parchment/10 rounded-sm px-3 py-1.5 text-xs text-parchment/60 placeholder:text-parchment/10 focus:outline-none focus:border-sepia/30"
                />
                <button 
                  onClick={handleLookup}
                  className="px-3 py-1.5 bg-parchment/5 hover:bg-parchment/10 border border-parchment/10 text-parchment/40 text-xs transition-all"
                >
                  {isSearching ? '...' : '→'}
                </button>
              </div>

              <AnimatePresence mode="wait">
                {definition && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3 pt-2"
                  >
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-serif text-parchment/80 capitalize">{definition.word}</span>
                      <span className="text-[9px] italic text-parchment/30">{definition.phonetic}</span>
                    </div>
                    {definition.meanings.slice(0, 2).map((m, i) => (
                      <div key={i} className="space-y-1">
                        <div className="text-[8px] uppercase tracking-tighter text-sepia/40">{m.partOfSpeech}</div>
                        <p className="text-[11px] text-parchment/50 leading-relaxed italic">
                          {m.definitions[0].definition}
                        </p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      ) : activeType === 'standalone' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {journals.map((j) => (
            <div key={j.id} className="p-6 border border-parchment/10 bg-ink-warm/10 hover:border-sepia/30 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-8 h-8 bg-ink-well border border-parchment/5 flex items-center justify-center text-parchment/20 text-xs">
                  ✒
                </div>
                <span className="text-[8px] text-parchment/20 uppercase tracking-widest">{new Date(j.created_at).toLocaleDateString()}</span>
              </div>
              <h3 className="font-serif text-parchment/80 group-hover:text-sepia transition-colors mb-2">{j.title}</h3>
              <p className="text-[12px] text-parchment/40 line-clamp-4 leading-relaxed italic">
                {j.content}
              </p>
            </div>
          ))}
          
          {journals.length === 0 && !loading && (
            <div className="col-span-full py-20 border border-dashed border-parchment/5 flex flex-col items-center justify-center text-parchment/10">
              <span className="text-4xl mb-4">✒</span>
              <p className="text-sm italic">The pages remain blank, waiting for your journey.</p>
            </div>
          )}
        </div>
      ) : (
        <StorySeriesManager />
      )}
    </div>
  );
}
