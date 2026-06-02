import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SocialFeed from './components/SocialFeed';
import WriterCircles from './components/WriterCircles';
import Problem from './components/Problem';
import Features from './components/Features';
import WhoItsFor from './components/WhoItsFor';
import SecretSocieties from './components/SecretSocieties';
import AestheticCustomization from './components/AestheticCustomization';
import Pricing from './components/Pricing';
import CTA from './components/CTA';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen selection:bg-sepia/30 selection:text-parchment-light">
      <Navbar />
      <Hero />
      <SocialFeed />
      <WriterCircles />
      <Problem />
      <Features />
      <WhoItsFor />
      <SecretSocieties />
      <AestheticCustomization />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
}