import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const mockUser = {
  name: 'Elias Thorne', handle: '@eliaswrites', tier: 'Architect', avatar: 'ET',
  bio: 'Cartographer of the Forgotten City. Building worlds one fragment at a time.',
  joined: 'Joined Winter 2024', location: 'The Forgotten City',
  links: ['https://eliasthorne.ink', 'twitter.com/eliaswrites'],
  stats: { worlds: 3, fragments: 47, echoes: 892 },
  storyworlds: [
    { name: 'The Forgotten City', icon: '\u2B17', frags: 23, status: 'Active' },
    { name: 'The Bloodline Pact', icon: '\u25C9', frags: 14, status: 'Active' },
    { name: 'Echoes of Ash', icon: '\u2726', frags: 10, status: 'Draft' },
  ],
  asks: [
    { from: '@inkweaver', q: 'How do you keep tension alive when protagonist and antagonist have not met?', a: 'Absence creates its own tension.', time: '3h ago', echoes: 24 },
    { from: '@novicebuilder', q: 'Tips for a natural magic system?', a: 'Start with the cost, not the power.', time: '7h ago', echoes: 18 },
    { from: '@lorekeeper', q: 'Three suns in lore but two in Ch 4?', a: 'The third sun set when the pact broke.', time: '1d ago', echoes: 31 },
  ],
  journals: [
    { title: 'On the Architecture of Suspense', preview: 'Suspense is the precise arrangement of information, not its absence.', date: '12 Mar 2025', words: 1200 },
    { title: 'Letters from the Weaving Room', preview: 'Today I mapped the thread-count between Act I and Act III.', date: '10 Mar 2025', words: 2100 },
  ],
};

