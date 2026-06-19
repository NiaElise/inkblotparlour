import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const sections = [
  {
    title: 'I. Ownership',
    content: 'You own your stories. Every character profile, every lore entry, every journal entry, every fragment — belongs to you. Inkblot Parlour Studio provides the tools; you provide the soul. We claim no ownership over your fiction, your worlds, or your intellectual property. You grant us a limited license to display your content within the Parlour so that other members of your Social Loop can interact with it. This license ends when you delete your content or your account.',
  },
  {
    title: 'II. Conduct',
    content: 'This is a sanctuary. Harassment, intimidation, or violation of circle privacy will result in removal from the Parlour. Every writer within these walls deserves the space to build without fear. We operate on a one-warning policy: if you violate the covenant, you will receive a letter outlining the breach. A second violation results in permanent removal. In cases of clear harm or illegal activity, removal occurs without notice.',
  },
  {
    title: 'III. Tier Usage',
    content: 'Usage limits for each tier are strictly enforced. The Draftsman (Free) tier includes one Storyworld with limited character and lore slots. The Architect ($15/mo) tier unlocks unlimited Storyworlds and advanced tools: Tension Mapping, Secret Web, and Timeline Orchestration. The Collective ($30/mo) tier adds collaborative worldbuilding, aesthetic customization, and priority placement. Downgrading your tier may restrict access to content created under higher tiers; we recommend exporting your data before changing tiers.',
  },
  {
    title: 'IV. Service & Liability',
    content: 'We aim for 99% uptime, but even the best ink sometimes dries. We are not liable for lost fragments, interrupted writing sessions, or the occasional digital hiccup. We recommend keeping your own backups — export your storyworlds regularly. The Parlour is a sanctuary, but it is not a fortress against the unpredictability of the digital world.',
  },
  {
    title: 'V. Social Loops & Circles',
    content: `The Parlour is organized into Social Loops corresponding to your tier. Your loop determines which circles you may join, which conversations you can see, and which features are available to you. Writer Circles are private communities within the Parlour. Architects may join Architect-tier and unlisted circles. Collective members may create, join, and manage circles. Each circle has Keepers who set the rules, admit members, and may remove members who violate the circle's covenant.`,
  },
  {
    title: 'VI. Acceptable Use',
    content: 'The Parlour is a space for fiction, worldbuilding, and literary craft. You agree not to: use the Parlour for illegal purposes; post content that is not your own without attribution; harass, threaten, or intimidate other members; exploit the platform for commercial gain without authorization; attempt to access content outside your Social Loop; or undermine the stability or security of the Parlour.',
  },
  {
    title: 'VII. Billing & Cancellation',
    content: 'Architect and Collective tiers are billed monthly. You may cancel at any time; your access will continue through the end of your billing period. After cancellation, your tier will revert to Draftsman (Free). Your data will not be deleted upon cancellation — only your access to higher-tier features will change. To delete your account entirely, contact support.',
  },
  {
    title: 'VIII. Termination',
    content: 'We reserve the right to terminate accounts that violate the spirit or letter of this covenant. Before termination, we will issue one warning — a letter to your inbox — outlining the violation and giving you seven days to respond. Only in cases of clear harm or illegal activity will termination occur without notice.',
  },
  {
    title: 'IX. Revisions',
    content: 'This covenant may be revised as the Parlour grows. You will receive notice of any material changes no fewer than thirty days before they take effect. Continued use of the Parlour after a revision constitutes acceptance of the updated terms.',
  },
  {
    title: 'X. Contact',
    content: 'The Keeper of the Covenant can be reached at covenant@inkblotparlour.com. For billing inquiries: ledger@inkblotparlour.com. For everything else: write to the Parlour and we will find the right reader.',
  },
];

export default function TermsOfService() {
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
            <span className="text-ornament">THE COVENANT</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-parchment-light mb-4">
            Terms of <span className="italic text-sepia/70">Service</span>
          </h1>
          <p className="text-parchment/40 font-light max-w-xl leading-relaxed">
            The covenant between the Parlour and those who write within it. By entering, 
            you agree to uphold the sanctuary.
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
              "Every story is an argument with silence." The Parlour is a space where stories 
              are argued, built, shared, and protected. These terms exist to protect the space, 
              not to constrain the craft.
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
              This covenant is written in plain language because legal jargon has no place in a sanctuary. 
              If something is unclear, write to covenant@inkblotparlour.com and we will explain.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}