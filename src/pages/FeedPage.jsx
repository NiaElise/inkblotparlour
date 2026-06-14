import Navbar from '../components/Navbar';
import SocialFeed from '../components/SocialFeed';
import Footer from '../components/Footer';

export default function FeedPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <SocialFeed />
      </main>
      <Footer />
    </>
  );
}
