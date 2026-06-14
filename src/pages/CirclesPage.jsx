import Navbar from '../components/Navbar';
import WriterCircles from '../components/WriterCircles';
import Footer from '../components/Footer';

export default function CirclesPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <WriterCircles />
      </main>
      <Footer />
    </>
  );
}
