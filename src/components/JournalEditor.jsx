import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const mockChapters = [
  { id: 1, title: 'The Arrival', status: 'published', words: 2450, updated: '2 days ago' },
  { id: 2, title: 'Threads in the Dark', status: 'draft', words: 1800, updated: '1 day ago' },
  { id: 3, title: "The Weaver's Loom", status: 'draft', words: 620, updated: '3h ago' },
  { id: 4, title: 'A Letter from Clara', status: 'idea', words: 120, updated: 'Just now' },
];

const dict = {
  inkblot: 'n. A stain or mark made by ink on paper, often accidental but sometimes intentional.',
  parchment: 'n. A writing material made from animal skin, used historically for important documents.',
  fragment: 'n. A piece of writing that stands alone but suggests a larger whole.',
  sanctuary: 'n. A safe place. In the Parlour, it is your private workspace.',
  vignette: 'n. A brief, evocative piece of writing. A snapshot in words.',
  lore: 'n. The body of knowledge and history built around a fictional world.',
  tension: 'n. The measurable stakes between characters, events, or forces.',
  thread: 'n. A narrative line connecting events, characters, and secrets.',
};

function DictPanel({ isOpen, onClose }) {
  const [search, setSearch] = useState('');
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);
  const h = () => { if (search.trim()) { setResult(dict[search.toLowerCase().trim()] || null); setSearched(true); } };
  return (<AnimatePresence>{isOpen && (<motion.div initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:20}} className="w-80 shrink-0 border-l border-parchment/10 bg-inkwell/60 flex flex-col">
    <div className="flex items-center justify-between px-4 py-3 border-b border-parchment/10">
      <div className="flex items-center gap-2"><span className="text-sepia/60 text-sm">📖</span><span className="text-xs uppercase tracking-widest text-parchment/40">Dictionary</span></div>
      <button onClick={onClose} className="text-parchment/20 hover:text-parchment/60"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M4 4l6 6M10 4l-6 6"/></svg></button>
    </div>
    <div className="px-4 py-3 border-b border-parchment/10">
      <div className="flex items-center gap-1">
        <input type="text" value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==='Enter'&&h()} placeholder="Search..." className="flex-1 bg-ink-warm/50 border border-parchment/10 rounded-sm px-2.5 py-1.5 text-xs text-parchment/60 placeholder:text-parchment/20 focus:outline-none focus:border-sepia/30" />
        <button onClick={h} className="px-2 py-1.5 rounded-sm bg-sepia/15 border border-sepia/15 text-parchment/50 hover:bg-sepia/25"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="5" cy="5" r="4"/><path d="M8 8l3 3"/></svg></button>
      </div>
    </div>
    <div className="flex-1 overflow-y-auto px-4 py-4">
      {searched && !result && <div className="text-center py-8"><p className="text-parchment/20 text-lg mb-2">⌇</p><p className="text-xs text-parchment/30 italic">Not found in the lexicon.</p></div>}
      {result && <div className="border-l-2 border-sepia/30 pl-3"><p className="text-sm font-serif text-parchment/80 italic mb-1">&ldquo;{search}&rdquo;</p><p className="text-xs text-parchment/50 leading-relaxed font-light">{result}</p></div>}
      {!searched && <div className="text-center py-8"><p className="text-parchment/20 text-lg mb-2">📖</p><p className="text-xs text-parchment/30 italic">Search the lexicon.</p></div>}
    </div>
    <div className="px-4 py-2 border-t border-parchment/10"><p className="text-[7px] text-parchment/15 text-center uppercase tracking-widest">Built-in Dictionary · All Tiers</p></div>
  </motion.div>)}</AnimatePresence>);
}

