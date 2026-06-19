import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

// --- Moderation Actions (used on feed posts) ---

export function ModerationActions({ postId, onAction }) {
  const [activeAction, setActiveAction] = useState(null);
  const [flagReason, setFlagReason] = useState('');
  const [confirmation, setConfirmation] = useState(null);

  const handleAction = (action) => {
    if (action === 'flag' && !flagReason) {
      setActiveAction(activeAction === 'flag' ? null : 'flag');
      return;
    }
    setConfirmation(action);
    if (onAction) onAction(action, postId, flagReason);
    setTimeout(() => setConfirmation(null), 2500);
  };

  return (
    <div className="flex items-center gap-1">
      {/* Hide */}
      <button
        onClick={() => handleAction('hide')}
        className="group relative flex items-center gap-1 px-2 py-1 rounded-sm text-[9px] uppercase tracking-wider
                   text-parchment/20 hover:text-parchment/50 hover:bg-ink-warm/40 transition-all duration-200"
        title="Hide this post from your feed"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M1 6s2-4 5-4 5 4 5 4-2 4-5 4-5-4-5-4z" />
          <circle cx="6" cy="6" r="1.5" />
        </svg>
        <span className="hidden sm:inline">Hide</span>

        {/* Tooltip */}
        <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-ink-warm border border-parchment/10 rounded-sm text-[8px] text-parchment/40 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Hide from my feed
        </span>
      </button>

      {/* Archive */}
      <button
        onClick={() => handleAction('archive')}
        className="group relative flex items-center gap-1 px-2 py-1 rounded-sm text-[9px] uppercase tracking-wider
                   text-parchment/20 hover:text-parchment/50 hover:bg-ink-warm/40 transition-all duration-200"
        title="Move this post to your private archive"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M1 3h10l-1 8H2L1 3z" />
          <path d="M1 3V1h10v2" />
        </svg>
        <span className="hidden sm:inline">Archive</span>

        <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-ink-warm border border-parchment/10 rounded-sm text-[8px] text-parchment/40 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Move to private archive
        </span>
      </button>

      {/* Flag */}
      <button
        onClick={() => handleAction(flagReason ? 'flag' : 'flag')}
        className="group relative flex items-center gap-1 px-2 py-1 rounded-sm text-[9px] uppercase tracking-wider
                   text-parchment/20 hover:text-blood/50 hover:bg-blood/10 transition-all duration-200"
        title="Report this post"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M2 1v10" />
          <path d="M2 1h6l-1 3 1 3H2" />
        </svg>
        <span className="hidden sm:inline">Flag</span>

        <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-ink-warm border border-parchment/10 rounded-sm text-[8px] text-parchment/40 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Report violation
        </span>
      </button>

      {/* Flag reason input */}
      {activeAction === 'flag' && (
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 'auto' }}
          className="flex items-center gap-1"
        >
          <input
            type="text"
            value={flagReason}
            onChange={(e) => setFlagReason(e.target.value)}
            placeholder="Reason..."
            className="w-24 bg-ink-warm/60 border border-parchment/10 rounded-sm px-1.5 py-0.5 text-[9px] text-parchment/50 placeholder:text-parchment/20 focus:outline-none focus:border-blood/30"
            autoFocus
          />
          <button
            onClick={() => { handleAction('flag'); setFlagReason(''); }}
            className="px-1.5 py-0.5 rounded-sm text-[8px] uppercase tracking-wider bg-blood/20 text-blood/60 hover:bg-blood/30 transition-colors"
          >
            Send
          </button>
        </motion.div>
      )}

      {/* Confirmation toast */}
      <AnimatePresence>
        {confirmation && (
          <motion.span
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`text-[8px] uppercase tracking-wider ml-1 ${
              confirmation === 'flag' ? 'text-blood/60' : 'text-emerald-500/60'
            }`}
          >
            {confirmation === 'hide' && 'Hidden'}
            {confirmation === 'archive' && 'Archived'}
            {confirmation === 'flag' && 'Reported to The Librarian'}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Librarian Chat Widget ---

const mockMessages = [
  { from: 'librarian', text: 'Welcome to the Inkblot Parlour. I am The Librarian. How may I assist you with your craft today?', time: 'Just now' },
];

const quickQuestions = [
  'How do I reset my password?',
  'I lost a fragment — can you help?',
  'How do Writer Circles work?',
  'Tell me about the Architect tier',
];

export default function LibrarianChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(mockMessages);
  const [input, setInput] = useState('');
  const [showQuick, setShowQuick] = useState(true);

  const handleSend = (text) => {
    const msg = text || input;
    if (!msg.trim()) return;

    setMessages((prev) => [...prev, { from: 'user', text: msg, time: 'Just now' }]);
    setInput('');

    // Simulate librarian reply
    setTimeout(() => {
      const replies = {
        'How do I reset my password?': 'Visit your Sanctuary settings. Under "Account," you will find the key to reset your credentials. If the path is unclear, write to me directly.',
        'I lost a fragment — can you help?': 'Fragments are stored in your private journal. If it was published to the Feed, it remains there. If it has vanished, describe it to me and I shall search the archives.',
        'How do Writer Circles work?': 'Circles are private lounges within the Parlour. Architects may enter. Collectives may build them. Each circle has its own covenant, seal, and keepers.',
        'Tell me about the Architect tier': 'The Architect tier unlocks unlimited Storyworlds, Tension Mapping, the Secret Web, Timeline Orchestration, and access to all Writer Circles. It is $10 per moon.',
      };
      const reply = replies[msg] || 'I have noted your query and shall look into it. The archives are vast, but I will find what you need.';
      setMessages((prev) => [...prev, { from: 'librarian', text: reply, time: 'Just now' }]);
      setShowQuick(false);
    }, 1200);
  };

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full border border-parchment/15
                   bg-gradient-to-br from-ink-warm to-ink-light shadow-lg shadow-black/30
                   hover:border-sepia/30 hover:shadow-sepia/10 transition-all duration-300
                   flex items-center justify-center group"
        title="Contact The Librarian"
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-parchment/60 group-hover:text-parchment/80 transition-colors">
          <path d="M4 4h14a2 2 0 012 2v8a2 2 0 01-2 2H8l-4 3V6a2 2 0 012-2z" />
        </svg>
      </button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[90vw] h-[520px] max-h-[80vh]
                       card-paper rounded-sm border border-parchment/15 shadow-2xl shadow-black/40
                       flex flex-col overflow-hidden"
            style={{ background: '#1a1315' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-parchment/10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sepia/30 to-inkwell border border-parchment/10 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#e8ddd0" strokeWidth="1.2">
                    <path d="M2 2h12v10H4L2 14V2z" />
                    <path d="M5 6h6M5 9h4" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-serif text-parchment/80">The Librarian</div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
                    <span className="text-[9px] text-parchment/30">Online — replies within minutes</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-parchment/20 hover:text-parchment/60 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <path d="M4 4l8 8M12 4l-8 8" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] rounded-sm px-4 py-2.5 ${
                      msg.from === 'user'
                        ? 'bg-sepia/15 border border-sepia/20'
                        : 'bg-ink-warm/60 border border-parchment/10'
                    }`}
                  >
                    {msg.from === 'librarian' && (
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="w-1 h-1 rounded-full bg-sepia/50" />
                        <span className="text-[8px] uppercase tracking-wider text-sepia/50">The Librarian</span>
                      </div>
                    )}
                    <p className="text-xs text-parchment/70 leading-relaxed">{msg.text}</p>
                    <p className="text-[8px] text-parchment/20 mt-1 text-right">{msg.time}</p>
                  </div>
                </div>
              ))}

              {/* Quick questions */}
              {showQuick && messages.length <= 1 && (
                <div className="pt-2 space-y-2">
                  <p className="text-[9px] text-parchment/30 italic text-center">Ask me something...</p>
                  {quickQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSend(q)}
                      className="w-full text-left px-3 py-2 rounded-sm border border-parchment/8 bg-ink-warm/30
                                 text-[10px] text-parchment/50 hover:text-parchment/70 hover:border-sepia/20
                                 hover:bg-sepia/5 transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <div className="px-5 py-4 border-t border-parchment/10 shrink-0">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Write to The Librarian..."
                  className="flex-1 bg-ink-warm/50 border border-parchment/10 rounded-sm px-3 py-2 text-xs text-parchment/60 placeholder:text-parchment/20 focus:outline-none focus:border-sepia/30 transition-colors"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim()}
                  className="px-3 py-2 rounded-sm bg-sepia/20 border border-sepia/20 text-parchment/60 hover:bg-sepia/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M1 7h12M7 1l6 6-6 6" />
                  </svg>
                </button>
              </div>
              <p className="text-[7px] text-parchment/15 text-center mt-2 uppercase tracking-widest">
                Messages are sent to The Administrative Archives
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}