function AskModal({ isOpen, onClose, userName }) {
  const [askText, setAskText] = useState(''); const [sent, setSent] = useState(false);
  const handleSend = () => { if (!askText.trim()) return; setSent(true); setTimeout(() => { setSent(false); setAskText(''); onClose(); }, 2000); };
  return (<AnimatePresence>{isOpen && <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
    <motion.div initial={{opacity:0,scale:0.95,y:10}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.95,y:10}} className="card-paper rounded-sm border border-parchment/10 w-full max-w-md mx-4" onClick={e=>e.stopPropagation()}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-parchment/10">
        <h2 className="text-sm font-serif text-parchment/80">Ask {userName}</h2>
        <button onClick={onClose} className="text-parchment/20 hover:text-parchment/60"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M4 4l6 6M10 4l-6 6"/></svg></button>
      </div>
      {sent ? <div className="px-6 py-12 text-center"><p className="text-2xl text-emerald-500/60 mb-3">\u2709</p><p className="text-sm text-parchment/60">Your ask has been sent.</p><p className="text-xs text-parchment/30 mt-1 italic">If answered, it will appear in their feed.</p></div>
      : <div className="px-6 py-5">
        <p className="text-[10px] uppercase tracking-widest text-parchment/30 mb-3">Your Question</p>
        <textarea value={askText} onChange={e=>setAskText(e.target.value)} placeholder={'Ask ${userName} about their worlds...'} className="w-full bg-ink-warm/50 border border-parchment/10 rounded-sm px-3 py-2.5 text-xs text-parchment/60 placeholder:text-parchment/20 resize-none h-28 focus:outline-none focus:border-sepia/30"/>
        <div className="flex items-center justify-between mt-4">
          <span className="text-[9px] text-parchment/20">{askText.length}/500</span>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-sm text-[10px] text-parchment/30 hover:text-parchment/60 uppercase tracking-wider">Cancel</button>
            <button onClick={handleSend} disabled={!askText.trim()} className="px-5 py-2 rounded-sm bg-sepia/15 border border-sepia/20 text-[10px] text-sepia/60 hover:bg-sepia/25 disabled:opacity-30 disabled:cursor-not-allowed uppercase tracking-wider">Send Ask</button>
          </div>
        </div>
      </div>}
    </motion.div>
  </motion.div>}</AnimatePresence>);
}

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState('asks');
  const [showAsk, setShowAsk] = useState(false);
  const u = mockUser;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="relative h-48 md:h-56 rounded-sm overflow-hidden border border-parchment/10 bg-gradient-to-br from-ink-warm via-inkwell to-ink-light">
        <div className="absolute inset-0 bg-cover bg-center opacity-[0.04] mix-blend-overlay pointer-events-none" style={{backgroundImage:"url('/assets/paper-texture.webp')"}} />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-ink/80 to-transparent" />
      </div>
      <div className="relative px-6 -mt-16 mb-8 flex flex-col sm:flex-row items-start sm:items-end gap-4">
        <div className="w-24 h-24 rounded-full border-4 border-ink bg-gradient-to-br from-sepia/30 to-inkwell flex items-center justify-center text-2xl font-serif text-parchment/80 shadow-lg shrink-0">{u.avatar}</div>
        <div className="flex-1 min-w-0 pt-2 sm:pt-0 sm:pb-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl md:text-3xl font-serif text-parchment-light">{u.name}</h1>
            <span className="text-[9px] uppercase tracking-widest text-parchment/30 border border-parchment/10 px-2 py-0.5 rounded-sm">{u.tier}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-parchment/30 mt-1">
            <span>{u.handle}</span><span className="w-px h-3 bg-parchment/10" /><span>{u.joined}</span><span className="w-px h-3 bg-parchment/10" /><span>{u.location}</span>
          </div>
        </div>
        <button onClick={()=>setShowAsk(true)} className="btn-blood text-xs flex items-center gap-2 shrink-0">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h6a2 2 0 012 2v4a2 2 0 01-2 2H6l-3 2V6a2 2 0 012-2z"/></svg>Send an Ask
        </button>
      </div>
      <div className="grid md:grid-cols-3 gap-8 px-6">
        <div className="space-y-5">
          <div className="card-paper rounded-sm p-5"><h3 className="text-[10px] uppercase tracking-widest text-parchment/30 mb-2">About</h3><p className="text-sm text-parchment/60 leading-relaxed font-light">{u.bio}</p></div>
          <div className="card-paper rounded-sm p-5"><h3 className="text-[10px] uppercase tracking-widest text-parchment/30 mb-3">Links</h3>{u.links.map(l => <a key={l} href={l} target="_blank" rel="noopener noreferrer" className="block text-xs text-sepia/60 hover:text-sepia truncate underline underline-offset-2 mb-1">{l.replace('https://','')}</a>)}</div>
          <div className="card-paper rounded-sm p-5"><h3 className="text-[10px] uppercase tracking-widest text-parchment/30 mb-3">Archive</h3><div className="grid grid-cols-3 gap-3 text-center">{{[{label:'Worlds',val:u.stats.worlds},{label:'Fragments',val:u.stats.fragments},{label:'Echoes',val:u.stats.echoes}].map(s => (<div key={s.label}><div className="text-lg font-serif text-parchment/70">{s.val}</div><div className="text-[9px] text-parchment/30 uppercase tracking-wider">{s.label}</div></div>))}}</div></div>
          <div className="card-paper rounded-sm p-5"><h3 className="text-[10px] uppercase tracking-widest text-parchment/30 mb-3">Storyworlds</h3>{u.storyworlds.map(w => (<div key={w.name} className="flex items-center gap-3 p-2.5 bg-ink-warm/30 border border-parchment/5 rounded-sm hover:bg-ink-warm/50 transition-colors cursor-pointer mb-2"><span className="text-lg text-sepia/50">{w.icon}</span><div className="min-w-0 flex-1"><div className="text-xs text-parchment/70 truncate">{w.name}</div><div className="text-[9px] text-parchment/30">{w.frags} fragments</div></div><span className={'text-[8px] px-1.5 py-0.5 rounded-sm border uppercase tracking-wider ' + (w.status==='Active'?'border-emerald-500/30 text-emerald-500/60':'border-parchment/10 text-parchment/30')}>{w.status}</span></div>))}</div>
        </div>
        <div className="md:col-span-2">
          <div className="flex items-center border-b border-parchment/10 mb-6">
            {[{id:'asks',label:'Asks',icon:'?'},{id:'journals',label:'Journals',icon:'\u2726'}].map(t => (<button key={t.id} onClick={()=>setActiveTab(t.id)} className={'desk-tab flex items-center gap-1.5 ' + (activeTab===t.id?'active':'')}><span>{t.icon}</span>{t.label}</button>))}
            <div className="flex-1"/><span className="text-[9px] text-parchment/20">{activeTab==='asks'?u.asks.length:u.journals.length} entries</span>
          </div>
          {activeTab==='asks' && <div className="space-y-4">{u.asks.map((a,i) => (<motion.div key={i} initial={{opacity:0,y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="ask-bubble"><div className="flex items-start gap-3 mb-3"><span className="text-sepia/60 text-lg font-serif italic">Q:</span><div><div className="flex items-center gap-2 text-xs text-parchment/40 mb-1"><span className="text-parchment/60">{a.from}</span><span> \u00B7 {a.time}</span></div><p className="text-sm text-parchment/70 italic">\u201C{a.q}\u201D</p></div></div><div className="flex items-start gap-3 pl-6 border-l border-sepia/20"><span className="text-sepia/60 text-lg font-serif italic">A:</span><p className="text-sm text-parchment/60">\u201C{a.a}\u201D</p></div><div className="mt-3 flex items-center gap-3 text-[10px] text-parchment/30"><button className="hover:text-sepia/60">\u2661 Echo</button><button className="hover:text-sepia/60">\u21BA Re-ask</button><span className="flex-1"/><span>{a.echoes} echoes</span></div></motion.div>))}</div>}
          {activeTab==='journals' && <div className="space-y-5">{u.journals.map((j,i) => (<motion.div key={i} initial={{opacity:0,y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="journal-entry group cursor-pointer"><div className="flex items-center gap-2 text-xs text-parchment/30 mb-2"><span className="text-parchment/50">{j.date}</span><span className="text-parchment/20">\u00B7</span><span className="text-parchment/30">{j.words} words</span></div><h4 className="text-base font-serif text-parchment/80 mb-2 group-hover:text-parchment transition-colors">{j.title}</h4><p className="text-sm text-parchment/50 leading-relaxed font-light">\u201C{j.preview}\u201D</p><div className="mt-3"><span className="text-xs text-parchment/20 group-hover:text-parchment/40 transition-colors">Read full entry \u2192</span></div></motion.div>))}</div>}
          <div className="mt-8 text-center"><div className="old-paper inline-block rounded-sm px-5 py-3 border border-parchment/8"><p className="text-[10px] text-parchment/30 italic"><span className="text-parchment/50 not-italic">{u.name}</span> has answered {u.asks.length} asks and written {u.journals.length} public journal entries.</p></div></div>
        </div>
      </div>
      <AskModal isOpen={showAsk} onClose={()=>setShowAsk(false)} userName={u.name} />
    </div>
  );
}
