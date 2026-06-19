import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { fetchUser, fetchUserStoryworlds, fetchUserPosts, createAsk } from '../api';

function AskModal({ isOpen, onClose, userName, userId }) {
  const [askText, setAskText] = useState(''); const [sent, setSent] = useState(false);
  const handleSend = async () => { 
    if (!askText.trim()) return; 
    try {
      await createAsk(userId, askText);
      setSent(true); 
      setTimeout(() => { setSent(false); setAskText(''); onClose(); }, 2000); 
    } catch (err) {
      alert(err.message);
    }
  };
  return (<AnimatePresence>{isOpen && <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
    <motion.div initial={{opacity:0,scale:0.95,y:10}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.95,y:10}} className="card-paper rounded-sm border border-parchment/10 w-full max-w-md mx-4" onClick={e=>e.stopPropagation()}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-parchment/10">
        <h2 className="text-sm font-serif text-parchment/80">Ask {userName}</h2>
        <button onClick={onClose} className="text-parchment/20 hover:text-parchment/60"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M4 4l6 6M10 4l-6 6"/></svg></button>
      </div>
      {sent ? <div className="px-6 py-12 text-center"><p className="text-2xl text-emerald-500/60 mb-3">✉</p><p className="text-sm text-parchment/60">Your ask has been sent.</p><p className="text-xs text-parchment/30 mt-1 italic">If answered, it will appear in their feed.</p></div>
      : <div className="px-6 py-5">
        <p className="text-[10px] uppercase tracking-widest text-parchment/30 mb-3">Your Question</p>
        <textarea value={askText} onChange={e=>setAskText(e.target.value)} placeholder={`Ask ${userName} about their worlds...`} className="w-full bg-ink-warm/50 border border-parchment/10 rounded-sm px-3 py-2.5 text-xs text-parchment/60 placeholder:text-parchment/20 resize-none h-28 focus:outline-none focus:border-sepia/30"/>
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
  const { userId } = useParams();
  const [activeTab, setActiveTab] = useState('asks');
  const [showAsk, setShowAsk] = useState(false);
  const [user, setUser] = useState(null);
  const [storyworlds, setStoryworlds] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      if (!userId) return;
      setLoading(true);
      try {
        const [userData, worldsData, postsData] = await Promise.all([
          fetchUser(userId),
          fetchUserStoryworlds(userId),
          fetchUserPosts(userId)
        ]);
        setUser(userData);
        setStoryworlds(worldsData);
        setPosts(postsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [userId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-parchment/30 italic">Consulting the archives...</div>;
  if (!user) return <div className="min-h-screen flex items-center justify-center text-parchment/30 italic">User not found.</div>;

  const u = {
    ...user,
    avatar: user.username?.substring(0, 2).toUpperCase() || '??',
    bio: user.bio || 'A silent observer in the Parlour.',
    joined: `Joined ${new Date(user.created_at).toLocaleDateString()}`,
    location: user.location || 'The Void',
    links: [],
    stats: { worlds: storyworlds.length, fragments: posts.length, echoes: 0 },
  };

  const asks = posts.filter(p => p.format === 'ask').map(p => ({
    from: '@anonymous',
    q: p.content.split('\n\nAnswer: ')[0],
    a: p.content.split('\n\nAnswer: ')[1],
    time: new Date(p.created_at).toLocaleDateString(),
    echoes: 0
  }));

  const journals = posts.filter(p => p.format === 'fragment').map(p => ({
    title: 'Journal Entry',
    preview: p.content.substring(0, 100) + '...',
    date: new Date(p.created_at).toLocaleDateString(),
    words: p.content.split(/\s+/).length
  }));

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
            <h1 className="text-2xl md:text-3xl font-serif text-parchment-light">{u.username}</h1>
            <span className="text-[9px] uppercase tracking-widest text-parchment/30 border border-parchment/10 px-2 py-0.5 rounded-sm">{u.tier}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-parchment/30 mt-1">
            <span>@{u.username}</span><span className="w-px h-3 bg-parchment/10" /><span>{u.joined}</span><span className="w-px h-3 bg-parchment/10" /><span>{u.location}</span>
          </div>
        </div>
        <button onClick={()=>setShowAsk(true)} className="btn-blood text-xs flex items-center gap-2 shrink-0">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h6a2 2 0 012 2v4a2 2 0 01-2 2H6l-3 2V6a2 2 0 012-2z"/></svg>Send an Ask
        </button>
      </div>
      <div className="grid md:grid-cols-3 gap-8 px-6">
        <div className="space-y-5">
          <div className="card-paper rounded-sm p-5"><h3 className="text-[10px] uppercase tracking-widest text-parchment/30 mb-2">About</h3><p className="text-sm text-parchment/60 leading-relaxed font-light">{u.bio}</p></div>
          <div className="card-paper rounded-sm p-5"><h3 className="text-[10px] uppercase tracking-widest text-parchment/30 mb-3">Archive</h3><div className="grid grid-cols-3 gap-3 text-center">
            {[{label:'Worlds',val:u.stats.worlds},{label:'Fragments',val:u.stats.fragments},{label:'Echoes',val:u.stats.echoes}].map(s => (<div key={s.label}><div className="text-lg font-serif text-parchment/70">{s.val}</div><div className="text-[9px] text-parchment/30 uppercase tracking-wider">{s.label}</div></div>))}
          </div></div>
          <div className="card-paper rounded-sm p-5"><h3 className="text-[10px] uppercase tracking-widest text-parchment/30 mb-3">Storyworlds</h3>{storyworlds.map(w => (<div key={w.id} className="flex items-center gap-3 p-2.5 bg-ink-warm/30 border border-parchment/5 rounded-sm hover:bg-ink-warm/50 transition-colors cursor-pointer mb-2"><span className="text-lg text-sepia/50">⬟</span><div className="min-w-0 flex-1"><div className="text-xs text-parchment/70 truncate">{w.title}</div><div className="text-[9px] text-parchment/30">{w.description}</div></div></div>))}</div>
        </div>
        <div className="md:col-span-2">
          <div className="flex items-center border-b border-parchment/10 mb-6">
            {[{id:'asks',label:'Asks',icon:'?'},{id:'journals',label:'Journals',icon:'✦'}].map(t => (<button key={t.id} onClick={()=>setActiveTab(t.id)} className={'desk-tab flex items-center gap-1.5 ' + (activeTab===t.id?'active':'')}><span>{t.icon}</span>{t.label}</button>))}
            <div className="flex-1"/><span className="text-[9px] text-parchment/20">{activeTab==='asks'?asks.length:journals.length} entries</span>
          </div>
          {activeTab==='asks' && <div className="space-y-4">{asks.map((a,i) => (<motion.div key={i} initial={{opacity:0,y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="ask-bubble"><div className="flex items-start gap-3 mb-3"><span className="text-sepia/60 text-lg font-serif italic">Q:</span><div><div className="flex items-center gap-2 text-xs text-parchment/40 mb-1"><span className="text-parchment/60">{a.from}</span><span> · {a.time}</span></div><p className="text-sm text-parchment/70 italic">“{a.q}”</p></div></div><div className="flex items-start gap-3 pl-6 border-l border-sepia/20"><span className="text-sepia/60 text-lg font-serif italic">A:</span><p className="text-sm text-parchment/60">“{a.a}”</p></div><div className="mt-3 flex items-center gap-3 text-[10px] text-parchment/30"><button className="hover:text-sepia/60">♡ Echo</button><button className="hover:text-sepia/60">↺ Re-ask</button><span className="flex-1"/><span>{a.echoes} echoes</span></div></motion.div>))}</div>}
          {activeTab==='journals' && <div className="space-y-5">{journals.map((j,i) => (<motion.div key={i} initial={{opacity:0,y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="journal-entry group cursor-pointer"><div className="flex items-center gap-2 text-xs text-parchment/30 mb-2"><span className="text-parchment/50">{j.date}</span><span className="text-parchment/20">·</span><span className="text-parchment/30">{j.words} words</span></div><h4 className="text-base font-serif text-parchment/80 mb-2 group-hover:text-parchment transition-colors">{j.title}</h4><p className="text-sm text-parchment/50 leading-relaxed font-light">“{j.preview}”</p><div className="mt-3"><span className="text-xs text-parchment/20 group-hover:text-parchment/40 transition-colors">Read full entry →</span></div></motion.div>))}</div>}
          <div className="mt-8 text-center"><div className="old-paper inline-block rounded-sm px-5 py-3 border border-parchment/8"><p className="text-[10px] text-parchment/30 italic"><span className="text-parchment/50 not-italic">{u.username}</span> has answered {asks.length} asks and written {journals.length} public journal entries.</p></div></div>
        </div>
      </div>
      <AskModal isOpen={showAsk} onClose={()=>setShowAsk(false)} userName={u.username} userId={userId} />
    </div>
  );
}
