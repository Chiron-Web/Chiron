import Header from '../components/header';
import Footer from '../components/footer';
import About from '../components/about';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-100 to-white">
      <Header />
      <About />
      <Footer />
    </div>
  );
}
