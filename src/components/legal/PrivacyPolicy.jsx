import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const sections = [
  {
    title: 'I. Data Collection',
    content: 'When you enter the Parlour, we collect only what is necessary to maintain the sanctuary: your storyworld data (characters, lore, timelines, and the threads between them), fragments you publish to the social feed, your account information (your name or pen name, and your email address — the inkwell through which we reach you), and asks you send and receive. We do not track your gaze. We do not follow you into other rooms of the internet.',
  },
  {
    title: 'II. Privacy by Default',
    content: 'Your Storyworlds are private by default. Only you can see them. The architecture of your fiction — the tension maps, secret webs, timelines, and character cabinets — exists in your Sanctuary alone. Nothing is shared unless you choose to share it. Your half-built world will not be harvested.',
  },
  {
    title: 'III. Social Feed Visibility',
    content: 'Anything published to "The Feed," "Asks," or "Journals" is public within the Inkblot ecosystem. Your Social Loop determines who can interact with your content. Draftsmen see the Drafting Loop. Architects and Collective members see the wider circles. Choose your audience wisely — the Parlour respects your intent.',
  },
  {
    title: 'IV. AI Ethics',
    content: 'We respect fiction architects. We do NOT sell your lore to AI training sets. We do not train models on your fiction. We do not share your worlds, your characters, or your fragments with any third party for the purpose of machine learning. Your unfinished novel is safe here. Your voice remains yours.',
  },
  {
    title: 'V. Age Limit',
    content: 'The Parlour is for those 13 years of age and older. We do not knowingly collect data from individuals under 13. If we discover that a user under 13 has created an account, we will delete that account and all associated data within thirty days. If you are a parent or guardian who believes we may have collected data from a child under 13, please contact us immediately.',
  },
  {
    title: 'VI. How We Use Your Data',
    content: 'Your data exists to serve your craft. We use your information to keep the Parlour running, notify you of circles that may matter to you, and occasionally send a letter (never more than once a week) about the state of the sanctuary. We do not sell your data. The Parlour is funded by your subscriptions — not by your attention.',
  },
  {
    title: 'VII. Your Rights',
    content: 'You may request a copy of all data we hold about you at any time. You may delete your account and all associated data — your worlds, characters, fragments, and connections — with a single request. We will fulfill deletions within thirty days. You may export your storyworlds as JSON or Markdown at any time, without restriction.',
  },
  {
    title: 'VIII. Changes to This Policy',
    content: 'If the way we handle your data changes, we will inform you by letter (email) no fewer than thirty days before the change takes effect. You will always have the opportunity to export your data and leave before any change binds you.',
  },
  {
    title: 'IX. Contact',
    content: 'The Keeper of Data at Inkblot Parlour Studio can be reached at privacy@inkblotparlour.com. Replies are slow — we are usually writing — but every message is read.',
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#0c090a]">
      {/* Header */}
      <div className="relative border-b border-parchment/8">
        <div className="absolute inset-0 bg-cover bg-center opacity-[0.02] mix-blend-overlay pointer-events-none"
             style={{ backgroundImage: "url('/assets/paper-texture.webp')" }} />
        <div className="relative max-w-3xl mx-auto px-6 py-16 md:py-24">
          <Link to="/" className="flex items-center gap-2 text-[10px] text-parchment/30 hover:text-parchment/60 transition-colors mb-6 uppercase tracking-widest">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M7 2L3 6l4 4" />
            </svg>
            Back to the Parlour
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-sepia/40" />
            <span className="text-ornament">THE SMALL PRINT</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-parchment-light mb-4">
            Privacy <span className="italic text-sepia/70">Pact</span>
          </h1>
          <p className="text-parchment/40 font-light max-w-xl leading-relaxed">
            What we know, what we keep, and what we will never do. The Parlour is a sanctuary — 
            your words are yours.
          </p>
          <p className="text-xs text-parchment/20 mt-4">Last revised: March 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
          {/* Preamble */}
          <div className="old-paper rounded-sm border border-parchment/10 p-6 mb-10">
            <p className="text-sm text-parchment/60 italic leading-relaxed">
              "The ink remembers what the author forgets." — but the Parlour remembers only what you 
              choose to write within its walls. This pact exists to make that promise explicit.
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-8">
            {sections.map((section, i) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="border-l-2 border-sepia/20 pl-5"
              >
                <h2 className="text-base font-serif text-parchment/80 mb-3">{section.title}</h2>
                <p className="text-sm text-parchment/50 leading-relaxed font-light">
                  {section.content}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Footer note */}
          <div className="mt-12 pt-8 border-t border-parchment/8 text-center">
            <p className="text-xs text-parchment/30 italic max-w-lg mx-auto">
              This pact is written in good faith. If you have questions, write to 
              privacy@inkblotparlour.com. We answer every letter.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}