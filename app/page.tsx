import HeroSection from '@/components/sections/hero-section';
import AboutSection from '@/components/sections/about-section';
import ProjectsSection from '@/components/sections/projects-section';
import BlogSection from '@/components/sections/blog-section';
import ContactSection from '@/components/sections/contact-section';
import Navbar from '@/components/navigation/navbar';
import Footer from '@/components/layout/footer';

export default function Home() {
  return (
    <main className="relative">
      <div className="noise-overlay" />
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <BlogSection />
      <ContactSection />
      <Footer />
    </main>
  );
}