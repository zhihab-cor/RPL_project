import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import SearchSection from '@/components/SearchSection';
import FeaturesGrid from '@/components/FeaturesGrid';
import WhyCheckup from '@/components/WhyCheckup';
import MedicalStaff from '@/components/MedicalStaff';
import HealthArticles from '@/components/HealthArticles';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-white font-sans">
      <Navbar />
      <div className="bg-blue-50/50">
        <Hero />
      </div>
      <SearchSection />
      <FeaturesGrid />
      <WhyCheckup />
      <MedicalStaff />
      <HealthArticles />
      <ContactSection />
      <Footer />
    </main>
  );
}
