import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Problem from '../components/Problem';
import WhoItsFor from '../components/WhoItsFor';
import SecretSocieties from '../components/SecretSocieties';
import AestheticCustomization from '../components/AestheticCustomization';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import LoreTemplateLibrary from '../components/lore/LoreTemplateLibrary';
import LibrarianChat from '../components/moderation/ModerationUI';

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <WhoItsFor />
        <SecretSocieties />
        <LoreTemplateLibrary />
        <AestheticCustomization />
        <CTA />
      </main>
      <Footer />
      <LibrarianChat />
    </>
  );
}
