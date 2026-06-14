import Navbar from '../components/Navbar';
import Features from '../components/Features';
import Footer from '../components/Footer';

export default function MethodPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <Features />
      </main>
      <Footer />
    </>
  );
}
