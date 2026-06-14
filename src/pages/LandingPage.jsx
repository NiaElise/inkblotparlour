import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Problem from '../components/Problem';
import WhoItsFor from '../components/WhoItsFor';
import SecretSocieties from '../components/SecretSocieties';
import AestheticCustomization from '../components/AestheticCustomization';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <WhoItsFor />
        <SecretSocieties />
        <AestheticCustomization />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
