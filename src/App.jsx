import { Routes, Route } from 'react-router-dom';
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
import SanctuaryLayout from './components/sanctuary/SanctuaryLayout';
import SanctuaryDashboard from './components/sanctuary/SanctuaryDashboard';
import SanctuaryStudio from './components/sanctuary/SanctuaryStudio';
import SanctuaryCabinet from './components/sanctuary/SanctuaryCabinet';
import PrivacyPolicy from './components/legal/PrivacyPolicy';
import TermsOfService from './components/legal/TermsOfService';

function LandingPage() {
  return (
    <>
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
    </>
  );
}

export default function App() {
  return (
    <div className="min-h-screen selection:bg-sepia/30 selection:text-parchment-light">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/sanctuary" element={<SanctuaryLayout />}>
          <Route index element={<SanctuaryDashboard />} />
          <Route path="studio/:worldId" element={<SanctuaryStudio />} />
          <Route path="cabinet" element={<SanctuaryCabinet />} />
          <Route path="cabinet/:characterId" element={<SanctuaryCabinet />} />
        </Route>
      </Routes>
    </div>
  );
}