function ChapterList({ chapters, activeChapter, onSelect, onAdd }) {
  return (<div className="space-y-1">{chapters.map(ch => (
    <button key={ch.id} onClick={()=>onSelect(ch.id)} className={`w-full flex items-center justify-between px-3 py-2 rounded-sm text-left text-xs transition-all ${activeChapter===ch.id?'bg-sepia/10 border-l-2 border-sepia/50':'hover:bg-ink-warm/40 border-l-2 border-transparent'}`}>
      <div className="min-w-0 flex-1"><div className="text-parchment/70 truncate">{ch.title}</div>
        <div className="flex items-center gap-2 text-[9px] text-parchment/30 mt-0.5">
          <span className={ch.status==='published'?'text-emerald-500/50':ch.status==='draft'?'text-sepia/50':'text-parchment/20'}>{ch.status}</span>
          <span>{ch.words}w</span><span>{ch.updated}</span>
        </div>
      </div>
    </button>))}
    <button onClick={onAdd} className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-sm border border-dashed border-parchment/10 text-xs text-parchment/20 hover:text-parchment/40 hover:border-parchment/20 transition-all mt-2">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M6 1v10M1 6h10"/></svg>New Chapter
    </button>
  </div>);
}

export default function JournalEditor() {
  const [type, setType] = useState('story');
  const [activeCh, setActiveCh] = useState(3);
  const [showDict, setShowDict] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [content, setContent] = useState('The threads are tightening. I can feel it in the way the ink resists the page tonight.\n\nPerhaps that is the sign of a narrative worth writing: when it fights you.');
  const ch = mockChapters.find(c=>c.id===activeCh);
  return (
    <div className="flex h-[600px] border border-parchment/10 rounded-sm overflow-hidden bg-ink-light/60">
      <div className="w-64 shrink-0 border-r border-parchment/10 bg-inkwell/30 flex flex-col">
        <div className="px-4 py-4 border-b border-parchment/10 space-y-3">
          <h3 className="text-[10px] uppercase tracking-widest text-parchment/30"><span className="w-1.5 h-1.5 rounded-full bg-sepia/40 inline-block mr-2"/>Journal Format</h3>
          <div className="flex gap-1 bg-ink-warm/40 rounded-sm p-0.5">
            {[{id:'standalone',label:'Standalone',icon:'✦'},{id:'story',label:'Story',icon:'⌇'}].map(t => (
              <button key={t.id} onClick={()=>setType(t.id)} className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-sm text-[10px] uppercase tracking-wider transition-all ${type===t.id?'bg-sepia/15 text-sepia/70 border border-sepia/20':'text-parchment/30 hover:text-parchment/50 border border-transparent'}`}>
                <span>{t.icon}</span>{t.label}
              </button>
            ))}
          </div>
        </div>
        {type==='story' && <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3"><h4 className="text-[10px] uppercase tracking-widest text-parchment/30">Chapters</h4><span className="text-[9px] text-parchment/20">{mockChapters.length} total</span></div>
          <ChapterList chapters={mockChapters} activeChapter={activeCh} onSelect={setActiveCh} onAdd={()=>setShowNew(true)}/>
          <AnimatePresence>{showNew && <motion.div initial={{opacity:0,y:-5}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-5}} className="mt-3 p-3 bg-ink-warm/60 border border-parchment/10 rounded-sm">
            <p className="text-[9px] uppercase tracking-widest text-parchment/30 mb-2">New Chapter</p>
            <input type="text" value={newTitle} onChange={e=>setNewTitle(e.target.value)} placeholder="Chapter title..." className="w-full bg-ink-warm/50 border border-parchment/10 rounded-sm px-2 py-1.5 text-xs text-parchment/60 placeholder:text-parchment/20 focus:outline-none focus:border-sepia/30 mb-2" autoFocus onKeyDown={e=>e.key==='Enter'&&setShowNew(false)&&setNewTitle('')}/>
            <div className="flex gap-2"><button onClick={()=>{setShowNew(false);setNewTitle('')}} className="flex-1 py-1.5 rounded-sm bg-sepia/15 border border-sepia/20 text-[9px] text-sepia/60 hover:bg-sepia/25 uppercase tracking-wider">Create</button><button onClick={()=>{setShowNew(false);setNewTitle('')}} className="px-3 py-1.5 rounded-sm text-[9px] text-parchment/30 hover:text-parchment/50">Cancel</button></div>
          </motion.div>}</AnimatePresence>
        </div>}
        {type==='standalone' && <div className="flex-1 px-4 py-4 space-y-4">
          <div><label className="text-[9px] uppercase tracking-widest text-parchment/30 block mb-1.5">Title</label><input type="text" placeholder="Entry title..." className="w-full bg-ink-warm/50 border border-parchment/10 rounded-sm px-2.5 py-1.5 text-xs text-parchment/60 placeholder:text-parchment/20 focus:outline-none focus:border-sepia/30"/></div>
          <div><label className="text-[9px] uppercase tracking-widest text-parchment/30 block mb-1.5">Tags</label><input type="text" placeholder="craft, reflection..." className="w-full bg-ink-warm/50 border border-parchment/10 rounded-sm px-2.5 py-1.5 text-xs text-parchment/60 placeholder:text-parchment/20 focus:outline-none focus:border-sepia/30"/></div>
          <div className="pt-4 border-t border-parchment/8"><p className="text-[9px] text-parchment/20 italic">A standalone entry is a one-shot — a vignette, a fragment that stands alone.</p></div>
        </div>}
      </div>
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-parchment/10 bg-inkwell/20">
          <div className="flex items-center gap-2">
            {type==='story'&&ch&&<><span className="text-xs font-serif text-parchment/70">{ch.title}</span><span className={`text-[8px] px-1.5 py-0.5 rounded-sm border uppercase tracking-wider ${ch.status==='published'?'border-emerald-500/30 text-emerald-500/60':ch.status==='draft'?'border-sepia/30 text-sepia/60':'border-parchment/10 text-parchment/30'}`}>{ch.status}</span></>}
            {type==='standalone'&&<span className="text-xs text-parchment/40 italic">Untitled Entry</span>}
          </div>
          <div className="flex items-center gap-2">
            <button className="px-2 py-1 rounded-sm text-[9px] uppercase tracking-wider text-parchment/30 hover:text-parchment/60 hover:bg-ink-warm/40">Save</button>
            <button onClick={()=>setShowDict(!showDict)} className={`px-2 py-1 rounded-sm text-[9px] uppercase tracking-wider flex items-center gap-1 ${showDict?'bg-sepia/15 text-sepia/60':'text-parchment/30 hover:text-parchment/60 hover:bg-ink-warm/40'}`}><span>📖</span> Dict</button>
          </div>
        </div>
        <div className="flex-1 flex">
          <textarea value={content} onChange={e=>setContent(e.target.value)} className="flex-1 bg-transparent p-6 text-sm text-parchment/70 leading-relaxed resize-none focus:outline-none font-light" placeholder="Begin your fragment..." style={{fontFamily:"'Source Serif 4',serif"}}/>
          <DictPanel isOpen={showDict} onClose={()=>setShowDict(false)}/>
        </div>
        <div className="flex items-center justify-between px-4 py-2 border-t border-parchment/10 bg-inkwell/20">
          <div className="flex items-center gap-3 text-[9px] text-parchment/20">
            <span>{content.split(/\s+/).filter(Boolean).length} words</span><span className="w-px h-3 bg-parchment/10"/><span>{content.length} chars</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[8px] text-parchment/15 uppercase tracking-widest">Save to</span>
            <select className="bg-ink-warm/40 border border-parchment/10 rounded-sm px-1.5 py-0.5 text-[9px] text-parchment/40 focus:outline-none focus:border-sepia/30 appearance-none cursor-pointer"><option>Drafts</option><option>Published</option><option>Private</option></select>
          </div>
        </div>
      </div>
    </div>
  );
}
